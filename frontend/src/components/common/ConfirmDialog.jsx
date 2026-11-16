import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure you want to proceed?' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="440px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} />
          </div>
          <p style={{ fontSize: '13px', color: '#27272a', lineHeight: 1.4 }}>
            {message}
          </p>
        </div>
        <div className="modal-actions-bar">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            style={{ background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '30px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}

