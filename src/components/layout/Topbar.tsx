import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import {
  Bell,
  Search,
  ChevronDown,
  ShieldCheck,
  Clock,
  Headphones,
  ExternalLink,
  Settings,
  LogOut,
} from 'lucide-react';

interface SystemAlert {
  id: string;
  type: 'kyc' | 'trip' | 'support';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  link: string;
}

const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'a1',
    type: 'kyc',
    title: 'New KYC Submission',
    description: 'Alex Rivera (Driver) uploaded Commercial Insurance.',
    time: '5m ago',
    unread: true,
    link: '/kyc',
  },
  {
    id: 'a2',
    type: 'trip',
    title: 'Trip Delay Advisory',
    description: 'Driver Marcus Vance is 10 mins delayed on Route #TR-402.',
    time: '24m ago',
    unread: true,
    link: '/trips',
  },
  {
    id: 'a3',
    type: 'support',
    title: 'Urgent Support Inquiry',
    description: 'Parent Sarah Jenkins opened dispute on ride fare.',
    time: '1h ago',
    unread: false,
    link: '/support',
  },
];

export default function Topbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);

  const topbarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (topbarRef.current && !topbarRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const unreadCount = alerts.filter(a => a.unread).length;

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, unread: false })));
  };

  const handleAlertClick = (alert: SystemAlert) => {
    setAlerts(alerts.map(a => (a.id === alert.id ? { ...a, unread: false } : a)));
    setNotifOpen(false);
    navigate(alert.link);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header
      ref={topbarRef}
      style={{
        height: 70,
        background: '#fff',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', width: 340 }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94A3B8',
          }}
        />
        <input
          type="text"
          placeholder="Search records, trips, users..."
          style={{
            width: '100%',
            height: 40,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            paddingLeft: 40,
            paddingRight: 14,
            fontSize: 14,
            fontFamily: 'Manrope, sans-serif',
            color: '#1A1D24',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* System In-App Alerts Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={e => {
              e.stopPropagation();
              setProfileOpen(false);
              setNotifOpen(!notifOpen);
            }}
            style={{
              position: 'relative',
              width: 38,
              height: 38,
              borderRadius: 10,
              border: '1px solid #E2E8F0',
              background: notifOpen ? '#EEF1FB' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="System Alerts"
          >
            <Bell size={18} style={{ color: notifOpen ? '#1B2B68' : '#64748B' }} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 8,
                  height: 8,
                  background: '#F2600C',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                }}
              />
            )}
          </button>

          {/* System Alerts Dropdown */}
          {notifOpen && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: 48,
                right: 0,
                width: 360,
                background: '#FFFFFF',
                borderRadius: 14,
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                zIndex: 70,
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#1A1D24' }}>
                    System Alerts
                  </span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 99,
                        background: '#F2600C',
                        color: '#fff',
                      }}
                    >
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#1B2B68',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Mark read
                  </button>
                )}
              </div>

              {/* Alerts list */}
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: '28px 20px', textAlign: 'center', color: '#94A3B8' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No alerts</p>
                  </div>
                ) : (
                  alerts.map((item, idx) => {
                    const isKyc = item.type === 'kyc';
                    const isTrip = item.type === 'trip';
                    const Icon = isKyc ? ShieldCheck : isTrip ? Clock : Headphones;
                    const iconColor = isKyc ? '#EF4444' : isTrip ? '#D97706' : '#1B2B68';
                    const iconBg = isKyc ? '#FEE2E2' : isTrip ? '#FEF3C7' : '#EEF1FB';

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleAlertClick(item)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: idx < alerts.length - 1 ? '1px solid #F8FAFC' : 'none',
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          background: item.unread ? '#FAFCFF' : '#FFFFFF',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
                        onMouseLeave={e => (e.currentTarget.style.background = item.unread ? '#FAFCFF' : '#FFFFFF')}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: iconBg,
                            color: iconColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          <Icon size={16} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                            <p style={{
                              fontSize: 12,
                              fontWeight: item.unread ? 800 : 700,
                              color: '#1A1D24',
                              margin: 0,
                            }}>
                              {item.title}
                            </p>
                            <span style={{ fontSize: 10, color: '#94A3B8', flexShrink: 0 }}>
                              {item.time}
                            </span>
                          </div>

                          <p style={{
                            fontSize: 12,
                            color: '#64748B',
                            lineHeight: 1.4,
                            margin: '2px 0 4px',
                          }}>
                            {item.description}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1B2B68', fontSize: 10, fontWeight: 700 }}>
                            <span>View details</span>
                            <ExternalLink size={10} />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Interactive Admin Profile Dropdown ── */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={e => {
              e.stopPropagation();
              setNotifOpen(false);
              setProfileOpen(!profileOpen);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '5px 12px',
              borderRadius: 10,
              border: profileOpen ? '1px solid #1B2B68' : '1px solid #E2E8F0',
              background: profileOpen ? '#F8FAFC' : '#fff',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#1B2B68',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>SC</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24' }}>Sazzad Chowdhury</span>
            <ChevronDown size={14} style={{ color: '#94A3B8', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
          </div>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: 48,
                right: 0,
                width: 240,
                background: '#FFFFFF',
                borderRadius: 14,
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
                border: '1px solid #E2E8F0',
                padding: 6,
                zIndex: 70,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Profile Card Header */}
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9', marginBottom: 4 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Sazzad Chowdhury
                </p>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 4px' }}>
                  admin@home2school.ca
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#1B2B68',
                      background: '#EEF2FF',
                      padding: '2px 6px',
                      borderRadius: 4,
                      display: 'inline-block',
                    }}
                  >
                    Super Admin
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#059669',
                      background: '#ECFDF5',
                      padding: '2px 6px',
                      borderRadius: 4,
                      display: 'inline-block',
                    }}
                  >
                    ● Active Session
                  </span>
                </div>
              </div>

              {/* Navigation Actions */}
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/settings');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'none',
                  color: '#334155',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <Settings size={14} style={{ color: '#1B2B68' }} />
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/support');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'none',
                  color: '#334155',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <Headphones size={14} style={{ color: '#1B2B68' }} />
                <span>Support Desk</span>
              </button>

              <div style={{ height: 1, background: '#F1F5F9', margin: '4px 0' }} />

              {/* Logout Action */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'none',
                  color: '#DC2626',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <LogOut size={14} style={{ color: '#DC2626' }} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
