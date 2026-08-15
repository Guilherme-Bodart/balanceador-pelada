export type PlayerPosition = 'FIELD' | 'GOALKEEPER';

export interface Player {
  id: string;
  name: string;
  photoUrl: string | null;
  position: PlayerPosition;
  physicalRating: number;
  baseSkillRating: number;
  skillRating: number;
  overallRating: number;
  ratingCount: number;
  maxRatingsAllowed: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerInput {
  name: string;
  photoUrl?: string;
  position?: PlayerPosition;
  physicalRating?: number;
}

export interface UpdatePlayerInput {
  name?: string;
  photoUrl?: string;
  position?: PlayerPosition;
  physicalRating?: number;
}

export interface Team {
  name: string;
  goalkeeper: Player | null;
  fieldPlayers: Player[];
  totalPlayers: number;
}

export interface DrawResponse {
  teamA: Team;
  teamB: Team;
  reserves: Player[];
  differenceScore: number;
  advantageTeam?: string;
  isEquilibrado: boolean;
  drawnAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
