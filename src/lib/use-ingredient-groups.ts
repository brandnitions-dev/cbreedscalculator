'use client';

import { useEffect, useState } from 'react';

export type IngredientFeedItem = {
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
};

export type IngredientFeedGroup = {
  key: string;
  label: string;
  sortOrder: number;
  ingredients: Array<{ sortOrder: number } & IngredientFeedItem & { id: string }>;
};

export function useIngredientGroups(productType: string) {
  const [groups, setGroups] = useState<IngredientFeedGroup[] | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError('');
      try {
        const res = await fetch(`/api/ingredients?productType=${encodeURIComponent(productType)}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load ingredients');
        const data = (await res.json()) as { groups: IngredientFeedGroup[] };
        if (cancelled) return;
        setGroups(data.groups);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load ingredients');
        setGroups(null);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [productType]);

  return { groups, error };
}

