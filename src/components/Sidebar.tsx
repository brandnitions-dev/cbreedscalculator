'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, FlaskConical, Sparkles,
  Beaker, Settings, Crown,
  PanelLeftClose, PanelLeft, Menu, SprayCan,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/' },
  { id: 'balm', label: 'Tallow Balm', icon: <FlaskConical size={18} />, href: '/balm' },
  { id: 'cleaner', label: 'Face Cleaner', icon: <SprayCan size={18} />, href: '/cleaner' },
  { id: 'exfoliator', label: 'Exfoliator', icon: <Sparkles size={18} />, href: '/exfoliator' },
  { id: 'soap', label: 'Tallow Soap', icon: <Beaker size={18} />, href: '/soap' },
  { id: 'admin', label: 'Admin', icon: <Settings size={18} />, href: '/admin' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-[120] hidden md:hidden bg-surface-card-solid border border-border rounded-sm p-2.5 cursor-pointer flex-col gap-1 items-center justify-center min-w-[44px] min-h-[44px] mobile-only-flex"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <Menu size={18} className="text-text-primary" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 bottom-0 flex flex-col z-[100] border-r border-border-subtle overflow-hidden transition-all duration-300',
        'bg-surface-sidebar',
        collapsed ? 'w-[72px]' : 'w-[260px]',
        'max-md:-translate-x-full',
        mobileOpen && 'max-md:translate-x-0',
      )}>
        {/* Brand */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-border-subtle min-h-[64px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Crown size={24} className="text-accent-gold shrink-0" />
            {!collapsed && (
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-accent-gold to-accent-gold-light bg-clip-text text-transparent whitespace-nowrap">
                Crown Breeds
              </span>
            )}
          </div>
          <button
            className="hidden md:flex p-1.5 rounded-xs text-text-tertiary hover:text-text-primary hover:bg-white/5 transition-colors shrink-0"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-text-muted px-2.5 py-1.5 min-h-[28px]">
            {!collapsed && 'CALCULATORS'}
          </div>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13px] font-medium transition-all duration-150 mb-0.5 relative min-h-[44px] no-underline',
                isActive(item.href)
                  ? 'text-text-primary bg-accent-indigo/[0.12]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {isActive(item.href) && (
                <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-accent-indigo" />
              )}
              <span className="shrink-0 w-7 flex justify-center">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-accent-gold to-yellow-600 text-text-inverse tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border-subtle space-y-3">
          {!collapsed && <ThemeToggle />}
          {!collapsed && (
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse-glow" />
              v3.0 Professional
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
