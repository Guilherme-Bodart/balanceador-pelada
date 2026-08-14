import {
  PlayerInternal,
  PublicPlayerDTO,
  PublicTeam,
  DrawRequestDTO,
  DrawResponseDTO,
} from '../types';
import { PlayerService } from './player.service';

/**
 * DrawService - Responsável exclusivamente pelas regras de negócio
 * e algoritmo de equilíbrio matemático para sorteio de times.
 */
export class DrawService {
  private playerService: PlayerService;

  constructor(playerService: PlayerService = new PlayerService()) {
    this.playerService = playerService;
  }

  private toPublic(player: PlayerInternal | null): PublicPlayerDTO | null {
    if (!player) return null;
    return {
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      position: player.position,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    };
  }

  /**
   * Executa o sorteio de times equilibrados a partir de uma lista de IDs de jogadores.
   */
  public async drawTeams(dto: DrawRequestDTO): Promise<DrawResponseDTO> {
    const { playerIds, playersPerTeam } = dto;

    if (!playerIds || playerIds.length < 2) {
      throw new Error('É necessário selecionar pelo menos 2 jogadores para o sorteio.');
    }

    if (!playersPerTeam || playersPerTeam < 1) {
      throw new Error('O número de jogadores por time deve ser no mínimo 1.');
    }

    const totalNeeded = playersPerTeam * 2;
    if (playerIds.length < totalNeeded) {
      throw new Error(
        `Jogadores insuficientes para uma partida de ${playersPerTeam}x${playersPerTeam}. Selecionados: ${playerIds.length}, Necessários: ${totalNeeded}.`
      );
    }

    // 1. Buscar dados internos dos jogadores (com notas calculadas sigilosamente no backend)
    const allSelectedPlayers = await this.playerService.getInternalPlayersByIds(playerIds);

    if (allSelectedPlayers.length !== playerIds.length) {
      throw new Error('Um ou mais jogadores selecionados não foram encontrados no banco de dados.');
    }

    // 2. Separar Goleiros e Jogadores de Linha (respeitando escolha do dia se informada)
    const customGkSet = dto.goalkeeperIds ? new Set(dto.goalkeeperIds) : null;

    const goalkeepers = allSelectedPlayers
      .filter((p) => (customGkSet ? customGkSet.has(p.id) : p.position === 'GOALKEEPER'))
      .sort((a, b) => b.overallRating - a.overallRating);

    const fieldPlayers = allSelectedPlayers
      .filter((p) => (customGkSet ? !customGkSet.has(p.id) : p.position !== 'GOALKEEPER'))
      .sort((a, b) => b.overallRating - a.overallRating);

    // 3. Alocação de Goleiros
    let gkA: PlayerInternal | null = null;
    let gkB: PlayerInternal | null = null;
    const extraGoalkeepers: PlayerInternal[] = [];

    if (goalkeepers.length >= 2) {
      gkA = goalkeepers[0];
      gkB = goalkeepers[1];
      if (goalkeepers.length > 2) {
        extraGoalkeepers.push(...goalkeepers.slice(2));
      }
    } else if (goalkeepers.length === 1) {
      gkA = goalkeepers[0];
    }

    // Unir excedentes de goleiros aos jogadores de linha e reordenar
    const availableFieldPlayers = [...fieldPlayers, ...extraGoalkeepers].sort(
      (a, b) => b.overallRating - a.overallRating
    );

    // Quantos jogadores de linha cada time precisa
    const fieldSlotsA = playersPerTeam - (gkA ? 1 : 0);
    const fieldSlotsB = playersPerTeam - (gkB ? 1 : 0);
    const totalFieldNeeded = fieldSlotsA + fieldSlotsB;

    if (availableFieldPlayers.length < totalFieldNeeded) {
      throw new Error(
        `Número insuficiente de jogadores de linha. Necessários: ${totalFieldNeeded}, Disponíveis: ${availableFieldPlayers.length}.`
      );
    }

    // Selecionar os melhores jogadores para o sorteio principal
    const activeFieldPlayers = availableFieldPlayers.slice(0, totalFieldNeeded);
    const reserves = availableFieldPlayers.slice(totalFieldNeeded);

    // 4. Algoritmo de Distribuição (Snake Draft + Otimizador de Trocas)
    const { teamAField, teamBField, scoreA, scoreB } = this.balanceFieldPlayers(
      activeFieldPlayers,
      fieldSlotsA,
      fieldSlotsB,
      gkA?.overallRating ?? 0,
      gkB?.overallRating ?? 0
    );

    // 5. Montar os times públicos (SEM EXPOR AS NOTAS INDIVIDUAIS)
    const publicGkA = this.toPublic(gkA);
    const publicGkB = this.toPublic(gkB);
    const publicTeamAField = teamAField.map((p) => this.toPublic(p)!);
    const publicTeamBField = teamBField.map((p) => this.toPublic(p)!);
    const publicReserves = reserves.map((p) => this.toPublic(p)!);

    const teamA: PublicTeam = {
      name: 'Time 1 (Preto)',
      goalkeeper: publicGkA,
      fieldPlayers: publicTeamAField,
      totalPlayers: (publicGkA ? 1 : 0) + publicTeamAField.length,
    };

    const teamB: PublicTeam = {
      name: 'Time 2 (Branco)',
      goalkeeper: publicGkB,
      fieldPlayers: publicTeamBField,
      totalPlayers: (publicGkB ? 1 : 0) + publicTeamBField.length,
    };

    const differenceScore = Math.round(Math.abs(scoreA - scoreB) * 10) / 10;

    let advantageTeam = 'Equilíbrio Perfeito';
    if (differenceScore > 0) {
      if (scoreA > scoreB) {
        advantageTeam = `Time 1 (+${differenceScore.toFixed(1)} pts de vantagem)`;
      } else {
        advantageTeam = `Time 2 (+${differenceScore.toFixed(1)} pts de vantagem)`;
      }
    }

    return {
      teamA,
      teamB,
      reserves: publicReserves,
      differenceScore,
      advantageTeam,
      isEquilibrado: differenceScore <= 1.5,
      drawnAt: new Date().toISOString(),
    };
  }

