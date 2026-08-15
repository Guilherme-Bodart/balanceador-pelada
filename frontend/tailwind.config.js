/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          dark: '#0B0F17',
          card: '#131B2A',
          border: '#1E293B',
          accent: '#10B981',
          lime: '#84CC16',
          gold: '#F59E0B',
          danger: '#EF4444',
          subtle: '#64748B',
        },
        // Design Tokens de Ranks (Gamificação)
        rank: {
          d: {
            DEFAULT: '#71717a',
            light: '#a1a1aa',
            border: '#52525b',
            bg: '#27272a',
          },
          c: {
            DEFAULT: '#d97706',
            light: '#fbbf24',
            border: '#b45309',
            bg: '#78350f',
          },
          b: {
            DEFAULT: '#94a3b8',
            light: '#cbd5e1',
            border: '#64748b',
            bg: '#334155',
          },
          a: {
            DEFAULT: '#10b981',
            light: '#34d399',
            border: '#059669',
            bg: '#064e3b',
          },
          aplus: {
            DEFAULT: '#a855f7',
            light: '#c084fc',
            border: '#9333ea',
            bg: '#581c87',
          },
          s: {
            DEFAULT: '#ef4444',
            light: '#f87171',
            border: '#dc2626',
            bg: '#7f1d1d',
          },
          ss: {
            DEFAULT: '#fbbf24',
            light: '#fde047',
            border: '#f59e0b',
            glow: '#f59e0b',
            bg: '#78350f',
          },
          ur: {
            DEFAULT: '#38bdf8',
            purple: '#a855f7',
            pink: '#ec4899',
            glow: '#818cf8',
            bg: '#312e81',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-lime': '0 0 20px -5px rgba(132, 204, 22, 0.3)',
        'card-elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        'glow-rank-ss': '0 0 25px 2px rgba(251, 191, 36, 0.4), inset 0 0 15px rgba(251, 191, 36, 0.15)',
        'glow-rank-ur': '0 0 30px 4px rgba(168, 85, 247, 0.45), 0 0 15px 2px rgba(56, 189, 248, 0.4), inset 0 0 20px rgba(236, 72, 153, 0.2)',
        'shield-ss': '0 0 20px 2px rgba(251, 191, 36, 0.45)',
        'shield-ur': '0 0 25px 4px rgba(147, 51, 234, 0.5), 0 0 12px rgba(56, 189, 248, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'gold-shimmer': 'gold-shimmer 3s ease-in-out infinite',
        'ur-aura': 'ur-aura 4s ease-in-out infinite',
        'ur-border-spin': 'ur-border-spin 6s linear infinite',
      },
      keyframes: {
        'gold-shimmer': {
          '0%, 100%': {
            borderColor: 'rgba(251, 191, 36, 0.7)',
            boxShadow: '0 0 18px 1px rgba(251, 191, 36, 0.35), inset 0 0 10px rgba(251, 191, 36, 0.1)',
          },
          '50%': {
            borderColor: 'rgba(253, 224, 71, 1)',
            boxShadow: '0 0 30px 4px rgba(251, 191, 36, 0.6), inset 0 0 18px rgba(253, 224, 71, 0.25)',
          },
        },
        'ur-aura': {
          '0%, 100%': {
            borderColor: 'rgba(56, 189, 248, 0.8)',
            boxShadow: '0 0 25px 3px rgba(168, 85, 247, 0.45), 0 0 10px rgba(56, 189, 248, 0.35)',
            transform: 'scale(1)',
          },
          '33%': {
            borderColor: 'rgba(168, 85, 247, 0.9)',
            boxShadow: '0 0 32px 5px rgba(236, 72, 153, 0.5), 0 0 15px rgba(168, 85, 247, 0.4)',
            transform: 'scale(1.006)',
          },
          '66%': {
            borderColor: 'rgba(236, 72, 153, 0.9)',
            boxShadow: '0 0 32px 5px rgba(56, 189, 248, 0.5), 0 0 15px rgba(236, 72, 153, 0.4)',
            transform: 'scale(1)',
          },
        },
        'ur-border-spin': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
