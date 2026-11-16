import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  HiHome,
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineCreditCard,
  HiOutlineUserGroup,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineTruck,
  HiOutlineShoppingCart,
  HiOutlineBuildingStorefront,
  HiOutlineCalendarDays,
  HiOutlineCalculator,
  HiOutlineCheckBadge,
  HiOutlineFolderArrowDown,
  HiOutlineBanknotes,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineBellAlert,
  HiOutlineCircleStack,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText
} from 'react-icons/hi2';

export default function GlassSidebar({ activeTab, setActiveTab }) {
  const { user, canAccess } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: HiOutlineHome, activeIcon: HiHome },
    { id: 'projects', label: 'Sites & Projects', icon: HiOutlineBuildingOffice2 },
    { id: 'accounts', label: 'Accounts & Billing (RA Bills)', icon: HiOutlineCreditCard },
    { id: 'labour', label: 'Labour & Workforce Muster', icon: HiOutlineUserGroup },
    { id: 'materials', label: 'Material & Inventory Assets', icon: HiOutlineCube },
    { id: 'reports', label: 'Daily Progress (DPR) & Reports', icon: HiOutlineChartBar },
    { id: 'equipment', label: 'Machinery & Equipment Tracking', icon: HiOutlineTruck },
    { id: 'purchase_orders', label: 'Purchase Orders (PO) Approvals', icon: HiOutlineShoppingCart },
    { id: 'vendors', label: 'Vendor & Supplier Management', icon: HiOutlineBuildingStorefront },
    { id: 'tasks_gantt', label: 'Task Scheduling & Gantt Timeline', icon: HiOutlineCalendarDays },
    { id: 'boq_estimates', label: 'BOQ & Cost Estimates vs Actuals', icon: HiOutlineCalculator },
    { id: 'approvals', label: 'Expense Approval Workflow', icon: HiOutlineCheckBadge },
    { id: 'documents', label: 'Document Manager & Compliance NOCs', icon: HiOutlineFolderArrowDown },
    { id: 'cashbook', label: 'Site Cash Book & Petty Cash Float', icon: HiOutlineBanknotes },
    { id: 'safety_quality', label: 'Safety Checklists & Snag List', icon: HiOutlineShieldCheck },
    { id: 'customer_portal', label: 'Customer & Investor Portal', icon: HiOutlineGlobeAlt },
    { id: 'notifications', label: 'Notifications (WhatsApp / SMS Alerts)', icon: HiOutlineBellAlert },
    { id: 'audit_backup', label: 'System Audit Log & Daily Backups', icon: HiOutlineCircleStack },
  ];

  // RBAC: Filter items according to the logged-in user's role permissions
  const visibleItems = menuItems.filter(item => canAccess(item.id));

  return (
    <aside className="glass-sidebar-capsule">
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
          marginBottom: '14px',
          cursor: 'pointer',
          flexShrink: 0
        }}
        title="SitePilot - Construction Management"
      >
        <HiOutlineDocumentText size={21} strokeWidth={2} />
      </div>

      {/* Navigation Icons Visible Directly on the Line */}
      <nav className="sidebar-nav-list">
        {visibleItems.map((item) => {
          const Icon = (item.activeIcon && activeTab === item.id) ? item.activeIcon : item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '38px',
                height: '38px',
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

      {/* Subtle Separator Dot */}
      <div 
        style={{ 
          width: '16px', 
          height: '1px', 
          background: 'rgba(15, 23, 42, 0.14)', 
          margin: '12px 0', 
          flexShrink: 0 
        }} 
      />

      {/* Bottom Settings Button */}
      <button
        onClick={() => setActiveTab('settings')}
        style={{
          width: '38px',
          height: '38px',
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
    </aside>
  );
}
