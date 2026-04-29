import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import HelpTooltip from '../components/HelpTooltip';
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
    <div className="page-container relative overflow-hidden bg-white">
      <div className="bg-flux"></div>
      <Navbar title="Impact Multiplier" />
      
      <div className="page-content animate-fade-in px-8 max-w-[1400px] mx-auto">
        <div ref={headerRef} className="campaign-header-premium flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10 pt-10">
          <div className="vault-title flex items-start gap-8">
            <div className="icon-glow-container p-8 glass-card bg-periwinkle/5 border-periwinkle/20 rounded-[40px]">
              <Megaphone className="text-periwinkle" size={48} />
            </div>
            <div>
              <div className="text-xs-caps text-periwinkle mb-3">Genie Donna Protocol</div>
              <h2 className="text-5xl md:text-7xl tracking-tighter mb-6">Campaign Engine</h2>
              <div className="flex items-center gap-4 text-xl text-secondary max-w-xl leading-tight">
                Transform a single successful grant into an automated 365-day engagement machine. 
                <HelpTooltip title="The Donna Protocol" content="Inspired by high-end donor stewardship, this engine automatically generates social assets, donor emails, and impact reports from your won grants." />
              </div>
            </div>
          </div>
          
          <div className="p-1.5 bg-periwinkle/5 rounded-full flex border border-periwinkle/10 shadow-xl">
            <button 
              className={`flex items-center gap-4 py-5 px-12 text-xs font-bold rounded-full transition-all ${campaignType === 'social' ? 'bg-periwinkle text-white' : 'text-secondary hover:text-primary'}`}
              onClick={() => setCampaignType('social')}
            >
              <Share2 size={18} /> Social Media
            </button>
            <button 
              className={`flex items-center gap-4 py-5 px-12 text-xs font-bold rounded-full transition-all ${campaignType === 'email' ? 'bg-periwinkle text-white' : 'text-secondary hover:text-primary'}`}
              onClick={() => setCampaignType('email')}
            >
              <Mail size={18} /> Donor Relations
            </button>
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Source Material Selector */}
          <GlassCard className="h-max p-10">
            <div className="text-xs-caps text-periwinkle mb-8">Intelligence Input</div>
            <h4 className="text-3xl mb-10 flex items-center gap-4 font-bold tracking-tight">
              <Sparkles size={28} className="text-periwinkle" /> Source Material
            </h4>
            
            <div className="space-y-6">
              <div className="p-8 glass-card border-periwinkle/40 bg-periwinkle/5 rounded-3xl cursor-pointer">
                <p className="font-bold text-xl text-primary">Lumina Foundation Award</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs font-bold text-emerald tracking-widest uppercase">Won Oct 2026</span>
                  <span className="text-xs text-secondary/60 uppercase tracking-widest">• $150k</span>
                </div>
              </div>
              <div className="p-8 glass-card opacity-40 hover:opacity-100 transition-all rounded-3xl cursor-pointer">
                <p className="font-bold text-xl text-primary">Community Health Init.</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs font-bold text-periwinkle tracking-widest uppercase">Pending Nov 2026</span>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-12 border-t border-periwinkle/10">
              <label className="text-xs-caps block mb-6">Campaign Objective</label>
              <select className="w-full p-4 bg-periwinkle/5 border border-periwinkle/10 rounded-2xl outline-none text-primary font-bold">
                <option>Announce Grant Win</option>
                <option>Monthly Donor Update</option>
                <option>Capital Campaign Push</option>
              </select>
              <p className="text-xs text-secondary mt-4">The Genie will adjust tone and call-to-action based on this goal.</p>
            </div>
            
            <button className="btn btn-primary w-full mt-12 py-6">
              Sync Intelligence <ArrowRight size={22} className="ml-4" />
            </button>
          </GlassCard>

          {/* Results Area */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {campaignType === 'social' ? (
              <GlassCard className="p-12" interactive>
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-periwinkle shadow-[0_0_20px_rgba(124,126,255,0.4)]"></div>
                    <span className="text-xs-caps">LinkedIn Thought Leadership</span>
                  </div>
                  <button className="btn btn-outline py-3 px-6 text-[10px]"><Copy size={16} className="mr-3"/> Copy</button>
                </div>
                <p className="text-2xl text-primary mb-12 leading-loose italic font-medium">
                  "Thrilled to announce that we've been awarded a $150,000 Catalyst Grant from the Lumina Foundation! This funding will allow us to deploy 500 new interactive learning terminals to Title I schools..."
                </p>
                <div className="flex justify-between items-center pt-8 border-t border-periwinkle/10">
                  <div className="flex items-center gap-4 text-sm text-emerald font-bold">
                    <ThumbsUp size={18}/> 98% Predicted Engagement
                  </div>
                  <span className="text-xs-caps opacity-60">Tone: Authoritative</span>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-12">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-emerald shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
                    <span className="text-xs-caps">Donna Smart Newsletter</span>
                  </div>
                  <div className="flex gap-6">
                    <button className="btn btn-outline py-3 px-8 text-[10px] font-bold"><Send size={16} className="mr-3"/> Dispatch</button>
                    <button className="btn btn-outline py-3 px-6 text-[10px]"><Copy size={18}/></button>
                  </div>
                </div>
                <div className="p-12 glass-card bg-periwinkle/5 border border-periwinkle/10 rounded-[48px]">
                  <p className="text-sm text-secondary mb-6 font-bold">Subject: A Major Milestone for Our Students (And You!)</p>
                  <div className="h-[1px] w-full bg-periwinkle/10 mb-12"></div>
                  <p className="text-2xl text-primary leading-loose font-medium">
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
