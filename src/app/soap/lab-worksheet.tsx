'use client';

import { GlassCard } from '@/components/ui';
import { ClipboardList, Thermometer, Clock, AlertTriangle } from 'lucide-react';

export function SoapLabWorksheet() {
  return (
    <div className="space-y-5">
      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <ClipboardList size={16} className="text-accent-emerald" /> Lab Setup Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Digital scale (0.1g precision)',
            'Stick blender (immersion blender)',
            'Stainless steel pot + thermometer',
            'Lye-safe container (HDPE or stainless)',
            'Safety glasses + chemical gloves',
            'Silicone soap mold',
            'Vinegar for lye neutralization',
            'Ventilated workspace',
            'Cold distilled water measured',
            'NaOH weighed and sealed until use',
            'All oils measured and combined',
            'EOs / additives ready at trace',
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
            { step: '1', label: 'Prepare Lye Solution', desc: 'Add NaOH to cold distilled water (NEVER reverse). Stir until dissolved. Solution will reach ~200°F. Set aside to cool.', color: '#f43f5e' },
            { step: '2', label: 'Melt & Combine Oils', desc: 'Melt tallow and solid oils at 100-110°F. Add liquid oils. Stir to combine.', color: '#f59e0b' },
            { step: '3', label: 'Temperature Match', desc: 'Both lye solution and oils should reach ~100°F (±10°). Do not proceed if either is above 120°F.', color: '#10b981' },
            { step: '4', label: 'Combine & Blend', desc: 'Pour lye into oils. Stick blend in short bursts until light trace (thin pudding).', color: '#6366f1' },
            { step: '5', label: 'Add at Trace', desc: 'Add EOs, colorants, additives. Stir to incorporate. Pour into mold.', color: '#C4B5FD' },
            { step: '6', label: 'Insulate & Cure', desc: 'Cover mold. Optional: insulate for gel phase. Unmold in 24-48h. Cut bars. Cure 4-6 weeks.', color: '#38bdf8' },
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
          {['Batch #', 'Date', 'Operator', 'Total Oil Weight (g)'].map(field => (
            <div key={field}>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">{field}</label>
              <input type="text" className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-accent-emerald/50 focus:outline-none" placeholder={field} />
            </div>
          ))}
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 block">Notes</label>
          <textarea className="w-full bg-surface-input border border-border rounded-xs px-3 py-2 text-sm text-text-primary focus:border-accent-emerald/50 focus:outline-none min-h-[80px] resize-y" placeholder="Trace time, gel phase, unmold condition, cure start date..." />
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-3">
          <AlertTriangle size={16} className="text-accent-rose" /> Critical Safety
        </h3>
        <div className="space-y-2 text-[13px] text-text-secondary leading-relaxed">
          <p className="text-accent-rose font-semibold">NaOH (sodium hydroxide) is extremely caustic. Causes severe chemical burns on contact.</p>
          <p><strong className="text-text-primary">Always:</strong> Wear chemical-splash safety glasses + chemical-resistant gloves. Work in ventilated area. Keep vinegar nearby.</p>
          <p><strong className="text-text-primary">Never:</strong> Add water to lye (exothermic splash). Always add lye TO water slowly while stirring.</p>
          <p><strong className="text-text-primary">First aid:</strong> Flush with copious water for 15+ minutes. Seek medical attention for any burn larger than a quarter.</p>
          <p><strong className="text-text-primary">Storage:</strong> Keep NaOH sealed, dry, away from children and pets. Label clearly as CAUSTIC.</p>
        </div>
      </GlassCard>
    </div>
  );
}
