import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart as HBarChart, Bar as HBar
} from 'recharts';
import { Users, DollarSign, MapPin, ShieldAlert, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

/* ─── Mock Data ─── */
const revenueData = [
  { month: 'Jan', vehicle: 4200, walkshare: 1100 },
  { month: 'Feb', vehicle: 5100, walkshare: 1400 },
  { month: 'Mar', vehicle: 4800, walkshare: 1250 },
  { month: 'Apr', vehicle: 6200, walkshare: 1700 },
  { month: 'May', vehicle: 5900, walkshare: 1600 },
  { month: 'Jun', vehicle: 7100, walkshare: 1900 },
  { month: 'Jul', vehicle: 8400, walkshare: 2200 },
  { month: 'Aug', vehicle: 7800, walkshare: 2100 },
  { month: 'Sep', vehicle: 9200, walkshare: 2600 },
  { month: 'Oct', vehicle: 8700, walkshare: 2400 },
  { month: 'Nov', vehicle: 10200, walkshare: 2900 },
  { month: 'Dec', vehicle: 11400, walkshare: 3200 },
];

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
  { user: 'Sarah Tremblay', package: 'Monthly Plan', amount: '$9.99', status: 'Active', date: 'Sep 29, 2026' },
  { user: 'Amanda Roy', package: 'Annual Plan', amount: '$79.00', status: 'Active', date: 'Sep 28, 2026' },
  { user: 'Marcus Vance', package: 'Monthly Plan', amount: '$9.99', status: 'Expired', date: 'Sep 28, 2026' },
  { user: 'Claire Dubois', package: 'Monthly Plan', amount: '$9.99', status: 'Active', date: 'Sep 27, 2026' },
  { user: 'Jessica Taylor', package: 'Monthly Plan', amount: '$9.99', status: 'Active', date: 'Sep 26, 2026' },
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

const SectionCard = ({ title, children, action }: { title: string; children: React.ReactNode; action?: string }) => (
  <div style={{
    background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
    overflow: 'hidden',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 22px', borderBottom: '1px solid #F1F5F9',
    }}>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1D24' }}>{title}</p>
      {action && (
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
  return (
    <div style={{
      background: '#1A1D24',
      borderRadius: 12,
      padding: '12px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
      minWidth: 160,
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <p style={{
        fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)',
        marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 20, marginBottom: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: p.fill || p.stroke, flexShrink: 0,
            }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>
              {p.name}
            </span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
            ${p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Main Page ─── */
export default function OverviewPage() {
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

      {/* Charts Row 1: Revenue + User Growth */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <SectionCard title="Revenue Breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: 'Manrope', fontWeight: 600, paddingTop: 8 }} />
              <Bar dataKey="vehicle" name="Vehicle Ride" fill="#1B2B68" radius={[5, 5, 0, 0]} />
              <Bar dataKey="walkshare" name="WalkShare" fill="#F2600C" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="User Growth">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: 'Manrope', fontWeight: 600, paddingTop: 8 }} />
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
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
