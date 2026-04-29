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
    <nav className="navbar-premium border-b border-periwinkle/10 backdrop-blur-2xl bg-white/40">
      <div className="nav-left flex items-center gap-6">
        <div ref={logoRef} className="nav-logo-container cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Grant Genie" className="h-10 w-10 object-contain" />
        </div>
        <div className="h-8 w-[1px] bg-periwinkle/10"></div>
        <h1 className="nav-title font-display text-xl tracking-tighter uppercase text-primary font-bold">
          GRANT <span className="text-periwinkle">GENIE</span>
        </h1>
      </div>

      <div className="nav-right flex items-center gap-8">
        <div className="nav-search-container hidden md:flex items-center bg-periwinkle/5 border border-periwinkle/10 rounded-full px-5 py-2.5">
          <Search size={16} className="text-periwinkle/60" />
          <input type="text" placeholder="Quantum Search..." className="bg-transparent border-none outline-none text-xs ml-3 w-60 text-primary placeholder-periwinkle/40" />
        </div>
        <button className="nav-icon-btn text-periwinkle/60 hover:text-periwinkle transition-colors"><Bell size={20} /></button>
        <button className="nav-profile-pill flex items-center gap-4 bg-periwinkle/10 border border-periwinkle/20 rounded-full px-1.5 py-1.5 hover:bg-periwinkle/20 transition-all">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-periwinkle/30 shadow-sm">
            <User size={18} className="text-periwinkle" />
          </div>
          <span className="text-xs font-bold mr-4 text-primary tracking-widest">DIRECTOR</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

