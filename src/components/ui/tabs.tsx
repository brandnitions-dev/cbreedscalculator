'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 rounded-md bg-surface-elevated/50 border border-border-subtle', className)} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'bg-accent-indigo/15 text-accent-indigo-light shadow-sm'
              : 'text-text-tertiary hover:text-text-secondary hover:bg-white/[0.03]'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, activeTab, children, className }: TabPanelProps) {
  if (id !== activeTab) return null;
  return (
    <div role="tabpanel" className={cn('animate-fade-in', className)}>
      {children}
    </div>
  );
}
