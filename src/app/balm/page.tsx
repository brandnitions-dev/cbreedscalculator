'use client';

import { useState, useMemo, useCallback } from 'react';
import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { IngredientPool, CompositionBar, RatioBars, BenefitBars, PackoutGrid } from '@/components/formula';
import { CARRIERS_A } from '@/lib/ingredients/carriers-a';
import { ACTIVES_B } from '@/lib/ingredients/actives-b';
import { ESSENTIAL_OILS } from '@/lib/ingredients/essential-oils';
import { calcFormula, FB_COLORS, BENEFIT_LABELS, FB_BENEFIT_COLORS, getTipLevel, sqrtBarWidth } from '@/lib/formula-engine';
import type { PoolRow, Ingredient, FormulaResult } from '@/types';

const POOLS_CONFIG = {
  a: { label: 'Carrier Oils (A)', data: CARRIERS_A, max: 4, color: '#85B7EB' },
  b: { label: 'Active Botanicals (B)', data: ACTIVES_B, max: 3, color: '#D85A30' },
  eo: { label: 'Essential Oils', data: ESSENTIAL_OILS, max: 12, color: '#534AB7' },
};

let idCounter = 0;

export default function BalmCalculator() {
  const [mode, setMode] = useState<'face' | 'body'>('face');
  const [batchSize, setBatchSize] = useState(100);
  const [beeswaxOn, setBeeswaxOn] = useState(true);
  const [pools, setPools] = useState<{ a: PoolRow[]; b: PoolRow[]; eo: PoolRow[] }>({
    a: [], b: [], eo: [],
  });

  const formula = useMemo(() =>
    calcFormula(mode, 'balm', { ...pools, c: [] }, 0.08, beeswaxOn),
    [mode, pools, beeswaxOn]
  );

  const addIng = useCallback((pool: 'a' | 'b' | 'eo') => {
    const config = POOLS_CONFIG[pool];
    setPools(prev => {
      if (prev[pool].length >= config.max) return prev;
      const used = prev[pool].map(r => r.ingId);
      const avail = config.data.filter(i => !used.includes(i.id));
      if (!avail.length) return prev;
      return { ...prev, [pool]: [...prev[pool], { id: idCounter++, ingId: avail[0].id, weight: 5 }] };
    });
  }, []);

  const removeIng = useCallback((pool: 'a' | 'b' | 'eo', id: number) => {
    setPools(prev => ({ ...prev, [pool]: prev[pool].filter(r => r.id !== id) }));
  }, []);

  const updateIng = useCallback((pool: 'a' | 'b' | 'eo', id: number, key: 'ingId' | 'weight', val: string | number) => {
    setPools(prev => ({
      ...prev,
      [pool]: prev[pool].map(r => r.id === id ? { ...r, [key]: val } : r),
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
      .map(b => ({
        name: b.replace('anti', 'anti-'),
        score: Math.round((scores[b] / maxScore) * 100),
        color: FB_BENEFIT_COLORS[b] || '#888',
      }));
  }, [formula]);

  const ratioItems = useMemo(() => allLayers.map(l => ({
    name: l.name, pct: l.pct, ml: l.pct * batchSize, color: l.color,
  })), [allLayers, batchSize]);

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md flex items-center justify-center bg-accent-indigo/15 text-accent-indigo-light">
          <FlaskConical size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Tallow Balm Calculator</h1>
          <p className="text-sm text-text-secondary">Formulate skin balms with tallow, jojoba, beeswax, carrier oils, actives &amp; EOs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Left: Controls + Pools */}
        <div className="space-y-5">
          {/* Settings */}
          <GlassCard>
            <div className="flex gap-3 flex-wrap items-center mb-3.5">
              <div className="flex gap-1.5">
                {(['face', 'body'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      'px-3 py-2 rounded-xs text-xs font-medium border transition-all',
                      mode === m
                        ? 'bg-accent-indigo/15 border-accent-indigo/30 text-accent-indigo-light'
                        : 'bg-surface-input border-border text-text-tertiary hover:text-text-secondary hover:border-border-strong'
                    )}
                  >
                    {m === 'face' ? 'Face (1% EO)' : 'Body (2% EO)'}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-[13px] cursor-pointer text-text-secondary">
                <input
                  type="checkbox"
                  checked={beeswaxOn}
                  onChange={e => setBeeswaxOn(e.target.checked)}
                  className="w-4 h-4 accent-accent-indigo"
                />
                Beeswax (8%)
              </label>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap">Batch</span>
              <input
                type="range"
                min={25}
                max={500}
                step={5}
                value={batchSize}
                onChange={e => setBatchSize(+e.target.value)}
                className="flex-1 accent-accent-indigo h-1.5"
              />
              <span className="text-sm font-bold text-accent-indigo-light min-w-[60px] text-right">{batchSize} ml</span>
            </div>
          </GlassCard>

          {/* Ingredient Pools */}
          {(Object.keys(POOLS_CONFIG) as Array<'a' | 'b' | 'eo'>).map(pool => {
            const config = POOLS_CONFIG[pool];
            const split = pool === 'a' ? formula.aSplit : pool === 'b' ? formula.bSplit : formula.eoSplit;
            const totalPct = split.reduce((s, r) => s + r.pct, 0);
            return (
              <GlassCard key={pool}>
                <IngredientPool
                  label={config.label}
                  poolKey={pool}
                  rows={pools[pool]}
                  ingredients={config.data}
                  maxItems={config.max}
                  accentColor={config.color}
                  pctLabel={`${(totalPct * 100).toFixed(1)}% of batch`}
                  splits={split}
                  batchSize={batchSize}
                  onAdd={() => addIng(pool)}
                  onRemove={(id) => removeIng(pool, id)}
                  onChange={(id, key, val) => updateIng(pool, id, key, val)}
                />
              </GlassCard>
            );
          })}
        </div>

        {/* Right: Results */}
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
    </div>
  );
}
