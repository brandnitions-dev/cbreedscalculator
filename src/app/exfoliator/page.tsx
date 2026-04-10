'use client';

import { useState, useMemo, useCallback } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { IngredientPool, CompositionBar, RatioBars } from '@/components/formula';
import { CARRIERS_A } from '@/lib/ingredients/carriers-a';
import { ACTIVES_B } from '@/lib/ingredients/actives-b';
import { EXFOLIANTS_C } from '@/lib/ingredients/exfoliants-c';
import { ESSENTIAL_OILS } from '@/lib/ingredients/essential-oils';
import { calcFormula, FB_COLORS } from '@/lib/formula-engine';
import type { PoolRow } from '@/types';

const POOL_DEFS = [
  { key: 'c' as const, label: 'Exfoliants (C)', data: EXFOLIANTS_C, max: 3, color: '#C4A574' },
  { key: 'a' as const, label: 'Carrier Oils (A)', data: CARRIERS_A, max: 4, color: '#85B7EB' },
  { key: 'b' as const, label: 'Active Botanicals (B)', data: ACTIVES_B, max: 3, color: '#D85A30' },
  { key: 'eo' as const, label: 'Essential Oils', data: ESSENTIAL_OILS, max: 12, color: '#534AB7' },
];

let idCounter = 100;

export default function ExfoliatorCalculator() {
  const [mode, setMode] = useState<'face' | 'body'>('body');
  const [batchSize, setBatchSize] = useState(100);
  const [beeswaxOn, setBeeswaxOn] = useState(true);
  const [cPct, setCPct] = useState(8);
  const [pools, setPools] = useState<{ a: PoolRow[]; b: PoolRow[]; c: PoolRow[]; eo: PoolRow[] }>({
    a: [], b: [],
    c: [{ id: idCounter++, ingId: 'sugar', weight: 5 }],
    eo: [],
  });

  const formula = useMemo(() =>
    calcFormula(mode, 'scrub', pools, cPct / 100, beeswaxOn),
    [mode, pools, cPct, beeswaxOn]
  );

  const addIng = useCallback((pool: 'a' | 'b' | 'c' | 'eo') => {
    const def = POOL_DEFS.find(d => d.key === pool)!;
    setPools(prev => {
      if (prev[pool].length >= def.max) return prev;
      const used = prev[pool].map(r => r.ingId);
      const avail = def.data.filter(i => !used.includes(i.id));
      if (!avail.length) return prev;
      return { ...prev, [pool]: [...prev[pool], { id: idCounter++, ingId: avail[0].id, weight: 5 }] };
    });
  }, []);

  const removeIng = useCallback((pool: 'a' | 'b' | 'c' | 'eo', id: number) => {
    setPools(prev => ({ ...prev, [pool]: prev[pool].filter(r => r.id !== id) }));
  }, []);

  const updateIng = useCallback((pool: 'a' | 'b' | 'c' | 'eo', id: number, key: string, val: string | number) => {
    setPools(prev => ({
      ...prev,
      [pool]: prev[pool].map(r => r.id === id ? { ...r, [key]: val } : r),
    }));
  }, []);

  const allLayers = useMemo(() => [
    ...formula.fixed.map(f => ({ name: f.name, pct: f.pct, color: f.color })),
    ...formula.aSplit.map((r, i) => ({ name: CARRIERS_A.find(x => x.id === r.ingId)?.name || 'A', pct: r.pct, color: FB_COLORS[`a${i}`] || '#85B7EB' })),
    ...formula.bSplit.map((r, i) => ({ name: ACTIVES_B.find(x => x.id === r.ingId)?.name || 'B', pct: r.pct, color: FB_COLORS[`b${i}`] || '#D85A30' })),
    ...formula.cSplit.map((r, i) => ({ name: EXFOLIANTS_C.find(x => x.id === r.ingId)?.name || 'C', pct: r.pct, color: FB_COLORS[`c${i}`] || '#C4A574' })),
    ...formula.eoSplit.map((r, i) => ({ name: ESSENTIAL_OILS.find(x => x.id === r.ingId)?.name || 'EO', pct: r.pct, color: FB_COLORS[`eo${i}`] || '#534AB7' })),
  ], [formula]);

  const ratioItems = useMemo(() => allLayers.map(l => ({
    name: l.name, pct: l.pct, ml: l.pct * batchSize, color: l.color,
  })), [allLayers, batchSize]);

  const getSplit = (key: string) => {
    if (key === 'a') return formula.aSplit;
    if (key === 'b') return formula.bSplit;
    if (key === 'c') return formula.cSplit;
    return formula.eoSplit;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md flex items-center justify-center bg-accent-gold/15 text-accent-gold-light">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Exfoliator Calculator</h1>
          <p className="text-sm text-text-secondary">Tallow-based scrub with physical exfoliant phase (C) and oil absorption chemistry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Left */}
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
                <input type="checkbox" checked={beeswaxOn} onChange={e => setBeeswaxOn(e.target.checked)} className="w-4 h-4 accent-accent-indigo" />
                Beeswax
              </label>
            </div>
            <div className="flex items-center gap-3 mb-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap">Batch</span>
              <input type="range" min={25} max={500} step={5} value={batchSize} onChange={e => setBatchSize(+e.target.value)} className="flex-1 accent-accent-indigo h-1.5" />
              <span className="text-sm font-bold text-accent-indigo-light min-w-[60px] text-right">{batchSize} ml</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap">C Phase</span>
              <input type="range" min={5} max={15} step={1} value={cPct} onChange={e => setCPct(+e.target.value)} className="flex-1 accent-accent-gold h-1.5" />
              <span className="text-sm font-bold text-accent-gold min-w-[40px] text-right">{cPct}%</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1.5">
              Exfoliant phase — base oils scale down to accommodate.
              {cPct >= 12 && <span className="text-accent-gold-light ml-1 font-medium">High — body use recommended</span>}
            </p>
          </GlassCard>

          {/* Ingredient Pools */}
          {POOL_DEFS.map(def => {
            const split = getSplit(def.key);
            const totalPct = split.reduce((s, r) => s + r.pct, 0);
            return (
              <GlassCard key={def.key}>
                <IngredientPool
                  label={def.label}
                  poolKey={def.key}
                  rows={pools[def.key]}
                  ingredients={def.data}
                  maxItems={def.max}
                  accentColor={def.color}
                  pctLabel={`${(totalPct * 100).toFixed(1)}% of batch`}
                  splits={split}
                  batchSize={batchSize}
                  onAdd={() => addIng(def.key)}
                  onRemove={(id) => removeIng(def.key, id)}
                  onChange={(id, key, val) => updateIng(def.key, id, key, val)}
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Production Steps</h3>
            <ol className="pl-5 text-[13px] text-text-secondary leading-[1.8] list-decimal">
              <li>Melt tallow{beeswaxOn ? ' + beeswax' : ''} in double boiler at 140°F</li>
              <li>Add jojoba and carrier oils (A); stir until uniform</li>
              <li>Remove from heat; cool to ~110°F</li>
              <li>Add active oils (B) and vitamin E</li>
              <li>Add essential oils at ~100°F; stir gently</li>
              <li>Fold in exfoliant (C) last — stir to suspend evenly</li>
              <li>Pour into jars immediately; tap to settle</li>
            </ol>
            {!beeswaxOn && (
              <div className="mt-3 flex items-start gap-2 rounded-md border border-accent-gold/30 bg-accent-gold/[0.06] px-3 py-2.5 text-xs text-accent-gold-light">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                No beeswax — scrub has no structural hold at room temp; will be a loose oil-paste.
              </div>
            )}
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
