export default function AdminPanel() {
  return (
    <div className="page-content">
      <section className="animate-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '2rem' }}>⚙️</span>
          <div>
            <h1>Admin Panel</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Manage ingredients, users, and system settings
            </p>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Ingredient Stats */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Ingredient Database</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-sky)' }}>22</div>
              <div className="stat-label">Carrier Oils (A)</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-rose)' }}>15</div>
              <div className="stat-label">Active Oils (B)</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>6</div>
              <div className="stat-label">Exfoliants (C)</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-violet)' }}>35+</div>
              <div className="stat-label">Essential Oils</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)' }}>12</div>
              <div className="stat-label">Soap Oils</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-indigo-light)' }}>15</div>
              <div className="stat-label">Soap Additives</div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)' }}>
              <span style={{ fontSize: '0.8125rem' }}>Database</span>
              <span className="pill pill-emerald">Configure in .env</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)' }}>
              <span style={{ fontSize: '0.8125rem' }}>Authentication</span>
              <span className="pill pill-emerald">NextAuth Ready</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)' }}>
              <span style={{ fontSize: '0.8125rem' }}>Calculators</span>
              <span className="pill pill-emerald">3 Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)' }}>
              <span style={{ fontSize: '0.8125rem' }}>Platform Version</span>
              <span className="pill pill-indigo">v2.0 Professional</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Setup Guide</h3>
          <ol style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Configure <code style={{ color: 'var(--accent-gold)' }}>DATABASE_URL</code> in <code>.env.local</code></li>
            <li>Run <code style={{ color: 'var(--accent-indigo-light)' }}>npx prisma db push</code></li>
            <li>Run <code style={{ color: 'var(--accent-indigo-light)' }}>npm run db:seed</code></li>
            <li>Login at <a href="/login">/login</a> with seeded admin credentials</li>
            <li>Start creating and saving formulas</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
