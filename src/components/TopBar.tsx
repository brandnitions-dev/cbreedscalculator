'use client';

import { usePathname } from 'next/navigation';
import { Leaf } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/balm': 'Tallow Balm Calculator',
  '/exfoliator': 'Exfoliator Calculator',
  '/oils': 'Treatment Oils Calculator',
  '/cleaner': 'Face Cleaner Calculator',
  '/soap': 'Tallow Soap Calculator',
  '/builder': 'Formula Builder',
  '/formulas': 'Saved Formulas',
  '/admin': 'Admin Panel',
  '/login': 'Sign In',
};

export default function TopBar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'MOSSKYN LAB';

  return (
    <header className="sticky top-0 z-[110] h-16 bg-surface-sidebar/85 backdrop-blur-xl border-b border-border-subtle">
      <div className="flex items-center justify-between h-full px-8 max-w-[1400px] mx-auto max-md:px-4 max-md:pl-[60px]">
        <h1 className="text-lg font-bold tracking-tight text-text-primary">{title}</h1>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-emerald/[0.08] border border-accent-emerald/[0.15]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-semibold text-accent-emerald-light tracking-wide">Lab Ready</span>
          </div>
          <button
            className="w-10 h-10 rounded-full border-2 border-border bg-surface-card flex items-center justify-center cursor-pointer transition-all hover:border-accent-gold hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            aria-label="User menu"
          >
            <Leaf size={18} className="text-accent-emerald-light" />
          </button>
        </div>
      </div>
    </header>
  );
}
