import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151e2e',
          900: '#0F172A',
          950: '#090d16',
        },
        chameleon: {
          emerald: '#16A34A',
          'emerald-light': '#22C55E',
          'emerald-dark': '#15803D',
          sky: '#0284C7',
          'sky-light': '#38BDF8',
          'sky-dark': '#0369A1',
          amber: '#F59E0B',
          rose: '#E11D48',
          purple: '#9333EA',
        },
        theme: {
          bg: 'var(--color-bg)',
          'bg-card': 'var(--color-bg-card)',
          'bg-card-subtle': 'var(--color-bg-card-subtle)',
          'text-main': 'var(--color-text-main)',
          'text-muted': 'var(--color-text-muted)',
          border: 'var(--color-border)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'scale-up': 'scaleUp 0.25s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flip': 'flipCard 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        flipCard: {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config
