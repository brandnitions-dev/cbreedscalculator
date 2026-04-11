'use client';

import { useMemo } from 'react';
import { Check, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTipLevel } from '@/lib/formula-engine';

/* ── Types ──────────────────────────────────────────────────────────── */

interface ChipIngredient {
  id: string;
  name: string;
  desc: string;
  tips: { low: string; mid: string; high: string };
  potency?: string;
  color?: string;
  warn?: boolean;
  maxPct?: number;
}

interface SelectedItem {
  id: number;
  ingId: string;
  weight: number;
}

interface SplitItem {
  id: number;
  ingId: string;
  pct: number;
}

interface IngredientChipGridProps {
  label: string;
  poolKey: string;
  ingredients: ChipIngredient[];
  selected: SelectedItem[];
  splits: SplitItem[];
  maxItems: number;
  accentColor: string;
  pctLabel: string;
  batchSize: number;
  expandedId?: number | null;
  onToggle: (ingId: string) => void;
  onRemove: (rowId: number) => void;
  onWeightChange: (rowId: number, weight: number) => void;
  onExpandToggle?: (rowId: number | null) => void;
  className?: string;
}

/* ── Component ──────────────────────────────────────────────────────── */

export function IngredientChipGrid({
  label,
  poolKey,
  ingredients,
  selected,
  splits,
  maxItems,
  accentColor,
  pctLabel,
  batchSize,
  expandedId,
  onToggle,
  onRemove,
  onWeightChange,
  onExpandToggle,
  className,
}: IngredientChipGridProps) {
  const selectedIds = useMemo(() => new Set(selected.map(s => s.ingId)), [selected]);
  const isFull = selected.length >= maxItems;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: accentColor }} />
          <h3 className="text-sm font-semibold text-text-primary">{label}</h3>
          <span className="text-[11px] text-text-muted font-medium">
            {selected.length}/{maxItems}
          </span>
        </div>
        <span className="text-[11px] font-medium text-text-tertiary">{pctLabel}</span>
      </div>

      {/* Chip Grid — all ingredients as toggleable chips */}
      <div className="flex flex-wrap gap-1.5">
        {ingredients.map(ing => {
          const isSelected = selectedIds.has(ing.id);
          const isDisabled = !isSelected && isFull;

          return (
            <button
              key={ing.id}
              onClick={() => !isDisabled && onToggle(ing.id)}
              disabled={isDisabled}
              className={cn(
                'group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium border transition-all duration-200 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-accent-indigo/30',
                isSelected
                  ? 'border-transparent text-white shadow-sm'
                  : isDisabled
                    ? 'border-border-subtle bg-surface-card/30 text-text-muted cursor-not-allowed opacity-40'
                    : 'border-border bg-surface-card/50 text-text-secondary hover:border-border-strong hover:text-text-primary hover:bg-surface-card-hover'
              )}
              style={isSelected ? { background: accentColor } : undefined}
              title={ing.desc}
            >
              {isSelected && <Check size={12} className="shrink-0" />}
              {ing.warn && !isSelected && <AlertCircle size={10} className="shrink-0 text-accent-gold" />}
              <span className="whitespace-nowrap">{ing.name}</span>
              {ing.potency === 'strong' && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-accent-rose shrink-0" title="Strong potency" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Ingredient Detail Cards */}
      {selected.length > 0 && (
        <div className="space-y-2">
          {selected.map(row => {
            const ing = ingredients.find(i => i.id === row.ingId);
            if (!ing) return null;

            const sp = splits.find(s => s.id === row.id);
            const pct = sp ? (sp.pct * 100).toFixed(1) : '—';
            const ml = sp ? (sp.pct * batchSize).toFixed(1) : '—';
            const tipLevel = getTipLevel(row.weight);
            const tip = ing.tips[tipLevel];
            const isExpanded = expandedId === row.id;

            return (
              <div
                key={row.id}
                className={cn(
                  'rounded-md border transition-all duration-200',
                  isExpanded
                    ? 'border-border-strong bg-surface-elevated/60'
                    : 'border-border-subtle bg-surface-card/40 hover:border-border'
                )}
              >
                {/* Card header — always visible */}
                <div className="flex items-center gap-2.5 px-3 py-2.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ing.color || accentColor }} />
                  <span className="text-[12px] font-semibold text-text-primary flex-1 min-w-0 truncate">
                    {ing.name}
                  </span>

                  {/* Inline weight slider */}
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={row.weight}
                      onChange={e => onWeightChange(row.id, +e.target.value)}
                      className="w-16 h-1 accent-current"
                      style={{ color: accentColor }}
                    />
                  </div>

                  {/* Stats */}
                  <span className="text-[11px] font-bold min-w-[36px] text-right" style={{ color: accentColor }}>
                    {pct}%
                  </span>
                  <span className="text-[10px] text-text-muted min-w-[36px] text-right">
                    {ml}ml
                  </span>

                  {/* Expand / Remove */}
                  <button
                    onClick={() => onExpandToggle?.(isExpanded ? null : row.id)}
                    className="p-1 rounded-xs text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <button
                    onClick={() => onRemove(row.id)}
                    className="p-1 rounded-xs text-text-muted hover:text-accent-rose transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 space-y-2 border-t border-border-subtle/50">
                    <p className="text-[11px] text-text-tertiary leading-relaxed pt-2">{ing.desc}</p>
                    {tip && (
                      <div
                        className="text-[10px] px-2.5 py-1.5 rounded-xs border leading-relaxed"
                        style={{
                          borderColor: `${accentColor}30`,
                          background: `${accentColor}08`,
                          color: accentColor,
                        }}
                      >
                        <span className="font-bold uppercase tracking-wider mr-1">
                          {tipLevel}:
                        </span>
                        {tip}
                      </div>
                    )}
                    {ing.warn && (
                      <div className="flex items-start gap-1.5 text-[10px] text-accent-gold-light">
                        <AlertCircle size={11} className="shrink-0 mt-0.5" />
                        <span>This ingredient has safety limits. Check max concentration guidelines.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {selected.length === 0 && (
        <p className="text-[11px] text-text-muted text-center py-3">
          Click ingredients above to add them to your formula
        </p>
      )}
    </div>
  );
}
