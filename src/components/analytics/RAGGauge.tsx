interface RAGGaugeProps { score: number; }

export function RAGGauge({ score }: RAGGaugeProps) {
  // SVG arc gauge, 180 degrees, score 0–100
  const clamp = Math.max(0, Math.min(100, score));
  const angle = (clamp / 100) * 180 - 90; // -90 = left, 90 = right

  // Zone boundaries: Red 0–40, Amber 40–70, Green 70–100
  const getZoneColor = (s: number) => s >= 70 ? '#10B981' : s >= 40 ? '#F59E0B' : '#EF4444';
  const getZoneLabel = (s: number) => s >= 70 ? 'Healthy' : s >= 40 ? 'Needs Attention' : 'Critical';
  const color = getZoneColor(clamp);
  const label = getZoneLabel(clamp);

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const cx = 110, cy = 105, r = 80;

  const arcPath = (startDeg: number, endDeg: number) => {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const needleAngle = angle;
  const needleRad = toRad(needleAngle);
  const nx = cx + 68 * Math.cos(needleRad);
  const ny = cy + 68 * Math.sin(needleRad);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={220} height={130} viewBox={`0 0 220 130`}>
        {/* Background track */}
        <path d={arcPath(180, 360)} fill="none" stroke="#F1F5F9" strokeWidth={16} strokeLinecap="round" />
        {/* Red zone 0–40 (180–252 deg) */}
        <path d={arcPath(180, 252)} fill="none" stroke="#FEE2E2" strokeWidth={16} />
        {/* Amber zone 40–70 (252–306 deg) */}
        <path d={arcPath(252, 306)} fill="none" stroke="#FEF3C7" strokeWidth={16} />
        {/* Green zone 70–100 (306–360 deg) */}
        <path d={arcPath(306, 360)} fill="none" stroke="#D1FAE5" strokeWidth={16} />
        {/* Active fill up to score */}
        <path d={arcPath(180, 180 + (clamp / 100) * 180)} fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1A1D24" strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={6} fill="#1A1D24" />
        <circle cx={cx} cy={cy} r={3} fill="#fff" />
        {/* Zone labels */}
        <text x={40} y={118} style={{ fontSize: 11, fontFamily: 'Manrope', fontWeight: 700, fill: '#EF4444' }}>Red</text>
        <text x={97} y={92} style={{ fontSize: 11, fontFamily: 'Manrope', fontWeight: 700, fill: '#F59E0B' }}>Amber</text>
        <text x={166} y={118} style={{ fontSize: 11, fontFamily: 'Manrope', fontWeight: 700, fill: '#10B981' }}>Green</text>
      </svg>

      {/* Score display */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{clamp}</p>
        <p style={{ fontSize: 12, fontWeight: 700, color, marginTop: 2 }}>{label}</p>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', marginTop: 2 }}>Out of 100</p>
      </div>

      {/* Threshold legend */}
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        {[
          { label: '0–40 Critical', color: '#EF4444' },
          { label: '40–70 Caution', color: '#F59E0B' },
          { label: '70–100 Healthy', color: '#10B981' },
        ].map(z => (
          <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: z.color }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{z.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
