'use client';

import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { IngredientPool, BeakerViz, RatioBars, BenefitBars, SynergyPanel, type SynergyNote } from '@/components/formula';
import { OIL_CARRIERS, OIL_ACTIVES, OIL_EOS, OIL_PRESETS, type OilIngredient } from '@/lib/ingredients/treatment-oils';
import type { PoolRow } from '@/types';

let idCounter = 100;

function splitPool(rows: PoolRow[], totalPct: number, ingredients: OilIngredient[]) {
  const tw = rows.reduce((s, r) => s + r.weight, 0) || 1;
  return rows.map(r => {
    const ing = ingredients.find(i => i.id === r.ingId);
    let pct = totalPct * r.weight / tw;
    if (ing?.maxPct && pct > ing.maxPct) pct = ing.maxPct;
    return { ...r, pct, color: ing?.color ?? '#ccc', name: ing?.name ?? 'Unknown' };
  });
}

const BENEFIT_COLORS: Record<string, string> = {
  penetration: '#5DCAA5', sebumControl: '#7DD3C0', extraction: '#A7F3D0',
  healing: '#FCA5A5', scarring: '#F87171', antimicrobial: '#86EFAC',
  exfoliation: '#FCD34D', soothing: '#FDE68A', antiinflammatory: '#34D399',
  acne: '#BBF7D0', bha: '#F87171', firming: '#C4B5FD', calming: '#DDD6FE',
  antioxidant: '#FBBF24', stability: '#A5F3FC', moisturizing: '#7DD3C0',
  poreClearing: '#FCD34D', softening: '#FEF3C7', lightness: '#BBF7D0',
  viscosity: '#A7F3D0', barrier: '#86EFAC', antiaging: '#C4B5FD',
  antifungal: '#34D399', stimulating: '#86EFAC', hormonal: '#A5B4FC',
  balancing: '#FDA4AF', astringent: '#FDA4AF',
};

