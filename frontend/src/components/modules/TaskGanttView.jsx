import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Building2, 
  ArrowRight, 
  ArrowLeft,
  TrendingUp, 
  Filter,
  Check,
  Edit2,
  FileText,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function TaskGanttView() {
  const [selectedSite, setSelectedSite] = useState('Skyline Commercial Hub');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAdd, setShowAdd] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);

  // Persist milestones in localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('sitepilot_construction_milestones');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, site: 'Skyline Commercial Hub', name: 'Site Excavation & Basement Retaining Wall', phase: 'Foundation', start: '2026-01-01', end: '2026-02-28', progress: 100, status: 'COMPLETED', lead: 'Apex Foundation Team', weight: 15, demandTrigger: 'Demand Note #01 (Booking Confirmation)' },
      { id: 2, site: 'Skyline Commercial Hub', name: 'Pile Cap & Raft Concrete Pouring', phase: 'Substructure', start: '2026-03-01', end: '2026-04-15', progress: 100, status: 'COMPLETED', lead: 'Apex Civil Group', weight: 20, demandTrigger: 'Demand Note #02 (Raft Casting)' },
      { id: 3, site: 'Skyline Commercial Hub', name: 'Tower A RCC Frame (Floors 1-6)', phase: 'Superstructure', start: '2026-04-20', end: '2026-08-15', progress: 85, status: 'IN_PROGRESS', lead: 'Devendra Shuttering Agency', weight: 25, demandTrigger: 'Demand Note #03 (5th Floor Slab)' },
      { id: 4, site: 'Skyline Commercial Hub', name: 'External AAC Block Masonry & Brickwork', phase: 'Masonry', start: '2026-07-01', end: '2026-10-30', progress: 65, status: 'IN_PROGRESS', lead: 'Rameshwar Mason Crew', weight: 15, demandTrigger: 'Demand Note #04 (Brickwork Completion)' },
      { id: 5, site: 'Skyline Commercial Hub', name: 'Electrical Conduits & Plumbing Shafts', phase: 'MEP Infrastructure', start: '2026-08-15', end: '2026-12-15', progress: 40, status: 'DELAYED', lead: 'Polycab MEP Contractors', weight: 15, demandTrigger: 'Demand Note #05 (Rough Plumbing & Piping)' },
      { id: 6, site: 'Skyline Commercial Hub', name: 'Internal Gypsum Plaster & Floor Screed', phase: 'Finishing', start: '2026-11-01', end: '2027-02-28', progress: 15, status: 'UPCOMING', lead: 'Finishing Wing', weight: 10, demandTrigger: 'Demand Note #06 (Flooring & Plaster)' },
      { id: 7, site: 'Grand Horizon Enclave', name: 'Deep Bore Pile Foundations & Shoring', phase: 'Foundation', start: '2026-02-15', end: '2026-05-30', progress: 90, status: 'IN_PROGRESS', lead: 'Horizon Geotech', weight: 30, demandTrigger: 'Phase 1 Piling Sign-off' },
      { id: 8, site: 'Mahakal Metro Package', name: 'Prestressed Pier Cap Erection (Pier 42-60)', phase: 'Superstructure', start: '2026-03-01', end: '2026-09-30', progress: 70, status: 'IN_PROGRESS', lead: 'Metro Heavy Lift Div', weight: 35, demandTrigger: 'Package C Stage 2 Payment' }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sitepilot_construction_milestones', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  const [newMilestone, setNewMilestone] = useState({
    name: '',
    phase: 'Superstructure',
    site: 'Skyline Commercial Hub',
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lead: '',
    weight: '15',
    demandTrigger: ''
  });

  const handleCreateMilestone = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      name: newMilestone.name,
      phase: newMilestone.phase,
      site: newMilestone.site,
      start: newMilestone.start,
      end: newMilestone.end,
      progress: 0,
      status: 'UPCOMING',
      lead: newMilestone.lead || 'Site Engineering Team',
      weight: parseFloat(newMilestone.weight) || 10,
      demandTrigger: newMilestone.demandTrigger || 'Standard Milestone Verification'
    };

    setTasks([...tasks, created]);
    setSuccessMsg(`Milestone "${created.name}" created and added to master schedule!`);
    setTimeout(() => {
      setSuccessMsg('');
      setShowAdd(false);
    }, 1200);

    setNewMilestone({
      name: '',
      phase: 'Superstructure',
      site: 'Skyline Commercial Hub',
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lead: '',
      weight: '15',
      demandTrigger: ''
    });
  };

  const handleUpdateProgress = (id, newProgress) => {
    const val = Math.min(100, Math.max(0, parseInt(newProgress) || 0));
    setTasks(tasks.map(t => {
      if (t.id === id) {
        let newStatus = t.status;
        if (val === 100) newStatus = 'COMPLETED';
        else if (val > 0) newStatus = 'IN_PROGRESS';
        else newStatus = 'UPCOMING';

        return { ...t, progress: val, status: newStatus };
      }
      return t;
    }));
  };

  const handleToggleStatus = (id, currentStatus) => {
    const statusCycle = {
      'UPCOMING': 'IN_PROGRESS',
      'IN_PROGRESS': 'COMPLETED',
      'COMPLETED': 'DELAYED',
      'DELAYED': 'IN_PROGRESS'
    };
    const nextStatus = statusCycle[currentStatus] || 'IN_PROGRESS';
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const progress = nextStatus === 'COMPLETED' ? 100 : t.progress;
        return { ...t, status: nextStatus, progress };
      }
      return t;
    }));
  };

  // Filter tasks
  const siteTasks = selectedSite === 'ALL_SITES' 
    ? tasks 
    : tasks.filter(t => t.site === selectedSite);

  const filteredTasks = siteTasks.filter(t => {
    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
  });

  // Calculate weighted progress
  const totalWeight = siteTasks.reduce((s, t) => s + (t.weight || 10), 0) || 1;
  const weightedProgress = Math.round(siteTasks.reduce((s, t) => s + (t.progress * (t.weight || 10)), 0) / totalWeight) || 0;
  const completedCount = siteTasks.filter(t => t.status === 'COMPLETED').length;
  const delayedCount = siteTasks.filter(t => t.status === 'DELAYED').length;
  const activeCount = siteTasks.filter(t => t.status === 'IN_PROGRESS').length;

  // Dedicated Full-Screen Add Milestone Page
  if (showAdd) {
    return (
      <div className="module-view-container animate-fade-in" style={{ paddingBottom: '60px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              type="button"
              onClick={() => setShowAdd(false)}
              className="glass-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '12px',
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
              <span>Back to Gantt Schedule</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Schedule Construction Milestone & Critical Path
              </h1>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Set up work package timelines, assign contractor execution leads, and link customer billing triggers
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setShowAdd(false)}
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

        {successMsg && (
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
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.12)',
            marginBottom: '20px'
          }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateMilestone} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left Form */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                MILESTONE / WORK PACKAGE TITLE *
              </label>
              <input 
                type="text" 
                required 
                placeholder="e.g. 7th Floor Slab Casting & Shuttering De-shuttering"
                value={newMilestone.name} 
                onChange={e => setNewMilestone({ ...newMilestone, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  CONSTRUCTION SITE *
                </label>
                <select
                  value={newMilestone.site}
                  onChange={e => setNewMilestone({ ...newMilestone, site: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
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
                  <option value="Grand Horizon Enclave">Grand Horizon Enclave</option>
                  <option value="Mahakal Metro Package">Mahakal Metro Package</option>
                  <option value="Chamunda Industrial Park">Chamunda Industrial Park</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  CONSTRUCTION PHASE *
                </label>
                <select
                  value={newMilestone.phase}
                  onChange={e => setNewMilestone({ ...newMilestone, phase: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  <option value="Foundation">Foundation & Earthwork</option>
                  <option value="Substructure">Substructure & Raft</option>
                  <option value="Superstructure">Superstructure & RCC Frame</option>
                  <option value="Masonry">Brickwork & AAC Masonry</option>
                  <option value="MEP Infrastructure">MEP Conduits & Plumbing</option>
                  <option value="Finishing">Plaster & Flooring</option>
                  <option value="Handover">Testing & Client Handover</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  START DATE *
                </label>
                <input 
                  type="date" 
                  required
                  value={newMilestone.start} 
                  onChange={e => setNewMilestone({ ...newMilestone, start: e.target.value })}
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
                  TARGET COMPLETION DATE *
                </label>
                <input 
                  type="date" 
                  required
                  value={newMilestone.end} 
                  onChange={e => setNewMilestone({ ...newMilestone, end: e.target.value })}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  ASSIGNED CONTRACTOR / EXECUTION LEAD *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Devendra Shuttering Agency"
                  value={newMilestone.lead} 
                  onChange={e => setNewMilestone({ ...newMilestone, lead: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
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
                  WEIGHTAGE (%) *
                </label>
                <input 
                  type="number" 
                  required
                  placeholder="15"
                  value={newMilestone.weight} 
                  onChange={e => setNewMilestone({ ...newMilestone, weight: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                LINKED CUSTOMER / RA BILLING STAGE TRIGGER (OPTIONAL)
              </label>
              <input 
                type="text" 
                placeholder="e.g. Triggers Demand Note #04 (Upon 100% Casting Sign-off)"
                value={newMilestone.demandTrigger} 
                onChange={e => setNewMilestone({ ...newMilestone, demandTrigger: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
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

          {/* Right Preview Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Milestone Gantt Preview
                </span>
                <span className="status-tag tag-cyan">
                  UPCOMING
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  {newMilestone.phase}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '2px 0 6px 0' }}>
                  {newMilestone.name || 'Milestone Title Preview'}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Site: <b>{newMilestone.site}</b> • Lead: <b>{newMilestone.lead || 'Site Engineering Team'}</b>
                </div>
              </div>

              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>SCHEDULE DURATION</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                    {newMilestone.start} → {newMilestone.end}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>PROJECT WEIGHT</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#2563EB' }}>
                    {newMilestone.weight || 15}%
                  </div>
                </div>
              </div>

              {newMilestone.demandTrigger && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#16A34A', fontWeight: 600 }}>
                  <ShieldCheck size={14} />
                  <span>Linked: {newMilestone.demandTrigger}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.28)'
                }}
              >
                <Plus size={16} />
                <span>Publish Milestone to Schedule</span>
              </button>

              <button 
                type="button" 
                onClick={() => setShowAdd(false)}
                className="btn-cancel"
                style={{
                  width: '100%',
                  padding: '11px 24px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#64748B',
                  background: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  cursor: 'pointer'
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

  // Standard Gantt View
  return (
    <div className="module-view-container animate-fade-in">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Task Scheduling <span className="amp">&</span> Gantt Timeline</h2>
          <p className="module-subtitle">Milestone dependencies, critical path tracking, interactive work completion sliders <span className="amp">&</span> delay alerts</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select 
            className="select-filter-dubai"
            value={selectedSite}
            onChange={e => setSelectedSite(e.target.value)}
          >
            <option value="ALL_SITES">All Active Sites</option>
            <option value="Skyline Commercial Hub">Skyline Commercial Hub</option>
            <option value="Grand Horizon Enclave">Grand Horizon Enclave</option>
            <option value="Mahakal Metro Package">Mahakal Metro Package</option>
          </select>
          <button className="btn-dubai-gold" onClick={() => setShowAdd(true)}>
            <Plus size={16} />
            <span>Schedule Milestone</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Overall Weighted Progress</span><span className="fin-icon-pill icon-gold"><TrendingUp size={18} /></span></div>
          <div className="fin-val">{weightedProgress}%</div>
          <div className="fin-sub">Completion score against master baseline</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Completed Milestones</span><span className="fin-icon-pill icon-green"><CheckCircle2 size={18} /></span></div>
          <div className="fin-val text-green">{completedCount} Major Phases</div>
          <div className="fin-sub">Sign-off certificates recorded</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Active Work Packages</span><span className="fin-icon-pill icon-amber"><Clock size={18} /></span></div>
          <div className="fin-val text-amber">{activeCount} On-site Crews</div>
          <div className="fin-sub">In-progress execution teams</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Critical Path Lag</span><span className="fin-icon-pill icon-rose"><AlertTriangle size={18} /></span></div>
          <div className="fin-val text-rose">{delayedCount > 0 ? `${delayedCount} Packages Delayed` : '0 Lag'}</div>
          <div className="fin-sub">{delayedCount > 0 ? 'Requires overtime pour acceleration' : 'Schedule on track'}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: `All Milestones (${siteTasks.length})` },
          { id: 'IN_PROGRESS', label: `In Progress (${activeCount})` },
          { id: 'DELAYED', label: `Delayed Lag (${delayedCount})` },
          { id: 'COMPLETED', label: `Completed (${completedCount})` },
          { id: 'UPCOMING', label: `Upcoming (${siteTasks.filter(t => t.status === 'UPCOMING').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className="glass-pill"
            style={{
              padding: '7px 16px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              background: statusFilter === tab.id ? '#0F172A' : 'rgba(255, 255, 255, 0.65)',
              color: statusFilter === tab.id ? '#ffffff' : '#64748B',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Gantt Timeline Card */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Calendar size={18} className="gold-text" />
            <h3>Master Construction Timeline <span className="amp">&</span> Progress Sliders</h3>
          </div>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
            {selectedSite === 'ALL_SITES' ? 'All Active Sites' : selectedSite}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
          {filteredTasks.map(t => {
            const isDone = t.status === 'COMPLETED';
            const isDelayed = t.status === 'DELAYED';

            return (
              <div 
                key={t.id} 
                style={{ 
                  padding: '18px 22px', 
                  borderRadius: '18px', 
                  background: 'rgba(255, 255, 255, 0.65)', 
                  border: isDelayed ? '1px solid rgba(239, 68, 68, 0.4)' : isDone ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {t.phase}
                      </span>
                      <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>•</span>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                        {t.site}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '3px 0 0 0' }}>
                      {t.name}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                      {t.start} → {t.end}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(t.id, t.status)}
                      className={`status-tag ${isDone ? 'tag-green' : isDelayed ? 'tag-rose' : 'tag-cyan'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Click to toggle status cycle"
                    >
                      <span className="status-dot"></span>
                      {t.status}
                    </button>
                  </div>
                </div>

                {/* Interactive Progress Slider & Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(248, 250, 252, 0.8)', padding: '10px 14px', borderRadius: '12px' }}>
                  <Sliders size={16} color="#64748B" />
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={t.progress}
                    onChange={e => handleUpdateProgress(t.id, e.target.value)}
                    style={{
                      flex: 1,
                      accentColor: isDone ? '#10B981' : isDelayed ? '#EF4444' : '#2563EB',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handleUpdateProgress(t.id, Math.max(0, t.progress - 10))}
                      style={{ padding: '2px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(t.id, Math.min(100, t.progress + 10))}
                      style={{ padding: '2px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      +10%
                    </button>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', minWidth: '45px', textAlign: 'right' }}>
                    {t.progress}%
                  </span>
                </div>

                {/* Footer Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '11.5px', color: '#64748B' }}>
                  <div>
                    Assigned Agency: <b>{t.lead}</b> • Weight: <b>{t.weight || 10}%</b>
                  </div>
                  {t.demandTrigger && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isDone ? '#16A34A' : '#2563EB', fontWeight: 600 }}>
                      <FileText size={13} />
                      <span>{t.demandTrigger}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
