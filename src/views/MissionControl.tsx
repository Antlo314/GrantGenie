import React from 'react';
import { motion } from 'motion/react';
import { Search, FileSignature, PenTool, HandCoins, BookOpen, Sparkles, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import PageHeader from '../components/PageHeader';
import GenieAvatar from '../components/GenieAvatar';
import SpecsBar from '../components/SpecsBar';
import { BRAND } from '../lib/brand';
import { GLOSSARY, PAGE_HINTS } from '../lib/hints';

export default function MissionControl({
  onNavigate,
  onStartDraft: _onStartDraft,
  onStartTour,
}: {
  onNavigate: (v: any) => void;
  onStartDraft: (g: any) => void;
  onStartTour?: () => void;
}) {
  const { organization, profile } = useAuth();
  const name = profile?.name || organization?.name || 'there';
  const h = PAGE_HINTS.mission;

  return (
    <div className="space-y-6 pb-16 max-w-5xl">
      <PageHeader
        title={h.title}
        subtitle={h.subtitle}
        hint={h.hint}
        infoTitle="What is Home?"
        infoBody="This is your dashboard. Come here to see what to do next. Use the Genie (bottom right) if you get stuck."
      />

      {/* Hero Welcome – Bento full-width */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl card-3d"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 60%, #065f46 100%)',
        }}
      >
        {/* Ambient glow orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.8) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.9) 0%, transparent 70%)' }} />

        <div className="relative p-7 md:p-10 flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0 gg-float">
            <GenieAvatar src={BRAND.assets.widget} size={96} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400 mb-3">
              <Sparkles className="h-3 w-3" /> Welcome back
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 leading-tight">
              Hi {name.split(' ')[0]} — let's find your next win
            </h2>
            <p className="text-sm text-emerald-100/70 leading-relaxed max-w-xl mb-5">
              Pick your industry, search real government listings, and let the Genie guide your application — start to finish.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('radar')}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-900 shadow-lg shadow-emerald-900/30 hover:bg-emerald-300 transition-all hover:scale-105 active:scale-95"
              >
                <Search className="h-4 w-4" /> Search my industry
              </button>
              {onStartTour && (
                <button
                  type="button"
                  onClick={onStartTour}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-5 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all"
                >
                  <BookOpen className="h-4 w-4" /> Beginner tour
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <SpecsBar
        onSpecsChange={() => {
          /* chips saved; user can open Find */
        }}
      />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Grants Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => onNavigate('radar')}
          className="group cursor-pointer glass-emerald rounded-2xl p-6 border border-emerald-200/50 hover:border-emerald-400/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-700">
              <HandCoins className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1 duration-200" />
          </div>
          <h3 className="font-black text-slate-900 mb-1.5 text-lg tracking-tight">{GLOSSARY.grant.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{GLOSSARY.grant.body}</p>
          <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">
            Search grants →
          </span>
        </motion.div>

        {/* Contracts Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => onNavigate('radar')}
          className="group cursor-pointer glass-gold rounded-2xl p-6 border border-amber-200/50 hover:border-amber-400/50 transition-all hover:shadow-xl hover:shadow-amber-500/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-700">
              <FileSignature className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1 duration-200" />
          </div>
          <h3 className="font-black text-slate-900 mb-1.5 text-lg tracking-tight">{GLOSSARY.contract.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{GLOSSARY.contract.body}</p>
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest">
            Search contracts →
          </span>
        </motion.div>

        {/* Stats / Quick metric card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden sm:col-span-2 lg:col-span-1"
        >
          <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-5 pointer-events-none">
            <TrendingUp className="w-full h-full text-emerald-900" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-5">Your activity</span>
          <div className="space-y-4">
            {[
              { label: 'Radar scans', value: '—', color: 'emerald' },
              { label: 'Pipeline items', value: '—', color: 'slate' },
              { label: 'Drafts started', value: '—', color: 'amber' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">{item.label}</span>
                <span className={`text-sm font-black ${item.color === 'emerald' ? 'text-emerald-600' : item.color === 'amber' ? 'text-amber-600' : 'text-slate-700'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Simple Path Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] mb-3">
          Your simple path
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <StepCard n="1" title="Find" desc="Search real .gov listings" onClick={() => onNavigate('radar')} />
          <StepCard n="2" title="Save" desc="Track them in My applications" onClick={() => onNavigate('pipeline')} />
          <StepCard n="3" title="Write" desc="Use Draft helper, then submit on the official site" onClick={() => onNavigate('writer')} icon={<PenTool className="h-4 w-4" />} />
        </div>
      </motion.div>
    </div>
  );
}

function StepCard({
  n,
  title,
  desc,
  onClick,
  icon,
}: {
  n: string;
  title: string;
  desc: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="text-left rounded-2xl border border-slate-200/70 glass-panel p-5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-xs font-black text-white mb-3 shadow-md shadow-emerald-500/30">
        {icon || n}
      </span>
      <p className="font-black text-slate-900 tracking-tight text-base">{title}</p>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      <div className="flex items-center gap-1 mt-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
        Go <Zap className="h-3 w-3" />
      </div>
    </motion.button>
  );
}
