'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { IngredientChipGrid, CompositionBar, RatioBars, BenefitBars, ExportCardActions, FormulaSaveBar } from '@/components/formula';
import { CARRIERS_A } from '@/lib/ingredients/carriers-a';
import { ACTIVES_B } from '@/lib/ingredients/actives-b';
import { ESSENTIAL_OILS } from '@/lib/ingredients/essential-oils';
import { useIngredientGroups } from '@/lib/use-ingredient-groups';
import { getDefaultBalmDermalForSlug, isBalmDermalMatch } from '@/lib/ingredients/balm-dermal-defaults';
import { calcFormula, FB_COLORS, BENEFIT_LABELS, FB_BENEFIT_COLORS } from '@/lib/formula-engine';
import type { PoolRow, Ingredient } from '@/types';

function toIngredient(i: { slug: string; name: string; desc: string; benefits: Record<string, number>; tips: { low: string; mid: string; high: string }; potency: Ingredient['potency'] | null }): Ingredient {
  return { id: i.slug, name: i.name, desc: i.desc, benefits: i.benefits ?? {}, tips: i.tips ?? { low: '', mid: '', high: '' }, potency: i.potency ?? undefined };
}

let idCounter = 0;

export function BalmFormulaBuilder() {
  const [dermalMode, setDermalMode] = useState<'all' | 'dry' | 'oily'>('all');
  const { groups } = useIngredientGroups('BALM', dermalMode);

  const [mode, setMode] = useState<'face' | 'body'>('face');
  const [batchSize, setBatchSize] = useState(100);
  const [beeswaxOn, setBeeswaxOn] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Record<string, number | null>>({});
  const [pools, setPools] = useState<{ a: PoolRow[]; b: PoolRow[]; eo: PoolRow[] }>({
    a: [], b: [], eo: [],
  });

  const filterStatic = useCallback(
    (list: Ingredient[]) =>
      dermalMode === 'all'
        ? list
        : list.filter(ing => isBalmDermalMatch(getDefaultBalmDermalForSlug(ing.id), dermalMode)),
    [dermalMode],
  );

  const db = useMemo(() => {
    const byKey = new Map(groups?.map(g => [g.key, g.ingredients.map(x => toIngredient(x))]) ?? []);
    return {
      a: byKey.get('carriers_a') ?? filterStatic(CARRIERS_A),
      b: byKey.get('actives_b') ?? filterStatic(ACTIVES_B),
      eo: byKey.get('essential_oils') ?? filterStatic(ESSENTIAL_OILS),
    };
  }, [groups, filterStatic]);

  useEffect(() => {
    const allowA = new Set(db.a.map(x => x.id));
    const allowB = new Set(db.b.map(x => x.id));
    const allowEo = new Set(db.eo.map(x => x.id));
    setPools(p => ({
      a: p.a.filter(r => allowA.has(r.ingId)),
      b: p.b.filter(r => allowB.has(r.ingId)),
      eo: p.eo.filter(r => allowEo.has(r.ingId)),
    }));
  }, [db]);

  const POOLS_CONFIG = useMemo(() => ([
    { key: 'a' as const, label: 'Carrier Oils (A)', data: db.a, max: 4, color: '#85B7EB' },
    { key: 'b' as const, label: 'Active Botanicals (B)', data: db.b, max: 3, color: '#D85A30' },
    { key: 'eo' as const, label: 'Essential Oils', data: db.eo, max: 12, color: '#534AB7' },
  ]), [db]);

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
  }, [POOLS_CONFIG]);

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
    ...formula.aSplit.map((r, i) => ({ name: db.a.find(x => x.id === r.ingId)?.name || 'A', pct: r.pct, color: FB_COLORS[`a${i}`] || '#85B7EB' })),
    ...formula.bSplit.map((r, i) => ({ name: db.b.find(x => x.id === r.ingId)?.name || 'B', pct: r.pct, color: FB_COLORS[`b${i}`] || '#D85A30' })),
    ...formula.eoSplit.map((r, i) => ({ name: db.eo.find(x => x.id === r.ingId)?.name || 'EO', pct: r.pct, color: FB_COLORS[`eo${i}`] || '#534AB7' })),
  ], [formula, db]);

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
    addScores(formula.eoSplit, db.eo, 2);
    const maxScore = Math.max(...Object.values(scores), 0.001);
    return BENEFIT_LABELS
      .filter(b => scores[b] > 0)
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, 8)
      .map(b => ({ name: b.replace('anti', 'anti-'), score: Math.round((scores[b] / maxScore) * 100), color: FB_BENEFIT_COLORS[b] || '#888' }));
  }, [formula, db]);

  const ratioItems = useMemo(() => allLayers.map(l => ({
    name: l.name, pct: l.pct, ml: l.pct * batchSize, color: l.color,
  })), [allLayers, batchSize]);

  const getSnapshot = useCallback(
    () => ({
      v: 1 as const,
      mode,
      beeswaxOn,
      dermal: dermalMode,
      pools: {
        a: pools.a.map(({ ingId, weight }) => ({ ingId, weight })),
        b: pools.b.map(({ ingId, weight }) => ({ ingId, weight })),
        eo: pools.eo.map(({ ingId, weight }) => ({ ingId, weight })),
      },
    }),
    [mode, beeswaxOn, dermalMode, pools],
  );

  const onLoaded = useCallback(
    (ingredients: unknown, b: number, m: string | null) => {
      const s = ingredients as {
        v: number;
        mode?: 'face' | 'body';
        beeswaxOn: boolean;
        dermal?: 'all' | 'dry' | 'oily';
        pools: { a: { ingId: string; weight: number }[]; b: { ingId: string; weight: number }[]; eo: { ingId: string; weight: number }[] };
      };
      if (!s || s.v !== 1 || !s.pools) return;
      setBatchSize(b);
      if (s.dermal === 'all' || s.dermal === 'dry' || s.dermal === 'oily') setDermalMode(s.dermal);
      if (s.mode === 'face' || s.mode === 'body') setMode(s.mode);
      else if (m === 'face' || m === 'body') setMode(m);
      setBeeswaxOn(s.beeswaxOn);
      let c = 0;
      const mapPool = (rows: { ingId: string; weight: number }[]) =>
        rows.map(r => ({ id: ++c, ingId: r.ingId, weight: r.weight }));
      setPools({
        a: mapPool(s.pools.a),
        b: mapPool(s.pools.b),
        eo: mapPool(s.pools.eo),
      });
      idCounter = c + 1;
    },
    [],
  );

  return (
    <div className="space-y-5">
      <FormulaSaveBar
        productType="BALM"
        getSnapshot={getSnapshot}
        batchSize={batchSize}
        mode={mode}
        onLoaded={onLoaded}
      />
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
      <div className="space-y-5">
        <GlassCard>
          <p className="text-[11px] text-text-muted mb-2 font-medium uppercase tracking-wider">Fatty acid focus</p>
          <p className="text-xs text-text-secondary mb-2.5 leading-relaxed">
            Linoleic (LA) leans toward oily, acne-prone skin; α-linolenic (ALA) and similar lipids support dry, sensitive, barrier-focused work.
            “All” shows every Balm-tagged item; Dry/Oily limit the picker to that profile (plus universal picks).
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {(
              [
                { id: 'all' as const, label: 'All' },
                { id: 'dry' as const, label: 'Dry / sensitive (ALA-leaning)' },
                { id: 'oily' as const, label: 'Oily / acne (LA-leaning)' },
              ] as const
            ).map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDermalMode(opt.id)}
                className={cn(
                  'px-3 py-2 rounded-xs text-xs font-medium border transition-all',
                  dermalMode === opt.id
                    ? 'bg-accent-gold/15 border-accent-gold/40 text-accent-gold-light'
                    : 'bg-surface-input border-border text-text-tertiary hover:text-text-secondary hover:border-border-strong',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
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
        <GlassCard id="balm-composition-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Composition</h3>
            <ExportCardActions targetId="balm-composition-card" filename="mosskyn-balm-composition" />
          </div>
          <CompositionBar segments={allLayers.map(l => ({ name: l.name, pct: l.pct, color: l.color }))} />
        </GlassCard>
        <GlassCard id="balm-ratio-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Ratio Breakdown</h3>
            <ExportCardActions targetId="balm-ratio-card" filename="mosskyn-balm-ratio-breakdown" />
          </div>
          <RatioBars items={ratioItems} />
        </GlassCard>
        <GlassCard id="balm-benefits-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Benefit Profile</h3>
            <ExportCardActions targetId="balm-benefits-card" filename="mosskyn-balm-benefit-profile" />
          </div>
          <BenefitBars scores={benefitScores} maxItems={8} />
        </GlassCard>
        <GlassCard id="balm-batch-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Batch Stats</h3>
            <ExportCardActions targetId="balm-batch-card" filename="mosskyn-balm-batch-stats" />
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
