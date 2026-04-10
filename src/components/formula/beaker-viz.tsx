'use client';

interface BeakerLayer {
  name: string;
  pct: number;
  color: string;
}

interface BeakerVizProps {
  layers: BeakerLayer[];
  className?: string;
}

export function BeakerViz({ layers, className }: BeakerVizProps) {
  const total = layers.reduce((s, l) => s + l.pct, 0) || 1;
  let y = 250;
  const rects: { y: number; h: number; color: string; name: string }[] = [];

  layers.forEach(layer => {
    const h = Math.max(2, (layer.pct / total) * 230);
    y -= h;
    rects.push({ y, h, color: layer.color, name: layer.name });
  });

  return (
    <div className={className}>
      <svg viewBox="0 0 180 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[180px] mx-auto" aria-hidden="true">
        <defs>
          <clipPath id="beaker-clip">
            <path d="M30,20 L30,220 Q30,250 90,250 Q150,250 150,220 L150,20 Z" />
          </clipPath>
        </defs>
        <path
          d="M30,20 L30,220 Q30,250 90,250 Q150,250 150,220 L150,20 Z"
          fill="none"
          stroke="rgba(148,163,184,0.2)"
          strokeWidth="1.5"
        />
        <line x1="20" y1="20" x2="160" y2="20" stroke="rgba(148,163,184,0.2)" strokeWidth="1.5" />
        <g clipPath="url(#beaker-clip)">
          {rects.map((r, i) => (
            <rect
              key={i}
              x="31"
              y={r.y.toFixed(1)}
              width="118"
              height={r.h.toFixed(1)}
              fill={r.color}
              opacity="0.85"
            />
          ))}
        </g>
        {[80, 120, 160, 200].map(y => (
          <line key={y} x1="40" y1={y} x2="50" y2={y} stroke="rgba(148,163,184,0.15)" strokeWidth="0.5" />
        ))}
      </svg>
    </div>
  );
}
