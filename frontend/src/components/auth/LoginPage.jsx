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
  Hammer,
  KeyRound,
  Sparkles
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
      padding: '32px 20px',
      overflow: 'hidden'
    }}>
      {/* Ambient Scandinavian Background Refraction */}
      <GlassBackground />

      {/* Main Glass Authentication Card */}
      <div 
        className="glass-shell"
        style={{
          maxWidth: '1040px',
          width: '100%',
          padding: '40px 42px',
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          borderRadius: '30px',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 25px 70px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5)'
        }}
      >
        {/* Left Side: Brand Overview & Enterprise Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Logo & Headline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)'
            }}>
              <Building2 size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>SitePilot</span>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', border: '1px solid rgba(37, 99, 235, 0.2)' }}>OS 2.0</span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>Role-Based Construction Management OS</p>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
              Construction ERP Gateway
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.55 }}>
              Enter your corporate login credentials to access your designated construction sites, daily field telemetry, and authorized modules.
            </p>
          </div>

          {/* Enterprise Features List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '7px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', marginTop: '2px' }}>
                <ShieldCheck size={17} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>Super Admin Access Control</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '1px' }}>Fine-grained module clearances configured by the executive director.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '7px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', marginTop: '2px' }}>
                <HardHat size={17} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>Field Operations & DPR Logs</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '1px' }}>Site supervisors record daily muster rolls, concrete pours & machinery hours.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '7px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', marginTop: '2px' }}>
                <Receipt size={17} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>Commercial Ledgers & RA Bills</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '1px' }}>Accountants generate GST running-account bills and reconcile on-site petty cash.</div>
              </div>
            </div>
          </div>

          {/* Live System Telemetry Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <span className="glass-pill" style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>
              ⚡ 19 Enterprise Modules
            </span>
            <span className="glass-pill" style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>
              📶 100% Offline PWA Ready
            </span>
            <span className="glass-pill" style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>
              🔒 256-Bit Session Security
            </span>
          </div>
        </div>

        {/* Right Side: Clean Glass Login Form (Zero Overlapping Icons) */}
        <div 
          className="glass-card"
          style={{
            padding: '36px 34px',
            borderRadius: '26px',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
              Staff Sign In
            </h3>
            <span style={{ fontSize: '12.5px', color: '#64748B' }}>
              Enter your authorized staff account credentials
            </span>
          </div>

          {error && (
            <div style={{
              padding: '11px 14px',
              borderRadius: '12px',
              background: '#FEE2E2',
              color: '#DC2626',
              fontSize: '12.5px',
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
            <div className="form-group">
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px', letterSpacing: '0.02em' }}>
                CORPORATE EMAIL ADDRESS
              </label>
              <input 
                type="email" 
                required 
                placeholder="admin@sitepilot.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.85)',
                  background: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)'
                }}
              />
            </div>

            {/* Security Password - Clean Input with Eye Toggle */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', letterSpacing: '0.02em' }}>
                  SECURITY PASSWORD
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); alert('Registered demo login passwords:\n• Super Admin: Admin#2026\n• Project Manager: Manager#2026\n• Site Supervisor: Site#2026\n• Accounts Officer: Accounts#2026\n• Subcontractor: Site#2026\n• Universal default: SitePilot@2026'); }} 
                  style={{ fontSize: '11.5px', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}
                >
                  Forgot?
                </a>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  placeholder="Enter login password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.85)',
                    background: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px'
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
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)'
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
