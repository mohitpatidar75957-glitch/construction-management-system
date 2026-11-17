import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  ShieldCheck, 
  Languages, 
  Smartphone, 
  Wifi, 
  CheckCircle2, 
  Building2, 
  Key, 
  UserPlus, 
  Lock, 
  Sliders, 
  Check, 
  X,
  FileCheck,
  ShieldAlert,
  ArrowLeft,
  Briefcase,
  HardHat,
  Receipt,
  Boxes,
  Calendar,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Hammer,
  KeyRound,
  Phone,
  Mail,
  UserCheck,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsRolesView() {
  const { user, usersList, addUser, updatePermissions, isSuperAdmin } = useAuth();
  const [language, setLanguage] = useState('EN');
  const [offlineSync, setOfflineSync] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Selected user for Super Admin fine-grained permissions editing
  const [editingUser, setEditingUser] = useState(null);
  const [userPermsState, setUserPermsState] = useState([]);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SUPERVISOR',
    site: 'Skyline Commercial Hub',
    phone: '',
    department: '',
    agencyName: '',
    trade: 'Civil & Shuttering Works',
    gangSize: '25 Workers'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userCreatedSuccess, setUserCreatedSuccess] = useState('');

  const allSystemModules = [
    { id: 'overview', label: 'Dashboard Overview', desc: 'KPI cards, site cashflow & recent telemetry', category: 'Executive' },
    { id: 'projects', label: 'Sites & Projects', desc: 'Master projects, locations, codes & milestones', category: 'Operations' },
    { id: 'daily_activity', label: 'Daily Site Activity (DSR)', desc: 'Engineer muster logs, concrete pours & stage milestones', category: 'Field' },
    { id: 'accounts', label: 'Accounts & Billing (RA Bills)', desc: 'Client invoices, running-account bills & GST', category: 'Finance' },
    { id: 'labour', label: 'Labour Workforce Muster', desc: 'Daily attendance rolls, trade wages & contractor agency', category: 'Field' },
    { id: 'materials', label: 'Material & Inventory Assets', desc: 'Inward deliveries, batch pricing & safety reserves', category: 'Supply' },
    { id: 'reports', label: 'Daily Progress Reports (DPR)', desc: 'Milestone work logs, supervisor sign-off & concrete pours', category: 'Field' },
    { id: 'equipment', label: 'Machinery & Equipment Fleet', desc: 'JCB, cranes, transit mixers, daily fuel & rental', category: 'Assets' },
    { id: 'purchase_orders', label: 'Purchase Orders (PO)', desc: 'Official material orders, requisitions & approvals', category: 'Commercial' },
    { id: 'vendors', label: 'Vendor & Supplier Management', desc: 'Suppliers list, GSTIN, wholesale rates & payables', category: 'Commercial' },
    { id: 'tasks_gantt', label: 'Task & Gantt Schedule', desc: 'Timeline planning, critical path & delay tracking', category: 'Planning' },
    { id: 'boq_estimates', label: 'BOQ & Estimates vs Actuals', desc: 'Bill of quantities, cost variances & rates', category: 'Commercial' },
    { id: 'approvals', label: 'Expense Approval Workflow', desc: 'Manager vouchers & owner one-click signoff', category: 'Finance' },
    { id: 'documents', label: 'Document Vault & Compliance NOCs', desc: 'Drawings, municipal approvals & expiry alerts', category: 'Legal' },
    { id: 'cashbook', label: 'Site Cash Book & Petty Cash', desc: 'On-site petty float, emergency bills & slips', category: 'Finance' },
    { id: 'safety_quality', label: 'Safety & Snag Lists', desc: 'OSHA audit checklists, site hazards & finishing defects', category: 'Safety' },
    { id: 'customer_portal', label: 'Customer / Investor Portal', desc: 'Buyer unit progress, photo feed & demand letters', category: 'Client' },
    { id: 'notifications', label: 'WhatsApp / SMS Alert Dispatch', desc: 'Payment due reminders, delay pings & alerts', category: 'System' },
    { id: 'audit_backup', label: 'Audit Trail & Daily Backups', desc: 'Immutable activity logs & automated recovery', category: 'Admin' }
  ];

  const rolesList = [
    { 
      id: 'SUPER_ADMIN', 
      title: 'Super Admin / Director', 
      badge: '👑 Super Admin',
      desc: 'Complete portfolio oversight, billing approvals, financial P&L, system audit logs, and global user management.',
      scope: 'All 19 Modules (Admin + Write + Approve)' 
    },
    { 
      id: 'MANAGER', 
      title: 'Project Manager (PM)', 
      badge: '🏗️ Project Manager',
      desc: 'Site scheduling, Gantt milestones, material requisitions, contractor bills submission & daily progress.',
      scope: 'Sites, Gantt, Materials, Equipment, DPR, PO, Safety' 
    },
    { 
      id: 'SUPERVISOR', 
      title: 'Site Supervisor / Incharge', 
      badge: '👷 Site Supervisor',
      desc: 'Worker muster attendance, material inward deliveries, daily DPR logs, equipment hours & safety checklists.',
      scope: 'Attendance, DPR Logs, Site Stock Inward, Safety' 
    },
    { 
      id: 'CONTRACTOR', 
      title: 'Subcontractor / Labour Contractor', 
      badge: '🔨 Subcontractor',
      desc: 'Labour muster roll attendance, gang wage statements, work task milestones & contractor bills.',
      scope: 'Labour Muster, Work Tasks, Site Docs' 
    },
    { 
      id: 'ACCOUNTANT', 
      title: 'Accounts & Billing Officer', 
      badge: '💼 Accounts & Billing',
      desc: 'GST tax invoices, contractor voucher payouts, cash book floats, vendor ledger reconciliation & RA bills.',
      scope: 'Accounts, RA Bills, Cash Book, PO, Vendors' 
    },
    { 
      id: 'STOREKEEPER', 
      title: 'Store & Material Incharge', 
      badge: '📦 Store Incharge',
      desc: 'Warehouse stock balances, cement/steel inward inspection, minimum safety reserves & plant machinery logs.',
      scope: 'Materials, Equipment, Stock Thresholds, Vendors' 
    },
    { 
      id: 'CLIENT', 
      title: 'Client / Investor', 
      badge: '🏛️ Client Portal',
      desc: 'External visibility into construction milestones, work completion % and payment demand notices.',
      scope: 'Customer Portal, Milestone Photos, Demand Letters' 
    }
  ];

  // Open Permissions Configuration for a specific user
  const handleOpenPermsModal = (targetUser) => {
    setEditingUser(targetUser);
    setUserPermsState(targetUser.customPermissions || []);
  };

  const handleToggleModulePerm = (moduleId) => {
    setUserPermsState(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(m => m !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  const handleSelectAllPerms = () => {
    setUserPermsState(allSystemModules.map(m => m.id));
  };

  const handleSelectFieldOnly = () => {
    setUserPermsState(['overview', 'labour', 'reports', 'materials', 'equipment', 'safety_quality', 'documents', 'notifications', 'settings']);
  };

  const handleSelectFinanceOnly = () => {
    setUserPermsState(['overview', 'accounts', 'purchase_orders', 'vendors', 'approvals', 'cashbook', 'boq_estimates', 'documents', 'notifications', 'settings']);
  };

  const handleClearAllPerms = () => {
    setUserPermsState(['overview', 'settings']);
  };

  const handleSaveUserPermissions = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updatePermissions(editingUser.id, userPermsState);
    setSavedSuccessMsg(`Permissions updated successfully for ${editingUser.name}!`);
    setTimeout(() => {
      setSavedSuccessMsg('');
      setEditingUser(null);
    }, 1200);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const matchedRole = rolesList.find(r => r.id === newUserForm.role);
    const assignedPassword = newUserForm.password || 'Site@2026';
    
    addUser({
      ...newUserForm,
      roleTitle: matchedRole?.title || newUserForm.role,
      roleBadge: matchedRole?.badge || newUserForm.role,
      password: assignedPassword
    });

    setUserCreatedSuccess(`Account issued for ${newUserForm.name} (${matchedRole?.badge || newUserForm.role})!`);
    
    setTimeout(() => {
      setUserCreatedSuccess('');
      setShowAddUserModal(false);
      setNewUserForm({
        name: '',
        email: '',
        password: '',
        role: 'SUPERVISOR',
        site: 'Skyline Commercial Hub',
        phone: '',
        department: '',
        agencyName: '',
        trade: 'Civil & Shuttering Works',
        gangSize: '25 Workers'
      });
    }, 1200);
  };

  // =========================================================================
  // 1. FULL-SCREEN / WIDESCREEN CONFIGURE ACCESS PAGE
  // =========================================================================
  if (editingUser) {
    const percentGranted = Math.round((userPermsState.length / allSystemModules.length) * 100);

    return (
      <div className="module-view-container animate-fade-in" style={{ width: '100%' }}>
        {/* Top Header Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              type="button"
              onClick={() => setEditingUser(null)}
              className="glass-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Settings</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Configure Access Permissions for {editingUser.name}
              </h1>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setEditingUser(null)}
            className="glass-pill"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#64748B',
              background: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              cursor: 'pointer'
            }}
          >
            Cancel & Exit
          </button>
        </div>

        {savedSuccessMsg && (
          <div style={{ 
            padding: '12px 18px', 
            borderRadius: '14px', 
            background: '#D1FAE5', 
            color: '#059669', 
            fontSize: '13px', 
            fontWeight: 700, 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)'
          }}>
            <CheckCircle2 size={18} />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* 2-Column Full Screen Form & Real-time Live Clearance Card */}
        <form onSubmit={handleSaveUserPermissions} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          {/* Left Column: All 18 Modules with Checkboxes & Quick Presets */}
          <div className="glass-card" style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Select Module Clearances
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Check the modules {editingUser.name.split(' ')[0]} is allowed to view and operate
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={handleSelectAllPerms}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    background: 'rgba(37, 99, 235, 0.08)',
                    color: '#2563EB',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Grant All (18)
                </button>
                <button 
                  type="button" 
                  onClick={handleSelectFieldOnly}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(217, 119, 6, 0.3)',
                    background: 'rgba(217, 119, 6, 0.08)',
                    color: '#D97706',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Field Only
                </button>
                <button 
                  type="button" 
                  onClick={handleSelectFinanceOnly}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    background: 'rgba(5, 150, 105, 0.08)',
                    color: '#059669',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Finance Only
                </button>
                <button 
                  type="button" 
                  onClick={handleClearAllPerms}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: '#ffffff',
                    color: '#64748B',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* 18-Module Interactive Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {allSystemModules.map(mod => {
                const isChecked = userPermsState.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    onClick={() => handleToggleModulePerm(mod.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: isChecked ? 'rgba(37, 99, 235, 0.06)' : 'rgba(255, 255, 255, 0.8)',
                      border: isChecked ? '1.5px solid #2563EB' : '1px solid rgba(226, 232, 240, 0.8)',
                      boxShadow: isChecked ? '0 4px 12px rgba(37, 99, 235, 0.08)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {}} // handled by parent div
                      style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px', accentColor: '#2563EB' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 800, color: isChecked ? '#0F172A' : '#64748B' }}>
                          {mod.label}
                        </span>
                        <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: 'rgba(241, 245, 249, 0.8)', color: '#64748B' }}>
                          {mod.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.3 }}>
                        {mod.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live User Identity Card & Access Meter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: '#0F172A',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 18px rgba(15, 23, 42, 0.2)'
                }}>
                  {editingUser.avatar || 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A' }}>
                    {editingUser.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <span className="glass-pill" style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}>
                      {editingUser.roleBadge || editingUser.role}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                      {editingUser.site}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Meter */}
              <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>CLEARANCE LEVEL</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#2563EB' }}>
                    {userPermsState.length} / {allSystemModules.length} Modules ({percentGranted}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '9999px', background: '#E2E8F0', overflow: 'hidden' }}>
                  <div style={{
                    width: `${percentGranted}%`,
                    height: '100%',
                    borderRadius: '9999px',
                    background: 'linear-gradient(90deg, #2563EB, #60A5FA)',
                    transition: 'width 0.25s ease'
                  }} />
                </div>
              </div>

              {/* Security Footnote */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: '#64748B', lineHeight: 1.4 }}>
                <ShieldCheck size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  Admin will enforce this access policy. Unchecked modules will be hidden from {editingUser.name.split(' ')[0]}'s sidebar immediately upon saving.
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  className="btn-solid-dark"
                  style={{
                    width: '100%',
                    padding: '13px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <FileCheck size={16} />
                  <span>Save & Apply Access Permissions</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="glass-pill"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748B',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  Cancel & Return
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // 2. FULL-SCREEN / WIDESCREEN ADD STAFF & SUBCONTRACTOR PAGE
  // =========================================================================
  if (showAddUserModal) {
    const isContractor = newUserForm.role === 'CONTRACTOR';

    return (
      <div className="module-view-container animate-fade-in" style={{ width: '100%' }}>
        {/* Top Header Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              type="button"
              onClick={() => setShowAddUserModal(false)}
              className="glass-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Settings</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                {isContractor 
                  ? 'Register Subcontractor / Contractor Account' 
                  : 'Add Authorized Staff Member'}
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                Create corporate credentials, set initial login password, and assign site role clearance
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setShowAddUserModal(false)}
            className="glass-pill"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#64748B',
              background: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              cursor: 'pointer'
            }}
          >
            Cancel & Exit
          </button>
        </div>

        {userCreatedSuccess && (
          <div style={{ 
            padding: '14px 20px', 
            borderRadius: '14px', 
            background: '#D1FAE5', 
            color: '#059669', 
            fontSize: '13.5px', 
            fontWeight: 700, 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)'
          }}>
            <CheckCircle2 size={20} />
            <span>{userCreatedSuccess}</span>
          </div>
        )}

        {/* Full-Width Widescreen Form Container (Compact 2-Column Grid, Zero Vertical Scrolling) */}
        <form onSubmit={handleCreateUser} className="glass-card" style={{ width: '100%', padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="#2563EB" />
                <span>Account Credentials & Role Profile</span>
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Enter personnel profile details, initial login password and site workplace assignment
              </span>
            </div>
            <span className="glass-pill" style={{ padding: '3px 12px', fontSize: '11px', fontWeight: 700 }}>
              {isContractor ? '🔨 Subcontractor Account' : '👤 Staff Account'}
            </span>
          </div>

          {/* 2-Column Balanced Grid across Wide Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {/* Row 1: Full Name & Corporate Email */}
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', letterSpacing: '0.02em' }}>
                FULL NAME
              </label>
              <input 
                type="text" 
                required 
                placeholder="Devendra Yadav"
                value={newUserForm.name} 
                onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', letterSpacing: '0.02em' }}>
                CORPORATE / LOGIN EMAIL
              </label>
              <input 
                type="email" 
                required 
                placeholder={isContractor ? "contractor@sitepilot.in" : "staff@sitepilot.in"}
                value={newUserForm.email} 
                onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {/* Row 2: Initial Password & Contact Mobile */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.02em' }}>
                  INITIAL LOGIN PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => setNewUserForm({ ...newUserForm, password: 'Site#' + Math.floor(1000 + Math.random() * 9000) })}
                  style={{ border: 'none', background: 'transparent', color: '#2563EB', fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Generate Strong
                </button>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  placeholder="Create login password"
                  value={newUserForm.password} 
                  onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 42px 10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(203, 213, 225, 0.85)',
                    background: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', letterSpacing: '0.02em' }}>
                CONTACT MOBILE NUMBER
              </label>
              <input 
                type="text" 
                placeholder="+91 98260 77889"
                value={newUserForm.phone} 
                onChange={e => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {/* Row 3: Assigned Role & Assigned Construction Site */}
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', letterSpacing: '0.02em' }}>
                ASSIGNED ROLE
              </label>
              <select 
                value={newUserForm.role} 
                onChange={e => {
                  const r = e.target.value;
                  setNewUserForm({ 
                    ...newUserForm, 
                    role: r,
                    agencyName: r === 'CONTRACTOR' ? (newUserForm.agencyName || 'Devendra Labour & Shuttering Agency') : newUserForm.agencyName
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(37, 99, 235, 0.4)',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#2563EB',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="SUPERVISOR">👷 Site Supervisor</option>
                <option value="CONTRACTOR">🔨 Subcontractor / Labour Contractor</option>
                <option value="MANAGER">🏗️ Project Manager (PM)</option>
                <option value="ACCOUNTANT">💼 Accounts & Billing Officer</option>
                <option value="STOREKEEPER">📦 Store & Material Incharge</option>
                <option value="SUPER_ADMIN">👑 Super Admin / Director</option>
                <option value="CLIENT">🏛️ Client / Investor Representative</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', letterSpacing: '0.02em' }}>
                ASSIGNED CONSTRUCTION SITE
              </label>
              <select 
                value={newUserForm.site} 
                onChange={e => setNewUserForm({ ...newUserForm, site: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Skyline Commercial Hub">Skyline Commercial Hub (Indore)</option>
                <option value="Grand Horizon Enclave">Grand Horizon Enclave (Bhopal)</option>
                <option value="Apex Corporate Park">Apex Corporate Park (Ujjain)</option>
                <option value="All Sites (Headquarters)">All Sites (Headquarters / Executive)</option>
              </select>
            </div>

            {/* Row 4: Department / Division */}
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', letterSpacing: '0.02em' }}>
                DEPARTMENT / DIVISION
              </label>
              <input 
                type="text" 
                placeholder={isContractor ? "Labour & Subcontracting Wing" : "Field Operations & Engineering"}
                value={newUserForm.department} 
                onChange={e => setNewUserForm({ ...newUserForm, department: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', letterSpacing: '0.02em' }}>
                AUTHORIZATION CLEARANCE
              </label>
              <div style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(241, 245, 249, 0.8)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>{rolesList.find(r => r.id === newUserForm.role)?.scope || 'Site Operations'}</span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#10B981' }}>✓ Granular RBAC</span>
              </div>
            </div>
          </div>

          {/* Subcontractor Special Fields (when CONTRACTOR is selected) */}
          {isContractor && (
            <div style={{
              padding: '18px 22px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.06), rgba(245, 158, 11, 0.04))',
              border: '1.5px solid rgba(217, 119, 6, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hammer size={16} color="#D97706" />
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#92400E' }}>
                  Subcontractor Agency Details
                </h4>
                <span style={{ fontSize: '11.5px', color: '#B45309' }}>
                  • Agency and trade assignment for site labour gang
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', display: 'block', marginBottom: '5px' }}>
                    AGENCY / FIRM NAME
                  </label>
                  <input 
                    type="text" 
                    placeholder="Devendra Labour & Shuttering Agency"
                    value={newUserForm.agencyName} 
                    onChange={e => setNewUserForm({ ...newUserForm, agencyName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(217, 119, 6, 0.35)',
                      background: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', display: 'block', marginBottom: '5px' }}>
                    TRADE SPECIALIZATION
                  </label>
                  <select 
                    value={newUserForm.trade} 
                    onChange={e => setNewUserForm({ ...newUserForm, trade: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(217, 119, 6, 0.35)',
                      background: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#92400E',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Civil & Shuttering Works">Civil & Shuttering Works</option>
                    <option value="Steel & Rebar Bending">Steel & Rebar Bending</option>
                    <option value="Masonry, Brickwork & Plaster">Masonry, Brickwork & Plaster</option>
                    <option value="Tile, Granite & Flooring">Tile, Granite & Flooring</option>
                    <option value="Electrical & Conduit Piping">Electrical & Conduit Piping</option>
                    <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                    <option value="Painting, Putty & Finishing">Painting, Putty & Finishing</option>
                    <option value="Fabrication & Steel Structure">Fabrication & Steel Structure</option>
                    <option value="Excavation & Earthwork">Excavation & Earthwork</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', display: 'block', marginBottom: '5px' }}>
                    LABOUR GANG CAPACITY
                  </label>
                  <input 
                    type="text" 
                    placeholder="25 Workers (Mistri + Beldar + Mazdoor)"
                    value={newUserForm.gangSize} 
                    onChange={e => setNewUserForm({ ...newUserForm, gangSize: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(217, 119, 6, 0.35)',
                      background: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', display: 'block', marginBottom: '5px' }}>
                    CONTRACTOR GSTIN / PAN (OPTIONAL)
                  </label>
                  <input 
                    type="text" 
                    placeholder="23AAACD1234F1Z5"
                    value={newUserForm.gstin || ''} 
                    onChange={e => setNewUserForm({ ...newUserForm, gstin: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(217, 119, 6, 0.35)',
                      background: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '14px', marginTop: '6px', paddingTop: '16px', borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <button 
              type="button"
              onClick={() => setShowAddUserModal(false)}
              className="glass-pill"
              style={{
                padding: '11px 24px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-solid-dark"
              style={{
                padding: '11px 28px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <UserPlus size={16} />
              <span>
                {isContractor 
                  ? 'Register Subcontractor Account' 
                  : 'Issue Account Credentials'}
              </span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // 3. MAIN SETTINGS & ROLE DIRECTORY VIEW
  // =========================================================================
  return (
    <div className="module-view-container animate-fade-in">
      {/* Header Row */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">System Settings, Users <span className="amp">&</span> Role Permissions</h2>
          <p className="module-subtitle">Super Admin control center to manage staff access clearance, assign module permissions <span className="amp">&</span> field sync</p>
        </div>
        <button 
          onClick={() => setShowAddUserModal(true)}
          className="btn-dubai-gold"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={16} />
          <span>+ Add Staff User</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Active Staff Users</span><span className="fin-icon-pill icon-gold"><Users size={18} /></span></div>
          <div className="fin-val">{usersList.length} Active Personnel</div>
          <div className="fin-sub">Controlled by Super Admin</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Your Active Session</span><span className="fin-icon-pill icon-cyan"><ShieldCheck size={18} /></span></div>
          <div className="fin-val text-cyan">{user?.roleBadge || '👑 Super Admin'}</div>
          <div className="fin-sub">{user?.name} ({user?.email})</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Language Mode</span><span className="fin-icon-pill icon-green"><Languages size={18} /></span></div>
          <div className="fin-val text-green">{language === 'EN' ? 'English (UK/IN)' : 'हिंदी (Hindi)'}</div>
          <div className="fin-sub">Supervisor Hindi UI toggled</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Offline Field Sync</span><span className="fin-icon-pill icon-amber"><Wifi size={18} /></span></div>
          <div className="fin-val text-amber">{offlineSync ? 'Auto-Sync On' : 'Sync Paused'}</div>
          <div className="fin-sub">IndexedDB Local Buffer for 4G dropouts</div>
        </div>
      </div>

      {/* Staff Users Directory with Admin Permissions Control */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Users size={18} className="gold-text" />
            <div>
              <h3 style={{ margin: 0 }}>Authorized Personnel & Access Control</h3>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Admin ke hath me control: Click "Configure Access" to customize exactly which modules each user can open
              </span>
            </div>
          </div>
          <span className="glass-pill" style={{ padding: '3px 12px', fontSize: '11px', fontWeight: 700 }}>
            {usersList.length} Personnel
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Personnel Name</th>
                <th>Role Identity</th>
                <th>Assigned Site</th>
                <th>Module Clearance Scope</th>
                <th>Access Control (Admin)</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => {
                const grantedCount = (u.customPermissions || []).length;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#0F172A',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '11.5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {u.avatar || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>{u.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="glass-pill" style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 800 }}>
                        {u.roleBadge || u.role}
                      </span>
                    </td>
                    <td style={{ color: '#475569', fontWeight: 600, fontSize: '12px' }}>
                      {u.site || 'Site Assigned'}
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: grantedCount >= 15 ? 'rgba(37, 99, 235, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                        color: grantedCount >= 15 ? '#2563EB' : '#059669',
                        border: '1px solid rgba(203, 213, 225, 0.7)'
                      }}>
                        {grantedCount} / {allSystemModules.length} Modules Granted
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleOpenPermsModal(u)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '10px',
                          border: '1px solid rgba(37, 99, 235, 0.3)',
                          background: 'rgba(37, 99, 235, 0.08)',
                          color: '#2563EB',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Sliders size={13} />
                        <span>Configure Access</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix Guide */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Key size={18} className="gold-text" />
            <h3>Default Construction Role Clearances</h3>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Role Level</th>
                <th>Role Description</th>
                <th>Standard Module Scope</th>
                <th>Authorization Type</th>
              </tr>
            </thead>
            <tbody>
              {rolesList.map(r => (
                <tr key={r.id}>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '12.5px', color: '#0F172A' }}>{r.badge}</span>
                  </td>
                  <td style={{ color: '#475569', fontSize: '12px', maxWidth: '300px', lineHeight: 1.4 }}>
                    {r.desc}
                  </td>
                  <td>
                    <span className="trade-pill">{r.scope}</span>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      color: r.id === 'SUPER_ADMIN' ? '#2563EB' : r.id === 'CLIENT' ? '#DB2777' : '#059669' 
                    }}>
                      {r.id === 'SUPER_ADMIN' ? '👑 FULL SYSTEM ADMIN' : r.id === 'CLIENT' ? '👁️ CLIENT VIEW ONLY' : '✓ ROLE RESTRICTED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Language & Field Device Preferences */}
      <div className="dubai-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          Language & Field Device Preferences
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Language Switcher */}
          <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>APPLICATION LANGUAGE (भाषा)</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setLanguage('EN')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  border: language === 'EN' ? '1px solid #2563EB' : '1px solid rgba(203, 213, 225, 0.8)',
                  background: language === 'EN' ? '#0F172A' : '#ffffff',
                  color: language === 'EN' ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                English (Default)
              </button>
              <button 
                onClick={() => setLanguage('HI')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  border: language === 'HI' ? '1px solid #2563EB' : '1px solid rgba(203, 213, 225, 0.8)',
                  background: language === 'HI' ? '#2563EB' : '#ffffff',
                  color: language === 'HI' ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                हिंदी (Hindi for Site Incharges)
              </button>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              {language === 'HI' ? 'साइट सुपरवाइजर के लिए हिंदी लेआउट सक्रिय है।' : 'Standard executive English terminology active.'}
            </span>
          </div>

          {/* Offline Sync Mode */}
          <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>OFFLINE FIELD CACHE & PWA SYNC</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Save Offline on Low Network
              </span>
              <button 
                onClick={() => setOfflineSync(!offlineSync)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: offlineSync ? '#10B981' : '#94A3B8',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {offlineSync ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Workers muster roll & material delivery receipts are stored on IndexedDB and auto-synced upon reconnection.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
