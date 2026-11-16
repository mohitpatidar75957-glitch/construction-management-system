import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  gradient = false,
  className = ''
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }} 
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`p-5 rounded-3xl flex flex-col justify-between ${
        gradient ? 'glass-card-blue shadow-lg shadow-blue-500/20' : 'glass-card'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-xs sm:text-sm font-semibold tracking-tight ${gradient ? 'text-white/85' : 'text-slate-500'}`}>
          {title}
        </p>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center ${
          gradient ? 'bg-white/20 text-white' : 'glass-pill text-slate-600 bg-white/50'
        }`}>
          <ArrowUpRight size={14} />
        </span>
      </div>

      <div className="my-2">
        <h2 className={`text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight ${
          gradient ? 'text-white' : 'text-slate-900'
        }`}>
          {value}
        </h2>
      </div>

      {change && (
        <p className={`text-xs sm:text-sm flex items-center gap-1 font-semibold ${
          gradient ? 'text-white/95' : isPositive ? 'text-emerald-500' : 'text-rose-500'
        }`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{change}</span>
        </p>
      )}
    </motion.div>
  );
}
