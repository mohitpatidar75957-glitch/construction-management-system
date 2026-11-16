import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  Home,
  Receipt,
  Users, 
  Boxes, 
  BarChart3, 
  Truck,
  ShoppingCart,
  Store,
  Calendar,
  Calculator,
  CheckSquare,
  FolderArchive,
  Coins,
  ShieldCheck,
  Globe,
  Bell,
  Database,
  Settings 
} from 'lucide-react';

export default function GlassSidebar({ activeTab, setActiveTab }) {
  const { user, canAccess } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Home },
    { id: 'projects', label: 'Sites & Projects', icon: Building2 },
    { id: 'accounts', label: 'Accounts & Billing (RA Bills)', icon: Receipt },
    { id: 'labour', label: 'Labour & Workforce Muster', icon: Users },
    { id: 'materials', label: 'Material & Inventory Assets', icon: Boxes },
    { id: 'reports', label: 'Daily Progress (DPR) & Reports', icon: BarChart3 },
    { id: 'equipment', label: 'Machinery & Equipment Tracking', icon: Truck },
    { id: 'purchase_orders', label: 'Purchase Orders (PO) Approvals', icon: ShoppingCart },
    { id: 'vendors', label: 'Vendor & Supplier Management', icon: Store },
    { id: 'tasks_gantt', label: 'Task Scheduling & Gantt Timeline', icon: Calendar },
    { id: 'boq_estimates', label: 'BOQ & Cost Estimates vs Actuals', icon: Calculator },
    { id: 'approvals', label: 'Expense Approval Workflow', icon: CheckSquare },
    { id: 'documents', label: 'Document Manager & Compliance NOCs', icon: FolderArchive },
    { id: 'cashbook', label: 'Site Cash Book & Petty Cash Float', icon: Coins },
    { id: 'safety_quality', label: 'Safety Checklists & Snag List', icon: ShieldCheck },
    { id: 'customer_portal', label: 'Customer & Investor Portal', icon: Globe },
    { id: 'notifications', label: 'Notifications (WhatsApp / SMS Alerts)', icon: Bell },
    { id: 'audit_backup', label: 'System Audit Log & Daily Backups', icon: Database },
  ];

  // RBAC: Filter items according to the logged-in user's role permissions
  const visibleItems = menuItems.filter(item => canAccess(item.id));

  return (
    <aside className="glass-sidebar-capsule">
      {/* Top Blue Brand Icon Button */}
      <div 
        onClick={() => setActiveTab('overview')}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
          background: '#2563EB',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
          marginBottom: '14px',
          cursor: 'pointer',
          flexShrink: 0
        }}
        title="SitePilot - Construction Management"
      >
        <Building2 size={18} />
      </div>

      {/* All Navigation Icons Visible Directly on the Line (No Scrolling Container) */}
      <nav className="sidebar-nav-list">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#2563EB' : '#64748B',
                boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                padding: 0,
                flexShrink: 0
              }}
              aria-label={item.label}
              title={item.label}
            >
              <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
            </button>
          );
        })}
      </nav>

      {/* Subtle Separator Dot */}
      <div 
        style={{ 
          width: '16px', 
          height: '1px', 
          background: 'rgba(15, 23, 42, 0.12)', 
          margin: '12px 0', 
          flexShrink: 0 
        }} 
      />

      {/* Bottom Settings Button */}
      <button
        onClick={() => setActiveTab('settings')}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          background: activeTab === 'settings' ? '#ffffff' : 'transparent',
          color: activeTab === 'settings' ? '#2563EB' : '#64748B',
          boxShadow: activeTab === 'settings' ? '0 4px 14px rgba(0, 0, 0, 0.08)' : 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0
        }}
        title="Settings, Roles, Language (Hindi) & PWA"
        aria-label="Settings"
      >
        <Settings size={18} />
      </button>
    </aside>
  );
}
