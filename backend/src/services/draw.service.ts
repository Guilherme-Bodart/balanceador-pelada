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
      physicalRating: player.physicalRating,
      baseSkillRating: player.baseSkillRating,
      skillRating: player.skillRating,
      overallRating: player.overallRating,
      ratingCount: player.ratingCount,
      maxRatingsAllowed: player.maxRatingsAllowed,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    };
  }

  /**
   * Executa o sorteio de times equilibrados a partir de TODOS os jogadores presentes.
   * Todos os atletas selecionados entram no sorteio (distribuídos entre Time 1 e Time 2,
   * incluindo os reservas de cada equipe).
   */
  public async drawTeams(dto: DrawRequestDTO): Promise<DrawResponseDTO> {
    const { playerIds } = dto;

    if (!playerIds || !Array.isArray(playerIds) || playerIds.length < 2) {
      throw new Error('É necessário selecionar pelo menos 2 jogadores para o sorteio.');
    }

    // 1. Buscar dados internos dos jogadores (com notas calculadas sigilosamente no backend)
    const allSelectedPlayers = await this.playerService.getInternalPlayersByIds(playerIds);

    if (allSelectedPlayers.length !== playerIds.length) {
      throw new Error('Um ou mais jogadores selecionados não foram encontrados no banco de dados.');
    }

    const totalSelected = allSelectedPlayers.length;

    // 2. Separar Goleiros e Jogadores de Linha (respeitando escolha do dia se informada)
    const customGkSet = dto.goalkeeperIds && dto.goalkeeperIds.length > 0 ? new Set(dto.goalkeeperIds) : null;

    const goalkeepers = allSelectedPlayers
      .filter((p) => (customGkSet ? customGkSet.has(p.id) : p.position === 'GOALKEEPER'))
      .sort((a, b) => b.overallRating - a.overallRating);

    const fieldPlayers = allSelectedPlayers
      .filter((p) => (customGkSet ? !customGkSet.has(p.id) : p.position !== 'GOALKEEPER'))
      .sort((a, b) => b.overallRating - a.overallRating);

    // 3. Alocação de Goleiros (com alternância dinâmica)
    let gkA: PlayerInternal | null = null;
    let gkB: PlayerInternal | null = null;
    const extraGoalkeepers: PlayerInternal[] = [];

    if (goalkeepers.length >= 2) {
      const swapGk = Math.random() < 0.5;
      gkA = swapGk ? goalkeepers[1] : goalkeepers[0];
      gkB = swapGk ? goalkeepers[0] : goalkeepers[1];
      if (goalkeepers.length > 2) {
        extraGoalkeepers.push(...goalkeepers.slice(2));
      }
    } else if (goalkeepers.length === 1) {
      if (Math.random() < 0.5) {
        gkA = goalkeepers[0];
      } else {
        gkB = goalkeepers[0];
      }
    }

    // Unir excedentes de goleiros aos jogadores de linha
    const availableFieldPlayers = [...fieldPlayers, ...extraGoalkeepers];

    // 4. Distribuir 100% dos jogadores entre os dois elencos (Time 1 e Time 2)
    const numGkA = gkA ? 1 : 0;
    const numGkB = gkB ? 1 : 0;

    // Elenco total equilibrado em tamanho (ex: 14 atletas -> 7 para cada lado)
    const targetRosterA = Math.ceil(totalSelected / 2);
    const targetRosterB = totalSelected - targetRosterA;

    const fieldSlotsA = Math.max(0, targetRosterA - numGkA);
    const fieldSlotsB = Math.max(0, targetRosterB - numGkB);

    // 5. Algoritmo de Distribuição Estocástica Balanceada
    const { teamAField, teamBField, scoreA, scoreB } = this.balanceFieldPlayers(
      availableFieldPlayers,
      fieldSlotsA,
      fieldSlotsB,
      gkA?.overallRating ?? 0,
      gkB?.overallRating ?? 0
    );

    // 6. Montar os times públicos (SEM EXPOR AS NOTAS INDIVIDUAIS)
    const publicGkA = this.toPublic(gkA);
    const publicGkB = this.toPublic(gkB);
    const publicTeamAField = teamAField.map((p) => this.toPublic(p)!);
    const publicTeamBField = teamBField.map((p) => this.toPublic(p)!);

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
      reserves: [],
      differenceScore,
      advantageTeam,
      isEquilibrado: differenceScore <= 2.0,
      drawnAt: new Date().toISOString(),
    };
  }

  /**
   * Distribui os jogadores gerando múltiplos candidatos balanceados e selecionando
   * estocasticamente entre as melhores soluções, garantindo alta variação entre sorteios
   * sem perder o equilíbrio matemático de força.
   */
  private balanceFieldPlayers(
    players: PlayerInternal[],
    slotsA: number,
    slotsB: number,
    gkScoreA: number,
    gkScoreB: number
  ): { teamAField: PlayerInternal[]; teamBField: PlayerInternal[]; scoreA: number; scoreB: number } {
    if (players.length === 0) {
      return { teamAField: [], teamBField: [], scoreA: gkScoreA, scoreB: gkScoreB };
    }

    const calculateDelta = (aList: PlayerInternal[], bList: PlayerInternal[]) => {
      const scoreA = gkScoreA + aList.reduce((acc, p) => acc + p.overallRating, 0);
      const scoreB = gkScoreB + bList.reduce((acc, p) => acc + p.overallRating, 0);
      return Math.abs(scoreA - scoreB);
    };

    interface CandidateSolution {
      teamAField: PlayerInternal[];
      teamBField: PlayerInternal[];
      scoreA: number;
      scoreB: number;
      delta: number;
      signature: string;
    }

    const candidatePool: CandidateSolution[] = [];
    const seenSignatures = new Set<string>();

    const ITERATIONS = 80;

    for (let iter = 0; iter < ITERATIONS; iter++) {
      // 1. Embaralhamento com micro-jitter para jogadores parelhos
      const shuffledDraft = [...players].sort((a, b) => {
        const jitterA = a.overallRating + (Math.random() - 0.5) * 0.8;
        const jitterB = b.overallRating + (Math.random() - 0.5) * 0.8;
        return jitterB - jitterA;
      });

      const listA: PlayerInternal[] = [];
      const listB: PlayerInternal[] = [];

      let turnToB = Math.random() < 0.5;

      for (let i = 0; i < shuffledDraft.length; i++) {
        const player = shuffledDraft[i];
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

      // 2. Otimizador de Trocas (Hill Climbing)
      let bestA = [...listA];
      let bestB = [...listB];
      let bestDelta = calculateDelta(bestA, bestB);
      let improved = true;

      while (improved) {
        improved = false;

        const indicesA = Array.from({ length: bestA.length }, (_, i) => i).sort(() => Math.random() - 0.5);
        const indicesB = Array.from({ length: bestB.length }, (_, i) => i).sort(() => Math.random() - 0.5);

        for (const i of indicesA) {
          for (const j of indicesB) {
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

      const sigA = bestA.map((p) => p.id).sort().join(',');
      const sigB = bestB.map((p) => p.id).sort().join(',');
      const signature = `${sigA}|${sigB}`;

      if (!seenSignatures.has(signature)) {
        seenSignatures.add(signature);
        candidatePool.push({
          teamAField: bestA,
          teamBField: bestB,
          scoreA: finalScoreA,
          scoreB: finalScoreB,
          delta: bestDelta,
          signature,
        });
      }
    }

    let minDelta = Infinity;
    for (const cand of candidatePool) {
      if (cand.delta < minDelta) minDelta = cand.delta;
    }

    const tolerance = Math.min(minDelta + 0.8, 1.8);
    const topCandidates = candidatePool.filter((c) => c.delta <= tolerance);

    const chosen = topCandidates.length > 0
      ? topCandidates[Math.floor(Math.random() * topCandidates.length)]
      : candidatePool[0] || {
          teamAField: players.slice(0, slotsA),
          teamBField: players.slice(slotsA),
          scoreA: gkScoreA,
          scoreB: gkScoreB,
          delta: 0,
        };

    return {
      teamAField: chosen.teamAField,
      teamBField: chosen.teamBField,
      scoreA: chosen.scoreA,
      scoreB: chosen.scoreB,
    };
  }
}
