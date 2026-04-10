'use client';

import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import type { PoolRow } from '@/types';

interface PoolIngredient {
  id: string;
  name: string;
  desc: string;
  tips: { low: string; mid: string; high: string };
  potency?: string;
}

interface IngredientPoolProps {
  label: string;
  poolKey: string;
  rows: PoolRow[];
  ingredients: PoolIngredient[];
  maxItems: number;
  accentColor: string;
  pctLabel: string;
  splits: { id: number; pct: number }[];
  batchSize: number;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onChange: (id: number, key: 'ingId' | 'weight', val: string | number) => void;
}

function getTipLevel(weight: number): 'low' | 'mid' | 'high' {
  return weight <= 3 ? 'low' : weight <= 7 ? 'mid' : 'high';
}

export function IngredientPool({
  label, poolKey, rows, ingredients, maxItems, accentColor, pctLabel,
  splits, batchSize, onAdd, onRemove, onChange,
}: IngredientPoolProps) {
  const usedIds = rows.map(r => r.ingId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
        </div>
        <span className="text-[11px] text-text-muted font-medium">{pctLabel}</span>
      </div>

      {rows.map(row => {
        const ing = ingredients.find(i => i.id === row.ingId);
        const split = splits.find(s => s.id === row.id);
        const pct = split ? (split.pct * 100).toFixed(1) : '—';
        const ml = split ? (split.pct * batchSize).toFixed(1) : '—';
        const tipLevel = getTipLevel(row.weight);
        const tipText = ing?.tips?.[tipLevel] ?? '';

        return (
          <div key={row.id} className="rounded-sm border border-border-subtle bg-surface-card/50 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <select
                value={row.ingId}
                onChange={e => onChange(row.id, 'ingId', e.target.value)}
                className="flex-1 bg-surface-input border border-border rounded-xs px-3 py-1.5 text-sm text-text-primary focus:border-border-focus focus:outline-none transition-colors"
              >
                {ingredients.map(opt => (
                  <option key={opt.id} value={opt.id} disabled={usedIds.includes(opt.id) && opt.id !== row.ingId}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <span className="text-xs font-bold text-accent-indigo-light min-w-[48px] text-right">{pct}%</span>
              <span className="text-xs text-text-muted min-w-[48px] text-right">{ml}ml</span>
              <button
                onClick={() => onRemove(row.id)}
                className="p-1 rounded-xs text-text-muted hover:text-accent-rose hover:bg-accent-rose/10 transition-colors"
                aria-label="Remove"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-text-muted w-10">share</span>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={row.weight}
                onChange={e => onChange(row.id, 'weight', +e.target.value)}
                className="flex-1 accent-accent-indigo h-1"
              />
            </div>

            {ing && (
              <p className="text-xs text-text-tertiary leading-relaxed">{ing.desc}</p>
            )}

            {tipText && (
              <p className={cn(
                'text-xs px-2.5 py-1.5 rounded-xs',
                tipLevel === 'low' && 'bg-accent-emerald/10 text-accent-emerald-light',
                tipLevel === 'mid' && 'bg-accent-gold/10 text-accent-gold-light',
                tipLevel === 'high' && (ing?.potency === 'strong'
                  ? 'bg-accent-rose/10 text-accent-rose'
                  : 'bg-accent-indigo/10 text-accent-indigo-light'),
              )}>
                {tipText}
              </p>
            )}
          </div>
        );
      })}

      {rows.length < maxItems && (
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-sm border border-dashed border-border-strong text-xs font-medium text-text-muted hover:text-accent-indigo-light hover:border-accent-indigo/30 hover:bg-accent-indigo/5 transition-all"
        >
          <Plus size={14} />
          Add {label.toLowerCase().replace(/ingredient \w — /, '')}
        </button>
      )}
    </div>
  );
}
