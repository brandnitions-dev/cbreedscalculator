/**
 * Physical exfoliant / polish phase for Formula Builder (Ingredient C).
 * Loaded before formula_builder_tab.js in tallow_blend_pro_v5.html.
 */
function getFormulaBuilderCList() {
  return [
    { id: "sugar", name: "Sugar (fine or raw)", desc: "Gentler than salt; sugar dissolves on contact with damp skin, so it is less likely to over-strip than harsh salt scrubs.", benefits: { softening: 2, soothing: 2 },
      tips: { low: "Soft polish — beginner-friendly body scrub.", mid: "Noticeable slip and melt as you work.", high: "Sugar-heavy — still buff gently; rinse thoroughly." } },
    { id: "coffee_grounds", name: "Coffee grounds", desc: "Antioxidant-rich; medium grit — great for body circulation stories and morning ritual scent.", benefits: { antioxidant: 3, antiinflammatory: 1, softening: 1 },
      tips: { low: "Mild wake-up grit — spa-café vibe.", mid: "Working body polish — pair with cocoa or vanilla EOs.", high: "Coffee-forward — can feel scratchy on thin facial skin; bias to body." } },
    { id: "oat_flour", name: "Oat flour", desc: "Ultra-gentle; anti-inflammatory — ideal for sensitive, eczema-leaning, or face-safe exfoliator directions.", benefits: { soothing: 3, antiinflammatory: 3, barrier: 2, softening: 2 },
      tips: { low: "Featherweight polish — milky calm.", mid: "Dominant sensitive-skin story.", high: "Oat-led — can clump if oil phase is cool; fold evenly." } },
    { id: "clay_polish", name: "Bentonite / kaolin clay", desc: "Not grainy like sugar — offers mild polishing drag while drawing oil and impurities (classic clay behavior).", benefits: { acne: 2, brightening: 1, barrier: 1 },
      tips: { low: "Clay whisper — refines slip.", mid: "Balancing ‘second cleanse’ body paste feel.", high: "Clay-heavy — watch dryness on already stripped skin; moisturize after." } },
    { id: "walnut_apricot", name: "Walnut / apricot shell powder", desc: "Finer, more controlled abrasion than coarse salt; still physically abrasive — use thoughtful particle size and pressure.", benefits: { softening: 1 },
      tips: { low: "Controlled buff for knees/elbows.", mid: "Visible polish — avoid aggressive circles.", high: "Abrasive-forward — micro-scratch risk if cheap grind; face caution." }, potency: "strong" },
    { id: "baking_soda", name: "Baking soda (sodium bicarbonate)", desc: "Very fine micro-grit feel; can read as mildly pH-shifting vs acid mantle — gentle marketing and patch-test.", benefits: { brightening: 1, softening: 1 },
      tips: { low: "Almost imperceptible grit — ‘polished skin’ marketing.", mid: "Pairs oat or clay to buffer feel.", high: "Baking soda-heavy — alkalinity concerns on sensitive skin; shorten leave-on." }, potency: "moderate" },
  ];
}
