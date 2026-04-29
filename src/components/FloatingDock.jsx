import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radar, PenTool, CheckSquare, Shield } from 'lucide-react';
import './FloatingDock.css';

const FloatingDock = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Radar', path: '/discovery', icon: Radar },
    { name: 'Oracle', path: '/writer', icon: PenTool },
    { name: 'Audit', path: '/audit', icon: CheckSquare },
    { name: 'Vault', path: '/vault', icon: Shield },
  ];

  return (
    <div className="dock-container">
      <nav className="floating-dock glass-panel">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
            >
              <div className="dock-icon-wrapper">
                <Icon size={24} className="dock-icon" />
              </div>
              <span className="dock-tooltip font-display">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default FloatingDock;
