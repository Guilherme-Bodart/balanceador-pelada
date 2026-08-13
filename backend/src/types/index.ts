export type PlayerPosition = 'FIELD' | 'GOALKEEPER';

export interface RatingEntity {
  id: string;
  value: number;
  playerId: string;
  createdAt: Date;
}

export interface PlayerWithRating {
  id: string;
  name: string;
  photoUrl: string | null;
  position: PlayerPosition;
  createdAt: Date;
  updatedAt: Date;
  ratingCount: number;
  overallRating: number; // Média calculada (default 5.0 se sem notas)
  ratings?: RatingEntity[];
}

export interface CreatePlayerDTO {
  name: string;
  photoUrl?: string;
  position?: PlayerPosition;
  initialRating?: number;
}

export interface UpdatePlayerDTO {
  name?: string;
  photoUrl?: string;
  position?: PlayerPosition;
}

export interface AddRatingDTO {
  value: number; // 1.0 a 10.0
}

export interface DrawRequestDTO {
  playerIds: string[]; // IDs dos jogadores que vão participar hoje
  playersPerTeam: number; // Ex: 5 para 5x5, 6 para 6x6
  goalkeeperIds?: string[]; // IDs específicos designados como goleiros para ESTA partida
}

export interface Team {
  name: string;
  goalkeeper: PlayerWithRating | null;
  fieldPlayers: PlayerWithRating[];
  totalPlayers: number;
  totalScore: number;
  averageScore: number;
}

export interface DrawResponseDTO {
  teamA: Team;
  teamB: Team;
  reserves: PlayerWithRating[];
  differenceScore: number; // Diferença absoluta da soma das notas entre os times
  isEquilibrado: boolean;
  drawnAt: string;
}
