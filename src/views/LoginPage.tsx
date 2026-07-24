'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import PoweredBy from '../components/PoweredBy';
import { Field, Modal } from '../components/ui';
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
      {/* ── Left / art side ── */}
      <div className="relative lg:w-[45%] min-h-[180px] lg:min-h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-100/70">
        <img
          src={BRAND.assets.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
        <div className="relative z-10 flex h-full min-h-[180px] lg:min-h-screen flex-col justify-end p-6 lg:p-12 text-white">
          <button
            type="button"
            onClick={onBack}
            className="absolute left-4 top-4 lg:left-8 lg:top-8 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/30 backdrop-blur px-3 py-2 text-xs font-bold text-white hover:bg-black/45 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to home
          </button>
          <img
            src={BRAND.assets.wave}
            alt=""
            className="hidden lg:block h-28 w-28 object-contain depth-shadow gg-float-slow mb-5"
            draggable={false}
          />
          <div className="flex items-center gap-3">
            <img
              src={BRAND.assets.logo}
              alt=""
              className="h-12 w-12 object-contain depth-shadow"
              draggable={false}
            />
            <div>
              <p className="font-display text-xl font-bold tracking-tight">{BRAND.name}</p>
              <p className="text-sm text-emerald-100/90">{BRAND.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right / form side ── */}
      <div className="relative flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="aurora-field" aria-hidden="true" />
        <div className="relative w-full max-w-md glass-panel rounded-[2rem] p-6 sm:p-8 md:p-10">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {authMode === 'signin' ? 'Log in' : 'Create account'}
            </h1>
            <button
              type="button"
              onClick={() => setWhatIsOpen(true)}
              className="btn btn-ghost btn-sm shrink-0 text-emerald-700"
            >
              <HelpCircle className="h-4 w-4" /> Help
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-5 leading-relaxed">
            Sign in to save your industry, searches, and drafts. Free to start.
          </p>

          {/* Plain-English glossary */}
          <div className="mb-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl glass-emerald p-3">
              <p className="text-xs font-bold text-emerald-900 mb-1">Grant</p>
              <p className="text-xs text-slate-600 leading-snug line-clamp-3">
                {GLOSSARY.grant.body}
              </p>
            </div>
            <div className="rounded-2xl glass-gold p-3">
              <p className="text-xs font-bold text-amber-900 mb-1">Contract</p>
              <p className="text-xs text-slate-600 leading-snug line-clamp-3">
                {GLOSSARY.contract.body}
              </p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-2xl bg-slate-100/90 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
              }}
              aria-pressed={authMode === 'signin'}
              className={`flex-1 min-h-[40px] py-2 text-xs font-bold rounded-xl transition-colors ${
                authMode === 'signin' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
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
              aria-pressed={authMode === 'signup'}
              className={`flex-1 min-h-[40px] py-2 text-xs font-bold rounded-xl transition-colors ${
                authMode === 'signup' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Create account
            </button>
          </div>

          <form
            className="space-y-4"
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
              <Field label="Your name" htmlFor="auth-name">
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="field"
                />
              </Field>
            )}
            <Field label="Email" htmlFor="auth-email">
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="field"
              />
            </Field>
            <Field label="Password" htmlFor="auth-password">
              <input
                id="auth-password"
                type="password"
                autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (6+ characters)"
                className="field"
              />
            </Field>
            {authError && (
              <p
                role="alert"
                className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-snug"
              >
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={authBusy}
              className="btn btn-primary w-full min-h-[48px]"
            >
              {authBusy ? 'Please wait…' : authMode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">or</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => loginWithGoogle().catch((e) => setAuthError(e.message))}
            className="btn btn-secondary w-full min-h-[48px]"
          >
            Continue with Google
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onDemo}
            className="btn btn-ghost w-full mt-3 min-h-[44px]"
          >
            Try a demo (no account)
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full mt-1 rounded-lg py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to landing page
          </button>

          <div className="mt-6">
            <PoweredBy />
          </div>
        </div>
      </div>

      <Modal
        open={whatIsOpen}
        onClose={() => setWhatIsOpen(false)}
        title="What is Grant Genie?"
        footer={
          <button
            type="button"
            onClick={() => setWhatIsOpen(false)}
            className="btn btn-primary w-full"
          >
            Got it
          </button>
        }
      >
        <img
          src={BRAND.assets.wave}
          alt=""
          className="mx-auto mb-4 h-24 w-24 object-contain depth-shadow gg-float"
          draggable={false}
        />
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          A simple helper to find <strong>real</strong> U.S. government grants and contracts. We use
          free official data and explain things in plain English.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          We never invent listings. You always apply on the government’s own website.
        </p>
      </Modal>
    </div>
  );
}
