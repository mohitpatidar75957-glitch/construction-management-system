import React, { useEffect, useState } from 'react';
import { api, DEFAULT_LABOUR, DEFAULT_PROJECTS } from '../api/client';
import { 
  HiOutlineUserGroup as Users, 
  HiOutlineUserGroup as HardHat, 
  HiOutlineCurrencyRupee as IndianRupee, 
  HiOutlineCheckCircle as CheckCircle2, 
  HiOutlineClock as Clock, 
  HiOutlineExclamationCircle as AlertCircle, 
  HiPlus as Plus, 
  HiOutlineBuildingOffice2 as Building2,
  HiOutlineCalendarDays as Calendar,
  HiOutlineFunnel as Filter,
  HiArrowLeft as ArrowLeft,
  HiOutlineShieldCheck as ShieldCheck,
  HiOutlineUserPlus as UserCheck
} from 'react-icons/hi2';
import RupeeIcon from './common/RupeeIcon';

export default function LabourView() {
  const [labour, setLabour] = useState(DEFAULT_LABOUR);
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('');

  const [formData, setFormData] = useState({
    project_id: '1',
    worker_name: '',
    category: 'MASON',
    contractor_agency: '',
    daily_wage: '850',
    attendance_status: 'PRESENT',
    work_date: new Date().toISOString().split('T')[0],
    payment_status: 'PENDING'
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getLabour(selectedProjectFilter), api.getProjects()])
      .then(([labourRes, projRes]) => {
        setLabour(labourRes);
        setProjects(projRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedProjectFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.createLabour({
      ...formData,
      daily_wage: parseFloat(formData.daily_wage) || 600
    }).then(() => {
      setShowModal(false);
      loadData();
      setFormData({
        project_id: projects[0]?.id || '1',
        worker_name: '',
        category: 'MASON',
        contractor_agency: '',
        daily_wage: '850',
        attendance_status: 'PRESENT',
        work_date: new Date().toISOString().split('T')[0],
        payment_status: 'PENDING'
      });
    });
  };

  const handleTogglePayment = (id, currentStatus) => {
    const nextStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
    api.updateLabourPayment(id, nextStatus).then(loadData);
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading workforce and site attendance telemetry...</div>;
  }

  // Calculations
  const presentCount = labour.filter(l => l.attendance_status === 'PRESENT').length;
  const totalWagePool = labour.reduce((acc, l) => acc + Number(l.daily_wage || 0), 0);
  const pendingPayouts = labour.filter(l => l.payment_status === 'PENDING').reduce((acc, l) => acc + Number(l.daily_wage || 0), 0);
  const uniqueContractors = [...new Set(labour.map(l => l.contractor_agency).filter(Boolean))].length;

  const trades = [
    { id: 'MASON', label: 'Mason (Rajmistri)', color: '#3B82F6' },
    { id: 'BAR_BENDER', label: 'Bar Bender (Sariya)', color: '#F59E0B' },
    { id: 'CARPENTER', label: 'Carpenter (Shuttering)', color: '#8B5CF6' },
    { id: 'ELECTRICIAN', label: 'Electrician', color: '#06B6D4' },
    { id: 'PLUMBER', label: 'Plumber', color: '#10B981' },
    { id: 'GENERAL_LABOUR', label: 'General Labour (Beldar)', color: '#64748B' },
  ];

  const selectedTradeObj = trades.find(t => t.id === formData.category) || trades[0];
  const selectedProjObj = projects.find(p => String(p.id) === String(formData.project_id)) || projects[0];

  // =========================================================================
  // 1. FULL-SCREEN / FULL-VIEW ATTENDANCE ENTRY PAGE
  // =========================================================================
  if (showModal) {
    const wageNum = Number(formData.daily_wage) || 0;

    return (
      <div className="module-view-container animate-fade-in" style={{ width: '100%' }}>
        
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
              onClick={() => setShowModal(false)}
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
              <span>Back to Workforce</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Record Worker Attendance & Daily Wages
              </h1>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setShowModal(false)}
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

        {/* 2-Column Full Screen Form & Real-time Live Badge Grid */}
        <form onSubmit={handleSubmit} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          
          {/* Left Column: Form Controls */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Trade Skills */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                SELECT TRADE CLASSIFICATION
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                {trades.map(t => {
                  const isTradeActive = formData.category === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: t.id })}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isTradeActive ? '1.5px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.8)',
                        background: isTradeActive ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                        color: isTradeActive ? '#0F172A' : '#64748B',
                        fontSize: '11.5px',
                        fontWeight: isTradeActive ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Worker Name & Site */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  WORKER FULL NAME
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Rameshwar Patel"
                  value={formData.worker_name} 
                  onChange={e => setFormData({ ...formData, worker_name: e.target.value })}
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
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  DEPLOYED SITE
                </label>
                <select 
                  value={formData.project_id} 
                  onChange={e => setFormData({ ...formData, project_id: e.target.value })}
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
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.project_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contractor & Wage Rate */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  CONTRACTOR / LABOUR AGENCY
                </label>
                <input 
                  type="text" 
                  placeholder="Devendra Labour Supply"
                  value={formData.contractor_agency} 
                  onChange={e => setFormData({ ...formData, contractor_agency: e.target.value })}
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
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  DAILY WAGE RATE (₹ INR)
                </label>
                <input 
                  type="number" 
                  required 
                  placeholder="850"
                  value={formData.daily_wage} 
                  onChange={e => setFormData({ ...formData, daily_wage: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Attendance Status Pills */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                ATTENDANCE STATUS
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { id: 'PRESENT', label: 'Present (Full Day)', color: '#10B981' },
                  { id: 'HALF_DAY', label: 'Half Day', color: '#F59E0B' },
                  { id: 'ABSENT', label: 'Absent', color: '#EF4444' },
                ].map(att => {
                  const isAttActive = formData.attendance_status === att.id;
                  return (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, attendance_status: att.id })}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        border: isAttActive ? '1px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.8)',
                        background: isAttActive ? '#2563EB' : 'rgba(255, 255, 255, 0.6)',
                        color: isAttActive ? '#ffffff' : '#475569',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {att.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Worker Wage Card Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.35))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Worker ID Preview
                </span>
                <span className="glass-pill" style={{ padding: '3px 10px', fontSize: '10.5px', fontWeight: 700, color: '#10B981' }}>
                  {formData.attendance_status}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {formData.worker_name || 'Worker Name'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  <HardHat size={13} color="#2563EB" />
                  <span>{selectedTradeObj.label}</span>
                </div>
              </div>

              <div style={{ 
                padding: '14px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.55)', 
                border: '1px solid rgba(255, 255, 255, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Daily Wage Rate:</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>₹{wageNum}/day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Site Allocation:</span>
                  <span style={{ fontWeight: 700, color: '#2563EB' }}>{selectedProjObj?.project_name || 'Site'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Contractor / Agency:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{formData.contractor_agency || 'Direct Site Hire'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>Attendance logs verified on daily site muster roll</span>
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
                  gap: '8px'
                }}
              >
                <UserCheck size={16} />
                <span>Record Attendance & Daily Wage</span>
              </button>

              <button 
                type="button" 
                onClick={() => setShowModal(false)}
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

  // =========================================================================
  // 2. MAIN LABOUR WORKFORCE DASHBOARD VIEW
  // =========================================================================
  return (
    <div className="module-view-container">
      {/* Action Header */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Labour & Contractor Workforce</h2>
          <p className="module-subtitle">Daily site attendance, contractor agencies, trade classifications & wage payouts</p>
        </div>
        <button className="btn-dubai-gold" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          <span>Mark Labour Attendance</span>
        </button>
      </div>

      {/* 4 Workforce KPI Cards */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Workers Present Today</span>
            <span className="fin-icon-pill icon-gold"><HardHat size={18} /></span>
          </div>
          <div className="fin-val">{presentCount} Workers</div>
          <div className="fin-sub">Active across {projects.length} construction sites</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Today's Wage Liability</span>
            <span className="fin-icon-pill icon-green"><IndianRupee size={18} /></span>
          </div>
          <div className="fin-val text-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <RupeeIcon size={20} color="#16A34A" />
            <span>{totalWagePool.toLocaleString('en-IN')}</span>
          </div>
          <div className="fin-sub">Daily wage bill for today's muster roll</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Pending Wage Disbursements</span>
            <span className="fin-icon-pill icon-rose"><Clock size={18} /></span>
          </div>
          <div className="fin-val text-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <RupeeIcon size={20} color="#E11D48" />
            <span>{pendingPayouts.toLocaleString('en-IN')}</span>
          </div>
          <div className="fin-sub">Unpaid wages awaiting bank payout</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Active Contractor Agencies</span>
            <span className="fin-icon-pill icon-amber"><Users size={18} /></span>
          </div>
          <div className="fin-val text-amber">{uniqueContractors} Suppliers</div>
          <div className="fin-sub">Subcontractor workforce supply firms</div>
        </div>
      </div>

      {/* Workforce Roster Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Users size={18} className="gold-text" />
            <h3>Daily Workforce Attendance & Wage Roster</h3>
          </div>

          {/* Filter by Site */}
          <div className="table-actions-right">
            <Filter size={14} color="#64748B" />
            <select 
              className="select-filter-dubai"
              value={selectedProjectFilter} 
              onChange={e => setSelectedProjectFilter(e.target.value)}
            >
              <option value="">All Construction Sites</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.project_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Trade / Skill</th>
                <th>Site</th>
                <th>Contractor Agency</th>
                <th>Daily Wage</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {labour.map(w => (
                <tr key={w.id}>
                  <td>
                    <div className="table-cell-title">{w.worker_name}</div>
                    <div className="table-cell-sub">{new Date(w.work_date).toLocaleDateString('en-IN')}</div>
                  </td>
                  <td>
                    <span className="trade-pill">{w.category}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{w.project_name}</div>
                  </td>
                  <td>
                    <div style={{ color: '#475569' }}>{w.contractor_agency || 'Direct Site Hire'}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <RupeeIcon size={12} color="#0F172A" />
                      <span>{w.daily_wage}</span>
                    </span>
                  </td>
                  <td>
                    <span className={`status-tag ${w.attendance_status === 'PRESENT' ? 'tag-green' : 'tag-rose'}`}>
                      <span className="status-dot"></span>
                      {w.attendance_status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleTogglePayment(w.id, w.payment_status)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: w.payment_status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: w.payment_status === 'PAID' ? '#059669' : '#DC2626',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {w.payment_status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
