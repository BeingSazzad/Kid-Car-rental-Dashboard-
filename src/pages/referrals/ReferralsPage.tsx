import { useState } from 'react';
import { Gift, Copy, Check, Link2, X, Download, Users } from 'lucide-react';

interface ReferralConfig {
  active: boolean;
  bonusAmount: number;
  rewardType: string;
  expiryDays: number;
  title: string;
  description: string;
}

const DEFAULT_CONFIG: ReferralConfig = {
  active: true,
  bonusAmount: 15,
  rewardType: 'Wallet credit',
  expiryDays: 90,
  title: 'Invite friends & earn ${amount}',
  description: 'Get ${amount} credit when an invited family completes their first commute.',
};

interface ReferralLogItem {
  id: string;
  referrer: string;
  referrerRole: 'Parent' | 'Driver';
  referred: string;
  joined: string;
  status: 'Completed' | 'Pending' | 'Expired';
  channel: string;
}

const REF_LOG: ReferralLogItem[] = [
  { id: 'REF-801', referrer: 'Sarah Jenkins', referrerRole: 'Parent', referred: 'Emily Watson', joined: 'Oct 1, 2026', status: 'Completed', channel: 'SMS' },
  { id: 'REF-802', referrer: 'Michael Chang', referrerRole: 'Parent', referred: 'David Miller', joined: 'Sep 30, 2026', status: 'Completed', channel: 'WhatsApp' },
  { id: 'REF-803', referrer: 'Elena Rostova', referrerRole: 'Driver', referred: 'Dmitri Volkov', joined: 'Sep 29, 2026', status: 'Pending', channel: 'Copy Link' },
  { id: 'REF-804', referrer: 'David Kim', referrerRole: 'Parent', referred: 'Grace Hopper', joined: 'Sep 27, 2026', status: 'Completed', channel: 'SMS' },
  { id: 'REF-805', referrer: 'Priya Sharma', referrerRole: 'Parent', referred: 'Ananya Roy', joined: 'Sep 25, 2026', status: 'Expired', channel: 'Email' },
  { id: 'REF-806', referrer: 'Carlos Mendes', referrerRole: 'Driver', referred: 'Lucas Silva', joined: 'Sep 24, 2026', status: 'Completed', channel: 'Copy Link' },
];

