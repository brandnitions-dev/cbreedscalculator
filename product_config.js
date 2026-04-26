/**
 * MOSSKYN LAB Product Configuration
 * Defines all product categories, types, and their formulas
 */

const PRODUCT_CATEGORIES = {
  balms: {
    id: 'balms',
    name: 'Tallow Balms',
    icon: '🧴',
    description: 'Tallow-based balms and scrubs with beeswax structure',
    types: {
      balm: {
        id: 'balm',
        name: 'Skin Balm',
        description: 'Classic tallow balm with therapeutic carriers',
        formula: {
          tallow: 0.58,
          beeswax: 0.08,
          jojoba: 0.11,
          ingredientA: 0.13,
          ingredientB: 0.06,
          vitaminE: 0.004,
          eo: { face: 0.01, body: 0.02 }
        },
        hasHeat: true,
        packoutSize: 50, // ml per jar
        shelfLife: { stable: '12-18mo', unstable: '8-10mo' }
      },
      scrub: {
        id: 'scrub',
        name: 'Exfoliator / Scrub',
        description: 'Tallow balm with physical exfoliant phase',
        formula: {
          tallow: 0.58, // scaled down when C is added
          beeswax: 0.08,
          jojoba: 0.11,
          ingredientA: 0.13,
          ingredientB: 0.06,
          ingredientC: { min: 0.05, max: 0.15, default: 0.08 },
          vitaminE: 0.004,
          eo: { face: 0.01, body: 0.02 }
        },
        hasHeat: true,
        packoutSize: 50,
        shelfLife: { stable: '10-14mo', unstable: '6-8mo' }
      }
    }
  },

  oils: {
    id: 'oils',
    name: 'Treatment Oils',
    icon: '💧',
    description: 'Anhydrous penetrating oils for clinical and home use',
    types: {
      bha_penetrating: {
        id: 'bha_penetrating',
        name: 'BHA Penetrating Oil',
        description: 'Deep pore treatment for home/spa use — replaces steam',
        formula: {
          jojoba: 0.60,
          rosehip: 0.20,
          willowBark: 0.10, // Natural BHA source
          frankincense: 0.04,
          wintergreen: 0.03, // Methyl salicylate - HIGH INTENSITY
          teaTree: 0.03
        },
        hasHeat: false,
        packoutSize: 30, // ml dropper bottle
        shelfLife: { default: '8-10mo' },
        warnings: [
          'Wintergreen EO max 3% — toxic at higher doses',
          'BHA increases sun sensitivity — use SPF after',
          'Tingling is normal; burning means wipe off immediately'
        ],
        usage: {
          steps: [
            'Cleanse skin thoroughly',
            'Massage 3-5 drops into T-zone or congested areas',
            'Wait 5-10 minutes (replaces steaming time)',
            'Proceed with extractions if clinical',
            'Wipe with warm towel, follow with toner'
          ]
        }
      },
      pore_purge: {
        id: 'pore_purge',
        name: 'Pore Purge Blend (Clinical)',
        description: 'High-intensity clinical extraction oil — blackheads roll out',
        formula: {
          jojoba: 0.50,
          squalane: 0.20, // Olive squalane - dives deep
          castor: 0.15, // Astringent pull
          grapeseed: 0.10, // Thins sebum
          rosehip: 0.035, // Post-extraction healing
          alphaBisabolol: 0.005, // Chamomile extract - stops redness
          wintergreen: 0.005, // BHA at safe clinical dose
          teaTree: 0.005, // Antibacterial
          frankincense: 0.005 // Pore tightening
        },
        hasHeat: false,
        packoutSize: 30,
        shelfLife: { default: '10-12mo' },
        warnings: [
          'Clinical use only — trained estheticians',
          'Wintergreen kept at 0.5% for zero burn risk',
          'Castor oil creates "rolling" sensation during massage'
        ],
        usage: {
          steps: [
            'Cleanse skin thoroughly',
            'Massage into nose/chin for 3-5 minutes',
            'Feel blackheads "rolling like grains of sand"',
            'Proceed with extractions — oil provides slip',
            'Wipe with warm towel, apply soothing toner'
          ],
          proTip: 'Castor + Squalane + Wintergreen mimics 15min steam + desincrustation fluid'
        }
      }
    }
  },

  soaps: {
    id: 'soaps',
    name: 'Soaps',
    icon: '🧼',
    description: 'Cold process and hot process soap formulations',
    comingSoon: true,
    types: {
      cold_process: {
        id: 'cold_process',
        name: 'Cold Process Soap',
        description: 'Traditional lye-based soap with tallow',
        formula: {
          // Saponification values will be calculated
          tallow: 0.40,
          coconut: 0.25,
          olive: 0.25,
          castor: 0.05,
          shea: 0.05,
          lye: 'calculated', // NaOH
          water: 'calculated',
          superfat: 0.05
        },
        hasHeat: false, // Cold process
        cureTime: '4-6 weeks',
        packoutSize: 100 // grams per bar
      },
      hot_process: {
        id: 'hot_process',
        name: 'Hot Process Soap',
        description: 'Cooked soap — ready to use faster',
        formula: {
          tallow: 0.40,
          coconut: 0.25,
          olive: 0.25,
          castor: 0.05,
          shea: 0.05,
          lye: 'calculated',
          water: 'calculated',
          superfat: 0.05
        },
        hasHeat: true,
        cureTime: '1-2 weeks',
        packoutSize: 100
      }
    }
  }
};

