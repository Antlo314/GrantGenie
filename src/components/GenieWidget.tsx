'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PenTool, Compass, ListChecks, Send, X } from 'lucide-react';
import GenieAvatar from './GenieAvatar';
import { BRAND } from '../lib/brand';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Short one-liner when idle (no AI) */
  nudge: string;
  /** Detailed answer after user asks */
  answer: string | null;
  loadingAnswer?: boolean;
  onAsk: (question: string) => void;
  onExplainPage: () => void;
  onNextStep: () => void;
  onHelpWrite: () => void;
  onReplayTour: () => void;
};

/**
 * Floating genie — light nudge only until the user asks something.
 */
export default function GenieWidget({
  open,
  onOpenChange,
  nudge,
  answer,
  loadingAnswer,
  onAsk,
  onExplainPage,
  onNextStep,
  onHelpWrite,
  onReplayTour,
}: Props) {
  const [question, setQuestion] = useState('');

  const submit = () => {
    const q = question.trim();
    if (!q || loadingAnswer) return;
    onAsk(q);
    setQuestion('');
  };

  return (
    <div
      data-tour="genie"
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-3 pointer-events-none"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-emerald-100/80 bg-white/95 backdrop-blur shadow-2xl shadow-emerald-900/15 overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-amber-50/30 px-4 py-3">
                <GenieAvatar src={BRAND.assets.widget} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">Ask Genie</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                    Light tips · details when you ask
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700"
                  aria-label="Close Genie"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 py-3 max-h-36 overflow-y-auto custom-scrollbar">
                {loadingAnswer ? (
                  <p className="text-sm text-slate-400 italic">Thinking…</p>
                ) : answer ? (
                  <p className="text-sm text-slate-700 leading-relaxed">{answer}</p>
                ) : (
                  <p className="text-sm text-slate-500 leading-relaxed">{nudge}</p>
                )}
              </div>

              <div className="px-4 pb-2">
                <div className="flex gap-2">
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        submit();
                      }
                    }}
                    placeholder="Ask a question…"
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={submit}
                    disabled={loadingAnswer || !question.trim()}
                    className="rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-500 disabled:opacity-40"
                    aria-label="Send question"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 px-4 pb-4 pt-1">
                <ActionBtn icon={<Compass className="h-4 w-4" />} onClick={onExplainPage}>
                  Explain this page
                </ActionBtn>
                <ActionBtn icon={<ListChecks className="h-4 w-4" />} onClick={onNextStep}>
                  What should I do next?
                </ActionBtn>
                <ActionBtn icon={<PenTool className="h-4 w-4" />} onClick={onHelpWrite}>
                  Help me write
                </ActionBtn>
                <button
                  type="button"
                  onClick={onReplayTour}
                  className="w-full text-center text-xs font-semibold text-emerald-700 hover:text-emerald-900 py-2"
                >
                  Show the tour again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-label={open ? 'Close Genie' : 'Open Genie helper'}
          className="relative rounded-full p-0 bg-transparent border-0 shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {/* soft glow only — no white plate */}
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/25 blur-xl" />
          <GenieAvatar src={BRAND.assets.widget} size={72} float={!open} />
        </button>
      </div>
    </div>
  );
}

function ActionBtn({
  icon,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left text-xs font-bold text-slate-800 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
    >
      <span className="text-emerald-600">{icon}</span>
      {children}
    </button>
  );
}
