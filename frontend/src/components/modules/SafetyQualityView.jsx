import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  Plus, 
  Building2,
  HardHat,
  Filter,
  ArrowLeft,
  Check,
  RefreshCw,
  Search,
  Sparkles,
  ClipboardCheck,
  Flame,
  FileCheck2
} from 'lucide-react';

export default function SafetyQualityView() {
  const [activeTab, setActiveTab] = useState('SAFETY');
  const [selectedSite, setSelectedSite] = useState('ALL_SITES');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Persist Safety Audits in localStorage
  const [safetyItems, setSafetyItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sitepilot_safety_audits');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'SAF-01', item: 'Mandatory PPE Compliance (Helmets, Safety Shoes & Reflective Jackets)', site: 'Skyline Commercial Hub', inspector: 'Safety Officer Er. Amit Joshi', status: 'PASS', score: 98, date: '13 Nov, 2026', note: 'All 140 workers compliant' },
      { id: 'SAF-02', item: 'Edge Protection & Perimeter Safety Nets (Floors 3 to 6)', site: 'Skyline Commercial Hub', inspector: 'Safety Officer Er. Amit Joshi', status: 'PASS', score: 100, date: '12 Nov, 2026', note: 'Toe boards installed firmly' },
      { id: 'SAF-03', item: 'Temporary Electrical Distribution Board & Earthing Check', site: 'Grand Horizon Enclave', inspector: 'Er. Suresh Verma', status: 'NEEDS_ACTION', score: 82, date: '11 Nov, 2026', note: 'Earth resistance test spike loose at Tower B' },
      { id: 'SAF-04', item: 'Scaffolding Coupler Clamping & Base Plate Stability Audit', site: 'Mahakal Metro Package', inspector: 'Safety Officer Er. Amit Joshi', status: 'PASS', score: 95, date: '10 Nov, 2026', note: 'Tag system green' },
    ];
  });

  // Persist Snags in localStorage
  const [snags, setSnags] = useState(() => {
    try {
      const saved = localStorage.getItem('sitepilot_quality_snags');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'SNG-201', site: 'Skyline Commercial Hub', location: 'Tower A, Flat 302, Master Bath', defect: 'Tile grouting void and hairline crack in shower area', priority: 'MEDIUM', trade: 'Masonry / Tiling', status: 'OPEN', raisedBy: 'Quality Audit Team', assignedTo: 'Rameshwar Tiling Agency' },
      { id: 'SNG-200', site: 'Skyline Commercial Hub', location: 'Corridor 4th Floor', defect: 'Electrical switch plate misalignment & paint spray marks', priority: 'LOW', trade: 'Finishing / Paint', status: 'RESOLVED', raisedBy: 'Site Incharge', assignedTo: 'Apex Painters' },
      { id: 'SNG-199', site: 'Grand Horizon Enclave', location: 'Tower B Main Lobby', defect: 'Granite skirting chipping at main entrance threshold', priority: 'HIGH', trade: 'Stone Work', status: 'IN_PROGRESS', raisedBy: 'Quality Audit Team', assignedTo: 'Royal Granite Works' },
      { id: 'SNG-198', site: 'Mahakal Metro Package', location: 'Pier Cap 48 Anchor Pocket', defect: 'Honeycombing void on lower soffit of pier cap', priority: 'CRITICAL', trade: 'Concrete Finishing', status: 'IN_PROGRESS', raisedBy: 'Metro Quality Inspection', assignedTo: 'Apex Civil Group' },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sitepilot_safety_audits', JSON.stringify(safetyItems));
    } catch (e) {
      console.error(e);
    }
  }, [safetyItems]);

  useEffect(() => {
    try {
      localStorage.setItem('sitepilot_quality_snags', JSON.stringify(snags));
    } catch (e) {
      console.error(e);
    }
  }, [snags]);

  // Form states
  const [auditForm, setAuditForm] = useState({
    item: '',
    site: 'Skyline Commercial Hub',
    inspector: 'Safety Officer Er. Amit Joshi',
    score: '95',
    status: 'PASS',
    note: ''
  });

  const [snagForm, setSnagForm] = useState({
    location: '',
    site: 'Skyline Commercial Hub',
    defect: '',
    trade: 'Masonry / Tiling',
    priority: 'HIGH',
    assignedTo: '',
    raisedBy: 'Quality Audit Inspector'
  });

  const handleCreateAudit = (e) => {
    e.preventDefault();
    const created = {
      id: `SAF-${String(safetyItems.length + 1).padStart(2, '0')}`,
      item: auditForm.item,
      site: auditForm.site,
      inspector: auditForm.inspector,
      status: auditForm.status,
      score: parseInt(auditForm.score) || 90,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      note: auditForm.note || 'All protocols inspected'
    };

    setSafetyItems([created, ...safetyItems]);
    setSuccessMsg(`Safety audit "${created.id}" recorded with score ${created.score}%!`);
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddModal(false);
    }, 1200);

    setAuditForm({
      item: '',
      site: 'Skyline Commercial Hub',
      inspector: 'Safety Officer Er. Amit Joshi',
      score: '95',
      status: 'PASS',
      note: ''
    });
  };

  const handleCreateSnag = (e) => {
    e.preventDefault();
    const created = {
      id: `SNG-${202 + snags.length}`,
      site: snagForm.site,
      location: snagForm.location,
      defect: snagForm.defect,
      trade: snagForm.trade,
      priority: snagForm.priority,
      status: 'OPEN',
      raisedBy: snagForm.raisedBy,
      assignedTo: snagForm.assignedTo || 'Designated Trade Contractor'
    };

    setSnags([created, ...snags]);
    setSuccessMsg(`Defect "${created.id}" logged and assigned to ${created.assignedTo}!`);
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddModal(false);
    }, 1200);

    setSnagForm({
      location: '',
      site: 'Skyline Commercial Hub',
      defect: '',
      trade: 'Masonry / Tiling',
      priority: 'HIGH',
      assignedTo: '',
      raisedBy: 'Quality Audit Inspector'
    });
  };

  // Status transitions for snags
  const advanceSnagStatus = (snagId) => {
    setSnags(snags.map(s => {
      if (s.id === snagId) {
        if (s.status === 'OPEN') return { ...s, status: 'IN_PROGRESS' };
        if (s.status === 'IN_PROGRESS') return { ...s, status: 'RESOLVED' };
        if (s.status === 'RESOLVED') return { ...s, status: 'OPEN' };
      }
      return s;
    }));
  };

  // Filtered lists
  const filteredAudits = selectedSite === 'ALL_SITES' 
    ? safetyItems 
    : safetyItems.filter(s => s.site === selectedSite);

  const filteredSnags = selectedSite === 'ALL_SITES' 
    ? snags 
    : snags.filter(s => s.site === selectedSite);

  // KPIs
  const avgCompliance = filteredAudits.length > 0 
    ? (filteredAudits.reduce((acc, s) => acc + (s.score || 90), 0) / filteredAudits.length).toFixed(1) 
    : '96.4';
  const openSnagsCount = filteredSnags.filter(s => s.status !== 'RESOLVED').length;
  const resolvedSnagsCount = filteredSnags.filter(s => s.status === 'RESOLVED').length;

  // Dedicated Full-Screen Add View
  if (showAddModal) {
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
              onClick={() => setShowAddModal(false)}
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
              <span>Back to Safety & Snags</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                {activeTab === 'SAFETY' ? (
                  <span>Conduct Site Safety <span className="amp">&</span> OSHA Audit</span>
                ) : (
                  <span>Log Quality Snag <span className="amp">&</span> Defect Punch-List</span>
                )}
              </h1>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                {activeTab === 'SAFETY' 
                  ? 'Record on-site PPE compliance, barricade stability, and safety clearance verification'
                  : 'Report architectural finishing defects, tile cracks, or concrete honeycombing with trade assignment'}
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setShowAddModal(false)}
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

        {activeTab === 'SAFETY' ? (
          /* Safety Audit Form */
          <form onSubmit={handleCreateAudit} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}>
            <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  AUDIT CHECKPOINT / PROTOCOL *
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Mandatory PPE Compliance (Helmets, Safety Harness & Gloves)"
                  value={auditForm.item} 
                  onChange={e => setAuditForm({ ...auditForm, item: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    CONSTRUCTION SITE *
                  </label>
                  <select
                    value={auditForm.site}
                    onChange={e => setAuditForm({ ...auditForm, site: e.target.value })}
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
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    AUDIT COMPLIANCE SCORE (%)
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    required
                    value={auditForm.score} 
                    onChange={e => setAuditForm({ ...auditForm, score: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(203, 213, 225, 0.8)',
                      background: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    SAFETY OFFICER / INSPECTOR *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={auditForm.inspector} 
                    onChange={e => setAuditForm({ ...auditForm, inspector: e.target.value })}
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
                    AUDIT CLEARANCE STATUS *
                  </label>
                  <select
                    value={auditForm.status}
                    onChange={e => setAuditForm({ ...auditForm, status: e.target.value })}
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
                    <option value="PASS">PASS (Compliant)</option>
                    <option value="NEEDS_ACTION">NEEDS ACTION (Corrective Notice)</option>
                    <option value="FAILED">FAILED (Stop Work Order)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  OBSERVATIONS & HAZARD MITIGATION NOTE
                </label>
                <textarea 
                  rows="3"
                  placeholder="Note specific safety violations, perimeter net tensioning, or fire extinguisher validity checks..."
                  value={auditForm.note} 
                  onChange={e => setAuditForm({ ...auditForm, note: e.target.value })}
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

            {/* Right Safety Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-card" style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>
                    Safety Audit Card Preview
                  </span>
                  <span className={`status-tag ${auditForm.status === 'PASS' ? 'tag-green' : 'tag-rose'}`}>
                    {auditForm.status}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {auditForm.item || 'Safety Checkpoint Protocol Preview'}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Location: <b>{auditForm.site}</b> • Inspector: <b>{auditForm.inspector}</b>
                  </div>
                </div>

                <div style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>COMPLIANCE SCORE</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: parseInt(auditForm.score) >= 90 ? '#10B981' : '#EF4444' }}>
                      {auditForm.score || 0}%
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, fontSize: '12px' }}>
                    <ShieldCheck size={18} />
                    <span>OSHA Verified</span>
                  </div>
                </div>

                {auditForm.note && (
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                    Note: {auditForm.note}
                  </p>
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
                  <span>Authorize & Publish Safety Audit</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
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
        ) : (
          /* Snag Defect Form */
          <form onSubmit={handleCreateSnag} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}>
            <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  DEFECT DESCRIPTION *
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Tile grouting void and hairline crack in shower area"
                  value={snagForm.defect} 
                  onChange={e => setSnagForm({ ...snagForm, defect: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    CONSTRUCTION SITE *
                  </label>
                  <select
                    value={snagForm.site}
                    onChange={e => setSnagForm({ ...snagForm, site: e.target.value })}
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
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    SPECIFIC LOCATION / FLAT / TOWER *
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Tower A, Flat 302, Master Bath"
                    value={snagForm.location} 
                    onChange={e => setSnagForm({ ...snagForm, location: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    TRADE RESPONSIBLE *
                  </label>
                  <select
                    value={snagForm.trade}
                    onChange={e => setSnagForm({ ...snagForm, trade: e.target.value })}
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
                    <option value="Masonry / Tiling">Masonry / Tiling</option>
                    <option value="Finishing / Paint">Finishing / Painting</option>
                    <option value="Stone Work">Stone Work & Granite</option>
                    <option value="Concrete Finishing">Concrete & Honeycombing</option>
                    <option value="Electrical">Electrical Fixtures</option>
                    <option value="Plumbing">Plumbing & Sanitary</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    DEFECT SEVERITY / PRIORITY *
                  </label>
                  <select
                    value={snagForm.priority}
                    onChange={e => setSnagForm({ ...snagForm, priority: e.target.value })}
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
                    <option value="CRITICAL">CRITICAL (Immediate Structural/Safety)</option>
                    <option value="HIGH">HIGH (Must fix before handover)</option>
                    <option value="MEDIUM">MEDIUM (Aesthetic / finishing)</option>
                    <option value="LOW">LOW (Minor touchup)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  ASSIGNED SUBCONTRACTOR / TRADE AGENCY
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Rameshwar Tiling Agency"
                  value={snagForm.assignedTo} 
                  onChange={e => setSnagForm({ ...snagForm, assignedTo: e.target.value })}
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

            {/* Right Snag Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-card" style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                    Quality Snag Card Preview
                  </span>
                  <span className="status-tag tag-amber">
                    OPEN
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {snagForm.defect || 'Defect Description Preview'}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Location: <b>{snagForm.location || 'Site Location'}</b> ({snagForm.site})
                  </div>
                </div>

                <div style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>TRADE RESPONSIBLE</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{snagForm.trade}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>PRIORITY</span>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: snagForm.priority === 'CRITICAL' || snagForm.priority === 'HIGH' ? '#EF4444' : '#D97706' }}>
                      {snagForm.priority}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Assigned To: <strong>{snagForm.assignedTo || 'Designated Subcontractor'}</strong>
                </div>
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
                  <span>Log Snag & Issue Rectification Order</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
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
        )}
      </div>
    );
  }

  // Standard Safety & Quality View
  return (
    <div className="module-view-container animate-fade-in">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Site Safety Inspections <span className="amp">&</span> Quality Snag List</h2>
          <p className="module-subtitle">Daily OSHA site safety audits, PPE compliance scoring, finishing snag punch-lists <span className="amp">&</span> trade rectification workflows</p>
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

          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              onClick={() => setActiveTab('SAFETY')}
              className="glass-pill"
              style={{ padding: '8px 16px', background: activeTab === 'SAFETY' ? '#0F172A' : 'rgba(255,255,255,0.6)', color: activeTab === 'SAFETY' ? '#fff' : '#475569', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
            >
              🛡️ Safety Audits ({filteredAudits.length})
            </button>
            <button 
              onClick={() => setActiveTab('SNAG')}
              className="glass-pill"
              style={{ padding: '8px 16px', background: activeTab === 'SNAG' ? '#0F172A' : 'rgba(255,255,255,0.6)', color: activeTab === 'SNAG' ? '#fff' : '#475569', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
            >
              📋 Quality Snags ({filteredSnags.length})
            </button>
          </div>

          <button className="btn-dubai-gold" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>{activeTab === 'SAFETY' ? 'Conduct Audit' : 'Log New Snag'}</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Safe Man-Hours</span><span className="fin-icon-pill icon-green"><ShieldCheck size={18} /></span></div>
          <div className="fin-val text-green">148,200 Hrs</div>
          <div className="fin-sub">Zero lost-time injuries (LTI) streak</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Audit Compliance</span><span className="fin-icon-pill icon-gold"><CheckCircle2 size={18} /></span></div>
          <div className="fin-val">{avgCompliance}%</div>
          <div className="fin-sub">Average score on PPE & edge barrier audits</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Open Quality Snags</span><span className="fin-icon-pill icon-rose"><AlertTriangle size={18} /></span></div>
          <div className="fin-val text-rose">{openSnagsCount} Active Defects</div>
          <div className="fin-sub">Punch list items awaiting trade rectifications</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Rectified & Cleared</span><span className="fin-icon-pill icon-amber"><HardHat size={18} /></span></div>
          <div className="fin-val text-amber">{resolvedSnagsCount} Defects Closed</div>
          <div className="fin-sub">Signed off by finish contractors</div>
        </div>
      </div>

      {/* Safety Table */}
      {activeTab === 'SAFETY' ? (
        <div className="dubai-card clear-table-card">
          <div className="table-header-bar">
            <div className="table-title-group">
              <ShieldCheck size={18} className="gold-text" />
              <h3>Daily Site Safety <span className="amp">&</span> PPE Audit Checklist</h3>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
              Showing {filteredAudits.length} safety inspections
            </span>
          </div>

          <div className="dubai-table-wrap">
            <table className="dubai-table">
              <thead>
                <tr>
                  <th>Audit Checkpoint & Protocol</th>
                  <th>Site Location</th>
                  <th>Safety Inspector</th>
                  <th>Audit Date</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudits.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="table-cell-title">{s.item}</div>
                      {s.note && <div style={{ fontSize: '11px', color: s.status === 'PASS' ? '#64748B' : '#EF4444', marginTop: '2px' }}>Note: {s.note}</div>}
                    </td>
                    <td><b>{s.site}</b></td>
                    <td>{s.inspector}</td>
                    <td>{s.date}</td>
                    <td>
                      <b style={{ color: s.score >= 90 ? '#10B981' : '#EF4444' }}>{s.score}%</b>
                    </td>
                    <td>
                      <span className={`status-tag ${s.status === 'PASS' ? 'tag-green' : 'tag-rose'}`}>
                        <span className="status-dot"></span>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Quality Snags Table */
        <div className="dubai-card clear-table-card">
          <div className="table-header-bar">
            <div className="table-title-group">
              <AlertTriangle size={18} className="gold-text" />
              <h3>Finishing Snag <span className="amp">&</span> Defect Punch-List Workflow</h3>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
              Showing {filteredSnags.length} registered defects
            </span>
          </div>

          <div className="dubai-table-wrap">
            <table className="dubai-table">
              <thead>
                <tr>
                  <th>Snag ID & Location</th>
                  <th>Defect Description</th>
                  <th>Trade Responsible</th>
                  <th>Assigned Agency</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSnags.map(sn => (
                  <tr key={sn.id}>
                    <td>
                      <div className="table-cell-title">{sn.location}</div>
                      <div className="table-cell-sub">{sn.id} • {sn.site}</div>
                    </td>
                    <td style={{ color: '#0F172A', fontWeight: 600 }}>{sn.defect}</td>
                    <td><span className="trade-pill">{sn.trade}</span></td>
                    <td><span style={{ color: '#475569', fontSize: '12px' }}>{sn.assignedTo}</span></td>
                    <td>
                      <span style={{ 
                        fontWeight: 800, 
                        color: sn.priority === 'CRITICAL' ? '#EF4444' : sn.priority === 'HIGH' ? '#DC2626' : '#D97706', 
                        fontSize: '11.5px',
                        background: sn.priority === 'CRITICAL' ? 'rgba(254, 242, 242, 0.9)' : 'transparent',
                        padding: '2px 6px',
                        borderRadius: '6px'
                      }}>
                        {sn.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag ${sn.status === 'RESOLVED' ? 'tag-green' : sn.status === 'IN_PROGRESS' ? 'tag-cyan' : 'tag-amber'}`}>
                        <span className="status-dot"></span>
                        {sn.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => advanceSnagStatus(sn.id)}
                        className="glass-pill"
                        style={{
                          padding: '5px 12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: sn.status === 'OPEN' ? '#2563EB' : sn.status === 'IN_PROGRESS' ? '#10B981' : '#64748B',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {sn.status === 'OPEN' && <span>Start Fix →</span>}
                        {sn.status === 'IN_PROGRESS' && <span>Verify & Close ✓</span>}
                        {sn.status === 'RESOLVED' && <span>Reopen ↺</span>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
