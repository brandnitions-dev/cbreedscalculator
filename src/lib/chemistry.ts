/**
 * Crown Breeds — Saponification Chemistry Engine
 * Cold-process soap calculations with NaOH lye, water, superfat, and bar quality indices.
 */

import type { SoapOil, SoapCalcResult } from '@/types';

export interface SoapOilInput {
  oil: SoapOil;
  pct: number; // 0–100
}

/**
 * Calculate full cold-process soap recipe from oil blend.
 *
 * @param oils        — array of {oil, pct} where pct is 0-100 and sums to ~100
 * @param totalOilGrams — total weight of oils in grams
 * @param superfatPct  — superfat percentage (3-8, default 5)
 * @param lyeConcPct   — lye concentration / water discount (default 33 = 33% lye solution)
 * @param eoPctOfOils  — EO % of total oil weight (default 2.5)
 */
export function calculateSoap(
  oils: SoapOilInput[],
  totalOilGrams: number,
  superfatPct: number = 5,
  lyeConcPct: number = 33,
  eoPctOfOils: number = 2.5
): SoapCalcResult {
  // Normalize percentages
  const totalPct = oils.reduce((s, o) => s + o.pct, 0) || 100;

  const oilDetails = oils.map(({ oil, pct }) => {
    const normalizedPct = (pct / totalPct) * 100;
    const weight = (normalizedPct / 100) * totalOilGrams;
    const lyeContribution = weight * oil.sapNaOH;
    return {
      name: oil.name,
      pct: normalizedPct,
      weight: round(weight, 2),
      lyeContribution: round(lyeContribution, 4),
    };
  });

  const totalLyeBeforeSF = oilDetails.reduce((s, o) => s + o.lyeContribution, 0);
  const lyeNaOH = round(totalLyeBeforeSF * (1 - superfatPct / 100), 2);
  const waterWeight = round(lyeNaOH / (lyeConcPct / 100) - lyeNaOH, 2);
  const eoWeight = round(totalOilGrams * (eoPctOfOils / 100), 2);
  const totalBatchWeight = round(totalOilGrams + lyeNaOH + waterWeight + eoWeight, 2);

  // Bar quality indices (weighted average)
  const wAvg = (key: keyof SoapOil) =>
    oils.reduce((s, { oil, pct }) => s + (oil[key] as number) * (pct / totalPct), 0);

  const hardnessIndex = round(wAvg('hardness'), 0);
  const cleansingIndex = round(wAvg('cleansing'), 0);
  const conditioningIndex = round(wAvg('conditioning'), 0);

  // Cure time estimation: harder bars cure faster, high-iodine bars need longer
  const iodineAvg = wAvg('iodine');
  const cureWeeks = iodineAvg > 70 ? 6 : iodineAvg > 55 ? 5 : 4;

  return {
    totalOilWeight: totalOilGrams,
    lyeNaOH,
    waterWeight,
    superfatPct,
    totalBatchWeight,
    oils: oilDetails,
    hardnessIndex,
    cleansingIndex,
    conditioningIndex,
    cureWeeks,
    eoWeight,
  };
}

/**
 * Quality ranges for a balanced bar:
 * Hardness: 29–54, Cleansing: 12–22, Conditioning: 44–69
 * Bubbly: 14–46, Creamy: 16–48, Iodine: 41–70
 */
export function getQualityRating(value: number, min: number, max: number): 'low' | 'good' | 'high' {
  if (value < min) return 'low';
  if (value > max) return 'high';
  return 'good';
}

export const QUALITY_RANGES = {
  hardness: { min: 29, max: 54, label: 'Hardness' },
  cleansing: { min: 12, max: 22, label: 'Cleansing' },
  conditioning: { min: 44, max: 69, label: 'Conditioning' },
  bubbly: { min: 14, max: 46, label: 'Bubbly Lather' },
  creamy: { min: 16, max: 48, label: 'Creamy Lather' },
  iodine: { min: 41, max: 70, label: 'Iodine (stability)' },
};

function round(n: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}
