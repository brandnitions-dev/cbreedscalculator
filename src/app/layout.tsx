import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export const metadata: Metadata = {
  title: 'Crown Breeds — Professional Formulation Platform',
  description: 'Professional tallow-based skincare and soap formulation calculators. Tallow balm, exfoliator, and cold-process soap with real saponification chemistry.',
  keywords: 'tallow balm, tallow soap, cold process soap calculator, saponification, essential oils, skincare formulation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <div className="app-main">
            <TopBar />
            <main className="app-content">
              {children}
            </main>
          </div>
        </div>
        <style>{`
          .app-shell {
            display: flex;
            min-height: 100vh;
          }
          .app-main {
            flex: 1;
            margin-left: var(--sidebar-width);
            min-width: 0;
            display: flex;
            flex-direction: column;
            transition: margin-left var(--duration-normal) var(--ease-out);
          }
          .app-content {
            flex: 1;
            position: relative;
            z-index: 1;
          }
          @media (max-width: 768px) {
            .app-main {
              margin-left: 0;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
