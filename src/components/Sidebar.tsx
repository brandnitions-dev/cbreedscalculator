'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⚡', href: '/' },
  { id: 'balm', label: 'Tallow Balm', icon: '🧴', href: '/balm' },
  { id: 'exfoliator', label: 'Exfoliator', icon: '✨', href: '/exfoliator' },
  { id: 'soap', label: 'Tallow Soap', icon: '🧼', href: '/soap', badge: 'NEW' },
  { id: 'builder', label: 'Formula Builder', icon: '🔬', href: '/builder' },
  { id: 'formulas', label: 'Saved Formulas', icon: '📁', href: '/formulas' },
  { id: 'admin', label: 'Admin', icon: '⚙️', href: '/admin' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <span className="sidebar__logo-icon">👑</span>
            {!collapsed && <span className="sidebar__logo-text">Crown Breeds</span>}
          </div>
          <button
            className="sidebar__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <div className="sidebar__nav-label">{!collapsed && 'CALCULATORS'}</div>
          {NAV_ITEMS.slice(0, 5).map(item => (
            <Link
              key={item.id}
              href={item.href}
              className={`sidebar__link ${pathname === item.href ? 'sidebar__link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="sidebar__link-label">{item.label}</span>
                  {item.badge && <span className="sidebar__badge">{item.badge}</span>}
                </>
              )}
            </Link>
          ))}

          <div className="sidebar__divider" />
          <div className="sidebar__nav-label">{!collapsed && 'MANAGE'}</div>
          {NAV_ITEMS.slice(5).map(item => (
            <Link
              key={item.id}
              href={item.href}
              className={`sidebar__link ${pathname === item.href ? 'sidebar__link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          {!collapsed && (
            <div className="sidebar__version">
              <span className="sidebar__version-dot" />
              v2.0 Professional
            </div>
          )}
        </div>

        <style jsx>{`
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: var(--sidebar-width);
            background: var(--gradient-sidebar);
            border-right: 1px solid var(--border-subtle);
            display: flex;
            flex-direction: column;
            z-index: var(--z-sidebar);
            transition: width var(--duration-normal) var(--ease-out),
                        transform var(--duration-normal) var(--ease-out);
            overflow: hidden;
          }
          .sidebar--collapsed {
            width: var(--sidebar-collapsed);
          }
          .sidebar__brand {
            padding: 20px 16px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border-subtle);
            min-height: var(--topbar-height);
          }
          .sidebar__logo {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
          }
          .sidebar__logo-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
          }
          .sidebar__logo-text {
            font-size: 1rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            white-space: nowrap;
          }
          .sidebar__collapse-btn {
            background: none;
            border: none;
            color: var(--text-tertiary);
            cursor: pointer;
            padding: 6px;
            border-radius: var(--radius-xs);
            font-size: 0.875rem;
            transition: color var(--duration-fast), background var(--duration-fast);
            flex-shrink: 0;
          }
          .sidebar__collapse-btn:hover {
            color: var(--text-primary);
            background: rgba(255,255,255,0.05);
          }
          .sidebar__nav {
            flex: 1;
            overflow-y: auto;
            padding: 12px 10px;
          }
          .sidebar__nav-label {
            font-size: 0.5625rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--text-muted);
            padding: 8px 10px 6px;
            min-height: 28px;
          }
          .sidebar__link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: var(--radius-sm);
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.8125rem;
            font-weight: 500;
            transition: all var(--duration-fast) var(--ease-out);
            margin-bottom: 2px;
            position: relative;
            min-height: 44px;
          }
          .sidebar__link:hover {
            color: var(--text-primary);
            background: rgba(255,255,255,0.04);
          }
          .sidebar__link--active {
            color: var(--text-primary);
            background: rgba(99,102,241,0.12);
          }
          .sidebar__link--active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            bottom: 8px;
            width: 3px;
            border-radius: 0 3px 3px 0;
            background: var(--accent-indigo);
          }
          .sidebar__link-icon {
            font-size: 1.125rem;
            flex-shrink: 0;
            width: 28px;
            text-align: center;
          }
          .sidebar__link-label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .sidebar__badge {
            margin-left: auto;
            font-size: 0.5625rem;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: var(--radius-full);
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #000;
            letter-spacing: 0.06em;
          }
          .sidebar__divider {
            height: 1px;
            background: var(--border-subtle);
            margin: 8px 12px;
          }
          .sidebar__footer {
            padding: 16px;
            border-top: 1px solid var(--border-subtle);
          }
          .sidebar__version {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.6875rem;
            color: var(--text-muted);
          }
          .sidebar__version-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent-emerald);
            animation: pulse-glow 2s infinite;
          }

          /* Mobile */
          .sidebar-mobile-toggle {
            display: none;
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 120;
            background: var(--bg-card-solid);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-sm);
            padding: 10px;
            cursor: pointer;
            flex-direction: column;
            gap: 4px;
            min-width: 44px;
            min-height: 44px;
            align-items: center;
            justify-content: center;
          }
          .hamburger-line {
            display: block;
            width: 18px;
            height: 2px;
            background: var(--text-primary);
            border-radius: 1px;
          }
          .sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 90;
          }

          @media (max-width: 768px) {
            .sidebar {
              transform: translateX(-100%);
            }
            .sidebar--open {
              transform: translateX(0);
            }
            .sidebar-mobile-toggle {
              display: flex;
            }
            .sidebar-overlay {
              display: block;
            }
            .sidebar__collapse-btn {
              display: none;
            }
          }
        `}</style>
      </aside>
    </>
  );
}
