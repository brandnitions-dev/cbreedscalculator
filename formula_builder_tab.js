
const FB_ING={
  a:[
    {id:"rosehip",name:"Rosehip seed",desc:"Rich in trans-retinoic acid & linoleic acid. Star oil for fading scars and evening skin tone.",benefits:{antiaging:3,scarring:3,brightening:2,barrier:1},
     tips:{low:"Light touch of rosehip — adds gentle brightening without dominating.",mid:"Good working dose — noticeable scar-fading and anti-aging activity.",high:"Dominant rosehip — this is now your hero A oil. Excellent for mature or scarred skin."}},
    {id:"marula",name:"Marula",desc:"High oleic acid, absorbs fast. Silky elegant feel that pairs perfectly with tallow without competing.",benefits:{antiaging:2,moisturizing:3,barrier:2},
     tips:{low:"Subtle marula — mostly adding slip and a silky finish.",mid:"Good balance — moisturizing activity noticeable, absorbs clean.",high:"Marula-forward formula — very elegant feel, great for all skin types."}},
    {id:"sesame",name:"Sesame",desc:"Natural SPF ~4, sesamol is a potent antioxidant. Ayurvedic staple used for millennia on skin.",benefits:{antioxidant:3,antiinflammatory:2,barrier:1},
     tips:{low:"Mild antioxidant boost — subtle UV defense layer.",mid:"Solid antioxidant presence — sesamol working actively.",high:"Strong sesame presence — good antioxidant shield but slight nutty scent note."}},
    {id:"baobab",name:"Baobab",desc:"Perfectly balanced omega 3-6-9 profile. Very stable oil with long shelf life — adds velvety skin feel.",benefits:{moisturizing:3,barrier:3,softening:2},
     tips:{low:"Light barrier support — softening effect begins.",mid:"Good barrier reinforcement — omega balance starting to show.",high:"Baobab-dominant — exceptional barrier and very stable formula."}},
    {id:"argan",name:"Argan",desc:"High in squalene and vitamin E naturally. Absorbs clean with no residue. Widely studied.",benefits:{antiaging:2,brightening:2,moisturizing:2},
     tips:{low:"Light argan presence — subtle brightening and slip.",mid:"Good working level — anti-aging and brightening active.",high:"Argan-forward — well-rounded anti-aging carrier, slightly premium feel."}},
    {id:"almond",name:"Sweet almond",desc:"Gentlest carrier oil available. High in oleic and linoleic. Excellent for sensitive or reactive skin.",benefits:{softening:3,barrier:2,soothing:3},
     tips:{low:"Mild softening — good base note for sensitive formulas.",mid:"Noticeably gentle and soothing — ideal sensitive skin dose.",high:"Very gentle formula — maximally soothing, great for baby or eczema skin."}},
    {id:"apricot",name:"Apricot kernel",desc:"Similar to almond but lighter. High gamma-linolenic acid. Good facial carrier for mature skin.",benefits:{brightening:2,antiaging:1,softening:2},
     tips:{low:"Light brightening touch — subtle glow effect.",mid:"Good balance — brightening and softening both active.",high:"Apricot-dominant A — lightweight, brightening formula."}},
    {id:"hemp",name:"Hemp seed",desc:"Perfect 3:1 omega 6:3 ratio mirrors healthy skin lipids. Non-comedogenic. Strong for inflammation.",benefits:{acne:3,antiinflammatory:3,barrier:2},
     tips:{low:"Gentle anti-inflammatory support — mild acne defense.",mid:"Good anti-acne dose — omega balance actively supporting skin.",high:"Hemp-dominant — this is now an anti-inflammatory, anti-acne focused formula."}},
    {id:"avocado",name:"Avocado",desc:"Penetrates deep skin layers. High in sterols and oleic acid. Best for very dry or cracked skin.",benefits:{moisturizing:3,barrier:3,healing:2},
     tips:{low:"Deep moisture hint — slightly heavier feel.",mid:"Good deep moisturizing dose — barrier and healing active.",high:"Rich, heavy formula — ideal for very dry, cracked or winter skin."}},
    {id:"pomegranate",name:"Pomegranate seed",desc:"Rare punicic acid (omega-5). Strong antioxidant. Supports collagen synthesis and skin regeneration.",benefits:{antiaging:3,brightening:3,antioxidant:3},
     tips:{low:"Trace collagen support — antioxidant activity begins.",mid:"Good anti-aging dose — punicic acid working on skin renewal.",high:"Pomegranate-dominant — premium anti-aging and brightening formula."}},
    {id:"seabuck",name:"Sea buckthorn",desc:"Exceptional omega-7, rare in plant oils. Powerful repair oil. Very orange — will tint the balm.",benefits:{healing:3,barrier:3,antiaging:2},
     tips:{low:"Trace repair activity — minimal tinting at this level.",mid:"Good repair dose — omega-7 active, slight orange tint likely.",high:"Strong sea buckthorn — powerful repair but significant orange pigment. Patch test color."}},
    {id:"chia",name:"Chia seed",desc:"One of the highest plant sources of omega-3. Soothing and film-forming. Relatively new in cosmetics.",benefits:{barrier:3,antiinflammatory:2,moisturizing:2},
     tips:{low:"Gentle omega-3 addition — light film-forming effect.",mid:"Good barrier and soothing dose.",high:"Chia-dominant A — strong omega-3 barrier formula."}},
    {id:"squalane",name:"Squalane",desc:"Hydrogenated squalene — weightless slip, biomimetic to skin lipids. Stable and almost scent-free; non-comedogenic for most.",benefits:{barrier:3,moisturizing:3,softening:2,antiaging:2},
     tips:{low:"Trace silkiness — improves spread without weight.",mid:"Noticeably elegant, skin-identical feel.",high:"Squalane-forward A — refined texture that stays behind your EO story."}},
    {id:"grapeseed",name:"Grapeseed",desc:"High linoleic, light dry-touch oil. Popular on oilier or congestion-prone skin; relatively fast to oxidize — lean on vitamin E in base.",benefits:{acne:2,barrier:2,antioxidant:2,moisturizing:1},
     tips:{low:"Light astringent slip — minimal heaviness.",mid:"Good linoleic support for blemish-prone skin.",high:"Grapeseed-dominant — very light; use fresh, quality oil."}},
    {id:"meadowfoam",name:"Meadowfoam",desc:"Long-chain fatty acids — extends oxidative life of softer oils, adds cushioned film without heavy greasiness.",benefits:{barrier:3,moisturizing:2,softening:2},
     tips:{low:"Subtle extender — helps protect fragile oils in the mix.",mid:"Good cushion and stability contribution.",high:"Meadowfoam-forward — plush, long-wearing after-feel."}},
    {id:"ricebran",name:"Rice bran",desc:"Gamma-oryzanol and ferulic acid — brightening-leaning antioxidant support. Medium body; classic in Asian skin care.",benefits:{brightening:2,antioxidant:3,moisturizing:2,antiaging:1},
     tips:{low:"Light nutrient boost for tone and oxidative cover.",mid:"Working antioxidant dose — pairs with vitamin E.",high:"Rice bran–heavy — richer feel, stronger brightening story."}},
    {id:"sunflower",name:"Sunflower (high linoleic)",desc:"Linoleic-rich grades support barrier repair; neutral, affordable carrier when cosmetic-grade and cold-pressed.",benefits:{barrier:3,soothing:2,moisturizing:2},
     tips:{low:"Gentle barrier filler — stays behind the scent.",mid:"Solid linoleic support for compromised barriers.",high:"Sunflower-dominant — economical, calming base."}},
    {id:"macadamia",name:"Macadamia",desc:"Palmitoleic acid (omega-7) mirrors youthful skin sebum — lush on mature or very dry skin, silky dry-down.",benefits:{moisturizing:3,antiaging:2,softening:3,barrier:2},
     tips:{low:"Hint of richness — subtle mature-skin support.",mid:"Good omega-7 dose — silky, nourishing.",high:"Macadamia-led — lush, elegant dry-skin formula."}},
    {id:"eveprim",name:"Evening primrose",desc:"GLA-rich — traditional support for hormonal skin, redness, and barrier stress when the oil is fresh.",benefits:{antiinflammatory:3,barrier:2,soothing:2,healing:1},
     tips:{low:"Gentle GLA hint — mild calming.",mid:"Meaningful GLA activity — soothing barrier support.",high:"Primrose-forward — watch freshness (polyunsaturated)."}},
    {id:"borage",name:"Borage",desc:"Among the highest dietary GLA sources — intense for very dry, flaky, or stressed skin; heavier feel.",benefits:{barrier:3,moisturizing:3,antiinflammatory:2,healing:2},
     tips:{low:"Light GLA addition.",mid:"Strong barrier and calming dose.",high:"Borage-dominant — very rich; winter or dermatitis-prone angle."}},
    {id:"pricklypear",name:"Prickly pear seed",desc:"Luxury line — very high tocopherols and linoleic acid; fast absorption, dry finish, strong antioxidant story.",benefits:{antioxidant:3,brightening:2,barrier:2,antiaging:2},
     tips:{low:"Trace luxury antioxidant.",mid:"Clear antioxidant + tone support.",high:"Prickly pear–led — premium, serum-light major carrier."}},
    {id:"watermelon",name:"Watermelon seed",desc:"Ultra-light ‘dry’ oil — high linoleic, minimal shine; good when you want Ingredient A without heaviness.",benefits:{acne:2,moisturizing:1,barrier:2,softening:2},
     tips:{low:"Barely-there slip.",mid:"Featherweight texture for congestion-prone skin.",high:"Watermelon-dominant — major carrier that still feels weightless."}},
  ],
  b:[
    {id:"blackseed",name:"Black seed",potency:"strong",desc:"Thymoquinone is the active — one of the most potent anti-inflammatory plant compounds known. Strong scent.",benefits:{acne:3,antiinflammatory:3,antimicrobial:3},
     tips:{low:"Safe working dose — thymoquinone active without overwhelming scent.",mid:"Strong medicinal presence — very effective but scent becomes noticeable.",high:"Maximum black seed — highly therapeutic but will challenge your EO scent significantly."}},
    {id:"neem",name:"Neem",potency:"strong",desc:"Powerful antibacterial and antifungal. Traditional wound-healing. Very pungent — needs strong EO masking.",benefits:{acne:3,antifungal:3,antimicrobial:3},
     tips:{low:"Minimal neem — antimicrobial effect present, scent manageable.",mid:"Strong neem activity — effective but requires heavy EO masking.",high:"Dominant neem — maximum antimicrobial but very hard to mask scent. Use cautiously."}},
    {id:"tamanu",name:"Tamanu",potency:"moderate",desc:"Calophyllolide is the key active. One of the best oils in the world for scar tissue remodeling. Deep green.",benefits:{scarring:3,healing:3,antiinflammatory:2},
     tips:{low:"Light tamanu — scar activity begins, subtle green tint.",mid:"Good scar-remodeling dose — calophyllolide working well.",high:"Strong tamanu presence — elite scarring formula, noticeable green tint."}},
    {id:"karanja",name:"Karanja",potency:"moderate",desc:"Natural SPF ~20. Pongamol is the active. Milder scent than neem, similar antimicrobial profile.",benefits:{acne:2,antiinflammatory:2,antioxidant:1},
     tips:{low:"Light UV and antimicrobial support.",mid:"Good sun-defense and anti-acne dose.",high:"Strong karanja — significant UV protection layer added to the formula."}},
    {id:"turmeric",name:"Turmeric CO2",potency:"strong",desc:"Curcumin is the active — potent anti-inflammatory and brightener. Will stain yellow — dilute carefully.",benefits:{brightening:3,antiinflammatory:3,antioxidant:3},
     tips:{low:"Trace curcumin — brightening begins, minimal staining.",mid:"Good brightening and anti-inflammatory — slight yellow tint to balm.",high:"Strong turmeric — maximum brightening but significant yellow pigment. Check skin staining."}},
    {id:"bakuchiol",name:"Bakuchiol",potency:"moderate",desc:"Plant-based retinol alternative. Same receptor activity without irritation or photosensitivity.",benefits:{antiaging:3,firming:3,healing:2},
     tips:{low:"Gentle retinol-like activity — good for daily use intro.",mid:"Good anti-aging dose — firming and cell renewal active.",high:"Strong bakuchiol — maximum plant retinol effect, safe even for sensitive skin."}},
    {id:"calendula",name:"Calendula",potency:"mild",desc:"Faradiol is the key active. One of the gentlest and most soothing botanicals. Baby skin safe.",benefits:{soothing:3,healing:3,barrier:2},
     tips:{low:"Gentle soothing touch — good for sensitive base.",mid:"Good calming and healing dose — barrier support active.",high:"Calendula-dominant B — maximally soothing, ideal for reactive or baby skin formulas."}},
    {id:"moringa",name:"Moringa",potency:"mild",desc:"Behenic acid gives unusual cleansing properties for an oil. Very stable, long shelf life.",benefits:{antioxidant:2,brightening:2,barrier:1},
     tips:{low:"Light antioxidant and cleansing touch.",mid:"Good antioxidant presence — mild brightening effect.",high:"Strong moringa — good cleansing and antioxidant layer."}},
    {id:"camellia",name:"Camellia seed",potency:"mild",desc:"Traditional Japanese geisha oil. High oleic, absorbs very fast, extremely elegant skin feel.",benefits:{antiaging:2,moisturizing:2,brightening:1},
     tips:{low:"Trace elegance — subtle fast-absorbing quality.",mid:"Good camellia dose — noticeably elegant, fast-absorbing formula.",high:"Camellia-dominant B — very elegant, fast-absorbing finish. Japanese artisan quality."}},
    {id:"gotukola",name:"Gotu kola (Centella)",potency:"moderate",desc:"Asiaticoside / madecassoside family — traditional firmness, scar, and circulation herb; mild earthy green note.",benefits:{firming:3,healing:3,antiaging:2,scarring:2},
     tips:{low:"Intro centella without dominating scent.",mid:"Solid firming and repair tone.",high:"Centella-heavy B — intentional herbal direction; patch-test tint on fair balm."}},
    {id:"buriti",name:"Buriti",potency:"strong",desc:"Extremely rich in beta-carotene — barrier and photo-damage narrative; deep orange-red — will color the balm strongly.",benefits:{antioxidant:3,barrier:3,healing:2,antiaging:2},
     tips:{low:"Trace carotenoid glow — warm tint begins.",mid:"Noticeable orange tone — patch-test skin and fabrics.",high:"Buriti-led — treat as color cosmetic adjuvant; reserve for specialty SKUs."}},
    {id:"andiroba",name:"Andiroba",potency:"moderate",desc:"Amazonian limonoid-rich oil — traditional use for irritation, muscle, and outdoor skin; distinctive forest note.",benefits:{antiinflammatory:3,moisturizing:2,barrier:2,healing:2},
     tips:{low:"Mild rainforest herbal presence.",mid:"Good irritation-support dose.",high:"Andiroba-forward — pair with wood, resin, or spice EOs."}},
    {id:"raspberry",name:"Raspberry seed",potency:"mild",desc:"Ellagic acid and EFAs — literature on UV-absorbing fractions (not a replacement for sunscreen). Light, luxury feel.",benefits:{antioxidant:3,barrier:2,antiaging:1},
     tips:{low:"Outdoor-athlete antioxidant angle.",mid:"Stronger antioxidant story — still not SPF.",high:"Raspberry seed–led — ‘second line’ after daily SPF habits."}},
    {id:"coffeeoil",name:"Green coffee",potency:"mild",desc:"Chlorogenic acid / caffeine traces — firming and ‘de-puff’ folklore; roasty aroma builds with share.",benefits:{antioxidant:2,brightening:1,firming:2},
     tips:{low:"Subtle eye-area / toning story.",mid:"Roasty note emerges.",high:"Coffee-heavy B — lean into mocha with vanilla, cacao, or spice EOs."}},
    {id:"pumpkin",name:"Pumpkin seed",potency:"mild",desc:"Zinc and phytosterols — mineral-rich soothing nutrition; warm nutty scent.",benefits:{barrier:2,soothing:2,moisturizing:2,healing:1},
     tips:{low:"Mineral-rich nuance.",mid:"Good soothing nutrition dose.",high:"Pumpkin-led — cozy nutty carrier; beautiful in autumn gourmand scents."}},
  ],
  c: getFormulaBuilderCList(),
  eo: getFormulaBuilderEoList()
};

