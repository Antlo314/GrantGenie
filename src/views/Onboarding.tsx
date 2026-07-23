import React, { useState } from 'react';
import { motion } from 'motion/react';
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
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthProvider';
import type {
  EntityType,
  Sector,
  SizeBand,
  FundingNeedBand,
  ProfileFlags,
} from '../types';
import { US_STATES } from '../services/sources/statePortals';

const TOTAL_STEPS = 6;

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

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [sector, setSector] = useState<Sector | null>(null);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sizeBand, setSizeBand] = useState<SizeBand>('unknown');
  const [fundingNeedBand, setFundingNeedBand] = useState<FundingNeedBand>('unknown');
  const [flags, setFlags] = useState<ProfileFlags>({});
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
    if (step === 4) return description.trim().length >= 10;
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
    try {
      const now = new Date().toISOString();
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL || null,
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
          ein: ein.trim() || null,
          tier: 'Free',
          updatedAt: now,
          createdAt: now,
        },
        { merge: true }
      );
      await refreshProfile();
      onComplete();
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Could not save. Try again.');
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

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl relative z-10 max-h-[95vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Get started
              </p>
              <p className="text-xs text-slate-500">
                Step {step} of {TOTAL_STEPS}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  step >= i + 1 ? 'bg-emerald-600' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <StepShell
            title="Who are you?"
            subtitle="Pick the option that fits best. You can change this later."
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
            subtitle="Grants and contracts are different. We keep them in separate places so nothing is confusing."
          >
            <Choice
              active={sector === 'grants'}
              onClick={() => setSector('grants')}
              icon={<HandCoins className="w-5 h-5" />}
              label="Grants"
              hint="Free funding for a project or mission. You usually do not sell a product to the government."
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
              hint="You want to explore grants and contracts. We will still show one home screen at a time."
            />
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            title="Where do you work?"
            subtitle="We use this to show your state’s official portals and filter results."
          >
            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Your name or organization name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Services LLC"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                State *
              </span>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 bg-white"
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
                  City
                </span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  ZIP
                </span>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                />
              </label>
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell
            title="What do you do?"
            subtitle="Write a few plain sentences. This helps match results and fill draft forms later."
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Example: We install energy-efficient lighting for small businesses in Georgia."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Topics (pick any that fit)
            </p>
            <div className="flex flex-wrap gap-2">
              {KEYWORD_CHIPS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleKeyword(k)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    keywords.includes(k)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
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
            subtitle="No exact numbers needed — ranges are enough."
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
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold text-left ${
                    sizeBand === id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-700'
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
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold text-left ${
                    fundingNeedBand === id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-700'
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
            title="Anything else we should know?"
            subtitle="Optional. These can unlock special programs later."
          >
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
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold text-left ${
                    flags[key]
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-700'
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
                  EIN (optional for now)
                </span>
                <input
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                  placeholder="XX-XXXXXXX"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                />
              </label>
            )}
            <p className="text-xs text-slate-500 leading-relaxed pt-2">
              Next we will open your home screen. Search uses real free government data (Grants.gov
              and USASpending). AI only helps explain and write — it never invents fake listings.
            </p>
          </StepShell>
        )}

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
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canNext() || busy}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-emerald-600/20"
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
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active
          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
          : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 p-2 rounded-lg ${
            active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
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
