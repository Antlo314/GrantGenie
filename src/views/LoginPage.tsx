'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, X } from 'lucide-react';
import GenieAvatar from '../components/GenieAvatar';
import PoweredBy from '../components/PoweredBy';
import { BRAND } from '../lib/brand';
import { GLOSSARY } from '../lib/hints';
import { loginWithGoogle, signInWithEmail, signUpWithEmail } from '../auth';

type Props = {
  onBack: () => void;
  onDemo: () => void;
};

/**
 * Login / create account — only after landing.
 */
export default function LoginPage({ onBack, onDemo }: Props) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [whatIsOpen, setWhatIsOpen] = useState(false);

  return (
    <div className="min-h-screen w-full gg-app-bg text-slate-900 flex flex-col lg:flex-row">
      <div className="relative lg:w-[45%] min-h-[180px] lg:min-h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-100">
        <img
          src={BRAND.assets.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/25 to-transparent" />
        <div className="relative z-10 flex h-full min-h-[180px] lg:min-h-screen flex-col justify-end p-6 lg:p-12 text-white">
          <button
            type="button"
            onClick={onBack}
            className="absolute left-4 top-4 lg:left-8 lg:top-8 inline-flex items-center gap-1 rounded-full bg-black/30 backdrop-blur px-3 py-2 text-xs font-bold text-white hover:bg-black/45"
          >
            <ChevronLeft className="h-4 w-4" /> Back to home
          </button>
          <div className="flex items-center gap-3 mb-3">
            <img src={BRAND.assets.logo} alt="" className="h-12 w-12 object-contain drop-shadow-lg" />
            <div>
              <p className="text-xl font-black tracking-tight">{BRAND.name}</p>
              <p className="text-sm text-emerald-100">{BRAND.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-900/5">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {authMode === 'signin' ? 'Log in' : 'Create account'}
            </h1>
            <button
              type="button"
              onClick={() => setWhatIsOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 shrink-0"
            >
              <HelpCircle className="h-4 w-4" /> Help
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            Sign in to save your industry, searches, and drafts. Free to start.
          </p>

          <div className="mb-5 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-3">
              <p className="font-bold text-emerald-900 mb-1">Grant</p>
              <p className="text-slate-600 leading-snug line-clamp-3">{GLOSSARY.grant.body}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
              <p className="font-bold text-amber-900 mb-1">Contract</p>
              <p className="text-slate-600 leading-snug line-clamp-3">{GLOSSARY.contract.body}</p>
            </div>
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
              }}
              className={`flex-1 min-h-[40px] py-2 text-xs font-bold rounded-lg ${
                authMode === 'signin' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError(null);
              }}
              className={`flex-1 min-h-[40px] py-2 text-xs font-bold rounded-lg ${
                authMode === 'signup' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              Create account
            </button>
          </div>

          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setAuthBusy(true);
              setAuthError(null);
              try {
                if (authMode === 'signup') await signUpWithEmail(email, password, displayName);
                else await signInWithEmail(email, password);
              } catch (err: unknown) {
                setAuthError(
                  err instanceof Error ? err.message : 'Sign-in failed. Check email and password.'
                );
              } finally {
                setAuthBusy(false);
              }
            }}
          >
            {authMode === 'signup' && (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 min-h-[48px]"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 min-h-[48px]"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (6+ characters)"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 min-h-[48px]"
            />
            {authError && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={authBusy}
              className="w-full min-h-[48px] bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-500 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
            >
              {authBusy ? 'Please wait…' : authMode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-slate-400">
              <span className="bg-white px-3">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loginWithGoogle().catch((e) => setAuthError(e.message))}
            className="w-full min-h-[48px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          >
            Continue with Google
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onDemo}
            className="w-full mt-3 min-h-[44px] text-xs font-semibold text-slate-500 hover:text-emerald-700 py-2"
          >
            Try a demo (no account)
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full mt-1 text-xs font-semibold text-slate-400 hover:text-slate-600 py-2"
          >
            ← Back to landing page
          </button>

          <div className="mt-6">
            <PoweredBy />
          </div>
        </div>
      </div>

      {whatIsOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl border border-emerald-100 max-h-[85dvh] overflow-y-auto">
            <div className="flex justify-between items-start mb-3">
              <GenieAvatar src={BRAND.assets.wave} size={56} float />
              <button type="button" onClick={() => setWhatIsOpen(false)} className="p-2 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">What is Grant Genie?</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              A simple helper to find <strong>real</strong> U.S. government grants and contracts. We
              use free official data and explain things in plain English.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              We never invent listings. You always apply on the government’s own website.
            </p>
            <button
              type="button"
              onClick={() => setWhatIsOpen(false)}
              className="w-full min-h-[48px] rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
