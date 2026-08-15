import { api } from './api';
import { Player, CreatePlayerInput, UpdatePlayerInput, ApiResponse } from '../types';

export const playerService = {
  /**
   * Busca a lista completa de jogadores cadastrados (dados públicos).
   */
  async getAll(): Promise<Player[]> {
    const response = await api.get<ApiResponse<Player[]>>('/players');
    return response.data.data;
  },

  /**
   * Busca um jogador específico por ID.
   */
  async getById(id: string): Promise<Player> {
    const response = await api.get<ApiResponse<Player>>(`/players/${id}`);
    return response.data.data;
  },

  /**
   * Cadastra um novo jogador.
   */
  async create(data: CreatePlayerInput): Promise<Player> {
    const response = await api.post<ApiResponse<Player>>('/players', data);
    return response.data.data;
  },

  /**
   * Atualiza os dados de um jogador existente.
   */
  async update(id: string, data: UpdatePlayerInput): Promise<Player> {
    const response = await api.put<ApiResponse<Player>>(`/players/${id}`, data);
    return response.data.data;
  },

  /**
   * Remove um jogador.
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/players/${id}`);
  },

  /**
   * Adiciona uma nova nota de Skill (1.0 a 10.0) para o jogador.
   */
  async addRating(id: string, value: number): Promise<void> {
    await api.post(`/players/${id}/ratings`, { value });
  },

  /**
   * Dispara a Virada de Mês / Reset Mensal com consolidação de médias.
   */
  async monthlyReset(): Promise<{ message: string; consolidatedCount: number }> {
    const response = await api.post<ApiResponse<{ message: string; consolidatedCount: number }>>('/players/monthly-reset');
    return response.data.data;
  },
};
