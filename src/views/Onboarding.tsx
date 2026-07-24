import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  HeartHandshake,
  HandCoins,
  FileSignature,
  Check,
  MapPin,
  PencilLine,
  Ruler,
  BadgeCheck,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthProvider';
import GenieAvatar from '../components/GenieAvatar';
import { BRAND } from '../lib/brand';
import type {
  EntityType,
  Sector,
  SizeBand,
  FundingNeedBand,
  ProfileFlags,
  UserProfile,
} from '../types';
import { US_STATES } from '../services/sources/statePortals';
import {
  buildTestProfileFields,
  isPermissionError,
  saveLocalProfile,
  stripUndefined,
} from '../lib/profileStore';

const TOTAL_STEPS = 6;

/**
 * Dev shortcut: open the app with ?dev=1 to pre-fill a test profile and jump
 * to the last step. Real users always start at step 1 with blank answers.
 */
const DEV_SKIP =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('dev');

const STEP_LABELS = [
  'Who you are',
  'What you need',
  'Where you are',
  'What you do',
  'Rough size',
  'Finish up',
];

const STEP_ICONS = [
  <User key="1" className="w-3.5 h-3.5" />,
  <HandCoins key="2" className="w-3.5 h-3.5" />,
  <MapPin key="3" className="w-3.5 h-3.5" />,
  <PencilLine key="4" className="w-3.5 h-3.5" />,
  <Ruler key="5" className="w-3.5 h-3.5" />,
  <BadgeCheck key="6" className="w-3.5 h-3.5" />,
];

const KEYWORD_CHIPS = [
  'Health',
  'Education',
  'Housing',
  'Construction',
  'IT services',
  'Cleaning',
  'Food / agriculture',
  'Arts',
  'Environment',
  'Public safety',
  'Transportation',
  'Research',
  'Youth',
  'Seniors',
  'Workforce',
];

