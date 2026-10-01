import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
  LayoutDashboard, Users, MapPin, CreditCard,
  ShieldCheck, Gift, Megaphone, FileText,
  Package, LifeBuoy, Settings, ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: any;
  to: string;
  badge?: number;
}

/* ─── Streamlined Navigation (Optimized Operational Priority Order) ─── */
const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, to: ROUTES.OVERVIEW },
  { label: 'Trips & Transit', icon: MapPin, to: ROUTES.TRIPS },
  { label: 'Users', icon: Users, to: ROUTES.USERS },
  { label: 'KYC Queue', icon: ShieldCheck, to: ROUTES.KYC, badge: 4 },
  { label: 'Support Tickets', icon: LifeBuoy, to: ROUTES.SUPPORT, badge: 2 },
  { label: 'Transactions', icon: CreditCard, to: ROUTES.PAYMENTS },
  { label: 'Packages', icon: Package, to: ROUTES.PACKAGES },
  { label: 'Push Broadcasts', icon: Megaphone, to: ROUTES.NOTIFICATIONS },
  { label: 'Referrals', icon: Gift, to: ROUTES.REFERRALS },
  { label: 'Content (CMS)', icon: FileText, to: ROUTES.CMS },
  { label: 'Settings', icon: Settings, to: ROUTES.SETTINGS },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      background: '#FFFFFF',
      borderRight: '1px solid #E2E8F0',
      fontFamily: 'Manrope, sans-serif',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
    }}>
      {/* ── Brand Logo Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px 18px',
        borderBottom: '1px solid #F1F5F9',
      }}>
        <img
          src="/logo.png"
          alt="Home2School logo"
          style={{
            width: 40,
            height: 40,
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
        <div style={{ lineHeight: 1 }}>
          <p style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#1B2B68',
            letterSpacing: '-0.01em',
            margin: 0,
          }}>
            Home<span style={{ color: '#F2600C' }}>2</span>School
          </p>
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#94A3B8',
            marginTop: 3,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            margin: 0,
          }}>Admin Panel</p>
        </div>
      </div>

      {/* ── Clean Uncluttered Navigation List ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }}>
        {NAV_ITEMS.map(({ label, icon: Icon, to, badge }) => {
          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                marginBottom: 3,
                textDecoration: 'none',
                background: isActive ? '#1B2B68' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = '#F0F3FA';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <Icon size={16} strokeWidth={2} style={{ color: isActive ? '#ffffff' : '#64748B', flexShrink: 0 }} />
              <span style={{
                fontSize: 13,
                fontWeight: isActive ? 700 : 600,
                color: isActive ? '#ffffff' : '#475569',
                flex: 1,
              }}>{label}</span>
              {badge && (
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#fff',
                  background: '#F2600C',
                  borderRadius: 99,
                  padding: '1px 7px',
                  lineHeight: '16px',
                }}>{badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Admin Footer Profile ── */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #F1F5F9' }}>
        <div
          onClick={() => navigate('/settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            cursor: 'pointer',
            background: '#F8FAFC',
            border: '1px solid #F1F5F9',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
          onMouseLeave={e => (e.currentTarget.style.background = '#F8FAFC')}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#1B2B68',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>SC</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1D24', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Sazzad Chowdhury
            </p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#64748B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Super Admin
            </p>
          </div>
          <ChevronRight size={14} style={{ color: '#CBD5E1', flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  );
}