const FB_COLORS={tallow:"#B4B2A9",beeswax:"#FAC775",jojoba:"#97C459",vite:"#F0997B",a0:"#85B7EB",a1:"#5DCAA5",a2:"#AFA9EC",a3:"#ED93B1",b0:"#D85A30",b1:"#993C1D",b2:"#BA7517",c0:"#C4A574",c1:"#6F4E37",c2:"#D4C4A8",eo0:"#534AB7",eo1:"#3C3489",eo2:"#7F77DD",eo3:"#0F6E56",eo4:"#185FA5",eo5:"#993556"};
const BENEFIT_LABELS=["antiaging","moisturizing","barrier","scarring","brightening","acne","antiinflammatory","antioxidant","healing","soothing","calming","regenerating","firming","softening","antimicrobial","antifungal"];
const FB_BENEFIT_COLORS={antiaging:"#534AB7",moisturizing:"#1D9E75",barrier:"#639922",scarring:"#D85A30",brightening:"#FAC775",acne:"#185FA5",antiinflammatory:"#0F6E56",antioxidant:"#BA7517",healing:"#5DCAA5",soothing:"#AFA9EC",calming:"#ED93B1",regenerating:"#7F77DD",firming:"#D4537E",softening:"#9FE1CB",antimicrobial:"#6B4E9E",antifungal:"#2E6B5C"};

