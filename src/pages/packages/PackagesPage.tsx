import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, MoreHorizontal, Users, CreditCard, ShieldCheck } from 'lucide-react';

export interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
  badge: string;
  targetAudience: string;
  activeSubscribers: number;
  features: string[];
}

const INITIAL_PLANS: Plan[] = [
  {
    id: 1,
    name: 'Pay As You Go',
    price: '$0',
    period: 'Free forever',
    badge: '',
    targetAudience: 'For occasional rides & emergency backup',
    activeSubscribers: 412,
    features: [
      '1 Child profile included',
      'Standard booking fee ($2.50 / trip)',
      'Live GPS route tracking & safe arrival SMS',
      'In-app driver & walking chaperone messaging',
      'Child safety emergency SOS button',
    ],
  },
  {
    id: 2,
    name: 'Monthly Commute Pass',
    price: '$19.99',
    period: '/ month',
    badge: 'Most Popular',
    targetAudience: 'For daily Mon–Fri morning & afternoon school runs',
    activeSubscribers: 1280,
    features: [
      'Up to 3 Children profiles included',
      '$0 Platform booking fees (unlimited rides)',
      'Guaranteed dedicated recurring driver or walker',
      'Morning & afternoon rush-hour priority dispatch',
      'Free trip reschedule up to 2 hours before pickup',
      'Automated school gate photo check-in',
    ],
  },
  {
    id: 3,
    name: 'School Term Pass',
    price: '$89',
    period: '/ school term (5 months)',
    badge: 'Best Value',
    targetAudience: 'Full semester stability & maximum family savings',
    activeSubscribers: 640,
    features: [
      'Unlimited children in household',
      'Fixed recurring driver & vehicle for entire term',
      '10% discount on total ride fares',
      'Zero cancellation penalties for sick days',
      'Direct phone hotline to Safety & Operations team',
      'Multi-stop route customization (Home ↔ School ↔ Activities)',
    ],
  },
];

