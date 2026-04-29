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
  CheckCircle, 
  ArrowRight,
  Cpu,
  BarChart3,
  Users,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';
import './InvestorDeck.css';

gsap.registerPlugin(ScrollTrigger);

const FeatureExplanation = ({ title, content }) => (
  <div className="flex items-center gap-2 group cursor-help">
    <span className="font-semibold">{title}</span>
    <HelpTooltip title={title} content={content} />
  </div>
);

const InvestorDeck = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    sectionsRef.current.forEach((section, index) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
          }
        }
      );
    });
  }, []);

  return (
    <div className="page-container relative overflow-hidden">
      <div className="bg-flux"></div>
      <Navbar title="Investor Deck v2.0" />
      
      <div className="page-content deck-layout animate-fade-in px-8 max-w-[1400px] mx-auto">
        
        {/* Slide 1: The Disruption */}
        <div ref={el => sectionsRef.current[0] = el} className="deck-section mb-40 text-center pt-20">
          <div className="text-xs-caps mb-8">Seed Round: Global Expansion</div>
          <h1 className="text-7xl md:text-9xl mb-10 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-periwinkle to-gold">
            GRANT GENIE
          </h1>
          <p className="text-2xl md:text-3xl max-w-4xl mx-auto text-secondary leading-tight mb-16">
            The world's first <span className="text-primary font-bold">Infinite Capacity</span> grant operating system. 
            Automating the $50B funding sector with multi-agent intelligence.
          </p>
          <div className="flex justify-center gap-8">
            <button className="btn btn-primary">Term Sheet v2</button>
            <button className="btn btn-outline">Competitive Audit</button>
          </div>
        </div>

        {/* Slide 2: Competitive Takedown */}
        <div ref={el => sectionsRef.current[1] = el} className="deck-section mb-40">
          <div className="text-xs-caps mb-10 text-center">Market Positioning Matrix</div>
          <h2 className="text-5xl md:text-7xl text-center mb-20 tracking-tight">Systemic Superiority</h2>
          
          <div className="glass-card p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-periwinkle/5">
                    <th className="p-8 text-xs-caps">Core Capability</th>
                    <th className="p-8 text-center text-secondary opacity-50 text-xs-caps">Instrumentl</th>
                    <th className="p-8 text-center text-secondary opacity-50 text-xs-caps">GrantAssistant</th>
                    <th className="p-8 text-center text-periwinkle text-xs-caps bg-periwinkle/5">Grant Genie</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-periwinkle/5">
                    <td className="p-8"><FeatureExplanation title="Entry Price" content="Standard monthly starting price for small nonprofits." /></td>
                    <td className="p-8 text-center text-secondary">$299/mo</td>
                    <td className="p-8 text-center text-secondary">$300/mo+</td>
                    <td className="p-8 text-center font-bold text-emerald bg-periwinkle/5">$150/mo</td>
                  </tr>
                  <tr className="border-t border-periwinkle/5">
                    <td className="p-8"><FeatureExplanation title="Writing Engine" content="Depth of AI drafting. Most use basic ChatGPT wrappers; we use multi-agent recursive logic." /></td>
                    <td className="p-8 text-center text-secondary">Basic Assistant</td>
                    <td className="p-8 text-center text-secondary">Collaborative AI</td>
                    <td className="p-8 text-center font-bold text-emerald bg-periwinkle/5">Multi-Agent Oracle</td>
                  </tr>
                  <tr className="border-t border-periwinkle/5">
                    <td className="p-8"><FeatureExplanation title="Monthly Limits" content="The amount of grants or social campaigns you can generate per month." /></td>
                    <td className="p-8 text-center text-secondary">Fixed Caps</td>
                    <td className="p-8 text-center text-secondary">Strict Quotas</td>
                    <td className="p-8 text-center font-bold text-emerald bg-periwinkle/5">Infinite (BYOK)</td>
                  </tr>
                  <tr className="border-t border-periwinkle/5">
                    <td className="p-8"><FeatureExplanation title="Funder CRM" content="Tracking relationships and tasks with foundations over time." /></td>
                    <td className="p-8 text-center text-primary font-bold">Industry Standard</td>
                    <td className="p-8 text-center text-secondary">Limited</td>
                    <td className="p-8 text-center font-bold text-emerald bg-periwinkle/5">Automated Genie-Donna</td>
                  </tr>
                  <tr className="border-t border-periwinkle/5">
                    <td className="p-8"><FeatureExplanation title="Data Privacy" content="Where your sensitive 501c3 and audit data is stored." /></td>
                    <td className="p-8 text-center text-secondary">Centralized Cloud</td>
                    <td className="p-8 text-center text-secondary">Centralized Cloud</td>
                    <td className="p-8 text-center font-bold text-emerald bg-periwinkle/5">Zero-Trust Vault</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Slide 3: The Architecture of Profit */}
        <div ref={el => sectionsRef.current[2] = el} className="deck-section mb-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="text-xs-caps mb-8">The $30k MRR Blueprint</div>
            <h2 className="text-6xl mb-10 tracking-tight">High Velocity Acquisition</h2>
            <p className="text-xl text-secondary mb-12 leading-relaxed">
              Our "Disruptor Tier" ($150) is priced to convert users from Instrumentl and GrantAssistant instantly. 
              By leveraging <span className="text-primary font-bold">Multi-Agent Automation</span>, our cost-per-grant is 90% lower than competitors.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="glass-card p-8 text-center">
                <Cpu className="mx-auto mb-4 text-periwinkle" size={32} />
                <div className="text-xs-caps mb-2">Genie Cost</div>
                <div className="text-3xl font-bold text-primary">$0.02</div>
              </div>
              <div className="glass-card p-8 text-center">
                <TrendingUp className="mx-auto mb-4 text-emerald" size={32} />
                <div className="text-xs-caps mb-2">Net Margin</div>
                <div className="text-3xl font-bold text-primary">98%</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 bg-periwinkle/10 blur-3xl rounded-full"></div>
            <img 
              src="/nano_banner_funding.png" 
              alt="Funding Trajectory" 
              className="relative w-full rounded-[40px] shadow-2xl border border-periwinkle/20"
            />
          </div>
        </div>

        {/* Slide 4: The Ask */}
        <div ref={el => sectionsRef.current[3] = el} className="deck-section mb-40">
          <GlassCard className="p-20 text-center border-periwinkle/30 bg-periwinkle/5">
            <Sparkles className="mx-auto mb-10 text-periwinkle" size={60} />
            <h2 className="text-7xl mb-8 tracking-tight">$10,000 Seed Round</h2>
            <p className="text-xl text-secondary mb-16 max-w-2xl mx-auto">
              $4,000 for autonomous production scaling. $6,000 for surgical acquisition of 'Vee' and 'Instrumentl' defectors.
            </p>
            <button className="btn btn-primary py-6 px-12 text-lg">Initialize Term Sheet</button>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default InvestorDeck;
