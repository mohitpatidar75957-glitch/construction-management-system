import React from 'react';

/**
 * Master Frosted Glass Shell Container
 * Floats in the center of the viewport with the room photo visible around it.
 */
export default function GlassShell({ children, className = '' }) {
  return (
    <div className={`glass-shell w-full max-w-[1520px] mx-auto p-5 sm:p-6 md:p-7 my-4 md:my-6 relative z-10 ${className}`}>
      {children}
    </div>
  );
}
