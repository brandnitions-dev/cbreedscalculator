'use client';

import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { IngredientChipGrid, CompositionBar, RatioBars, BenefitBars } from '@/components/formula';
import { CARRIERS_A } from '@/lib/ingredients/carriers-a';
import { ACTIVES_B } from '@/lib/ingredients/actives-b';
import { ESSENTIAL_OILS } from '@/lib/ingredients/essential-oils';
import { calcFormula, FB_COLORS, BENEFIT_LABELS, FB_BENEFIT_COLORS } from '@/lib/formula-engine';
import type { PoolRow, Ingredient } from '@/types';

const POOLS_CONFIG = [
  { key: 'a' as const, label: 'Carrier Oils (A)', data: CARRIERS_A, max: 4, color: '#85B7EB' },
  { key: 'b' as const, label: 'Active Botanicals (B)', data: ACTIVES_B, max: 3, color: '#D85A30' },
  { key: 'eo' as const, label: 'Essential Oils', data: ESSENTIAL_OILS, max: 12, color: '#534AB7' },
];

let idCounter = 0;

export function BalmFormulaBuilder() {
  const [mode, setMode] = useState<'face' | 'body'>('face');
  const [batchSize, setBatchSize] = useState(100);
  const [beeswaxOn, setBeeswaxOn] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Record<string, number | null>>({});
  const [pools, setPools] = useState<{ a: PoolRow[]; b: PoolRow[]; eo: PoolRow[] }>({
    a: [], b: [], eo: [],
  });

  const formula = useMemo(() =>
    calcFormula(mode, 'balm', { ...pools, c: [] }, 0.08, beeswaxOn),
    [mode, pools, beeswaxOn]
  );

  const toggleIng = useCallback((pool: 'a' | 'b' | 'eo', ingId: string) => {
    setPools(prev => {
      const existing = prev[pool].find(r => r.ingId === ingId);
      if (existing) {
        return { ...prev, [pool]: prev[pool].filter(r => r.ingId !== ingId) };
      }
      const config = POOLS_CONFIG.find(c => c.key === pool)!;
      if (prev[pool].length >= config.max) return prev;
      return { ...prev, [pool]: [...prev[pool], { id: idCounter++, ingId, weight: 5 }] };
    });
  }, []);

  const removeIng = useCallback((pool: 'a' | 'b' | 'eo', rowId: number) => {
    setPools(prev => ({ ...prev, [pool]: prev[pool].filter(r => r.id !== rowId) }));
  }, []);

  const updateWeight = useCallback((pool: 'a' | 'b' | 'eo', rowId: number, weight: number) => {
    setPools(prev => ({
      ...prev,
      [pool]: prev[pool].map(r => r.id === rowId ? { ...r, weight } : r),
    }));
  }, []);

  const allLayers = useMemo(() => [
    ...formula.fixed.map(f => ({ name: f.name, pct: f.pct, color: f.color })),
    ...formula.aSplit.map((r, i) => ({ name: CARRIERS_A.find(x => x.id === r.ingId)?.name || 'A', pct: r.pct, color: FB_COLORS[`a${i}`] || '#85B7EB' })),
    ...formula.bSplit.map((r, i) => ({ name: ACTIVES_B.find(x => x.id === r.ingId)?.name || 'B', pct: r.pct, color: FB_COLORS[`b${i}`] || '#D85A30' })),
    ...formula.eoSplit.map((r, i) => ({ name: ESSENTIAL_OILS.find(x => x.id === r.ingId)?.name || 'EO', pct: r.pct, color: FB_COLORS[`eo${i}`] || '#534AB7' })),
  ], [formula]);

  const benefitScores = useMemo(() => {
    const scores: Record<string, number> = {};
    BENEFIT_LABELS.forEach(b => scores[b] = 0);
    const addScores = (list: typeof formula.aSplit, data: Ingredient[], w: number) => {
      list.forEach(r => {
        const ing = data.find(x => x.id === r.ingId);
        if (!ing) return;
        Object.entries(ing.benefits).forEach(([b, v]) => { scores[b] = (scores[b] || 0) + v * r.pct * w; });
      });
    };
    addScores(formula.aSplit, CARRIERS_A, 1);
    addScores(formula.bSplit, ACTIVES_B, 1.5);
    addScores(formula.eoSplit, ESSENTIAL_OILS, 2);
    const maxScore = Math.max(...Object.values(scores), 0.001);
    return BENEFIT_LABELS
      .filter(b => scores[b] > 0)
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, 8)
      .map(b => ({ name: b.replace('anti', 'anti-'), score: Math.round((scores[b] / maxScore) * 100), color: FB_BENEFIT_COLORS[b] || '#888' }));
  }, [formula]);

  const ratioItems = useMemo(() => allLayers.map(l => ({
    name: l.name, pct: l.pct, ml: l.pct * batchSize, color: l.color,
  })), [allLayers, batchSize]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
      <div className="space-y-5">
        <GlassCard>
          <div className="flex gap-3 flex-wrap items-center mb-3.5">
            <div className="flex gap-1.5">
              {(['face', 'body'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} className={cn(
                  'px-3 py-2 rounded-xs text-xs font-medium border transition-all',
                  mode === m ? 'bg-accent-indigo/15 border-accent-indigo/30 text-accent-indigo-light' : 'bg-surface-input border-border text-text-tertiary hover:text-text-secondary hover:border-border-strong'
                )}>{m === 'face' ? 'Face (1% EO)' : 'Body (2% EO)'}</button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-[13px] cursor-pointer text-text-secondary">
              <input type="checkbox" checked={beeswaxOn} onChange={e => setBeeswaxOn(e.target.checked)} className="w-4 h-4 accent-accent-indigo" />
              Beeswax (8%)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap">Batch</span>
            <input type="range" min={25} max={500} step={5} value={batchSize} onChange={e => setBatchSize(+e.target.value)} className="flex-1 accent-accent-indigo h-1.5" />
            <span className="text-sm font-bold text-accent-indigo-light min-w-[60px] text-right">{batchSize} ml</span>
          </div>
        </GlassCard>

        {POOLS_CONFIG.map(cfg => {
          const split = cfg.key === 'a' ? formula.aSplit : cfg.key === 'b' ? formula.bSplit : formula.eoSplit;
          const totalPct = split.reduce((s, r) => s + r.pct, 0);
          return (
            <GlassCard key={cfg.key}>
              <IngredientChipGrid
                label={cfg.label} poolKey={cfg.key} ingredients={cfg.data}
                selected={pools[cfg.key]} splits={split} maxItems={cfg.max}
                accentColor={cfg.color} pctLabel={`${(totalPct * 100).toFixed(1)}% of batch`}
                batchSize={batchSize} expandedId={expandedIds[cfg.key] ?? null}
                onToggle={(ingId) => toggleIng(cfg.key, ingId)}
                onRemove={(rowId) => removeIng(cfg.key, rowId)}
                onWeightChange={(rowId, w) => updateWeight(cfg.key, rowId, w)}
                onExpandToggle={(id) => setExpandedIds(prev => ({ ...prev, [cfg.key]: id }))}
              />
            </GlassCard>
          );
        })}
      </div>

      <div className="space-y-5">
        <GlassCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Composition</h3>
          <CompositionBar segments={allLayers.map(l => ({ name: l.name, pct: l.pct, color: l.color }))} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Ratio Breakdown</h3>
          <RatioBars items={ratioItems} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Benefit Profile</h3>
          <BenefitBars scores={benefitScores} maxItems={8} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Batch Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center py-3 rounded-sm bg-surface-input/50 border border-border-subtle">
              <div className="text-2xl font-black text-accent-indigo-light">{batchSize}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-1">Total (ml)</div>
            </div>
            <div className="text-center py-3 rounded-sm bg-surface-input/50 border border-border-subtle">
              <div className="text-2xl font-black text-accent-gold">{Math.floor(batchSize / 50)}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-1">50ml Jars</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
