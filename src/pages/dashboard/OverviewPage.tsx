import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart as HBarChart, Bar as HBar
} from 'recharts';
import { Users, DollarSign, MapPin, ShieldAlert, TrendingUp, TrendingDown, ChevronRight, Calendar } from 'lucide-react';

/* ─── Revenue Data by Year with 3 Streams: Parents, Drivers & WalkShare ─── */
const REVENUE_BY_YEAR: Record<string, Array<{ month: string; parent: number; driver: number; walkshare: number }>> = {
  '2026': [
    { month: 'Jan', parent: 2200, driver: 4200, walkshare: 1100 },
    { month: 'Feb', parent: 2700, driver: 5100, walkshare: 1400 },
    { month: 'Mar', parent: 2600, driver: 4800, walkshare: 1250 },
    { month: 'Apr', parent: 3400, driver: 6200, walkshare: 1700 },
    { month: 'May', parent: 3200, driver: 5900, walkshare: 1600 },
    { month: 'Jun', parent: 3900, driver: 7100, walkshare: 1900 },
    { month: 'Jul', parent: 4600, driver: 8400, walkshare: 2200 },
    { month: 'Aug', parent: 4300, driver: 7800, walkshare: 2100 },
    { month: 'Sep', parent: 5100, driver: 9200, walkshare: 2600 },
    { month: 'Oct', parent: 4800, driver: 8700, walkshare: 2400 },
    { month: 'Nov', parent: 5700, driver: 10200, walkshare: 2900 },
    { month: 'Dec', parent: 6400, driver: 11400, walkshare: 3200 },
  ],
  '2025': [
    { month: 'Jan', parent: 1500, driver: 2800, walkshare: 750 },
    { month: 'Feb', parent: 1700, driver: 3200, walkshare: 850 },
    { month: 'Mar', parent: 1800, driver: 3400, walkshare: 900 },
    { month: 'Apr', parent: 2100, driver: 3900, walkshare: 1100 },
    { month: 'May', parent: 2300, driver: 4100, walkshare: 1150 },
    { month: 'Jun', parent: 2600, driver: 4600, walkshare: 1300 },
    { month: 'Jul', parent: 2900, driver: 5200, walkshare: 1450 },
    { month: 'Aug', parent: 2800, driver: 5000, walkshare: 1400 },
    { month: 'Sep', parent: 3400, driver: 6100, walkshare: 1700 },
    { month: 'Oct', parent: 3300, driver: 5900, walkshare: 1650 },
    { month: 'Nov', parent: 3800, driver: 6800, walkshare: 1900 },
    { month: 'Dec', parent: 4100, driver: 7400, walkshare: 2100 },
  ],
  '2024': [
    { month: 'Jan', parent: 800, driver: 1500, walkshare: 400 },
    { month: 'Feb', parent: 950, driver: 1700, walkshare: 450 },
    { month: 'Mar', parent: 1050, driver: 1900, walkshare: 500 },
    { month: 'Apr', parent: 1200, driver: 2200, walkshare: 600 },
    { month: 'May', parent: 1350, driver: 2400, walkshare: 650 },
    { month: 'Jun', parent: 1500, driver: 2700, walkshare: 750 },
    { month: 'Jul', parent: 1700, driver: 3100, walkshare: 850 },
    { month: 'Aug', parent: 1600, driver: 2900, walkshare: 800 },
    { month: 'Sep', parent: 2000, driver: 3600, walkshare: 1000 },
    { month: 'Oct', parent: 1900, driver: 3400, walkshare: 950 },
    { month: 'Nov', parent: 2200, driver: 3900, walkshare: 1100 },
    { month: 'Dec', parent: 2400, driver: 4300, walkshare: 1200 },
  ],
};

const userGrowthData = [
  { month: 'Jan', parents: 210, providers: 38 },
  { month: 'Feb', parents: 280, providers: 52 },
  { month: 'Mar', parents: 340, providers: 61 },
  { month: 'Apr', parents: 420, providers: 74 },
  { month: 'May', parents: 510, providers: 88 },
  { month: 'Jun', parents: 620, providers: 99 },
  { month: 'Jul', parents: 750, providers: 115 },
  { month: 'Aug', parents: 880, providers: 132 },
  { month: 'Sep', parents: 1020, providers: 148 },
  { month: 'Oct', parents: 1160, providers: 162 },
  { month: 'Nov', parents: 1248, providers: 176 },
];

const topEarners = [
  { name: 'Tariq Ahmed', amount: 2860 },
  { name: 'Farhana Yasmin', amount: 2410 },
  { name: 'Alex Rivera', amount: 2200 },
  { name: 'Kabir Hossain', amount: 1920 },
  { name: 'Sarah Jenkins', amount: 1580 },
  { name: 'Sophie Bouchard', amount: 1340 },
];

const userComposition = [
  { name: 'Parents', value: 1248, color: '#1B2B68' },
  { name: 'Drivers', value: 142, color: '#F2600C' },
  { name: 'Walkers', value: 34, color: '#10B981' },
];

