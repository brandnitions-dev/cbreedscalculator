'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { ExportCardActions, FormulaSaveBar } from '@/components/formula';
import { SOAP_SAFE_EO_IDS } from '@/lib/ingredients/essential-oils';
import { useIngredientGroups } from '@/lib/use-ingredient-groups';
import { calculateSoap, QUALITY_RANGES, getQualityRating } from '@/lib/chemistry';
import type { SoapOil } from '@/types';

interface OilRow {
  id: string;
  oil: SoapOil;
  pct: number;
}

export function SoapFormulaBuilder() {
  const { groups } = useIngredientGroups('SOAP');
  const didInitFromDb = useRef(false);

  const db = useMemo(() => {
    const byKey = new Map(groups?.map(g => [g.key, g.ingredients]) ?? []);

    const dbSoapOils: SoapOil[] = (byKey.get('soap_oils') ?? []).map((i: any) => {
      const m = (i.meta ?? {}) as Record<string, unknown>;
      return {
        id: i.slug,
        name: i.name,
        desc: i.desc,
        sapNaOH: Number(m.sapNaOH ?? 0),
        sapKOH: Number(m.sapKOH ?? 0),
        hardness: Number(m.hardness ?? 0),
        cleansing: Number(m.cleansing ?? 0),
        conditioning: Number(m.conditioning ?? 0),
        bubbly: Number(m.bubbly ?? 0),
        creamy: Number(m.creamy ?? 0),
        iodine: Number(m.iodine ?? 0),
        defaultPct: Number(m.defaultPct ?? 0),
        category: (m.category as SoapOil['category']) ?? 'base',
      };
    });

    const dbAdditives = (byKey.get('soap_additives') ?? []).map((i: any) => {
      const m = (i.meta ?? {}) as Record<string, unknown>;
      return {
        id: i.slug,
        name: i.name,
        desc: i.desc,
        phase: (m.phase as any) ?? 'trace',
        usageRate: String(m.usageRate ?? ''),
        notes: String(m.notes ?? ''),
      };
    });

    const dbEos = (byKey.get('essential_oils') ?? []).map((i: any) => ({
      id: i.slug,
      name: i.name,
      desc: i.desc,
      benefits: i.benefits ?? {},
      tips: i.tips ?? { low: '', mid: '', high: '' },
      potency: i.potency ?? undefined,
    }));

    return {
      soapOils: dbSoapOils,
      additives: dbAdditives,
      eos: dbEos,
    };
  }, [groups]);

  const [totalOilWeight, setTotalOilWeight] = useState(1000);
  const [superfat, setSuperfat] = useState(5);
  const [lyeConc, setLyeConc] = useState(33);
  const [eoPct, setEoPct] = useState(2.5);
  const [oilRows, setOilRows] = useState<OilRow[]>([]);
  const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);
  const [selectedEOs, setSelectedEOs] = useState<string[]>(['rosemary']);

  const soapSafeEOs = useMemo(() =>
    db.eos.filter(eo => SOAP_SAFE_EO_IDS.includes(eo.id)), [db.eos]
  );

  useEffect(() => {
    if (didInitFromDb.current) return;
    if (!groups) return;
    const defaults = db.soapOils.filter(o => o.defaultPct > 0);
    if (defaults.length) {
      setOilRows(defaults.map(oil => ({ id: oil.id, oil, pct: oil.defaultPct })));
      didInitFromDb.current = true;
    }
  }, [groups, db.soapOils]);

  useEffect(() => {
    const allowedOilIds = new Set(db.soapOils.map(o => o.id));
    const allowedAdditiveIds = new Set(db.additives.map(a => a.id));
    const allowedEoIds = new Set(soapSafeEOs.map(e => e.id));
    setOilRows(rows => rows.filter(r => allowedOilIds.has(r.oil.id)));
    setSelectedAdditives(ids => ids.filter(id => allowedAdditiveIds.has(id)));
    setSelectedEOs(ids => ids.filter(id => allowedEoIds.has(id)));
  }, [db.soapOils, db.additives, soapSafeEOs]);

  function toggleEO(id: string) {
    setSelectedEOs(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  }

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
    const oil = db.soapOils.find(o => o.id === oilId);
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

  const catColor = (cat: string) =>
    cat === 'base' ? 'bg-accent-indigo/15 text-accent-indigo-light' :
    cat === 'carrier' ? 'bg-accent-emerald/15 text-accent-emerald-light' :
    'bg-accent-gold/15 text-accent-gold-light';

  const getSnapshot = useCallback(
    () => ({
      v: 1 as const,
      superfat,
      lyeConc,
      eoPct,
      oilRows: oilRows.map(r => ({ id: r.id, pct: r.pct })),
      selectedAdditives,
      selectedEOs,
    }),
    [superfat, lyeConc, eoPct, oilRows, selectedAdditives, selectedEOs],
  );

  const onLoaded = useCallback(
    (ingredients: unknown, batchG: number) => {
      const s = ingredients as {
        v: number;
        superfat: number;
        lyeConc: number;
        eoPct: number;
        oilRows: { id: string; pct: number }[];
        selectedAdditives: string[];
        selectedEOs: string[];
      };
      if (!s || s.v !== 1) return;
      setTotalOilWeight(Math.max(100, batchG));
      setSuperfat(s.superfat);
      setLyeConc(s.lyeConc);
      setEoPct(s.eoPct);
      const next: OilRow[] = [];
      for (const r of s.oilRows) {
        const oil = db.soapOils.find(o => o.id === r.id);
        if (oil) next.push({ id: r.id, oil, pct: r.pct });
      }
      if (next.length) setOilRows(next);
      if (s.selectedAdditives?.length) {
        setSelectedAdditives(s.selectedAdditives.filter(a => db.additives.some(x => x.id === a)));
      }
      if (s.selectedEOs?.length) {
        setSelectedEOs(s.selectedEOs.filter(e => soapSafeEOs.some(x => x.id === e)));
      }
    },
    [db.additives, db.soapOils, soapSafeEOs],
  );

  return (
    <div className="space-y-5">
      <FormulaSaveBar
        productType="SOAP"
        getSnapshot={getSnapshot}
        batchSize={totalOilWeight}
        mode={null}
        onLoaded={onLoaded}
      />
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(360px,440px)] gap-6 items-start">
      {/* Left: Oil Recipe */}
      <div className="space-y-5">
        {/* Batch Settings */}
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-4">Batch Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">Total Oil Weight (g)</label>
              <input
                type="number"
                className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm font-mono text-text-primary focus:border-accent-emerald/50 focus:outline-none"
                value={totalOilWeight}
                onChange={e => setTotalOilWeight(Math.max(100, +e.target.value))}
                min={100} step={50}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">Superfat: {superfat}%</label>
              <input type="range" min={0} max={10} step={0.5} value={superfat} onChange={e => setSuperfat(+e.target.value)} className="w-full accent-accent-emerald h-1.5" />
              <div className="flex justify-between text-[10px] text-text-muted mt-1"><span>0% (harsh)</span><span>5% (std)</span><span>10% (luxury)</span></div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">Lye Concentration: {lyeConc}%</label>
              <input type="range" min={25} max={40} step={1} value={lyeConc} onChange={e => setLyeConc(+e.target.value)} className="w-full accent-accent-emerald h-1.5" />
              <div className="flex justify-between text-[10px] text-text-muted mt-1"><span>25% (slow)</span><span>33% (std)</span><span>40% (fast)</span></div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">EO % of oils: {eoPct}%</label>
              <input type="range" min={0} max={5} step={0.5} value={eoPct} onChange={e => setEoPct(+e.target.value)} className="w-full accent-accent-gold h-1.5" />
            </div>
          </div>
        </GlassCard>

        {/* Oil Blend */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">Oil Blend</h3>
            <span className={cn(
              'text-[11px] font-semibold px-2.5 py-1 rounded-full',
              Math.abs(totalPct - 100) < 0.5 ? 'bg-accent-emerald/15 text-accent-emerald-light' : 'bg-accent-rose/15 text-accent-rose'
            )}>{totalPct.toFixed(1)}% total</span>
          </div>

          {Math.abs(totalPct - 100) > 0.5 && (
            <div className="flex items-start gap-2 rounded-md border border-accent-gold/30 bg-accent-gold/[0.06] px-3 py-2.5 text-xs text-accent-gold-light mb-4">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              Oil percentages should sum to 100%. Currently at {totalPct.toFixed(1)}%.
            </div>
          )}

          <div className="space-y-2">
            {oilRows.map(row => (
              <div key={row.id} className="flex items-center justify-between gap-3 p-3 rounded-sm bg-surface-elevated/40 border border-border-subtle hover:border-border transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-semibold text-text-primary">{row.oil.name}</span>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', catColor(row.oil.category))}>{row.oil.category}</span>
                  </div>
                  <div className="text-[11px] text-text-tertiary mt-0.5">
                    SAP: {row.oil.sapNaOH} · Hard: {row.oil.hardness} · Clean: {row.oil.cleansing} · Cond: {row.oil.conditioning}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    className="w-16 bg-surface-input border border-border rounded-xs px-2 py-1.5 text-sm font-mono text-right text-text-primary focus:border-accent-emerald/50 focus:outline-none"
                    value={row.pct} onChange={e => updateOilPct(row.id, +e.target.value)}
                    min={0} max={100} step={1}
                  />
                  <span className="text-[11px] text-text-muted">%</span>
                  <span className="text-[12px] font-mono text-text-secondary min-w-[50px] text-right">
                    {((row.pct / (totalPct || 100)) * totalOilWeight).toFixed(0)}g
                  </span>
                  <button onClick={() => removeOil(row.id)} className="p-1 rounded-xs hover:bg-accent-rose/15 text-text-tertiary hover:text-accent-rose transition-colors" aria-label="Remove">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <select
              className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-secondary focus:border-accent-emerald/50 focus:outline-none"
              onChange={e => { if (e.target.value) { addOil(e.target.value); e.target.value = ''; } }}
              defaultValue=""
            >
              <option value="" disabled>+ Add oil to recipe…</option>
              {db.soapOils.filter(o => !oilRows.find(r => r.id === o.id)).map(oil => (
                <option key={oil.id} value={oil.id}>{oil.name} (SAP {oil.sapNaOH})</option>
              ))}
            </select>
          </div>
        </GlassCard>

        {/* Additives */}
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-4">Additives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {db.additives.map(add => (
              <label key={add.id} className={cn(
                'p-3 rounded-sm border cursor-pointer transition-all',
                selectedAdditives.includes(add.id)
                  ? 'border-accent-indigo/40 bg-accent-indigo/[0.06]'
                  : 'border-border-subtle bg-surface-elevated/40 hover:border-border'
              )}>
                <input type="checkbox" checked={selectedAdditives.includes(add.id)} onChange={() => toggleAdditive(add.id)} className="hidden" />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-text-primary">{add.name}</span>
                  <span className={cn(
                    'text-[10px] font-medium px-2 py-0.5 rounded-full',
                    add.phase === 'trace' ? 'bg-accent-indigo/15 text-accent-indigo-light' :
                    add.phase === 'lye-water' ? 'bg-accent-emerald/15 text-accent-emerald-light' :
                    'bg-accent-gold/15 text-accent-gold-light'
                  )}>{add.phase}</span>
                </div>
                <div className="text-[10px] text-accent-gold-light mt-1">{add.usageRate}</div>
                <div className="text-[11px] text-text-tertiary mt-1 leading-relaxed">{add.desc}</div>
              </label>
            ))}
          </div>
        </GlassCard>

        {/* Essential Oils Selection */}
        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-text-primary">Essential Oils</h3>
            <span className={cn(
              'text-[11px] font-semibold px-2.5 py-1 rounded-full',
              selectedEOs.length > 0 ? 'bg-accent-gold/15 text-accent-gold-light' : 'bg-surface-elevated text-text-muted'
            )}>{selectedEOs.length} selected · {eoPct}% of oils</span>
          </div>
          <p className="text-[12px] text-text-secondary mb-3">Click to select EOs. These survive saponification and retain scent through cure.</p>
          <div className="flex flex-wrap gap-2">
            {soapSafeEOs.map(eo => (
              <button
                key={eo.id}
                onClick={() => toggleEO(eo.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] transition-all border',
                  selectedEOs.includes(eo.id)
                    ? 'border-accent-gold/40 bg-accent-gold/[0.12] text-accent-gold-light'
                    : 'border-border-subtle bg-surface-elevated/60 text-text-secondary hover:border-border hover:text-text-primary'
                )}
              >
                <span className="font-semibold">{eo.name}</span>
                {eo.potency === 'strong' && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent-rose/15 text-accent-rose font-medium">potent</span>}
              </button>
            ))}
          </div>
          {selectedEOs.length > 0 && (
            <div className="mt-4 p-3 rounded-sm bg-surface-elevated/40 border border-border-subtle">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">Selected Blend ({result.eoWeight}g total)</div>
              <div className="space-y-1.5">
                {selectedEOs.map(id => {
                  const eo = soapSafeEOs.find(e => e.id === id);
                  if (!eo) return null;
                  const perEoWeight = (result.eoWeight / selectedEOs.length).toFixed(1);
                  return (
                    <div key={id} className="flex items-center justify-between text-[12px]">
                      <span className="text-text-primary font-medium">{eo.name}</span>
                      <span className="text-text-muted font-mono">{perEoWeight}g</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Right: Results */}
      <div className="space-y-5">
        {/* Lye Calculation */}
        <GlassCard id="soap-lye-card">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold text-accent-emerald-light">⚗️ Lye Calculation</h3>
            <ExportCardActions targetId="soap-lye-card" filename="mosskyn-soap-lye-calculation" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: `${result.lyeNaOH}g`, label: 'NaOH (lye)', color: 'text-accent-rose' },
              { value: `${result.waterWeight}g`, label: 'Distilled Water', color: 'text-accent-sky' },
              { value: `${result.eoWeight}g`, label: 'Essential Oils', color: 'text-accent-emerald' },
              { value: `${result.totalBatchWeight}g`, label: 'Total Batch', color: 'text-accent-gold' },
            ].map(s => (
              <div key={s.label} className="text-center py-3 rounded-sm bg-surface-input/50 border border-border-subtle">
                <div className={cn('text-xl font-black', s.color)}>{s.value}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-md bg-accent-indigo/[0.06] border border-accent-indigo/20 px-3 py-2 text-[11px] text-accent-indigo-light">
            Superfat: {result.superfatPct}% — {result.superfatPct <= 3 ? 'minimal conditioning' : result.superfatPct <= 6 ? 'standard conditioning' : 'luxury conditioning'}
          </div>
        </GlassCard>

        {/* Oil Breakdown */}
        <GlassCard id="soap-oil-breakdown-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-bold text-text-primary">Oil Breakdown</h3>
            <ExportCardActions targetId="soap-oil-breakdown-card" filename="mosskyn-soap-oil-breakdown" />
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2 text-text-muted font-semibold">Oil</th>
                <th className="text-right py-2 text-text-muted font-semibold">%</th>
                <th className="text-right py-2 text-text-muted font-semibold">Weight</th>
                <th className="text-right py-2 text-text-muted font-semibold">Lye (g)</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              {result.oils.map(oil => (
                <tr key={oil.name} className="border-b border-border-subtle/50">
                  <td className="py-1.5 font-medium text-text-primary">{oil.name}</td>
                  <td className="py-1.5 text-right font-mono">{oil.pct.toFixed(1)}%</td>
                  <td className="py-1.5 text-right font-mono">{oil.weight}g</td>
                  <td className="py-1.5 text-right font-mono">{oil.lyeContribution.toFixed(2)}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        {/* Bar Quality */}
        <GlassCard id="soap-quality-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-bold text-text-primary">Bar Quality Indices</h3>
            <ExportCardActions targetId="soap-quality-card" filename="mosskyn-soap-quality-indices" />
          </div>
          {Object.entries(QUALITY_RANGES).map(([key, range]) => {
            const value = key === 'hardness' ? result.hardnessIndex :
                          key === 'cleansing' ? result.cleansingIndex :
                          result.conditioningIndex;
            const rating = getQualityRating(value, range.min, range.max);
            const fillPct = Math.min(100, (value / 100) * 100);
            const barColor = rating === 'good' ? '#10b981' : rating === 'low' ? '#38bdf8' : '#f43f5e';
            return (
              <div key={key} className="mb-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-text-primary">{range.label}</span>
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                    rating === 'good' ? 'bg-accent-emerald/15 text-accent-emerald-light' :
                    rating === 'low' ? 'bg-accent-sky/15 text-accent-sky' :
                    'bg-accent-rose/15 text-accent-rose'
                  )}>{value} — {rating === 'good' ? 'Balanced' : rating === 'low' ? 'Low' : 'High'}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-input overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${fillPct}%`, background: barColor }} />
                </div>
                <div className="flex justify-between text-[9px] text-text-muted mt-0.5">
                  <span>0</span>
                  <span className="text-accent-emerald-light">{range.min}–{range.max} ideal</span>
                  <span>100</span>
                </div>
              </div>
            );
          })}
        </GlassCard>

        {/* Production Notes */}
        <GlassCard id="soap-production-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-bold text-text-primary">Production Notes</h3>
            <ExportCardActions targetId="soap-production-card" filename="mosskyn-soap-production-notes" />
          </div>
          <div className="text-center py-3 rounded-sm bg-surface-input/50 border border-border-subtle mb-3">
            <div className="text-2xl font-black text-accent-violet">{result.cureWeeks} weeks</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-1">Estimated Cure Time</div>
          </div>
          <ol className="pl-5 text-[12px] text-text-secondary leading-[1.9] list-decimal">
            <li>Weigh oils + tallow; melt and combine at 100–110°F</li>
            <li>Weigh NaOH ({result.lyeNaOH}g) — add to cold water ({result.waterWeight}g)</li>
            <li>Cool lye solution to ~100°F; pour into oils</li>
            <li>Stick blend to light trace</li>
            <li>Add EOs ({result.eoWeight}g) and additives at trace</li>
            <li>Pour into mold; insulate for gel phase (optional)</li>
            <li>Unmold 24–48h; cut bars</li>
            <li>Cure {result.cureWeeks} weeks on rack</li>
          </ol>
          <div className="mt-3 flex items-start gap-2 rounded-md border border-accent-rose/30 bg-accent-rose/[0.06] px-3 py-2.5 text-xs text-accent-rose">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            NaOH is caustic. Always wear gloves and safety glasses. Work in ventilated area.
          </div>
        </GlassCard>

        {/* Selected Additives */}
        {selectedAdditives.length > 0 && (
          <GlassCard id="soap-additives-card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-bold text-text-primary">Selected Additives</h3>
              <ExportCardActions targetId="soap-additives-card" filename="mosskyn-soap-selected-additives" />
            </div>
            {selectedAdditives.map(id => {
              const add = db.additives.find(a => a.id === id);
              if (!add) return null;
              return (
                <div key={id} className="mb-3 pb-3 border-b border-border-subtle last:border-0 last:mb-0 last:pb-0">
                  <div className="text-[13px] font-semibold text-text-primary">{add.name}</div>
                  <div className="text-[11px] text-accent-gold-light mt-0.5">Usage: {add.usageRate}</div>
                  <div className="text-[11px] text-text-tertiary mt-1">{add.notes}</div>
                </div>
              );
            })}
          </GlassCard>
        )}
      </div>
    </div>
    </div>
  );
}
