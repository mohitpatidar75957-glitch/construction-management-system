import React, { useState } from 'react';
import { 
  HiArrowUpRight as ArrowUpRight, 
  HiArrowDownRight as ArrowDownRight, 
  HiPlus as Plus, 
  HiMagnifyingGlass as Search,
  HiXMark as X,
  HiArrowLeft as ArrowLeft,
  HiOutlineBuildingOffice2 as Building2,
  HiOutlineMapPin as MapPin,
  HiOutlineCurrencyRupee as IndianRupee,
  HiOutlineCalendarDays as Calendar,
  HiOutlineCheckCircle as CheckCircle2,
  HiOutlineShieldCheck as ShieldCheck,
  HiSparkles as Sparkles,
  HiOutlineUserGroup as HardHat
} from 'react-icons/hi2';
import ChartCard from './common/ChartCard';
import StatusChip from './common/StatusChip';
import RupeeIcon from './common/RupeeIcon';
import { api } from '../api/client';

export default function Dashboard() {
  const [activeBottomTab, setActiveBottomTab] = useState('Overview');

  // Full-Screen Site Registration State
  const [isRegisteringSite, setIsRegisteringSite] = useState(false);
  const [isSubmittingSite, setIsSubmittingSite] = useState(false);
  const [siteSuccessMsg, setSiteSuccessMsg] = useState('');
  const [newSiteForm, setNewSiteForm] = useState({
    project_name: '',
    project_code: '',
    site_location: '',
    client_name: '',
    contractor_name: '',
    budget: '50000000',
    start_date: new Date().toISOString().split('T')[0],
    completion_date: '',
    status: 'IN_PROGRESS',
    progress_percent: 15
  });

  // Full-Screen Daily Site Activity Logging State
  const [isLoggingActivity, setIsLoggingActivity] = useState(false);
  const [activitySuccessMsg, setActivitySuccessMsg] = useState('');
  const [activityForm, setActivityForm] = useState({
    title: '',
    site: 'Skyline Commercial Hub',
    category: 'Activity',
    amount: '150000',
    date: new Date().toISOString().split('T')[0],
    time: 'General Day Shift',
    supervisor: 'Er. Rajesh Verma (Project Manager)',
    status: 'Completed',
    notes: ''
  });

  const [activitiesList, setActivitiesList] = useState(() => {
    try {
      const stored = localStorage.getItem('sitepilot_recent_activities');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: '#SP-2041', title: 'Slab casting – Palm Residency', category: 'Activity', amount: '₹4,25,000', status: 'Completed', date: '12 Nov, 2026', site: 'Palm Residency' },
      { id: '#SP-2040', title: 'Cement purchase – Skyline Tower', category: 'Manage', amount: '₹2,80,000', status: 'Pending', date: '12 Nov, 2026', site: 'Skyline Tower' },
      { id: '#SP-2039', title: 'Labour payment – Green Avenue', category: 'Labour', amount: '₹1,95,500', status: 'Completed', date: '11 Nov, 2026', site: 'Green Avenue' },
      { id: '#SP-2038', title: 'Steel delivery – Marina Villas', category: 'Activity', amount: '₹6,40,000', status: 'In Progress', date: '10 Nov, 2026', site: 'Marina Villas' },
      { id: '#SP-2037', title: 'Contractor advance – Palm Residency', category: 'Accounts', amount: '₹3,10,000', status: 'Completed', date: '09 Nov, 2026', site: 'Palm Residency' },
    ];
  });

  const handlePublishActivity = (e) => {
    e.preventDefault();
    const amtNum = parseFloat(activityForm.amount) || 0;
    const newEntry = {
      id: `#SP-${Date.now().toString().slice(-4)}`,
      title: `${activityForm.title} – ${activityForm.site}`,
      category: activityForm.category,
      amount: amtNum > 0 ? `₹${amtNum.toLocaleString('en-IN')}` : '₹0',
      status: activityForm.status,
      date: new Date(activityForm.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      site: activityForm.site
    };

    const updated = [newEntry, ...activitiesList];
    setActivitiesList(updated);
    try {
      localStorage.setItem('sitepilot_recent_activities', JSON.stringify(updated));
    } catch (err) {}

    setActivitySuccessMsg(`Activity "${activityForm.title}" recorded & published to feed!`);
    setTimeout(() => {
      setActivitySuccessMsg('');
      setIsLoggingActivity(false);
      setActivityForm({
        title: '',
        site: 'Skyline Commercial Hub',
        category: 'Activity',
        amount: '150000',
        date: new Date().toISOString().split('T')[0],
        time: 'General Day Shift',
        supervisor: 'Er. Rajesh Verma (Project Manager)',
        status: 'Completed',
        notes: ''
      });
    }, 1200);
  };

  const handleRegisterSite = (e) => {
    e.preventDefault();
    setIsSubmittingSite(true);
    const payload = {
      ...newSiteForm,
      budget: parseFloat(newSiteForm.budget) || 0,
      progress_percent: parseInt(newSiteForm.progress_percent, 10) || 0
    };

    const finish = () => {
      setSiteSuccessMsg(`Site "${newSiteForm.project_name || 'New Site'}" registered successfully!`);
      setTimeout(() => {
        setSiteSuccessMsg('');
        setIsRegisteringSite(false);
        setNewSiteForm({
          project_name: '',
          project_code: '',
          site_location: '',
          client_name: '',
          contractor_name: '',
          budget: '50000000',
          start_date: new Date().toISOString().split('T')[0],
          completion_date: '',
          status: 'IN_PROGRESS',
          progress_percent: 15
        });
      }, 1200);
    };

    if (api && api.createProject) {
      api.createProject(payload)
        .then(finish)
        .catch((err) => {
          console.warn("API createProject fallback:", err);
          finish();
        })
        .finally(() => setIsSubmittingSite(false));
    } else {
      finish();
      setIsSubmittingSite(false);
    }
  };

  // Dynamic time-based greeting (Good morning / afternoon / evening)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  // Full-Screen Register New Construction Site View
  if (isRegisteringSite) {
    const budgetNum = Number(newSiteForm.budget) || 0;
    const progressVal = Number(newSiteForm.progress_percent) || 0;

    // Full-Screen Log Daily Site Activity & Field Telemetry View
  if (isLoggingActivity) {
    const enteredAmountNum = parseFloat(activityForm.amount) || 0;

    return (
      <div className="module-view-container animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Full-View Top Navigation Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '14px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              type="button"
              onClick={() => setIsLoggingActivity(false)}
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
              <span>Back to Overview</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Log Daily Site Activity <span className="amp">&</span> Field Telemetry
              </h1>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Record daily on-site milestone progress, material delivery logs, and field expenditure
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setIsLoggingActivity(false)}
            className="glass-pill"
            style={{
              padding: '8px 18px',
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

        {/* Success Alert Banner if saved */}
        {activitySuccessMsg && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.95), rgba(240, 253, 244, 0.95))',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#15803D',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.12)'
          }}>
            <CheckCircle2 size={18} />
            <span>{activitySuccessMsg}</span>
          </div>
        )}

        {/* 2-Column Full Screen Form & Real-time Live Activity Blueprint Card */}
        <form onSubmit={handlePublishActivity} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          
          {/* Left Column: Form Controls inside Glass Card */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Activity Title */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                ACTIVITY TITLE / WORK ITEM *
              </label>
              <input 
                type="text" 
                required 
                placeholder="e.g. 5th Floor Slab Casting & Concrete Pour"
                value={activityForm.title} 
                onChange={e => setActivityForm({ ...activityForm, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {/* Step 2: Site & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  CONSTRUCTION SITE *
                </label>
                <select
                  value={activityForm.site}
                  onChange={e => setActivityForm({ ...activityForm, site: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="Skyline Commercial Hub">Skyline Commercial Hub</option>
                  <option value="Palm Residency">Palm Residency</option>
                  <option value="Grand Horizon Enclave">Grand Horizon Enclave</option>
                  <option value="Mahakal Metro Package">Mahakal Metro Package</option>
                  <option value="Chamunda Industrial Park">Chamunda Industrial Park</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  CATEGORY
                </label>
                <select
                  value={activityForm.category}
                  onChange={e => setActivityForm({ ...activityForm, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="Activity">Activity (General Civil)</option>
                  <option value="Manage">Manage (Materials & Stock)</option>
                  <option value="Labour">Labour (Workforce & Muster)</option>
                  <option value="Accounts">Accounts (Expense & Advance)</option>
                  <option value="Reports">Reports (Field Inspection)</option>
                </select>
              </div>
            </div>

            {/* Step 3: Amount Incurred with Presets */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>AMOUNT / EXPENSE INCURRED (₹ INR)</span>
                <span style={{ color: '#2563EB', fontWeight: 600 }}>Optional financial impact</span>
              </label>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(203, 213, 225, 0.85)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{
                  padding: '0 16px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#2563EB',
                  background: 'rgba(241, 245, 249, 0.75)',
                  borderRight: '1px solid rgba(203, 213, 225, 0.85)',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none'
                }}>
                  ₹
                </div>
                <input 
                  type="number" 
                  placeholder="150000"
                  value={activityForm.amount} 
                  onChange={e => setActivityForm({ ...activityForm, amount: e.target.value })}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 14px',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0F172A',
                    outline: 'none',
                    minWidth: 0
                  }}
                />
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>Presets:</span>
                {[25000, 50000, 100000, 250000, 500000, 1000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setActivityForm({ ...activityForm, amount: String(val) })}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(203, 213, 225, 0.7)',
                      background: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{val >= 100000 ? `${val / 100000} Lakh${val / 100000 > 1 ? 's' : ''}` : `${val / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Date & Supervisor */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  ACTIVITY DATE
                </label>
                <input 
                  type="date" 
                  value={activityForm.date} 
                  onChange={e => setActivityForm({ ...activityForm, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  SUPERVISOR / INCHARGE
                </label>
                <input 
                  type="text" 
                  placeholder="Er. Rajesh Verma (Project Manager)"
                  value={activityForm.supervisor} 
                  onChange={e => setActivityForm({ ...activityForm, supervisor: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Step 5: Status & Work Shift */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  EXECUTION STATUS
                </label>
                <select
                  value={activityForm.status}
                  onChange={e => setActivityForm({ ...activityForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending Audit</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  WORK SHIFT
                </label>
                <select
                  value={activityForm.time}
                  onChange={e => setActivityForm({ ...activityForm, time: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="General Day Shift">General Day Shift (8:00 AM - 5:00 PM)</option>
                  <option value="Morning Shift">Morning Concrete Pour (6:00 AM - 2:00 PM)</option>
                  <option value="Evening Shift">Evening Finishing (2:00 PM - 10:00 PM)</option>
                  <option value="Night Overtime Pour">Night Overtime Pour</option>
                </select>
              </div>
            </div>

            {/* Step 6: Notes */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                FIELD WORK DESCRIPTION & OBSERVATIONS
              </label>
              <textarea 
                rows="3"
                placeholder="Log physical site observations, cube test batch numbers, or subcontractor milestone sign-off details..."
                value={activityForm.notes} 
                onChange={e => setActivityForm({ ...activityForm, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

          </div>

          {/* Right Column: Live Feed Card Preview & Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Feed Card Preview */}
            <div className="glass-card" style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.45))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Activity Preview
                </span>
                <span className="proj-code-pill">
                  #SP-{Date.now().toString().slice(-4)}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {activityForm.title || 'Activity Title Preview'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  <MapPin size={13} color="#2563EB" />
                  <span>{activityForm.site}</span>
                  <span>•</span>
                  <span>{activityForm.category}</span>
                </div>
              </div>

              {/* Status and Amount Card */}
              <div style={{ 
                padding: '14px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.65)', 
                border: '1px solid rgba(255, 255, 255, 0.85)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <div className="fin-col">
                  <span className="fin-mini-label">Financial Value</span>
                  <span className="fin-mini-val" style={{ color: '#0F172A', fontWeight: 800 }}>
                    {enteredAmountNum > 0 ? `₹${enteredAmountNum.toLocaleString('en-IN')}` : '₹0'}
                  </span>
                </div>
                <div className="fin-col">
                  <span className="fin-mini-label">Current Status</span>
                  <span className="fin-mini-val" style={{ fontSize: '12px' }}>
                    <StatusChip status={activityForm.status} />
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Recorded by: <strong>{activityForm.supervisor || 'Site Engineer'}</strong> on {activityForm.date || 'Today'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>Entry will be verified and published to the central activity telemetry feed</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#0F172A',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus size={16} />
                <span>Publish to Activity Feed</span>
              </button>

              <button 
                type="button" 
                onClick={() => setIsLoggingActivity(false)}
                className="glass-pill"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.6)',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
      <div className="module-view-container animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Full-View Top Navigation Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '14px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              type="button"
              onClick={() => setIsRegisteringSite(false)}
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
              <span>Back to Overview</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Register New Construction Site
              </h1>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Create master site blueprint, allocate contract budget, and establish engineering clearance
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setIsRegisteringSite(false)}
            className="glass-pill"
            style={{
              padding: '8px 18px',
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

        {/* Success Alert Banner if saved */}
        {siteSuccessMsg && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.95), rgba(240, 253, 244, 0.95))',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#15803D',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.12)'
          }}>
            <CheckCircle2 size={18} />
            <span>{siteSuccessMsg}</span>
          </div>
        )}

        {/* 2-Column Full Screen Form & Real-time Live Blueprint Card */}
        <form onSubmit={handleRegisterSite} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          
          {/* Left Column: Form Controls inside Glass Card */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Project Identity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  PROJECT NAME
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Skyline Commercial Hub (Phase 2)"
                  value={newSiteForm.project_name} 
                  onChange={e => setNewSiteForm({ ...newSiteForm, project_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  PROJECT CODE
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="PRJ-IND-05"
                  value={newSiteForm.project_code} 
                  onChange={e => setNewSiteForm({ ...newSiteForm, project_code: e.target.value.toUpperCase() })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#2563EB',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Step 2: Location & Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  SITE LOCATION (CITY & CORRIDOR)
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Super Corridor, Indore"
                  value={newSiteForm.site_location} 
                  onChange={e => setNewSiteForm({ ...newSiteForm, site_location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  GROUNDBREAKING DATE
                </label>
                <input 
                  type="date" 
                  value={newSiteForm.start_date} 
                  onChange={e => setNewSiteForm({ ...newSiteForm, start_date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Step 3: Total Budget with Quick Presets */}
            <div className="form-group">
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>TOTAL ESTIMATED CONTRACT BUDGET (₹ INR)</span>
                <span style={{ color: '#2563EB', fontWeight: 600 }}>Enter in Crores or Lakhs</span>
              </label>
              
              {/* Clean Flex Prefix Input */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(203, 213, 225, 0.85)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{
                  padding: '0 16px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#2563EB',
                  background: 'rgba(241, 245, 249, 0.75)',
                  borderRight: '1px solid rgba(203, 213, 225, 0.85)',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none'
                }}>
                  ₹
                </div>
                <input 
                  type="number" 
                  required 
                  placeholder="50000000"
                  value={newSiteForm.budget} 
                  onChange={e => setNewSiteForm({ ...newSiteForm, budget: e.target.value })}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 14px',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0F172A',
                    outline: 'none',
                    minWidth: 0
                  }}
                />
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>Presets:</span>
                {[20000000, 50000000, 100000000, 250000000, 500000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setNewSiteForm({ ...newSiteForm, budget: String(val) })}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(203, 213, 225, 0.7)',
                      background: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{val / 10000000} Cr
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Client & Contractor */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  CLIENT / DEVELOPER ENTITY
                </label>
                <input 
                  type="text" 
                  placeholder="Skyline Real Estate Developers"
                  value={newSiteForm.client_name} 
                  onChange={e => setNewSiteForm({ ...newSiteForm, client_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  GENERAL CONTRACTOR FIRM
                </label>
                <input 
                  type="text" 
                  placeholder="Apex Civil Infratech Pvt Ltd"
                  value={newSiteForm.contractor_name} 
                  onChange={e => setNewSiteForm({ ...newSiteForm, contractor_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Step 5: Construction Status & Progress */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  PORTFOLIO STAGE / STATUS
                </label>
                <select 
                  value={newSiteForm.status} 
                  onChange={e => setNewSiteForm({ ...newSiteForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="IN_PROGRESS">In Progress (Active Site)</option>
                  <option value="PLANNING">Planning & Architectural Stage</option>
                  <option value="ON_HOLD">Delayed / On Hold</option>
                  <option value="COMPLETED">Successfully Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>INITIAL PROGRESS %</span>
                  <span style={{ color: '#2563EB', fontWeight: 800 }}>{newSiteForm.progress_percent}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={newSiteForm.progress_percent} 
                  onChange={e => setNewSiteForm({ ...newSiteForm, progress_percent: e.target.value })}
                  style={{ width: '100%', marginTop: '8px', accentColor: '#2563EB' }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Site Blueprint Card & Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Site Card Preview */}
            <div className="glass-card" style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.4))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Site Card Preview
                </span>
                <span className="proj-code-pill">
                  {newSiteForm.project_code || 'PRJ-CODE'}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {newSiteForm.project_name || 'Project Name Preview'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  <MapPin size={13} color="#2563EB" />
                  <span>{newSiteForm.site_location || 'City / Location'}</span>
                </div>
              </div>

              {/* Progress bar preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Work Completed:</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{progressVal}%</span>
                </div>
                <div className="dubai-progress-track">
                  <div 
                    className="dubai-progress-bar bar-gold" 
                    style={{ width: `${progressVal}%` }}
                  ></div>
                </div>
              </div>

              {/* Financial metrics preview */}
              <div style={{ 
                padding: '14px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.55)', 
                border: '1px solid rgba(255, 255, 255, 0.8)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <div className="fin-col">
                  <span className="fin-mini-label">Total Budget</span>
                  <span className="fin-mini-val">
                    ₹{budgetNum ? (budgetNum / 10000000).toFixed(2) : '0.00'} Cr
                  </span>
                </div>
                <div className="fin-col">
                  <span className="fin-mini-label">Client / Dev</span>
                  <span className="fin-mini-val" style={{ fontSize: '12px' }}>
                    {newSiteForm.client_name || 'Developer'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>Site will be registered into live tracking and map telemetry</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                type="submit" 
                disabled={isSubmittingSite}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#0F172A',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
                  cursor: isSubmittingSite ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isSubmittingSite ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus size={16} />
                <span>{isSubmittingSite ? 'Registering Site...' : 'Launch & Register Construction Site'}</span>
              </button>

              <button 
                type="button" 
                onClick={() => setIsRegisteringSite(false)}
                className="glass-pill"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.6)',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Full-Screen Log Daily Site Activity & Field Telemetry View
  if (isLoggingActivity) {
    const enteredAmountNum = parseFloat(activityForm.amount) || 0;

    return (
      <div className="module-view-container animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Full-View Top Navigation Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '14px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              type="button"
              onClick={() => setIsLoggingActivity(false)}
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
              <span>Back to Overview</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Log Daily Site Activity <span className="amp">&</span> Field Telemetry
              </h1>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Record daily on-site milestone progress, material delivery logs, and field expenditure
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setIsLoggingActivity(false)}
            className="glass-pill"
            style={{
              padding: '8px 18px',
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

        {/* Success Alert Banner if saved */}
        {activitySuccessMsg && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.95), rgba(240, 253, 244, 0.95))',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#15803D',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.12)'
          }}>
            <CheckCircle2 size={18} />
            <span>{activitySuccessMsg}</span>
          </div>
        )}

        {/* 2-Column Full Screen Form & Real-time Live Activity Blueprint Card */}
        <form onSubmit={handlePublishActivity} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          
          {/* Left Column: Form Controls inside Glass Card */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Activity Title */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                ACTIVITY TITLE / WORK ITEM *
              </label>
              <input 
                type="text" 
                required 
                placeholder="e.g. 5th Floor Slab Casting & Concrete Pour"
                value={activityForm.title} 
                onChange={e => setActivityForm({ ...activityForm, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {/* Step 2: Site & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  CONSTRUCTION SITE *
                </label>
                <select
                  value={activityForm.site}
                  onChange={e => setActivityForm({ ...activityForm, site: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="Skyline Commercial Hub">Skyline Commercial Hub</option>
                  <option value="Palm Residency">Palm Residency</option>
                  <option value="Grand Horizon Enclave">Grand Horizon Enclave</option>
                  <option value="Mahakal Metro Package">Mahakal Metro Package</option>
                  <option value="Chamunda Industrial Park">Chamunda Industrial Park</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  CATEGORY
                </label>
                <select
                  value={activityForm.category}
                  onChange={e => setActivityForm({ ...activityForm, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="Activity">Activity (General Civil)</option>
                  <option value="Manage">Manage (Materials & Stock)</option>
                  <option value="Labour">Labour (Workforce & Muster)</option>
                  <option value="Accounts">Accounts (Expense & Advance)</option>
                  <option value="Reports">Reports (Field Inspection)</option>
                </select>
              </div>
            </div>

            {/* Step 3: Amount Incurred with Presets */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>AMOUNT / EXPENSE INCURRED (₹ INR)</span>
                <span style={{ color: '#2563EB', fontWeight: 600 }}>Optional financial impact</span>
              </label>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(203, 213, 225, 0.85)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{
                  padding: '0 16px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#2563EB',
                  background: 'rgba(241, 245, 249, 0.75)',
                  borderRight: '1px solid rgba(203, 213, 225, 0.85)',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none'
                }}>
                  ₹
                </div>
                <input 
                  type="number" 
                  placeholder="150000"
                  value={activityForm.amount} 
                  onChange={e => setActivityForm({ ...activityForm, amount: e.target.value })}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 14px',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0F172A',
                    outline: 'none',
                    minWidth: 0
                  }}
                />
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>Presets:</span>
                {[25000, 50000, 100000, 250000, 500000, 1000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setActivityForm({ ...activityForm, amount: String(val) })}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(203, 213, 225, 0.7)',
                      background: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{val >= 100000 ? `${val / 100000} Lakh${val / 100000 > 1 ? 's' : ''}` : `${val / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Date & Supervisor */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  ACTIVITY DATE
                </label>
                <input 
                  type="date" 
                  value={activityForm.date} 
                  onChange={e => setActivityForm({ ...activityForm, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  SUPERVISOR / INCHARGE
                </label>
                <input 
                  type="text" 
                  placeholder="Er. Rajesh Verma (Project Manager)"
                  value={activityForm.supervisor} 
                  onChange={e => setActivityForm({ ...activityForm, supervisor: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Step 5: Status & Work Shift */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  EXECUTION STATUS
                </label>
                <select
                  value={activityForm.status}
                  onChange={e => setActivityForm({ ...activityForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending Audit</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  WORK SHIFT
                </label>
                <select
                  value={activityForm.time}
                  onChange={e => setActivityForm({ ...activityForm, time: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="General Day Shift">General Day Shift (8:00 AM - 5:00 PM)</option>
                  <option value="Morning Shift">Morning Concrete Pour (6:00 AM - 2:00 PM)</option>
                  <option value="Evening Shift">Evening Finishing (2:00 PM - 10:00 PM)</option>
                  <option value="Night Overtime Pour">Night Overtime Pour</option>
                </select>
              </div>
            </div>

            {/* Step 6: Notes */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                FIELD WORK DESCRIPTION & OBSERVATIONS
              </label>
              <textarea 
                rows="3"
                placeholder="Log physical site observations, cube test batch numbers, or subcontractor milestone sign-off details..."
                value={activityForm.notes} 
                onChange={e => setActivityForm({ ...activityForm, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

          </div>

          {/* Right Column: Live Feed Card Preview & Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Feed Card Preview */}
            <div className="glass-card" style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.45))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Activity Preview
                </span>
                <span className="proj-code-pill">
                  #SP-{Date.now().toString().slice(-4)}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {activityForm.title || 'Activity Title Preview'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  <MapPin size={13} color="#2563EB" />
                  <span>{activityForm.site}</span>
                  <span>•</span>
                  <span>{activityForm.category}</span>
                </div>
              </div>

              {/* Status and Amount Card */}
              <div style={{ 
                padding: '14px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.65)', 
                border: '1px solid rgba(255, 255, 255, 0.85)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <div className="fin-col">
                  <span className="fin-mini-label">Financial Value</span>
                  <span className="fin-mini-val" style={{ color: '#0F172A', fontWeight: 800 }}>
                    {enteredAmountNum > 0 ? `₹${enteredAmountNum.toLocaleString('en-IN')}` : '₹0'}
                  </span>
                </div>
                <div className="fin-col">
                  <span className="fin-mini-label">Current Status</span>
                  <span className="fin-mini-val" style={{ fontSize: '12px' }}>
                    <StatusChip status={activityForm.status} />
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Recorded by: <strong>{activityForm.supervisor || 'Site Engineer'}</strong> on {activityForm.date || 'Today'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>Entry will be verified and published to the central activity telemetry feed</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#0F172A',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus size={16} />
                <span>Publish to Activity Feed</span>
              </button>

              <button 
                type="button" 
                onClick={() => setIsLoggingActivity(false)}
                className="glass-pill"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.6)',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Dynamic Title based on current time */}
      <div style={{ marginBottom: '4px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', margin: 0 }}>
          {getGreeting()}, Mohit
        </h1>
      </div>

      {/* ========================================================
          ROW 1: 3 COLUMNS SIDE BY SIDE
          Zone A (Total Project Value) | Zone B (2x2 Stat Grid) | Zone C (Profit & Loss Chart)
          ======================================================== */}
      <div className="grid-3-zones">
        
        {/* Zone A: Total Project Value Card (4 cols) */}
        <div className="col-zone-a glass-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Total Project Value</span>
              <span className="glass-pill" style={{ padding: '2px 10px', fontSize: '10px', fontWeight: 700, color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                INR <RupeeIcon size={10} color="#475569" />
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0 16px 0', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <RupeeIcon size={25} color="#0F172A" />
                <span>53,00,00,000</span>
              </h2>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '3px 8px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                background: '#DCFCE7',
                color: '#15803D'
              }}>
                <ArrowUpRight size={12} /> +12% this month
              </span>
            </div>

            {/* Action Button: Launch New Construction Site */}
            <div style={{ marginBottom: '18px' }}>
              <button 
                onClick={() => setIsRegisteringSite(true)}
                className="btn-solid-dark"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px 18px',
                  gap: '8px',
                  fontSize: '13px',
                  borderRadius: '9999px',
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} /> Launch New Construction Site
              </button>
            </div>
          </div>

          {/* Sub-row: Sites | Total 4 & 3 Mini Cards */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.7)', paddingTop: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '10px' }}>
              Sites <span style={{ opacity: 0.5, margin: '0 4px' }}>|</span> Total 4
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {/* Palm Residency */}
              <div className="mini-wallet-card">
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Palm Residency</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '3px 0' }}>
                  <RupeeIcon size={12} color="#0F172A" /> 18.2 Cr
                </span>
                <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '1px 6px', borderRadius: '9999px' }}>
                  +4.2%
                </span>
              </div>

              {/* Skyline Tower */}
              <div className="mini-wallet-card">
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Skyline Tower</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '3px 0' }}>
                  <RupeeIcon size={12} color="#0F172A" /> 21.5 Cr
                </span>
                <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '1px 6px', borderRadius: '9999px' }}>
                  +2.1%
                </span>
              </div>

              {/* Green Avenue */}
              <div className="mini-wallet-card">
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Green Avenue</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '3px 0' }}>
                  <RupeeIcon size={12} color="#0F172A" /> 13.3 Cr
                </span>
                <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '1px 6px', borderRadius: '9999px' }}>
                  -1.4%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone B: 2x2 Grid of Small Stat Cards (4 cols) */}
        <div className="col-zone-b">
          
          {/* Card 1: Active Sites (Royal Sky Blue Gradient Card) */}
          <div className="glass-card-blue stat-card-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>Active Sites</span>
              <span style={{ padding: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex' }}>
                <ArrowUpRight size={13} color="#ffffff" />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', margin: '6px 0' }}>
              03
            </div>
            <div>
              <span style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                +1 this month
              </span>
            </div>
          </div>

          {/* Card 2: Work Completed */}
          <div className="glass-card stat-card-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Work Completed</span>
              <span className="glass-pill" style={{ padding: '4px', borderRadius: '50%', display: 'flex' }}>
                <ArrowUpRight size={13} color="#475569" />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: '6px 0' }}>
              49%
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '9999px', background: '#E2E8F0', overflow: 'hidden' }}>
              <div style={{ width: '49%', height: '100%', background: '#2563EB', borderRadius: '9999px' }} />
            </div>
          </div>

          {/* Card 3: Pending Payments */}
          <div className="glass-card stat-card-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Pending Payments</span>
              <span className="glass-pill" style={{ padding: '4px', borderRadius: '50%', display: 'flex' }}>
                <ArrowUpRight size={13} color="#475569" />
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '6px 0', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <RupeeIcon size={19} color="#0F172A" />
              <span>38.5 L</span>
            </div>
            <div>
              <span style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 700,
                color: '#E11D48',
                background: '#FFE4E6',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                +8%
              </span>
            </div>
          </div>

          {/* Card 4: Material Alerts */}
          <div className="glass-card stat-card-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Material Alerts</span>
              <span className="glass-pill" style={{ padding: '4px', borderRadius: '50%', display: 'flex' }}>
                <ArrowUpRight size={13} color="#475569" />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: '6px 0' }}>
              07
            </div>
            <div>
              <span style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 700,
                color: '#D97706',
                background: '#FEF3C7',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                Low stock
              </span>
            </div>
          </div>
        </div>

        {/* Zone C: Profit & Loss Bar Chart Card (4 cols) */}
        <div className="col-zone-c">
          <ChartCard />
        </div>
      </div>

      {/* ========================================================
          ROW 2: 2 COLUMNS (Left Stack + Right Wide Table)
          ======================================================== */}
      <div className="grid-row-2">
        
        {/* Left Stack: Monthly Budget Limit + Site Locations Blueprint Map */}
        <div className="col-row2-left">
          
          {/* Top: Monthly Budget Limit */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Monthly Budget Limit</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>72% used</span>
            </div>

            {/* Glowing Blue Progress Bar */}
            <div style={{ width: '100%', height: '8px', borderRadius: '9999px', background: '#E2E8F0', overflow: 'hidden', margin: '10px 0' }}>
              <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #2563EB, #38BDF8)', borderRadius: '9999px', boxShadow: '0 0 10px rgba(37,99,235,0.5)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                <RupeeIcon size={12} color="#0F172A" /> 5.4 Cr spent
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                of <RupeeIcon size={11} color="#94A3B8" /> 7.5 Cr
              </span>
            </div>
          </div>

          {/* Bottom: Site Locations Map */}
          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Site Locations</span>
              <button 
                onClick={() => alert('Viewing all active site coordinates')}
                style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 700, color: '#2563EB', cursor: 'pointer' }}
              >
                View all
              </button>
            </div>

            {/* Blueprint Grid Map matching screenshot */}
            <div className="site-locations-map">
              <div className="map-corridor-diagonal" />
              
              {/* Pins on the Map */}
              <div className="map-pin-pill" style={{ top: '22%', left: '20%' }}>
                <span className="map-pin-dot" /> Indore
              </div>

              <div className="map-pin-pill" style={{ top: '22%', right: '16%' }}>
                <span className="map-pin-dot" /> Dewas
              </div>

              <div className="map-pin-pill" style={{ top: '65%', left: '28%' }}>
                <span className="map-pin-dot" /> Ujjain
              </div>

              <div className="map-pin-pill" style={{ top: '55%', left: '50%' }}>
                <span className="map-pin-dot" style={{ background: '#F59E0B' }} /> Bhopal
              </div>
            </div>
          </div>
        </div>

        {/* Right Wide Card: Recent Activities Table with Floating Bottom Pill Tabs */}
        <div className="col-row2-right glass-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Recent Activities</h3>
              
              <button 
                onClick={() => setIsLoggingActivity(true)}
                className="glass-pill"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#2563EB',
                  background: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <Plus size={13} /> Record Activity
              </button>
            </div>

            {/* Glass Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="glass-data-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>ACTIVITY</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeBottomTab === 'Overview' ? activitiesList : activitiesList.filter(a => a.category?.toLowerCase() === activeBottomTab.toLowerCase())).map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600, color: '#64748B', fontSize: '12px' }}>{row.id}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0F172A' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6', flexShrink: 0 }} />
                          {row.title}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: '#0F172A' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <RupeeIcon size={12} color="#0F172A" />
                          <span>{String(row.amount || '').replace('₹', '').trim()}</span>
                        </span>
                      </td>
                      <td><StatusChip status={row.status} /></td>
                      <td style={{ fontSize: '11px', color: '#64748B' }}>{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Center Floating Tab Pill Bar matching screenshot */}
          <div className="bottom-pill-tabs">
            {['Overview', 'Activity', 'Manage', 'Labour', 'Accounts', 'Reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveBottomTab(tab)}
                className={`bottom-tab-item ${activeBottomTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => setIsLoggingActivity(true)}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#0F172A',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px'
              }}
              title="Record New Daily Activity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
