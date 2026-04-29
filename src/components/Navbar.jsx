import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Search, Bell, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const logoRef = useRef(null);

  useEffect(() => {
    gsap.to(logoRef.current, {
      filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.6))",
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <nav className="navbar-premium border-b border-white/5 backdrop-blur-xl">
      <div className="nav-left flex items-center gap-6">
        <div ref={logoRef} className="nav-logo-container cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Grant Genie" className="h-10 w-10 object-contain" />
        </div>
        <div className="h-8 w-[1px] bg-white/10"></div>
        <h1 className="nav-title font-display text-xl tracking-widest uppercase text-gold/80">{title}</h1>
      </div>

      <div className="nav-right flex items-center gap-6">
        <div className="nav-search-container hidden md:flex items-center bg-black/40 border border-white/5 rounded-full px-4 py-2">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Quantum Search..." className="bg-transparent border-none outline-none text-xs ml-3 w-48" />
        </div>
        <button className="nav-icon-btn"><Bell size={20} /></button>
        <button className="nav-profile-pill flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-2 py-2 hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40">
            <User size={16} className="text-gold" />
          </div>
          <span className="text-xs font-bold mr-2 hidden sm:inline">DIRECTOR</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
