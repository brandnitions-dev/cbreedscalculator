/**
 * MOSSKYN LAB — Treatment Oil Ingredients
 * Carrier oils, actives, and EOs for BHA Penetrating Oil and Pore Purge Blend
 */

export interface OilIngredient {
  id: string;
  name: string;
  desc: string;
  color: string;
  benefits: Record<string, number>;
  tips: { low: string; mid: string; high: string };
  maxPct?: number;
  warn?: boolean;
}

export const OIL_CARRIERS: OilIngredient[] = [
  { id: 'jojoba', name: 'Jojoba Oil', desc: 'Wax ester that mimics sebum — tricks pores into accepting treatment. Non-comedogenic, stable.', color: '#5DCAA5', benefits: { penetration: 3, sebumControl: 3, stability: 3 }, tips: { low: 'Light sebum mimicry — good base layer.', mid: 'Strong penetration — pores accept treatment readily.', high: 'Jojoba-dominant — maximum sebum mimicry, excellent for oily skin.' } },
  { id: 'squalane', name: 'Olive Squalane', desc: 'Biomimetic to skin lipids — weightless deep penetration. Stable, non-comedogenic.', color: '#7DD3C0', benefits: { penetration: 3, moisturizing: 2, stability: 3 }, tips: { low: 'Light penetration boost.', mid: 'Good deep carrier — reaches follicle base.', high: 'Squalane-heavy — maximum depth, elegant feel.' } },
  { id: 'castor', name: 'Castor Oil', desc: 'Ricinoleic acid creates astringent "pull" — grips sebum plugs. Creates rolling sensation during massage.', color: '#A7F3D0', benefits: { extraction: 3, antimicrobial: 2, viscosity: 2 }, tips: { low: 'Subtle grip — mild extraction support.', mid: 'Good extraction pull — blackheads start rolling.', high: 'Strong castor — maximum grip, very effective but thicker formula.' } },
  { id: 'grapeseed', name: 'Grapeseed Oil', desc: 'High linoleic acid — thins sebum, non-comedogenic. Light astringent feel.', color: '#BBF7D0', benefits: { sebumControl: 3, acne: 2, lightness: 3 }, tips: { low: 'Light sebum thinning.', mid: 'Good linoleic support — sebum flows easier.', high: 'Grapeseed-dominant — very light, excellent for congested skin.' } },
  { id: 'rosehip', name: 'Rosehip Oil', desc: 'Trans-retinoic acid + linoleic — post-extraction healing and scar prevention. Light sensitive.', color: '#FCA5A5', benefits: { healing: 3, scarring: 3, antiaging: 2 }, tips: { low: 'Gentle healing support.', mid: 'Good regeneration — helps prevent PIH.', high: 'Rosehip-heavy — maximum healing but watch oxidation.' } },
  { id: 'hemp', name: 'Hemp Seed Oil', desc: 'Perfect 3:1 omega ratio — anti-inflammatory, non-comedogenic. Green tint.', color: '#86EFAC', benefits: { antiinflammatory: 3, acne: 3, barrier: 2 }, tips: { low: 'Mild anti-inflammatory.', mid: 'Good omega balance — calms extraction redness.', high: 'Hemp-dominant — strong anti-inflammatory, slight green tint.' } },
  { id: 'tamanu', name: 'Tamanu Oil', desc: 'Calophyllolide — exceptional for scar tissue. Deep green, distinctive scent.', color: '#34D399', benefits: { scarring: 3, healing: 3, antimicrobial: 2 }, tips: { low: 'Trace scar support.', mid: 'Good healing dose — calophyllolide active.', high: 'Tamanu-heavy — elite scarring formula, noticeable green.' } },
  { id: 'meadowfoam', name: 'Meadowfoam Oil', desc: 'Long-chain fatty acids — extends shelf life of other oils. Cushioned film.', color: '#A5F3FC', benefits: { stability: 3, barrier: 2, moisturizing: 2 }, tips: { low: 'Subtle stability boost.', mid: 'Good shelf life extension.', high: 'Meadowfoam-heavy — very stable formula.' } },
];

export const PURGE_BHA_MANUFACTURING_NOTE =
  'Salicylic acid must be fully dissolved before combining phases. Warm jojoba to ~40°C, add SA powder, stir until fully clear (dissolves well in warm oil). Cool to <35°C before adding vitamin E and bakuchiol. Add bisabolol last. Essential oils when temp is below 30°C. Anhydrous oil system — SA releases at the skin surface where water is present.';

