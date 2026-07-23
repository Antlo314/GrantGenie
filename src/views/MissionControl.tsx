import React from 'react';
import { motion } from 'motion/react';
import { Search, FileSignature, PenTool, HandCoins, BookOpen } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import PageHeader from '../components/PageHeader';
import GenieAvatar from '../components/GenieAvatar';
import { BRAND } from '../lib/brand';
import { GLOSSARY, PAGE_HINTS } from '../lib/hints';

export default function MissionControl({
  onNavigate,
  onStartDraft: _onStartDraft,
  onStartTour,
}: {
  onNavigate: (v: any) => void;
  onStartDraft: (g: any) => void;
  onStartTour?: () => void;
}) {
  const { organization, profile } = useAuth();
  const name = profile?.name || organization?.name || 'there';
  const h = PAGE_HINTS.mission;

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <PageHeader
        title={h.title}
        subtitle={h.subtitle}
        hint={h.hint}
        infoTitle="What is Home?"
        infoBody="This is your dashboard. Come here to see what to do next. Use the Genie (bottom right) if you get stuck."
      />

      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-30 pointer-events-none hidden sm:block">
          <img src={BRAND.assets.wave} alt="" className="h-full w-full object-contain object-right" />
        </div>
        <div className="relative p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start">
          <GenieAvatar src={BRAND.assets.wave} size={88} float />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-1">
              Welcome
            </p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Hi {name.split(' ')[0]} — let’s find real opportunities
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl mb-4">
              You don’t need to be a grant expert. Start by searching free government listings, then save
              the ones that fit. I’ll explain as we go.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('radar')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
              >
                <Search className="h-4 w-4" /> Start searching
              </button>
              {onStartTour && (
                <button
                  type="button"
                  onClick={onStartTour}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
                >
                  <BookOpen className="h-4 w-4" /> Beginner tour
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Glossary */}
      <div className="grid sm:grid-cols-2 gap-4">
        <GlossaryCard
          icon={<HandCoins className="h-5 w-5" />}
          title={GLOSSARY.grant.title}
          body={GLOSSARY.grant.body}
          cta="Search grants"
          onClick={() => onNavigate('radar')}
        />
        <GlossaryCard
          icon={<FileSignature className="h-5 w-5" />}
          title={GLOSSARY.contract.title}
          body={GLOSSARY.contract.body}
          cta="Search contracts"
          onClick={() => onNavigate('radar')}
          gold
        />
      </div>

      {/* Next steps */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
          Simple path
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <StepCard n="1" title="Find" desc="Search real .gov listings" onClick={() => onNavigate('radar')} />
          <StepCard n="2" title="Save" desc="Track them in My applications" onClick={() => onNavigate('pipeline')} />
          <StepCard n="3" title="Write" desc="Use Draft helper, then submit on the official site" onClick={() => onNavigate('writer')} icon={<PenTool className="h-4 w-4" />} />
        </div>
      </div>
    </div>
  );
}

function GlossaryCard({
  icon,
  title,
  body,
  cta,
  onClick,
  gold,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  gold?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        gold ? 'border-amber-100 bg-amber-50/40' : 'border-emerald-100 bg-emerald-50/40'
      }`}
    >
      <div className={`mb-2 ${gold ? 'text-amber-700' : 'text-emerald-700'}`}>{icon}</div>
      <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{body}</p>
      <button
        type="button"
        onClick={onClick}
        className={`text-xs font-bold ${gold ? 'text-amber-800' : 'text-emerald-800'} hover:underline`}
      >
        {cta} →
      </button>
    </div>
  );
}

function StepCard({
  n,
  title,
  desc,
  onClick,
  icon,
}: {
  n: string;
  title: string;
  desc: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:shadow-md transition-all"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800 mb-2">
        {icon || n}
      </span>
      <p className="font-bold text-slate-900">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
    </button>
  );
}
