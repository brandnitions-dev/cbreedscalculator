/**
 * MOSSKYN LAB — Soap Additives
 * Usage rates for cold-process soap at trace, lye-water, or oil phase.
 */

import type { SoapAdditive } from '@/types';

export const SOAP_ADDITIVES: SoapAdditive[] = [
  {
    id: 'kaolin_clay',
    name: 'Kaolin Clay (white)',
    phase: 'trace',
    usageRate: '1–2 tbsp per lb of oils',
    desc: 'Mildest clay — anchors fragrance, adds silky slip. Produces a smoother bar surface.',
    notes: 'Mix with a small amount of oil before adding at trace to prevent clumping.',
  },
  {
    id: 'bentonite_clay',
    name: 'Bentonite Clay',
    phase: 'trace',
    usageRate: '1 tbsp per lb of oils',
    desc: 'Draws impurities, adds slip and a slight detoxifying marketing angle. Gray-green tint.',
    notes: 'Absorbs water — can speed up trace. Pre-disperse in oil.',
  },
  {
    id: 'activated_charcoal',
    name: 'Activated Charcoal',
    phase: 'trace',
    usageRate: '1 tsp per lb of oils',
    desc: 'Dramatic black color. Detox and deep-cleansing angle. Popular in men\'s and acne-focused bars.',
    notes: 'Very pigmented — wear gloves. Can be used for swirl designs.',
  },
  {
    id: 'colloidal_oatmeal',
    name: 'Colloidal Oatmeal',
    phase: 'trace',
    usageRate: '1–2 tbsp per lb of oils',
    desc: 'FDA-recognized skin protectant. Soothing, gentle exfoliation, golden speckled appearance.',
    notes: 'Finely ground. Coarse oats can be used for more visible texture.',
  },
  {
    id: 'honey_raw',
    name: 'Honey (raw)',
    phase: 'lye-water',
    usageRate: '1 tsp per lb of oils',
    desc: 'Natural humectant, lather booster. Creates warm caramel color. Sugars can cause overheating.',
    notes: 'Add to cooled lye solution. Reduces gel-phase temp — fridge-force if needed. Can cause glycerin rivers (cosmetic, not functional).',
  },
  {
    id: 'goat_milk',
    name: 'Goat Milk Powder',
    phase: 'lye-water',
    usageRate: '1 tbsp per lb of oils',
    desc: 'Creaminess, luxury angle. Alpha-hydroxy acids (lactic) provide gentle brightening. Rich bar.',
    notes: 'Use frozen milk or reconstituted powder in lye. Sugars burn at high temps — use slow cool method. Will discolor to tan/caramel.',
  },
  {
    id: 'sodium_lactate',
    name: 'Sodium Lactate',
    phase: 'lye-water',
    usageRate: '1 tsp per lb of oils',
    desc: 'Produces significantly harder bars. Faster unmolding (12-24 hours vs 48). Derived from corn fermentation.',
    notes: 'Add to cooled lye solution. Standard trick for tallow soap that unmolds cleanly.',
  },
  {
    id: 'silk_fibers',
    name: 'Tussah Silk Fibers',
    phase: 'lye-water',
    usageRate: 'Small pinch per batch',
    desc: 'Dissolves in lye to add silk amino acids. Creates incredibly silky, glossy lather.',
    notes: 'Add to hot lye — dissolves in seconds. Cruelty-free tussah preferred.',
  },
  {
    id: 'turmeric_powder',
    name: 'Turmeric Powder',
    phase: 'trace',
    usageRate: '½–1 tsp per lb of oils',
    desc: 'Golden-yellow natural colorant. Anti-inflammatory curcumin angle.',
    notes: 'Will stain equipment. Mix with oil first. Color darkens to warm gold over cure.',
  },
  {
    id: 'spirulina',
    name: 'Spirulina Powder',
    phase: 'trace',
    usageRate: '½–1 tsp per lb of oils',
    desc: 'Natural green colorant from algae. Antioxidant angle. Earthy scent.',
    notes: 'Color may shift to teal/olive during cure depending on pH exposure.',
  },
  {
    id: 'dried_herbs',
    name: 'Dried Herbs (lavender buds, calendula petals)',
    phase: 'trace',
    usageRate: '1–2 tsp per lb of oils',
    desc: 'Visual botanical interest. Lavender buds turn brown in CP soap; calendula petals retain golden color best.',
    notes: 'Most botanicals turn brown/black from lye contact. Calendula and chamomile are the rare exceptions — they keep their color.',
  },
  {
    id: 'pumice',
    name: 'Pumice Powder (fine)',
    phase: 'trace',
    usageRate: '1–2 tbsp per lb of oils',
    desc: 'Heavy-duty exfoliation. Mechanic / gardener soap. Volcanic stone — won\'t dissolve.',
    notes: 'Settles to bottom if trace is too thin. Add at medium-thick trace and pour immediately.',
  },
  {
    id: 'sea_salt',
    name: 'Sea Salt (fine)',
    phase: 'trace',
    usageRate: '½–1 tsp per lb of oils',
    desc: 'Exfoliant and hardener. Creates a rustic spa bar. Can produce a crumbly texture at high percentages.',
    notes: 'For true salt bars (50-100% salt by oil weight), use 80%+ coconut oil. In MOSSKYN LAB tallow bars, keep to light exfoliation.',
  },
  {
    id: 'coffee_grounds_soap',
    name: 'Coffee Grounds (fine)',
    phase: 'trace',
    usageRate: '1–2 tsp per lb of oils',
    desc: 'Exfoliant and deodorizer. Kitchen soap angle. Antioxidant caffeine.',
    notes: 'Use dried, spent grounds. Fresh grounds can bleed oils. Mild brown speckle.',
  },
  {
    id: 'cocoa_powder',
    name: 'Cocoa Powder (raw)',
    phase: 'trace',
    usageRate: '1–2 tsp per lb of oils',
    desc: 'Rich brown color, chocolate aroma. Pairs beautifully with cocoa butter and vanilla EO.',
    notes: 'Natural cocoa (not Dutch-processed) retains more antioxidants. Can cause slight acceleration.',
  },
];

export function getAdditivesByPhase(phase: SoapAdditive['phase']): SoapAdditive[] {
  return SOAP_ADDITIVES.filter(a => a.phase === phase);
}
