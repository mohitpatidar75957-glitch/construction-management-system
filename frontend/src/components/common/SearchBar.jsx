import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search records...', width = '320px' }) {
  return (
    <div className="navbar-search-wrapper" style={{ width }}>
      <Search size={16} className="search-icon" />
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="search-input"
      />
      <kbd className="search-shortcut">Ctrl + K</kbd>
    </div>
  );
}

