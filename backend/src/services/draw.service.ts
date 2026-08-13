import { PlayerWithRating, DrawRequestDTO, DrawResponseDTO, Team } from '../types';
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

    // 1. Buscar dados completos dos jogadores selecionados com suas médias calculadas
    const allSelectedPlayers = await this.playerService.getPlayersByIds(playerIds);

    if (allSelectedPlayers.length !== playerIds.length) {
      throw new Error('Um ou mais jogadores selecionados não foram encontrados no banco de dados.');
    }

    // 2. Separar Goleiros e Jogadores de Linha (considerando personalização para esta partida se informada)
    const customGkSet = dto.goalkeeperIds ? new Set(dto.goalkeeperIds) : null;

    const goalkeepers = allSelectedPlayers
      .filter((p) => (customGkSet ? customGkSet.has(p.id) : p.position === 'GOALKEEPER'))
      .sort((a, b) => b.overallRating - a.overallRating);

    const fieldPlayers = allSelectedPlayers
      .filter((p) => (customGkSet ? !customGkSet.has(p.id) : p.position !== 'GOALKEEPER'))
      .sort((a, b) => b.overallRating - a.overallRating);

    // 3. Alocação de Goleiros
    let gkA: PlayerWithRating | null = null;
    let gkB: PlayerWithRating | null = null;
    const extraGoalkeepers: PlayerWithRating[] = [];

    if (goalkeepers.length >= 2) {
      // O melhor goleiro vai para um time, o segundo melhor para o outro
      gkA = goalkeepers[0];
      gkB = goalkeepers[1];
      // Se houver mais de 2 goleiros, os excedentes viram jogadores de linha disponíveis
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
    const { teamAField, teamBField } = this.balanceFieldPlayers(
      activeFieldPlayers,
      fieldSlotsA,
      fieldSlotsB,
      gkA?.overallRating ?? 0,
      gkB?.overallRating ?? 0
    );

    // 5. Montar os times e calcular estatísticas finais
    const teamA = this.buildTeam('Time A (Preto)', gkA, teamAField);
    const teamB = this.buildTeam('Time B (Branco)', gkB, teamBField);

    const differenceScore = Math.round(Math.abs(teamA.totalScore - teamB.totalScore) * 100) / 100;

    return {
      teamA,
      teamB,
      reserves,
      differenceScore,
      isEquilibrado: differenceScore <= 1.5,
      drawnAt: new Date().toISOString(),
    };
  }

  /**
   * Distribui jogadores de linha usando Snake Draft seguido de refinamento guloso (Swap Minimization)
   * para minimizar |Score(A) - Score(B)| levando em consideração os goleiros.
   */
  private balanceFieldPlayers(
    players: PlayerWithRating[],
    slotsA: number,
    slotsB: number,
    gkScoreA: number,
    gkScoreB: number
  ): { teamAField: PlayerWithRating[]; teamBField: PlayerWithRating[] } {
    const listA: PlayerWithRating[] = [];
    const listB: PlayerWithRating[] = [];

    // Passo A: Snake Draft Inicial (A, B, B, A, A, B, B, A...)
    // Se o Time A já começou com goleiro de nota maior, começamos o Snake dando prioridade ao Time B
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

      // Inverte o turno no padrão Snake (1, 2, 2, 2...)
      if ((i + 1) % 2 === 0) {
        turnToB = !turnToB;
      }
    }

    // Passo B: Otimizador de Trocas (Hill Climbing / Swap Optimizer)
    // Testa todas as permutações de troca 1-a-1 entre time A e time B para encontrar a menor diferença de soma
    let improved = true;
    let bestA = [...listA];
    let bestB = [...listB];

    const calculateDelta = (aList: PlayerWithRating[], bList: PlayerWithRating[]) => {
      const scoreA = gkScoreA + aList.reduce((acc, p) => acc + p.overallRating, 0);
      const scoreB = gkScoreB + bList.reduce((acc, p) => acc + p.overallRating, 0);
      return Math.abs(scoreA - scoreB);
    };

    let bestDelta = calculateDelta(bestA, bestB);

    // Itera até que nenhuma troca unitária consiga reduzir ainda mais a disparidade
    while (improved) {
      improved = false;

      for (let i = 0; i < bestA.length; i++) {
        for (let j = 0; j < bestB.length; j++) {
          const testA = [...bestA];
          const testB = [...bestB];

          // Realiza swap temporário
          testA[i] = bestB[j];
          testB[j] = bestA[i];

          const newDelta = calculateDelta(testA, testB);

          // Se a troca diminuir a diferença matemática, adota a nova configuração
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

    // Ordena os jogadores de cada time por nota para exibição elegante
    bestA.sort((a, b) => b.overallRating - a.overallRating);
    bestB.sort((a, b) => b.overallRating - a.overallRating);

    return {
      teamAField: bestA,
      teamBField: bestB,
    };
  }

  /**
   * Constrói o objeto estruturado do Time com métricas consolidadas.
   */
  private buildTeam(name: string, goalkeeper: PlayerWithRating | null, fieldPlayers: PlayerWithRating[]): Team {
    const allPlayers = goalkeeper ? [goalkeeper, ...fieldPlayers] : [...fieldPlayers];
    const totalScore = allPlayers.reduce((sum, p) => sum + p.overallRating, 0);
    const averageScore = allPlayers.length > 0 ? totalScore / allPlayers.length : 0;

    return {
      name,
      goalkeeper,
      fieldPlayers,
      totalPlayers: allPlayers.length,
      totalScore: Math.round(totalScore * 100) / 100,
      averageScore: Math.round(averageScore * 100) / 100,
    };
  }
}
