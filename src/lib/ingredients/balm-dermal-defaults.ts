export type BalmDermal = 'universal' | 'dry' | 'oily';

/**
 * Default Balm dermal focus per ingredient slug.
 * - `oily` — linoleic-forward / sebum–pore / congestion-friendly angles (e.g. LA story)
 * - `dry` — ALA / GLA / rich barrier — anti-inflammatory, very dry, sensitive angles
 * - `universal` — not set here; use DB default
 *
 * Omitted slugs default to `universal` in seed and Prisma.
 */
const OVERRIDES: Record<string, BalmDermal> = {
  // Carriers (A) — from typical fatty acid & copy emphasis
  rosehip: 'oily',
  grapeseed: 'oily',
  sunflower: 'oily',
  watermelon: 'oily',
  pricklypear: 'oily',
  ricebran: 'universal',
  hemp: 'oily',
  marula: 'universal',
  baobab: 'dry',
  argan: 'universal',
  almond: 'dry',
  apricot: 'universal',
  avocado: 'dry',
  chia: 'dry',
  pomegranate: 'universal',
  seabuck: 'dry',
  squalane: 'universal',
  meadowfoam: 'universal',
  macadamia: 'dry',
  eveprim: 'dry',
  borage: 'dry',
  sesame: 'universal',

  // Actives (B)
  blackseed: 'oily',
  neem: 'oily',
  tamanu: 'universal',
  karanja: 'oily',
  turmeric: 'oily',
  bakuchiol: 'universal',
  calendula: 'dry',
  moringa: 'oily',
  camellia: 'universal',
  gotukola: 'universal',
  buriti: 'dry',
  andiroba: 'universal',
  raspberry: 'universal',
  coffeeoil: 'oily',
  pumpkin: 'dry',

  // Essential oils (subset — sebum / acne vs dry–soothing)
  neroli: 'dry',
  geranium: 'oily',
  teatree: 'oily',
  bergamotfcf: 'oily',
  petitgrain: 'oily',
  lemongrass: 'oily',
  chamomile: 'dry',
  chamomile_german: 'dry',
  rose_otto: 'dry',
  myrrh: 'dry',
  sandalwood: 'universal',
  oud: 'dry',
  patchouli: 'dry',
  vanilla_abs: 'dry',
  rosemary: 'oily',
  peppermint: 'oily',
  benzoin_abs: 'dry',
  benzoin_resinoid: 'dry',
  yylang: 'oily', // sebum copy
};

export function getDefaultBalmDermalForSlug(slug: string): BalmDermal {
  return OVERRIDES[slug] ?? 'universal';
}

export function isBalmDermalMatch(
  focus: BalmDermal,
  mode: 'all' | 'dry' | 'oily',
): boolean {
  if (mode === 'all') return true;
  if (focus === 'universal') return true;
  return focus === mode;
}
