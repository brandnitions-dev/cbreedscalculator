'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, Beaker, Check, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Group = { key: string; label: string; sortOrder: number };

type Tips = { low: string; mid: string; high: string };

type AdminIngredient = {
  id: string;
  slug: string;
  name: string;
  desc: string;
  color: string | null;
  potency: 'mild' | 'moderate' | 'strong' | null;
  maxPct: number | null;
  warn: boolean;
  active: boolean;
  benefits: Record<string, number>;
  tips: Tips;
  meta: Record<string, unknown>;
  balmDermalFocus: 'universal' | 'dry' | 'oily';
  updatedAt: string;
  groupKeys: string[];
  productTypes: string[];
};

type Draft = {
  id: string;
  slug: string;
  name: string;
  desc: string;
  color: string;
  potency: '' | 'mild' | 'moderate' | 'strong';
  maxPct: string;
  warn: boolean;
  active: boolean;
  groupKeys: string[];
  productTypes: string[];
  benefits: Record<string, number>;
  tips: Tips;
  meta: Record<string, string>;
  balmDermalFocus: 'universal' | 'dry' | 'oily';
};

const PRODUCT_TYPES = [
  { key: 'BALM', label: 'Tallow Balm' },
  { key: 'CLEANER', label: 'Face Cleaner' },
  { key: 'EXFOLIATOR', label: 'Exfoliator' },
  { key: 'SOAP', label: 'Tallow Soap' },
  { key: 'TREATMENT_OIL', label: 'Treatment Oil' },
] as const;

const BENEFIT_OPTIONS = [
  'acne',
  'antiaging',
  'antiinflammatory',
  'antimicrobial',
  'antioxidant',
  'barrier',
  'brightening',
  'calming',
  'conditioning',
  'exfoliation',
  'firming',
  'healing',
  'hydrating',
  'moisturizing',
  'poreClearing',
  'regenerating',
  'scarring',
  'sebumControl',
  'softening',
  'soothing',
  'stability',
];

const GROUP_ACCENTS: Record<string, string> = {
  carriers_a: '#85B7EB',
  actives_b: '#D85A30',
  exfoliants_c: '#C4A574',
  essential_oils: '#534AB7',
  oil_carriers: '#5DCAA5',
  oil_actives: '#FCD34D',
  oil_eos: '#C4B5FD',
  soap_oils: '#5DCAA5',
  soap_additives: '#BA7517',
};

const EMPTY_TIPS: Tips = { low: '', mid: '', high: '' };

const emptyDraft = (productType: string, groupKey: string): Draft => ({
  id: '',
  slug: '',
  name: '',
  desc: '',
  color: '',
  potency: '',
  maxPct: '',
  warn: false,
  active: false,
  groupKeys: groupKey ? [groupKey] : [],
  productTypes: productType ? [productType] : ['CLEANER'],
  benefits: {},
  tips: { ...EMPTY_TIPS },
  meta: {},
  balmDermalFocus: 'universal',
});

function productLabel(key: string) {
  return PRODUCT_TYPES.find(p => p.key === key)?.label ?? key;
}

