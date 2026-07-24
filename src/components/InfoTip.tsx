'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

type Props = {
  title: string;
  children: React.ReactNode;
  /** Accessible label for the button */
  label?: string;
  className?: string;
};

/**
 * Small “?” button with a plain-English popover.
 */
export default function InfoTip({ title, children, label = 'More info', className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div
          role="dialog"
          className="absolute left-0 top-8 z-50 w-72 max-w-[min(18rem,calc(100vw-2rem))] rounded-2xl glass-panel p-4"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-0.5 text-slate-400 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-[13px] leading-relaxed text-slate-600">{children}</div>
        </div>
      )}
    </div>
  );
}
