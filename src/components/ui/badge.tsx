'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'gold' | 'emerald' | 'rose' | 'indigo' | 'amber' | 'sky' | 'outline';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-surface-elevated text-text-secondary',
  gold: 'bg-gradient-to-r from-accent-gold to-yellow-600 text-text-inverse font-bold',
  emerald: 'bg-accent-emerald/20 text-accent-emerald-light',
  rose: 'bg-accent-rose/20 text-accent-rose',
  indigo: 'bg-accent-indigo/20 text-accent-indigo-light',
  amber: 'bg-accent-gold/20 text-accent-gold-light',
  sky: 'bg-accent-sky/20 text-accent-sky',
  outline: 'border border-border-strong text-text-tertiary',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase', variants[variant], className)}>
      {children}
    </span>
  );
}
