
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
  ],
  eo:[
    {id:"neroli",name:"Neroli",desc:"Linalool and nerolidol drive skin cell regeneration. One of the finest floral EOs in existence.",benefits:{antiaging:3,brightening:2,regenerating:3,calming:2},
     tips:{low:"Delicate neroli presence — scent hint and gentle regenerating activity.",mid:"Good neroli dose — beautiful scent and active skin regeneration.",high:"Neroli-dominant blend — your signature scent. Luxurious and highly regenerating."}},
    {id:"lavender",name:"Lavender",desc:"Most studied EO for skin. Linalyl acetate is the calming active. Works for almost every skin concern.",benefits:{calming:3,acne:2,healing:2,soothing:3},
     tips:{low:"Gentle calming background note.",mid:"Classic lavender presence — calming and healing well balanced.",high:"Lavender-forward blend — strongly calming and skin-healing."}},
    {id:"frankincense",name:"Frankincense",desc:"Boswellic acids support skin cell regeneration and elasticity. Earthy resinous base note.",benefits:{antiaging:3,scarring:3,regenerating:2},
     tips:{low:"Subtle resinous depth — light anti-aging activity.",mid:"Good frankincense dose — regeneration and anti-aging active, adds depth to scent.",high:"Frankincense-dominant — deeply anti-aging, strong resinous scent note."}},
    {id:"rose",name:"Rose otto",desc:"Geraniol and citronellol are the actives. Extremely potent — tiny amount goes very far. Expensive.",benefits:{antiaging:2,brightening:2,calming:3,moisturizing:2},
     tips:{low:"Correct use of rose otto — potent even at low share.",mid:"Strong rose presence — beautiful but expensive. Watch cost per batch.",high:"Rose-dominant — very intense, this will cost significantly. Consider dropping share."}},
    {id:"helichrysum",name:"Helichrysum",desc:"Neryl acetate drives regeneration. Called liquid gold for skin repair. Outstanding for scarring.",benefits:{scarring:3,antiaging:3,regenerating:3},
     tips:{low:"Good starting dose — helichrysum is potent even at low share.",mid:"Strong repair and regeneration — this is the sweet spot for helichrysum.",high:"Helichrysum-dominant — elite repair formula, also expensive at high share."}},
    {id:"geranium",name:"Geranium",desc:"Balances sebum production. Rosy floral scent pairs beautifully with neroli. Good hormonal skin support.",benefits:{acne:2,antiaging:1,brightening:1,soothing:2},
     tips:{low:"Light floral bridge — complements neroli gently.",mid:"Good sebum balancing — rosy note blends well in your scent profile.",high:"Geranium-forward — strong sebum control and dominant rosy-floral scent."}},
    {id:"chamomile",name:"Roman chamomile",desc:"Isobutyl angelate is the active. Strongest anti-inflammatory EO for skin. Very calming on reactive skin.",benefits:{soothing:3,antiinflammatory:3,calming:3},
     tips:{low:"Gentle anti-inflammatory — good sensitive skin support.",mid:"Strong calming presence — reactive and rosacea skin will love this.",high:"Chamomile-dominant — maximally anti-inflammatory. Formula very suited to sensitive skin."}},
    {id:"carrotseed",name:"Carrot seed",desc:"High carotol — powerful antioxidant and skin toner. Often paired with neroli in anti-aging blends.",benefits:{antiaging:3,brightening:3,regenerating:2},
     tips:{low:"Light brightening and antioxidant note.",mid:"Good anti-aging and brightening — carotol working actively.",high:"Carrot seed-dominant — strong brightening and toning. Earthy note becomes noticeable."}},
    {id:"patchouli",name:"Patchouli",desc:"Patchouli alcohol is regenerative. Deep earthy base note — excellent fixative that extends scent life.",benefits:{antiaging:2,healing:2,moisturizing:1},
     tips:{low:"Perfect use of patchouli — anchors the blend without dominating.",mid:"Good fixative presence — scent longevity significantly extended.",high:"Strong patchouli — scent becomes earthy-dominant. Intentional or reduce share."}},
    {id:"sandalwood",name:"Sandalwood",desc:"Alpha-santalol is the key active. Deeply moisturizing and toning. Long-lasting on skin. Expensive.",benefits:{moisturizing:3,antiaging:2,calming:2},
     tips:{low:"Subtle creamy-woody base note — good fixative at this level.",mid:"Good sandalwood presence — moisturizing and toning active, adds warmth.",high:"Sandalwood-forward — beautiful but costly at high share. Creamy woody scent dominant."}},
    {id:"yylang",name:"Ylang ylang",desc:"Balances sebum and adds rich floral depth. Sensitizer above 0.8% of total batch — keep share low.",benefits:{acne:2,antiaging:1},
     tips:{low:"Safe range for ylang — floral depth without sensitization risk.",mid:"Approaching limit — monitor total batch % to stay under 0.8%.",high:"Danger zone — ylang ylang at high share within EO pool risks sensitization. Lower this."}},
    {id:"clarysage",name:"Clary sage",desc:"Sclareol mimics estrogen — great for hormonal acne and skin. Avoid during pregnancy.",benefits:{acne:2,antiinflammatory:2,calming:1},
     tips:{low:"Gentle hormonal skin support.",mid:"Good sclareol activity — hormonal acne addressed.",high:"Strong clary sage — effective for hormonal skin but ensure no pregnant users."}},
  ]
};

