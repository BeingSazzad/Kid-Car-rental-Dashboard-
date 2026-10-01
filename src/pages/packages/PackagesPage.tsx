import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, MoreHorizontal } from 'lucide-react';

export interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
  badge: string;
  features: string[];
}

const INITIAL_PLANS: Plan[] = [
  {
    id: 1,
    name: 'Free Trial',
    price: '$0',
    period: 'for 14 days',
    features: ['1 child profile', 'Up to 3 bookings', 'Basic GPS tracking'],
    badge: '',
  },
  {
    id: 2,
    name: 'Monthly Plan',
    price: '$9.99',
    period: '/ month',
    features: ['Unlimited children', 'Unlimited bookings', 'Live GPS tracking', 'In-app messaging', 'Safety SOS button'],
    badge: 'Popular',
  },
  {
    id: 3,
    name: 'Annual Plan',
    price: '$79',
    period: '/ year',
    features: ['Everything in Monthly', 'Save 34% vs. monthly', 'Priority support', 'Advanced analytics'],
    badge: 'Best value',
  },
];

export default function PackagesPage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState('');
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
    setPrice('$');
    setPeriod('/ month');
    setBadge('');
    setFeatures(['Unlimited children', 'Live GPS tracking']);
    setNewFeature('');
    setModalOpen(true);
    setOpenMenuId(null);
  };

  const openEditModal = (p: Plan) => {
    setModalMode('edit');
    setSelectedPlanId(p.id);
    setName(p.name);
    setPrice(p.price);
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
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feat: string) => {
    setFeatures(features.filter(f => f !== feat));
  };

  const handleSavePlan = () => {
    if (!name.trim()) return;

    if (modalMode === 'create') {
      const newPlan: Plan = {
        id: Date.now(),
        name: name.trim(),
        price: price.trim() || '$0',
        period: period.trim() || '/ month',
        badge: badge.trim(),
        features: features.length > 0 ? features : ['Standard booking'],
      };
      setPlans([...plans, newPlan]);
    } else {
      setPlans(plans.map(p =>
        p.id === selectedPlanId
          ? {
              ...p,
              name: name.trim(),
              price: price.trim(),
              period: period.trim(),
              badge: badge.trim(),
              features: features.length > 0 ? features : ['Standard booking'],
            }
          : p
      ));
    }
    setModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Manrope, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Subscription packages
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
              {plans.length} plans
            </span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '4px 0 0' }}>
            Manage pricing and features for each plan.
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
          <Plus size={16} /> Add plan
        </button>
      </div>

      {/* ── 3 Plans Grid (With 3-dot Edit & Delete Dropdown) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {plans.map(p => (
          <div
            key={p.id}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 16,
              padding: '24px 22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Top row: Name, optional Badge, and 3-dot Menu */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                  {p.name}
                </span>
                {p.badge && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      background: '#EEF2FF',
                      color: '#1D4ED8',
                      padding: '2px 8px',
                      borderRadius: 99,
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
                      <Edit2 size={14} style={{ color: '#1B2B68' }} /> Edit
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

            {/* Price Line */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {p.price}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>
                {p.period}
              </span>
            </div>

            {/* Divider line */}
            <div style={{ borderTop: '1px solid #F1F5F9', marginBottom: 18 }} />

            {/* Features list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Check size={16} color="#10B981" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal for Editing or Adding a Plan ── */}
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
              borderRadius: 16,
              width: 480,
              maxWidth: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {modalMode === 'create' ? 'Add Subscription Plan' : 'Edit Subscription Plan'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Plan Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Monthly Plan"
                  style={{
                    width: '100%',
                    height: 38,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: 14,
                    fontFamily: 'Manrope',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Price
                  </label>
                  <input
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. $9.99"
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '0 12px',
                      fontSize: 14,
                      fontFamily: 'Manrope',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Billing Cycle
                  </label>
                  <input
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    placeholder="e.g. / month"
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '0 12px',
                      fontSize: 14,
                      fontFamily: 'Manrope',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Badge Tag (Optional)
                </label>
                <input
                  value={badge}
                  onChange={e => setBadge(e.target.value)}
                  placeholder="e.g. Popular, Best value"
                  style={{
                    width: '100%',
                    height: 38,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: 14,
                    fontFamily: 'Manrope',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Features
                </label>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    placeholder="Add feature item..."
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '0 10px',
                      fontSize: 12,
                      fontFamily: 'Manrope',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    style={{
                      height: 36,
                      padding: '0 12px',
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
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    height: 38,
                    padding: '0 14px',
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
                  type="button"
                  onClick={handleSavePlan}
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
