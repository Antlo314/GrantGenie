import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  FileSignature,
  PenTool,
  HandCoins,
  BookOpen,
  Sparkles,
  ArrowRight,
  Gift,
  TrendingUp,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import PageHeader from '../components/PageHeader';
import GenieAvatar from '../components/GenieAvatar';
import SpecsBar from '../components/SpecsBar';
import { Tilt3D, ProgressBar, SectionLabel } from '../components/ui';
import { BRAND } from '../lib/brand';
import { GLOSSARY, PAGE_HINTS } from '../lib/hints';
import { getActivity, onActivityChange, type ActivityCounts } from '../lib/activityStore';

export default function MissionControl({
  onNavigate,
  onStartDraft: _onStartDraft,
  onStartTour,
}: {
  onNavigate: (v: any) => void;
  onStartDraft: (g: any) => void;
  onStartTour?: () => void;
}) {
  const { organization, profile, user } = useAuth();
  const name = profile?.name || organization?.name || 'there';
  const h = PAGE_HINTS.mission;

  const uid = user?.uid || 'anon';
  const [activity, setActivity] = React.useState<ActivityCounts>(() => getActivity(uid));

  React.useEffect(() => {
    setActivity(getActivity(uid));
    return onActivityChange(setActivity);
  }, [uid]);

  const checklist = [
    {
      id: 'profile',
      label: 'Tell us what you do',
      hint: 'Done in Get started — edit anytime in Settings',
      done: !!profile?.profileComplete,
      go: () => onNavigate('settings'),
    },
    {
      id: 'search',
      label: 'Run your first search',
      hint: 'Real listings from free .gov databases',
      done: activity.search > 0,
      go: () => onNavigate('radar'),
    },
    {
      id: 'save',
      label: 'Save a listing you like',
      hint: 'Tap the bookmark on any result',
      done: activity.save > 0,
      go: () => onNavigate('radar'),
    },
    {
      id: 'draft',
      label: 'Start your first draft',
      hint: 'The Draft helper writes a starting point from your profile',
      done: activity.draft > 0,
      go: () => onNavigate('writer'),
    },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const allDone = doneCount === checklist.length;

  return (
    <div className="space-y-6 pb-16 max-w-5xl">
      <PageHeader
        title={h.title}
        subtitle={h.subtitle}
        hint={h.hint}
        infoTitle="What is Home?"
        infoBody="This is your dashboard. Come here to see what to do next. Use the Genie (bottom right) if you get stuck."
      />

      {/* ── Hero — 3D tilt card with the floating genie ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="perspective-1000"
      >
        <Tilt3D maxTilt={4}>
          <div
            className="relative overflow-hidden rounded-[2rem] noise-overlay"
            style={{
              background:
                'radial-gradient(120% 140% at 85% 10%, rgba(52,211,153,0.28) 0%, transparent 45%), radial-gradient(100% 120% at 10% 100%, rgba(245,158,11,0.16) 0%, transparent 50%), linear-gradient(135deg, #0b1220 0%, #07271f 55%, #0a3d2e 100%)',
            }}
          >
            {/* ambient orbs */}
            <div
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-25 pointer-events-none gg-pulse-glow"
              style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.8) 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-14 left-1/4 w-56 h-56 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.9) 0%, transparent 70%)' }}
            />

            <div className="relative p-7 md:p-10 flex flex-col sm:flex-row gap-7 items-center sm:items-start">
              <div className="shrink-0 gg-float-slow" style={{ transform: 'translateZ(40px)' }}>
                <GenieAvatar src={BRAND.assets.widget} size={132} />
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-300 mb-3">
                  <Sparkles className="h-3 w-3" /> Welcome back
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-2.5 leading-tight">
                  Hi {name.split(' ')[0]} —<br className="hidden md:block" />{' '}
                  <span className="text-gradient-emerald">let’s find your next win</span>
                </h2>
                <p className="text-sm md:text-[15px] text-emerald-100/70 leading-relaxed max-w-xl mb-6">
                  Pick your industry, search real government listings, and let the Genie guide your
                  application — start to finish. Everything we show is real, and everything official
                  is free.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => onNavigate('radar')}
                    className="btn btn-primary btn-lg"
                  >
                    <Search className="h-4 w-4" /> Search my industry
                  </button>
                  {onStartTour && (
                    <button
                      type="button"
                      onClick={onStartTour}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-5 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all"
                    >
                      <BookOpen className="h-4 w-4" /> Beginner tour
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Tilt3D>
      </motion.div>

      {/* ── Getting-started checklist ── */}
      {!allDone && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bento-tile p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 tracking-tight">Getting started</h3>
            </div>
            <div className="flex items-center gap-3">
              <ProgressBar value={doneCount} max={checklist.length} label="Getting started progress" className="w-28" />
              <span className="text-xs font-bold text-emerald-700">
                {doneCount}/{checklist.length}
              </span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {checklist.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={item.go}
                disabled={item.done}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.05 }}
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                  item.done
                    ? 'border-emerald-100 bg-emerald-50/60 cursor-default'
                    : 'border-slate-200 bg-white/80 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                )}
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-bold ${
                      item.done ? 'text-emerald-800 line-through decoration-emerald-300' : 'text-slate-800'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="block text-xs text-slate-500 leading-snug mt-0.5">
                    {item.hint}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <SpecsBar
        onSpecsChange={() => {
          /* chips saved; user can open Find */
        }}
      />

      {/* ── Bento grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 perspective-1000">
        {/* Grants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tilt3D className="h-full">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('radar')}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('radar')}
              className="group cursor-pointer glass-emerald rounded-[2rem] p-6 h-full border border-emerald-200/50 hover:border-emerald-400/60 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-700">
                  <HandCoins className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 duration-200" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1.5 text-lg tracking-tight">{GLOSSARY.grant.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{GLOSSARY.grant.body}</p>
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
                Search grants →
              </span>
            </div>
          </Tilt3D>
        </motion.div>

        {/* Contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Tilt3D className="h-full">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('radar')}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('radar')}
              className="group cursor-pointer glass-gold rounded-[2rem] p-6 h-full border border-amber-200/50 hover:border-amber-400/60 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-700">
                  <FileSignature className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 duration-200" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1.5 text-lg tracking-tight">{GLOSSARY.contract.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{GLOSSARY.contract.body}</p>
              <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest">
                Search contracts →
              </span>
            </div>
          </Tilt3D>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-tile p-6 relative overflow-hidden sm:col-span-2 lg:col-span-1"
        >
          <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-5 pointer-events-none">
            <TrendingUp className="w-full h-full text-emerald-900" />
          </div>
          <SectionLabel className="mb-5">Your activity</SectionLabel>
          <div className="space-y-4">
            {[
              { label: 'Searches run', value: activity.search, color: 'text-emerald-600' },
              { label: 'Listings saved', value: activity.save, color: 'text-slate-700' },
              { label: 'Drafts started', value: activity.draft, color: 'text-amber-600' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">{item.label}</span>
                <span className={`font-mono text-base font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
            {activity.search === 0 && (
              <p className="text-xs text-slate-400 leading-snug pt-1">
                Your numbers show up here as you use the app.
              </p>
            )}
          </div>
        </motion.div>

        {/* Free toolbox teaser — full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="sm:col-span-2 lg:col-span-3"
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigate('toolbox')}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('toolbox')}
            className="group cursor-pointer bento-tile glow-border-emerald p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
              <Gift className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 tracking-tight">
                The Free Toolbox — real help that costs $0
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-0.5">
                Free advisors, free funder research, free writing tools. Applying to government
                programs is always free — we’ll show you the real sites.
              </p>
            </div>
            <span className="btn btn-secondary btn-sm shrink-0 group-hover:border-emerald-400">
              Open toolbox <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Simple path ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SectionLabel className="mb-3">Your simple path</SectionLabel>
        <div className="grid sm:grid-cols-3 gap-3">
          <StepCard n="1" title="Find" desc="Search real .gov listings" onClick={() => onNavigate('radar')} />
          <StepCard n="2" title="Save" desc="Track them in My applications" onClick={() => onNavigate('pipeline')} />
          <StepCard n="3" title="Write" desc="Use Draft helper, then submit on the official site" onClick={() => onNavigate('writer')} icon={<PenTool className="h-4 w-4" />} />
        </div>
      </motion.div>
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
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="text-left bento-tile p-5 group"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-xs font-extrabold text-white mb-3 shadow-md shadow-emerald-500/30">
        {icon || n}
      </span>
      <p className="font-bold text-slate-900 tracking-tight text-base">{title}</p>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      <div className="flex items-center gap-1 mt-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
        Go <ArrowRight className="h-3 w-3" />
      </div>
    </motion.button>
  );
}
