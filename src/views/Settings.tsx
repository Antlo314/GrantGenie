import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Settings as SettingsIcon, Target, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Settings() {
  const { organization, profile, user, refreshProfile, isDemo } = useAuth();

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
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          ein: formData.ein.trim() || null,
          updatedAt: new Date().toISOString(),
        },
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col pb-12 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
            Account
          </h2>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Update your name and what you do. This powers search hints and AI drafts.
          </p>
        </motion.div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-xl font-bold text-sm text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {saving ? (
            'Saving…'
          ) : saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
              <SettingsIcon className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                Your info
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 block mb-2">
                  Name or organization
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 block mb-2">
                  EIN (optional)
                </label>
                <input
                  type="text"
                  value={formData.ein}
                  onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                  placeholder="XX-XXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 block mb-2">
                  What you do
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                  placeholder="A few plain sentences about your work or mission…"
                />
              </div>

              <div className="text-xs text-slate-500">
                Looking for:{' '}
                <span className="font-bold text-slate-800 capitalize">
                  {profile?.sector || 'grants'}
                </span>
                {' · '}
                Type:{' '}
                <span className="font-bold text-slate-800 capitalize">
                  {profile?.entityType || '—'}
                </span>
                {' · '}
                State:{' '}
                <span className="font-bold text-slate-800">{profile?.state || '—'}</span>
                <p className="mt-1">Change these in Profile or re-run Get started from Profile later.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Why this matters
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Your description is used when you click “Score my fit” and when the AI helper writes
              draft text. Listings still come only from government databases.
            </p>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
              <li>Grants search: Grants.gov (open now)</li>
              <li>Contracts search: USASpending past awards (for now)</li>
              <li>Always open the official page before you apply or bid</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
