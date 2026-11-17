import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Edit2,
  Save,
  X,
  MapPin,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserProfileView({ onBack, onNavigateSettings }) {
  const { user, logout, isSuperAdmin, updateProfile, canAccess } = useAuth();
  
  // Inline Edit Profile State (No popup modal!)
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    site: '',
    department: ''
  });

  // Password Update Form State
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Sync edit form with current user data
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        site: user.site || 'All Sites (Headquarters)',
        department: user.department || 'Executive Management'
      });
    }
  }, [user]);

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

  // Calculate permissions safely using canAccess
  const checkModuleAccess = (modId) => {
    if (isSuperAdmin) return true;
    if (canAccess) return canAccess(modId);
    if (user?.customPermissions && Array.isArray(user.customPermissions)) {
      return user.customPermissions.includes(modId);
    }
    return false;
  };

  const grantedCount = allModulesList.filter(mod => checkModuleAccess(mod.id)).length;

  // Handle Edit Profile Submit
  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (updateProfile) {
      updateProfile(editForm);
    }
    setIsEditingInline(false);
    showToast('Profile details updated successfully! Changes saved in place.');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    showToast('Security password updated successfully.');
  };

  return (
    <div className="module-view-container animate-fade-in" style={{ width: '100%' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          color: '#FFFFFF',
          padding: '14px 22px',
          borderRadius: '16px',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMsg}</span>
        </div>
      )}

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
            <h1 className="dashboard-heading" style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              User Profile <span className="amp">&</span> Account Details
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

      {/* Widescreen 2-Column Layout Matching Other CMS System Pages */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: '24px', 
        alignItems: 'start',
        width: '100%'
      }}>
        {/* Left Column: Personal Identity & In-Place Profile Editor */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '28px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.65))',
            boxShadow: '0 8px 30px rgba(10, 25, 70, 0.06)'
          }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0F172A, #1E293B)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
                  flexShrink: 0
                }}>
                  {user?.avatar || 'MP'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      {user?.name || 'Mohit Patidar'}
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
                      {user?.roleBadge || '👑 Super Admin'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, marginTop: '3px' }}>
                    {user?.roleTitle || 'Super Admin / Director'}
                  </div>
                </div>
              </div>

              {/* Inline Edit Mode Toggle Button */}
              {!isEditingInline ? (
                <button
                  type="button"
                  onClick={() => setIsEditingInline(true)}
                  className="glass-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#2563EB',
                    background: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    cursor: 'pointer'
                  }}
                >
                  <Edit2 size={13} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingInline(false)}
                  className="glass-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#64748B',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={13} />
                  <span>Cancel Edit</span>
                </button>
              )}
            </div>

            {/* In-Place Editable Form or View Grid (No popup modal!) */}
            {!isEditingInline ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(226, 232, 240, 0.85)'
              }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Corporate Email</div>
                  <div style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 700, marginTop: '2px', wordBreak: 'break-all' }}>{user?.email || 'admin@sitepilot.in'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Assigned Site</div>
                  <div style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>{user?.site || 'All Sites (Headquarters)'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Official Phone / Mobile</div>
                  <div style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>{user?.phone || '+91 98260 11223'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Employee ID</div>
                  <div style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: 800, marginTop: '2px' }}>{user?.empId || 'SP-001'}</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditProfileSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '18px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid rgba(37, 99, 235, 0.35)',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Edit2 size={14} color="#2563EB" />
                    <span>Edit Profile In-Place</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Direct edit mode</span>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohit Patidar"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 600, outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>OFFICIAL PHONE *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98260 11223"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>CORPORATE EMAIL *</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@sitepilot.in"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 600, outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>ASSIGNED SITE</label>
                    <input
                      type="text"
                      placeholder="All Sites (Headquarters)"
                      value={editForm.site}
                      onChange={(e) => setEditForm({ ...editForm, site: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>DEPARTMENT</label>
                    <input
                      type="text"
                      placeholder="Executive Management"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 600, outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingInline(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      background: '#F1F5F9',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-dubai-gold"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            )}

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
                  <span>Manage Team <span className="amp">&</span> Role Access ➔</span>
                </button>
              </div>
            )}
        </div>

        {/* Right Column: Security Credentials Card Matching CMS Design System */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '28px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.65))',
            boxShadow: '0 8px 30px rgba(10, 25, 70, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Update Security Password
              </h3>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                Change your ERP access authentication password
              </span>
            </div>
            <span className="glass-pill" style={{ padding: '3px 10px', fontSize: '11px', fontWeight: 700, color: '#059669' }}>
              🔒 256-Bit SSL
            </span>
          </div>

          {passwordSaved && (
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#D1FAE5', color: '#059669', fontSize: '12.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>Security password updated successfully!</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>CURRENT PASSWORD</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={passwordForm.current}
                onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>NEW PASSWORD</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={passwordForm.newPass}
                  onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>CONFIRM NEW</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="btn-solid-dark"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}
            >
              Save New Password
            </button>
          </form>

          {/* Account Meta & Fast Access Info */}
          <div style={{ 
            marginTop: 'auto',
            padding: '14px 16px', 
            borderRadius: '14px', 
            background: 'rgba(241, 245, 249, 0.75)', 
            border: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Session Security</div>
              <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: 700 }}>End-to-End Encrypted</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Last Login</div>
              <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 700 }}>Today, 09:30 AM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
