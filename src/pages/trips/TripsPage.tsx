import { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Download, X, CheckCircle2 } from 'lucide-react';

interface TripItem {
  id: string;
  children: string;
  provider: string;
  providerPhone: string;
  parent: string;
  parentPhone: string;
  type: 'Vehicle' | 'WalkShare';
  vehicle: string;
  route: string;
  time: string;
  status: 'In Progress' | 'Completed' | 'Scheduled' | 'Delayed' | 'Cancelled';
  amount: string;
  checkpoints: { name: string; time: string; done: boolean }[];
}

const INITIAL_TRIPS: TripItem[] = [
  {
    id: 'H2S-84920',
    children: 'Liam (Gr 3), Emma (Gr 1)',
    provider: 'Tariq Ahmed',
    providerPhone: '+1 (416) 555-0182',
    parent: 'Sarah Tremblay',
    parentPhone: '+1 (416) 555-0192',
    type: 'Vehicle',
    vehicle: '2023 Toyota Sienna (7 Seater) • Plate #H2S-882',
    route: '12 Elm St → Greenfield School',
    time: '07:30 AM',
    status: 'In Progress',
    amount: '$135',
    checkpoints: [
      { name: 'Driver dispatched to pickup', time: '07:15 AM', done: true },
      { name: 'Children onboarded & buckled', time: '07:30 AM', done: true },
      { name: 'En route via Danforth Ave', time: '07:38 AM', done: true },
      { name: 'Greenfield Elementary drop-off', time: '07:50 AM (Est)', done: false },
    ],
  },
  {
    id: 'H2S-84911',
    children: 'Noah (Kindergarten)',
    provider: 'Farhana Yasmin',
    providerPhone: '+1 (416) 555-0183',
    parent: 'Amanda Roy',
    parentPhone: '+1 (416) 555-0201',
    type: 'Vehicle',
    vehicle: '2022 Honda Odyssey • Plate #H2S-914',
    route: '18 Maple Ave → Greenfield School',
    time: '07:35 AM',
    status: 'Completed',
    amount: '$65',
    checkpoints: [
      { name: 'Driver dispatched', time: '07:20 AM', done: true },
      { name: 'Child onboarded', time: '07:35 AM', done: true },
      { name: 'School gate handoff verified', time: '07:52 AM', done: true },
    ],
  },
  {
    id: 'H2S-84908',
    children: 'Charlotte (Gr 2)',
    provider: 'Kabir Hossain',
    providerPhone: '+1 (416) 555-0184',
    parent: 'Jessica Taylor',
    parentPhone: '+1 (416) 555-0194',
    type: 'Vehicle',
    vehicle: '2024 Toyota HiAce • Plate #H2S-305',
    route: '42 Birchwood → Greenfield School',
    time: '07:45 AM',
    status: 'Completed',
    amount: '$55',
    checkpoints: [
      { name: 'Driver dispatched', time: '07:30 AM', done: true },
      { name: 'Child onboarded', time: '07:45 AM', done: true },
      { name: 'School gate handoff verified', time: '08:02 AM', done: true },
    ],
  },
  {
    id: 'H2S-84902',
    children: 'Leo (Gr 4), Mia (Gr 2)',
    provider: 'Sarah Jenkins',
    providerPhone: '+1 (416) 555-0185',
    parent: 'Marcus Vance',
    parentPhone: '+1 (416) 555-0188',
    type: 'WalkShare',
    vehicle: 'Certified Walking Chaperone (Safety Vests Active)',
    route: 'Park Gate → Greenfield School',
    time: '07:15 AM',
    status: 'Completed',
    amount: '$35',
    checkpoints: [
      { name: 'Walking group assembled', time: '07:15 AM', done: true },
      { name: 'Sidewalk escort underway', time: '07:25 AM', done: true },
      { name: 'Arrived at school playground', time: '07:42 AM', done: true },
    ],
  },
  {
    id: 'H2S-84899',
    children: 'Benjamin (Gr 3)',
    provider: 'Sophie Bouchard',
    providerPhone: '+1 (416) 555-0186',
    parent: 'Claire Dubois',
    parentPhone: '+1 (416) 555-0191',
    type: 'WalkShare',
    vehicle: 'Walking Chaperone',
    route: 'West Compound → Greenfield School',
    time: '07:30 AM',
    status: 'Delayed',
    amount: '$35',
    checkpoints: [
      { name: 'Walking group assembled', time: '07:30 AM', done: true },
      { name: 'Heavy rain delay noted', time: '07:36 AM', done: true },
      { name: 'Arrived at school entrance', time: '08:00 AM (Delayed)', done: false },
    ],
  },
  {
    id: 'H2S-84891',
    children: 'Liam (Gr 3)',
    provider: 'Tariq Ahmed',
    providerPhone: '+1 (416) 555-0182',
    parent: 'Sarah Tremblay',
    parentPhone: '+1 (416) 555-0192',
    type: 'Vehicle',
    vehicle: '2023 Toyota Sienna • Plate #H2S-882',
    route: '12 Elm St → Sunshine Pre-school',
    time: '01:00 PM',
    status: 'Scheduled',
    amount: '$14',
    checkpoints: [
      { name: 'Trip scheduled for afternoon route', time: '01:00 PM', done: false },
    ],
  },
  {
    id: 'H2S-84880',
    children: 'Emma (Gr 1)',
    provider: 'Alex Rivera',
    providerPhone: '+1 (416) 555-0195',
    parent: 'Amanda Roy',
    parentPhone: '+1 (416) 555-0201',
    type: 'Vehicle',
    vehicle: '2022 Honda Odyssey • Plate #H2S-914',
    route: 'Greenfield School → 18 Maple Ave',
    time: '02:50 PM',
    status: 'Scheduled',
    amount: '$15',
    checkpoints: [
      { name: 'After-school pickup scheduled', time: '02:50 PM', done: false },
    ],
  },
];

