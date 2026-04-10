'use client';

import { cn } from '@/lib/utils';
import type { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  gradient?: string;
  noPadding?: boolean;
}

export function GlassCard({ children, className, interactive, gradient, noPadding, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-surface-card backdrop-blur-md',
        !noPadding && 'p-5',
        interactive && 'cursor-pointer transition-all duration-200 hover:bg-surface-card-hover hover:border-border-strong hover:shadow-glow',
        className,
      )}
      style={gradient ? { background: gradient } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
