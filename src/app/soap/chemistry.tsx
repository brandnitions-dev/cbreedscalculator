'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';

const CHEM_TABS = [
  { id: 'saponification', label: 'Saponification' },
  { id: 'fatty', label: 'Fatty Acid Profiles' },
  { id: 'properties', label: 'Bar Properties' },
  { id: 'cure', label: 'Curing Science' },
  { id: 'safety', label: 'Safety' },
];

export function SoapChemistry() {
  const [tab, setTab] = useState('saponification');

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

      {tab === 'saponification' && (
        <div className="space-y-5">
          <GlassCard>
            <h3 className="text-sm font-bold text-text-primary mb-3">The Saponification Reaction</h3>
            <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
              <p>Saponification is the chemical reaction between a <strong className="text-text-primary">triglyceride (fat/oil)</strong> and a <strong className="text-text-primary">strong base (NaOH)</strong> that produces <strong className="text-text-primary">soap (sodium salt of fatty acid)</strong> + <strong className="text-text-primary">glycerin</strong>.</p>
              <div className="p-3 rounded-sm bg-surface-elevated/40 border border-border-subtle font-mono text-xs text-center">
                Fat + NaOH → Soap + Glycerin
                <br />
                <span className="text-text-muted">C₃H₅(OOCR)₃ + 3NaOH → 3RCOONa + C₃H₅(OH)₃</span>
              </div>
              <p><strong className="text-text-primary">SAP value</strong> = mg of KOH needed to saponify 1g of fat. Each oil has a unique SAP value because of its fatty acid chain length distribution.</p>
              <p>NaOH SAP = KOH SAP ÷ 1.403 (molecular weight ratio).</p>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold text-text-primary mb-3">Superfat & Lye Discount</h3>
            <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
              <p><strong className="text-text-primary">Superfat</strong> is the percentage of oils left unsaponified in the finished bar. A 5% superfat means 5% of oils remain as free oils — conditioning the skin.</p>
              <p><strong className="text-text-primary">0%:</strong> Fully saponified. Harsh, stripping. Used for laundry bars.</p>
              <p><strong className="text-text-primary">3-5%:</strong> Standard range. Mild, conditioning. Good for most skin types.</p>
              <p><strong className="text-text-primary">8-10%:</strong> Very moisturizing. Risk of DOS (dreaded orange spots) from rancid unsaponified oils.</p>
              <p><strong className="text-text-primary">Above 10%:</strong> Oily feel, short shelf life. Not recommended unless specific therapeutic intent.</p>
            </div>
          </GlassCard>
        </div>
      )}

      {tab === 'fatty' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Fatty Acid Profiles & Their Effects</h3>
          <div className="space-y-2">
            {[
              { acid: 'Lauric (C12)', sources: 'Coconut, palm kernel', effect: 'Cleansing + bubbly lather. Hard bar. Can be drying above 30%.', color: '#38bdf8' },
              { acid: 'Myristic (C14)', sources: 'Coconut, palm kernel', effect: 'Fluffy lather, cleansing. Often paired with lauric.', color: '#6366f1' },
              { acid: 'Palmitic (C16)', sources: 'Tallow, palm, lard', effect: 'Hard bar, creamy lather. Stable. The backbone of tallow soap.', color: '#f43f5e' },
              { acid: 'Stearic (C18:0)', sources: 'Tallow, shea, cocoa', effect: 'Hard bar, stable lather. Slows trace.', color: '#D85A30' },
              { acid: 'Oleic (C18:1)', sources: 'Olive, tallow, avocado', effect: 'Conditioning, mild. Soft bar if dominant. Creamy lather.', color: '#10b981' },
              { acid: 'Linoleic (C18:2)', sources: 'Sunflower, grapeseed', effect: 'Conditioning, silky feel. Makes bar softer. Shorter shelf life.', color: '#C4A574' },
              { acid: 'Ricinoleic', sources: 'Castor oil only', effect: 'Lather booster. Humectant. Use 3-8% max.', color: '#C4B5FD' },
            ].map(a => (
              <div key={a.acid} className="p-2.5 rounded-xs bg-surface-elevated/40 border border-border-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
                  <span className="text-[12px] font-semibold text-text-primary">{a.acid}</span>
                  <span className="text-[10px] text-text-muted ml-auto">{a.sources}</span>
                </div>
                <div className="text-[11px] text-text-tertiary mt-1 ml-4">{a.effect}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {tab === 'properties' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Understanding Bar Property Scores</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p>The calculator scores bar properties on a 0-100 scale based on the fatty acid profile of your oil blend:</p>
            <div className="space-y-2 mt-3">
              {[
                { prop: 'Hardness', range: '29-54', desc: 'Higher = harder bar that lasts longer. Driven by saturated fats (palmitic + stearic + lauric + myristic).' },
                { prop: 'Cleansing', range: '12-22', desc: 'Higher = more oil-stripping power. Driven by lauric + myristic. Above 22 may feel harsh.' },
                { prop: 'Conditioning', range: '44-69', desc: 'Higher = more moisturizing. Driven by oleic + linoleic + ricinoleic unsaponified portions.' },
                { prop: 'Bubbly Lather', range: '14-46', desc: 'Big, airy bubbles. Driven by lauric + myristic + ricinoleic.' },
                { prop: 'Creamy Lather', range: '16-48', desc: 'Dense, lotion-like lather. Driven by palmitic + stearic + ricinoleic.' },
                { prop: 'Iodine', range: '41-70', desc: 'Measure of unsaturation. Below 70 = good shelf stability. Above 70 = risk of DOS.' },
              ].map(p => (
                <div key={p.prop} className="p-2.5 rounded-xs bg-surface-elevated/40 border border-border-subtle">
                  <div className="flex justify-between">
                    <span className="text-[12px] font-semibold text-text-primary">{p.prop}</span>
                    <span className="text-[10px] font-mono text-accent-gold-light">ideal: {p.range}</span>
                  </div>
                  <div className="text-[11px] text-text-tertiary mt-0.5">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {tab === 'cure' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Curing Science</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p><strong className="text-text-primary">Why cure for 4-6 weeks?</strong></p>
            <p>Saponification is ~90% complete at unmold time (24-48h). The remaining 10% continues during cure. But the main purpose of curing is <strong className="text-text-primary">water evaporation</strong>.</p>
            <p>Fresh soap is ~30% water. During cure, water content drops to ~12-15%. This makes the bar harder, longer-lasting, milder, and produces better lather.</p>
            <p><strong className="text-text-primary">Gel phase</strong> (optional): Insulating the mold causes an exothermic reaction that heats the soap to 160-180°F. This accelerates saponification and produces a more translucent, harder bar. Some soapmakers prefer it; others avoid it to preserve additive colors.</p>
            <p><strong className="text-text-primary">Cure conditions:</strong> Cool, dry, ventilated area. Bars spaced on rack for airflow on all sides. Turn bars weekly. Avoid direct sunlight.</p>
            <p><strong className="text-text-primary">Testing pH:</strong> Finished soap should be pH 9-10. Use phenolphthalein or pH strips. If above 10 after 4 weeks, lye calculation was likely off.</p>
          </div>
        </GlassCard>
      )}

      {tab === 'safety' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Safety & Troubleshooting</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <table className="w-full text-xs mt-2">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-2 text-text-muted font-semibold">Issue</th>
                  <th className="text-left py-2 text-text-muted font-semibold">Cause</th>
                  <th className="text-left py-2 text-text-muted font-semibold">Fix</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {[
                  ['Lye-heavy bar (zap test fails)', 'Incorrect SAP calculation or weighing error', 'Rebatch with additional oil or discard'],
                  ['DOS (orange spots)', 'Rancid unsaponified oils, high iodine value', 'Lower superfat, avoid high-linoleic oils above 15%'],
                  ['Crumbly texture', 'Too much hard oil, not enough liquid', 'Add castor or olive oil. Check water ratio.'],
                  ['Glycerin rivers', 'Titanium dioxide + gel phase interaction', 'Skip gel phase when using TiO₂'],
                  ['Fragrance acceleration', 'EO contains eugenol, cinnamic aldehyde', 'Use fragrance calculator. Soap at lower temp.'],
                  ['Soft bar after 48h', 'High oleic/linoleic blend', 'Wait longer to unmold. Add sodium lactate.'],
                ].map(([issue, cause, fix]) => (
                  <tr key={issue} className="border-b border-border-subtle/50">
                    <td className="py-2 font-medium text-text-primary">{issue}</td>
                    <td className="py-2 text-text-muted">{cause}</td>
                    <td className="py-2 text-text-muted">{fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-start gap-2 rounded-md border border-accent-rose/30 bg-accent-rose/[0.06] px-3 py-2.5 text-xs text-accent-rose">
              <strong>Zap test:</strong> Touch tongue to cured bar. If it &quot;zaps&quot; like a battery, there is free lye — bar is not safe to use. Rebatch or discard.
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