var fbMode="face",fbBatchSize=100,fbPools={a:[],b:[],c:[],eo:[]},fbIdCtr=0;
var fbProduct="balm",fbCPct=0.08;

/** Bar fill % of track: visual ∝ sqrt(p/100), p in 0–100; normalized so largest row fills track. Ordering preserved. */
function fbSqrtBarWidthNorm(pPercent, maxSqrtScale){
  var v=Math.sqrt(Math.max(0,pPercent)/100);
  var mx=maxSqrtScale>0?maxSqrtScale:1e-9;
  return Math.min(100,Math.round((v/mx)*1000)/10);
}

function fbSetMode(el,m){document.querySelectorAll("#panel-builder .fb-mbtn").forEach(b=>b.classList.remove("active"));el.classList.add("active");fbMode=m;document.getElementById("fb-eoPoolPct").textContent=(m==="face"?"1":"2")+"% of batch";fbUpdate();}
function fbSetProduct(el,p){
  document.querySelectorAll("#panel-builder .fb-product-btn").forEach(b=>b.classList.remove("active"));
  el.classList.add("active");
  fbProduct=p;
  var ex=document.getElementById("fb-exfoliator-block");
  if(ex)ex.hidden=(p!=="scrub");
  if(p==="balm"){fbPools.c=[];fbRenderPool("c");}
  else{fbEnsureCSeed();fbRenderPool("c");}
  fbUpdate();
}
function fbEnsureCSeed(){
  if(fbPools.c.length)return;
  var first=FB_ING.c[0];
  if(first)fbPools.c.push({id:fbIdCtr++,ingId:first.id,weight:5});
}
document.getElementById("fb-batchSize").addEventListener("input",function(){fbBatchSize=+this.value;document.getElementById("fb-batchSizeVal").textContent=fbBatchSize+" ml";fbUpdate();});
(function(){
  var cs=document.getElementById("fb-c-strength");
  if(!cs)return;
  cs.addEventListener("input",function(){
    fbCPct=+this.value/100;
    var el=document.getElementById("fb-c-strength-val");
    if(el)el.textContent=this.value+"%";
    fbUpdate();
  });
})();

