'use client';

import { useState, useMemo, useCallback } from 'react';
import { CARRIERS_A } from '@/lib/ingredients/carriers-a';
import { ACTIVES_B } from '@/lib/ingredients/actives-b';
import { EXFOLIANTS_C } from '@/lib/ingredients/exfoliants-c';
import { ESSENTIAL_OILS } from '@/lib/ingredients/essential-oils';
import { calcFormula, FB_COLORS, BENEFIT_LABELS, FB_BENEFIT_COLORS, getTipLevel, sqrtBarWidth } from '@/lib/formula-engine';
import type { PoolRow, Ingredient, FormulaResult } from '@/types';

let idCounter = 200;

const POOL_META: Record<string, { label: string; data: Ingredient[]; max: number; pctLabel: string }> = {
  a: { label: 'Ingredient A — Carrier Oils (13%)', data: CARRIERS_A, max: 4, pctLabel: '13% of batch' },
  b: { label: 'Ingredient B — Active Botanicals (6%)', data: ACTIVES_B, max: 3, pctLabel: '6% of batch' },
  c: { label: 'Ingredient C — Exfoliants', data: EXFOLIANTS_C, max: 3, pctLabel: 'C phase' },
  eo: { label: 'Essential Oils (1–2%)', data: ESSENTIAL_OILS, max: 12, pctLabel: 'EO phase' },
};

