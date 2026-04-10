'use client';

import { useState, useMemo, useCallback } from 'react';
import { Droplets } from 'lucide-react';
import { ProductCalculator } from '@/components/layout/product-calculator';
import { OilLabWorksheet } from './lab-worksheet';
import { OilFormulaBuilder } from './formula-builder';
import { OilChemistry } from './chemistry';

export default function TreatmentOilsPage() {
  return (
    <ProductCalculator
      title="Treatment Oils Calculator"
      subtitle="BHA penetrating oils and clinical pore purge blends with real extraction chemistry."
      icon={<Droplets size={24} />}
      accentColor="#5DCAA5"
      labContent={<OilLabWorksheet />}
      builderContent={<OilFormulaBuilder />}
      chemistryContent={<OilChemistry />}
      defaultTab="lab"
    />
  );
}
