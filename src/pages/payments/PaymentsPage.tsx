import { useState, useMemo } from 'react';
import {
  Search, Download, ArrowUpDown, ArrowUp, ArrowDown,
  Calendar, Check, X, FileText, RefreshCw
} from 'lucide-react';

interface Transaction {
  id: string;
  user: string;
  userEmail: string;
  type: 'Subscription' | 'Payout';
  package: string;
  amount: string; // e.g. '$9.99'
  fee: string;    // e.g. '$1.00'
  net: string;    // e.g. '$8.99'
  date: string;   // e.g. 'Oct 1, 2026'
  dateIso: string; // YYYY-MM-DD for precise filtering
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded';
  paymentMethod: string;
}

const ALL_TX: Transaction[] = [
  {
    id: 'TXN-009',
    user: 'Sarah Tremblay',
    userEmail: 'sarah.t@example.com',
    type: 'Subscription',
    package: 'Monthly Commute Plan',
    amount: '$9.99',
    fee: '$1.00',
    net: '$8.99',
    date: 'Oct 1, 2026',
    dateIso: '2026-10-01',
    status: 'Success',
    paymentMethod: 'Visa •••• 4242',
  },
  {
    id: 'TXN-010',
    user: 'Tariq Ahmed',
    userEmail: 'tariq.ahmed@example.com',
    type: 'Payout',
    package: 'Weekly Driver Payout',
    amount: '$210.00',
    fee: '$21.00',
    net: '$189.00',
    date: 'Sep 30, 2026',
    dateIso: '2026-09-30',
    status: 'Success',
    paymentMethod: 'Direct Deposit (TD Bank)',
  },
  {
    id: 'TXN-001',
    user: 'Sarah Tremblay',
    userEmail: 'sarah.t@example.com',
    type: 'Subscription',
    package: 'Monthly Plan',
    amount: '$9.99',
    fee: '$1.00',
    net: '$8.99',
    date: 'Sep 29, 2026',
    dateIso: '2026-09-29',
    status: 'Success',
    paymentMethod: 'Visa •••• 4242',
  },
  {
    id: 'TXN-002',
    user: 'Tariq Ahmed',
    userEmail: 'tariq.ahmed@example.com',
    type: 'Payout',
    package: 'Escrow Release',
    amount: '$135.00',
    fee: '$13.50',
    net: '$121.50',
    date: 'Sep 28, 2026',
    dateIso: '2026-09-28',
    status: 'Success',
    paymentMethod: 'Direct Deposit (TD Bank)',
  },
  {
    id: 'TXN-003',
    user: 'Amanda Roy',
    userEmail: 'amanda.roy@example.com',
    type: 'Subscription',
    package: 'Annual Plan',
    amount: '$79.00',
    fee: '$7.90',
    net: '$71.10',
    date: 'Sep 28, 2026',
    dateIso: '2026-09-28',
    status: 'Success',
    paymentMethod: 'Mastercard •••• 8819',
  },
  {
    id: 'TXN-004',
    user: 'Farhana Yasmin',
    userEmail: 'farhana.y@example.com',
    type: 'Payout',
    package: 'Escrow Release',
    amount: '$65.00',
    fee: '$6.50',
    net: '$58.50',
    date: 'Sep 27, 2026',
    dateIso: '2026-09-27',
    status: 'Success',
    paymentMethod: 'Direct Deposit (RBC)',
  },
  {
    id: 'TXN-005',
    user: 'Marcus Vance',
    userEmail: 'marcus.v@example.com',
    type: 'Subscription',
    package: 'Monthly Plan',
    amount: '$9.99',
    fee: '$1.00',
    net: '$8.99',
    date: 'Sep 27, 2026',
    dateIso: '2026-09-27',
    status: 'Failed',
    paymentMethod: 'Visa •••• 1092 (Insufficient funds)',
  },
  {
    id: 'TXN-006',
    user: 'Claire Dubois',
    userEmail: 'claire.d@example.com',
    type: 'Subscription',
    package: 'Monthly Plan',
    amount: '$9.99',
    fee: '$1.00',
    net: '$8.99',
    date: 'Sep 26, 2026',
    dateIso: '2026-09-26',
    status: 'Success',
    paymentMethod: 'Amex •••• 3004',
  },
  {
    id: 'TXN-007',
    user: 'Kabir Hossain',
    userEmail: 'kabir.h@example.com',
    type: 'Payout',
    package: 'Escrow Release',
    amount: '$55.00',
    fee: '$5.50',
    net: '$49.50',
    date: 'Sep 25, 2026',
    dateIso: '2026-09-25',
    status: 'Pending',
    paymentMethod: 'Direct Deposit (Scotiabank)',
  },
  {
    id: 'TXN-008',
    user: 'Jessica Taylor',
    userEmail: 'jessica.t@example.com',
    type: 'Subscription',
    package: 'Monthly Plan',
    amount: '$9.99',
    fee: '$1.00',
    net: '$8.99',
    date: 'Sep 24, 2026',
    dateIso: '2026-09-24',
    status: 'Refunded',
    paymentMethod: 'Visa •••• 9921',
  },
  {
    id: 'TXN-011',
    user: 'Sophie Bouchard',
    userEmail: 'sophie.b@example.com',
    type: 'Payout',
    package: 'WalkShare Bi-Weekly Payout',
    amount: '$180.00',
    fee: '$18.00',
    net: '$162.00',
    date: 'Sep 15, 2026',
    dateIso: '2026-09-15',
    status: 'Success',
    paymentMethod: 'Interac e-Transfer',
  },
];

