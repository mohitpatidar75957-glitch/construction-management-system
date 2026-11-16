import React from 'react';
import { 
  Search, 
  Calendar, 
  Bell, 
  ChevronDown, 
  RotateCw 
} from 'lucide-react';

export default function Navbar({ onRefresh }) {
  return (
    <header className="window-navbar">
      {/* Left: User Welcome matching screenshot */}
      <div className="navbar-welcome-group">
        <div className="navbar-avatar-circle">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="Mohit Patidar" 
            className="navbar-avatar-img"
          />
        </div>
        <div className="navbar-welcome-text">
          <span className="welcome-heading">Welcome, Mohit</span>
          <span className="welcome-role">Owner & Executive</span>
        </div>
      </div>

      {/* Center: Search Capsule matching screenshot */}
      <div className="navbar-search-wrapper">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search projects, sites, or reports..." 
          className="search-input"
        />
        <kbd className="search-shortcut">Ctrl + K</kbd>
      </div>

      {/* Right Controls matching screenshot */}
      <div className="navbar-controls-wrapper">
        {/* Date Filter Capsule */}
        <div className="date-picker-window">
          <Calendar size={15} className="date-icon" />
          <span className="date-text">Nov 1 – Nov 30, 2026</span>
          <ChevronDown size={14} className="chevron-icon" />
        </div>

        {/* Sync Button */}
        <button 
          className="navbar-icon-btn" 
          onClick={onRefresh} 
          title="Sync with Live Database"
        >
          <RotateCw size={16} />
        </button>

        {/* Notification Bell */}
        <div className="notification-btn-wrapper">
          <button className="navbar-icon-btn" title="Notifications">
            <Bell size={17} />
            <span className="notification-badge">3</span>
          </button>
        </div>
      </div>
    </header>
  );
}