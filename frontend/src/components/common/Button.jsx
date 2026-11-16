import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  icon: Icon, 
  className = '', 
  type = 'button',
  disabled = false 
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'btn-dubai-gold';
      case 'secondary': return 'btn-cancel';
      case 'danger': return 'btn-danger-glass';
      case 'ghost': return 'filter-btn';
      default: return 'btn-dubai-gold';
    }
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${getVariantClass()} ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      <span>{children}</span>
    </button>
  );
}

