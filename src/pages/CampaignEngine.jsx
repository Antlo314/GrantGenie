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
        <div ref={headerRef} className="campaign-header-premium flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="vault-title flex items-start gap-4">
            <div className="icon-glow-container p-4 glass-panel shape-organic-1">
              <Megaphone className="text-gold" size={32} />
            </div>
            <div>
              <h2 className="font-display text-4xl glow-text">Campaign Engine</h2>
              <p className="text-secondary max-w-md">Transform successful grants into unlimited social campaigns and donor emails.</p>
            </div>
          </div>
          
          <div className="campaign-tabs-organic p-1 bg-black/40 rounded-full flex w-max border border-white/5">
            <button 
              className={`tab-btn-organic flex items-center gap-2 py-3 px-8 text-xs font-bold rounded-full transition-all ${campaignType === 'social' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-muted hover:text-white'}`}
              onClick={() => setCampaignType('social')}
            >
              <Share2 size={16} /> Social Media
            </button>
            <button 
              className={`tab-btn-organic flex items-center gap-2 py-3 px-8 text-xs font-bold rounded-full transition-all ${campaignType === 'email' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-muted hover:text-white'}`}
              onClick={() => setCampaignType('email')}
            >
              <Mail size={16} /> Donor Comms
            </button>
          </div>
        </div>

        <div ref={gridRef} className="campaign-grid-premium">
          {/* Source Material Selector */}
          <GlassCard className="campaign-context-organic h-max">
            <h4 className="font-display text-xl mb-6 flex items-center gap-2 text-gold">
              <Sparkles size={20} /> Source Material
            </h4>
            
            <div className="context-list space-y-3">
              <div className="context-item-organic selected p-4 glass-panel border-gold/40">
                <p className="font-bold text-primary">Lumina Foundation Award</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase text-emerald font-bold">Won</span>
                  <span className="text-[10px] text-muted">• $150k • Oct 2026</span>
                </div>
              </div>
              <div className="context-item-organic p-4 glass-panel opacity-60 hover:opacity-100 transition-opacity">
                <p className="font-bold text-primary">Community Health Init.</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase text-gold font-bold">Pending</span>
                  <span className="text-[10px] text-muted">• Nov 2026</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
              <label className="text-[10px] uppercase text-muted tracking-widest block mb-3">Campaign Objective</label>
              <select className="w-full">
                <option>Announce Grant Win</option>
                <option>Call for Volunteers</option>
                <option>End of Year Giving</option>
              </select>
            </div>
            
            <button className="btn btn-primary w-full mt-8 py-4">Generate Assets <ArrowRight size={18} className="ml-2" /></button>
          </GlassCard>

          {/* Results Area */}
          <div className="campaign-results-premium flex flex-col gap-6">
            {campaignType === 'social' ? (
              <>
                <GlassCard className="result-card-premium interactive" interactive>
                  <div className="flex justify-between items-center mb-6">
                    <div className="platform-tag flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      <span className="text-[10px] uppercase tracking-widest font-bold">LinkedIn Premium</span>
                    </div>
                    <button className="icon-btn-premium p-2 rounded-full hover:bg-white/5"><Copy size={16}/></button>
                  </div>
                  <p className="text-sm text-primary mb-8 leading-relaxed font-sans">
                    Thrilled to announce that we've been awarded a $150,000 Catalyst Grant from the Lumina Foundation! 🚀<br/><br/>
                    This critical funding will allow us to deploy 500 new interactive learning terminals to Title I schools, expanding our Tech-Forward Youth initiative and driving measurable impact in digital literacy.<br/><br/>
                    Thank you to our board, partners, and the Lumina Foundation for believing in our vision for educational equity. <br/><br/>
                    #EducationalEquity #LuminaFoundation #EdTech #NonprofitLeadership
                  </p>
                  <div className="post-footer border-t border-white/5 pt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4 text-[10px] text-emerald font-bold">
                      <span className="flex items-center gap-1"><ThumbsUp size={12}/> High Engagement Probability</span>
                    </div>
                    <span className="text-[10px] text-muted uppercase tracking-widest">Tone: Authoritative</span>
                  </div>
                </GlassCard>

                <GlassCard className="result-card-premium interactive" interactive>
                  <div className="flex justify-between items-center mb-6">
                    <div className="platform-tag flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      <span className="text-[10px] uppercase tracking-widest font-bold">X / Twitter</span>
                    </div>
                    <button className="icon-btn-premium p-2 rounded-full hover:bg-white/5"><Copy size={16}/></button>
                  </div>
                  <p className="text-sm text-primary mb-6 leading-relaxed font-sans italic">
                    "Digital literacy is a right, not a privilege. Huge news: We just received a $150k grant from the Lumina Foundation to bring 500 interactive learning terminals to underserved schools. Read more: [Link]"
                  </p>
                </GlassCard>
              </>
            ) : (
              <GlassCard className="result-card-premium">
                <div className="flex justify-between items-center mb-6">
                  <div className="platform-tag flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Smart Newsletter</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn btn-outline py-2 px-4 text-[10px]"><Send size={14}/> CRM Broadcast</button>
                    <button className="icon-btn-premium p-2 rounded-full hover:bg-white/5"><Copy size={16}/></button>
                  </div>
                </div>
                <div className="email-canvas p-8 glass-panel bg-black/40 border border-white/5 rounded-3xl">
                  <p className="text-xs text-muted mb-4"><strong>Subject:</strong> A Major Milestone for Our Students (And You!)</p>
                  <div className="h-[1px] w-full bg-white/5 mb-6"></div>
                  <p className="text-sm text-primary leading-loose font-sans">
                    Dear [Donor First Name],<br/><br/>
                    Because of your early belief in our mission, I am thrilled to share some monumental news with you before we announce it publicly.<br/><br/>
                    We have just been awarded a **$150,000 Catalyst Grant** from the Lumina Foundation. <br/><br/>
                    This grant will specifically fund 500 new interactive learning terminals for Title I schools. However, this grant requires a matching community contribution to fully unlock the funds by year-end.<br/><br/>
                    Will you help us meet this match and scale our impact?
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
