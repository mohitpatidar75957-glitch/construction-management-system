import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Filter,
  Plus,
  ArrowLeft,
  Search,
  Download,
  Edit2,
  Check,
  X,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

export default function BoqEstimatesView() {
  const [selectedSite, setSelectedSite] = useState('Skyline Commercial Hub');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValues, setEditValues] = useState({ actualQty: '', actualRate: '' });

  // Persist BOQ items in localStorage
  const [boqItems, setBoqItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sitepilot_boq_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'BOQ-01', site: 'Skyline Commercial Hub', category: 'Concrete', item: 'M30 Grade RMC Concrete', unit: 'Cum', estQty: 3200, actualQty: 3450, estRate: 5200, actualRate: 5350 },
      { id: 'BOQ-02', site: 'Skyline Commercial Hub', category: 'Steel', item: 'Fe550D TMT Reinforcement Steel', unit: 'MT', estQty: 280, actualQty: 295, estRate: 59000, actualRate: 58500 },
      { id: 'BOQ-03', site: 'Skyline Commercial Hub', category: 'Masonry', item: '200mm Autoclaved Aerated (AAC) Blocks', unit: 'Cum', estQty: 950, actualQty: 920, estRate: 3100, actualRate: 3100 },
      { id: 'BOQ-04', site: 'Skyline Commercial Hub', category: 'Finishing', item: 'Internal 12mm Gypsum Plastering', unit: 'Sqm', estQty: 18500, actualQty: 14200, estRate: 145, actualRate: 140 },
      { id: 'BOQ-05', site: 'Skyline Commercial Hub', category: 'Shuttering', item: 'Structural Shuttering & Scaffolding System', unit: 'Sqm', estQty: 24000, actualQty: 22000, estRate: 180, actualRate: 185 },
      { id: 'BOQ-06', site: 'Grand Horizon Enclave', category: 'Concrete', item: 'M25 Grade Raft Slab Concrete', unit: 'Cum', estQty: 2100, actualQty: 2150, estRate: 4800, actualRate: 4800 },
      { id: 'BOQ-07', site: 'Grand Horizon Enclave', category: 'MEP', item: 'Concealed CPVC Water Supply Pipelines', unit: 'Rft', estQty: 8500, actualQty: 6200, estRate: 210, actualRate: 220 },
      { id: 'BOQ-08', site: 'Mahakal Metro Package', category: 'Steel', item: 'Heavy Structural Steel Girder Sections', unit: 'MT', estQty: 450, actualQty: 410, estRate: 68000, actualRate: 67500 },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sitepilot_boq_items', JSON.stringify(boqItems));
    } catch (e) {
      console.error(e);
    }
  }, [boqItems]);

  const [newItem, setNewItem] = useState({
    item: '',
    category: 'Concrete',
    unit: 'Cum',
    estQty: '',
    estRate: '',
    actualQty: '',
    actualRate: '',
    site: 'Skyline Commercial Hub'
  });

  const handleCreateBOQ = (e) => {
    e.preventDefault();
    const estQ = parseFloat(newItem.estQty) || 0;
    const estR = parseFloat(newItem.estRate) || 0;
    const actQ = parseFloat(newItem.actualQty) || 0;
    const actR = parseFloat(newItem.actualRate) || estR;

    const created = {
      id: `BOQ-${String(boqItems.length + 1).padStart(2, '0')}`,
      site: newItem.site,
      category: newItem.category,
      item: newItem.item,
      unit: newItem.unit,
      estQty: estQ,
      estRate: estR,
      actualQty: actQ,
      actualRate: actR
    };

    setBoqItems([created, ...boqItems]);
    setSuccessMsg(`BOQ Item "${created.item}" added successfully!`);
    setTimeout(() => {
      setSuccessMsg('');
      setShowAdd(false);
    }, 1200);

    setNewItem({
      item: '',
      category: 'Concrete',
      unit: 'Cum',
      estQty: '',
      estRate: '',
      actualQty: '',
      actualRate: '',
      site: 'Skyline Commercial Hub'
    });
  };

  const handleStartEdit = (b) => {
    setEditingItemId(b.id);
    setEditValues({ actualQty: b.actualQty, actualRate: b.actualRate });
  };

  const handleSaveEdit = (id) => {
    setBoqItems(boqItems.map(b => {
      if (b.id === id) {
        return {
          ...b,
          actualQty: parseFloat(editValues.actualQty) || b.actualQty,
          actualRate: parseFloat(editValues.actualRate) || b.actualRate
        };
      }
      return b;
    }));
    setEditingItemId(null);
  };

  const exportCSV = () => {
    const headers = ['ID,Item,Site,Category,Unit,EstQty,ActualQty,EstRate,ActualRate,EstTotal,ActualTotal,Variance'];
    const rows = filteredItems.map(b => {
      const estTotal = b.estQty * b.estRate;
      const actualTotal = b.actualQty * b.actualRate;
      const varPct = estTotal > 0 ? (((actualTotal - estTotal) / estTotal) * 100).toFixed(1) : 0;
      return `"${b.id}","${b.item}","${b.site}","${b.category}","${b.unit}",${b.estQty},${b.actualQty},${b.estRate},${b.actualRate},${estTotal},${actualTotal},"${varPct}%"`;
    });
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOQ_${selectedSite.replace(/\s+/g, '_')}_Takeoff.csv`;
    a.click();
  };

  // Filter items
  const siteItems = selectedSite === 'ALL_SITES' 
    ? boqItems 
    : boqItems.filter(b => b.site === selectedSite);

  const filteredItems = siteItems.filter(b => {
    const matchesCategory = selectedCategory === 'ALL' || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = b.item.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate totals
  const totalEst = siteItems.reduce((sum, b) => sum + (b.estQty * b.estRate), 0);
  const totalActual = siteItems.reduce((sum, b) => sum + (b.actualQty * b.actualRate), 0);
  const varianceAmt = totalActual - totalEst;
  const variancePct = totalEst > 0 ? ((varianceAmt / totalEst) * 100).toFixed(1) : 0;

  // New item preview calculations
  const previewEstTotal = (parseFloat(newItem.estQty) || 0) * (parseFloat(newItem.estRate) || 0);
  const previewActTotal = (parseFloat(newItem.actualQty) || 0) * (parseFloat(newItem.actualRate) || parseFloat(newItem.estRate) || 0);
  const previewVarAmt = previewActTotal - previewEstTotal;

  // Dedicated Full-Screen Add BOQ Line Item View
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
              <span>Back to BOQ Ledger</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Create New BOQ Line Item <span className="amp">&</span> Material Takeoff
              </h1>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Define engineering estimates, tender quantity baselines, and link spot procurement rates
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

        {/* 2-Column Responsive Layout */}
        <form onSubmit={handleCreateBOQ} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          {/* Left Form Card */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                ITEM DESCRIPTION / SPECIFICATION *
              </label>
              <input 
                type="text" 
                required 
                placeholder="e.g. M35 Grade RMC Concrete with Waterproofing Admixture"
                value={newItem.item} 
                onChange={e => setNewItem({ ...newItem, item: e.target.value })}
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
                  value={newItem.site}
                  onChange={e => setNewItem({ ...newItem, site: e.target.value })}
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
                  TRADE CATEGORY *
                </label>
                <select
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
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
                  <option value="Concrete">Concrete & RMC</option>
                  <option value="Steel">Reinforcement Steel (TMT)</option>
                  <option value="Masonry">Masonry & AAC Blocks</option>
                  <option value="Finishing">Plaster & Flooring</option>
                  <option value="Shuttering">Shuttering & Formwork</option>
                  <option value="MEP">Electrical & Plumbing</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  UNIT (UOM) *
                </label>
                <select
                  value={newItem.unit}
                  onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
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
                  <option value="Cum">Cum (m³)</option>
                  <option value="MT">MT (Tons)</option>
                  <option value="Sqm">Sqm (m²)</option>
                  <option value="Rft">Rft (Feet)</option>
                  <option value="Bags">Bags (50kg)</option>
                  <option value="Nos">Nos (Units)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  ESTIMATED QTY *
                </label>
                <input 
                  type="number" 
                  required
                  placeholder="3000"
                  value={newItem.estQty} 
                  onChange={e => setNewItem({ ...newItem, estQty: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  TENDER RATE (₹) *
                </label>
                <input 
                  type="number" 
                  required
                  placeholder="5200"
                  value={newItem.estRate} 
                  onChange={e => setNewItem({ ...newItem, estRate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', paddingTop: '10px', borderTop: '1px dashed rgba(203, 213, 225, 0.8)' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  ACTUAL CONSUMED QTY (TO DATE)
                </label>
                <input 
                  type="number" 
                  placeholder="Leave 0 if upcoming"
                  value={newItem.actualQty} 
                  onChange={e => setNewItem({ ...newItem, actualQty: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  ACTUAL INVOICED RATE (₹)
                </label>
                <input 
                  type="number" 
                  placeholder="Defaults to tender rate"
                  value={newItem.actualRate} 
                  onChange={e => setNewItem({ ...newItem, actualRate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

          </div>

          {/* Right Live Takeoff Card & Variance Simulator */}
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
                  BOQ Takeoff Preview
                </span>
                <span className="proj-code-pill">
                  #BOQ-{String(boqItems.length + 1).padStart(2, '0')}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                  {newItem.item || 'Item Description Preview'}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {newItem.site} • <strong>{newItem.category}</strong> • Measured in <strong>{newItem.unit}</strong>
                </div>
              </div>

              {/* Financial Comparison */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '14px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(226, 232, 240, 0.9)'
              }}>
                <div>
                  <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Baseline Budget</span>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    ₹{previewEstTotal.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>{newItem.estQty || 0} {newItem.unit} @ ₹{newItem.estRate || 0}</div>
                </div>

                <div>
                  <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Actual Incurred</span>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: previewVarAmt > 0 ? '#DC2626' : '#16A34A', marginTop: '2px' }}>
                    ₹{previewActTotal.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>{newItem.actualQty || 0} {newItem.unit} @ ₹{newItem.actualRate || newItem.estRate || 0}</div>
                </div>
              </div>

              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: previewVarAmt > 0 ? 'rgba(254, 242, 242, 0.85)' : 'rgba(240, 253, 244, 0.85)',
                border: previewVarAmt > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: previewVarAmt > 0 ? '#B91C1C' : '#15803D' }}>
                  {previewVarAmt > 0 ? '⚠️ Budget Cost Overrun' : '✓ Budget Under Control'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: previewVarAmt > 0 ? '#B91C1C' : '#15803D' }}>
                  {previewVarAmt > 0 ? '+' : ''}₹{previewVarAmt.toLocaleString('en-IN')}
                </span>
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
                <span>Save & Publish BOQ Takeoff Item</span>
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

  // Standard BOQ Matrix View
  return (
    <div className="module-view-container animate-fade-in">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Bill of Quantities (BOQ) <span className="amp">&</span> Cost Estimates</h2>
          <p className="module-subtitle">Material quantity takeoff <span className="amp">&</span> tender rate estimates compared with actual site consumption and live cost variance</p>
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
          <button 
            className="glass-pill" 
            onClick={exportCSV}
            style={{ 
              padding: '8px 14px', 
              fontSize: '12px', 
              fontWeight: 700, 
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button 
            className="glass-pill" 
            onClick={() => window.print()}
            style={{ 
              padding: '8px 14px', 
              fontSize: '12px', 
              fontWeight: 700, 
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Printer size={14} />
            <span>Print BOQ</span>
          </button>
          <button className="btn-dubai-gold" onClick={() => setShowAdd(true)}>
            <Plus size={16} />
            <span>Add BOQ Item</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Estimated Baseline Budget</span><span className="fin-icon-pill icon-gold"><Calculator size={18} /></span></div>
          <div className="fin-val">₹{(totalEst / 10000000).toFixed(2)} Cr</div>
          <div className="fin-sub">Tender quotation & engineering estimate</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Actual Incurred To Date</span><span className="fin-icon-pill icon-amber"><IndianRupee size={18} /></span></div>
          <div className="fin-val text-amber">₹{(totalActual / 10000000).toFixed(2)} Cr</div>
          <div className="fin-sub">Recorded consumption & delivery invoices</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Cost Variance</span><span className="fin-icon-pill icon-rose"><AlertTriangle size={18} /></span></div>
          <div className="fin-val" style={{ color: varianceAmt > 0 ? '#EF4444' : '#10B981' }}>
            {varianceAmt > 0 ? '+' : ''}₹{(varianceAmt / 100000).toFixed(2)} L
          </div>
          <div className="fin-sub">{variancePct}% net deviation from budget</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Estimation Accuracy</span><span className="fin-icon-pill icon-green"><CheckCircle2 size={18} /></span></div>
          <div className="fin-val text-green">{(100 - Math.abs(parseFloat(variancePct))).toFixed(1)}%</div>
          <div className="fin-sub">Quantity takeoff precision index</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'Concrete', 'Steel', 'Masonry', 'Finishing', 'Shuttering', 'MEP'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`glass-pill ${selectedCategory === cat ? 'active' : ''}`}
              style={{
                padding: '6px 14px',
                fontSize: '11.5px',
                fontWeight: 700,
                border: selectedCategory === cat ? '1px solid #0F172A' : '1px solid rgba(255, 255, 255, 0.75)',
                background: selectedCategory === cat ? '#0F172A' : 'rgba(255, 255, 255, 0.65)',
                color: selectedCategory === cat ? '#ffffff' : '#64748B',
                boxShadow: selectedCategory === cat ? '0 4px 14px rgba(15, 23, 42, 0.25)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'ALL' ? 'All Trade Categories' : cat}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(203, 213, 225, 0.8)',
          borderRadius: '12px',
          padding: '6px 12px',
          minWidth: '240px'
        }}>
          <Search size={14} color="#94A3B8" />
          <input 
            type="text"
            placeholder="Search material or code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '12px',
              width: '100%',
              color: '#0F172A'
            }}
          />
        </div>
      </div>

      {/* BOQ Items Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Calculator size={18} className="gold-text" />
            <h3>BOQ Itemized Variance Matrix ({selectedSite === 'ALL_SITES' ? 'All Active Sites' : selectedSite})</h3>
          </div>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
            Showing {filteredItems.length} line item{filteredItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Item Code & Description</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Est. Qty</th>
                <th>Actual Qty</th>
                <th>Est. Rate</th>
                <th>Actual Rate</th>
                <th>Estimated Total</th>
                <th>Actual Incurred</th>
                <th>Variance %</th>
                <th>Quick Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(b => {
                const estTotal = b.estQty * b.estRate;
                const isEditing = editingItemId === b.id;
                const actualQtyToUse = isEditing ? (parseFloat(editValues.actualQty) || 0) : b.actualQty;
                const actualRateToUse = isEditing ? (parseFloat(editValues.actualRate) || 0) : b.actualRate;
                const actualTotal = actualQtyToUse * actualRateToUse;
                const variance = estTotal > 0 ? (((actualTotal - estTotal) / estTotal) * 100).toFixed(1) : 0;
                const isOver = parseFloat(variance) > 0;

                return (
                  <tr key={b.id}>
                    <td>
                      <div className="table-cell-title">{b.item}</div>
                      <div className="table-cell-sub">{b.id} • {b.site}</div>
                    </td>
                    <td>
                      <span className="trade-pill" style={{ fontSize: '11px', fontWeight: 600 }}>
                        {b.category}
                      </span>
                    </td>
                    <td><b>{b.unit}</b></td>
                    <td><b>{b.estQty.toLocaleString('en-IN')}</b></td>
                    <td>
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editValues.actualQty} 
                          onChange={e => setEditValues({ ...editValues, actualQty: e.target.value })}
                          style={{
                            width: '80px',
                            padding: '4px 6px',
                            borderRadius: '6px',
                            border: '1px solid #2563EB',
                            fontSize: '12px',
                            fontWeight: 700
                          }}
                        />
                      ) : (
                        <b style={{ color: '#0F172A' }}>{b.actualQty.toLocaleString('en-IN')}</b>
                      )}
                    </td>
                    <td>₹{b.estRate.toLocaleString('en-IN')}</td>
                    <td>
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editValues.actualRate} 
                          onChange={e => setEditValues({ ...editValues, actualRate: e.target.value })}
                          style={{
                            width: '80px',
                            padding: '4px 6px',
                            borderRadius: '6px',
                            border: '1px solid #2563EB',
                            fontSize: '12px',
                            fontWeight: 700
                          }}
                        />
                      ) : (
                        <span>₹{b.actualRate.toLocaleString('en-IN')}</span>
                      )}
                    </td>
                    <td>₹{(estTotal / 100000).toFixed(2)} L</td>
                    <td><b>₹{(actualTotal / 100000).toFixed(2)} L</b></td>
                    <td>
                      <span className={`status-tag ${isOver ? 'tag-rose' : 'tag-green'}`}>
                        {isOver ? `+${variance}%` : `${variance}%`}
                      </span>
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleSaveEdit(b.id)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#10B981',
                              color: '#fff',
                              cursor: 'pointer'
                            }}
                            title="Save Changes"
                          >
                            <Check size={13} />
                          </button>
                          <button 
                            onClick={() => setEditingItemId(null)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#EF4444',
                              color: '#fff',
                              cursor: 'pointer'
                            }}
                            title="Cancel"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleStartEdit(b)}
                          className="glass-pill"
                          style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                          title="Quick update actual consumption"
                        >
                          <Edit2 size={12} />
                          <span>Update</span>
                        </button>
                      )}
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
