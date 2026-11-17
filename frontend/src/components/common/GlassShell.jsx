import React from 'react';

/**
 * Master Frosted Glass Shell Container
 * Floats in the center of the viewport with the room photo visible around it.
 */
export default function GlassShell({ children, className = '' }) {
  return (
    <div className={`glass-shell w-full max-w-[1540px] mx-auto relative z-10 ${className}`}>
      {children}
    </div>
  );
}