const statusC: Record<string, { bg: string; color: string }> = {
  Success: { bg: '#D1FAE5', color: '#065F46' },
  Pending: { bg: '#FEF3C7', color: '#92400E' },
  Failed: { bg: '#FEE2E2', color: '#991B1B' },
  Refunded: { bg: '#EEF1FB', color: '#1B2B68' },
};

type SortField = 'date' | 'amount' | 'fee' | 'net' | 'user' | 'status' | 'type';
type SortOrder = 'asc' | 'desc';

export default function PaymentsPage() {
  const [duration, setDuration] = useState('All Time');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [exportNotice, setExportNotice] = useState(false);
  const [receiptNotice, setReceiptNotice] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const parseMoney = (val: string): number => {
    return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
  };

  // Toggle or switch sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'user' ? 'asc' : 'desc');
    }
  };

  const handleDownloadReceipt = (tx: Transaction) => {
    const textContent = `================================================
HOME2SCHOOL OFFICIAL TRANSACTION RECEIPT
================================================
Transaction ID:     ${tx.id}
Date & Time:        ${tx.date}
Status:             ${tx.status}

Party:              ${tx.user} (${tx.userEmail})
Payment Method:     ${tx.paymentMethod}
Transaction Type:   ${tx.type}
Package/Service:    ${tx.package}

------------------------------------------------
FINANCIAL BREAKDOWN:
Gross Amount:       ${tx.amount}
Platform Fee (10%): - ${tx.fee}
------------------------------------------------
Net Disbursed:      ${tx.net}
================================================
Home2School Technologies Inc. • Toronto, ON
Safe & Reliable Transportation for Students
================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Home2School-Receipt-${tx.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setReceiptNotice(true);
    setTimeout(() => setReceiptNotice(false), 2400);
  };

  // Duration date boundaries (simulation anchored at Oct 1, 2026)
  const filteredTransactions = useMemo(() => {
    const referenceDate = new Date('2026-10-01T23:59:59');

    return ALL_TX.filter(t => {
      // 1. Duration Filter
      const txDate = new Date(t.dateIso + 'T12:00:00');
      let matchDuration = true;

      if (duration === 'Today') {
        matchDuration = t.dateIso === '2026-10-01';
      } else if (duration === 'Last 7 Days') {
        const diffDays = (referenceDate.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24);
        matchDuration = diffDays >= 0 && diffDays <= 7;
      } else if (duration === 'This Month (Oct)') {
        matchDuration = t.dateIso.startsWith('2026-10');
      } else if (duration === 'Last Month (Sep)') {
        matchDuration = t.dateIso.startsWith('2026-09');
      }

      // 2. Type Filter
      let matchType = true;
      if (typeFilter !== 'All') {
        matchType = t.type === typeFilter;
      }

      // 3. Status Filter
      let matchStatus = true;
      if (statusFilter !== 'All') {
        matchStatus = t.status === statusFilter;
      }

      // 4. Search Filter
      const q = search.trim().toLowerCase();
      let matchSearch = true;
      if (q) {
        matchSearch =
          t.id.toLowerCase().includes(q) ||
          t.user.toLowerCase().includes(q) ||
          t.package.toLowerCase().includes(q) ||
          t.amount.includes(q);
      }

      return matchDuration && matchType && matchStatus && matchSearch;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime();
      } else if (sortField === 'amount') {
        cmp = parseMoney(a.amount) - parseMoney(b.amount);
      } else if (sortField === 'fee') {
        cmp = parseMoney(a.fee) - parseMoney(b.fee);
      } else if (sortField === 'net') {
        cmp = parseMoney(a.net) - parseMoney(b.net);
      } else if (sortField === 'user') {
        cmp = a.user.localeCompare(b.user);
      } else if (sortField === 'status') {
        cmp = a.status.localeCompare(b.status);
      } else if (sortField === 'type') {
        cmp = a.type.localeCompare(b.type);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [duration, typeFilter, statusFilter, search, sortField, sortOrder]);

  // Export filtered transactions to CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Tx ID', 'User', 'Email', 'Type', 'Package', 'Amount', 'Fee', 'Net', 'Date', 'Status', 'Payment Method'];
    const rows = filteredTransactions.map(t => [
      t.id,
      `"${t.user}"`,
      `"${t.userEmail}"`,
      t.type,
      `"${t.package}"`,
      t.amount,
      t.fee,
      t.net,
      `"${t.date}"`,
      t.status,
      `"${t.paymentMethod}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Home2School_Ledger_${duration.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2600);
  };

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  // Reset all filters
  const handleResetFilters = () => {
    setDuration('All Time');
    setTypeFilter('All');
    setStatusFilter('All');
    setSearch('');
  };

  // Calculate dynamic metrics from filtered list
  const totalVolume = filteredTransactions
    .filter(t => t.status === 'Success')
    .reduce((acc, t) => acc + parseMoney(t.amount), 0);

  const totalFees = filteredTransactions
    .filter(t => t.status === 'Success')
    .reduce((acc, t) => acc + parseMoney(t.fee), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Manrope, sans-serif' }}>
      {/* Page Header + Duration Filter & Export */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', margin: 0, letterSpacing: '-0.02em' }}>
            Payments & Financial Ledger
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '3px 0 0' }}>
            Real-time transaction history, automated escrow holds, and driver payouts
          </p>
        </div>

        {/* Top Actions: Duration Dropdown + Export CSV Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Duration Filter Dropdown & Export (Polished Visual) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Calendar size={14} style={{ position: 'absolute', left: 12, color: '#64748B', pointerEvents: 'none' }} />
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                style={{
                  height: 38,
                  paddingLeft: 34,
                  paddingRight: 28,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#1A1D24',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'Manrope, sans-serif',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <option value="All Time">Duration: All Time</option>
                <option value="Today">Duration: Today</option>
                <option value="Last 7 Days">Duration: Last 7 Days</option>
                <option value="This Month (Oct)">Duration: This Month</option>
                <option value="Last Month (Sep)">Duration: Last Month</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={filteredTransactions.length === 0}
              style={{
                height: 38,
                padding: '0 16px',
                borderRadius: 8,
                border: 'none',
                background: exportNotice ? '#10B981' : '#1B2B68',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Manrope, sans-serif',
                cursor: filteredTransactions.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 4px rgba(27, 43, 104, 0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              {exportNotice ? (
                <><Check size={14} /> Exported!</>
              ) : (
                <><Download size={14} /> Export CSV</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#64748B', margin: '0 0 6px' }}>Total Revenue</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', margin: 0, letterSpacing: '-0.02em' }}>
            {duration === 'All Time' ? '$12,840' : `$${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          </p>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', marginTop: 3 }}>
            {duration === 'All Time' ? 'Oct 2026 MTD' : `Filtered: ${duration}`}
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#64748B', margin: '0 0 6px' }}>Escrow Held</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', margin: 0, letterSpacing: '-0.02em' }}>$2,104</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', marginTop: 3 }}>Awaiting trip confirmation</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#64748B', margin: '0 0 6px' }}>Payouts Sent</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', margin: 0, letterSpacing: '-0.02em' }}>$9,840</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', marginTop: 3 }}>Dispatched to drivers & walkers</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#64748B', margin: '0 0 6px' }}>Platform Fee</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#10B981', margin: 0, letterSpacing: '-0.02em' }}>
            {duration === 'All Time' ? '$1,284' : `$${totalFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          </p>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', marginTop: 3 }}>10% platform commission</p>
        </div>
      </div>

      {/* Main Table Card with Search & Filters */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        {/* Table Filter Toolbar */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          background: '#FAFCFF',
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Tx ID, user, package..."
              style={{
                height: 38,
                paddingLeft: 34,
                paddingRight: search ? 30 : 12,
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                fontSize: 14,
                fontFamily: 'Manrope',
                fontWeight: 500,
                color: '#1A1D24',
                background: '#FFFFFF',
                outline: 'none',
                width: 250,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>Type:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{
                height: 38,
                padding: '0 10px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                fontSize: 12,
                fontWeight: 600,
                color: '#1A1D24',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="All">All Types</option>
              <option value="Subscription">Subscription</option>
              <option value="Payout">Payout</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                height: 38,
                padding: '0 10px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                fontSize: 12,
                fontWeight: 600,
                color: '#1A1D24',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Reset Filters if any active */}
          {(duration !== 'All Time' || typeFilter !== 'All' || statusFilter !== 'All' || search) && (
            <button
              onClick={handleResetFilters}
              style={{
                height: 36,
                padding: '0 12px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                background: '#F1F5F9',
                color: '#475569',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <RefreshCw size={12} />
              Reset Filters
            </button>
          )}

          <div style={{ flex: 1 }} />

          <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>
            Showing <strong>{filteredTransactions.length}</strong> of {ALL_TX.length} transactions
          </span>
        </div>

        {/* Transactions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={thStyle}>Tx ID</th>

                <th
                  onClick={() => handleSort('user')}
                  style={thSortStyle(sortField === 'user')}
                  title="Click to sort by User"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>User</span>
                    {renderSortIcon('user', sortField, sortOrder)}
                  </div>
                </th>

                <th
                  onClick={() => handleSort('type')}
                  style={thSortStyle(sortField === 'type')}
                  title="Click to sort by Type"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>Type</span>
                    {renderSortIcon('type', sortField, sortOrder)}
                  </div>
                </th>

                <th style={thStyle}>Package / Note</th>

                <th
                  onClick={() => handleSort('amount')}
                  style={thSortStyle(sortField === 'amount')}
                  title="Click to sort by Amount"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>Amount</span>
                    {renderSortIcon('amount', sortField, sortOrder)}
                  </div>
                </th>

                

                <th
                  onClick={() => handleSort('date')}
                  style={thSortStyle(sortField === 'date')}
                  title="Click to sort by Date"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>Date</span>
                    {renderSortIcon('date', sortField, sortOrder)}
                  </div>
                </th>

                <th
                  onClick={() => handleSort('status')}
                  style={thSortStyle(sortField === 'status')}
                  title="Click to sort by Status"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>Status</span>
                    {renderSortIcon('status', sortField, sortOrder)}
                  </div>
                </th>

                <th style={{ ...thStyle, textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px' }}>No transactions found</p>
                    <p style={{ fontSize: 14, margin: 0 }}>Try clearing your filters or selecting a different duration.</p>
                    <button
                      onClick={handleResetFilters}
                      style={{
                        marginTop: 12,
                        padding: '6px 14px',
                        borderRadius: 8,
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: '#1B2B68',
                      }}
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map(t => {
                  const sc = statusC[t.status] || { bg: '#F1F5F9', color: '#475569' };
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTx(t)}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
                    >
                      {/* Tx ID */}
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 800, color: '#1B2B68', fontVariantNumeric: 'tabular-nums' }}>
                        {t.id}
                      </td>

                      {/* User */}
                      <td style={{ padding: '14px 16px' }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: 0 }}>{t.user}</p>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', margin: '2px 0 0' }}>{t.userEmail}</p>
                      </td>

                      {/* Type Badge */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: 6,
                            background: t.type === 'Payout' ? '#FFF0E8' : '#EEF1FB',
                            color: t.type === 'Payout' ? '#F2600C' : '#1B2B68',
                          }}
                        >
                          {t.type}
                        </span>
                      </td>

                      {/* Package */}
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500, color: '#475569' }}>
                        {t.package}
                      </td>

                      {/* Minimal Amount */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: t.type === 'Payout' ? '#059669' : '#1A1D24' }}>
                          {t.type === 'Payout' ? '+' + t.amount : t.amount}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '14px 16px', fontSize: 12, fontWeight: 600, color: '#64748B' }}>
                        {t.date}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            padding: '3px 9px',
                            borderRadius: 6,
                            background: sc.bg,
                            color: sc.color,
                            letterSpacing: '0.02em',
                          }}
                        >
                          {t.status}
                        </span>
                      </td>

                      {/* Receipt Link */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedTx(t);
                          }}
                          style={{
                            padding: '5px 10px',
                            borderRadius: 6,
                            border: '1px solid #E2E8F0',
                            background: '#FFFFFF',
                            color: '#1B2B68',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <FileText size={12} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Minimalist Clean Pagination Bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderTop: '1px solid #E2E8F0',
            background: '#FFFFFF',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Showing <strong>{filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, filteredTransactions.length)}</strong> of{' '}
            <strong>{filteredTransactions.length}</strong> transactions
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 6,
                border: '1px solid #CBD5E1',
                background: currentPage === 1 ? '#F8FAFC' : '#FFFFFF',
                color: currentPage === 1 ? '#94A3B8' : '#1B2B68',
                fontSize: 12,
                fontWeight: 700,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: currentPage === p ? 'none' : '1px solid #CBD5E1',
                  background: currentPage === p ? '#1B2B68' : '#FFFFFF',
                  color: currentPage === p ? '#FFFFFF' : '#475569',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 6,
                border: '1px solid #CBD5E1',
                background: currentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
                color: currentPage === totalPages ? '#94A3B8' : '#1B2B68',
                fontSize: 12,
                fontWeight: 700,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTx && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 100,
          }}
          onClick={() => setSelectedTx(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#FFFFFF',
              borderRadius: 16,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              fontFamily: 'Manrope, sans-serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFCFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24' }}>
                  Transaction Receipt
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1B2B68', background: '#EEF1FB', padding: '2px 8px', borderRadius: 4 }}>
                  {selectedTx.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Status Banner */}
              <div style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: statusC[selectedTx.status]?.bg || '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: statusC[selectedTx.status]?.color, textTransform: 'uppercase', margin: 0 }}>Status</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: statusC[selectedTx.status]?.color, margin: '2px 0 0' }}>{selectedTx.status}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', margin: 0 }}>Date & Time</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: '2px 0 0' }}>{selectedTx.date}</p>
                </div>
              </div>

              {/* Parties */}
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 2px' }}>
                    {selectedTx.type === 'Subscription' ? 'Payer' : 'Payee'}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#1A1D24', margin: 0 }}>{selectedTx.user}</p>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>{selectedTx.userEmail}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 2px' }}>Payment Method</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#475569', margin: 0 }}>{selectedTx.paymentMethod}</p>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#1A1D24', textTransform: 'uppercase', marginBottom: 10 }}>Financial Breakdown</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#475569' }}>
                  <span>Gross Transaction Amount</span>
                  <span style={{ fontWeight: 700, color: '#1A1D24' }}>{selectedTx.amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#475569' }}>
                  <span>Platform Commission (10%)</span>
                  <span style={{ fontWeight: 600, color: '#94A3B8' }}>- {selectedTx.fee}</span>
                </div>
                <div style={{ height: 1, background: '#E2E8F0', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800 }}>
                  <span style={{ color: '#1A1D24' }}>Net Disbursed / Settled</span>
                  <span style={{ color: '#10B981' }}>{selectedTx.net}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '14px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setSelectedTx(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDownloadReceipt(selectedTx)}
                style={{
                  height: 38,
                  padding: '0 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: receiptNotice ? '#10B981' : '#1B2B68',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'background 0.2s ease',
                }}
              >
                {receiptNotice ? (
                  <>
                    <Check size={14} /> Downloaded
                  </>
                ) : (
                  <>
                    <Download size={14} /> Receipt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: '#94A3B8',
  padding: '12px 16px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  borderBottom: '1px solid #F1F5F9',
};

const thSortStyle = (isActive: boolean): React.CSSProperties => ({
  ...thStyle,
  color: isActive ? '#1B2B68' : '#94A3B8',
  cursor: 'pointer',
  userSelect: 'none',
});

function renderSortIcon(field: SortField, activeField: SortField, order: SortOrder) {
  if (field !== activeField) {
    return <ArrowUpDown size={12} style={{ opacity: 0.35 }} />;
  }
  return order === 'asc' ? (
    <ArrowUp size={13} style={{ color: '#1B2B68', strokeWidth: 2.5 }} />
  ) : (
    <ArrowDown size={13} style={{ color: '#1B2B68', strokeWidth: 2.5 }} />
  );
}
