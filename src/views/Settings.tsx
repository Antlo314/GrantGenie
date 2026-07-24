import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, CheckCircle2, LogOut, BookOpen, Target, User } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { logout } from '../auth';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { stripUndefined } from '../lib/profileStore';
import PageHeader from '../components/PageHeader';
import { Field, SectionLabel } from '../components/ui';
import { PAGE_HINTS } from '../lib/hints';

const spring = (delay = 0) => ({
  type: 'spring' as const,
  stiffness: 220,
  damping: 24,
  delay,
});

export default function SettingsView({ onReplayTour }: { onReplayTour?: () => void }) {
  const { organization, profile, user, refreshProfile, isDemo, exitDemo } = useAuth();
  const h = PAGE_HINTS.settings;

  const [formData, setFormData] = useState({
    name: profile?.name || organization?.name || '',
    description: profile?.description || organization?.mission || '',
    ein: profile?.ein || organization?.ein || '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user || isDemo) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const einClean = formData.ein.trim();
      await setDoc(
        doc(db, 'users', user.uid),
        stripUndefined({
          name: formData.name.trim(),
          description: formData.description.trim(),
          ...(einClean ? { ein: einClean } : {}),
          updatedAt: new Date().toISOString(),
        }),
        { merge: true }
      );
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
      setError('Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (isDemo) {
      exitDemo();
      return;
    }
    try {
      await logout();
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <div className="max-w-4xl w-full space-y-2 pb-16">
      <PageHeader
        title={h.title}
        subtitle={h.subtitle}
        hint={h.hint}
        infoTitle="What lives here?"
        infoBody="One page for you: the profile that powers search and drafts, your account, and the beginner tour. Nothing here costs money."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-4">
          {/* ── Your profile ── */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0)}
            className="bento-tile p-6 sm:p-8 space-y-5"
          >
            <div>
              <SectionLabel>Your profile</SectionLabel>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                We use this when you score your fit and when the draft helper writes for you.
              </p>
            </div>

            <Field label="Name or organization" htmlFor="settings-name">
              <input
                id="settings-name"
                type="text"
                className="field font-semibold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Field>

            <Field
              label="EIN"
              htmlFor="settings-ein"
              hint="Optional. The 9-digit tax ID for organizations — skip it if you don't have one."
            >
              <input
                id="settings-ein"
                type="text"
                className="field font-mono"
                placeholder="XX-XXXXXXX"
                value={formData.ein}
                onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
              />
            </Field>

            <Field
              label="What you do"
              htmlFor="settings-description"
              hint="A few plain sentences. The clearer this is, the better your matches and drafts."
            >
              <textarea
                id="settings-description"
                rows={6}
                className="field resize-none leading-relaxed"
                placeholder="A few plain sentences about your work or mission…"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Field>

            <p className="text-xs text-slate-500">
              Looking for:{' '}
              <span className="font-bold text-slate-800 capitalize">{profile?.sector || 'grants'}</span>
              {' · '}
              Type:{' '}
              <span className="font-bold text-slate-800 capitalize">{profile?.entityType || '—'}</span>
              {' · '}
              State: <span className="font-bold text-slate-800">{profile?.state || '—'}</span>
              <span className="block mt-1">These come from your Get started answers.</span>
            </p>

            {error && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              {saved && (
                <span className="text-xs font-bold text-emerald-700">Saved — you're set.</span>
              )}
              <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary">
                {saving ? (
                  'Saving…'
                ) : saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" aria-hidden="true" /> Save
                  </>
                )}
              </button>
            </div>
          </motion.section>

          {/* ── Account ── */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0.08)}
            className="bento-tile p-6 sm:p-8 space-y-4"
          >
            <SectionLabel>Account</SectionLabel>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  aria-hidden="true"
                  className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0"
                >
                  <User className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user?.displayName || profile?.name || 'Signed in'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || '—'}</p>
                </div>
              </div>
              <button type="button" onClick={handleLogout} className="btn btn-danger">
                <LogOut className="w-4 h-4" aria-hidden="true" />
                {isDemo ? 'Exit demo' : 'Log out'}
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              {isDemo
                ? 'You are in the demo — nothing is saved to a real account. Exiting takes you back to sign-in.'
                : 'Logging out never deletes anything. Sign back in anytime to pick up where you left off.'}
            </p>
          </motion.section>
        </div>

        <div className="space-y-4">
          {/* ── Learning ── */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0.14)}
            className="glass-emerald rounded-[2rem] p-6 space-y-3"
          >
            <SectionLabel>Learning</SectionLabel>
            <p className="text-sm text-slate-700 leading-relaxed">
              The tour walks you through finding, saving, and drafting — about one minute.
            </p>
            {onReplayTour && (
              <button type="button" onClick={onReplayTour} className="btn btn-primary w-full">
                <BookOpen className="w-4 h-4" aria-hidden="true" /> Replay beginner tour
              </button>
            )}
          </motion.section>

          {/* ── Why this matters ── */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0.2)}
            className="glass-panel-dark noise-overlay rounded-[2rem] p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"
              >
                <Target className="w-4 h-4 text-emerald-400" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Why this matters
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Your description is what we read when you click “Score my fit” and when the draft
              helper writes a first draft. Listings themselves always come from real government
              databases — never from us.
            </p>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
              <li>Grants search: Grants.gov (open now)</li>
              <li>Contracts search: USASpending past awards (for now)</li>
              <li>Always open the official page before you apply or bid</li>
            </ul>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
