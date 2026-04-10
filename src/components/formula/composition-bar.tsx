'use client';

import { cn } from '@/lib/utils';

interface Segment {
  name: string;
  pct: number;
  color: string;
}

interface CompositionBarProps {
  segments: Segment[];
  showLegend?: boolean;
  className?: string;
}

export function CompositionBar({ segments, showLegend = true, className }: CompositionBarProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="h-3 rounded-full overflow-hidden flex bg-surface-elevated" role="img" aria-label="Batch composition">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
            style={{ width: `${seg.pct * 100}%`, background: seg.color }}
            title={`${seg.name}: ${(seg.pct * 100).toFixed(1)}%`}
          />
        ))}
      </div>

      {showLegend && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-muted">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
              {seg.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
