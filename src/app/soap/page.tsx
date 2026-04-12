'use client';

import { Droplets } from 'lucide-react';
import { ProductCalculator } from '@/components/layout/product-calculator';
import { SoapLabWorksheet } from './lab-worksheet';
import { SoapFormulaBuilder } from './formula-builder';
import { SoapChemistry } from './chemistry';

export default function SoapPage() {
  return (
    <ProductCalculator
      title="Tallow Soap Calculator"
      subtitle="Cold-process saponification with real NaOH chemistry"
      icon={<Droplets size={24} />}
      accentColor="#10b981"
      labContent={<SoapLabWorksheet />}
      builderContent={<SoapFormulaBuilder />}
      chemistryContent={<SoapChemistry />}
      defaultTab="builder"
    />
  );
}
