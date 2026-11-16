import React, { useState, useEffect } from 'react';
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
  Eye,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  X,
  FileCode,
  Calendar,
  Layers,
  ExternalLink
} from 'lucide-react';
import { api, computeDocumentExpiry, DEFAULT_DOCUMENTS, DEFAULT_PROJECTS } from '../../api/client';

export default function DocumentManagerView({ filterProjectId = null }) {
  const [docs, setDocs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState(filterProjectId ? String(filterProjectId) : '');
  
  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [renewDoc, setRenewDoc] = useState(null);
  const [renewDate, setRenewDate] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Upload Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Blueprint',
    project_id: filterProjectId ? String(filterProjectId) : '1',
    type: 'DWG / CAD',
    version: 'Rev 1.0',
    expiry_type: 'FIXED', // 'FIXED' or 'PERPETUAL'
    expiry_date: '2027-12-31',
    description: '',
    fileName: '',
    fileSize: '14.5 MB'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const loadData = () => {
    setLoading(true);
    const docList = api.getDocuments(filterProjectId);
    const projList = api.getProjects();
    setDocs(docList);
    setProjects(projList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filterProjectId]);

  // Compute Expiry Stats
  const processedDocs = docs.map(d => ({
    ...d,
    expiryInfo: computeDocumentExpiry(d)
  }));

  const expiredDocs = processedDocs.filter(d => d.expiryInfo.isExpired);
  const expiringSoonDocs = processedDocs.filter(d => d.expiryInfo.isExpiringSoon);
  const blueprintsCount = processedDocs.filter(d => d.category === 'Blueprint').length;

  const folders = [
    { id: 'ALL', label: 'All Documents', count: processedDocs.length },
    { id: 'Blueprint', label: 'Blueprints & CAD', count: blueprintsCount },
    { id: 'NOC & Sanction', label: 'Municipal Sanctions & NOCs', count: processedDocs.filter(d => d.category === 'NOC & Sanction').length },
    { id: 'Clearance', label: 'Environmental & Pollution Clearances', count: processedDocs.filter(d => d.category === 'Clearance').length },
    { id: 'Legal Contract', label: 'EPC & Contractor Contracts', count: processedDocs.filter(d => d.category === 'Legal Contract').length },
    { id: 'Safety & Insurance', label: 'Safety & Site Insurance', count: processedDocs.filter(d => d.category === 'Safety & Insurance').length },
    { id: 'ALERTS', label: '⚠️ Expiry Alerts', count: expiredDocs.length + expiringSoonDocs.length, isAlert: true }
  ];

  // Filtering
  const filtered = processedDocs.filter(d => {
    // Folder filter
    if (activeFolder === 'ALERTS') {
      if (!d.expiryInfo.isExpired && !d.expiryInfo.isExpiringSoon) return false;
    } else if (activeFolder !== 'ALL') {
      if (d.category !== activeFolder) return false;
    }

    // Site filter
    if (selectedSiteFilter && String(d.project_id) !== String(selectedSiteFilter)) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (d.title || '').toLowerCase().includes(q);
      const matchSite = (d.site || '').toLowerCase().includes(q);
      const matchVersion = (d.version || '').toLowerCase().includes(q);
      const matchCat = (d.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSite && !matchVersion && !matchCat) return false;
    }

    return true;
  });

  // Handle Upload
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter a document or blueprint title.');
      return;
    }

    const selectedProj = projects.find(p => String(p.id) === String(formData.project_id));
    const projName = selectedProj ? (selectedProj.project_name || selectedProj.name) : 'Selected Construction Site';

    const newDoc = {
      title: formData.title,
      category: formData.category,
      project_id: Number(formData.project_id),
      site: projName,
      type: formData.type,
      version: formData.version,
      size: formData.fileName ? formData.fileSize : '8.4 MB',
      upload_date: new Date().toISOString().split('T')[0],
      expiry_date: formData.expiry_type === 'PERPETUAL' ? 'Perpetual' : formData.expiry_date,
      uploaded_by: 'Er. Mohit Patidar (Project Incharge)',
      description: formData.description || 'Uploaded blueprint and statutory compliance record',
      preview_url: formData.category === 'Blueprint' 
        ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80'
    };

    api.uploadDocument(newDoc);
    loadData();
    setShowUploadModal(false);
    showToast(`Blueprint & Document "${formData.title}" uploaded to vault successfully!`);

    // Reset Form
    setFormData({
      title: '',
      category: 'Blueprint',
      project_id: filterProjectId ? String(filterProjectId) : '1',
      type: 'DWG / CAD',
      version: 'Rev 1.0',
      expiry_type: 'FIXED',
      expiry_date: '2027-12-31',
      description: '',
      fileName: '',
      fileSize: '14.5 MB'
    });
  };

  // Handle Delete
  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the document vault?`)) {
      api.deleteDocument(id);
      loadData();
      showToast(`Document "${title}" removed from vault.`);
    }
  };

  // Handle Renew Expiry
  const handleRenewSubmit = (e) => {
    e.preventDefault();
    if (!renewDate) {
      alert('Please select a valid new renewal date.');
      return;
    }
    api.renewDocument(renewDoc.id, renewDate);
    loadData();
    setRenewDoc(null);
    setRenewDate('');
    showToast(`Document "${renewDoc.title}" renewed until ${renewDate}!`);
  };

  return (
    <div className="module-view-container animate-fade-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          color: '#FFFFFF',
          padding: '14px 22px',
          borderRadius: '16px',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Document Manager <span className="amp">&</span> Compliance Vault</h2>
          <p className="module-subtitle">
            Architectural blueprints, CAD floor plans, municipal sanctions, environmental NOCs <span className="amp">&</span> statutory expiry alerts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {(expiredDocs.length > 0 || expiringSoonDocs.length > 0) && (
            <button 
              onClick={() => setActiveFolder(activeFolder === 'ALERTS' ? 'ALL' : 'ALERTS')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '9999px',
                border: activeFolder === 'ALERTS' ? '1.5px solid #EF4444' : '1px solid rgba(239, 68, 68, 0.4)',
                background: activeFolder === 'ALERTS' ? '#EF4444' : 'rgba(254, 242, 242, 0.9)',
                color: activeFolder === 'ALERTS' ? '#FFFFFF' : '#B91C1C',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <AlertTriangle size={15} />
              <span>{expiredDocs.length + expiringSoonDocs.length} Expiry Alerts</span>
            </button>
          )}

          <button className="btn-dubai-gold" onClick={() => setShowUploadModal(true)}>
            <Upload size={16} />
            <span>Upload Blueprint / Document</span>
          </button>
        </div>
      </div>

      {/* Expiry Critical Alert Banner */}
      {(expiredDocs.length > 0 || expiringSoonDocs.length > 0) && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95), rgba(255, 237, 213, 0.9))',
          border: '1.5px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '20px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#EF4444',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#991B1B' }}>
                Statutory Document Expiry Warning ({expiredDocs.length} Expired, {expiringSoonDocs.length} Expiring Soon)
              </div>
              <div style={{ fontSize: '12px', color: '#7F1D1D', marginTop: '2px' }}>
                {expiredDocs.length > 0 && (
                  <b>{expiredDocs[0].title} on {expiredDocs[0].site} has expired! </b>
                )}
                Immediate municipal renewal application mandatory to ensure uninterrupted site construction operations.
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveFolder('ALERTS')}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              background: '#991B1B',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(153, 27, 27, 0.25)'
            }}
          >
            Review Expiring Documents →
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Vault Documents</span>
            <span className="fin-icon-pill icon-gold"><FolderArchive size={18} /></span>
          </div>
          <div className="fin-val">{docs.length} Verified Files</div>
          <div className="fin-sub">Indexed across {projects.length || 4} construction sites</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Blueprints & CAD</span>
            <span className="fin-icon-pill icon-cyan"><FileCode size={18} /></span>
          </div>
          <div className="fin-val text-cyan">{blueprintsCount} Active Layouts</div>
          <div className="fin-sub">Architectural, structural & MEP drawings</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Expiry & Renewal Alerts</span>
            <span className={`fin-icon-pill ${expiredDocs.length > 0 ? 'icon-red' : expiringSoonDocs.length > 0 ? 'icon-amber' : 'icon-green'}`}>
              <Clock size={18} />
            </span>
          </div>
          <div className={`fin-val ${expiredDocs.length > 0 ? 'text-red' : expiringSoonDocs.length > 0 ? 'text-amber' : 'text-green'}`}>
            {expiredDocs.length > 0 ? `${expiredDocs.length} Expired` : expiringSoonDocs.length > 0 ? `${expiringSoonDocs.length} Due Soon` : '100% Compliant'}
          </div>
          <div className="fin-sub">
            {expiredDocs.length > 0 ? 'Critical action required immediately' : expiringSoonDocs.length > 0 ? 'Renewal due within 60 days' : 'All permissions in order'}
          </div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Encrypted Cloud Vault</span>
            <span className="fin-icon-pill icon-green"><ShieldCheck size={18} /></span>
          </div>
          <div className="fin-val text-green">114.2 MB Stored</div>
          <div className="fin-sub">AES-256 Cloud Backup & Tamper Proof</div>
        </div>
      </div>

      {/* Search & Site Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFolder(f.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: activeFolder === f.id 
                  ? '1.5px solid #2563EB' 
                  : f.isAlert 
                    ? '1px solid rgba(239, 68, 68, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.7)',
                background: activeFolder === f.id 
                  ? '#0F172A' 
                  : f.isAlert 
                    ? 'rgba(254, 242, 242, 0.7)' 
                    : 'rgba(255, 255, 255, 0.65)',
                color: activeFolder === f.id 
                  ? '#FFFFFF' 
                  : f.isAlert 
                    ? '#B91C1C' 
                    : '#334155',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeFolder === f.id ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{f.label}</span>
              <span style={{
                background: activeFolder === f.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',
                padding: '2px 7px',
                borderRadius: '9999px',
                fontSize: '10.5px'
              }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Site Selection Dropdown */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search blueprints & NOCs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 14px 8px 34px',
                borderRadius: '12px',
                border: '1px solid rgba(203, 213, 225, 0.8)',
                background: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                color: '#0F172A',
                outline: 'none',
                width: '210px'
              }}
            />
          </div>

          {!filterProjectId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="#64748B" />
              <select
                value={selectedSiteFilter}
                onChange={(e) => setSelectedSiteFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '12px',
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Construction Sites</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.project_name || p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Documents Table Card */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <FolderArchive size={18} className="gold-text" />
            <h3 style={{ margin: 0 }}>
              Verified Repository & Compliance Vault ({filtered.length} Documents)
            </h3>
          </div>
          <span className="glass-pill" style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 700 }}>
            AES-256 Vault
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Document <span className="amp">&</span> Blueprint</th>
                <th>Category</th>
                <th>Construction Site</th>
                <th>Version <span className="amp">&</span> Format</th>
                <th>Upload Date</th>
                <th>Expiry <span className="amp">&</span> Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FolderArchive size={36} color="#94A3B8" />
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>No documents found matching the filter</div>
                      <button className="btn-dubai-gold" onClick={() => setShowUploadModal(true)}>
                        <Plus size={14} />
                        Upload First Blueprint
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(d => {
                  const exp = d.expiryInfo;
                  return (
                    <tr key={d.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: d.category === 'Blueprint' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                            color: d.category === 'Blueprint' ? '#2563EB' : '#D97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {d.category === 'Blueprint' ? <FileCode size={18} /> : <FileText size={18} />}
                          </div>
                          <div>
                            <div className="table-cell-title" style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                              {d.title}
                            </div>
                            <div className="table-cell-sub" style={{ fontSize: '11px', color: '#64748B' }}>
                              Ref: <b>#{d.id}</b> • By {d.uploaded_by}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`status-tag ${
                          d.category === 'Blueprint' ? 'tag-blue' :
                          d.category === 'NOC & Sanction' ? 'tag-purple' :
                          d.category === 'Safety & Insurance' ? 'tag-cyan' : 'tag-gold'
                        }`}>
                          {d.category}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                          {d.site}
                        </div>
                      </td>

                      <td>
                        <span className="trade-pill" style={{ fontSize: '11px' }}>
                          {d.version} • {d.type} ({d.size})
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '12px', color: '#475569' }}>
                          {d.upload_date}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span className={`status-tag ${
                            exp.isExpired ? 'tag-red' : 
                            exp.isExpiringSoon ? 'tag-amber' : 
                            'tag-green'
                          }`} style={{ width: 'fit-content' }}>
                            <span className="status-dot"></span>
                            {exp.badgeText}
                          </span>
                          <span style={{ fontSize: '10px', color: '#64748B' }}>
                            Expires: <b>{d.expiry_date}</b>
                          </span>
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          {/* Preview Blueprint */}
                          <button
                            onClick={() => setPreviewDoc(d)}
                            title="Preview Blueprint & Details"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              border: '1px solid rgba(37, 99, 235, 0.25)',
                              background: 'rgba(37, 99, 235, 0.08)',
                              color: '#2563EB',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Eye size={13} />
                            Preview
                          </button>

                          {/* Renew Button if expired or expiring */}
                          {(exp.isExpired || exp.isExpiringSoon) && (
                            <button
                              onClick={() => {
                                setRenewDoc(d);
                                setRenewDate('2027-12-31');
                              }}
                              title="Renew Expiry Date"
                              style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                background: 'rgba(254, 243, 199, 0.9)',
                                color: '#B45309',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <RefreshCw size={12} />
                              Renew
                            </button>
                          )}

                          {/* Download */}
                          <button
                            onClick={() => showToast(`Downloading verified package for "${d.title}"`)}
                            title="Download CAD / PDF"
                            style={{
                              padding: '6px 9px',
                              borderRadius: '8px',
                              border: '1px solid rgba(15, 23, 42, 0.15)',
                              background: 'rgba(255, 255, 255, 0.8)',
                              color: '#334155',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <Download size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(d.id, d.title)}
                            title="Delete Document"
                            style={{
                              padding: '6px 8px',
                              borderRadius: '8px',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              background: 'rgba(254, 242, 242, 0.6)',
                              color: '#EF4444',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          UPLOAD BLUEPRINT / DOCUMENT MODAL
      ======================================================== */}
      {showUploadModal && (
        <div className="modal-backdrop">
          <div className="dubai-modal-box large-modal" style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Upload Blueprint <span className="amp">&</span> Statutory Document</h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Add architectural CAD, municipal building sanctions or site insurance</div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowUploadModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="modal-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label>Document / Blueprint Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ground Floor Structural Beam Layout (Rev 3)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Construction Site *</label>
                  <select
                    value={formData.project_id}
                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.project_name || p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Blueprint">Architectural / Structural Blueprint (CAD / DWG)</option>
                    <option value="NOC & Sanction">Municipal Building Sanction & Commencement NOC</option>
                    <option value="Clearance">Pollution & Environmental Clearance (CTE/CTO)</option>
                    <option value="Legal Contract">EPC Agreement & Civil Contractor Contract</option>
                    <option value="Safety & Insurance">Safety Stability Audit & Workmen Insurance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>File Format & Version *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="DWG / CAD">AutoCAD (DWG/DXF)</option>
                      <option value="PDF / DWG">Vector PDF</option>
                      <option value="PDF Signed">Digitally Signed PDF</option>
                      <option value="High-Res Scan">High-Res Scan (JPG/PNG)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="e.g. Rev 2.1"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Expiry Settings Row */}
              <div className="form-group-row">
                <div className="form-group">
                  <label>Validity Duration *</label>
                  <select
                    value={formData.expiry_type}
                    onChange={(e) => setFormData({ ...formData, expiry_type: e.target.value })}
                  >
                    <option value="FIXED">Has Fixed Expiry Date (Statutory NOC / Insurance)</option>
                    <option value="PERPETUAL">Perpetual / Lifetime (Approved Blueprint / Drawings)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Expiry / Renewal Due Date {formData.expiry_type === 'FIXED' ? '*' : '(Disabled)'}</label>
                  <input
                    type="date"
                    disabled={formData.expiry_type === 'PERPETUAL'}
                    required={formData.expiry_type === 'FIXED'}
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    style={{
                      opacity: formData.expiry_type === 'PERPETUAL' ? 0.5 : 1
                    }}
                  />
                </div>
              </div>

              {/* Drag and Drop File Upload Area */}
              <div className="form-group">
                <label>File Attachment (Simulated CAD / PDF Upload)</label>
                <div 
                  onClick={() => {
                    const mockNames = [
                      'Skyline_Tower_Structural_Layout_Rev4.dwg',
                      'Municipal_Approval_Commencement_IMC_2026.pdf',
                      'PEB_Roofing_Gantry_Blueprint_Final.dwg'
                    ];
                    const chosen = mockNames[Math.floor(Math.random() * mockNames.length)];
                    setFormData({ ...formData, fileName: chosen });
                  }}
                  style={{
                    border: '2px dashed rgba(37, 99, 235, 0.4)',
                    borderRadius: '16px',
                    padding: '24px 16px',
                    background: 'rgba(239, 246, 255, 0.6)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Upload size={28} color="#2563EB" style={{ margin: '0 auto 8px auto' }} />
                  {formData.fileName ? (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E40AF' }}>
                        Selected: {formData.fileName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                        Size: 14.5 MB • Ready for encrypted cloud vault storage
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                        Click to browse or drop blueprint (DWG, CAD, PDF, PNG)
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                        Supports files up to 250 MB with automatic SHA-256 verification
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Technical Scope & Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Approved by Chief Structural Consultant with live load tolerances of 4.5 kN/m2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-glass-outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-dubai-gold">
                  <CheckCircle2 size={16} />
                  <span>Securely Upload to Vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          BLUEPRINT / DOCUMENT PREVIEW MODAL
      ======================================================== */}
      {previewDoc && (
        <div className="modal-backdrop">
          <div className="dubai-modal-box large-modal" style={{ maxWidth: '880px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCode size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{previewDoc.title}</h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Vault ID: #{previewDoc.id} • {previewDoc.site}
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setPreviewDoc(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Image / CAD Blueprint Viewer Frame */}
              <div style={{
                width: '100%',
                height: '320px',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                background: '#0B1329'
              }}>
                <img
                  src={previewDoc.preview_url}
                  alt={previewDoc.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: previewDoc.category === 'Blueprint' ? 'contrast(125%) saturate(85%) hue-rotate(185deg)' : 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '14px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(12px)',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Layers size={13} color="#38BDF8" />
                  CAD Layer Stack: 24 Architectural Layers Verified
                </div>
              </div>

              {/* Detailed Metadata Grid */}
              <div className="modal-details-grid">
                <div className="detail-cell">
                  <span className="detail-cell-label">Category & Classification</span>
                  <span className="detail-cell-val">{previewDoc.category}</span>
                </div>
                <div className="detail-cell">
                  <span className="detail-cell-label">Assigned Construction Site</span>
                  <span className="detail-cell-val">{previewDoc.site}</span>
                </div>
                <div className="detail-cell">
                  <span className="detail-cell-label">Version & Format</span>
                  <span className="detail-cell-val">{previewDoc.version} ({previewDoc.type}, {previewDoc.size})</span>
                </div>
                <div className="detail-cell">
                  <span className="detail-cell-label">Statutory Expiry Status</span>
                  <span className="detail-cell-val" style={{
                    color: previewDoc.expiryInfo?.isExpired ? '#EF4444' : previewDoc.expiryInfo?.isExpiringSoon ? '#D97706' : '#10B981'
                  }}>
                    {previewDoc.expiryInfo?.badgeText} ({previewDoc.expiry_date})
                  </span>
                </div>
              </div>

              {previewDoc.description && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'rgba(241, 245, 249, 0.8)',
                  fontSize: '12.5px',
                  color: '#334155',
                  lineHeight: 1.5
                }}>
                  <b>Scope Details:</b> {previewDoc.description}
                </div>
              )}

              <div className="modal-actions-bar">
                <button className="btn-glass-outline" onClick={() => setPreviewDoc(null)}>
                  Close Preview
                </button>
                <button 
                  className="btn-dubai-gold" 
                  onClick={() => {
                    showToast(`Downloading verified package for "${previewDoc.title}"`);
                    setPreviewDoc(null);
                  }}
                >
                  <Download size={15} />
                  <span>Download Blueprint Package</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          RENEW EXPIRY DATE MODAL
      ======================================================== */}
      {renewDoc && (
        <div className="modal-backdrop">
          <div className="dubai-modal-box" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F59E0B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RefreshCw size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Renew Statutory Document</h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Extend validity and update compliance ledger</div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setRenewDoc(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="modal-form">
              <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(254, 243, 199, 0.7)', border: '1px solid rgba(245, 158, 11, 0.4)', fontSize: '12px', color: '#92400E' }}>
                Renewing: <b>{renewDoc.title}</b> ({renewDoc.site})
              </div>

              <div className="form-group">
                <label>New Expiry / Renewal Date *</label>
                <input
                  type="date"
                  required
                  value={renewDate}
                  onChange={(e) => setRenewDate(e.target.value)}
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-glass-outline" onClick={() => setRenewDoc(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-dubai-gold">
                  <CheckCircle2 size={16} />
                  <span>Confirm Renewal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
