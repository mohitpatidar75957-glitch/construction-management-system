import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldAlert } from 'lucide-react';

import Dashboard from '../pages/dashboard/Dashboard';
import ProjectsList from '../pages/projects/ProjectsList';
import Invoices from '../pages/billing/Invoices';
import WorkersList from '../pages/workforce/WorkersList';
import MaterialsList from '../pages/materials/MaterialsList';
import Reports from '../pages/reports/Reports';
import EquipmentView from '../components/EquipmentView';
import DailyActivityView from '../components/modules/DailyActivityView';

// New Specialized Modules
import PurchaseOrdersView from '../components/modules/PurchaseOrdersView';
import VendorsView from '../components/modules/VendorsView';
import TaskGanttView from '../components/modules/TaskGanttView';
import BoqEstimatesView from '../components/modules/BoqEstimatesView';
import ApprovalsView from '../components/modules/ApprovalsView';
import DocumentManagerView from '../components/modules/DocumentManagerView';
import CashBookView from '../components/modules/CashBookView';
import SafetyQualityView from '../components/modules/SafetyQualityView';
import CustomerPortalView from '../components/modules/CustomerPortalView';
import NotificationsView from '../components/modules/NotificationsView';
import AuditBackupView from '../components/modules/AuditBackupView';
import SettingsRolesView from '../components/modules/SettingsRolesView';

export default function AppRoutes({ activeTab }) {
  const { user, canAccess } = useAuth();

  // Role-Based Access Guard
  if (user && !canAccess(activeTab)) {
    return (
      <div className="module-view-container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '440px' }}>
        <div className="glass-card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', background: 'rgba(255, 255, 255, 0.88)' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(220, 38, 38, 0.15)' }}>
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Access Restricted to Authorized Roles
          </h2>
          <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            Your active role <b>{user?.roleBadge || user?.role}</b> does not have permission clearance to access this module.
          </p>
          <div style={{ fontSize: '11px', color: '#475569', padding: '8px 14px', borderRadius: '10px', background: 'rgba(241, 245, 249, 0.85)', border: '1px solid rgba(203, 213, 225, 0.7)' }}>
            Role Authorization Policy enforced by Super Admin
          </div>
        </div>
      </div>
    );
  }

  switch (activeTab) {
    case 'overview':
      return <Dashboard />;
    case 'projects':
      return <ProjectsList />;
    case 'daily_activity':
      return <DailyActivityView />;
    case 'accounts':
      return <Invoices />;
    case 'labour':
      return <WorkersList />;
    case 'materials':
      return <MaterialsList />;
    case 'reports':
      return <Reports />;
    case 'equipment':
      return <EquipmentView />;
    case 'purchase_orders':
      return <PurchaseOrdersView />;
    case 'vendors':
      return <VendorsView />;
    case 'tasks_gantt':
      return <TaskGanttView />;
    case 'boq_estimates':
      return <BoqEstimatesView />;
    case 'approvals':
      return <ApprovalsView />;
    case 'documents':
      return <DocumentManagerView />;
    case 'cashbook':
      return <CashBookView />;
    case 'safety_quality':
      return <SafetyQualityView />;
    case 'customer_portal':
      return <CustomerPortalView />;
    case 'notifications':
      return <NotificationsView />;
    case 'audit_backup':
      return <AuditBackupView />;
    case 'settings':
      return <SettingsRolesView />;
    default:
      return <Dashboard />;
  }
}
