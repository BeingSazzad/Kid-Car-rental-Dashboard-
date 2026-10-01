import { useState } from 'react';
import { User, Bell, Shield, Plus, Trash2, X, Check, Send, CheckCircle2, Lock, KeyRound, ShieldAlert } from 'lucide-react';

export type AdminRole = 'Super Admin' | 'Admin';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  joinedDate: string;
  lastActive: string;
  status: 'Active' | 'Pending';
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Sazzad Chowdhury',
    email: 'admin@home2school.ca',
    role: 'Super Admin',
    joinedDate: 'Aug 1, 2026',
    lastActive: 'Active now',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Cooper',
    email: 'jane@home2school.ca',
    role: 'Admin',
    joinedDate: 'Sep 10, 2026',
    lastActive: '1 hour ago',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Robert Fox',
    email: 'robert@home2school.ca',
    role: 'Admin',
    joinedDate: 'Sep 22, 2026',
    lastActive: 'Yesterday',
    status: 'Active',
  },
];

const TABS = [
  { key: 'profile', label: 'Admin Profile', icon: User },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'team', label: 'Team', icon: Shield },
  { key: 'notif', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('profile');
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);

  // Invite Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('Admin');
  const [successToast, setSuccessToast] = useState('');

  // Profile Form state
  const [fullName, setFullName] = useState('Sazzad Chowdhury');
  const [email] = useState('admin@home2school.ca');
  const [profileSaved, setProfileSaved] = useState(false);

  // Security Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

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
    setInviteRole('Admin');
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
      joinedDate: 'Oct 1, 2026',
      lastActive: 'Invited just now',
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
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Manrope, sans-serif' }}>
      {/* ── Toast Alert ── */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          background: '#059669',
          color: '#fff',
          padding: '12px 18px',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 9999,
          fontSize: 14,
          fontWeight: 700,
        }}>
          <CheckCircle2 size={18} />
          {successToast}
        </div>
      )}

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
          Settings
        </h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '4px 0 0' }}>
          Manage admin profile credentials, system security, team access, and notifications.
        </p>
      </div>

      {/* ── Tabs (Profile, Security, Team, Notifications) ── */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
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
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: active ? '#1B2B68' : '#FFFFFF',
                color: active ? '#FFFFFF' : '#64748B',
                boxShadow: active ? '0 2px 4px rgba(27, 43, 104, 0.15)' : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
              }}
            >
              <t.icon size={15} />
              {t.label}
              
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: Admin Profile (NO PASSWORDS - STRICT PROFILE DETAILS) ── */}
      {tab === 'profile' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: '24px 28px', maxWidth: 540, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          {/* User Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #F1F5F9' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: '#1B2B68',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 8px rgba(27, 43, 104, 0.2)',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                {(fullName || 'Sazzad Chowdhury').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                  {fullName || 'Sazzad Chowdhury'}
                </p>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#1B2B68', color: '#FFFFFF' }}>
                  Super Admin
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 6px' }}>admin@home2school.ca</p>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#EEF2FF', color: '#1B2B68', border: '1px solid #C7D2FE' }}>
                Primary Root Authority
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Full Name */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                Full Name *
              </label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={{
                  width: '100%', height: 40, borderRadius: 8,
                  border: '1px solid #CBD5E1', padding: '0 12px', fontSize: 14,
                  fontFamily: 'Manrope, sans-serif', fontWeight: 600, color: '#1A1D24',
                  background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Email Address (LOCKED FOR SUPER ADMIN) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                  Email Address *
                </label>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={11} /> Primary Owner (Locked)
                </span>
              </div>
              <input
                value={email}
                disabled
                readOnly
                style={{
                  width: '100%', height: 40, borderRadius: 8,
                  border: '1px solid #E2E8F0', padding: '0 12px', fontSize: 14,
                  fontFamily: 'Manrope, sans-serif', fontWeight: 500, color: '#64748B',
                  background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
                  cursor: 'not-allowed',
                }}
              />
              <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                Primary Super Admin email address cannot be modified to protect system ownership.
              </p>
            </div>

            {/* Save Profile Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 8 }}>
              <button
                type="button"
                onClick={handleSaveProfile}
                style={{
                  height: 40,
                  padding: '0 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#1B2B68',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 1px 3px rgba(27, 43, 104, 0.2)',
                }}
              >
                {profileSaved ? <Check size={16} /> : null}
                <span>{profileSaved ? 'Profile Updated!' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Security & Password (DEDICATED SECURITY TAB) ── */}
      {tab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 520px)', gap: 20 }}>
          {/* Card: Change Password */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <KeyRound size={18} color="#1B2B68" />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                Password &amp; Credentials
              </h2>
            </div>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 20px' }}>
              Update your account password. Use a strong combination of letters, numbers, and symbols.
            </p>

            {passwordError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 12px', color: '#DC2626', fontSize: 12, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldAlert size={14} />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSaved && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '10px 12px', color: '#059669', fontSize: 12, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={14} />
                <span>Password successfully changed!</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Current Password */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Current Password *
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={{
                    width: '100%', height: 40, borderRadius: 8,
                    border: '1px solid #CBD5E1', padding: '0 12px', fontSize: 14,
                    fontFamily: 'Manrope, sans-serif', color: '#1A1D24',
                    background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* New Password */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  New Password *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters (letters &amp; numbers)"
                  style={{
                    width: '100%', height: 40, borderRadius: 8,
                    border: '1px solid #CBD5E1', padding: '0 12px', fontSize: 14,
                    fontFamily: 'Manrope, sans-serif', color: '#1A1D24',
                    background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>
                  Must contain at least 8 characters including uppercase letters and numbers.
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  style={{
                    width: '100%', height: 40, borderRadius: 8,
                    border: '1px solid #CBD5E1', padding: '0 12px', fontSize: 14,
                    fontFamily: 'Manrope, sans-serif', color: '#1A1D24',
                    background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 6 }}>
                <button
                  type="submit"
                  style={{
                    height: 40,
                    padding: '0 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#1B2B68',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 1px 3px rgba(27, 43, 104, 0.2)',
                  }}
                >
                  <Lock size={15} />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>

          </div>
      )}

      {/* ── TAB 3: Team Members (Structured Table with Columns & Strict Roles) ── */}
      {tab === 'team' && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          {/* Card Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FFFFFF',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                  Admin Team Members
                </h2>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: '#EEF2FF',
                    color: '#1B2B68',
                  }}
                >
                  {team.length} Admins
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>
                Colleagues with platform administration access (Super Admin &amp; Admin roles only)
              </p>
            </div>

            <button
              type="button"
              onClick={openInviteModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                height: 38,
                padding: '0 16px',
                borderRadius: 8,
                border: 'none',
                background: '#1B2B68',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Manrope, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(27, 43, 104, 0.15)',
              }}
            >
              <Plus size={15} />
              <span>Invite Admin</span>
            </button>
          </div>

          {/* Structured Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 24px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Admin Member</th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role</th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Admin Since</th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Last Active</th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                  <th style={{ padding: '12px 24px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((m, i) => (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: i < team.length - 1 ? '1px solid #F1F5F9' : 'none',
                      background: '#FFFFFF',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
                  >
                    {/* Admin Member */}
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: m.role === 'Super Admin' ? '#1B2B68' : '#EEF2FF',
                            color: m.role === 'Super Admin' ? '#FFFFFF' : '#1B2B68',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: 0 }}>
                            {m.name}
                          </p>
                          <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: '2px 0 0' }}>
                            {m.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 6,
                          background: m.role === 'Super Admin' ? '#1B2B68' : '#EEF2FF',
                          color: m.role === 'Super Admin' ? '#FFFFFF' : '#1B2B68',
                          border: m.role === 'Super Admin' ? 'none' : '1px solid #E0E7FF',
                          display: 'inline-block',
                        }}
                      >
                        {m.role}
                      </span>
                    </td>

                    {/* Admin Since */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
                        {m.joinedDate}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>
                        {m.lastActive}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 12,
                          background: m.status === 'Active' ? '#ECFDF5' : '#FFFBEB',
                          color: m.status === 'Active' ? '#059669' : '#B45309',
                          border: m.status === 'Active' ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                          display: 'inline-block',
                        }}
                      >
                        {m.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                      {m.role !== 'Super Admin' ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.id, m.name)}
                          style={{
                            height: 30,
                            padding: '0 10px',
                            borderRadius: 6,
                            border: '1px solid #FECACA',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                          title="Remove Admin"
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                          Primary Owner
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: Notifications ── */}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: i < notifs.length - 1 ? '1px solid #F1F5F9' : 'none',
                }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1D24', margin: 0 }}>
                    {n.label}
                  </p>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>
                    Send automated alert immediately when event occurs
                  </p>
                </div>

                <div
                  onClick={() => toggleNotif(n.id)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 99,
                    background: n.on ? '#1B2B68' : '#CBD5E1',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: 2,
                      left: n.on ? 22 : 2,
                      transition: 'left 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Invite Admin Modal ── */}
      {inviteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
          onClick={() => setInviteModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              width: 440,
              maxWidth: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Invite New Admin
                </h2>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                  Send an email invite to join the Home2School admin team
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {inviteError && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 8,
                padding: '10px 12px',
                color: '#DC2626',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16,
              }}>
                {inviteError}
              </div>
            )}

            <form onSubmit={handleSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 8,
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
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="alex@home2school.ca"
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 8,
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
                  onChange={e => setInviteRole(e.target.value as AdminRole)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Admin">Admin</option>
                </select>
                <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0' }}>
                  Platform security policy: Only 1 Super Admin allowed. New team invites receive Admin access.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  style={{
                    height: 40,
                    padding: '0 16px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#64748B',
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
                    height: 40,
                    padding: '0 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#1B2B68',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Send size={15} />
                  <span>Send Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
