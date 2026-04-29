import React from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { TrendingUp, Users, Target, Shield, Zap, DollarSign, Rocket, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import './InvestorDeck.css';

const InvestorDeck = () => {
  return (
    <div className="page-container">
      <Navbar title="Investor Deck" />
      
      <div className="page-content deck-layout animate-fade-in">
        {/* Hero Section */}
        <div className="deck-hero text-center mb-16">
          <div className="hero-badge-organic mb-6">
            <Rocket size={18} className="text-gold mr-2" />
            <span className="text-sm font-medium tracking-widest uppercase">Seed Round: $10,000</span>
          </div>
          <h1 className="font-display text-6xl font-bold mb-6 glow-text">Grant Genie</h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            Revolutionizing the $50B grant writing market with AI-native, Zero-Trust architecture. 
            Scaling to $30,000 MRR with just 100 enterprise users.
          </p>
        </div>

        {/* The Problem & Opportunity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <GlassCard className="deck-card">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-3 text-gold">
              <XCircle className="text-red-400" /> The Problem
            </h2>
            <ul className="space-y-4 text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">•</span>
                <span>Legacy platforms (Vee.com) charge $249-$549/mo for restrictive caps (1-3 grants).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">•</span>
                <span>Massive markup on AI compute (900% premium on GPT-4 calls).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">•</span>
                <span>"Black Box" data storage creates security risks for sensitive compliance docs.</span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard className="deck-card">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-3 text-gold">
              <CheckCircle className="text-emerald" /> The Genie Solution
            </h2>
            <ul className="space-y-4 text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">•</span>
                <span><strong>95% Profit Margins</strong>: We sell the license, users pay pennies for compute.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">•</span>
                <span><strong>Zero-Trust Vault</strong>: Local-first encryption for maximum security.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">•</span>
                <span><strong>Unlimited Scaling</strong>: No arbitrary caps on programs or social campaigns.</span>
              </li>
            </ul>
          </GlassCard>
        </div>

        {/* Vee.com Comparison Table */}
        <div className="mb-20">
          <h2 className="font-display text-3xl text-center mb-10">Vee.com vs. Grant Genie</h2>
          <div className="comparison-container glass-panel overflow-hidden">
            <table className="comparison-table w-full">
              <thead>
                <tr>
                  <th className="text-left p-6 bg-white/5">Feature</th>
                  <th className="p-6 bg-red-400/5 text-red-400">Vee.com (Starter)</th>
                  <th className="p-6 bg-gold/10 text-gold font-bold">Grant Genie (Disruptor)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-t border-white/5">Monthly Price</td>
                  <td className="p-4 border-t border-white/5 text-center">$249 / mo</td>
                  <td className="p-4 border-t border-white/5 text-center font-bold">$150 / mo</td>
                </tr>
                <tr>
                  <td className="p-4 border-t border-white/5">Written Grants</td>
                  <td className="p-4 border-t border-white/5 text-center">1 (capped at $10k)</td>
                  <td className="p-4 border-t border-white/5 text-center font-bold">5 (Unlimited Amount)</td>
                </tr>
                <tr>
                  <td className="p-4 border-t border-white/5">Active Programs</td>
                  <td className="p-4 border-t border-white/5 text-center">1</td>
                  <td className="p-4 border-t border-white/5 text-center font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 border-t border-white/5">Social Posts</td>
                  <td className="p-4 border-t border-white/5 text-center">12</td>
                  <td className="p-4 border-t border-white/5 text-center font-bold">50</td>
                </tr>
                <tr>
                  <td className="p-4 border-t border-white/5">Data Sovereignty</td>
                  <td className="p-4 border-t border-white/5 text-center">Centralized</td>
                  <td className="p-4 border-t border-white/5 text-center font-bold text-emerald">Zero-Trust Vault</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Strategy & Financials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <GlassCard className="pricing-card text-center">
            <h4 className="text-secondary uppercase tracking-widest text-xs mb-2">Disruptor Tier</h4>
            <div className="text-4xl font-display font-bold mb-4">$150<span className="text-lg text-muted">/mo</span></div>
            <ul className="text-sm text-secondary space-y-2 mb-6">
              <li>5 Written Grants</li>
              <li>Unlimited Programs</li>
              <li>50 Social Assets</li>
            </ul>
            <div className="text-xs text-emerald font-bold">Target: 200 Users ($30k MRR)</div>
          </GlassCard>

          <GlassCard className="pricing-card text-center border-gold">
            <h4 className="text-gold uppercase tracking-widest text-xs mb-2">Enterprise Tier</h4>
            <div className="text-4xl font-display font-bold mb-4">$299<span className="text-lg text-muted">/mo</span></div>
            <ul className="text-sm text-secondary space-y-2 mb-6">
              <li>20 Written Grants</li>
              <li>Zero-Trust Vault Access</li>
              <li>Agency White-labeling</li>
            </ul>
            <div className="text-xs text-emerald font-bold">Target: 100 Users ($30k MRR)</div>
          </GlassCard>

          <GlassCard className="pricing-card text-center bg-gold/5">
            <h4 className="text-secondary uppercase tracking-widest text-xs mb-2">The Ask</h4>
            <div className="text-4xl font-display font-bold mb-4">$10k<span className="text-lg text-muted"> Seed</span></div>
            <p className="text-xs text-secondary px-4 leading-relaxed">
              $4k for Platform Activation.<br/>
              $6k for Aggressive Acquisition to lock in the first 100 users.
            </p>
          </GlassCard>
        </div>

        {/* IP Strategy */}
        <GlassCard className="mb-20">
          <h2 className="font-display text-2xl mb-6 text-gold">Intellectual Property Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-bold mb-2">The "Vault" Encryption Layer</h5>
              <p className="text-sm text-secondary">
                A proprietary local-first encryption protocol for compliance documents. Spin-off potential for Legal & Medical sectors.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-2">Multi-Agent Strategy Engine</h5>
              <p className="text-sm text-secondary">
                The core logic that separates Grant Research, Strategy, and Drafting into an autonomous loop.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Call to Action */}
        <div className="text-center pb-20">
          <h2 className="font-display text-3xl mb-6">Ready to Deploy the bag?</h2>
          <button className="btn btn-primary text-xl py-4 px-12">
            Execute Agreement <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorDeck;
