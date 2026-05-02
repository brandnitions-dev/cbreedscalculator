/**
 * MOSSKYN LAB — Formula calculation engine
 * Migrated from formula_builder_tab.js fbCalcFormula()
 */

import type { PoolRow, FormulaSplit, FixedIngredient, FormulaResult } from '@/types';

export type BalmMode = 'face' | 'body' | 'lips' | 'eyes' | 'eyes_balm';

export const FB_COLORS: Record<string, string> = {
  tallow: '#B4B2A9', beeswax: '#FAC775', jojoba: '#97C459', vite: '#F0997B',
  shea: '#EACB8A', aloe: '#8BE3B0', greenTea: '#7FB069', glycerin: '#9BD8D8', squalane: '#7DD3C0',
  rosehip: '#E8937A', pricklypear: '#A8D86E', calendula: '#F5C34D',
  emulsifier: '#E8A87C', preservative: '#A3C4BC', chelator: '#C9B1FF',
  a0: '#85B7EB', a1: '#5DCAA5', a2: '#AFA9EC', a3: '#ED93B1',
  b0: '#D85A30', b1: '#993C1D', b2: '#BA7517', b3: '#D4537E',
  c0: '#C4A574', c1: '#6F4E37', c2: '#D4C4A8',
  eo0: '#534AB7', eo1: '#3C3489', eo2: '#7F77DD', eo3: '#0F6E56', eo4: '#185FA5', eo5: '#993556',
};

export const BENEFIT_LABELS = [
  'antiaging', 'moisturizing', 'barrier', 'scarring', 'brightening', 'acne',
  'antiinflammatory', 'antioxidant', 'healing', 'soothing', 'calming',
  'regenerating', 'firming', 'softening', 'antimicrobial', 'antifungal',
  'circulation', 'plumping', 'pigment', 'depuffing',
];

export const FB_BENEFIT_COLORS: Record<string, string> = {
  antiaging: '#534AB7', moisturizing: '#1D9E75', barrier: '#639922',
  scarring: '#D85A30', brightening: '#FAC775', acne: '#185FA5',
  antiinflammatory: '#0F6E56', antioxidant: '#BA7517', healing: '#5DCAA5',
  soothing: '#AFA9EC', calming: '#ED93B1', regenerating: '#7F77DD',
  firming: '#D4537E', softening: '#9FE1CB', antimicrobial: '#6B4E9E',
  antifungal: '#2E6B5C', circulation: '#F97316', plumping: '#38BDF8',
  pigment: '#C084FC', depuffing: '#22C55E',
};

function splitPool(rows: PoolRow[], totalPct: number): FormulaSplit[] {
  const tw = rows.reduce((s, r) => s + r.weight, 0) || 1;
  return rows.map(r => ({ ...r, pct: totalPct * r.weight / tw }));
}

