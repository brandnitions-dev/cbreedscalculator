'use client';

import { cn } from '@/lib/utils';

interface RatioItem {
  name: string;
  pct: number;
  ml: number;
  color: string;
}

interface RatioBarsProps {
  items: RatioItem[];
  className?: string;
}

export function RatioBars({ items, className }: RatioBarsProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
          <span className="text-text-secondary w-28 truncate">{item.name}</span>
          <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${item.pct * 100}%`, background: item.color }}
            />
          </div>
          <span className="text-text-muted w-12 text-right">{item.ml.toFixed(1)}ml</span>
          <span className="text-text-muted w-10 text-right">{(item.pct * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}
