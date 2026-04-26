export type SavedProductType = 'BALM' | 'CLEANER' | 'EXFOLIATOR' | 'SOAP' | 'TREATMENT_OIL';

export const PRODUCT_TYPE_LABEL: Record<SavedProductType, string> = {
  BALM: 'Tallow Balm',
  CLEANER: 'Face Cleaner',
  EXFOLIATOR: 'Exfoliator',
  SOAP: 'Tallow Soap',
  TREATMENT_OIL: 'Treatment Oils',
};

export const PRODUCT_TYPE_ROUTE: Record<SavedProductType, string> = {
  BALM: '/balm',
  CLEANER: '/cleaner',
  EXFOLIATOR: '/exfoliator',
  SOAP: '/soap',
  TREATMENT_OIL: '/oils',
};

export const SAVED_FORMULA_GROUP_ORDER: SavedProductType[] = [
  'BALM',
  'CLEANER',
  'EXFOLIATOR',
  'SOAP',
  'TREATMENT_OIL',
];
