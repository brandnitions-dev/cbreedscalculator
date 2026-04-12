'use client';

import { Sparkles } from 'lucide-react';
import { ProductCalculator } from '@/components/layout/product-calculator';
import { ExfoliatorLabWorksheet } from './lab-worksheet';
import { ExfoliatorFormulaBuilder } from './formula-builder';
import { ExfoliatorChemistry } from './chemistry';

export default function ExfoliatorPage() {
  return (
    <ProductCalculator
      title="Exfoliator Calculator"
      subtitle="BHA penetrating oils & clinical pore purge blends — no tallow, pure chemical exfoliation"
      icon={<Sparkles size={24} />}
      accentColor="#f59e0b"
      labContent={<ExfoliatorLabWorksheet />}
      builderContent={<ExfoliatorFormulaBuilder />}
      chemistryContent={<ExfoliatorChemistry />}
      defaultTab="builder"
    />
  );
}
