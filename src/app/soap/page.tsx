'use client';

import { useState, useMemo } from 'react';
import { SOAP_OILS, getDefaultSoapOils } from '@/lib/ingredients/soap-oils';
import { SOAP_ADDITIVES } from '@/lib/ingredients/soap-additives';
import { ESSENTIAL_OILS, SOAP_SAFE_EO_IDS } from '@/lib/ingredients/essential-oils';
import { calculateSoap, QUALITY_RANGES, getQualityRating } from '@/lib/chemistry';
import type { SoapOil } from '@/types';

interface OilRow {
  id: string;
  oil: SoapOil;
  pct: number;
}

export default function SoapCalculator() {
  const [totalOilWeight, setTotalOilWeight] = useState(1000);
  const [superfat, setSuperfat] = useState(5);
  const [lyeConc, setLyeConc] = useState(33);
  const [eoPct, setEoPct] = useState(2.5);
  const [oilRows, setOilRows] = useState<OilRow[]>(() =>
    getDefaultSoapOils().map(oil => ({ id: oil.id, oil, pct: oil.defaultPct }))
  );
  const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);

  const soapSafeEOs = useMemo(() =>
    ESSENTIAL_OILS.filter(eo => SOAP_SAFE_EO_IDS.includes(eo.id)), []
  );

  const result = useMemo(() =>
    calculateSoap(
      oilRows.map(r => ({ oil: r.oil, pct: r.pct })),
      totalOilWeight, superfat, lyeConc, eoPct
    ), [oilRows, totalOilWeight, superfat, lyeConc, eoPct]
  );

  const totalPct = oilRows.reduce((s, r) => s + r.pct, 0);

  function updateOilPct(id: string, pct: number) {
    setOilRows(prev => prev.map(r => r.id === id ? { ...r, pct: Math.max(0, Math.min(100, pct)) } : r));
  }

  function addOil(oilId: string) {
    const oil = SOAP_OILS.find(o => o.id === oilId);
    if (!oil || oilRows.find(r => r.id === oilId)) return;
    setOilRows(prev => [...prev, { id: oil.id, oil, pct: 5 }]);
  }

  function removeOil(id: string) {
    setOilRows(prev => prev.filter(r => r.id !== id));
  }

  function toggleAdditive(id: string) {
    setSelectedAdditives(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  }

  return (
    <div className="page-content">
      <section className="animate-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: '2rem' }}>🧼</span>
          <div>
            <h1>Tallow Soap Calculator</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Cold-process saponification with real NaOH chemistry
            </p>
          </div>
        </div>
      </section>

      <div className="soap-layout">
        {/* Left: Oil Recipe */}
        <div className="soap-left">
          {/* Batch Settings */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ marginBottom: 16 }}>Batch Settings</h3>
            <div className="soap-settings-grid">
              <div className="form-group">
                <label className="form-label">Total Oil Weight (g)</label>
                <input
                  type="number"
                  className="input mono"
                  value={totalOilWeight}
                  onChange={e => setTotalOilWeight(Math.max(100, +e.target.value))}
                  min={100}
                  step={50}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Superfat: {superfat}%</label>
                <input
                  type="range"
                  min={0} max={10} step={0.5}
                  value={superfat}
                  onChange={e => setSuperfat(+e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  <span>0% (harsh)</span><span>5% (standard)</span><span>10% (luxury)</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Lye Concentration: {lyeConc}%</label>
                <input
                  type="range"
                  min={25} max={40} step={1}
                  value={lyeConc}
                  onChange={e => setLyeConc(+e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  <span>25% (slow trace)</span><span>33% (standard)</span><span>40% (fast)</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">EO % of oils: {eoPct}%</label>
                <input
                  type="range"
                  min={0} max={5} step={0.5}
                  value={eoPct}
                  onChange={e => setEoPct(+e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Oil Blend */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h3>Oil Blend</h3>
              <span className={`pill ${Math.abs(totalPct - 100) < 0.5 ? 'pill-emerald' : 'pill-rose'}`}>
                {totalPct.toFixed(1)}% total
              </span>
            </div>

            {Math.abs(totalPct - 100) > 0.5 && (
              <div className="banner-warn" style={{ marginBottom: 16 }}>
                Oil percentages should sum to 100%. Currently at {totalPct.toFixed(1)}%.
              </div>
            )}

            <div className="soap-oil-list">
              {oilRows.map(row => (
                <div key={row.id} className="soap-oil-row">
                  <div className="soap-oil-info">
                    <div className="soap-oil-name">
                      {row.oil.name}
                      <span className={`pill pill-${row.oil.category === 'base' ? 'indigo' : row.oil.category === 'carrier' ? 'emerald' : 'gold'}`} style={{ marginLeft: 8 }}>
                        {row.oil.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      SAP: {row.oil.sapNaOH} · Hardness: {row.oil.hardness} · Cleansing: {row.oil.cleansing} · Conditioning: {row.oil.conditioning}
                    </div>
                  </div>
                  <div className="soap-oil-controls">
                    <input
                      type="number"
                      className="input mono"
                      style={{ width: 80, textAlign: 'right', padding: '6px 10px', minHeight: 36 }}
                      value={row.pct}
                      onChange={e => updateOilPct(row.id, +e.target.value)}
                      min={0} max={100} step={1}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>%</span>
                    <span className="mono" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', minWidth: 60, textAlign: 'right' }}>
                      {((row.pct / (totalPct || 100)) * totalOilWeight).toFixed(0)}g
                    </span>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeOil(row.id)} aria-label="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add oil */}
            <div style={{ marginTop: 16 }}>
              <select
                className="select"
                onChange={e => { if (e.target.value) { addOil(e.target.value); e.target.value = ''; } }}
                defaultValue=""
              >
                <option value="" disabled>+ Add oil to recipe…</option>
                {SOAP_OILS.filter(o => !oilRows.find(r => r.id === o.id)).map(oil => (
                  <option key={oil.id} value={oil.id}>{oil.name} (SAP {oil.sapNaOH})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additives */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ marginBottom: 16 }}>Additives</h3>
            <div className="soap-additives-grid">
              {SOAP_ADDITIVES.map(add => (
                <label key={add.id} className={`soap-additive-card ${selectedAdditives.includes(add.id) ? 'soap-additive-card--active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedAdditives.includes(add.id)}
                    onChange={() => toggleAdditive(add.id)}
                    style={{ display: 'none' }}
                  />
                  <div className="soap-additive-header">
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{add.name}</span>
                    <span className={`pill pill-${add.phase === 'trace' ? 'indigo' : add.phase === 'lye-water' ? 'emerald' : 'gold'}`}>
                      {add.phase}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: '4px 0' }}>{add.usageRate}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{add.desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Soap-safe EOs */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Recommended EOs for Cold-Process Soap</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              These essential oils survive saponification and retain scent through cure.
            </p>
            <div className="soap-eo-grid">
              {soapSafeEOs.map(eo => (
                <div key={eo.id} className="soap-eo-chip">
                  <span style={{ fontWeight: 600 }}>{eo.name}</span>
                  {eo.potency === 'strong' && <span className="pill pill-rose" style={{ fontSize: '0.5625rem' }}>potent</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="soap-right">
          {/* Lye Calculation */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20, borderColor: 'rgba(16,185,129,0.2)' }}>
            <h3 style={{ color: 'var(--accent-emerald-light)', marginBottom: 16 }}>⚗️ Lye Calculation</h3>
            <div className="soap-lye-grid">
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>{result.lyeNaOH}g</div>
                <div className="stat-label">NaOH (lye)</div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-value" style={{ color: 'var(--accent-sky)' }}>{result.waterWeight}g</div>
                <div className="stat-label">Distilled Water</div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>{result.eoWeight}g</div>
                <div className="stat-label">Essential Oils</div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-value" style={{ color: 'var(--accent-gold)' }}>{result.totalBatchWeight}g</div>
                <div className="stat-label">Total Batch</div>
              </div>
            </div>
            <div className="banner-info" style={{ marginTop: 16, fontSize: '0.75rem' }}>
              Superfat: {result.superfatPct}% — {result.superfatPct <= 3 ? 'minimal conditioning' : result.superfatPct <= 6 ? 'standard conditioning' : 'luxury conditioning'}
            </div>
          </div>

          {/* Oil Breakdown */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ marginBottom: 16 }}>Oil Breakdown</h3>
            <table className="data-table">
              <thead>
                <tr><th>Oil</th><th className="num">%</th><th className="num">Weight</th><th className="num">Lye (g)</th></tr>
              </thead>
              <tbody>
                {result.oils.map(oil => (
                  <tr key={oil.name}>
                    <td>{oil.name}</td>
                    <td className="num">{oil.pct.toFixed(1)}%</td>
                    <td className="num">{oil.weight}g</td>
                    <td className="num">{oil.lyeContribution.toFixed(2)}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Quality */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ marginBottom: 16 }}>Bar Quality Indices</h3>
            {Object.entries(QUALITY_RANGES).map(([key, range]) => {
              const value = key === 'hardness' ? result.hardnessIndex :
                            key === 'cleansing' ? result.cleansingIndex :
                            result.conditioningIndex;
              const rating = getQualityRating(value, range.min, range.max);
              const fillPct = Math.min(100, (value / 100) * 100);
              return (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div className="flex-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{range.label}</span>
                    <span className={`pill pill-${rating === 'good' ? 'emerald' : rating === 'low' ? 'sky' : 'rose'}`}>
                      {value} — {rating === 'good' ? 'Balanced' : rating === 'low' ? 'Low' : 'High'}
                    </span>
                  </div>
                  <div className="comp-bar">
                    <div className="comp-seg" style={{
                      width: `${fillPct}%`,
                      background: rating === 'good' ? 'var(--accent-emerald)' : rating === 'low' ? 'var(--accent-sky)' : 'var(--accent-rose)',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    <span>0</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>{range.min}–{range.max} ideal</span>
                    <span>100</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cure & Production */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Production Notes</h3>
            <div className="stat-card" style={{ marginBottom: 16, textAlign: 'center' }}>
              <div className="stat-value" style={{ color: 'var(--accent-violet)' }}>{result.cureWeeks} weeks</div>
              <div className="stat-label">Estimated Cure Time</div>
            </div>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>Weigh oils + tallow; melt and combine at 100–110°F</li>
              <li>Weigh NaOH ({result.lyeNaOH}g) — add to cold distilled water ({result.waterWeight}g), never reverse</li>
              <li>Cool lye solution to ~100°F; pour into oils</li>
              <li>Stick blend to light trace (thin pudding consistency)</li>
              <li>Add EOs ({result.eoWeight}g) and any additives at trace</li>
              <li>Pour into mold; insulate for gel phase (optional)</li>
              <li>Unmold in 24–48 hours; cut bars</li>
              <li>Cure {result.cureWeeks} weeks on rack with airflow</li>
            </ol>
            <div className="banner-warn" style={{ marginTop: 16 }}>
              ⚠️ NaOH is caustic. Always wear gloves and safety glasses. Work in ventilated area. Keep vinegar nearby for splashes.
            </div>
          </div>

          {/* Selected Additives */}
          {selectedAdditives.length > 0 && (
            <div className="glass-card" style={{ padding: 24, marginTop: 20 }}>
              <h3 style={{ marginBottom: 12 }}>Selected Additives</h3>
              {selectedAdditives.map(id => {
                const add = SOAP_ADDITIVES.find(a => a.id === id);
                if (!add) return null;
                return (
                  <div key={id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{add.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: 2 }}>Usage: {add.usageRate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{add.notes}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .soap-layout {
          display: grid;
          grid-template-columns: 1fr minmax(360px, 440px);
          gap: 24px;
          align-items: start;
        }
        .soap-settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .soap-oil-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .soap-oil-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          transition: border-color var(--duration-fast);
        }
        .soap-oil-row:hover {
          border-color: var(--border-default);
        }
        .soap-oil-info { flex: 1; min-width: 0; }
        .soap-oil-name { font-weight: 600; font-size: 0.875rem; display: flex; align-items: center; flex-wrap: wrap; }
        .soap-oil-controls { display: flex; align-items: center; gap: 8px; }
        .soap-lye-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .soap-additives-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .soap-additive-card {
          padding: 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background: var(--bg-elevated);
          cursor: pointer;
          transition: all var(--duration-fast);
        }
        .soap-additive-card:hover {
          border-color: var(--border-default);
        }
        .soap-additive-card--active {
          border-color: var(--accent-indigo);
          background: rgba(99,102,241,0.06);
        }
        .soap-additive-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .soap-eo-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .soap-eo-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        @media (max-width: 900px) {
          .soap-layout { grid-template-columns: 1fr; }
          .soap-settings-grid { grid-template-columns: 1fr; }
          .soap-additives-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
