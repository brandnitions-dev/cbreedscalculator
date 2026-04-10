'use client';

import { useState, useMemo, useCallback } from 'react';
import { CARRIERS_A } from '@/lib/ingredients/carriers-a';
import { ACTIVES_B } from '@/lib/ingredients/actives-b';
import { EXFOLIANTS_C } from '@/lib/ingredients/exfoliants-c';
import { ESSENTIAL_OILS } from '@/lib/ingredients/essential-oils';
import { calcFormula, FB_COLORS, BENEFIT_LABELS, FB_BENEFIT_COLORS, getTipLevel, sqrtBarWidth } from '@/lib/formula-engine';
import type { PoolRow, Ingredient } from '@/types';

let idCounter = 100;

export default function ExfoliatorCalculator() {
  const [mode, setMode] = useState<'face' | 'body'>('body');
  const [batchSize, setBatchSize] = useState(100);
  const [beeswaxOn, setBeeswaxOn] = useState(true);
  const [cPct, setCPct] = useState(8);
  const [pools, setPools] = useState<{ a: PoolRow[]; b: PoolRow[]; c: PoolRow[]; eo: PoolRow[] }>({
    a: [],
    b: [],
    c: [{ id: idCounter++, ingId: 'sugar', weight: 5 }],
    eo: [],
  });

  const formula = useMemo(() =>
    calcFormula(mode, 'scrub', pools, cPct / 100, beeswaxOn),
    [mode, pools, cPct, beeswaxOn]
  );

  const addIng = useCallback((pool: 'a' | 'b' | 'c' | 'eo') => {
    const limits = { a: 4, b: 3, c: 3, eo: 12 };
    const data = pool === 'a' ? CARRIERS_A : pool === 'b' ? ACTIVES_B : pool === 'c' ? EXFOLIANTS_C : ESSENTIAL_OILS;
    setPools(prev => {
      if (prev[pool].length >= limits[pool]) return prev;
      const used = prev[pool].map(r => r.ingId);
      const avail = data.filter(i => !used.includes(i.id));
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

  // All layers for composition bar
  const allLayers = [
    ...formula.fixed.map(f => ({ name: f.name, pct: f.pct, color: f.color })),
    ...formula.aSplit.map((r, i) => ({ name: CARRIERS_A.find(x => x.id === r.ingId)?.name || 'A', pct: r.pct, color: FB_COLORS[`a${i}`] || '#85B7EB' })),
    ...formula.bSplit.map((r, i) => ({ name: ACTIVES_B.find(x => x.id === r.ingId)?.name || 'B', pct: r.pct, color: FB_COLORS[`b${i}`] || '#D85A30' })),
    ...formula.cSplit.map((r, i) => ({ name: EXFOLIANTS_C.find(x => x.id === r.ingId)?.name || 'C', pct: r.pct, color: FB_COLORS[`c${i}`] || '#C4A574' })),
    ...formula.eoSplit.map((r, i) => ({ name: ESSENTIAL_OILS.find(x => x.id === r.ingId)?.name || 'EO', pct: r.pct, color: FB_COLORS[`eo${i}`] || '#534AB7' })),
  ];

  const maxSqrt = Math.max(...allLayers.map(l => Math.sqrt(Math.max(0, l.pct * 100) / 100)), 1e-9);

  return (
    <div className="page-content">
      <section className="animate-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: '2rem' }}>✨</span>
          <div>
            <h1>Exfoliator Calculator</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Tallow-based scrub with physical exfoliant phase (C) and oil absorption chemistry
            </p>
          </div>
        </div>
      </section>

      <div className="exf-layout">
        <div className="exf-left">
          {/* Settings */}
          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
              {(['face', 'body'] as const).map(m => (
                <button key={m} className={`btn btn-sm ${mode === m ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode(m)}>
                  {m === 'face' ? '🧑 Face (1% EO)' : '💪 Body (2% EO)'}
                </button>
              ))}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={beeswaxOn} onChange={e => setBeeswaxOn(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--accent-indigo)' }} />
                Beeswax
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <label className="form-label" style={{ margin: 0 }}>Batch</label>
              <input type="range" min={25} max={500} step={5} value={batchSize} onChange={e => setBatchSize(+e.target.value)} style={{ flex: 1 }} />
              <span className="mono" style={{ minWidth: 52, textAlign: 'right', fontWeight: 600 }}>{batchSize} ml</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label className="form-label" style={{ margin: 0 }}>C Phase</label>
              <input type="range" min={5} max={15} step={1} value={cPct} onChange={e => setCPct(+e.target.value)} style={{ flex: 1 }} />
              <span className="mono" style={{ minWidth: 40, textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>{cPct}%</span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 6 }}>
              Exfoliant phase — base oils scale down to accommodate. {cPct >= 12 ? '⚠️ High — body use recommended' : ''}
            </div>
          </div>

          {/* Exfoliant C pool */}
          <IngPool pool="c" label="Ingredient C — Exfoliants" data={EXFOLIANTS_C} rows={pools.c} split={formula.cSplit}
            max={3} batchSize={batchSize} onAdd={() => addIng('c')} onRemove={(id) => removeIng('c', id)} onUpdate={(id, k, v) => updateIng('c', id, k, v)} />

          {/* Carrier A */}
          <IngPool pool="a" label="Ingredient A — Carriers" data={CARRIERS_A} rows={pools.a} split={formula.aSplit}
            max={4} batchSize={batchSize} onAdd={() => addIng('a')} onRemove={(id) => removeIng('a', id)} onUpdate={(id, k, v) => updateIng('a', id, k, v)} />

          {/* Active B */}
          <IngPool pool="b" label="Ingredient B — Actives" data={ACTIVES_B} rows={pools.b} split={formula.bSplit}
            max={3} batchSize={batchSize} onAdd={() => addIng('b')} onRemove={(id) => removeIng('b', id)} onUpdate={(id, k, v) => updateIng('b', id, k, v)} />

          {/* EOs */}
          <IngPool pool="eo" label="Essential Oils" data={ESSENTIAL_OILS} rows={pools.eo} split={formula.eoSplit}
            max={12} batchSize={batchSize} onAdd={() => addIng('eo')} onRemove={(id) => removeIng('eo', id)} onUpdate={(id, k, v) => updateIng('eo', id, k, v)} />
        </div>

        {/* Right: Results */}
        <div className="exf-right">
          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Composition</h3>
            <div className="comp-bar">
              {allLayers.map((l, i) => (
                <div key={i} className="comp-seg" style={{ width: `${l.pct * 100}%`, background: l.color }} title={`${l.name}: ${(l.pct * 100).toFixed(1)}%`} />
              ))}
            </div>
            <div className="comp-legend" style={{ marginTop: 10 }}>
              {allLayers.filter(l => l.pct > 0.005).map((l, i) => (
                <div key={i} className="comp-legend-item">
                  <span className="comp-dot" style={{ background: l.color }} />{l.name}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Ratio Breakdown</h3>
            {allLayers.map((l, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div className="flex-between" style={{ marginBottom: 2 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{l.name}</span>
                  <span className="mono" style={{ fontSize: '0.6875rem' }}>{(l.pct * batchSize).toFixed(1)}ml</span>
                </div>
                <div className="comp-bar" style={{ height: 5 }}>
                  <div className="comp-seg" style={{ width: `${sqrtBarWidth(l.pct * 100, maxSqrt)}%`, background: l.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Production Steps</h3>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>Melt tallow{beeswaxOn ? ' + beeswax' : ''} in double boiler at 140°F</li>
              <li>Add jojoba and carrier oils (A); stir until uniform</li>
              <li>Remove from heat; cool to ~110°F</li>
              <li>Add active oils (B) and vitamin E</li>
              <li>Add essential oils at ~100°F; stir gently</li>
              <li>Fold in exfoliant (C) last — stir to suspend evenly</li>
              <li>Pour into jars immediately; tap to settle</li>
            </ol>
            {!beeswaxOn && (
              <div className="banner-warn" style={{ marginTop: 12 }}>
                No beeswax — scrub has no structural hold at room temp; will be a loose oil-paste.
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .exf-layout {
          display: grid;
          grid-template-columns: 1fr minmax(320px, 400px);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) { .exf-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

function IngPool({ pool, label, data, rows, split, max, batchSize, onAdd, onRemove, onUpdate }: {
  pool: string; label: string; data: Ingredient[]; rows: PoolRow[];
  split: Array<PoolRow & { pct: number }>; max: number; batchSize: number;
  onAdd: () => void; onRemove: (id: number) => void;
  onUpdate: (id: number, key: string, val: string | number) => void;
}) {
  return (
    <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: '0.875rem' }}>{label}</h3>
        <button className="btn btn-sm btn-secondary" onClick={onAdd} disabled={rows.length >= max}>+ Add ({rows.length}/{max})</button>
      </div>
      {rows.map(row => {
        const ing = data.find(x => x.id === row.ingId);
        const sp = split.find(s => s.id === row.id);
        const pct = sp ? (sp.pct * 100).toFixed(1) : '—';
        const ml = sp ? (sp.pct * batchSize).toFixed(1) : '—';
        return (
          <div key={row.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select className="select" style={{ flex: 1, minHeight: 36 }} value={row.ingId}
                onChange={e => onUpdate(row.id, 'ingId', e.target.value)}>
                {data.map(opt => (
                  <option key={opt.id} value={opt.id} disabled={rows.some(r => r.id !== row.id && r.ingId === opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <span className="mono pill pill-gold">{pct}%</span>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ml}ml</span>
              <button className="btn btn-ghost btn-sm" onClick={() => onRemove(row.id)}>✕</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>share</span>
              <input type="range" min={1} max={10} value={row.weight} onChange={e => onUpdate(row.id, 'weight', +e.target.value)} style={{ flex: 1 }} />
            </div>
            {ing && <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{ing.desc}</div>}
          </div>
        );
      })}
      {rows.length === 0 && <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: 8 }}>Click "+ Add" to select ingredients</div>}
    </div>
  );
}