const recentUsers = [
  { name: 'Amanda Roy', role: 'Parent', date: 'Sep 29, 2026', status: 'Active' },
  { name: 'Marcus Vance', role: 'Parent', date: 'Sep 28, 2026', status: 'Active' },
  { name: 'Kabir Hossain', role: 'Driver', date: 'Sep 28, 2026', status: 'Pending' },
  { name: 'Claire Dubois', role: 'Parent', date: 'Sep 27, 2026', status: 'Active' },
  { name: 'Sophie Bouchard', role: 'Walker', date: 'Sep 26, 2026', status: 'Active' },
];

const recentTx = [
  { user: 'Sarah Tremblay', package: 'Monthly Commute Pass', amount: '$19.99', status: 'Active', date: 'Sep 29, 2026' },
  { user: 'Amanda Roy', package: 'School Term Pass', amount: '$89.00', status: 'Active', date: 'Sep 28, 2026' },
  { user: 'Marcus Vance', package: 'Monthly Commute Pass', amount: '$19.99', status: 'Expired', date: 'Sep 28, 2026' },
  { user: 'Claire Dubois', package: 'Monthly Commute Pass', amount: '$19.99', status: 'Active', date: 'Sep 27, 2026' },
  { user: 'Jessica Taylor', package: 'Monthly Commute Pass', amount: '$19.99', status: 'Active', date: 'Sep 26, 2026' },
];

/* ─── Sub-components ─── */
const KPICard = ({ label, value, sub, trend, icon: Icon, accentColor }: {
  label: string; value: string; sub: string; trend: number;
  icon: React.ElementType; accentColor?: string;
}) => {
  const isUp = trend >= 0;
  return (
    <div style={{
      background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
      padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>{label}</p>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: accentColor ? `${accentColor}14` : '#EEF1FB',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={17} style={{ color: accentColor || '#1B2B68' }} strokeWidth={2} />
        </div>
      </div>
      <div>
        <p style={{ fontSize: 28, fontWeight: 800, color: '#1A1D24', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          {isUp ? (
            <TrendingUp size={13} style={{ color: '#10B981' }} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={13} style={{ color: '#EF4444' }} strokeWidth={2.5} />
          )}
          <span style={{ fontSize: 12, fontWeight: 700, color: isUp ? '#10B981' : '#EF4444' }}>
            {isUp ? '+' : ''}{trend}%
          </span>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8' }}>{sub}</span>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({
  title,
  children,
  action,
  extra,
}: {
  title: string;
  children: React.ReactNode;
  action?: string;
  extra?: React.ReactNode;
}) => (
  <div style={{
    background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
    overflow: 'hidden',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 22px', borderBottom: '1px solid #F1F5F9',
    }}>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1D24', margin: 0 }}>{title}</p>
      {extra && <div>{extra}</div>}
      {action && !extra && (
        <button style={{ fontSize: 12, fontWeight: 600, color: '#1B2B68', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
          {action} <ChevronRight size={12} />
        </button>
      )}
    </div>
    <div style={{ padding: '18px 22px' }}>{children}</div>
  </div>
);

const StatusChip = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; color: string }> = {
    Active: { bg: '#D1FAE5', color: '#065F46' },
    Pending: { bg: '#FEF3C7', color: '#92400E' },
    Expired: { bg: '#FEE2E2', color: '#991B1B' },
    Verified: { bg: '#DBEAFE', color: '#1E40AF' },
  };
  const s = map[status] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
      background: s.bg, color: s.color,
    }}>{status}</span>
  );
};

const RoleChip = ({ role }: { role: string }) => {
  const map: Record<string, string> = { Parent: '#1B2B68', Driver: '#F2600C', Walker: '#10B981' };
  const color = map[role] || '#64748B';
  return (
    <span style={{
      fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
      background: `${color}14`, color, border: `1px solid ${color}28`,
    }}>{role}</span>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  // Detect whether this dataset represents counts (e.g. User Growth) or currency (Revenue, Earnings)
  const isCount = payload.some((p: any) =>
    p.dataKey === 'parents' || p.dataKey === 'providers' || (p.name && p.name.toLowerCase().includes('user'))
  );

  // Compute total if more than 1 item in payload
  const total = payload.reduce((sum: number, p: any) => {
    const val = typeof p.value === 'number' ? p.value : parseFloat(p.value) || 0;
    return sum + val;
  }, 0);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 10px 25px -5px rgba(27, 43, 104, 0.12), 0 8px 10px -6px rgba(27, 43, 104, 0.08), 0 0 0 1px #E2E8F0',
        minWidth: 180,
        border: '1px solid #E2E8F0',
        pointerEvents: 'none',
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: '#1B2B68',
            marginBottom: 8,
            paddingBottom: 6,
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{label}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {isCount ? 'Active Users' : 'Revenue'}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {payload.map((p: any) => {
          const color = p.color || p.fill || p.stroke || '#1B2B68';
          const val = typeof p.value === 'number' ? p.value : parseFloat(p.value) || 0;
          const formattedVal = isCount ? `${val.toLocaleString()} users` : `$${val.toLocaleString()}`;

          return (
            <div
              key={p.name || p.dataKey}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                    boxShadow: `0 0 0 2px ${color}25`,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
                  {p.name || p.dataKey}
                </span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>
                {formattedVal}
              </span>
            </div>
          );
        })}
      </div>

      {payload.length > 1 && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 6,
            borderTop: '1px dashed #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>Total</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#1B2B68' }}>
            {isCount ? `${total.toLocaleString()} users` : `$${total.toLocaleString()}`}
          </span>
        </div>
      )}
    </div>
  );
};

