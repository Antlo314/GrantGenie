import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  ChevronRight,
  TrendingUp,
  Inbox,
  FileEdit,
  Send,
  FileDown,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import PageHeader from '../components/PageHeader';
import { StatTile, EmptyState } from '../components/ui';
import { PAGE_HINTS } from '../lib/hints';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { exportToWord } from '../lib/exportUtils';

type StageTone = 'emerald' | 'slate' | 'gold' | 'dark';

const STAGE_CONFIG: Record<
  string,
  { label: string; hint: string; tone: StageTone; pill: string; bar: string }
> = {
  discovery: {
    label: 'Discovery',
    hint: 'Saved from search',
    tone: 'emerald',
    pill: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    bar: 'bg-emerald-500',
  },
  drafting: {
    label: 'Drafting',
    hint: 'Being written',
    tone: 'slate',
    pill: 'bg-slate-100 border-slate-200 text-slate-600',
    bar: 'bg-slate-400',
  },
  review: {
    label: 'In Review',
    hint: 'Almost ready to submit',
    tone: 'gold',
    pill: 'bg-amber-50 border-amber-200 text-amber-700',
    bar: 'bg-amber-500',
  },
  submitted: {
    label: 'Submitted',
    hint: 'Sent on the official site',
    tone: 'dark',
    pill: 'bg-teal-50 border-teal-200 text-teal-700',
    bar: 'bg-teal-500',
  },
};

const STAGE_ICONS: Record<string, React.ReactNode> = {
  discovery: <Inbox />,
  drafting: <FileEdit />,
  review: <Clock />,
  submitted: <Send />,
};

const COLUMN_LABEL = 'text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500';

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

  const h = PAGE_HINTS.pipeline;

  return (
    <div className="space-y-6 h-full flex flex-col pb-12">
      <PageHeader
        title="My applications"
        subtitle="Saved listings and drafts, in one place."
        hint={h.hint}
        infoTitle="How this page works"
        infoBody="Save listings from Find opportunities and they show up here. Open one to keep drafting — when it’s ready, you submit on the official government website."
      />

      {/* ── Stage stat tiles ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, idx) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className="h-full"
          >
            <StatTile
              value={stage.count}
              label={stage.label}
              hint={stage.hint}
              tone={stage.tone}
              icon={STAGE_ICONS[stage.id]}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>

      {/* ── Saved listings table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1 bento-tile overflow-hidden flex flex-col min-h-0"
      >
        {/* Toolbar — real numbers only */}
        <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-white/40 flex-wrap gap-3">
          <span className="text-xs font-bold text-slate-500">
            <span className="font-mono text-slate-900">{pipeline.length}</span> saved ·{' '}
            <span className="font-mono text-slate-900">{withDrafts}</span> with drafts
          </span>
          {totalValue > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="font-mono">${totalValue.toLocaleString()}</span> combined value
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          {/* Desktop column headers */}
          <div className="hidden lg:flex items-center px-7 py-3.5 bg-white/75 border-b border-slate-200/60 sticky top-0 z-10 backdrop-blur-md">
            <div className={`flex-[2] ${COLUMN_LABEL}`}>Listing / funder</div>
            <div className={`flex-1 ${COLUMN_LABEL}`}>Stage</div>
            <div className={`flex-1 ${COLUMN_LABEL}`}>Match</div>
            <div className={`flex-1 ${COLUMN_LABEL}`}>Value</div>
            <div className={`w-24 text-right ${COLUMN_LABEL}`}>Actions</div>
          </div>

          <div className="flex flex-col divide-y divide-slate-100/80">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
                <p className="text-sm text-slate-500 font-semibold">Loading your saved listings…</p>
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
              <EmptyState
                image="/genie-wave.png"
                title="Nothing saved yet"
                body="Search for grants or contracts, then tap the bookmark on any listing — it will show up here so you never lose it."
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PipelineRow({
  grant,
  funder,
  stage,
  match,
  value,
  draft,
  onAction,
}: {
  key?: React.Key;
  grant: string;
  funder: string;
  stage: string;
  match: string;
  value: string;
  draft?: string;
  onAction: () => void;
}) {
  const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG['discovery'];

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
      <div className="flex-[2] pr-24 lg:pr-4 min-w-0">
        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight text-sm md:text-base leading-tight">
          {grant}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1 truncate">{funder}</div>
      </div>

      <div className="flex-1 flex items-center">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider ${cfg.pill}`}
        >
          {cfg.label}
        </span>
      </div>

      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-slate-200/70 rounded-full max-w-[72px] overflow-hidden hidden sm:block">
          <motion.div initial={{ width: 0 }} animate={{ width: match }} className={`h-full rounded-full ${cfg.bar}`} />
        </div>
        <span className="font-mono text-xs font-bold text-emerald-700">{match}</span>
      </div>

      <div className="flex-1">
        <span className="font-mono text-sm font-bold text-slate-900 tracking-tight">{value}</span>
      </div>

      <div className="flex items-center gap-2 justify-end absolute lg:relative top-5 right-5 lg:top-0 lg:right-0 lg:w-24 shrink-0">
        {draft && (
          <button
            type="button"
            onClick={handleQuickExportWord}
            aria-label={`Download ${grant} as a Word document`}
            title="Download Word document"
            className="btn btn-secondary btn-sm !px-2.5"
          >
            <FileDown className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onAction}
          aria-label={`Open ${grant} in the Draft helper`}
          title="Open in Draft helper"
          className="btn btn-secondary btn-sm !px-2.5 group-hover:border-emerald-400"
        >
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </motion.div>
  );
}
