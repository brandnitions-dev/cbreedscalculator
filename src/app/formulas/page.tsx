'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Eye, Loader2, Trash2, X } from 'lucide-react';
import { ExportCardActions } from '@/components/formula';
import { GlassCard } from '@/components/ui';
import { calculateSoap } from '@/lib/chemistry';
import { calcFormula, FB_COLORS, type BalmMode } from '@/lib/formula-engine';
import {
  PRODUCT_TYPE_LABEL,
  PRODUCT_TYPE_ROUTE,
  SAVED_FORMULA_GROUP_ORDER,
  type SavedProductType,
} from '@/lib/saved-formula-constants';
import type { PoolRow, SavedFormula, SoapOil } from '@/types';

type Row = Omit<SavedFormula, 'mode' | 'notes'> & {
  tags: string[];
  mode: string | null;
  notes: string | null;
};

type IngredientPayload = {
  productType: string;
  groups: {
    key: string;
    label: string;
    ingredients: IngredientLite[];
  }[];
};

type IngredientLite = {
  slug: string;
  name: string;
  desc?: string;
  color?: string | null;
  meta?: Record<string, unknown> | null;
};

type DetailLine = {
  name: string;
  pctText?: string;
  amountText?: string;
  color?: string;
  note?: string;
};

type DetailSection = {
  title: string;
  lines: DetailLine[];
};

type FormulaDetail = {
  stats: { label: string; value: string }[];
  sections: DetailSection[];
  callouts: string[];
};

function groupByProduct(rows: Row[]): Map<SavedProductType, Row[]> {
  const m = new Map<SavedProductType, Row[]>();
  SAVED_FORMULA_GROUP_ORDER.forEach(t => m.set(t, []));
  for (const r of rows) {
    const t = r.productType as SavedProductType;
    if (!m.has(t)) m.set(t, []);
    m.get(t)!.push(r);
  }
  return m;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function safeFilename(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'saved-formula';
}

function labelFromSlug(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatPct(value: number, mode: 'fraction' | 'percent' = 'fraction'): string {
  const pct = mode === 'fraction' ? value * 100 : value;
  return `${pct.toFixed(pct < 1 ? 2 : 1)}%`;
}

function formatAmount(value: number, unit: 'ml' | 'g'): string {
  return `${value.toFixed(value < 10 ? 2 : 1)}${unit}`;
}

function ingredient(payload: IngredientPayload | undefined, slug: string): IngredientLite | undefined {
  return payload?.groups.flatMap(g => g.ingredients).find(i => i.slug === slug);
}

function ingredientName(payload: IngredientPayload | undefined, slug: string): string {
  return ingredient(payload, slug)?.name ?? labelFromSlug(slug);
}

function ingredientColor(payload: IngredientPayload | undefined, slug: string, fallback: string): string {
  return ingredient(payload, slug)?.color ?? fallback;
}

function readPool(snapshot: Record<string, unknown> | null, key: string): PoolRow[] {
  const pools = asRecord(snapshot?.pools);
  const rows = pools?.[key];
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row, index) => {
      const r = asRecord(row);
      const ingId = typeof r?.ingId === 'string' ? r.ingId : '';
      const weight = Number(r?.weight ?? 0);
      return { id: index + 1, ingId, weight: Number.isFinite(weight) ? weight : 0 };
    })
    .filter(row => row.ingId);
}

function splitWeighted(rows: PoolRow[], totalPct: number) {
  const totalWeight = rows.reduce((sum, row) => sum + row.weight, 0) || 1;
  return rows.map(row => ({ ...row, pct: totalPct * row.weight / totalWeight }));
}

function lineFromFraction(name: string, pct: number, batchSize: number, unit: 'ml' | 'g', color?: string, note?: string): DetailLine {
  return {
    name,
    pctText: formatPct(pct),
    amountText: formatAmount(pct * batchSize, unit),
    color,
    note,
  };
}

