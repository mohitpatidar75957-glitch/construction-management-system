import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  FileText, 
  IndianRupee, 
  Building2,
  ArrowLeft,
  ShieldCheck,
  Filter
} from 'lucide-react';

export default function PurchaseOrdersView() {
  const [showAdd, setShowAdd] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [orders, setOrders] = useState([
    { id: 'PO-2026-081', site: 'Skyline Commercial Hub', vendor: 'UltraTech Cement Ltd', items: 'Cement PPC (1,200 Bags)', amount: 468000, date: '12 Nov, 2026', status: 'APPROVED', approvalBy: 'Mohit Patidar (Owner)' },
    { id: 'PO-2026-080', site: 'Palm Residency', vendor: 'Tata Tiscon Distributors', items: 'TMT 16mm Rebars (25 Tons)', amount: 1475000, date: '11 Nov, 2026', status: 'DISPATCHED', approvalBy: 'Mohit Patidar (Owner)' },
    { id: 'PO-2026-079', site: 'Grand Horizon Enclave', vendor: 'Narmada Aggregate Co', items: 'Coarse Sand (80 Brass)', amount: 320000, date: '10 Nov, 2026', status: 'PENDING_APPROVAL', approvalBy: 'Awaiting Owner Sign' },
    { id: 'PO-2026-078', site: 'Mahakal Metro Package', vendor: 'Polycab Electricals', items: 'FR PVC Conduits & Wires', amount: 185000, date: '08 Nov, 2026', status: 'APPROVED', approvalBy: 'Mohit Patidar (Owner)' },
  ]);

  const [form, setForm] = useState({
    site: 'Skyline Commercial Hub',
    vendor: '',
    items: '',
    amount: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newOrder = {
      id: `PO-2026-08${orders.length + 1}`,
      site: form.site,
      vendor: form.vendor,
      items: form.items,
      amount: parseFloat(form.amount) || 0,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'PENDING_APPROVAL',
      approvalBy: 'Awaiting Owner Sign'
    };
    setOrders([newOrder, ...orders]);
    setShowAdd(false);
    setForm({ site: 'Skyline Commercial Hub', vendor: '', items: '', amount: '', deliveryDate: new Date().toISOString().split('T')[0], notes: '' });
  };

  const handleApprove = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'APPROVED', approvalBy: 'Mohit Patidar (Owner)' } : o));
  };

  const filteredOrders = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus);

  if (showAdd) {
    const amtNum = Number(form.amount) || 0;

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
              <span>Back to POs</span>
            </button>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Create Official Purchase Order (PO)
              </h1>
              <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, margin: '2px 0 0 0' }}>
                Generate official material requisition with vendor rate agreement and owner approval workflow.
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setShowAdd(false)} className="glass-pill" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#64748B', cursor: 'pointer' }}>
            Cancel & Exit
          </button>
        </div>

        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>DELIVERY SITE</label>
                <select value={form.site} onChange={e => setForm({ ...form, site: e.target.value })}>
                  <option>Skyline Commercial Hub</option>
                  <option>Palm Residency</option>
                  <option>Grand Horizon Enclave</option>
                  <option>Mahakal Metro Package</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>SUPPLIER / VENDOR</label>
                <input type="text" required placeholder="UltraTech Cement Depot" value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>MATERIALS & SPECIFICATIONS</label>
              <input type="text" required placeholder="500 Bags OPC 53 Grade Cement + 10 Bundles Binding Wire" value={form.items} onChange={e => setForm({ ...form, items: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>ESTIMATED PO VALUE (₹ INR)</label>
                <input type="number" required placeholder="450000" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>REQUIRED DELIVERY DATE</label>
                <input type="date" value={form.deliveryDate} onChange={e => setForm({ ...form, deliveryDate: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>PAYMENT TERMS & SPECIAL INSTRUCTIONS</label>
              <textarea rows="2" placeholder="50% on dispatch, balance on site weight-bridge slip verification..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.35))', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Purchase Order Preview</span>
                <span className="glass-pill" style={{ padding: '3px 10px', fontSize: '10.5px', fontWeight: 700, color: '#2563EB' }}>PO-DRAFT</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Total Order Value</span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>₹{amtNum.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.55)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748B' }}>Site:</span><b>{form.site}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748B' }}>Vendor:</span><b>{form.vendor || '—'}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748B' }}>Items:</span><span style={{ maxWidth: '180px', textAlign: 'right', fontWeight: 600 }}>{form.items || '—'}</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} /><span>Order requires Owner digital approval signature</span>
              </div>
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '9999px', border: 'none', background: '#0F172A', color: '#ffffff', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer' }}>
              + Create & Dispatch Purchase Order
            </button>
          </div>
        </form>
      </div>
    );
  }

  const totalPoValue = orders.reduce((sum, o) => sum + o.amount, 0);
  const approvedCount = orders.filter(o => o.status === 'APPROVED' || o.status === 'DISPATCHED').length;

  return (
    <div className="module-view-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Purchase Orders (PO) & Procurement Approvals</h2>
          <p className="module-subtitle">Official contractor purchase orders, supplier contracts, delivery terms & owner approvals</p>
        </div>
        <button className="btn-dubai-gold" onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          <span>New Purchase Order</span>
        </button>
      </div>

      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Total PO Commitments</span><span className="fin-icon-pill icon-gold"><IndianRupee size={18} /></span></div>
          <div className="fin-val">₹{(totalPoValue / 100000).toFixed(2)} Lakhs</div>
          <div className="fin-sub">Active procurement orders across sites</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Approved & Dispatched</span><span className="fin-icon-pill icon-green"><CheckCircle2 size={18} /></span></div>
          <div className="fin-val text-green">{approvedCount} Orders</div>
          <div className="fin-sub">Verified material orders in transit</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Pending Owner Approval</span><span className="fin-icon-pill icon-rose"><Clock size={18} /></span></div>
          <div className="fin-val text-rose">{orders.length - approvedCount} Pending</div>
          <div className="fin-sub">Site manager requisitions waiting sign</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Active Suppliers</span><span className="fin-icon-pill icon-amber"><Truck size={18} /></span></div>
          <div className="fin-val text-amber">{new Set(orders.map(o => o.vendor)).size} Vendors</div>
          <div className="fin-sub">Cement, Steel, Aggregates & Hardware</div>
        </div>
      </div>

      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <ShoppingCart size={18} className="gold-text" />
            <h3>Purchase Orders Register</h3>
          </div>
          <div className="table-actions-right">
            <Filter size={14} color="#64748B" />
            <select className="select-filter-dubai" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="ALL">All PO Statuses</option>
              <option value="APPROVED">Approved Orders</option>
              <option value="PENDING_APPROVAL">Pending Sign</option>
              <option value="DISPATCHED">Dispatched / In Transit</option>
            </select>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>PO Number & Date</th>
                <th>Site Location</th>
                <th>Supplier / Vendor</th>
                <th>Order Items</th>
                <th>PO Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => {
                const isApproved = o.status === 'APPROVED' || o.status === 'DISPATCHED';

                return (
                  <tr key={o.id}>
                    <td>
                      <div className="table-cell-title">{o.id}</div>
                      <div className="table-cell-sub">{o.date}</div>
                    </td>
                    <td><div style={{ fontWeight: 600 }}>{o.site}</div></td>
                    <td><div style={{ color: '#0F172A', fontWeight: 600 }}>{o.vendor}</div></td>
                    <td style={{ color: '#475569', fontSize: '12px', maxWidth: '240px' }}>{o.items}</td>
                    <td><span style={{ fontWeight: 800, color: '#0F172A' }}>₹{o.amount.toLocaleString('en-IN')}</span></td>
                    <td>
                      <span className={`status-tag ${isApproved ? 'tag-green' : 'tag-amber'}`}>
                        <span className="status-dot"></span>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      {!isApproved ? (
                        <button 
                          onClick={() => handleApprove(o.id)}
                          style={{ padding: '5px 12px', borderRadius: '9999px', background: '#2563EB', color: '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Approve PO
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>✓ Verified</span>
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

