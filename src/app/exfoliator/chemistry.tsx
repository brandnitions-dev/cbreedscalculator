'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';

const CHEM_TABS = [
  { id: 'pore', label: 'Pore Anatomy' },
  { id: 'bha', label: 'BHA Science' },
  { id: 'carriers', label: 'Carrier Penetration' },
  { id: 'protocol', label: 'Clinical Protocol' },
  { id: 'safety', label: 'Safety' },
];

export function ExfoliatorChemistry() {
  const [tab, setTab] = useState('pore');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        {CHEM_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn(
            'px-3 py-2 rounded-xs text-xs font-medium border transition-all',
            tab === t.id
              ? 'bg-accent-gold/15 border-accent-gold/30 text-accent-gold-light'
              : 'bg-surface-input border-border text-text-tertiary hover:text-text-secondary hover:border-border-strong'
          )}>{t.label}</button>
        ))}
      </div>

      {tab === 'pore' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Pore Anatomy & Sebaceous Filaments</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p>Blackheads (open comedones) are <strong className="text-text-primary">oxidized sebum plugs</strong> in the pilosebaceous unit. They differ from sebaceous filaments, which are normal structures that fill pores with a thin layer of sebum + dead cells.</p>
            <p>The pore lining is continuous with the stratum corneum — it sheds dead corneocytes into the pore canal. When desquamation fails, these cells mix with sebum and form a plug.</p>
            <p><strong className="text-text-primary">Why oil-based extraction works:</strong> Sebum is lipophilic. Oil dissolves oil. By applying a penetrating carrier oil blend, we soften the plug from within, while BHA (salicylic acid derivatives) dissolve the keratin bonds holding it in place.</p>
          </div>
        </GlassCard>
      )}

      {tab === 'bha' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">BHA Delivery Chemistry</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p><strong className="text-text-primary">Methyl salicylate</strong> (wintergreen EO) is a lipophilic BHA precursor that penetrates the stratum corneum and follicular canal via the oil phase.</p>
            <p>Unlike water-based salicylic acid (which needs pH 3-4 to penetrate), methyl salicylate is already oil-soluble and self-penetrating. The skin&apos;s esterases convert it to free salicylic acid <em>in situ</em>.</p>
            <p><strong className="text-text-primary">Mechanism:</strong></p>
            <div className="space-y-2 mt-2">
              {[
                { step: 'Dissolution', desc: 'Oil carrier dissolves into sebum plug (like dissolves like)' },
                { step: 'Penetration', desc: 'Methyl salicylate follows the oil phase into the pore canal' },
                { step: 'Hydrolysis', desc: 'Esterases in skin convert methyl salicylate → salicylic acid + methanol' },
                { step: 'Keratolysis', desc: 'Free salicylic acid breaks desmosomes between corneocytes in the plug' },
                { step: 'Extraction', desc: 'Softened plug is physically removed by massage + warm towel' },
              ].map(s => (
                <div key={s.step} className="p-2.5 rounded-xs bg-surface-elevated/40 border border-border-subtle">
                  <span className="text-[12px] font-semibold text-accent-gold-light">{s.step}:</span>
                  <span className="text-[11px] text-text-tertiary ml-2">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {tab === 'carriers' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Carrier Oil Penetration Science</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p><strong className="text-text-primary">Jojoba oil</strong> is technically a liquid wax ester — it mimics human sebum almost identically. This is why it penetrates pores so effectively and doesn&apos;t clog them.</p>
            <p><strong className="text-text-primary">Squalane</strong> (hydrogenated squalene) is identical to the squalene in human sebum. 12% of skin surface lipids are squalene. This makes it the ultimate penetration vehicle.</p>
            <p><strong className="text-text-primary">Castor oil</strong> has unusually high viscosity from ricinoleic acid (90%). It creates a &quot;drawing&quot; effect that pulls impurities to the surface — this is the basis of the Oil Cleansing Method.</p>
            <p><strong className="text-text-primary">Grapeseed oil</strong> is 70% linoleic acid — the fatty acid that acne-prone skin is deficient in. Supplementing linoleic acid normalizes sebum composition and reduces comedone size.</p>
          </div>
        </GlassCard>
      )}

      {tab === 'protocol' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Clinical Extraction Protocol</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p>Professional estheticians report that with the Pore Purge blend, blackheads <strong className="text-text-primary">&quot;roll like grains of sand&quot;</strong> during extraction massage.</p>
            <ol className="list-decimal pl-5 space-y-2 mt-3">
              <li><strong>Prep:</strong> Cleanse face with warm water. Pat dry.</li>
              <li><strong>Apply:</strong> 3-5 drops of blend to nose, chin, forehead — the T-zone.</li>
              <li><strong>Massage:</strong> Gentle circular motions for 60 seconds. Increase to 90s for stubborn areas.</li>
              <li><strong>Steam:</strong> Apply warm damp towel for 2 minutes (opens pores further).</li>
              <li><strong>Extract:</strong> Wipe firmly with clean cloth. Blackheads should come out with the oil.</li>
              <li><strong>Tone:</strong> Follow with witch hazel or dilute ACV toner to close pores.</li>
              <li><strong>Protect:</strong> Apply SPF 30+ — BHA increases sun sensitivity for 24h.</li>
            </ol>
          </div>
        </GlassCard>
      )}

      {tab === 'safety' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Safety & Concentration Limits</h3>
          <table className="w-full text-xs mt-3">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2 text-text-muted font-semibold">Ingredient</th>
                <th className="text-right py-2 text-text-muted font-semibold">Max %</th>
                <th className="text-left py-2 pl-3 text-text-muted font-semibold">Critical Note</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              {[
                ['Wintergreen EO', '3%', 'Methyl salicylate — toxic at high doses. 1 tsp = ~7g aspirin.'],
                ['Tea Tree EO', '5%', 'Contact sensitizer at high concentrations. 1-2% is therapeutic.'],
                ['Frankincense EO', '5%', 'Generally safe. Anti-inflammatory boswellic acids.'],
                ['Alpha-Bisabolol', '5%', 'Very gentle active. Rarely sensitizing.'],
                ['Total EO blend', '10%', 'IFRA leave-on limit for clinical blends.'],
              ].map(([ing, max, note]) => (
                <tr key={ing} className="border-b border-border-subtle/50">
                  <td className="py-2 font-medium text-text-primary">{ing}</td>
                  <td className="py-2 text-right font-mono">{max}</td>
                  <td className="py-2 pl-3 text-text-muted">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-start gap-2 rounded-md border border-accent-rose/30 bg-accent-rose/[0.06] px-3 py-2.5 text-xs text-accent-rose">
            <strong>Contraindications:</strong> Do not use on broken skin, active eczema, rosacea flare, or within 48h of chemical peels / retinoid use. Discontinue if irritation occurs.
          </div>
        </GlassCard>
      )}
    </div>
  );
}
