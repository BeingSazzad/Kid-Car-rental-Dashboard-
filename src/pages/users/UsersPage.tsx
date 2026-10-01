import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Search, ArrowUpDown, RefreshCw, ChevronDown
} from 'lucide-react';

import { INITIAL_USERS } from '@/constants/mockUsers';
export type UserRole = 'Parent' | 'Driver' | 'Walker';

export interface UserItem {
  id: string;
  name: string;
  roles: UserRole[];
  activeRole: UserRole;
  phone: string;
  email: string;
  joined: string;
  trips: number;
  spent: string;
  status: 'Active' | 'Pending' | 'Banned';
  details?: {
    vehicleOrChildren: string;
    rating: string;
    address: string;
  };
}

const INITIAL_USERS: UserItem[] = [
  {
    id: 'P001',
    name: 'Sarah Tremblay',
    roles: ['Parent'],
    activeRole: 'Parent',
    phone: '+1 (416) 555-0192',
    email: 'sarah.t@example.com',
    joined: 'Sep 8, 2026',
    trips: 24,
    spent: '$218',
    status: 'Active',
    details: {
      vehicleOrChildren: '2 Children (Liam - Gr 3, Emma - Gr 1)',
      rating: '4.9 ★ (Parent)',
      address: '142 Elmwood Ave, Toronto, ON',
    }
  },
  {
    id: 'D001',
    name: 'Tariq Ahmed',
    roles: ['Driver', 'Parent'],
    activeRole: 'Driver',
    phone: '+1 (416) 555-0182',
    email: 'tariq.ahmed@example.com',
    joined: 'Aug 14, 2026',
    trips: 128,
    spent: '$2,860',
    status: 'Active',
    details: {
      vehicleOrChildren: '2023 Toyota Sienna (7 Seater) • Plate #H2S-882 • 1 Child',
      rating: '4.95 ★ (Top Driver & Parent)',
      address: '210 Danforth Ave, Toronto, ON',
    }
  },
  {
    id: 'W001',
    name: 'Sarah Jenkins',
    roles: ['Walker', 'Parent'],
    activeRole: 'Walker',
    phone: '+1 (416) 555-0185',
    email: 'sarah.j@example.com',
    joined: 'Sep 1, 2026',
    trips: 45,
    spent: '$1,580',
    status: 'Active',
    details: {
      vehicleOrChildren: 'WalkShare Zone Leader • 1 Child enrolled',
      rating: '4.92 ★ (Certified Walker)',
      address: '500 Yonge St, Toronto, ON',
    }
  },
  {
    id: 'P002',
    name: 'Amanda Roy',
    roles: ['Parent'],
    activeRole: 'Parent',
    phone: '+1 (416) 555-0201',
    email: 'amanda.roy@example.com',
    joined: 'Sep 12, 2026',
    trips: 16,
    spent: '$159',
    status: 'Active',
    details: {
      vehicleOrChildren: '1 Child (Lucas - Gr 2)',
      rating: '5.0 ★ (Parent)',
      address: '88 Bloor St W, Toronto, ON',
    }
  },
  {
    id: 'D002',
    name: 'Farhana Yasmin',
    roles: ['Driver'],
    activeRole: 'Driver',
    phone: '+1 (416) 555-0183',
    email: 'farhana.y@example.com',
    joined: 'Aug 22, 2026',
    trips: 97,
    spent: '$2,410',
    status: 'Active',
    details: {
      vehicleOrChildren: '2022 Honda Odyssey (7 Seater) • Plate #H2S-914',
      rating: '4.98 ★ (Driver)',
      address: '45 Markham Rd, Scarborough, ON',
    }
  },
  {
    id: 'P003',
    name: 'Marcus Vance',
    roles: ['Parent', 'Driver'],
    activeRole: 'Parent',
    phone: '+1 (416) 555-0188',
    email: 'marcus.v@example.com',
    joined: 'Sep 20, 2026',
    trips: 8,
    spent: '$79',
    status: 'Pending',
    details: {
      vehicleOrChildren: '1 Child (Noah) • Driver KYC under review',
      rating: 'New Parent & Driver applicant',
      address: '19 Queen St E, Toronto, ON',
    }
  },
  {
    id: 'W002',
    name: 'Sophie Bouchard',
    roles: ['Walker'],
    activeRole: 'Walker',
    phone: '+1 (416) 555-0186',
    email: 'sophie.b@example.com',
    joined: 'Sep 10, 2026',
    trips: 38,
    spent: '$1,120',
    status: 'Active',
    details: {
      vehicleOrChildren: 'Certified Walking School Bus Chaperone',
      rating: '4.96 ★ (Walker)',
      address: '124 St George St, Toronto, ON',
    }
  },
  {
    id: 'D003',
    name: 'Kabir Hossain',
    roles: ['Driver'],
    activeRole: 'Driver',
    phone: '+1 (416) 555-0184',
    email: 'kabir.h@example.com',
    joined: 'Sep 15, 2026',
    trips: 62,
    spent: '$1,920',
    status: 'Active',
    details: {
      vehicleOrChildren: '2024 Toyota HiAce Minivan • Plate #H2S-305',
      rating: '4.89 ★ (Driver)',
      address: '77 Lawrence Ave, North York, ON',
    }
  },
  {
    id: 'P004',
    name: 'Claire Dubois',
    roles: ['Parent'],
    activeRole: 'Parent',
    phone: '+1 (416) 555-0191',
    email: 'claire.d@example.com',
    joined: 'Sep 25, 2026',
    trips: 4,
    spent: '$40',
    status: 'Active',
    details: {
      vehicleOrChildren: '1 Child (Chloe - Gr 4)',
      rating: '5.0 ★ (Parent)',
      address: '320 Bay St, Toronto, ON',
    }
  },
];

