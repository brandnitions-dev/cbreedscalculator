import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'MOSSKYN LAB — Professional Formulation Platform',
  description: 'Professional tallow-based skincare, treatment oils, and soap formulation calculators with real chemistry.',
  keywords: 'tallow balm, treatment oils, tallow soap, cold process soap calculator, saponification, essential oils, skincare formulation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark) || (theme === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-surface-root text-text-primary font-sans antialiased">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