export const OIL_ACTIVES: OilIngredient[] = [
  {
    id: 'salicylic_acid',
    name: 'Salicylic Acid (pure)',
    desc: 'PubChem CID 338. Oil-soluble BHA — dissolves in warm jojoba. 2% is clinical leave-on ceiling (EU/FDA). Comedolytic, keratolytic, antimicrobial.',
    color: '#F97316',
    benefits: { exfoliation: 3, poreClearing: 3, acne: 3 },
    maxPct: 0.02,
    warn: true,
    tips: {
      low: 'Sub-therapeutic trace — not for Purge-class prep.',
      mid: '2% batch dose — measurable BHA, consistent vs willow extract.',
      high: 'Do not exceed 2% leave-on; warm-dissolve in jojoba before other actives.',
    },
  },
  {
    id: 'bakuchiol',
    name: 'Bakuchiol',
    desc: 'Oil-soluble retinol analogue — collagen renewal after BHA clears the follicle. Anti-inflammatory, non-photosensitising.',
    color: '#C084FC',
    benefits: { antiaging: 3, firming: 3, healing: 2 },
    maxPct: 0.03,
    tips: {
      low: 'Introductory renewal support.',
      mid: '2% with SA — cell turnover into opened follicular channel.',
      high: 'Strong plant-retinoid activity — patch test if stacking with other retinoids.',
    },
  },
  { id: 'willowbark', name: 'Willow Bark Extract', desc: 'Natural salicin precursor — inconsistent topical conversion to SA. Not used in The Purge (replaced by pure SA).', color: '#FCD34D', benefits: { exfoliation: 2, poreClearing: 2, antiinflammatory: 2 }, maxPct: 0.05, tips: { low: 'Gentle legacy natural BHA.', mid: 'Variable salicin activity.', high: 'Prefer pure salicylic acid for measurable clinic prep.' } },
  { id: 'bisabolol', name: 'Alpha-Bisabolol', desc: 'Chamomile-derived — suppresses post-BHA inflammatory cascade. Anti-inflammatory anchor.', color: '#FDE68A', benefits: { soothing: 3, antiinflammatory: 3, healing: 2 }, maxPct: 0.03, tips: { low: 'Light calming.', mid: '3% in Purge — counters SA irritation vs willow-era 2%.', high: 'Do not crowd out SA/bakuchiol in the actives budget.' } },
  { id: 'allantoin', name: 'Allantoin', desc: 'Cell proliferant — speeds healing, softens skin. Very gentle.', color: '#FEF3C7', benefits: { healing: 3, softening: 3, soothing: 2 }, maxPct: 0.02, tips: { low: 'Gentle healing support.', mid: 'Good cell renewal.', high: 'Strong allantoin — maximum healing acceleration.' } },
  { id: 'vitaminE', name: 'Vitamin E (Tocopherol)', desc: 'Antioxidant — prevents oil oxidation, extends shelf life. Skin healing.', color: '#FBBF24', benefits: { antioxidant: 3, stability: 3, healing: 2 }, maxPct: 0.02, tips: { low: 'Stabiliser baseline (~1%) for rosehip-light BHA oils.', mid: 'Moderate antioxidant.', high: 'Higher % if formula is very oxidation-prone — avoid crowding actives.' } },
];

