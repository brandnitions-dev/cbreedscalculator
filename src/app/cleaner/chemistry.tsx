'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';

const CHEM_TABS = [
  { id: 'exfoliation', label: 'Exfoliation Science' },
  { id: 'absorption', label: 'Oil Absorption' },
  { id: 'safety', label: 'Safety & Limits' },
];

export function CleanerChemistry() {
  const [tab, setTab] = useState('exfoliation');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        {CHEM_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn(
            'px-3 py-2 rounded-xs text-xs font-medium border transition-all',
            tab === t.id
              ? 'bg-accent-emerald/15 border-accent-emerald/30 text-accent-emerald-light'
              : 'bg-surface-input border-border text-text-tertiary hover:text-text-secondary hover:border-border-strong'
          )}>{t.label}</button>
        ))}
      </div>

      {tab === 'exfoliation' && (
        <div className="space-y-5">
          <GlassCard>
            <h3 className="text-sm font-bold text-text-primary mb-3">Physical vs Chemical Exfoliation</h3>
            <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
              <p>The Face Cleaner uses <strong className="text-text-primary">physical (mechanical) exfoliation</strong> — particles physically loosen and remove dead corneocytes from the stratum corneum.</p>
              <p>This differs from chemical exfoliation (AHA/BHA) which dissolves the intercellular glue (desmosomes) between dead cells. The MOSSKYN LAB Exfoliator product handles chemical exfoliation.</p>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold text-text-primary mb-3">Particle Size & Abrasiveness</h3>
            <div className="space-y-2 mt-3">
              {[
                { name: 'Oat Flour', size: '10–50μm', abr: 'Ultra-gentle', face: true, body: true },
                { name: 'Baking Soda', size: '50–100μm', abr: 'Micro-grit', face: true, body: true },
                { name: 'Sugar (fine)', size: '200–500μm', abr: 'Gentle', face: true, body: true },
                { name: 'Clay', size: 'N/A (drag)', abr: 'Mild polish', face: true, body: true },
                { name: 'Coffee Grounds', size: '300–800μm', abr: 'Medium', face: false, body: true },
                { name: 'Walnut Shell', size: '500–1000μm', abr: 'Aggressive', face: false, body: true },
              ].map(p => (
                <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-xs bg-surface-elevated/40 border border-border-subtle">
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-text-primary">{p.name}</div>
                    <div className="text-[11px] text-text-tertiary">{p.size} · {p.abr}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', p.face ? 'bg-accent-emerald/15 text-accent-emerald-light' : 'bg-accent-rose/15 text-accent-rose')}>
                      Face {p.face ? '✓' : '✗'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-accent-emerald/15 text-accent-emerald-light">
                      Body ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {tab === 'absorption' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Oil Absorption Chemistry</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p>When the C-phase (exfoliant) is added, it <strong className="text-text-primary">absorbs oil from the formula</strong>, creating a drier, paste-like texture. The formula engine automatically scales base oils down to compensate.</p>
            <p><strong className="text-text-primary">Sugar:</strong> Minimal oil absorption. Dissolves on contact with moisture — self-limiting exfoliation.</p>
            <p><strong className="text-text-primary">Clay:</strong> Highest oil absorption. Bentonite swells and absorbs 2-3x its weight in oil. This is why clay-heavy formulas feel drier.</p>
            <p><strong className="text-text-primary">Coffee:</strong> Moderate absorption. The cellular structure traps oil, creating a scrubby paste.</p>
            <p><strong className="text-text-primary">Oat:</strong> Moderate absorption. Creates a milky, creamy consistency.</p>
            <p className="mt-3"><strong className="text-text-primary">C-Phase Slider:</strong> At 5%, the base oils remain dominant and the scrub feels oily. At 15%, the exfoliant dominates and the product feels dry/pasty. 8% is the sweet spot for most formulas.</p>
          </div>
        </GlassCard>
      )}

      {tab === 'safety' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Safety & Best Practices</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p><strong className="text-text-primary">Frequency:</strong> Physical exfoliants should be used 1-3x per week maximum. Over-exfoliation damages the skin barrier.</p>
            <p><strong className="text-text-primary">Pressure:</strong> Let the particles do the work. Gentle circular motions — never press hard or scrub aggressively.</p>
            <p><strong className="text-text-primary">Wet skin:</strong> Always apply to damp skin. Dry application increases micro-tear risk.</p>
            <p><strong className="text-text-primary">Avoid on:</strong> Active acne lesions, open wounds, sunburned skin, rosacea flares, or after chemical peels.</p>
            <p><strong className="text-text-primary">Walnut shell warning:</strong> Irregularly shaped particles can cause micro-tears. Use only finely ground, body-only. St. Ives lawsuit precedent.</p>
            <div className="mt-3 flex items-start gap-2 rounded-md border border-accent-gold/30 bg-accent-gold/[0.06] px-3 py-2.5 text-xs text-accent-gold-light">
              <strong>Shelf life:</strong> 6-12 months. Sugar dissolves over time in high-moisture environments. Store sealed, cool, and dry.
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
