import React, { useEffect, useState } from 'react';
import { api, DEFAULT_DASHBOARD, DEFAULT_DPR, DEFAULT_PROJECTS, DEFAULT_ACCOUNTS } from '../api/client';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Building2, 
  FileSpreadsheet, 
  Plus, 
  Sun,
  ArrowLeft,
  Calendar,
  User,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function ReportsView() {
  const [dashboardData, setDashboardData] = useState(DEFAULT_DASHBOARD);
  const [dprReports, setDprReports] = useState(DEFAULT_DPR);
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [loading, setLoading] = useState(false);
  const [showDprModal, setShowDprModal] = useState(false);

  const [dprForm, setDprForm] = useState({
    project_id: '1',
    report_date: new Date().toISOString().split('T')[0],
    weather: 'Clear / Sunny',
    milestone_activity: '',
    work_description: '',
    progress_percent_achieved: '',
    issues_or_delays: 'None. Work moving on schedule.',
    supervisor_name: ''
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getDashboard(), api.getDpr(), api.getProjects(), api.getAccounts()])
      .then(([dash, dpr, projs, acc]) => {
        setDashboardData(dash);
        setDprReports(dpr);
        setProjects(projs);
        setAccounts(acc);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDprSubmit = (e) => {
    e.preventDefault();
    api.createDpr({
      ...dprForm,
      progress_percent_achieved: parseInt(dprForm.progress_percent_achieved, 10) || 0
    }).then(() => {
      setShowDprModal(false);
      loadData();
      setDprForm({
        project_id: projects[0]?.id || '1',
        report_date: new Date().toISOString().split('T')[0],
        weather: 'Clear / Sunny',
        milestone_activity: '',
        work_description: '',
        progress_percent_achieved: '',
        issues_or_delays: 'None. Work moving on schedule.',
        supervisor_name: ''
      });
    });
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Generating executive analytics & site reports...</div>;
  }

  const selectedProjObj = projects.find(p => String(p.id) === String(dprForm.project_id)) || projects[0];

  // =========================================================================
  // 1. FULL-SCREEN / FULL-VIEW SUBMIT DPR PAGE
  // =========================================================================
  if (showDprModal) {
    const progAchieved = Number(dprForm.progress_percent_achieved) || 0;

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
              onClick={() => setShowDprModal(false)}
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
              <span>Back to Reports</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Submit Daily Progress Report (DPR)
              </h1>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setShowDprModal(false)}
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

        {/* 2-Column Full Screen Form & Real-time Live Preview Grid */}
        <form onSubmit={handleDprSubmit} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          
          {/* Left Column: Form Controls */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Site & Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  CONSTRUCTION SITE
                </label>
                <select 
                  value={dprForm.project_id} 
                  onChange={e => setDprForm({ ...dprForm, project_id: e.target.value })}
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
                    <option key={p.id} value={p.id}>{p.project_name} ({p.site_location})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  REPORT DATE
                </label>
                <input 
                  type="date" 
                  required 
                  value={dprForm.report_date} 
                  onChange={e => setDprForm({ ...dprForm, report_date: e.target.value })}
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

            {/* Milestone Activity & Progress */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  MILESTONE ACTIVITY
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="5th Floor Slab Concrete Casting"
                  value={dprForm.milestone_activity} 
                  onChange={e => setDprForm({ ...dprForm, milestone_activity: e.target.value })}
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
                  PROGRESS %
                </label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  required 
                  placeholder="85"
                  value={dprForm.progress_percent_achieved} 
                  onChange={e => setDprForm({ ...dprForm, progress_percent_achieved: e.target.value })}
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

            {/* Detailed Description */}
            <div className="form-group">
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                DETAILED WORK DESCRIPTION & LOGS
              </label>
              <textarea 
                rows="3" 
                required 
                placeholder="Details of batch plant cement poured, workers deployed, shuttering, conduit verification, cube test sampling..."
                value={dprForm.work_description} 
                onChange={e => setDprForm({ ...dprForm, work_description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            {/* Supervisor & Bottlenecks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  SITE INCHARGE / SUPERVISOR
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Er. Ankit Sharma"
                  value={dprForm.supervisor_name} 
                  onChange={e => setDprForm({ ...dprForm, supervisor_name: e.target.value })}
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
                  BOTTLENECK / DELAY ISSUES
                </label>
                <input 
                  type="text" 
                  placeholder="None (or Rain / Utility clearance)"
                  value={dprForm.issues_or_delays} 
                  onChange={e => setDprForm({ ...dprForm, issues_or_delays: e.target.value })}
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
          </div>

          {/* Right Column: Live DPR Card Preview */}
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
                  Live DPR Summary Preview
                </span>
                <span className="glass-pill" style={{ padding: '3px 10px', fontSize: '10.5px', fontWeight: 700, color: '#2563EB' }}>
                  {dprForm.report_date}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {dprForm.milestone_activity || 'Milestone Activity Name'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  <Building2 size={13} color="#2563EB" />
                  <span>{selectedProjObj?.project_name || 'Selected Site'}</span>
                </div>
              </div>

              {/* Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Target Progress:</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{progAchieved}%</span>
                </div>
                <div className="dubai-progress-track">
                  <div 
                    className="dubai-progress-bar bar-gold" 
                    style={{ width: `${progAchieved}%` }}
                  ></div>
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
                  <span style={{ color: '#64748B' }}>Site Supervisor:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{dprForm.supervisor_name || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Weather Status:</span>
                  <span style={{ fontWeight: 700, color: '#D97706' }}>Clear / Sunny</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Delays / Issues:</span>
                  <span style={{ fontWeight: 700, color: dprForm.issues_or_delays && dprForm.issues_or_delays.toLowerCase() !== 'none' ? '#EF4444' : '#10B981' }}>
                    {dprForm.issues_or_delays || 'None'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>Executive DPR will be logged into real-time project milestones</span>
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
                <CheckCircle2 size={16} />
                <span>Submit & Sign Daily DPR</span>
              </button>

              <button 
                type="button" 
                onClick={() => setShowDprModal(false)}
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
  // 2. MAIN REPORTS & ANALYTICS DASHBOARD VIEW
  // =========================================================================
  const sortedByProgress = [...projects].sort((a, b) => b.progress_percent - a.progress_percent);
  const topPerformingSite = sortedByProgress[0];
  const delayedSites = projects.filter(p => p.status === 'ON_HOLD' || p.progress_percent < 40);
  const overBudgetSites = projects.filter(p => Number(p.spent) > Number(p.budget));

  const totalContract = accounts?.summary?.totalContractValue || 0;
  const totalReceived = accounts?.summary?.totalCustomerReceived || 0;
  const totalExpenses = accounts?.summary?.totalActualExpenses || 0;
  const netProfit = totalReceived - totalExpenses;

  return (
    <div className="module-view-container">
      {/* Action Header */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Executive Reports & Construction Analytics</h2>
          <p className="module-subtitle">Instant executive insights on top performing sites, budget overruns, delays & net profitability</p>
        </div>
        <button className="btn-dubai-gold" onClick={() => setShowDprModal(true)}>
          <Plus size={16} />
          <span>Submit Daily DPR</span>
        </button>
      </div>

      {/* 4 Analytics Insight Cards */}
      <div className="financial-kpi-grid">
        {/* Top Performer */}
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Top Performing Site</span>
            <span className="fin-icon-pill icon-green"><TrendingUp size={18} /></span>
          </div>
          <div className="fin-val text-green">{topPerformingSite?.project_name || 'Chamunda Logistics'}</div>
          <div className="fin-sub"><b>{topPerformingSite?.progress_percent}% Work Complete</b> • On Track</div>
        </div>

        {/* Delayed Sites Alert */}
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Delayed Sites Alert</span>
            <span className="fin-icon-pill icon-rose"><AlertTriangle size={18} /></span>
          </div>
          <div className="fin-val text-rose">{delayedSites.length} Projects Critical</div>
          <div className="fin-sub">{delayedSites.map(s => s.project_name.split('(')[0]).join(', ') || 'No critical delays'}</div>
        </div>

        {/* Budget Overrun */}
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Budget Overrun Risk</span>
            <span className="fin-icon-pill icon-amber"><Clock size={18} /></span>
          </div>
          <div className="fin-val text-amber">{overBudgetSites.length > 0 ? `${overBudgetSites.length} Sites Over Budget` : '0 Sites Over Budget'}</div>
          <div className="fin-sub">All projects operating within allocated capital limits</div>
        </div>

        {/* Net Cashflow / Realized Profit */}
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Portfolio Net Cashflow</span>
            <span className="fin-icon-pill icon-gold"><IndianRupee size={18} /></span>
          </div>
          <div className="fin-val">₹{(netProfit / 10000000).toFixed(2)} Cr</div>
          <div className="fin-sub">Realized cash collection minus all expenses</div>
        </div>
      </div>

      {/* Site Audit Telemetry Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <BarChart3 size={18} className="gold-text" />
            <h3>Site Performance & Budget Telemetry Matrix</h3>
          </div>
          <span className="glass-pill" style={{ padding: '3px 12px', fontSize: '11px', fontWeight: 700 }}>
            {projects.length} Sites Audited
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Site & Location</th>
                <th>Contract Budget</th>
                <th>Spent</th>
                <th>Progress %</th>
                <th>Performance</th>
                <th>Executive Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(proj => {
                const prog = Number(proj.progress_percent);
                const spent = Number(proj.spent);
                const budget = Number(proj.budget);
                const isOverBudget = spent > budget;
                const isDelayed = proj.status === 'ON_HOLD' || prog < 40;

                return (
                  <tr key={proj.id}>
                    <td>
                      <div className="table-cell-title">{proj.project_name}</div>
                      <div className="table-cell-sub">{proj.site_location}</div>
                    </td>
                    <td>₹{(budget / 10000000).toFixed(2)} Cr</td>
                    <td className={isOverBudget ? 'text-rose font-bold' : ''}>
                      ₹{(spent / 10000000).toFixed(2)} Cr
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="table-mini-track">
                          <div 
                            className={`dubai-progress-bar ${isDelayed ? 'bar-rose' : 'bar-gold'}`} 
                            style={{ width: `${prog}%` }}
                          ></div>
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700 }}>{prog}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-tag ${isDelayed ? 'tag-rose' : isOverBudget ? 'tag-amber' : 'tag-green'}`}>
                        <span className="status-dot"></span>
                        {isDelayed ? 'Critical Delay' : isOverBudget ? 'Over Budget' : 'On Track'}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        color: isDelayed ? '#EF4444' : isOverBudget ? '#D97706' : '#10B981' 
                      }}>
                        {isDelayed ? 'Utility Clearance Pending' : isOverBudget ? 'Budget Review Needed' : 'Maintain Pace'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Progress Reports (DPR) Feed Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <FileSpreadsheet size={18} className="gold-text" />
            <h3>Daily Progress Reports (DPR) Submission Feed</h3>
          </div>
          <span className="glass-pill" style={{ padding: '3px 12px', fontSize: '11px', fontWeight: 700 }}>
            {dprReports.length} Submitted Logs
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Date & Site</th>
                <th>Milestone Activity</th>
                <th>Work Scope Logs</th>
                <th>Progress %</th>
                <th>Supervisor</th>
                <th>Weather</th>
                <th>Bottlenecks</th>
              </tr>
            </thead>
            <tbody>
              {dprReports.map(d => (
                <tr key={d.id}>
                  <td>
                    <div className="table-cell-title">{d.project_name}</div>
                    <div className="table-cell-sub">{new Date(d.report_date).toLocaleDateString('en-IN')}</div>
                  </td>
                  <td>
                    <span className="status-tag tag-cyan">
                      {d.milestone_activity}
                    </span>
                  </td>
                  <td style={{ color: '#475569', fontSize: '12px', maxWidth: '280px' }}>
                    {d.work_description}
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#2563EB' }}>
                      {d.progress_percent_achieved}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>
                      {d.supervisor_name || 'Site Incharge'}
                    </span>
                  </td>
                  <td>
                    <span className="glass-pill" style={{ padding: '2px 8px', fontSize: '10.5px' }}>
                      <Sun size={11} color="#F59E0B" style={{ display: 'inline', marginRight: '4px' }} />
                      {d.weather || 'Sunny'}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 600, 
                      color: d.issues_or_delays && d.issues_or_delays.toLowerCase() !== 'none' ? '#EF4444' : '#10B981' 
                    }}>
                      {d.issues_or_delays || 'None'}
                    </span>
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
