import React, { useState } from 'react';
import { 
  Database, 
  History, 
  Download, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  RefreshCw,
  HardDrive
} from 'lucide-react';

export default function AuditBackupView() {
  const [backingUp, setBackingUp] = useState(false);
  const [backups, setBackups] = useState([
    { id: 'BAK-2026-11-13', timestamp: '13 Nov, 2026 03:00 AM', size: '184.2 MB', records: '24,580 Rows', status: 'SUCCESS', target: 'Encrypted AWS S3 (Mumbai)' },
    { id: 'BAK-2026-11-12', timestamp: '12 Nov, 2026 03:00 AM', size: '182.8 MB', records: '24,120 Rows', status: 'SUCCESS', target: 'Encrypted AWS S3 (Mumbai)' },
    { id: 'BAK-2026-11-11', timestamp: '11 Nov, 2026 03:00 AM', size: '180.5 MB', records: '23,890 Rows', status: 'SUCCESS', target: 'Encrypted AWS S3 (Mumbai)' },
  ]);

  const auditLogs = [
    { id: 1, user: 'Mohit Patidar (Owner)', role: 'OWNER', action: 'Approved Expense Requisition #APP-102 (₹3,20,000)', ip: '103.21.58.12', time: '13 Nov, 2026 12:45 PM' },
    { id: 2, user: 'Er. Rajesh Verma (Project Manager)', role: 'MANAGER', action: 'Created Purchase Order PO-2026-081 for UltraTech', ip: '103.21.58.14', time: '13 Nov, 2026 11:30 AM' },
    { id: 3, user: 'Suresh Patel (Site Supervisor)', role: 'SUPERVISOR', action: 'Marked 42 Workers Attendance at Skyline Hub', ip: '49.36.128.4', time: '13 Nov, 2026 08:15 AM' },
    { id: 4, user: 'Accounts Dept (Vikas Gupta)', role: 'ACCOUNTANT', action: 'Generated RA Bill #04 Client Tax Invoice', ip: '103.21.58.20', time: '12 Nov, 2026 05:20 PM' },
  ];

  const handleTriggerBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      setBackups([
        { id: `BAK-${Date.now()}`, timestamp: 'Just now (Manual)', size: '185.1 MB', records: '24,612 Rows', status: 'SUCCESS', target: 'Encrypted AWS S3 (Mumbai)' },
        ...backups
      ]);
      setBackingUp(false);
    }, 1500);
  };

  return (
    <div className="module-view-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">System Audit Log <span className="amp">&</span> Automated Data Backups</h2>
          <p className="module-subtitle">Immutable access audit records, role tracking, automatic daily snapshots <span className="amp">&</span> disaster recovery</p>
        </div>
        <button className="btn-dubai-gold" onClick={handleTriggerBackup} disabled={backingUp}>
          <RefreshCw size={15} className={backingUp ? 'animate-spin' : ''} />
          <span>{backingUp ? 'Creating Snapshot...' : 'Trigger Immediate Backup'}</span>
        </button>
      </div>

      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Last Automated Backup</span><span className="fin-icon-pill icon-green"><Database size={18} /></span></div>
          <div className="fin-val text-green">Today, 03:00 AM</div>
          <div className="fin-sub">Daily midnight automatic database dump</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Backup Retention</span><span className="fin-icon-pill icon-gold"><HardDrive size={18} /></span></div>
          <div className="fin-val">365 Days</div>
          <div className="fin-sub">Point-in-time recovery archives retained</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Audit Trail Integrity</span><span className="fin-icon-pill icon-cyan"><ShieldCheck size={18} /></span></div>
          <div className="fin-val text-cyan">Tamper Proof</div>
          <div className="fin-sub">SHA-256 hashed ledger log chains</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Recovery Time SLA</span><span className="fin-icon-pill icon-amber"><Clock size={18} /></span></div>
          <div className="fin-val text-amber">&lt; 15 Mins</div>
          <div className="fin-sub">Hot standby failover replication active</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <History size={18} className="gold-text" />
            <h3>Activity Audit Trail (Who Changed What & When)</h3>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>User / Operator</th>
                <th>Role</th>
                <th>Action & Modifications</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(l => (
                <tr key={l.id}>
                  <td><b>{l.user}</b></td>
                  <td>
                    <span className={`status-tag ${l.role === 'OWNER' ? 'tag-purple' : l.role === 'MANAGER' ? 'tag-cyan' : 'tag-green'}`}>
                      {l.role}
                    </span>
                  </td>
                  <td style={{ color: '#0F172A', fontWeight: 600 }}>{l.action}</td>
                  <td><span style={{ fontSize: '11px', color: '#64748B' }}>{l.ip}</span></td>
                  <td><span style={{ fontSize: '11.5px', color: '#94A3B8' }}>{l.time}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup Archive List */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Database size={18} className="gold-text" />
            <h3>Stored Database Snapshot Archives</h3>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Snapshot ID</th>
                <th>Timestamp</th>
                <th>Size</th>
                <th>Database Rows</th>
                <th>Storage Destination</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {backups.map(b => (
                <tr key={b.id}>
                  <td><b>{b.id}</b></td>
                  <td>{b.timestamp}</td>
                  <td>{b.size}</td>
                  <td>{b.records}</td>
                  <td><span style={{ color: '#64748B' }}>{b.target}</span></td>
                  <td><span className="status-tag tag-green"><span className="status-dot"></span>{b.status}</span></td>
                  <td>
                    <button 
                      onClick={() => alert(`Starting encrypted download of ${b.id}`)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.2)', background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Download size={13} />
                      Export SQL
                    </button>
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

