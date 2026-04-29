import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Infinity, Database } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav flex justify-between items-center p-8 lg:px-16">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Grant Genie" className="h-12 w-12 object-contain" />
          <span className="font-display text-3xl font-bold tracking-tighter text-white">GRANT GENIE</span>
        </div>
        <div className="flex items-center gap-8">
          <button className="text-xs-caps text-secondary hover:text-white transition-all">Philosophy</button>
          <button className="text-xs-caps text-secondary hover:text-white transition-all">Architecture</button>
          <button 
            onClick={() => navigate('/auth')}
            className="btn btn-outline ml-4 hidden md:flex"
          >
            Access Terminal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <div className="text-xs-caps text-gold mb-8 animate-fade-in tracking-[0.3em]">
          <Zap size={14} className="inline mr-3 mb-1" /> The Vee.com Alternative
        </div>
        
        <h1 className="text-6xl md:text-9xl mb-10 tracking-tighter glow-text animate-fade-in">
          Infinite Intelligence.<br/>Zero Limits.
        </h1>
        
        <p className="text-xl md:text-2xl text-secondary max-w-3xl mb-16 animate-fade-in leading-relaxed">
          Stop paying $549/mo for capped AI generators. Grant Genie is the enterprise-grade operating system for nonprofits that scales infinitely.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in">
          <button 
            onClick={() => navigate('/auth')}
            className="btn btn-primary"
          >
            Deploy Your Genie <ArrowRight className="ml-3" />
          </button>
          <button 
            onClick={() => navigate('/deck')}
            className="btn btn-outline"
          >
            Review Investor Deck
          </button>
        </div>
      </section>

      {/* Features / Comparison */}
      <section className="features-section px-8 lg:px-16 py-32 border-t border-white/5 bg-black/20">
        <div className="text-center mb-24">
          <div className="text-xs-caps text-gold mb-4">Core Architecture</div>
          <h2 className="text-4xl md:text-6xl tracking-tight">The Future of Fundraising</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="feature-card glass-card interactive" interactive>
            <Infinity className="text-gold mb-8" size={40} />
            <h3 className="text-2xl mb-4 tracking-tight">Infinite Capacity</h3>
            <p className="text-secondary leading-relaxed">Legacy platforms limit you to 3 grants. Our Disruptor Protocol gives you 5 grants plus unlimited overage at cost. Scale without friction.</p>
          </div>
          
          <div className="feature-card glass-card interactive" interactive>
            <Shield className="text-gold mb-8" size={40} />
            <h3 className="text-2xl mb-4 tracking-tight">Zero-Trust Vault</h3>
            <p className="text-secondary leading-relaxed">Your sensitive 501c3 audits never leave your browser. Cryptographic local-first security ensures institutional-grade data sovereignty.</p>
          </div>

          <div className="feature-card glass-card interactive" interactive>
            <Database className="text-gold mb-8" size={40} />
            <h3 className="text-2xl mb-4 tracking-tight">Unlimited Projects</h3>
            <p className="text-secondary leading-relaxed">Competitors charge extra just to manage a second funder. We give you unlimited containers to track every opportunity in your pipeline.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