export const OIL_EOS: OilIngredient[] = [
  { id: 'wintergreen', name: 'Wintergreen EO', desc: 'Methyl salicylate (BHA) — powerful pore penetration. TOXIC above 3%. Clinical use 0.5% max.', color: '#F87171', benefits: { bha: 3, penetration: 3, antimicrobial: 2 }, maxPct: 0.03, warn: true, tips: { low: 'Safe BHA dose — gentle penetration.', mid: 'Strong BHA — noticeable tingling, effective.', high: 'Maximum wintergreen — powerful but watch for sensitivity. Never exceed 3%.' } },
  { id: 'teatree', name: 'Tea Tree EO', desc: 'Terpinen-4-ol — broad spectrum antimicrobial. Acne gold standard.', color: '#A7F3D0', benefits: { antimicrobial: 3, acne: 3, antifungal: 2 }, maxPct: 0.05, tips: { low: 'Mild antimicrobial.', mid: 'Good acne-fighting dose.', high: 'Strong tea tree — maximum antimicrobial, medicinal scent.' } },
  { id: 'frankincense', name: 'Frankincense EO', desc: 'Boswellic acids — pore tightening, anti-aging. Resinous, grounding scent.', color: '#C4B5FD', benefits: { firming: 3, antiaging: 2, calming: 2 }, maxPct: 0.05, tips: { low: 'Subtle pore tightening.', mid: 'Good firming dose.', high: 'Frankincense-dominant — strong pore tightening, resinous scent.' } },
  { id: 'lavender', name: 'Lavender EO', desc: 'Linalool — calming, healing, antimicrobial. Universal skin oil.', color: '#DDD6FE', benefits: { calming: 3, healing: 2, antimicrobial: 2 }, maxPct: 0.05, tips: { low: 'Gentle calming.', mid: 'Good healing support.', high: 'Lavender-heavy — very calming, floral scent.' } },
  { id: 'rosemary', name: 'Rosemary EO', desc: 'Carnosic acid — antioxidant, stimulating. Extends oil shelf life.', color: '#86EFAC', benefits: { antioxidant: 3, stimulating: 2, stability: 2 }, maxPct: 0.03, tips: { low: 'Antioxidant boost.', mid: 'Good preservation.', high: 'Rosemary-heavy — strong herbal, stimulating.' } },
  { id: 'clary', name: 'Clary Sage EO', desc: 'Sclareol — balances sebum production. Hormonal skin support.', color: '#A5B4FC', benefits: { sebumControl: 3, hormonal: 2, calming: 2 }, maxPct: 0.03, tips: { low: 'Subtle sebum balance.', mid: 'Good oil control.', high: 'Clary-dominant — strong sebum regulation.' } },
  { id: 'geranium', name: 'Geranium EO', desc: 'Citronellol — balancing, astringent. Good for all skin types.', color: '#FDA4AF', benefits: { balancing: 3, astringent: 2, healing: 2 }, maxPct: 0.04, tips: { low: 'Light balancing.', mid: 'Good astringent tone.', high: 'Geranium-heavy — floral, balancing.' } },
];

export interface OilFormula {
  id: string;
  name: string;
  desc: string;
  activePct?: number;
  eoPct?: number;
  carriers: { ingId: string; weight: number }[];
  actives: { ingId: string; weight: number }[];
  eos: { ingId: string; weight: number }[];
  shelfLife: string;
  manufacturingNote?: string;
}

export const OIL_PRESETS: OilFormula[] = [
  {
    id: 'bha_penetrating',
    name: 'The Purge — BHA Penetration Oil',
    desc: 'Steam-replacement prep: jojoba + squalane open the follicular pathway; pure SA 2% (CID 338) keratolyzes the plug; bakuchiol 2% renews the cleared channel; bisabolol 3% calms; rosemary + tea tree 0.5% each.',
    activePct: 0.08,
    eoPct: 0.01,
    carriers: [
      { ingId: 'jojoba', weight: 40 },
      { ingId: 'grapeseed', weight: 35 },
      { ingId: 'rosehip', weight: 10 },
      { ingId: 'squalane', weight: 6 },
    ],
    actives: [
      { ingId: 'salicylic_acid', weight: 2 },
      { ingId: 'bakuchiol', weight: 2 },
      { ingId: 'bisabolol', weight: 3 },
      { ingId: 'vitaminE', weight: 1 },
    ],
    eos: [
      { ingId: 'rosemary', weight: 1 },
      { ingId: 'teatree', weight: 1 },
    ],
    shelfLife: '8-10mo',
    manufacturingNote: PURGE_BHA_MANUFACTURING_NOTE,
  },
  {
    id: 'pore_purge',
    name: 'Pore Purge Blend (Clinical)',
    desc: 'High-intensity clinical extraction oil — blackheads roll out like grains of sand. Castor + Squalane + Wintergreen mimics steam.',
    carriers: [{ ingId: 'jojoba', weight: 5 }, { ingId: 'squalane', weight: 2 }, { ingId: 'castor', weight: 2 }, { ingId: 'grapeseed', weight: 1 }],
    actives: [{ ingId: 'bisabolol', weight: 5 }],
    eos: [{ ingId: 'wintergreen', weight: 2 }, { ingId: 'teatree', weight: 2 }, { ingId: 'frankincense', weight: 2 }],
    shelfLife: '10-12mo',
  },
];
