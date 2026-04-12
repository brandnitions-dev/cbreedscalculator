'use client';

import { FlaskConical } from 'lucide-react';
import { ProductCalculator } from '@/components/layout/product-calculator';
import { BalmLabWorksheet } from './lab-worksheet';
import { BalmFormulaBuilder } from './formula-builder';
import { BalmChemistry } from './chemistry';

export default function BalmPage() {
  return (
    <ProductCalculator
      title="Tallow Balm Calculator"
      subtitle="Formulate skin balms with tallow, jojoba, beeswax, carrier oils, actives & EOs"
      icon={<FlaskConical size={24} />}
      accentColor="#6366f1"
      labContent={<BalmLabWorksheet />}
      builderContent={<BalmFormulaBuilder />}
      chemistryContent={<BalmChemistry />}
      defaultTab="builder"
    />
  );
}
