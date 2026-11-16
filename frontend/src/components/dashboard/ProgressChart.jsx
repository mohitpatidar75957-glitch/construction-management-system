import React from 'react';

export default function ProgressChart({ progress = 68, trend = [] }) {
  const dashOffset = 301.6 - (301.6 * progress) / 100;

  return (
    <div className="progress-card-content">
      {/* Donut Gauge Chart */}
      <div className="donut-gauge-wrapper">
        <div className="radial-chart-box">
          <svg viewBox="0 0 120 120" className="radial-chart-svg">
            <defs>
              <linearGradient id="terracottaDonutGradCommon" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="48" className="radial-track" />
            <circle 
              cx="60" 
              cy="60" 
              r="48" 
              className="radial-progress"
              strokeDasharray="301.6"
              strokeDashoffset={dashOffset}
              stroke="url(#terracottaDonutGradCommon)"
            />
          </svg>
          <div className="radial-center-text">
            <span className="radial-percent">{progress}%</span>
          </div>
        </div>
        <span className="radial-caption">Overall Progress</span>
      </div>

      {/* Trajectory Curved Line */}
      <div className="line-chart-wrapper">
        <div className="line-chart-svg-box">
          <svg viewBox="0 0 240 120" className="trend-line-svg">
            <defs>
              <linearGradient id="chartGradientCommon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <line x1="20" y1="20" x2="230" y2="20" stroke="rgba(220, 210, 205, 0.7)" strokeDasharray="3 3" />
            <line x1="20" y1="50" x2="230" y2="50" stroke="rgba(220, 210, 205, 0.7)" strokeDasharray="3 3" />
            <line x1="20" y1="80" x2="230" y2="80" stroke="rgba(220, 210, 205, 0.7)" strokeDasharray="3 3" />

            <polygon points="30,95 85,78 145,55 215,25 215,105 30,105" fill="url(#chartGradientCommon)" />
            <path d="M 30 95 Q 60 85, 85 78 T 145 55 T 215 25" fill="none" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="30" cy="95" r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
            <circle cx="85" cy="78" r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
            <circle cx="145" cy="55" r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
            <circle cx="215" cy="25" r="5.5" fill="#ea580c" stroke="#ffffff" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="chart-x-labels">
          {trend.map((t, idx) => (
            <span key={idx}>{t.week}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

