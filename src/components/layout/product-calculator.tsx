'use client';

import { useState, type ReactNode } from 'react';
import { Tabs, TabPanel } from '@/components/ui';
import { FlaskConical, Beaker, Atom } from 'lucide-react';

interface ProductCalculatorProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accentColor: string;
  labContent: ReactNode;
  builderContent: ReactNode;
  chemistryContent: ReactNode;
  defaultTab?: string;
}

const TABS = [
  { id: 'lab', label: 'Lab Worksheet', icon: <FlaskConical size={16} /> },
  { id: 'builder', label: 'Formula Builder', icon: <Beaker size={16} /> },
  { id: 'chemistry', label: 'Skin Chemistry', icon: <Atom size={16} /> },
];

export function ProductCalculator({
  title, subtitle, icon, accentColor,
  labContent, builderContent, chemistryContent,
  defaultTab = 'lab',
}: ProductCalculatorProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="min-h-0 flex flex-col gap-5 p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-md flex items-center justify-center text-xl"
          style={{ background: `${accentColor}20`, color: accentColor }}
        >
          {icon}
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          <p className="text-sm text-text-secondary">{subtitle}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Panels */}
      <TabPanel id="lab" activeTab={activeTab}>
        {labContent}
      </TabPanel>
      <TabPanel id="builder" activeTab={activeTab}>
        {builderContent}
      </TabPanel>
      <TabPanel id="chemistry" activeTab={activeTab}>
        {chemistryContent}
      </TabPanel>
    </div>
  );
}