export function OilFormulaBuilder() {
  const [batchSize, setBatchSize] = useState(100);
  const [formulaId, setFormulaId] = useState('bha_penetrating');
  const [pools, setPools] = useState<{ carrier: PoolRow[]; active: PoolRow[]; eo: PoolRow[] }>(() => {
    const preset = OIL_PRESETS[0];
    return {
      carrier: preset.carriers.map(c => ({ id: idCounter++, ingId: c.ingId, weight: c.weight })),
      active: preset.actives.map(a => ({ id: idCounter++, ingId: a.ingId, weight: a.weight })),
      eo: preset.eos.map(e => ({ id: idCounter++, ingId: e.ingId, weight: e.weight })),
    };
  });

  const loadPreset = useCallback((fid: string) => {
    setFormulaId(fid);
    const preset = OIL_PRESETS.find(p => p.id === fid);
    if (preset) {
      setPools({
        carrier: preset.carriers.map(c => ({ id: idCounter++, ingId: c.ingId, weight: c.weight })),
        active: preset.actives.map(a => ({ id: idCounter++, ingId: a.ingId, weight: a.weight })),
        eo: preset.eos.map(e => ({ id: idCounter++, ingId: e.ingId, weight: e.weight })),
      });
    } else {
      setPools({ carrier: [], active: [], eo: [] });
    }
  }, []);

  const carrierSplit = useMemo(() => splitPool(pools.carrier, 0.85, OIL_CARRIERS), [pools.carrier]);
  const activeSplit = useMemo(() => splitPool(pools.active, 0.05, OIL_ACTIVES), [pools.active]);
  const eoSplit = useMemo(() => splitPool(pools.eo, 0.10, OIL_EOS), [pools.eo]);

  const allSplits = useMemo(() => [...carrierSplit, ...activeSplit, ...eoSplit], [carrierSplit, activeSplit, eoSplit]);

  const ratioItems = useMemo(() => allSplits.map(s => ({
    name: s.name, pct: s.pct, ml: s.pct * batchSize, color: s.color,
  })), [allSplits, batchSize]);

  const beakerLayers = useMemo(() => allSplits.map(s => ({
    name: s.name, pct: s.pct, color: s.color,
  })), [allSplits]);

  const benefitScores = useMemo(() => {
    const scores: Record<string, number> = {};
    const process = (split: typeof carrierSplit, ings: OilIngredient[]) => {
      split.forEach(row => {
        const ing = ings.find(i => i.id === row.ingId);
        if (ing?.benefits) {
          Object.entries(ing.benefits).forEach(([k, v]) => {
            scores[k] = (scores[k] || 0) + v * row.pct * 10;
          });
        }
      });
    };
    process(carrierSplit, OIL_CARRIERS);
    process(activeSplit, OIL_ACTIVES);
    process(eoSplit, OIL_EOS);
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, score]) => ({
        name: name.replace(/([A-Z])/g, ' $1').trim(),
        score,
        color: BENEFIT_COLORS[name] || '#ccc',
      }));
  }, [carrierSplit, activeSplit, eoSplit]);

  const synergies = useMemo<SynergyNote[]>(() => {
    const notes: SynergyNote[] = [];
    const wintergreen = eoSplit.find(r => r.ingId === 'wintergreen');
    if (wintergreen && wintergreen.pct > 0.03) {
      notes.push({ type: 'warn', text: 'Wintergreen exceeds 3% — TOXIC. Reduce immediately.' });
    } else if (wintergreen && wintergreen.pct > 0.02) {
      notes.push({ type: 'caution', text: `Wintergreen at ${(wintergreen.pct * 100).toFixed(1)}% — approaching max safe limit.` });
    }
    const hasCastor = carrierSplit.some(r => r.ingId === 'castor');
    const hasSqualane = carrierSplit.some(r => r.ingId === 'squalane');
    if (hasCastor && hasSqualane) {
      notes.push({ type: 'good', text: 'Castor + Squalane — excellent extraction synergy, mimics steam + desincrustation.' });
    }
    const hasJojoba = carrierSplit.some(r => r.ingId === 'jojoba');
    if (hasJojoba) notes.push({ type: 'info', text: 'Jojoba mimics sebum — pores accept treatment readily.' });
    const hasRosehip = carrierSplit.some(r => r.ingId === 'rosehip');
    const hasVitE = activeSplit.some(r => r.ingId === 'vitaminE');
    if (hasRosehip && !hasVitE) {
      notes.push({ type: 'caution', text: 'Rosehip without Vitamin E — add tocopherol to prevent oxidation.' });
    }
    if (!notes.length) notes.push({ type: 'info', text: 'Add ingredients to see synergy notes and warnings.' });
    return notes;
  }, [carrierSplit, activeSplit, eoSplit]);

  const addIng = useCallback((pool: 'carrier' | 'active' | 'eo') => {
    const ings = pool === 'carrier' ? OIL_CARRIERS : pool === 'active' ? OIL_ACTIVES : OIL_EOS;
    const limits = { carrier: 5, active: 3, eo: 6 };
    setPools(prev => {
      if (prev[pool].length >= limits[pool]) return prev;
      const used = prev[pool].map(r => r.ingId);
      const avail = ings.filter(i => !used.includes(i.id));
      if (!avail.length) return prev;
      return { ...prev, [pool]: [...prev[pool], { id: idCounter++, ingId: avail[0].id, weight: 5 }] };
    });
  }, []);

  const removeIng = useCallback((pool: 'carrier' | 'active' | 'eo', id: number) => {
    setPools(prev => ({ ...prev, [pool]: prev[pool].filter(r => r.id !== id) }));
  }, []);

  const updateIng = useCallback((pool: 'carrier' | 'active' | 'eo', id: number, key: 'ingId' | 'weight', val: string | number) => {
    setPools(prev => ({
      ...prev,
      [pool]: prev[pool].map(r => r.id === id ? { ...r, [key]: val } : r),
    }));
  }, []);

  const carrierPctLabel = `${(carrierSplit.reduce((s, r) => s + r.pct, 0) * 100).toFixed(1)}% of batch`;
  const activePctLabel = `${(activeSplit.reduce((s, r) => s + r.pct, 0) * 100).toFixed(1)}% of batch`;
  const eoPctLabel = `${(eoSplit.reduce((s, r) => s + r.pct, 0) * 100).toFixed(1)}% of batch`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      {/* Left: Controls + Pools */}
      <div className="space-y-5">
        {/* Base formula */}
        <GlassCard>
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Base Formula</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">Formula type</label>
              <div className="flex gap-2">
                {OIL_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => loadPreset(p.id)}
                    className={cn(
                      'px-3 py-2 rounded-xs text-xs font-medium border transition-all',
                      formulaId === p.id
                        ? 'bg-accent-indigo/15 border-accent-indigo/30 text-accent-indigo-light'
                        : 'bg-surface-input border-border text-text-tertiary hover:text-text-secondary hover:border-border-strong'
                    )}
                  >
                    {p.name}
                  </button>
                ))}
                <button
                  onClick={() => { setFormulaId('custom'); setPools({ carrier: [], active: [], eo: [] }); }}
                  className={cn(
                    'px-3 py-2 rounded-xs text-xs font-medium border transition-all',
                    formulaId === 'custom'
                      ? 'bg-accent-indigo/15 border-accent-indigo/30 text-accent-indigo-light'
                      : 'bg-surface-input border-border text-text-tertiary hover:text-text-secondary hover:border-border-strong'
                  )}
                >
                  Custom
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">Batch size (ml)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={30}
                  max={500}
                  step={10}
                  value={batchSize}
                  onChange={e => setBatchSize(+e.target.value)}
                  className="flex-1 accent-accent-indigo h-1.5"
                />
                <span className="text-sm font-bold text-accent-indigo-light min-w-[60px] text-right">{batchSize} ml</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Carrier Oils Pool */}
        <GlassCard>
          <IngredientPool
            label="Carrier Oils"
            poolKey="carrier"
            rows={pools.carrier}
            ingredients={OIL_CARRIERS}
            maxItems={5}
            accentColor="#5DCAA5"
            pctLabel={carrierPctLabel}
            splits={carrierSplit}
            batchSize={batchSize}
            onAdd={() => addIng('carrier')}
            onRemove={(id) => removeIng('carrier', id)}
            onChange={(id, key, val) => updateIng('carrier', id, key, val)}
          />
        </GlassCard>

        {/* Active Ingredients Pool */}
        <GlassCard>
          <IngredientPool
            label="Active Ingredients"
            poolKey="active"
            rows={pools.active}
            ingredients={OIL_ACTIVES}
            maxItems={3}
            accentColor="#FCD34D"
            pctLabel={activePctLabel}
            splits={activeSplit}
            batchSize={batchSize}
            onAdd={() => addIng('active')}
            onRemove={(id) => removeIng('active', id)}
            onChange={(id, key, val) => updateIng('active', id, key, val)}
          />
        </GlassCard>

        {/* Essential Oils Pool */}
        <GlassCard>
          <IngredientPool
            label="Essential Oils"
            poolKey="eo"
            rows={pools.eo}
            ingredients={OIL_EOS}
            maxItems={6}
            accentColor="#C4B5FD"
            pctLabel={eoPctLabel}
            splits={eoSplit}
            batchSize={batchSize}
            onAdd={() => addIng('eo')}
            onRemove={(id) => removeIng('eo', id)}
            onChange={(id, key, val) => updateIng('eo', id, key, val)}
          />
        </GlassCard>
      </div>

      {/* Right: Visualization */}
      <div className="space-y-5">
        <GlassCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Beaker Preview</h3>
          <BeakerViz layers={beakerLayers} />
        </GlassCard>

        <GlassCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Ratio Breakdown</h3>
          <RatioBars items={ratioItems} />
        </GlassCard>

        <GlassCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Treatment Profile</h3>
          <BenefitBars scores={benefitScores} maxItems={8} />
        </GlassCard>

        <GlassCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Notes & Warnings</h3>
          <SynergyPanel notes={synergies} />
        </GlassCard>
      </div>
    </div>
  );
}
