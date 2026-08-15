import { prisma } from '../config/prisma';
import {
  PlayerInternal,
  PublicPlayerDTO,
  CreatePlayerDTO,
  UpdatePlayerDTO,
  AddRatingDTO,
  PlayerPosition,
} from '../types';

export class PlayerService {
  /**
   * Formata os dados públicos do jogador calculando Skill (75%), Físico (25%), Média Composta e Limite de Votos.
   */
  public toPublicPlayer(player: any, totalPlayersCount: number = 1): PublicPlayerDTO {
    const ratings = player.ratings || [];
    const ratingCount = ratings.length;
    const physicalRating = Number(player.physicalRating ?? 5.0);
    const baseSkillRating = Number(player.baseSkillRating ?? 0.0);

    let skillRating = baseSkillRating;
    if (ratingCount > 0) {
      const sum = ratings.reduce((acc: number, curr: any) => acc + curr.value, 0);
      skillRating = Math.round((sum / ratingCount) * 10) / 10;
    }

    // Nota Composta: 75% Peso Técnico (Skill) + 25% Peso Físico (ou apenas Físico se ainda não avaliado)
    const overallRating = skillRating > 0
      ? Math.round(((skillRating * 0.75) + (physicalRating * 0.25)) * 10) / 10
      : physicalRating;

    return {
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      position: player.position as PlayerPosition,
      physicalRating,
      baseSkillRating,
      skillRating,
      overallRating,
      ratingCount,
      maxRatingsAllowed: Math.max(totalPlayersCount, 1),
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    };
  }

  /**
   * Formata dados internos com notas e médias para execução do algoritmo de sorteio.
   */
  public formatInternalPlayer(player: any, totalPlayersCount: number = 1): PlayerInternal {
    const publicData = this.toPublicPlayer(player, totalPlayersCount);
    const ratings = player.ratings || [];

    return {
      ...publicData,
      ratings: ratings.map((r: any) => ({
        id: r.id,
        value: r.value,
        playerId: r.playerId,
        createdAt: r.createdAt,
      })),
    };
  }

  /**
   * Lista todos os jogadores com suas notas compostas para conversão em Ranks.
   */
  public async getAllPlayers(): Promise<PublicPlayerDTO[]> {
    const totalPlayersCount = await prisma.player.count();
    const players = await prisma.player.findMany({
      include: {
        ratings: true,
      },
      orderBy: { name: 'asc' },
    });

    return players.map((p) => this.toPublicPlayer(p, totalPlayersCount));
  }

