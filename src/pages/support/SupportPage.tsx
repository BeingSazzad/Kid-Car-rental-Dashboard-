import { useState } from 'react';
import {
  LifeBuoy, Search, Clock, CheckCircle2,
  AlertCircle, Send, X, RefreshCw
} from 'lucide-react';

interface Ticket {
  id: string;
  user: string;
  role: 'Parent' | 'Driver' | 'Walker';
  email: string;
  phone: string;
  category: 'Safety' | 'Trip Issue' | 'Payment' | 'Account';
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  time: string;
  tripId?: string;
  messages: {
    sender: string;
    role: 'user' | 'admin';
    time: string;
    text: string;
  }[];
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TK-1048',
    user: 'Sarah Tremblay',
    role: 'Parent',
    email: 'sarah.t@example.com',
    phone: '+1 (416) 555-0192',
    category: 'Trip Issue',
    subject: 'Driver did not arrive at pickup location on time',
    priority: 'High',
    status: 'Open',
    time: '25m ago',
    tripId: 'H2S-84920',
    messages: [
      {
        sender: 'Sarah Tremblay',
        role: 'user',
        time: '25m ago',
        text: 'The assigned driver Tariq Ahmed was scheduled for 7:30 AM pickup for Liam and Emma at 12 Elm St, but did not arrive until 7:52 AM without notification. The kids almost missed their morning bell.',
      },
    ],
  },
  {
    id: 'TK-1045',
    user: 'Amanda Roy',
    role: 'Parent',
    email: 'amanda.roy@example.com',
    phone: '+1 (416) 555-0201',
    category: 'Payment',
    subject: 'Double charge on monthly subscription invoice',
    priority: 'Medium',
    status: 'In Progress',
    time: '2h ago',
    messages: [
      {
        sender: 'Amanda Roy',
        role: 'user',
        time: '2h ago',
        text: 'Hi, I noticed two charges of $9.99 on my Visa statement dated Sep 28. Could you please check and reverse the duplicate transaction?',
      },
      {
        sender: 'Super Admin',
        role: 'admin',
        time: '1h ago',
        text: 'Hello Amanda, our billing team has located the duplicate authorization hold. We are issuing an automatic refund to your card ending in 4092.',
      },
    ],
  },
  {
    id: 'TK-1042',
    user: 'Farhana Yasmin',
    role: 'Driver',
    email: 'farhana.y@example.com',
    phone: '+1 (416) 555-0183',
    category: 'Safety',
    subject: 'Road obstruction on Greenfield Boulevard detour required',
    priority: 'High',
    status: 'Open',
    time: '3h ago',
    tripId: 'H2S-84911',
    messages: [
      {
        sender: 'Farhana Yasmin',
        role: 'user',
        time: '3h ago',
        text: 'Construction work started unexpectedly on Greenfield Blvd, requiring a 10-minute detour. Parents have been messaged via the in-app chat, please update route logs.',
      },
    ],
  },
  {
    id: 'TK-1039',
    user: 'Marcus Vance',
    role: 'Parent',
    email: 'marcus.v@example.com',
    phone: '+1 (416) 555-0188',
    category: 'Account',
    subject: 'Unable to upload second child school admission proof',
    priority: 'Low',
    status: 'In Progress',
    time: '5h ago',
    messages: [
      {
        sender: 'Marcus Vance',
        role: 'user',
        time: '5h ago',
        text: 'The file uploader on mobile gives an error when submitting a PDF larger than 4MB for my child Mia.',
      },
    ],
  },
  {
    id: 'TK-1033',
    user: 'Tariq Ahmed',
    role: 'Driver',
    email: 'tariq.a@example.com',
    phone: '+1 (416) 555-0182',
    category: 'Payment',
    subject: 'Escrow release pending for completed Friday rides',
    priority: 'Medium',
    status: 'Resolved',
    time: 'Yesterday',
    messages: [
      {
        sender: 'Tariq Ahmed',
        role: 'user',
        time: 'Yesterday',
        text: 'The escrow funds for ride batch #4880 have not been transferred to my payout account.',
      },
      {
        sender: 'Super Admin',
        role: 'admin',
        time: 'Yesterday',
        text: 'Funds of $135 have been released to your registered direct deposit account.',
      },
    ],
  },
  {
    id: 'TK-1029',
    user: 'Sophie Bouchard',
    role: 'Walker',
    email: 'sophie.b@example.com',
    phone: '+1 (416) 555-0186',
    category: 'Safety',
    subject: 'WalkShare check-in beacon battery low at Park Gate',
    priority: 'Low',
    status: 'Resolved',
    time: '2 days ago',
    messages: [
      {
        sender: 'Sophie Bouchard',
        role: 'user',
        time: '2 days ago',
        text: 'Park Gate beacon #3 is reporting low battery status.',
      },
      {
        sender: 'Super Admin',
        role: 'admin',
        time: '2 days ago',
        text: 'Field technician replaced battery on Oct 28.',
      },
    ],
  },
];

