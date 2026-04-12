'use client';

import { GlassCard } from '@/components/ui';
import { ClipboardList, Thermometer, Clock, AlertTriangle } from 'lucide-react';

export function ExfoliatorLabWorksheet() {
  return (
    <div className="space-y-5">
      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <ClipboardList size={16} className="text-accent-gold" /> Lab Setup Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Glass dropper bottles (30ml amber)',
            'Digital scale (0.01g precision)',
            'Glass beakers (50ml)',
            'Disposable pipettes',
            'Carrier oils measured to formula',
            'Active compounds ready',
            'Essential oils ready',
            'Labels + batch record sheet',
            'Nitrile gloves',
            'Warm towel / steam setup for testing',
          ].map(item => (
            <label key={item} className="flex items-center gap-2.5 text-[13px] text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-accent-gold rounded" />
              {item}
            </label>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <Thermometer size={16} className="text-accent-emerald" /> Formulation Protocol
        </h3>
        <div className="space-y-3">
          {[
            { step: '1', label: 'Measure Carriers', desc: 'Pour carrier oils into clean glass beaker using pipette. Jojoba first as base solvent.', color: '#5DCAA5' },
            { step: '2', label: 'Add Actives', desc: 'Add alpha-bisabolol and any other active compounds. Swirl gently to dissolve.', color: '#FCD34D' },
            { step: '3', label: 'Add Essential Oils', desc: 'Add EOs last — cap beaker and invert 10x to mix. Do not shake vigorously.', color: '#C4B5FD' },
            { step: '4', label: 'Transfer', desc: 'Pour into amber dropper bottle using funnel. Fill to shoulder — leave headspace.', color: '#85B7EB' },
            { step: '5', label: 'Label', desc: 'Record: formula name, date, batch #, ingredient list, shelf life (6 months).', color: '#D85A30' },
            { step: '6', label: 'Patch Test', desc: 'Apply 2 drops to inner forearm. Wait 24h. Check for redness/irritation before facial use.', color: '#f43f5e' },
          ].map(s => (
            <div key={s.step} className="flex gap-3 items-start p-3 rounded-sm bg-surface-elevated/40 border border-border-subtle">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-black text-white" style={{ background: s.color }}>{s.step}</div>
              <div>
                <div className="text-[13px] font-semibold text-text-primary">{s.label}</div>
                <div className="text-[12px] text-text-secondary mt-0.5">{s.desc}</div>
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
              <input type="text" className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none" placeholder={field} />
            </div>
          ))}
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">Notes</label>
          <textarea className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none min-h-[80px] resize-y" placeholder="Observations, viscosity, scent profile, skin reaction..." />
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-3">
          <AlertTriangle size={16} className="text-accent-rose" /> Safety Warnings
        </h3>
        <div className="space-y-2 text-[13px] text-text-secondary leading-relaxed">
          <p><strong className="text-accent-rose">Wintergreen EO</strong> contains methyl salicylate (98%). 1 tsp = ~7g aspirin equivalent. Never exceed 3% in formula. Keep away from children.</p>
          <p><strong className="text-accent-rose">BHA sensitivity</strong>: This formula increases photosensitivity. Always use SPF 30+ after treatment.</p>
          <p><strong className="text-text-primary">Shelf life:</strong> 6 months in amber glass. Discard if scent changes or cloudiness appears.</p>
          <p><strong className="text-text-primary">Usage:</strong> 3-5 drops, massage 60 seconds, steam 2 minutes, wipe with warm cloth. Max 2x per week.</p>
        </div>
      </GlassCard>
    </div>
  );
}