  /**
   * Distribui jogadores de linha usando Snake Draft seguido de refinamento guloso (Swap Minimization)
   * para minimizar |Score(A) - Score(B)| levando em consideração os goleiros.
   */
  private balanceFieldPlayers(
    players: PlayerInternal[],
    slotsA: number,
    slotsB: number,
    gkScoreA: number,
    gkScoreB: number
  ): { teamAField: PlayerInternal[]; teamBField: PlayerInternal[]; scoreA: number; scoreB: number } {
    const listA: PlayerInternal[] = [];
    const listB: PlayerInternal[] = [];

    // Snake Draft Inicial
    let turnToB = gkScoreA > gkScoreB;

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const canAddToA = listA.length < slotsA;
      const canAddToB = listB.length < slotsB;

      if (turnToB && canAddToB) {
        listB.push(player);
      } else if (!turnToB && canAddToA) {
        listA.push(player);
      } else if (canAddToA) {
        listA.push(player);
      } else if (canAddToB) {
        listB.push(player);
      }

      if ((i + 1) % 2 === 0) {
        turnToB = !turnToB;
      }
    }

    // Otimizador de Trocas (Swap Optimizer)
    let improved = true;
    let bestA = [...listA];
    let bestB = [...listB];

    const calculateDelta = (aList: PlayerInternal[], bList: PlayerInternal[]) => {
      const scoreA = gkScoreA + aList.reduce((acc, p) => acc + p.overallRating, 0);
      const scoreB = gkScoreB + bList.reduce((acc, p) => acc + p.overallRating, 0);
      return Math.abs(scoreA - scoreB);
    };

    let bestDelta = calculateDelta(bestA, bestB);

    while (improved) {
      improved = false;

      for (let i = 0; i < bestA.length; i++) {
        for (let j = 0; j < bestB.length; j++) {
          const testA = [...bestA];
          const testB = [...bestB];

          testA[i] = bestB[j];
          testB[j] = bestA[i];

          const newDelta = calculateDelta(testA, testB);

          if (newDelta < bestDelta - 0.001) {
            bestA = testA;
            bestB = testB;
            bestDelta = newDelta;
            improved = true;
            break;
          }
        }
        if (improved) break;
      }
    }

    const finalScoreA = gkScoreA + bestA.reduce((acc, p) => acc + p.overallRating, 0);
    const finalScoreB = gkScoreB + bestB.reduce((acc, p) => acc + p.overallRating, 0);

    return {
      teamAField: bestA,
      teamBField: bestB,
      scoreA: finalScoreA,
      scoreB: finalScoreB,
    };
  }
}
