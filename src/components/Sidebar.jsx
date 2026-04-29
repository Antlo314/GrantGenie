import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radar, PenTool, CheckSquare, Shield, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Discovery Radar', path: '/discovery', icon: Radar },
    { name: 'Oracle Writer', path: '/writer', icon: PenTool },
    { name: 'Audit Matrix', path: '/audit', icon: CheckSquare },
    { name: 'Data Vault', path: '/vault', icon: Shield },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon text-gold">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h1 className="logo-text">Grant<span className="text-gold">Genie</span></h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <a href="#" className="nav-item">
          <Settings size={20} className="nav-icon" />
          <span>Settings</span>
        </a>
        <a href="#" className="nav-item text-muted">
          <LogOut size={20} className="nav-icon" />
          <span>Log Out</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
