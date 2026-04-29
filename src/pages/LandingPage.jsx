import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Infinity, Database, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container relative overflow-hidden bg-white">
      <div className="bg-flux"></div>
      
      {/* Cinematic Motion Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(124,126,255,0.1),transparent_50%)] animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="landing-nav flex justify-between items-center p-10 lg:px-20 relative z-10">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Grant Genie" className="h-14 w-14 object-contain" />
          <span className="font-display text-4xl font-bold tracking-tighter text-primary">GRANT GENIE</span>
        </div>
        <div className="flex items-center gap-12">
          <button className="text-xs-caps text-secondary hover:text-periwinkle transition-all font-bold">Architecture</button>
          <button className="text-xs-caps text-secondary hover:text-periwinkle transition-all font-bold">Vault Security</button>
          <button 
            onClick={() => navigate('/auth')}
            className="btn btn-outline border-periwinkle/30"
          >
            Access Terminal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section flex flex-col items-center justify-center text-center px-6 pt-32 pb-48 relative z-10">
        <div className="text-xs-caps text-periwinkle mb-10 tracking-[0.4em] animate-fade-in">
          <Sparkles size={16} className="inline mr-3 mb-1" /> The Multi-Agent Evolution
        </div>
        
        <h1 className="text-7xl md:text-11xl mb-12 tracking-tighter leading-none animate-fade-in">
          Infinite Funding.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-periwinkle via-blue-500 to-emerald">Zero Friction.</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-secondary max-w-4xl mb-20 animate-fade-in leading-tight">
          Stop paying $300+/mo for legacy AI assistants. Grant Genie is the enterprise operating system that automates the entire grant lifecycle.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-8 animate-fade-in">
          <button 
            onClick={() => navigate('/auth')}
            className="btn btn-primary py-6 px-12 text-lg"
          >
            Deploy Instance <ArrowRight className="ml-4" />
          </button>
          <button 
            onClick={() => navigate('/deck')}
            className="btn btn-outline py-6 px-12 text-lg"
          >
            Review Audit
          </button>
        </div>
      </section>

      {/* Competitive Intelligence */}
      <section className="features-section px-10 lg:px-20 py-40 bg-periwinkle/5 border-t border-periwinkle/10 relative z-10">
        <div className="text-center mb-32">
          <div className="text-xs-caps mb-4">Market Disruption</div>
          <h2 className="text-5xl md:text-8xl tracking-tight">Systemic Advantage</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-8xl mx-auto">
          <GlassCard className="flex flex-col p-0" interactive>
            <img src="/nano_banner_intelligence.png" className="nano-banner" alt="Intelligence" />
            <div className="p-12">
              <h3 className="text-3xl mb-6 tracking-tight">Infinite Capacity</h3>
              <p className="text-xl text-secondary leading-relaxed">Instrumentl and GrantAssistant limit your volume. We offer unlimited drafting, research, and outreach using your own LLM architecture.</p>
            </div>
          </GlassCard>
          
          <GlassCard className="flex flex-col p-0" interactive>
            <img src="/nano_banner_funding.png" className="nano-banner" alt="Vault" />
            <div className="p-12">
              <h3 className="text-3xl mb-6 tracking-tight">Zero-Trust Vault</h3>
              <p className="text-xl text-secondary leading-relaxed">Don't trust third-party clouds with your organizational audits. Our local-first cryptographic vault is the industry's only secure solution.</p>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col p-0" interactive>
            <div className="nano-banner bg-gradient-to-br from-periwinkle to-emerald opacity-20"></div>
            <div className="p-12">
              <h3 className="text-3xl mb-6 tracking-tight">Multi-Agent Oracle</h3>
              <p className="text-xl text-secondary leading-relaxed">Basic AI assistants write generic text. Our multi-agent recursively audits every sentence against funder rubrics for 90%+ success.</p>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
