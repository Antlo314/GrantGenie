import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import HelpTooltip from '../components/HelpTooltip';
import gsap from 'gsap';
import { Target, TrendingUp, AlertCircle, Clock, Zap, FileSignature, ArrowRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(cardsRef.current, 
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" }
    );
  }, []);

  return (
    <div className="page-container relative overflow-hidden">
      <div className="bg-flux"></div>
      <Navbar title="Grant Command" />
      
      <div className="page-content animate-fade-in px-8 max-w-[1400px] mx-auto">
        <div className="dashboard-header-premium mb-16 pt-10">
          <div className="max-w-4xl">
            <div className="text-xs-caps mb-4">Autonomous Intelligence</div>
            <h1 className="text-6xl md:text-8xl mb-8 tracking-tighter leading-tight">
              Welcome, <span className="text-periwinkle font-bold">Director</span>.
              <HelpTooltip 
                title="System Overview" 
                content="Your Genie is currently scanning 45 foundation databases. 12 opportunities have been flagged for high-match potential."
                defaultOpen={true}
              />
            </h1>
            <p className="text-2xl text-secondary leading-relaxed max-w-2xl">
              Your funding pipeline is at <span className="text-emerald font-bold">94% capacity</span>.
            </p>
          </div>
        </div>

        <div className="bento-grid grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Main Focus Tile */}
          <GlassCard 
            ref={el => cardsRef.current[0] = el}
            className="md:col-span-2 row-span-2 interactive flex flex-col p-0" 
            interactive
          >
            <img src="/nano_banner_intelligence.png" className="nano-banner" alt="Intelligence" />
            <div className="p-10 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-periwinkle/10 rounded-xl">
                    <Zap className="text-periwinkle" size={24} />
                  </div>
                  <span className="text-xs-caps">Highest Priority Draft</span>
                </div>
                <h2 className="text-5xl mb-4 tracking-tight">Lumina Catalyst Grant</h2>
                <p className="text-xl text-secondary mb-10">Scale your Tech-Forward Youth initiative in Title I districts.</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-xs-caps">
                    <span>Oracle Maturity</span>
                    <span className="text-periwinkle">65%</span>
                  </div>
                  <div className="h-2 bg-periwinkle/5 rounded-full overflow-hidden">
                    <div className="h-full bg-periwinkle shadow-[0_0_20px_rgba(124,126,255,0.4)]" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <button className="btn btn-primary">Resume Strategy Engine <ArrowRight size={18} className="ml-3" /></button>
              </div>
            </div>
          </GlassCard>

          {/* Metric Tile 1 */}
          <GlassCard 
            ref={el => cardsRef.current[1] = el}
            className="flex flex-col justify-between p-10"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs-caps">Total Won YTD</span>
              <TrendingUp className="text-emerald" size={24} />
            </div>
            <div className="mt-8">
              <h3 className="text-6xl tracking-tighter text-primary">$1.4M</h3>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-emerald font-bold">+15%</span>
                <span className="text-xs-caps text-secondary opacity-60">vs Target</span>
              </div>
            </div>
          </GlassCard>

          {/* Metric Tile 2 */}
          <GlassCard 
            ref={el => cardsRef.current[2] = el}
            className="flex flex-col justify-between p-10"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs-caps">Active Genies</span>
              <div className="p-2 bg-gold/10 rounded-lg">
                <Sparkles className="text-gold" size={20} />
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-6xl tracking-tighter text-primary">12</h3>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-gold font-bold">4</span>
                <span className="text-xs-caps text-secondary opacity-60">Awaiting Director Review</span>
              </div>
            </div>
          </GlassCard>

          {/* Insights Tile */}
          <GlassCard 
            ref={el => cardsRef.current[3] = el}
            className="p-10"
          >
            <img src="/nano_banner_funding.png" className="nano-banner -mx-10 -mt-10 mb-8" alt="Funding" />
            <h4 className="text-2xl mb-8 tracking-tight">System Alerts</h4>
            <div className="space-y-8">
              <div className="flex gap-4">
                <Shield className="text-periwinkle shrink-0" size={20} />
                <p className="text-sm text-secondary leading-relaxed">Vault sync required for <span className="text-primary font-bold">2025 Audit</span>.</p>
              </div>
              <div className="flex gap-4">
                <Target className="text-emerald shrink-0" size={20} />
                <p className="text-sm text-secondary leading-relaxed">Instrumentl price hike detected. Recommend <span className="text-primary font-bold underline">Migration Protocol</span>.</p>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
