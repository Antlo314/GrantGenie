import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Infinity, Database } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav flex justify-between items-center p-6 lg:px-12">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Grant Genie" className="h-10 w-10 object-contain" />
          <span className="font-display text-2xl font-bold tracking-tight text-primary">Grant Genie</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-secondary hover:text-primary transition-colors font-medium">Philosophy</button>
          <button className="text-secondary hover:text-primary transition-colors font-medium">Architecture</button>
          <button 
            onClick={() => navigate('/auth')}
            className="btn btn-outline py-2 px-6 ml-4 hidden md:flex"
          >
            Access Terminal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section flex flex-col items-center justify-center text-center px-4">
        <div className="hero-badge mb-6 animate-fade-in">
          <Zap size={14} className="text-gold mr-2" />
          <span className="text-sm font-medium tracking-widest uppercase text-gold">The Vee.com Alternative</span>
        </div>
        
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 max-w-4xl leading-tight glow-text animate-fade-in" style={{animationDelay: '0.1s'}}>
          Infinite Grant Intelligence.<br/>Zero Arbitrary Limits.
        </h1>
        
        <p className="text-xl text-secondary max-w-2xl mb-10 animate-fade-in" style={{animationDelay: '0.2s'}}>
          Stop paying $249/mo for capped AI generators. Grant Genie is an enterprise-grade, zero-trust operating system that scales infinitely using your own AI infrastructure.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <button 
            onClick={() => navigate('/auth')}
            className="btn btn-primary text-lg py-4 px-8"
          >
            Deploy Your Genie <ArrowRight className="ml-2" />
          </button>
          <button 
            onClick={() => navigate('/deck')}
            className="btn btn-outline text-lg py-4 px-8"
          >
            View Investor Deck
          </button>
        </div>
      </section>

      {/* Features / Comparison */}
      <section className="features-section px-6 lg:px-12 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why the Smart Money is on the Genie</h2>
          <p className="text-secondary">A direct architectural comparison.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="feature-card glass-card hover-glow">
            <Infinity className="text-gold mb-4" size={32} />
            <h3 className="font-display text-xl mb-3">Infinite Campaign Engine</h3>
            <p className="text-muted text-sm leading-relaxed">Legacy platforms limit you to 12 social posts or 1 grant per month. Our Bring-Your-Own-Key (BYOK) architecture means you pay fractions of a cent directly to the LLM. Generate 100 grants a day if you want to.</p>
          </div>
          
          <div className="feature-card glass-card hover-glow">
            <Shield className="text-emerald mb-4" size={32} />
            <h3 className="font-display text-xl mb-3">Zero-Trust Data Vault</h3>
            <p className="text-muted text-sm leading-relaxed">Stop uploading your sensitive 501c3 and financial audits to third-party databases. Grant Genie utilizes a cryptographic local-first vault structure. Your data remains yours.</p>
          </div>

          <div className="feature-card glass-card hover-glow">
            <Database className="text-blue-400 mb-4" size={32} />
            <h3 className="font-display text-xl mb-3">Unlimited Program Manager</h3>
            <p className="text-muted text-sm leading-relaxed">Competitors charge you hundreds more just to manage a second initiative. Grant Genie gives you unlimited project containers to track budgets, deadlines, and campaigns simultaneously.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
