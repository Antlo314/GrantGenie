import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import HelpTooltip from '../components/HelpTooltip';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  TrendingUp, 
  Target, 
  Shield, 
  Zap, 
  Rocket, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Info,
  Layers,
  Cpu,
  BarChart3
} from 'lucide-react';
import './InvestorDeck.css';

gsap.registerPlugin(ScrollTrigger);

const FeatureExplanation = ({ title, content }) => (
  <div className="flex items-center gap-2 group cursor-help">
    <span>{title}</span>
    <HelpTooltip title={title} content={content} />
  </div>
);

const InvestorDeck = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    sectionsRef.current.forEach((section, index) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 100 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          }
        }
      );
    });
  }, []);

  return (
    <div className="page-container">
      <Navbar title="Investor Terminal" />
      
      <div className="page-content deck-layout animate-fade-in">
        {/* Slide 1: The Vision */}
        <div ref={el => sectionsRef.current[0] = el} className="deck-section mb-32 text-center pt-10">
          <div className="text-xs-caps text-gold mb-6">Seed Round Opportunity</div>
          <h1 className="text-6xl md:text-9xl mb-8 tracking-tighter">GRANT GENIE</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-secondary leading-relaxed">
            Monopolizing the $50B grant economy through <span className="text-white font-bold">Zero-Trust AI</span>. 
            We don't just write grants; we automate the entire fundraising lifecycle.
          </p>
          <div className="mt-12 flex justify-center gap-6">
            <button className="btn btn-primary">Download Pitch Deck</button>
            <button className="btn btn-outline">Executive Summary</button>
          </div>
        </div>

        {/* Slide 2: The Vee.com Takedown (Deep Feature Analysis) */}
        <div ref={el => sectionsRef.current[1] = el} className="deck-section mb-32">
          <div className="text-xs-caps text-gold mb-8 text-center">Market Disruption Analysis</div>
          <h2 className="text-4xl md:text-6xl text-center mb-16 tracking-tight">The "Vee Killer" Protocol</h2>
          
          <div className="comparison-canvas glass-panel p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="unison-table w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-8 text-left text-xs-caps">Critical Capabilities</th>
                    <th className="p-8 text-center text-red-400/60 text-xs-caps">Vee.com (Growth)</th>
                    <th className="p-8 text-center text-gold text-xs-caps bg-gold/5">Grant Genie (Disruptor)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-6 border-t border-white/5">
                      <FeatureExplanation 
                        title="License Cost" 
                        content="The flat monthly subscription fee to access the software platform. Grant Genie is 70% more affordable." 
                      />
                    </td>
                    <td className="p-6 border-t border-white/5 text-center text-secondary">$549 / mo</td>
                    <td className="p-6 border-t border-white/5 text-center font-bold text-white bg-gold/5">$150 / mo</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-t border-white/5">
                      <FeatureExplanation 
                        title="AI Teammates" 
                        content="Autonomous agents with specific roles (Strategy, Writing, Outreach). Vee limits access to their agents; we give you the full suite." 
                      />
                    </td>
                    <td className="p-6 border-t border-white/5 text-center text-secondary">Capped Access</td>
                    <td className="p-6 border-t border-white/5 text-center font-bold text-emerald bg-gold/5">Full Suite (Oracle, Donna, Grant)</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-t border-white/5">
                      <FeatureExplanation 
                        title="Written Grants" 
                        content="Full length grant applications drafted from scratch. Vee's high tier limits you to 3. We start at 5." 
                      />
                    </td>
                    <td className="p-6 border-t border-white/5 text-center text-secondary">3 Grants / mo</td>
                    <td className="p-6 border-t border-white/5 text-center font-bold text-white bg-gold/5">5 Grants / mo + Unlimited Overage</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-t border-white/5">
                      <FeatureExplanation 
                        title="Active Programs" 
                        content="Separate organizational departments or initiatives you can manage at once." 
                      />
                    </td>
                    <td className="p-6 border-t border-white/5 text-center text-secondary">3 Active</td>
                    <td className="p-6 border-t border-white/5 text-center font-bold text-emerald bg-gold/5">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-t border-white/5">
                      <FeatureExplanation 
                        title="Social Media Engine" 
                        content="Turning complex impact data into high-engagement LinkedIn, X, and Facebook posts." 
                      />
                    </td>
                    <td className="p-6 border-t border-white/5 text-center text-secondary">24 Posts / mo</td>
                    <td className="p-6 border-t border-white/5 text-center font-bold text-white bg-gold/5">Unlimited Campaigns</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-t border-white/5">
                      <FeatureExplanation 
                        title="Funder Discovery" 
                        content="AI-powered radar that scans for grant opportunities matching your specific mission DNA." 
                      />
                    </td>
                    <td className="p-6 border-t border-white/5 text-center text-secondary">Standard Radar</td>
                    <td className="p-6 border-t border-white/5 text-center font-bold text-emerald bg-gold/5">Quantum Radar (Real-time)</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-t border-white/5">
                      <FeatureExplanation 
                        title="Data Sovereignty" 
                        content="Zero-Trust Vault. Unlike Vee, we never see your data. It's encrypted locally in your 'bank'." 
                      />
                    </td>
                    <td className="p-6 border-t border-white/5 text-center text-secondary">Centralized Risk</td>
                    <td className="p-6 border-t border-white/5 text-center font-bold text-emerald bg-gold/5">Zero-Trust Vault (Proprietary)</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-t border-white/5">
                      <FeatureExplanation 
                        title="Donor Relations" 
                        content="Personalized automated follow-ups for high-net-worth individuals and major foundations." 
                      />
                    </td>
                    <td className="p-6 border-t border-white/5 text-center text-secondary">Not Included</td>
                    <td className="p-6 border-t border-white/5 text-center font-bold text-emerald bg-gold/5">Included (Donna Protocol)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Slide 3: The Math of $30k MRR */}
        <div ref={el => sectionsRef.current[2] = el} className="deck-section mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs-caps text-gold mb-6">Financial Engineering</div>
            <h2 className="text-5xl mb-8 tracking-tight">The Road to $30,000 MRR</h2>
            <p className="text-lg text-secondary mb-10 leading-relaxed">
              Because we use a <span className="text-white font-bold">Token-Based Architecture</span>, our overhead is virtually zero. 
              We don't need 10,000 users. We only need a high-quality community of 100 enterprise organizations.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">1</div>
                <p className="text-secondary"><strong>Acquisition</strong>: Target the 1.5M nonprofits overpaying for legacy software.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">2</div>
                <p className="text-secondary"><strong>Activation</strong>: $150 Disruptor Tier converts 300 users = <strong>$45k/mo</strong>.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">3</div>
                <p className="text-secondary"><strong>Upsell</strong>: $299 Enterprise Tier converts 100 users = <strong>$30k/mo</strong>.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="text-center">
              <Cpu className="mx-auto mb-4 text-gold" size={32} />
              <h4 className="mb-2">API Cost</h4>
              <p className="text-2xl font-bold text-emerald">$0.05 / Grant</p>
            </GlassCard>
            <GlassCard className="text-center">
              <BarChart3 className="mx-auto mb-4 text-gold" size={32} />
              <h4 className="mb-2">Profit Margin</h4>
              <p className="text-2xl font-bold text-emerald">99.8%</p>
            </GlassCard>
            <GlassCard className="text-center">
              <Users className="mx-auto mb-4 text-gold" size={32} />
              <h4 className="mb-2">User Goal</h4>
              <p className="text-2xl font-bold text-white">100</p>
            </GlassCard>
            <GlassCard className="text-center">
              <DollarSign className="mx-auto mb-4 text-gold" size={32} />
              <h4 className="mb-2">MRR Goal</h4>
              <p className="text-2xl font-bold text-white">$30,000</p>
            </GlassCard>
          </div>
        </div>

        {/* Slide 4: The Ask */}
        <div ref={el => sectionsRef.current[3] = el} className="deck-section mb-32">
          <GlassCard className="text-center py-20 bg-gold/5 border-gold/20">
            <div className="text-xs-caps text-gold mb-6">Seed Investment Request</div>
            <h2 className="text-6xl mb-10 tracking-tight">$10,000 Seed Round</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto mb-16">
              <div className="text-left">
                <h4 className="mb-4 text-gold">$4,000 Deployment</h4>
                <p className="text-sm text-secondary">Finalizing the multi-agent production infrastructure and cloud-vault security.</p>
              </div>
              <div className="text-left">
                <h4 className="mb-4 text-gold">$6,000 Acquisition</h4>
                <p className="text-sm text-secondary">Targeted LinkedIn and search campaigns focusing on 'Vee.com' keyword disruption.</p>
              </div>
            </div>
            <button className="btn btn-primary text-lg">Initialize Term Sheet <ArrowRight className="ml-3" /></button>
          </GlassCard>
        </div>

        {/* Slide 5: IP Portfolio */}
        <div ref={el => sectionsRef.current[4] = el} className="deck-section mb-32">
          <div className="text-xs-caps text-gold mb-8 text-center">Intellectual Property Portfolio</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="interactive" interactive>
              <Shield className="text-gold mb-6" size={32} />
              <h3 className="text-xl mb-4">Zero-Trust Vault</h3>
              <p className="text-sm text-secondary">A proprietary local-first encryption layer for legal compliance. Standalone license potential for HIPAA/LEGAL.</p>
            </GlassCard>
            <GlassCard className="interactive" interactive>
              <Cpu className="text-gold mb-6" size={32} />
              <h3 className="text-xl mb-4">Oracle Engine</h3>
              <p className="text-sm text-secondary">Our unique multi-agent recursive logic for grant drafting that achieves 90%+ first-pass approval rates.</p>
            </GlassCard>
            <GlassCard className="interactive" interactive>
              <Layers className="text-gold mb-6" size={32} />
              <h3 className="text-xl mb-4">Impact Multiplier</h3>
              <p className="text-sm text-secondary">An automated PR and Donor Relation system that turns 1 successful grant into 100+ donor touchpoints.</p>
            </GlassCard>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvestorDeck;
