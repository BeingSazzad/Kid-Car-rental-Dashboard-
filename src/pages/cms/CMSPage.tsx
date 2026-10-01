function createId(prefix: string) {
  return prefix + '-' + Math.random().toString(36).substring(2, 9);
}
import { useState } from 'react';
import {
  Plus, Trash2, Edit2, X, ChevronDown, ChevronUp,
  GripVertical, Check, ArrowUp, ArrowDown, Copy, Shield, FileText, HelpCircle, Info, Search, Phone, Mail, AlertTriangle
, Upload, Smartphone } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

/* — Types — */
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

export interface PolicyClause {
  id: string;
  number: string;
  title: string;
  content: string;
}

export interface PolicyPageData {
  title: string;
  clauses: PolicyClause[];
}

/* — Initial Seed Data — */
const initFAQs: FAQItem[] = [
  { id: 1, question: 'How are drivers background-checked and vetted?', answer: 'Every Home2School driver passes a multi-tier vulnerable sector criminal record check, clean driving abstract verification, annual vehicle inspection, and an in-person orientation before accepting student rides.', category: 'Safety' },
  { id: 2, question: 'Can parents track child rides with live GPS?', answer: 'Yes. Parents receive real-time GPS updates throughout the entire trip directly in the app. Location sharing is only active during active trips.', category: 'Tracking' },
  { id: 3, question: 'Can I book for multiple children attending different schools?', answer: 'Absolutely. You can add multiple child profiles and book separate routes for each child in a single subscription.', category: 'Booking' },
  { id: 4, question: 'What happens if a driver is delayed in morning traffic?', answer: 'Parents are notified via push notification immediately if a driver is running more than 3 minutes late. Our dispatch team also monitors all live trips.', category: 'Rides' },
  { id: 5, question: 'Can I pause or cancel during school vacations?', answer: 'Yes. Subscriptions can be paused with 24-hour advance notice. Zero-penalty cancellation applies up to 2 hours prior to any scheduled trip.', category: 'Billing' },
];

const initPages: Record<string, PolicyPageData> = {
  privacy: {
    title: 'Privacy Policy',
    clauses: [
      {
        id: 'priv-1',
        number: '01',
        title: 'Student Data & COPPA Protection',
        content: '<p>We hold child privacy to the highest global standards. Photos, names, and school rosters are never shared with third parties or advertisers. All driver access to minor data is strictly temporary and locked during active commute hours.</p><ul><li>No commercial advertising or data broker sharing.</li><li>Parent custody phone numbers are masked with secure proxy numbers.</li></ul>',
      },
      {
        id: 'priv-2',
        number: '02',
        title: 'Real-Time GPS & Geofencing Privacy',
        content: '<p>Live route telemetry is encrypted in transit and at rest using AES-256 encryption. Location streaming is enabled only from vehicle engine start until safe school hand-off verification.</p><ul><li>Automated 30-day deletion cycle for historic route breadcrumbs.</li><li>Access restricted strictly to authenticated guardians and emergency dispatch.</li></ul>',
      },
      {
        id: 'priv-3',
        number: '03',
        title: 'Guardian Rights & Data Deletion',
        content: '<p>Parents can request a complete export of ride records or initiate total account and child profile deletion anytime directly from Settings or by contacting privacy@home2school.app.</p><ul><li>Permanent account deletion processed within 72 hours of request.</li><li>Right to inspect and update child passenger records anytime.</li></ul>',
      },
    ],
  },
  tos: {
    title: 'Terms & Conditions',
    clauses: [
      {
        id: 'tos-1',
        number: '01',
        title: 'Child Safety & Custody Handoff Protocol',
        content: '<p>Home2School operates strictly under verified guardian custody transfer protocols. Drivers and walking escorts are mandated to verify child identity and hand off minors only to certified school staff or verified parents.</p><ul><li>Verified Guardian Sign-off at school gates.</li><li>Real-time identity verification upon student pickup with OTP or QR check.</li></ul>',
      },
      {
        id: 'tos-2',
        number: '02',
        title: 'Recurring Commute Pausing & Refund Policy',
        content: '<p>Recurring subscriptions can be cancelled or paused with 24-hour advance notice before the scheduled school commute week.</p><ul><li>Zero-penalty cancellation up to 24h prior to school cycle.</li><li>In-App Wallet credits never expire and roll over automatically.</li></ul>',
      },
      {
        id: 'tos-3',
        number: '03',
        title: 'Encrypted GPS Telemetry & Minor Privacy',
        content: '<p>All real-time telemetry and positioning coordinates are encrypted end-to-end (AES-256) and accessible only to verified parents and emergency dispatch during active trips. Data is purged after 30 days.</p><ul><li>AES-256 bank-grade encrypted location feeds.</li><li>Automated 30-day telemetry purging cycle.</li></ul>',
      },
    ],
  },
  about: {
    title: 'About Home2School',
    clauses: [
      {
        id: 'abt-1',
        number: '01',
        title: 'Our Purpose & Genesis',
        content: '<p>Home2School is a specialized, safety-certified child transportation and school commute platform designed specifically for busy families. It gives parents a reliable, stress-free alternative to crowded buses and hectic morning drop-offs.</p><p>Whether you need daily round-trip commutes, morning-only drop-offs, or a neighbourhood walking school escort, Home2School matches your family with background-checked community drivers who treat your children like family.</p>',
      },
      {
        id: 'abt-2',
        number: '02',
        title: 'Safety-First Community Promise',
        content: '<p>Every driver is background-checked, every trip is GPS-monitored, and every handoff is verified. Because your child’s safety is not a feature — it’s our foundation.</p><ul><li>Multi-tier vulnerable sector background verification.</li><li>Annual mechanical certification for all operating vehicles.</li><li>Strict zero-tolerance policy for unauthorized route diversions.</li></ul>',
      },
    ],
  },
};

