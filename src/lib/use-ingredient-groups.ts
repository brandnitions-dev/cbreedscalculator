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
  balmDermalFocus?: 'universal' | 'dry' | 'oily';
};

export type IngredientFeedGroup = {
  key: string;
  label: string;
  sortOrder: number;
  ingredients: Array<{ sortOrder: number } & IngredientFeedItem & { id: string }>;
};

export function useIngredientGroups(
  productType: string,
  balmDermal: 'all' | 'dry' | 'oily' = 'all',
) {
  const [groups, setGroups] = useState<IngredientFeedGroup[] | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError('');
      try {
        const q = new URLSearchParams();
        q.set('productType', productType);
        if (productType === 'BALM' && balmDermal !== 'all') {
          q.set('dermal', balmDermal);
        }
        const res = await fetch(`/api/ingredients?${q.toString()}`, { cache: 'no-store' });
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
  }, [productType, balmDermal]);

  return { groups, error };
}