function buildBalmOrCleanerDetail(row: Row, payload: IngredientPayload | undefined): FormulaDetail {
  const snapshot = asRecord(row.ingredients);
  const mode: BalmMode = snapshot?.mode === 'face' || snapshot?.mode === 'body' || snapshot?.mode === 'lips' || snapshot?.mode === 'eyes' || snapshot?.mode === 'eyes_balm'
    ? snapshot.mode
    : row.mode === 'face' || row.mode === 'body' || row.mode === 'lips' || row.mode === 'eyes' || row.mode === 'eyes_balm'
      ? row.mode
      : 'body';
  const beeswaxOn = snapshot?.beeswaxOn !== false;
  const cPct = typeof snapshot?.cPct === 'number' ? snapshot.cPct / 100 : 0.08;
  const pools = {
    a: readPool(snapshot, 'a'),
    b: readPool(snapshot, 'b'),
    c: row.productType === 'CLEANER' ? readPool(snapshot, 'c') : [],
    eo: readPool(snapshot, 'eo'),
  };
  const result = calcFormula(
    mode,
    row.productType === 'BALM' ? 'balm' : 'scrub',
    pools,
    cPct,
    beeswaxOn,
  );

  const fixed = result.fixed.map(line => lineFromFraction(line.name, line.pct, row.batchSize, 'ml', line.color, 'Fixed base'));
  const carriers = result.aSplit.map((line, index) => lineFromFraction(
    ingredientName(payload, line.ingId),
    line.pct,
    row.batchSize,
    'ml',
    ingredientColor(payload, line.ingId, FB_COLORS[`a${index}`] ?? '#85B7EB'),
    `Weight score ${line.weight}`,
  ));
  const actives = result.bSplit.map((line, index) => lineFromFraction(
    ingredientName(payload, line.ingId),
    line.pct,
    row.batchSize,
    'ml',
    ingredientColor(payload, line.ingId, FB_COLORS[`b${index}`] ?? '#D85A30'),
    `Weight score ${line.weight}`,
  ));
  const exfoliants = result.cSplit.map((line, index) => lineFromFraction(
    ingredientName(payload, line.ingId),
    line.pct,
    row.batchSize,
    'ml',
    ingredientColor(payload, line.ingId, FB_COLORS[`c${index}`] ?? '#C4A574'),
    `Weight score ${line.weight}`,
  ));
  const eos = result.eoSplit.map((line, index) => lineFromFraction(
    ingredientName(payload, line.ingId),
    line.pct,
    row.batchSize,
    'ml',
    ingredientColor(payload, line.ingId, FB_COLORS[`eo${index}`] ?? '#534AB7'),
    `Weight score ${line.weight}`,
  ));

  return {
    stats: [
      { label: 'Batch', value: `${row.batchSize}ml` },
      { label: 'Formula', value: mode },
      ...(mode === 'face' || mode === 'body' ? [{ label: 'Beeswax', value: beeswaxOn ? 'Included' : 'Off' }] : []),
      ...(mode === 'lips' ? [{ label: 'Essential oils', value: formatPct(result.eoPct) }] : []),
      ...(mode === 'eyes' || mode === 'eyes_balm' ? [{ label: 'Essential oils', value: '0% (eye-safe)' }] : []),
      ...(row.productType === 'CLEANER' ? [{ label: 'Exfoliant phase', value: formatPct(cPct) }] : []),
    ],
    sections: [
      { title: 'Fixed base', lines: fixed },
      { title: 'Carrier oils', lines: carriers },
      { title: 'Active botanicals', lines: actives },
      ...(exfoliants.length ? [{ title: 'Physical exfoliants', lines: exfoliants }] : []),
      { title: 'Essential oils', lines: eos },
    ].filter(section => section.lines.length > 0),
    callouts: [
      mode === 'eyes'
        ? 'Eye serum emulsion with Olivem 1000 emulsifier and Geogard Ultra preservative. pH target 5.0–5.5.'
        : mode === 'eyes_balm'
          ? 'Anhydrous eye oil serum. Zero tallow, zero beeswax, zero water. Shelf life 12–18 months.'
          : 'Percentages are normalized from the saved weight scores and scaled to the saved batch size.',
    ],
  };
}