const PAGE_TABS = [
  { key: 'faq', label: 'Help & FAQ', icon: HelpCircle },
  { key: 'privacy', label: 'Privacy Policy', icon: Shield },
  { key: 'tos', label: 'Terms & Conditions', icon: FileText },
  { key: 'about', label: 'About Us', icon: Info },
  { key: 'emergency', label: 'Emergency Contacts', icon: AlertTriangle },
  { key: 'branding', label: 'App Screens & Logo', icon: Smartphone },
];

/* — Helper UI components — */
const SaveIndicator = ({ show }: { show: boolean }) => show ? (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 6, fontSize: 14,
    fontWeight: 700, color: '#10B981', background: '#ECFDF5',
    padding: '4px 12px', borderRadius: 99, border: '1px solid #A7F3D0',
  }}>
    <Check size={14} strokeWidth={3} /> Published
  </div>
) : null;

/* — Policy & Clauses Manager Component (WITH CLEAN MODAL) — */
function PolicyClauseManager({
  initialData,
  onPublish
}: {
  pageKey: string;
  initialData: PolicyPageData;
  onPublish: (data: PolicyPageData) => void;
}) {
  const [data, setData] = useState<PolicyPageData>(initialData);

  // Auto-renumber helper so clause numbering is 100% position-based
  const renumber = (clauses: PolicyClause[]): PolicyClause[] => {
    return clauses.map((c, i) => ({
      ...c,
      number: String(i + 1).padStart(2, '0'),
    }));
  };

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeClauseId, setActiveClauseId] = useState<string | null>(null);
  const [clauseTitle, setClauseTitle] = useState('');
  const [clauseContent, setClauseContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [clauseError, setClauseError] = useState<string | null>(null);

  const openAddModal = () => {
    setClauseTitle('');
    setClauseContent('<p>Write clause description here...</p><ul><li>First key requirement or standard</li><li>Second key requirement or standard</li></ul>');
    setActiveClauseId(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (clause: PolicyClause) => {
    setClauseError(null);
    setClauseTitle(clause.title);
    setClauseContent(clause.content);
    setActiveClauseId(clause.id);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!clauseTitle.trim()) {
      setClauseError('Please enter a section title.');
      return;
    }
    if (modalMode === 'create') {
      const newClause: PolicyClause = {
        id: createId('clause'),
        number: '',
        title: clauseTitle.trim(),
        content: clauseContent || '<p>Clause content details.</p>',
      };
      const updated = renumber([...data.clauses, newClause]);
      const updatedData = { ...data, clauses: updated };
      setData(updatedData);
      triggerSave(updatedData);
    } else if (modalMode === 'edit' && activeClauseId) {
      const updated = renumber(
        data.clauses.map(c =>
          c.id === activeClauseId
            ? { ...c, title: clauseTitle.trim() || c.title, content: clauseContent }
            : c
        )
      );
      const updatedData = { ...data, clauses: updated };
      setData(updatedData);
      triggerSave(updatedData);
    }
    setModalOpen(false);
  };

  const deleteClause = (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const updated = renumber(data.clauses.filter(c => c.id !== id));
      const updatedData = { ...data, clauses: updated };
      setData(updatedData);
      triggerSave(updatedData);
    }
  };

  const duplicateClause = (clause: PolicyClause) => {
    const newClause: PolicyClause = {
      id: createId('clause'),
      number: '',
      title: clause.title + ' (Copy)',
      content: clause.content,
    };
    const updated = renumber([...data.clauses, newClause]);
    const updatedData = { ...data, clauses: updated };
    setData(updatedData);
    triggerSave(updatedData);
  };

  const moveClause = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.clauses.length) return;
    const list = [...data.clauses];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    const updatedData = { ...data, clauses: renumber(list) };
    setData(updatedData);
    triggerSave(updatedData);
  };

  const triggerSave = (newData?: PolicyPageData) => {
    const payload = newData || data;
    onPublish(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Top Action & Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid #E2E8F0',
        background: '#FFFFFF',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>{data.title}</h2>
          <span style={{
            fontSize: 12, fontWeight: 700, background: '#EEF2F9',
            color: '#1B2B68', padding: '3px 9px', borderRadius: 6,
          }}>
            {data.clauses.length} Sections
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SaveIndicator show={saved} />

          {/* Add Section Button */}
          <button
            type="button"
            onClick={openAddModal}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 14px', borderRadius: 8,
              background: '#1B2B68', color: '#FFFFFF', border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              boxShadow: '0 2px 4px rgba(27, 43, 104, 0.2)',
            }}
          >
            <Plus size={14} /> Add Clause
          </button>
        </div>
      </div>

      {/* Main Work Area - Full Width Clauses List */}
      <div style={{
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.clauses.map((clause, idx) => (
                <div
                  key={clause.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: 14,
                    padding: '16px 18px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Top Bar: Grip + Badge + Title + Action Buttons */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingBottom: 12, borderBottom: '1px solid #F1F5F9', gap: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <GripVertical size={14} style={{ color: '#CBD5E1', cursor: 'grab' }} />
                      <div style={{
                        minWidth: 32,
                        height: 26,
                        borderRadius: 7,
                        background: '#EEF2F9',
                        color: '#1B2B68',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        flexShrink: 0,
                      }}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <h4 style={{
                        fontSize: 14, fontWeight: 800, color: '#0F172A',
                        margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {clause.title}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => moveClause(idx, 'up')}
                        disabled={idx === 0}
                        style={{ ...iconBtnStyle, opacity: idx === 0 ? 0.35 : 1 }}
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveClause(idx, 'down')}
                        disabled={idx === data.clauses.length - 1}
                        style={{ ...iconBtnStyle, opacity: idx === data.clauses.length - 1 ? 0.35 : 1 }}
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateClause(clause)}
                        style={iconBtnStyle}
                        title="Duplicate Section"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(clause)}
                        style={{
                          ...iconBtnStyle,
                          width: 'auto',
                          padding: '0 8px',
                          gap: 4,
                          background: '#EEF2F9',
                          color: '#1B2B68',
                          border: '1px solid #D0DBF0',
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                        title="Edit Section"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteClause(clause.id)}
                        style={{ ...iconBtnStyle, color: '#EF4444', background: '#FFF5F5', border: '1px solid #FEE2E2' }}
                        title="Delete Section"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Body Content Preview */}
                  <div style={{ paddingTop: 12 }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: clause.content }}
                      style={{
                        fontSize: 12.5,
                        color: '#475569',
                        lineHeight: 1.65,
                        fontFamily: 'Manrope, sans-serif',
                      }}
                      className="clause-card-rendered"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Section Button at bottom */}
            <button
              type="button"
              onClick={openAddModal}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px', borderRadius: 12,
                background: '#F8FAFC', border: '2px dashed #CBD5E1',
                color: '#1B2B68', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#EEF2F9';
                (e.currentTarget as HTMLElement).style.borderColor = '#1B2B68';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#F8FAFC';
                (e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1';
              }}
            >
              <Plus size={16} /> Add Clause
            </button>
          </div>
      </div>

      {/* ── CLAUSE ADD / EDIT MODAL ── */}
      {modalOpen && (
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
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 780,
              maxHeight: '90vh',
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
                padding: '16px 22px',
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
                  {modalMode === 'create' ? <Plus size={18} /> : <Edit2 size={16} />}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {modalMode === 'create' ? 'Add Section' : 'Edit Section'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
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

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {clauseError && (
                <div style={{ padding: '8px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 12, fontWeight: 700 }}>
                  {clauseError}
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                  Section Title
                </label>
                <input
                  value={clauseTitle}
                  onChange={e => setClauseTitle(e.target.value)}
                  placeholder="e.g. Student Data & COPPA Protection"
                  style={{
                    width: '100%',
                    height: 42,
                    borderRadius: 9,
                    border: '1px solid #CBD5E1',
                    padding: '0 14px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#0F172A',
                    background: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                  Section Content
                </label>
                <RichTextEditor
                  value={clauseContent}
                  onChange={setClauseContent}
                  placeholder="Write section description and bullet points..."
                  minHeight={180}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid #E2E8F0',
                background: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
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
                type="button"
                onClick={handleSaveModal}
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
                <Check size={15} />
                {modalMode === 'create' ? 'Add Section' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .clause-card-rendered ul {
          margin: 10px 0 6px 18px;
          padding: 0;
          list-style-type: disc;
        }
        .clause-card-rendered li {
          margin-bottom: 5px;
          color: #475569;
        }
        .clause-card-rendered p {
          margin: 0 0 8px 0;
        }`}</style>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '1px solid #E2E8F0',
  background: '#FFFFFF',
  color: '#64748B',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

/* — FAQ Manager Component (WITH CLEAN MODAL) — */
function FAQManager() {
  const [items, setItems] = useState<FAQItem[]>(initFAQs);
  const [expandId, setExpandId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saved, setSaved] = useState(false);

  // FAQ Modal state
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [faqError, setFaqError] = useState<string | null>(null);
  const [faqModalMode, setFaqModalMode] = useState<'create' | 'edit'>('create');
  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  const openAddFaqModal = () => {
    setFaqQ('');
    setFaqA('');
    setActiveFaqId(null);
    setFaqModalMode('create');
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (item: FAQItem) => {
    setFaqQ(item.question);
    setFaqA(item.answer);
    setActiveFaqId(item.id);
    setFaqModalMode('edit');
    setFaqModalOpen(true);
  };

  const handleSaveFaqModal = () => {
    if (!faqQ.trim() || !faqA.trim()) {
      setFaqError('Please fill in both question and answer.');
      return;
    }
    if (faqModalMode === 'create') {
      setItems([...items, { id: Date.now(), question: faqQ.trim(), answer: faqA.trim() }]);
    } else if (faqModalMode === 'edit' && activeFaqId !== null) {
      setItems(items.map(i => i.id === activeFaqId ? { ...i, question: faqQ.trim(), answer: faqA.trim() } : i));
    }
    setFaqModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteItem = (id: number) => {
    if (confirm('Delete this question?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const filtered = items.filter(
    i => i.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
         i.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>Help &amp; FAQ</h2>
          
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <SaveIndicator show={saved} />
          <button
            type="button"
            onClick={openAddFaqModal}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 14px', borderRadius: 8,
              background: '#1B2B68', color: '#fff', border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Add Question
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF',
          border: '1px solid #CBD5E1', borderRadius: 8, padding: '0 10px', height: 36,
        }}>
          <Search size={14} color="#94A3B8" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search FAQs..."
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14, fontFamily: 'Manrope, sans-serif' }}
          />
        </div>
      </div>

      {/* FAQ list */}
      <div style={{ padding: 20 }}>
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            style={{
              border: '1.5px solid #E2E8F0',
              borderRadius: 12, marginBottom: 10, overflow: 'hidden',
              background: '#FFFFFF',
            }}
          >
            {/* Question Header */}
            <div
              style={{
                display: 'flex', alignItems: 'center', padding: '14px 16px',
                gap: 12, cursor: 'pointer', background: '#FFFFFF',
              }}
              onClick={() => setExpandId(expandId === item.id ? null : item.id)}
            >
              <span style={{
                width: 24, height: 24, borderRadius: 6, background: '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#94A3B8', flexShrink: 0,
              }}>
                {idx + 1}
              </span>

              <p style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: 0 }}>
                {item.question}
              </p>

              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => openEditFaqModal(item)}
                  style={iconBtnStyle}
                  title="Edit Question"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  style={{ ...iconBtnStyle, color: '#EF4444', background: '#FFF5F5', border: '1px solid #FEE2E2' }}
                  title="Delete Question"
                >
                  <Trash2 size={13} />
                </button>
                {expandId === item.id
                  ? <ChevronUp size={15} style={{ color: '#94A3B8', marginLeft: 2 }} />
                  : <ChevronDown size={15} style={{ color: '#94A3B8', marginLeft: 2 }} />
                }
              </div>
            </div>

            {/* Answer body */}
            {expandId === item.id && (
              <div style={{ padding: '0 16px 14px 46px', background: '#FAFBFF', borderTop: '1px solid #F1F5F9' }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#475569', lineHeight: 1.7, paddingTop: 12, margin: 0 }}>
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── FAQ ADD / EDIT MODAL ── */}
      {faqModalOpen && (
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
          onClick={() => setFaqModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 580,
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
            <div
              style={{
                padding: '16px 20px',
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
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: '#EEF2F9',
                    color: '#1B2B68',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {faqModalMode === 'create' ? <Plus size={16} /> : <Edit2 size={15} />}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {faqModalMode === 'create' ? 'Add FAQ Question' : 'Edit FAQ Question'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFaqModalOpen(false)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {faqError && (
                <div style={{ padding: '8px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 12, fontWeight: 700 }}>
                  {faqError}
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                  Question
                </label>
                <input
                  placeholder="Enter question..."
                  value={faqQ}
                  onChange={e => setFaqQ(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    color: '#0F172A',
                    background: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                  Answer
                </label>
                <textarea
                  placeholder="Enter answer..."
                  rows={5}
                  value={faqA}
                  onChange={e => setFaqA(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '10px 12px',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    color: '#0F172A',
                    background: '#fff',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #E2E8F0',
                background: '#F8FAFC',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setFaqModalOpen(false)}
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 7,
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#64748B',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFaqModal}
                style={{
                  height: 36,
                  padding: '0 18px',
                  borderRadius: 7,
                  background: '#1B2B68',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Check size={14} /> Save Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* — Emergency Contacts Manager Component — */
interface EmergencyContact {
  id: string;
  label: string;
  phone: string;
  email: string;
}

const initEmergencyContacts: EmergencyContact[] = [
  { id: 'emg-1', label: 'Safety Operations', phone: '+1 (416) 555-0100', email: 'safety@home2school.ca' },
  { id: 'emg-2', label: 'Parent Support Hotline', phone: '+1 (416) 555-0102', email: 'support@home2school.ca' },
  { id: 'emg-3', label: 'Driver & Provider Relations', phone: '+1 (416) 555-0104', email: 'drivers@home2school.ca' },
];

function EmergencyContactsManager() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(initEmergencyContacts);
  const [saved, setSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const triggerSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const openAdd = () => {
    setFormLabel(''); setFormPhone(''); setFormEmail('');
    setFormError(null); setActiveId(null);
    setModalMode('create'); setModalOpen(true);
  };

  const openEdit = (c: EmergencyContact) => {
    setFormLabel(c.label); setFormPhone(c.phone); setFormEmail(c.email);
    setFormError(null); setActiveId(c.id);
    setModalMode('edit'); setModalOpen(true);
  };

  const handleSave = () => {
    if (!formLabel.trim() || !formPhone.trim() || !formEmail.trim()) {
      setFormError('All fields are required.'); return;
    }
    if (modalMode === 'create') {
      setContacts([...contacts, { id: createId('emg'), label: formLabel.trim(), phone: formPhone.trim(), email: formEmail.trim() }]);
    } else if (activeId) {
      setContacts(contacts.map(c => c.id === activeId
        ? { ...c, label: formLabel.trim(), phone: formPhone.trim(), email: formEmail.trim() }
        : c
      ));
    }
    setModalOpen(false); triggerSave();
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this contact?')) { setContacts(contacts.filter(c => c.id !== id)); triggerSave(); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 40, borderRadius: 8,
    border: '1px solid #CBD5E1', padding: '0 12px',
    fontSize: 14, fontWeight: 600, color: '#0F172A',
    background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Manrope, sans-serif',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#64748B',
    display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid #E2E8F0',
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>Emergency Contacts</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <SaveIndicator show={saved} />
          <button
            type="button" onClick={openAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, height: 34,
              padding: '0 14px', borderRadius: 8, background: '#1B2B68',
              color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Plus size={13} /> Add Contact
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {contacts.map((c) => (
          <div
            key={c.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderRadius: 10,
              border: '1px solid #E2E8F0', background: '#FFFFFF', gap: 16,
            }}
          >
            {/* Label */}
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', minWidth: 180, flexShrink: 0 }}>
              {c.label}
            </span>

            {/* Phone */}
            <a
              href={`tel:${c.phone}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, color: '#1B2B68',
                textDecoration: 'none', flex: 1,
              }}
            >
              <Phone size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
              {c.phone}
            </a>

            {/* Email */}
            <a
              href={`mailto:${c.email}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, color: '#64748B',
                textDecoration: 'none', flex: 1,
              }}
            >
              <Mail size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
              {c.email}
            </a>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button type="button" onClick={() => openEdit(c)} style={iconBtnStyle} title="Edit">
                <Edit2 size={13} />
              </button>
              <button type="button" onClick={() => handleDelete(c.id)} style={{ ...iconBtnStyle, color: '#EF4444' }} title="Delete">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <p style={{ textAlign: 'center', padding: '32px 0', fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>
            No emergency contacts added yet.
          </p>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 20, zIndex: 100,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: '100%', maxWidth: 480, background: '#FFFFFF', borderRadius: 16,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex',
              flexDirection: 'column', overflow: 'hidden', border: '1px solid #E2E8F0',
              fontFamily: 'Manrope, sans-serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '14px 20px', borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#F8FAFC',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {modalMode === 'create' ? 'Add Contact' : 'Edit Contact'}
              </h3>
              <button
                type="button" onClick={() => setModalOpen(false)}
                style={{
                  width: 28, height: 28, borderRadius: 7, border: '1px solid #E2E8F0',
                  background: '#FFFFFF', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: '#64748B',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {formError && (
                <div style={{ padding: '7px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, color: '#DC2626', fontSize: 12, fontWeight: 700 }}>
                  {formError}
                </div>
              )}
              <div>
                <label style={labelStyle}>Label</label>
                <input value={formLabel} onChange={e => setFormLabel(e.target.value)} placeholder="e.g. Safety Operations" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+1 (416) 555-0100" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="safety@home2school.ca" style={inputStyle} />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '12px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
            }}>
              <button type="button" onClick={() => setModalOpen(false)} style={{ height: 34, padding: '0 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#64748B', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="button" onClick={handleSave} style={{ height: 34, padding: '0 16px', borderRadius: 8, border: 'none', background: '#1B2B68', color: '#FFFFFF', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* — MAIN CMS PAGE EXPORT — */

/* — App Screens & Branding Manager Component — */
function AppBrandingManager() {
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [splashBg, setSplashBg] = useState('#1B2B68');
  const [splashText, setSplashText] = useState('Home2School');
  const [onboardingTitle, setOnboardingTitle] = useState('Welcome to Home2School');
  const [onboardingSubtitle, setOnboardingSubtitle] = useState('Safe school rides & certified walking escorts for students, trusted by verified neighbourhood families.');
  const [activeScreenTab, setActiveScreenTab] = useState<'splash' | 'onboarding' | 'logo'>('onboarding');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Mobile App Screens & Brand Assets
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
            Dynamically configure the customer mobile app logo, splash loading screen, and onboarding welcome graphics.
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            height: 38,
            padding: '0 18px',
            borderRadius: 8,
            border: 'none',
            background: '#1B2B68',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(27, 43, 104, 0.15)',
          }}
        >
          {saved ? <Check size={16} /> : <Upload size={16} />}
          <span>{saved ? 'Changes Saved!' : 'Save Brand Assets'}</span>
        </button>
      </div>

      {/* Screen Selector Tabs */}
      <div style={{ display: 'flex', gap: 6, background: '#F1F5F9', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        <button
          onClick={() => setActiveScreenTab('onboarding')}
          style={{
            border: 'none',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            background: activeScreenTab === 'onboarding' ? '#FFFFFF' : 'transparent',
            color: activeScreenTab === 'onboarding' ? '#1B2B68' : '#64748B',
            boxShadow: activeScreenTab === 'onboarding' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          📱 Onboarding Screen
        </button>
        <button
          onClick={() => setActiveScreenTab('splash')}
          style={{
            border: 'none',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            background: activeScreenTab === 'splash' ? '#FFFFFF' : 'transparent',
            color: activeScreenTab === 'splash' ? '#1B2B68' : '#64748B',
            boxShadow: activeScreenTab === 'splash' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          🚀 Splash Loading Screen
        </button>
        <button
          onClick={() => setActiveScreenTab('logo')}
          style={{
            border: 'none',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            background: activeScreenTab === 'logo' ? '#FFFFFF' : 'transparent',
            color: activeScreenTab === 'logo' ? '#1B2B68' : '#64748B',
            boxShadow: activeScreenTab === 'logo' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          🏷️ App Emblem Logo
        </button>
      </div>

      {/* Editor & Smartphone Mockup Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 340px', gap: 24, alignItems: 'start' }}>
        {/* Left Form Controls */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {activeScreenTab === 'onboarding' && (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Main Welcome Headline
                </label>
                <input
                  value={onboardingTitle}
                  onChange={e => setOnboardingTitle(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Tagline / Description Text
                </label>
                <textarea
                  rows={3}
                  value={onboardingSubtitle}
                  onChange={e => setOnboardingSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, fontWeight: 500, color: '#0F172A', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Hero Image
                </label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    defaultValue="/images/van-hero.jpg"
                    style={{ flex: 1, height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, color: '#0F172A', outline: 'none' }}
                  />
                  <button style={{ height: 38, padding: '0 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: 12, fontWeight: 700, color: '#1B2B68', cursor: 'pointer' }}>
                    Browse
                  </button>
                </div>
              </div>
            </>
          )}

          {activeScreenTab === 'splash' && (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Splash Background Color
                </label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={splashBg}
                    onChange={e => setSplashBg(e.target.value)}
                    style={{ width: 44, height: 40, borderRadius: 8, border: '1px solid #CBD5E1', cursor: 'pointer', padding: 2 }}
                  />
                  <input
                    value={splashBg}
                    onChange={e => setSplashBg(e.target.value)}
                    style={{ flex: 1, height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, fontFamily: 'monospace', color: '#0F172A', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Splash Brand Wordmark
                </label>
                <input
                  value={splashText}
                  onChange={e => setSplashText(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </>
          )}

          {activeScreenTab === 'logo' && (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Official App Emblem Path / URL
                </label>
                <input
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px', fontSize: 12, color: '#64748B', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <strong style={{ color: '#0F172A' }}>Asset Guidelines:</strong>
                <span>• Dimensions: Minimum 512 x 512 px PNG with alpha transparency</span>
                <span>• Used across: Mobile app icon, Topbar emblem, and official receipt PDF headers</span>
              </div>
            </>
          )}
        </div>

        {/* Right Smartphone Frame Live Mockup */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Phone Preview
          </span>

          <div
            style={{
              width: 300,
              height: 580,
              borderRadius: 36,
              border: '10px solid #0F172A',
              boxShadow: '0 20px 30px rgba(0,0,0,0.18)',
              overflow: 'hidden',
              background: activeScreenTab === 'splash' ? splashBg : '#F8FAFC',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Speaker Notch */}
            <div style={{ width: 100, height: 16, background: '#0F172A', borderRadius: '0 0 12px 12px', margin: '0 auto', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />

            {activeScreenTab === 'splash' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#FFFFFF' }}>
                <img src={logoUrl} alt="Logo" style={{ width: 110, height: 110, objectFit: 'contain' }} />
                <h3 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                  {splashText}
                </h3>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '36px 18px 24px', justifyContent: 'space-between' }}>
                <div style={{ width: '100%', height: 220, borderRadius: 16, background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={logoUrl} alt="Hero" style={{ width: 120, height: 120, objectFit: 'contain' }} />
                </div>

                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {onboardingTitle}
                  </h4>
                  <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    {onboardingSubtitle}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ background: '#1B2B68', color: '#FFFFFF', padding: '10px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                    Sign up for free
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#1B2B68', padding: '9px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                    Sign in
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'tos' | 'privacy' | 'about' | 'emergency' | 'branding'>('about');
  const [pagesData, setPagesData] = useState<Record<string, PolicyPageData>>(initPages);

  const handlePublishPage = (key: string, updatedData: PolicyPageData) => {
    setPagesData(prev => ({
      ...prev,
      [key]: updatedData,
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Heading */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1D24', marginBottom: 2 }}>
          Content Management (CMS)
        </h1>
      </div>

      {/* Main Grid: Left Navigation + Right Editor Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18, alignItems: 'start' }}>
        {/* Left Sidebar Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PAGE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  border: '1.5px solid ' + (isSelected ? '#1B2B68' : '#E2E8F0'),
                  background: isSelected ? '#EEF2F9' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 6px rgba(27, 43, 104, 0.08)' : 'none',
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 7,
                  background: isSelected ? '#1B2B68' : '#F1F5F9',
                  color: isSelected ? '#FFFFFF' : '#64748B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} />
                </div>
                <p style={{
                  fontSize: 14, fontWeight: isSelected ? 800 : 600,
                  color: isSelected ? '#1B2B68' : '#1A1D24',
                  margin: 0,
                }}>
                  {tab.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Editor Panel */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        }}>
          {activeTab === 'faq' ? (
            <FAQManager />
          ) : activeTab === 'branding' ? (
          <AppBrandingManager />
        ) : activeTab === 'emergency' ? (
            <EmergencyContactsManager />
          ) : (
            <PolicyClauseManager
              key={activeTab}
              pageKey={activeTab}
              initialData={pagesData[activeTab]}
              onPublish={(updated) => handlePublishPage(activeTab, updated)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
