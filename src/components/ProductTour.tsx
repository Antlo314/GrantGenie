'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, MapPin } from 'lucide-react';
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
  onStepChange?: (step: TourStepDef) => void;
};

function isUsableTarget(el: Element | null): el is HTMLElement {
  if (!el || !(el instanceof HTMLElement)) return false;
  const r = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  if (r.width < 4 || r.height < 4) return false;
  if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) {
    return false;
  }
  return true;
}

/**
 * Always a bottom sheet with scrollable body + sticky footer (works on PC + mobile).
 * Optional green highlight on the target control.
 */
export default function ProductTour({ open, onClose, onStepChange }: Props) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [missingTarget, setMissingTarget] = useState(false);
  const step = TOUR_STEPS[i];
  const last = i >= TOUR_STEPS.length - 1;

  const measure = useCallback(() => {
    if (!step?.target) {
      setRect(null);
      setMissingTarget(false);
      return;
    }
    const candidates = Array.from(document.querySelectorAll(step.target));
    const el = candidates.find((n) => isUsableTarget(n)) as HTMLElement | undefined;
    if (!el) {
      setRect(null);
      setMissingTarget(true);
      return;
    }
    setMissingTarget(false);
    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    window.setTimeout(() => {
      if (!isUsableTarget(el)) {
        setRect(null);
        setMissingTarget(true);
        return;
      }
      const r = el.getBoundingClientRect();
      const pad = 8;
      setRect({
        top: r.top - pad,
        left: r.left - pad,
        width: Math.max(r.width + pad * 2, 40),
        height: Math.max(r.height + pad * 2, 40),
      });
    }, 300);
  }, [step?.target]);

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  useEffect(() => {
    if (!open || !step) return;
    onStepChange?.(step);
    const t = window.setTimeout(measure, 400);
    return () => window.clearTimeout(t);
  }, [open, i, step, measure, onStepChange]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open, i, measure]);

  const finish = () => {
    markTourDone();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
        >
          {/* Dim */}
          <div className="absolute inset-0 bg-slate-950/75" aria-hidden />

          {/* Spotlight */}
          {rect && (
            <div
              className="pointer-events-none absolute z-[201] rounded-2xl border-[3px] border-emerald-400 transition-all duration-300"
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                boxShadow:
                  '0 0 0 4px rgba(52, 211, 153, 0.5), 0 0 0 9999px rgba(2, 6, 23, 0.72)',
              }}
            />
          )}

          {/* Bottom sheet — always; scrollable middle, sticky actions */}
          <motion.div
            key={step.id}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '40%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-[203] flex w-full max-h-[min(85dvh,640px)] flex-col overflow-hidden rounded-t-[2rem] glass-panel"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Drag affordance */}
            <div className="flex shrink-0 justify-center pt-3 pb-1">
              <div className="h-1.5 w-12 rounded-full bg-slate-300" aria-hidden />
            </div>

            {/* Progress */}
            <div className="mx-4 mb-2 h-1.5 shrink-0 overflow-hidden rounded-full bg-slate-200/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${((i + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Header — fixed */}
            <div className="relative shrink-0 border-b border-emerald-100/60 px-5 pb-3 pt-1 sm:px-6">
              <button
                type="button"
                onClick={finish}
                className="absolute right-3 top-1 z-10 rounded-xl bg-white/80 p-2.5 text-slate-600 shadow-sm border border-white/70 hover:bg-white hover:text-slate-900 transition-colors"
                aria-label="Skip tour"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 pr-12">
                <GenieAvatar
                  src={i === 0 ? BRAND.assets.wave : BRAND.assets.widget}
                  size={56}
                  float={!rect}
                />
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                    Step <span className="font-mono">{i + 1}</span> of{' '}
                    <span className="font-mono">{TOUR_STEPS.length}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {TOUR_STEPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 w-2 rounded-full sm:h-1.5 sm:w-6 ${
                          idx <= i ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable body — this is the fix */}
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <h2
                id="tour-title"
                className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl mb-2 leading-snug"
              >
                {step.title}
              </h2>
              <p className="text-[15px] sm:text-base text-slate-700 leading-relaxed">
                {step.body}
              </p>

              {rect && (
                <p className="mt-4 text-sm font-semibold text-emerald-900 glass-emerald rounded-xl px-3 py-2.5">
                  Green outline on the page = the control this step is about. Scroll this box if
                  needed, then tap Next.
                </p>
              )}

              {missingTarget && step.target && (
                <p className="mt-3 flex items-start gap-2 rounded-xl glass-gold px-3 py-2.5 text-sm text-amber-900">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    That control may be in the left menu (desktop) or another tab — read the tip,
                    then tap <strong>Next</strong>.
                  </span>
                </p>
              )}

              {/* Extra space so last lines never hide under footer while scrolling */}
              <div className="h-4" aria-hidden />
            </div>

            {/* Footer — always visible, never clipped */}
            <div className="shrink-0 flex items-center justify-between gap-2 border-t border-slate-200/60 bg-white/50 px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => setI((v) => Math.max(0, v - 1))}
                disabled={i === 0}
                className="btn btn-ghost min-h-[48px]"
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
              <button
                type="button"
                onClick={finish}
                className="btn btn-ghost min-h-[48px]"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={() => {
                  if (last) finish();
                  else setI((v) => v + 1);
                }}
                className="btn btn-primary min-h-[48px] min-w-[8rem]"
              >
                {last ? 'Got it' : 'Next'}
                {!last && <ChevronRight className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
