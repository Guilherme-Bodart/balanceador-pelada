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
   * Formata os dados públicos do jogador calculando Skill (60%), Físico (40%), Média Composta e Limites de Votos.
   */
  public toPublicPlayer(player: any, totalPlayersCount: number = 1): PublicPlayerDTO {
    const ratings = player.ratings || [];
    const skillRatings = ratings.filter((r: any) => r.type === 'SKILL' || !r.type);
    const physicalRatings = ratings.filter((r: any) => r.type === 'PHYSICAL');

    const skillRatingCount = skillRatings.length;
    const physicalRatingCount = physicalRatings.length;
    const ratingCount = Math.max(skillRatingCount, physicalRatingCount);

    const baseSkillRating = Number(player.baseSkillRating ?? 0.0);
    const basePhysicalRating = Number(player.basePhysicalRating ?? player.physicalRating ?? 0.0);

    let skillRating = baseSkillRating;
    if (skillRatingCount > 0) {
      const sum = skillRatings.reduce((acc: number, curr: any) => acc + curr.value, 0);
      skillRating = Math.round((sum / skillRatingCount) * 10) / 10;
    }

    let physicalRating = basePhysicalRating;
    if (physicalRatingCount > 0) {
      const sum = physicalRatings.reduce((acc: number, curr: any) => acc + curr.value, 0);
      physicalRating = Math.round((sum / physicalRatingCount) * 10) / 10;
    }

    // Nota Composta: 60% Peso Técnico (Skill) + 40% Peso Físico (ou 100% se apenas um tiver nota)
    let overallRating = 0.0;
    if (skillRating > 0 && physicalRating > 0) {
      overallRating = Math.round(((skillRating * 0.60) + (physicalRating * 0.40)) * 10) / 10;
    } else if (skillRating > 0) {
      overallRating = skillRating;
    } else if (physicalRating > 0) {
      overallRating = physicalRating;
    }

    return {
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      position: player.position as PlayerPosition,
      physicalRating,
      basePhysicalRating,
      baseSkillRating,
      skillRating,
      overallRating,
      skillRatingCount,
      physicalRatingCount,
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
        type: (r.type || 'SKILL') as any,
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
   * Cria um novo jogador com foto exclusiva e notas base configuradas.
   */
  public async createPlayer(dto: CreatePlayerDTO): Promise<PublicPlayerDTO> {
    const { name, photoUrl, position = 'FIELD', physicalRating, basePhysicalRating, baseSkillRating } = dto;

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

    const initialPhysical = Number(basePhysicalRating ?? physicalRating ?? 0.0);
    const initialSkill = Number(baseSkillRating ?? 0.0);

    const created = await prisma.player.create({
      data: {
        name: name.trim(),
        photoUrl: photoUrl && photoUrl.trim().length > 0 ? photoUrl.trim() : null,
        position,
        physicalRating: Math.min(Math.max(initialPhysical, 0.0), 10.0),
        basePhysicalRating: Math.min(Math.max(initialPhysical, 0.0), 10.0),
        baseSkillRating: Math.min(Math.max(initialSkill, 0.0), 10.0),
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
    const { name, photoUrl, position, physicalRating, basePhysicalRating, baseSkillRating } = dto;

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

    const newPhysical = physicalRating !== undefined ? Number(physicalRating) : (basePhysicalRating !== undefined ? Number(basePhysicalRating) : undefined);
    const newBasePhysical = basePhysicalRating !== undefined ? Number(basePhysicalRating) : (physicalRating !== undefined ? Number(physicalRating) : undefined);
    const newBaseSkill = baseSkillRating !== undefined ? Number(baseSkillRating) : undefined;

    const updated = await prisma.player.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        photoUrl: photoUrl !== undefined ? (photoUrl.trim().length > 0 ? photoUrl.trim() : null) : undefined,
        position: position || undefined,
        physicalRating: newPhysical !== undefined ? Math.min(Math.max(newPhysical, 0.0), 10.0) : undefined,
        basePhysicalRating: newBasePhysical !== undefined ? Math.min(Math.max(newBasePhysical, 0.0), 10.0) : undefined,
        baseSkillRating: newBaseSkill !== undefined ? Math.min(Math.max(newBaseSkill, 0.0), 10.0) : undefined,
      },
      include: {
        ratings: true,
      },
    });

    const totalPlayersCount = await prisma.player.count();
    return this.toPublicPlayer(updated, totalPlayersCount);
  }

  /**
   * Adiciona voto de Skill (1.0 a 10.0) e/ou Físico (1.0 a 10.0).
   * Se a nota for 0, a votação daquele critério é ignorada (não conta/não existe).
   */
  public async addRating(id: string, dto: AddRatingDTO): Promise<{ message: string; addedSkill: boolean; addedPhysical: boolean }> {
    const skillVal = dto.skill !== undefined ? Number(dto.skill) : (dto.value !== undefined ? Number(dto.value) : 0);
    const physicalVal = dto.physical !== undefined ? Number(dto.physical) : 0;

    const hasSkillVote = skillVal > 0;
    const hasPhysicalVote = physicalVal > 0;

    if (!hasSkillVote && !hasPhysicalVote) {
      throw new Error('Selecione uma nota maior que 0 para Skill ou Físico para registrar a avaliação.');
    }

    if (hasSkillVote && (skillVal < 1.0 || skillVal > 10.0)) {
      throw new Error('A nota de Skill deve ser entre 1.0 e 10.0 (10 a 100) ou 0 para não votar.');
    }

    if (hasPhysicalVote && (physicalVal < 1.0 || physicalVal > 10.0)) {
      throw new Error('A nota de Físico deve ser entre 1.0 e 10.0 (10 a 100) ou 0 para não votar.');
    }

    const player = await prisma.player.findUnique({
      where: { id },
      include: { ratings: true },
    });

    if (!player) {
      throw new Error('Jogador não encontrado.');
    }

    const totalPlayersCount = await prisma.player.count();
    const existingSkillRatings = player.ratings.filter((r) => r.type === 'SKILL' || !r.type);
    const existingPhysicalRatings = player.ratings.filter((r) => r.type === 'PHYSICAL');

    if (hasSkillVote && existingSkillRatings.length >= totalPlayersCount) {
      throw new Error(
        `Limite de avaliações de Skill atingido para este ciclo (${existingSkillRatings.length}/${totalPlayersCount} votos). Você ainda pode votar apenas no Físico caso haja vagas.`
      );
    }

    if (hasPhysicalVote && existingPhysicalRatings.length >= totalPlayersCount) {
      throw new Error(
        `Limite de avaliações de Físico atingido para este ciclo (${existingPhysicalRatings.length}/${totalPlayersCount} votos). Você ainda pode votar apenas na Skill caso haja vagas.`
      );
    }

    const creates: any[] = [];
    if (hasSkillVote) {
      creates.push(
        prisma.rating.create({
          data: {
            value: Number(skillVal),
            type: 'SKILL',
            playerId: id,
          },
        })
      );
    }

    if (hasPhysicalVote) {
      creates.push(
        prisma.rating.create({
          data: {
            value: Number(physicalVal),
            type: 'PHYSICAL',
            playerId: id,
          },
        })
      );
    }

    await prisma.$transaction(creates);

    let message = 'Avaliação registrada com sucesso!';
    if (hasSkillVote && hasPhysicalVote) {
      message = `Avaliações de Skill (${Math.round(skillVal * 10)}) e Físico (${Math.round(physicalVal * 10)}) registradas com sucesso!`;
    } else if (hasSkillVote) {
      message = `Avaliação de Skill (${Math.round(skillVal * 10)}) registrada com sucesso! (Físico: 0 - Não avaliado)`;
    } else if (hasPhysicalVote) {
      message = `Avaliação de Físico (${Math.round(physicalVal * 10)}) registrada com sucesso! (Skill: 0 - Não avaliado)`;
    }

    return {
      message,
      addedSkill: hasSkillVote,
      addedPhysical: hasPhysicalVote,
    };
  }

  /**
   * Executa a Virada de Mês / Reset Mensal:
   * 1. Consolida a média de Skill atual de cada atleta como a nova `baseSkillRating` para o próximo mês.
   * 2. Consolida a média de Físico atual de cada atleta como a nova `basePhysicalRating` para o próximo mês.
   * 3. Limpa os registros de votos individuais, liberando espaço para um novo ciclo de votos.
   */
  public async performMonthlyReset(): Promise<{ message: string; consolidatedCount: number }> {
    const players = await prisma.player.findMany({
      include: {
        ratings: true,
      },
    });

    let consolidatedCount = 0;

    for (const player of players) {
      const skillRatings = player.ratings.filter((r) => r.type === 'SKILL' || !r.type);
      const physicalRatings = player.ratings.filter((r) => r.type === 'PHYSICAL');

      let newBaseSkill = player.baseSkillRating;
      let newBasePhysical = player.basePhysicalRating ?? player.physicalRating ?? 0.0;
      let hasChanges = false;

      if (skillRatings.length > 0) {
        const sumSkill = skillRatings.reduce((acc, r) => acc + r.value, 0);
        newBaseSkill = Math.round((sumSkill / skillRatings.length) * 10) / 10;
        hasChanges = true;
      }

      if (physicalRatings.length > 0) {
        const sumPhysical = physicalRatings.reduce((acc, r) => acc + r.value, 0);
        newBasePhysical = Math.round((sumPhysical / physicalRatings.length) * 10) / 10;
        hasChanges = true;
      }

      if (hasChanges) {
        await prisma.player.update({
          where: { id: player.id },
          data: {
            baseSkillRating: newBaseSkill,
            basePhysicalRating: newBasePhysical,
            physicalRating: newBasePhysical,
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

  /**
   * Retorna o histórico de votos individuais de um atleta.
   */
  public async getPlayerRatings(playerId: string) {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        ratings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!player) {
      throw new Error('Jogador não encontrado.');
    }

    return {
      playerId: player.id,
      playerName: player.name,
      totalVotes: player.ratings.length,
      ratings: player.ratings,
    };
  }

  /**
   * Retorna todos os votos registrados no banco para auditoria.
   */
  public async getAllRatingsAudit() {
    const ratings = await prisma.rating.findMany({
      include: {
        player: {
          select: { id: true, name: true, position: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return ratings;
  }
}
