'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import GenieAvatar from './GenieAvatar';
import { BRAND } from '../lib/brand';
import { TOUR_STEPS, TOUR_STORAGE_KEY, type TourStepDef } from '../lib/hints';

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

type Rect = { top: number; left: number; width: number; height: number };

type Props = {
  open: boolean;
  onClose: () => void;
  /** Navigate so targets exist (e.g. open Find before results step) */
  onStepChange?: (step: TourStepDef) => void;
};

export default function ProductTour({ open, onClose, onStepChange }: Props) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const step = TOUR_STEPS[i];
  const last = i >= TOUR_STEPS.length - 1;

  const measure = () => {
    if (!step?.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.target) as HTMLElement | null;
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    const r = el.getBoundingClientRect();
    const pad = 8;
    setRect({
      top: r.top - pad,
      left: r.left - pad,
      width: r.width + pad * 2,
      height: r.height + pad * 2,
    });
  };

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  useEffect(() => {
    if (!open || !step) return;
    onStepChange?.(step);
    const t = window.setTimeout(measure, 120);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i, step?.id, step?.target]);

  useLayoutEffect(() => {
    if (!open) return;
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i]);

  const finish = () => {
    markTourDone();
    onClose();
  };

  const cardStyle = (): React.CSSProperties => {
    if (!rect) {
      return {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }
    const gap = 14;
    const place = step.placement || 'bottom';
    const style: React.CSSProperties = { position: 'fixed', zIndex: 102, width: 'min(22rem, calc(100vw - 2rem))' };
    if (place === 'bottom') {
      style.top = Math.min(rect.top + rect.height + gap, window.innerHeight - 220);
      style.left = Math.min(Math.max(16, rect.left), window.innerWidth - 320);
    } else if (place === 'top') {
      style.top = Math.max(16, rect.top - gap - 180);
      style.left = Math.min(Math.max(16, rect.left), window.innerWidth - 320);
    } else if (place === 'right') {
      style.top = Math.max(16, rect.top);
      style.left = Math.min(rect.left + rect.width + gap, window.innerWidth - 320);
    } else {
      style.top = Math.max(16, rect.top);
      style.left = Math.max(16, rect.left - gap - 300);
    }
    return style;
  };

  /** Simple chevron arrow from card toward highlight */
  const arrow = () => {
    if (!rect || !step.target) return null;
    const place = step.placement || 'bottom';
    const cls =
      place === 'bottom'
        ? 'left-8 -top-2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white'
        : place === 'top'
          ? 'left-8 -bottom-2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white'
          : place === 'right'
            ? '-left-2 top-8 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white'
            : '-right-2 top-8 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white';
    return <div className={`absolute w-0 h-0 ${cls}`} aria-hidden />;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
        >
          {/* Dim + spotlight hole via box-shadow on ring */}
          {rect ? (
            <div
              className="pointer-events-none fixed z-[101] rounded-2xl ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent transition-all duration-300"
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.55)',
              }}
            />
          ) : (
            <div className="fixed inset-0 z-[101] bg-slate-900/50 backdrop-blur-[2px]" />
          )}

          {/* Click-catcher outside card */}
          <button
            type="button"
            className="fixed inset-0 z-[101] cursor-default bg-transparent"
            aria-label="Tour backdrop"
            onClick={(e) => e.preventDefault()}
          />

          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-[102] rounded-3xl bg-white shadow-2xl border border-emerald-100 overflow-hidden"
            style={cardStyle()}
          >
            {arrow()}
            <div className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 px-5 pt-5 pb-3">
              <button
                type="button"
                onClick={finish}
                className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700"
                aria-label="Skip tour"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <GenieAvatar
                  src={i === 0 ? BRAND.assets.wave : BRAND.assets.widget}
                  size={56}
                  float={!rect}
                />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                    Step {i + 1} of {TOUR_STEPS.length}
                  </p>
                  <div className="mt-1 flex gap-1">
                    {TOUR_STEPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 w-5 rounded-full ${idx <= i ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4">
              <h2 id="tour-title" className="text-lg font-bold text-slate-900 mb-1.5">
                {step.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>
              {step.target && !rect && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1.5">
                  Looking for that control… open Home or Find if it’s hidden.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-2.5">
              <button
                type="button"
                onClick={() => setI((v) => Math.max(0, v - 1))}
                disabled={i === 0}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={finish}
                className="text-xs font-semibold text-slate-400 px-2"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={() => {
                  if (last) finish();
                  else setI((v) => v + 1);
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500"
              >
                {last ? 'Got it' : 'Next'}
                {!last && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
