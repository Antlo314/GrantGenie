'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PenTool, Compass, ListChecks, Sparkles, X } from 'lucide-react';
import GenieAvatar from './GenieAvatar';
import { BRAND } from '../lib/brand';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advice: string | null;
  loadingAdvice?: boolean;
  onExplainPage: () => void;
  onNextStep: () => void;
  onHelpWrite: () => void;
  onReplayTour: () => void;
};

export default function GenieWidget({
  open,
  onOpenChange,
  advice,
  loadingAdvice,
  onExplainPage,
  onNextStep,
  onHelpWrite,
  onReplayTour,
}: Props) {
  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-900/15 overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-amber-50/40 px-4 py-3">
              <GenieAvatar src={BRAND.assets.thinking} size={44} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">Ask Genie</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                  Plain English · real listings only
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

            <div className="px-4 py-3 max-h-40 overflow-y-auto custom-scrollbar">
              {loadingAdvice || !advice ? (
                <p className="text-sm text-slate-400 italic flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                  Thinking in plain English…
                </p>
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed">{advice}</p>
              )}
            </div>

            <div className="space-y-2 px-4 pb-4">
              <ActionBtn icon={<Compass className="h-4 w-4" />} onClick={onExplainPage}>
                Explain this page
              </ActionBtn>
              <ActionBtn icon={<ListChecks className="h-4 w-4" />} onClick={onNextStep}>
                What should I do next?
              </ActionBtn>
              <ActionBtn icon={<PenTool className="h-4 w-4" />} onClick={onHelpWrite}>
                Help me write a draft
              </ActionBtn>
              <button
                type="button"
                onClick={onReplayTour}
                className="w-full text-center text-xs font-semibold text-emerald-700 hover:text-emerald-900 py-2"
              >
                Show me the beginner tour again
              </button>
              <p className="text-[10px] text-slate-400 leading-relaxed text-center px-1">
                I only use real government listings — I never invent grants or contracts.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label={open ? 'Close Genie' : 'Open Genie helper'}
        className="group relative rounded-full bg-white p-1.5 shadow-xl shadow-emerald-900/20 border-2 border-emerald-200 hover:border-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-400/20 blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
        <GenieAvatar src={BRAND.assets.widget} size={64} float={!open} />
      </button>
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
      className="flex w-full items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left text-xs font-bold text-slate-800 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
    >
      <span className="text-emerald-600">{icon}</span>
      {children}
    </button>
  );
}
