import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Megaphone, Mail, Share2, Sparkles, Send, Copy, ThumbsUp } from 'lucide-react';
import './CampaignEngine.css';

const CampaignEngine = () => {
  const [campaignType, setCampaignType] = useState('social'); // 'social' or 'email'

  return (
    <div className="page-container">
      <Navbar title="Campaign Engine" />
      
      <div className="page-content campaign-layout animate-fade-in">
        <div className="campaign-header">
          <div className="vault-title">
            <Megaphone className="text-gold glow-text" size={36} />
            <div>
              <h2 className="font-display text-3xl">Impact Multiplier</h2>
              <p className="text-secondary">Transform successful grants into unlimited social campaigns and donor emails.</p>
            </div>
          </div>
          
          <div className="campaign-tabs">
            <button 
              className={`tab-btn ${campaignType === 'social' ? 'active' : ''}`}
              onClick={() => setCampaignType('social')}
            >
              <Share2 size={16} /> Social Media
            </button>
            <button 
              className={`tab-btn ${campaignType === 'email' ? 'active' : ''}`}
              onClick={() => setCampaignType('email')}
            >
              <Mail size={16} /> Donor Comms
            </button>
          </div>
        </div>

        <div className="campaign-grid">
          {/* Context Selector */}
          <GlassCard className="campaign-context h-max">
            <h4 className="font-display text-lg mb-4 flex items-center gap-2">
              <Sparkles className="text-gold" size={18} /> Source Material
            </h4>
            
            <div className="context-item selected">
              <p className="font-medium text-primary">Lumina Foundation Award</p>
              <span className="text-xs text-emerald">Won • $150k • Oct 2026</span>
            </div>
            <div className="context-item">
              <p className="font-medium text-primary">Community Health Init.</p>
              <span className="text-xs text-muted">Submitted • Pending</span>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <label className="text-xs uppercase text-muted tracking-widest block mb-2">Campaign Goal</label>
              <select className="campaign-select w-full">
                <option>Announce Grant Win</option>
                <option>Call for Volunteers</option>
                <option>End of Year Giving</option>
              </select>
            </div>
            
            <button className="btn w-full btn-primary mt-6">Generate Assets</button>
          </GlassCard>

          {/* Generated Content Area */}
          <div className="campaign-results flex flex-col gap-4">
            {campaignType === 'social' ? (
              <>
                <GlassCard className="result-card">
                  <div className="flex justify-between items-center mb-3">
                    <span className="platform-badge linkedin">LinkedIn</span>
                    <button className="icon-btn-small"><Copy size={14}/></button>
                  </div>
                  <p className="text-sm text-primary mb-4 leading-relaxed">
                    Thrilled to announce that we've been awarded a $150,000 Catalyst Grant from the Lumina Foundation! 🚀<br/><br/>
                    This critical funding will allow us to deploy 500 new interactive learning terminals to Title I schools, expanding our Tech-Forward Youth initiative and driving measurable impact in digital literacy.<br/><br/>
                    Thank you to our board, partners, and the Lumina Foundation for believing in our vision for educational equity. <br/><br/>
                    #EducationalEquity #LuminaFoundation #EdTech #NonprofitLeadership
                  </p>
                  <div className="post-metrics text-xs text-muted flex gap-4">
                    <span className="flex items-center gap-1"><ThumbsUp size={12}/> Projected High Engagement</span>
                    <span>Tone: Professional, Grateful</span>
                  </div>
                </GlassCard>

                <GlassCard className="result-card">
                  <div className="flex justify-between items-center mb-3">
                    <span className="platform-badge twitter">Twitter / X</span>
                    <button className="icon-btn-small"><Copy size={14}/></button>
                  </div>
                  <p className="text-sm text-primary mb-4 leading-relaxed">
                    Huge news! 🎉 We just received a $150k grant from the Lumina Foundation to bring 500 interactive learning terminals to underserved schools. Digital literacy is a right, not a privilege. Read more about our Tech-Forward Youth expansion here: [Link] #EdTech #Philanthropy
                  </p>
                </GlassCard>
              </>
            ) : (
              <GlassCard className="result-card">
                <div className="flex justify-between items-center mb-3">
                  <span className="platform-badge email">Email Newsletter</span>
                  <div className="flex gap-2">
                    <button className="btn btn-outline py-1 px-3 text-xs"><Send size={12} className="mr-1"/> Send via CRM</button>
                    <button className="icon-btn-small"><Copy size={14}/></button>
                  </div>
                </div>
                <div className="email-preview p-4 bg-black/40 border border-white/10 rounded-md">
                  <p className="text-sm text-secondary mb-2"><strong>Subject:</strong> A Major Milestone for Our Students (And You!)</p>
                  <hr className="border-white/10 my-2" />
                  <p className="text-sm text-primary leading-relaxed">
                    Dear [Donor First Name],<br/><br/>
                    Because of your early belief in our mission, I am thrilled to share some monumental news with you before we announce it publicly.<br/><br/>
                    We have just been awarded a $150,000 Catalyst Grant from the Lumina Foundation. <br/><br/>
                    This grant will specifically fund 500 new interactive learning terminals for Title I schools. However, this grant requires a matching community contribution of $25,000 to fully unlock the funds by year-end.<br/><br/>
                    Your past support helped build the foundation that proved our model works. Will you help us meet this match and scale our impact?
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
