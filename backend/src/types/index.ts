export type PlayerPosition = 'FIELD' | 'GOALKEEPER';
export type RatingType = 'SKILL' | 'PHYSICAL';

export interface RatingEntity {
  id: string;
  value: number;
  type: RatingType;
  playerId: string;
  createdAt: Date;
}

// Entidade completa interna no backend (com notas e média para cálculo do algoritmo)
export interface PlayerInternal {
  id: string;
  name: string;
  photoUrl: string | null;
  position: PlayerPosition;
  physicalRating: number;
  basePhysicalRating: number;
  baseSkillRating: number;
  skillRating: number;
  overallRating: number; // (Skill * 0.60) + (Físico * 0.40)
  skillRatingCount: number;
  physicalRatingCount: number;
  ratingCount: number;
  maxRatingsAllowed: number;
  createdAt: Date;
  updatedAt: Date;
  ratings?: RatingEntity[];
}

// DTO público retornado nas APIs do frontend (com notas e médias para Ranks)
export interface PublicPlayerDTO {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlayerDTO {
  name: string;
  photoUrl?: string;
  position?: PlayerPosition;
  physicalRating?: number;
  basePhysicalRating?: number;
  baseSkillRating?: number;
}

export interface UpdatePlayerDTO {
  name?: string;
  photoUrl?: string;
  position?: PlayerPosition;
  physicalRating?: number;
  basePhysicalRating?: number;
  baseSkillRating?: number;
}

export interface AddRatingDTO {
  skill?: number; // 0 ou 1.0 a 10.0 (0 = não votou)
  physical?: number; // 0 ou 1.0 a 10.0 (0 = não votou)
  value?: number; // compatibilidade legado
}

export interface DrawRequestDTO {
  playerIds: string[]; // IDs dos jogadores participantes
  playersPerTeam: number; // Ex: 5 para 5x5, 6 para 6x6
  goalkeeperIds?: string[]; // IDs específicos designados como goleiros hoje
}

export interface PublicTeam {
  name: string;
  goalkeeper: PublicPlayerDTO | null;
  fieldPlayers: PublicPlayerDTO[];
  totalPlayers: number;
}

export interface DrawResponseDTO {
  teamA: PublicTeam;
  teamB: PublicTeam;
  reserves: PublicPlayerDTO[];
  differenceScore: number;
  advantageTeam?: string;
  isEquilibrado: boolean;
  drawnAt: string;
}
