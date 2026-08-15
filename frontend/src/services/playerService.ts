import { api } from './api';
import { Player, CreatePlayerInput, UpdatePlayerInput, ApiResponse } from '../types';

export const playerService = {
  /**
   * Busca a lista completa de jogadores diretamente do banco de dados (API).
   */
  async getAll(): Promise<Player[]> {
    const response = await api.get<ApiResponse<Player[]>>('/players');
    return response.data?.data || [];
  },

  /**
   * Busca detalhes de um jogador por ID diretamente do banco.
   */
  async getById(id: string): Promise<Player> {
    const response = await api.get<ApiResponse<Player>>(`/players/${id}`);
    return response.data.data;
  },

  /**
   * Cadastra novo jogador diretamente no banco de dados.
   */
  async create(data: CreatePlayerInput): Promise<Player> {
    const response = await api.post<ApiResponse<Player>>('/players', data);
    return response.data.data;
  },

  /**
   * Atualiza dados de um jogador existente no banco.
   */
  async update(id: string, data: UpdatePlayerInput): Promise<Player> {
    const response = await api.put<ApiResponse<Player>>(`/players/${id}`, data);
    return response.data.data;
  },

  /**
   * Remove um jogador permanentemente do banco de dados.
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/players/${id}`);
  },

  /**
   * Registra avaliação de habilidade técnica (Skill) no banco.
   */
  async addRating(id: string, value: number): Promise<void> {
    await api.post(`/players/${id}/ratings`, { value });
  },

  /**
   * Executa a Virada de Mês / Consolidação de médias no banco de dados.
   */
  async monthlyReset(): Promise<{ message: string; consolidatedCount: number }> {
    const response = await api.post<ApiResponse<{ message: string; consolidatedCount: number }>>('/players/monthly-reset');
    return response.data.data;
  },
};
