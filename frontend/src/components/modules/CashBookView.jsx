import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  IndianRupee, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Building2, 
  FileText,
  ShieldCheck,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Receipt,
  User,
  Calendar,
  Sparkles,
  AlertCircle,
  Tag,
  Hash,
  X
} from 'lucide-react';

export default function CashBookView() {
  const [selectedSite, setSelectedSite] = useState('All Sites');
  const [showAdd, setShowAdd] = useState(false);
  const [voucherSuccessMsg, setVoucherSuccessMsg] = useState('');

  // Persist entries in localStorage
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('sitepilot_cashbook_entries');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'CB-101', date: '13 Nov, 2026', type: 'OUTFLOW', desc: 'Hardware shop binding wire nails & cutting blades', site: 'Skyline Commercial Hub', amount: 3450, handedTo: 'Rameshwar Patel (Mason Lead)', category: 'Hardware & Consumables', authorizedBy: 'Er. Rajesh Verma (PM)', billNumber: 'HW-8492', balance: 46550 },
      { id: 'CB-100', date: '12 Nov, 2026', type: 'OUTFLOW', desc: 'Labour refreshment & drinking water tanker', site: 'Skyline Commercial Hub', amount: 1800, handedTo: 'Site Guard Incharge', category: 'Welfare & Water', authorizedBy: 'Er. Rajesh Verma (PM)', billNumber: 'WT-102', balance: 50000 },
      { id: 'CB-099', date: '11 Nov, 2026', type: 'INFLOW', desc: 'Head Office Imprest Cash Replenishment (Self Cheque)', site: 'Skyline Commercial Hub', amount: 50000, handedTo: 'Er. Rajesh Verma (PM)', category: 'HO Imprest Transfer', authorizedBy: 'Director Office', billNumber: 'CHQ-928104', balance: 51800 },
      { id: 'CB-098', date: '10 Nov, 2026', type: 'OUTFLOW', desc: 'JCB puncture repair & grease lubrication cash', site: 'Grand Horizon Enclave', amount: 2200, handedTo: 'JCB Operator Raju', category: 'Plant & Equipment', authorizedBy: 'Er. Rajesh Verma (PM)', billNumber: 'REP-551', balance: 1800 },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sitepilot_cashbook_entries', JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  }, [entries]);

  const [form, setForm] = useState({
    type: 'OUTFLOW',
    desc: '',
    amount: '',
    handedTo: '',
    site: 'Skyline Commercial Hub',
    category: 'Hardware & Consumables',
    date: new Date().toISOString().split('T')[0],
    authorizedBy: 'Er. Rajesh Verma (Project Manager)',
    billNumber: '',
    paymentMode: 'Cash Safe Imprest',
    justification: ''
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const amt = parseFloat(form.amount) || 0;
    if (amt <= 0) return;

    const lastBal = entries[0]?.balance || 50000;
    const newBal = form.type === 'INFLOW' ? lastBal + amt : lastBal - amt;

    const newE = {
      id: `CB-${102 + entries.length}`,
      date: new Date(form.date || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: form.type,
      desc: form.desc,
      site: form.site,
      amount: amt,
      handedTo: form.handedTo || 'Site Supervisor',
      category: form.category,
      authorizedBy: form.authorizedBy,
      billNumber: form.billNumber || `MEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      balance: newBal
    };

    setEntries([newE, ...entries]);
    setVoucherSuccessMsg(`Cash Voucher ${newE.id} for ₹${amt.toLocaleString('en-IN')} has been authorized & recorded in the safe ledger.`);
    setTimeout(() => {
      setVoucherSuccessMsg('');
      setShowAdd(false);
    }, 1200);

    setForm({
      type: 'OUTFLOW',
      desc: '',
      amount: '',
      handedTo: '',
      site: 'Skyline Commercial Hub',
      category: 'Hardware & Consumables',
      date: new Date().toISOString().split('T')[0],
      authorizedBy: 'Er. Rajesh Verma (Project Manager)',
      billNumber: '',
      paymentMode: 'Cash Safe Imprest',
      justification: ''
    });
  };

  const currentFloat = entries[0]?.balance || 46550;
  const todayOutflow = entries.filter(e => e.type === 'OUTFLOW').reduce((s, e) => s + e.amount, 0);
  const enteredAmount = parseFloat(form.amount) || 0;
  const projectedBalance = form.type === 'INFLOW' 
    ? currentFloat + enteredAmount 
    : currentFloat - enteredAmount;

  // Filter entries if specific site selected
  const filteredEntries = selectedSite === 'All Sites' 
    ? entries 
    : entries.filter(e => e.site === selectedSite);

  // Dedicated Full-Screen Page for Recording Petty Cash Voucher
  if (showAdd) {
    return (
      <div className="module-view-container animate-fade-in" style={{ paddingBottom: '60px' }}>
        {/* Top Navigation Bar */}
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
              <span>Back to Cash Book</span>
            </button>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Record Site Petty Cash Voucher
              </h1>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Issue on-site physical cash slip, reconcile imprest float balance & track spot expenditure
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

        {/* Success Alert Banner if saved */}
        {voucherSuccessMsg && (
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
            <span>{voucherSuccessMsg}</span>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <form onSubmit={handleAdd} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
          gap: '24px', 
          alignItems: 'start' 
        }}>
          
          {/* Left Column: Form Controls inside Glass Card */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Transaction Type */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                TRANSACTION TYPE *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'OUTFLOW' })}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: form.type === 'OUTFLOW' ? '2px solid #EF4444' : '1px solid rgba(203, 213, 225, 0.8)',
                    background: form.type === 'OUTFLOW' ? 'rgba(254, 242, 242, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                    color: form.type === 'OUTFLOW' ? '#B91C1C' : '#64748B',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ArrowDownRight size={16} />
                  <span>Cash Outflow (Expense)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'INFLOW' })}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: form.type === 'INFLOW' ? '2px solid #10B981' : '1px solid rgba(203, 213, 225, 0.8)',
                    background: form.type === 'INFLOW' ? 'rgba(240, 253, 244, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                    color: form.type === 'INFLOW' ? '#047857' : '#64748B',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ArrowUpRight size={16} />
                  <span>Imprest Cash (Inflow)</span>
                </button>
              </div>
            </div>

            {/* Step 2: Site & Expense Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  CONSTRUCTION SITE *
                </label>
                <select
                  value={form.site}
                  onChange={e => setForm({ ...form, site: e.target.value })}
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
                  <option value="Skyline Commercial Hub">Skyline Commercial Hub (Project A)</option>
                  <option value="Grand Horizon Enclave">Grand Horizon Enclave (Project B)</option>
                  <option value="Mahakal Metro Package">Mahakal Metro Package (Project C)</option>
                  <option value="Chamunda Industrial Park">Chamunda Industrial Park (Project D)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  EXPENSE CATEGORY *
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
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
                  <option value="Hardware & Consumables">Hardware & Consumables</option>
                  <option value="Welfare & Water">Labour Welfare & Water Tanker</option>
                  <option value="Plant & Equipment">Plant & Equipment / JCB Diesel</option>
                  <option value="Safety Gears (PPE)">Emergency Site PPE & Safety</option>
                  <option value="Labour Spot Advance">Subcontractor Spot Advance</option>
                  <option value="Freight & Courier">Courier & Site Cartage</option>
                  <option value="HO Imprest Transfer">HO Imprest Cash Top-up</option>
                </select>
              </div>
            </div>

            {/* Step 3: Amount with Quick Presets */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                VOUCHER AMOUNT (₹ INR) *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '12px',
                border: '1px solid rgba(203, 213, 225, 0.85)',
                background: 'rgba(255, 255, 255, 0.95)',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '11px 14px',
                  background: 'rgba(241, 245, 249, 0.9)',
                  borderRight: '1px solid rgba(203, 213, 225, 0.8)',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: form.type === 'INFLOW' ? '#10B981' : '#EF4444'
                }}>
                  ₹
                </div>
                <input 
                  type="number" 
                  required
                  placeholder="3500"
                  value={form.amount} 
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '11px 14px',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0F172A',
                    outline: 'none',
                    minWidth: 0
                  }}
                />
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>Presets:</span>
                {[500, 1000, 2500, 5000, 10000, 25000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setForm({ ...form, amount: String(val) })}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(203, 213, 225, 0.7)',
                      background: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Handed To & Authorized By */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  HANDED TO / BENEFICIARY *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rameshwar Patel (Mason Lead)"
                  value={form.handedTo} 
                  onChange={e => setForm({ ...form, handedTo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  AUTHORIZED BY (INCHARGE) *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Er. Rajesh Verma (Project Manager)"
                  value={form.authorizedBy} 
                  onChange={e => setForm({ ...form, authorizedBy: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
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

            {/* Step 5: Date & Physical Bill / Memo # */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  VOUCHER DATE
                </label>
                <input 
                  type="date" 
                  value={form.date} 
                  onChange={e => setForm({ ...form, date: e.target.value })}
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

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  RECEIPT / CASH MEMO # (OPTIONAL)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. BILL-4910 / Cash Slip #12"
                  value={form.billNumber} 
                  onChange={e => setForm({ ...form, billNumber: e.target.value })}
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

            {/* Step 6: Expense Description */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                EXPENSE DESCRIPTION & JUSTIFICATION *
              </label>
              <textarea 
                rows="3"
                required
                placeholder="Detail what was purchased or why cash was disbursed (e.g. 5 boxes steel binding wire nails, 2 cutting discs and safety spectacles for carpenter team)..."
                value={form.desc} 
                onChange={e => setForm({ ...form, desc: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

          </div>

          {/* Right Column: Live Physical Cash Voucher Slip Preview & Safe Balance Reconciliation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Voucher Slip Representation */}
            <div className="glass-card" style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              
              {/* Slip Decorative Top Perforation / Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px dashed rgba(203, 213, 225, 0.9)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: form.type === 'INFLOW' ? '#10B981' : '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    <Receipt size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Official Site Cash Slip
                    </span>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>
                      SitePilot ERP Imprest Engine
                    </div>
                  </div>
                </div>

                <span className="proj-code-pill" style={{ fontSize: '11px', fontWeight: 700 }}>
                  #CB-{102 + entries.length}
                </span>
              </div>

              {/* Slip Body */}
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  {form.type === 'INFLOW' ? 'IMPREST CASH REPLENISHMENT' : 'DISBURSED TO BENEFICIARY'}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '2px 0 6px 0' }}>
                  {form.handedTo || 'Beneficiary Name'}
                </h3>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {form.desc || 'Expense description and justification preview will appear here...'}
                </p>
              </div>

              {/* Amount Stamp Card */}
              <div style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: form.type === 'INFLOW' ? 'rgba(240, 253, 244, 0.9)' : 'rgba(239, 246, 255, 0.9)',
                border: form.type === 'INFLOW' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    {form.type === 'INFLOW' ? 'Amount Received' : 'Cash Paid Out'}
                  </span>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: form.type === 'INFLOW' ? '#047857' : '#1E40AF', letterSpacing: '-0.02em' }}>
                    {form.type === 'INFLOW' ? '+' : '-'} ₹{enteredAmount > 0 ? enteredAmount.toLocaleString('en-IN') : '0'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Category
                  </span>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                    {form.category}
                  </div>
                </div>
              </div>

              {/* Slip Metadata Footer */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                paddingTop: '8px',
                fontSize: '11px',
                color: '#64748B',
                borderTop: '1px dashed rgba(203, 213, 225, 0.9)'
              }}>
                <div>
                  Site: <b>{form.site}</b>
                </div>
                <div>
                  Date: <b>{form.date || 'Today'}</b>
                </div>
                <div>
                  Authorized: <b>{form.authorizedBy || 'Site Manager'}</b>
                </div>
                <div>
                  Ref: <b>{form.billNumber || 'Cash Memo'}</b>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>Digitally signed & balanced against physical on-site petty cash box</span>
              </div>
            </div>

            {/* Safe Balance Reconciliation Widget */}
            <div className="glass-card" style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.75)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                  Safe Imprest Float Reconciliation
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  Immediate Balance Impact
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr auto 1fr',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(248, 250, 252, 0.8)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>CURRENT SAFE</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>₹{currentFloat.toLocaleString('en-IN')}</div>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 800, color: form.type === 'INFLOW' ? '#10B981' : '#EF4444' }}>
                  {form.type === 'INFLOW' ? '+' : '−'}
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>VOUCHER</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: form.type === 'INFLOW' ? '#10B981' : '#EF4444' }}>
                    ₹{enteredAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 800, color: '#64748B' }}>=</div>

                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>PROJECTED SAFE</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: projectedBalance < 5000 ? '#EF4444' : '#2563EB' }}>
                    ₹{projectedBalance.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {projectedBalance < 5000 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>
                  <AlertCircle size={14} />
                  <span>Warning: Projected safe balance is below the minimum reserve threshold (₹5,000). Request HO replenishment soon.</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
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
                <span>Authorize & Save Cash Voucher</span>
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
                Cancel & Return to Cash Book
              </button>
            </div>

          </div>

        </form>
      </div>
    );
  }

  // Standard Cash Book Ledger View
  return (
    <div className="module-view-container animate-fade-in">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Site Cash Book <span className="amp">&</span> Petty Cash Float</h2>
          <p className="module-subtitle">Daily on-site petty cash ledger, spot purchases, hardware, refreshments <span className="amp">&</span> imprest balance</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select 
            value={selectedSite}
            onChange={e => setSelectedSite(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(203, 213, 225, 0.8)',
              background: 'rgba(255, 255, 255, 0.8)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0F172A',
              outline: 'none'
            }}
          >
            <option value="All Sites">All Active Sites</option>
            <option value="Skyline Commercial Hub">Skyline Commercial Hub</option>
            <option value="Grand Horizon Enclave">Grand Horizon Enclave</option>
          </select>
          <button className="btn-dubai-gold" onClick={() => setShowAdd(true)}>
            <Plus size={16} />
            <span>Record Cash Voucher</span>
          </button>
        </div>
      </div>

      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Current Cash in Hand</span><span className="fin-icon-pill icon-gold"><Wallet size={18} /></span></div>
          <div className="fin-val">₹{currentFloat.toLocaleString('en-IN')}</div>
          <div className="fin-sub">On-site site cash safe balance</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Today's Cash Spent</span><span className="fin-icon-pill icon-rose"><ArrowDownRight size={18} /></span></div>
          <div className="fin-val text-rose">₹{todayOutflow.toLocaleString('en-IN')}</div>
          <div className="fin-sub">Hardware, water tanker, vehicle fuel</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Monthly Imprest Limit</span><span className="fin-icon-pill icon-cyan"><IndianRupee size={18} /></span></div>
          <div className="fin-val text-cyan">₹1,00,000</div>
          <div className="fin-sub">Standard site manager discretionary limit</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Voucher Reconciliation</span><span className="fin-icon-pill icon-green"><ShieldCheck size={18} /></span></div>
          <div className="fin-val text-green">100% Balanced</div>
          <div className="fin-sub">All cash slips physical receipt matched</div>
        </div>
      </div>

      {/* Cash Ledger Table */}
      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Coins size={18} className="gold-text" />
            <h3>Site Petty Cash Ledger <span className="amp">&</span> Slip Audit</h3>
          </div>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
            Showing {filteredEntries.length} recorded voucher{filteredEntries.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Voucher # & Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Expense Description</th>
                <th>Site</th>
                <th>Handed To</th>
                <th>Amount</th>
                <th>Closing Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(e => (
                <tr key={e.id}>
                  <td>
                    <div className="table-cell-title">{e.id}</div>
                    <div className="table-cell-sub">{e.date}</div>
                  </td>
                  <td>
                    <span className={`status-tag ${e.type === 'INFLOW' ? 'tag-green' : 'tag-rose'}`}>
                      <span className="status-dot"></span>
                      {e.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 600, 
                      color: '#475569',
                      background: 'rgba(241, 245, 249, 0.85)',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {e.category || 'General Expense'}
                    </span>
                  </td>
                  <td>
                    <div style={{ color: '#0F172A', fontWeight: 600 }}>{e.desc}</div>
                    {e.billNumber && (
                      <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>
                        Ref: {e.billNumber}
                      </div>
                    )}
                  </td>
                  <td><b>{e.site}</b></td>
                  <td><span style={{ color: '#64748B' }}>{e.handedTo}</span></td>
                  <td>
                    <span style={{ fontWeight: 800, color: e.type === 'INFLOW' ? '#10B981' : '#0F172A' }}>
                      {e.type === 'INFLOW' ? '+' : '-'} ₹{e.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td><b style={{ color: '#2563EB' }}>₹{e.balance.toLocaleString('en-IN')}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