function fbAddIng(pool){
  const limits={a:4,b:3,c:3,eo:12};
  if(fbPools[pool].length>=limits[pool])return;
  const used=fbPools[pool].map(r=>r.ingId);
  const avail=FB_ING[pool].filter(i=>!used.includes(i.id));
  if(!avail.length)return;
  fbPools[pool].push({id:fbIdCtr++,ingId:avail[0].id,weight:5});
  fbRenderPool(pool);fbUpdate();
}

function fbRemoveIng(pool,id){fbPools[pool]=fbPools[pool].filter(r=>r.id!==id);fbRenderPool(pool);fbUpdate();}

function fbGetTipLevel(weight){return weight<=3?"low":weight<=7?"mid":"high";}

function fbRenderPool(pool){
  const container=document.getElementById("fb-"+pool+"Pool");
  if(!container)return;
  container.innerHTML="";
  const f=fbCalcFormula();
  const split=pool==="a"?f.aSplit:pool==="b"?f.bSplit:pool==="c"?f.cSplit:f.eoSplit;

  fbPools[pool].forEach((row,i)=>{
    const ing=FB_ING[pool].find(x=>x.id===row.ingId);
    const splitRow=split.find(s=>s.id===row.id);
    const pct=splitRow?(splitRow.pct*100).toFixed(1):"—";
    const ml=splitRow?(splitRow.pct*fbBatchSize).toFixed(1):"—";

    const block=document.createElement("div");block.className="fb-ing-block";

    const top=document.createElement("div");top.className="fb-ing-top";
    const sel=document.createElement("select");
    const used=fbPools[pool].filter(r=>r.id!==row.id).map(r=>r.ingId);
    FB_ING[pool].forEach(opt=>{const o=document.createElement("option");o.value=opt.id;o.textContent=opt.name;if(used.includes(opt.id))o.disabled=true;if(opt.id===row.ingId)o.selected=true;sel.appendChild(o);});
    sel.addEventListener("change",function(){row.ingId=this.value;fbRenderPool(pool);fbUpdate();});

    const pctSpan=document.createElement("span");pctSpan.className="fb-ing-pct";pctSpan.id="fb-pct_"+row.id;pctSpan.textContent=pct+"%";
    const mlSpan=document.createElement("span");mlSpan.className="fb-ing-ml";mlSpan.id="fb-ml_"+row.id;mlSpan.textContent=ml+"ml";
    const rm=document.createElement("button");rm.type="button";rm.className="fb-remove-btn";rm.setAttribute("aria-label","Remove");rm.textContent="×";rm.addEventListener("click",()=>fbRemoveIng(pool,row.id));
    top.appendChild(sel);top.appendChild(pctSpan);top.appendChild(mlSpan);top.appendChild(rm);

    const sliderRow=document.createElement("div");sliderRow.className="fb-slider-row";
    const sliderLabel=document.createElement("span");sliderLabel.className="fb-slider-label";sliderLabel.textContent="share";
    const slider=document.createElement("input");slider.type="range";slider.min=1;slider.max=10;slider.step=1;slider.value=row.weight;
    slider.addEventListener("input",function(){row.weight=+this.value;fbUpdateInlineOnly(pool,row.id,this.value);fbUpdate();});
    sliderRow.appendChild(sliderLabel);sliderRow.appendChild(slider);

    const desc=document.createElement("div");desc.className="fb-ing-desc";desc.textContent=ing?ing.desc:"";

    const tipLevel=fbGetTipLevel(row.weight);
    const tipText=ing&&ing.tips?ing.tips[tipLevel]:"";
    const tipClass=tipLevel==="low"?"fb-tip-low":tipLevel==="mid"?"fb-tip-mid":ing&&ing.potency==="strong"&&tipLevel==="high"?"fb-tip-warn":"fb-tip-high";
    const tip=document.createElement("div");tip.className="fb-ing-tip "+tipClass;tip.id="fb-tip_"+row.id;tip.textContent=tipText;

    block.appendChild(top);block.appendChild(sliderRow);block.appendChild(desc);block.appendChild(tip);
    container.appendChild(block);
  });
}

