'use client';

import { GlassCard } from '@/components/ui';
import { ClipboardList, Thermometer, Clock, AlertTriangle } from 'lucide-react';

export function CleanerLabWorksheet() {
  return (
    <div className="space-y-5">
      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <ClipboardList size={16} className="text-accent-emerald-light" /> Lab Setup Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Double boiler / hot water bath',
            'Digital scale (0.1g precision)',
            'Glass stirring rod + silicone spatula',
            'IR thermometer',
            'Exfoliant measured + ready (C-phase)',
            'Glass measuring cups',
            'Tins / jars pre-cleaned',
            'Labels + batch record sheet',
            'Nitrile gloves',
            'Paper towels + isopropyl alcohol',
          ].map(item => (
            <label key={item} className="flex items-center gap-2.5 text-[13px] text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-accent-emerald rounded" />
              {item}
            </label>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <Thermometer size={16} className="text-accent-rose" /> Temperature Protocol
        </h3>
        <div className="space-y-3">
          {[
            { temp: '140°F / 60°C', label: 'Melt Phase', desc: 'Melt tallow + beeswax in double boiler until fully liquid.', color: '#f43f5e' },
            { temp: '130°F / 54°C', label: 'Carrier Oil Phase', desc: 'Add jojoba and carrier oils (A). Stir until uniform.', color: '#f59e0b' },
            { temp: '110°F / 43°C', label: 'Active Phase', desc: 'Remove from heat. Add active botanicals (B) and vitamin E.', color: '#10b981' },
            { temp: '100°F / 38°C', label: 'Essential Oil Phase', desc: 'Add essential oils. Stir gently to preserve volatiles.', color: '#6366f1' },
            { temp: '95°F / 35°C', label: 'C-Phase Fold', desc: 'Fold in exfoliant last — stir to suspend evenly. Do NOT overmix.', color: '#C4A574' },
            { temp: 'Immediate', label: 'Pour & Tap', desc: 'Pour into jars immediately. Tap to settle and remove air. Cap once cool.', color: '#38bdf8' },
          ].map(step => (
            <div key={step.label} className="flex gap-3 items-start p-3 rounded-sm bg-surface-elevated/40 border border-border-subtle">
              <div className="text-center shrink-0 w-16">
                <div className="text-sm font-black" style={{ color: step.color }}>{step.temp.split(' / ')[0]}</div>
                {step.temp.includes('/') && <div className="text-[9px] text-text-muted">{step.temp.split(' / ')[1]}</div>}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-text-primary">{step.label}</div>
                <div className="text-[12px] text-text-secondary mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <Clock size={16} className="text-accent-gold" /> Batch Record Template
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {['Batch #', 'Date', 'Operator', 'Batch Size (ml)'].map(field => (
            <div key={field}>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">{field}</label>
              <input type="text" className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-accent-emerald/50 focus:outline-none" placeholder={field} />
            </div>
          ))}
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">Notes</label>
          <textarea className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-accent-emerald/50 focus:outline-none min-h-[80px] resize-y" placeholder="Observations, adjustments, C-phase suspension quality..." />
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-3">
          <AlertTriangle size={16} className="text-accent-gold" /> C-Phase Notes
        </h3>
        <div className="space-y-2 text-[13px] text-text-secondary leading-relaxed">
          <p><strong className="text-text-primary">Sugar</strong> dissolves on damp skin — gentlest option. Won&apos;t over-strip.</p>
          <p><strong className="text-text-primary">Coffee</strong> provides antioxidant boost + medium grit. Best for body.</p>
          <p><strong className="text-text-primary">Oat flour</strong> is FDA-recognized skin protectant. Face-safe, eczema-friendly.</p>
          <p><strong className="text-text-primary">Clay</strong> draws impurities — mild polish drag without physical grit.</p>
          <p><strong className="text-text-primary">Walnut/apricot shell</strong> can micro-scratch if coarsely ground. Body only.</p>
          <p><strong className="text-text-primary">Baking soda</strong> may shift pH — patch test. Keep under 8% for face.</p>
        </div>
      </GlassCard>
    </div>
  );
}
