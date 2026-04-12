import Link from 'next/link';
import { FlaskConical, Sparkles, Droplets, Beaker, SprayCan, Leaf, TestTubes, Microscope, Atom } from 'lucide-react';
import { GlassCard, Badge } from '@/components/ui';
import type { ReactNode } from 'react';

interface Product {
  id: string;
  title: string;
  icon: ReactNode;
  href: string;
  desc: string;
  stats: { label: string; value: string }[];
  badge?: string;
  accent: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'balm',
    title: 'Tallow Balm',
    icon: <FlaskConical size={28} />,
    href: '/balm',
    accent: '#6366f1',
    desc: 'Classic tallow skin balm with jojoba, beeswax, carrier oils (A), active botanicals (B), and essential oils. Face & body modes.',
    stats: [
      { label: 'Base', value: '58% Tallow' },
      { label: 'Carriers', value: '22 oils' },
      { label: 'Actives', value: '15 botanicals' },
    ],
  },
  {
    id: 'cleaner',
    title: 'Face Cleaner',
    icon: <SprayCan size={28} />,
    href: '/cleaner',
    accent: '#10b981',
    desc: 'Tallow-based exfoliating scrub with physical polish phase (C). Sugar, coffee, oat, clay, walnut — with oil absorption chemistry.',
    stats: [
      { label: 'C Phase', value: '5–15%' },
      { label: 'Exfoliants', value: '6 types' },
      { label: 'Oil Tax', value: 'Auto-calc' },
    ],
  },
  {
    id: 'exfoliator',
    title: 'Exfoliator',
    icon: <Sparkles size={28} />,
    href: '/exfoliator',
    accent: '#f59e0b',
    desc: 'BHA penetrating oils & clinical pore purge blends. Jojoba sebum mimicry, wintergreen BHA delivery, and extraction chemistry.',
    stats: [
      { label: 'Carriers', value: '8 oils' },
      { label: 'Actives', value: '4 compounds' },
      { label: 'EOs', value: '7 oils' },
    ],
  },
  {
    id: 'soap',
    title: 'Tallow Soap',
    icon: <Beaker size={28} />,
    href: '/soap',
    accent: '#10b981',
    desc: 'Cold-process tallow soap with olive oil carrier, real NaOH lye calculations, superfat control, bar quality indices, and cure estimation.',
    stats: [
      { label: 'Base', value: '55% Tallow' },
      { label: 'Carrier', value: '25% Olive' },
      { label: 'SAP Values', value: '12 oils' },
    ],
  },
];

const QUICK_STATS = [
  { label: 'Essential Oils', value: '35+', icon: <Leaf size={20} />, color: 'text-accent-emerald-light' },
  { label: 'Carrier Oils', value: '30+', icon: <Droplets size={20} />, color: 'text-accent-sky' },
  { label: 'Active Botanicals', value: '19', icon: <Microscope size={20} />, color: 'text-accent-violet' },
  { label: 'Product Types', value: '4', icon: <TestTubes size={20} />, color: 'text-accent-gold-light' },
];

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Hero */}
      <section>
        <p className="text-[11px] font-bold uppercase tracking-widest text-accent-gold mb-2">Crown Breeds Professional</p>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3">
          Formulation <span className="bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-gold bg-clip-text text-transparent">Command Center</span>
        </h1>
        <p className="text-text-secondary max-w-xl leading-relaxed">
          Professional-grade calculators for tallow-based skincare, treatment oils, and cold-process soap. Real chemistry. Precise measurements. Beautiful products.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_STATS.map(stat => (
          <GlassCard key={stat.label} className="flex flex-col items-center text-center gap-2 py-5">
            <div className={stat.color}>{stat.icon}</div>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{stat.label}</div>
          </GlassCard>
        ))}
      </section>

      {/* Product Cards */}
      <section>
        <h2 className="text-lg font-bold mb-5">Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRODUCTS.map(product => (
            <Link key={product.id} href={product.href} className="no-underline group">
              <GlassCard interactive className="h-full flex flex-col">
                <div className="flex gap-4 items-start mb-5">
                  <div
                    className="w-12 h-12 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `${product.accent}20`, color: product.accent }}
                  >
                    {product.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-text-primary">{product.title}</h3>
                      {product.badge && <Badge variant="gold">{product.badge}</Badge>}
                    </div>
                    <p className="text-[13px] text-text-secondary mt-1 leading-relaxed">{product.desc}</p>
                  </div>
                </div>

                <div className="flex gap-6 py-4 border-t border-b border-border-subtle mt-auto">
                  {product.stats.map(stat => (
                    <div key={stat.label}>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{stat.label}</div>
                      <div className="text-sm font-bold text-text-primary mt-0.5">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 text-[13px] font-semibold text-accent-indigo-light group-hover:text-accent-violet transition-colors">
                  Open Calculator →
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Reference */}
      <section>
        <h2 className="text-lg font-bold mb-5">Quick Reference</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <GlassCard>
            <h3 className="flex items-center gap-2 text-sm font-bold mb-3">
              <FlaskConical size={16} className="text-accent-indigo-light" /> Balm Base Formula
            </h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-1.5 text-text-muted font-semibold">Ingredient</th>
                  <th className="text-right py-1.5 text-text-muted font-semibold">%</th>
                  <th className="text-left py-1.5 pl-4 text-text-muted font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {[
                  ['Beef Tallow', '58%', 'Base emollient'],
                  ['Carrier Oil (A)', '13%', 'Therapeutic carrier'],
                  ['Jojoba', '11%', 'Wax ester / sebum mimic'],
                  ['Beeswax', '8%', 'Structure / barrier'],
                  ['Active Oil (B)', '6%', 'Potent botanical'],
                  ['Essential Oils', '1-2%', 'Scent / therapy'],
                  ['Vitamin E', '0.4%', 'Antioxidant preservative'],
                ].map(([name, pct, role]) => (
                  <tr key={name} className="border-b border-border-subtle/50">
                    <td className="py-1.5">{name}</td>
                    <td className="py-1.5 text-right font-medium text-text-primary">{pct}</td>
                    <td className="py-1.5 pl-4 text-text-muted">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>

          <GlassCard>
            <h3 className="flex items-center gap-2 text-sm font-bold mb-3">
              <Beaker size={16} className="text-accent-emerald" /> Soap Base Formula
            </h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-1.5 text-text-muted font-semibold">Oil</th>
                  <th className="text-right py-1.5 text-text-muted font-semibold">%</th>
                  <th className="text-right py-1.5 text-text-muted font-semibold">SAP (NaOH)</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {[
                  ['Beef Tallow', '55%', '0.1405'],
                  ['Olive Oil', '25%', '0.1340'],
                  ['Coconut Oil', '10%', '0.1787'],
                  ['Castor Oil', '5%', '0.1286'],
                  ['Beeswax', '3%', '0.0694'],
                  ['Shea Butter', '2%', '0.1280'],
                ].map(([name, pct, sap]) => (
                  <tr key={name} className="border-b border-border-subtle/50">
                    <td className="py-1.5">{name}</td>
                    <td className="py-1.5 text-right font-medium text-text-primary">{pct}</td>
                    <td className="py-1.5 text-right font-mono text-text-muted">{sap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
