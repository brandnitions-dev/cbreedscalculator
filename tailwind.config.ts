import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
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
          root: 'var(--surface-root)',
          sidebar: 'var(--surface-sidebar)',
          card: 'var(--surface-card)',
          'card-solid': 'var(--surface-card-solid)',
          'card-hover': 'var(--surface-card-hover)',
          elevated: 'var(--surface-elevated)',
          input: 'var(--surface-input)',
          'input-focus': 'var(--surface-input-focus)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        accent: {
          indigo: 'var(--accent-indigo)',
          'indigo-light': 'var(--accent-indigo-light)',
          violet: 'var(--accent-violet)',
          gold: 'var(--accent-gold)',
          'gold-light': 'var(--accent-gold-light)',
          emerald: 'var(--accent-emerald)',
          'emerald-light': 'var(--accent-emerald-light)',
          rose: 'var(--accent-rose)',
          sky: 'var(--accent-sky)',
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
