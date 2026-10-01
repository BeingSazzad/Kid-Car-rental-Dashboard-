import { useState } from 'react';
import { Send, CheckCircle, History, PenSquare } from 'lucide-react';

interface SentBroadcast {
  id: string;
  title: string;
  body: string;
  audience: string;
  sent: string;
}

const INITIAL_HISTORY: SentBroadcast[] = [
  {
    id: 'b-1',
    title: 'Morning routes active!',
    body: 'All drivers are on the way. Track live now.',
    audience: 'All Parents',
    sent: 'Today 7:00 AM',
  },
  {
    id: 'b-2',
    title: 'New WalkShare guide available',
    body: 'Sophie Bouchard is now accepting requests in your area.',
    audience: 'Parents',
    sent: 'Sep 28, 8:30 AM',
  },
  {
    id: 'b-3',
    title: 'KYC reminder',
    body: 'Please complete your document submission to remain active.',
    audience: 'Drivers',
    sent: 'Sep 27, 9:00 AM',
  },
  {
    id: 'b-4',
    title: 'Platform maintenance scheduled',
    body: 'Brief downtime on Sep 30 from 2-3 AM EST.',
    audience: 'All Users',
    sent: 'Sep 26, 4:00 PM',
  },
];

const AUDIENCES = ['All Users', 'Parents', 'Drivers', 'Walkers'];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [audience, setAudience] = useState('All Users');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<SentBroadcast[]>(INITIAL_HISTORY);
  const [selectedHistory, setSelectedHistory] = useState<SentBroadcast>(INITIAL_HISTORY[0]);

  const handleSend = () => {
    if (!title.trim() || !body.trim()) return;

    const newBroadcast: SentBroadcast = {
      id: 'b-' + Date.now(),
      title: title.trim(),
      body: body.trim(),
      audience,
      sent: 'Just now',
    };

    setHistory([newBroadcast, ...history]);
    setSelectedHistory(newBroadcast);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setTitle('');
      setBody('');
    }, 2000);
  };

  // Preview content based on active tab
  const previewTitle = activeTab === 'compose' 
    ? (title.trim() || 'Morning routes active!') 
    : (selectedHistory?.title || 'Notification Title');
    
  const previewBody = activeTab === 'compose' 
    ? (body.trim() || 'All drivers are on the way. Track live now.') 
    : (selectedHistory?.body || 'Notification message body text...');

  const previewAudience = activeTab === 'compose'
    ? audience
    : (selectedHistory?.audience || 'All Users');

  const previewTime = activeTab === 'compose'
    ? 'Now'
    : (selectedHistory?.sent || 'Recently');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Manrope, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', margin: 0, letterSpacing: '-0.02em' }}>
            Push Notifications
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '4px 0 0' }}>
            Dispatch instant notifications directly to parents and drivers across apps
          </p>
        </div>

        {/* Tab Switcher: Compose / History */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 4 }}>
          <button
            onClick={() => setActiveTab('compose')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 36,
              padding: '0 14px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'compose' ? '#1B2B68' : 'transparent',
              color: activeTab === 'compose' ? '#FFFFFF' : '#64748B',
              fontSize: 12,
              fontWeight: activeTab === 'compose' ? 700 : 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <PenSquare size={14} /> Compose
          </button>

          <button
            onClick={() => setActiveTab('history')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 36,
              padding: '0 14px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'history' ? '#1B2B68' : 'transparent',
              color: activeTab === 'history' ? '#FFFFFF' : '#64748B',
              fontSize: 12,
              fontWeight: activeTab === 'history' ? 700 : 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <History size={14} /> History
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 99,
                background: activeTab === 'history' ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                color: activeTab === 'history' ? '#FFFFFF' : '#64748B',
              }}
            >
              {history.length}
            </span>
          </button>
        </div>
      </div>

      {/* ── Main Layout: Left Content + Right Persistent Mobile Preview ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Left Column: Switch between Compose Form and Sent History */}
        {activeTab === 'compose' ? (
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '22px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24', margin: '0 0 16px' }}>
              Compose Push Broadcast
            </p>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                Target Audience
              </label>
              <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
                <select
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    paddingLeft: 14,
                    paddingRight: 34,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1A1D24',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'Manrope, sans-serif',
                  }}
                >
                  {AUDIENCES.map(a => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', margin: 0, textTransform: 'uppercase' }}>
                  Notification Title
                </p>
                <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>({title.length}/60)</span>
              </div>
              <input
                value={title}
                onChange={e => e.target.value.length <= 60 && setTitle(e.target.value)}
                placeholder="e.g. Morning commute route advisory"
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  padding: '0 12px',
                  fontSize: 14,
                  fontFamily: 'Manrope',
                  fontWeight: 600,
                  color: '#1A1D24',
                  background: '#F8FAFC',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', margin: 0, textTransform: 'uppercase' }}>
                  Message Body
                </p>
                <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>({body.length}/140)</span>
              </div>
              <textarea
                value={body}
                onChange={e => e.target.value.length <= 140 && setBody(e.target.value)}
                rows={4}
                placeholder="Type message content delivered to user lockscreens..."
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  padding: '10px 12px',
                  fontSize: 14,
                  fontFamily: 'Manrope',
                  fontWeight: 500,
                  color: '#1A1D24',
                  background: '#F8FAFC',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!title.trim() || !body.trim()}
              style={{
                width: '100%',
                height: 42,
                borderRadius: 8,
                border: 'none',
                background: sent ? '#10B981' : (!title.trim() || !body.trim()) ? '#CBD5E1' : '#1B2B68',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Manrope',
                cursor: (!title.trim() || !body.trim()) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
                boxShadow: sent || (!title.trim() || !body.trim()) ? 'none' : '0 2px 6px rgba(27, 43, 104, 0.2)',
              }}
            >
              {sent ? (
                <><CheckCircle size={16} /> Dispatched!</>
              ) : (
                <><Send size={14} /> Send Broadcast</>
              )}
            </button>
          </div>
        ) : (
          /* Sent History List matching Screenshot 1 */
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                Sent History
              </p>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>
                {history.length} broadcast{history.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {history.map((h, i) => {
                const isSelected = selectedHistory?.id === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHistory(h)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: i < history.length - 1 ? '1px solid #F1F5F9' : 'none',
                      background: isSelected ? '#F8FAFC' : '#FFFFFF',
                      borderLeft: isSelected ? '3px solid #1B2B68' : '3px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: 0, flex: 1 }}>
                        {h.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 6,
                            background: '#EEF1FB',
                            color: '#1B2B68',
                          }}
                        >
                          {h.audience}
                        </span>
                        <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
                          {h.sent}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                      {h.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Right Column: Persistent Smartphone Lockscreen Preview ── */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
              Device Preview
            </p>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1B2B68', background: '#EEF1FB', padding: '2px 6px', borderRadius: 4 }}>
              LIVE
            </span>
          </div>

          {/* Smartphone Frame */}
          <div
            style={{
              background: '#0F172A',
              borderRadius: 24,
              padding: '16px 14px 24px',
              color: '#fff',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
              border: '4px solid #1E293B',
            }}
          >
            {/* Status bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, fontWeight: 600, color: '#94A3B8', marginBottom: 24, padding: '0 4px' }}>
              <span>9:41</span>
              <div style={{ width: 48, height: 12, background: '#1E293B', borderRadius: 99, margin: '0 auto' }} />
              <span>5G 100%</span>
            </div>

            {/* Lockscreen Clock */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <p style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>09:41</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', margin: '4px 0 0' }}>Thursday, October 1</p>
            </div>

            {/* Push Notification Banner */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 14,
                padding: '12px 14px',
                color: '#1A1D24',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      background: '#1B2B68',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    H
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#1B2B68' }}>HOME2SCHOOL</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8' }}>{previewTime}</span>
              </div>

              <p style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>
                {previewTitle}
              </p>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#475569', margin: 0, lineHeight: 1.4 }}>
                {previewBody}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 6, borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#1B2B68', background: '#EEF1FB', padding: '1px 5px', borderRadius: 4 }}>
                  {previewAudience}
                </span>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>Tap to view route details</span>
              </div>
            </div>

            {/* Home indicator bar */}
            <div style={{ width: 90, height: 4, background: '#475569', borderRadius: 99, margin: '24px auto 0' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