  /**
   * Busca um jogador por ID.
   */
  public async getPlayerById(id: string): Promise<PublicPlayerDTO | null> {
    const totalPlayersCount = await prisma.player.count();
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        ratings: true,
      },
    });

    if (!player) return null;
    return this.toPublicPlayer(player, totalPlayersCount);
  }

  /**
   * Busca jogadores internos com suas notas para o algoritmo de sorteio.
   */
  public async getInternalPlayersByIds(ids: string[]): Promise<PlayerInternal[]> {
    const idList = Array.isArray(ids) ? ids : [ids];
    const totalPlayersCount = await prisma.player.count();

    const players = await prisma.player.findMany({
      where: {
        id: {
          in: idList,
        },
      },
      include: {
        ratings: true,
      },
    });

    return players.map((p) => this.formatInternalPlayer(p, totalPlayersCount));
  }

  /**
   * Cria um novo jogador com foto exclusiva e nota de físico configurada.
   */
  public async createPlayer(dto: CreatePlayerDTO): Promise<PublicPlayerDTO> {
    const { name, photoUrl, position = 'FIELD', physicalRating = 5.0 } = dto;

    if (!name || name.trim().length < 2) {
      throw new Error('O nome do jogador deve ter pelo menos 2 caracteres.');
    }

    if (photoUrl && photoUrl.trim().length > 0) {
      const existingWithPhoto = await prisma.player.findFirst({
        where: { photoUrl: photoUrl.trim() },
      });

      if (existingWithPhoto) {
        throw new Error('Este avatar/Pokémon já está em uso por outro atleta. Escolha outro exclusivo!');
      }
    }

    const created = await prisma.player.create({
      data: {
        name: name.trim(),
        photoUrl: photoUrl && photoUrl.trim().length > 0 ? photoUrl.trim() : null,
        position,
        physicalRating: Math.min(Math.max(Number(physicalRating), 1.0), 10.0),
        baseSkillRating: 0.0,
      },
      include: {
        ratings: true,
      },
    });

    const totalPlayersCount = await prisma.player.count();
    return this.toPublicPlayer(created, totalPlayersCount);
  }

  /**
   * Atualiza os dados de um jogador existente.
   */
  public async updatePlayer(id: string, dto: UpdatePlayerDTO): Promise<PublicPlayerDTO> {
    const { name, photoUrl, position, physicalRating } = dto;

    const existing = await prisma.player.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Jogador não encontrado.');
    }

    if (photoUrl && photoUrl.trim().length > 0 && photoUrl.trim() !== existing.photoUrl) {
      const inUse = await prisma.player.findFirst({
        where: {
          photoUrl: photoUrl.trim(),
          id: { not: id },
        },
      });

      if (inUse) {
        throw new Error('Este avatar/Pokémon já está sendo utilizado por outro atleta!');
      }
    }

    const updated = await prisma.player.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        photoUrl: photoUrl !== undefined ? (photoUrl.trim().length > 0 ? photoUrl.trim() : null) : undefined,
        position: position || undefined,
        physicalRating: physicalRating !== undefined ? Math.min(Math.max(Number(physicalRating), 1.0), 10.0) : undefined,
      },
      include: {
        ratings: true,
      },
    });

    const totalPlayersCount = await prisma.player.count();
    return this.toPublicPlayer(updated, totalPlayersCount);
  }

  /**
   * Adiciona um voto de Skill (1.0 a 10.0) respeitando o limite máximo de votos do elenco.
   */
  public async addRating(id: string, dto: AddRatingDTO): Promise<{ message: string }> {
    const { value } = dto;

    if (value === undefined || value < 1.0 || value > 10.0) {
      throw new Error('A nota deve ser um valor entre 1.0 e 10.0.');
    }

    const player = await prisma.player.findUnique({
      where: { id },
      include: { ratings: true },
    });

    if (!player) {
      throw new Error('Jogador não encontrado.');
    }

    const totalPlayersCount = await prisma.player.count();
    const currentRatingCount = player.ratings.length;

    if (currentRatingCount >= totalPlayersCount) {
      throw new Error(
        `Limite de avaliações atingido para este ciclo (${currentRatingCount}/${totalPlayersCount} votos preenchidos). Aguarde a virada do mês.`
      );
    }

    await prisma.rating.create({
      data: {
        value: Number(value),
        playerId: id,
      },
    });

    return {
      message: 'Avaliação de Skill registrada com sucesso!',
    };
  }

  /**
   * Executa a Virada de Mês / Reset Mensal:
   * 1. Consolida a média de Skill atual de cada atleta como a nova `baseSkillRating` para o próximo mês.
   * 2. Limpa os registros de votos individuais, liberando espaço para um novo ciclo de votos.
   */
  public async performMonthlyReset(): Promise<{ message: string; consolidatedCount: number }> {
    const players = await prisma.player.findMany({
      include: {
        ratings: true,
      },
    });

    let consolidatedCount = 0;

    for (const player of players) {
      if (player.ratings && player.ratings.length > 0) {
        const sum = player.ratings.reduce((acc, r) => acc + r.value, 0);
        const newBaseSkill = Math.round((sum / player.ratings.length) * 10) / 10;

        await prisma.player.update({
          where: { id: player.id },
          data: {
            baseSkillRating: newBaseSkill,
          },
        });
        consolidatedCount++;
      }
    }

    // Limpar votos do ciclo anterior
    await prisma.rating.deleteMany();

    return {
      message: `Virada de mês realizada com sucesso! ${consolidatedCount} médias foram consolidadas como nova base inicial.`,
      consolidatedCount,
    };
  }

  /**
   * Exclui um jogador e suas notas associadas.
   */
  public async deletePlayer(id: string): Promise<{ success: boolean; message: string }> {
    const player = await prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new Error('Jogador não encontrado.');
    }

    await prisma.player.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Jogador excluído com sucesso!',
    };
  }
}
