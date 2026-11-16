import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  IndianRupee, 
  Building2, 
  User, 
  FileText,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function ApprovalsView() {
  const [requests, setRequests] = useState([
    { id: 'APP-104', type: 'Contractor RA Bill #04', site: 'Skyline Commercial Hub', submittedBy: 'Er. Rajesh Verma (Project Manager)', amount: 850000, date: '13 Nov, 2026', vendor: 'Apex Civil Group', purpose: '4th Floor Slab completion running bill', status: 'PENDING' },
    { id: 'APP-103', type: 'Emergency Diesel & Generator Fuel', site: 'Palm Residency', submittedBy: 'Suresh Patel (Site Supervisor)', amount: 48000, date: '12 Nov, 2026', vendor: 'Bharat Petroleum Depot', purpose: '300 Litres HSD for concrete pump', status: 'PENDING' },
    { id: 'APP-102', type: 'Flyash Bricks Procurement', site: 'Grand Horizon Enclave', submittedBy: 'Er. Rajesh Verma (Project Manager)', amount: 320000, date: '11 Nov, 2026', vendor: 'Narmada Eco Bricks', purpose: '40,000 Bricks batch delivery', status: 'APPROVED', approvedAt: '12 Nov, 2026 by Mohit Patidar (Owner)' },
    { id: 'APP-101', type: 'Plumbing Subcontractor Advance', site: 'Mahakal Metro Package', submittedBy: 'Er. Ankit Sharma (Site Incharge)', amount: 150000, date: '10 Nov, 2026', vendor: 'Mahakal Piping Solutions', purpose: 'Mobilization advance for drainage layout', status: 'APPROVED', approvedAt: '10 Nov, 2026 by Mohit Patidar (Owner)' },
  ]);

  const handleAction = (id, newStatus) => {
    setRequests(requests.map(r => r.id === id ? {
      ...r,
      status: newStatus,
      approvedAt: `${new Date().toLocaleDateString('en-IN')} by Mohit Patidar (Owner)`
    } : r));
  };

  const pendingList = requests.filter(r => r.status === 'PENDING');
  const approvedList = requests.filter(r => r.status === 'APPROVED');
  const totalPendingAmt = pendingList.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="module-view-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Expense Approval Workflow & Audit Sign-Off</h2>
          <p className="module-subtitle">Site manager requisitions, contractor bills & material vouchers waiting Owner digital sign</p>
        </div>
      </div>

      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Pending Approval Queue</span><span className="fin-icon-pill icon-rose"><Clock size={18} /></span></div>
          <div className="fin-val text-rose">{pendingList.length} Requisitions</div>
          <div className="fin-sub">Site bills requiring executive authorization</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Pending Total Amount</span><span className="fin-icon-pill icon-amber"><IndianRupee size={18} /></span></div>
          <div className="fin-val text-amber">₹{(totalPendingAmt / 100000).toFixed(2)} Lakhs</div>
          <div className="fin-sub">Disbursement hold until owner sign-off</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Approved This Month</span><span className="fin-icon-pill icon-green"><CheckCircle2 size={18} /></span></div>
          <div className="fin-val text-green">{approvedList.length} Approved</div>
          <div className="fin-sub">Cleared vouchers posted to general ledger</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Approval Authority</span><span className="fin-icon-pill icon-gold"><ShieldCheck size={18} /></span></div>
          <div className="fin-val">Owner Pin Active</div>
          <div className="fin-sub">Biometric & digital signature active</div>
        </div>
      </div>

      {/* Pending Approvals Queue */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <CheckSquare size={18} className="gold-text" />
            <h3>Action Required: Manager Expense Requisitions ({pendingList.length})</h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
          {pendingList.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#10B981', fontWeight: 700 }}>
              ✓ All manager expense requisitions have been approved and reconciled!
            </div>
          ) : (
            pendingList.map(req => (
              <div 
                key={req.id} 
                style={{ 
                  padding: '18px 22px', 
                  borderRadius: '20px', 
                  background: 'rgba(255, 255, 255, 0.65)', 
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="glass-pill" style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 800, color: '#2563EB' }}>
                      {req.id}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {req.type}
                    </h4>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569', fontWeight: 500 }}>
                    Site: <b>{req.site}</b> • Payee: <b>{req.vendor}</b> • Submitted by: <i>{req.submittedBy}</i>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Purpose: {req.purpose} ({req.date})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Amount Requested</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                      ₹{req.amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleAction(req.id, 'APPROVED')}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: '#0F172A',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={14} color="#10B981" />
                      Approve & Release
                    </button>

                    <button 
                      onClick={() => handleAction(req.id, 'REJECTED')}
                      className="glass-pill"
                      style={{
                        padding: '9px 14px',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#EF4444',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Historical Approval Log */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <ShieldCheck size={18} className="gold-text" />
            <h3>Authorized & Released Approvals Log</h3>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Voucher ID</th>
                <th>Type & Purpose</th>
                <th>Site</th>
                <th>Payee / Vendor</th>
                <th>Amount</th>
                <th>Digital Audit Stamp</th>
              </tr>
            </thead>
            <tbody>
              {approvedList.map(a => (
                <tr key={a.id}>
                  <td><b>{a.id}</b></td>
                  <td>
                    <div className="table-cell-title">{a.type}</div>
                    <div className="table-cell-sub">{a.purpose}</div>
                  </td>
                  <td><b>{a.site}</b></td>
                  <td>{a.vendor}</td>
                  <td><span style={{ fontWeight: 800, color: '#10B981' }}>₹{a.amount.toLocaleString('en-IN')}</span></td>
                  <td><span style={{ fontSize: '11px', color: '#64748B' }}>✓ {a.approvedAt}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

