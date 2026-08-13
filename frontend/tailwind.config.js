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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-lime': '0 0 20px -5px rgba(132, 204, 22, 0.3)',
        'card-elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
