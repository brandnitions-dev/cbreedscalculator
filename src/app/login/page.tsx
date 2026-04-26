'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Atom, LockKeyhole, ShieldCheck } from 'lucide-react';

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
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError('Invalid email or password');
      } else {
        const params = new URLSearchParams(window.location.search);
        router.push(params.get('callbackUrl') || '/');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-orb login-bg-orb-a" />
      <div className="login-bg-orb login-bg-orb-b" />

      <section className="login-brand-panel animate-in">
        <div className="brand-mark">
          <Atom size={30} />
        </div>
        <p className="login-eyebrow">Private formulation OS</p>
        <h1>MOSSKYN LAB</h1>
        <p className="login-copy">
          Secure access for formula development, ingredient library management,
          production worksheets, and lab-grade calculators.
        </p>
        <div className="login-assurance">
          <div><ShieldCheck size={16} /> Ingredient database connected</div>
          <div><LockKeyhole size={16} /> Protected workspace entry</div>
        </div>
      </section>

      <div className="login-card glass-card animate-in">
        <div className="login-card-head">
          <p className="login-eyebrow">Authorized access</p>
          <h2>Sign in to enter</h2>
          <p>Use your lab admin account to access MOSSKYN LAB.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@mosskynlab.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="banner-error" style={{ marginBottom: 16 }}>{error}</div>}
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Enter Lab'}
          </button>
        </form>

        <div className="login-footnote">
          The platform is private. All calculators and admin tools require authentication.
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(360px, 460px);
          align-items: center;
          justify-content: center;
          gap: 48px;
          padding: 48px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 16%, rgba(93,202,165,0.16), transparent 30%),
            radial-gradient(circle at 78% 78%, rgba(245,158,11,0.12), transparent 32%),
            var(--surface-root);
        }
        .login-bg-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(8px);
          opacity: 0.4;
          pointer-events: none;
        }
        .login-bg-orb-a {
          width: 340px;
          height: 340px;
          left: -110px;
          bottom: -130px;
          border: 1px solid rgba(93,202,165,0.28);
        }
        .login-bg-orb-b {
          width: 220px;
          height: 220px;
          right: 9%;
          top: 11%;
          border: 1px solid rgba(245,158,11,0.24);
        }
        .login-brand-panel {
          max-width: 680px;
          position: relative;
          z-index: 1;
        }
        .brand-mark {
          width: 64px;
          height: 64px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-emerald-light);
          border: 1px solid rgba(93,202,165,0.32);
          background: rgba(93,202,165,0.1);
          box-shadow: 0 0 40px rgba(93,202,165,0.12);
          margin-bottom: 24px;
        }
        .login-eyebrow {
          margin: 0 0 10px;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent-gold-light);
        }
        .login-brand-panel h1 {
          margin: 0;
          font-size: clamp(3rem, 8vw, 6.6rem);
          line-height: 0.88;
          letter-spacing: -0.08em;
          font-weight: 950;
          background: linear-gradient(135deg, var(--text-primary), var(--accent-emerald-light), var(--accent-gold-light));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .login-copy {
          max-width: 560px;
          margin: 24px 0 0;
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.75;
        }
        .login-assurance {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 700;
        }
        .login-assurance div {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border-subtle);
          background: var(--surface-card);
          border-radius: 999px;
          padding: 9px 12px;
        }
        .login-card {
          width: 100%;
          padding: 40px;
          position: relative;
          z-index: 1;
          box-shadow: var(--shadow-lg), 0 0 44px rgba(93,202,165,0.08);
        }
        .login-card-head {
          margin-bottom: 28px;
        }
        .login-card-head h2 {
          margin: 0 0 8px;
          font-size: 1.45rem;
          font-weight: 900;
          color: var(--text-primary);
        }
        .login-card-head p:last-child {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.55;
        }
        .login-footnote {
          text-align: center;
          margin-top: 24px;
          font-size: 0.75rem;
          line-height: 1.6;
          color: var(--text-muted);
        }
        @media (max-width: 900px) {
          .login-page {
            grid-template-columns: 1fr;
            padding: 28px;
          }
          .login-brand-panel h1 {
            font-size: clamp(2.6rem, 15vw, 4.5rem);
          }
        }
      `}</style>
    </div>
  );
}

