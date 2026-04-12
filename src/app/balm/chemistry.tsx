'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';

const CHEM_TABS = [
  { id: 'tallow', label: 'Tallow Science' },
  { id: 'carriers', label: 'Carrier Oils' },
  { id: 'actives', label: 'Active Botanicals' },
  { id: 'eos', label: 'Essential Oils' },
  { id: 'safety', label: 'Safety & Limits' },
];

export function BalmChemistry() {
  const [tab, setTab] = useState('tallow');

  return (
    <div className="space-y-5">
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1.5">
        {CHEM_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-3 py-2 rounded-xs text-xs font-medium border transition-all',
              tab === t.id
                ? 'bg-accent-indigo/15 border-accent-indigo/30 text-accent-indigo-light'
                : 'bg-surface-input border-border text-text-tertiary hover:text-text-secondary hover:border-border-strong'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'tallow' && (
        <div className="space-y-5">
          <GlassCard>
            <h3 className="text-sm font-bold text-text-primary mb-3">Why Tallow Works on Skin</h3>
            <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
              <p>Beef tallow is remarkably similar to human sebum in fatty acid composition. It contains roughly <strong className="text-text-primary">50% saturated fats</strong> (palmitic + stearic), <strong className="text-text-primary">42% monounsaturated</strong> (oleic acid), and <strong className="text-text-primary">4% polyunsaturated</strong> — closely matching the lipid profile of healthy skin.</p>
              <p>The key fatty acids and their skin roles:</p>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { acid: 'Oleic Acid (C18:1)', pct: '~42%', role: 'Deep penetration, softening. The main delivery vehicle for other actives.' },
                { acid: 'Palmitic Acid (C16:0)', pct: '~26%', role: 'Barrier repair, antimicrobial. Naturally found in human sebum at ~25%.' },
                { acid: 'Stearic Acid (C18:0)', pct: '~18%', role: 'Structure, occlusive barrier. What gives tallow its firmness at room temp.' },
                { acid: 'Myristic Acid (C14:0)', pct: '~3%', role: 'Cleansing, lather boosting in soap. Antimicrobial properties.' },
                { acid: 'Palmitoleic Acid (C16:1)', pct: '~3%', role: 'Rare antimicrobial found in youthful skin. Decreases with age.' },
              ].map(a => (
                <div key={a.acid} className="flex gap-3 p-2.5 rounded-xs bg-surface-elevated/40 border border-border-subtle">
                  <div className="shrink-0 w-24">
                    <div className="text-[11px] font-bold text-accent-indigo-light">{a.pct}</div>
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-text-primary">{a.acid}</div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">{a.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold text-text-primary mb-3">Tallow vs Plant Oils</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-2 text-text-muted font-semibold">Property</th>
                  <th className="text-center py-2 text-text-muted font-semibold">Tallow</th>
                  <th className="text-center py-2 text-text-muted font-semibold">Coconut</th>
                  <th className="text-center py-2 text-text-muted font-semibold">Olive</th>
                  <th className="text-center py-2 text-text-muted font-semibold">Shea</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {[
                  ['Sebum Match', '★★★★★', '★★☆☆☆', '★★★☆☆', '★★★★☆'],
                  ['Penetration', '★★★★☆', '★★★☆☆', '★★★★★', '★★★☆☆'],
                  ['Barrier', '★★★★★', '★★★☆☆', '★★★☆☆', '★★★★★'],
                  ['Stability', '★★★★★', '★★★★★', '★★★☆☆', '★★★★☆'],
                  ['Comedogenic', 'Low (2)', 'High (4)', 'Low (2)', 'Low (0-2)'],
                ].map(([prop, ...vals]) => (
                  <tr key={prop} className="border-b border-border-subtle/50">
                    <td className="py-2 font-medium text-text-primary">{prop}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="py-2 text-center">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {tab === 'carriers' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Carrier Oil Chemistry</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p>Carrier oils in the A-phase serve as <strong className="text-text-primary">therapeutic delivery vehicles</strong>. They make up 13% of the formula and carry specific fatty acid profiles that complement tallow.</p>
            <p><strong className="text-text-primary">Linoleic acid-dominant</strong> carriers (hemp, grapeseed, rosehip) are best for acne-prone and oily skin — they thin sebum and reduce comedogenicity.</p>
            <p><strong className="text-text-primary">Oleic acid-dominant</strong> carriers (marula, avocado, macadamia) provide deep moisturizing for dry/mature skin but can be comedogenic for oily types.</p>
            <p><strong className="text-text-primary">Omega-3 rich</strong> carriers (chia, hemp, rosehip) are anti-inflammatory — ideal for reactive, rosacea-prone, or eczema skin.</p>
            <p><strong className="text-text-primary">Stability:</strong> Meadowfoam and squalane are the most oxidation-resistant. Sea buckthorn, hemp, and evening primrose oxidize fastest — use vitamin E and keep batches small.</p>
          </div>
        </GlassCard>
      )}

      {tab === 'actives' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Active Botanical Chemistry</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p>The B-phase (6% of formula) contains <strong className="text-text-primary">potent therapeutic oils</strong> that define the balm's clinical story. Each active has a specific mechanism:</p>
            <div className="space-y-2 mt-3">
              {[
                { name: 'Thymoquinone (Black Seed)', mech: 'NF-κB pathway inhibition → potent anti-inflammatory + antimicrobial' },
                { name: 'Calophyllolide (Tamanu)', mech: 'Scar tissue remodeling via collagen type I/III regulation' },
                { name: 'Bakuchiol', mech: 'Retinol receptor agonist without photosensitivity — same RARA/RARB activation' },
                { name: 'Curcumin (Turmeric CO2)', mech: 'Tyrosinase inhibition → melanin reduction + NF-κB anti-inflammatory' },
                { name: 'Asiaticoside (Gotu Kola)', mech: 'Collagen synthesis stimulation + microcirculation improvement' },
                { name: 'Beta-carotene (Buriti)', mech: 'Pro-vitamin A + singlet oxygen quenching → photo-damage repair' },
              ].map(a => (
                <div key={a.name} className="p-2.5 rounded-xs bg-surface-elevated/40 border border-border-subtle">
                  <div className="text-[12px] font-semibold text-accent-gold-light">{a.name}</div>
                  <div className="text-[11px] text-text-tertiary mt-0.5">{a.mech}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {tab === 'eos' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Essential Oil Chemistry</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p>Essential oils are volatile terpene compounds added at <strong className="text-text-primary">1% (face) or 2% (body)</strong> maximum. They serve dual purpose: therapeutic activity and scent architecture.</p>
            <p><strong className="text-text-primary">IFRA Guidelines:</strong> The International Fragrance Association sets maximum percentages for leave-on products. Crown Breeds follows these limits.</p>
            <div className="mt-3 space-y-2">
              {[
                { cat: 'Monoterpene Alcohols', examples: 'Linalool (lavender), geraniol (geranium)', safety: 'Generally safe. Low sensitization.' },
                { cat: 'Sesquiterpenes', examples: 'Chamazulene (chamomile), bisabolol', safety: 'Anti-inflammatory. Very low sensitization.' },
                { cat: 'Phenols', examples: 'Eugenol (clove), thymol', safety: 'High sensitization risk. Cap at 0.5%.' },
                { cat: 'Aldehydes', examples: 'Citral (lemongrass), cinnamaldehyde', safety: 'Moderate sensitization. IFRA restricted.' },
                { cat: 'Furocoumarins', examples: 'Bergaptene (bergamot)', safety: 'Phototoxic. Must use FCF grade for leave-on.' },
              ].map(c => (
                <div key={c.cat} className="p-2.5 rounded-xs bg-surface-elevated/40 border border-border-subtle">
                  <div className="text-[12px] font-semibold text-accent-violet">{c.cat}</div>
                  <div className="text-[11px] text-text-tertiary mt-0.5">{c.examples}</div>
                  <div className="text-[11px] text-text-muted mt-1">{c.safety}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {tab === 'safety' && (
        <GlassCard>
          <h3 className="text-sm font-bold text-text-primary mb-3">Safety & Concentration Limits</h3>
          <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
            <p>Crown Breeds formulations follow <strong className="text-text-primary">IFRA standards</strong> and <strong className="text-text-primary">dermatological best practices</strong>.</p>
            <table className="w-full text-xs mt-3">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-2 text-text-muted font-semibold">Ingredient</th>
                  <th className="text-right py-2 text-text-muted font-semibold">Max Face</th>
                  <th className="text-right py-2 text-text-muted font-semibold">Max Body</th>
                  <th className="text-left py-2 pl-3 text-text-muted font-semibold">Concern</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {[
                  ['Total EOs', '1%', '2%', 'Sensitization risk above limits'],
                  ['Ylang ylang', '0.8%', '0.8%', 'IFRA dermal limit — sensitizer'],
                  ['Clove bud', '0.5%', '0.5%', 'Eugenol — strong sensitizer'],
                  ['Cinnamon leaf', '0.6%', '0.6%', 'Cinnamaldehyde — irritant'],
                  ['Lemon (expressed)', '2%', '2%', 'Phototoxic — sun warning required'],
                  ['Bergamot (non-FCF)', '0.4%', '0.4%', 'Phototoxic — use FCF only'],
                  ['Vitamin E', '0.4%', '0.4%', 'No concern — antioxidant preservative'],
                  ['Turmeric CO2', 'Trace', '1%', 'Yellow staining on skin/fabric'],
                ].map(([ing, face, body, concern]) => (
                  <tr key={ing} className="border-b border-border-subtle/50">
                    <td className="py-2 font-medium text-text-primary">{ing}</td>
                    <td className="py-2 text-right">{face}</td>
                    <td className="py-2 text-right">{body}</td>
                    <td className="py-2 pl-3 text-text-muted">{concern}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-start gap-2 rounded-md border border-accent-gold/30 bg-accent-gold/[0.06] px-3 py-2.5 text-xs text-accent-gold-light">
              <strong>Patch test protocol:</strong> Apply small amount to inner forearm. Wait 24 hours. If redness, itching, or swelling occurs, do not use formula.
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
