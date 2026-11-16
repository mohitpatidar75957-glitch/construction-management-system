import React, { useState } from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Key, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Smartphone,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserProfileView({ onBack, onNavigateSettings }) {
  const { user, logout, isSuperAdmin } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordSaved, setPasswordSaved] = useState(false);

  const allModulesList = [
    { id: 'overview', label: 'Dashboard Overview', category: 'Executive' },
    { id: 'projects', label: 'Sites & Projects Master', category: 'Operations' },
    { id: 'accounts', label: 'Accounts & Billing (RA Bills)', category: 'Finance' },
    { id: 'labour', label: 'Labour Workforce & Daily Muster', category: 'Field' },
    { id: 'materials', label: 'Material & Inventory Assets', category: 'Supply' },
    { id: 'reports', label: 'Daily Progress Reports (DPR)', category: 'Field' },
    { id: 'equipment', label: 'Machinery & Equipment Fleet', category: 'Assets' },
    { id: 'purchase_orders', label: 'Purchase Orders (PO) Approvals', category: 'Commercial' },
    { id: 'vendors', label: 'Vendor & Supplier Management', category: 'Commercial' },
    { id: 'tasks_gantt', label: 'Task Gantt Timeline & Delays', category: 'Planning' },
    { id: 'boq_estimates', label: 'BOQ & Cost Estimates vs Actuals', category: 'Commercial' },
    { id: 'approvals', label: 'Expense Approval Workflow', category: 'Finance' },
    { id: 'documents', label: 'Document Vault & Compliance NOCs', category: 'Legal' },
    { id: 'cashbook', label: 'Site Petty Cash & Slip Book', category: 'Finance' },
    { id: 'safety_quality', label: 'Safety Inspections & Snag Lists', category: 'Safety' },
    { id: 'customer_portal', label: 'Customer & Investor Portal', category: 'Client' },
    { id: 'notifications', label: 'WhatsApp / SMS Alert Dispatch', category: 'System' },
    { id: 'audit_backup', label: 'Audit Trail & Immutable Backups', category: 'Admin' }
  ];

  const userPerms = user?.customPermissions || [];

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
    setPasswordForm({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="module-view-container animate-fade-in" style={{ width: '100%' }}>
      {/* Top Glass Navigation Bar */}
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
            onClick={onBack}
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
            <span>Back to Dashboard</span>
          </button>

          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              User Profile & Security Clearance
            </h1>
          </div>
        </div>

        <button 
          type="button"
          onClick={logout}
          style={{
            padding: '9px 18px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#DC2626',
            background: '#FEE2E2',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)'
          }}
        >
          <LogOut size={15} />
          <span>Sign Out / Lock Session</span>
        </button>
      </div>

      {/* 2-Column Full Screen Profile Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: '24px', 
        alignItems: 'start' 
      }}>
        {/* Left Column: Personal Identity & Security Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Identity Card */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '30px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: '#0F172A',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)'
              }}>
                {user?.avatar || 'MP'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    {user?.name}
                  </h2>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    background: 'rgba(37, 99, 235, 0.12)',
                    color: '#2563EB',
                    border: '1px solid rgba(37, 99, 235, 0.25)'
                  }}>
                    {user?.roleBadge}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, marginTop: '3px' }}>
                  {user?.roleTitle}
                </div>
              </div>
            </div>

            {/* User Meta Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px',
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
              <div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Corporate Email</div>
                <div style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>{user?.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Site</div>
                <div style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>{user?.site || 'Central HQ'}</div>
              </div>
              <div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Official Phone</div>
                <div style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>{user?.phone || '+91 98260 00000'}</div>
              </div>
              <div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Employee ID</div>
                <div style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: 800, marginTop: '2px' }}>{user?.empId || 'SP-001'}</div>
              </div>
            </div>

            {/* Super Admin Control Notice */}
            {isSuperAdmin && (
              <div style={{
                padding: '16px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(96, 165, 250, 0.12))',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#2563EB" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Master Administrator Access</span>
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                  Aapke paas sabhi project managers, supervisors aur accountants ki access permissions manage karne ka poora control hai.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onBack();
                    if (onNavigateSettings) onNavigateSettings();
                  }}
                  className="btn-solid-dark"
                  style={{
                    padding: '8px 14px',
                    fontSize: '11.5px',
                    borderRadius: '10px',
                    marginTop: '4px',
                    alignSelf: 'flex-start',
                    cursor: 'pointer'
                  }}
                >
                  Manage Team & Role Access ➔
                </button>
              </div>
            )}
          </div>

          {/* Security Credentials Card */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Update Security Password
            </h3>

            {passwordSaved && (
              <div style={{ padding: '8px 12px', borderRadius: '10px', background: '#D1FAE5', color: '#059669', fontSize: '12px', fontWeight: 700 }}>
                ✓ Password updated successfully.
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>CURRENT PASSWORD</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>NEW PASSWORD</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    value={passwordForm.newPass}
                    onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>CONFIRM NEW</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    value={passwordForm.confirm}
                    onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="btn-solid-dark"
                style={{ padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, marginTop: '4px', cursor: 'pointer' }}
              >
                Save New Password
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Active Module Clearances & RBAC Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Active Module Clearances & Permissions
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Modules currently unlocked for your user account
                </span>
              </div>
              <span className="glass-pill" style={{ padding: '4px 12px', fontSize: '11.5px', fontWeight: 800, color: '#2563EB' }}>
                {userPerms.length} / {allModulesList.length} Modules Granted
              </span>
            </div>

            {/* Clearances Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {allModulesList.map(mod => {
                const isAllowed = userPerms.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: isAllowed ? 'rgba(255, 255, 255, 0.85)' : 'rgba(241, 245, 249, 0.5)',
                      border: isAllowed ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(226, 232, 240, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: isAllowed ? 1 : 0.65
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: isAllowed ? '#0F172A' : '#94A3B8' }}>
                        {mod.label}
                      </div>
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>
                        {mod.category} Division
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {isAllowed ? (
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} color="#059669" />
                          <span>Granted</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Lock size={12} color="#94A3B8" />
                          <span>Restricted</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