export function calcFormula(
  mode: BalmMode,
  product: 'balm' | 'scrub',
  pools: { a: PoolRow[]; b: PoolRow[]; c: PoolRow[]; eo: PoolRow[] },
  cPct: number = 0.08,
  beeswaxOn: boolean = true,
): FormulaResult {
  const eoPct = mode === 'face' ? 0.01 : mode === 'body' ? 0.02 : 0;
  const vitE = 0.004;
  const beeswaxPct = beeswaxOn ? 0.08 : 0;

  if (product === 'balm') {
    if (mode === 'lips') {
      const fixed: FixedIngredient[] = [
        { name: 'Tallow', pct: 0.32, color: FB_COLORS.tallow },
        { name: 'Beeswax', pct: 0.18, color: FB_COLORS.beeswax },
        { name: 'Shea butter', pct: 0.10, color: FB_COLORS.shea },
        { name: 'Jojoba', pct: 0.15, color: FB_COLORS.jojoba },
        { name: 'Vitamin E', pct: 0.02, color: FB_COLORS.vite },
      ];
      const hasEo = pools.eo.length > 0;
      const lipEoPct = hasEo ? 0.01 : 0;
      const lipAPct = 0.2 - lipEoPct;
      return {
        fixed,
        aSplit: splitPool(pools.a, lipAPct),
        bSplit: splitPool(pools.b, 0.03),
        cSplit: [],
        eoSplit: splitPool(pools.eo, lipEoPct),
        eoPct: lipEoPct,
        cPct: 0,
        scale: 1,
        product: 'lips',
      };
    }

    if (mode === 'eyes') {
      // EYE SERUM — water-oil emulsion (complex, requires emulsifier + preservative)
      const fixed: FixedIngredient[] = [
        { name: 'Aloe vera juice', pct: 0.35, color: FB_COLORS.aloe },
        { name: 'Green tea hydrosol', pct: 0.20, color: FB_COLORS.greenTea },
        { name: 'Vegetable glycerin', pct: 0.055, color: FB_COLORS.glycerin },
        { name: 'Squalane', pct: 0.08, color: FB_COLORS.squalane },
        { name: 'Jojoba', pct: 0.04, color: FB_COLORS.jojoba },
        { name: 'Olivem 1000 (emulsifier)', pct: 0.06, color: FB_COLORS.emulsifier },
        { name: 'Geogard Ultra (preservative)', pct: 0.015, color: FB_COLORS.preservative },
        { name: 'Phytic acid (chelator)', pct: 0.001, color: FB_COLORS.chelator },
        { name: 'Vitamin E', pct: 0.005, color: FB_COLORS.vite },
      ];
      return {
        fixed,
        aSplit: splitPool(pools.a, 0.094),
        bSplit: splitPool(pools.b, 0.08),
        cSplit: [],
        eoSplit: [],
        eoPct: 0,
        cPct: 0,
        scale: 1,
        product: 'eyes',
      };
    }

    if (mode === 'eyes_balm') {
      // ANHYDROUS EYE OIL SERUM — pure oil, zero tallow, zero beeswax
      // No water = no emulsifier, no preservative, no pH control
      // Shelf life: 12–18 months | Ultra-light liquid for 0.5mm under-eye skin
      const fixed: FixedIngredient[] = [
        { name: 'Squalane', pct: 0.50, color: FB_COLORS.squalane },
        { name: 'Jojoba', pct: 0.20, color: FB_COLORS.jojoba },
        { name: 'Rosehip', pct: 0.10, color: FB_COLORS.rosehip },
        { name: 'Prickly pear blend', pct: 0.08, color: FB_COLORS.pricklypear },
        { name: 'Calendula oil', pct: 0.08, color: FB_COLORS.calendula },
        { name: 'Vitamin E', pct: 0.02, color: FB_COLORS.vite },
      ];
      // No pools — this is a complete fixed-ratio oil serum
      // Optional: 2% from vitamin E budget can shift to active B pool if needed
      return {
        fixed,
        aSplit: splitPool(pools.a, 0),
        bSplit: splitPool(pools.b, 0.02),
        cSplit: [],
        eoSplit: [],
        eoPct: 0,
        cPct: 0,
        scale: 1,
        product: 'eyes_balm',
      };
    }

    const tallowPct = 0.58 + (beeswaxOn ? 0 : 0.08);
    const fixed: FixedIngredient[] = [
      { name: 'Tallow', pct: tallowPct, color: FB_COLORS.tallow },
      ...(beeswaxOn ? [{ name: 'Beeswax', pct: 0.08, color: FB_COLORS.beeswax }] : []),
      { name: 'Jojoba', pct: 0.11, color: FB_COLORS.jojoba },
      { name: 'Vitamin E', pct: vitE, color: FB_COLORS.vite },
    ];
    return {
      fixed,
      aSplit: splitPool(pools.a, 0.13),
      bSplit: splitPool(pools.b, 0.06),
      cSplit: [],
      eoSplit: splitPool(pools.eo, eoPct),
      eoPct, cPct: 0, scale: 1, product: 'balm',
    };
  }

  // Scrub / exfoliator mode
  const clampedC = Math.min(0.15, Math.max(0.05, cPct));
  const baseNom = 0.58 + beeswaxPct + 0.11 + 0.13 + 0.06; // tallow+beeswax+jojoba+A+B
  const rem = 1 - vitE - eoPct - clampedC;
  const scale = Math.max(0.02, rem) / baseNom;

  const tallowPct = (0.58 + (beeswaxOn ? 0 : 0.08)) * scale;
  const fixed: FixedIngredient[] = [
    { name: 'Tallow', pct: tallowPct, color: FB_COLORS.tallow },
    ...(beeswaxOn ? [{ name: 'Beeswax', pct: 0.08 * scale, color: FB_COLORS.beeswax }] : []),
    { name: 'Jojoba', pct: 0.11 * scale, color: FB_COLORS.jojoba },
    { name: 'Vitamin E', pct: vitE, color: FB_COLORS.vite },
  ];

  return {
    fixed,
    aSplit: splitPool(pools.a, 0.13 * scale),
    bSplit: splitPool(pools.b, 0.06 * scale),
    cSplit: pools.c.length ? splitPool(pools.c, clampedC) : [],
    eoSplit: splitPool(pools.eo, eoPct),
    eoPct, cPct: clampedC, scale, product: 'scrub',
  };
}

export function getTipLevel(weight: number): 'low' | 'mid' | 'high' {
  return weight <= 3 ? 'low' : weight <= 7 ? 'mid' : 'high';
}

/** Visual bar width: sqrt-scaled, normalized so largest fills 100% */
export function sqrtBarWidth(pct: number, maxSqrt: number): number {
  const v = Math.sqrt(Math.max(0, pct) / 100);
  return Math.min(100, Math.round((v / (maxSqrt || 1e-9)) * 1000) / 10);
}
