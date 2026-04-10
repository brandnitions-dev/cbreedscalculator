'use client';

import { cn } from '@/lib/utils';

interface BenefitScore {
  name: string;
  score: number;
  color: string;
}

interface BenefitBarsProps {
  scores: BenefitScore[];
  maxItems?: number;
  className?: string;
}

export function BenefitBars({ scores, maxItems = 6, className }: BenefitBarsProps) {
  const sorted = [...scores].sort((a, b) => b.score - a.score).slice(0, maxItems);
  const maxScore = sorted.length ? sorted[0].score : 1;

  return (
    <div className={cn('space-y-2', className)}>
      {sorted.map(entry => {
        const width = Math.round((entry.score / maxScore) * 100);
        return (
          <div key={entry.name} className="flex items-center gap-3">
            <span className="text-[11px] text-text-tertiary w-24 text-right capitalize">{entry.name}</span>
            <div className="flex-1 h-2 rounded-full bg-surface-elevated overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${width}%`, background: entry.color }}
              />
            </div>
          </div>
        );
      })}
      {!sorted.length && (
        <p className="text-xs text-text-muted text-center py-4">Add ingredients to see benefit profile</p>
      )}
    </div>
  );
}
