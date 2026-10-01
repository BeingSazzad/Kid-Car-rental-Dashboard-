import { useState } from 'react';
import { User, Bell, Shield, Plus, Trash2, X, Check, Mail, Send, CheckCircle2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  last: string;
  status?: 'Active' | 'Pending';
}

const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: 'Super Admin', email: 'admin@home2school.ca', role: 'Super Admin', last: '2 min ago', status: 'Active' },
  { id: '2', name: 'Jane Cooper', email: 'jane@home2school.ca', role: 'Trust & Safety', last: '1 hour ago', status: 'Active' },
  { id: '3', name: 'Robert Fox', email: 'robert@home2school.ca', role: 'Finance', last: 'Yesterday', status: 'Active' },
];

const ROLES = [
  'Super Admin',
  'Trust & Safety',
  'Support Specialist',
  'Finance & Operations',
  'Content Editor',
];

const TABS = [
  { key: 'profile', label: 'Admin Profile', icon: User },
  { key: 'team', label: 'Team', icon: Shield },
  { key: 'notif', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('team');
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);

  // Invite Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Trust & Safety');
  const [successToast, setSuccessToast] = useState('');

  // Profile Form state
  const [fullName, setFullName] = useState('Super Admin');
  const [email, setEmail] = useState('admin@home2school.ca');
  const [profileSaved, setProfileSaved] = useState(false);

  // Notifications toggle state
  const [notifs, setNotifs] = useState([
    { id: 1, label: 'New KYC Submission', on: true },
    { id: 2, label: 'SOS Triggered', on: true },
    { id: 3, label: 'Failed Payment', on: true },
    { id: 4, label: 'New User Registration', on: false },
    { id: 5, label: 'Booking Dispute', on: true },
  ]);

  const toggleNotif = (id: number) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, on: !n.on } : n));
  };

  const openInviteModal = () => {
    setInviteError(null);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Trust & Safety');
    setInviteModalOpen(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError('Please provide both name and email.');
      return;
    }

    const newMember: TeamMember = {
      id: String(Date.now()),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      last: 'Invited just now',
      status: 'Pending',
    };

    setTeam([...team, newMember]);
    setInviteModalOpen(false);
    setSuccessToast(`Invitation sent to ${inviteEmail.trim()}`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from admin team?`)) {
      setTeam(team.filter(m => m.id !== id));
    }
  };

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Manrope, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', margin: 0, letterSpacing: '-0.02em' }}>
            Settings
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', fontWeight: 500, margin: '2px 0 0' }}>
            Manage admin team access, profile credentials, and platform preferences
          </p>
        </div>

        {successToast && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
            borderRadius: 10, background: '#D1FAE5', border: '1px solid #A7F3D0',
            color: '#065F46', fontSize: 14, fontWeight: 700,
          }}>
            <CheckCircle2 size={16} /> {successToast}
          </div>
        )}
      </div>

      {/* ── Tabs Navigation ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 14,
                fontWeight: active ? 700 : 600,
                padding: '9px 18px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: active ? '#1B2B68' : '#fff',
                color: active ? '#fff' : '#64748B',
                boxShadow: active ? '0 2px 6px rgba(27, 43, 104, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease',
              }}
            >
              <t.icon size={15} />
              {t.label}
              {t.key === 'team' && (
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 99,
                  background: active ? 'rgba(255,255,255,0.2)' : '#EEF2F9',
                  color: active ? '#fff' : '#1B2B68',
                }}>
                  {team.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: Profile ── */}
      {tab === 'profile' && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '28px', maxWidth: 520, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #F1F5F9' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#1B2B68',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(27, 43, 104, 0.2)',
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>SA</span>
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24', margin: 0 }}>Super Admin</p>
              <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 6px' }}>admin@home2school.ca</p>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#EEF1FB', color: '#1B2B68' }}>
                Full System Authority
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={{
                  width: '100%', height: 42, borderRadius: 9,
                  border: '1px solid #CBD5E1', padding: '0 14px', fontSize: 14,
                  fontFamily: 'Manrope', fontWeight: 600, color: '#1A1D24',
                  background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', height: 42, borderRadius: 9,
                  border: '1px solid #CBD5E1', padding: '0 14px', fontSize: 14,
                  fontFamily: 'Manrope', fontWeight: 600, color: '#1A1D24',
                  background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                style={{
                  width: '100%', height: 42, borderRadius: 9,
                  border: '1px solid #CBD5E1', padding: '0 14px', fontSize: 14,
                  fontFamily: 'Manrope', color: '#1A1D24',
                  background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                New Password
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                style={{
                  width: '100%', height: 42, borderRadius: 9,
                  border: '1px solid #CBD5E1', padding: '0 14px', fontSize: 14,
                  fontFamily: 'Manrope', color: '#1A1D24',
                  background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              onClick={handleSaveProfile}
              style={{
                width: '100%',
                height: 42,
                borderRadius: 10,
                border: 'none',
                background: '#1B2B68',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Manrope',
                cursor: 'pointer',
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 2px 4px rgba(27, 43, 104, 0.2)',
              }}
            >
              {profileSaved ? <Check size={16} /> : null}
              {profileSaved ? 'Profile Updated!' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: Team (WITH INTERACTIVE INVITE MODAL) ── */}
      {tab === 'team' && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
            }}
          >
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                Admin Team Members
              </h2>
              <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                Colleagues with permission to review trips, process refunds, and verify drivers
              </p>
            </div>

            {/* + Invite Admin Button */}
            <button
              onClick={openInviteModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                height: 38,
                padding: '0 16px',
                borderRadius: 9,
                border: 'none',
                background: '#1B2B68',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Manrope',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(27, 43, 104, 0.2)',
              }}
            >
              <Plus size={15} />Invite</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {team.map((m, i) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 24px',
                  borderBottom: i < team.length - 1 ? '1px solid #F8FAFC' : 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FAFCFF')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                {/* Initials Avatar */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: m.role === 'Super Admin' ? '#1B2B68' : '#EEF1FB',
                    color: m.role === 'Super Admin' ? '#ffffff' : '#1B2B68',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                    flexShrink: 0,
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  {m.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Name & Email */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: 0 }}>
                      {m.name}
                    </p>
                    {m.status === 'Pending' && (
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#FEF3C7', color: '#92400E' }}>
                        Invite Pending
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: '2px 0 0' }}>
                    {m.email} · <span style={{ color: '#94A3B8' }}>{m.last}</span>
                  </p>
                </div>

                {/* Role Badge */}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: m.role === 'Super Admin' ? '#1B2B68' : '#EEF1FB',
                    color: m.role === 'Super Admin' ? '#FFFFFF' : '#1B2B68',
                    marginRight: 14,
                  }}
                >
                  {m.role}
                </span>

                {/* Remove button (disabled for primary super admin) */}
                {m.role !== 'Super Admin' ? (
                  <button
                    onClick={() => handleRemoveMember(m.id, m.name)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: '1px solid #FEE2E2',
                      background: '#FFF5F5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                    title="Remove Admin Access"
                    onMouseEnter={e => (e.currentTarget.style.background = '#FEE2E2')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#FFF5F5')}
                  >
                    <Trash2 size={13} style={{ color: '#EF4444' }} />
                  </button>
                ) : (
                  <div style={{ width: 32 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: Notifications ── */}
      {tab === 'notif' && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '24px 28px', maxWidth: 520, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24', margin: '0 0 4px' }}>
            Notification Preferences
          </h2>
          <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 20px' }}>
            Choose which urgent alerts trigger instant push &amp; email notifications
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifs.map((n, i) => (
              <div
                key={n.id}
                onClick={() => toggleNotif(n.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: i < notifs.length - 1 ? '1px solid #F8FAFC' : 'none',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1D24' }}>{n.label}</span>
                <div
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 99,
                    background: n.on ? '#1B2B68' : '#CBD5E1',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 3,
                      left: n.on ? 23 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INVITE ADMIN MODAL ── */}
      {inviteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 100,
          }}
          onClick={() => setInviteModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#FFFFFF',
              borderRadius: 16,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              fontFamily: 'Manrope, sans-serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8FAFC',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: '#EEF2F9',
                    color: '#1B2B68',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={18} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Invite Admin Team Member
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
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

            {/* Modal Form */}
            <form onSubmit={handleSendInvite} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {inviteError && (
                <div style={{ padding: '8px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 12, fontWeight: 700 }}>
                  {inviteError}
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  required
                  placeholder="e.g. David Miller"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 9,
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="e.g. david@home2school.ca"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 9,
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Admin Role &amp; Permissions *
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 9,
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none',
                    background: '#fff',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  background: '#EEF2F9',
                  borderRadius: 9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Mail size={16} style={{ color: '#1B2B68', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#1B2B68', fontWeight: 600 }}>
                  An email invitation with secure one-time login credentials will be dispatched.
                </span>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  paddingTop: 12,
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                  marginTop: 6,
                }}
              >
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  style={{
                    height: 38,
                    padding: '0 16px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#475569',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    height: 38,
                    padding: '0 20px',
                    borderRadius: 8,
                    background: '#1B2B68',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 2px 4px rgba(27, 43, 104, 0.2)',
                  }}
                >
                  <Send size={14} />Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
