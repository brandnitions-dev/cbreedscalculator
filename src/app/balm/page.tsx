'use client';

import { useState, useMemo, useCallback } from 'react';
import { CARRIERS_A } from '@/lib/ingredients/carriers-a';
import { ACTIVES_B } from '@/lib/ingredients/actives-b';
import { ESSENTIAL_OILS } from '@/lib/ingredients/essential-oils';
import { calcFormula, FB_COLORS, BENEFIT_LABELS, FB_BENEFIT_COLORS, getTipLevel, sqrtBarWidth } from '@/lib/formula-engine';
import type { PoolRow, Ingredient, FormulaResult } from '@/types';

const POOLS_CONFIG = {
  a: { label: 'Ingredient A — Carrier Oils', data: CARRIERS_A, max: 4, color: '#85B7EB' },
  b: { label: 'Ingredient B — Active Botanicals', data: ACTIVES_B, max: 3, color: '#D85A30' },
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

  return (
    <div className="page-content">
      <section className="animate-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: '2rem' }}>🧴</span>
          <div>
            <h1>Tallow Balm Calculator</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Formulate skin balms with tallow, jojoba, beeswax, carrier oils, actives &amp; EOs
            </p>
          </div>
        </div>
      </section>

      <div className="balm-layout">
        {/* Left: Ingredient Pools */}
        <div className="balm-left">
          {/* Settings */}
          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['face', 'body'] as const).map(m => (
                  <button key={m} className={`btn btn-sm ${mode === m ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode(m)}>
                    {m === 'face' ? '🧑 Face (1% EO)' : '💪 Body (2% EO)'}
                  </button>
                ))}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={beeswaxOn} onChange={e => setBeeswaxOn(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--accent-indigo)' }} />
                Beeswax (8%)
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label className="form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Batch</label>
              <input type="range" min={25} max={500} step={5} value={batchSize} onChange={e => setBatchSize(+e.target.value)} style={{ flex: 1 }} />
              <span className="mono" style={{ minWidth: 52, textAlign: 'right', fontWeight: 600 }}>{batchSize} ml</span>
            </div>
          </div>

          {/* Ingredient pools */}
          {(Object.keys(POOLS_CONFIG) as Array<'a' | 'b' | 'eo'>).map(pool => (
            <PoolSection
              key={pool}
              pool={pool}
              config={POOLS_CONFIG[pool]}
              rows={pools[pool]}
              formula={formula}
              batchSize={batchSize}
              onAdd={() => addIng(pool)}
              onRemove={(id) => removeIng(pool, id)}
              onUpdate={(id, key, val) => updateIng(pool, id, key, val)}
            />
          ))}
        </div>

        {/* Right: Results */}
        <div className="balm-right">
          <FormulaResults formula={formula} batchSize={batchSize} pools={pools} />
        </div>
      </div>

      <style>{`
        .balm-layout {
          display: grid;
          grid-template-columns: 1fr minmax(320px, 400px);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .balm-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

/* ── Pool Section Component ───────────────────────────────────────── */
function PoolSection({ pool, config, rows, formula, batchSize, onAdd, onRemove, onUpdate }: {
  pool: 'a' | 'b' | 'eo';
  config: { label: string; data: Ingredient[]; max: number; color: string };
  rows: PoolRow[];
  formula: FormulaResult;
  batchSize: number;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, key: 'ingId' | 'weight', val: string | number) => void;
}) {
  const split = pool === 'a' ? formula.aSplit : pool === 'b' ? formula.bSplit : formula.eoSplit;

  return (
    <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: '0.875rem' }}>{config.label}</h3>
        <button className="btn btn-sm btn-secondary" onClick={onAdd} disabled={rows.length >= config.max}>
          + Add ({rows.length}/{config.max})
        </button>
      </div>

      {rows.map(row => {
        const ing = config.data.find(x => x.id === row.ingId);
        const sp = split.find(s => s.id === row.id);
        const pct = sp ? (sp.pct * 100).toFixed(1) : '—';
        const ml = sp ? (sp.pct * batchSize).toFixed(1) : '—';
        const tip = ing?.tips?.[getTipLevel(row.weight)] || '';

        return (
          <div key={row.id} className="pool-row">
            <div className="pool-row-top">
              <select className="select" style={{ flex: 1, minHeight: 36 }} value={row.ingId}
                onChange={e => onUpdate(row.id, 'ingId', e.target.value)}>
                {config.data.map(opt => (
                  <option key={opt.id} value={opt.id} disabled={rows.some(r => r.id !== row.id && r.ingId === opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <span className="mono pill pill-indigo">{pct}%</span>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ml}ml</span>
              <button className="btn btn-ghost btn-sm" onClick={() => onRemove(row.id)}>✕</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>share</span>
              <input type="range" min={1} max={10} step={1} value={row.weight}
                onChange={e => onUpdate(row.id, 'weight', +e.target.value)} style={{ flex: 1 }} />
            </div>
            {ing && <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{ing.desc}</div>}
            {tip && (
              <div style={{
                fontSize: '0.75rem', marginTop: 4, padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                background: row.weight > 7 && ing?.potency === 'strong' ? 'rgba(244,63,94,0.08)' : 'rgba(99,102,241,0.06)',
                color: row.weight > 7 && ing?.potency === 'strong' ? 'var(--accent-rose)' : 'var(--accent-indigo-light)',
                borderLeft: '3px solid currentColor',
              }}>
                {tip}
              </div>
            )}
          </div>
        );
      })}

      {rows.length === 0 && (
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '12px 0' }}>
          Click "+ Add" to select ingredients
        </div>
      )}

      <style>{`
        .pool-row {
          padding: 12px 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        .pool-row:last-child { border-bottom: none; }
        .pool-row-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}

/* ── Results Panel Component ──────────────────────────────────────── */
function FormulaResults({ formula, batchSize, pools }: {
  formula: FormulaResult;
  batchSize: number;
  pools: { a: PoolRow[]; b: PoolRow[]; eo: PoolRow[] };
}) {
  const allLayers = [
    ...formula.fixed.map(f => ({ name: f.name, pct: f.pct, color: f.color })),
    ...formula.aSplit.map((r, i) => ({ name: CARRIERS_A.find(x => x.id === r.ingId)?.name || 'A', pct: r.pct, color: FB_COLORS[`a${i}`] || '#85B7EB' })),
    ...formula.bSplit.map((r, i) => ({ name: ACTIVES_B.find(x => x.id === r.ingId)?.name || 'B', pct: r.pct, color: FB_COLORS[`b${i}`] || '#D85A30' })),
    ...formula.eoSplit.map((r, i) => ({ name: ESSENTIAL_OILS.find(x => x.id === r.ingId)?.name || 'EO', pct: r.pct, color: FB_COLORS[`eo${i}`] || '#534AB7' })),
  ];

  // Benefits
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
  const sortedBenefits = BENEFIT_LABELS.filter(b => scores[b] > 0).sort((a, b) => scores[b] - scores[a]).slice(0, 8);
  const maxSqrtBar = Math.max(...allLayers.map(l => Math.sqrt(Math.max(0, l.pct * 100) / 100)), 1e-9);

  return (
    <>
      {/* Composition bar */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Composition</h3>
        <div className="comp-bar">
          {allLayers.map((layer, i) => (
            <div key={i} className="comp-seg" style={{ width: `${layer.pct * 100}%`, background: layer.color }} title={`${layer.name}: ${(layer.pct * 100).toFixed(1)}%`} />
          ))}
        </div>
        <div className="comp-legend" style={{ marginTop: 10 }}>
          {allLayers.filter(l => l.pct > 0.005).map((l, i) => (
            <div key={i} className="comp-legend-item">
              <span className="comp-dot" style={{ background: l.color }} />
              {l.name}
            </div>
          ))}
        </div>
      </div>

      {/* Ratio bars */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Ratio Breakdown</h3>
        {allLayers.map((layer, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div className="flex-between" style={{ marginBottom: 3 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{layer.name}</span>
              <span className="mono" style={{ fontSize: '0.75rem' }}>
                {(layer.pct * batchSize).toFixed(1)}ml · {(layer.pct * 100).toFixed(1)}%
              </span>
            </div>
            <div className="comp-bar" style={{ height: 6 }}>
              <div className="comp-seg" style={{ width: `${sqrtBarWidth(layer.pct * 100, maxSqrtBar)}%`, background: layer.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Benefit Profile</h3>
        {sortedBenefits.length === 0 && (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Add ingredients to see benefits</div>
        )}
        {sortedBenefits.map(b => {
          const pct = Math.round((scores[b] / maxScore) * 100);
          const col = FB_BENEFIT_COLORS[b] || '#888';
          return (
            <div key={b} style={{ marginBottom: 10 }}>
              <div className="flex-between" style={{ marginBottom: 3 }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{b.replace('anti', 'anti-')}</span>
                <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{pct}%</span>
              </div>
              <div className="comp-bar" style={{ height: 6 }}>
                <div className="comp-seg" style={{ width: `${pct}%`, background: col }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Batch Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-indigo-light)' }}>{batchSize}</div>
            <div className="stat-label" style={{ fontSize: '0.6rem' }}>Total (ml)</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>
              {Math.floor(batchSize / 50)}
            </div>
            <div className="stat-label" style={{ fontSize: '0.6rem' }}>50ml Jars</div>
          </div>
        </div>
      </div>
    </>
  );
}
