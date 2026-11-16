import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="module-header-row" style={{ marginBottom: '18px' }}>
      <div>
        <h2 className="module-title">{title}</h2>
        {subtitle && <p className="module-subtitle">{subtitle}</p>}
      </div>
      {action && (
        <div className="page-header-actions">
          {action}
        </div>
      )}
    </div>
  );
}

