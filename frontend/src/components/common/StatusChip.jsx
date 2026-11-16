import React from 'react';

export default function StatusChip({ status, label }) {
  const text = label || status || 'Pending';
  const s = String(text).toLowerCase();

  let dotColor = '#3B82F6';
  let textColor = '#1D4ED8';
  let bgColor = 'rgba(59, 130, 246, 0.12)';
  let borderColor = 'rgba(59, 130, 246, 0.25)';

  if (s.includes('complete') || s.includes('track') || s.includes('verified') || s.includes('success')) {
    dotColor = '#10B981';
    textColor = '#047857';
    bgColor = 'rgba(16, 185, 129, 0.12)';
    borderColor = 'rgba(16, 185, 129, 0.25)';
  } else if (s.includes('pending') || s.includes('attention') || s.includes('warning')) {
    dotColor = '#F59E0B';
    textColor = '#B45309';
    bgColor = 'rgba(245, 158, 11, 0.12)';
    borderColor = 'rgba(245, 158, 11, 0.25)';
  } else if (s.includes('delayed') || s.includes('urgent') || s.includes('danger')) {
    dotColor = '#EF4444';
    textColor = '#B91C1C';
    bgColor = 'rgba(239, 68, 68, 0.12)';
    borderColor = 'rgba(239, 68, 68, 0.25)';
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 700,
      background: bgColor,
      color: textColor,
      border: `1px solid ${borderColor}`,
      backdropFilter: 'blur(8px)',
      whiteSpace: 'nowrap'
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: dotColor,
        boxShadow: `0 0 6px ${dotColor}`
      }} />
      {text}
    </span>
  );
}
