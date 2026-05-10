import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Radar, 
  PenTool, 
  FileText, 
  Database, 
  Settings, 
  Sparkles,
  Search,
  User as UserIcon,
  LogOut,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from './components/AuthProvider';
import { loginWithGoogle, logout } from './auth';
import { getGlobalAdvice } from './services/geminiService';

// Views
import MissionControl from './views/MissionControl';
import DiscoveryRadar from './views/DiscoveryRadar';
import OracleWriter from './views/OracleWriter';
import PipelineCommander from './views/PipelineCommander';
import DataVault from './views/DataVault';
import Onboarding from './views/Onboarding';
import SettingsView from './views/Settings';
import ProfileView from './views/ProfileView';

type View = 'mission' | 'radar' | 'writer' | 'pipeline' | 'vault' | 'onboarding' | 'settings' | 'profile';

export default function AppContent() {
  const { user, loading, organization } = useAuth();
  const [activeView, setActiveView] = React.useState<View>('mission');
  const [selectedGrantForDraft, setSelectedGrantForDraft] = React.useState<any>(null);
  const [genieOpen, setGenieOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [globalAdvice, setGlobalAdvice] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (genieOpen && organization) {
      setGlobalAdvice(null);
      getGlobalAdvice(organization.mission, activeView).then(setGlobalAdvice);
    }
  }, [genieOpen, activeView, organization]);

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
      <div className="h-screen w-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 bg-grid-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-emerald-100/50 via-transparent to-transparent pointer-events-none" />
        <div className="z-10 text-center max-w-2xl bg-white/60 backdrop-blur-md p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-600/20">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl font-bold tracking-tighter mb-4 text-slate-900 leading-none"
          >
            Grant Genie
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 mb-12 font-medium"
          >
            High-precision philanthropic intelligence. 
            Win funding with AI-augmented clarity.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loginWithGoogle}
            className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold flex items-center gap-3 mx-auto transition-all hover:bg-emerald-600 shadow-xl shadow-slate-900/10"
          >
            Summon Your Genie
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    );
  }

  if (!organization && activeView !== 'onboarding') {
    return <Onboarding onComplete={() => setActiveView('mission')} />;
  }

  const handleStartDraft = (grant: any) => {
    setSelectedGrantForDraft(grant);
    setActiveView('writer');
    setGenieOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'mission': return <MissionControl onNavigate={setActiveView} onStartDraft={handleStartDraft} />;
      case 'radar': return <DiscoveryRadar onStartDraft={handleStartDraft} />;
      case 'writer': return <OracleWriter grant={selectedGrantForDraft} onBack={() => setActiveView('pipeline')} />;
      case 'pipeline': return <PipelineCommander onStartDraft={handleStartDraft} />;
      case 'vault': return <DataVault />;
      case 'profile': return <ProfileView />;
      case 'settings': return <SettingsView />;
      case 'onboarding': return <Onboarding onComplete={() => setActiveView('mission')} />;
      default: return <MissionControl onNavigate={setActiveView} onStartDraft={handleStartDraft} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-20 lg:w-64 border-r border-slate-200 flex-col items-center lg:items-stretch bg-white">
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 hidden lg:block">Grant Genie</span>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-8 flex flex-col gap-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">Operational</div>
          <SidebarItem 
            icon={<BarChart3 />} 
            label="Mission Control" 
            active={activeView === 'mission'} 
            onClick={() => setActiveView('mission')} 
          />
          <SidebarItem 
            icon={<Radar />} 
            label="Discovery Radar" 
            active={activeView === 'radar'} 
            onClick={() => setActiveView('radar')} 
          />
          
          <div className="mt-6 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">Intelligence</div>
          <SidebarItem 
            icon={<Database />} 
            label="Data Vault" 
            active={activeView === 'vault'} 
            onClick={() => setActiveView('vault')} 
          />
          <SidebarItem 
            icon={<Zap />} 
            label="Pipeline Commander" 
            active={activeView === 'pipeline'} 
            onClick={() => setActiveView('pipeline')} 
          />
          <SidebarItem 
            icon={<PenTool />} 
            label="Genie Writer" 
            active={activeView === 'writer'} 
            onClick={() => setActiveView('writer')} 
          />
          <div className="mt-6 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">Personal</div>
          <SidebarItem 
            icon={<UserIcon />} 
            label="User Profile" 
            active={activeView === 'profile'} 
            onClick={() => setActiveView('profile')} 
          />
          <SidebarItem 
            icon={<Settings />} 
            label="Organization" 
            active={activeView === 'settings'} 
            onClick={() => setActiveView('settings')} 
          />
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 mt-auto">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
          >
            <LogOut className="w-5 h-5 ml-1 lg:ml-0" />
            <span className="hidden lg:block text-sm font-semibold">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex gap-2 hidden lg:flex">
              <span className={`px-2 py-1 ${organization?.tier === 'Pro' ? 'bg-emerald-100 text-emerald-600' : organization?.tier === 'Enterprise' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'} rounded text-[10px] font-bold uppercase tracking-widest`}>
                {organization?.tier || 'Free'} Tier
              </span>
              <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quantum Scanning Active</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden md:block">
              <span className="text-sm font-bold text-slate-900">{user.displayName}</span>
              <span className="text-[10px] text-emerald-600 font-mono tracking-widest uppercase font-bold">{organization?.name || 'New Organization'}</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
              {user.photoURL ? <img src={user.photoURL} alt="User" /> : <UserIcon className="w-5 h-5 text-slate-500" />}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
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
        
        {/* Grant Genie Widget */}
        <div className="fixed bottom-8 right-8 z-50">
           <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
           >
            <button 
              onClick={() => setGenieOpen(!genieOpen)}
              className="bg-slate-900 hover:bg-slate-800 p-4 rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-700 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-emerald-500/20 group-hover:opacity-100 opacity-0 transition-opacity" />
              <div className="bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center animate-pulse relative z-10">
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Grant Genie</h3>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Consulting Active</div>
                  </div>
                </div>
                {globalAdvice ? (
                  <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">
                    "{globalAdvice}"
                  </p>
                ) : (
                  <div className="flex items-center justify-center py-6 mb-6">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                      <Sparkles className="w-8 h-8 text-emerald-500/50" />
                    </motion.div>
                  </div>
                )}
                <div className="space-y-2">
                  <button className="w-full text-xs text-center px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest transition-colors shadow-lg shadow-emerald-900/20">
                    Draft with Oracle
                  </button>
                  <button className="w-full text-xs text-center px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold uppercase tracking-widest transition-colors">
                    Review Deep Intel
                  </button>
                </div>
              </motion.div>
            )}
           </AnimatePresence>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
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
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-2 rounded-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-slate-800">Grant Genie</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-900">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational</div>
                <MobileMenuItem 
                  icon={<BarChart3 />} 
                  label="Mission Control" 
                  active={activeView === 'mission'} 
                  onClick={() => { setActiveView('mission'); setMobileMenuOpen(false); }} 
                />
                <MobileMenuItem 
                  icon={<Radar />} 
                  label="Discovery Radar" 
                  active={activeView === 'radar'} 
                  onClick={() => { setActiveView('radar'); setMobileMenuOpen(false); }} 
                />
                
                <div className="mt-6 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intelligence</div>
                <MobileMenuItem 
                  icon={<Database />} 
                  label="Data Vault" 
                  active={activeView === 'vault'} 
                  onClick={() => { setActiveView('vault'); setMobileMenuOpen(false); }} 
                />
                <MobileMenuItem 
                  icon={<Zap />} 
                  label="Pipeline Commander" 
                  active={activeView === 'pipeline'} 
                  onClick={() => { setActiveView('pipeline'); setMobileMenuOpen(false); }} 
                />
                <MobileMenuItem 
                  icon={<PenTool />} 
                  label="Genie Writer" 
                  active={activeView === 'writer'} 
                  onClick={() => { setActiveView('writer'); setMobileMenuOpen(false); }} 
                />
                <div className="mt-6 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal</div>
                <MobileMenuItem 
                  icon={<UserIcon />} 
                  label="User Profile" 
                  active={activeView === 'profile'} 
                  onClick={() => { setActiveView('profile'); setMobileMenuOpen(false); }} 
                />
                <MobileMenuItem 
                  icon={<Settings />} 
                  label="Organization" 
                  active={activeView === 'settings'} 
                  onClick={() => { setActiveView('settings'); setMobileMenuOpen(false); }} 
                />
              </nav>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-200 transition-all text-slate-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-semibold">Log out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group relative
        ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
      `}
    >
      <div className={`w-5 h-5 flex items-center justify-center ${active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {React.cloneElement(icon as React.ReactElement, { strokeWidth: 2.5 })}
      </div>
      <span className={`hidden lg:block text-sm font-semibold tracking-tight ${active ? 'opacity-100' : 'opacity-80'}`}>
        {label}
      </span>
      {active && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-600 rounded-l-full" />
      )}
    </button>
  );
}

function MobileMenuItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-4 p-4 rounded-xl transition-all duration-200 w-full text-left
        ${active ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50 font-semibold'}
      `}
    >
      <div className={`w-5 h-5 flex items-center justify-center ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
        {React.cloneElement(icon as React.ReactElement, { strokeWidth: 2.5 })}
      </div>
      <span className="text-sm tracking-tight flex-1">
        {label}
      </span>
    </button>
  );
}