const priorityConfig = {
  High: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  Medium: { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' },
  Low: { bg: '#F8FAFC', color: '#94A3B8', border: '#E2E8F0' },
};

const statusConfig = {
  Open: { bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
  'In Progress': { bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B' },
  Resolved: { bg: '#ECFDF5', color: '#059669', dot: '#10B981' },
};

const categoryBadge = {
  Safety: { bg: '#F1F5F9', color: '#334155' },
  'Trip Issue': { bg: '#F1F5F9', color: '#334155' },
  Payment: { bg: '#F1F5F9', color: '#334155' },
  Account: { bg: '#F1F5F9', color: '#334155' },
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');

  // Quick stats
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  const filteredTickets = tickets.filter(t => {
    if (activeTab !== 'All' && t.status !== activeTab) return false;
    if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.user.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        (t.tripId && t.tripId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const newMsg = {
      sender: 'Super Admin',
      role: 'admin' as const,
      time: 'Just now',
      text: replyText.trim(),
    };
    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: (t.status === 'Open' ? 'In Progress' : t.status) as Ticket['status'],
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });
    setTickets(updated);
    setSelectedTicket({
      ...selectedTicket,
      status: selectedTicket.status === 'Open' ? 'In Progress' : selectedTicket.status,
      messages: [...selectedTicket.messages, newMsg],
    });
    setReplyText('');
  };

  const handleUpdateStatus = (ticketId: string, newStatus: Ticket['status']) => {
    const updated = tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t);
    setTickets(updated);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Support Tickets
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>
            Resolve parent & driver disputes, safety alerts, and general platform inquiries
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setTickets([...INITIAL_TICKETS])}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 38,
              padding: '0 14px',
              borderRadius: 10,
              border: '1px solid #E2E8F0',
              background: '#fff',
              color: '#475569',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
        {/* Total */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEF1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <LifeBuoy size={22} style={{ color: '#1B2B68' }} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Inquiries</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', lineHeight: 1.2 }}>{totalCount}</p>
          </div>
        </div>

        {/* Open (Urgent) */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertCircle size={22} style={{ color: '#DC2626' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Open & Action Req.</p>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', lineHeight: 1.2 }}>{openCount}</p>
          </div>
        </div>

        {/* In Progress */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={22} style={{ color: '#D97706' }} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>In Progress</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', lineHeight: 1.2 }}>{inProgressCount}</p>
          </div>
        </div>

        {/* Resolved */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle2 size={22} style={{ color: '#10B981' }} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Resolved</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', lineHeight: 1.2 }}>{resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Toolbar (Single Responsive Line) ── */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #E2E8F0',
          borderRadius: 14,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Status Tabs + Category + Priority + Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 4 }}>
            {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(tab => {
              const active = activeTab === tab;
              const count = tab === 'All' ? totalCount : tab === 'Open' ? openCount : tab === 'In Progress' ? inProgressCount : resolvedCount;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: active ? 700 : 600,
                    cursor: 'pointer',
                    background: active ? '#1B2B68' : 'transparent',
                    color: active ? '#fff' : '#64748B',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {tab}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 99,
                      background: active ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                      color: active ? '#fff' : '#64748B',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ width: 1, height: 24, background: '#E2E8F0' }} />

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              height: 34,
              padding: '0 10px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#fff',
              fontSize: 12,
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="All">All Categories</option>
            <option value="Safety">Safety</option>
            <option value="Trip Issue">Trip Issues</option>
            <option value="Payment">Payments</option>
            <option value="Account">Account</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            style={{
              height: 34,
              padding: '0 10px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#fff',
              fontSize: 12,
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {(categoryFilter !== 'All' || priorityFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setCategoryFilter('All');
                setPriorityFilter('All');
                setSearchQuery('');
              }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#EF4444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Right: Search Box */}
        <div style={{ position: 'relative', width: 260, maxWidth: '100%' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: 11, color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 36,
              paddingLeft: 34,
              paddingRight: 28,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              fontSize: 12,
              fontFamily: 'Manrope',
              color: '#1A1D24',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* ── Support Tickets Table ── */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Ticket ID', 'Requester', 'Category', 'Subject', 'Priority', 'Status', 'Received', 'Actions'].map((h, i) => (
                <th
                  key={h}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#94A3B8',
                    padding: '12px 16px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textAlign: i === 7 ? 'right' : 'left',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#94A3B8' }}>
                  <LifeBuoy size={36} style={{ color: '#CBD5E1', margin: '0 auto 10px', display: 'block' }} />
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>No support tickets found</p>
                  <p style={{ fontSize: 14, color: '#64748B' }}>Try clearing filters or search parameters</p>
                </td>
              </tr>
            ) : (
              filteredTickets.map((t, idx) => {
                const sc = statusConfig[t.status];
                const pc = priorityConfig[t.priority];
                const cc = categoryBadge[t.category];
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    style={{
                      borderBottom: idx < filteredTickets.length - 1 ? '1px solid #F1F5F9' : 'none',
                      cursor: 'pointer',
                      background: selectedTicket?.id === t.id ? '#F8FAFC' : '#fff',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      if (selectedTicket?.id !== t.id) (e.currentTarget as HTMLElement).style.background = '#FAFCFF';
                    }}
                    onMouseLeave={e => {
                      if (selectedTicket?.id !== t.id) (e.currentTarget as HTMLElement).style.background = '#fff';
                    }}
                  >
                    {/* ID */}
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#1B2B68' }}>
                      #{t.id}
                    </td>

                    {/* Requester */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: '#EEF2FF',
                            color: '#1B2B68',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {t.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: 0 }}>{t.user}</p>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#64748B',
                            }}
                          >
                            {t.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: cc.bg,
                          color: cc.color,
                        }}
                      >
                        {t.category}
                      </span>
                    </td>

                    {/* Subject */}
                    <td style={{ padding: '14px 16px', maxWidth: 320 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1D24', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.subject}
                      </p>
                      {t.tripId && (
                        <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          Trip: {t.tripId}
                        </span>
                      )}
                    </td>

                    {/* Priority */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: pc.bg,
                          color: pc.color,
                          border: `1px solid ${pc.border}`,
                        }}
                      >
                        {t.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '3px 9px',
                          borderRadius: 99,
                          background: sc.bg,
                          color: sc.color,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                        {t.status}
                      </div>
                    </td>

                    {/* Received */}
                    <td style={{ padding: '14px 16px', fontSize: 12, fontWeight: 500, color: '#64748B' }}>
                      {t.time}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTicket(t);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: '1px solid #E2E8F0',
                          background: '#fff',
                          color: '#1B2B68',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >View</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Slide-over / Modal for Ticket Details & Resolution ── */}
      {selectedTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 100,
          }}
          onClick={() => setSelectedTicket(null)}
        >
          <div
            style={{
              width: 540,
              maxWidth: '90vw',
              height: '100%',
              background: '#fff',
              boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Manrope, sans-serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Top Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8FAFC',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#1B2B68' }}>#{selectedTicket.id}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: categoryBadge[selectedTicket.category].bg,
                      color: categoryBadge[selectedTicket.category].color,
                    }}
                  >
                    {selectedTicket.category}
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: 0 }}>
                  {selectedTicket.subject}
                </p>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions & Status Control Bar */}
            <div
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>Status:</span>
                {(['Open', 'In Progress', 'Resolved'] as const).map(st => {
                  const active = selectedTicket.status === st;
                  const sc = statusConfig[st];
                  return (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedTicket.id, st)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: active ? `1px solid ${sc.dot}` : '1px solid #E2E8F0',
                        background: active ? sc.bg : '#F8FAFC',
                        color: active ? sc.color : '#64748B',
                        fontSize: 12,
                        fontWeight: active ? 700 : 600,
                        cursor: 'pointer',
                      }}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>

              {selectedTicket.tripId && (
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1B2B68', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Ride: {selectedTicket.tripId}</span>
                </div>
              )}
            </div>

            {/* User Details Mini Card */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #F1F5F9', background: '#FAFCFF' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.04em' }}>
                Requester Information
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: 0 }}>
                    {selectedTicket.user} ({selectedTicket.role})
                  </p>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                    {selectedTicket.email} · {selectedTicket.phone}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: priorityConfig[selectedTicket.priority].bg,
                    color: priorityConfig[selectedTicket.priority].color,
                  }}
                >
                  {selectedTicket.priority} Priority
                </span>
              </div>
            </div>

            {/* Conversation Thread */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {selectedTicket.messages.map((m, i) => {
                const isAdmin = m.role === 'admin';
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isAdmin ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isAdmin ? '#1B2B68' : '#334155' }}>
                        {m.sender}
                      </span>
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>{m.time}</span>
                    </div>
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: isAdmin ? '#1B2B68' : '#F1F5F9',
                        color: isAdmin ? '#fff' : '#1A1D24',
                        fontSize: 14,
                        lineHeight: 1.5,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <div style={{ marginBottom: 8, display: 'flex', gap: 6 }}>
                {['Issue verified & resolved', 'Contacting assigned driver', 'Refund initiated'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setReplyText(preset)}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: '#fff',
                      border: '1px solid #E2E8F0',
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <textarea
                  rows={3}
                  placeholder="Write a response to requester..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #CBD5E1',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    color: '#1A1D24',
                    background: '#fff',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>Press Send to deliver email & in-app push</span>
                <button
                  onClick={handleSendReply}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    height: 36,
                    padding: '0 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#1B2B68',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Send size={14} />Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
