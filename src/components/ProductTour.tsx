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
  // Hidden off-layout (e.g. desktop-only sidebar on mobile)
  if (r.width < 4 || r.height < 4) return false;
  if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) {
    return false;
  }
  return true;
}

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : true
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [breakpoint]);
  return mobile;
}

/**
 * Clamp tooltip card fully inside the viewport with padding.
 */
function clampCard(
  preferred: { top: number; left: number },
  cardW: number,
  cardH: number,
  pad = 12
): { top: number; left: number } {
  const maxL = Math.max(pad, window.innerWidth - cardW - pad);
  const maxT = Math.max(pad, window.innerHeight - cardH - pad);
  return {
    left: Math.min(Math.max(pad, preferred.left), maxL),
    top: Math.min(Math.max(pad, preferred.top), maxT),
  };
}

export default function ProductTour({ open, onClose, onStepChange }: Props) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [missingTarget, setMissingTarget] = useState(false);
  const isMobile = useIsMobile();
  const step = TOUR_STEPS[i];
  const last = i >= TOUR_STEPS.length - 1;

  const measure = useCallback(() => {
    if (!step?.target) {
      setRect(null);
      setMissingTarget(false);
      return;
    }
    // Support comma-separated selectors; pick first visible match
    const candidates = Array.from(document.querySelectorAll(step.target));
    const el = candidates.find((n) => isUsableTarget(n)) as HTMLElement | undefined;
    if (!el) {
      setRect(null);
      setMissingTarget(true);
      return;
    }
    setMissingTarget(false);
    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    // Remeasure after scroll settles
    window.setTimeout(() => {
      if (!isUsableTarget(el)) {
        setRect(null);
        setMissingTarget(true);
        return;
      }
      const r = el.getBoundingClientRect();
      const pad = isMobile ? 6 : 10;
      setRect({
        top: r.top - pad,
        left: r.left - pad,
        width: Math.max(r.width + pad * 2, 40),
        height: Math.max(r.height + pad * 2, 40),
      });
    }, 320);
  }, [step?.target, isMobile]);

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  useEffect(() => {
    if (!open || !step) return;
    onStepChange?.(step);
    // Wait for view switch / layout
    const t = window.setTimeout(measure, 350);
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

  /** Desktop floating card near highlight; mobile = bottom sheet (always readable). */
  const desktopCardPos = (): { top: number; left: number } | null => {
    if (isMobile || !rect) return null;
    const cardW = Math.min(380, window.innerWidth - 24);
    const cardH = 280;
    const gap = 16;
    const place = step.placement || 'bottom';
    let top = rect.top;
    let left = rect.left;

    if (place === 'bottom') {
      top = rect.top + rect.height + gap;
      left = rect.left + rect.width / 2 - cardW / 2;
    } else if (place === 'top') {
      top = rect.top - cardH - gap;
      left = rect.left + rect.width / 2 - cardW / 2;
    } else if (place === 'right') {
      top = rect.top + rect.height / 2 - cardH / 2;
      left = rect.left + rect.width + gap;
    } else {
      top = rect.top + rect.height / 2 - cardH / 2;
      left = rect.left - cardW - gap;
    }
    return clampCard({ top, left }, cardW, cardH, 16);
  };

  const pos = desktopCardPos();
  const showSpotlight = !!rect && !isMobile;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
        >
          {/* Full dim (always) */}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]" />

          {/* Spotlight cutout — desktop only (mobile uses bottom sheet) */}
          {showSpotlight && rect && (
            <div
              className="pointer-events-none absolute z-[201] rounded-2xl border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(2,6,23,0.72)] transition-all duration-300"
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                boxShadow:
                  '0 0 0 4px rgba(52, 211, 153, 0.45), 0 0 0 9999px rgba(2, 6, 23, 0.72)',
              }}
            >
              <div className="absolute inset-0 rounded-2xl animate-pulse bg-emerald-400/10" />
            </div>
          )}

          {/* Mobile: label chip above bottom sheet when target found */}
          {isMobile && rect && (
            <div
              className="pointer-events-none fixed z-[202] flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white shadow-lg"
              style={{
                top: Math.max(8, rect.top - 28),
                left: Math.min(rect.left, window.innerWidth - 140),
              }}
            >
              <MapPin className="h-3 w-3" /> Look here
            </div>
          )}

          {/* CARD */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: isMobile ? 40 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={
              isMobile
                ? 'fixed inset-x-0 bottom-0 z-[203] max-h-[min(72vh,520px)] overflow-y-auto rounded-t-3xl border border-emerald-100 bg-white shadow-2xl'
                : 'fixed z-[203] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border-2 border-emerald-200 bg-white shadow-2xl shadow-black/40'
            }
            style={
              isMobile
                ? { paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }
                : pos
                  ? { top: pos.top, left: pos.left }
                  : {
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }
            }
          >
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-slate-100">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${((i + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>

            <div className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 px-5 pt-4 pb-3 sm:px-6">
              <button
                type="button"
                onClick={finish}
                className="absolute right-3 top-3 z-10 rounded-lg bg-white/90 p-2 text-slate-500 shadow-sm hover:bg-white hover:text-slate-800"
                aria-label="Skip tour"
              >
                <X className="h-5 w-5" />
              </button>

              {isMobile && (
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" aria-hidden />
              )}

              <div className="flex items-center gap-3 pr-10">
                <GenieAvatar
                  src={i === 0 ? BRAND.assets.wave : BRAND.assets.widget}
                  size={isMobile ? 52 : 64}
                  float={!rect}
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                    Step {i + 1} of {TOUR_STEPS.length}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {TOUR_STEPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 w-2 rounded-full sm:h-1.5 sm:w-5 ${
                          idx <= i ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <h2
                id="tour-title"
                className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl mb-2 leading-snug"
              >
                {step.title}
              </h2>
              <p className="text-[15px] sm:text-base text-slate-700 leading-relaxed">
                {step.body}
              </p>
              {missingTarget && step.target && (
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-sm text-amber-900">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    That control is on desktop sidebar or another screen — read the tip, then tap{' '}
                    <strong>Next</strong>. You can explore it after the tour.
                  </span>
                </p>
              )}
              {showSpotlight && (
                <p className="mt-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  ↑ The green outline shows what we’re talking about.
                </p>
              )}
            </div>

            <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => setI((v) => Math.max(0, v - 1))}
                disabled={i === 0}
                className="inline-flex min-h-[44px] items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
              <button
                type="button"
                onClick={finish}
                className="min-h-[44px] px-3 text-sm font-semibold text-slate-400 hover:text-slate-600"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={() => {
                  if (last) finish();
                  else setI((v) => v + 1);
                }}
                className="inline-flex min-h-[44px] min-w-[7rem] items-center justify-center gap-1 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500"
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
