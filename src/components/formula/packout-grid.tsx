'use client';

import { cn } from '@/lib/utils';
import { Droplets } from 'lucide-react';

interface PackoutGridProps {
  batchSize: number;
  containerSize: number;
  containerLabel: string;
  icon?: 'jar' | 'bottle';
  className?: string;
}

export function PackoutGrid({ batchSize, containerSize, containerLabel, icon = 'jar', className }: PackoutGridProps) {
  const count = Math.floor(batchSize / containerSize);
  const remainder = batchSize % containerSize;
  const displayCount = Math.min(count, 24);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Pack-out</p>
          <h3 className="text-base font-bold text-text-primary">{containerSize} ml {containerLabel}</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-accent-indigo-light">{count}</span>
          <span className="text-xs text-text-muted ml-1">units</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="img" aria-label={`${count} ${containerLabel}`}>
        {Array.from({ length: displayCount }).map((_, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-xs bg-accent-indigo/15 border border-accent-indigo/20 flex items-center justify-center text-accent-indigo-light"
            title={`${containerLabel} ${i + 1}`}
          >
            <Droplets size={16} />
          </div>
        ))}
        {count > 24 && (
          <div className="w-9 h-9 rounded-xs bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-bold text-text-muted">
            +{count - 24}
          </div>
        )}
      </div>

      <p className="text-xs text-text-muted">
        <strong className="text-text-secondary">{count}</strong> full {containerLabel}s
        {remainder > 0 && <> · <strong className="text-accent-gold-light">{remainder.toFixed(1)} ml</strong> remainder</>}
        {remainder === 0 && <> · no remainder</>}
      </p>
    </div>
  );
}
