import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  WalletCards, 
  HardHat, 
  Boxes, 
  BarChart3,
  LogOut
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'All Projects', icon: Building2 },
    { id: 'accounts', label: 'Accounts & Payments', icon: WalletCards },
    { id: 'labour', label: 'Labour & Workforce', icon: HardHat },
    { id: 'materials', label: 'Material & Inventory', icon: Boxes },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from SitePilot?')) {
      alert('You have logged out successfully.');
      window.location.reload();
    }
  };

  return (
    <aside className="paper-glass-sidebar">
      {/* Brand Header matching HReazec in Image 2 */}
      <div className="sidebar-brand">
        <div className="brand-logo-wrap">
          <div className="brand-logo-icon">
            <svg viewBox="0 0 40 40" fill="none" className="terracotta-emblem-svg">
              <rect width="40" height="40" rx="12" fill="#d97a48" />
              <path d="M20 9L10 16.5V31H16V22H24V31H30V16.5L20 9Z" fill="#ffffff" />
              <circle cx="20" cy="15" r="2" fill="#d97a48" />
            </svg>
          </div>
          <div className="brand-titles">
            <h1 className="brand-name">SitePilot</h1>
            <span className="brand-tagline">Build Smarter</span>
          </div>
        </div>
      </div>

      <div className="nav-group-label">Main Menu</div>

      {/* Navigation Options */}
      <nav className="sidebar-nav-container">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-paper-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon-box">
                <Icon size={18} />
              </span>
              <span className="nav-label">{item.label}</span>
              {isActive && <span className="active-terracotta-indicator"></span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section: Logout Option */}
      <div className="sidebar-bottom-section">
        <button className="sidebar-logout-btn" onClick={handleLogout} title="Log Out">
          <span className="logout-icon-wrap">
            <LogOut size={18} />
          </span>
          <span className="logout-text">Log Out</span>
        </button>
      </div>
    </aside>
  );
}