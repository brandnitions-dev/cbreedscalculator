'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type Group = { key: string; label: string; sortOrder: number };

type AdminIngredient = {
  id: string;
  slug: string;
  name: string;
  desc: string;
  color: string | null;
  potency: 'mild' | 'moderate' | 'strong' | null;
  maxPct: number | null;
  warn: boolean;
  benefits: Record<string, number>;
  tips: { low: string; mid: string; high: string };
  meta: Record<string, unknown>;
  updatedAt: string;
  groupKeys: string[];
  productTypes: string[];
};

const PRODUCT_TYPES = ['BALM', 'CLEANER', 'EXFOLIATOR', 'SOAP', 'TREATMENT_OIL'] as const;

function safeParseJson<T>(s: string, fallback: T): T {
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-surface-elevated/60 border border-border-subtle text-text-secondary">
      {children}
    </span>
  );
}

export default function AdminIngredientLibrary() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [ingredients, setIngredients] = useState<AdminIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [q, setQ] = useState('');
  const [productType, setProductType] = useState<string>('CLEANER');
  const [groupKey, setGroupKey] = useState<string>('');

  const [editing, setEditing] = useState<AdminIngredient | null>(null);
  const [creating, setCreating] = useState(false);

  const [draft, setDraft] = useState(() => ({
    id: '',
    slug: '',
    name: '',
    desc: '',
    color: '',
    potency: '' as '' | 'mild' | 'moderate' | 'strong',
    maxPct: '' as '' | string,
    warn: false,
    groupKeys: [] as string[],
    productTypes: ['CLEANER'] as string[],
    benefitsJson: '{}' as string,
    tipsJson: JSON.stringify({ low: '', mid: '', high: '' }, null, 2),
    metaJson: '{}' as string,
  }));

  async function loadGroups() {
    const res = await fetch('/api/admin/groups', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load groups');
    const data = (await res.json()) as { groups: Group[] };
    setGroups(data.groups);
  }

  async function loadIngredients() {
    setLoading(true);
    setError('');
    try {
      const url = new URL('/api/admin/ingredients', window.location.origin);
      if (q.trim()) url.searchParams.set('q', q.trim());
      if (productType) url.searchParams.set('productType', productType);
      if (groupKey) url.searchParams.set('groupKey', groupKey);

      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load ingredients');
      const data = (await res.json()) as { ingredients: AdminIngredient[] };
      setIngredients(data.ingredients);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load ingredients');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroups().catch(() => setGroups([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadIngredients(), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, productType, groupKey]);

  const groupLabelByKey = useMemo(() => {
    const m = new Map<string, string>();
    groups.forEach(g => m.set(g.key, g.label));
    return m;
  }, [groups]);

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setDraft({
      id: '',
      slug: '',
      name: '',
      desc: '',
      color: '',
      potency: '',
      maxPct: '',
      warn: false,
      groupKeys: groupKey ? [groupKey] : [],
      productTypes: productType ? [productType] : ['CLEANER'],
      benefitsJson: '{}',
      tipsJson: JSON.stringify({ low: '', mid: '', high: '' }, null, 2),
      metaJson: '{}',
    });
  }

  function startEdit(ing: AdminIngredient) {
    setCreating(false);
    setEditing(ing);
    setDraft({
      id: ing.id,
      slug: ing.slug,
      name: ing.name,
      desc: ing.desc,
      color: ing.color ?? '',
      potency: ing.potency ?? '',
      maxPct: ing.maxPct == null ? '' : String(ing.maxPct),
      warn: ing.warn,
      groupKeys: ing.groupKeys ?? [],
      productTypes: ing.productTypes ?? [],
      benefitsJson: JSON.stringify(ing.benefits ?? {}, null, 2),
      tipsJson: JSON.stringify(ing.tips ?? { low: '', mid: '', high: '' }, null, 2),
      metaJson: JSON.stringify(ing.meta ?? {}, null, 2),
    });
  }

  function closeEditor() {
    setCreating(false);
    setEditing(null);
  }

  async function saveDraft() {
    setError('');
    const payload = {
      slug: draft.slug.trim(),
      name: draft.name.trim(),
      desc: draft.desc.trim(),
      color: draft.color.trim() || null,
      potency: draft.potency || null,
      maxPct: draft.maxPct === '' ? null : Number(draft.maxPct),
      warn: !!draft.warn,
      groupKeys: draft.groupKeys,
      productTypes: draft.productTypes,
      benefits: safeParseJson<Record<string, number>>(draft.benefitsJson, {}),
      tips: safeParseJson<{ low: string; mid: string; high: string }>(
        draft.tipsJson,
        { low: '', mid: '', high: '' }
      ),
      meta: safeParseJson<Record<string, unknown>>(draft.metaJson, {}),
    };

    if (!payload.slug || !payload.name || !payload.desc) {
      setError('slug, name, and description are required.');
      return;
    }

    const res = await fetch(creating ? '/api/admin/ingredients' : `/api/admin/ingredients/${draft.id}`, {
      method: creating ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || 'Save failed');
      return;
    }

    closeEditor();
    await loadIngredients();
  }

  async function deleteIngredient(id: string) {
    if (!confirm('Delete this ingredient? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/ingredients/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError('Delete failed');
      return;
    }
    closeEditor();
    await loadIngredients();
  }

  return (
    <div className="space-y-5">
      <section className="animate-in">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧪</span>
            <div>
              <h1>Ingredient Library</h1>
              <p className="text-[13px] text-text-secondary">
                Edit ingredient pools for all calculators. Changes save to the database and reflect immediately.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={startCreate}>+ New ingredient</button>
          </div>
        </div>
      </section>

      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="input w-[260px]"
            placeholder="Search name, slug, description…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select className="input w-[220px]" value={productType} onChange={e => setProductType(e.target.value)}>
            {PRODUCT_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
          </select>
          <select className="input w-[260px]" value={groupKey} onChange={e => setGroupKey(e.target.value)}>
            <option value="">All groups</option>
            {groups.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-2">
            {loading && <span className="text-xs text-text-muted">Loading…</span>}
            <button className="btn btn-secondary" onClick={() => loadIngredients()}>Refresh</button>
          </div>
        </div>
        {error && (
          <div className="banner-error mt-3">
            {error}
          </div>
        )}
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-surface-elevated/40 border-b border-border-subtle">
              <tr className="text-left text-text-muted">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Groups</th>
                <th className="px-4 py-3 font-semibold">Products</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map(i => (
                <tr
                  key={i.id}
                  className={cn(
                    'border-b border-border-subtle hover:bg-surface-elevated/30 cursor-pointer',
                    editing?.id === i.id ? 'bg-surface-elevated/20' : ''
                  )}
                  onClick={() => startEdit(i)}
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-text-primary">{i.name}</div>
                    <div className="text-[11px] text-text-muted line-clamp-1">{i.desc}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-text-secondary">{i.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(i.groupKeys ?? []).slice(0, 3).map(k => <Pill key={k}>{groupLabelByKey.get(k) ?? k}</Pill>)}
                      {(i.groupKeys?.length ?? 0) > 3 && <Pill>+{(i.groupKeys?.length ?? 0) - 3}</Pill>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(i.productTypes ?? []).map(p => <Pill key={p}>{p}</Pill>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(i.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {ingredients.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-text-muted">
                    No ingredients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/50 overflow-auto">
          <div className="glass-card w-full max-w-3xl p-5 animate-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  {creating ? 'New ingredient' : `Edit: ${editing?.name}`}
                </h2>
                <p className="text-[12px] text-text-secondary mt-1">
                  Edit metadata (benefits/tips/meta are JSON). Click Save to reflect across calculators.
                </p>
              </div>
              <button className="btn btn-secondary" onClick={closeEditor}>Close</button>
            </div>

            {error && <div className="banner-error mt-3">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-3">
                <div>
                  <label className="form-label">Slug (stable id)</label>
                  <input className="input" value={draft.slug} onChange={e => setDraft(d => ({ ...d, slug: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Name</label>
                  <input className="input" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea className="input min-h-[100px]" value={draft.desc} onChange={e => setDraft(d => ({ ...d, desc: e.target.value }))} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Potency</label>
                    <select className="input" value={draft.potency} onChange={e => setDraft(d => ({ ...d, potency: e.target.value as never }))}>
                      <option value="">(none)</option>
                      <option value="mild">mild</option>
                      <option value="moderate">moderate</option>
                      <option value="strong">strong</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Max % (optional)</label>
                    <input className="input" value={draft.maxPct} onChange={e => setDraft(d => ({ ...d, maxPct: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Color (optional)</label>
                    <input className="input" value={draft.color} onChange={e => setDraft(d => ({ ...d, color: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2 pt-7">
                    <input
                      type="checkbox"
                      checked={draft.warn}
                      onChange={e => setDraft(d => ({ ...d, warn: e.target.checked }))}
                      className="w-4 h-4 accent-accent-rose"
                    />
                    <span className="text-[13px] text-text-secondary">Warn</span>
                  </div>
                </div>

                <div>
                  <label className="form-label">Groups</label>
                  <div className="flex flex-wrap gap-2">
                    {groups.map(g => {
                      const on = draft.groupKeys.includes(g.key);
                      return (
                        <button
                          key={g.key}
                          type="button"
                          onClick={() => setDraft(d => ({
                            ...d,
                            groupKeys: on ? d.groupKeys.filter(x => x !== g.key) : [...d.groupKeys, g.key],
                          }))}
                          className={cn(
                            'px-3 py-1.5 rounded-full border text-[12px] transition-all',
                            on
                              ? 'border-accent-indigo/40 bg-accent-indigo/[0.12] text-accent-indigo-light'
                              : 'border-border-subtle bg-surface-elevated/50 text-text-secondary hover:text-text-primary'
                          )}
                        >
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="form-label">Products</label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_TYPES.map(pt => {
                      const on = draft.productTypes.includes(pt);
                      return (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setDraft(d => ({
                            ...d,
                            productTypes: on ? d.productTypes.filter(x => x !== pt) : [...d.productTypes, pt],
                          }))}
                          className={cn(
                            'px-3 py-1.5 rounded-full border text-[12px] transition-all',
                            on
                              ? 'border-accent-emerald/40 bg-accent-emerald/[0.12] text-accent-emerald'
                              : 'border-border-subtle bg-surface-elevated/50 text-text-secondary hover:text-text-primary'
                          )}
                        >
                          {pt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="form-label">Benefits JSON</label>
                  <textarea className="input min-h-[120px] font-mono text-[12px]" value={draft.benefitsJson} onChange={e => setDraft(d => ({ ...d, benefitsJson: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Tips JSON</label>
                  <textarea className="input min-h-[120px] font-mono text-[12px]" value={draft.tipsJson} onChange={e => setDraft(d => ({ ...d, tipsJson: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Meta JSON (soap SAP/additives/etc.)</label>
                  <textarea className="input min-h-[120px] font-mono text-[12px]" value={draft.metaJson} onChange={e => setDraft(d => ({ ...d, metaJson: e.target.value }))} />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  {!creating && (
                    <button className="btn btn-danger" onClick={() => deleteIngredient(draft.id)}>
                      Delete
                    </button>
                  )}
                  <div className="ml-auto flex items-center gap-2">
                    <button className="btn btn-secondary" onClick={closeEditor}>Cancel</button>
                    <button className="btn btn-primary" onClick={saveDraft}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

