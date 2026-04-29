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
        <div className="dashboard-header-premium flex items-center justify-between mb-8">
          <div className="max-w-2xl">
            <h1 className="hero-greeting font-display text-4xl md:text-5xl tracking-tight leading-tight flex items-center flex-wrap gap-2">
              Welcome back, <span className="text-gold glow-text">Director</span>.
              <HelpTooltip 
                title="Getting Started" 
                content="This is your Command Center. From here, you can monitor your active AI drafts, track secured funding, and review Geni Insights. Use the dock at the bottom to navigate."
                defaultOpen={true}
              />
            </h1>
            <p className="hero-subtext text-secondary mt-2 text-lg">Your AI-driven pipeline is operating at peak efficiency.</p>
          </div>
        </div>

        <div className="bento-grid">
          
          {/* Main Focus Tile */}
          <GlassCard 
            ref={el => cardsRef.current[0] = el}
            className="bento-tile bento-main interactive" 
            interactive
          >
            <div className="tile-content h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="text-gold" size={24} />
                  <h3 className="font-display">Highest Priority</h3>
                </div>
                <h2 className="text-3xl font-display mb-2">Lumina Foundation Catalyst</h2>
                <p className="text-muted mb-4">Deadline in 14 days. 94% DNA Match.</p>
                
                <div className="progress-container">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Drafting Phase</span>
                    <span className="text-gold">65% Complete</span>
                  </div>
                  <div className="bento-progress-bar">
                    <div className="bento-progress-fill bg-gold" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>
              
              <button className="btn btn-primary mt-6 w-max">
                Resume in Oracle <ArrowRight size={18} />
              </button>
            </div>
          </GlassCard>

          {/* Metric Tile 1 */}
          <GlassCard 
            ref={el => cardsRef.current[1] = el}
            className="bento-tile bento-metric"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted text-sm uppercase tracking-widest">Secured YTD</span>
              <TrendingUp className="text-emerald" size={20} />
            </div>
            <h3 className="text-4xl font-display text-primary mt-2">$1.4M</h3>
            <span className="text-emerald text-sm font-medium mt-1">+15% vs Last Year</span>
          </GlassCard>

          {/* Metric Tile 2 */}
          <GlassCard 
            ref={el => cardsRef.current[2] = el}
            className="bento-tile bento-metric"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted text-sm uppercase tracking-widest">Active Oracles</span>
              <FileSignature className="text-gold" size={20} />
            </div>
            <h3 className="text-4xl font-display text-primary mt-2">12</h3>
            <span className="text-gold text-sm font-medium mt-1">4 Awaiting Review</span>
          </GlassCard>

          {/* Activity Tile */}
          <GlassCard 
            ref={el => cardsRef.current[3] = el}
            className="bento-tile bento-activity interactive"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display text-lg">Recent Audits</h4>
              <button className="btn-ghost p-1"><ArrowRight size={18} /></button>
            </div>
            <div className="activity-stack">
              <div className="stack-item">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="font-medium">Community Health Init.</p>
                    <span className="text-xs text-muted">Submitted • Yesterday</span>
                  </div>
                  <span className="bento-score-badge text-emerald">92</span>
                </div>
              </div>
              <div className="stack-item">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="font-medium">Arts & Culture Endowments</p>
                    <span className="text-xs text-muted">Auditing • 2 days ago</span>
                  </div>
                  <span className="bento-score-badge text-gold">78</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Insights Tile */}
          <GlassCard 
            ref={el => cardsRef.current[4] = el}
            className="bento-tile bento-insights"
          >
            <h4 className="font-display text-lg mb-4">Genie Insights</h4>
            <div className="insight-row">
              <AlertCircle className="text-gold shrink-0 mt-1" size={18} />
              <p className="text-sm text-secondary"><strong>Vault Warning:</strong> Board of Directors list expires in 30 days. Recommend upload.</p>
            </div>
            <div className="insight-row mt-4">
              <Target className="text-emerald shrink-0 mt-1" size={18} />
              <p className="text-sm text-secondary"><strong>Funder Trend:</strong> Apex Health is favoring tech-focused proposals this quarter.</p>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