function buildExfoliatorDetail(row: Row, payload: IngredientPayload | undefined): FormulaDetail {
  const snapshot = asRecord(row.ingredients);
  const activePct = typeof snapshot?.activePct === 'number' ? snapshot.activePct : 0.05;
  const eoPct = typeof snapshot?.eoPct === 'number' ? snapshot.eoPct : 0;
  const pools = {
    carriers: readPool(snapshot, 'carriers'),
    actives: readPool(snapshot, 'actives'),
    eos: readPool(snapshot, 'eos'),
  };

  const buildLines = (rows: PoolRow[], totalPct: number, fallback: string) =>
    splitWeighted(rows, Math.max(0, totalPct)).map(line => lineFromFraction(
      ingredientName(payload, line.ingId),
      line.pct,
      row.batchSize,
      'ml',
      ingredientColor(payload, line.ingId, fallback),
      `Weight score ${line.weight}`,
    ));

  const carriers = buildLines(pools.carriers, 1 - activePct - eoPct, '#5DCAA5');
  const actives = buildLines(pools.actives, activePct, '#FCD34D');
  const eos = buildLines(pools.eos, eoPct, '#C4B5FD');

  return {
    stats: [
      { label: 'Batch', value: `${row.batchSize}ml` },
      { label: 'Carrier phase', value: formatPct(1 - activePct - eoPct) },
      { label: 'Active phase', value: formatPct(activePct) },
      { label: 'Essential oils', value: formatPct(eoPct) },
    ],
    sections: [
      { title: 'Carrier oils', lines: carriers },
      { title: 'Active ingredients', lines: actives },
      { title: 'Essential oils', lines: eos },
    ].filter(section => section.lines.length > 0),
    callouts: ['Formula is rebuilt from the saved carrier, active, and EO phase percentages.'],
  };
}

function soapOilFromIngredient(i: IngredientLite): SoapOil {
  const meta = i.meta ?? {};
  return {
    id: i.slug,
    name: i.name,
    desc: i.desc ?? '',
    sapNaOH: Number(meta.sapNaOH ?? 0),
    sapKOH: Number(meta.sapKOH ?? 0),
    hardness: Number(meta.hardness ?? 0),
    cleansing: Number(meta.cleansing ?? 0),
    conditioning: Number(meta.conditioning ?? 0),
    bubbly: Number(meta.bubbly ?? 0),
    creamy: Number(meta.creamy ?? 0),
    iodine: Number(meta.iodine ?? 0),
    defaultPct: Number(meta.defaultPct ?? 0),
    category: (meta.category === 'base' || meta.category === 'carrier' || meta.category === 'luxury') ? meta.category : 'base',
  };
}

