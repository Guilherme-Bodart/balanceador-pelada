import { prisma } from '../config/prisma';
import { CreatePlayerDTO, UpdatePlayerDTO, AddRatingDTO, PlayerWithRating, PlayerPosition } from '../types';

export class PlayerService {
  /**
   * Formata e calcula a média geral de notas de um jogador.
   * Regra de negócio: Se não houver notas, a média padrão é 5.0.
   */
  private formatPlayerWithRating(player: any): PlayerWithRating {
    const ratings = player.ratings || [];
    const ratingCount = ratings.length;

    let overallRating = 5.0; // Default conforme especificação

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
   * Lista todos os jogadores ordenados por nome ou média.
   */
  public async getAllPlayers(): Promise<PlayerWithRating[]> {
    const players = await prisma.player.findMany({
      include: {
        ratings: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return players.map((p) => this.formatPlayerWithRating(p));
  }

  /**
   * Busca um jogador por ID.
   */
  public async getPlayerById(id: string): Promise<PlayerWithRating | null> {
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        ratings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!player) return null;
    return this.formatPlayerWithRating(player);
  }

  /**
   * Busca múltiplos jogadores por IDs.
   */
  public async getPlayersByIds(ids: string[]): Promise<PlayerWithRating[]> {
    const players = await prisma.player.findMany({
      where: { id: { in: ids } },
      include: {
        ratings: true,
      },
    });

    return players.map((p) => this.formatPlayerWithRating(p));
  }

  /**
   * Cadastra um novo jogador no sistema.
   */
  public async createPlayer(dto: CreatePlayerDTO): Promise<PlayerWithRating> {
    const { name, photoUrl, position = 'FIELD', initialRating } = dto;

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
        ...(initialRating !== undefined && initialRating !== null
          ? {
              ratings: {
                create: {
                  value: Math.min(10, Math.max(1, Number(initialRating))),
                },
              },
            }
          : {}),
      },
      include: {
        ratings: true,
      },
    });

    return this.formatPlayerWithRating(createdPlayer);
  }

  /**
   * Atualiza os dados de um jogador.
   */
  public async updatePlayer(id: string, dto: UpdatePlayerDTO): Promise<PlayerWithRating> {
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
      include: {
        ratings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return this.formatPlayerWithRating(updated);
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
   * Adiciona uma nova nota (1.0 a 10.0) para um jogador existente.
   */
  public async addRating(playerId: string, dto: AddRatingDTO): Promise<PlayerWithRating> {
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

    return (await this.getPlayerById(playerId))!;
  }
}
