import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Users, Target, Shield, Zap, DollarSign, Rocket, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import './InvestorDeck.css';

gsap.registerPlugin(ScrollTrigger);

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
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <div className="page-container">
      <Navbar title="Investor Terminal" />
      
      <div className="page-content deck-layout animate-fade-in">
        {/* Hero Section */}
        <div ref={el => sectionsRef.current[0] = el} className="deck-hero text-center mb-24">
          <div className="hero-badge-organic mb-8 inline-flex">
            <Rocket size={18} className="text-gold mr-3" />
            <span className="text-xs font-bold tracking-widest uppercase">Seed Round: $10,000</span>
          </div>
          <h1 className="font-display text-5xl md:text-8xl font-bold mb-8 glow-text tracking-tight">Grant Genie</h1>
          <p className="text-lg md:text-2xl text-secondary max-w-4xl mx-auto leading-relaxed">
            The AI-native disruption of the $50B grant writing market. <br/>
            <span className="text-white font-bold underline decoration-gold/50">95% Profit Margins.</span> Scalable to $30k MRR with 100 users.
          </p>
        </div>

        {/* The Problem & Opportunity */}
        <div ref={el => sectionsRef.current[1] = el} className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-32">
          <GlassCard className="deck-card-organic problem p-10">
            <h2 className="font-display text-3xl mb-8 flex items-center gap-4 text-red-400">
              <XCircle size={32} /> The Problem
            </h2>
            <ul className="space-y-6 text-secondary text-lg">
              <li className="flex items-start gap-4">
                <span className="text-gold text-2xl leading-none">•</span>
                <span><strong>Vee.com Bottleneck</strong>: $549/mo for only 3 grants. Obscene markup on compute.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-gold text-2xl leading-none">•</span>
                <span><strong>Centralized Risk</strong>: Sensitive docs stored in black-box servers. No sovereignty.</span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard className="deck-card-organic solution p-10">
            <h2 className="font-display text-3xl mb-8 flex items-center gap-4 text-emerald">
              <CheckCircle size={32} /> The Disruption
            </h2>
            <ul className="space-y-6 text-secondary text-lg">
              <li className="flex items-start gap-4">
                <span className="text-gold text-2xl leading-none">•</span>
                <span><strong>Zero-Trust Architecture</strong>: Local-first encryption. Security as a feature.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-gold text-2xl leading-none">•</span>
                <span><strong>Infinite Scaling</strong>: Token-based model eliminates arbitrary feature caps.</span>
              </li>
            </ul>
          </GlassCard>
        </div>

        {/* Vee.com Comparison Table */}
        <div ref={el => sectionsRef.current[2] = el} className="mb-32">
          <h2 className="font-display text-4xl text-center mb-16">The "Vee Killer" Comparison</h2>
          <div className="comparison-container-premium glass-panel overflow-hidden border-gold/20 shadow-2xl shadow-gold/5">
            <div className="overflow-x-auto">
              <table className="comparison-table-premium w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left p-8">SaaS Feature</th>
                    <th className="p-8 text-center text-red-400 opacity-60">Vee.com (Growth)</th>
                    <th className="p-8 text-center text-gold font-bold bg-gold/5">Grant Genie (Disruptor)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/5">
                    <td className="p-6 font-medium">Monthly License</td>
                    <td className="p-6 text-center">$549 / mo</td>
                    <td className="p-6 text-center font-bold text-white bg-gold/5">$150 / mo</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="p-6 font-medium">Grant Capacity</td>
                    <td className="p-6 text-center">3 Grants</td>
                    <td className="p-6 text-center font-bold text-white bg-gold/5">5 Grants + Overage</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="p-6 font-medium">Active Programs</td>
                    <td className="p-6 text-center">3 Active</td>
                    <td className="p-6 text-center font-bold text-emerald bg-gold/5">Unlimited</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="p-6 font-medium">Margin Potential</td>
                    <td className="p-6 text-center">~20%</td>
                    <td className="p-6 text-center font-bold text-emerald bg-gold/5">95% (Token Architecture)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* The Financial Ask */}
        <div ref={el => sectionsRef.current[3] = el} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <GlassCard className="ask-card p-8 text-center">
            <h4 className="text-muted text-[10px] uppercase tracking-widest mb-4">Initial Seed</h4>
            <div className="text-5xl font-display font-bold mb-2">$10,000</div>
            <p className="text-secondary text-sm">Targeting "Bite-Sized" Early Investment</p>
          </GlassCard>

          <GlassCard className="ask-card p-8 text-center border-gold/40">
            <h4 className="text-gold text-[10px] uppercase tracking-widest mb-4">Activation Burn</h4>
            <div className="text-5xl font-display font-bold mb-2">$4,000</div>
            <p className="text-secondary text-sm">Full System Functional Deployment</p>
          </GlassCard>

          <GlassCard className="ask-card p-8 text-center">
            <h4 className="text-muted text-[10px] uppercase tracking-widest mb-4">Target Outcome</h4>
            <div className="text-5xl font-display font-bold mb-2">$30k<span className="text-xl"> MRR</span></div>
            <p className="text-secondary text-sm">100 Users @ $299 Enterprise Tier</p>
          </GlassCard>
        </div>

        {/* Final CTA */}
        <div ref={el => sectionsRef.current[4] = el} className="text-center pb-32">
          <h2 className="font-display text-5xl mb-10">Secure the Bag. Deploy the Disruption.</h2>
          <button className="btn btn-primary text-xl py-5 px-16 group">
            Finalize Investment <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorDeck;