function labelize(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function asMeta(meta: Record<string, unknown> | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  Object.entries(meta ?? {}).forEach(([key, value]) => {
    if (value != null) out[key] = String(value);
  });
  return out;
}

function draftFromIngredient(ing: AdminIngredient): Draft {
  return {
    id: ing.id,
    slug: ing.slug,
    name: ing.name,
    desc: ing.desc,
    color: ing.color ?? '',
    potency: ing.potency ?? '',
    maxPct: ing.maxPct == null ? '' : String(ing.maxPct),
    warn: ing.warn,
    active: ing.active ?? false,
    groupKeys: ing.groupKeys ?? [],
    productTypes: ing.productTypes ?? [],
    benefits: ing.benefits ?? {},
    tips: ing.tips ?? { ...EMPTY_TIPS },
    meta: asMeta(ing.meta),
    balmDermalFocus: ing.balmDermalFocus ?? 'universal',
  };
}

function normalizeMeta(draft: Draft) {
  const meta = { ...draft.meta };

  if (draft.groupKeys.includes('soap_oils')) {
    return {
      kind: 'soap_oil',
      sapNaOH: Number(meta.sapNaOH || 0),
      sapKOH: Number(meta.sapKOH || 0),
      hardness: Number(meta.hardness || 0),
      cleansing: Number(meta.cleansing || 0),
      conditioning: Number(meta.conditioning || 0),
      bubbly: Number(meta.bubbly || 0),
      creamy: Number(meta.creamy || 0),
      iodine: Number(meta.iodine || 0),
      defaultPct: Number(meta.defaultPct || 0),
      category: meta.category || 'base',
    };
  }

  if (draft.groupKeys.includes('soap_additives')) {
    return {
      kind: 'soap_additive',
      phase: meta.phase || 'trace',
      usageRate: meta.usageRate || '',
      notes: meta.notes || '',
    };
  }

  return Object.fromEntries(
    Object.entries(meta).filter(([, value]) => String(value ?? '').trim() !== '')
  );
}

function Section({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-border-subtle bg-surface-card/70 p-4">
      <div className="mb-3">
        {eyebrow && <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">{eyebrow}</div>}
        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      {children}
      {help && <span className="mt-1 block text-[11px] leading-relaxed text-text-muted">{help}</span>}
    </label>
  );
}

function TogglePill({
  active,
  children,
  onClick,
  accent = 'indigo',
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  accent?: 'indigo' | 'emerald' | 'gold';
}) {
  const activeClass =
    accent === 'emerald'
      ? 'border-accent-emerald/50 bg-accent-emerald/[0.12] text-accent-emerald-light'
      : accent === 'gold'
        ? 'border-accent-gold/50 bg-accent-gold/[0.12] text-accent-gold-light'
        : 'border-accent-indigo/50 bg-accent-indigo/[0.12] text-accent-indigo-light';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all',
        active
          ? activeClass
          : 'border-border-subtle bg-surface-elevated/50 text-text-secondary hover:border-border hover:text-text-primary'
      )}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface-elevated/35 px-4 py-3">
      <div className="text-2xl font-black text-text-primary">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">{label}</div>
    </div>
  );
}

