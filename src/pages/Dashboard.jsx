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
    <div className="page-container">
      <Navbar title="Command Center" />
      
      <div className="page-content animate-fade-in">
        <div className="dashboard-header-premium mb-12">
          <div className="max-w-4xl">
            <div className="text-xs-caps text-gold mb-4">Executive Dashboard</div>
            <h1 className="text-5xl md:text-7xl mb-6 tracking-tight flex items-center flex-wrap gap-4">
              Welcome, <span className="text-gold glow-text">Director</span>.
              <HelpTooltip 
                title="System Overview" 
                content="This is your autonomous funding hub. From here, monitor AI drafting performance, track secured funding, and review real-time funder trends."
                defaultOpen={true}
              />
            </h1>
            <p className="text-xl text-secondary leading-relaxed">Your Grant Genie intelligence is processing 12 active funding opportunities.</p>
          </div>
        </div>

        <div className="bento-grid">
          
          {/* Main Focus Tile */}
          <GlassCard 
            ref={el => cardsRef.current[0] = el}
            className="bento-tile bento-main interactive" 
            interactive
          >
            <div className="tile-content h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="text-gold" size={20} />
                  <span className="text-xs-caps">Priority Objective</span>
                </div>
                <h2 className="text-4xl mb-3 tracking-tight">Lumina Catalyst</h2>
                <p className="text-secondary mb-8">Deadline in 14 days • 94% DNA Match Strength</p>
                
                <div className="progress-container mb-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted mb-2">
                    <span>Drafting Maturity</span>
                    <span className="text-gold">65%</span>
                  </div>
                  <div className="bento-progress-bar h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="bento-progress-fill h-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>
              
              <button className="btn btn-primary mt-8">
                Resume Strategy <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </GlassCard>

          {/* Metric Tile 1 */}
          <GlassCard 
            ref={el => cardsRef.current[1] = el}
            className="bento-tile bento-metric"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs-caps">Secured YTD</span>
              <TrendingUp className="text-emerald" size={20} />
            </div>
            <h3 className="text-5xl tracking-tighter text-white mt-2">$1.4M</h3>
            <div className="text-emerald text-xs font-bold mt-4 flex items-center gap-1">+15% <span className="text-muted font-normal uppercase tracking-widest">Growth</span></div>
          </GlassCard>

          {/* Metric Tile 2 */}
          <GlassCard 
            ref={el => cardsRef.current[2] = el}
            className="bento-tile bento-metric"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs-caps">Active Oracles</span>
              <FileSignature className="text-gold" size={20} />
            </div>
            <h3 className="text-5xl tracking-tighter text-white mt-2">12</h3>
            <div className="text-gold text-xs font-bold mt-4 flex items-center gap-1">4 <span className="text-muted font-normal uppercase tracking-widest">Awaiting Audit</span></div>
          </GlassCard>

          {/* Activity Tile */}
          <GlassCard 
            ref={el => cardsRef.current[3] = el}
            className="bento-tile bento-activity interactive"
          >
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-lg">Recent Intelligence</h4>
              <ArrowRight className="text-muted" size={18} />
            </div>
            <div className="activity-stack space-y-6">
              <div className="stack-item flex justify-between items-center pb-4 border-b border-white/5">
                <div>
                  <p className="font-bold text-sm">Community Health</p>
                  <span className="text-[10px] text-muted uppercase tracking-widest">Submitted Yesterday</span>
                </div>
                <div className="text-2xl font-display font-bold text-emerald">92</div>
              </div>
              <div className="stack-item flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">Arts Endowment</p>
                  <span className="text-[10px] text-muted uppercase tracking-widest">Auditing Now</span>
                </div>
                <div className="text-2xl font-display font-bold text-gold">78</div>
              </div>
            </div>
          </GlassCard>

          {/* Insights Tile */}
          <GlassCard 
            ref={el => cardsRef.current[4] = el}
            className="bento-tile bento-insights"
          >
            <h4 className="text-lg mb-6">Genie Insights</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <AlertCircle className="text-gold shrink-0" size={18} />
                <p className="text-xs text-secondary leading-relaxed">Board list expires in 30 days. Recommend <span className="text-white font-bold underline">Vault Sync</span>.</p>
              </div>
              <div className="flex gap-4">
                <Target className="text-emerald shrink-0" size={18} />
                <p className="text-xs text-secondary leading-relaxed">Funder Apex Health is favoring tech-focused proposals this quarter.</p>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
