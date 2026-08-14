import { prisma } from '../config/prisma';
import {
  CreatePlayerDTO,
  UpdatePlayerDTO,
  AddRatingDTO,
  PublicPlayerDTO,
  PlayerInternal,
  PlayerPosition,
} from '../types';

export class PlayerService {
  /**
   * Formata os dados públicos do jogador (SEM NOTAS NEM MÉDIAS para privacidade total).
   */
  private toPublicPlayer(player: any): PublicPlayerDTO {
    return {
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      position: player.position as PlayerPosition,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    };
  }

  /**
   * Formata dados internos com média calculada (USADO EXCLUSIVAMENTE NO BACKEND PARA O ALGORITMO).
   */
  public formatInternalPlayer(player: any): PlayerInternal {
    const ratings = player.ratings || [];
    const ratingCount = ratings.length;

    let overallRating = 5.0; // Padrão neutro para cálculo interno de balanceamento

    if (ratingCount > 0) {
      const sum = ratings.reduce((acc: number, curr: any) => acc + curr.value, 0);
      overallRating = Math.round((sum / ratingCount) * 10) / 10;
    }

    return {
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      position: player.position as PlayerPosition,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
      ratingCount,
      overallRating,
      ratings: ratings.map((r: any) => ({
        id: r.id,
        value: r.value,
        playerId: r.playerId,
        createdAt: r.createdAt,
      })),
    };
  }

  /**
   * Lista todos os jogadores públicos (sem expor notas).
   */
  public async getAllPlayers(): Promise<PublicPlayerDTO[]> {
    const players = await prisma.player.findMany({
      orderBy: { name: 'asc' },
    });

    return players.map((p) => this.toPublicPlayer(p));
  }

  /**
   * Busca um jogador público por ID.
   */
  public async getPlayerById(id: string): Promise<PublicPlayerDTO | null> {
    const player = await prisma.player.findUnique({
      where: { id },
    });

    if (!player) return null;
    return this.toPublicPlayer(player);
  }

  /**
   * Busca jogadores internos com suas notas para execução do algoritmo de sorteio (USO INTERNO).
   */
  public async getInternalPlayersByIds(ids: string[]): Promise<PlayerInternal[]> {
    const idList = Array.isArray(ids) ? ids : [ids];
    const players = await prisma.player.findMany({
      where: { id: { in: idList } },
      include: {
        ratings: true,
      },
    });

    return players.map((p) => this.formatInternalPlayer(p));
  }

  /**
   * Cadastra um novo jogador no sistema (Inicia sem notas!).
   */
  public async createPlayer(dto: CreatePlayerDTO): Promise<PublicPlayerDTO> {
    const { name, photoUrl, position = 'FIELD' } = dto;

    if (!name || name.trim().length === 0) {
      throw new Error('O nome do jogador é obrigatório.');
    }

    // Regra: Não permitir fotos/avatares repetidos
    if (photoUrl && photoUrl.trim().length > 0) {
      const existingWithPhoto = await prisma.player.findFirst({
        where: { photoUrl: photoUrl.trim() },
      });
      if (existingWithPhoto) {
        throw new Error(`Este avatar/foto já está em uso pelo atleta "${existingWithPhoto.name}". Escolha outro.`);
      }
    }

    const createdPlayer = await prisma.player.create({
      data: {
        name: name.trim(),
        photoUrl: photoUrl ? photoUrl.trim() : null,
        position: position === 'GOALKEEPER' ? 'GOALKEEPER' : 'FIELD',
      },
    });

    return this.toPublicPlayer(createdPlayer);
  }

  /**
   * Atualiza os dados de um jogador.
   */
  public async updatePlayer(id: string, dto: UpdatePlayerDTO): Promise<PublicPlayerDTO> {
    const existing = await prisma.player.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Jogador não encontrado.');
    }

    // Regra: Não permitir fotos/avatares repetidos
    if (dto.photoUrl && dto.photoUrl.trim().length > 0) {
      const existingWithPhoto = await prisma.player.findFirst({
        where: {
          photoUrl: dto.photoUrl.trim(),
          id: { not: id },
        },
      });
      if (existingWithPhoto) {
        throw new Error(`Este avatar/foto já está em uso pelo atleta "${existingWithPhoto.name}". Escolha outro.`);
      }
    }

    const updated = await prisma.player.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl ? dto.photoUrl.trim() : null }),
        ...(dto.position !== undefined && {
          position: dto.position === 'GOALKEEPER' ? 'GOALKEEPER' : 'FIELD',
        }),
      },
    });

    return this.toPublicPlayer(updated);
  }

  /**
   * Deleta um jogador e suas notas associadas.
   */
  public async deletePlayer(id: string): Promise<void> {
    const existing = await prisma.player.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Jogador não encontrado.');
    }

    await prisma.player.delete({ where: { id } });
  }

  /**
   * Adiciona uma nova nota (1.0 a 10.0) de forma anônima e confidencial.
   * Não expõe a média individual do jogador no retorno.
   */
  public async addRating(playerId: string, dto: AddRatingDTO): Promise<{ success: boolean; message: string }> {
    const { value } = dto;
    const numericValue = Number(value);

    if (isNaN(numericValue) || numericValue < 1 || numericValue > 10) {
      throw new Error('A nota deve ser um valor numérico entre 1.0 e 10.0.');
    }

    const existing = await prisma.player.findUnique({ where: { id: playerId } });
    if (!existing) {
      throw new Error('Jogador não encontrado.');
    }

    await prisma.rating.create({
      data: {
        playerId,
        value: Math.round(numericValue * 10) / 10,
      },
    });

    return {
      success: true,
      message: 'Avaliação registrada confidencialmente com sucesso.',
    };
  }
}
