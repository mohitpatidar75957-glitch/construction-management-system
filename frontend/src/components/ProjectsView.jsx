import React, { useEffect, useState } from 'react';
import { api, DEFAULT_PROJECTS } from '../api/client';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  User, 
  HardHat,
  Trash2,
  X,
  Sparkles,
  ShieldCheck,
  FileText,
  TrendingUp,
  Layers,
  Check
} from 'lucide-react';

export default function ProjectsView() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Scope Variations (Extra Work Orders) State
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [projectSubTab, setProjectSubTab] = useState('OVERVIEW');
  const [variations, setVariations] = useState([]);
  const [variationForm, setVariationForm] = useState({
    scope_title: '',
    variation_amount: '',
    category: 'Civil Addition',
    work_order_ref: '',
    approval_date: new Date().toISOString().split('T')[0],
    approved_by: '',
    description: ''
  });

  const getVariationsForProject = (projectId) => {
    try {
      const stored = localStorage.getItem(`sitepilot_variations_${projectId}`);
      if (stored) {
        return JSON.parse(stored);
      }
      // Demo initial variation for Project 1
      if (projectId === 1 || String(projectId) === '1') {
        const demoVars = [
          {
            id: 'VO-101',
            scope_title: 'Terrace Waterproofing & Solar Panel Staging Support',
            variation_amount: 500000,
            category: 'Civil Addition',
            work_order_ref: 'CR-SKY-2026-04',
            approval_date: '2026-10-18',
            approved_by: 'Er. Rajesh Verma (Client PM)',
            description: 'Client expanded contract scope to add elastomeric membrane waterproofing on Tower A terrace and reinforced steel mounting pedestals for rooftop solar installation.'
          }
        ];
        localStorage.setItem(`sitepilot_variations_${projectId}`, JSON.stringify(demoVars));
        return demoVars;
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  const saveVariationsForProject = (projectId, newVars) => {
    try {
      localStorage.setItem(`sitepilot_variations_${projectId}`, JSON.stringify(newVars));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  };

  const handleSelectProject = (proj) => {
    const vars = getVariationsForProject(proj.id);
    setVariations(vars);
    setProjectSubTab('OVERVIEW');
    setSelectedProject(proj);
  };

  const handleAddVariation = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(variationForm.variation_amount) || 0;
    if (amountNum <= 0) {
      alert("Please enter a valid positive variation amount.");
      return;
    }

    const newVar = {
      id: `VO-${Date.now().toString().slice(-4)}`,
      scope_title: variationForm.scope_title || 'Additional Client Work Scope',
      variation_amount: amountNum,
      category: variationForm.category || 'Civil Addition',
      work_order_ref: variationForm.work_order_ref || `CR-${selectedProject.project_code}-${Date.now().toString().slice(-3)}`,
      approval_date: variationForm.approval_date || new Date().toISOString().split('T')[0],
      approved_by: variationForm.approved_by || selectedProject.client_name || 'Client Authority',
      description: variationForm.description || 'Client requested and authorized extra construction work scope.'
    };

    const updatedVars = [newVar, ...variations];
    setVariations(updatedVars);
    saveVariationsForProject(selectedProject.id, updatedVars);

    // Calculate new total budget
    const updatedBudget = (parseFloat(selectedProject.budget) || 0) + amountNum;
    
    // Update selectedProject in state
    const updatedProject = {
      ...selectedProject,
      budget: updatedBudget
    };
    setSelectedProject(updatedProject);

    // Update main projects list
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));

    // Sync with backend API
    if (api && api.updateProject) {
      api.updateProject(selectedProject.id, {
        ...updatedProject,
        budget: updatedBudget
      }).catch(err => console.warn("API updateProject fallback:", err));
    }

    // Reset form & close modal
    setVariationForm({
      scope_title: '',
      variation_amount: '',
      category: 'Civil Addition',
      work_order_ref: '',
      approval_date: new Date().toISOString().split('T')[0],
      approved_by: '',
      description: ''
    });
    setShowVariationModal(false);
  };

  const handleDeleteVariation = (varId) => {
    if (!window.confirm("Are you sure you want to revert/remove this scope variation order?")) return;
    const target = variations.find(v => v.id === varId);
    if (!target) return;

    const updatedVars = variations.filter(v => v.id !== varId);
    setVariations(updatedVars);
    saveVariationsForProject(selectedProject.id, updatedVars);

    const updatedBudget = Math.max(0, (parseFloat(selectedProject.budget) || 0) - (target.variation_amount || 0));
    const updatedProject = {
      ...selectedProject,
      budget: updatedBudget
    };
    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));

    if (api && api.updateProject) {
      api.updateProject(selectedProject.id, {
        ...updatedProject,
        budget: updatedBudget
      }).catch(err => console.warn("API updateProject fallback:", err));
    }
  };

  const [formData, setFormData] = useState({
    project_name: '',
    project_code: '',
    site_location: '',
    client_name: '',
    contractor_name: '',
    budget: '',
    start_date: new Date().toISOString().split('T')[0],
    completion_date: '',
    status: 'IN_PROGRESS',
    progress_percent: 10
  });

  const loadProjects = () => {
    setLoading(true);
    api.getProjects()
      .then(res => {
        setProjects(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    api.createProject({
      ...formData,
      budget: parseFloat(formData.budget) || 0,
      progress_percent: parseInt(formData.progress_percent, 10) || 0
    }).then(() => {
      setShowAddModal(false);
      loadProjects();
      setFormData({
        project_name: '',
        project_code: '',
        site_location: '',
        client_name: '',
        contractor_name: '',
        budget: '',
        start_date: new Date().toISOString().split('T')[0],
        completion_date: '',
        status: 'IN_PROGRESS',
        progress_percent: 10
      });
    });
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this construction site?")) {
      api.deleteProject(id).then(() => {
        setSelectedProject(null);
        loadProjects();
      });
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading all construction sites...</div>;
  }

  // =========================================================================
  // 1. FULL-SCREEN / FULL-VIEW REGISTER NEW SITE (Website Theme Matching)
  // =========================================================================
  if (showAddModal) {
    const budgetNum = Number(formData.budget) || 0;
    const progressVal = Number(formData.progress_percent) || 0;

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
              onClick={() => setShowAddModal(false)}
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
              <span>Back to Sites</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Register New Construction Site
              </h1>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setShowAddModal(false)}
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

        {/* 2-Column Full Screen Form & Real-time Live Blueprint Card */}
        <form onSubmit={handleCreate} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          
          {/* Left Column: Form Controls inside Glass Card */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Project Identity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  PROJECT NAME
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Skyline Commercial Hub (Phase 2)"
                  value={formData.project_name} 
                  onChange={e => setFormData({ ...formData, project_name: e.target.value })}
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
                  PROJECT CODE
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="PRJ-IND-05"
                  value={formData.project_code} 
                  onChange={e => setFormData({ ...formData, project_code: e.target.value.toUpperCase() })}
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
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  SITE LOCATION (CITY & CORRIDOR)
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Super Corridor, Indore"
                  value={formData.site_location} 
                  onChange={e => setFormData({ ...formData, site_location: e.target.value })}
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
                  GROUNDBREAKING DATE
                </label>
                <input 
                  type="date" 
                  value={formData.start_date} 
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
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
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                <span>TOTAL ESTIMATED CONTRACT BUDGET (₹ INR)</span>
                <span style={{ color: '#2563EB', fontWeight: 600 }}>Enter in Crores or Lakhs</span>
              </label>
              
              {/* Clean Flex Prefix Input (No text overlap) */}
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
                  value={formData.budget} 
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>Presets:</span>
                {[20000000, 50000000, 100000000, 250000000, 500000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: String(val) })}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(203, 213, 225, 0.7)',
                      background: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '10.5px',
                      fontWeight: 600,
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
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  CLIENT / DEVELOPER ENTITY
                </label>
                <input 
                  type="text" 
                  placeholder="Skyline Real Estate Developers"
                  value={formData.client_name} 
                  onChange={e => setFormData({ ...formData, client_name: e.target.value })}
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
                  GENERAL CONTRACTOR FIRM
                </label>
                <input 
                  type="text" 
                  placeholder="Apex Civil Infratech Pvt Ltd"
                  value={formData.contractor_name} 
                  onChange={e => setFormData({ ...formData, contractor_name: e.target.value })}
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
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  PORTFOLIO STAGE / STATUS
                </label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
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
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                  <span>INITIAL PROGRESS %</span>
                  <span style={{ color: '#2563EB', fontWeight: 800 }}>{formData.progress_percent}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={formData.progress_percent} 
                  onChange={e => setFormData({ ...formData, progress_percent: e.target.value })}
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
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.35))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Site Card Preview
                </span>
                <span className="proj-code-pill">
                  {formData.project_code || 'PRJ-CODE'}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {formData.project_name || 'Project Name Preview'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  <MapPin size={13} color="#2563EB" />
                  <span>{formData.site_location || 'City / Location'}</span>
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
                    {formData.client_name || 'Developer'}
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
                <span>Launch & Register Construction Site</span>
              </button>

              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
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
  // 2. FULL-SCREEN PROJECT INTELLIGENCE & SCOPE VARIATIONS VIEW
  // =========================================================================
  if (selectedProject) {
    const totalVariationsAmount = variations.reduce((sum, v) => sum + (Number(v.variation_amount) || 0), 0);
    const totalContractBudget = Number(selectedProject.budget) || 0;
    const baseContractBudget = Math.max(0, totalContractBudget - totalVariationsAmount);
    const spentAmount = Number(selectedProject.spent) || 0;
    const remainingBudget = Math.max(0, totalContractBudget - spentAmount);
    const spentPercent = totalContractBudget > 0 ? Math.min(100, Math.round((spentAmount / totalContractBudget) * 100)) : 0;

    // =========================================================================
    // A. FULL-SCREEN RECORD SCOPE VARIATION / EXTRA WORK ORDER PAGE
    // =========================================================================
    if (showVariationModal) {
      const enteredVarAmount = parseFloat(variationForm.variation_amount) || 0;
      const projectedTotalBudget = totalContractBudget + enteredVarAmount;
      const budgetExpansionPct = totalContractBudget > 0 ? ((enteredVarAmount / totalContractBudget) * 100).toFixed(2) : 0;

      return (
        <div className="module-view-container animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Top Navigation Bar */}
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
                onClick={() => setShowVariationModal(false)}
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
                <span>Back to Project Details</span>
              </button>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="proj-code-pill">{selectedProject.project_code}</span>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    Record Scope Variation / Extra Work Order
                  </h1>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, marginTop: '3px' }}>
                  Log client-approved additional work scope & expand project contract value for <strong>{selectedProject.project_name}</strong>
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowVariationModal(false)}
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

          {/* 2-Column Full Screen Form & Live Budget Impact Blueprint */}
          <form onSubmit={handleAddVariation} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
            gap: '24px', 
            alignItems: 'start' 
          }}>
            
            {/* Left Column: Scope Variation Details */}
            <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Step 1: Scope Title */}
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  SCOPE TITLE / WORK ITEM *
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Additional 4th Floor Electrical & Plumbing Lines"
                  value={variationForm.scope_title} 
                  onChange={e => setVariationForm({ ...variationForm, scope_title: e.target.value })}
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

              {/* Step 2: Amount with Currency Prefix & Quick Presets */}
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>ADDITIONAL CONTRACT AMOUNT (₹ INR) *</span>
                  <span style={{ color: '#2563EB', fontWeight: 600 }}>Directly added to project contract ceiling</span>
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
                    min="1"
                    placeholder="500000"
                    value={variationForm.variation_amount} 
                    onChange={e => setVariationForm({ ...variationForm, variation_amount: e.target.value })}
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
                  {[50000, 100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setVariationForm({ ...variationForm, variation_amount: String(val) })}
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
                      ₹{val >= 10000000 ? `${val / 10000000} Cr` : `${val / 100000} Lakh${val / 100000 > 1 ? 's' : ''}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Category & Work Order Ref */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    WORK CATEGORY
                  </label>
                  <select
                    value={variationForm.category}
                    onChange={e => setVariationForm({ ...variationForm, category: e.target.value })}
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
                    <option value="Civil Addition">Civil Addition</option>
                    <option value="Electrical & Power">Electrical & Power</option>
                    <option value="Plumbing & Drainage">Plumbing & Drainage</option>
                    <option value="HVAC & Fire Safety">HVAC & Fire Safety</option>
                    <option value="Interior & Finishing">Interior & Finishing</option>
                    <option value="Structural & Waterproofing">Structural & Waterproofing</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    CLIENT ORDER / REFERENCE #
                  </label>
                  <input 
                    type="text" 
                    placeholder="CR-2026-08 / Client Letter Ref"
                    value={variationForm.work_order_ref}
                    onChange={e => setVariationForm({ ...variationForm, work_order_ref: e.target.value })}
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

              {/* Step 4: Approval Date & Authorized By */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    CLIENT APPROVAL DATE
                  </label>
                  <input 
                    type="date" 
                    value={variationForm.approval_date}
                    onChange={e => setVariationForm({ ...variationForm, approval_date: e.target.value })}
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
                    AUTHORIZED BY (CLIENT REPRESENTATIVE)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Er. Rajesh Verma (Client PM)"
                    value={variationForm.approved_by}
                    onChange={e => setVariationForm({ ...variationForm, approved_by: e.target.value })}
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

              {/* Step 5: Description */}
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  SCOPE EXPANSION DETAILS & WORK JUSTIFICATION
                </label>
                <textarea 
                  rows="3"
                  placeholder="Describe the additional work requested by client (e.g. client requested expansion of 4th floor terrace waterproofing and extra electrical line with dedicated sub-meter)..."
                  value={variationForm.description}
                  onChange={e => setVariationForm({ ...variationForm, description: e.target.value })}
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

            {/* Right Column: Live Contract Budget Impact Blueprint & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Live Contract Budget Impact Card */}
              <div className="glass-card" style={{ 
                padding: '24px', 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.45))',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Budget Impact Preview
                  </span>
                  <span className="proj-code-pill">
                    {variationForm.work_order_ref || 'VO-DRAFT'}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {variationForm.scope_title || 'New Work Item Preview'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    <MapPin size={13} color="#2563EB" />
                    <span>{selectedProject.site_location}</span>
                    <span>•</span>
                    <span>{variationForm.category}</span>
                  </div>
                </div>

                {/* Financial Before & After Comparison */}
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ color: '#64748B' }}>Current Contract Budget:</span>
                    <span style={{ fontWeight: 700, color: '#334155' }}>
                      ₹{totalContractBudget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ color: '#16A34A', fontWeight: 600 }}>Proposed Addition (+ VO):</span>
                    <span style={{ fontWeight: 800, color: '#16A34A' }}>
                      + ₹{enteredVarAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div style={{ 
                    borderTop: '1px dashed #CBD5E1', 
                    paddingTop: '10px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'baseline' 
                  }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                      Revised Total Contract:
                    </span>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB' }}>
                      ₹{projectedTotalBudget.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Expansion Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: enteredVarAmount > 0 ? '#DCFCE7' : '#F1F5F9',
                  color: enteredVarAmount > 0 ? '#15803D' : '#64748B',
                  fontSize: '11px',
                  fontWeight: 700,
                  width: 'fit-content'
                }}>
                  <TrendingUp size={13} />
                  <span>+{budgetExpansionPct}% Contract Ceiling Increase</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                  <ShieldCheck size={14} />
                  <span>Change order will be permanently appended to site audit history</span>
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
                  <span>Authorize & Add to Contract Budget</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => setShowVariationModal(false)}
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
                  Cancel & Return to Project
                </button>
              </div>

            </div>

          </form>

        </div>
      );
    }

    return (
      <div className="module-view-container animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* Top Navigation & Actions Bar */}
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
              onClick={() => setSelectedProject(null)}
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
              <span>Back to All Projects</span>
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span className="proj-code-pill">{selectedProject.project_code}</span>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                  {selectedProject.project_name}
                </h1>
                <span className="status-tag tag-green">
                  <span className="status-dot"></span>
                  {selectedProject.status === 'COMPLETED' ? 'Completed' : selectedProject.status === 'ON_HOLD' ? 'On Hold' : 'Active Site'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12.5px', color: '#64748B', marginTop: '4px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#2563EB" /> {selectedProject.site_location}
                </span>
                <span>•</span>
                <span>Client: <strong>{selectedProject.client_name || 'Skyline Corp'}</strong></span>
                <span>•</span>
                <span>Contractor: <strong>{selectedProject.contractor_name || 'Apex Builders Pvt Ltd'}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button"
              onClick={() => setShowVariationModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '9999px',
                border: 'none',
                background: '#0F172A',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(15, 23, 42, 0.2)'
              }}
            >
              <Plus size={16} />
              <span>Add Scope Variation (Extra Work)</span>
            </button>

            <button 
              type="button"
              onClick={(e) => handleDelete(selectedProject.id, e)}
              className="glass-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#EF4444',
                background: 'rgba(254, 242, 242, 0.7)',
                border: '1px solid rgba(254, 202, 202, 0.8)',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={14} />
              <span>Delete Site</span>
            </button>
          </div>
        </div>

        {/* Row 1: 4 Contract Financial Intelligence Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
          
          {/* Card 1: Revised Total Contract Value */}
          <div className="glass-card" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.85), rgba(255, 255, 255, 0.75))', border: '1px solid rgba(191, 219, 254, 0.85)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Revised Total Contract Value
              </span>
              <span className="glass-pill" style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 700, color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)' }}>
                Active Budget
              </span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '4px 0' }}>
              ₹{totalContractBudget.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
              Base Tender + {variations.length} Approved Variation{variations.length === 1 ? '' : 's'}
            </div>
          </div>

          {/* Card 2: Base Contract (Original) */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Base Contract (Original)
              </span>
              <span className="glass-pill" style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 700, color: '#475569' }}>
                Initial Tender
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#334155', letterSpacing: '-0.02em', margin: '4px 0' }}>
              ₹{baseContractBudget.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B' }}>
              Initial agreement prior to scope expansions
            </div>
          </div>

          {/* Card 3: Approved Scope Variations (Extra Work) */}
          <div className="glass-card" style={{ padding: '20px', background: totalVariationsAmount > 0 ? 'linear-gradient(135deg, rgba(240, 253, 244, 0.85), rgba(255, 255, 255, 0.75))' : undefined, border: totalVariationsAmount > 0 ? '1px solid rgba(187, 247, 208, 0.85)' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: totalVariationsAmount > 0 ? '#16A34A' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Approved Scope Variations
              </span>
              <span className="glass-pill" style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 700, color: totalVariationsAmount > 0 ? '#16A34A' : '#64748B', background: totalVariationsAmount > 0 ? 'rgba(22, 163, 74, 0.1)' : undefined }}>
                + Extra Work
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: totalVariationsAmount > 0 ? '#15803D' : '#64748B', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {totalVariationsAmount > 0 ? `+ ₹${totalVariationsAmount.toLocaleString('en-IN')}` : '₹0'}
            </div>
            <div style={{ fontSize: '11.5px', color: totalVariationsAmount > 0 ? '#16A34A' : '#94A3B8', fontWeight: 600 }}>
              {variations.length > 0 ? `${variations.length} Client Variation Order(s) logged` : 'No variations added yet'}
            </div>
          </div>

          {/* Card 4: Capital Spent & Balance Buffer */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Capital Spent & Buffer
              </span>
              <span className="glass-pill" style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 700, color: '#D97706', background: 'rgba(217, 119, 6, 0.1)' }}>
                {spentPercent}% Utilized
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', letterSpacing: '-0.02em', margin: '4px 0' }}>
              ₹{spentAmount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B' }}>
              Remaining buffer: <strong>₹{remainingBudget.toLocaleString('en-IN')}</strong>
            </div>
          </div>

        </div>

        {/* Row 2: Overall Construction Progress Bar Highlight */}
        <div className="glass-card" style={{ padding: '22px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#2563EB" />
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Overall Construction Execution</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#64748B', flexWrap: 'wrap' }}>
              <span>Start: <strong>{selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString('en-IN') : 'N/A'}</strong></span>
              <span>•</span>
              <span>Target Handover: <strong>{selectedProject.completion_date ? new Date(selectedProject.completion_date).toLocaleDateString('en-IN') : 'N/A'}</strong></span>
              <span>•</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{selectedProject.progress_percent}% Achieved</span>
            </div>
          </div>

          <div className="dubai-progress-track" style={{ height: '10px', borderRadius: '9999px', background: '#E2E8F0' }}>
            <div 
              className="dubai-progress-bar bar-gold" 
              style={{ width: `${selectedProject.progress_percent}%`, height: '100%', borderRadius: '9999px' }}
            ></div>
          </div>
        </div>

        {/* Project Detail Subtabs Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', paddingBottom: '10px', flexWrap: 'wrap' }}>
          <button 
            type="button"
            onClick={() => setProjectSubTab('OVERVIEW')}
            className="glass-pill"
            style={{
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 700,
              background: projectSubTab === 'OVERVIEW' ? '#0F172A' : 'rgba(255, 255, 255, 0.65)',
              color: projectSubTab === 'OVERVIEW' ? '#ffffff' : '#475569',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📊 Scope Variations ({variations.length})
          </button>

          <button 
            type="button"
            onClick={() => setProjectSubTab('BOQ')}
            className="glass-pill"
            style={{
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 700,
              background: projectSubTab === 'BOQ' ? '#0F172A' : 'rgba(255, 255, 255, 0.65)',
              color: projectSubTab === 'BOQ' ? '#ffffff' : '#475569',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🧮 Site BOQ & Takeoffs
          </button>

          <button 
            type="button"
            onClick={() => setProjectSubTab('MILESTONES')}
            className="glass-pill"
            style={{
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 700,
              background: projectSubTab === 'MILESTONES' ? '#0F172A' : 'rgba(255, 255, 255, 0.65)',
              color: projectSubTab === 'MILESTONES' ? '#ffffff' : '#475569',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📅 Construction Milestones
          </button>

          <button 
            type="button"
            onClick={() => setProjectSubTab('SAFETY')}
            className="glass-pill"
            style={{
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 700,
              background: projectSubTab === 'SAFETY' ? '#0F172A' : 'rgba(255, 255, 255, 0.65)',
              color: projectSubTab === 'SAFETY' ? '#ffffff' : '#475569',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🛡️ Safety & Quality Snags
          </button>
        </div>

        {/* Row 3: Subtab Content Switcher */}
        {projectSubTab === 'OVERVIEW' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px', alignItems: 'start' }}>
          
          {/* Left Column: Scope Variations & Extra Work Orders (VO Management) */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Client Scope Variations & Extra Work Orders (VO Log)
                </h3>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '4px 0 0 0' }}>
                  Client approvals for expanded work scopes, site additions & contract budget increments
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setShowVariationModal(true)}
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
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
                <span>Add Variation</span>
              </button>
            </div>

            {/* List of Variations */}
            {variations.length === 0 ? (
              <div style={{
                padding: '36px 20px',
                textAlign: 'center',
                background: 'rgba(248, 250, 252, 0.6)',
                borderRadius: '16px',
                border: '1px dashed #CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FileText size={28} color="#94A3B8" />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
                  No Scope Variations Recorded Yet
                </span>
                <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
                  If the client orders additional work (e.g. adding ₹5 Lakhs to a ₹1 Cr contract), click <strong>"+ Add Variation"</strong> to log the scope change, automatically increase the total contract budget, and maintain full client billing transparency.
                </p>
                <button
                  type="button"
                  onClick={() => setShowVariationModal(true)}
                  className="btn-glass-pill"
                  style={{ marginTop: '8px', padding: '7px 18px', fontSize: '12px', fontWeight: 700, color: '#0F172A' }}
                >
                  <Plus size={13} style={{ marginRight: '4px', display: 'inline' }} />
                  Record First Scope Variation
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {variations.map((v, idx) => (
                  <div 
                    key={v.id || idx}
                    style={{
                      padding: '16px 18px',
                      background: 'rgba(255, 255, 255, 0.75)',
                      borderRadius: '14px',
                      border: '1px solid rgba(226, 232, 240, 0.85)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          padding: '2px 8px', 
                          borderRadius: '6px', 
                          background: '#EFF6FF', 
                          color: '#2563EB', 
                          fontSize: '11px', 
                          fontWeight: 800 
                        }}>
                          {v.work_order_ref || v.id}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: '#F1F5F9',
                          color: '#475569',
                          fontSize: '10.5px',
                          fontWeight: 700
                        }}>
                          {v.category || 'Civil Work'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                          Approved: {v.approval_date ? new Date(v.approval_date).toLocaleDateString('en-IN') : 'Recent'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A' }}>
                          + ₹{Number(v.variation_amount).toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariation(v.id)}
                          title="Remove Variation"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            borderRadius: '6px',
                            color: '#EF4444',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                        {v.scope_title}
                      </h4>
                      {v.description && (
                        <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                          {v.description}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', paddingTop: '6px', borderTop: '1px dashed #F1F5F9', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} color="#16A34A" /> Approved by: <strong>{v.approved_by || selectedProject.client_name || 'Client Representative'}</strong>
                      </span>
                      <span style={{ color: '#16A34A', fontWeight: 700 }}>
                        Added to Contract Budget
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Project Specifications & Entities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#2563EB" />
                Contract & Legal Entities
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                <div style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px' }}>
                  <span style={{ display: 'block', fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>CLIENT / DEVELOPER ENTITY</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{selectedProject.client_name || 'Skyline Real Estate'}</span>
                </div>

                <div style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px' }}>
                  <span style={{ display: 'block', fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>GENERAL CONTRACTOR FIRM</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{selectedProject.contractor_name || 'Apex Civil Infratech'}</span>
                </div>

                <div style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px' }}>
                  <span style={{ display: 'block', fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>SITE LOCATION (CITY & CORRIDOR)</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{selectedProject.site_location}</span>
                </div>

                <div style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px' }}>
                  <span style={{ display: 'block', fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>SITE TELEMETRY STATUS</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }}></span>
                    Active Live GPS & IndexedDB Syncing
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Helper Tip on Scope Changes */}
            <div className="glass-card" style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.6), rgba(255, 255, 255, 0.7))', border: '1px solid rgba(253, 230, 138, 0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={16} color="#D97706" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#92400E' }}>Construction VO Policy</span>
              </div>
              <p style={{ fontSize: '11.5px', color: '#78350F', margin: 0, lineHeight: 1.5 }}>
                All approved scope variations are automatically added to the active contract value. Bills and material requisitions referencing this site will reflect the expanded budget ceiling in real time.
              </p>
            </div>
          </div>

        </div>
        )}

        {/* Subtab 2: Site BOQ & Material Takeoffs */}
        {projectSubTab === 'BOQ' && (
          <div className="glass-card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Site Bill of Quantities (BOQ) & Material Takeoffs
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                Engineering baseline quantities vs actual site consumption for {selectedProject.project_name}
              </p>
            </div>

            <div className="dubai-table-wrap">
              <table className="dubai-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Est. Qty</th>
                    <th>Actual Qty</th>
                    <th>Est. Rate</th>
                    <th>Actual Incurred</th>
                    <th>Variance %</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: 'M30 Grade RMC Concrete', cat: 'Concrete', unit: 'Cum', estQ: 3200, actQ: 3450, estR: 5200, actTotal: 18457500, estTotal: 16640000 },
                    { item: 'Fe550D TMT Reinforcement Steel', cat: 'Steel', unit: 'MT', estQ: 280, actQ: 295, estR: 59000, actTotal: 17257500, estTotal: 16520000 },
                    { item: '200mm AAC Lightweight Blocks', cat: 'Masonry', unit: 'Cum', estQ: 950, actQ: 920, estR: 3100, actTotal: 2852000, estTotal: 2945000 },
                    { item: 'Internal 12mm Gypsum Plaster', cat: 'Finishing', unit: 'Sqm', estQ: 18500, actQ: 14200, estR: 145, actTotal: 1988000, estTotal: 2682500 },
                    { item: 'Formwork & Structural Scaffolding', cat: 'Shuttering', unit: 'Sqm', estQ: 24000, actQ: 22000, estR: 180, actTotal: 4070000, estTotal: 4320000 },
                  ].map((b, idx) => {
                    const varPct = (((b.actTotal - b.estTotal) / b.estTotal) * 100).toFixed(1);
                    const isOver = parseFloat(varPct) > 0;
                    return (
                      <tr key={idx}>
                        <td><b>{b.item}</b></td>
                        <td><span className="trade-pill">{b.cat}</span></td>
                        <td>{b.unit}</td>
                        <td>{b.estQ.toLocaleString('en-IN')}</td>
                        <td><b>{b.actQ.toLocaleString('en-IN')}</b></td>
                        <td>₹{b.estR.toLocaleString('en-IN')}</td>
                        <td><b>₹{(b.actTotal / 100000).toFixed(2)} L</b></td>
                        <td>
                          <span className={`status-tag ${isOver ? 'tag-rose' : 'tag-green'}`}>
                            {isOver ? `+${varPct}%` : `${varPct}%`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subtab 3: Milestones & Construction Schedule */}
        {projectSubTab === 'MILESTONES' && (
          <div className="glass-card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Construction Milestones & Work Package Progress
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                Execution schedule and linked customer payment triggers for {selectedProject.project_name}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'Basement Excavation & Raft Concrete Pouring', phase: 'Substructure', start: '01 Jan, 2026', end: '15 Apr, 2026', progress: 100, status: 'COMPLETED', lead: 'Apex Civil Group', trigger: 'Booking Stage Clearance' },
                { name: 'Tower A RCC Frame & Slab Casting (Floors 1-6)', phase: 'Superstructure', start: '20 Apr, 2026', end: '15 Aug, 2026', progress: 85, status: 'IN_PROGRESS', lead: 'Devendra Shuttering', trigger: 'Triggers Customer 15% Demand Note' },
                { name: 'External AAC Block Masonry & Brickwork', phase: 'Masonry', start: '01 Jul, 2026', end: '30 Oct, 2026', progress: 65, status: 'IN_PROGRESS', lead: 'Rameshwar Mason Crew', trigger: 'Triggers Brickwork Demand Note' },
                { name: 'Electrical Conduits & Plumbing Utility Shafts', phase: 'MEP Infrastructure', start: '15 Aug, 2026', end: '15 Dec, 2026', progress: 40, status: 'DELAYED', lead: 'Polycab MEP Contractors', trigger: 'Rough MEP Inspection NOC' },
                { name: 'Internal Gypsum Plaster & Floor Screed', phase: 'Finishing', start: '01 Nov, 2026', end: '28 Feb, 2027', progress: 15, status: 'UPCOMING', lead: 'Finishing Wing', trigger: 'Pre-Handover Verification' },
              ].map((m, idx) => (
                <div key={idx} style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(226, 232, 240, 0.9)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>{m.phase}</span>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>{m.name}</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>{m.start} → {m.end}</span>
                      <span className={`status-tag ${m.status === 'COMPLETED' ? 'tag-green' : m.status === 'DELAYED' ? 'tag-rose' : 'tag-cyan'}`}>
                        {m.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${m.progress}%`, background: m.status === 'COMPLETED' ? '#10B981' : m.status === 'DELAYED' ? '#EF4444' : '#2563EB', borderRadius: '9999px' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', minWidth: '40px', textAlign: 'right' }}>{m.progress}%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                    <span>Assigned: <b>{m.lead}</b></span>
                    <span style={{ color: '#16A34A', fontWeight: 600 }}>Linked: {m.trigger}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtab 4: Safety & Quality Record */}
        {projectSubTab === 'SAFETY' && (
          <div className="glass-card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Quality Snags & Site Safety Record
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                Active punch-list defects, trade assignments and OSHA safety compliance for {selectedProject.project_name}
              </p>
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
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'SNG-201', loc: 'Tower A, Flat 302, Master Bath', defect: 'Tile grouting void and hairline crack in shower area', trade: 'Masonry / Tiling', agency: 'Rameshwar Tiling Agency', priority: 'MEDIUM', status: 'OPEN' },
                    { id: 'SNG-200', loc: 'Corridor 4th Floor', defect: 'Electrical switch plate misalignment & paint spray marks', trade: 'Finishing / Paint', agency: 'Apex Painters', priority: 'LOW', status: 'RESOLVED' },
                    { id: 'SAF-01', loc: 'Perimeter Safety Nets (Floors 3 to 6)', defect: 'Edge protection mesh tightened and verified', trade: 'Safety Protocol', agency: 'Safety Officer Er. Amit Joshi', priority: 'HIGH', status: 'PASS' }
                  ].map((s, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="table-cell-title">{s.loc}</div>
                        <div className="table-cell-sub">{s.id}</div>
                      </td>
                      <td style={{ color: '#0F172A', fontWeight: 600 }}>{s.defect}</td>
                      <td><span className="trade-pill">{s.trade}</span></td>
                      <td>{s.agency}</td>
                      <td>
                        <span style={{ fontWeight: 800, color: s.priority === 'HIGH' ? '#EF4444' : '#D97706', fontSize: '11px' }}>
                          {s.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-tag ${s.status === 'RESOLVED' || s.status === 'PASS' ? 'tag-green' : 'tag-amber'}`}>
                          {s.status}
                        </span>
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

  // =========================================================================
  // 3. MAIN SITES & PROJECTS DIRECTORY VIEW
  // =========================================================================
  return (
    <div className="module-view-container">
      {/* Action Header */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">All Construction Projects & Sites</h2>
          <p className="module-subtitle">Click on any site to view complete project intelligence, budget and milestones</p>
        </div>
        <button className="btn-dubai-gold" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          <span>Launch New Site</span>
        </button>
      </div>

      {/* 4 Interactive Site Cards Grid */}
      <div className="all-sites-grid">
        {projects.map(proj => {
          const progress = Number(proj.progress_percent);
          const isDelayed = proj.status === 'ON_HOLD' || progress < 40;
          const isAlmostComplete = progress >= 90;

          const statusBadge = isAlmostComplete ? 'Almost Complete' : isDelayed ? 'Delayed' : 'On Track';
          const badgeClass = isAlmostComplete ? 'tag-purple' : isDelayed ? 'tag-rose' : 'tag-green';

          return (
            <div 
              key={proj.id} 
              className="dubai-card project-overview-card"
              onClick={() => handleSelectProject(proj)}
            >
              <div className="proj-card-header">
                <div className="proj-code-pill">{proj.project_code}</div>
                <span className={`status-tag ${badgeClass}`}>
                  <span className="status-dot"></span>
                  {statusBadge}
                </span>
              </div>

              <h3 className="proj-card-title">{proj.project_name}</h3>
              
              <div className="proj-location-row">
                <MapPin size={14} className="gold-text" />
                <span>{proj.site_location}</span>
              </div>

              <div className="proj-progress-section">
                <div className="progress-label-row">
                  <span className="text-muted">Work Completed</span>
                  <span className="progress-percent-bold">{progress}%</span>
                </div>
                <div className="dubai-progress-track">
                  <div 
                    className={`dubai-progress-bar ${isDelayed ? 'bar-rose' : 'bar-gold'}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="proj-finance-summary">
                <div className="fin-col">
                  <span className="fin-mini-label">Budget</span>
                  <span className="fin-mini-val">₹{(Number(proj.budget) / 10000000).toFixed(2)} Cr</span>
                </div>
                <div className="fin-col">
                  <span className="fin-mini-label">Spent</span>
                  <span className="fin-mini-val text-amber">₹{(Number(proj.spent) / 10000000).toFixed(2)} Cr</span>
                </div>
              </div>

              <div className="proj-card-footer">
                <span className="view-details-action">
                  <span>View Complete Details</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Site Master Directory Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Building2 size={18} className="gold-text" />
            <h3>Site Master Directory</h3>
          </div>
          <span className="glass-pill" style={{ padding: '3px 12px', fontSize: '11px', fontWeight: 700 }}>
            {projects.length} Registered Sites
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Site & Project Code</th>
                <th>Location</th>
                <th>Contract Budget</th>
                <th>Current Spent</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const prog = Number(p.progress_percent);
                const isDel = p.status === 'ON_HOLD' || prog < 40;

                return (
                  <tr key={p.id} className="clickable-row" onClick={() => handleSelectProject(p)}>
                    <td>
                      <div className="table-cell-title">{p.project_name}</div>
                      <div className="table-cell-sub">{p.project_code} • {p.client_name || 'Client Corp'}</div>
                    </td>
                    <td>
                      <div className="table-cell-title">{p.site_location}</div>
                    </td>
                    <td>
                      <div className="table-cell-title">₹{(Number(p.budget) / 10000000).toFixed(2)} Cr</div>
                    </td>
                    <td>
                      <div className="table-cell-title text-amber">₹{(Number(p.spent) / 10000000).toFixed(2)} Cr</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="table-mini-track">
                          <div 
                            className={`dubai-progress-bar ${isDel ? 'bar-rose' : 'bar-gold'}`} 
                            style={{ width: `${prog}%` }}
                          ></div>
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700 }}>{prog}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-tag ${isDel ? 'tag-rose' : 'tag-green'}`}>
                        <span className="status-dot"></span>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-delete-row" 
                        title="Delete Site" 
                        onClick={(e) => handleDelete(p.id, e)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
