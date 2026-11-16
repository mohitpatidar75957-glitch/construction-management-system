import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', padding: '14px 20px' }}>
      <button 
        className="navbar-icon-btn" 
        style={{ width: '32px', height: '32px' }}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      <span style={{ fontSize: '12px', fontWeight: '700', color: '#18181b', padding: '0 8px' }}>
        Page {currentPage} of {totalPages}
      </span>
      <button 
        className="navbar-icon-btn" 
        style={{ width: '32px', height: '32px' }}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

