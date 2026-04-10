import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'Cascadia Code', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        surface: {
          root: '#06080f',
          sidebar: '#0a0e1a',
          card: 'rgba(15,20,35,0.65)',
          'card-solid': '#0f1423',
          'card-hover': 'rgba(20,28,50,0.8)',
          elevated: 'rgba(25,32,55,0.7)',
          input: 'rgba(15,20,40,0.6)',
          'input-focus': 'rgba(20,28,55,0.8)',
        },
        border: {
          subtle: 'rgba(148,163,184,0.08)',
          DEFAULT: 'rgba(148,163,184,0.12)',
          strong: 'rgba(148,163,184,0.2)',
          focus: 'rgba(99,102,241,0.5)',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          tertiary: '#64748b',
          muted: '#475569',
          inverse: '#0f172a',
        },
        accent: {
          indigo: '#6366f1',
          'indigo-light': '#818cf8',
          violet: '#a78bfa',
          gold: '#f59e0b',
          'gold-light': '#fbbf24',
          emerald: '#10b981',
          'emerald-light': '#34d399',
          rose: '#f43f5e',
          sky: '#38bdf8',
        },
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '24px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0,0,0,0.2)',
        sm: '0 2px 8px rgba(0,0,0,0.15)',
        md: '0 8px 32px rgba(0,0,0,0.2)',
        lg: '0 16px 64px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(99,102,241,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
