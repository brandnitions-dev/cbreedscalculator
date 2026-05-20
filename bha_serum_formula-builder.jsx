/**
 * Reference prototype for The Purge — BHA Penetration Oil (absolute batch % sliders).
 * Canonical implementation: src/app/exfoliator/formula-builder.tsx + OIL_PRESETS.bha_penetrating in treatment-oils.ts
 */
import { useState } from "react";

const initIngredients = {
  carriers: [
    { id: "jojoba", name: "Jojoba Oil", pct: 62.8, min: 0, max: 91 },
    { id: "grapeseed", name: "Grapeseed Oil", pct: 12.6, min: 0, max: 91 },
    { id: "rosehip", name: "Rosehip Oil", pct: 15.7, min: 0, max: 91 },
  ],
  actives: [
    { id: "salicylic", name: "Salicylic Acid (pure)", pct: 6.2, min: 0, max: 10 },
    { id: "bakuchiol", name: "Bakuchiol", pct: 0.6, min: 0, max: 5 },
    { id: "bisabolol", name: "Alpha-Bisabolol", pct: 0.6, min: 0, max: 5 },
    { id: "vitE", name: "Vitamin E (Tocopherol)", pct: 0.6, min: 0, max: 5 },
  ],
  eos: [
    { id: "rosemaryEO", name: "Rosemary EO", pct: 1.0, min: 0, max: 5 },
  ],
};

function saFlag(id, pct) {
  if (id !== "salicylic") return null;
  if (pct <= 2) return { label: "Leave-on safe range", color: "#22c55e" };
  if (pct <= 3) return { label: "✓ Ideal for clinic steam-replacement", color: "#3b82f6" };
  if (pct <= 6) return { label: "⚠ Light peel territory — short contact only", color: "#f59e0b" };
  return { label: "🚫 Too high — chemical burn risk", color: "#ef4444" };
}