const FB_COLORS={tallow:"#B4B2A9",beeswax:"#FAC775",jojoba:"#97C459",vite:"#F0997B",a0:"#85B7EB",a1:"#5DCAA5",a2:"#AFA9EC",a3:"#ED93B1",b0:"#D85A30",b1:"#993C1D",b2:"#BA7517",eo0:"#534AB7",eo1:"#3C3489",eo2:"#7F77DD",eo3:"#0F6E56",eo4:"#185FA5",eo5:"#993556"};
const BENEFIT_LABELS=["antiaging","moisturizing","barrier","scarring","brightening","acne","antiinflammatory","antioxidant","healing","soothing","calming","regenerating","firming","softening"];
const FB_BENEFIT_COLORS={antiaging:"#534AB7",moisturizing:"#1D9E75",barrier:"#639922",scarring:"#D85A30",brightening:"#FAC775",acne:"#185FA5",antiinflammatory:"#0F6E56",antioxidant:"#BA7517",healing:"#5DCAA5",soothing:"#AFA9EC",calming:"#ED93B1",regenerating:"#7F77DD",firming:"#D4537E",softening:"#9FE1CB"};

var fbMode="face",fbBatchSize=100,fbPools={a:[],b:[],eo:[]},fbIdCtr=0;

/** Bar fill % of track: visual ∝ sqrt(p/100), p in 0–100; normalized so largest row fills track. Ordering preserved. */
function fbSqrtBarWidthNorm(pPercent, maxSqrtScale){
  var v=Math.sqrt(Math.max(0,pPercent)/100);
  var mx=maxSqrtScale>0?maxSqrtScale:1e-9;
  return Math.min(100,Math.round((v/mx)*1000)/10);
}

function fbSetMode(el,m){document.querySelectorAll("#panel-builder .fb-mbtn").forEach(b=>b.classList.remove("active"));el.classList.add("active");fbMode=m;document.getElementById("fb-eoPoolPct").textContent=(m==="face"?"1":"2")+"% of batch";fbUpdate();}
document.getElementById("fb-batchSize").addEventListener("input",function(){fbBatchSize=+this.value;document.getElementById("fb-batchSizeVal").textContent=fbBatchSize+" ml";fbUpdate();});

function fbAddIng(pool){
  const limits={a:4,b:3,eo:6};
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
  container.innerHTML="";
  const f=fbCalcFormula();
  const split=pool==="a"?f.aSplit:pool==="b"?f.bSplit:f.eoSplit;

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
  const ing=FB_ING[pool].find(x=>x.id===row.ingId);
  const tipEl=document.getElementById("fb-tip_"+rowId);
  if(tipEl&&ing&&ing.tips){
    tipEl.textContent=ing.tips[tipLevel]||"";
    tipEl.className="fb-ing-tip "+(tipLevel==="low"?"fb-tip-low":tipLevel==="mid"?"fb-tip-mid":ing.potency==="strong"&&tipLevel==="high"?"fb-tip-warn":"fb-tip-high");
  }
}

