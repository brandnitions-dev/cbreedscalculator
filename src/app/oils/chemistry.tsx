'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { Atom, AlertTriangle, Microscope, Shield, Syringe } from 'lucide-react';

const CHEM_TABS = [
  { id: 'pore', label: 'Pore Anatomy' },
  { id: 'bha', label: 'BHA / Salicylates' },
  { id: 'carrier', label: 'Carrier Penetration' },
  { id: 'protocol', label: 'Clinical Protocol' },
  { id: 'safety', label: 'Safety' },
];

const CONTENT: Record<string, { title: string; items: { heading: string; text: string }[] }> = {
  pore: {
    title: 'Pore Anatomy & Sebum Science',
    items: [
      { heading: 'Sebaceous Follicle', text: 'Each pore contains a sebaceous gland producing sebum — a waxy mix of triglycerides, wax esters, squalene, and free fatty acids. Treatment oils must dissolve into this matrix to deliver actives.' },
      { heading: 'Comedone Formation', text: 'When desquamated keratinocytes mix with oxidized sebum, a microcomedone forms. This hardens into a blackhead (open) or whitehead (closed). Oils with high linoleic acid content help normalize sebum consistency.' },
      { heading: 'Jojoba Sebum Mimicry', text: 'Jojoba is a liquid wax ester — structurally identical to human sebum. The follicle cannot distinguish jojoba from its own sebum, allowing it to penetrate without triggering sebaceous gland response.' },
      { heading: 'Extraction Mechanism', text: 'Castor oil\'s ricinoleic acid creates astringent "pull" on the plug. Combined with squalane\'s deep penetration, the sebum plug softens from below while castor grips from above.' },
    ],
  },
  bha: {
    title: 'BHA & Salicylate Chemistry',
    items: [
      { heading: 'Methyl Salicylate (Wintergreen)', text: 'Wintergreen essential oil is 85-99% methyl salicylate. It is lipophilic — it dissolves through the oil-filled pore canal where water-based BHA cannot reach. This is why oil-based BHA outperforms water-based for deep pore work.' },
      { heading: 'Willow Bark Salicin', text: 'Willow bark contains salicin — the plant precursor to salicylic acid. The skin\'s own enzymes convert salicin to salicylic acid gradually, making it gentler than synthetic BHA while still effective.' },
      { heading: 'Dose-Response', text: 'At 0.5-1% methyl salicylate: mild exfoliation, daily use safe. At 1-3%: noticeable tingling, effective pore clearing. Above 3%: TOXIC — methyl salicylate is readily absorbed transdermally. 1 teaspoon ≈ 7g aspirin.' },
      { heading: 'Synergy with Carriers', text: 'Jojoba + methyl salicylate = the BHA bypasses the stratum corneum via the jojoba sebum-mimic pathway. This is why the combination is more effective than either alone.' },
    ],
  },
  carrier: {
    title: 'Carrier Oil Penetration Profiles',
    items: [
      { heading: 'Jojoba (Wax Ester)', text: 'Penetrates via sebum mimicry. Does not truly absorb — fills the pore canal as a vehicle. Best carrier for delivering dissolved actives into the follicle.' },
      { heading: 'Squalane (C30 Hydrocarbon)', text: 'Biomimetic to skin\'s own squalene. Ultra-light, penetrates intercellular lipid matrix. Reaches deeper than most plant oils. Excellent base for clinical extraction formulas.' },
      { heading: 'Castor (Ricinoleic Acid)', text: 'Does not penetrate deeply. Instead creates surface-level astringent contraction. The "rolling" sensation during massage is castor pulling loosened plugs from the follicle opening.' },
      { heading: 'Rosehip (Trans-Retinoic Acid)', text: 'Contains natural tretinoin — increases cell turnover post-extraction. The linoleic acid helps normalize sebum composition to prevent re-clogging.' },
    ],
  },
  protocol: {
    title: 'Clinical Extraction Protocol',
    items: [
      { heading: 'Pre-Treatment', text: 'Cleanse skin thoroughly. Apply warm (not hot) compress for 2 minutes to soften surface. Do NOT steam — the treatment oil replaces steam function.' },
      { heading: 'Application', text: 'Apply 3-5 drops to treatment area. Massage in circular motions for 3-5 minutes (home) or 8-12 minutes (clinical). The castor+squalane combination will begin loosening plugs at 3-4 minutes.' },
      { heading: 'Extraction Phase', text: 'After massage, sebum plugs should feel like "grains of sand" rolling under fingertips. Gently press extraction tool if needed — most plugs will release with finger pressure alone.' },
      { heading: 'Post-Treatment', text: 'Remove oil with warm microfiber cloth. Apply toner (witch hazel). Follow with non-comedogenic moisturizer. SPF 30+ required next day — BHA increases photosensitivity.' },
    ],
  },
  safety: {
    title: 'Safety & Contraindications',
    items: [
      { heading: 'Wintergreen Toxicity', text: 'Methyl salicylate is TOXIC at high concentrations. Maximum 3% for home use, 0.5% for clinical (repeated application). Never use on children under 6. Keep away from mucous membranes. 1 teaspoon ingested can be fatal in children.' },
      { heading: 'Aspirin Sensitivity', text: 'Anyone allergic to aspirin, NSAIDs, or salicylates must NOT use wintergreen-containing formulas. Cross-reactivity is well documented.' },
      { heading: 'Pregnancy', text: 'Avoid wintergreen and high-dose willow bark during pregnancy. Salicylates are Category D. Carrier-only formulas (jojoba, rosehip) are safe alternatives.' },
      { heading: 'Sun Sensitivity', text: 'BHA (salicylates) increase UV sensitivity. SPF 30+ is mandatory the day after treatment. Advise clients to apply treatment oils in evening only.' },
    ],
  },
};

export function OilChemistry() {
  const [activeTab, setActiveTab] = useState('pore');
  const content = CONTENT[activeTab];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {CHEM_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-3 py-1.5 rounded-xs text-xs font-medium border transition-all',
              activeTab === tab.id
                ? 'bg-accent-indigo/15 border-accent-indigo/30 text-accent-indigo-light'
                : 'bg-surface-input border-border text-text-tertiary hover:text-text-secondary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <Atom size={16} className="text-accent-violet" />
          <h2 className="text-sm font-bold text-text-primary">{content.title}</h2>
        </div>

        <div className="space-y-5">
          {content.items.map((item, i) => (
            <div key={i} className="space-y-1.5">
              <h3 className="text-xs font-bold text-accent-indigo-light uppercase tracking-wider">{item.heading}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {activeTab === 'safety' && (
        <GlassCard className="border-accent-rose/20 bg-accent-rose/[0.03]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-accent-rose" />
            <h3 className="text-xs font-bold text-accent-rose uppercase tracking-wider">Critical Safety Reminder</h3>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2"><span className="text-accent-rose">-</span>Never exceed 3% wintergreen EO in any formula</li>
            <li className="flex gap-2"><span className="text-accent-rose">-</span>Always patch test 24h before full application</li>
            <li className="flex gap-2"><span className="text-accent-rose">-</span>Keep all treatment oils away from eyes and mucous membranes</li>
            <li className="flex gap-2"><span className="text-accent-rose">-</span>Store in dark glass bottles, away from heat and light</li>
            <li className="flex gap-2"><span className="text-accent-rose">-</span>Label all bottles with formula name, date, and batch number</li>
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
