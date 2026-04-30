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
    <div className="app-shell" style={{ flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Desktop Sidebar */}
        <aside className="sidebar desktop-only">
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
              <div className="avatar" onClick={() => navigate('/settings')}>D</div>
            </div>
          </header>

          <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--main-padding, 32px)', paddingBottom: 'calc(var(--main-padding, 32px) + 80px)' }}>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-only" style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: 72, 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(10px)', 
        borderTop: '1px solid var(--slate-200)', 
        display: 'flex', 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 4, 
              background: 'none', 
              border: 'none', 
              color: location.pathname === path ? 'var(--teal)' : 'var(--slate-400)',
              transition: 'all 0.2s'
            }}
          >
            <Icon size={20} style={{ opacity: location.pathname === path ? 1 : 0.7 }} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>{label.split(' ')[0]}</span>
          </button>
        ))}
        <button
          onClick={() => navigate('/settings')}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 4, 
            background: 'none', 
            border: 'none', 
            color: location.pathname === '/settings' ? 'var(--teal)' : 'var(--slate-400)'
          }}
        >
          <Settings size={20} />
          <span style={{ fontSize: 10, fontWeight: 600 }}>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default AppLayout;