function fbCalcFormula(){
  const eoPct=fbMode==="face"?0.01:0.02;
  const fixed=[{name:"Tallow",pct:0.58,color:FB_COLORS.tallow},{name:"Beeswax",pct:0.08,color:FB_COLORS.beeswax},{name:"Jojoba",pct:0.11,color:FB_COLORS.jojoba},{name:"Vitamin E",pct:0.004,color:FB_COLORS.vite}];
  function split(rows,total){const tw=rows.reduce((s,r)=>s+r.weight,0)||1;return rows.map(r=>({...r,pct:total*r.weight/tw}));}
  return{fixed,aSplit:split(fbPools.a,0.13),bSplit:split(fbPools.b,0.06),eoSplit:split(fbPools.eo,eoPct),eoPct};
}

function fbUpdate(){
  const f=fbCalcFormula();
  [...f.aSplit,...f.bSplit,...f.eoSplit].forEach(row=>{
    const pe=document.getElementById("fb-pct_"+row.id);const me=document.getElementById("fb-ml_"+row.id);
    if(pe)pe.textContent=(row.pct*100).toFixed(1)+"%";
    if(me)me.textContent=(row.pct*fbBatchSize).toFixed(1)+"ml";
  });
  fbUpdateBeaker(f);fbUpdateRatios(f);fbUpdateBenefits(f);fbUpdateSynergies(f);fbUpdateWarnings(f);
}

function fbUpdateBeaker(f){
  const layers=document.getElementById("fb-beakerLayers");layers.innerHTML="";
  const all=[...f.fixed,...f.aSplit.map((r,i)=>({name:FB_ING.a.find(x=>x.id===r.ingId)?.name||"A",pct:r.pct,color:FB_COLORS["a"+i]||"#85B7EB"})),...f.bSplit.map((r,i)=>({name:FB_ING.b.find(x=>x.id===r.ingId)?.name||"B",pct:r.pct,color:FB_COLORS["b"+i]||"#D85A30"})),...f.eoSplit.map((r,i)=>({name:FB_ING.eo.find(x=>x.id===r.ingId)?.name||"EO",pct:r.pct,color:FB_COLORS["eo"+i]||"#534AB7"}))];
  const total=all.reduce((s,r)=>s+r.pct,0)||1;
  let y=20+230;
  all.forEach(layer=>{const h=Math.max(2,(layer.pct/total)*230);y-=h;const rect=document.createElementNS("http://www.w3.org/2000/svg","rect");rect.setAttribute("x","31");rect.setAttribute("y",y.toFixed(1));rect.setAttribute("width","118");rect.setAttribute("height",h.toFixed(1));rect.setAttribute("fill",layer.color);rect.setAttribute("opacity","0.85");layers.appendChild(rect);});
}

