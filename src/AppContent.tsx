import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  Search,
  PenTool,
  Database,
  Settings,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronRight,
  Zap,
  Menu,
  X,
  HandCoins,
  FileSignature,
} from 'lucide-react';
import { useAuth } from './components/AuthProvider';
import PoweredBy from './components/PoweredBy';
import {
  loginWithGoogle,
  logout,
  signInWithEmail,
  signUpWithEmail,
} from './auth';
import { getGlobalAdvice } from './services/geminiService';
import type { Sector } from './types';

import MissionControl from './views/MissionControl';
import DiscoveryRadar from './views/DiscoveryRadar';
import OracleWriter from './views/OracleWriter';
import PipelineCommander from './views/PipelineCommander';
import DataVault from './views/DataVault';
import Onboarding from './views/Onboarding';
import SettingsView from './views/Settings';
import ProfileView from './views/ProfileView';

type View =
  | 'mission'
  | 'radar'
  | 'writer'
  | 'pipeline'
  | 'vault'
  | 'onboarding'
  | 'settings'
  | 'profile';

export default function AppContent() {
  const {
    user,
    loading,
    organization,
    profile,
    isDemo,
    enterDemo,
    exitDemo,
  } = useAuth();
  const [activeView, setActiveView] = React.useState<View>('mission');
  const [selectedGrantForDraft, setSelectedGrantForDraft] = React.useState<any>(null);
  const [genieOpen, setGenieOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [globalAdvice, setGlobalAdvice] = React.useState<string | null>(null);
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authBusy, setAuthBusy] = React.useState(false);

  /** Active sector for Find view — defaults from profile */
  const [activeSector, setActiveSector] = React.useState<'grants' | 'contracts'>('grants');

  React.useEffect(() => {
    if (profile?.sector === 'contracts') setActiveSector('contracts');
    else if (profile?.sector === 'grants' || profile?.sector === 'both') setActiveSector('grants');
  }, [profile?.sector]);

  React.useEffect(() => {
    if (genieOpen && (organization || profile)) {
      setGlobalAdvice(null);
      const mission = profile?.description || organization?.mission || '';
      getGlobalAdvice(mission, activeView).then(setGlobalAdvice);
    }
  }, [genieOpen, activeView, organization, profile]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles className="w-12 h-12 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-emerald-100/50 via-transparent to-transparent pointer-events-none" />
        <div className="z-10 w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-2xl">
          <div className="flex items-center justify-center mb-5">
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-600/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center text-slate-900 mb-2">
            Grant Genie
          </h1>
          <p className="text-center text-slate-500 mb-6 text-sm leading-relaxed">
            Find real government grants and contracts. Sign in to save your profile, track
            progress, and get plain-English help writing applications.
          </p>

          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg ${
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
              className={`flex-1 py-2 text-xs font-bold rounded-lg ${
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
                if (authMode === 'signup') {
                  await signUpWithEmail(email, password, displayName);
                } else {
                  await signInWithEmail(email, password);
                }
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
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (6+ characters)"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
            />
            {authError && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={authBusy}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
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
            className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          >
            Continue with Google
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={enterDemo}
            className="w-full mt-3 text-xs font-semibold text-slate-500 hover:text-emerald-700 py-2"
          >
            Try a demo (no account)
          </button>

          <div className="mt-6">
            <PoweredBy />
          </div>
        </div>
      </div>
    );
  }

  const needsSetup = !isDemo && (!profile || !profile.profileComplete);
  if (needsSetup) {
    return <Onboarding onComplete={() => setActiveView('mission')} />;
  }

  const handleStartDraft = (grant: any) => {
    setSelectedGrantForDraft(grant);
    setActiveView('writer');
    setGenieOpen(false);
  };

  const findLabel = activeSector === 'contracts' ? 'Find contracts' : 'Find grants';

  const renderView = () => {
    switch (activeView) {
      case 'mission':
        return (
          <MissionControl onNavigate={setActiveView} onStartDraft={handleStartDraft} />
        );
      case 'radar':
        return (
          <DiscoveryRadar
            onStartDraft={handleStartDraft}
            sector={activeSector}
            onSectorChange={setActiveSector}
          />
        );
      case 'writer':
        return (
          <OracleWriter
            grant={selectedGrantForDraft}
            onBack={() => setActiveView('pipeline')}
          />
        );
      case 'pipeline':
        return <PipelineCommander onStartDraft={handleStartDraft} />;
      case 'vault':
        return <DataVault />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'onboarding':
        return <Onboarding onComplete={() => setActiveView('mission')} />;
      default:
        return (
          <MissionControl onNavigate={setActiveView} onStartDraft={handleStartDraft} />
        );
    }
  };

  const sector: Sector = profile?.sector || 'grants';
  const showBoth = sector === 'both';

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
      <aside className="hidden md:flex w-20 lg:w-64 border-r border-slate-200 flex-col items-center lg:items-stretch bg-white">
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 hidden lg:block">
              Grant Genie
            </span>
          </div>
        </div>

        {(showBoth || true) && (
          <div className="px-3 pt-4 hidden lg:block">
            <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Looking for
            </p>
            <div className="flex flex-col gap-1">
              <SectorBtn
                active={activeSector === 'grants'}
                onClick={() => {
                  setActiveSector('grants');
                  setActiveView('radar');
                }}
                icon={<HandCoins className="w-4 h-4" />}
                label="Grants"
                hint="Free funding"
              />
              <SectorBtn
                active={activeSector === 'contracts'}
                onClick={() => {
                  setActiveSector('contracts');
                  setActiveView('radar');
                }}
                icon={<FileSignature className="w-4 h-4" />}
                label="Contracts"
                hint="Paid government work"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 mt-6 flex flex-col gap-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">
            Main
          </div>
          <SidebarItem
            icon={<BarChart3 />}
            label="Home"
            active={activeView === 'mission'}
            onClick={() => setActiveView('mission')}
          />
          <SidebarItem
            icon={<Search />}
            label={findLabel}
            active={activeView === 'radar'}
            onClick={() => setActiveView('radar')}
          />

          <div className="mt-6 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">
            Work
          </div>
          <SidebarItem
            icon={<Database />}
            label="My files"
            active={activeView === 'vault'}
            onClick={() => setActiveView('vault')}
          />
          <SidebarItem
            icon={<Zap />}
            label="My applications"
            active={activeView === 'pipeline'}
            onClick={() => setActiveView('pipeline')}
          />
          <SidebarItem
            icon={<PenTool />}
            label="Draft helper"
            active={activeView === 'writer'}
            onClick={() => setActiveView('writer')}
          />
          <div className="mt-6 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">
            Account
          </div>
          <SidebarItem
            icon={<UserIcon />}
            label="Profile"
            active={activeView === 'profile'}
            onClick={() => setActiveView('profile')}
          />
          <SidebarItem
            icon={<Settings />}
            label="Settings"
            active={activeView === 'settings'}
            onClick={() => setActiveView('settings')}
          />
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 mt-auto flex flex-col gap-4">
          <button
            onClick={() => {
              if (isDemo) exitDemo();
              else logout();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
          >
            <LogOut className="w-5 h-5 ml-1 lg:ml-0" />
            <span className="hidden lg:block text-sm font-semibold">
              {isDemo ? 'Exit demo' : 'Log out'}
            </span>
          </button>
          <div className="hidden lg:block pt-2">
            <PoweredBy />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-wide">
                {activeSector === 'contracts' ? 'Contracts' : 'Grants'}
              </span>
              <span className="hidden sm:inline px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Real free data
              </span>
              {isDemo && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[10px] font-bold uppercase tracking-wide">
                  Demo
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden md:block">
              <span className="text-sm font-bold text-slate-900">
                {user.displayName || profile?.name || 'User'}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">
                {profile?.name || organization?.name || 'My profile'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" />
              ) : (
                <UserIcon className="w-5 h-5 text-slate-500" />
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeView}-${activeSector}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI helper */}
        <div className="fixed bottom-8 right-8 z-50">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <button
              onClick={() => setGenieOpen(!genieOpen)}
              className="bg-slate-900 hover:bg-slate-800 p-4 rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-700 transition-all group overflow-hidden relative"
              aria-label="Open AI helper"
            >
              <div className="absolute inset-0 bg-emerald-500/20 group-hover:opacity-100 opacity-0 transition-opacity" />
              <div className="bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center relative z-10">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </button>
          </motion.div>

          <AnimatePresence>
            {genieOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="absolute bottom-20 right-0 w-80 bg-slate-900 text-white border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">AI helper</h3>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      Plain English · powered by Gemini
                    </div>
                  </div>
                </div>
                {globalAdvice ? (
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">{globalAdvice}</p>
                ) : (
                  <div className="flex items-center justify-center py-6 mb-5">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    >
                      <Sparkles className="w-8 h-8 text-emerald-500/50" />
                    </motion.div>
                  </div>
                )}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('writer');
                      setGenieOpen(false);
                    }}
                    className="w-full text-xs text-center px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                  >
                    Help me write a draft
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('radar');
                      setGenieOpen(false);
                    }}
                    className="w-full text-xs text-center px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                  >
                    Find opportunities
                  </button>
                </div>
                <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
                  AI never invents listings. Always open the official page and check the rules.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xl tracking-tight text-slate-800">Grant Genie</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
                <MobileMenuItem
                  icon={<HandCoins />}
                  label="Grants"
                  active={activeSector === 'grants'}
                  onClick={() => {
                    setActiveSector('grants');
                    setActiveView('radar');
                    setMobileMenuOpen(false);
                  }}
                />
                <MobileMenuItem
                  icon={<FileSignature />}
                  label="Contracts"
                  active={activeSector === 'contracts'}
                  onClick={() => {
                    setActiveSector('contracts');
                    setActiveView('radar');
                    setMobileMenuOpen(false);
                  }}
                />
                <MobileMenuItem
                  icon={<BarChart3 />}
                  label="Home"
                  active={activeView === 'mission'}
                  onClick={() => {
                    setActiveView('mission');
                    setMobileMenuOpen(false);
                  }}
                />
                <MobileMenuItem
                  icon={<Search />}
                  label={findLabel}
                  active={activeView === 'radar'}
                  onClick={() => {
                    setActiveView('radar');
                    setMobileMenuOpen(false);
                  }}
                />
                <MobileMenuItem
                  icon={<Zap />}
                  label="My applications"
                  active={activeView === 'pipeline'}
                  onClick={() => {
                    setActiveView('pipeline');
                    setMobileMenuOpen(false);
                  }}
                />
                <MobileMenuItem
                  icon={<PenTool />}
                  label="Draft helper"
                  active={activeView === 'writer'}
                  onClick={() => {
                    setActiveView('writer');
                    setMobileMenuOpen(false);
                  }}
                />
                <MobileMenuItem
                  icon={<UserIcon />}
                  label="Profile"
                  active={activeView === 'profile'}
                  onClick={() => {
                    setActiveView('profile');
                    setMobileMenuOpen(false);
                  }}
                />
              </nav>
              <div className="p-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (isDemo) exitDemo();
                    else logout();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    {isDemo ? 'Exit demo' : 'Log out'}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectorBtn({
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
      className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-left transition-all ${
        active
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
          : 'hover:bg-slate-50 border border-transparent text-slate-600'
      }`}
    >
      <span className={active ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>
      <span>
        <span className="block text-sm font-bold">{label}</span>
        <span className="block text-[10px] text-slate-500">{hint}</span>
      </span>
    </button>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        active
          ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-100'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="w-6 h-6 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </div>
      <span className="hidden lg:block text-sm">{label}</span>
    </button>
  );
}

function MobileMenuItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3.5 rounded-xl transition-all ${
        active ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <div className="w-6 h-6 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}