function fbUpdateInlineOnly(pool,rowId,weight){
  const tipLevel=fbGetTipLevel(+weight);
  const row=fbPools[pool].find(r=>r.id===rowId);
  if(!row)return;
  const ing=FB_ING[pool]?FB_ING[pool].find(x=>x.id===row.ingId):null;
  const tipEl=document.getElementById("fb-tip_"+rowId);
  if(tipEl&&ing&&ing.tips){
    tipEl.textContent=ing.tips[tipLevel]||"";
    tipEl.className="fb-ing-tip "+(tipLevel==="low"?"fb-tip-low":tipLevel==="mid"?"fb-tip-mid":ing.potency==="strong"&&tipLevel==="high"?"fb-tip-warn":"fb-tip-high");
  }
}

function fbCalcFormula(){
  const eoPct=fbMode==="face"?0.01:0.02;
  const vitE=0.004;
  function split(rows,total){const tw=rows.reduce((s,r)=>s+r.weight,0)||1;return rows.map(r=>({...r,pct:total*r.weight/tw}));}
  if(fbProduct==="balm"){
    const fixed=[{name:"Tallow",pct:0.58,color:FB_COLORS.tallow},{name:"Beeswax",pct:0.08,color:FB_COLORS.beeswax},{name:"Jojoba",pct:0.11,color:FB_COLORS.jojoba},{name:"Vitamin E",pct:vitE,color:FB_COLORS.vite}];
    return{fixed,aSplit:split(fbPools.a,0.13),bSplit:split(fbPools.b,0.06),cSplit:[],eoSplit:split(fbPools.eo,eoPct),eoPct,cPct:0,scale:1,product:"balm"};
  }
  var cPct=Math.min(0.15,Math.max(0.05,fbCPct));
  var baseNom=0.96;
  var rem=1-vitE-eoPct-cPct;
  if(rem<0.02)rem=0.02;
  var scale=rem/baseNom;
  var fixed=[{name:"Tallow",pct:0.58*scale,color:FB_COLORS.tallow},{name:"Beeswax",pct:0.08*scale,color:FB_COLORS.beeswax},{name:"Jojoba",pct:0.11*scale,color:FB_COLORS.jojoba},{name:"Vitamin E",pct:vitE,color:FB_COLORS.vite}];
  var cSplit=fbPools.c.length?split(fbPools.c,cPct):[];
  return{fixed,aSplit:split(fbPools.a,0.13*scale),bSplit:split(fbPools.b,0.06*scale),cSplit,eoSplit:split(fbPools.eo,eoPct),eoPct,cPct,scale,product:"scrub"};
}

function fbUpdate(){
  const f=fbCalcFormula();
  var la=document.getElementById("fb-label-a-pct");
  var lb=document.getElementById("fb-label-b-pct");
  if(la)la.textContent=f.product==="scrub"?(100*0.13*f.scale).toFixed(1)+"% of batch (scaled)":"13% of batch";
  if(lb)lb.textContent=f.product==="scrub"?(100*0.06*f.scale).toFixed(1)+"% of batch (scaled)":"6% of batch";
  var cp=document.getElementById("fb-c-pool-pct");
  if(cp&&f.product==="scrub")cp.textContent=(100*f.cPct).toFixed(0)+"% of batch (Ingredient C)";
  [...f.aSplit,...f.bSplit,...f.cSplit,...f.eoSplit].forEach(row=>{
    const pe=document.getElementById("fb-pct_"+row.id);const me=document.getElementById("fb-ml_"+row.id);
    if(pe)pe.textContent=(row.pct*100).toFixed(1)+"%";
    if(me)me.textContent=(row.pct*fbBatchSize).toFixed(1)+"ml";
  });
  fbUpdateBeaker(f);fbUpdateRatios(f);fbUpdateBenefits(f);fbUpdateSynergies(f);fbUpdateWarnings(f);
}

function fbUpdateBeaker(f){
  const layers=document.getElementById("fb-beakerLayers");layers.innerHTML="";
  const all=[...f.fixed,...f.aSplit.map((r,i)=>({name:FB_ING.a.find(x=>x.id===r.ingId)?.name||"A",pct:r.pct,color:FB_COLORS["a"+i]||"#85B7EB"})),...f.bSplit.map((r,i)=>({name:FB_ING.b.find(x=>x.id===r.ingId)?.name||"B",pct:r.pct,color:FB_COLORS["b"+i]||"#D85A30"})),...f.cSplit.map((r,i)=>({name:FB_ING.c.find(x=>x.id===r.ingId)?.name||"C",pct:r.pct,color:FB_COLORS["c"+i]||"#C4A574"})),...f.eoSplit.map((r,i)=>({name:FB_ING.eo.find(x=>x.id===r.ingId)?.name||"EO",pct:r.pct,color:FB_COLORS["eo"+i]||"#534AB7"}))];
  const total=all.reduce((s,r)=>s+r.pct,0)||1;
  let y=20+230;
  all.forEach(layer=>{const h=Math.max(2,(layer.pct/total)*230);y-=h;const rect=document.createElementNS("http://www.w3.org/2000/svg","rect");rect.setAttribute("x","31");rect.setAttribute("y",y.toFixed(1));rect.setAttribute("width","118");rect.setAttribute("height",h.toFixed(1));rect.setAttribute("fill",layer.color);rect.setAttribute("opacity","0.85");layers.appendChild(rect);});
}

