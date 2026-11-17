import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  HardHat, 
  Briefcase, 
  Receipt, 
  Boxes, 
  CheckCircle2,
  Eye, 
  EyeOff, 
  Sparkles,
  KeyRound,
  Shield,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlassBackground from '../layout/GlassBackground';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@sitepilot.in');
  const [password, setPassword] = useState('Admin#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid corporate credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Ambient Scandinavian Background Refraction */}
      <GlassBackground />

      {/* Main Glass Authentication Card (Responsive side-by-side, no clipping) */}
      <div 
        className="login-glass-shell animate-fade-in"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}
      >
        {/* Left Side: Brand Overview & Enterprise Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Logo & Headline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)',
              flexShrink: 0
            }}>
              {/* Option 5: Pure Vector Skyline Landmark Spire */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                {/* Ground Baseline */}
                <path d="M2 21h20" strokeWidth="2.4"/>
                {/* Left Tower */}
                <path d="M4 21V11l4-2v12"/>
                <path d="M6 14h.01M6 17h.01"/>
                {/* Center Spire Landmark Tower */}
                <path d="M8 21V5l8 3v13"/>
                <path d="M12 2v3" strokeWidth="2.3"/>
                <path d="M10 10h.01M14 11h.01M10 14h.01M14 15h.01M10 18h.01M14 18h.01"/>
                {/* Right Tower */}
                <path d="M16 21V12l4 2v7"/>
                <path d="M18 16h.01"/>
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>SitePilot</span>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', border: '1px solid rgba(37, 99, 235, 0.2)' }}>OS 2.0</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Role-Based Construction Management OS</p>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
              Construction ERP Gateway
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Enter your corporate login credentials to access your designated construction sites, daily field telemetry, and authorized modules.
            </p>
          </div>

          {/* Enterprise Features List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', marginTop: '2px', flexShrink: 0 }}>
                <ShieldCheck size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Super Admin Access Control</div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>Fine-grained module clearances configured by the executive director.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', marginTop: '2px', flexShrink: 0 }}>
                <HardHat size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Field Operations & DPR Logs</div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>Site supervisors record daily muster rolls, concrete pours & machinery hours.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', marginTop: '2px', flexShrink: 0 }}>
                <Receipt size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Commercial Ledgers & RA Bills</div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>Accountants generate GST running-account bills and reconcile on-site petty cash.</div>
              </div>
            </div>
          </div>

          {/* Security & Offline Badges (Single Line Flex) */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap', paddingTop: '4px' }}>
            <span className="glass-pill" style={{ padding: '5px 10px', fontSize: '10.5px', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
              ⚡ 19 Modules
            </span>
            <span className="glass-pill" style={{ padding: '5px 10px', fontSize: '10.5px', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
              📶 Offline PWA
            </span>
            <span className="glass-pill" style={{ padding: '5px 10px', fontSize: '10.5px', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
              🔒 256-Bit Security
            </span>
          </div>
        </div>

        {/* Right Side: Clean Glass Login Form (Never Clipped) */}
        <div 
          className="glass-card"
          style={{
            padding: '30px 28px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.92)',
            boxShadow: '0 20px 50px rgba(10, 25, 70, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Staff Sign In
              </h3>
              <span className="glass-pill" style={{ padding: '2px 8px', fontSize: '10.5px', fontWeight: 700, color: '#2563EB' }}>
                Secure Gateway
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'block' }}>
              Enter your authorized staff account credentials
            </span>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#FEE2E2',
              color: '#DC2626',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Corporate Email - Clean Input, Zero Overlap */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px', letterSpacing: '0.03em' }}>
                CORPORATE EMAIL ADDRESS
              </label>
              <input 
                type="email" 
                required 
                className="login-input"
                placeholder="admin@sitepilot.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Security Password with dedicated Eye Toggle Button (Zero Overlap) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.03em' }}>
                  SECURITY PASSWORD
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    alert('Demo Accounts:\n• Super Admin: admin@sitepilot.in (Admin#2026)\n• Project Manager: pm@sitepilot.in (Manager#2026)\n• Site Supervisor: supervisor@sitepilot.in (Site#2026)\n• Accounts Officer: accounts@sitepilot.in (Accounts#2026)'); 
                  }} 
                  style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}
                >
                  Forgot?
                </a>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1.5px solid rgba(203, 213, 225, 0.85)',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)'
              }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  placeholder="Enter login password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    padding: '12px 16px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    minWidth: 0
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 14px',
                    flexShrink: 0
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="btn-solid-dark"
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '12px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                background: '#0F172A',
                color: '#ffffff'
              }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to SitePilot OS'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
