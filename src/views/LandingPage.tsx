'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  ShieldCheck,
  Sparkles,
  HandCoins,
  FileSignature,
  ArrowRight,
  Check,
} from 'lucide-react';
import GenieAvatar from '../components/GenieAvatar';
import PoweredBy from '../components/PoweredBy';
import { BRAND } from '../lib/brand';
import { GLOSSARY } from '../lib/hints';

type Props = {
  onGetStarted: () => void;
  onDemo: () => void;
};

/**
 * Public marketing landing — before login.
 */
export default function LandingPage({ onGetStarted, onDemo }: Props) {
  return (
    <div className="min-h-screen w-full gg-app-bg text-slate-900 overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={BRAND.assets.logo} alt="" className="h-10 w-10 object-contain shrink-0" />
            <div className="min-w-0">
              <p className="font-black text-slate-900 tracking-tight leading-none truncate">
                {BRAND.name}
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold hidden sm:block">
                Real government data · plain English
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs sm:text-sm font-bold text-emerald-900 hover:bg-emerald-50 min-h-[40px]"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-xl bg-emerald-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 min-h-[40px] inline-flex items-center gap-1"
            >
              Get started <ArrowRight className="h-4 w-4 hidden sm:inline" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-3">
              Free tools for beginners
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.1] mb-4">
              Find real government grants & contracts — explained simply
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 max-w-xl">
              No grant experience needed. Search free official U.S. data, change your industry
              anytime, and get plain-English help. You always apply on the government’s own site.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-500"
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onDemo}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:border-emerald-300"
              >
                Try a demo first
              </button>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              {[
                'Live Grants.gov & USASpending data (free)',
                'Switch industries in one click',
                'Genie helps only when you ask',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border border-emerald-100 shadow-2xl">
              <img
                src={BRAND.assets.hero}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                <GenieAvatar src={BRAND.assets.widget} size={72} float />
                <p className="text-white text-sm font-semibold drop-shadow-md pb-2">
                  Your plain-English guide to real .gov opportunities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grant vs contract Bento & How it works */}
      <section className="border-y border-emerald-100/80 bg-white/40 backdrop-blur-md py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-block mb-3">
              Smart Opportunity Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Built for instant clarity
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Everything structured into plain-English intelligence pods.
            </p>
          </div>

          {/* 2026 Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Bento Pod 1: Grant Path */}
            <motion.div 
              whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
              className="md:col-span-2 glass-panel glass-emerald rounded-3xl p-8 card-3d relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/30">
                  <HandCoins className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                  Path 1 · Free Funding
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3 mb-2">{GLOSSARY.grant.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-lg">{GLOSSARY.grant.body}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-emerald-200/40 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <Sparkles className="w-4 h-4 text-emerald-500" /> Grants.gov live integration
              </div>
            </motion.div>

            {/* Bento Pod 2: Contract Path */}
            <motion.div 
              whileHover={{ y: -6, rotateX: 2, rotateY: 2 }}
              className="md:col-span-2 glass-panel glass-gold rounded-3xl p-8 card-3d relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
                  <FileSignature className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full">
                  Path 2 · Paid Contracts
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3 mb-2">{GLOSSARY.contract.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-lg">{GLOSSARY.contract.body}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-amber-200/40 flex items-center gap-2 text-xs font-bold text-amber-800">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> SAM.gov & USASpending live
              </div>
            </motion.div>

            {/* Bento Pod 3: Step 1 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="glass-panel rounded-3xl p-6 card-3d flex flex-col justify-between"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Step 01</p>
                <h4 className="font-black text-slate-900 text-base mb-1">Tell us what you do</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Pick industry chips anytime. Genie remembers your profile.</p>
              </div>
            </motion.div>

            {/* Bento Pod 4: Step 2 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="glass-panel rounded-3xl p-6 card-3d flex flex-col justify-between"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Step 02</p>
                <h4 className="font-black text-slate-900 text-base mb-1">Search real listings</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Verified federal data. Plain-English summaries before you apply.</p>
              </div>
            </motion.div>

            {/* Bento Pod 5: Step 3 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="md:col-span-2 glass-panel rounded-3xl p-6 card-3d flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Step 03 · Proposal Engine</p>
                  <h4 className="font-black text-slate-900 text-base">Save, Score & Draft</h4>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate award-winning 5-section drafts (Exec Summary, Need, Methodology, Budget & Evaluation). Analyze win probability with Oracle AI.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-emerald-900/40 bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-amber-900/20 pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 text-center relative z-10">
          <GenieAvatar src={BRAND.assets.widget} size={80} float className="mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">Ready to find winning grants?</h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            Create a free account to unlock live search, profile matching, and instant AI proposal generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-emerald-500 px-8 py-3 text-sm font-black text-white hover:bg-emerald-400 shadow-xl shadow-emerald-500/30"
            >
              Get started now <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDemo}
              className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-8 py-3 text-sm font-bold text-white hover:bg-white/20"
            >
              Try interactive demo
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} {BRAND.name}. Not a government website. Data from public
            federal sources.
          </p>
          <PoweredBy />
        </div>
      </footer>
    </div>
  );
}