function BenefitEditor({
  benefits,
  onChange,
}: {
  benefits: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
}) {
  const [customBenefit, setCustomBenefit] = useState('');
  const activeKeys = Object.keys(benefits).sort();

  function setBenefit(key: string, value: number) {
    const next = { ...benefits };
    if (value <= 0) delete next[key];
    else next[key] = value;
    onChange(next);
  }

  function addCustomBenefit() {
    const key = customBenefit.trim().replace(/\s+/g, '_').replace(/[^\w]/g, '');
    if (!key) return;
    setBenefit(key, benefits[key] || 2);
    setCustomBenefit('');
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {BENEFIT_OPTIONS.map(key => {
          const active = (benefits[key] ?? 0) > 0;
          return (
            <button
              type="button"
              key={key}
              onClick={() => setBenefit(key, active ? 0 : 2)}
              className={cn(
                'rounded-sm border px-3 py-2 text-left text-[12px] font-semibold transition-all',
                active
                  ? 'border-accent-indigo/40 bg-accent-indigo/[0.12] text-accent-indigo-light'
                  : 'border-border-subtle bg-surface-elevated/40 text-text-secondary hover:border-border hover:text-text-primary'
              )}
            >
              {labelize(key)}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          className="input"
          value={customBenefit}
          onChange={e => setCustomBenefit(e.target.value)}
          placeholder="Add custom benefit, e.g. pore tightening"
        />
        <button type="button" className="btn btn-secondary whitespace-nowrap" onClick={addCustomBenefit}>
          Add
        </button>
      </div>

      {activeKeys.length > 0 && (
        <div className="space-y-3 rounded-sm border border-border-subtle bg-surface-elevated/25 p-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">Benefit strength</div>
          {activeKeys.map(key => (
            <div key={key} className="grid grid-cols-[130px_1fr_32px] items-center gap-3">
              <span className="text-[12px] font-semibold text-text-secondary">{labelize(key)}</span>
              <input
                type="range"
                min={1}
                max={3}
                step={1}
                value={benefits[key]}
                onChange={e => setBenefit(key, Number(e.target.value))}
                className="accent-accent-indigo"
              />
              <span className="text-right text-[12px] font-bold text-accent-indigo-light">{benefits[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SoapOilFields({
  meta,
  onChange,
}: {
  meta: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  const update = (key: string, value: string) => onChange({ ...meta, [key]: value });
  const fields = [
    ['sapNaOH', 'SAP NaOH'],
    ['sapKOH', 'SAP KOH'],
    ['hardness', 'Hardness'],
    ['cleansing', 'Cleansing'],
    ['conditioning', 'Conditioning'],
    ['bubbly', 'Bubbly'],
    ['creamy', 'Creamy'],
    ['iodine', 'Iodine'],
    ['defaultPct', 'Default %'],
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {fields.map(([key, label]) => (
          <Field key={key} label={label}>
            <input className="input" inputMode="decimal" value={meta[key] ?? ''} onChange={e => update(key, e.target.value)} />
          </Field>
        ))}
      </div>
      <Field label="Oil category">
        <select className="input" value={meta.category ?? 'base'} onChange={e => update('category', e.target.value)}>
          <option value="base">Base oil</option>
          <option value="carrier">Carrier oil</option>
          <option value="luxury">Luxury butter/oil</option>
        </select>
      </Field>
    </div>
  );
}

function SoapAdditiveFields({
  meta,
  onChange,
}: {
  meta: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  const update = (key: string, value: string) => onChange({ ...meta, [key]: value });
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field label="Add phase">
        <select className="input" value={meta.phase ?? 'trace'} onChange={e => update('phase', e.target.value)}>
          <option value="trace">Trace</option>
          <option value="lye-water">Lye water</option>
          <option value="oil-phase">Oil phase</option>
        </select>
      </Field>
      <Field label="Usage rate">
        <input className="input" value={meta.usageRate ?? ''} onChange={e => update('usageRate', e.target.value)} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Handling notes">
          <textarea className="input min-h-[90px]" value={meta.notes ?? ''} onChange={e => update('notes', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

export default function AdminIngredientLibrary() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [ingredients, setIngredients] = useState<AdminIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [notice, setNotice] = useState<string>('');

  const [q, setQ] = useState('');
  const [productType, setProductType] = useState<string>('CLEANER');
  const [groupKey, setGroupKey] = useState<string>('');

  const [editing, setEditing] = useState<AdminIngredient | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft('CLEANER', ''));

  const editorOpen = creating || Boolean(editing);
  const selectedGroupKeys = draft.groupKeys;
  const isSoapOil = selectedGroupKeys.includes('soap_oils');
  const isSoapAdditive = selectedGroupKeys.includes('soap_additives');
  const countByProduct = useMemo(() => {
    const counts = new Map<string, number>();
    ingredients.forEach(i => i.productTypes.forEach(p => counts.set(p, (counts.get(p) ?? 0) + 1)));
    return counts;
  }, [ingredients]);
  const activeCount = useMemo(() => ingredients.filter(i => i.active).length, [ingredients]);

  const groupLabelByKey = useMemo(() => {
    const m = new Map<string, string>();
    groups.forEach(g => m.set(g.key, g.label));
    return m;
  }, [groups]);

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
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadIngredients(), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, productType, groupKey]);

  function startCreate() {
    setNotice('');
    setError('');
    setCreating(true);
    setEditing(null);
    setDraft(emptyDraft(productType, groupKey));
  }

  function startEdit(ing: AdminIngredient) {
    setNotice('');
    setError('');
    setCreating(false);
    setEditing(ing);
    setDraft(draftFromIngredient(ing));
  }

  function closeEditor() {
    setCreating(false);
    setEditing(null);
    setError('');
  }

  function setDraftValue<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(d => ({ ...d, [key]: value }));
  }

  async function saveDraft() {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const slug = draft.slug.trim().toLowerCase().replace(/\s+/g, '_');
      if (!slug || !draft.name.trim() || !draft.desc.trim()) {
        setError('Name, slug, and description are required.');
        return;
      }
      if (!draft.groupKeys.length || !draft.productTypes.length) {
        setError('Choose at least one product and one ingredient group.');
        return;
      }

      const payload = {
        slug,
        name: draft.name.trim(),
        desc: draft.desc.trim(),
        color: draft.color.trim() || null,
        potency: draft.potency || null,
        maxPct: draft.maxPct === '' ? null : Number(draft.maxPct),
        warn: draft.warn,
        active: draft.active,
        groupKeys: draft.groupKeys,
        productTypes: draft.productTypes,
        benefits: draft.benefits,
        tips: draft.tips,
        meta: normalizeMeta(draft),
        balmDermalFocus: draft.balmDermalFocus,
      };

      const res = await fetch(creating ? '/api/admin/ingredients' : `/api/admin/ingredients/${draft.id}`, {
        method: creating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Save failed');
      }

      setNotice(`${payload.name} saved.`);
      closeEditor();
      await loadIngredients();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function deleteIngredient(id: string) {
    if (!confirm('Delete this ingredient? This cannot be undone.')) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/ingredients/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setNotice('Ingredient deleted.');
      closeEditor();
      await loadIngredients();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-border bg-[radial-gradient(circle_at_top_left,rgba(93,202,165,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-emerald-light">
              <Beaker size={14} />
              Database-backed formulation library
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text-primary">Ingredient Library</h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Manage every carrier oil, botanical active, exfoliant, essential oil, soap oil, and additive without touching code.
              Save once and the calculators read the updated ingredient data from the database.
            </p>
          </div>
          <button className="btn btn-primary btn-lg shadow-glow" onClick={startCreate}>
            <Plus size={16} />
            Add Ingredient
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Admin rows" value={ingredients.length} />
          <StatCard label="Active in builders" value={activeCount} />
          <StatCard label="Groups" value={groups.length} />
          <StatCard label={productLabel(productType)} value={countByProduct.get(productType) ?? ingredients.length} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface-card/80 p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_260px_auto]">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              className="input pl-9"
              placeholder="Search ingredients by name, slug, or description"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <select className="input" value={productType} onChange={e => setProductType(e.target.value)}>
            {PRODUCT_TYPES.map(pt => <option key={pt.key} value={pt.key}>{pt.label}</option>)}
          </select>
          <select className="input" value={groupKey} onChange={e => setGroupKey(e.target.value)}>
            <option value="">All ingredient groups</option>
            {groups.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
          </select>
          <button className="btn btn-secondary" onClick={() => loadIngredients()} disabled={loading}>
            {loading ? 'Refreshing' : 'Refresh'}
          </button>
        </div>
      </section>

      {(error || notice) && (
        <div className={cn('rounded-md border px-4 py-3 text-sm', error ? 'border-accent-rose/30 bg-accent-rose/[0.07] text-accent-rose' : 'border-accent-emerald/30 bg-accent-emerald/[0.07] text-accent-emerald-light')}>
          {error || notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {ingredients.map(ing => {
            const accent = GROUP_ACCENTS[ing.groupKeys?.[0] ?? ''] ?? '#85B7EB';
            return (
              <button
                key={ing.id}
                type="button"
                onClick={() => startEdit(ing)}
                className={cn(
                  'group rounded-lg border bg-surface-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-card-hover',
                  editing?.id === ing.id ? 'border-accent-indigo/60 shadow-glow' : 'border-border-subtle'
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ing.color || accent }} />
                      <h3 className="truncate text-base font-black text-text-primary">{ing.name}</h3>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-text-muted">{ing.slug}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className={cn(
                      'rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider',
                      ing.active
                        ? 'border-accent-emerald/30 bg-accent-emerald/[0.08] text-accent-emerald-light'
                        : 'border-border-subtle bg-surface-elevated/60 text-text-muted'
                    )}>
                      {ing.active ? 'Active' : 'Off'}
                    </span>
                    {ing.warn && (
                      <span className="rounded-full border border-accent-rose/30 bg-accent-rose/[0.08] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-rose">
                        Safety
                      </span>
                    )}
                  </div>
                </div>
                <p className="line-clamp-2 text-[12px] leading-relaxed text-text-secondary">{ing.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(ing.groupKeys ?? []).slice(0, 2).map(k => (
                    <span key={k} className="rounded-full border border-border-subtle bg-surface-elevated/60 px-2 py-1 text-[10px] font-semibold text-text-secondary">
                      {groupLabelByKey.get(k) ?? labelize(k)}
                    </span>
                  ))}
                  {(ing.productTypes ?? []).slice(0, 3).map(p => (
                    <span key={p} className="rounded-full border border-accent-emerald/20 bg-accent-emerald/[0.07] px-2 py-1 text-[10px] font-semibold text-accent-emerald-light">
                      {productLabel(p)}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}

          {ingredients.length === 0 && !loading && (
            <div className="col-span-full rounded-lg border border-dashed border-border-subtle bg-surface-card/60 px-6 py-12 text-center">
              <div className="text-lg font-bold text-text-primary">No ingredients found</div>
              <p className="mt-2 text-sm text-text-muted">Adjust filters or add the first ingredient for this product.</p>
            </div>
          )}
        </section>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          {!editorOpen ? (
            <div className="rounded-lg border border-border bg-surface-card p-5">
              <div className="text-lg font-black text-text-primary">Select an ingredient</div>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Click any ingredient card to manage its description, product availability, benefits, safety limits, and calculator-specific values.
              </p>
              <button className="btn btn-primary mt-5 w-full" onClick={startCreate}>
                <Plus size={16} />
                Add New Ingredient
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface-card shadow-glow">
              <div className="flex items-start justify-between gap-3 border-b border-border-subtle p-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                    {creating ? 'Create ingredient' : 'Edit ingredient'}
                  </div>
                  <h2 className="mt-1 text-xl font-black text-text-primary">{creating ? 'New ingredient' : draft.name || 'Untitled ingredient'}</h2>
                </div>
                <button className="rounded-sm p-2 text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary" onClick={closeEditor} aria-label="Close editor">
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[calc(100vh-170px)] space-y-4 overflow-auto p-5">
                <Section title="Identity" eyebrow="Core">
                  <div className="space-y-3">
                    <Field label="Ingredient name">
                      <input className="input" value={draft.name} onChange={e => setDraftValue('name', e.target.value)} placeholder="Lavender EO" />
                    </Field>
                    <Field label="Stable slug" help="Used internally by calculators. Keep it simple: lowercase words with underscores.">
                      <input className="input font-mono text-[13px]" value={draft.slug} onChange={e => setDraftValue('slug', e.target.value)} placeholder="lavender" />
                    </Field>
                    <Field label="Professional description">
                      <textarea className="input min-h-[110px]" value={draft.desc} onChange={e => setDraftValue('desc', e.target.value)} placeholder="What it does, why it matters, and how it behaves in formula." />
                    </Field>
                  </div>
                </Section>

                <Section title="Where it appears" eyebrow="Library placement">
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setDraftValue('active', !draft.active)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left transition-all',
                        draft.active
                          ? 'border-accent-emerald/40 bg-accent-emerald/[0.10] text-accent-emerald-light'
                          : 'border-border-subtle bg-surface-elevated/40 text-text-secondary hover:text-text-primary'
                      )}
                    >
                      <span>
                        <span className="block text-[13px] font-black uppercase tracking-[0.12em]">
                          {draft.active ? 'Active in builders' : 'Off in builders'}
                        </span>
                        <span className="mt-1 block text-[11px] leading-relaxed text-text-muted">
                          Only active ingredients appear in formula builders. Admin can still edit off ingredients here.
                        </span>
                      </span>
                      <span className={cn(
                        'rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
                        draft.active
                          ? 'border-accent-emerald/50 bg-accent-emerald/[0.14]'
                          : 'border-border-subtle bg-surface-card'
                      )}>
                        {draft.active ? 'Active' : 'Off'}
                      </span>
                    </button>

                    <div>
                      <div className="form-label">Products</div>
                      <div className="flex flex-wrap gap-2">
                        {PRODUCT_TYPES.map(pt => {
                          const on = draft.productTypes.includes(pt.key);
                          return (
                            <TogglePill
                              key={pt.key}
                              active={on}
                              accent="emerald"
                              onClick={() => setDraftValue('productTypes', on ? draft.productTypes.filter(x => x !== pt.key) : [...draft.productTypes, pt.key])}
                            >
                              {pt.label}
                            </TogglePill>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="form-label">Ingredient groups</div>
                      <div className="flex flex-wrap gap-2">
                        {groups.map(g => {
                          const on = draft.groupKeys.includes(g.key);
                          return (
                            <TogglePill
                              key={g.key}
                              active={on}
                              onClick={() => setDraftValue('groupKeys', on ? draft.groupKeys.filter(x => x !== g.key) : [...draft.groupKeys, g.key])}
                            >
                              {g.label}
                            </TogglePill>
                          );
                        })}
                      </div>
                    </div>

                    {draft.productTypes.includes('BALM') && (
                      <div className="rounded-md border border-border-subtle/80 bg-surface-elevated/30 p-3">
                        <div className="form-label">Tallow Balm: fatty-acid / skin focus</div>
                        <p className="text-[11px] text-text-muted mb-2 leading-relaxed">
                          Linoleic (LA)–leaning vs α-linolenic (ALA) / barrier–leaning. “Universal” appears in all three builder toggles (All, Dry, Oily).
                        </p>
                        <select
                          className="input"
                          value={draft.balmDermalFocus}
                          onChange={e => setDraftValue('balmDermalFocus', e.target.value as Draft['balmDermalFocus'])}
                        >
                          <option value="universal">Universal — show in all modes</option>
                          <option value="dry">Dry / sensitive (ALA-leaning)</option>
                          <option value="oily">Oily / acne (LA-leaning)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </Section>

                <Section title="Safety and handling" eyebrow="Formulation rules">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Potency">
                      <select className="input" value={draft.potency} onChange={e => setDraftValue('potency', e.target.value as Draft['potency'])}>
                        <option value="">No potency flag</option>
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="strong">Strong</option>
                      </select>
                    </Field>
                    <Field label="Max %">
                      <input className="input" inputMode="decimal" value={draft.maxPct} onChange={e => setDraftValue('maxPct', e.target.value)} placeholder="0.03" />
                    </Field>
                    <Field label="Display color">
                      <input className="input" value={draft.color} onChange={e => setDraftValue('color', e.target.value)} placeholder="#C4B5FD" />
                    </Field>
                    <button
                      type="button"
                      onClick={() => setDraftValue('warn', !draft.warn)}
                      className={cn(
                        'mt-6 flex items-center justify-center gap-2 rounded-sm border px-3 py-2 text-[13px] font-bold transition-all',
                        draft.warn
                          ? 'border-accent-rose/40 bg-accent-rose/[0.12] text-accent-rose'
                          : 'border-border-subtle bg-surface-elevated/40 text-text-secondary hover:text-text-primary'
                      )}
                    >
                      <AlertTriangle size={15} />
                      Safety warning
                    </button>
                  </div>
                </Section>

                <Section title="Benefit profile" eyebrow="Calculator scoring">
                  <BenefitEditor benefits={draft.benefits} onChange={next => setDraftValue('benefits', next)} />
                </Section>

                <Section title="Usage guidance" eyebrow="Dose language">
                  <div className="space-y-3">
                    <Field label="Low usage note">
                      <textarea className="input min-h-[70px]" value={draft.tips.low} onChange={e => setDraftValue('tips', { ...draft.tips, low: e.target.value })} />
                    </Field>
                    <Field label="Medium usage note">
                      <textarea className="input min-h-[70px]" value={draft.tips.mid} onChange={e => setDraftValue('tips', { ...draft.tips, mid: e.target.value })} />
                    </Field>
                    <Field label="High usage note">
                      <textarea className="input min-h-[70px]" value={draft.tips.high} onChange={e => setDraftValue('tips', { ...draft.tips, high: e.target.value })} />
                    </Field>
                  </div>
                </Section>

                {isSoapOil && (
                  <Section title="Soap oil chemistry" eyebrow="SAP and quality">
                    <SoapOilFields meta={draft.meta} onChange={next => setDraftValue('meta', next)} />
                  </Section>
                )}

                {isSoapAdditive && (
                  <Section title="Soap additive handling" eyebrow="Process">
                    <SoapAdditiveFields meta={draft.meta} onChange={next => setDraftValue('meta', next)} />
                  </Section>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border-subtle p-4">
                {!creating ? (
                  <button className="btn btn-danger" onClick={() => deleteIngredient(draft.id)} disabled={saving}>
                    <Trash2 size={15} />
                    Delete
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-2">
                  <button className="btn btn-secondary" onClick={closeEditor} disabled={saving}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={saveDraft} disabled={saving}>
                    {saving ? <Check size={15} /> : <Save size={15} />}
                    {saving ? 'Saving' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