const TABS = ['All', 'Live Now', 'Scheduled', 'Completed', 'Delayed'] as const;

const statusColors: Record<string, { bg: string; color: string }> = {
  'In Progress': { bg: '#DBEAFE', color: '#1E40AF' },
  Completed: { bg: '#D1FAE5', color: '#065F46' },
  Scheduled: { bg: '#F1F5F9', color: '#475569' },
  Delayed: { bg: '#FEF3C7', color: '#92400E' },
  Cancelled: { bg: '#FEE2E2', color: '#991B1B' },
};

export default function TripsPage() {
  const [trips, setTrips] = useState<TripItem[]>(INITIAL_TRIPS);
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Vehicle' | 'WalkShare'>('All');
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);
  const [exportNotice, setExportNotice] = useState(false);

  const filteredTrips = useMemo(() => {
    return trips.filter(t => {
      const matchTab =
        tab === 'All'
          ? true
          : tab === 'Live Now'
          ? t.status === 'In Progress'
          : t.status === tab;

      const matchType = typeFilter === 'All' || t.type === typeFilter;

      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.parent.toLowerCase().includes(q) ||
        t.provider.toLowerCase().includes(q) ||
        t.children.toLowerCase().includes(q);

      return matchTab && matchType && matchSearch;
    });
  }, [trips, tab, typeFilter, search]);

  const handleExportCSV = () => {
    const headers = ['Trip ID,Children,Provider,Parent,Route,Time,Type,Amount,Status'];
    const rows = filteredTrips.map(t =>
      `"${t.id}","${t.children}","${t.provider}","${t.parent}","${t.route}","${t.time}","${t.type}","${t.amount}","${t.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trips_export_${tab.toLowerCase()}_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2000);
  };

  const handleUpdateTripStatus = (id: string, newStatus: TripItem['status']) => {
    setTrips(trips.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
    if (selectedTrip?.id === id) {
      setSelectedTrip({ ...selectedTrip, status: newStatus });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Manrope, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', margin: 0, letterSpacing: '-0.02em' }}>
            Trip Dispatch & Routes
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '4px 0 0' }}>
            Real-time commute dispatch, vehicle escorts, and walkshare chaperones
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredTrips.length === 0}
          style={{
            height: 38,
            padding: '0 16px',
            borderRadius: 8,
            border: 'none',
            background: exportNotice ? '#10B981' : '#1B2B68',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 700,
            cursor: filteredTrips.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 4px rgba(27, 43, 104, 0.15)',
            transition: 'all 0.15s ease',
          }}
        >
          <Download size={14} /> {exportNotice ? 'Exported!' : `Export CSV (${filteredTrips.length})`}
        </button>
      </div>

      {/* ── Filter Toolbar (Single Responsive Line) ── */}
      <div
        style={{
          background: '#FFFFFF',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 4 }}>
            {TABS.map(t => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: active ? 700 : 600,
                    cursor: 'pointer',
                    background: active ? '#1B2B68' : 'transparent',
                    color: active ? '#FFFFFF' : '#64748B',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div style={{ width: 1, height: 24, background: '#E2E8F0' }} />

          {/* Mode Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            style={{
              height: 38,
              padding: '0 12px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: 12,
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="All">Mode: All</option>
            <option value="Vehicle">Vehicle Carpool</option>
            <option value="WalkShare">WalkShare</option>
          </select>

          {(search || tab !== 'All' || typeFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setTab('All');
                setTypeFilter('All');
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

        {/* Search Input */}
        <div style={{ position: 'relative', width: 240, maxWidth: '100%' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: 12, color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search trips..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: 38,
              paddingLeft: 34,
              paddingRight: 28,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              fontSize: 12,
              fontFamily: 'Manrope',
              color: '#1A1D24',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ── Trips Table ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Trip ID', 'Children', 'Provider', 'Parent', 'Route', 'Time', 'Type', 'Amount', 'Status', 'Action'].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    textAlign: h === 'Action' ? 'right' : 'left',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTrips.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                  No trips found matching filter
                </td>
              </tr>
            ) : (
              filteredTrips.map(t => {
                const sc = statusColors[t.status] || { bg: '#F1F5F9', color: '#475569' };
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTrip(t)}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
                  >
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#1B2B68', fontVariantNumeric: 'tabular-nums' }}>
                      {t.id}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
                      {t.children}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
                      {t.provider}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748B' }}>
                      {t.parent}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#334155', maxWidth: 220 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={12} style={{ color: '#94A3B8', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.route}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748B', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={12} style={{ color: '#94A3B8' }} />
                        {t.time}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: t.type === 'Vehicle' ? '#EEF2FF' : '#ECFDF5',
                          color: t.type === 'Vehicle' ? '#1B2B68' : '#047857',
                        }}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                      {t.amount}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: sc.bg,
                          color: sc.color,
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTrip(t);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          color: '#1B2B68',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Trip Details Drawer/Modal ── */}
      {selectedTrip && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 16,
          }}
          onClick={() => setSelectedTrip(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              width: 540,
              maxWidth: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {selectedTrip.id}
                  </h2>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: statusColors[selectedTrip.status].bg,
                      color: statusColors[selectedTrip.status].color,
                    }}
                  >
                    {selectedTrip.status}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>
                  {selectedTrip.type} Commute • Scheduled {selectedTrip.time}
                </p>
              </div>

              <button
                onClick={() => setSelectedTrip(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Route Box */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <MapPin size={14} style={{ color: '#1B2B68' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  {selectedTrip.route}
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                Vehicle / Chaperone: {selectedTrip.vehicle}
              </p>
            </div>

            {/* Stakeholders Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>
                  Children Onboard
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '4px 0 2px' }}>
                  {selectedTrip.children}
                </p>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                  Parent: {selectedTrip.parent} ({selectedTrip.parentPhone})
                </p>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>
                  Assigned Provider
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '4px 0 2px' }}>
                  {selectedTrip.provider}
                </p>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                  Phone: {selectedTrip.providerPhone}
                </p>
              </div>
            </div>

            {/* Live Route Checkpoints Timeline */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 12 }}>
                Route Milestones
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedTrip.checkpoints.map((cp, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: cp.done ? '#D1FAE5' : '#F1F5F9',
                        color: cp.done ? '#065F46' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {cp.done ? <CheckCircle2 size={12} color="#10B981" /> : idx + 1}
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: cp.done ? '#0F172A' : '#64748B' }}>
                        {cp.name}
                      </span>
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>{cp.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Status Actions & Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedTrip.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateTripStatus(selectedTrip.id, 'Completed')}
                    style={{
                      height: 36,
                      padding: '0 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#10B981',
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Mark Done
                  </button>
                )}

                {selectedTrip.status !== 'Delayed' && selectedTrip.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateTripStatus(selectedTrip.id, 'Delayed')}
                    style={{
                      height: 36,
                      padding: '0 14px',
                      borderRadius: 8,
                      border: '1px solid #FDE68A',
                      background: '#FEF3C7',
                      color: '#B45309',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Flag Delay
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedTrip(null)}
                style={{
                  height: 36,
                  padding: '0 18px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
