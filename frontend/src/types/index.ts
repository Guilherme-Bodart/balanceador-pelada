export type PlayerPosition = 'FIELD' | 'GOALKEEPER';

export interface Player {
  id: string;
  name: string;
  photoUrl: string | null;
  position: PlayerPosition;
  physicalRating: number;
  basePhysicalRating: number;
  baseSkillRating: number;
  skillRating: number;
  overallRating: number;
  skillRatingCount: number;
  physicalRatingCount: number;
  ratingCount: number;
  maxRatingsAllowed: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddRatingInput {
  skill?: number; // 0 ou 1.0 a 10.0 (0 = não votou)
  physical?: number; // 0 ou 1.0 a 10.0 (0 = não votou)
  value?: number;
}

export interface CreatePlayerInput {
  name: string;
  photoUrl?: string;
  position?: PlayerPosition;
  physicalRating?: number;
  basePhysicalRating?: number;
  baseSkillRating?: number;
}

export interface UpdatePlayerInput {
  name?: string;
  photoUrl?: string;
  position?: PlayerPosition;
  physicalRating?: number;
  basePhysicalRating?: number;
  baseSkillRating?: number;
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
