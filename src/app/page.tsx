import Link from 'next/link';

const PRODUCTS = [
  {
    id: 'balm',
    title: 'Tallow Balm',
    icon: '🧴',
    href: '/balm',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(167,139,250,0.08) 100%)',
    border: 'rgba(99,102,241,0.2)',
    desc: 'Classic tallow skin balm with jojoba, beeswax, carrier oils (A), active botanicals (B), and essential oils. Face & body modes.',
    stats: [
      { label: 'Base', value: '58% Tallow' },
      { label: 'Carriers', value: '22 oils' },
      { label: 'Actives', value: '15 botanicals' },
    ],
  },
  {
    id: 'exfoliator',
    title: 'Exfoliator / Scrub',
    icon: '✨',
    href: '/exfoliator',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(217,119,6,0.06) 100%)',
    border: 'rgba(245,158,11,0.2)',
    desc: 'Tallow-based exfoliating scrub with physical polish phase (C). Sugar, coffee, oat, clay, walnut — with oil absorption chemistry.',
    stats: [
      { label: 'C Phase', value: '5–15%' },
      { label: 'Exfoliants', value: '6 types' },
      { label: 'Oil Tax', value: 'Auto-calc' },
    ],
  },
  {
    id: 'soap',
    title: 'Tallow Soap',
    icon: '🧼',
    href: '/soap',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 100%)',
    border: 'rgba(16,185,129,0.2)',
    desc: 'Cold-process tallow soap with olive oil carrier, real NaOH lye calculations, superfat control, bar quality indices, and cure estimation.',
    stats: [
      { label: 'Base', value: '55% Tallow' },
      { label: 'Carrier', value: '25% Olive' },
      { label: 'SAP Values', value: '12 oils' },
    ],
    badge: 'NEW',
  },
];

const QUICK_STATS = [
  { label: 'Essential Oils', value: '35+', icon: '🌿', color: 'var(--accent-emerald)' },
  { label: 'Carrier Oils', value: '22', icon: '💧', color: 'var(--accent-sky)' },
  { label: 'Active Botanicals', value: '15', icon: '🔬', color: 'var(--accent-violet)' },
  { label: 'Soap Oils + Additives', value: '27', icon: '🧪', color: 'var(--accent-gold)' },
];

export default function Dashboard() {
  return (
    <div className="page-content">
      {/* Hero */}
      <section className="dash-hero animate-in">
        <div className="dash-hero__text">
          <p className="label-sm" style={{ color: 'var(--accent-gold)', marginBottom: 8 }}>CROWN BREEDS PROFESSIONAL</p>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: 12 }}>
            Formulation <span className="text-gradient">Command Center</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.7 }}>
            Professional-grade calculators for tallow-based skincare and cold-process soap.
            Real chemistry. Precise measurements. Beautiful products.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="dash-stats" style={{ animationDelay: '100ms' }}>
        {QUICK_STATS.map(stat => (
          <div key={stat.label} className="glass-card stat-card">
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{stat.icon}</div>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Product Cards */}
      <section style={{ marginTop: 32, animationDelay: '200ms' }} className="animate-in">
        <h2 style={{ marginBottom: 20 }}>Calculators</h2>
        <div className="dash-products">
          {PRODUCTS.map(product => (
            <Link key={product.id} href={product.href} style={{ textDecoration: 'none' }}>
              <div
                className="glass-card glass-card--interactive dash-product-card"
                style={{
                  background: product.gradient,
                  borderColor: product.border,
                }}
              >
                <div className="dash-product-header">
                  <span style={{ fontSize: '2rem' }}>{product.icon}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontSize: '1.125rem' }}>{product.title}</h3>
                      {product.badge && <span className="pill pill-gold">{product.badge}</span>}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.6 }}>
                      {product.desc}
                    </p>
                  </div>
                </div>
                <div className="dash-product-stats">
                  {product.stats.map(stat => (
                    <div key={stat.label} className="dash-product-stat">
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dash-product-cta">
                  Open Calculator →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Chemistry Reference */}
      <section style={{ marginTop: 32 }} className="animate-in">
        <h2 style={{ marginBottom: 20 }}>Quick Reference</h2>
        <div className="grid-2">
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🧴</span> Balm Base Formula
            </h3>
            <table className="data-table">
              <thead>
                <tr><th>Ingredient</th><th className="num">%</th><th>Role</th></tr>
              </thead>
              <tbody>
                <tr><td>Beef Tallow</td><td className="num">58%</td><td>Base emollient</td></tr>
                <tr><td>Carrier Oil (A)</td><td className="num">13%</td><td>Therapeutic carrier</td></tr>
                <tr><td>Jojoba</td><td className="num">11%</td><td>Wax ester / sebum mimic</td></tr>
                <tr><td>Beeswax</td><td className="num">8%</td><td>Structure / barrier</td></tr>
                <tr><td>Active Oil (B)</td><td className="num">6%</td><td>Potent botanical</td></tr>
                <tr><td>Essential Oils</td><td className="num">1–2%</td><td>Scent / therapy</td></tr>
                <tr><td>Vitamin E</td><td className="num">0.4%</td><td>Antioxidant preservative</td></tr>
              </tbody>
            </table>
          </div>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🧼</span> Soap Base Formula
            </h3>
            <table className="data-table">
              <thead>
                <tr><th>Oil</th><th className="num">%</th><th>SAP (NaOH)</th></tr>
              </thead>
              <tbody>
                <tr><td>Beef Tallow</td><td className="num">55%</td><td className="num">0.1405</td></tr>
                <tr><td>Olive Oil</td><td className="num">25%</td><td className="num">0.1340</td></tr>
                <tr><td>Coconut Oil</td><td className="num">10%</td><td className="num">0.1787</td></tr>
                <tr><td>Castor Oil</td><td className="num">5%</td><td className="num">0.1286</td></tr>
                <tr><td>Beeswax</td><td className="num">3%</td><td className="num">0.0694</td></tr>
                <tr><td>Shea Butter</td><td className="num">2%</td><td className="num">0.1280</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <style>{`
        .dash-hero {
          padding: 8px 0 24px;
        }
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          animation: fadeIn var(--duration-slow) var(--ease-out) forwards;
        }
        .dash-products {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 20px;
        }
        .dash-product-card {
          padding: 24px;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .dash-product-header {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .dash-product-stats {
          display: flex;
          gap: 24px;
          padding: 16px 0;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          margin-top: auto;
        }
        .dash-product-cta {
          padding-top: 16px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--accent-indigo-light);
          transition: color var(--duration-fast);
        }
        .dash-product-card:hover .dash-product-cta {
          color: var(--accent-violet);
        }
        @media (max-width: 768px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .dash-products { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .dash-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
