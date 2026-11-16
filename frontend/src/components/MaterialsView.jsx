import React, { useEffect, useState } from 'react';
import { api, DEFAULT_MATERIALS, DEFAULT_PROJECTS } from '../api/client';
import { 
  HiOutlineCube as Boxes, 
  HiOutlineExclamationTriangle as AlertTriangle, 
  HiOutlineCheckCircle as CheckCircle2, 
  HiOutlineCurrencyRupee as IndianRupee, 
  HiPlus as PackagePlus, 
  HiOutlineBuildingOffice2 as Building2, 
  HiPlus as Plus, 
  HiOutlineTrash as Trash2,
  HiOutlineFunnel as Filter,
  HiArrowLeft as ArrowLeft,
  HiOutlineShieldCheck as ShieldCheck,
  HiOutlineTruck as Truck
} from 'react-icons/hi2';

export default function MaterialsView() {
  const [materials, setMaterials] = useState(DEFAULT_MATERIALS);
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('');

  const [formData, setFormData] = useState({
    project_id: '1',
    material_name: '',
    category: 'Cement',
    unit: 'Bags',
    current_stock: '',
    min_threshold: '100',
    unit_price: '',
    supplier_name: ''
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getMaterials(selectedSiteFilter), api.getProjects()])
      .then(([mats, projs]) => {
        setMaterials(mats);
        setProjects(projs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedSiteFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.createMaterial({
      ...formData,
      current_stock: parseFloat(formData.current_stock) || 0,
      min_threshold: parseFloat(formData.min_threshold) || 10,
      unit_price: parseFloat(formData.unit_price) || 0
    }).then(() => {
      setShowModal(false);
      loadData();
      setFormData({
        project_id: projects[0]?.id || '1',
        material_name: '',
        category: 'Cement',
        unit: 'Bags',
        current_stock: '',
        min_threshold: '100',
        unit_price: '',
        supplier_name: ''
      });
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}" from inventory?`)) {
      api.deleteMaterial(id).then(loadData);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading material procurement telemetry...</div>;
  }

  const lowStockItems = materials.filter(m => Number(m.current_stock) <= Number(m.min_threshold));
  const totalInventoryValue = materials.reduce((acc, m) => acc + (Number(m.current_stock) * Number(m.unit_price)), 0);

  const categories = [
    { id: 'Cement', label: 'Cement & Concrete', color: '#3B82F6' },
    { id: 'Steel', label: 'Sariya / Steel Bars', color: '#0F172A' },
    { id: 'Bricks', label: 'Bricks & Flyash Blocks', color: '#D97706' },
    { id: 'Aggregates', label: 'Sand & Crushed Aggregates', color: '#8B5CF6' },
    { id: 'Electrical', label: 'Electrical Conduits & Cables', color: '#06B6D4' },
    { id: 'Plumbing', label: 'Plumbing & Drainage Pipes', color: '#10B981' },
  ];

  const selectedProjObj = projects.find(p => String(p.id) === String(formData.project_id)) || projects[0];

  // =========================================================================
  // 1. FULL-SCREEN / FULL-VIEW PROCURE STOCK PAGE
  // =========================================================================
  if (showModal) {
    const stockQty = Number(formData.current_stock) || 0;
    const priceVal = Number(formData.unit_price) || 0;
    const totalEstVal = stockQty * priceVal;

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
              <span>Back to Inventory</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Procure & Inward Material Stock
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
            
            {/* Step 1: Material Category */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                SELECT MATERIAL CATEGORY
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                {categories.map(c => {
                  const isCatActive = formData.category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: c.id })}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isCatActive ? '1.5px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.8)',
                        background: isCatActive ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                        color: isCatActive ? '#0F172A' : '#64748B',
                        fontSize: '11.5px',
                        fontWeight: isCatActive ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material Name & Site */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  MATERIAL DESCRIPTION / BRAND
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="UltraTech Super Cement PPC"
                  value={formData.material_name} 
                  onChange={e => setFormData({ ...formData, material_name: e.target.value })}
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
                  DELIVERY SITE
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

            {/* Unit & Current Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  MEASUREMENT UNIT
                </label>
                <select 
                  value={formData.unit} 
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
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
                  <option value="Bags">Bags</option>
                  <option value="Tons">Tons</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Brass">Brass</option>
                  <option value="Coils">Coils</option>
                  <option value="Liters">Liters</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  STOCK QUANTITY DELIVERED
                </label>
                <input 
                  type="number" 
                  required 
                  placeholder="500"
                  value={formData.current_stock} 
                  onChange={e => setFormData({ ...formData, current_stock: e.target.value })}
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

            {/* Unit Price & Threshold Alert */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  UNIT PRICE (₹ INR)
                </label>
                <input 
                  type="number" 
                  placeholder="390"
                  value={formData.unit_price} 
                  onChange={e => setFormData({ ...formData, unit_price: e.target.value })}
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
                  MIN SAFETY STOCK ALERT
                </label>
                <input 
                  type="number" 
                  required 
                  placeholder="100"
                  value={formData.min_threshold} 
                  onChange={e => setFormData({ ...formData, min_threshold: e.target.value })}
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

            {/* Supplier / Vendor */}
            <div className="form-group">
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                AUTHORIZED SUPPLIER / DISTRIBUTOR
              </label>
              <input 
                type="text" 
                placeholder="UltraTech Central Logistics Depot"
                value={formData.supplier_name} 
                onChange={e => setFormData({ ...formData, supplier_name: e.target.value })}
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

          {/* Right Column: Live Material Asset Card Preview */}
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
                  Live Stock Asset Preview
                </span>
                <span className="glass-pill" style={{ padding: '3px 10px', fontSize: '10.5px', fontWeight: 700, color: '#2563EB' }}>
                  {formData.category}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {formData.material_name || 'Material Item Name'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  <Boxes size={13} color="#2563EB" />
                  <span>{stockQty} {formData.unit} in Inventory</span>
                </div>
              </div>

              {/* Total Estimated Valuation */}
              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Estimated Batch Asset Value</span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
                  ₹{totalEstVal ? totalEstVal.toLocaleString('en-IN') : '0.00'}
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
                  <span style={{ color: '#64748B' }}>Site Allocation:</span>
                  <span style={{ fontWeight: 700, color: '#2563EB' }}>{selectedProjObj?.project_name || 'Site'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Unit Rate:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{priceVal}/{formData.unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Safety Threshold:</span>
                  <span style={{ fontWeight: 700, color: '#D97706' }}>{formData.min_threshold} {formData.unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Vendor:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{formData.supplier_name || 'Authorized Depot'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>Inventory logs will be updated into site procurement ledger</span>
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
                <PackagePlus size={16} />
                <span>Confirm Stock Procurement</span>
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
  // 2. MAIN MATERIAL PROCUREMENT DASHBOARD VIEW
  // =========================================================================
  return (
    <div className="module-view-container">
      {/* Action Header */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Material & Procurement Inventory</h2>
          <p className="module-subtitle">Stock levels for Cement, Sariya (Steel), Bricks, Sand, site allocations & restock alerts</p>
        </div>
        <button className="btn-dubai-gold" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          <span>Procure New Stock</span>
        </button>
      </div>

      {/* 4 Commodity Stat Cards */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Total Inventory Assets</span>
            <span className="fin-icon-pill icon-gold"><Boxes size={18} /></span>
          </div>
          <div className="fin-val">₹{(totalInventoryValue / 100000).toFixed(2)} Lakhs</div>
          <div className="fin-sub">Estimated on-site material valuation</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Low Stock Action Alerts</span>
            <span className="fin-icon-pill icon-rose"><AlertTriangle size={18} /></span>
          </div>
          <div className="fin-val text-rose">{lowStockItems.length} Urgent Items</div>
          <div className="fin-sub">Commodities below safety reserve limit</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Tracked Materials</span>
            <span className="fin-icon-pill icon-green"><CheckCircle2 size={18} /></span>
          </div>
          <div className="fin-val text-green">{materials.length} Stock SKUs</div>
          <div className="fin-sub">Cement, Steel, Aggregates & Electricals</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Active Receiving Sites</span>
            <span className="fin-icon-pill icon-amber"><Building2 size={18} /></span>
          </div>
          <div className="fin-val text-amber">{projects.length} Construction Sites</div>
          <div className="fin-sub">Depot delivery points in MP corridor</div>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockItems.length > 0 && (
        <div className="stock-alert-banner">
          <AlertTriangle size={18} />
          <div>
            <b>Attention:</b> Critical stock depletion on {lowStockItems.map(m => `${m.material_name} (${m.current_stock} ${m.unit} left)`).join(', ')}. Create re-order immediately.
          </div>
        </div>
      )}

      {/* Materials Inventory Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Boxes size={18} className="gold-text" />
            <h3>Site Material Stock & Allocation Ledger</h3>
          </div>

          {/* Filter by Site */}
          <div className="table-actions-right">
            <Filter size={14} color="#64748B" />
            <select 
              className="select-filter-dubai"
              value={selectedSiteFilter} 
              onChange={e => setSelectedSiteFilter(e.target.value)}
            >
              <option value="">All Sites & Depots</option>
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
                <th>Material & Category</th>
                <th>Site Location</th>
                <th>Current Stock</th>
                <th>Safety Threshold</th>
                <th>Unit Price</th>
                <th>Valuation</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(m => {
                const isLow = Number(m.current_stock) <= Number(m.min_threshold);
                const itemVal = Number(m.current_stock) * Number(m.unit_price);

                return (
                  <tr key={m.id}>
                    <td>
                      <div className="table-cell-title">{m.material_name}</div>
                      <div className="table-cell-sub">{m.category} • Supplier: {m.supplier_name || 'Standard Depot'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{m.project_name}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, fontSize: '13px' }}>
                        {m.current_stock} {m.unit}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#64748B' }}>{m.min_threshold} {m.unit}</span>
                    </td>
                    <td>
                      ₹{m.unit_price} / {m.unit}
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>
                        ₹{itemVal.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag ${isLow ? 'tag-rose' : 'tag-green'}`}>
                        <span className="status-dot"></span>
                        {isLow ? 'Low Stock Alert' : 'Sufficient'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-delete-row" 
                        title="Delete Material" 
                        onClick={() => handleDelete(m.id, m.material_name)}
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
