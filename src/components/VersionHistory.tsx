import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Clock, RotateCcw, Eye, ChevronRight,
  FileEdit, Send, Inbox, CheckCircle2,
  History, ArrowDownToLine, Diff, User,
  FileDown, Printer, ShieldCheck, Sparkles, Wand2,
  Bookmark,
} from 'lucide-react';
import {
  ProposalVersion,
  AuditEntry,
  loadVersions,
  loadAuditTrail,
  getActionLabel,
  AuditAction,
  diffSummary,
} from '../lib/versionStore';

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  pipelineId: string;
  currentDraft: string;
  onRestore: (draft: string, versionId: string) => void;
}

const AUDIT_ICONS: Partial<Record<AuditAction, React.ReactNode>> = {
  draft_saved: <FileEdit className="w-3.5 h-3.5" />,
  draft_restored: <RotateCcw className="w-3.5 h-3.5" />,
  stage_changed: <ArrowDownToLine className="w-3.5 h-3.5" />,
  exported_word: <FileDown className="w-3.5 h-3.5" />,
  exported_pdf: <Printer className="w-3.5 h-3.5" />,
  preflight_run: <ShieldCheck className="w-3.5 h-3.5" />,
  grant_bookmarked: <Bookmark className="w-3.5 h-3.5" />,
  ai_generated: <Sparkles className="w-3.5 h-3.5" />,
  ai_transformed: <Wand2 className="w-3.5 h-3.5" />,
};

const AUDIT_COLORS: Partial<Record<AuditAction, string>> = {
  draft_saved: 'bg-blue-100 text-blue-700 border-blue-200',
  draft_restored: 'bg-amber-100 text-amber-700 border-amber-200',
  stage_changed: 'bg-purple-100 text-purple-700 border-purple-200',
  exported_word: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  exported_pdf: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  preflight_run: 'bg-teal-100 text-teal-700 border-teal-200',
  grant_bookmarked: 'bg-rose-100 text-rose-700 border-rose-200',
  ai_generated: 'bg-violet-100 text-violet-700 border-violet-200',
  ai_transformed: 'bg-violet-100 text-violet-700 border-violet-200',
};

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return ts;
  }
}

export default function VersionHistory({
  isOpen,
  onClose,
  pipelineId,
  currentDraft,
  onRestore,
}: VersionHistoryProps) {
  const [tab, setTab] = useState<'versions' | 'activity'>('versions');
  const [versions, setVersions] = useState<ProposalVersion[]>([]);
  const [activity, setActivity] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVersion, setPreviewVersion] = useState<ProposalVersion | null>(null);

  useEffect(() => {
    if (!isOpen || !pipelineId) return;
    setLoading(true);
    Promise.all([loadVersions(pipelineId), loadAuditTrail(pipelineId)])
      .then(([v, a]) => {
        setVersions(v);
        setActivity(a);
      })
      .finally(() => setLoading(false));
  }, [isOpen, pipelineId]);

  if (!isOpen) return null;

  const handleRestore = (v: ProposalVersion) => {
    if (!v.id) return;
    onRestore(v.draft, v.id);
    setPreviewVersion(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex justify-end bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-full max-w-lg glass-panel h-full flex flex-col"
        >
          {/* Header */}
          <div className="glass-panel-dark text-white p-5 flex items-center justify-between shrink-0 rounded-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Draft history</h3>
                <p className="text-xs text-slate-300">
                  {versions.length} saved version{versions.length !== 1 ? 's' : ''} · {activity.length} actions
                </p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close history" className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200/60 shrink-0">
            <button
              onClick={() => setTab('versions')}
              aria-selected={tab === 'versions'}
              className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                tab === 'versions'
                  ? 'text-emerald-700 border-b-2 border-emerald-500 bg-emerald-50/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Versions ({versions.length})
            </button>
            <button
              onClick={() => setTab('activity')}
              aria-selected={tab === 'activity'}
              className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                tab === 'activity'
                  ? 'text-emerald-700 border-b-2 border-emerald-500 bg-emerald-50/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Activity ({activity.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
              </div>
            ) : tab === 'versions' ? (
              <div className="divide-y divide-slate-100">
                {versions.length === 0 ? (
                  <div className="p-8 text-center">
                    <History className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-400">No versions saved yet</p>
                    <p className="text-xs text-slate-300 mt-1">Versions are created each time you save a draft.</p>
                  </div>
                ) : (
                  versions.map((v, i) => {
                    const isLatest = i === 0;
                    const wordDelta = i < versions.length - 1
                      ? diffSummary(versions[i + 1].draft, v.draft)
                      : `${v.wordCount} words (initial)`;
                    return (
                      <div
                        key={v.id || i}
                        className="px-5 py-4 hover:bg-slate-50/80 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                v.stage === 'review'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : v.stage === 'submitted'
                                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {v.stage}
                              </span>
                              {isLatest && (
                                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Latest
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-slate-800 mt-1">
                              {formatTimestamp(v.savedAt)}
                              <span className="text-slate-500 font-medium ml-2">by {v.savedByName}</span>
                            </p>
                            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {v.wordCount.toLocaleString()} words · {wordDelta}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => setPreviewVersion(v)}
                              className="btn btn-secondary btn-sm !text-xs"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            {!isLatest && (
                              <button
                                onClick={() => handleRestore(v)}
                                className="btn btn-primary btn-sm !text-xs"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Restore
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Activity / Audit Trail Tab */
              <div className="relative px-5 py-4">
                {activity.length === 0 ? (
                  <div className="p-8 text-center">
                    <Eye className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-400">No activity recorded yet</p>
                    <p className="text-xs text-slate-300 mt-1">Actions like saves, exports, and AI generation are logged here.</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200" />

                    {activity.map((entry, i) => {
                      const icon = AUDIT_ICONS[entry.action] || <Clock className="w-3.5 h-3.5" />;
                      const color = AUDIT_COLORS[entry.action] || 'bg-slate-100 text-slate-600 border-slate-200';
                      return (
                        <div key={entry.id || i} className="flex items-start gap-3 mb-4 relative">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 ${color}`}>
                            {icon}
                          </div>
                          <div className="min-w-0 flex-1 pt-1">
                            <p className="text-xs font-bold text-slate-800">
                              {getActionLabel(entry.action)}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {entry.actorName} · {formatTimestamp(entry.timestamp)}
                            </p>
                            {entry.details && (
                              <p className="text-[11px] text-slate-600 mt-1 font-medium bg-slate-50/80 rounded-lg px-2.5 py-1.5 border border-slate-100">
                                {entry.details}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Version Preview Modal */}
          {previewVersion && (
            <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur flex flex-col">
              <div className="p-4 border-b border-slate-200/60 flex items-center justify-between shrink-0">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Version from {formatTimestamp(previewVersion.savedAt)}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {previewVersion.wordCount} words · Stage: {previewVersion.stage}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestore(previewVersion)}
                    className="btn btn-primary btn-sm !text-xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restore this version
                  </button>
                  <button
                    onClick={() => setPreviewVersion(null)}
                    aria-label="Close preview"
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-xs text-slate-700 leading-relaxed font-medium">
                  {previewVersion.draft}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
