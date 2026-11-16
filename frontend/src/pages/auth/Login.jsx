import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('mohit.patidar@sitepilot.in');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="paper-card" style={{ maxWidth: '420px', width: '100%', padding: '36px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>Executive Portal Sign In</h2>
        <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '24px' }}>Access your enterprise site management workspace</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Business Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Master Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-dubai-gold" style={{ marginTop: '12px', justifyContent: 'center' }}>
            <span>Sign In to SitePilot</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