function fbUpdateRatios(f){
  const list=document.getElementById("fb-ratioList");list.innerHTML="";
  const all=[...f.fixed.map(r=>({name:r.name,pct:r.pct,color:r.color})),...f.aSplit.map((r,i)=>({name:FB_ING.a.find(x=>x.id===r.ingId)?.name||"A",pct:r.pct,color:FB_COLORS["a"+i]||"#85B7EB"})),...f.bSplit.map((r,i)=>({name:FB_ING.b.find(x=>x.id===r.ingId)?.name||"B",pct:r.pct,color:FB_COLORS["b"+i]||"#D85A30"})),...f.cSplit.map((r,i)=>({name:FB_ING.c.find(x=>x.id===r.ingId)?.name||"C",pct:r.pct,color:FB_COLORS["c"+i]||"#C4A574"})),...f.eoSplit.map((r,i)=>({name:FB_ING.eo.find(x=>x.id===r.ingId)?.name||"EO",pct:r.pct,color:FB_COLORS["eo"+i]||"#534AB7"}))];
  const maxSqrt=Math.max.apply(null,all.map(r=>Math.sqrt(Math.max(0,r.pct*100)/100)).concat([1e-9]));
  all.forEach(r=>{
    const pPct=r.pct*100;
    const w=fbSqrtBarWidthNorm(pPct,maxSqrt);
    const tip=`${r.name}: ${pPct.toFixed(2)}% of batch · ${(r.pct*fbBatchSize).toFixed(2)} ml (bar uses √% scale for visibility)`;
    const row=document.createElement("div");row.className="fb-ratio-row";
    row.innerHTML=`<div class="fb-ratio-dot" style="background:${r.color}"></div><div class="fb-ratio-name">${r.name}</div><div class="fb-ratio-bar-wrap" title="${tip.replace(/"/g,'&quot;')}"><div class="fb-ratio-bar-fill" style="width:${w}%;background:${r.color}" title="${tip.replace(/"/g,'&quot;')}"></div></div><div class="fb-ratio-ml">${(r.pct*fbBatchSize).toFixed(1)}ml</div><div class="fb-ratio-pct">${pPct.toFixed(1)}%</div>`;
    list.appendChild(row);
  });
}

