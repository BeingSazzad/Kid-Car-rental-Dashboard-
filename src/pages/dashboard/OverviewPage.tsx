import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart as HBarChart, Bar as HBar
} from 'recharts';
import { Users, DollarSign, MapPin, ShieldAlert, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { RAGGauge } from '@/components/analytics/RAGGauge';

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
  { name: 'Pending KYC', value: 4, color: '#F59E0B' },
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
        <p style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>{label}</p>
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
      <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1D24' }}>{title}</p>
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
      background: '#1A1D24', borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.6 }}>
          <span style={{ color: p.fill || p.stroke }}>{p.name}: </span>${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

/* ─── Alert Row ─── */
const alerts = [
  { icon: AlertCircle, color: '#EF4444', bg: '#FEF2F2', text: '2 KYC documents expiring in 7 days', action: 'Review' },
  { icon: Clock, color: '#F59E0B', bg: '#FFFBEB', text: 'Trip #H2S-84920 is 12 min overdue', action: 'View Trip' },
  { icon: CheckCircle, color: '#10B981', bg: '#ECFDF5', text: 'All morning routes completed successfully', action: null },
];

/* ─── Main Page ─── */
export default function OverviewPage() {
  const totalUsers = userComposition.reduce((a, b) => a + b.value, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1D24', marginBottom: 2 }}>Overview</h1>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>Thu, Oct 1 2026 · Morning Peak Active</p>
      </div>

      {/* Alert Strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts.map((a, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: a.bg, border: `1px solid ${a.color}28`,
            borderRadius: 10, padding: '10px 14px',
          }}>
            <a.icon size={15} style={{ color: a.color, flexShrink: 0 }} strokeWidth={2.5} />
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1D24', flex: 1 }}>{a.text}</p>
            {a.action && (
              <button style={{ fontSize: 12, fontWeight: 700, color: a.color, background: 'none', border: 'none', cursor: 'pointer' }}>
                {a.action}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPICard label="Total Revenue (MTD)" value="$12,840" sub="vs last month" trend={8.4} icon={DollarSign} />
        <KPICard label="Active Users" value="1,428" sub="this week +124" trend={5.2} icon={Users} accentColor="#3B82F6" />
        <KPICard label="Live Trips Now" value="34" sub="morning peak" trend={12.1} icon={MapPin} accentColor="#F2600C" />
        <KPICard label="Pending KYC" value="4" sub="need review" trend={-2} icon={ShieldAlert} accentColor="#F59E0B" />
      </div>

      {/* Charts Row 1: Revenue Column + User Growth Line */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SectionCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fontFamily: 'Manrope', fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 260px', gap: 16 }}>
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
        <SectionCard title="User Mix">
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

        {/* RAG Gauge */}
        <SectionCard title="Platform Health">
          <RAGGauge score={84} />
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
                  <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 600, color: '#1A1D24' }}>{u.name}</td>
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
                  <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 600, color: '#1A1D24' }}>{t.user}</td>
                  <td style={{ padding: '10px 0', fontSize: 12, fontWeight: 500, color: '#64748B' }}>{t.package}</td>
                  <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#1A1D24' }}>{t.amount}</td>
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
