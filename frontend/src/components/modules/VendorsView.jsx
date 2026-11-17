import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  MessageSquare,
  CreditCard,
  FileText,
  X,
  Building,
  Star,
  Receipt,
  Download
} from 'lucide-react';
import { api, DEFAULT_VENDORS } from '../../api/client';

export default function VendorsView() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [balanceFilter, setBalanceFilter] = useState('ALL'); // 'ALL', 'PENDING', 'SETTLED'
  const [toastMsg, setToastMsg] = useState('');

  // Modals state
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [selectedVendorDossier, setSelectedVendorDossier] = useState(null);
  const [paymentVendor, setPaymentVendor] = useState(null);

  // Add / Edit Form State
  const [vendorForm, setVendorForm] = useState({
    name: '',
    company: '',
    category: 'Cement & Concrete',
    contact_person: '',
    contact: '',
    email: '',
    gst: '',
    pan: '',
    location: '',
    payment_terms: 'Net 30 Days',
    bank_account: '',
    openingPayable: '0',
    rateItem: '',
    rateUnit: 'Unit',
    ratePrice: ''
  });

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    mode: 'RTGS',
    reference_no: '',
    date: new Date().toISOString().split('T')[0],
    remarks: 'Payment towards supplier pending bills'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const loadVendors = async () => {
    setLoading(true);
    try {
      const data = await api.getVendors();
      setVendors(Array.isArray(data) && data.length > 0 ? data : DEFAULT_VENDORS);
    } catch (err) {
      console.error('Error loading vendors:', err);
      setVendors(DEFAULT_VENDORS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Commodities' },
    { id: 'Cement & Concrete', label: 'Cement & Concrete' },
    { id: 'TMT & Structural Steel', label: 'TMT & Steel' },
    { id: 'Sand & Crushed Aggregates', label: 'Sand & Aggregates' },
    { id: 'Electrical & Conduits', label: 'Electrical & Cables' },
    { id: 'Plumbing & Sanitary', label: 'Plumbing & Pipes' },
    { id: 'Bricks & Flyash Blocks', label: 'Bricks & AAC Blocks' }
  ];

  // Filtering
  const filteredVendors = vendors.filter(v => {
    if (selectedCategory !== 'ALL' && v.category !== selectedCategory) return false;
    
    if (balanceFilter === 'PENDING' && (v.pendingPayable || 0) <= 0) return false;
    if (balanceFilter === 'SETTLED' && (v.pendingPayable || 0) > 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (v.name || '').toLowerCase().includes(q);
      const matchPerson = (v.contact_person || '').toLowerCase().includes(q);
      const matchGst = (v.gst || '').toLowerCase().includes(q);
      const matchLocation = (v.location || '').toLowerCase().includes(q);
      const matchCategory = (v.category || '').toLowerCase().includes(q);
      if (!matchName && !matchPerson && !matchGst && !matchLocation && !matchCategory) return false;
    }

    return true;
  });

  // Calculate KPIs
  const totalPayables = vendors.reduce((sum, v) => sum + (Number(v.pendingPayable) || 0), 0);
  const totalProcurement = vendors.reduce((sum, v) => sum + (Number(v.totalPurchased) || 0), 0);
  const pendingCount = vendors.filter(v => (v.pendingPayable || 0) > 0).length;

  // Open Create Modal
  const openCreateModal = () => {
    setEditingVendor(null);
    setVendorForm({
      name: '',
      company: '',
      category: 'Cement & Concrete',
      contact_person: '',
      contact: '',
      email: '',
      gst: '',
      pan: '',
      location: '',
      payment_terms: 'Net 30 Days',
      bank_account: '',
      openingPayable: '0',
      rateItem: '',
      rateUnit: 'Unit',
      ratePrice: ''
    });
    setShowAddEditModal(true);
  };

  // Open Edit Modal
  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    const firstRate = vendor.rateContracts?.[0] || {};
    setVendorForm({
      name: vendor.name || '',
      company: vendor.company || '',
      category: vendor.category || 'Cement & Concrete',
      contact_person: vendor.contact_person || '',
      contact: vendor.contact || '',
      email: vendor.email || '',
      gst: vendor.gst || '',
      pan: vendor.pan || '',
      location: vendor.location || '',
      payment_terms: vendor.payment_terms || 'Net 30 Days',
      bank_account: vendor.bank_account || '',
      openingPayable: String(vendor.pendingPayable || 0),
      rateItem: firstRate.item || '',
      rateUnit: firstRate.unit || 'Unit',
      ratePrice: firstRate.rate ? String(firstRate.rate) : ''
    });
    setShowAddEditModal(true);
  };

  // Handle Save (Create or Update)
  const handleSaveVendor = async (e) => {
    e.preventDefault();
    if (!vendorForm.name.trim()) {
      alert('Please enter supplier / vendor firm name.');
      return;
    }

    const rateContracts = [];
    if (vendorForm.rateItem && vendorForm.ratePrice) {
      rateContracts.push({
        item: vendorForm.rateItem,
        unit: vendorForm.rateUnit,
        rate: Number(vendorForm.ratePrice),
        validity: '2027-03-31'
      });
    }

    const payload = {
      name: vendorForm.name,
      company: vendorForm.company || vendorForm.name,
      category: vendorForm.category,
      contact_person: vendorForm.contact_person || 'Sales Representative',
      contact: vendorForm.contact || '+91 98000 00000',
      email: vendorForm.email || 'supplier@sitepilot.com',
      gst: (vendorForm.gst || '23AAAAA0000A1Z5').toUpperCase(),
      pan: (vendorForm.pan || (vendorForm.gst ? vendorForm.gst.substring(2, 12) : 'AAAAA0000A')).toUpperCase(),
      location: vendorForm.location,
      payment_terms: vendorForm.payment_terms,
      bank_account: vendorForm.bank_account || 'HDFC Bank (IFSC: HDFC0000101)',
      pendingPayable: parseFloat(vendorForm.openingPayable) || 0,
      totalPurchased: editingVendor ? editingVendor.totalPurchased : 0,
      rating: editingVendor ? editingVendor.rating : 4.8,
      status: 'ACTIVE',
      rateContracts: rateContracts.length > 0 ? rateContracts : (editingVendor?.rateContracts || []),
      ledger: editingVendor?.ledger || [
        { id: `TX-${Date.now().toString().slice(-4)}`, date: new Date().toISOString().split('T')[0], type: 'OPENING', description: 'Opening Balance Ledger Entry', amount: parseFloat(vendorForm.openingPayable) || 0, balance: parseFloat(vendorForm.openingPayable) || 0 }
      ]
    };

    if (editingVendor) {
      await api.updateVendor(editingVendor.id, payload);
      showToast(`Supplier "${vendorForm.name}" updated successfully.`);
    } else {
      await api.createVendor(payload);
      showToast(`Authorized Supplier "${vendorForm.name}" onboarded successfully!`);
    }

    setShowAddEditModal(false);
    await loadVendors();
  };

  // Handle Delete
  const handleDeleteVendor = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the supplier directory?`)) {
      await api.deleteVendor(id);
      await loadVendors();
      if (selectedVendorDossier?.id === id) setSelectedVendorDossier(null);
      showToast(`Supplier "${name}" removed from directory.`);
    }
  };

  // Open Payment Modal
  const openPaymentModal = (vendor) => {
    setPaymentVendor(vendor);
    setPaymentForm({
      amount: String(vendor.pendingPayable > 0 ? vendor.pendingPayable : 50000),
      mode: 'RTGS',
      reference_no: `UTR-${Math.floor(10000000 + Math.random() * 90000000)}`,
      date: new Date().toISOString().split('T')[0],
      remarks: `Payment towards Bill #${Math.floor(1000 + Math.random() * 9000)}`
    });
  };

  // Handle Submit Payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    await api.recordVendorPayment(paymentVendor.id, paymentForm);
    showToast(`Recorded payment of ₹${Number(paymentForm.amount).toLocaleString('en-IN')} to "${paymentVendor.name}"!`);
    setPaymentVendor(null);
    await loadVendors();

    // If dossier is currently open, refresh it
    if (selectedVendorDossier?.id === paymentVendor.id) {
      const refreshedList = await api.getVendors();
      const updated = refreshedList.find(v => v.id === paymentVendor.id);
      if (updated) setSelectedVendorDossier(updated);
    }
  };

  // Full-Screen Onboard / Edit Supplier View (Widescreen 2-Column Format)
  if (showAddEditModal) {
    return (
      <div className="module-view-container animate-fade-in" style={{ width: '100%' }}>
        {/* Top Header Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              type="button"
              onClick={() => setShowAddEditModal(false)}
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
              <span>Back to Suppliers Directory</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                {editingVendor ? 'Edit Supplier Profile & Terms' : 'Onboard Authorized Construction Material Supplier'}
              </h1>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Register wholesale suppliers, GST registration, payment terms, and locked agreed rate contracts
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setShowAddEditModal(false)}
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

        {/* 2-Column Full Screen Form & Real-time Live Supplier Card */}
        <form onSubmit={handleSaveVendor} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          {/* Left Column: Form Controls */}
          <div className="glass-card" style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>FIRM / SUPPLIER TRADE NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraTech Cement Depot Indore"
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>COMMODITY CATEGORY *</label>
                <select
                  value={vendorForm.category}
                  onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                >
                  <option value="Cement & Concrete">Cement & Ready-Mix Concrete</option>
                  <option value="TMT & Structural Steel">TMT Steel, Rebar & Structural Angles</option>
                  <option value="Sand & Crushed Aggregates">Sand, Crushed Blue Metal & Aggregates</option>
                  <option value="Electrical & Conduits">Electrical Wires, Cables & Conduits</option>
                  <option value="Plumbing & Sanitary">Plumbing Pipes, Valves & Sanitaryware</option>
                  <option value="Bricks & Flyash Blocks">Bricks, AAC Blocks & Flyash</option>
                  <option value="Hardware & Tools">Hardware, Fasteners & Safety Gear</option>
                </select>
              </div>
            </div>

            {/* Row 2: Contact Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>CONTACT PERSON</label>
                <input
                  type="text"
                  placeholder="e.g. Er. Rajesh Singhania"
                  value={vendorForm.contact_person}
                  onChange={(e) => setVendorForm({ ...vendorForm, contact_person: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>MOBILE / WHATSAPP *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98260 11223"
                  value={vendorForm.contact}
                  onChange={(e) => setVendorForm({ ...vendorForm, contact: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>OFFICIAL EMAIL</label>
                <input
                  type="email"
                  placeholder="sales@supplier.com"
                  value={vendorForm.email}
                  onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>
            </div>

            {/* Row 3: Tax Identifiers & Credit Terms */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.35fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>GSTIN NUMBER</label>
                <input
                  type="text"
                  placeholder="23AAACU1234F1Z5"
                  value={vendorForm.gst}
                  onChange={(e) => setVendorForm({ ...vendorForm, gst: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>PAN NUMBER</label>
                <input
                  type="text"
                  placeholder="AAACU1234F"
                  value={vendorForm.pan}
                  onChange={(e) => setVendorForm({ ...vendorForm, pan: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>CREDIT / PAYMENT TERMS</label>
                <select
                  value={vendorForm.payment_terms}
                  onChange={(e) => setVendorForm({ ...vendorForm, payment_terms: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="Advance on Dispatch">Advance on Dispatch (100% Pre-paid)</option>
                  <option value="Weekly Billing">Weekly Consolidated Billing</option>
                  <option value="Net 15 Days">Net 15 Days Credit</option>
                  <option value="Net 30 Days">Net 30 Days Credit (Standard)</option>
                  <option value="Net 45 Days">Net 45 Days Credit</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>WAREHOUSE / DEPOT ADDRESS *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pithampur Industrial Area, Sector 3, Indore"
                  value={vendorForm.location}
                  onChange={(e) => setVendorForm({ ...vendorForm, location: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>BANK ACCOUNT & IFSC</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank - 50200034821190 (IFSC: HDFC0000281)"
                  value={vendorForm.bank_account}
                  onChange={(e) => setVendorForm({ ...vendorForm, bank_account: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(203, 213, 225, 0.85)', background: '#ffffff', fontSize: '12.5px', outline: 'none' }}
                />
              </div>
            </div>

            {/* Rate Contract Entry */}
            <div style={{
              background: 'rgba(241, 245, 249, 0.75)',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid rgba(203, 213, 225, 0.8)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Receipt size={14} color="#2563EB" />
                <span>Primary Agreed Rate Contract (Locked Wholesale Rate)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>Item Specification</label>
                  <input
                    type="text"
                    placeholder="e.g. UltraTech 53G OPC Cement"
                    value={vendorForm.rateItem}
                    onChange={(e) => setVendorForm({ ...vendorForm, rateItem: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#fff', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. Bag (50kg) / Ton"
                    value={vendorForm.rateUnit}
                    onChange={(e) => setVendorForm({ ...vendorForm, rateUnit: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#fff', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>Agreed Rate (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 390"
                    value={vendorForm.ratePrice}
                    onChange={(e) => setVendorForm({ ...vendorForm, ratePrice: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#fff', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Supplier Card Preview & Aligned Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Supplier Card Preview
                </span>
                <span className="glass-pill" style={{ padding: '3px 10px', fontSize: '11px', fontWeight: 800, color: '#059669' }}>
                  ✓ Approved Vendor
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {vendorForm.name || 'Supplier Trade Name'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>
                  <MapPin size={13} color="#2563EB" />
                  <span>{vendorForm.location || 'Depot Address'}</span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(226, 232, 240, 0.85)'
              }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Category</div>
                  <div style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>{vendorForm.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Terms</div>
                  <div style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>{vendorForm.payment_terms}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Contact Person</div>
                  <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{vendorForm.contact_person || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Phone</div>
                  <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{vendorForm.contact || 'N/A'}</div>
                </div>
              </div>

              <div style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(241, 245, 249, 0.85)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                fontSize: '11.5px',
                color: '#475569',
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <ShieldCheck size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Onboarding this vendor enables auto-matching for Purchase Orders (PO) and wholesale material requisition deliveries.</span>
              </div>
            </div>

            {/* Action Buttons Aligned on the Right Side (Matching ProjectsView and Dashboard) */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button 
                type="button" 
                className="btn-glass-outline" 
                onClick={() => setShowAddEditModal(false)} 
                style={{ padding: '12px 24px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{ 
                  flex: 1, 
                  padding: '13px 24px', 
                  borderRadius: '9999px', 
                  background: '#0F172A',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  border: 'none',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                <CheckCircle2 size={16} />
                <span>{editingVendor ? 'Save Changes' : 'Onboard Supplier'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

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
          <h2 className="module-title">Vendor <span className="amp">&</span> Supplier Management</h2>
          <p className="module-subtitle">
            Authorized suppliers, wholesale rate contracts, purchase order ledgers, GST compliance <span className="amp">&</span> pending payables
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn-dubai-gold" onClick={openCreateModal}>
            <Plus size={16} />
            <span>Onboard Supplier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Active Suppliers</span>
            <span className="fin-icon-pill icon-gold"><Store size={18} /></span>
          </div>
          <div className="fin-val">{vendors.length} Verified Vendors</div>
          <div className="fin-sub">Cement, Steel, Aggregates, Electricals</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Total Outstandings</span>
            <span className="fin-icon-pill icon-rose"><IndianRupee size={18} /></span>
          </div>
          <div className="fin-val text-rose">₹{(totalPayables / 100000).toFixed(2)} Lakhs</div>
          <div className="fin-sub">{pendingCount} suppliers with balance due</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Cumulative Procurement</span>
            <span className="fin-icon-pill icon-green"><Truck size={18} /></span>
          </div>
          <div className="fin-val text-green">₹{(totalProcurement / 10000000).toFixed(2)} Cr</div>
          <div className="fin-sub">Total material inward value to date</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">SLA Delivery Reliability</span>
            <span className="fin-icon-pill icon-amber"><CheckCircle2 size={18} /></span>
          </div>
          <div className="fin-val text-amber">98.4% On-Time</div>
          <div className="fin-sub">Average vendor performance rating: 4.8 ★</div>
        </div>
      </div>

      {/* Search, Filter & Tabs Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: selectedCategory === c.id ? '1.5px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.7)',
                background: selectedCategory === c.id ? '#0F172A' : 'rgba(255, 255, 255, 0.65)',
                color: selectedCategory === c.id ? '#FFFFFF' : '#334155',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: selectedCategory === c.id ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search & Balance Status Filter */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search vendor, GSTIN, location..."
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
                width: '230px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#64748B" />
            <select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
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
              <option value="ALL">All Balances</option>
              <option value="PENDING">Has Outstanding Payables</option>
              <option value="SETTLED">Fully Settled / Zero Balance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Vendors Directory Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Store size={18} className="gold-text" />
            <h3 style={{ margin: 0 }}>
              Authorized Supplier Directory & Payables Ledger ({filteredVendors.length} Suppliers)
            </h3>
          </div>
          <span className="glass-pill" style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 700 }}>
            GST Registered & Verified
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Vendor / Firm Name</th>
                <th>Category</th>
                <th>Contact & WhatsApp</th>
                <th>Depot & Location</th>
                <th>Payment Terms</th>
                <th>Total Business</th>
                <th>Pending Balance</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <Store size={36} color="#94A3B8" />
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>No suppliers found matching your filter</div>
                      <button className="btn-dubai-gold" onClick={openCreateModal}>
                        <Plus size={14} />
                        Add New Supplier
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVendors.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div>
                        <div className="table-cell-title" style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                          {v.name}
                        </div>
                        <div className="table-cell-sub" style={{ fontSize: '11px', color: '#64748B' }}>
                          GSTIN: <b>{v.gst}</b> • PAN: {v.pan || 'Applied'}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="status-tag tag-cyan">
                        {v.category}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                          {v.contact_person || 'Sales Rep'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <a 
                            href={`tel:${v.contact.replace(/\s+/g, '')}`} 
                            style={{ fontSize: '11px', color: '#2563EB', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          >
                            <Phone size={11} /> {v.contact}
                          </a>
                          <a 
                            href={`https://wa.me/${v.contact.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center' }}
                          >
                            <MessageSquare size={12} />
                          </a>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ color: '#475569', fontSize: '11.5px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.location}
                      </div>
                    </td>

                    <td>
                      <span className="trade-pill" style={{ fontSize: '10.5px' }}>
                        {v.payment_terms || 'Net 30 Days'}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, fontSize: '12px', color: '#0F172A' }}>
                        ₹{(v.totalPurchased / 100000).toFixed(2)} L
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ 
                          fontWeight: 800, 
                          fontSize: '12.5px',
                          color: (v.pendingPayable || 0) > 0 ? '#DC2626' : '#10B981' 
                        }}>
                          ₹{((v.pendingPayable || 0) / 100000).toFixed(2)} L
                        </span>
                        <span style={{ fontSize: '10px', color: (v.pendingPayable || 0) > 0 ? '#B91C1C' : '#059669', fontWeight: 600 }}>
                          {(v.pendingPayable || 0) > 0 ? 'Pending Payment' : 'Settled Clean'}
                        </span>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        {/* View Dossier & Ledger */}
                        <button
                          onClick={() => setSelectedVendorDossier(v)}
                          title="View Supplier Dossier, Rates & Ledger"
                          style={{
                            padding: '6px 11px',
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
                          <Receipt size={13} />
                          Ledger
                        </button>

                        {/* Record Payment Button */}
                        <button
                          onClick={() => openPaymentModal(v)}
                          title="Record Payment / Settlement"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#059669',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CreditCard size={12} />
                          Pay
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(v)}
                          title="Edit Supplier Profile"
                          style={{
                            padding: '6px 8px',
                            borderRadius: '8px',
                            border: '1px solid rgba(15, 23, 42, 0.15)',
                            background: '#FFFFFF',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          <Edit2 size={12} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteVendor(v.id, v.name)}
                          title="Delete Supplier"
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
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          RECORD VENDOR PAYMENT MODAL
      ======================================================== */}
      {paymentVendor && (
        <div className="modal-backdrop">
          <div className="dubai-modal-box" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Record Supplier Settlement</h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Payout to {paymentVendor.name}
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setPaymentVendor(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="modal-form">
              <div style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'rgba(236, 253, 245, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontSize: '12.5px',
                color: '#065F46',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Current Pending Balance:</div>
                  <div style={{ fontSize: '11.5px', color: '#047857' }}>Bank: {paymentVendor.bank_account || 'Registered Account'}</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#DC2626' }}>
                  ₹{(paymentVendor.pendingPayable || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Payment Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Enter amount"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Payment Mode *</label>
                  <select
                    value={paymentForm.mode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                  >
                    <option value="RTGS">RTGS Bank Transfer</option>
                    <option value="NEFT">NEFT Transfer</option>
                    <option value="IMPS">IMPS Immediate Payout</option>
                    <option value="CHEQUE">Bank Cheque</option>
                    <option value="CASH">Site Petty Cash</option>
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Bank UTR / Cheque Ref No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UTR-HDFC99812731"
                    value={paymentForm.reference_no}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference_no: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Remarks & Invoice Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Settlement for Bill #INV-8891 (1,200 Bags Cement)"
                  value={paymentForm.remarks}
                  onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-glass-outline" onClick={() => setPaymentVendor(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-dubai-gold">
                  <CheckCircle2 size={16} />
                  <span>Execute Settlement Payout</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VENDOR DOSSIER, RATE CONTRACTS & LEDGER MODAL
      ======================================================== */}
      {selectedVendorDossier && (
        <div className="modal-backdrop">
          <div className="dubai-modal-box large-modal" style={{ maxWidth: '880px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{selectedVendorDossier.name}</h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    GSTIN: <b>{selectedVendorDossier.gst}</b> • {selectedVendorDossier.category}
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedVendorDossier(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Financial Profile Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                background: 'rgba(241, 245, 249, 0.75)',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid rgba(203, 213, 225, 0.8)'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Pending Balance</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: (selectedVendorDossier.pendingPayable || 0) > 0 ? '#DC2626' : '#10B981' }}>
                    ₹{(selectedVendorDossier.pendingPayable || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Total Procurement</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                    ₹{(selectedVendorDossier.totalPurchased || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Payment Terms</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB' }}>
                    {selectedVendorDossier.payment_terms || 'Net 30 Days'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Performance Rating</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#D97706' }}>
                    ★ {selectedVendorDossier.rating || 4.8} / 5.0
                  </span>
                </div>
              </div>

              {/* Commercial Dossier Details */}
              <div className="modal-details-grid">
                <div className="detail-cell">
                  <span className="detail-cell-label">Contact Person & Phone</span>
                  <span className="detail-cell-val">
                    {selectedVendorDossier.contact_person} • {selectedVendorDossier.contact}
                  </span>
                </div>
                <div className="detail-cell">
                  <span className="detail-cell-label">Warehouse Depot</span>
                  <span className="detail-cell-val">{selectedVendorDossier.location}</span>
                </div>
                <div className="detail-cell">
                  <span className="detail-cell-label">Bank Account & IFSC</span>
                  <span className="detail-cell-val">{selectedVendorDossier.bank_account || 'Registered Corporate Account'}</span>
                </div>
                <div className="detail-cell">
                  <span className="detail-cell-label">GSTIN / PAN Tax Clearance</span>
                  <span className="detail-cell-val" style={{ color: '#059669' }}>
                    ✓ Active (ITC Claim Eligible)
                  </span>
                </div>
              </div>

              {/* Agreed Rate Contracts Table */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Receipt size={16} color="#2563EB" />
                  <span>Wholesale Rate Contracts (Agreed Pricing)</span>
                </h4>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                  <table className="dubai-table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th>Material Specification</th>
                        <th>Unit</th>
                        <th>Locked Rate (₹)</th>
                        <th>Price Lock Validity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVendorDossier.rateContracts && selectedVendorDossier.rateContracts.length > 0 ? (
                        selectedVendorDossier.rateContracts.map((rc, idx) => (
                          <tr key={idx}>
                            <td><b>{rc.item}</b></td>
                            <td>{rc.unit}</td>
                            <td><b style={{ color: '#059669' }}>₹{rc.rate?.toLocaleString('en-IN')}</b></td>
                            <td>Valid until {rc.validity}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: '#64748B' }}>Standard Market Wholesale Rates Apply</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transaction Ledger */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} color="#059669" />
                  <span>Transaction Ledger & Payment History</span>
                </h4>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                  <table className="dubai-table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Transaction Description</th>
                        <th>Amount (₹)</th>
                        <th>Running Balance (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVendorDossier.ledger && selectedVendorDossier.ledger.length > 0 ? (
                        selectedVendorDossier.ledger.map((tx, idx) => (
                          <tr key={idx}>
                            <td>{tx.date}</td>
                            <td>
                              <span className={`status-tag ${tx.type === 'PAYMENT' ? 'tag-green' : tx.type === 'INVOICE' ? 'tag-amber' : 'tag-blue'}`}>
                                {tx.type}
                              </span>
                            </td>
                            <td>{tx.description}</td>
                            <td>
                              <b style={{ color: tx.amount > 0 ? '#DC2626' : '#059669' }}>
                                {tx.amount > 0 ? `+₹${tx.amount.toLocaleString('en-IN')}` : `-₹${Math.abs(tx.amount).toLocaleString('en-IN')}`}
                              </b>
                            </td>
                            <td><b>₹{(tx.balance || 0).toLocaleString('en-IN')}</b></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', color: '#64748B' }}>No ledger entries found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button className="btn-glass-outline" onClick={() => setSelectedVendorDossier(null)}>
                  Close Dossier
                </button>
                <button 
                  className="btn-dubai-gold"
                  onClick={() => {
                    const target = selectedVendorDossier;
                    setSelectedVendorDossier(null);
                    openPaymentModal(target);
                  }}
                >
                  <CreditCard size={15} />
                  <span>Record Payment Settlement</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
