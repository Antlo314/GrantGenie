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
  Sparkles
} from 'lucide-react';
import { Grant } from '../types';

interface IntelligenceReportProps {
  grant: Grant;
  onBack: () => void;
}

export default function GrantIntelligence({ grant, onBack }: IntelligenceReportProps) {
  return (
    <div className="h-full flex flex-col pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Analysis Complete</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{grant.funder}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-slate-900">{grant.title}</h1>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
             <Share2 className="w-5 h-5 text-slate-500" />
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
             <Zap className="w-4 h-4" /> Start Drafting with Oracle
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-8 overflow-y-auto pr-2 custom-scrollbar">
           {/* Deep Intent */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm"
           >
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                 </div>
                 <h3 className="text-xl font-bold tracking-tight">Executive Intelligence Summary</h3>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed font-serif italic mb-10 border-l-4 border-emerald-500/20 pl-8">
                "{grant.description}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Target className="w-3 h-3" /> Core Intent Signal
                    </h4>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                       The funder seeks to establish sustainable, locally-owned infrastructure. The priority is on long-term systemic change rather than short-term relief efforts.
                    </p>
                 </section>
                 <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <BrainCircuit className="w-3 h-3" /> Technical Prerequisites
                    </h4>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                       Requires verifiable digital audit trails and compliance with FIPS 140-2 standards. Your "Data Vault" satisfies these requirements at a 94.2% confidence level.
                    </p>
                 </section>
              </div>
           </motion.div>

           {/* SWOT Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <IntelligenceMetric 
                icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
                title="Strategic Strengths"
                color="emerald"
                items={[
                  "Mission-alignment score exceeds 90%",
                  "Existing digital infrastructure matches '2026 Tech' mandates",
                  "Verified EIN/501(c)(3) status reduces friction"
                ]}
              />
              <IntelligenceMetric 
                icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
                title="Strategic Risks"
                color="amber"
                items={[
                  "High competition from established NGOs",
                  "Strict reporting requirements on quarterly impact",
                  "Sustainability model needs more budget narrative detail"
                ]}
              />
           </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
           {/* Scoring Card */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl"
           >
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Sparkles className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                       <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Genie Analysis</div>
                 </div>
                 
                 <div className="mb-10">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Confidence Level</div>
                    <div className="text-7xl font-bold tracking-tighter text-white mb-2">{grant.matchScore}%</div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${grant.matchScore}%` }}
                        className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                       />
                    </div>
                 </div>

                 <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-emerald-500/20 pl-6 py-1 mb-10">
                   "{grant.matchExplanation || "This opportunity is a high-priority tactical match for your organization's core vectors."}"
                 </p>

                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <DollarSign className="w-4 h-4 text-emerald-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Valuation: ${grant.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <Calendar className="w-4 h-4 text-amber-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Submission Window: {new Date(grant.deadline).toLocaleDateString()}</span>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Tags */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
           >
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Metadata Labels</h4>
              <div className="flex flex-wrap gap-2">
                 {grant.tags.map(tag => (
                   <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-tight">
                     #{tag}
                   </span>
                 ))}
                 <span className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-600 uppercase tracking-tight">
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
  const accentColor = color === 'emerald' ? 'text-emerald-500' : 'text-amber-500';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm"
    >
       <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
             {icon}
          </div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">{title}</h4>
       </div>
       <div className="space-y-4">
          {items.map((item: string, idx: number) => (
             <div key={idx} className="flex gap-4 group">
                <div className={`${accentColor} font-mono text-xs font-bold mt-0.5`}>+</div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">{item}</p>
             </div>
          ))}
       </div>
    </motion.div>
  );
}
