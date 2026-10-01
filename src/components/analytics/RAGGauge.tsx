interface RAGGaugeProps { score: number; }

export function RAGGauge({ score }: RAGGaugeProps) {
  const s = Math.max(0, Math.min(100, score));
  const cx = 120, cy = 110, r = 80;

  // Arc from left (cx-r, cy) clockwise through top to right (cx+r, cy)
  // angle in radians: PI = left, 0 = right, mapped by score
  const toPoint = (pct: number) => {
    const angle = Math.PI - (pct / 100) * Math.PI;
    return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
  };

  const arcD = (from: number, to: number, radius = r, thick = 14) => {
    const p1 = toPoint(from);
    const p2 = toPoint(to);
    const p1i = { x: cx + (radius - thick) * Math.cos(Math.PI - (from / 100) * Math.PI), y: cy - (radius - thick) * Math.sin(Math.PI - (from / 100) * Math.PI) };
    const p2i = { x: cx + (radius - thick) * Math.cos(Math.PI - (to / 100) * Math.PI), y: cy - (radius - thick) * Math.sin(Math.PI - (to / 100) * Math.PI) };
    const large = (to - from) > 50 ? 1 : 0;
    return [
      `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
      `A ${radius} ${radius} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
      `L ${p2i.x.toFixed(2)} ${p2i.y.toFixed(2)}`,
      `A ${radius - thick} ${radius - thick} 0 ${large} 0 ${p1i.x.toFixed(2)} ${p1i.y.toFixed(2)}`,
      'Z',
    ].join(' ');
  };

  const fillD = (from: number, to: number, radius = r, thick = 14) => {
    if (to <= from) return '';
    const p1 = toPoint(from);
    const p2 = toPoint(to);
    const p1i = { x: cx + (radius - thick) * Math.cos(Math.PI - (from / 100) * Math.PI), y: cy - (radius - thick) * Math.sin(Math.PI - (from / 100) * Math.PI) };
    const p2i = { x: cx + (radius - thick) * Math.cos(Math.PI - (to / 100) * Math.PI), y: cy - (radius - thick) * Math.sin(Math.PI - (to / 100) * Math.PI) };
    const large = (to - from) > 50 ? 1 : 0;
    return [
      `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
      `A ${radius} ${radius} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
      `L ${p2i.x.toFixed(2)} ${p2i.y.toFixed(2)}`,
      `A ${radius - thick} ${radius - thick} 0 ${large} 0 ${p1i.x.toFixed(2)} ${p1i.y.toFixed(2)}`,
      'Z',
    ].join(' ');
  };

  // Needle
  const nAngle = Math.PI - (s / 100) * Math.PI;
  const nx = cx + 60 * Math.cos(nAngle);
  const ny = cy - 60 * Math.sin(nAngle);

  const color = s >= 70 ? '#10B981' : s >= 40 ? '#F59E0B' : '#EF4444';
  const label = s >= 70 ? 'Healthy' : s >= 40 ? 'Caution' : 'Critical';

  // Zone label positions
  const redPt = toPoint(20);
  const ambPt = toPoint(55);
  const grnPt = toPoint(85);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <svg width={240} height={140} viewBox="0 0 240 140" overflow="visible">
        {/* Track zones */}
        <path d={arcD(0, 40)} fill="#FEE2E2" />
        <path d={arcD(40, 70)} fill="#FEF3C7" />
        <path d={arcD(70, 100)} fill="#D1FAE5" />

        {/* Active fill */}
        {s > 0 && <path d={fillD(0, Math.min(s, 40))} fill="#EF4444" />}
        {s > 40 && <path d={fillD(40, Math.min(s, 70))} fill="#F59E0B" />}
        {s > 70 && <path d={fillD(70, Math.min(s, 100))} fill="#10B981" />}

        {/* Zone labels */}
        <text x={redPt.x - 18} y={redPt.y - 6} style={{ fontSize: 12, fontFamily: 'Manrope', fontWeight: 700, fill: '#EF4444', textAnchor: 'middle' }}>Red</text>
        <text x={ambPt.x} y={ambPt.y - 10} style={{ fontSize: 12, fontFamily: 'Manrope', fontWeight: 700, fill: '#F59E0B', textAnchor: 'middle' }}>Amber</text>
        <text x={grnPt.x + 16} y={grnPt.y - 6} style={{ fontSize: 12, fontFamily: 'Manrope', fontWeight: 700, fill: '#10B981', textAnchor: 'middle' }}>Green</text>

        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx.toFixed(2)} y2={ny.toFixed(2)} stroke="#1A1D24" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={7} fill="#1A1D24" />
        <circle cx={cx} cy={cy} r={3.5} fill="#fff" />
      </svg>

      {/* Score */}
      <div style={{ textAlign: 'center', marginTop: -8 }}>
        <p style={{ fontSize: 34, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.02em' }}>{s}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color, marginTop: 2 }}>{label}</p>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', marginTop: 1 }}>Platform score / 100</p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: '0–40 Critical', color: '#EF4444' },
          { label: '40–70 Caution', color: '#F59E0B' },
          { label: '70+ Healthy', color: '#10B981' },
        ].map(z => (
          <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: z.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{z.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
