/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        violet: '#B197FC',
        rose: '#FF8FAB',
        mint: '#4ECCA3',
        bg: '#0E0A1E',
        surface: '#17133A',
        'surface-2': '#1F1B4A',
        border: 'rgba(177,151,252,0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 24px rgba(177,151,252,0.45)',
        'glow-rose': '0 0 24px rgba(255,143,171,0.45)',
        'glow-mint': '0 0 24px rgba(78,204,163,0.45)',
        'glow-sm-violet': '0 0 12px rgba(177,151,252,0.35)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease forwards',
        'fill-bar': 'fillBar 1s ease forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fillBar: {
          from: { width: '0%' },
          to: { width: 'var(--bar-width)' },
        },
      },
    },
  },
  plugins: [],
};
