import React, { useState } from 'react';
import { 
  Globe, 
  Building2, 
  CheckCircle2, 
  IndianRupee, 
  Calendar, 
  Camera, 
  Eye, 
  FileText,
  UserCheck
} from 'lucide-react';

export default function CustomerPortalView() {
  const [selectedBuyer, setSelectedBuyer] = useState('Anand Mehta (Unit 402, Tower A)');

  const buyers = [
    { name: 'Anand Mehta (Unit 402, Tower A)', project: 'Skyline Commercial Hub', bookedDate: '15 Feb, 2025', unitType: '3 BHK Executive Suite (1,850 Sqft)', agreementValue: 12500000, paidAmount: 8500000, dueAmount: 4000000, nextMilestone: 'On Completion of 5th Floor Slab (Due in 25 Days)', currentStage: 'Tower A RCC Casting', overallProgress: 75 },
    { name: 'Dr. Priya Sharma (Unit 1204, Tower B)', project: 'Palm Residency', bookedDate: '10 Aug, 2025', unitType: '4 BHK Luxury Penthouse (2,600 Sqft)', agreementValue: 21000000, paidAmount: 14700000, dueAmount: 6300000, nextMilestone: 'On Brickwork Completion', currentStage: 'Superstructure Complete', overallProgress: 85 },
  ];

  const currentB = buyers.find(b => b.name === selectedBuyer) || buyers[0];

  return (
    <div className="module-view-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Customer <span className="amp">&</span> Investor Portal (Client View)</h2>
          <p className="module-subtitle">Transparent real-time client tracking of slab progress, stage photos <span className="amp">&</span> milestone demand letters</p>
        </div>
        <select 
          className="select-filter-dubai"
          value={selectedBuyer}
          onChange={e => setSelectedBuyer(e.target.value)}
        >
          {buyers.map(b => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Agreement Value</span><span className="fin-icon-pill icon-gold"><IndianRupee size={18} /></span></div>
          <div className="fin-val">₹{(currentB.agreementValue / 100000).toFixed(2)} Lakhs</div>
          <div className="fin-sub">Allotted unit registered contract value</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Payment Received</span><span className="fin-icon-pill icon-green"><CheckCircle2 size={18} /></span></div>
          <div className="fin-val text-green">₹{(currentB.paidAmount / 100000).toFixed(2)} Lakhs</div>
          <div className="fin-sub">Cleared milestone installments collected</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Pending Demand Balance</span><span className="fin-icon-pill icon-rose"><IndianRupee size={18} /></span></div>
          <div className="fin-val text-rose">₹{(currentB.dueAmount / 100000).toFixed(2)} Lakhs</div>
          <div className="fin-sub">Upcoming milestone call payment</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Construction Progress</span><span className="fin-icon-pill icon-cyan"><Building2 size={18} /></span></div>
          <div className="fin-val text-cyan">{currentB.overallProgress}%</div>
          <div className="fin-sub">Current active stage: {currentB.currentStage}</div>
        </div>
      </div>

      {/* Buyer Transparency Card */}
      <div className="dubai-card" style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>
              Client Overview: {currentB.name.split('(')[0]}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
              {currentB.project} • {currentB.unitType}
            </h3>
          </div>
          <button 
            onClick={() => alert(`Official Demand Letter PDF generated for ${currentB.name}`)}
            className="btn-dubai-gold"
          >
            <FileText size={15} />
            <span>Generate Demand Letter PDF</span>
          </button>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Site Construction Completion</span>
            <span style={{ fontWeight: 800, color: '#0F172A' }}>{currentB.overallProgress}%</span>
          </div>
          <div className="dubai-progress-track">
            <div className="dubai-progress-bar bar-gold" style={{ width: `${currentB.overallProgress}%` }}></div>
          </div>
        </div>

        <div style={{ 
          padding: '16px', 
          borderRadius: '16px', 
          background: 'rgba(255, 255, 255, 0.6)', 
          border: '1px solid rgba(255, 255, 255, 0.85)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>NEXT PAYMENT STAGE</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{currentB.nextMilestone}</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>CURRENT PHYSICAL STAGE</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563EB', marginTop: '2px' }}>{currentB.currentStage}</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>BOOKING REGISTRATION</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{currentB.bookedDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

