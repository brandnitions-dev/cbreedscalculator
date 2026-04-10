'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email, password, redirect: false,
      });
      if (res?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card glass-card animate-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>👑</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>
            <span className="text-gradient">Crown Breeds</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sign in to save formulas &amp; manage batches
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@crownbreeds.com" required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          {error && <div className="banner-error" style={{ marginBottom: 16 }}>{error}</div>}
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Calculators work without login. Sign in for save &amp; batch features.
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: calc(100vh - var(--topbar-height));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
        }
      `}</style>
    </div>
  );
}
