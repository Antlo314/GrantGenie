import React, { useState, useEffect } from 'react';
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
  Menu,
  X,
  ChevronRight,
  HelpCircle,
  Activity
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <>
      <div className="sidebar-logo" style={{ padding: '24px 20px', marginBottom: 8 }}>
        <img src="/grant_genie_favicon.png" alt="Grant Genie" style={{ width: 32, height: 32 }} />
        <div className="sidebar-logo-text" style={{ fontSize: 18, letterSpacing: '-0.02em' }}>Grant <span>Genie</span></div>
      </div>

      <div className="sidebar-section-label">AI Operating System</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
            style={{ borderRadius: 10, borderLeft: 'none', padding: '10px 16px' }}
          >
            <Icon size={18} />
            {label}
            {location.pathname === path && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
          </button>
        ))}
      </div>

      <div className="sidebar-section-label" style={{ marginTop: 'auto' }}>Account & Settings</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px', marginBottom: 20 }}>
        <button 
          className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`} 
          onClick={() => navigate('/settings')}
          style={{ borderRadius: 10, borderLeft: 'none', padding: '10px 16px' }}
        >
          <Settings size={18} /> Settings
        </button>
        <button 
          className="sidebar-link" 
          onClick={() => navigate('/')}
          style={{ borderRadius: 10, borderLeft: 'none', padding: '10px 16px' }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="app-shell" style={{ background: 'var(--slate-50)' }}>
      {/* Mobile Hamburger Overlay */}
      {isSidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
          <aside className="mobile-sidebar">
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
              <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--slate-400)' }}><X size={24} /></button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="sidebar desktop-only" style={{ width: 260, borderRight: '1px solid var(--slate-200)' }}>
        <SidebarContent />
      </aside>

      {/* Main Panel */}
      <div className="main-panel" style={{ position: 'relative' }}>
        <header className="topbar" style={{ padding: '0 24px', height: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="mobile-only" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', padding: 8, marginLeft: -8 }}>
              <Menu size={24} color="var(--slate-600)" />
            </button>
            <div className="topbar-title" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{title}</div>
            
            {/* Desktop Agent Status */}
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'white', borderRadius: 99, border: '1px solid var(--slate-200)', marginLeft: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {['O', 'R', 'D'].map(agent => (
                  <div key={agent} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }} />
                ))}
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Systems Active</span>
            </div>
          </div>

          <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ position: 'relative' }} className="desktop-only">
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input type="text" placeholder="Search commands..." style={{ paddingLeft: 40, width: 240, height: 40, borderRadius: 12, background: 'var(--slate-100)', border: 'none', fontSize: 14 }} />
            </div>
            <button className="btn btn-ghost" style={{ padding: 10, borderRadius: 12, border: 'none', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} color="var(--slate-600)" />
            </button>
            <div className="avatar" onClick={() => navigate('/settings')} style={{ width: 40, height: 40, borderRadius: 12, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>D</div>
          </div>
        </header>

        <main style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: '24px', position: 'relative' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
            {children}
          </div>

          {/* Floating Help / Consult the Genie */}
          <button 
            style={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24, 
              width: 56, 
              height: 56, 
              borderRadius: '50%', 
              background: 'var(--gradient-teal)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 8px 30px rgba(13,148,136,0.3)', 
              border: 'none', 
              cursor: 'pointer',
              zIndex: 900
            }}
            className="genie-fab"
            onClick={() => navigate('/oracle')}
          >
            <Sparkles size={24} />
          </button>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
