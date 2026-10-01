import { useState } from 'react';
import { Gift, Copy, Check, Link2, X, Download, Users, Settings2, Sparkles } from 'lucide-react';

interface ReferralConfig {
  active: boolean;
  bonusAmount: number;
  title: string;
  description: string;
}

const DEFAULT_CONFIG: ReferralConfig = {
  active: true,
  bonusAmount: 15,
  title: 'Invite school families & earn $15',
  description: 'Share your link with fellow parents. When an invited family completes their first school ride or walkshare, you both receive $15 credit towards school rides.',
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
  { id: 'REF-803', referrer: 'Elena Rostova', referrerRole: 'Driver', referred: 'Dmitri Volkov', joined: 'Sep 29, 2026', status: 'Pending', channel: 'Direct Link' },
  { id: 'REF-804', referrer: 'David Kim', referrerRole: 'Parent', referred: 'Grace Hopper', joined: 'Sep 27, 2026', status: 'Completed', channel: 'SMS' },
  { id: 'REF-805', referrer: 'Priya Sharma', referrerRole: 'Parent', referred: 'Ananya Roy', joined: 'Sep 25, 2026', status: 'Expired', channel: 'Email' },
  { id: 'REF-806', referrer: 'Carlos Mendes', referrerRole: 'Driver', referred: 'Lucas Silva', joined: 'Sep 24, 2026', status: 'Completed', channel: 'Direct Link' },
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
    setTimeout(() => setSaved(false), 2200);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText('https://home2school.app/r/welcome15');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

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
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Referral Program
            </h1>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 12,
                background: cfg.active ? '#ECFDF5' : '#F1F5F9',
                color: cfg.active ? '#059669' : '#64748B',
                border: cfg.active ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
              }}
            >
              {cfg.active ? 'Program Active' : 'Program Paused'}
            </span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '4px 0 0' }}>
            Configure referral rewards and parent-facing invite messages for the mobile app.
          </p>
        </div>

        {activeTab === 'config' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {saved && (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={14} /> Saved &amp; Published!
              </span>
            )}
            <button
              type="button"
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
              Publish Changes
            </button>
          </div>
        ) : (
          <button
            type="button"
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
          type="button"
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
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Settings2 size={15} />
          <span>Configuration</span>
        </button>

        <button
          type="button"
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
          }}
        >
          <Users size={15} />
          <span>Referral Log</span>
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

      {/* ── Configuration View ── */}
      {activeTab === 'config' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 24, alignItems: 'start' }}>
          {/* Left: Configuration Form Wrapped in Unified White Card Container */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: 24,
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            {/* Header row with Program Status Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 18,
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                  Program Status &amp; Activation
                </h2>
                <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 0' }}>
                  Enable or temporarily pause the referral program across all parent apps.
                </p>
              </div>

              {/* Styled Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.active ? '#059669' : '#94A3B8' }}>
                  {cfg.active ? 'Enabled' : 'Disabled'}
                </span>
                <div
                  onClick={() => setCfg({ ...cfg, active: !cfg.active })}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 99,
                    background: cfg.active ? '#059669' : '#CBD5E1',
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
            </div>

            {/* Section 1: Reward Amount */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                  Reward Credit Amount
                </h3>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#EEF2FF', color: '#1B2B68' }}>
                  CAD Currency
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 12px' }}>
                Wallet credit awarded to both the referring parent and the invited family upon first completed commute.
              </p>

              <div style={{ maxWidth: 280 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Bonus Amount ($ CAD) *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: 12, fontSize: 14, fontWeight: 700, color: '#64748B' }}>$</span>
                  <input
                    type="number"
                    value={cfg.bonusAmount}
                    onChange={e => {
                      const newAmt = Math.max(0, Number(e.target.value));
                      setCfg({
                        ...cfg,
                        bonusAmount: newAmt,
                        title: `Invite school families & earn $${newAmt}`,
                        description: `Share your link with fellow parents. When an invited family completes their first school ride or walkshare, you both receive $${newAmt} credit towards school rides.`,
                      });
                    }}
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      paddingLeft: 26,
                      paddingRight: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: 'Manrope, sans-serif',
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: In-App Parent Message */}
            <div style={{ paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                  In-App Parent Share Message
                </h3>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#ECFDF5', color: '#059669' }}>
                  Live in Parent App
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px' }}>
                Text shown inside the mobile parent app modal when parents open the &ldquo;Invite Friends&rdquo; screen.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Modal Headline *
                  </label>
                  <input
                    value={cfg.title}
                    onChange={e => setCfg({ ...cfg, title: e.target.value })}
                    placeholder="e.g. Invite school families &amp; earn $15"
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '0 12px',
                      fontSize: 14,
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 600,
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Modal Explanation &amp; Instructions *
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
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 500,
                      color: '#0F172A',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      lineHeight: 1.5,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                onClick={save}
                style={{
                  height: 38,
                  padding: '0 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#1B2B68',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(27, 43, 104, 0.2)',
                }}
              >
                {saved ? 'Changes Saved!' : 'Save Configuration'}
              </button>
            </div>
          </div>

          {/* Right Column: App Preview Wrapped in Matching Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: 20,
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                  Mobile App Preview
                </h2>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                  Live preview as seen by parents
                </p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#EEF2FF', color: '#1B2B68', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={11} /> Live
              </span>
            </div>

            {/* Simulated Phone Modal Canvas */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 14,
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
                  borderRadius: 14,
                  padding: '22px 18px',
                  width: '100%',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '1px solid #F1F5F9',
                }}
              >
                {/* Close Icon */}
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
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
                    marginBottom: 14,
                  }}
                >
                  <Gift size={24} style={{ color: '#1B2B68' }} />
                </div>

                {/* Modal Title */}
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  {cfg.title}
                </h3>

                {/* Modal Description */}
                <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: '0 0 16px', lineHeight: 1.5 }}>
                  {cfg.description}
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
                    home2school.app/r/welcome{cfg.bonusAmount}
                  </span>
                </div>

                {/* Copy Invite Link Button */}
                <button
                  type="button"
                  onClick={copyLink}
                  style={{
                    width: '100%',
                    height: 38,
                    borderRadius: 8,
                    border: 'none',
                    background: '#1B2B68',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginBottom: 8,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
                </button>

                {/* Done Button */}
                <button
                  type="button"
                  style={{
                    width: '100%',
                    height: 36,
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: 12,
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'Completed', 'Pending', 'Expired'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
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
                  <th key={h} style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 18px', fontSize: 12, fontWeight: 700, color: '#1B2B68' }}>{r.id}</td>
                  <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{r.referrer}</td>
                  <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 500, color: '#334155' }}>{r.referred}</td>
                  <td style={{ padding: '14px 18px', fontSize: 12, color: '#64748B' }}>{r.joined}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: r.status === 'Completed' ? '#ECFDF5' : r.status === 'Pending' ? '#FFFBEB' : '#F1F5F9',
                        color: r.status === 'Completed' ? '#059669' : r.status === 'Pending' ? '#B45309' : '#64748B',
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 800, color: r.status === 'Completed' ? '#059669' : '#94A3B8' }}>
                    $${cfg.bonusAmount}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 12, color: '#64748B' }}>{r.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
