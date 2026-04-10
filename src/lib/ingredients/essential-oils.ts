/**
 * Crown Breeds — Essential Oils, Absolutes, CO2 extracts, Resins
 * Migrated from formula_builder_eo_array.js
 */

import type { Ingredient } from '@/types';

export const ESSENTIAL_OILS: Ingredient[] = [
  // ── True floral EOs ──
  { id: 'neroli', name: 'Neroli (true EO)', desc: 'Hero regenerating floral — cell renewal, anti-aging, brightening; linalool / nerolidol rich.', benefits: { regenerating: 3, antiaging: 3, brightening: 3, calming: 2 }, tips: { low: 'Trace neroli — luxury signal already present.', mid: 'Working hero dose — scent + skin narrative align.', high: 'Neroli-forward SKU — cost and allergens deserve label care.' } },
  { id: 'rose_otto', name: 'Rose otto (true EO)', desc: 'Steam-distilled rose — deeply hydrating, brightening, extremely potent and expensive.', benefits: { moisturizing: 3, brightening: 3, calming: 3, antiaging: 2 }, tips: { low: 'Micro-dose otto — potency even when barely listed.', mid: 'Rose heart — justify price per jar.', high: 'Rose-dominant — ultra-luxury positioning.' } },
  { id: 'geranium', name: 'Geranium (true EO)', desc: 'Sebum balancing, toning, rosy profile; bridges lavender and rose.', benefits: { acne: 2, antiaging: 1, brightening: 1, soothing: 2 }, tips: { low: 'Soft rosy balance note.', mid: 'Clear sebum-control story.', high: 'Geranium-led — overtly rosy-floral.' } },
  { id: 'yylang', name: 'Ylang ylang (true EO)', desc: 'Sebum balancing, exotic floral depth; sensitizer — cap near 0.8%.', benefits: { calming: 2, moisturizing: 2, acne: 1 }, potency: 'strong', tips: { low: 'Safe floral sultriness.', mid: 'Approaching guideline ceiling.', high: 'High ylang — sensitization risk; reduce.' } },
  { id: 'chamomile', name: 'Roman chamomile (true EO)', desc: 'Redness, eczema, rosacea-friendly; esters — strong anti-inflammatory calm.', benefits: { soothing: 3, antiinflammatory: 3, calming: 3 }, tips: { low: 'Gentle apple-hay calm.', mid: 'Primary sensitive-skin EO pillar.', high: 'Roman-led — maximally soothing.' } },
  { id: 'chamomile_german', name: 'German chamomile (true EO)', desc: 'Bisabolol / chamazulene — deeper anti-inflammatory; tints blue-green.', benefits: { antiinflammatory: 3, soothing: 3, calming: 2, healing: 2 }, tips: { low: 'Trace azulene — cool blue story.', mid: 'Visible blue tinge likely.', high: 'German-led — specialty blue balm angle.' } },
  { id: 'palmarosa', name: 'Palmarosa (true EO)', desc: 'Hydrating, antibacterial; geraniol — rosy-fresh, affordable geranium cousin.', benefits: { moisturizing: 2, antimicrobial: 2, regenerating: 2, acne: 1 }, tips: { low: 'Rosy-fresh lift without rose invoice.', mid: 'Balancing moist antimicrobial heart.', high: 'Palmarosa-dominant — spa-herbal rosy top.' } },
  { id: 'lavender', name: 'Lavender (true EO)', desc: 'Universal reference — calming, acne and minor wound folklore; linalyl acetate flagship.', benefits: { calming: 3, acne: 2, healing: 3, soothing: 3 }, tips: { low: 'Clean herbal background.', mid: 'Classic skin-safe pillar.', high: 'Lavender-forward — assertive herbal.' } },

  // ── Resinous & woody ──
  { id: 'frankincense', name: 'Frankincense (true EO)', desc: 'Anti-aging, scarring, cell-turnover; boswellic-acid associations.', benefits: { antiaging: 3, scarring: 3, regenerating: 3 }, tips: { low: 'Elegant resin whisper.', mid: 'Structured anti-scar narrative.', high: 'Frankincense-led — church-resin dominant.' } },
  { id: 'myrrh', name: 'Myrrh (true EO)', desc: 'Anti-aging, wound healing, cracked dry skin; deep fixative resin.', benefits: { healing: 3, antiaging: 3, calming: 2 }, tips: { low: 'Sacred resin depth.', mid: 'Repair and meditation-grade base.', high: 'Myrrh-heavy — thick sacred dust note.' } },
  { id: 'sandalwood', name: 'Sandalwood (true EO)', desc: 'Moisturizing, toning, long wear; alpha-santalol; costly.', benefits: { moisturizing: 3, antiaging: 2, calming: 3 }, tips: { low: 'Creamy wood whisper.', mid: 'Premium dry-skin anchor.', high: 'Sandalwood-led — budget and sourcing matter.' } },
  { id: 'cedarwood', name: 'Cedarwood Atlas (true EO)', desc: 'Calming, anti-inflammatory and anti-aging; soft creamy wood.', benefits: { calming: 3, antiinflammatory: 2, antiaging: 2, acne: 1 }, tips: { low: 'Blanket under florals.', mid: 'Spa-forest body balm.', high: 'Atlas cedar-led — lumberyard cozy.' } },
  { id: 'patchouli', name: 'Patchouli (true EO)', desc: 'Fixative base, anti-aging, cracked-skin salve history; earthy chocolate facet.', benefits: { antiaging: 2, healing: 2, moisturizing: 2 }, tips: { low: 'Clean hippie-chic anchor.', mid: 'Long-lasting without dirt facet.', high: 'Patchouli-forward — divisive love-it note.' } },
  { id: 'vetiver', name: 'Vetiver (true EO)', desc: 'Deep grounding base, anti-stress, anti-aging cicatrizant folklore; smoky root.', benefits: { calming: 3, antiaging: 2, healing: 2 }, tips: { low: 'Smoke-root fixative thread.', mid: 'Niche masculine prestige base.', high: 'Vetiver-led — campfire whiskey.' } },
  { id: 'copaiba', name: 'Copaiba (oleoresin)', desc: 'Beta-caryophyllene story — anti-inflammatory, amplifies other EOs; very mild scent.', benefits: { antiinflammatory: 3, soothing: 3, calming: 2 }, tips: { low: 'Subtle booster.', mid: 'Boring alone — boosts resins.', high: 'Copaiba-high — still subtle; pair with bolder notes.' } },

  // ── Herbaceous ──
  { id: 'rosemary', name: 'Rosemary (true EO, skin ct)', desc: 'Antioxidant, anti-aging, circulation stimulating; pick skin-appropriate chemotype.', benefits: { antioxidant: 3, antiaging: 2, regenerating: 2 }, tips: { low: 'Spa herbal antioxidant lift.', mid: 'Morning glow stimulation.', high: 'Rosemary-forward — risk Vicks vibe.' } },
  { id: 'helichrysum', name: 'Helichrysum (true EO)', desc: 'Scarring, regenerating — "liquid gold"; neryl acetate flagship.', benefits: { scarring: 3, regenerating: 3, antiaging: 3 }, tips: { low: 'Even tiny % reads as repair SKU.', mid: 'Sweet spot for scar balms.', high: 'Helichrysum-led — price per gram hurts.' } },
  { id: 'carrotseed', name: 'Carrot seed (true EO)', desc: 'Anti-aging, brightening, toning; carotol; earthy.', benefits: { antiaging: 3, brightening: 3, regenerating: 2 }, tips: { low: 'Rooty vitamin-A echo.', mid: 'Pairs with rose or neroli in pro-age.', high: 'Carrot seed-led — soup celery if clumsy.' } },
  { id: 'teatree', name: 'Tea tree (true EO)', desc: 'Antibacterial, antifungal, acne; body-only for delicate face at high share.', benefits: { antimicrobial: 3, antifungal: 3, acne: 3, antiinflammatory: 2 }, tips: { low: 'Clean clinic accent.', mid: 'Back-acne sport stick story.', high: 'Tea tree-heavy — nose + irritation caution.' } },

  // ── Citrus ──
  { id: 'bergamotfcf', name: 'Bergamot FCF (true EO)', desc: 'Brightening, acne, calming — FCF = furocoumarin-free for leave-on.', benefits: { brightening: 2, acne: 2, calming: 2, antimicrobial: 1 }, tips: { low: 'Verify COA is true FCF.', mid: 'Earl Grey cologne bridge.', high: 'Non-FCF bergamot is not swappable on skin.' } },
  { id: 'lemon', name: 'Lemon, cold-pressed (true EO)', desc: 'Brightening, antioxidant; phototoxic expressed.', benefits: { brightening: 3, antioxidant: 2, calming: 1 }, potency: 'strong', tips: { low: 'Sparkle — document sun strategy.', mid: 'Kitchen-citrus clean.', high: 'Lemon-heavy — phototoxicity risk.' } },
  { id: 'sweetorange', name: 'Sweet orange (true EO)', desc: 'Uplifting, antioxidant, affordable crowd-pleaser.', benefits: { brightening: 2, antioxidant: 2, calming: 2 }, tips: { low: 'Juice-box optimism.', mid: 'Pairs vanilla and benzoin.', high: 'Orange-heavy — check IFRA + phototoxicity.' } },
  { id: 'petitgrain', name: 'Petitgrain (true EO)', desc: 'Oily skin, calming, woody-citrus; affordable neroli-tree alternative.', benefits: { acne: 2, calming: 3, soothing: 2, regenerating: 1 }, tips: { low: 'Green branch neroli extender.', mid: 'Unisex cologne water.', high: 'Petitgrain-forward — sharp laundry possible.' } },

  // ── Spice & root ──
  { id: 'ginger', name: 'Ginger (true EO)', desc: 'Warming, circulation, anti-inflammatory, antioxidant; spicy heat at high share.', benefits: { antiinflammatory: 2, antioxidant: 2, healing: 2, regenerating: 1 }, tips: { low: 'Warm gingerbread thread.', mid: 'Masculine winter sport.', high: 'Ginger-forward — hot rub caution.' } },
  { id: 'clove', name: 'Clove bud (true EO)', desc: 'Antimicrobial, antioxidant; IFRA caps ~0.5% — strong sensitizer.', benefits: { antimicrobial: 3, antioxidant: 2 }, potency: 'strong', tips: { low: 'Christmas kiss micro-dose.', mid: 'Toothache nostalgia — barely there.', high: 'Clove-heavy — dermal danger.' } },
  { id: 'cinnamon_leaf', name: 'Cinnamon leaf (true EO)', desc: 'Warming, antimicrobial; leaf softer than bark; caps ~0.6%.', benefits: { antimicrobial: 2, antiinflammatory: 1 }, potency: 'strong', tips: { low: 'Holiday whisper only.', mid: 'Chai depth with vanilla.', high: 'Chemical burn risk — strictly body/low ppm.' } },

  // ── Absolutes ──
  { id: 'vanilla_abs', name: 'Vanilla absolute', desc: 'Warm sweet solvent absolute base; anti-inflammatory folklore.', benefits: { calming: 3, antiinflammatory: 2, soothing: 2 }, tips: { low: 'Fine fragrance vanilla gravity.', mid: 'Gourmand amber anchor.', high: 'Vanilla abs-heavy — thick dark syrup.' } },
  { id: 'benzoin_abs', name: 'Benzoin absolute', desc: 'Vanilla-balsamic warmth; soothing, skin-healing salve history.', benefits: { healing: 3, soothing: 3, calming: 2 }, tips: { low: 'Powdery vanilla resin.', mid: 'Fixes citrus tops.', high: 'Benzoin abs-heavy — benzyl notes.' } },

  // ── CO2 extracts ──
  { id: 'vanilla_co2', name: 'Vanilla CO₂ total', desc: 'Truest vanilla scent profile; warm anti-inflammatory; very workable in balm.', benefits: { calming: 3, antiinflammatory: 2, antioxidant: 1 }, tips: { low: 'Mainstream gourmand gold.', mid: 'Pairs copaiba neroli.', high: 'Vanilla CO2-heavy — cost + thickness.' } },
  { id: 'frankincense_co2', name: 'Frankincense CO₂', desc: 'Often higher boswellic acids vs steam EO — superior anti-aging story.', benefits: { antiaging: 3, scarring: 3, regenerating: 3 }, tips: { low: 'Resin science flex.', mid: 'Layer with frank EO for complexity.', high: 'CO2 resin is paste-like — pre-blend.' } },
  { id: 'calendula_co2', name: 'Calendula CO₂', desc: 'Concentrated faradiol esters — excellent soothing vs macerated oil.', benefits: { soothing: 3, healing: 3, antiinflammatory: 2 }, tips: { low: 'Broken-skin holy grail direction.', mid: 'Pairs roman chamomile.', high: 'Calendula CO2-heavy — orange wax + cost.' } },

  // ── Resins ──
  { id: 'benzoin_resinoid', name: 'Benzoin resinoid', desc: 'Vanilla-balsamic skin-healing fixative — thick pourable resin.', benefits: { healing: 3, soothing: 3, calming: 2 }, tips: { low: 'Sticky church incense pour.', mid: 'Base for every amber.', high: 'Resinoid-heavy — benzyl overload.' } },

  // ── Soap-friendly EOs (survive high pH) ──
  { id: 'peppermint', name: 'Peppermint (true EO)', desc: 'Cooling, invigorating. Menthol survives CP soap well. Pairs eucalyptus, tea tree, pine.', benefits: { antimicrobial: 2, soothing: 2, calming: 1 }, tips: { low: 'Cool tingle hint.', mid: 'Definite cooling effect — morning soap direction.', high: 'Strong menthol — can overwhelm; eyes water in shower.' } },
  { id: 'eucalyptus', name: 'Eucalyptus (true EO)', desc: 'Respiratory-clear, antimicrobial. 1,8-cineole survives saponification beautifully.', benefits: { antimicrobial: 3, antiinflammatory: 2, soothing: 1 }, tips: { low: 'Clean medicinal whisper.', mid: 'Spa eucalyptus accord.', high: 'Eucalyptus-forward — Vicks vibe if overdone.' } },
  { id: 'lemongrass', name: 'Lemongrass (true EO)', desc: 'Bright citrus-herbal that holds in CP soap (unlike most citrus). Antimicrobial, deodorizing.', benefits: { antimicrobial: 2, brightening: 2, acne: 1 }, tips: { low: 'Green citrus sparkle.', mid: 'Kitchen soap — deodorizing angle.', high: 'Lemongrass-forward — can irritate at high percentages.' } },
  { id: 'maychang', name: 'May Chang / Litsea cubeba', desc: 'Lemony scent that actually sticks in CP soap unlike lemon EO. Affordable bright top note.', benefits: { brightening: 2, antimicrobial: 1, calming: 2 }, tips: { low: 'Lemon substitute that survives lye.', mid: 'Excellent CP soap top note.', high: 'May Chang-forward — can cause skin sensitization at high rates.' } },
];

/** EOs that survive CP soap saponification and retain scent through cure */
export const SOAP_SAFE_EO_IDS = [
  'lavender', 'teatree', 'patchouli', 'cedarwood', 'frankincense',
  'rosemary', 'peppermint', 'eucalyptus', 'clove', 'lemongrass',
  'yylang', 'vetiver', 'maychang', 'geranium', 'palmarosa',
  'copaiba', 'myrrh', 'sandalwood', 'ginger', 'cinnamon_leaf',
];
