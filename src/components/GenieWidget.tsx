'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  PenTool,
  Compass,
  ListChecks,
  Send,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';
import GenieAvatar from './GenieAvatar';
import { BRAND } from '../lib/brand';

export type GenieChatMessage = {
  role: 'user' | 'genie';
  text: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Short one-liner when idle (no AI) */
  nudge: string;
  /** Conversation so far (empty = show nudge) */
  messages: GenieChatMessage[];
  loadingAnswer?: boolean;
  onAsk: (question: string) => void;
  onClearChat: () => void;
  onExplainPage: () => void;
  onNextStep: () => void;
  onHelpWrite: () => void;
  onReplayTour: () => void;
};

/**
 * Floating genie — a real conversation thread. Stays quiet (nudge only)
 * until the user asks something, then keeps context for follow-ups.
 */
export default function GenieWidget({
  open,
  onOpenChange,
  nudge,
  messages,
  loadingAnswer,
  onAsk,
  onClearChat,
  onExplainPage,
  onNextStep,
  onHelpWrite,
  onReplayTour,
}: Props) {
  const [question, setQuestion] = useState('');
  const [expanded, setExpanded] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const expandedThreadRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view
  useEffect(() => {
    for (const el of [threadRef.current, expandedThreadRef.current]) {
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, loadingAnswer, open, expanded]);

  const submit = () => {
    const q = question.trim();
    if (!q || loadingAnswer) return;
    onAsk(q);
    setQuestion('');
  };

  const hasThread = messages.length > 0;

  const renderThread = (large?: boolean) => (
    <div className="space-y-3">
      {!hasThread && (
        <div className="flex items-end gap-2">
          <GenieAvatar src={BRAND.assets.widget} size={large ? 32 : 26} />
          <p
            className={`${large ? 'text-base' : 'text-sm'} text-slate-600 leading-relaxed italic bg-emerald-50/70 px-3.5 py-2.5 rounded-2xl rounded-bl-md border border-emerald-100/60 max-w-[85%]`}
          >
            {nudge}
          </p>
        </div>
      )}
      {messages.map((m, i) =>
        m.role === 'user' ? (
          <div key={i} className="flex justify-end">
            <p
              className={`${large ? 'text-base' : 'text-sm'} bg-emerald-600 text-white px-3.5 py-2.5 rounded-2xl rounded-br-md max-w-[85%] leading-relaxed shadow-sm`}
            >
              {m.text}
            </p>
          </div>
        ) : (
          <div key={i} className="flex items-end gap-2">
            <GenieAvatar src={BRAND.assets.widget} size={large ? 32 : 26} />
            <div
              className={`${large ? 'text-base' : 'text-sm'} text-slate-800 leading-relaxed bg-slate-50 px-3.5 py-2.5 rounded-2xl rounded-bl-md border border-slate-100 max-w-[85%] whitespace-pre-wrap`}
            >
              {m.text}
            </div>
          </div>
        )
      )}
      {loadingAnswer && (
        <div className="flex items-end gap-2">
          <GenieAvatar src={BRAND.assets.widget} size={large ? 32 : 26} />
          <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
            <span className="inline-flex gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                  style={{ animationDelay: `${d * 0.15}s` }}
                />
              ))}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      data-tour="genie"
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-3 pointer-events-none"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              className="w-[min(28rem,calc(100vw-2rem))] rounded-3xl border border-emerald-100/80 bg-white/95 backdrop-blur shadow-2xl shadow-emerald-900/15 overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-amber-50/30 px-4 py-3">
                <GenieAvatar src={BRAND.assets.widget} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">Ask Genie</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                    Live Grant Assistant
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {hasThread && (
                    <button
                      type="button"
                      onClick={onClearChat}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 transition-colors"
                      title="Start a new chat"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-emerald-700 transition-colors"
                    title="Expand Genie Chat"
                  >
                    <Maximize2 className="h-4 w-4 text-emerald-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700"
                    aria-label="Close Genie"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div
                ref={threadRef}
                className="px-4 py-4 max-h-[50vh] min-h-[140px] overflow-y-auto custom-scrollbar"
              >
                {renderThread(false)}
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
                    placeholder={hasThread ? 'Ask a follow-up…' : 'Ask Genie anything…'}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={submit}
                    disabled={loadingAnswer || !question.trim()}
                    className="rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-500 disabled:opacity-40 shadow-sm"
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

      {/* Expanded Full Screen Consultation Modal */}
      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 sm:p-8 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-3xl p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <GenieAvatar src={BRAND.assets.widget} size={48} />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Genie AI Consultation</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Strategic guidance & grant writing intelligence
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {hasThread && (
                    <button
                      type="button"
                      onClick={onClearChat}
                      className="p-2 hover:bg-slate-100 rounded-xl text-slate-500"
                      title="Start a new chat"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setExpanded(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-500"
                  >
                    <Minimize2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div
                ref={expandedThreadRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/60 border border-slate-200 rounded-2xl mb-6"
              >
                {renderThread(true)}
              </div>

              <div className="flex gap-3">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder={hasThread ? 'Ask a follow-up…' : 'Ask Genie a detailed question...'}
                  className="flex-1 rounded-2xl border border-slate-300 px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans"
                />
                <button
                  onClick={submit}
                  disabled={loadingAnswer || !question.trim()}
                  className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider disabled:opacity-40 shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
