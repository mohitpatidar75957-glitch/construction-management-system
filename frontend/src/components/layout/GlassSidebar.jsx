import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, HardHat } from 'lucide-react';
import { 
  HiOutlineBuildingOffice2,
  HiOutlineBanknotes,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineTruck,
  HiOutlineClipboardDocumentList,
  HiOutlineBuildingStorefront,
  HiOutlineCalendarDays,
  HiOutlineCalculator,
  HiOutlineCheckBadge,
  HiOutlineFolderArrowDown,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineBellAlert,
  HiOutlineCircleStack,
  HiOutlineCog6Tooth,
  HiChevronUp,
  HiChevronDown
} from 'react-icons/hi2';

export default function GlassSidebar({ activeTab, setActiveTab }) {
  const { user, canAccess } = useAuth();
  const asideRef = useRef(null);
  const navRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    if (!navRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = navRef.current;
    setCanScrollUp(scrollTop > 6);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 6);
  }, []);

  // Check scroll capability whenever items or layout changes
  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScroll]);

  // Non-passive wheel handler: smooth sidebar scrolling on hover without bouncing page
  useEffect(() => {
    const asideEl = asideRef.current;
    if (!asideEl) return;

    const onWheel = (e) => {
      const navEl = navRef.current;
      if (!navEl) return;
      const isScrollable = navEl.scrollHeight > navEl.clientHeight;
      if (isScrollable) {
        e.preventDefault();
        navEl.scrollTop += e.deltaY;
        checkScroll();
      }
    };

    asideEl.addEventListener('wheel', onWheel, { passive: false });
    return () => asideEl.removeEventListener('wheel', onWheel);
  }, [checkScroll]);

  const scrollUp = (e) => {
    e.stopPropagation();
    if (navRef.current) {
      navRef.current.scrollBy({ top: -110, behavior: 'smooth' });
      setTimeout(checkScroll, 200);
    }
  };

  const scrollDown = (e) => {
    e.stopPropagation();
    if (navRef.current) {
      navRef.current.scrollBy({ top: 110, behavior: 'smooth' });
      setTimeout(checkScroll, 200);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Sites & Projects', icon: HiOutlineBuildingOffice2 },
    { id: 'accounts', label: 'Accounts & Billing (RA Bills)', icon: HiOutlineBanknotes },
    { id: 'labour', label: 'Labour & Workforce Muster', icon: HardHat },
    { id: 'materials', label: 'Material & Inventory Assets', icon: HiOutlineCube },
    { id: 'reports', label: 'Daily Progress (DPR) & Reports', icon: HiOutlineChartBar },
    { id: 'equipment', label: 'Machinery & Equipment Tracking', icon: HiOutlineTruck },
    { id: 'purchase_orders', label: 'Purchase Orders (PO) Approvals', icon: HiOutlineClipboardDocumentList },
    { id: 'vendors', label: 'Vendor & Supplier Management', icon: HiOutlineBuildingStorefront },
    { id: 'tasks_gantt', label: 'Task Scheduling & Gantt Timeline', icon: HiOutlineCalendarDays },
    { id: 'boq_estimates', label: 'BOQ & Cost Estimates vs Actuals', icon: HiOutlineCalculator },
    { id: 'approvals', label: 'Expense Approval Workflow', icon: HiOutlineCheckBadge },
    { id: 'documents', label: 'Document Manager & Compliance NOCs', icon: HiOutlineFolderArrowDown },
    { id: 'cashbook', label: 'Site Cash Book & Petty Cash Float', icon: HiOutlineCreditCard },
    { id: 'safety_quality', label: 'Safety Checklists & Snag List', icon: HiOutlineShieldCheck },
    { id: 'customer_portal', label: 'Customer & Investor Portal', icon: HiOutlineGlobeAlt },
    { id: 'notifications', label: 'Notifications (WhatsApp / SMS Alerts)', icon: HiOutlineBellAlert },
    { id: 'audit_backup', label: 'System Audit Log & Daily Backups', icon: HiOutlineCircleStack },
  ];

  // RBAC: Filter items according to the logged-in user's role permissions
  const visibleItems = menuItems.filter(item => canAccess(item.id));

  return (
    <aside 
      ref={asideRef}
      className="glass-sidebar-capsule"
      onMouseEnter={() => {
        setIsHovered(true);
        checkScroll();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Blue Brand Icon Button */}
      <div 
        onClick={() => setActiveTab('overview')}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '13px',
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 18px rgba(37, 99, 235, 0.4)',
          marginBottom: '10px',
          cursor: 'pointer',
          flexShrink: 0
        }}
        title="SitePilot - Construction Management"
      >
        <HiOutlineBuildingOffice2 size={22} strokeWidth={2.2} />
      </div>

      {/* Navigation Icons Wrapper with Hover Arrow Buttons */}
      <div className="sidebar-nav-wrapper">
        {/* Subtle Up Chevron Arrow (Visible on hover when scrolled down) */}
        {isHovered && canScrollUp && (
          <button 
            type="button"
            className="sidebar-scroll-arrow-btn top"
            onClick={scrollUp}
            title="Scroll up"
            aria-label="Scroll up"
          >
            <HiChevronUp size={14} strokeWidth={2.5} />
          </button>
        )}

        {/* Navigation Icons Scrollable Up & Down with NO Scrollbar Line */}
        <nav 
          ref={navRef}
          className="sidebar-nav-list"
          onScroll={checkScroll}
        >
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '38px',
                  height: '38px',
                  minHeight: '38px',
                  borderRadius: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#2563EB' : '#475569',
                  boxShadow: isActive ? '0 6px 18px rgba(10, 25, 70, 0.12)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  padding: 0,
                  flexShrink: 0
                }}
                aria-label={item.label}
                title={item.label}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.9} />
              </button>
            );
          })}
        </nav>

        {/* Subtle Down Chevron Arrow (Visible on hover when more items exist below) */}
        {isHovered && canScrollDown && (
          <button 
            type="button"
            className="sidebar-scroll-arrow-btn bottom"
            onClick={scrollDown}
            title="Scroll down"
            aria-label="Scroll down"
          >
            <HiChevronDown size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Bottom Settings Button (ALWAYS Pinned cleanly at bottom curve of capsule) */}
      <div style={{ marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            width: '38px',
            height: '38px',
            minHeight: '38px',
            borderRadius: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: activeTab === 'settings' ? '#ffffff' : 'transparent',
            color: activeTab === 'settings' ? '#2563EB' : '#475569',
            boxShadow: activeTab === 'settings' ? '0 6px 18px rgba(10, 25, 70, 0.12)' : 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0
          }}
          title="Settings, Roles, Language (Hindi) & PWA"
          aria-label="Settings"
        >
          <HiOutlineCog6Tooth size={20} strokeWidth={activeTab === 'settings' ? 2.4 : 1.9} />
        </button>
      </div>
    </aside>
  );
}
