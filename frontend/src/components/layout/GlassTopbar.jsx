import React, { useState, useRef, useEffect } from 'react';
import { 
  HiMagnifyingGlass, 
  HiOutlineBell, 
  HiArrowPath, 
  HiChevronDown, 
  HiOutlineUser, 
  HiOutlineArrowRightOnRectangle, 
  HiOutlineShieldCheck 
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

export default function GlassTopbar({ onRefresh, onOpenProfile }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'SUPER_ADMIN': return { bg: 'rgba(37, 99, 235, 0.12)', color: '#2563EB', border: '1px solid rgba(37, 99, 235, 0.25)' };
      case 'MANAGER': return { bg: 'rgba(2, 132, 199, 0.12)', color: '#0284C7', border: '1px solid rgba(2, 132, 199, 0.25)' };
      case 'SUPERVISOR': return { bg: 'rgba(217, 119, 6, 0.12)', color: '#D97706', border: '1px solid rgba(217, 119, 6, 0.25)' };
      case 'ACCOUNTANT': return { bg: 'rgba(5, 150, 105, 0.12)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.25)' };
      case 'STOREKEEPER': return { bg: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', border: '1px solid rgba(124, 58, 237, 0.25)' };
      case 'CLIENT': return { bg: 'rgba(219, 39, 119, 0.12)', color: '#DB2777', border: '1px solid rgba(219, 39, 119, 0.25)' };
      default: return { bg: 'rgba(37, 99, 235, 0.12)', color: '#2563EB', border: '1px solid rgba(37, 99, 235, 0.25)' };
    }
  };

  const badgeStyle = getRoleBadgeStyle(user?.role);

  const handleProfileClick = () => {
    setMenuOpen(false);
    if (onOpenProfile) onOpenProfile();
  };

  return (
    <header className="glass-topbar-header" style={{ position: 'relative', zIndex: 50 }}>
      {/* Left: Avatar & Welcome Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div 
          onClick={handleProfileClick}
          className="glass-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          title="Click to view full user profile & permissions"
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#0F172A',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(15,23,42,0.2)'
          }}>
            {user?.avatar || 'MP'}
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
            Welcome, {user?.name || 'Mohit Patidar'}
          </span>
        </div>
      </div>

      {/* Center: Search Pill Bar */}
      <div style={{ flex: 1, maxWidth: '500px', margin: '0 16px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <HiMagnifyingGlass size={16} color="#475569" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
          <input 
            type="text" 
            placeholder="Search sites, labour, material, payments..." 
            className="glass-pill"
            style={{
              width: '100%',
              padding: '8px 65px 8px 38px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#0F172A',
              outline: 'none'
            }}
          />
          <kbd style={{
            position: 'absolute',
            right: '12px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#94A3B8',
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.9)'
          }}>
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right: Refresh + Profile Menu Trigger */}
      <div ref={menuRef} style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <button 
          onClick={onRefresh}
          className="glass-pill"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            color: '#475569'
          }}
          title="Refresh Data"
        >
          <HiArrowPath size={16} />
        </button>

        {/* User Profile Pill / Menu Trigger */}
        <div 
          onClick={() => setMenuOpen(!menuOpen)}
          className="glass-pill"
          style={{
            padding: '4px 10px 4px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#0F172A',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {user?.avatar || 'MP'}
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>
            {user?.roleTitle?.split('/')[0] || 'Super Admin'}
          </span>
          <HiChevronDown size={14} color="#64748B" />
        </div>

        {/* Profile Details Dropdown - Solid Opaque Background (Zero Chart Bleed-through) */}
        {menuOpen && (
          <div 
            className="glass-dropdown-menu animate-fade-in"
            style={{
              position: 'absolute',
              top: '46px',
              right: '0',
              width: '290px',
              padding: '18px',
              borderRadius: '20px',
              background: '#ffffff',
              boxShadow: '0 24px 50px rgba(10, 25, 70, 0.22), 0 4px 14px rgba(0, 0, 0, 0.08)',
              border: '1.5px solid rgba(203, 213, 225, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 9999
            }}
          >
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '14px', borderBottom: '1px solid rgba(226, 232, 240, 0.9)' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                flexShrink: 0
              }}>
                {user?.avatar || 'MP'}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Mohit Patidar'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user?.email || 'admin@sitepilot.in'}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: badgeStyle.bg,
                    color: badgeStyle.color,
                    border: badgeStyle.border,
                    display: 'inline-block'
                  }}>
                    {user?.roleBadge || '👑 Super Admin'}
                  </span>
                </div>
              </div>
            </div>

            {/* View Full Profile Details Button */}
            <button
              onClick={handleProfileClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid rgba(37, 99, 235, 0.3)',
                background: '#EFF6FF',
                color: '#1D4ED8',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <HiOutlineUser size={17} />
              <span>View Full Profile & Clearances</span>
            </button>

            {/* Logout button */}
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid rgba(239, 68, 68, 0.25)',
                background: '#FEE2E2',
                color: '#DC2626',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <HiOutlineArrowRightOnRectangle size={17} />
              <span>Sign Out / Lock Workspace</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