export default function ReferralsPage() {
  const [cfg, setCfg] = useState<ReferralConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'config' | 'logs'>('config');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'Completed' | 'Pending' | 'Expired'>('all');

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText('https://home2school.app/r/welcome15');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Dynamic preview text with resolved amount
  const resolvedTitle = cfg.title.replace(/\${amount}/g, `$${cfg.bonusAmount}`);
  const resolvedDesc = cfg.description.replace(/\${amount}/g, `$${cfg.bonusAmount}`);

  const filteredLogs = REF_LOG.filter(r => {
    const matchesSearch =
      r.referrer.toLowerCase().includes(search.toLowerCase()) ||
      r.referred.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (logFilter !== 'all' && r.status !== logFilter) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ['Referral ID,Referrer,Role,Referred User,Date Joined,Status,Reward,Channel'];
    const rows = REF_LOG.map(r =>
      `"${r.id}","${r.referrer}","${r.referrerRole}","${r.referred}","${r.joined}","${r.status}","$${cfg.bonusAmount}","${r.channel}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'home2school_referral_log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Manrope, sans-serif' }}>
      {/* ── Page Header (Matching Image 6) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Referral program
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '4px 0 0' }}>
            Manage rewards and the referral message shown in the app.
          </p>
        </div>

        {activeTab === 'config' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {saved && (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={14} /> Published!
              </span>
            )}
            <button
              onClick={save}
              style={{
                height: 38,
                padding: '0 18px',
                borderRadius: 8,
                border: 'none',
                background: '#1B2B68',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(27, 43, 104, 0.15)',
                transition: 'all 0.15s ease',
              }}
            >
              Publish changes
            </button>
          </div>
        ) : (
          <button
            onClick={exportCSV}
            style={{
              height: 38,
              padding: '0 16px',
              borderRadius: 8,
              border: 'none',
              background: '#1B2B68',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {/* ── Navigation Tabs ── */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #E2E8F0', paddingBottom: 0 }}>
        <button
          onClick={() => setActiveTab('config')}
          style={{
            padding: '10px 14px',
            fontSize: 14,
            fontWeight: activeTab === 'config' ? 700 : 600,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            color: activeTab === 'config' ? '#1B2B68' : '#64748B',
            borderBottom: activeTab === 'config' ? '2.5px solid #1B2B68' : '2.5px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          Configuration
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 14px',
            fontSize: 14,
            fontWeight: activeTab === 'logs' ? 700 : 600,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            color: activeTab === 'logs' ? '#1B2B68' : '#64748B',
            borderBottom: activeTab === 'logs' ? '2.5px solid #1B2B68' : '2.5px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <Users size={15} /> Referral log
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: 99,
              background: activeTab === 'logs' ? '#EEF2FF' : '#F1F5F9',
              color: activeTab === 'logs' ? '#1B2B68' : '#64748B',
            }}
          >
            {REF_LOG.length}
          </span>
        </button>
      </div>

      {/* ── Configuration View (Matches Image 6 Exactly) ── */}
      {activeTab === 'config' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Left Form: Reward Settings & Referral Message */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Section 1: Reward settings */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 16px' }}>
                Reward settings
              </h2>

              {/* Enable referrals toggle row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    Enable referrals
                  </p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: '2px 0 0' }}>
                    Allow users to invite friends and earn credit.
                  </p>
                </div>

                {/* Styled Switch */}
                <div
                  onClick={() => setCfg({ ...cfg, active: !cfg.active })}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 99,
                    background: cfg.active ? '#10B981' : '#CBD5E1',
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
                      background: '#FFFFFF',
                      position: 'absolute',
                      top: 2,
                      left: cfg.active ? 22 : 2,
                      transition: 'left 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>

              {/* Inputs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Bonus amount
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span style={{ position: 'absolute', left: 12, fontSize: 14, fontWeight: 700, color: '#475569' }}>$</span>
                    <input
                      type="number"
                      value={cfg.bonusAmount}
                      onChange={e => setCfg({ ...cfg, bonusAmount: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        height: 38,
                        borderRadius: 8,
                        border: '1px solid #CBD5E1',
                        paddingLeft: 26,
                        paddingRight: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Reward type
                  </label>
                  <select
                    value={cfg.rewardType}
                    onChange={e => setCfg({ ...cfg, rewardType: e.target.value })}
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '0 12px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#0F172A',
                      outline: 'none',
                      background: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Wallet credit">Wallet credit</option>
                    <option value="Trip discount">Trip discount</option>
                  </select>
                </div>
              </div>

              <div style={{ maxWidth: '50%' }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Credit expires after
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={cfg.expiryDays}
                    onChange={e => setCfg({ ...cfg, expiryDays: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      paddingLeft: 12,
                      paddingRight: 48,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span style={{ position: 'absolute', right: 12, fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>days</span>
                </div>
              </div>
            </div>

            {/* Section 2: Referral message */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                Referral message
              </h2>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: '0 0 16px' }}>
                Use <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>{'${amount}'}</code> to insert the reward amount.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Title
                </label>
                <input
                  value={cfg.title}
                  onChange={e => setCfg({ ...cfg, title: e.target.value })}
                  style={{
                    width: '100%',
                    height: 38,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Description
                </label>
                <textarea
                  value={cfg.description}
                  onChange={e => setCfg({ ...cfg, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '10px 12px',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#0F172A',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: App preview (Matching Image 6 Exactly) ── */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 2px' }}>
              App preview
            </h2>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: '0 0 14px' }}>
              Updates as you edit.
            </p>

            {/* Container */}
            <div
              style={{
                background: '#F1F5F9',
                borderRadius: 16,
                padding: '24px 16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Modal Card */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  padding: '24px 20px',
                  width: '100%',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Close Icon */}
                <button
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>

                {/* Gift Icon Box */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: '#EEF2FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Gift size={24} style={{ color: '#1B2B68' }} />
                </div>

                {/* Modal Title */}
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                  {resolvedTitle}
                </h3>

                {/* Modal Description */}
                <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: '0 0 18px', lineHeight: 1.5 }}>
                  {resolvedDesc}
                </p>

                {/* Link Box */}
                <div
                  style={{
                    width: '100%',
                    height: 38,
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0 12px',
                    marginBottom: 12,
                    boxSizing: 'border-box',
                  }}
                >
                  <Link2 size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    home2school.app/r/...
                  </span>
                </div>

                {/* Copy Invite Link Button */}
                <button
                  onClick={copyLink}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 8,
                    border: 'none',
                    background: '#1B2B68',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 10,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy invite link'}
                </button>

                {/* Done Button */}
                <button
                  style={{
                    width: '100%',
                    height: 38,
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Tab 2: Referral Log ── */
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'Completed', 'Pending', 'Expired'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setLogFilter(tab)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: logFilter === tab ? '#1B2B68' : '#F1F5F9',
                    color: logFilter === tab ? '#FFFFFF' : '#64748B',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {tab === 'all' ? 'All' : tab}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search referrals..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                height: 34,
                width: 220,
                padding: '0 12px',
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                fontSize: 12,
                outline: 'none',
              }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['ID', 'Referrer', 'Referred', 'Date', 'Status', 'Reward', 'Channel'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#1B2B68' }}>{r.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{r.referrer}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500, color: '#334155' }}>{r.referred}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748B' }}>{r.joined}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: r.status === 'Completed' ? '#ECFDF5' : r.status === 'Pending' ? '#FEF3C7' : '#F1F5F9',
                        color: r.status === 'Completed' ? '#059669' : r.status === 'Pending' ? '#D97706' : '#64748B',
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 800, color: r.status === 'Completed' ? '#10B981' : '#94A3B8' }}>
                    ${cfg.bonusAmount}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748B' }}>{r.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
