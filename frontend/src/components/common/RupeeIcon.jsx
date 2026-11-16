import React from 'react';
import { FaIndianRupeeSign } from 'react-icons/fa6';

export default function RupeeIcon({ size = 16, className = '', style = {}, color = 'currentColor' }) {
  return (
    <FaIndianRupeeSign 
      size={size} 
      color={color}
      className={`inline-block ${className}`}
      style={{ 
        display: 'inline-block', 
        verticalAlign: '-0.1em', 
        flexShrink: 0,
        ...style 
      }} 
    />
  );
}
