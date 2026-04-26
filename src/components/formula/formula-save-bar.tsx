'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Bookmark, Loader2, Plus } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { SavedProductType } from '@/lib/saved-formula-constants';

type LoadMeta = {
  id: string;
  name: string;
  tags: string[];
  notes: string;
};

type Props = {
  productType: SavedProductType;
  getSnapshot: () => Record<string, unknown>;
  batchSize: number;
  mode: string | null;
  onLoaded?: (ingredients: unknown, batchSize: number, mode: string | null) => void;
};

function splitTags(s: string): string[] {
  return s
    .split(/[,;]+/)
    .map(t => t.trim())
    .filter(Boolean);
}

function FormulaSaveBarInner({ productType, getSnapshot, batchSize, mode, onLoaded }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onLoadedRef = useRef<Props['onLoaded']>(onLoaded);
  onLoadedRef.current = onLoaded;
  const lastFetchLoadId = useRef<string | null>(null);
  const [name, setName] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [editing, setEditing] = useState<LoadMeta | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const clearLoadQuery = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete('load');
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  const startNew = useCallback(() => {
    lastFetchLoadId.current = null;
    setEditing(null);
    setName('');
    setTagsInput('');
    setNotes('');
    setMessage(null);
    setErr(null);
    clearLoadQuery();
  }, [clearLoadQuery]);

  const fetchLoad = useCallback(
    async (id: string) => {
      setErr(null);
      const res = await fetch(`/api/formulas/${id}`);
      if (!res.ok) {
        setErr('Could not load this formula.');
        return;
      }
      const data = (await res.json()) as {
        id: string;
        name: string;
        productType: string;
        batchSize: number;
        mode: string | null;
        ingredients: unknown;
        notes: string | null;
        tags?: string[];
      };
      if (data.productType !== productType) {
        setErr('This file belongs to a different calculator. Open it from the library.');
        return;
      }
      setEditing({
        id: data.id,
        name: data.name,
        tags: data.tags ?? [],
        notes: data.notes ?? '',
      });
      setName(data.name);
      setTagsInput((data.tags ?? []).join(', '));
      setNotes(data.notes ?? '');
      onLoadedRef.current?.(data.ingredients, data.batchSize, data.mode);
      setMessage('Formula loaded. Adjust volume or edit, then update.');
    },
    [productType],
  );

  useEffect(() => {
    const id = searchParams.get('load');
    if (!id) {
      lastFetchLoadId.current = null;
      return;
    }
    if (lastFetchLoadId.current === id) return;
    lastFetchLoadId.current = id;
    void fetchLoad(id);
  }, [searchParams, fetchLoad]);

  const save = useCallback(
    async (isUpdate: boolean) => {
      setSaving(true);
      setErr(null);
      setMessage(null);
      const ingredients = getSnapshot();
      const tags = splitTags(tagsInput);
      const payload = {
        name: name.trim() || 'Untitled formula',
        productType,
        batchSize,
        mode,
        ingredients,
        tags,
        notes: notes.trim() || null,
      };
      try {
        if (isUpdate && editing) {
          const res = await fetch(`/api/formulas/${editing.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: payload.name,
              batchSize: payload.batchSize,
              mode: payload.mode,
              ingredients: payload.ingredients,
              tags: payload.tags,
              notes: payload.notes,
            }),
          });
          if (!res.ok) {
            const t = await res.json().catch(() => ({}));
            throw new Error((t as { error?: string }).error || 'Update failed');
          }
          setMessage('Saved changes.');
        } else {
          const res = await fetch('/api/formulas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const t = await res.json().catch(() => ({}));
            throw new Error((t as { error?: string }).error || 'Save failed');
          }
          const created = (await res.json()) as { id: string; name: string };
          setEditing({ id: created.id, name: created.name, tags, notes: notes.trim() });
          setMessage('Formula saved. You can find it in Saved Formulas.');
          clearLoadQuery();
        }
        router.refresh();
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Could not save');
      } finally {
        setSaving(false);
      }
    },
    [getSnapshot, tagsInput, name, notes, productType, batchSize, mode, editing, router, clearLoadQuery],
  );

  return (
    <GlassCard className="border-accent-indigo/20 bg-accent-indigo/[0.04]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Bookmark size={18} className="text-accent-gold-light shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-text-primary">Save & reuse</h3>
            <p className="text-xs text-text-muted">
              {editing
                ? `Editing “${editing.name}” — change batch size anytime; the recipe is your ingredient mix.`
                : 'Name your blend and tag it (skin type, area, season). Reopen it from the library.'}
            </p>
          </div>
        </div>
        <Link
          href="/formulas"
          className="text-xs font-semibold text-accent-indigo-light hover:underline shrink-0"
        >
          Open library →
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Title</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 w-full rounded-xs border border-border bg-surface-input px-3 py-2 text-sm text-text-primary"
            placeholder="e.g. Rich renovation"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Labels (comma)</label>
          <input
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            className="mt-1 w-full rounded-xs border border-border bg-surface-input px-3 py-2 text-sm text-text-primary"
            placeholder="dry skin, body, night routine"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Notes (optional)</label>
          <input
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="mt-1 w-full rounded-xs border border-border bg-surface-input px-3 py-2 text-sm text-text-primary"
            placeholder="For retail line / gift batch / allergen callouts"
          />
        </div>
      </div>
      {message && <p className="mt-2 text-xs text-accent-emerald-light">{message}</p>}
      {err && <p className="mt-2 text-xs text-accent-rose">{err}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void save(!!editing)}
          disabled={saving}
          className={cn(
            'inline-flex items-center gap-2 rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wider',
            'bg-accent-indigo text-text-inverse hover:bg-accent-indigo/90',
            saving && 'opacity-60',
          )}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} />}
          {editing ? 'Update' : 'Save formula'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-elevated"
          >
            <Plus size={14} />
            New
          </button>
        )}
      </div>
    </GlassCard>
  );
}

export function FormulaSaveBar(props: Props) {
  return (
    <Suspense fallback={null}>
      <FormulaSaveBarInner {...props} />
    </Suspense>
  );
}
