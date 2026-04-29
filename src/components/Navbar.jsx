import { Bell, Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ title }) => {
  return (
    <header className="navbar glass-panel">
      <div className="navbar-left">
        <h2 className="page-title font-display">{title}</h2>
      </div>
      
      <div className="navbar-right">
        <div className="search-bar">
          <Search size={18} className="search-icon text-muted" />
          <input type="text" placeholder="Search grants, drafts, vaults..." className="search-input" />
        </div>
        
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Director</span>
            <span className="user-role text-gold">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