const roleStyles: Record<UserRole, { bg: string; color: string; border: string }> = {
  Parent: { bg: '#EEF2FF', color: '#1B2B68', border: '#C7D2FE' },
  Driver: { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
  Walker: { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  Active: { bg: '#D1FAE5', color: '#065F46' },
  Pending: { bg: '#FEF3C7', color: '#92400E' },
  Banned: { bg: '#FEE2E2', color: '#991B1B' },
};

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleTab, setRoleTab] = useState<'All' | 'Parents' | 'Drivers' | 'Walkers' | 'Multi-Role'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Banned'>('All');
  const [sortBy, setSortBy] = useState<'joined' | 'name' | 'trips' | 'spent'>('joined');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Role Tab Counts
  const counts = useMemo(() => {
    return {
      All: users.length,
      Parents: users.filter(u => u.roles.includes('Parent')).length,
      Drivers: users.filter(u => u.roles.includes('Driver')).length,
      Walkers: users.filter(u => u.roles.includes('Walker')).length,
      'Multi-Role': users.filter(u => u.roles.length > 1).length,
    };
  }, [users]);

  // Filtering & Sorting
  const filteredUsers = useMemo(() => {
    return users
      .filter(u => {
        const matchesSearch =
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.phone.toLowerCase().includes(search.toLowerCase()) ||
          u.id.toLowerCase().includes(search.toLowerCase());

        const matchesRole =
          roleTab === 'All'
            ? true
            : roleTab === 'Parents'
            ? u.roles.includes('Parent')
            : roleTab === 'Drivers'
            ? u.roles.includes('Driver')
            : roleTab === 'Walkers'
            ? u.roles.includes('Walker')
            : u.roles.length > 1;

        const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'name') diff = a.name.localeCompare(b.name);
        else if (sortBy === 'trips') diff = a.trips - b.trips;
        else if (sortBy === 'spent') {
          const sA = parseFloat(a.spent.replace(/[^0-9.]/g, '')) || 0;
          const sB = parseFloat(b.spent.replace(/[^0-9.]/g, '')) || 0;
          diff = sA - sB;
        } else {
          diff = a.id.localeCompare(b.id);
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [users, search, roleTab, statusFilter, sortBy, sortOrder]);

  const handleToggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleToggleBan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUsers(users.map(u => {
      if (u.id === id) {
        const next = u.status === 'Banned' ? 'Active' : 'Banned';
        return { ...u, status: next };
      }
      return u;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Manrope, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', margin: 0, letterSpacing: '-0.02em' }}>
            User Management
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '4px 0 0' }}>
            Unified registry of parents, certified drivers, and walkshare chaperones
          </p>
        </div>

        <button
          onClick={() => setUsers([...INITIAL_USERS])}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            height: 38,
            padding: '0 14px',
            borderRadius: 8,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            color: '#475569',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Filter & Search Toolbar (Single Responsive Line) ── */}
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
        {/* Left: Role Tabs + Status + Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Role Tabs */}
          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 4 }}>
            {(['All', 'Parents', 'Drivers', 'Walkers', 'Multi-Role'] as const).map(tab => {
              const active = roleTab === tab;
              const count = counts[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setRoleTab(tab)}
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
                      color: active ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ width: 1, height: 24, background: '#E2E8F0' }} />

          {/* Status Dropdown */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              style={{
                height: 38,
                paddingLeft: 14,
                paddingRight: 34,
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
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
              <option value="All">Status: All</option>
              <option value="Active">Status: Active</option>
              <option value="Pending">Status: Pending</option>
              <option value="Banned">Status: Banned</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, color: '#64748B', pointerEvents: 'none' }} />
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{
                height: 38,
                paddingLeft: 14,
                paddingRight: 34,
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
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
              <option value="joined">Sort: Joined</option>
              <option value="name">Sort: Name</option>
              <option value="trips">Sort: Trips</option>
              <option value="spent">Sort: Volume</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, color: '#64748B', pointerEvents: 'none' }} />
          </div>

          {(search || roleTab !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setRoleTab('All');
                setStatusFilter('All');
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
        <div style={{ position: 'relative', width: 240, maxWidth: '100%' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: 12, color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: 38,
              paddingLeft: 34,
              paddingRight: 12,
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

      {/* ── Users Table ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>User</th>
              <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Roles</th>
              <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Contact</th>
              <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Joined</th>
              <th
                onClick={() => handleToggleSort('trips')}
                style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Trips</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => handleToggleSort('spent')}
                style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Financial Activity</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                  No users found matching query
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr
                  key={u.id}
                  onClick={() => navigate(`/users/${u.id}`)}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
                >
                  {/* User Profile Info */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: '#EEF2FF',
                          border: '1px solid #C7D2FE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#1B2B68',
                          flexShrink: 0,
                        }}
                      >
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                          {u.name}
                        </p>
                        <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>
                          {u.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Multi-Role Capabilities */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {u.roles.map(r => {
                        const style = roleStyles[r];
                        const isActive = u.activeRole === r;
                        return (
                          <span
                            key={r}
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: style.bg,
                              color: style.color,
                              border: '1px solid ' + style.border,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.color }} />}
                            {r}
                          </span>
                        );
                      })}
                      {u.roles.length === 2 && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '2px 6px', borderRadius: 4, border: '1px solid #E2E8F0' }}>
                          Dual-Mode
                        </span>
                      )}
                      {u.roles.length >= 3 && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', padding: '2px 6px', borderRadius: 4, border: '1px solid #DDD6FE' }}>
                          Multi-Role
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Contact */}
                  <td style={{ padding: '14px 18px' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#334155', margin: 0 }}>{u.phone}</p>
                    <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>{u.email}</p>
                  </td>

                  {/* Joined Date */}
                  <td style={{ padding: '14px 18px', fontSize: 12, color: '#64748B' }}>
                    {u.joined}
                  </td>

                  {/* Trips */}
                  <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    {u.trips}
                  </td>

                  {/* Financial Activity (Role-Aware) */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: u.roles.includes('Driver') || u.roles.includes('Walker') ? '#059669' : '#1B2B68',
                        }}
                      >
                        {u.spent}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8' }}>
                        {u.roles.includes('Driver') || u.roles.includes('Walker')
                          ? (u.roles.includes('Parent') ? 'Earned & Spent' : 'Total Earned')
                          : 'Total Spent'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: statusColors[u.status].bg,
                        color: statusColors[u.status].color,
                      }}
                    >
                      {u.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/users/${u.id}`);
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

                      <button
                        onClick={e => handleToggleBan(u.id, e)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 8,
                          border: '1px solid #E2E8F0',
                          background: u.status === 'Banned' ? '#ECFDF5' : '#FFF5F5',
                          color: u.status === 'Banned' ? '#059669' : '#DC2626',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {u.status === 'Banned' ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      </div>
  );
}