function buildSoapDetail(row: Row, payload: IngredientPayload | undefined): FormulaDetail {
  const snapshot = asRecord(row.ingredients);
  const oilRowsRaw = snapshot?.oilRows;
  const oilRows = Array.isArray(oilRowsRaw)
    ? oilRowsRaw
        .map(rowValue => {
          const r = asRecord(rowValue);
          const id = typeof r?.id === 'string' ? r.id : '';
          const pct = Number(r?.pct ?? 0);
          return { id, pct: Number.isFinite(pct) ? pct : 0 };
        })
        .filter(line => line.id)
    : [];
  const selectedAdditives = Array.isArray(snapshot?.selectedAdditives) ? snapshot.selectedAdditives.map(String) : [];
  const selectedEOs = Array.isArray(snapshot?.selectedEOs) ? snapshot.selectedEOs.map(String) : [];
  const superfat = typeof snapshot?.superfat === 'number' ? snapshot.superfat : 5;
  const lyeConc = typeof snapshot?.lyeConc === 'number' ? snapshot.lyeConc : 33;
  const eoPct = typeof snapshot?.eoPct === 'number' ? snapshot.eoPct : 2.5;

  const oilInputs = oilRows
    .map(oilRow => {
      const i = ingredient(payload, oilRow.id);
      return i ? { oil: soapOilFromIngredient(i), pct: oilRow.pct } : null;
    })
    .filter((item): item is { oil: SoapOil; pct: number } => item != null);

  const result = calculateSoap(oilInputs, row.batchSize, superfat, lyeConc, eoPct);
  const oilLines = result.oils.map(oil => ({
    name: oil.name,
    pctText: formatPct(oil.pct, 'percent'),
    amountText: formatAmount(oil.weight, 'g'),
    color: '#5DCAA5',
    note: `${oil.lyeContribution.toFixed(4)}g NaOH before superfat`,
  }));
  const eoEach = selectedEOs.length > 0 ? result.eoWeight / selectedEOs.length : 0;

  return {
    stats: [
      { label: 'Oil weight', value: `${row.batchSize}g` },
      { label: 'NaOH', value: `${result.lyeNaOH}g` },
      { label: 'Water', value: `${result.waterWeight}g` },
      { label: 'Total batch', value: `${result.totalBatchWeight}g` },
      { label: 'Superfat', value: `${superfat}%` },
      { label: 'Cure', value: `${result.cureWeeks} weeks` },
    ],
    sections: [
      { title: 'Oil breakdown', lines: oilLines },
      {
        title: 'Essential oil blend',
        lines: selectedEOs.map(id => ({
          name: ingredientName(payload, id),
          pctText: selectedEOs.length ? formatPct(eoPct / selectedEOs.length, 'percent') : undefined,
          amountText: formatAmount(eoEach, 'g'),
          color: '#FAC775',
        })),
      },
      {
        title: 'Selected additives',
        lines: selectedAdditives.map(id => ({
          name: ingredientName(payload, id),
          color: '#AFA9EC',
          note: ingredient(payload, id)?.desc,
        })),
      },
    ].filter(section => section.lines.length > 0),
    callouts: [
      `Lye concentration: ${lyeConc}%. Essential oils: ${eoPct}% of oil weight.`,
      `Bar quality: hardness ${result.hardnessIndex}, cleansing ${result.cleansingIndex}, conditioning ${result.conditioningIndex}.`,
    ],
  };
}

function buildGenericDetail(row: Row): FormulaDetail {
  return {
    stats: [
      { label: 'Batch', value: `${row.batchSize}` },
      { label: 'Product', value: PRODUCT_TYPE_LABEL[row.productType as SavedProductType] ?? row.productType },
    ],
    sections: [
      {
        title: 'Saved snapshot',
        lines: [{ name: 'This formula snapshot is saved and can be loaded into its calculator.', note: JSON.stringify(row.ingredients) }],
      },
    ],
    callouts: ['Open it in the calculator to continue editing this product type.'],
  };
}

function buildDetail(row: Row, payload: IngredientPayload | undefined): FormulaDetail {
  if (row.productType === 'BALM' || row.productType === 'CLEANER') return buildBalmOrCleanerDetail(row, payload);
  if (row.productType === 'EXFOLIATOR' || row.productType === 'TREATMENT_OIL') return buildExfoliatorDetail(row, payload);
  if (row.productType === 'SOAP') return buildSoapDetail(row, payload);
  return buildGenericDetail(row);
}

