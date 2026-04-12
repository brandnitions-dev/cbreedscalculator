'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-md bg-surface-input border border-border">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'p-2 rounded-sm transition-all',
            theme === value
              ? 'bg-accent-indigo/15 text-accent-indigo-light'
              : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-elevated'
          )}
          title={label}
          aria-label={`Switch to ${label} mode`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
