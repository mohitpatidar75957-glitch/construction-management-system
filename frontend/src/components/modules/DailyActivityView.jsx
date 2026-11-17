import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  User, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  FileText, 
  Check, 
  ArrowLeft,
  Building2,
  HardHat,
  Truck,
  Package,
  CloudSun,
  Camera,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Fuel,
  Info
} from 'lucide-react';
import RupeeIcon from '../common/RupeeIcon';

export default function DailyActivityView({ onBack }) {
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('All Sites');
  const [activeTab, setActiveTab] = useState('LOG'); // 'LOG' or 'REPORTS'
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    site: 'Skyline Commercial Hub',
    workZone: 'Tower B - 5th Floor Slab',
    category: 'Civil Structure',
    stage: 'Slab Casting & Concrete Pour',
    amount: '185000',
    date: new Date().toISOString().split('T')[0],
    shift: 'General Day Shift (8:00 AM - 6:00 PM)',
    supervisor: 'Er. Rajesh Verma (Project Manager)',
    contractorAgency: 'Om Construction & Shuttering Gang',
    masonsCount: '12',
    helpersCount: '28',
    steelFixersCount: '8',
    carpentersCount: '6',
    cementConsumed: '420', // Bags
    steelConsumed: '6.5', // MT
    sandConsumed: '450', // cft
    machineryUsed: 'Transit Mixer (3 Trips), Concrete Pump 36m, Tower Crane 1, Vibrator needles (4 units)',
    weather: 'Clear Sunny (32°C)',
    workHindrance: 'None - Continuous Work Execution',
    status: 'Completed',
    notes: 'Concrete grade M25 poured continuously. Cube testing samples (6 cubes) taken for 7-day and 28-day curing strength.'
  });

  // Recent logged activities list
  const [activities, setActivities] = useState([
    {
      id: 'DSR-2026-094',
      title: '5th Floor Slab Casting & Concrete Pour',
      site: 'Skyline Commercial Hub',
      workZone: 'Tower B - 5th Floor',
      category: 'Civil Structure',
      stage: 'Concrete Pouring',
      date: '17 Nov 2026',
      shift: 'Day Shift',
      supervisor: 'Er. Rajesh Verma',
      contractor: 'Om Construction Gang',
      manpower: 54,
      amount: '4,25,000',
      status: 'Completed',
      weather: 'Clear Sunny',
      notes: 'M25 concrete 84 cu.m poured successfully with transit mixers.'
    },
    {
      id: 'DSR-2026-093',
      title: 'Basement-2 Retaining Wall Rebar Tying',
      site: 'Palm Residency',
      workZone: 'Wing C - Sub-structure',
      category: 'Rebar & Steel',
      stage: 'Reinforcement',
      date: '16 Nov 2026',
      shift: 'Day Shift',
      supervisor: 'Er. Amit Sharma',
      contractor: 'Shree Ram Barbenders',
      manpower: 32,
      amount: '1,95,000',
      status: 'Completed',
      weather: 'Partly Cloudy',
      notes: 'Fe550D TMT 16mm & 20mm tying completed. Cover blocks 50mm placed.'
    },
    {
      id: 'DSR-2026-092',
      title: 'Tower 1 External 9-inch Brickwork Masonry',
      site: 'Grand Horizon Enclave',
      workZone: 'Tower 1 - 3rd Floor',
      category: 'Brickwork & Masonry',
      stage: 'Superstructure',
      date: '16 Nov 2026',
      shift: 'Day Shift',
      supervisor: 'Er. Priya Rathore',
      contractor: 'Apex Civil Builders',
      manpower: 24,
      amount: '1,45,000',
      status: 'Completed',
      weather: 'Clear Sunny',
      notes: 'AAC lightweight block masonry with 1:4 cement mortar.'
    },
    {
      id: 'DSR-2026-091',
      title: 'Excavation & PCC Bedding for Footings',
      site: 'Chamunda Industrial Park',
      workZone: 'Warehouse Bay 2',
      category: 'Earthwork & Foundation',
      stage: 'Sub-structure',
      date: '15 Nov 2026',
      shift: 'Day Shift',
      supervisor: 'Er. Sandeep Patel',
      contractor: 'Bhopal Earthmovers',
      manpower: 18,
      amount: '2,80,000',
      status: 'Completed',
      weather: 'Clear Sunny',
      notes: 'JCB 3DX & Tata Hitachi 210 excavators deployed for 16 machine hours.'
    }
  ]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setUploadedPhoto({ name: file.name, url: fakeUrl, size: (file.size / 1024).toFixed(0) + ' KB' });
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const totalManpower = (Number(form.masonsCount) || 0) + 
                          (Number(form.helpersCount) || 0) + 
                          (Number(form.steelFixersCount) || 0) + 
                          (Number(form.carpentersCount) || 0);

    const newActivity = {
      id: `DSR-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      title: form.title,
      site: form.site,
      workZone: form.workZone,
      category: form.category,
      stage: form.stage,
      date: form.date,
      shift: form.shift,
      supervisor: form.supervisor,
      contractor: form.contractorAgency,
      manpower: totalManpower || 36,
      amount: Number(form.amount).toLocaleString('en-IN'),
      status: form.status,
      weather: form.weather,
      notes: form.notes
    };

    setActivities([newActivity, ...activities]);
    setSuccessMsg(`Daily Site Activity "${form.title}" successfully logged and broadcasted to Site DPR Feed!`);

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  const totalManpowerCalculated = (Number(form.masonsCount) || 0) + 
                                  (Number(form.helpersCount) || 0) + 
                                  (Number(form.steelFixersCount) || 0) + 
                                  (Number(form.carpentersCount) || 0);

  return (
    <div className="module-view-container animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
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
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.95)'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          <div>
            <h1 className="module-title" style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Daily Site Activity <span className="amp">&</span> Progress Telemetry
            </h1>
            <p className="module-subtitle" style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0' }}>
              Field engineer muster logs, work zone progress, material consumption <span className="amp">&</span> milestone sign-off
            </p>
          </div>
        </div>

        {/* Action Toggle Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('LOG')}
            className={`glass-pill ${activeTab === 'LOG' ? 'active-blue' : ''}`}
            style={{
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeTab === 'LOG' ? '#2563EB' : 'rgba(255, 255, 255, 0.7)',
              color: activeTab === 'LOG' ? '#ffffff' : '#475569',
              border: activeTab === 'LOG' ? '1px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow: activeTab === 'LOG' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            + Log New Activity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REPORTS')}
            className={`glass-pill ${activeTab === 'REPORTS' ? 'active-blue' : ''}`}
            style={{
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeTab === 'REPORTS' ? '#2563EB' : 'rgba(255, 255, 255, 0.7)',
              color: activeTab === 'REPORTS' ? '#ffffff' : '#475569',
              border: activeTab === 'REPORTS' ? '1px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow: activeTab === 'REPORTS' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            View Site Log Feed ({activities.length})
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
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
          boxShadow: '0 4px 14px rgba(34, 197, 94, 0.12)'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* MAIN VIEW: FORM OR FEED */}
      {activeTab === 'LOG' ? (
        <form onSubmit={handlePublish} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left Column: Form Controls */}
          <div className="glass-card" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Work Item Title with Quick Presets */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                WORK ACTIVITY TITLE / TASK MILESTONE *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5th Floor Slab Casting & Concrete Pour"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />

              {/* Quick Template Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700 }}>Quick Presets:</span>
                {[
                  '5th Floor Slab Casting',
                  'Retaining Wall Rebar Tying',
                  'External 9" Brickwork Masonry',
                  'Footing PCC & Shuttering',
                  'Electrical Conduit Laying'
                ].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setForm({ ...form, title: preset })}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(203, 213, 225, 0.7)',
                      background: 'rgba(255, 255, 255, 0.75)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#2563EB',
                      cursor: 'pointer'
                    }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Site & Specific Work Zone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  CONSTRUCTION SITE *
                </label>
                <select
                  value={form.site}
                  onChange={e => setForm({ ...form, site: e.target.value })}
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
                  <option value="Skyline Commercial Hub">Skyline Commercial Hub</option>
                  <option value="Palm Residency">Palm Residency</option>
                  <option value="Grand Horizon Enclave">Grand Horizon Enclave</option>
                  <option value="Mahakal Metro Package">Mahakal Metro Package</option>
                  <option value="Chamunda Industrial Park">Chamunda Industrial Park</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  WORK ZONE / FLOOR / WING *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tower B - 5th Floor Slab"
                  value={form.workZone}
                  onChange={e => setForm({ ...form, workZone: e.target.value })}
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

            {/* Step 3: Work Category & Shift Timing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  TRADE CLASSIFICATION
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
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
                  <option value="Civil Structure">Civil Structure (RCC / Concreting)</option>
                  <option value="Rebar & Steel">Rebar & Steel Shuttering</option>
                  <option value="Brickwork & Masonry">Brickwork & Block Masonry</option>
                  <option value="Earthwork & Foundation">Earthwork & Foundation Excavation</option>
                  <option value="Plastering & Waterproofing">Plastering & Waterproofing</option>
                  <option value="MEP & Electrical">MEP / Electrical & Plumbing</option>
                  <option value="Finishing & Flooring">Finishing, Tiles & Flooring</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  SHIFT SCHEDULE
                </label>
                <select
                  value={form.shift}
                  onChange={e => setForm({ ...form, shift: e.target.value })}
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
                  <option value="General Day Shift (8:00 AM - 6:00 PM)">General Day Shift (8 AM - 6 PM)</option>
                  <option value="Night Concreting Shift (8:00 PM - 5:00 AM)">Night Concreting Shift (8 PM - 5 AM)</option>
                  <option value="Overtime / Extended Pour (6:00 PM - 10:00 PM)">Overtime / Extended Pour</option>
                </select>
              </div>
            </div>

            {/* Step 4: Workforce / Gang Muster Deployment */}
            <div style={{
              background: 'rgba(241, 245, 249, 0.6)',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HardHat size={15} color="#2563EB" />
                  <span>ON-SITE LABOUR GANG MUSTER</span>
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                  Total: {totalManpowerCalculated} Workers
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Masons</span>
                  <input
                    type="number"
                    value={form.masonsCount}
                    onChange={e => setForm({ ...form, masonsCount: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Helpers</span>
                  <input
                    type="number"
                    value={form.helpersCount}
                    onChange={e => setForm({ ...form, helpersCount: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Steel Fixers</span>
                  <input
                    type="number"
                    value={form.steelFixersCount}
                    onChange={e => setForm({ ...form, steelFixersCount: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Carpenters</span>
                  <input
                    type="number"
                    value={form.carpentersCount}
                    onChange={e => setForm({ ...form, carpentersCount: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Materials Consumed Today */}
            <div style={{
              background: 'rgba(241, 245, 249, 0.6)',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Package size={15} color="#D97706" />
                <span>KEY RAW MATERIALS CONSUMED</span>
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Cement (Bags)</span>
                  <input
                    type="number"
                    value={form.cementConsumed}
                    onChange={e => setForm({ ...form, cementConsumed: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Steel Rebar (MT)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={form.steelConsumed}
                    onChange={e => setForm({ ...form, steelConsumed: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Sand (cft)</span>
                  <input
                    type="number"
                    value={form.sandConsumed}
                    onChange={e => setForm({ ...form, sandConsumed: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
              </div>
            </div>

            {/* Step 6: Amount Incurred & Contractor Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  ESTIMATED FINANCIAL EXPENSE (₹ INR)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #CBD5E1', overflow: 'hidden' }}>
                  <span style={{ padding: '0 14px', background: '#F1F5F9', color: '#2563EB', fontWeight: 800 }}>₹</span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    style={{ flex: 1, padding: '10px 12px', border: 'none', fontSize: '14px', fontWeight: 800, outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  CONTRACTOR / GANG AGENCY
                </label>
                <input
                  type="text"
                  value={form.contractorAgency}
                  onChange={e => setForm({ ...form, contractorAgency: e.target.value })}
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

            {/* Step 7: Site Photos & Quality Notes */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                ATTACH FIELD PROGRESS PHOTO / INSPECTION SLIP
              </label>
              <div style={{
                border: '2px dashed rgba(203, 213, 225, 0.9)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer'
              }}>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*,.pdf"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <Camera size={24} color="#2563EB" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>
                    {uploadedPhoto ? `✓ ${uploadedPhoto.name} (${uploadedPhoto.size})` : 'Click to Upload Site Photo or Curing Test Slip'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>JPG, PNG or PDF under 10MB</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                FIELD OBSERVATIONS & QUALITY NOTES
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Details of cube tests, slump test values, curing status, safety checks..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="btn-dubai-gold"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={18} />
              <span>Broadcast & Publish Daily Site Activity (DSR)</span>
            </button>
          </div>

          {/* Right Column: Live Real-time Blueprint DSR Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.92))', border: '1.5px solid rgba(255, 255, 255, 0.95)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.04em' }}>LIVE DSR PREVIEW SLIP</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', padding: '3px 10px', borderRadius: '6px' }}>
                  {form.date}
                </span>
              </div>

              {/* Title & Site */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {form.title || 'Untitled Site Activity'}
                </h3>
                <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <MapPin size={13} color="#2563EB" />
                  {form.site} • {form.workZone}
                </span>
              </div>

              {/* KPI Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Total Manpower</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {totalManpowerCalculated} Workers
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Amount Incurred</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>
                    ₹{Number(form.amount || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Cement Consumed</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {form.cementConsumed || 0} Bags
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Steel Rebar</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {form.steelConsumed || 0} MT
                  </div>
                </div>
              </div>

              {/* Machinery & Weather Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={14} color="#2563EB" />
                  <span style={{ fontWeight: 600 }}>Plant & Machinery:</span>
                  <span style={{ color: '#64748B' }}>{form.machineryUsed}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CloudSun size={14} color="#D97706" />
                  <span style={{ fontWeight: 600 }}>Weather:</span>
                  <span style={{ color: '#64748B' }}>{form.weather}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#10B981" />
                  <span style={{ fontWeight: 600 }}>Supervised by:</span>
                  <span style={{ color: '#64748B' }}>{form.supervisor}</span>
                </div>
              </div>

              {/* Uploaded Photo Preview if any */}
              {uploadedPhoto && (
                <div style={{ marginBottom: '14px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                  <img src={uploadedPhoto.url} alt="Site Progress Preview" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '6px 10px', background: '#F1F5F9', fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                    Attached: {uploadedPhoto.name}
                  </div>
                </div>
              )}

              {/* Notes */}
              {form.notes && (
                <div style={{ padding: '10px 12px', background: '#F1F5F9', borderRadius: '8px', fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                  <b>Engineer Notes:</b> {form.notes}
                </div>
              )}
            </div>

            {/* Quick Tips Box */}
            <div className="glass-card" style={{ padding: '18px', background: 'rgba(238, 242, 255, 0.75)', border: '1px solid rgba(199, 210, 254, 0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3730A3', fontWeight: 800, fontSize: '12.5px', marginBottom: '6px' }}>
                <Info size={16} />
                <span>Standard Construction Practice Note</span>
              </div>
              <p style={{ fontSize: '11.5px', color: '#4338CA', margin: 0, lineHeight: 1.5 }}>
                Daily Site Progress (DSR) logs automatically sync with Project Milestone tracking, Contractor Gang billing statements, and Material Inventory deduction rollups.
              </p>
            </div>
          </div>
        </form>
      ) : (
        /* RECENT LOGGED ACTIVITIES FEED VIEW */
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Historical Daily Site Progress (DSR) Logs
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Showing {activities.length} published field activity records</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={selectedSiteFilter}
                onChange={e => setSelectedSiteFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0F172A'
                }}
              >
                <option value="All Sites">All Construction Sites</option>
                <option value="Skyline Commercial Hub">Skyline Commercial Hub</option>
                <option value="Palm Residency">Palm Residency</option>
                <option value="Grand Horizon Enclave">Grand Horizon Enclave</option>
                <option value="Chamunda Industrial Park">Chamunda Industrial Park</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="glass-data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>DSR ID</th>
                  <th>ACTIVITY & WORK ZONE</th>
                  <th>SITE & CONTRACTOR</th>
                  <th>MANPOWER</th>
                  <th>EXPENSE (₹)</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {(selectedSiteFilter === 'All Sites' ? activities : activities.filter(a => a.site === selectedSiteFilter)).map(act => (
                  <tr key={act.id}>
                    <td style={{ fontWeight: 700, color: '#2563EB', fontSize: '12px' }}>{act.id}</td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>{act.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{act.workZone} • {act.category}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#334155', fontSize: '12.5px' }}>{act.site}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{act.contractor}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#0F172A', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <HardHat size={13} color="#2563EB" />
                        {act.manpower} Workers
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#0F172A' }}>₹{act.amount}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: '#DCFCE7',
                        color: '#15803D'
                      }}>
                        <Check size={11} /> {act.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '11.5px', color: '#64748B', whiteSpace: 'nowrap' }}>{act.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