export default function PackagesPage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // Form Fields (Minimalist)
  const [name, setName] = useState('');
  const [priceAmount, setPriceAmount] = useState('19.99');
  const [period, setPeriod] = useState('/ month');
  const [badge, setBadge] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  // Close 3-dot dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    if (openMenuId !== null) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [openMenuId]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedPlanId(null);
    setName('');
    setPriceAmount('19.99');
    setPeriod('/ month');
    setBadge('');
    setFeatures([
      'Up to 3 Children profiles included',
      '$0 Platform booking fees',
      'Guaranteed dedicated recurring driver',
      'Live GPS route tracking & safe arrival SMS',
    ]);
    setNewFeature('');
    setModalOpen(true);
    setOpenMenuId(null);
  };

  const openEditModal = (p: Plan) => {
    setModalMode('edit');
    setSelectedPlanId(p.id);
    setName(p.name);
    setPriceAmount(p.price.replace('$', '').trim());
    setPeriod(p.period);
    setBadge(p.badge);
    setFeatures([...p.features]);
    setNewFeature('');
    setModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeletePlan = (id: number) => {
    setPlans(plans.filter(p => p.id !== id));
    setOpenMenuId(null);
  };

  const handleAddFeature = () => {
    const feat = newFeature.trim();
    if (feat && !features.includes(feat)) {
      setFeatures([...features, feat]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feat: string) => {
    setFeatures(features.filter(f => f !== feat));
  };

  const handleSavePlan = () => {
    if (!name.trim()) return;

    const finalPrice = priceAmount.trim() ? (priceAmount.startsWith('$') ? priceAmount : '$' + priceAmount) : '$0';

    if (modalMode === 'create') {
      const newPlan: Plan = {
        id: Date.now(),
        name: name.trim(),
        price: finalPrice,
        period: period.trim() || '/ month',
        badge: badge.trim(),
        targetAudience: 'School commute package',
        activeSubscribers: 0,
        features: features.length > 0 ? features : ['Standard school ride booking'],
      };
      setPlans([...plans, newPlan]);
    } else {
      setPlans(plans.map(p =>
        p.id === selectedPlanId
          ? {
              ...p,
              name: name.trim(),
              price: finalPrice,
              period: period.trim() || p.period,
              badge: badge.trim(),
              features: features.length > 0 ? features : ['Standard school ride booking'],
            }
          : p
      ));
    }
    setModalOpen(false);
  };

  const totalSubscribers = plans.reduce((acc, p) => acc + (p.activeSubscribers || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Manrope, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Subscription Packages
            </h1>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                background: '#EEF2FF',
                color: '#1B2B68',
                padding: '3px 10px',
                borderRadius: 99,
              }}
            >
              {plans.length} active plans
            </span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '4px 0 0' }}>
            Configure commute memberships, booking fee waivers, and recurring ride benefits for parents.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            height: 38,
            padding: '0 16px',
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
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B2B68' }}>
            <Users size={22} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', margin: 0 }}>Total Active Subscribers</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>{totalSubscribers.toLocaleString()} Parents</p>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <CreditCard size={22} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', margin: 0 }}>Monthly Recurring (MRR)</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>$31,290 CAD</p>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', margin: 0 }}>Most Subscribed Plan</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>Monthly Commute Pass</p>
          </div>
        </div>
      </div>

      {/* ── 3 Plans Grid (Clean minimalist cards with NO bottom redundant edit button) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {plans.map(p => {
          const isPopular = p.badge.toLowerCase().includes('popular') || p.badge.toLowerCase().includes('best');
          return (
            <div
              key={p.id}
              style={{
                background: '#FFFFFF',
                border: isPopular ? '2px solid #1B2B68' : '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isPopular ? '0 4px 14px rgba(27, 43, 104, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Top row: Name, optional Badge, and 3-dot Menu */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                    {p.name}
                  </span>
                  {p.badge && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        background: p.badge === 'Most Popular' ? '#1B2B68' : '#ECFDF5',
                        color: p.badge === 'Most Popular' ? '#FFFFFF' : '#059669',
                        padding: '2px 8px',
                        borderRadius: 99,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* 3-dot button & Popover */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === p.id ? null : p.id);
                    }}
                    title="Plan Options"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: '1px solid #E2E8F0',
                      background: openMenuId === p.id ? '#F1F5F9' : '#FFFFFF',
                      color: '#64748B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {/* 3-dot Dropdown Menu (Edit & Delete) */}
                  {openMenuId === p.id && (
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 38,
                        width: 130,
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        padding: 4,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        zIndex: 30,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <button
                        onClick={() => openEditModal(p)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 10px',
                          border: 'none',
                          background: 'none',
                          borderRadius: 6,
                          color: '#1E293B',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <Edit2 size={14} style={{ color: '#1B2B68' }} /> Edit Plan
                      </button>

                      <div style={{ height: 1, background: '#F1F5F9', margin: '3px 0' }} />

                      <button
                        onClick={() => handleDeletePlan(p.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 10px',
                          border: 'none',
                          background: 'none',
                          borderRadius: 6,
                          color: '#EF4444',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <Trash2 size={14} style={{ color: '#EF4444' }} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtitle / Target Audience */}
              <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px', lineHeight: 1.4 }}>
                {p.targetAudience}
              </p>

              {/* Price Line */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {p.price}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>
                  {p.period}
                </span>
              </div>

              {/* Active subscriber count */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F8FAFC', padding: '3px 8px', borderRadius: 6, marginBottom: 16 }}>
                <Users size={12} color="#64748B" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
                  {p.activeSubscribers} parents active
                </span>
              </div>

              {/* Divider line */}
              <div style={{ borderTop: '1px solid #F1F5F9', marginBottom: 16 }} />

              {/* Features list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <Check size={16} color="#059669" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', lineHeight: 1.4 }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Minimalist Add / Edit Modal ── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 16,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              width: 440,
              maxWidth: '100%',
              padding: 22,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header: Clean & Compact */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {modalMode === 'create' ? 'Add Subscription Plan' : 'Edit Subscription Plan'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Plan Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Plan Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Monthly Commute Pass"
                  style={{
                    width: '100%',
                    height: 38,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Price & Billing Cycle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Price ($ CAD)
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span style={{ position: 'absolute', left: 12, fontSize: 14, fontWeight: 700, color: '#64748B' }}>$</span>
                    <input
                      value={priceAmount}
                      onChange={e => setPriceAmount(e.target.value)}
                      placeholder="19.99"
                      style={{
                        width: '100%',
                        height: 38,
                        borderRadius: 8,
                        border: '1px solid #CBD5E1',
                        paddingLeft: 26,
                        paddingRight: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: 'Manrope, sans-serif',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Billing Cycle
                  </label>
                  <select
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '0 10px',
                      fontSize: 12,
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 600,
                      outline: 'none',
                      background: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="/ month">Monthly (/ month)</option>
                    <option value="/ school term (5 months)">School Term (/ term)</option>
                    <option value="/ year">Annual (/ year)</option>
                    <option value="Free forever">Free forever</option>
                  </select>
                </div>
              </div>

              {/* Badge Tag */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Badge (Optional)
                </label>
                <select
                  value={badge}
                  onChange={e => setBadge(e.target.value)}
                  style={{
                    width: '100%',
                    height: 38,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '0 10px',
                    fontSize: 12,
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">No Badge</option>
                  <option value="Most Popular">Most Popular</option>
                  <option value="Best Value">Best Value</option>
                </select>
              </div>

              {/* Features Builder */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Plan Features
                </label>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    placeholder="Add a feature and press Enter..."
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '0 10px',
                      fontSize: 12,
                      fontFamily: 'Manrope, sans-serif',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    style={{
                      height: 36,
                      padding: '0 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#1B2B68',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                </div>

                {/* Features List */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 110, overflowY: 'auto' }}>
                  {features.map(f => (
                    <span
                      key={f}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        background: '#F1F5F9',
                        color: '#334155',
                        padding: '3px 8px',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {f}
                      <X size={12} style={{ cursor: 'pointer', color: '#94A3B8' }} onClick={() => handleRemoveFeature(f)} />
                    </span>
                  ))}
                  {features.length === 0 && (
                    <span style={{ fontSize: 12, color: '#94A3B8', padding: '4px 0' }}>No features added yet.</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    height: 36,
                    padding: '0 14px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
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
                  onClick={handleSavePlan}
                  style={{
                    height: 36,
                    padding: '0 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#1B2B68',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
