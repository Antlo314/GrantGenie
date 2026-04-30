import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Megaphone, 
  TrendingUp, 
  Settings, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Oracle Writer', path: '/oracle' },
  { icon: Search, label: 'Discovery Radar', path: '/radar' },
  { icon: Megaphone, label: 'Campaign Engine', path: '/campaign' },
  { icon: TrendingUp, label: 'Investor Deck', path: '/deck' },
];

const AppLayout = ({ children, title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/grant_genie_favicon.png" alt="Grant Genie" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <div className="sidebar-logo-text">Grant <span>Genie</span></div>
        </div>

        <div className="sidebar-section-label">Main Menu</div>
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 'auto' }}>Account</div>
        <button 
          className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`} 
          onClick={() => navigate('/settings')}
        >
          <Settings size={18} /> Settings
        </button>
        <button className="sidebar-link" onClick={() => navigate('/')}><LogOut size={18} /> Sign Out</button>
      </aside>

      {/* Main Panel */}
      <div className="main-panel">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-actions">
            <button className="btn btn-ghost" style={{ padding: '8px 12px' }}>
              <Search size={16} />
            </button>
            <button className="btn btn-ghost" style={{ padding: '8px 12px' }}>
              <Bell size={16} />
            </button>
            <div className="avatar">D</div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

