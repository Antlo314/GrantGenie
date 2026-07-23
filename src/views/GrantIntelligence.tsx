import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Target, 
  ShieldAlert, 
  TrendingUp, 
  BrainCircuit, 
  Calendar, 
  DollarSign,
  Share2,
  FileText,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Grant } from '../types';

interface IntelligenceReportProps {
  grant: Grant;
  onBack: () => void;
  onStartDraft: (grant: Grant) => void;
}

export default function GrantIntelligence({ grant, onBack, onStartDraft }: IntelligenceReportProps) {
  return (
    <div className="h-full flex flex-col pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 glass-panel border border-slate-200/60 rounded-xl hover:border-slate-300 transition-all shadow-sm group"
          >
            <ChevronLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                ✓ Analysis Complete
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{grant.funder}</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-slate-900 leading-tight">
              {grant.title}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3 w-full md:w-auto">
          <button className="p-2.5 glass-panel border border-slate-200/60 rounded-xl hover:border-slate-300 transition-all shadow-sm shrink-0">
            <Share2 className="w-5 h-5 text-slate-500" />
          </button>
          <button
            onClick={() => onStartDraft(grant)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 shrink-0" /> <span className="truncate">Start Drafting with Genie</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">

        {/* Left column */}
        <div className="lg:col-span-8 flex flex-col gap-5 overflow-y-auto pr-1 custom-scrollbar">

          {/* Executive Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel border border-slate-200/50 rounded-3xl p-6 md:p-9 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-500" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-900">Executive Intelligence Summary</h3>
            </div>
            <p className="text-base text-slate-600 leading-relaxed italic mb-8 border-l-4 border-emerald-400/30 pl-5 font-serif">
              "{grant.description}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-50/80 border border-slate-100 p-6 rounded-2xl">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Target className="w-3 h-3" /> Core Intent Signal
                </h4>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  The funder seeks to establish sustainable, locally-owned infrastructure. The priority is on long-term systemic change rather than short-term relief.
                </p>
              </div>
              <div className="bg-slate-50/80 border border-slate-100 p-6 rounded-2xl">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-3 h-3" /> Technical Prerequisites
                </h4>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Requires verifiable digital audit trails and compliance with FIPS 140-2 standards. Your Data Vault satisfies these requirements at a 94.2% confidence level.
                </p>
              </div>
            </div>
          </motion.div>

          {/* SWOT Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <IntelligenceMetric
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              title="Strategic Strengths"
              color="emerald"
              items={[
                "Mission-alignment score exceeds 90%",
                "Existing digital infrastructure matches '2026 Tech' mandates",
                "Verified EIN/501(c)(3) status reduces friction",
              ]}
            />
            <IntelligenceMetric
              icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
              title="Strategic Risks"
              color="amber"
              items={[
                "High competition from established NGOs",
                "Strict reporting requirements on quarterly impact",
                "Sustainability model needs more budget narrative detail",
              ]}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Score Card – dark glass */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-3xl p-8"
            style={{
              background: 'linear-gradient(145deg, #0f172a 0%, #064e3b 80%, #065f46 100%)',
            }}
          >
            {/* Ambient glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-25 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.8) 0%, transparent 70%)' }} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/40">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
                  Genie Analysis
                </span>
              </div>

              <div className="mb-7">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  Confidence Level
                </div>
                <div className="text-7xl font-black tracking-tighter text-white leading-none mb-3">
                  {grant.matchScore}%
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${grant.matchScore}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #34d399, #10b981)' }}
                  />
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4 py-1 mb-7">
                "{grant.matchExplanation || "This opportunity is a high-priority tactical match for your organization's core vectors."}"
              </p>

              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    ${grant.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Closes {new Date(grant.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metadata Tags */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel border border-slate-200/50 rounded-2xl p-6 shadow-sm"
          >
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Metadata Labels</h4>
            <div className="flex flex-wrap gap-2">
              {grant.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-tight">
                  #{tag}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-600 uppercase tracking-tight">
                #TopCandidate
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function IntelligenceMetric({ icon, title, color, items }: any) {
  const accentClass = color === 'emerald' ? 'text-emerald-500 bg-emerald-50/80 border-emerald-100' : 'text-amber-500 bg-amber-50/80 border-amber-100';
  const dotClass = color === 'emerald' ? 'bg-emerald-400' : 'bg-amber-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel border rounded-2xl p-6 shadow-sm ${accentClass}`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-2xl bg-white/60 flex items-center justify-center border border-white/80">
          {icon}
        </div>
        <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">{title}</h4>
      </div>
      <div className="space-y-3.5">
        {items.map((item: string, idx: number) => (
          <div key={idx} className="flex gap-3 group">
            <div className={`w-1.5 h-1.5 rounded-full ${dotClass} mt-1.5 shrink-0`} />
            <p className="text-sm text-slate-700 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
              {item}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
