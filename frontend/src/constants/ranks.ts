export type PlayerRank = 'D' | 'C' | 'B' | 'A' | 'A+' | 'S' | 'SS' | 'UR';

export interface RankDetails {
  rank: PlayerRank;
  label: string; // Ex: "Fora da curva", "Excepcional", "Excelente", etc.
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorder: string;
  cardBg: string;
  cardGlow: string;
  cardClass: string;
  shieldBorderColor: string;
  shieldBadgeBg: string;
  shieldGlowClass: string;
  accentColor: string;
}

export const RANKS_MAP: Record<PlayerRank, RankDetails> = {
  D: {
    rank: 'D',
    label: 'Muito fraco',
    description: 'Nível iniciante',
    badgeBg: 'bg-zinc-800/80',
    badgeText: 'text-zinc-400',
    badgeBorder: 'border-zinc-700',
    cardBorder: 'border-zinc-700/60',
    cardBg: 'bg-zinc-950/40',
    cardGlow: '',
    cardClass: '',
    shieldBorderColor: '#71717a',
    shieldBadgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-600',
    shieldGlowClass: '',
    accentColor: '#71717a',
  },
  C: {
    rank: 'C',
    label: 'Fraco',
    description: 'Precisa de ritmo',
    badgeBg: 'bg-amber-950/70',
    badgeText: 'text-amber-500',
    badgeBorder: 'border-amber-700/60',
    cardBorder: 'border-amber-700/50',
    cardBg: 'bg-amber-950/20',
    cardGlow: '',
    cardClass: '',
    shieldBorderColor: '#b45309',
    shieldBadgeBg: 'bg-amber-950 text-amber-400 border-amber-600',
    shieldGlowClass: '',
    accentColor: '#d97706',
  },
  B: {
    rank: 'B',
    label: 'Mediano',
    description: 'Jogador padrão de pelada',
    badgeBg: 'bg-slate-800/80',
    badgeText: 'text-slate-200',
    badgeBorder: 'border-slate-600',
    cardBorder: 'border-slate-600/60',
    cardBg: 'bg-slate-900/50',
    cardGlow: '',
    cardClass: '',
    shieldBorderColor: '#94a3b8',
    shieldBadgeBg: 'bg-slate-800 text-slate-200 border-slate-500',
    shieldGlowClass: '',
    accentColor: '#94a3b8',
  },
  A: {
    rank: 'A',
    label: 'Bom',
    description: 'Acima da média',
    badgeBg: 'bg-emerald-950/70',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/60',
    cardBorder: 'border-emerald-500/60',
    cardBg: 'bg-emerald-950/20',
    cardGlow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)]',
    cardClass: '',
    shieldBorderColor: '#10b981',
    shieldBadgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-500',
    shieldGlowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.35)]',
    accentColor: '#10b981',
  },
  'A+': {
    rank: 'A+',
    label: 'Muito bom',
    description: 'Destaque no jogo',
    badgeBg: 'bg-purple-950/70',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/70',
    cardBorder: 'border-purple-500/60',
    cardBg: 'bg-purple-950/25',
    cardGlow: 'shadow-[0_0_18px_-3px_rgba(168,85,247,0.35)]',
    cardClass: '',
    shieldBorderColor: '#a855f7',
    shieldBadgeBg: 'bg-purple-950 text-purple-200 border-purple-400',
    shieldGlowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    accentColor: '#a855f7',
  },
  S: {
    rank: 'S',
    label: 'Excelente',
    description: 'Craque do time',
    badgeBg: 'bg-rose-950/70',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/80',
    cardBorder: 'border-rose-500/70',
    cardBg: 'bg-rose-950/30',
    cardGlow: 'shadow-[0_0_22px_-2px_rgba(239,68,68,0.4)]',
    cardClass: '',
    shieldBorderColor: '#ef4444',
    shieldBadgeBg: 'bg-rose-950 text-rose-200 border-rose-500',
    shieldGlowClass: 'shadow-[0_0_18px_rgba(239,68,68,0.5)]',
    accentColor: '#ef4444',
  },
  SS: {
    rank: 'SS',
    label: 'Excepcional',
    description: 'Decide a partida sozinho',
    badgeBg: 'bg-gradient-to-r from-amber-600/30 via-yellow-500/40 to-amber-600/30',
    badgeText: 'text-yellow-300 font-black',
    badgeBorder: 'border-yellow-400/90',
    cardBorder: 'border-amber-400/80',
    cardBg: 'bg-gradient-to-b from-amber-950/35 to-slate-900/80',
    cardGlow: 'shadow-glow-rank-ss',
    cardClass: 'rank-card-ss animate-gold-shimmer',
    shieldBorderColor: '#fbbf24',
    shieldBadgeBg: 'bg-gradient-to-r from-amber-900 via-yellow-700 to-amber-900 text-yellow-200 border-yellow-400',
    shieldGlowClass: 'shadow-shield-ss animate-pulse',
    accentColor: '#fbbf24',
  },
  UR: {
    rank: 'UR',
    label: 'Fora da curva',
    description: 'Nível Ultra Instinct / Lendário',
    badgeBg: 'bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30',
    badgeText: 'text-white font-black',
    badgeBorder: 'border-sky-300/90',
    cardBorder: 'border-transparent',
    cardBg: 'bg-gradient-to-b from-indigo-950/40 via-purple-950/30 to-slate-900/90',
    cardGlow: 'shadow-glow-rank-ur',
    cardClass: 'rank-card-ur animate-ur-aura',
    shieldBorderColor: '#818cf8',
    shieldBadgeBg: 'bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white border-pink-400',
    shieldGlowClass: 'shadow-shield-ur animate-ur-aura',
    accentColor: '#c084fc',
  },
};

/**
 * Converte a média geral numérica (0.5 a 10.0) no Rank correspondente.
 * Tabela oficial:
 * 0.5 a 2.0 = D (Muito fraco)
 * 2.5 a 4.5 = C (Fraco)
 * 5.0 a 6.0 = B (Mediano)
 * 6.5 a 7.0 = A (Bom)
 * 7.5 a 8.0 = A+ (Muito bom)
 * 8.5 a 9.0 = S (Excelente)
 * 9.5 (9.1 a 9.9) = SS (Excepcional)
 * 10 = UR (Fora da curva)
 */
export const getRankInfo = (score: number = 5.0): RankDetails => {
  if (score >= 10.0) return RANKS_MAP.UR;
  if (score >= 9.1) return RANKS_MAP.SS;
  if (score >= 8.1) return RANKS_MAP.S;
  if (score >= 7.1) return RANKS_MAP['A+'];
  if (score >= 6.1) return RANKS_MAP.A;
  if (score >= 4.6) return RANKS_MAP.B;
  if (score >= 2.1) return RANKS_MAP.C;
  return RANKS_MAP.D;
};
