import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { 
  WalletCards, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Plus, 
  Receipt, 
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function AccountsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const [formData, setFormData] = useState({
    project_id: '1',
    category: 'CUSTOMER_PAYMENT',
    amount: '',
    payment_mode: 'BANK_TRANSFER',
    invoice_no: '',
    vendor_payee: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0]
  });

  const loadData = () => {
    setLoading(true);
    api.getAccounts()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.createTransaction({
      ...formData,
      amount: parseFloat(formData.amount) || 0
    }).then(() => {
      setShowModal(false);
      loadData();
      setFormData({
        project_id: '1',
        category: 'CUSTOMER_PAYMENT',
        amount: '',
        payment_mode: 'BANK_TRANSFER',
        invoice_no: '',
        vendor_payee: '',
        description: '',
        expense_date: new Date().toISOString().split('T')[0]
      });
    });
  };

  if (loading || !data) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
        Loading accounts and payments telemetry...
      </div>
    );
  }

  const { summary, sitePL, transactions } = data;

  const categories = [
    { id: 'CUSTOMER_PAYMENT', label: 'Customer Payment (Income)', isIncome: true, icon: ArrowUpRight, color: '#10B981' },
    { id: 'MATERIAL', label: 'Material Purchase (Expense)', isIncome: false, icon: Receipt, color: '#3B82F6' },
    { id: 'CONTRACTOR', label: 'Contractor Billing (Expense)', isIncome: false, icon: Building2, color: '#F59E0B' },
    { id: 'LABOUR', label: 'Labour Wages Payout (Expense)', isIncome: false, icon: User, color: '#8B5CF6' },
    { id: 'EQUIPMENT', label: 'Machinery & Equipment Rental', isIncome: false, icon: WalletCards, color: '#06B6D4' },
    { id: 'MISC', label: 'Miscellaneous Site Expense', isIncome: false, icon: FileText, color: '#64748B' },
  ];

  const selectedCategoryObj = categories.find(c => c.id === formData.category) || categories[0];
  const selectedSiteObj = sitePL.find(s => String(s.id) === String(formData.project_id)) || sitePL[0];

  // =========================================================================
  // 1. FULL-SCREEN / FULL-VIEW ADD RECORD EXPERIENCE (Website Theme Matching)
  // =========================================================================
  if (showModal) {
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
              <span>Back to Ledger</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Record New Payment / Invoice Entry
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

        {/* 2-Column Full Screen Form & Real-time Live Voucher Grid */}
        <form onSubmit={handleSubmit} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          
          {/* Left Column: Form Controls inside Glass Card */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Category Selector Pills */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '10px' }}>
                1. SELECT TRANSACTION CATEGORY
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '14px',
                        border: isSelected ? '1.5px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.8)',
                        background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                        color: isSelected ? '#0F172A' : '#64748B',
                        boxShadow: isSelected ? '0 6px 18px rgba(37, 99, 235, 0.15)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '11.5px',
                        fontWeight: isSelected ? 800 : 600,
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isSelected ? cat.color : 'rgba(15, 23, 42, 0.06)',
                        color: isSelected ? '#ffffff' : cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={12} />
                      </div>
                      <span style={{ lineHeight: 1.2 }}>{cat.label.split('(')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Site & Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  CONSTRUCTION SITE
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
                  {sitePL.map(s => (
                    <option key={s.id} value={s.id}>{s.project_name} ({s.location})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  TRANSACTION DATE
                </label>
                <input 
                  type="date"
                  value={formData.expense_date}
                  onChange={e => setFormData({ ...formData, expense_date: e.target.value })}
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
            </div>

            {/* Step 3: Amount with Quick Presets */}
            <div className="form-group">
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                <span>AMOUNT (₹ INR)</span>
                <span style={{ color: '#2563EB', fontWeight: 600 }}>Enter numeric value</span>
              </label>
              {/* Clean Flex Prefix Input (No text overlap) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(203, 213, 225, 0.85)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{
                  padding: '0 16px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#2563EB',
                  background: 'rgba(241, 245, 249, 0.75)',
                  borderRight: '1px solid rgba(203, 213, 225, 0.85)',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none'
                }}>
                  ₹
                </div>
                <input 
                  type="number" 
                  required 
                  placeholder="250000"
                  value={formData.amount} 
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 14px',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0F172A',
                    outline: 'none',
                    minWidth: 0
                  }}
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>Quick:</span>
                {[50000, 100000, 250000, 500000, 1000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: String(val) })}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(203, 213, 225, 0.7)',
                      background: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{(val / 100000 >= 1) ? `${val / 100000}L` : `${val / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Payee & Reference */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                  VENDOR / PAYEE / CLIENT NAME
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="UltraTech Cements or Skyline Client"
                  value={formData.vendor_payee} 
                  onChange={e => setFormData({ ...formData, vendor_payee: e.target.value })}
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
                  INVOICE / VOUCHER NO
                </label>
                <input 
                  type="text" 
                  placeholder="INV-2026-891"
                  value={formData.invoice_no} 
                  onChange={e => setFormData({ ...formData, invoice_no: e.target.value })}
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

            {/* Step 5: Payment Mode */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                PAYMENT MODE
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'BANK_TRANSFER', label: 'Bank Transfer (NEFT/RTGS)' },
                  { id: 'UPI', label: 'UPI' },
                  { id: 'CHEQUE', label: 'Cheque' },
                  { id: 'CASH', label: 'Cash' },
                ].map(mode => {
                  const isModeActive = formData.payment_mode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, payment_mode: mode.id })}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '9999px',
                        border: isModeActive ? '1px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.8)',
                        background: isModeActive ? '#2563EB' : 'rgba(255, 255, 255, 0.6)',
                        color: isModeActive ? '#ffffff' : '#475569',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 6: Description */}
            <div className="form-group">
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                PURPOSE / REMARKS / WORK DETAILS
              </label>
              <textarea 
                rows="2"
                placeholder="Specific slab casting, steel invoice, milestone installment or weekly wage payout..."
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
          </div>

          {/* Right Column: Real-time Live Voucher Card & Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Voucher Preview Card */}
            <div className="glass-card" style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.35))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Voucher Preview
                </span>
                <span className="glass-pill" style={{ 
                  padding: '3px 10px', 
                  fontSize: '10.5px', 
                  fontWeight: 800,
                  color: selectedCategoryObj.color,
                  background: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {selectedCategoryObj.isIncome ? '● INFLOW' : '● OUTFLOW'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Total Voucher Value</span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
                  ₹{formData.amount ? Number(formData.amount).toLocaleString('en-IN') : '0.00'}
                </div>
              </div>

              <div style={{ 
                padding: '14px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.55)', 
                border: '1px solid rgba(255, 255, 255, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Site Location:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedSiteObj?.project_name || 'Selected Site'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Party / Vendor:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{formData.vendor_payee || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Invoice / Ref:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{formData.invoice_no || 'AUTO-VOUCHER'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Payment Mode:</span>
                  <span style={{ fontWeight: 700, color: '#2563EB' }}>{formData.payment_mode}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748B' }}>Entry Date:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{formData.expense_date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>Encrypted ledger audit trail will be logged upon confirmation</span>
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
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <CheckCircle2 size={16} />
                <span>Save & Confirm Transaction</span>
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
  // 2. MAIN ACCOUNTS & FINANCIAL LEDGER DASHBOARD VIEW
  // =========================================================================
  const filteredTransactions = filterCategory === 'ALL'
    ? transactions
    : transactions.filter(t => t.category === filterCategory);

  return (
    <div className="module-view-container">
      {/* Action Header */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Accounts & Financial Ledger</h2>
          <p className="module-subtitle">Site budgets, contractor payouts, material invoices, client receipts & P&L</p>
        </div>
        <button className="btn-dubai-gold" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          <span>Record Transaction</span>
        </button>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Total Contract Value</span>
            <span className="fin-icon-pill icon-gold"><IndianRupee size={18} /></span>
          </div>
          <div className="fin-val">₹{(summary.totalContractValue / 10000000).toFixed(2)} Cr</div>
          <div className="fin-sub">Cumulative portfolio commitment</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Customer Receipts Received</span>
            <span className="fin-icon-pill icon-green"><ArrowUpRight size={18} /></span>
          </div>
          <div className="fin-val text-green">₹{(summary.totalCustomerReceived / 10000000).toFixed(2)} Cr</div>
          <div className="fin-sub">Milestone payments collected</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Pending Client Receivables</span>
            <span className="fin-icon-pill icon-rose"><Clock size={18} /></span>
          </div>
          <div className="fin-val text-rose">₹{(summary.pendingCustomerPayments / 10000000).toFixed(2)} Cr</div>
          <div className="fin-sub">Balance payment pending from buyers</div>
        </div>

        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Total Site Expenses Incurred</span>
            <span className="fin-icon-pill icon-amber"><Receipt size={18} /></span>
          </div>
          <div className="fin-val text-amber">₹{(summary.totalActualExpenses / 10000000).toFixed(2)} Cr</div>
          <div className="fin-sub">Material, Labour & Contractor payouts</div>
        </div>
      </div>

      {/* Expense Category Breakdown Pills */}
      <div className="category-breakdown-row">
        <div className="breakdown-pill">
          <span className="pill-dot dot-cyan"></span>
          <span>Materials: <b>₹{(summary.breakdown.material / 100000).toFixed(2)} L</b></span>
        </div>
        <div className="breakdown-pill">
          <span className="pill-dot dot-amber"></span>
          <span>Contractors: <b>₹{(summary.breakdown.contractor / 100000).toFixed(2)} L</b></span>
        </div>
        <div className="breakdown-pill">
          <span className="pill-dot dot-purple"></span>
          <span>Labour Wages: <b>₹{(summary.breakdown.labour / 100000).toFixed(2)} L</b></span>
        </div>
        <div className="breakdown-pill">
          <span className="pill-dot dot-blue"></span>
          <span>Equipment & Fuel: <b>₹{(summary.breakdown.equipment / 100000).toFixed(2)} L</b></span>
        </div>
      </div>

      {/* Site-wise Profit & Loss Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Building2 size={18} className="gold-text" />
            <h3>Site-wise Profit & Loss (P&L) Analysis</h3>
          </div>
          <span className="glass-pill" style={{ padding: '3px 12px', fontSize: '11px', fontWeight: 700 }}>
            {sitePL.length} Sites Tracked
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Site & Location</th>
                <th>Contract Value</th>
                <th>Received</th>
                <th>Expenses</th>
                <th>Est. Site Profit</th>
                <th>Margin %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sitePL.map(s => {
                const profit = Number(s.profit);
                const margin = Number(s.margin);
                const isProfitable = profit >= 0;

                return (
                  <tr key={s.id}>
                    <td>
                      <div className="table-cell-title">{s.project_name}</div>
                      <div className="table-cell-sub">{s.location}</div>
                    </td>
                    <td>₹{(Number(s.budget) / 10000000).toFixed(2)} Cr</td>
                    <td className="text-green">₹{(Number(s.received) / 10000000).toFixed(2)} Cr</td>
                    <td className="text-amber">₹{(Number(s.expenses) / 10000000).toFixed(2)} Cr</td>
                    <td style={{ fontWeight: 800, color: isProfitable ? '#10B981' : '#EF4444' }}>
                      ₹{(profit / 10000000).toFixed(2)} Cr
                    </td>
                    <td>
                      <span className={`status-tag ${margin >= 20 ? 'tag-green' : 'tag-amber'}`}>
                        {margin}%
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag ${isProfitable ? 'tag-green' : 'tag-rose'}`}>
                        <span className="status-dot"></span>
                        {isProfitable ? 'Profitable' : 'Loss Risk'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Transaction Ledger Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Receipt size={18} className="gold-text" />
            <h3>Verified Transaction Ledger & Vouchers</h3>
          </div>

          {/* Filter Dropdown */}
          <div className="table-actions-right">
            <Filter size={14} color="#64748B" />
            <select 
              className="select-filter-dubai"
              value={filterCategory} 
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="CUSTOMER_PAYMENT">Customer Payments (Income)</option>
              <option value="MATERIAL">Material Purchase</option>
              <option value="CONTRACTOR">Contractor Billing</option>
              <option value="LABOUR">Labour Wages</option>
              <option value="EQUIPMENT">Equipment & Fuel</option>
            </select>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Voucher / Date</th>
                <th>Category</th>
                <th>Site</th>
                <th>Payee / Vendor</th>
                <th>Mode</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => {
                const isIncome = tx.category === 'CUSTOMER_PAYMENT';

                return (
                  <tr key={tx.id}>
                    <td>
                      <div className="table-cell-title">{tx.invoice_no || `TX-${tx.id}`}</div>
                      <div className="table-cell-sub">{new Date(tx.expense_date).toLocaleDateString('en-IN')}</div>
                    </td>
                    <td>
                      <span className={`status-tag ${isIncome ? 'tag-green' : 'tag-cyan'}`}>
                        <span className="status-dot"></span>
                        {tx.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{tx.project_name}</div>
                    </td>
                    <td>
                      <div style={{ color: '#334155', fontWeight: 600 }}>{tx.vendor_payee || 'Direct Site Payee'}</div>
                    </td>
                    <td>
                      <span className="mode-pill">{tx.payment_mode}</span>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 800, 
                        color: isIncome ? '#10B981' : '#0F172A',
                        fontSize: '13.5px'
                      }}>
                        {isIncome ? '+' : '-'} ₹{Number(tx.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td style={{ color: '#64748B', maxWidth: '240px' }}>
                      {tx.description || 'Verified site billing entry'}
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
