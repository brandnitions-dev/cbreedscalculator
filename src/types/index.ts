/* ── Sidebar ────────────────────────────────────────────────────────── */
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
}

/* ── Ingredient types ───────────────────────────────────────────────── */
export interface IngredientTips {
  low: string;
  mid: string;
  high: string;
}

export interface BenefitScores {
  [key: string]: number;
}

export interface Ingredient {
  id: string;
  name: string;
  desc: string;
  benefits: BenefitScores;
  tips: IngredientTips;
  potency?: 'mild' | 'moderate' | 'strong';
  // Soap-specific
  sapNaOH?: number;
  sapKOH?: number;
  hardness?: number;
  cleansing?: number;
  conditioning?: number;
  bubbly?: number;
  creamy?: number;
  iodine?: number;
}

export interface PoolRow {
  id: number;
  ingId: string;
  weight: number;
}

export interface FormulaSplit extends PoolRow {
  pct: number;
}

export interface FixedIngredient {
  name: string;
  pct: number;
  color: string;
}

export interface FormulaResult {
  fixed: FixedIngredient[];
  aSplit: FormulaSplit[];
  bSplit: FormulaSplit[];
  cSplit: FormulaSplit[];
  eoSplit: FormulaSplit[];
  eoPct: number;
  cPct: number;
  scale: number;
  product: 'balm' | 'scrub' | 'soap';
}

/* ── Soap-specific types ────────────────────────────────────────────── */
export interface SoapOil {
  id: string;
  name: string;
  sapNaOH: number;     // g NaOH per g oil
  sapKOH: number;      // g KOH per g oil
  hardness: number;    // 0-100
  cleansing: number;   // 0-100
  conditioning: number;
  bubbly: number;
  creamy: number;
  iodine: number;
  defaultPct: number;  // default % in recipe
  desc: string;
  category: 'base' | 'carrier' | 'luxury';
}

export interface SoapAdditive {
  id: string;
  name: string;
  phase: 'lye-water' | 'trace' | 'oil-phase';
  usageRate: string;
  desc: string;
  notes: string;
}

export interface SoapCalcResult {
  totalOilWeight: number;
  lyeNaOH: number;
  waterWeight: number;
  superfatPct: number;
  totalBatchWeight: number;
  oils: { name: string; pct: number; weight: number; lyeContribution: number }[];
  hardnessIndex: number;
  cleansingIndex: number;
  conditioningIndex: number;
  cureWeeks: number;
  eoWeight: number;
}

/* ── Formula persistence ────────────────────────────────────────────── */
export interface SavedFormula {
  id: string;
  name: string;
  productType: 'BALM' | 'EXFOLIATOR' | 'SOAP';
  mode?: string;
  batchSize: number;
  ingredients: unknown;
  eoBlend?: unknown;
  soapData?: unknown;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