const MIN_DESCRIPTION = 10;

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { user, refreshProfile } = useAuth();

  // Only seed the test profile when the ?dev flag is present.
  const seed = DEV_SKIP
    ? buildTestProfileFields({
        uid: user?.uid || 'pending',
        email: user?.email,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      })
    : null;

  const [step, setStep] = useState(DEV_SKIP ? TOTAL_STEPS : 1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [entityType, setEntityType] = useState<EntityType | null>(seed?.entityType ?? null);
  const [sector, setSector] = useState<Sector | null>(seed?.sector ?? null);
  const [name, setName] = useState(seed?.name || '');
  const [state, setState] = useState(seed?.state || '');
  const [city, setCity] = useState(seed?.city || '');
  const [zip, setZip] = useState(seed?.zip || '');
  const [description, setDescription] = useState(seed?.description || '');
  const [keywords, setKeywords] = useState<string[]>(seed?.keywords || []);
  const [sizeBand, setSizeBand] = useState<SizeBand>(seed?.sizeBand || 'small');
  const [fundingNeedBand, setFundingNeedBand] = useState<FundingNeedBand>(
    seed?.fundingNeedBand || '25k_100k'
  );
  const [flags, setFlags] = useState<ProfileFlags>(seed?.flags || {});
  const [ein, setEin] = useState('');

  const toggleKeyword = (k: string) => {
    setKeywords((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

  const toggleFlag = (key: keyof ProfileFlags) => {
    setFlags((f) => ({ ...f, [key]: !f[key] }));
  };

  const canNext = () => {
    if (step === 1) return !!entityType;
    if (step === 2) return !!sector;
    if (step === 3) return !!state;
    if (step === 4) return description.trim().length >= MIN_DESCRIPTION;
    if (step === 5) return true;
    if (step === 6) return true;
    return false;
  };

  const handleFinish = async () => {
    if (!user || user.uid === 'demo-user-123') {
      onComplete();
      return;
    }
    setBusy(true);
    setError(null);
    const now = new Date().toISOString();
    const einClean = ein.trim();
    const profilePayload: UserProfile = {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      profileComplete: true,
      entityType: entityType || 'other',
      sector: sector || 'grants',
      name: name.trim() || user.displayName || 'My profile',
      state,
      city: city.trim(),
      zip: zip.trim(),
      description: description.trim(),
      keywords,
      sizeBand,
      fundingNeedBand,
      flags,
      ...(einClean ? { ein: einClean } : {}),
      tier: 'Free',
      updatedAt: now,
      createdAt: now,
    };
    // Firestore rejects undefined — only send clean fields
    const forCloud = stripUndefined(profilePayload as unknown as Record<string, unknown>);

    try {
      await setDoc(doc(db, 'users', user.uid), forCloud, { merge: true });
      saveLocalProfile(profilePayload);
      await refreshProfile();
      onComplete();
    } catch (e: unknown) {
      console.error(e);
      // Always keep answers so the user is not stuck on the last step
      saveLocalProfile(profilePayload);
      await refreshProfile();
      if (isPermissionError(e)) {
        onComplete();
        return;
      }
      setError(
        e instanceof Error
          ? e.message
          : 'Could not save to the cloud. Your answers were kept on this device — try Continue again.'
      );
      onComplete();
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else void handleFinish();
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const descriptionRemaining = Math.max(0, MIN_DESCRIPTION - description.trim().length);

  const sectorLabel =
    sector === 'grants' ? 'Grants' : sector === 'contracts' ? 'Contracts' : sector === 'both' ? 'Grants + contracts' : '—';
  const entityLabel =
    entityType === 'individual'
      ? 'Individual / sole prop'
      : entityType === 'company'
        ? 'Company or LLC'
        : entityType === 'nonprofit'
          ? 'Nonprofit / school / gov'
          : '—';
  const stateName = US_STATES.find((s) => s.code === state)?.name || state || '—';

  return (
    <div className="h-screen w-screen gg-app-bg text-slate-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      <div className="aurora-field" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="max-w-xl w-full glass-panel rounded-[2rem] p-6 md:p-10 relative z-10 max-h-[95vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header: step label + progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="shrink-0">
                <GenieAvatar src={BRAND.assets.wave} size={48} float />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Get started · Step <span className="font-mono">{step}</span> of{' '}
                  <span className="font-mono">{TOTAL_STEPS}</span>
                </p>
                <p className="text-sm font-bold text-emerald-700">{STEP_LABELS[step - 1]}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              About 2 minutes
            </p>
          </div>
          {/* Labeled progress dots */}
          <div className="mt-4 flex items-center gap-1.5">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex-1 group relative" title={label}>
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    step >= i + 1
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      : 'bg-slate-200/70'
                  }`}
                />
                <span
                  className={`mt-1.5 hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-wide ${
                    step === i + 1 ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {STEP_ICONS[i]}
                  <span className="truncate">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            {step === 1 && (
              <StepShell
                title="Who are you?"
                subtitle="Pick the option that fits best. You can change this later — nothing here is locked in."
              >
                <Choice
                  active={entityType === 'individual'}
                  onClick={() => setEntityType('individual')}
                  icon={<User className="w-5 h-5" />}
                  label="Individual or sole prop"
                  hint="Just you, or a one-person business"
                />
                <Choice
                  active={entityType === 'company'}
                  onClick={() => setEntityType('company')}
                  icon={<Building2 className="w-5 h-5" />}
                  label="Company or LLC"
                  hint="A business that can sell goods or services"
                />
                <Choice
                  active={entityType === 'nonprofit'}
                  onClick={() => setEntityType('nonprofit')}
                  icon={<HeartHandshake className="w-5 h-5" />}
                  label="Nonprofit, school, or government"
                  hint="Mission-driven or public organization"
                />
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                title="What do you need?"
                subtitle="Grants and contracts are different things. We keep them separate so nothing gets confusing."
              >
                <Choice
                  active={sector === 'grants'}
                  onClick={() => setSector('grants')}
                  icon={<HandCoins className="w-5 h-5" />}
                  label="Grants"
                  hint="Free funding for a project or mission — you apply, and if you win you follow their spending rules."
                />
                <Choice
                  active={sector === 'contracts'}
                  onClick={() => setSector('contracts')}
                  icon={<FileSignature className="w-5 h-5" />}
                  label="Contracts"
                  hint="Paid work — the government buys goods or services from you."
                />
                <Choice
                  active={sector === 'both'}
                  onClick={() => setSector('both')}
                  icon={<Sparkles className="w-5 h-5" />}
                  label="Both"
                  hint="Explore grants and contracts. You can switch between them anytime inside the app."
                />
              </StepShell>
            )}

            {step === 3 && (
              <StepShell
                title="Where do you work?"
                subtitle="We use your state to show official state portals and filter results near you."
              >
                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Your name or organization name
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Services LLC"
                    className="field"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    State <span className="text-emerald-600">*</span>
                  </span>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="field"
                  >
                    <option value="">Select state</option>
                    {US_STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      City <span className="normal-case font-medium text-slate-400">(optional)</span>
                    </span>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="field"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      ZIP <span className="normal-case font-medium text-slate-400">(optional)</span>
                    </span>
                    <input
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      inputMode="numeric"
                      className="field"
                    />
                  </label>
                </div>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell
                title="What do you do?"
                subtitle="A few plain sentences is perfect. This powers your search matches and helps write drafts later."
              >
                <div className="space-y-1.5">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Example: We install energy-efficient lighting for small businesses in Georgia."
                    className="field resize-none"
                  />
                  {descriptionRemaining > 0 ? (
                    <p className="text-xs text-slate-500">
                      Keep going — about <span className="font-mono">{descriptionRemaining}</span> more character
                      {descriptionRemaining === 1 ? '' : 's'} so search has enough to work with.
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> That works!
                    </p>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Topics (pick any that fit)
                </p>
                <div className="flex flex-wrap gap-2">
                  {KEYWORD_CHIPS.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleKeyword(k)}
                      aria-pressed={keywords.includes(k)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        keywords.includes(k)
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-transparent shadow-sm shadow-emerald-500/30'
                          : 'bg-white/80 text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-white'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </StepShell>
            )}

            {step === 5 && (
              <StepShell
                title="Rough size"
                subtitle="No exact numbers needed — ranges are enough. This helps filter to opportunities you can realistically win."
              >
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Team size
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ['solo', 'Just me'],
                      ['small', '2–50 people'],
                      ['medium', '51–500'],
                      ['large', '500+'],
                    ] as [SizeBand, string][]
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSizeBand(id)}
                      aria-pressed={sizeBand === id}
                      className={`rounded-2xl border px-3 py-3 text-sm font-semibold text-left transition-colors ${
                        sizeBand === id
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm'
                          : 'border-slate-200 bg-white/70 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">
                  Funding or deal size you care about
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ['under_25k', 'Under $25k'],
                      ['25k_100k', '$25k–$100k'],
                      ['100k_500k', '$100k–$500k'],
                      ['500k_plus', '$500k+'],
                    ] as [FundingNeedBand, string][]
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFundingNeedBand(id)}
                      aria-pressed={fundingNeedBand === id}
                      className={`rounded-2xl border px-3 py-3 font-mono text-sm font-semibold text-left transition-colors ${
                        fundingNeedBand === id
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm'
                          : 'border-slate-200 bg-white/70 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </StepShell>
            )}

            {step === 6 && (
              <StepShell
                title="Almost done!"
                subtitle="Check anything that applies — some funding is set aside for these groups. All of this is optional."
              >
                {/* Summary of their answers */}
                <div className="glass-emerald rounded-2xl px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-1.5">
                    Your setup
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-bold">{entityLabel}</span>
                    {' · '}looking for <span className="font-bold">{sectorLabel.toLowerCase()}</span>
                    {' · '}in <span className="font-bold">{stateName}</span>
                    {keywords.length > 0 && (
                      <>
                        {' · '}topics: <span className="font-bold">{keywords.slice(0, 4).join(', ')}</span>
                        {keywords.length > 4 ? ` +${keywords.length - 4}` : ''}
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  {(
                    [
                      ['smallBiz', 'Small business'],
                      ['minority', 'Minority-owned'],
                      ['woman', 'Woman-owned'],
                      ['veteran', 'Veteran-owned'],
                      ['rural', 'Rural / underserved area'],
                      ['student', 'Student / academic'],
                      ['is501c3', '501(c)(3) nonprofit'],
                    ] as [keyof ProfileFlags, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleFlag(key)}
                      aria-pressed={!!flags[key]}
                      className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold text-left transition-colors ${
                        flags[key]
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm'
                          : 'border-slate-200 bg-white/70 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          flags[key] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {flags[key] ? <Check className="w-3.5 h-3.5" /> : null}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
                {(entityType === 'nonprofit' || entityType === 'company') && (
                  <label className="block space-y-1.5 pt-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      EIN — your tax ID number <span className="normal-case font-medium text-slate-400">(optional for now)</span>
                    </span>
                    <input
                      value={ein}
                      onChange={(e) => setEin(e.target.value)}
                      placeholder="XX-XXXXXXX"
                      className="field"
                    />
                  </label>
                )}
                <p className="text-xs text-slate-500 leading-relaxed pt-2">
                  Next you'll see your home screen and a quick tour. Search uses real, free
                  government data (Grants.gov and USASpending). AI only helps explain and write —
                  it never invents listings.
                </p>
              </StepShell>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 1 || busy}
            className="btn btn-ghost"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canNext() || busy}
            className="btn btn-primary btn-lg"
          >
            {busy ? 'Saving…' : step === TOTAL_STEPS ? 'Finish & open app' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          {title}
        </h1>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">{subtitle}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Choice({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active
          ? 'border-emerald-500 bg-emerald-50/80 shadow-md shadow-emerald-500/10'
          : 'border-slate-200 bg-white/75 hover:border-emerald-300 hover:bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 p-2 rounded-xl transition-colors ${
            active
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/30'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {icon}
        </div>
        <div>
          <div className="font-bold text-slate-900">{label}</div>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{hint}</p>
        </div>
      </div>
    </button>
  );
}