/* ─── Main Page ─── */
export default function OverviewPage() {
  const [revenueYear, setRevenueYear] = useState('2026');
  const totalUsers = userComposition.reduce((a, b) => a + b.value, 0);

  const kpis = [
    { label: 'Total Revenue (MTD)', value: '$11,400', sub: 'vs last month', trend: 18.4, icon: DollarSign, accentColor: '#1B2B68' },
    { label: 'Active Users', value: '1,424', sub: 'vs last month', trend: 12.1, icon: Users, accentColor: '#F2600C' },
    { label: 'Completed Trips', value: '3,842', sub: 'vs last month', trend: 9.6, icon: MapPin, accentColor: '#10B981' },
    { label: 'Safety Incidents', value: '0', sub: 'Zero tolerance', trend: 0, icon: ShieldAlert, accentColor: '#6366F1' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1D24', marginBottom: 2 }}>Overview</h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>Thu, Oct 1 2026 • Morning Peak Active</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((k, i) => (
          <KPICard key={i} {...k} />
        ))}
      </div>

      {/* Charts Row 1: Revenue Breakdown (with Year Filter & 3 Roles) + User Growth */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 16 }}>
        <SectionCard
          title="Revenue Breakdown"
          extra={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={14} style={{ color: '#64748B' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Year:</span>
              <select
                value={revenueYear}
                onChange={e => setRevenueYear(e.target.value)}
                style={{
                  height: 30,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'Manrope, sans-serif',
                  color: '#1B2B68',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="2026">2026 (Current)</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={REVENUE_BY_YEAR[revenueYear] || REVENUE_BY_YEAR['2026']} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(27, 43, 104, 0.04)', radius: 4 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: 'Manrope', fontWeight: 600, paddingTop: 10 }} />
              <Bar dataKey="parent" name="Parents" fill="#1B2B68" radius={[4, 4, 0, 0]} />
              <Bar dataKey="driver" name="Drivers" fill="#F2600C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="walkshare" name="WalkShare" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="User Growth">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: 'Manrope', fontWeight: 600, paddingTop: 10 }} />
              <Line type="monotone" dataKey="parents" name="Parents" stroke="#1B2B68" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#1B2B68' }} />
              <Line type="monotone" dataKey="providers" name="Providers" stroke="#F2600C" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#F2600C' }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Charts Row 2: Top Earners + Pie + RAG Gauge */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        {/* Top Earners Bar */}
        <SectionCard title="Top Earning Providers">
          <ResponsiveContainer width="100%" height={200}>
            <HBarChart data={topEarners} layout="vertical" barSize={12} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#1A1D24', fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(27, 43, 104, 0.04)' }} />
              <HBar dataKey="amount" name="Earnings" fill="#1B2B68" radius={[0, 5, 5, 0]} />
            </HBarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Pie Chart */}
        <SectionCard title="Users">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <PieChart width={150} height={150}>
                <Pie data={userComposition} cx={75} cy={75} innerRadius={45} outerRadius={68} dataKey="value" strokeWidth={0}>
                  {userComposition.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#1A1D24', lineHeight: 1 }}>{totalUsers.toLocaleString()}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Total</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
              {userComposition.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1D24' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Users */}
        <SectionCard title="Latest Registrations" action="View All">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Role', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textAlign: 'left', paddingBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr key={i} style={{ borderTop: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '10px 0', fontSize: 14, fontWeight: 600, color: '#1A1D24' }}>{u.name}</td>
                  <td style={{ padding: '10px 0' }}><RoleChip role={u.role} /></td>
                  <td style={{ padding: '10px 0', fontSize: 12, fontWeight: 500, color: '#64748B' }}>{u.date}</td>
                  <td style={{ padding: '10px 0' }}><StatusChip status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* Recent Transactions */}
        <SectionCard title="Latest Transactions" action="View All">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['User', 'Package', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textAlign: 'left', paddingBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTx.map((t, i) => (
                <tr key={i} style={{ borderTop: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '10px 0', fontSize: 14, fontWeight: 600, color: '#1A1D24' }}>{t.user}</td>
                  <td style={{ padding: '10px 0', fontSize: 12, fontWeight: 500, color: '#64748B' }}>{t.package}</td>
                  <td style={{ padding: '10px 0', fontSize: 14, fontWeight: 700, color: '#1A1D24' }}>{t.amount}</td>
                  <td style={{ padding: '10px 0' }}><StatusChip status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}
