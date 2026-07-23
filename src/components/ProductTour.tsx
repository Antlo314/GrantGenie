'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import GenieAvatar from './GenieAvatar';
import { BRAND } from '../lib/brand';
import { TOUR_STEPS, TOUR_STORAGE_KEY } from '../lib/hints';

export function hasCompletedTour(): boolean {
  try {
    return localStorage.getItem(TOUR_STORAGE_KEY) === 'done';
  } catch {
    return false;
  }
}

export function markTourDone(): void {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, 'done');
  } catch {
    /* ignore */
  }
}

export function resetTour(): void {
  try {
    localStorage.removeItem(TOUR_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProductTour({ open, onClose }: Props) {
  const [i, setI] = useState(0);
  const step = TOUR_STEPS[i];
  const last = i >= TOUR_STEPS.length - 1;

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  const finish = () => {
    markTourDone();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-emerald-100 overflow-hidden"
          >
            <div className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 px-6 pt-6 pb-4">
              <button
                type="button"
                onClick={finish}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700"
                aria-label="Skip tour"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex justify-center mb-3">
                <GenieAvatar
                  src={i === 0 ? BRAND.assets.wave : BRAND.assets.widget}
                  size={88}
                  float
                />
              </div>
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Beginner tour · {i + 1} of {TOUR_STEPS.length}
              </p>
              <div className="mt-2 flex justify-center gap-1.5">
                {TOUR_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 w-6 rounded-full transition-colors ${
                      idx <= i ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="px-6 py-5">
              <h2 id="tour-title" className="text-xl font-bold text-slate-900 text-center mb-2">
                {step.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed text-center">{step.body}</p>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
              <button
                type="button"
                onClick={() => setI((v) => Math.max(0, v - 1))}
                disabled={i === 0}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={finish}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2"
              >
                Skip tour
              </button>
              <button
                type="button"
                onClick={() => {
                  if (last) finish();
                  else setI((v) => v + 1);
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
              >
                {last ? 'Got it — let’s go' : 'Next'}
                {!last && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
