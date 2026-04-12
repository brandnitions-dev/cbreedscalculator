'use client';

import { SprayCan } from 'lucide-react';
import { ProductCalculator } from '@/components/layout/product-calculator';
import { CleanerLabWorksheet } from './lab-worksheet';
import { CleanerFormulaBuilder } from './formula-builder';
import { CleanerChemistry } from './chemistry';

export default function CleanerPage() {
  return (
    <ProductCalculator
      title="Face Cleaner Calculator"
      subtitle="Tallow-based scrub with physical exfoliant phase (C) and oil absorption chemistry"
      icon={<SprayCan size={24} />}
      accentColor="#10b981"
      labContent={<CleanerLabWorksheet />}
      builderContent={<CleanerFormulaBuilder />}
      chemistryContent={<CleanerChemistry />}
      defaultTab="builder"
    />
  );
}
