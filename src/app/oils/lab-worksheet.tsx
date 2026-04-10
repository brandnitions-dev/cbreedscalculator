'use client';

import { useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui';
import { CompositionBar, PackoutGrid } from '@/components/formula';
import { OIL_CARRIERS, OIL_ACTIVES, OIL_EOS, OIL_PRESETS, type OilIngredient } from '@/lib/ingredients/treatment-oils';
import { FlaskConical, Beaker, Package, ListChecks } from 'lucide-react';

const CONTAINER_SIZES = [5, 10, 15, 20, 30, 50];

function getFormulaIngredients(formulaId: string) {
  const preset = OIL_PRESETS.find(p => p.id === formulaId);
  if (!preset) return [];

  const rows: { name: string; pct: number; color: string; group: string }[] = [];

  const carrierTotal = preset.carriers.reduce((s, c) => s + c.weight, 0) || 1;
  preset.carriers.forEach(c => {
    const ing = OIL_CARRIERS.find(i => i.id === c.ingId);
    if (ing) rows.push({ name: ing.name, pct: 0.85 * c.weight / carrierTotal, color: ing.color, group: 'Carrier Oils' });
  });

  const activeTotal = preset.actives.reduce((s, a) => s + a.weight, 0) || 1;
  preset.actives.forEach(a => {
    const ing = OIL_ACTIVES.find(i => i.id === a.ingId);
    if (ing) rows.push({ name: ing.name, pct: 0.05 * a.weight / activeTotal, color: ing.color, group: 'Active Ingredients' });
  });

  const eoTotal = preset.eos.reduce((s, e) => s + e.weight, 0) || 1;
  preset.eos.forEach(e => {
    const ing = OIL_EOS.find(i => i.id === e.ingId);
    if (ing) rows.push({ name: ing.name, pct: 0.10 * e.weight / eoTotal, color: ing.color, group: 'Essential Oils' });
  });

  return rows;
}

export function OilLabWorksheet() {
  const [formulaId, setFormulaId] = useState('bha_penetrating');
  const [batchSize, setBatchSize] = useState(100);
  const [containerSize, setContainerSize] = useState(30);

  const preset = OIL_PRESETS.find(p => p.id === formulaId);
  const ingredients = useMemo(() => getFormulaIngredients(formulaId), [formulaId]);
  const groups = useMemo(() => {
    const map: Record<string, typeof ingredients> = {};
    ingredients.forEach(ing => {
      if (!map[ing.group]) map[ing.group] = [];
      map[ing.group].push(ing);
    });
    return map;
  }, [ingredients]);

  return (
    <div className="space-y-6">
      {/* Section 1: Setup */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={16} className="text-accent-emerald" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Setup & Controls</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">Formula type</label>
            <select
              value={formulaId}
              onChange={e => setFormulaId(e.target.value)}
              className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-border-focus focus:outline-none"
            >
              {OIL_PRESETS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">Batch size (ml)</label>
            <input
              type="number"
              value={batchSize}
              onChange={e => setBatchSize(Math.max(1, +e.target.value))}
              className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-border-focus focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">Container size</label>
            <select
              value={containerSize}
              onChange={e => setContainerSize(+e.target.value)}
              className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-border-focus focus:outline-none"
            >
              {CONTAINER_SIZES.map(s => (
                <option key={s} value={s}>{s} ml bottle</option>
              ))}
            </select>
          </div>
        </div>

        {preset && (
          <p className="mt-3 text-xs text-text-tertiary leading-relaxed">{preset.desc}</p>
        )}
      </GlassCard>

      {/* Section 2: Formulation Worksheet */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Beaker size={16} className="text-accent-indigo-light" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Formulation Worksheet</h2>
        </div>

        <div className="space-y-4">
          {Object.entries(groups).map(([group, ings]) => (
            <div key={group}>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">{group}</h3>
              <div className="space-y-1">
                {ings.map((ing, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 px-2 rounded-xs hover:bg-white/[0.02] transition-colors">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ing.color }} />
                    <span className="text-sm text-text-primary flex-1">{ing.name}</span>
                    <span className="text-sm font-bold text-accent-indigo-light w-16 text-right">
                      {(ing.pct * batchSize).toFixed(1)} ml
                    </span>
                    <span className="text-xs text-text-muted w-12 text-right">
                      {(ing.pct * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Section 3: Batch Summary */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <ListChecks size={16} className="text-accent-gold" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Batch Summary</h2>
        </div>

        <CompositionBar
          segments={ingredients.map(ing => ({ name: ing.name, pct: ing.pct, color: ing.color }))}
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2 text-text-muted font-semibold">Ingredient</th>
                <th className="text-right py-2 text-text-muted font-semibold">%</th>
                <th className="text-right py-2 text-text-muted font-semibold">ml</th>
                <th className="text-right py-2 text-text-muted font-semibold">g (est)</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => (
                <tr key={i} className="border-b border-border-subtle/50">
                  <td className="py-1.5 text-text-secondary flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: ing.color }} />
                    {ing.name}
                  </td>
                  <td className="py-1.5 text-right text-text-primary font-medium">{(ing.pct * 100).toFixed(1)}%</td>
                  <td className="py-1.5 text-right text-accent-indigo-light font-bold">{(ing.pct * batchSize).toFixed(1)}</td>
                  <td className="py-1.5 text-right text-text-muted">{(ing.pct * batchSize * 0.92).toFixed(1)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-2 text-text-primary">Total</td>
                <td className="py-2 text-right text-text-primary">100%</td>
                <td className="py-2 text-right text-accent-emerald">{batchSize.toFixed(1)}</td>
                <td className="py-2 text-right text-text-muted">{(batchSize * 0.92).toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Section 4: Production & Packout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <ListChecks size={16} className="text-accent-violet" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Cold Blend Process</h2>
          </div>

          <ol className="space-y-3">
            {[
              'Measure carrier oils by weight into clean beaker',
              'Add active ingredients — stir gently (no heat)',
              'Add essential oils last — cap immediately',
              'Stir clockwise 30 seconds, rest 2 min, stir again',
              'Pour into dropper bottles using glass pipette',
              'Label with date, formula, and batch number',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-text-secondary">
                <span className="w-6 h-6 rounded-full bg-accent-indigo/15 text-accent-indigo-light flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </GlassCard>

        <GlassCard>
          <PackoutGrid
            batchSize={batchSize}
            containerSize={containerSize}
            containerLabel="bottle"
            icon="bottle"
          />
        </GlassCard>
      </div>
    </div>
  );
}
