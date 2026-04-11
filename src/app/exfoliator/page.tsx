'use client';

import { useState, useMemo, useCallback } from 'react';
import { Sparkles, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { IngredientChipGrid, CompositionBar, RatioBars, BenefitBars } from '@/components/formula';
import { OIL_CARRIERS, OIL_ACTIVES, OIL_EOS, OIL_PRESETS } from '@/lib/ingredients/treatment-oils';
import type { OilIngredient } from '@/lib/ingredients/treatment-oils';

/* ── Formula engine for tallow-free exfoliator ────────────────────── */

interface PoolRow { id: number; ingId: string; weight: number; }
interface SplitRow extends PoolRow { pct: number; }

function splitPool(rows: PoolRow[], totalPct: number): SplitRow[] {
  const tw = rows.reduce((s, r) => s + r.weight, 0) || 1;
  return rows.map(r => ({ ...r, pct: totalPct * r.weight / tw }));
}

function calcExfoliatorFormula(
  pools: { carriers: PoolRow[]; actives: PoolRow[]; eos: PoolRow[] },
  activePct: number,
  eoPct: number,
) {
  const carrierPct = 1 - activePct - eoPct;
  return {
    carrierSplit: splitPool(pools.carriers, Math.max(0, carrierPct)),
    activeSplit: splitPool(pools.actives, activePct),
    eoSplit: splitPool(pools.eos, eoPct),
  };
}

const BENEFIT_COLORS: Record<string, string> = {
  penetration: '#5DCAA5', sebumControl: '#85B7EB', stability: '#A7F3D0',
  extraction: '#34D399', moisturizing: '#1D9E75', acne: '#185FA5',
  lightness: '#BBF7D0', healing: '#5DCAA5', scarring: '#D85A30',
  antiinflammatory: '#0F6E56', antiaging: '#534AB7', barrier: '#639922',
  antimicrobial: '#6B4E9E', antifungal: '#2E6B5C', exfoliation: '#FCD34D',
  poreClearing: '#FDE68A', soothing: '#AFA9EC', softening: '#9FE1CB',
  antioxidant: '#BA7517', calming: '#ED93B1', firming: '#D4537E',
  bha: '#F87171', stimulating: '#86EFAC', balancing: '#FDA4AF',
  hormonal: '#A5B4FC', astringent: '#FDA4AF', viscosity: '#A7F3D0',
};

const POOL_DEFS = [
  { key: 'carriers' as const, label: 'Carrier Oils', data: OIL_CARRIERS, max: 6, color: '#5DCAA5' },
  { key: 'actives' as const, label: 'Active Ingredients', data: OIL_ACTIVES, max: 4, color: '#FCD34D' },
  { key: 'eos' as const, label: 'Essential Oils', data: OIL_EOS, max: 6, color: '#C4B5FD' },
];

let idCounter = 300;

export default function ExfoliatorCalculator() {
  const [batchSize, setBatchSize] = useState(100);
  const [activePct, setActivePct] = useState(0.05);
  const [eoPct, setEoPct] = useState(0.10);
  const [expandedIds, setExpandedIds] = useState<Record<string, number | null>>({});
  const [pools, setPools] = useState<{ carriers: PoolRow[]; actives: PoolRow[]; eos: PoolRow[] }>({
    carriers: [
      { id: idCounter++, ingId: 'jojoba', weight: 5 },
      { id: idCounter++, ingId: 'squalane', weight: 2 },
      { id: idCounter++, ingId: 'castor', weight: 2 },
      { id: idCounter++, ingId: 'grapeseed', weight: 1 },
    ],
    actives: [{ id: idCounter++, ingId: 'bisabolol', weight: 5 }],
    eos: [
      { id: idCounter++, ingId: 'wintergreen', weight: 2 },
      { id: idCounter++, ingId: 'teatree', weight: 2 },
      { id: idCounter++, ingId: 'frankincense', weight: 2 },
    ],
  });

  const formula = useMemo(() =>
    calcExfoliatorFormula(pools, activePct, eoPct),
    [pools, activePct, eoPct]
  );

  const toggleIng = useCallback((pool: 'carriers' | 'actives' | 'eos', ingId: string) => {
    setPools(prev => {
      const existing = prev[pool].find(r => r.ingId === ingId);
      if (existing) {
        return { ...prev, [pool]: prev[pool].filter(r => r.ingId !== ingId) };
      }
      const def = POOL_DEFS.find(d => d.key === pool)!;
      if (prev[pool].length >= def.max) return prev;
      return { ...prev, [pool]: [...prev[pool], { id: idCounter++, ingId, weight: 5 }] };
    });
  }, []);

  const removeIng = useCallback((pool: 'carriers' | 'actives' | 'eos', rowId: number) => {
    setPools(prev => ({ ...prev, [pool]: prev[pool].filter(r => r.id !== rowId) }));
  }, []);

  const updateWeight = useCallback((pool: 'carriers' | 'actives' | 'eos', rowId: number, weight: number) => {
    setPools(prev => ({
      ...prev,
      [pool]: prev[pool].map(r => r.id === rowId ? { ...r, weight } : r),
    }));
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = OIL_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setPools({
      carriers: preset.carriers.map(c => ({ id: idCounter++, ingId: c.ingId, weight: c.weight })),
      actives: preset.actives.map(a => ({ id: idCounter++, ingId: a.ingId, weight: a.weight })),
      eos: preset.eos.map(e => ({ id: idCounter++, ingId: e.ingId, weight: e.weight })),
    });
  }, []);

  const allLayers = useMemo(() => [
    ...formula.carrierSplit.map(r => ({
      name: OIL_CARRIERS.find(x => x.id === r.ingId)?.name || r.ingId,
      pct: r.pct,
      color: OIL_CARRIERS.find(x => x.id === r.ingId)?.color || '#5DCAA5',
    })),
    ...formula.activeSplit.map(r => ({
      name: OIL_ACTIVES.find(x => x.id === r.ingId)?.name || r.ingId,
      pct: r.pct,
      color: OIL_ACTIVES.find(x => x.id === r.ingId)?.color || '#FCD34D',
    })),
    ...formula.eoSplit.map(r => ({
      name: OIL_EOS.find(x => x.id === r.ingId)?.name || r.ingId,
      pct: r.pct,
      color: OIL_EOS.find(x => x.id === r.ingId)?.color || '#C4B5FD',
    })),
  ], [formula]);

  const ratioItems = useMemo(() => allLayers.map(l => ({
    name: l.name, pct: l.pct, ml: l.pct * batchSize, color: l.color,
  })), [allLayers, batchSize]);

  const benefitScores = useMemo(() => {
    const scores: Record<string, number> = {};
    const addScores = (splits: SplitRow[], data: OilIngredient[], w: number) => {
      splits.forEach(r => {
        const ing = data.find(x => x.id === r.ingId);
        if (!ing) return;
        Object.entries(ing.benefits).forEach(([b, v]) => {
          scores[b] = (scores[b] || 0) + v * r.pct * w;
        });
      });
    };
    addScores(formula.carrierSplit, OIL_CARRIERS, 1);
    addScores(formula.activeSplit, OIL_ACTIVES, 2);
    addScores(formula.eoSplit, OIL_EOS, 1.5);
    const maxScore = Math.max(...Object.values(scores), 0.001);
    return Object.entries(scores)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, v]) => ({
        name: name.replace(/([A-Z])/g, ' $1').trim(),
        score: Math.round((v / maxScore) * 100),
        color: BENEFIT_COLORS[name] || '#888',
      }));
  }, [formula]);

  const getSplit = (key: string) => {
    if (key === 'carriers') return formula.carrierSplit;
    if (key === 'actives') return formula.activeSplit;
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
          <p className="text-sm text-text-secondary">BHA penetrating oils &amp; clinical pore purge blends — no tallow, pure chemical exfoliation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Left */}
        <div className="space-y-5">
          {/* Presets */}
          <GlassCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Formula Base</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {OIL_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => loadPreset(p.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xs text-xs font-medium border border-border bg-surface-card/50 text-text-secondary hover:border-accent-gold/40 hover:text-accent-gold-light hover:bg-accent-gold/[0.06] transition-all"
                >
                  <Zap size={12} />
                  {p.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap">Batch</span>
              <input type="range" min={10} max={250} step={5} value={batchSize} onChange={e => setBatchSize(+e.target.value)} className="flex-1 accent-accent-indigo h-1.5" />
              <span className="text-sm font-bold text-accent-indigo-light min-w-[60px] text-right">{batchSize} ml</span>
            </div>
            <div className="flex items-center gap-3 mb-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap">Actives</span>
              <input type="range" min={0.01} max={0.15} step={0.005} value={activePct} onChange={e => setActivePct(+e.target.value)} className="flex-1 accent-accent-gold h-1.5" />
              <span className="text-sm font-bold text-accent-gold min-w-[40px] text-right">{(activePct * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap">EOs</span>
              <input type="range" min={0.03} max={0.15} step={0.005} value={eoPct} onChange={e => setEoPct(+e.target.value)} className="flex-1 accent-accent-violet h-1.5" />
              <span className="text-sm font-bold text-accent-violet min-w-[40px] text-right">{(eoPct * 100).toFixed(1)}%</span>
            </div>
          </GlassCard>

          {/* Ingredient Pools — Chip Grid */}
          {POOL_DEFS.map(def => {
            const split = getSplit(def.key);
            const totalPct = split.reduce((s, r) => s + r.pct, 0);
            return (
              <GlassCard key={def.key}>
                <IngredientChipGrid
                  label={def.label}
                  poolKey={def.key}
                  ingredients={def.data}
                  selected={pools[def.key]}
                  splits={split}
                  maxItems={def.max}
                  accentColor={def.color}
                  pctLabel={`${(totalPct * 100).toFixed(1)}%`}
                  batchSize={batchSize}
                  expandedId={expandedIds[def.key] ?? null}
                  onToggle={(ingId) => toggleIng(def.key, ingId)}
                  onRemove={(rowId) => removeIng(def.key, rowId)}
                  onWeightChange={(rowId, w) => updateWeight(def.key, rowId, w)}
                  onExpandToggle={(id) => setExpandedIds(prev => ({ ...prev, [def.key]: id }))}
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Production Steps</h3>
            <ol className="pl-5 text-[13px] text-text-secondary leading-[1.8] list-decimal">
              <li>Measure carrier oils into glass dropper bottle</li>
              <li>Add active ingredients; swirl gently to combine</li>
              <li>Add essential oils last; cap and invert 10x to mix</li>
              <li>Label with date, formula name, and shelf life</li>
              <li>Apply 3-5 drops to face; massage 60s in circular motions</li>
              <li>Steam or warm towel 2min; wipe — blackheads roll out</li>
            </ol>
            <div className="mt-3 flex items-start gap-2 rounded-md border border-accent-rose/30 bg-accent-rose/[0.06] px-3 py-2.5 text-xs text-accent-rose">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              Wintergreen contains methyl salicylate — never exceed 3%. Patch test 24h before first use.
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Batch Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center py-3 rounded-sm bg-surface-input/50 border border-border-subtle">
                <div className="text-2xl font-black text-accent-indigo-light">{batchSize}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-1">Total (ml)</div>
              </div>
              <div className="text-center py-3 rounded-sm bg-surface-input/50 border border-border-subtle">
                <div className="text-2xl font-black text-accent-gold">{Math.floor(batchSize / 30)}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-1">30ml Bottles</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
