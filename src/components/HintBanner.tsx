'use client';

import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function HintBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-4 py-3 text-sm text-slate-600 leading-relaxed">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Lightbulb className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 pt-0.5">{children}</div>
    </div>
  );
}
