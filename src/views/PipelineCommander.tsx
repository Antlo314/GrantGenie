import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  ChevronRight,
  TrendingUp,
  Inbox,
  FileEdit,
  Send,
  Sparkles,
  BarChart3,
  FileDown,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { exportToWord, exportToPDF } from '../lib/exportUtils';

const STAGE_CONFIG: Record<string, { label: string; color: string; gradient: string; glow: string }> = {
  discovery: {
    label: 'Discovery',
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-400/5',
    glow: 'shadow-emerald-500/10',
  },
  drafting: {
    label: 'Drafting',
    color: 'slate',
    gradient: 'from-slate-500/15 to-slate-400/5',
    glow: 'shadow-slate-400/10',
  },
  review: {
    label: 'In Review',
    color: 'amber',
    gradient: 'from-amber-500/20 to-amber-400/5',
    glow: 'shadow-amber-500/10',
  },
  submitted: {
    label: 'Submitted',
    color: 'teal',
    gradient: 'from-teal-500/20 to-teal-400/5',
    glow: 'shadow-teal-500/10',
  },
};

const colorMap: Record<string, string> = {
  emerald: 'text-emerald-600',
  slate: 'text-slate-500',
  amber: 'text-amber-500',
  teal: 'text-teal-600',
};

const barColorMap: Record<string, string> = {
  emerald: 'bg-emerald-500',
  slate: 'bg-slate-400',
  amber: 'bg-amber-500',
  teal: 'bg-teal-500',
};

export default function PipelineCommander({ onStartDraft }: { onStartDraft?: (g: any) => void }) {
  const { organization } = useAuth();
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization) {
      setLoading(false);
      return;
    }
    const fetchPipeline = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'pipeline_grants'), where('orgId', '==', organization.id));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPipeline(data);
      } catch (e) {
        console.error("Error fetching pipeline:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPipeline();
  }, [organization]);

  const stages = Object.entries(STAGE_CONFIG).map(([id, cfg]) => ({
    id,
    ...cfg,
    count: pipeline.filter(p => p.stage === id).length || 0,
  }));

  const totalValue = pipeline.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const withDrafts = pipeline.filter((p) => p.draft).length;

  return (
    <div className="space-y-6 h-full flex flex-col pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3" /> Saved listings & drafts
          </span>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">My applications</h1>
          <p className="text-sm text-slate-500 mt-1">
            Everything you saved from search, plus draft progress. You always submit on the
            official government site.
          </p>
        </div>
      </motion.div>

      {/* Stage Stat Cards – Bento row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, idx) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stage.gradient} border border-white/60 glass-panel hover:shadow-xl ${stage.glow} transition-all cursor-default`}
          >
            <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${colorMap[stage.color]}`}>
              {stage.label}
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{stage.count}</div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stage.count / 10) * 100, 100)}%` }}
                transition={{ delay: idx * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${barColorMap[stage.color]}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-1 glass-panel border border-slate-200/60 rounded-3xl overflow-hidden flex flex-col shadow-sm min-h-0"
      >
        {/* Table toolbar — real numbers only */}
        <div className="px-6 py-4 border-b border-slate-100/80 flex items-center justify-between bg-slate-50/50 flex-wrap gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            {pipeline.length} saved · {withDrafts} with drafts
          </span>
          {totalValue > 0 && (
            <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-black font-mono uppercase tracking-[0.2em]">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> ${totalValue.toLocaleString()} combined value
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          {/* Desktop column headers */}
          <div className="hidden lg:flex items-center px-7 py-4 bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10 backdrop-blur-sm">
            <div className="flex-[2] text-[10px] font-black text-slate-400 uppercase tracking-widest">Grant / Funder</div>
            <div className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</div>
            <div className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alignment</div>
            <div className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</div>
            <div className="w-20 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</div>
          </div>

          <div className="flex flex-col divide-y divide-slate-50">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
                <p className="text-sm text-slate-400 font-semibold">Loading your saved listings…</p>
              </div>
            ) : pipeline.length > 0 ? (
              pipeline.map(grant => (
                <PipelineRow
                  key={grant.id}
                  grant={grant.title}
                  funder={grant.funder}
                  stage={grant.stage}
                  match={`${Number(grant.matchScore) || 0}%`}
                  value={
                    Number(grant.amount) > 0
                      ? `$${Number(grant.amount).toLocaleString()}`
                      : 'See listing'
                  }
                  draft={grant.draft}
                  icon={
                    grant.stage === 'drafting' ? <FileEdit className="w-4 h-4 text-slate-700" /> :
                    grant.stage === 'review' ? <Clock className="w-4 h-4 text-amber-500" /> :
                    grant.stage === 'submitted' ? <Send className="w-4 h-4 text-teal-600" /> :
                    <Inbox className="w-4 h-4 text-emerald-600" />
                  }
                  onAction={() => onStartDraft && onStartDraft({
                    id: grant.grantId,
                    pipelineId: grant.id,
                    title: grant.title,
                    funder: grant.funder,
                    amount: grant.amount,
                    matchScore: grant.matchScore,
                    draft: grant.draft || '',
                    deadline: new Date().toISOString()
                  })}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                  <BarChart3 className="w-7 h-7 text-emerald-400" />
                </div>
                <p className="font-black text-slate-700 mb-1">Nothing saved yet</p>
                <p className="text-sm text-slate-400 max-w-xs">
                  Search for grants or contracts, then tap the bookmark on any listing — it will
                  show up here so you never lose it.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PipelineRow({ grant, funder, stage, match, value, icon, draft, onAction }: any) {
  const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG['discovery'];
  const tagColor = colorMap[cfg.color] || 'text-slate-500';

  const handleQuickExportWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    exportToWord({
      title: grant,
      funder,
      draft: draft || '',
    });
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(241,245,249,0.6)' }}
      className="group flex flex-col lg:flex-row lg:items-center px-6 lg:px-7 py-5 gap-3 lg:gap-0 relative transition-colors cursor-pointer"
      onClick={onAction}
    >
      <div className="flex-[2] pr-12 lg:pr-4">
        <div className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight text-sm md:text-base leading-tight">{grant}</div>
        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{funder}</div>
      </div>

      <div className="flex-1 flex items-center gap-2.5">
        <div className="p-2 bg-slate-100/80 rounded-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100 hidden lg:flex">
          {icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${tagColor}`}>{cfg.label}</span>
      </div>

      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[72px] overflow-hidden hidden sm:block">
          <motion.div initial={{ width: 0 }} animate={{ width: match }} className="h-full bg-emerald-500" />
        </div>
        <span className="text-xs font-black text-emerald-600 tracking-tight">{match}</span>
      </div>

      <div className="flex-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span className="text-slate-900 font-black text-sm tracking-tight">{value}</span>
      </div>

      <div className="flex items-center gap-2 justify-end absolute lg:relative top-5 right-5 lg:top-0 lg:right-0">
        {draft && (
          <button
            type="button"
            onClick={handleQuickExportWord}
            className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl border border-slate-100 bg-white transition-all shadow-sm"
            title="Download Word Document"
          >
            <FileDown className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onAction}
          className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-100 group-hover:border-transparent bg-white lg:bg-transparent shadow-sm hover:shadow-lg"
          title="Open in Writer"
        >
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </motion.div>
  );
}