function fbUpdateBenefits(f){
  const scores={};BENEFIT_LABELS.forEach(b=>scores[b]=0);
  const add=(list,pool,w)=>list.forEach(r=>{const ing=FB_ING[pool].find(x=>x.id===r.ingId);if(!ing)return;Object.entries(ing.benefits||{}).forEach(([b,v])=>{scores[b]=(scores[b]||0)+v*r.pct*w;});});
  add(f.aSplit,"a",1);add(f.bSplit,"b",1.5);add(f.cSplit,"c",1.2);add(f.eoSplit,"eo",2);
  const max=Math.max(...Object.values(scores),0.001);
  const sorted=BENEFIT_LABELS.filter(b=>scores[b]>0).sort((a,b)=>scores[b]-scores[a]).slice(0,8);
  const cont=document.getElementById("fb-benefitBars");cont.innerHTML="";
  if(!sorted.length){cont.innerHTML='<div style="font-size:12px;color:var(--color-text-tertiary)">Add ingredients to see benefits</div>';return;}
  const benefitPcts=sorted.map(b=>Math.round((scores[b]/max)*100));
  const maxSqrtBen=Math.max.apply(null,benefitPcts.map(p=>Math.sqrt(Math.max(0,p)/100)).concat([1e-9]));
  sorted.forEach((b,i)=>{
    const pct=benefitPcts[i];
    const w=fbSqrtBarWidthNorm(pct,maxSqrtBen);
    const col=FB_BENEFIT_COLORS[b]||"#888780";
    const tip=`${b}: ${pct}% vs top benefit (bar √%-scaled for visibility)`;
    const esc=tip.replace(/"/g,'&quot;');
    const row=document.createElement("div");row.className="fb-benefit-row";
    row.innerHTML=`<div class="fb-benefit-label">${b}</div><div class="fb-benefit-track" title="${esc}"><div class="fb-benefit-fill" style="width:${w}%;background:${col}" title="${esc}"></div></div><div class="fb-benefit-score">${pct}%</div>`;
    cont.appendChild(row);
  });
}

function fbUpdateSynergies(f){
  const cont=document.getElementById("fb-synergyList");cont.innerHTML="";
  const eoIds=f.eoSplit.map(r=>r.ingId),aIds=f.aSplit.map(r=>r.ingId),bIds=f.bSplit.map(r=>r.ingId),cIds=f.cSplit.map(r=>r.ingId);
  const hasAny=aIds.length+bIds.length+eoIds.length>0||cIds.length>0;
  const F=function(e,ks){return ks.some(function(k){return e.indexOf(k)>=0;});};
  const frank=F(eoIds,["frankincense","frankincense_co2"]);
  const rose=F(eoIds,["rose_otto","rose_abs","rose_co2"]);
  const vanilla=F(eoIds,["vanilla_abs","vanilla_co2","vanilla_oleo"]);
  const benz=F(eoIds,["benzoin_abs","benzoin_resinoid"]);
  const carrot=F(eoIds,["carrotseed","carrot_co2"]);
  const lav=F(eoIds,["lavender","lavender_co2"]);
  const msgs=[];
  if(eoIds.includes("neroli")&&frank)msgs.push({t:"good",m:"Neroli + frankincense (incl. CO₂) — exceptional anti-aging synergy"});
  if(eoIds.includes("neroli")&&carrot)msgs.push({t:"good",m:"Neroli + carrot (seed or CO₂) — brightening powerhouse"});
  if(eoIds.includes("neroli")&&eoIds.includes("geranium"))msgs.push({t:"good",m:"Neroli + geranium — balanced floral, sebum control"});
  if(eoIds.includes("neroli")&&eoIds.includes("patchouli"))msgs.push({t:"good",m:"Neroli + patchouli — scent anchor; vanilla absolute pairs per editorial gourmand"});
  if(vanilla&&eoIds.includes("neroli")&&eoIds.includes("patchouli"))msgs.push({t:"good",m:"Vanilla + neroli + patchouli — classic west-coast gourmand-floral"});
  if(eoIds.includes("helichrysum")&&bIds.includes("tamanu"))msgs.push({t:"good",m:"Helichrysum + tamanu — elite scarring formula"});
  if(lav&&bIds.includes("calendula"))msgs.push({t:"good",m:"Lavender (dist. or CO₂) + calendula B — maximally soothing"});
  if(eoIds.includes("chamomile")&&bIds.includes("calendula"))msgs.push({t:"good",m:"Roman chamomile EO + calendula B — strong anti-inflammatory pairing"});
  if(lav&&(eoIds.includes("chamomile")||eoIds.includes("chamomile_german")))msgs.push({t:"good",m:"Lavender + chamomile — calm stack; German may tint blue"});
  if(frank&&eoIds.includes("sandalwood"))msgs.push({t:"good",m:"Frankincense (incl. CO₂) + sandalwood — classic resinous base"});
  if(frank&&lav)msgs.push({t:"good",m:"Frankincense + lavender (incl. CO₂) — resin-floral balance"});
  if(frank&&eoIds.includes("helichrysum"))msgs.push({t:"good",m:"Frankincense + helichrysum — repair and elasticity"});
  if(eoIds.includes("frankincense")&&eoIds.includes("frankincense_co2"))msgs.push({t:"info",m:"Frankincense EO + CO₂ — stacked boswellic story; label honestly"});
  if(lav&&eoIds.includes("lavender_co2"))msgs.push({t:"info",m:"Lavender distillate + CO₂ — layered lavender body"});
  if(eoIds.includes("teatree")&&lav)msgs.push({t:"good",m:"Tea tree + lavender — balanced antimicrobial accord"});
  if(eoIds.includes("bluetansy")&&(eoIds.includes("chamomile")||eoIds.includes("chamomile_german")))msgs.push({t:"good",m:"Blue tansy + chamomile — max blue calm (cost + color)"});
  if(eoIds.includes("copaiba")&&eoIds.includes("palmarosa"))msgs.push({t:"good",m:"Copaiba + palmarosa — rosy hydration amplifier"});
  if(eoIds.includes("rosemary")&&(eoIds.includes("cedarwood")||eoIds.includes("cedarwood_virg")))msgs.push({t:"good",m:"Rosemary + cedarwood (Atlas or Virginian) — forest cologne"});
  if(vanilla&&eoIds.includes("sandalwood"))msgs.push({t:"good",m:"Vanilla (abs / CO₂ / oleoresin) + sandalwood — creamy luxury"});
  if(vanilla&&benz)msgs.push({t:"good",m:"Vanilla + benzoin (abs or resinoid) — double vanillic fixative"});
  if(vanilla&&(eoIds.includes("sweetorange")||eoIds.includes("mandarin")))msgs.push({t:"good",m:"Vanilla + soft citrus — creamsicle direction"});
  if(eoIds.includes("bergamotfcf")&&lav)msgs.push({t:"good",m:"Bergamot FCF + lavender — cologne-floral calm"});
  if(eoIds.includes("petitgrain")&&eoIds.includes("neroli"))msgs.push({t:"good",m:"Petitgrain + neroli — same-tree completeness"});
  if(eoIds.includes("jasmineabs")&&eoIds.includes("sandalwood"))msgs.push({t:"good",m:"Jasmine absolute + sandalwood — attar elegance"});
  if(eoIds.includes("howood")&&lav)msgs.push({t:"good",m:"Ho wood + lavender — soft linalool stack"});
  if(eoIds.includes("geranium")&&lav)msgs.push({t:"good",m:"Geranium + lavender — fresh rosy herbal"});
  if(rose&&eoIds.includes("geranium"))msgs.push({t:"good",m:"Rose (otto / abs / CO₂) + geranium — lush floral"});
  if(eoIds.includes("patchouli")&&lav)msgs.push({t:"good",m:"Patchouli + lavender — woody-floral anchor"});
  if(aIds.includes("rosehip")&&carrot)msgs.push({t:"good",m:"Rosehip A + carrot (EO or CO₂) — vitamin-A direction"});
  if(aIds.includes("rosehip")&&frank)msgs.push({t:"good",m:"Rosehip + frankincense — regeneration support"});
  if(aIds.includes("pomegranate")&&frank)msgs.push({t:"good",m:"Pomegranate + frankincense — collagen-focused"});
  if(bIds.includes("bakuchiol")&&frank)msgs.push({t:"good",m:"Bakuchiol + frankincense — plant retinol + resin"});
  if(aIds.includes("hemp")&&bIds.includes("blackseed"))msgs.push({t:"good",m:"Hemp + black seed — serious anti-acne, anti-inflammatory formula"});
  if(aIds.includes("rosehip")&&bIds.includes("tamanu"))msgs.push({t:"good",m:"Rosehip + tamanu — powerful scarring and skin repair combo"});
  if(aIds.includes("pomegranate")&&bIds.includes("gotukola"))msgs.push({t:"good",m:"Pomegranate + gotu kola — collagen + firmness stack"});
  if(bIds.includes("raspberry")&&carrot)msgs.push({t:"good",m:"Raspberry seed B + carrot EO/CO₂ — outdoor antioxidant angle"});
  if(bIds.includes("blackseed")&&bIds.includes("neem"))msgs.push({t:"warn",m:"Black seed + neem — very strong scent stack, lower both sliders"});
  if(bIds.includes("turmeric")&&bIds.includes("blackseed"))msgs.push({t:"warn",m:"Turmeric + black seed both strong — keep each at minimum weight"});
  if(eoIds.includes("yylang"))msgs.push({t:"warn",m:"Ylang ylang — keep total batch share near ~0.8% (sensitizer guidance)"});
  if(eoIds.includes("clarysage"))msgs.push({t:"warn",m:"Clary sage — avoid in pregnancy / estrogen-sensitive users"});
  if(eoIds.includes("sage"))msgs.push({t:"warn",m:"Common sage EO — thujone / pregnancy caution; not clary sage"});
  if(eoIds.includes("jasmineabs"))msgs.push({t:"warn",m:"Jasmine absolute — sensitizer; micro-dose and patch-test"});
  if(eoIds.includes("clove")||eoIds.includes("clove_co2"))msgs.push({t:"warn",m:"Clove — eugenol / IFRA dermal caps; strong sensitizer"});
  if(eoIds.includes("cinnamon_leaf"))msgs.push({t:"warn",m:"Cinnamon leaf — hot; respect dermal caps; never substitute bark"});
  if(eoIds.includes("oakmoss"))msgs.push({t:"warn",m:"Oakmoss — IFRA-restricted; legal cosmetic diligence"});
  if(eoIds.includes("peru_balsam")||eoIds.includes("tolu_balsam"))msgs.push({t:"warn",m:"Peru / tolu balsam — allergy cross-reactivity; patch-test"});
  if(F(eoIds,["lemon","lime","grapefruit","angelica"]))msgs.push({t:"warn",m:"Phototoxic / restricted citrus or root — verify grade (FCF, distilled) + sun"});
  if(eoIds.includes("chamomile_german"))msgs.push({t:"warn",m:"German chamomile — azulene may tint balm blue"});
  if(eoIds.includes("turmeric_co2")||eoIds.includes("turmeric_eo"))msgs.push({t:"warn",m:"Turmeric in EO list — yellow stain risk"});
  if(eoIds.includes("seabuck_co2"))msgs.push({t:"warn",m:"Sea buckthorn CO₂ — may still tint gold"});
  if(f.eoSplit.length>=4)msgs.push({t:"warn",m:"4+ EOs — structure as top/mid/base to avoid scent clash"});
  if(f.eoSplit.length>=2&&f.eoSplit.length<4)msgs.push({t:"info",m:"Several EOs — assign top / heart / base roles so the scent reads clearly in balm."});
  if(aIds.includes("seabuck"))msgs.push({t:"warn",m:"Sea buckthorn — will visibly tint the balm orange"});
  if(bIds.includes("buriti"))msgs.push({t:"warn",m:"Buriti — intense orange-red tint; treat like a color cosmetic"});
  if(aIds.includes("turmeric")||bIds.includes("turmeric"))msgs.push({t:"warn",m:"Turmeric CO2 — will stain yellow, patch-test on skin before use"});
  if(f.product==="scrub"){
    msgs.push({t:"info",m:"Exfoliator mode — tallow / wax / jojoba / A / B are scaled down so Ingredient C (5–15%) + EO + vitamin E fit ~100%."});
    if(cIds.includes("oat_flour")&&cIds.includes("clay_polish"))msgs.push({t:"good",m:"Oat + clay — gentle buff with oil control story"});
    if(cIds.includes("sugar")&&cIds.includes("coffee_grounds"))msgs.push({t:"good",m:"Sugar + coffee — body scrub bestseller vibe; watch pressure"});
    if(cIds.includes("walnut_apricot")&&(cIds.includes("coffee_grounds")||cIds.includes("baking_soda")))msgs.push({t:"warn",m:"Walnut/shell + another abrasive — keep total mechanical exfoliation conservative"});
    if(f.cPct>=0.12)msgs.push({t:"warn",m:"High C-phase (≥12%) — strong scrub; advise body-first or experienced users"});
  }
  var strongBids=["blackseed","neem","turmeric"];
  if(bIds.some(function(id){return strongBids.indexOf(id)>=0;}))msgs.push({t:"info",m:"Strong B-phase oil(s) — citrus, resin, or spice EOs usually mask medicinal bases best."});
  if(!hasAny){
    cont.innerHTML='<div class="fb-synergy-item fb-synergy-info">· Add carriers, actives, and EOs with + above. This panel lists curated pairs, cautions, and a short blend summary.</div>';
    return;
  }
  if(!msgs.length)msgs.push({t:"info",m:"No named library pair matched this exact mix — that is normal. Use sliders and the colored tips under each oil (left) for guidance."});
  msgs.push({t:"info",m:"Blend snapshot: "+f.product+" · "+f.aSplit.length+" A · "+f.bSplit.length+" B"+(f.cSplit.length?" · "+f.cSplit.length+" C":"")+"   · "+f.eoSplit.length+" EO"});
  msgs.forEach(function(m){
    var d=document.createElement("div");
    var cls="fb-synergy-item ";
    var pre="";
    if(m.t==="good"){cls+="fb-synergy-good";pre="✓ ";}
    else if(m.t==="warn"){cls+="fb-synergy-warn";pre="! ";}
    else{cls+="fb-synergy-info";pre="· ";}
    d.className=cls;
    d.textContent=pre+m.m;
    cont.appendChild(d);
  });
}

function fbUpdateWarnings(f){
  const strongB=f.bSplit.filter(r=>FB_ING.b.find(x=>x.id===r.ingId)?.potency==="strong");
  document.getElementById("fb-bWarning").innerHTML=strongB.length>=2?'<div class="fb-warn">Two strong B oils combined — potency stacks. Lower both sliders to minimum.</div>':"";
  document.getElementById("fb-aWarning").innerHTML="";
  var cw=document.getElementById("fb-cWarning");
  if(cw)cw.innerHTML=f.product==="scrub"&&!f.cSplit.length?'<div class="fb-warn">Choose exfoliants for Ingredient C — pool is empty.</div>':"";
  document.getElementById("fb-eoWarning").innerHTML=f.eoSplit.length>=10?'<div class="fb-warn">10+ EOs — structure as top/mid/base notes to keep scent coherent.</div>':"";
  const unsatA=["rosehip","hemp","pomegranate","seabuck","chia","grapeseed","eveprim","borage","pricklypear","watermelon","ricebran","sunflower"];
  const unsatB=["blackseed","tamanu","turmeric","raspberry","buriti","andiroba"];
  const hasUnsat=f.aSplit.some(r=>unsatA.indexOf(r.ingId)>=0)||f.bSplit.some(r=>unsatB.indexOf(r.ingId)>=0);
  document.getElementById("fb-statShelf").textContent=hasUnsat?"8–10mo":"12–18mo";
  document.getElementById("fb-statTotal").textContent=fbBatchSize;
}

fbRenderPool("a");fbRenderPool("b");fbRenderPool("c");fbRenderPool("eo");
fbUpdate();
