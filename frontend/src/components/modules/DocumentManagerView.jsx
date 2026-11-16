import React, { useState } from 'react';
import { 
  FolderArchive, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Upload, 
  Plus, 
  Building2,
  Folder,
  Eye
} from 'lucide-react';

export default function DocumentManagerView() {
  const [activeFolder, setActiveFolder] = useState('ALL');

  const docs = [
    { id: 1, title: 'Architectural Floor Plans & Structural CAD (Rev 4)', category: 'Drawings', site: 'Skyline Commercial Hub', type: 'PDF / DWG', size: '24.5 MB', date: '04 Oct, 2026', expiry: 'Perpetual', status: 'VALID' },
    { id: 2, title: 'Municipal Corporation Building Sanction NOC', category: 'NOCs & Permissions', site: 'Skyline Commercial Hub', type: 'PDF', size: '4.2 MB', date: '15 Jan, 2025', expiry: '14 Jan, 2028', status: 'VALID' },
    { id: 3, title: 'State Pollution Control Board Environmental Clearance', category: 'NOCs & Permissions', site: 'Palm Residency', type: 'PDF', size: '6.8 MB', date: '10 Feb, 2024', expiry: '09 Feb, 2027', status: 'RENEWAL_DUE' },
    { id: 4, title: 'General Civil Contractor Agreement with Penalty Clauses', category: 'Agreements', site: 'Grand Horizon Enclave', type: 'PDF', size: '8.1 MB', date: '01 Dec, 2025', expiry: '30 Nov, 2027', status: 'VALID' },
    { id: 5, title: 'Tower Crane Third-Party Safety Stability Certificate', category: 'Safety & NOCs', site: 'Mahakal Metro Package', type: 'PDF', size: '3.4 MB', date: '01 Nov, 2026', expiry: '30 Apr, 2027', status: 'VALID' },
  ];

  const folders = ['ALL', 'Drawings', 'Agreements', 'NOCs & Permissions', 'Safety & NOCs'];
  const filtered = activeFolder === 'ALL' ? docs : docs.filter(d => d.category === activeFolder);

  return (
    <div className="module-view-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Document Manager & Compliance Vault</h2>
          <p className="module-subtitle">Architectural blueprints, legal agreements, municipal NOCs, clearances & expiry reminders</p>
        </div>
        <button className="btn-dubai-gold" onClick={() => alert('Document upload drawer opened')}>
          <Upload size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Vault Documents</span><span className="fin-icon-pill icon-gold"><FolderArchive size={18} /></span></div>
          <div className="fin-val">{docs.length} Vault Files</div>
          <div className="fin-sub">Indexed across 4 construction projects</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Statutory Compliance</span><span className="fin-icon-pill icon-green"><CheckCircle2 size={18} /></span></div>
          <div className="fin-val text-green">100% Compliant</div>
          <div className="fin-sub">All active sites hold valid municipal NOCs</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Renewal Reminder Alert</span><span className="fin-icon-pill icon-amber"><Clock size={18} /></span></div>
          <div className="fin-val text-amber">1 Expiring Soon</div>
          <div className="fin-sub">Pollution Clearance due in 90 days</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Cloud Backup Storage</span><span className="fin-icon-pill icon-cyan"><Building2 size={18} /></span></div>
          <div className="fin-val text-cyan">47.0 MB Encrypted</div>
          <div className="fin-sub">AES-256 cloud document vault</div>
        </div>
      </div>

      {/* Folder Categories */}
      <div className="category-breakdown-row">
        {folders.map(f => (
          <button
            key={f}
            onClick={() => setActiveFolder(f)}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: activeFolder === f ? '1px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.8)',
              background: activeFolder === f ? '#0F172A' : 'rgba(255, 255, 255, 0.6)',
              color: activeFolder === f ? '#ffffff' : '#475569',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📁 {f}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <FolderArchive size={18} className="gold-text" />
            <h3>Document Repository ({filtered.length} Files)</h3>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Category</th>
                <th>Site Location</th>
                <th>Format & Size</th>
                <th>Upload Date</th>
                <th>Validity / Expiry</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <div className="table-cell-title">{d.title}</div>
                    <div className="table-cell-sub">Vault Ref: #DOC-{d.id}04</div>
                  </td>
                  <td><span className="status-tag tag-purple">{d.category}</span></td>
                  <td><b>{d.site}</b></td>
                  <td><span className="trade-pill">{d.type} • {d.size}</span></td>
                  <td>{d.date}</td>
                  <td>
                    <span className={`status-tag ${d.status === 'RENEWAL_DUE' ? 'tag-amber' : 'tag-green'}`}>
                      <span className="status-dot"></span>
                      {d.expiry}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => alert(`Downloading verified PDF for "${d.title}"`)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.2)', background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Download size={13} />
                      Download
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

