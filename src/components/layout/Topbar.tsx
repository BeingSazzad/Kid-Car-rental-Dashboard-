import { Bell, Search, ChevronDown } from 'lucide-react';

export default function Topbar() {
  return (
    <header
      style={{
        height: 60,
        background: '#ffffff',
        borderBottom: '1px solid #E2E8F0',
        fontFamily: 'Manrope, sans-serif',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Search */}
      <div
        style={{
          flex: 1,
          maxWidth: 380,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Search size={16} style={{ position: 'absolute', left: 12, color: '#94A3B8' }} />
        <input
          placeholder="Search users, trips, IDs..."
          style={{
            width: '100%',
            height: 38,
            background: '#F0F3FA',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            paddingLeft: 38,
            paddingRight: 14,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: 'Manrope, sans-serif',
            color: '#1A1D24',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Bell */}
      <button
        style={{
          position: 'relative',
          width: 38,
          height: 38,
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Bell size={17} style={{ color: '#64748B' }} />
        <span
          style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 8,
            height: 8,
            background: '#F2600C',
            borderRadius: '50%',
            border: '2px solid #fff',
          }}
        />
      </button>

      {/* Admin chip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          padding: '5px 10px',
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          background: '#fff',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#1B2B68',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>SA</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1D24' }}>Super Admin</span>
        <ChevronDown size={14} style={{ color: '#94A3B8' }} />
      </div>
    </header>
  );
}
