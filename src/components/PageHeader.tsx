'use client';

import React from 'react';
import InfoTip from './InfoTip';
import HintBanner from './HintBanner';

type Props = {
  title: string;
  subtitle?: string;
  hint?: string;
  infoTitle?: string;
  infoBody?: React.ReactNode;
  actions?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  hint,
  infoTitle,
  infoBody,
  actions,
}: Props) {
  return (
    <div className="mb-6 shrink-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {infoTitle && infoBody && (
              <InfoTip title={infoTitle} label={`About ${title}`}>
                {infoBody}
              </InfoTip>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
        </div>
        {actions}
      </div>
      {hint && <div className="mt-4"><HintBanner>{hint}</HintBanner></div>}
    </div>
  );
}