function FormulaDetailPanel({
  row,
  payload,
  onClose,
}: {
  row: Row;
  payload: IngredientPayload | undefined;
  onClose: () => void;
}) {
  const detail = useMemo(() => buildDetail(row, payload), [row, payload]);
  const type = row.productType as SavedProductType;
  const hrefBase = PRODUCT_TYPE_ROUTE[type];
  const exportId = `saved-formula-export-${row.id}`;
  const filename = `mosskyn-${safeFilename(row.name)}`;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-gold-light">Full formula</p>
          <h2 className="mt-1 text-xl font-black text-text-primary">{row.name}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2" data-export-ignore="true">
          <ExportCardActions targetId={exportId} filename={filename} />
          <Link
            href={`${hrefBase}?load=${row.id}`}
            className="inline-flex items-center gap-1.5 rounded-sm bg-accent-indigo px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-text-inverse"
          >
            Load editor
            <ArrowUpRight size={13} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-border p-2 text-text-muted hover:border-border hover:text-text-primary"
            aria-label="Close formula detail"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <GlassCard
        id={exportId}
        className="overflow-hidden border-accent-indigo/25 bg-gradient-to-br from-surface-card via-surface-card to-accent-indigo/[0.08]"
      >
        <div className="border-b border-border-subtle pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-accent-indigo-light">
                {PRODUCT_TYPE_LABEL[type] ?? row.productType}
              </p>
              <h3 className="mt-2 text-2xl font-black leading-tight text-text-primary">{row.name}</h3>
              <p className="mt-1 text-xs text-text-muted">
                Updated {new Date(row.updatedAt).toLocaleString()}
                {row.mode && <span className="ml-2 rounded-xs bg-surface-elevated px-1.5 py-0.5">{row.mode}</span>}
              </p>
            </div>
          </div>

          {row.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {row.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full border border-border-subtle bg-surface-elevated/40 px-2 py-0.5 text-[10px] font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {row.notes && <p className="mt-3 text-sm leading-relaxed text-text-secondary">{row.notes}</p>}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {detail.stats.map(stat => (
            <div key={`${stat.label}-${stat.value}`} className="rounded-sm border border-border-subtle bg-surface-input/50 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{stat.label}</div>
              <div className="mt-1 text-base font-black text-text-primary">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {detail.sections.map(section => (
            <div key={section.title} className="rounded-sm border border-border-subtle bg-surface-input/30 p-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-text-secondary">{section.title}</h4>
              <div className="mt-3 space-y-2">
                {section.lines.map((line, index) => (
                  <div key={`${section.title}-${line.name}-${index}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: line.color ?? '#85B7EB' }}
                        />
                        <span className="truncate font-semibold text-text-primary">{line.name}</span>
                      </div>
                      {line.note && <p className="mt-0.5 line-clamp-2 pl-5 text-[10px] text-text-muted">{line.note}</p>}
                    </div>
                    <span className="font-mono text-text-secondary">{line.pctText ?? '—'}</span>
                    <span className="min-w-[58px] text-right font-mono text-text-primary">{line.amountText ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {detail.callouts.length > 0 && (
          <div className="mt-5 space-y-1.5 rounded-sm border border-accent-gold/20 bg-accent-gold/[0.06] p-3">
            {detail.callouts.map(callout => (
              <p key={callout} className="text-xs leading-relaxed text-text-secondary">{callout}</p>
            ))}
          </div>
        )}
      </GlassCard>
    </section>
  );
}

export default function SavedFormulasPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ingredientGroups, setIngredientGroups] = useState<Partial<Record<SavedProductType, IngredientPayload | null>>>({});
  const [loadingIngredientTypes, setLoadingIngredientTypes] = useState<Partial<Record<SavedProductType, boolean>>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const res = await fetch('/api/formulas');
    if (!res.ok) {
      setErr('Could not load formulas. Try signing in again.');
      setRows([]);
      setLoading(false);
      return;
    }
    const data = (await res.json()) as Row[];
    setRows(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const needed = Array.from(new Set(rows.map(row => row.productType as SavedProductType))).filter(
      type => ingredientGroups[type] === undefined && !loadingIngredientTypes[type],
    );
    if (needed.length === 0) return;

    let cancelled = false;
    const controllers: AbortController[] = [];
    needed.forEach(type => {
      const controller = new AbortController();
      controllers.push(controller);
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      setLoadingIngredientTypes(prev => ({ ...prev, [type]: true }));
      fetch(`/api/ingredients?productType=${type}`, { signal: controller.signal })
        .then(res => (res.ok ? res.json() : null))
        .then((data: IngredientPayload | null) => {
          if (cancelled) return;
          setIngredientGroups(prev => ({ ...prev, [type]: data }));
        })
        .catch(() => {
          if (cancelled) return;
          // Fall back to prettified saved slugs instead of showing a permanent spinner.
          setIngredientGroups(prev => ({ ...prev, [type]: null }));
        })
        .finally(() => {
          window.clearTimeout(timeout);
          if (cancelled) return;
          setLoadingIngredientTypes(prev => ({ ...prev, [type]: false }));
        });
    });

    return () => {
      cancelled = true;
      controllers.forEach(controller => controller.abort());
    };
  }, [rows, ingredientGroups, loadingIngredientTypes]);

  const remove = useCallback(
    async (id: string) => {
      if (!window.confirm('Delete this saved formula?')) return;
      setDeleting(id);
      const res = await fetch(`/api/formulas/${id}`, { method: 'DELETE' });
      setDeleting(null);
      if (res.ok) {
        setRows(prev => prev.filter(r => r.id !== id));
        setSelectedId(prev => (prev === id ? null : prev));
      } else {
        setErr('Delete failed');
      }
    },
    [],
  );

  const grouped = groupByProduct(rows);
  const selected = rows.find(row => row.id === selectedId) ?? null;

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-text-primary">Saved Formulas</h1>
        <p className="text-sm text-text-secondary mt-1 max-w-[640px]">
          Saved formulas are full recipes. View the complete ingredient breakdown here, export a formula card,
          or load one into the matching calculator for edits.
        </p>
      </header>

      {err && <p className="text-sm text-accent-rose">{err}</p>}

      {selected && (
        <FormulaDetailPanel
          row={selected}
          payload={ingredientGroups[selected.productType as SavedProductType] ?? undefined}
          onClose={() => setSelectedId(null)}
        />
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted">
          <Loader2 className="animate-spin" size={18} />
          Loading…
        </div>
      ) : (
        <div className="space-y-10">
          {SAVED_FORMULA_GROUP_ORDER.map(type => {
            const list = grouped.get(type) ?? [];
            if (list.length === 0) return null;
            const hrefBase = PRODUCT_TYPE_ROUTE[type];
            return (
              <section key={type} className="space-y-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-accent-indigo-light border-b border-border-subtle pb-2">
                  {PRODUCT_TYPE_LABEL[type]}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {list.map(f => (
                    <GlassCard key={f.id} className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-text-primary truncate">{f.name}</h3>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            Updated {new Date(f.updatedAt).toLocaleString()}
                            {f.mode && (
                              <span className="ml-2 rounded-xs bg-surface-elevated px-1.5 py-0.5">{f.mode}</span>
                            )}
                            <span className="ml-2 font-mono">Batch: {f.batchSize}{type === 'SOAP' ? 'g' : 'ml'}</span>
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedId(f.id)}
                            className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-elevated/40 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-secondary hover:border-accent-indigo/40 hover:text-text-primary"
                          >
                            <Eye size={13} />
                            View
                          </button>
                          <Link
                            href={`${hrefBase}?load=${f.id}`}
                            className="rounded-sm bg-accent-indigo/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-inverse"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => void remove(f.id)}
                            disabled={deleting === f.id}
                            className="rounded-sm border border-border p-1.5 text-text-muted hover:text-accent-rose hover:border-accent-rose/40"
                            aria-label="Delete"
                          >
                            {deleting === f.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </div>
                      {f.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {f.tags.map(t => (
                            <span
                              key={t}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border-subtle text-text-secondary"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {f.notes && <p className="text-xs text-text-tertiary line-clamp-2">{f.notes}</p>}
                    </GlassCard>
                  ))}
                </div>
              </section>
            );
          })}

          {rows.length === 0 && !loading && (
            <div className="text-center py-16 text-text-secondary border border-dashed border-border-subtle rounded-md">
              <p className="text-sm">No saved formulas yet.</p>
              <p className="text-xs text-text-muted mt-2">Use “Save formula” in any product calculator, then return here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
