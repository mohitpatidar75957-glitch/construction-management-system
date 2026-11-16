import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ 
  children, 
  className = '', 
  variant = 'default', // 'default' | 'blue'
  animate = true,
  onClick
}) {
  const baseClass = variant === 'blue' ? 'glass-card-blue' : 'glass-card';

  if (!animate) {
    return (
      <div 
        onClick={onClick}
        className={`${baseClass} p-5 sm:p-6 rounded-3xl ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={onClick}
      className={`${baseClass} p-5 sm:p-6 rounded-3xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

