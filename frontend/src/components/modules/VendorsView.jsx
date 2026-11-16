import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Phone, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Truck,
  ShieldCheck
} from 'lucide-react';

export default function VendorsView() {
  const [showAdd, setShowAdd] = useState(false);
  const [vendors, setVendors] = useState([
    { id: 1, name: 'UltraTech Cement Ltd (Indore Depot)', category: 'Cement & Concrete', contact: '+91 98260 11223', gst: '23AAACU1234F1Z5', location: 'Pithampur Ind Area, Indore', totalPurchased: 4850000, pendingPayable: 420000, rating: '4.9 ★' },
    { id: 2, name: 'Tata Tiscon Steel Distributors', category: 'TMT & Structural Steel', contact: '+91 94250 88991', gst: '23AABCT9981K1Z2', location: 'Loha Mandi, Indore', totalPurchased: 8900000, pendingPayable: 1250000, rating: '4.8 ★' },
    { id: 3, name: 'Narmada River Sand & Aggregates', category: 'Sand & Crushed Aggregates', contact: '+91 91110 44556', gst: '23ABCFN5542P1Z8', location: 'Hoshangabad Road, Bhopal', totalPurchased: 2150000, pendingPayable: 180000, rating: '4.6 ★' },
    { id: 4, name: 'Polycab & Havells Wires Depot', category: 'Electrical & Conduits', contact: '+91 99810 77665', gst: '23AACCP7721L1Z9', location: 'Mahakal Vanijya Kendra, Ujjain', totalPurchased: 1450000, pendingPayable: 95000, rating: '4.7 ★' },
  ]);

  const [form, setForm] = useState({
    name: '',
    category: 'Cement & Concrete',
    contact: '',
    gst: '',
    location: '',
    openingPayable: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newV = {
      id: vendors.length + 1,
      name: form.name,
      category: form.category,
      contact: form.contact || '+91 98000 00000',
      gst: form.gst || '23AAAAA0000A1Z5',
      location: form.location,
      totalPurchased: 0,
      pendingPayable: parseFloat(form.openingPayable) || 0,
      rating: '5.0 ★'
    };
    setVendors([newV, ...vendors]);
    setShowAdd(false);
    setForm({ name: '', category: 'Cement & Concrete', contact: '', gst: '', location: '', openingPayable: '' });
  };

  if (showAdd) {
    return (
      <div className="module-view-container animate-fade-in" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              type="button"
              onClick={() => setShowAdd(false)}
              className="glass-pill"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontSize: '12.5px', fontWeight: 700, color: '#0F172A', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.75)' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Suppliers</span>
            </button>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Onboard Authorized Material Supplier
              </h1>
              <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, margin: '2px 0 0 0' }}>
                Register authorized suppliers, GST registration, credit period terms & bank ledger details.
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setShowAdd(false)} className="glass-pill" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#64748B', cursor: 'pointer' }}>
            Cancel & Exit
          </button>
        </div>

        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>FIRM / SUPPLIER NAME</label>
                <input type="text" required placeholder="Jindal Steel Power Distributors" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>COMMODITY CATEGORY</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option>Cement & Concrete</option>
                  <option>TMT & Structural Steel</option>
                  <option>Sand & Crushed Aggregates</option>
                  <option>Bricks & Flyash Blocks</option>
                  <option>Electrical & Conduits</option>
                  <option>Plumbing & Sanitary</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>CONTACT NUMBER / WHATSAPP</label>
                <input type="text" required placeholder="+91 98260 55441" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>GSTIN NUMBER</label>
                <input type="text" placeholder="23AAAAA0000A1Z5" value={form.gst} onChange={e => setForm({ ...form, gst: e.target.value.toUpperCase() })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>DEPOT / WAREHOUSE LOCATION</label>
                <input type="text" required placeholder="Sanwer Road Industrial Area, Indore" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>OPENING OUTSTANDING (₹)</label>
                <input type="number" placeholder="0" value={form.openingPayable} onChange={e => setForm({ ...form, openingPayable: e.target.value })} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.35))', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Supplier Profile Preview</span>
                <span className="glass-pill" style={{ padding: '3px 10px', fontSize: '10.5px', fontWeight: 700, color: '#2563EB' }}>VERIFIED</span>
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{form.name || 'Vendor Firm Name'}</h3>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'block' }}>{form.category}</span>
              </div>
              <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.55)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748B' }}>Contact:</span><b>{form.contact || '—'}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748B' }}>GSTIN:</span><b>{form.gst || 'APPLIED'}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748B' }}>Depot:</span><b>{form.location || '—'}</b></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} /><span>Vendor ledger will be connected with Inward Material POs</span>
              </div>
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '9999px', border: 'none', background: '#0F172A', color: '#ffffff', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer' }}>
              + Save & Onboard Supplier
            </button>
          </div>
        </form>
      </div>
    );
  }

  const totalPayables = vendors.reduce((sum, v) => sum + v.pendingPayable, 0);

  return (
    <div className="module-view-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Vendor & Supplier Management</h2>
          <p className="module-subtitle">Direct suppliers, agreed wholesale rates, delivery reliability, past POs & pending payables</p>
        </div>
        <button className="btn-dubai-gold" onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Active Suppliers</span><span className="fin-icon-pill icon-gold"><Store size={18} /></span></div>
          <div className="fin-val">{vendors.length} Vendors</div>
          <div className="fin-sub">Cement, Steel, Aggregates, Electricals</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Total Outstandings</span><span className="fin-icon-pill icon-rose"><IndianRupee size={18} /></span></div>
          <div className="fin-val text-rose">₹{(totalPayables / 100000).toFixed(2)} Lakhs</div>
          <div className="fin-sub">Pending payments due to material suppliers</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Cumulative Procurement</span><span className="fin-icon-pill icon-green"><Truck size={18} /></span></div>
          <div className="fin-val text-green">₹1.73 Cr</div>
          <div className="fin-sub">Total material inward since contract start</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Vendor Reliability</span><span className="fin-icon-pill icon-amber"><CheckCircle2 size={18} /></span></div>
          <div className="fin-val text-amber">98.4%</div>
          <div className="fin-sub">On-time site delivery SLA rate</div>
        </div>
      </div>

      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Store size={18} className="gold-text" />
            <h3>Authorized Supplier Directory & Payables</h3>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Vendor / Firm Name</th>
                <th>Category</th>
                <th>Contact & Phone</th>
                <th>Depot Location</th>
                <th>Purchased To Date</th>
                <th>Pending Balance</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id}>
                  <td>
                    <div className="table-cell-title">{v.name}</div>
                    <div className="table-cell-sub">GSTIN: {v.gst}</div>
                  </td>
                  <td><span className="status-tag tag-cyan">{v.category}</span></td>
                  <td><span style={{ fontSize: '12px', fontWeight: 600 }}>{v.contact}</span></td>
                  <td><div style={{ color: '#475569', fontSize: '12px' }}>{v.location}</div></td>
                  <td><span style={{ fontWeight: 700 }}>₹{(v.totalPurchased / 100000).toFixed(2)} L</span></td>
                  <td>
                    <span style={{ fontWeight: 800, color: v.pendingPayable > 0 ? '#EF4444' : '#10B981' }}>
                      ₹{(v.pendingPayable / 100000).toFixed(2)} L
                    </span>
                  </td>
                  <td><span className="glass-pill" style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 700, color: '#D97706' }}>{v.rating}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