function Slider({ item, batch, onChange }) {
  const ml = ((item.pct / 100) * batch).toFixed(1);
  const flag = saFlag(item.id, item.pct);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
        <span style={{ color: "#e2e8f0" }}>{item.name}</span>
        <span style={{ fontFamily: "monospace", color: "#94a3b8" }}>
          {item.pct.toFixed(1)}% — {ml}ml
        </span>
      </div>
      <input
        type="range" min={item.min} max={item.max} step={0.1}
        value={item.pct}
        onChange={e => onChange(item.id, parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
      />
      {flag && (
        <div style={{ fontSize: 11, color: flag.color, marginTop: 2 }}>{flag.label}</div>
      )}
    </div>
  );
}

export default function FormulaBuilder() {
  const [batch, setBatch] = useState(100);
  const [carriers, setCarriers] = useState(initIngredients.carriers);
  const [actives, setActives] = useState(initIngredients.actives);
  const [eos, setEos] = useState(initIngredients.eos);

  const update = (setter, id, val) =>
    setter(prev => prev.map(i => i.id === id ? { ...i, pct: val } : i));

  const carrierTotal = carriers.reduce((s, i) => s + i.pct, 0);
  const activesTotal = actives.reduce((s, i) => s + i.pct, 0);
  const eosTotal = eos.reduce((s, i) => s + i.pct, 0);
  const grandTotal = carrierTotal + activesTotal + eosTotal;
  const totalOk = Math.abs(grandTotal - 100) < 0.5;

  const mono = { fontFamily: "monospace" };
  const label = { fontSize: 11, letterSpacing: 2, color: "#64748b", textTransform: "uppercase", marginBottom: 10 };
  const meta = { fontSize: 12, color: "#94a3b8", fontFamily: "monospace", lineHeight: 2 };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: "28px 24px", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "#6366f1", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Formula Base</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>The Purge — BHA Penetration Oil</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Pore Purge Blend (Clinical)</div>
        </div>

        <div style={{ background: "#1e293b", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={label}>Batch Size</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span>Batch</span>
            <span style={{ ...mono, color: "#6366f1", fontWeight: 700 }}>{batch}ml</span>
          </div>
          <input type="range" min={10} max={500} step={10} value={batch}
            onChange={e => setBatch(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={label}>🟢 Carrier Oils <span style={{ color: "#10b981" }}>{carrierTotal.toFixed(1)}%</span></div>
              {carriers.map(i => <Slider key={i.id} item={i} batch={batch} onChange={(id, v) => update(setCarriers, id, v)} />)}
            </div>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={label}>🟡 Actives <span style={{ color: "#f59e0b" }}>{activesTotal.toFixed(1)}%</span></div>
              {actives.map(i => <Slider key={i.id} item={i} batch={batch} onChange={(id, v) => update(setActives, id, v)} />)}
            </div>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: 16 }}>
              <div style={label}>🟣 Essential Oils <span style={{ color: "#a78bfa" }}>{eosTotal.toFixed(1)}%</span></div>
              {eos.map(i => <Slider key={i.id} item={i} batch={batch} onChange={(id, v) => update(setEos, id, v)} />)}
            </div>
          </div>

          <div style={{ background: "#1e293b", borderRadius: 12, padding: 16 }}>
            <div style={label}>📋 Live Metadata</div>
            <div style={meta}>
              <div style={{ color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>BATCH</div>
              <div>Size: {batch}ml</div>
              <div>Total: <span style={{ color: totalOk ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{grandTotal.toFixed(1)}% {totalOk ? "✓" : "⚠ not 100%"}</span></div>

              <div style={{ borderTop: "1px solid #334155", margin: "10px 0" }} />
              <div style={{ color: "#10b981", fontWeight: 700, marginBottom: 4 }}>CARRIERS — {carrierTotal.toFixed(1)}% / {((carrierTotal/100)*batch).toFixed(1)}ml</div>
              {carriers.map(i => (
                <div key={i.id}>{i.name}: {i.pct.toFixed(1)}% → {((i.pct/100)*batch).toFixed(1)}ml</div>
              ))}

              <div style={{ borderTop: "1px solid #334155", margin: "10px 0" }} />
              <div style={{ color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>ACTIVES — {activesTotal.toFixed(1)}% / {((activesTotal/100)*batch).toFixed(1)}ml</div>
              {actives.map(i => {
                const flag = saFlag(i.id, i.pct);
                return (
                  <div key={i.id}>
                    {i.name}: {i.pct.toFixed(1)}% → {((i.pct/100)*batch).toFixed(1)}ml
                    {flag && <span style={{ color: flag.color }}> {flag.label}</span>}
                  </div>
                );
              })}

              <div style={{ borderTop: "1px solid #334155", margin: "10px 0" }} />
              <div style={{ color: "#a78bfa", fontWeight: 700, marginBottom: 4 }}>EOS — {eosTotal.toFixed(1)}% / {((eosTotal/100)*batch).toFixed(1)}ml</div>
              {eos.map(i => (
                <div key={i.id}>{i.name}: {i.pct.toFixed(1)}% → {((i.pct/100)*batch).toFixed(1)}ml</div>
              ))}

              <div style={{ borderTop: "1px solid #334155", margin: "10px 0" }} />
              <div style={{ color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>RATIOS</div>
              <div>Carriers : Actives : EOS</div>
              <div style={{ color: "#f1f5f9", fontWeight: 700 }}>{carrierTotal.toFixed(1)} : {activesTotal.toFixed(1)} : {eosTotal.toFixed(1)}</div>
              <div>Active load: <span style={{ color: activesTotal > 8 ? "#ef4444" : activesTotal > 5 ? "#f59e0b" : "#22c55e", fontWeight: 700 }}>{activesTotal > 8 ? "Heavy ⚠" : activesTotal > 5 ? "Medium" : "Light ✓"}</span></div>
              <div>EO safety: <span style={{ color: eosTotal > 3 ? "#ef4444" : eosTotal > 2 ? "#f59e0b" : "#22c55e", fontWeight: 700 }}>{eosTotal > 3 ? "⚠ Too high" : eosTotal > 2 ? "Caution" : "✓ Safe"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
