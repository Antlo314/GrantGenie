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

      {/* Grant vs contract */}
      <section className="border-y border-emerald-100 bg-white/70 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-2">
            Two simple paths
          </h2>
          <p className="text-center text-slate-500 text-sm mb-8 max-w-lg mx-auto">
            Most people mix these up. We keep them separate so nothing is confusing.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
              <HandCoins className="h-8 w-8 text-emerald-700 mb-3" />
              <h3 className="text-lg font-black text-slate-900 mb-2">{GLOSSARY.grant.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{GLOSSARY.grant.body}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6">
              <FileSignature className="h-8 w-8 text-amber-800 mb-3" />
              <h3 className="text-lg font-black text-slate-900 mb-2">{GLOSSARY.contract.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{GLOSSARY.contract.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-10">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="h-6 w-6" />,
                n: '1',
                t: 'Tell us what you do',
                d: 'Pick industry chips (health, construction, IT…). Change them anytime.',
              },
              {
                icon: <Search className="h-6 w-6" />,
                n: '2',
                t: 'Search real listings',
                d: 'We pull free official data. Open the .gov page before you apply.',
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                n: '3',
                t: 'Save & draft',
                d: 'Track applications and get writing help. You submit on the official site.',
              },
            ].map((s) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  {s.icon}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                  Step {s.n}
                </p>
                <h3 className="font-black text-slate-900 mb-1.5">{s.t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-emerald-100 bg-emerald-900 text-white py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <GenieAvatar src={BRAND.assets.widget} size={72} float className="mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready when you are</h2>
          <p className="text-emerald-100 text-sm sm:text-base mb-6 leading-relaxed">
            Create a free account to save your profile and progress. Or try the demo with no signup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-black text-emerald-900 hover:bg-emerald-50"
            >
              Go to login
            </button>
            <button
              type="button"
              onClick={onDemo}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/40 px-8 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Try demo
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
