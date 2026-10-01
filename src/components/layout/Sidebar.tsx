import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
  LayoutDashboard, Users, MapPin, CreditCard,
  ShieldCheck, Gift, Bell, FileText,
  Package, Settings, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const NAV = [
  { label: 'Overview', icon: LayoutDashboard, to: ROUTES.OVERVIEW },
  { label: 'Users', icon: Users, to: ROUTES.USERS },
  { label: 'Trips', icon: MapPin, to: ROUTES.TRIPS },
  { label: 'Payments', icon: CreditCard, to: ROUTES.PAYMENTS },
  { label: 'KYC Queue', icon: ShieldCheck, to: ROUTES.KYC, badge: 4 },
  { label: 'Referrals', icon: Gift, to: ROUTES.REFERRALS },
  { label: 'Notifications', icon: Bell, to: ROUTES.NOTIFICATIONS },
  { label: 'Content (CMS)', icon: FileText, to: ROUTES.CMS },
  { label: 'Packages', icon: Package, to: ROUTES.PACKAGES },
  { label: 'Settings', icon: Settings, to: ROUTES.SETTINGS },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside
      style={{ width: 240, minWidth: 240, background: '#1B2B68', fontFamily: 'Manrope, sans-serif' }}
      className="h-screen flex flex-col fixed left-0 top-0 z-50 select-none"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div
          style={{ width: 36, height: 36, background: '#F2600C', borderRadius: 10 }}
          className="flex items-center justify-center flex-shrink-0"
        >
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>H</span>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>Home2School</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }} className="px-3 mb-2 uppercase">Menu</p>
        {NAV.map(({ label, icon: Icon, to, badge }) => {
          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 group relative transition-all duration-150"
              style={{
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #F2600C' : '3px solid transparent',
              }}
            >
              <Icon
                size={18}
                strokeWidth={2}
                style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)', flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
                  flex: 1,
                }}
              >
                {label}
              </span>
              {badge && (
                <span
                  style={{
                    fontSize: 12, fontWeight: 700, color: '#fff',
                    background: '#F2600C', borderRadius: 99,
                    padding: '1px 7px', lineHeight: '20px',
                  }}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/8 transition-colors">
          <div
            style={{ width: 34, height: 34, borderRadius: '50%', background: '#F2600C', flexShrink: 0 }}
            className="flex items-center justify-center"
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>SA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }} className="truncate">Super Admin</p>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.45)' }} className="truncate">admin@home2school.ca</p>
          </div>
          <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  );
}