function fbUpdateRatios(f){
  const list=document.getElementById("fb-ratioList");list.innerHTML="";
  const all=[...f.fixed.map(r=>({name:r.name,pct:r.pct,color:r.color})),...f.aSplit.map((r,i)=>({name:FB_ING.a.find(x=>x.id===r.ingId)?.name||"A",pct:r.pct,color:FB_COLORS["a"+i]||"#85B7EB"})),...f.bSplit.map((r,i)=>({name:FB_ING.b.find(x=>x.id===r.ingId)?.name||"B",pct:r.pct,color:FB_COLORS["b"+i]||"#D85A30"})),...f.eoSplit.map((r,i)=>({name:FB_ING.eo.find(x=>x.id===r.ingId)?.name||"EO",pct:r.pct,color:FB_COLORS["eo"+i]||"#534AB7"}))];
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
  add(f.aSplit,"a",1);add(f.bSplit,"b",1.5);add(f.eoSplit,"eo",2);
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
  const eoIds=f.eoSplit.map(r=>r.ingId),aIds=f.aSplit.map(r=>r.ingId),bIds=f.bSplit.map(r=>r.ingId);
  const msgs=[];
  if(eoIds.includes("neroli")&&eoIds.includes("frankincense"))msgs.push({t:"good",m:"Neroli + frankincense — exceptional anti-aging synergy"});
  if(eoIds.includes("neroli")&&eoIds.includes("carrotseed"))msgs.push({t:"good",m:"Neroli + carrot seed — brightening powerhouse"});
  if(eoIds.includes("neroli")&&eoIds.includes("geranium"))msgs.push({t:"good",m:"Neroli + geranium — balanced floral, sebum control"});
  if(eoIds.includes("neroli")&&eoIds.includes("patchouli"))msgs.push({t:"good",m:"Neroli + patchouli — scent beautifully anchored and long-lasting"});
  if(eoIds.includes("helichrysum")&&bIds.includes("tamanu"))msgs.push({t:"good",m:"Helichrysum + tamanu — elite scarring formula"});
  if(eoIds.includes("lavender")&&bIds.includes("calendula"))msgs.push({t:"good",m:"Lavender + calendula — maximally soothing, sensitive skin"});
  if(eoIds.includes("chamomile")&&bIds.includes("calendula"))msgs.push({t:"good",m:"Chamomile + calendula — strongest anti-inflammatory combo"});
  if(aIds.includes("rosehip")&&eoIds.includes("carrotseed"))msgs.push({t:"good",m:"Rosehip + carrot seed — double vitamin A anti-aging action"});
  if(aIds.includes("pomegranate")&&eoIds.includes("frankincense"))msgs.push({t:"good",m:"Pomegranate + frankincense — collagen-focused formula"});
  if(bIds.includes("bakuchiol")&&eoIds.includes("frankincense"))msgs.push({t:"good",m:"Bakuchiol + frankincense — plant retinol-alternative blend"});
  if(aIds.includes("hemp")&&bIds.includes("blackseed"))msgs.push({t:"good",m:"Hemp + black seed — serious anti-acne, anti-inflammatory formula"});
  if(aIds.includes("rosehip")&&bIds.includes("tamanu"))msgs.push({t:"good",m:"Rosehip + tamanu — powerful scarring and skin repair combo"});
  if(bIds.includes("blackseed")&&bIds.includes("neem"))msgs.push({t:"warn",m:"Black seed + neem — very strong scent stack, lower both sliders"});
  if(bIds.includes("turmeric")&&bIds.includes("blackseed"))msgs.push({t:"warn",m:"Turmeric + black seed both strong — keep each at minimum weight"});
  if(eoIds.includes("yylang"))msgs.push({t:"warn",m:"Ylang ylang in blend — verify its share stays under 0.8% of total batch"});
  if(eoIds.includes("clarysage"))msgs.push({t:"warn",m:"Clary sage — do not use in formulas for pregnant users"});
  if(f.eoSplit.length>=4)msgs.push({t:"warn",m:"4+ EOs — structure as top/mid/base to avoid scent clash"});
  if(aIds.includes("seabuck"))msgs.push({t:"warn",m:"Sea buckthorn — will visibly tint the balm orange"});
  if(aIds.includes("turmeric")||bIds.includes("turmeric"))msgs.push({t:"warn",m:"Turmeric CO2 — will stain yellow, patch-test on skin before use"});
  if(!msgs.length){cont.innerHTML='<div class="fb-synergy-item" style="color:var(--color-text-tertiary)">Add ingredients to see notes</div>';return;}
  msgs.forEach(m=>{const d=document.createElement("div");d.className="fb-synergy-item "+(m.t==="good"?"fb-synergy-good":"fb-synergy-warn");d.textContent=(m.t==="good"?"✓ ":"! ")+m.m;cont.appendChild(d);});
}

function fbUpdateWarnings(f){
  const strongB=f.bSplit.filter(r=>FB_ING.b.find(x=>x.id===r.ingId)?.potency==="strong");
  document.getElementById("fb-bWarning").innerHTML=strongB.length>=2?'<div class="fb-warn">Two strong B oils combined — potency stacks. Lower both sliders to minimum.</div>':"";
  document.getElementById("fb-aWarning").innerHTML="";
  document.getElementById("fb-eoWarning").innerHTML=f.eoSplit.length>=5?'<div class="fb-warn">5+ EOs — structure as top/mid/base notes to keep scent coherent.</div>':"";
  const hasUnsat=f.aSplit.some(r=>["rosehip","hemp","pomegranate","seabuck","chia"].includes(r.ingId))||f.bSplit.some(r=>["blackseed","tamanu","turmeric"].includes(r.ingId));
  document.getElementById("fb-statShelf").textContent=hasUnsat?"8–10mo":"12–18mo";
  document.getElementById("fb-statTotal").textContent=fbBatchSize;
}

fbRenderPool("a");fbRenderPool("b");fbRenderPool("eo");
fbUpdate();
