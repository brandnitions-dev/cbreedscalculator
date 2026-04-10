export default function SavedFormulas() {
  return (
    <div className="page-content">
      <section className="animate-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '2rem' }}>📁</span>
          <div>
            <h1>Saved Formulas</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Your saved balm, exfoliator, and soap formulations
            </p>
          </div>
        </div>
      </section>

      <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.4 }}>📁</div>
        <h2 style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>No saved formulas yet</h2>
        <p style={{ color: 'var(--text-tertiary)', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
          Sign in and create formulas in any calculator to save them here.
          Once connected to PostgreSQL, your formulas persist across sessions.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/balm" className="btn btn-primary">🧴 Balm Calculator</a>
          <a href="/exfoliator" className="btn btn-secondary">✨ Exfoliator</a>
          <a href="/soap" className="btn btn-secondary">🧼 Soap Calculator</a>
        </div>

        <div className="banner-info" style={{ marginTop: 32, textAlign: 'left', maxWidth: 480, margin: '32px auto 0' }}>
          <strong>Database setup required:</strong> Configure your <code>DATABASE_URL</code> in <code>.env.local</code>,
          then run <code>npx prisma db push</code> and <code>npm run db:seed</code> to initialize the database.
        </div>
      </div>
    </div>
  );
}
