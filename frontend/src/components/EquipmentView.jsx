import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { 
  Truck, 
  Plus, 
  Trash2, 
  Fuel, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  IndianRupee,
  ArrowLeft,
  ShieldCheck,
  User,
  Clock
} from 'lucide-react';

export default function EquipmentView() {
  const [equipment, setEquipment] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const defaultFleet = [
    { id: 1, equipment_name: 'JCB 3DX Super Backhoe Loader', model_no: 'JCB-3DX-2024', ownership: 'RENTED', daily_rental_cost: 4500, fuel_litres_per_day: 35, status: 'OPERATIONAL', operator_name: 'Raju Dhakad', project_name: 'Skyline Commercial Hub', last_service_date: '05 Nov, 2026' },
    { id: 2, equipment_name: 'Schwing Stetter Concrete Transit Mixer (6 Cum)', model_no: 'AM6SH-N', ownership: 'OWNED', daily_rental_cost: 0, fuel_litres_per_day: 45, status: 'OPERATIONAL', operator_name: 'Devendra Yadav', project_name: 'Skyline Commercial Hub', last_service_date: '02 Nov, 2026' },
    { id: 3, equipment_name: 'Potain Top-Slewing Tower Crane (50m Jib)', model_no: 'MCT-85', ownership: 'RENTED', daily_rental_cost: 12000, fuel_litres_per_day: 0, status: 'OPERATIONAL', operator_name: 'Er. Manoj Verma', project_name: 'Palm Residency', last_service_date: '10 Oct, 2026' },
    { id: 4, equipment_name: 'Sany Hydraulic Rotary Piling Rig', model_no: 'SR-215', ownership: 'RENTED', daily_rental_cost: 28000, fuel_litres_per_day: 65, status: 'MAINTENANCE', operator_name: 'Kailash Sharma', project_name: 'Grand Horizon Enclave', last_service_date: '11 Nov, 2026' },
    { id: 5, equipment_name: 'Tata LPK 1618 Tipper Dumper (10 Wheeler)', model_no: 'Tata-1618', ownership: 'OWNED', daily_rental_cost: 0, fuel_litres_per_day: 40, status: 'OPERATIONAL', operator_name: 'Vikram Singh', project_name: 'Mahakal Metro Package', last_service_date: '01 Nov, 2026' },
  ];

  const [formData, setFormData] = useState({
    project_id: '1',
    equipment_name: '',
    model_no: '',
    ownership: 'RENTED',
    daily_rental_cost: '',
    fuel_litres_per_day: '35',
    status: 'OPERATIONAL',
    operator_name: '',
    last_service_date: new Date().toISOString().split('T')[0]
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getEquipment().catch(() => []), api.getProjects().catch(() => [])])
      .then(([eqRes, projRes]) => {
        if (eqRes && eqRes.length > 0) {
          setEquipment(eqRes);
        } else {
          setEquipment(defaultFleet);
        }
        if (projRes && projRes.length > 0) {
          setProjects(projRes);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEq = {
      id: equipment.length + 1,
      equipment_name: formData.equipment_name,
      model_no: formData.model_no || 'Standard',
      ownership: formData.ownership,
      daily_rental_cost: parseFloat(formData.daily_rental_cost) || 0,
      fuel_litres_per_day: parseFloat(formData.fuel_litres_per_day) || 30,
      status: formData.status,
      operator_name: formData.operator_name || 'Assigned Operator',
      project_name: projects.find(p => String(p.id) === String(formData.project_id))?.project_name || 'Skyline Commercial Hub',
      last_service_date: formData.last_service_date
    };

    api.createEquipment(formData).catch(console.error);
    setEquipment([newEq, ...equipment]);
    setShowModal(false);
    setFormData({
      project_id: '1',
      equipment_name: '',
      model_no: '',
      ownership: 'RENTED',
      daily_rental_cost: '',
      fuel_litres_per_day: '35',
      status: 'OPERATIONAL',
      operator_name: '',
      last_service_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete machinery record?')) {
      api.deleteEquipment(id).catch(console.error);
      setEquipment(equipment.filter(e => e.id !== id));
    }
  };

  const totalFuelDaily = equipment.reduce((sum, e) => sum + Number(e.fuel_litres_per_day || 0), 0);
  const totalRentalDaily = equipment.reduce((sum, e) => sum + Number(e.daily_rental_cost || 0), 0);
  const operationalCount = equipment.filter(e => e.status === 'OPERATIONAL').length;

  // =========================================================================
  // 1. FULL-SCREEN / FULL-VIEW DEPLOY MACHINERY PAGE
  // =========================================================================
  if (showModal) {
    const rentCost = Number(formData.daily_rental_cost) || 0;
    const fuelLtrs = Number(formData.fuel_litres_per_day) || 0;

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
              <span>Back to Machinery</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Deploy Heavy Plant & Machinery Fleet
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
          
          {/* Left Column: Form Controls inside Glass Card */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Equipment Name & Model */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  MACHINERY NAME / TYPE
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="JCB 3DX Backhoe Loader or Tata Dumper"
                  value={formData.equipment_name} 
                  onChange={e => setFormData({ ...formData, equipment_name: e.target.value })}
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
                  MODEL / REGISTRATION NO
                </label>
                <input 
                  type="text" 
                  placeholder="MP-09-GF-4821"
                  value={formData.model_no} 
                  onChange={e => setFormData({ ...formData, model_no: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#2563EB',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Ownership & Site Allocation */}
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  FLEET OWNERSHIP
                </label>
                <select 
                  value={formData.ownership} 
                  onChange={e => setFormData({ ...formData, ownership: e.target.value })}
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
                  <option value="RENTED">Rented / Leased Plant</option>
                  <option value="OWNED">Company Owned Asset</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  DEPLOYED SITE LOCATION
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
                  {projects.length === 0 && (
                    <>
                      <option value="1">Skyline Commercial Hub</option>
                      <option value="2">Palm Residency</option>
                      <option value="3">Grand Horizon Enclave</option>
                      <option value="4">Mahakal Metro Package</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Daily Rental & Fuel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  DAILY RENTAL COST (₹/DAY)
                </label>
                <input 
                  type="number" 
                  placeholder={formData.ownership === 'OWNED' ? '0 (Owned)' : '4500'}
                  value={formData.daily_rental_cost} 
                  onChange={e => setFormData({ ...formData, daily_rental_cost: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  DIESEL CONSUMPTION (LITRES/DAY)
                </label>
                <input 
                  type="number" 
                  placeholder="35"
                  value={formData.fuel_litres_per_day} 
                  onChange={e => setFormData({ ...formData, fuel_litres_per_day: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Operator & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  CERTIFIED OPERATOR / DRIVER
                </label>
                <input 
                  type="text" 
                  placeholder="Raju Dhakad (Heavy Lic)"
                  value={formData.operator_name} 
                  onChange={e => setFormData({ ...formData, operator_name: e.target.value })}
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
                  OPERATIONAL STATUS
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
                  <option value="OPERATIONAL">Operational & Active on Site</option>
                  <option value="MAINTENANCE">Scheduled Maintenance / Service</option>
                  <option value="IDLE">Idle / Standby</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Live Machinery Badge Card Preview */}
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
                  Live Equipment Badge Preview
                </span>
                <span className="glass-pill" style={{ padding: '3px 10px', fontSize: '10.5px', fontWeight: 700, color: '#2563EB' }}>
                  {formData.ownership}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {formData.equipment_name || 'Machinery Unit Name'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  <Truck size={13} color="#2563EB" />
                  <span>Model: {formData.model_no || 'Standard Equipment'}</span>
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
                  <span style={{ color: '#64748B' }}>Daily Fuel Burn:</span>
                  <span style={{ fontWeight: 800, color: '#D97706' }}>{fuelLtrs} Litres/day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Rental Cost:</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>
                    {rentCost > 0 ? `₹${rentCost.toLocaleString('en-IN')}/day` : 'Company Asset'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Operator Assigned:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{formData.operator_name || 'Site Incharge'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Readiness Status:</span>
                  <span style={{ fontWeight: 700, color: formData.status === 'OPERATIONAL' ? '#10B981' : '#F59E0B' }}>
                    {formData.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>GPS telemetry & diesel log will be linked to site budget</span>
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
                <Plus size={16} />
                <span>Deploy Machinery & Register Unit</span>
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
  // 2. MAIN MACHINERY & PLANT FLEET DASHBOARD VIEW
  // =========================================================================
  return (
    <div className="module-view-container">
      {/* Action Header */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Machinery, Plant & Heavy Equipment Tracking</h2>
          <p className="module-subtitle">JCB backhoes, concrete pumps, tower cranes, dumpers, daily diesel consumption & operator muster</p>
        </div>
        <button className="btn-dubai-gold" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          <span>Deploy Plant / Machinery</span>
        </button>
      </div>

      {/* 4 Machinery KPI Cards */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Active Heavy Fleet</span>
            <span className="fin-icon-pill icon-gold"><Truck size={18} /></span>
          </div>
          <div className="fin-val">{equipment.length} Plant Units</div>
          <div className="fin-sub">JCB, Mixers, Tower Cranes & Dumpers</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Daily Diesel Consumption</span>
            <span className="fin-icon-pill icon-amber"><Fuel size={18} /></span>
          </div>
          <div className="fin-val text-amber">{totalFuelDaily} Litres/day</div>
          <div className="fin-sub">Approx ₹{(totalFuelDaily * 92).toLocaleString('en-IN')}/day fuel burn</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Daily Rental Commitment</span>
            <span className="fin-icon-pill icon-rose"><IndianRupee size={18} /></span>
          </div>
          <div className="fin-val text-rose">₹{totalRentalDaily.toLocaleString('en-IN')}/day</div>
          <div className="fin-sub">Leased cranes, piling rig & backhoe rates</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Fleet Operational Readiness</span>
            <span className="fin-icon-pill icon-green"><CheckCircle2 size={18} /></span>
          </div>
          <div className="fin-val text-green">{Math.round((operationalCount / (equipment.length || 1)) * 100)}% Operational</div>
          <div className="fin-sub">{operationalCount} Active • {equipment.length - operationalCount} In Service</div>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Truck size={18} className="gold-text" />
            <h3>Plant Fleet Deployment & Fuel Telemetry</h3>
          </div>
          <span className="glass-pill" style={{ padding: '3px 12px', fontSize: '11px', fontWeight: 700 }}>
            {equipment.length} Units Tracked
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Equipment & Model</th>
                <th>Ownership</th>
                <th>Daily Diesel</th>
                <th>Rental Rate</th>
                <th>Operator Incharge</th>
                <th>Assigned Site</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(eq => {
                const isOp = eq.status === 'OPERATIONAL';

                return (
                  <tr key={eq.id}>
                    <td>
                      <div className="table-cell-title">{eq.equipment_name}</div>
                      <div className="table-cell-sub">Model: {eq.model_no || 'Standard'}</div>
                    </td>
                    <td>
                      <span className="trade-pill">{eq.ownership}</span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#D97706' }}>
                        <Fuel size={13} />
                        {eq.fuel_litres_per_day} L/day
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800 }}>
                        {Number(eq.daily_rental_cost) > 0 ? `₹${Number(eq.daily_rental_cost).toLocaleString('en-IN')}/day` : 'Company Asset'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#0F172A', fontWeight: 600 }}>{eq.operator_name || 'Assigned Driver'}</span>
                    </td>
                    <td>
                      <b>{eq.project_name || 'Skyline Hub'}</b>
                    </td>
                    <td>
                      <span className={`status-tag ${isOp ? 'tag-green' : 'tag-amber'}`}>
                        <span className="status-dot"></span>
                        {eq.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-delete-row" 
                        title="Delete Equipment" 
                        onClick={() => handleDelete(eq.id)}
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
