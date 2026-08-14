export type PlayerPosition = 'FIELD' | 'GOALKEEPER';

export interface RatingEntity {
  id: string;
  value: number;
  playerId: string;
  createdAt: Date;
}

// Entidade completa interna no backend (com notas e média para cálculo do algoritmo)
export interface PlayerInternal {
  id: string;
  name: string;
  photoUrl: string | null;
  position: PlayerPosition;
  createdAt: Date;
  updatedAt: Date;
  ratingCount: number;
  overallRating: number; // Usado estritamente no backend para o algoritmo de equilíbrio
  ratings?: RatingEntity[];
}

// DTO público retornado nas APIs do frontend (TOTALMENTE SEM NOTAS nem médias individuais)
export interface PublicPlayerDTO {
  id: string;
  name: string;
  photoUrl: string | null;
  position: PlayerPosition;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlayerDTO {
  name: string;
  photoUrl?: string;
  position?: PlayerPosition;
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
  playerIds: string[]; // IDs dos jogadores participantes
  playersPerTeam: number; // Ex: 5 para 5x5, 6 para 6x6
  goalkeeperIds?: string[]; // IDs específicos designados como goleiros hoje
}

// Time público sem expor as notas individuais dos atletas
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
  differenceScore: number; // Diferença de pontuação entre as equipes
  advantageTeam?: string; // Ex: "Time 1 (+0.5 pts)" ou "Empate Técnico"
  isEquilibrado: boolean;
  drawnAt: string;
}
