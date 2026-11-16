import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ label, value, delta, icon: Icon, progress, isPositive = true }) {
  return (
    <div className="paper-kpi-card">
      <div className="kpi-header">
        <div className="kpi-icon-pill icon-terracotta">
          {Icon && <Icon size={18} />}
        </div>
        {delta && (
          <span className={`kpi-badge ${isPositive ? 'badge-green' : 'badge-rose'}`}>
            <ArrowUpRight size={13} /> {delta}
          </span>
        )}
      </div>
      <div className="kpi-body">
        <span className="kpi-label">{label}</span>
        <div className="kpi-value-text">{value}</div>
        {progress !== undefined && (
          <div className="kpi-progress-track">
            <div className="kpi-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

