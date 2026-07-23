'use client';

import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { saveLocalProfile, stripUndefined } from '../lib/profileStore';
import type { UserProfile } from '../types';
import InfoTip from './InfoTip';

export const INDUSTRY_CHIPS = [
  'Health',
  'Education',
  'Construction',
  'IT services',
  'Agriculture',
  'Arts',
  'Environment',
  'Transportation',
  'Defense',
  'Nonprofit',
  'Workforce',
  'Housing',
  'Research',
  'Energy',
] as const;

type Props = {
  /** Called when keywords change (after save) — e.g. re-run search */
  onSpecsChange?: (keywords: string[]) => void;
  compact?: boolean;
};

/**
 * Live industry / work specs — changing chips updates profile and triggers search.
 */
export default function SpecsBar({ onSpecsChange, compact }: Props) {
  const { user, profile, refreshProfile, isDemo } = useAuth();
  const [keywords, setKeywords] = useState<string[]>(profile?.keywords || []);
  const [custom, setCustom] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setKeywords(profile?.keywords || []);
  }, [profile?.uid, profile?.keywords?.join('|')]);

  const persist = async (next: string[]) => {
    setKeywords(next);
    onSpecsChange?.(next);
    if (!user || isDemo || user.uid === 'demo-user-123') {
      if (profile) {
        saveLocalProfile({ ...profile, keywords: next, updatedAt: new Date().toISOString() });
      }
      return;
    }
    setSaving(true);
    const updated: UserProfile = {
      ...(profile || {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        profileComplete: true,
        sector: 'grants',
        entityType: 'other',
      }),
      uid: user.uid,
      keywords: next,
      updatedAt: new Date().toISOString(),
    };
    saveLocalProfile(updated);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        stripUndefined({ keywords: next, updatedAt: updated.updatedAt }),
        { merge: true }
      );
      await refreshProfile();
    } catch (e) {
      console.warn('Specs save failed (local kept):', e);
    } finally {
      setSaving(false);
    }
  };

  const toggle = (k: string) => {
    const next = keywords.includes(k) ? keywords.filter((x) => x !== k) : [...keywords, k];
    void persist(next);
  };

  const addCustom = () => {
    const t = custom.trim();
    if (!t) return;
    if (keywords.some((k) => k.toLowerCase() === t.toLowerCase())) {
      setCustom('');
      return;
    }
    void persist([...keywords, t]);
    setCustom('');
  };

  return (
    <div
      data-tour="specs"
      className={`rounded-2xl border border-emerald-100 bg-white/90 shadow-sm ${
        compact ? 'p-3' : 'p-4 sm:p-5'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          What industry / work?
        </p>
        <InfoTip title="Change this anytime" label="About industry specs">
          Pick the topics you work in. We use them to search grants and contracts. Change chips
          anytime — search updates automatically.
        </InfoTip>
        {saving && <span className="text-[10px] text-emerald-600 font-semibold">Saving…</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {INDUSTRY_CHIPS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => toggle(k)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold border transition-colors ${
              keywords.includes(k)
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Add your own (e.g. solar, daycare)"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600"
        >
          Add
        </button>
      </div>
      {keywords.length > 0 && (
        <p className="mt-2 text-[11px] text-slate-500">
          Searching for: <span className="font-semibold text-slate-800">{keywords.join(' · ')}</span>
        </p>
      )}
    </div>
  );
}

export function keywordsToQuery(keywords: string[]): string {
  if (!keywords.length) return 'community';
  return keywords.slice(0, 3).join(' ');
}
