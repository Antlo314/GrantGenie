import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import gsap from 'gsap';
import { Megaphone, Mail, Share2, Sparkles, Send, Copy, ThumbsUp, ArrowRight } from 'lucide-react';
import './CampaignEngine.css';

const CampaignEngine = () => {
  const [campaignType, setCampaignType] = useState('social'); // 'social' or 'email'
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current, 
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    tl.fromTo(gridRef.current, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.5"
    );
  }, []);

  return (
    <div className="page-container">
      <Navbar title="Impact Multiplier" />
      
      <div className="page-content animate-fade-in">
        <div ref={headerRef} className="campaign-header-premium flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="vault-title flex items-start gap-6">
            <div className="icon-glow-container p-6 glass-panel shape-organic-1 bg-gold/5 border-gold/20">
              <Megaphone className="text-gold" size={40} />
            </div>
            <div>
              <div className="text-xs-caps text-gold mb-2">Genie Donna Protocol</div>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-4">Campaign Engine</h2>
              <p className="text-lg text-secondary max-w-xl leading-relaxed">
                Transform a single successful grant into an automated 365-day engagement machine. 
                <HelpTooltip title="The Donna Protocol" content="Inspired by high-end donor stewardship, this engine automatically generates social assets, donor emails, and impact reports from your won grants." />
              </p>
            </div>
          </div>
          
          <div className="p-1 bg-black/60 rounded-full flex border border-white/5 shadow-2xl">
            <button 
              className={`flex items-center gap-3 py-4 px-10 text-xs font-bold rounded-full transition-all ${campaignType === 'social' ? 'bg-gold text-black' : 'text-muted hover:text-white'}`}
              onClick={() => setCampaignType('social')}
            >
              <Share2 size={16} /> Social Media
            </button>
            <button 
              className={`flex items-center gap-3 py-4 px-10 text-xs font-bold rounded-full transition-all ${campaignType === 'email' ? 'bg-gold text-black' : 'text-muted hover:text-white'}`}
              onClick={() => setCampaignType('email')}
            >
              <Mail size={16} /> Donor Relations
            </button>
          </div>
        </div>

        <div ref={gridRef} className="campaign-grid-premium">
          {/* Source Material Selector */}
          <GlassCard className="h-max">
            <div className="text-xs-caps text-gold mb-6">Intelligence Input</div>
            <h4 className="text-2xl mb-8 flex items-center gap-3">
              <Sparkles size={24} /> Source Material
            </h4>
            
            <div className="space-y-4">
              <div className="p-6 glass-panel border-gold/40 bg-gold/5 rounded-2xl cursor-pointer">
                <p className="font-bold text-lg text-white">Lumina Foundation Award</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] uppercase text-emerald font-bold tracking-widest">Won Oct 2026</span>
                  <span className="text-[10px] text-muted uppercase tracking-widest">• $150k</span>
                </div>
              </div>
              <div className="p-6 glass-panel opacity-40 hover:opacity-100 transition-all rounded-2xl cursor-pointer">
                <p className="font-bold text-lg text-white">Community Health Init.</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] uppercase text-gold font-bold tracking-widest">Pending Nov 2026</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-10 border-t border-white/5">
              <label className="text-xs-caps block mb-4">Campaign Objective</label>
              <select className="w-full">
                <option>Announce Grant Win</option>
                <option>Monthly Donor Update</option>
                <option>Capital Campaign Push</option>
              </select>
              <p className="text-[10px] text-muted mt-3">The Genie will adjust tone and call-to-action based on this goal.</p>
            </div>
            
            <button className="btn btn-primary w-full mt-10 py-5">
              Sync Intelligence <ArrowRight size={20} className="ml-3" />
            </button>
          </GlassCard>

          {/* Results Area */}
          <div className="flex flex-col gap-8">
            {campaignType === 'social' ? (
              <>
                <GlassCard className="interactive" interactive>
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                      <span className="text-xs-caps">LinkedIn Thought Leadership</span>
                    </div>
                    <button className="btn btn-outline py-2 px-4 text-[10px]"><Copy size={14} className="mr-2"/> Copy</button>
                  </div>
                  <p className="text-lg text-white mb-10 leading-relaxed font-body italic">
                    "Thrilled to announce that we've been awarded a $150,000 Catalyst Grant from the Lumina Foundation! This funding will allow us to deploy 500 new interactive learning terminals to Title I schools..."
                  </p>
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-emerald font-bold">
                      <ThumbsUp size={14}/> 98% Predicted Engagement
                    </div>
                    <span className="text-xs-caps">Tone: Authoritative</span>
                  </div>
                </GlassCard>
              </>
            ) : (
              <GlassCard>
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-xs-caps">Donna Smart Newsletter</span>
                  </div>
                  <div className="flex gap-4">
                    <button className="btn btn-outline py-2 px-6 text-[10px]"><Send size={14} className="mr-2"/> Dispatch</button>
                    <button className="btn btn-outline py-2 px-4 text-[10px]"><Copy size={16}/></button>
                  </div>
                </div>
                <div className="p-10 glass-panel bg-black/60 border border-white/5 rounded-[40px]">
                  <p className="text-xs text-muted mb-4 font-bold">Subject: A Major Milestone for Our Students (And You!)</p>
                  <div className="h-[1px] w-full bg-white/10 mb-10"></div>
                  <p className="text-xl text-white leading-loose font-body">
                    Dear [Donor First Name],<br/><br/>
                    Because of your early belief in our mission, I am thrilled to share some monumental news with you before we announce it publicly.<br/><br/>
                    We have just been awarded a **$150,000 Catalyst Grant** from the Lumina Foundation...
                  </p>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignEngine;