export default function FormulaBuilder() {
  const [mode, setMode] = useState<'face' | 'body'>('face');
  const [product, setProduct] = useState<'balm' | 'scrub'>('balm');
  const [batchSize, setBatchSize] = useState(100);
  const [beeswaxOn, setBeeswaxOn] = useState(true);
  const [cPct, setCPct] = useState(8);
  const [pools, setPools] = useState<Record<string, PoolRow[]>>({ a: [], b: [], c: [], eo: [] });

  const formula = useMemo(() =>
    calcFormula(mode, product, pools as { a: PoolRow[]; b: PoolRow[]; c: PoolRow[]; eo: PoolRow[] }, cPct / 100, beeswaxOn),
    [mode, product, pools, cPct, beeswaxOn]
  );

  const addIng = useCallback((pool: string) => {
    const meta = POOL_META[pool];
    if (!meta) return;
    setPools(prev => {
      const current = prev[pool] || [];
      if (current.length >= meta.max) return prev;
      const used = current.map(r => r.ingId);
      const avail = meta.data.filter(i => !used.includes(i.id));
      if (!avail.length) return prev;
      return { ...prev, [pool]: [...current, { id: idCounter++, ingId: avail[0].id, weight: 5 }] };
    });
  }, []);

  const removeIng = useCallback((pool: string, id: number) => {
    setPools(prev => ({ ...prev, [pool]: (prev[pool] || []).filter(r => r.id !== id) }));
  }, []);

  const updateIng = useCallback((pool: string, id: number, key: string, val: string | number) => {
    setPools(prev => ({
      ...prev,
      [pool]: (prev[pool] || []).map(r => r.id === id ? { ...r, [key]: val } : r),
    }));
  }, []);

  const allLayers = buildLayers(formula);
  const maxSqrt = Math.max(...allLayers.map(l => Math.sqrt(Math.max(0, l.pct * 100) / 100)), 1e-9);

  // Benefits
  const scores: Record<string, number> = {};
  BENEFIT_LABELS.forEach(b => scores[b] = 0);
  function addS(list: Array<PoolRow & { pct: number }>, data: Ingredient[], w: number) {
    list.forEach(r => {
      const ing = data.find(x => x.id === r.ingId);
      if (!ing) return;
      Object.entries(ing.benefits).forEach(([b, v]) => { scores[b] = (scores[b] || 0) + v * r.pct * w; });
    });
  }
  addS(formula.aSplit, CARRIERS_A, 1);
  addS(formula.bSplit, ACTIVES_B, 1.5);
  addS(formula.cSplit, EXFOLIANTS_C, 1.2);
  addS(formula.eoSplit, ESSENTIAL_OILS, 2);
  const maxBen = Math.max(...Object.values(scores), 0.001);
  const topBenefits = BENEFIT_LABELS.filter(b => scores[b] > 0).sort((a, b) => scores[b] - scores[a]).slice(0, 8);

  return (
    <div className="page-content">
      <section className="animate-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '2rem' }}>🔬</span>
          <div>
            <h1>Formula Builder</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Full-spectrum ingredient builder with synergy analysis and benefit profiling
            </p>
          </div>
        </div>
      </section>

      <div className="builder-layout">
        {/* Left: Controls */}
        <div className="builder-left">
          {/* Config */}
          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {(['balm', 'scrub'] as const).map(p => (
                <button key={p} className={`btn btn-sm ${product === p ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setProduct(p)}>
                  {p === 'balm' ? '🧴 Skin Balm' : '✨ Exfoliator'}
                </button>
              ))}
              <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                {(['face', 'body'] as const).map(m => (
                  <button key={m} className={`btn btn-sm ${mode === m ? 'btn-gold' : 'btn-ghost'}`} onClick={() => setMode(m)}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <label className="form-label" style={{ margin: 0 }}>Batch</label>
              <input type="range" min={25} max={500} step={5} value={batchSize} onChange={e => setBatchSize(+e.target.value)} style={{ flex: 1 }} />
              <span className="mono" style={{ fontWeight: 600 }}>{batchSize}ml</span>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={beeswaxOn} onChange={e => setBeeswaxOn(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent-indigo)' }} />
                Beeswax
              </label>
              {product === 'scrub' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>C Phase</span>
                  <input type="range" min={5} max={15} value={cPct} onChange={e => setCPct(+e.target.value)} style={{ width: 100 }} />
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{cPct}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Pools */}
          {Object.entries(POOL_META).map(([key, meta]) => {
            if (key === 'c' && product !== 'scrub') return null;
            const split = key === 'a' ? formula.aSplit : key === 'b' ? formula.bSplit : key === 'c' ? formula.cSplit : formula.eoSplit;
            return (
              <div key={key} className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
                <div className="flex-between" style={{ marginBottom: 10 }}>
                  <h3 style={{ fontSize: '0.8125rem' }}>{meta.label}</h3>
                  <button className="btn btn-sm btn-secondary" onClick={() => addIng(key)}
                    disabled={(pools[key]?.length || 0) >= meta.max}>
                    + ({(pools[key]?.length || 0)}/{meta.max})
                  </button>
                </div>
                {(pools[key] || []).map(row => {
                  const ing = meta.data.find(x => x.id === row.ingId);
                  const sp = split.find(s => s.id === row.id);
                  const tip = ing?.tips?.[getTipLevel(row.weight)] || '';
                  return (
                    <div key={row.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <select className="select" style={{ flex: 1, minHeight: 34, fontSize: '0.8125rem' }} value={row.ingId}
                          onChange={e => updateIng(key, row.id, 'ingId', e.target.value)}>
                          {meta.data.map(opt => (
                            <option key={opt.id} value={opt.id}
                              disabled={(pools[key] || []).some(r => r.id !== row.id && r.ingId === opt.id)}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-indigo-light)' }}>
                          {sp ? (sp.pct * 100).toFixed(1) + '%' : '—'}
                        </span>
                        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          {sp ? (sp.pct * batchSize).toFixed(1) + 'ml' : ''}
                        </span>
                        <button className="btn btn-ghost" style={{ padding: 4, minHeight: 28, fontSize: '0.875rem' }}
                          onClick={() => removeIng(key, row.id)}>✕</button>
                      </div>
                      <input type="range" min={1} max={10} value={row.weight}
                        onChange={e => updateIng(key, row.id, 'weight', +e.target.value)}
                        style={{ width: '100%', margin: '4px 0' }} />
                      {tip && (
                        <div style={{
                          fontSize: '0.6875rem', padding: '4px 8px', borderRadius: 4,
                          background: row.weight > 7 && ing?.potency === 'strong' ? 'rgba(244,63,94,0.08)' : 'rgba(99,102,241,0.05)',
                          color: row.weight > 7 && ing?.potency === 'strong' ? 'var(--accent-rose)' : 'var(--text-secondary)',
                        }}>
                          {tip}
                        </div>
                      )}
                    </div>
                  );
                })}
                {(pools[key]?.length || 0) === 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: 6 }}>Click + to add</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Visualization */}
        <div className="builder-right">
          {/* Beaker SVG */}
          <div className="glass-card" style={{ padding: 20, marginBottom: 16, textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.8125rem', marginBottom: 12 }}>Beaker Preview</h3>
            <svg viewBox="0 0 180 280" style={{ width: 160, margin: '0 auto' }}>
              <rect x="30" y="18" width="120" height="234" rx="4" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
              <rect x="50" y="8" width="80" height="12" rx="3" fill="none" stroke="var(--border-default)" strokeWidth="1" />
              {(() => {
                let y = 252;
                return allLayers.map((layer, i) => {
                  const total = allLayers.reduce((s, l) => s + l.pct, 0) || 1;
                  const h = Math.max(2, (layer.pct / total) * 230);
                  y -= h;
                  return <rect key={i} x="31" y={y} width="118" height={h} fill={layer.color} opacity="0.85" />;
                });
              })()}
            </svg>
          </div>

          {/* Ratio bars */}
          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.8125rem', marginBottom: 12 }}>Ratios</h3>
            {allLayers.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="comp-dot" style={{ background: l.color }} />
                <span style={{ fontSize: '0.7rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</span>
                <div className="comp-bar" style={{ height: 5, flex: 2 }}>
                  <div className="comp-seg" style={{ width: `${sqrtBarWidth(l.pct * 100, maxSqrt)}%`, background: l.color }} />
                </div>
                <span className="mono" style={{ fontSize: '0.625rem', minWidth: 40, textAlign: 'right' }}>{(l.pct * batchSize).toFixed(1)}</span>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.8125rem', marginBottom: 12 }}>Benefit Profile</h3>
            {topBenefits.length === 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add ingredients</div>}
            {topBenefits.map(b => {
              const pct = Math.round((scores[b] / maxBen) * 100);
              return (
                <div key={b} style={{ marginBottom: 8 }}>
                  <div className="flex-between">
                    <span style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{b.replace('anti', 'anti-')}</span>
                    <span className="mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{pct}%</span>
                  </div>
                  <div className="comp-bar" style={{ height: 5 }}>
                    <div className="comp-seg" style={{ width: `${pct}%`, background: FB_BENEFIT_COLORS[b] || '#888' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick stats */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '0.8125rem', marginBottom: 12 }}>Batch</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div className="stat-card" style={{ padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-indigo-light)' }}>{batchSize}</div>
                <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ml</div>
              </div>
              <div className="stat-card" style={{ padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{Math.floor(batchSize / 50)}</div>
                <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>jars</div>
              </div>
              <div className="stat-card" style={{ padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{product}</div>
                <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>type</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .builder-layout {
          display: grid;
          grid-template-columns: 1fr minmax(280px, 340px);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) { .builder-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

function buildLayers(f: FormulaResult) {
  return [
    ...f.fixed.map(x => ({ name: x.name, pct: x.pct, color: x.color })),
    ...f.aSplit.map((r, i) => ({ name: CARRIERS_A.find(x => x.id === r.ingId)?.name || 'A', pct: r.pct, color: FB_COLORS[`a${i}`] || '#85B7EB' })),
    ...f.bSplit.map((r, i) => ({ name: ACTIVES_B.find(x => x.id === r.ingId)?.name || 'B', pct: r.pct, color: FB_COLORS[`b${i}`] || '#D85A30' })),
    ...f.cSplit.map((r, i) => ({ name: EXFOLIANTS_C.find(x => x.id === r.ingId)?.name || 'C', pct: r.pct, color: FB_COLORS[`c${i}`] || '#C4A574' })),
    ...f.eoSplit.map((r, i) => ({ name: ESSENTIAL_OILS.find(x => x.id === r.ingId)?.name || 'EO', pct: r.pct, color: FB_COLORS[`eo${i}`] || '#534AB7' })),
  ];
}
