import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export const metadata: Metadata = {
  title: 'Crown Breeds — Professional Formulation Platform',
  description: 'Professional tallow-based skincare, treatment oils, and soap formulation calculators with real chemistry.',
  keywords: 'tallow balm, treatment oils, tallow soap, cold process soap calculator, saponification, essential oils, skincare formulation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-root text-text-primary font-sans antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-[260px] min-w-0 flex flex-col transition-all duration-300 max-md:ml-0">
            <TopBar />
            <main className="flex-1 relative z-[1]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
