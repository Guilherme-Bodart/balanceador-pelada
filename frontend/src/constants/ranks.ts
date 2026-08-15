export type PlayerRank = 'D' | 'C' | 'B' | 'A' | 'A+' | 'S' | 'SS' | 'UR';

export interface RankToken {
  rank: PlayerRank;
  label: string;
  subtitle: string;
  range: string;
  // Cores Base
  colorHex: string;
  borderHex: string;
  bgHex: string;
  
  // Classes da Tabela de Regras
  rulesCardBg: string;
  rulesCardBorder: string;
  rulesLeftBar: string;
  rulesBadgeBg: string;
  rulesBadgeText: string;
  rulesBadgeBorder: string;
  rulesTitleText: string;
  rulesScoreBadge: string;

  // Classes do Card Esportivo FIFA
  cardBgStyle: string;
  cardBorder: string;
  cardShadow: string;
  ratingTextColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  badgeGlow: string;

  isLegend?: boolean;
}

export const RANKS_MAP: Record<PlayerRank, RankToken> = {
  // ================= UR: ULTRA INSTINCT / BRANCO & ROXO CÓSMICO (10.0) =================
  UR: {
    rank: 'UR',
    label: 'Fora da curva',
    subtitle: 'NÍVEL ULTRA INSTINCT / LENDÁRIO',
    range: '10.0',
    colorHex: '#ffffff',
    borderHex: '#c084fc',
    bgHex: 'rgba(192, 132, 252, 0.15)',

    rulesCardBg: 'bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-fuchsia-950/40',
    rulesCardBorder: 'border-purple-300/50 shadow-[0_0_15px_rgba(192,132,252,0.25)]',
    rulesLeftBar: 'bg-gradient-to-b from-white via-purple-300 to-fuchsia-500 shadow-[0_0_12px_#ffffff]',
    rulesBadgeBg: 'bg-gradient-to-r from-white via-purple-100 to-fuchsia-200',
    rulesBadgeText: 'text-purple-950 font-black',
    rulesBadgeBorder: 'border border-white',
    rulesTitleText: 'text-purple-200 font-bold',
    rulesScoreBadge: 'bg-purple-950/80 border border-purple-400/50 text-white font-black',

    cardBgStyle: 'linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(168, 85, 247, 0.22) 50%, rgba(15, 23, 42, 0.98) 100%)',
    cardBorder: 'border border-purple-300/70',
    cardShadow: 'shadow-[0_0_20px_rgba(255,255,255,0.35),0_0_35px_rgba(168,85,247,0.45),0_8px_16px_rgba(0,0,0,0.5)]',
    ratingTextColor: 'text-white drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]',
    badgeBg: 'bg-gradient-to-r from-white via-purple-100 to-purple-300',
    badgeText: 'text-purple-950 font-black',
    badgeBorder: 'border border-white',
    badgeGlow: 'shadow-[0_0_15px_rgba(255,255,255,0.8),0_0_25px_rgba(168,85,247,0.6)]',
    isLegend: true,
  },

  // ================= SS: DOURADO / EXCEPCIONAL (9.1 - 9.9) =================
  SS: {
    rank: 'SS',
    label: 'Excepcional',
    subtitle: 'Decide a partida sozinho',
    range: '9.1 a 9.9',
    colorHex: '#fbbf24',
    borderHex: '#f59e0b',
    bgHex: 'rgba(251, 191, 36, 0.1)',

    rulesCardBg: 'bg-gradient-to-r from-yellow-500/10 to-transparent',
    rulesCardBorder: 'border-yellow-500/40',
    rulesLeftBar: 'bg-yellow-400 shadow-[0_0_10px_#fbbf24]',
    rulesBadgeBg: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-700',
    rulesBadgeText: 'text-slate-950 font-black',
    rulesBadgeBorder: 'border border-yellow-200',
    rulesTitleText: 'text-yellow-400 font-bold',
    rulesScoreBadge: 'bg-black/30 border border-yellow-500/30 text-yellow-400 font-bold',

    cardBgStyle: 'linear-gradient(135deg, rgba(251, 191, 36, 0.14) 0%, rgba(217, 119, 6, 0.08) 50%, rgba(15, 23, 42, 0.95) 100%)',
    cardBorder: 'border border-yellow-500/40',
    cardShadow: 'shadow-[0_0_16px_rgba(251,191,36,0.25),0_8px_16px_rgba(0,0,0,0.4)]',
    ratingTextColor: 'text-yellow-400',
    badgeBg: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600',
    badgeText: 'text-slate-950 font-black',
    badgeBorder: 'border border-yellow-200',
    badgeGlow: 'shadow-[0_0_10px_rgba(251,191,36,0.6)]',
  },

  // ================= S: ROXO / EXCELENTE (8.1 - 9.0) =================
  S: {
    rank: 'S',
    label: 'Excelente',
    subtitle: 'Craque do time',
    range: '8.1 a 9.0',
    colorHex: '#a855f7',
    borderHex: '#9333ea',
    bgHex: 'rgba(168, 85, 247, 0.1)',

    rulesCardBg: 'bg-gradient-to-r from-purple-500/10 to-transparent',
    rulesCardBorder: 'border-purple-500/30',
    rulesLeftBar: 'bg-purple-500 shadow-[0_0_8px_#a855f7]',
    rulesBadgeBg: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-purple-800',
    rulesBadgeText: 'text-white font-black',
    rulesBadgeBorder: 'border border-purple-300',
    rulesTitleText: 'text-purple-400 font-bold',
    rulesScoreBadge: 'bg-black/30 border border-purple-500/25 text-purple-300 font-bold',

    cardBgStyle: 'linear-gradient(135deg, rgba(168, 85, 247, 0.14) 0%, rgba(126, 34, 206, 0.06) 50%, rgba(15, 23, 42, 0.95) 100%)',
    cardBorder: 'border border-purple-500/35',
    cardShadow: 'shadow-[0_0_14px_rgba(168,85,247,0.2),0_8px_16px_rgba(0,0,0,0.4)]',
    ratingTextColor: 'text-purple-300',
    badgeBg: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-purple-800',
    badgeText: 'text-white font-black',
    badgeBorder: 'border border-purple-300',
    badgeGlow: 'shadow-[0_0_8px_rgba(168,85,247,0.5)]',
  },

  // ================= A+: VERMELHO / MUITO BOM (7.1 - 8.0) =================
  'A+': {
    rank: 'A+',
    label: 'Muito bom',
    subtitle: 'Destaque no jogo',
    range: '7.1 a 8.0',
    colorHex: '#ef4444',
    borderHex: '#dc2626',
    bgHex: 'rgba(239, 68, 68, 0.1)',

    rulesCardBg: 'bg-gradient-to-r from-red-500/10 to-transparent',
    rulesCardBorder: 'border-red-500/30',
    rulesLeftBar: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
    rulesBadgeBg: 'bg-gradient-to-br from-red-400 via-rose-500 to-red-800',
    rulesBadgeText: 'text-white font-black',
    rulesBadgeBorder: 'border border-red-300',
    rulesTitleText: 'text-red-400 font-bold',
    rulesScoreBadge: 'bg-black/30 border border-red-500/25 text-red-300 font-bold',

    cardBgStyle: 'linear-gradient(135deg, rgba(239, 68, 68, 0.14) 0%, rgba(185, 28, 28, 0.06) 50%, rgba(15, 23, 42, 0.95) 100%)',
    cardBorder: 'border border-red-500/35',
    cardShadow: 'shadow-[0_0_12px_rgba(239,68,68,0.2),0_8px_16px_rgba(0,0,0,0.4)]',
    ratingTextColor: 'text-rose-400',
    badgeBg: 'bg-gradient-to-br from-red-400 via-rose-500 to-red-800',
    badgeText: 'text-white font-black',
    badgeBorder: 'border border-red-300',
    badgeGlow: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
  },

  // ================= A: AZUL / BOM (6.1 - 7.0) =================
  A: {
    rank: 'A',
    label: 'Bom',
    subtitle: 'Acima da média',
    range: '6.1 a 7.0',
    colorHex: '#3b82f6',
    borderHex: '#2563eb',
    bgHex: 'rgba(59, 130, 246, 0.1)',

    rulesCardBg: 'bg-gradient-to-r from-blue-500/10 to-transparent',
    rulesCardBorder: 'border-blue-500/30',
    rulesLeftBar: 'bg-blue-500 shadow-[0_0_8px_#3b82f6]',
    rulesBadgeBg: 'bg-gradient-to-br from-sky-400 via-blue-500 to-blue-800',
    rulesBadgeText: 'text-white font-black',
    rulesBadgeBorder: 'border border-blue-300',
    rulesTitleText: 'text-blue-400 font-bold',
    rulesScoreBadge: 'bg-black/30 border border-blue-500/25 text-blue-300 font-bold',

    cardBgStyle: 'linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(29, 78, 216, 0.06) 50%, rgba(15, 23, 42, 0.95) 100%)',
    cardBorder: 'border border-blue-500/35',
    cardShadow: 'shadow-[0_0_12px_rgba(59,130,246,0.2),0_8px_16px_rgba(0,0,0,0.4)]',
    ratingTextColor: 'text-sky-400',
    badgeBg: 'bg-gradient-to-br from-sky-400 via-blue-500 to-blue-800',
    badgeText: 'text-white font-black',
    badgeBorder: 'border border-blue-300',
    badgeGlow: 'shadow-[0_0_8px_rgba(59,130,246,0.5)]',
  },

  // ================= B: VERDE / MEDIANO (4.6 - 6.0) =================
  B: {
    rank: 'B',
    label: 'Mediano',
    subtitle: 'Jogador padrão de pelada',
    range: '4.6 a 6.0',
    colorHex: '#10b981',
    borderHex: '#059669',
    bgHex: 'rgba(168, 85, 247, 0.1)',

    rulesCardBg: 'bg-gradient-to-r from-emerald-500/10 to-transparent',
    rulesCardBorder: 'border-emerald-500/30',
    rulesLeftBar: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
    rulesBadgeBg: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-800',
    rulesBadgeText: 'text-white font-black',
    rulesBadgeBorder: 'border border-emerald-300',
    rulesTitleText: 'text-emerald-400 font-bold',
    rulesScoreBadge: 'bg-black/30 border border-emerald-500/25 text-emerald-300 font-bold',

    cardBgStyle: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(4, 120, 87, 0.06) 50%, rgba(15, 23, 42, 0.95) 100%)',
    cardBorder: 'border border-emerald-500/35',
    cardShadow: 'shadow-[0_0_10px_rgba(16,185,129,0.2),0_8px_16px_rgba(0,0,0,0.4)]',
    ratingTextColor: 'text-emerald-400',
    badgeBg: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-800',
    badgeText: 'text-white font-black',
    badgeBorder: 'border border-emerald-300',
    badgeGlow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]',
  },

  // ================= C: BRONZE / FRACO (2.1 - 4.5) =================
  C: {
    rank: 'C',
    label: 'Fraco',
    subtitle: 'Precisa de ritmo',
    range: '2.1 a 4.5',
    colorHex: '#d97706',
    borderHex: '#b45309',
    bgHex: 'rgba(217, 119, 6, 0.1)',

    rulesCardBg: 'bg-gradient-to-r from-amber-600/10 to-transparent',
    rulesCardBorder: 'border-amber-600/30',
    rulesLeftBar: 'bg-amber-600',
    rulesBadgeBg: 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800',
    rulesBadgeText: 'text-amber-100 font-bold',
    rulesBadgeBorder: 'border border-amber-500/50',
    rulesTitleText: 'text-amber-500 font-bold',
    rulesScoreBadge: 'bg-black/30 border border-amber-600/20 text-amber-400 font-bold',

    cardBgStyle: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(146, 64, 14, 0.05) 50%, rgba(15, 23, 42, 0.95) 100%)',
    cardBorder: 'border border-amber-600/35',
    cardShadow: 'shadow-[0_0_8px_rgba(217,119,6,0.15),0_8px_16px_rgba(0,0,0,0.4)]',
    ratingTextColor: 'text-amber-400',
    badgeBg: 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800',
    badgeText: 'text-amber-100 font-bold',
    badgeBorder: 'border border-amber-400',
    badgeGlow: '',
  },

  // ================= D: AÇO / MUITO FRACO (0.5 - 2.0) =================
  D: {
    rank: 'D',
    label: 'Muito fraco',
    subtitle: 'Nível iniciante',
    range: '0.5 a 2.0',
    colorHex: '#64748b',
    borderHex: '#475569',
    bgHex: 'rgba(100, 116, 139, 0.1)',

    rulesCardBg: 'bg-slate-800/30',
    rulesCardBorder: 'border-slate-700/40',
    rulesLeftBar: 'bg-slate-600',
    rulesBadgeBg: 'bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800',
    rulesBadgeText: 'text-slate-200 font-medium',
    rulesBadgeBorder: 'border border-slate-500/50',
    rulesTitleText: 'text-slate-400 font-medium',
    rulesScoreBadge: 'bg-black/30 border border-slate-700/40 text-slate-400 font-medium',

    cardBgStyle: 'linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, rgba(51, 65, 85, 0.05) 50%, rgba(15, 23, 42, 0.95) 100%)',
    cardBorder: 'border border-slate-700/40',
    cardShadow: 'shadow-[0_0_6px_rgba(100,116,139,0.1),0_8px_16px_rgba(0,0,0,0.4)]',
    ratingTextColor: 'text-slate-400',
    badgeBg: 'bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800',
    badgeText: 'text-slate-200 font-bold',
    badgeBorder: 'border border-slate-400',
    badgeGlow: '',
  },
};

export const getRankInfo = (score: number = 5.0): RankToken => {
  if (score >= 10.0) return RANKS_MAP.UR;
  if (score >= 9.1) return RANKS_MAP.SS;
  if (score >= 8.1) return RANKS_MAP.S;
  if (score >= 7.1) return RANKS_MAP['A+'];
  if (score >= 6.1) return RANKS_MAP.A;
  if (score >= 4.6) return RANKS_MAP.B;
  if (score >= 2.1) return RANKS_MAP.C;
  return RANKS_MAP.D;
};
