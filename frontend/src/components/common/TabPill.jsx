import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TabPill({ 
  tabs = ['Overview', 'Activity', 'Manage', 'Program', 'Account', 'Reports'], 
  activeTab = 'Overview', 
  onTabChange,
  onAddClick 
}) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 glass-pill shadow-xl bg-white/60 mx-auto w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange && onTabChange(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab}
          </button>
        );
      })}

      {/* Round '+' button on the right */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddClick}
        className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md ml-1 hover:bg-blue-600 transition-colors cursor-pointer"
        title="Add Entry"
      >
        <Plus size={14} />
      </motion.button>
    </div>
  );
}
