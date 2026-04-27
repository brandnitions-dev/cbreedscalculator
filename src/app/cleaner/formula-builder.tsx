'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { IngredientChipGrid, CompositionBar, RatioBars, BenefitBars, ExportCardActions, FormulaSaveBar } from '@/components/formula';
import { useIngredientGroups } from '@/lib/use-ingredient-groups';
import { calcFormula, FB_COLORS, BENEFIT_LABELS, FB_BENEFIT_COLORS } from '@/lib/formula-engine';
import type { PoolRow, Ingredient } from '@/types';

function toIngredient(i: { slug: string; name: string; desc: string; benefits: Record<string, number>; tips: { low: string; mid: string; high: string }; potency: Ingredient['potency'] | null }): Ingredient {
  return { id: i.slug, name: i.name, desc: i.desc, benefits: i.benefits ?? {}, tips: i.tips ?? { low: '', mid: '', high: '' }, potency: i.potency ?? undefined };
}

let idCounter = 200;

export function CleanerFormulaBuilder() {
  const { groups } = useIngredientGroups('CLEANER');
  const db = useMemo(() => {
    const byKey = new Map(groups?.map(g => [g.key, g.ingredients.map(x => toIngredient(x))]) ?? []);
    return {
      a: byKey.get('carriers_a') ?? [],
      b: byKey.get('actives_b') ?? [],
      c: byKey.get('exfoliants_c') ?? [],
      eo: byKey.get('essential_oils') ?? [],
    };
  }, [groups]);

  const POOL_DEFS = useMemo(() => ([
    { key: 'c' as const, label: 'Physical Exfoliants (C)', data: db.c, max: 3, color: '#C4A574' },
    { key: 'a' as const, label: 'Carrier Oils (A)', data: db.a, max: 4, color: '#85B7EB' },
    { key: 'b' as const, label: 'Active Botanicals (B)', data: db.b, max: 3, color: '#D85A30' },
    { key: 'eo' as const, label: 'Essential Oils', data: db.eo, max: 12, color: '#534AB7' },
  ]), [db]);

  const [mode, setMode] = useState<'face' | 'body'>('body');
  const [batchSize, setBatchSize] = useState(100);
  const [beeswaxOn, setBeeswaxOn] = useState(true);
  const [cPct, setCPct] = useState(8);
  const [expandedIds, setExpandedIds] = useState<Record<string, number | null>>({});
  const [pools, setPools] = useState<{ a: PoolRow[]; b: PoolRow[]; c: PoolRow[]; eo: PoolRow[] }>({
    a: [], b: [],
    c: [],
    eo: [],
  });

  useEffect(() => {
    const allowA = new Set(db.a.map(x => x.id));
    const allowB = new Set(db.b.map(x => x.id));
    const allowC = new Set(db.c.map(x => x.id));
    const allowEo = new Set(db.eo.map(x => x.id));
    setPools(p => ({
      a: p.a.filter(r => allowA.has(r.ingId)),
      b: p.b.filter(r => allowB.has(r.ingId)),
      c: p.c.filter(r => allowC.has(r.ingId)),
      eo: p.eo.filter(r => allowEo.has(r.ingId)),
    }));
  }, [db]);

  const formula = useMemo(() =>
    calcFormula(mode, 'scrub', pools, cPct / 100, beeswaxOn),
    [mode, pools, cPct, beeswaxOn]
  );

  const toggleIng = useCallback((pool: 'a' | 'b' | 'c' | 'eo', ingId: string) => {
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

  const removeIng = useCallback((pool: 'a' | 'b' | 'c' | 'eo', rowId: number) => {
    setPools(prev => ({ ...prev, [pool]: prev[pool].filter(r => r.id !== rowId) }));
  }, []);

  const updateWeight = useCallback((pool: 'a' | 'b' | 'c' | 'eo', rowId: number, weight: number) => {
    setPools(prev => ({
      ...prev,
      [pool]: prev[pool].map(r => r.id === rowId ? { ...r, weight } : r),
    }));
  }, []);

  const allLayers = useMemo(() => [
    ...formula.fixed.map(f => ({ name: f.name, pct: f.pct, color: f.color })),
    ...formula.aSplit.map((r, i) => ({ name: db.a.find(x => x.id === r.ingId)?.name || 'A', pct: r.pct, color: FB_COLORS[`a${i}`] || '#85B7EB' })),
    ...formula.bSplit.map((r, i) => ({ name: db.b.find(x => x.id === r.ingId)?.name || 'B', pct: r.pct, color: FB_COLORS[`b${i}`] || '#D85A30' })),
    ...formula.cSplit.map((r, i) => ({ name: db.c.find(x => x.id === r.ingId)?.name || 'C', pct: r.pct, color: FB_COLORS[`c${i}`] || '#C4A574' })),
    ...formula.eoSplit.map((r, i) => ({ name: db.eo.find(x => x.id === r.ingId)?.name || 'EO', pct: r.pct, color: FB_COLORS[`eo${i}`] || '#534AB7' })),
  ], [formula, db]);

  const ratioItems = useMemo(() => allLayers.map(l => ({
    name: l.name, pct: l.pct, ml: l.pct * batchSize, color: l.color,
  })), [allLayers, batchSize]);

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
    addScores(formula.aSplit, db.a, 1);
    addScores(formula.bSplit, db.b, 1.5);
    addScores(formula.cSplit, db.c, 1);
    addScores(formula.eoSplit, db.eo, 2);
    const maxScore = Math.max(...Object.values(scores), 0.001);
    return BENEFIT_LABELS
      .filter(b => scores[b] > 0)
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, 8)
      .map(b => ({ name: b.replace('anti', 'anti-'), score: Math.round((scores[b] / maxScore) * 100), color: FB_BENEFIT_COLORS[b] || '#888' }));
  }, [formula, db]);

  const getSplit = (key: string) => {
    if (key === 'a') return formula.aSplit;
    if (key === 'b') return formula.bSplit;
    if (key === 'c') return formula.cSplit;
    return formula.eoSplit;
  };

  const getSnapshot = useCallback(
    () => ({
      v: 1 as const,
      mode,
      beeswaxOn,
      cPct,
      pools: {
        a: pools.a.map(({ ingId, weight }) => ({ ingId, weight })),
        b: pools.b.map(({ ingId, weight }) => ({ ingId, weight })),
        c: pools.c.map(({ ingId, weight }) => ({ ingId, weight })),
        eo: pools.eo.map(({ ingId, weight }) => ({ ingId, weight })),
      },
    }),
    [mode, beeswaxOn, cPct, pools],
  );

  const onLoaded = useCallback(
    (ingredients: unknown, b: number, m: string | null) => {
      const s = ingredients as {
        v: number;
        mode?: 'face' | 'body';
        beeswaxOn: boolean;
        cPct: number;
        pools: { a: { ingId: string; weight: number }[]; b: { ingId: string; weight: number }[]; c: { ingId: string; weight: number }[]; eo: { ingId: string; weight: number }[] };
      };
      if (!s || s.v !== 1 || !s.pools) return;
      setBatchSize(b);
      if (s.mode === 'face' || s.mode === 'body') setMode(s.mode);
      else if (m === 'face' || m === 'body') setMode(m);
      setBeeswaxOn(s.beeswaxOn);
      if (typeof s.cPct === 'number' && s.cPct >= 5 && s.cPct <= 15) setCPct(s.cPct);
      idCounter = 200;
      let c = 200;
      const allowA = new Set(db.a.map(x => x.id));
      const allowB = new Set(db.b.map(x => x.id));
      const allowC = new Set(db.c.map(x => x.id));
      const allowEo = new Set(db.eo.map(x => x.id));
      const mapPool = (rows: { ingId: string; weight: number }[], allow: Set<string>) =>
        rows.filter(r => allow.has(r.ingId)).map(r => ({ id: c++, ingId: r.ingId, weight: r.weight }));
      setPools({
        a: mapPool(s.pools.a, allowA),
        b: mapPool(s.pools.b, allowB),
        c: mapPool(s.pools.c, allowC),
        eo: mapPool(s.pools.eo, allowEo),
      });
      idCounter = c;
    },
    [db],
  );

  return (
    <div className="space-y-5">
      <FormulaSaveBar
        productType="CLEANER"
        getSnapshot={getSnapshot}
        batchSize={batchSize}
        mode={mode}
        onLoaded={onLoaded}
      />
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

          {/* Ingredient Pools — Chip Grid UX */}
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
                  pctLabel={`${(totalPct * 100).toFixed(1)}% of batch`}
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
          <GlassCard id="cleaner-composition-card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Composition</h3>
              <ExportCardActions targetId="cleaner-composition-card" filename="mosskyn-cleaner-composition" />
            </div>
            <CompositionBar segments={allLayers.map(l => ({ name: l.name, pct: l.pct, color: l.color }))} />
          </GlassCard>

          <GlassCard id="cleaner-ratio-card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Ratio Breakdown</h3>
              <ExportCardActions targetId="cleaner-ratio-card" filename="mosskyn-cleaner-ratio-breakdown" />
            </div>
            <RatioBars items={ratioItems} />
          </GlassCard>

          <GlassCard id="cleaner-benefits-card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Benefit Profile</h3>
              <ExportCardActions targetId="cleaner-benefits-card" filename="mosskyn-cleaner-benefit-profile" />
            </div>
            <BenefitBars scores={benefitScores} maxItems={8} />
          </GlassCard>

          <GlassCard id="cleaner-production-card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Production Steps</h3>
              <ExportCardActions targetId="cleaner-production-card" filename="mosskyn-cleaner-production-steps" />
            </div>
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

          <GlassCard id="cleaner-batch-card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Batch Stats</h3>
              <ExportCardActions targetId="cleaner-batch-card" filename="mosskyn-cleaner-batch-stats" />
            </div>
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
