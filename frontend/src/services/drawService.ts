import { api } from './api';
import { DrawResponse, ApiResponse } from '../types';

export interface DrawPayload {
  playerIds: string[];
  playersPerTeam: number;
  goalkeeperIds?: string[];
}

export const drawService = {
  /**
   * Executa o sorteio balanceado diretamente no backend.
   */
  async drawTeams(payload: DrawPayload): Promise<DrawResponse> {
    const response = await api.post<ApiResponse<DrawResponse>>('/draw', payload);
    return response.data.data;
  },
};
