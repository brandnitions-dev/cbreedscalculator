'use client';

import { GlassCard } from '@/components/ui';
import { ClipboardList, Thermometer, Clock, AlertTriangle } from 'lucide-react';

export function BalmLabWorksheet() {
  return (
    <div className="space-y-5">
      {/* Setup Checklist */}
      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <ClipboardList size={16} className="text-accent-indigo-light" /> Lab Setup Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Double boiler / hot water bath',
            'Digital scale (0.1g precision)',
            'Glass stirring rod',
            'IR thermometer or candy thermometer',
            'Clean glass measuring cups',
            'Silicone spatula',
            'Tins / jars pre-cleaned',
            'Labels + batch record sheet',
            'Nitrile gloves',
            'Paper towels + isopropyl alcohol',
          ].map(item => (
            <label key={item} className="flex items-center gap-2.5 text-[13px] text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-accent-indigo rounded" />
              {item}
            </label>
          ))}
        </div>
      </GlassCard>

      {/* Temperature Protocol */}
      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <Thermometer size={16} className="text-accent-rose" /> Temperature Protocol
        </h3>
        <div className="space-y-3">
          {[
            { temp: '140°F / 60°C', label: 'Melt Phase', desc: 'Melt tallow + beeswax in double boiler. Stir until fully liquid and clear.', color: '#f43f5e' },
            { temp: '130°F / 54°C', label: 'Carrier Oil Phase', desc: 'Add jojoba and carrier oils (A). Stir until uniform and combined.', color: '#f59e0b' },
            { temp: '110°F / 43°C', label: 'Active Phase', desc: 'Remove from heat. Add active botanicals (B) and vitamin E. Stir gently.', color: '#10b981' },
            { temp: '100°F / 38°C', label: 'Essential Oil Phase', desc: 'Add essential oils last at this temp to preserve volatile compounds.', color: '#6366f1' },
            { temp: '95°F / 35°C', label: 'Pour Point', desc: 'Pour into jars immediately. Tap to remove air bubbles. Cap once cool.', color: '#38bdf8' },
          ].map(step => (
            <div key={step.label} className="flex gap-3 items-start p-3 rounded-sm bg-surface-elevated/40 border border-border-subtle">
              <div className="text-center shrink-0 w-16">
                <div className="text-sm font-black" style={{ color: step.color }}>{step.temp.split(' / ')[0]}</div>
                <div className="text-[9px] text-text-muted">{step.temp.split(' / ')[1]}</div>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-text-primary">{step.label}</div>
                <div className="text-[12px] text-text-secondary mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Batch Record */}
      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <Clock size={16} className="text-accent-gold" /> Batch Record Template
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {['Batch #', 'Date', 'Operator', 'Batch Size (ml)'].map(field => (
            <div key={field}>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">{field}</label>
              <input type="text" className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-accent-indigo/50 focus:outline-none" placeholder={field} />
            </div>
          ))}
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">Notes</label>
          <textarea className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-accent-indigo/50 focus:outline-none min-h-[80px] resize-y" placeholder="Observations, adjustments, issues..." />
        </div>
      </GlassCard>

      {/* Shelf Life */}
      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-3">
          <AlertTriangle size={16} className="text-accent-gold" /> Shelf Life & Storage
        </h3>
        <div className="space-y-2 text-[13px] text-text-secondary leading-relaxed">
          <p><strong className="text-text-primary">Shelf life:</strong> 6–12 months depending on carrier oil stability. Sea buckthorn, hemp, and evening primrose shorten shelf life.</p>
          <p><strong className="text-text-primary">Storage:</strong> Cool, dark place. Avoid direct sunlight. Vitamin E (0.4%) acts as antioxidant preservative.</p>
          <p><strong className="text-text-primary">Signs of rancidity:</strong> Off smell (crayon/paint), change in color, separation. Discard if any appear.</p>
        </div>
      </GlassCard>
    </div>
  );
}
