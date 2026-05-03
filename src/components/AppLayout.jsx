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
  Search,
  Layers,
  BarChart,
  Sparkles,
  HelpCircle
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Oracle Writer', path: '/oracle' },
  { icon: Search, label: 'Discovery Radar', path: '/radar' },
  { icon: Layers, label: 'Pipeline Commander', path: '/pipeline' },
  { icon: Megaphone, label: 'Donna Stewardship', path: '/campaign' },
  { icon: BarChart, label: 'Reports & Analytics', path: '/analytics' },
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="topbar-title">{title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'var(--slate-50)', borderRadius: 8, border: '1px solid var(--slate-100)' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['O', 'R', 'D'].map(agent => (
                    <div key={agent} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }} title={`${agent === 'O' ? 'Oracle' : agent === 'R' ? 'Radar' : 'Donna'} Active`} />
                  ))}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Systems Nominal</span>
              </div>
            </div>
            <div className="topbar-actions">
              <div style={{ position: 'relative', marginRight: 12 }} className="desktop-only">
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input type="text" placeholder="Global Search..." style={{ paddingLeft: 36, width: 200, height: 36, borderRadius: 18, fontSize: 13, background: 'var(--slate-50)', border: 'none' }} />
              </div>
              <button className="btn btn-ghost" style={{ padding: 8, borderRadius: '50%', position: 'relative' }}>
                <Bell size={18} />
                <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--rose)', borderRadius: '50%', border: '2px solid white' }} />
              </button>
              <div className="avatar" onClick={() => navigate('/settings')} style={{ boxShadow: '0 0 0 2px white, 0 0 0 4px var(--slate-100)' }}>D</div>
            </div>
          </header>

          <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--main-padding, 32px)', paddingBottom: 'calc(var(--main-padding, 32px) + 80px)', position: 'relative' }}>
            {children}
            
            {/* Floating Help / Consult the Genie */}
            <button 
              style={{ 
                position: 'fixed', 
                bottom: 32, 
                right: 32, 
                width: 56, 
                height: 56, 
                borderRadius: '50%', 
                background: 'var(--teal)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 8px 24px rgba(13,148,136,0.3)', 
                border: 'none', 
                cursor: 'pointer',
                zIndex: 1000,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="genie-fab"
              onClick={() => navigate('/oracle')}
            >
              <Sparkles size={24} />
              <style>{`
                .genie-fab:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 12px 32px rgba(13,148,136,0.4); }
              `}</style>
            </button>
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

