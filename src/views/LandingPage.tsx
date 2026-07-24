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
  PenTool,
} from 'lucide-react';
import PoweredBy from '../components/PoweredBy';
import { Tilt3D } from '../components/ui';
import { BRAND } from '../lib/brand';
import { GLOSSARY } from '../lib/hints';

type Props = {
  onGetStarted: () => void;
  onDemo: () => void;
};

const STEPS = [
  {
    icon: Sparkles,
    kicker: 'Step 1',
    title: 'Tell us what you do',
    body: 'Pick your industry in one tap. Change it anytime — the Genie remembers.',
  },
  {
    icon: Search,
    kicker: 'Step 2',
    title: 'Search real listings',
    body: 'We search free official U.S. data and explain each listing in plain English. We never invent grants.',
  },
  {
    icon: PenTool,
    kicker: 'Step 3 · Draft helper',
    title: 'Start a draft',
    body: 'The Draft helper writes a starting point from your profile. You edit it, then apply on the official government site.',
  },
];

/**
 * Public marketing landing — before login.
 */
export default function LandingPage({ onGetStarted, onDemo }: Props) {
  return (
    <div className="relative min-h-screen w-full gg-app-bg text-slate-900 overflow-x-hidden">
      <div className="aurora-field" aria-hidden="true" />

      <div className="relative">
        {/* ── Nav ── */}
        <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={BRAND.assets.logo}
                alt=""
                className="h-10 w-10 object-contain shrink-0 depth-shadow"
                draggable={false}
              />
              <div className="min-w-0">
                <p className="font-display font-bold text-slate-900 tracking-tight leading-none truncate">
                  {BRAND.name}
                </p>
                <p className="text-xs text-emerald-700 font-semibold hidden sm:block">
                  Real government data · plain English
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={onGetStarted} className="btn btn-secondary min-h-[40px]">
                Log in
              </button>
              <button type="button" onClick={onGetStarted} className="btn btn-primary min-h-[40px]">
                Get started <ArrowRight className="h-4 w-4 hidden sm:inline" />
              </button>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700 mb-3">
                Free tools for beginners
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.08] mb-4">
                Find real government{' '}
                <span className="text-gradient-hero">grants &amp; contracts</span> — explained simply
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 max-w-xl">
                No grant experience needed. Search free official U.S. data, change your industry
                anytime, and get plain-English help. You always apply on the government’s own site.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={onGetStarted} className="btn btn-primary btn-lg">
                  Create free account <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={onDemo} className="btn btn-secondary btn-lg">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex justify-center lg:justify-end perspective-1000"
            >
              <Tilt3D maxTilt={5} className="w-full max-w-md">
                <div className="relative">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] glass-panel">
                    <img
                      src={BRAND.assets.hero}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
                    <p className="absolute bottom-4 left-28 right-4 text-white text-sm font-semibold drop-shadow-md">
                      Your plain-English guide to real .gov opportunities
                    </p>
                  </div>
                  <img
                    src={BRAND.assets.widget}
                    alt=""
                    className="absolute -bottom-6 -left-4 h-28 w-28 object-contain depth-shadow gg-float-slow"
                    draggable={false}
                  />
                </div>
              </Tilt3D>
            </motion.div>
          </div>
        </section>

        {/* ── Grant vs contract + how it works ── */}
        <section className="relative border-y border-white/70 bg-white/40 backdrop-blur-md py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700 mb-3">
                How it works
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Two kinds of <span className="text-gradient-emerald">government money</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3">
                Everything comes with plain-English explanations, so you always know what you’re
                looking at.
              </p>
            </div>

            {/* Explainer cards — keep the plain-language copy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 perspective-1000">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
              >
                <div className="glass-emerald rounded-[2rem] p-7 sm:p-8 card-3d relative overflow-hidden h-full flex flex-col">
                  <div className="absolute -top-8 -right-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-emerald-600/30">
                    <HandCoins className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                    Path 1 · Free money
                  </span>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mt-2 mb-2">
                    {GLOSSARY.grant.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{GLOSSARY.grant.body}</p>
                  <div className="mt-auto pt-5 flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <Sparkles className="w-4 h-4 text-emerald-500" /> Live listings from Grants.gov —
                    always free
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <div className="glass-gold rounded-[2rem] p-7 sm:p-8 card-3d relative overflow-hidden h-full flex flex-col">
                  <div className="absolute -top-8 -right-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-amber-500/30">
                    <FileSignature className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
                    Path 2 · Paid work
                  </span>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mt-2 mb-2">
                    {GLOSSARY.contract.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{GLOSSARY.contract.body}</p>
                  <div className="mt-auto pt-5 flex items-center gap-2 text-xs font-bold text-amber-800">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> Live listings from SAM.gov
                    &amp; USASpending — always free
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Three simple steps */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                >
                  <div className="bento-tile p-6 h-full">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-1">
                      {s.kicker}
                    </p>
                    <h4 className="font-bold text-slate-900 text-base mb-1">{s.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden glass-panel-dark rounded-[2rem] noise-overlay px-6 py-12 sm:px-12 sm:py-14 text-center text-white"
          >
            <div
              className="absolute -top-20 -right-16 w-64 h-64 rounded-full opacity-25 pointer-events-none gg-pulse-glow"
              style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.8) 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.9) 0%, transparent 70%)' }}
            />
            <div className="relative">
              <img
                src={BRAND.assets.widget}
                alt=""
                className="mx-auto mb-5 h-24 w-24 object-contain depth-shadow gg-float"
                draggable={false}
              />
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                Ready to find your first grant?
              </h2>
              <p className="text-emerald-100/70 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
                Create a free account to search real listings, save the ones you like, and start a
                draft. Applying to government programs never costs money.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button type="button" onClick={onGetStarted} className="btn btn-primary btn-lg">
                  Get started now <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onDemo}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all"
                >
                  Try a demo first
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer className="relative border-t border-white/70 bg-white/60 backdrop-blur py-8">
          <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()} {BRAND.name}. Not a government website. Data from public
              federal sources.
            </p>
            <PoweredBy />
          </div>
        </footer>
      </div>
    </div>
  );
}