// Ingredient databases for each product category
const TREATMENT_OIL_INGREDIENTS = {
  carriers: [
    { id: 'jojoba', name: 'Jojoba Oil', desc: 'Mimics human sebum — tricks pores into accepting actives. Non-comedogenic.', benefits: { penetration: 3, sebumControl: 3, barrier: 2 } },
    { id: 'squalane', name: 'Olive Squalane', desc: 'Flashes deep into pores, carries actives. Weightless, biomimetic.', benefits: { penetration: 3, moisturizing: 2, antiaging: 2 } },
    { id: 'castor', name: 'Castor Oil', desc: 'Astringent pull — grips and lifts debris to surface. Creates "rolling" sensation.', benefits: { drawing: 3, cleansing: 3, moisturizing: 1 } },
    { id: 'grapeseed', name: 'Grapeseed Oil', desc: 'High linoleic — thins sticky, acne-causing sebum. Light, fast-absorbing.', benefits: { sebumControl: 3, acne: 2, antioxidant: 2 } },
    { id: 'rosehip', name: 'Rosehip Oil', desc: 'Trans-retinoic acid precursor — floods skin with Vitamin A for healing.', benefits: { healing: 3, antiaging: 3, scarring: 3 } }
  ],
  actives: [
    { id: 'willowBark', name: 'Willow Bark Extract', desc: 'Natural salicin (BHA precursor) — exfoliates inside the pore.', benefits: { exfoliation: 3, acne: 3, poreClearing: 3 }, maxPct: 0.15 },
    { id: 'alphaBisabolol', name: 'Alpha-Bisabolol', desc: 'Chamomile extract — immediately stops extraction redness.', benefits: { antiinflammatory: 3, soothing: 3, healing: 2 }, maxPct: 0.01 }
  ],
  eos: [
    { id: 'wintergreen', name: 'Wintergreen EO', desc: 'Methyl salicylate — high-intensity BHA. DANGER: max 3% home, 0.5% clinical.', benefits: { exfoliation: 3, penetration: 3, acne: 2 }, maxPct: 0.03, warnings: ['Toxic at high doses', 'Never exceed 3%'] },
    { id: 'teaTree', name: 'Tea Tree EO', desc: 'Kills acne-causing bacteria during treatment.', benefits: { antimicrobial: 3, acne: 3, purifying: 2 }, maxPct: 0.05 },
    { id: 'frankincense', name: 'Frankincense EO', desc: 'Tightens pores after treatment. Anti-inflammatory.', benefits: { tightening: 3, antiinflammatory: 2, antiaging: 2 }, maxPct: 0.05 }
  ]
};

// Chemistry content for each product category
const PRODUCT_CHEMISTRY = {
  balms: {
    title: 'Skin Chemistry Blueprint',
    subtitle: 'Oily skin focus — ingredients mapped to chemistry and function',
    tabs: ['Skin biology', 'Acids', 'Carrier oils', 'Tallow · Beeswax · Vit E', 'Day / Night routine']
  },
  oils: {
    title: 'Treatment Oil Chemistry',
    subtitle: 'Deep pore penetration — BHA, sebum dissolution, clinical extraction',
    tabs: ['Pore anatomy', 'BHA / Salicylates', 'Carrier penetration', 'Clinical protocol', 'Safety warnings']
  },
  soaps: {
    title: 'Saponification Chemistry',
    subtitle: 'Lye reactions, SAP values, superfat calculations',
    tabs: ['Saponification basics', 'SAP values', 'Oil profiles', 'Lye calculator', 'Cure science']
  }
};

// Helper to get current product config
function getProductConfig(categoryId, typeId) {
  const cat = PRODUCT_CATEGORIES[categoryId];
  if (!cat) return null;
  const type = cat.types[typeId];
  if (!type) return null;
  return { category: cat, type: type };
}

// Helper to get formula percentages as array for display
function getFormulaBreakdown(categoryId, typeId) {
  const config = getProductConfig(categoryId, typeId);
  if (!config) return [];
  const formula = config.type.formula;
  const breakdown = [];
  for (const [key, value] of Object.entries(formula)) {
    if (typeof value === 'number') {
      breakdown.push({ name: key, pct: value });
    } else if (typeof value === 'object' && value.face !== undefined) {
      breakdown.push({ name: key + ' (face)', pct: value.face });
      breakdown.push({ name: key + ' (body)', pct: value.body });
    }
  }
  return breakdown;
}
