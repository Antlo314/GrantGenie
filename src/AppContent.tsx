import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  Search,
  PenTool,
  Database,
  Settings,
  User as UserIcon,
  LogOut,
  Zap,
  Menu,
  X,
  HandCoins,
  FileSignature,
} from 'lucide-react';
import { useAuth } from './components/AuthProvider';
import PoweredBy from './components/PoweredBy';
import GenieAvatar from './components/GenieAvatar';
import GenieWidget from './components/GenieWidget';
import ProductTour, { hasCompletedTour, resetTour } from './components/ProductTour';
import InfoTip from './components/InfoTip';
import { logout } from './auth';
import { getGlobalAdvice } from './services/geminiService';
import { BRAND } from './lib/brand';
import { GLOSSARY, PAGE_HINTS } from './lib/hints';

import MissionControl from './views/MissionControl';
import DiscoveryRadar from './views/DiscoveryRadar';
import OracleWriter from './views/OracleWriter';
import PipelineCommander from './views/PipelineCommander';
import DataVault from './views/DataVault';
import Onboarding from './views/Onboarding';
import SettingsView from './views/Settings';
import ProfileView from './views/ProfileView';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import WorkspaceSwitcher from './components/WorkspaceSwitcher';

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
  const [genieLoading, setGenieLoading] = React.useState(false);
  /** Public: landing → login → (auth) app */
  const [publicGate, setPublicGate] = React.useState<'landing' | 'login'>('landing');
  const [tourOpen, setTourOpen] = React.useState(false);
  const [activeSector, setActiveSector] = React.useState<'grants' | 'contracts'>('grants');
  const tourBootstrapped = React.useRef(false);

  React.useEffect(() => {
    if (profile?.sector === 'contracts') setActiveSector('contracts');
    else if (profile?.sector === 'grants' || profile?.sector === 'both') setActiveSector('grants');
  }, [profile?.sector]);

  // Clear detailed answer when view changes; keep Genie light until asked
  React.useEffect(() => {
    setGlobalAdvice(null);
  }, [activeView]);

  // First-time tour after profile is ready
  React.useEffect(() => {
    if (!user || !profile?.profileComplete || tourBootstrapped.current) return;
    tourBootstrapped.current = true;
    if (!hasCompletedTour()) {
      const t = window.setTimeout(() => setTourOpen(true), 600);
      return () => window.clearTimeout(t);
    }
  }, [user, profile?.profileComplete]);

  const askGenie = React.useCallback(
    async (question: string) => {
      setGenieLoading(true);
      setGlobalAdvice(null);
      try {
        const mission = profile?.description || organization?.mission || '';
        const prompt = `User question: ${question}. Context page: ${activeView}. User work: ${mission}. Answer in plain English, short paragraphs, for a beginner. Never invent grant or contract titles.`;
        const text = await getGlobalAdvice(prompt, activeView);
        setGlobalAdvice(text);
      } finally {
        setGenieLoading(false);
      }
    },
    [activeView, organization?.mission, profile?.description]
  );

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gg-app-bg text-slate-900 gap-4">
        <GenieAvatar src={BRAND.assets.widget} size={80} float />
        <p className="text-sm font-semibold text-emerald-700">Waking up the Genie…</p>
      </div>
    );
  }

  if (!user) {
    if (publicGate === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setPublicGate('login')}
          onDemo={enterDemo}
        />
      );
    }
    return (
      <LoginPage
        onBack={() => setPublicGate('landing')}
        onDemo={enterDemo}
      />
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
          <MissionControl
            onNavigate={setActiveView}
            onStartDraft={handleStartDraft}
            onStartTour={() => {
              resetTour();
              setTourOpen(true);
            }}
          />
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
        return (
          <SettingsView
            onReplayTour={() => {
              resetTour();
              setTourOpen(true);
            }}
          />
        );
      case 'onboarding':
        return <Onboarding onComplete={() => setActiveView('mission')} />;
      default:
        return (
          <MissionControl
            onNavigate={setActiveView}
            onStartDraft={handleStartDraft}
            onStartTour={() => {
              resetTour();
              setTourOpen(true);
            }}
          />
        );
    }
  };

  return (
    <div className="h-screen w-screen gg-app-bg text-slate-900 flex overflow-hidden font-sans">
      <aside className="hidden md:flex w-20 lg:w-64 border-r border-emerald-100/80 flex-col items-center lg:items-stretch gg-sidebar">
        <div className="p-5 border-b border-emerald-50">
          <div className="flex items-center gap-2.5">
            <img src={BRAND.assets.logo} alt="" className="h-10 w-10 object-contain" />
            <div className="hidden lg:block min-w-0">
              <p className="font-black text-slate-900 tracking-tight leading-none">Grant Genie</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Real .gov data</p>
            </div>
          </div>
        </div>

        <div className="px-3 pt-4 hidden lg:block" data-tour="sector">
          <div className="px-2 mb-2 flex items-center gap-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Looking for
            </p>
            <InfoTip title="Grant or contract?" label="Grant vs contract">
              <p className="mb-2"><strong>Grant:</strong> {GLOSSARY.grant.body}</p>
              <p><strong>Contract:</strong> {GLOSSARY.contract.body}</p>
            </InfoTip>
          </div>
          <div className="flex flex-col gap-1">
            <SectorBtn
              active={activeSector === 'grants'}
              onClick={() => {
                setActiveSector('grants');
                setActiveView('radar');
              }}
              icon={<HandCoins className="w-4 h-4" />}
              label="Grants"
              hint="Free money for a project"
            />
            <SectorBtn
              active={activeSector === 'contracts'}
              onClick={() => {
                setActiveSector('contracts');
                setActiveView('radar');
              }}
              icon={<FileSignature className="w-4 h-4" />}
              label="Contracts"
              hint="Paid work for the government"
            />
          </div>
        </div>

        <nav className="flex-1 px-3 mt-5 flex flex-col gap-1">
          <SidebarItem icon={<BarChart3 />} label="Home" active={activeView === 'mission'} onClick={() => setActiveView('mission')} />
          <div data-tour="find-nav">
            <SidebarItem icon={<Search />} label={findLabel} active={activeView === 'radar'} onClick={() => setActiveView('radar')} />
          </div>
          <div data-tour="pipeline-nav">
            <SidebarItem icon={<Zap />} label="My applications" active={activeView === 'pipeline'} onClick={() => setActiveView('pipeline')} />
          </div>
          <SidebarItem icon={<PenTool />} label="Draft helper" active={activeView === 'writer'} onClick={() => setActiveView('writer')} />
          <SidebarItem icon={<Database />} label="My files" active={activeView === 'vault'} onClick={() => setActiveView('vault')} />
          <div className="my-2 border-t border-emerald-50 mx-2" />
          <SidebarItem icon={<UserIcon />} label="Profile" active={activeView === 'profile'} onClick={() => setActiveView('profile')} />
          <SidebarItem icon={<Settings />} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
        </nav>

        <div className="p-4 border-t border-emerald-50 mt-auto">
          <button
            onClick={() => (isDemo ? exitDemo() : logout())}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white text-slate-500 hover:text-slate-900 transition-all"
          >
            <LogOut className="w-5 h-5" />
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
        <header className="h-16 border-b border-emerald-100/60 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-20 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-emerald-50 rounded-xl transition-colors text-slate-700"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2" data-tour="sector-mobile">
              <button
                type="button"
                onClick={() => {
                  setActiveSector('grants');
                  setActiveView('radar');
                }}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  activeSector === 'grants'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/25'
                    : 'bg-white/80 text-emerald-800 border-emerald-100 hover:bg-emerald-50'
                }`}
              >
                Grants
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSector('contracts');
                  setActiveView('radar');
                }}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  activeSector === 'contracts'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/25'
                    : 'bg-white/80 text-amber-900 border-amber-100 hover:bg-amber-50'
                }`}
              >
                Contracts
              </button>
            </div>
            {isDemo && (
              <span className="px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full text-[10px] font-bold uppercase border border-amber-300/40 glow-gold">
                Demo
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <WorkspaceSwitcher />
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {user.displayName || profile?.name || 'User'}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                {profile?.name || organization?.name || 'My Profile'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-md shadow-emerald-600/20 card-3d">
              <div className="w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5 text-emerald-700" />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 relative custom-scrollbar pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeView}-${activeSector}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="min-h-full flex flex-col"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        <GenieWidget
          open={genieOpen}
          onOpenChange={(o) => {
            setGenieOpen(o);
            if (!o) setGlobalAdvice(null);
          }}
          nudge={
            PAGE_HINTS[activeView]?.nudge ||
            'Set your industry, then Find. Ask me only if you have a question.'
          }
          answer={globalAdvice}
          loadingAnswer={genieLoading}
          onAsk={(q) => {
            void askGenie(q);
          }}
          onExplainPage={() => {
            setGenieOpen(true);
            void askGenie(
              `Explain the ${activeView} page in plain English for a total beginner. Keep it under 5 sentences.`
            );
          }}
          onNextStep={() => {
            setGenieOpen(true);
            void askGenie(
              'What should I do next in Grant Genie? Be concrete and short. Prefer: set industry, search, save, draft, open official page.'
            );
          }}
          onHelpWrite={() => {
            setActiveView('writer');
            setGenieOpen(false);
          }}
          onReplayTour={() => {
            resetTour();
            setGenieOpen(false);
            setTourOpen(true);
          }}
        />
      </main>

      <ProductTour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        onStepChange={(step) => {
          // Navigate so highlighted controls exist (and are visible when possible)
          if (step.id === 'welcome' || step.id === 'genie' || step.id === 'specs' || step.id === 'sector') {
            setActiveView('mission');
          }
          if (step.id === 'find' || step.id === 'search' || step.id === 'results') {
            setActiveView('radar');
          }
          if (step.id === 'pipeline') {
            setActiveView('pipeline');
          }
        }}
      />

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
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="p-5 border-b border-emerald-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={BRAND.assets.logo} alt="" className="h-9 w-9 object-contain" />
                  <span className="font-black text-slate-900">Grant Genie</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                {(
                  [
                    ['grants', 'Grants — free funding', () => { setActiveSector('grants'); setActiveView('radar'); }],
                    ['contracts', 'Contracts — paid work', () => { setActiveSector('contracts'); setActiveView('radar'); }],
                    ['mission', 'Home', () => setActiveView('mission')],
                    ['radar', findLabel, () => setActiveView('radar')],
                    ['pipeline', 'My applications', () => setActiveView('pipeline')],
                    ['writer', 'Draft helper', () => setActiveView('writer')],
                    ['profile', 'Profile', () => setActiveView('profile')],
                    ['settings', 'Settings', () => setActiveView('settings')],
                  ] as [string, string, () => void][]
                ).map(([id, label, fn]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      fn();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                  >
                    {label}
                  </button>
                ))}
              </nav>
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
          : 'hover:bg-white/80 border border-transparent text-slate-600'
      }`}
    >
      <span className={active ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>
      <span>
        <span className="block text-sm font-bold">{label}</span>
        <span className="block text-[10px] text-slate-500 leading-snug">{hint}</span>
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
          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 shadow-sm'
          : 'text-slate-500 hover:bg-white/80 hover:text-slate-900'
      }`}
    >
      <div className="w-6 h-6 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </div>
      <span className="hidden lg:block text-sm">{label}</span>
    </button>
  );
}
