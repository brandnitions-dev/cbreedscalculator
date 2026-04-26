'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import {
  PRODUCT_TYPE_LABEL,
  PRODUCT_TYPE_ROUTE,
  SAVED_FORMULA_GROUP_ORDER,
  type SavedProductType,
} from '@/lib/saved-formula-constants';
import type { SavedFormula } from '@/types';

type Row = SavedFormula & { tags: string[] };

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

export default function SavedFormulasPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

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

  const remove = useCallback(
    async (id: string) => {
      if (!window.confirm('Delete this saved formula?')) return;
      setDeleting(id);
      const res = await fetch(`/api/formulas/${id}`, { method: 'DELETE' });
      setDeleting(null);
      if (res.ok) {
        setRows(prev => prev.filter(r => r.id !== id));
      } else {
        setErr('Delete failed');
      }
    },
    [],
  );

  const grouped = groupByProduct(rows);

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-text-primary">Saved Formulas</h1>
        <p className="text-sm text-text-secondary mt-1 max-w-[640px]">
          Your recipes are stored per product line. Open one to load it into the matching calculator, then
          change batch size, tallow, or water without rebuilding the whole blend.
        </p>
      </header>

      {err && <p className="text-sm text-accent-rose">{err}</p>}

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
                          <Link
                            href={`${hrefBase}?load=${f.id}`}
                            className="rounded-sm bg-accent-indigo/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-inverse"
                          >
                            Open
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
