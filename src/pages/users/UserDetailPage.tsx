import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, MapPin, AlertTriangle, ShieldCheck, Car,
  CheckCircle2, Baby, UserCheck, Award, Ban, Check, Send
} from 'lucide-react';
import { INITIAL_USERS, UserItem, UserRole } from '@/constants/mockUsers';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find user from mock dataset
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const currentUser = useMemo(() => {
    return users.find(u => u.id === id) || users[0];
  }, [users, id]);

  const [activeTab, setActiveTab] = useState<'Parent' | 'Driver' | 'Walker' | 'Overview'>(
    currentUser.roles.includes('Parent') ? 'Parent' : currentUser.roles[0] || 'Overview'
  );

  const [notificationSent, setNotificationSent] = useState(false);

  const handleToggleBan = () => {
    setUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' }
          : u
      )
    );
  };

  const handleSendNotification = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 3000);
  };

  const roleStyles: Record<UserRole, { bg: string; color: string; border: string }> = {
    Parent: { bg: '#EEF2FF', color: '#1B2B68', border: '#C7D2FE' },
    Driver: { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
    Walker: { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
  };

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    Active: { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' },
    Pending: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
    Banned: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Manrope, sans-serif', paddingBottom: 40 }}>
      {/* ── Top Navigation Bar / Breadcrumbs ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button
          onClick={() => navigate('/users')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            color: '#1B2B68',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
          onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
        >
          <ArrowLeft size={16} />
          <span>Back to Users List</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleSendNotification}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            {notificationSent ? <Check size={15} color="#059669" /> : <Send size={15} />}
            <span>{notificationSent ? 'Notification Sent!' : 'Send Direct Notice'}</span>
          </button>

          <button
            onClick={handleToggleBan}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: currentUser.status === 'Banned' ? '#059669' : '#DC2626',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 700,
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
            }}
          >
            <Ban size={15} />
            <span>{currentUser.status === 'Banned' ? 'Unban Account' : 'Ban Account'}</span>
          </button>
        </div>
      </div>

      {/* ── User Master Hero Header Card ── */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '24px 28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #1B2B68 0%, #3B82F6 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 800,
                boxShadow: '0 4px 10px rgba(27, 43, 104, 0.2)',
              }}
            >
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                  {currentUser.name}
                </h1>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 99,
                    background: statusColors[currentUser.status]?.bg || '#F1F5F9',
                    color: statusColors[currentUser.status]?.color || '#475569',
                    border: `1px solid ${statusColors[currentUser.status]?.border || '#E2E8F0'}`,
                  }}
                >
                  {currentUser.status}
                </span>

                {currentUser.roles.length > 1 && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 99,
                      background: currentUser.roles.length === 3 ? '#F3E8FF' : '#F1F5F9',
                      color: currentUser.roles.length === 3 ? '#7E22CE' : '#475569',
                      border: currentUser.roles.length === 3 ? '1px solid #D8B4FE' : '1px solid #CBD5E1',
                    }}
                  >
                    {currentUser.roles.length === 3 ? '★ Multi-Role (3 Roles)' : 'Dual-Mode'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                  User ID: <strong style={{ color: '#1B2B68' }}>{currentUser.id}</strong>
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                  Member since {currentUser.joined}
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontSize: 13, color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={15} /> Identity Verified
                </span>
              </div>
            </div>
          </div>

          {/* Quick Enrolled Roles Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
              Enrolled Roles
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {currentUser.roles.map(r => (
                <span
                  key={r}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: roleStyles[r].bg,
                    color: roleStyles[r].color,
                    border: `1px solid ${roleStyles[r].border}`,
                  }}
                >
                  {r} {r === currentUser.activeRole && '● Active Mode'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Master Info Bar (Phone, Email, Address, Emergency Contact) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            background: '#F8FAFC',
            border: '1px solid #F1F5F9',
            borderRadius: 12,
            padding: '14px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B2B68' }}>
              <Phone size={15} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#64748B', margin: 0 }}>Primary Phone</p>
              <a href={`tel:${currentUser.phone}`} style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>
                {currentUser.phone}
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B2B68' }}>
              <Mail size={15} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#64748B', margin: 0 }}>Email Address</p>
              <a href={`mailto:${currentUser.email}`} style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>
                {currentUser.email}
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B2B68' }}>
              <MapPin size={15} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#64748B', margin: 0 }}>Home / Base Address</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {currentUser.address || 'Toronto, ON'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
              <AlertTriangle size={15} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#64748B', margin: 0 }}>Emergency Contact</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {currentUser.emergencyContact?.name} ({currentUser.emergencyContact?.relation}): {currentUser.emergencyContact?.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Global Key Metrics Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 16px', background: '#FFFFFF' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Total Trips Recorded</span>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '4px 0 0' }}>{currentUser.trips}</p>
          </div>
          <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 16px', background: '#FFFFFF' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Total Spend / Volume</span>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#1B2B68', margin: '4px 0 0' }}>{currentUser.spent}</p>
          </div>
          <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 16px', background: '#FFFFFF' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Trust & Safety Rating</span>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#059669', margin: '4px 0 0' }}>
              {currentUser.details?.rating?.split('★')[0]?.trim() || '5.0'} ★
            </p>
          </div>
          <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 16px', background: '#FFFFFF' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Account Roles</span>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '6px 0 0' }}>
              {currentUser.roles.join(' + ')}
            </p>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE ROLE SELECTOR TABS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Role Specific Profiles & Audit History
            </h2>
            <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
              Select a role to inspect enrolled children, vehicle diagnostics, walking zones, and trip histories.
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div style={{ display: 'flex', gap: 6, background: '#F1F5F9', padding: 4, borderRadius: 10 }}>
            {(['Parent', 'Driver', 'Walker'] as UserRole[]).map(role => {
              const isEnrolled = currentUser.roles.includes(role);
              const isSelected = activeTab === role;
              return (
                <button
                  key={role}
                  onClick={() => setActiveTab(role)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: isSelected ? '#FFFFFF' : 'transparent',
                    color: isSelected ? '#1B2B68' : '#64748B',
                    boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>
                    {role === 'Parent' ? '👨‍👩‍👧 Parent' : role === 'Driver' ? '🚗 Driver' : '🚶 Walker'}
                  </span>
                  {isEnrolled ? (
                    <span
                      style={{
                        fontSize: 10,
                        padding: '1px 6px',
                        borderRadius: 99,
                        background: roleStyles[role].bg,
                        color: roleStyles[role].color,
                        fontWeight: 800,
                      }}
                    >
                      Enrolled
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: '#94A3B8' }}>Unregistered</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: PARENT ROLE VIEW (Children / Babies info & Rides)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Parent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {currentUser.roles.includes('Parent') ? (
              <>
                {/* Section A: Children / Babies Profile Cards */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B2B68' }}>
                        <Baby size={18} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Registered Children ({currentUser.parentDetails?.children?.length || 0} Kids)
                        </h3>
                        <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                          Verified child passenger profiles, school allocations, booster seat rules, and emergency notes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {currentUser.parentDetails?.children && currentUser.parentDetails.children.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                      {currentUser.parentDetails.children.map(child => (
                        <div
                          key={child.id}
                          style={{
                            border: '1px solid #E2E8F0',
                            borderRadius: 14,
                            padding: '18px 20px',
                            background: '#F8FAFC',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 28 }}>{child.avatar}</span>
                              <div>
                                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                  {child.name}
                                </h4>
                                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                                  Age {child.age} • {child.grade}
                                </span>
                              </div>
                            </div>

                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: child.commuteMode.includes('Van') ? '#EEF2FF' : '#ECFDF5',
                                color: child.commuteMode.includes('Van') ? '#1B2B68' : '#047857',
                              }}
                            >
                              {child.commuteMode}
                            </span>
                          </div>

                          {/* School Details */}
                          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                              Enrolled School & Timings
                            </span>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                              {child.school}
                            </p>
                            <span style={{ fontSize: 12, color: '#64748B' }}>
                              {child.schoolAddress}
                            </span>
                            <div style={{ display: 'flex', gap: 14, marginTop: 4, fontSize: 12, fontWeight: 600, color: '#1B2B68' }}>
                              <span>🌅 Pickup: {child.pickupTime}</span>
                              <span>🌆 Dropoff: {child.dropoffTime}</span>
                            </div>
                          </div>

                          {/* Assigned Chaperone & Safety */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#64748B' }}>Assigned Escort:</span>
                              <strong style={{ color: '#0F172A' }}>{child.assignedChaperone}</strong>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#64748B' }}>Booster Seat:</span>
                              <strong style={{ color: child.boosterSeatRequired ? '#B45309' : '#059669' }}>
                                {child.boosterSeatRequired ? 'Mandatory (Booster Required)' : 'Standard Belt Cleared'}
                              </strong>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: '#FEF3C7', padding: '6px 10px', borderRadius: 8, color: '#92400E' }}>
                              <strong style={{ fontSize: 11 }}>Safety & Medical Instructions:</strong>
                              <span>{child.notes}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: 30, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                      No children records attached to this parent profile yet.
                    </div>
                  )}
                </div>

                {/* Section B: Parent Commute Rides History */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Parent Trip & Booking History
                      </h3>
                      <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                        Past school runs, route audits, assigned drivers, and fares paid.
                      </p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1B2B68', background: '#EEF2FF', padding: '4px 10px', borderRadius: 8 }}>
                      Plan: {currentUser.parentDetails?.subscriptionPlan || 'Pay As You Go'}
                    </span>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '12px 20px' }}>Trip ID / Date</th>
                        <th style={{ padding: '12px 20px' }}>Type</th>
                        <th style={{ padding: '12px 20px' }}>Route Details</th>
                        <th style={{ padding: '12px 20px' }}>Assigned Driver/Walker</th>
                        <th style={{ padding: '12px 20px' }}>Amount</th>
                        <th style={{ padding: '12px 20px', textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUser.parentDetails?.history && currentUser.parentDetails.history.length > 0 ? (
                        currentUser.parentDetails.history.map(trip => (
                          <tr key={trip.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '14px 20px' }}>
                              <strong style={{ color: '#1B2B68' }}>{trip.id}</strong>
                              <div style={{ fontSize: 11, color: '#64748B' }}>{trip.date} • {trip.time}</div>
                            </td>
                            <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0F172A' }}>
                              {trip.tripType}
                            </td>
                            <td style={{ padding: '14px 20px', color: '#475569' }}>
                              {trip.route}
                            </td>
                            <td style={{ padding: '14px 20px', color: '#0F172A', fontWeight: 600 }}>
                              {trip.companionOrDriver}
                            </td>
                            <td style={{ padding: '14px 20px', fontWeight: 700, color: '#059669' }}>
                              {trip.amount}
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: '#ECFDF5', color: '#059669' }}>
                                {trip.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ padding: 30, textAlign: 'center', color: '#94A3B8' }}>
                            No trip history on file.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ background: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: 16, padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#64748B', margin: 0 }}>
                  This user is not enrolled as a Parent.
                </p>
                <p style={{ fontSize: 13, color: '#94A3B8', margin: '6px 0 16px' }}>
                  No registered children or school booking profiles exist for this user.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: DRIVER ROLE VIEW (Vehicle, Commercial Insurance, KYC & Trips)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Driver' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {currentUser.roles.includes('Driver') ? (
              <>
                {/* Vehicle & KYC Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
                  {/* Vehicle Card */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                        <Car size={18} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Vehicle Specification & Safety
                        </h3>
                        <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                          Registered school transport vehicle
                        </p>
                      </div>
                    </div>

                    {currentUser.driverDetails?.vehicle ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Model & Year:</span>
                          <strong style={{ color: '#0F172A' }}>{currentUser.driverDetails.vehicle.model} ({currentUser.driverDetails.vehicle.year})</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>License Plate:</span>
                          <strong style={{ color: '#1B2B68', background: '#EEF2FF', padding: '2px 8px', borderRadius: 6 }}>
                            {currentUser.driverDetails.vehicle.plate}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Capacity:</span>
                          <strong style={{ color: '#0F172A' }}>{currentUser.driverDetails.vehicle.seats} Passengers / Child Boosters</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>VIN:</span>
                          <span style={{ fontFamily: 'monospace', color: '#475569', fontSize: 12 }}>{currentUser.driverDetails.vehicle.vin}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Safety Inspection Expiry:</span>
                          <strong style={{ color: '#059669' }}>{currentUser.driverDetails.vehicle.safetyCertExpiry}</strong>
                        </div>

                        <div style={{ marginTop: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                            Onboard Child Safety Equipment
                          </span>
                          <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: '#334155', fontSize: 12, lineHeight: 1.6 }}>
                            {currentUser.driverDetails.vehicle.safetyFeatures.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: '#94A3B8', fontSize: 13 }}>No vehicle registered.</p>
                    )}
                  </div>

                  {/* Driver KYC & Background Clearance Card */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Driver KYC & Safety Checks
                        </h3>
                        <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                          Verified background checks & commercial insurance
                        </p>
                      </div>
                    </div>

                    {currentUser.driverDetails?.kyc ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Driver License:</span>
                          <strong style={{ color: '#0F172A' }}>{currentUser.driverDetails.kyc.licenseNumber}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>License Expiry:</span>
                          <strong style={{ color: '#0F172A' }}>{currentUser.driverDetails.kyc.licenseExpiry}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Police Vulnerable Sector (VSC):</span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#ECFDF5', color: '#059669' }}>
                            {currentUser.driverDetails.kyc.vscCheck} ({currentUser.driverDetails.kyc.vscReference})
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Insurance Policy:</span>
                          <strong style={{ color: '#0F172A' }}>{currentUser.driverDetails.kyc.insurancePolicy}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Insurance Provider:</span>
                          <span style={{ color: '#475569' }}>{currentUser.driverDetails.kyc.insuranceProvider}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Driver Rating:</span>
                          <strong style={{ color: '#B45309' }}>{currentUser.driverDetails.rating} ★ (from parent reviews)</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>On-Time Arrival Rate:</span>
                          <strong style={{ color: '#059669' }}>{currentUser.driverDetails.onTimeRate}</strong>
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: '#94A3B8', fontSize: 13 }}>No KYC records available.</p>
                    )}
                  </div>
                </div>

                {/* Driver Completed Trips Log */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Driver School Shuttle Trips History
                      </h3>
                      <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                        Executed carpool routes, children count transported, and driver earnings.
                      </p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '4px 12px', borderRadius: 8 }}>
                      Total Earned: {currentUser.driverDetails?.totalEarnings || '$0 CAD'}
                    </span>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '12px 20px' }}>Log ID / Date</th>
                        <th style={{ padding: '12px 20px' }}>Route Details</th>
                        <th style={{ padding: '12px 20px' }}>Passenger Children</th>
                        <th style={{ padding: '12px 20px' }}>Driver Earnings</th>
                        <th style={{ padding: '12px 20px', textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUser.driverDetails?.history && currentUser.driverDetails.history.length > 0 ? (
                        currentUser.driverDetails.history.map(trip => (
                          <tr key={trip.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '14px 20px' }}>
                              <strong style={{ color: '#1B2B68' }}>{trip.id}</strong>
                              <div style={{ fontSize: 11, color: '#64748B' }}>{trip.date} • {trip.time}</div>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ fontWeight: 600, color: '#0F172A' }}>{trip.tripType}</div>
                              <div style={{ fontSize: 12, color: '#64748B' }}>{trip.route}</div>
                            </td>
                            <td style={{ padding: '14px 20px', color: '#475569' }}>
                              {trip.companionOrDriver}
                            </td>
                            <td style={{ padding: '14px 20px', fontWeight: 800, color: '#059669' }}>
                              {trip.amount}
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: '#ECFDF5', color: '#059669' }}>
                                {trip.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ padding: 30, textAlign: 'center', color: '#94A3B8' }}>
                            No driver trips recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ background: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: 16, padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#64748B', margin: 0 }}>
                  This user is not enrolled as a Driver.
                </p>
                <p style={{ fontSize: 13, color: '#94A3B8', margin: '6px 0 16px' }}>
                  No vehicle or commercial driving history recorded.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: WALKER ROLE VIEW (Walking School Bus Zone, First Aid & Trips)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Walker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {currentUser.roles.includes('Walker') ? (
              <>
                {/* Zone & Certifications Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
                  {/* WalkShare Zone Card */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
                        <UserCheck size={18} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          WalkShare Zone & Group Capacity
                        </h3>
                        <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                          Walking School Bus Chaperone assignment
                        </p>
                      </div>
                    </div>

                    {currentUser.walkerDetails?.info ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Assigned Corridor:</span>
                          <strong style={{ color: '#0F172A' }}>{currentUser.walkerDetails.info.zone}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Chaperone Badge ID:</span>
                          <strong style={{ color: '#047857', background: '#ECFDF5', padding: '2px 8px', borderRadius: 6 }}>
                            {currentUser.walkerDetails.info.chaperoneBadge}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Group Capacity:</span>
                          <strong style={{ color: '#0F172A' }}>
                            {currentUser.walkerDetails.info.currentChildrenCount} / {currentUser.walkerDetails.info.maxGroupSize} Children (Under Safe Ratio)
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Safe Assembly Point:</span>
                          <strong style={{ color: '#1B2B68' }}>{currentUser.walkerDetails.info.meetingPoint}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Walker Rating:</span>
                          <strong style={{ color: '#B45309' }}>{currentUser.walkerDetails.rating} ★ (from parents)</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                          <span style={{ color: '#64748B' }}>Punctuality Score:</span>
                          <strong style={{ color: '#059669' }}>{currentUser.walkerDetails.punctualityRate}</strong>
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: '#94A3B8', fontSize: 13 }}>No walk details recorded.</p>
                    )}
                  </div>

                  {/* Certifications Card */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B2B68' }}>
                        <Award size={18} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Walker Safety Certifications
                        </h3>
                        <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                          Pedestrian safety, First Aid & Police Cleared
                        </p>
                      </div>
                    </div>

                    {currentUser.walkerDetails?.info?.certifications ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {currentUser.walkerDetails.info.certifications.map((cert, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              background: '#F8FAFC',
                              border: '1px solid #F1F5F9',
                              borderRadius: 8,
                              padding: '10px 12px',
                              fontSize: 12,
                              color: '#334155',
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle2 size={16} color="#059669" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#94A3B8', fontSize: 13 }}>No certifications uploaded.</p>
                    )}
                  </div>
                </div>

                {/* Walker Trips History */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Walking School Bus Escort Log
                      </h3>
                      <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                        Completed walking runs, children attendance, and chaperone stipends.
                      </p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '4px 12px', borderRadius: 8 }}>
                      Total Earned: {currentUser.walkerDetails?.totalEarnings || '$0 CAD'}
                    </span>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '12px 20px' }}>Walk ID / Date</th>
                        <th style={{ padding: '12px 20px' }}>Route Details</th>
                        <th style={{ padding: '12px 20px' }}>Children Chaperoned</th>
                        <th style={{ padding: '12px 20px' }}>Chaperone Stipend</th>
                        <th style={{ padding: '12px 20px', textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUser.walkerDetails?.history && currentUser.walkerDetails.history.length > 0 ? (
                        currentUser.walkerDetails.history.map(trip => (
                          <tr key={trip.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '14px 20px' }}>
                              <strong style={{ color: '#1B2B68' }}>{trip.id}</strong>
                              <div style={{ fontSize: 11, color: '#64748B' }}>{trip.date} • {trip.time}</div>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ fontWeight: 600, color: '#0F172A' }}>{trip.tripType}</div>
                              <div style={{ fontSize: 12, color: '#64748B' }}>{trip.route}</div>
                            </td>
                            <td style={{ padding: '14px 20px', color: '#475569' }}>
                              {trip.companionOrDriver}
                            </td>
                            <td style={{ padding: '14px 20px', fontWeight: 800, color: '#059669' }}>
                              {trip.amount}
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: '#ECFDF5', color: '#059669' }}>
                                {trip.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ padding: 30, textAlign: 'center', color: '#94A3B8' }}>
                            No walking trips logged.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ background: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: 16, padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#64748B', margin: 0 }}>
                  This user is not enrolled as a Walking School Bus Chaperone.
                </p>
                <p style={{ fontSize: 13, color: '#94A3B8', margin: '6px 0 16px' }}>
                  No pedestrian certifications or walking zone allocations exist.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
