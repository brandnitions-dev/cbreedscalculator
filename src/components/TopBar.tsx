'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/balm': 'Tallow Balm Calculator',
  '/exfoliator': 'Exfoliator Calculator',
  '/soap': 'Tallow Soap Calculator',
  '/builder': 'Formula Builder',
  '/formulas': 'Saved Formulas',
  '/admin': 'Admin Panel',
  '/login': 'Sign In',
};

export default function TopBar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'Crown Breeds';

  return (
    <header className="topbar">
      <div className="topbar__content">
        <div className="topbar__left">
          <h1 className="topbar__title">{title}</h1>
        </div>
        <div className="topbar__right">
          <div className="topbar__status">
            <span className="topbar__status-dot" />
            <span className="topbar__status-text">Lab Ready</span>
          </div>
          <button className="topbar__avatar" aria-label="User menu">
            👑
          </button>
        </div>
      </div>

      <style jsx>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: var(--z-topbar);
          height: var(--topbar-height);
          background: var(--bg-topbar);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .topbar__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 32px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .topbar__title {
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }
        .topbar__right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .topbar__status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.15);
        }
        .topbar__status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-emerald);
          box-shadow: 0 0 8px rgba(16,185,129,0.5);
        }
        .topbar__status-text {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--accent-emerald-light);
          letter-spacing: 0.04em;
        }
        .topbar__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--border-default);
          background: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          cursor: pointer;
          transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
        }
        .topbar__avatar:hover {
          border-color: var(--accent-gold);
          box-shadow: 0 0 12px rgba(245,158,11,0.2);
        }

        @media (max-width: 768px) {
          .topbar__content {
            padding: 0 16px 0 60px;
          }
          .topbar__status {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
