import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  BarChart3,
  Search
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function MissionControl({ onNavigate, onStartDraft }: { onNavigate: (v: any) => void, onStartDraft: (g: any) => void }) {
  const { organization } = useAuth();
  const [pipelineValue, setPipelineValue] = React.useState(0);
  const [pipelineCount, setPipelineCount] = React.useState(0);

  React.useEffect(() => {
    if (!organization) return;
    const fetchPipeline = async () => {
      try {
        const q = query(collection(db, 'pipeline_grants'), where('orgId', '==', organization.id));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        
        const totalValue = data.reduce((acc, grant) => acc + (grant.amount || 0), 0);
        setPipelineValue(totalValue);
        setPipelineCount(data.length);
      } catch (e) {
        console.error("Error fetching pipeline:", e);
      }
    };
    fetchPipeline();
  }, [organization]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Operational Dashboard</h2>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] ${organization?.tier === 'Pro' ? 'bg-emerald-100 text-emerald-600' : organization?.tier === 'Enterprise' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {organization?.tier || 'Free'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-slate-900 leading-none mt-1">Mission Control</h1>
        </motion.div>
        <div className="flex gap-3">
          <StatPill label="Genie Scanning" value="Live" color="emerald" />
          <StatPill label="System Status" value="Optimal" color="slate" />
        </div>
      </div>

      {/* Grid Layout Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-8 bg-white border border-slate-200 rounded-3xl md:rounded-2xl p-6 md:p-8 shadow-sm group hover:shadow-md transition-all"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 md:gap-0">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Funding Velocity</h3>
              <div className="text-5xl font-bold text-slate-900 tracking-tighter flex items-baseline gap-3">
                ${pipelineValue.toLocaleString()}
                <span className="text-lg font-semibold text-emerald-600">+28%</span>
              </div>
            </div>
            <div className="flex gap-4 self-start md:self-auto">
              <div className="h-16 w-px bg-slate-100" />
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Active AI Scans</div>
                <div className="text-2xl font-mono font-bold text-slate-800">{pipelineCount}</div>
              </div>
            </div>
          </div>
          {/* Simulated Chart viz */}
          <div className="h-40 flex items-end gap-2 mt-4">
            <div className="flex-1 bg-slate-50 h-[30%] rounded-t-lg transition-all hover:bg-slate-100" />
            <div className="flex-1 bg-slate-50 h-[45%] rounded-t-lg transition-all hover:bg-slate-100" />
            <div className="flex-1 bg-slate-50 h-[60%] rounded-t-lg transition-all hover:bg-slate-100" />
            <div className="flex-1 bg-slate-100 h-[75%] rounded-t-lg transition-all hover:bg-slate-200" />
            <div className="flex-1 bg-emerald-100 h-[65%] rounded-t-lg transition-all hover:bg-emerald-200" />
            <div className="flex-1 bg-emerald-200 h-[85%] rounded-t-lg transition-all hover:bg-emerald-300" />
            <div className="flex-1 bg-emerald-600 h-full rounded-t-lg shadow-lg shadow-emerald-600/10" />
          </div>
        </motion.div>

        <div className="md:col-span-4 flex flex-col gap-6">
          <DashboardCardShort 
            title="Match Intelligence" 
            value="88%" 
            subValue="Mission Alignment score" 
            color="emerald"
            delay={0.1}
          />
          <DashboardCardShort 
            title="Vault Integrity" 
            value="Secure" 
            subValue="Zero-Trust active" 
            color="slate"
            delay={0.2}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900">
        {/* Intelligence Feed */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl md:rounded-2xl overflow-hidden shadow-sm"
        >
           <div className="px-6 md:px-8 py-6 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Zap className="w-5 h-5 text-emerald-600" />
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Live Discovery Intel</h3>
             </div>
             <button 
              onClick={() => onNavigate('radar')}
              className="text-xs font-bold text-emerald-600 hover:underline">View Radar →</button>
           </div>
           
           <div className="divide-y divide-slate-50">
             <IntelItem 
               type="Radar Hit" 
               title="Gates Foundation: Digital Health Systems 2026" 
               time="2m ago" 
               color="emerald"
               details="94.2% AI match detected for your core mission infrastructure."
             />
             <IntelItem 
               type="Intel Signal" 
               title="Rockefeller: Urban Water Resilience" 
               time="15m ago" 
               color="emerald"
               details="High alignment with your Primary Impact Vector: Environment."
             />
             <IntelItem 
               type="System Alert" 
               title="Deadline Approaching: EPA Justice Grant" 
               time="1h ago" 
               color="amber"
               details="Final review recommended by Genie Writer for optimal logic consistency."
             />
             <IntelItem 
               type="Milestone" 
               title="Data Vault Initialized" 
               time="4h ago" 
               color="slate"
               details="Secure 501(c)(3) repository synchronized with Gemini Enterprise."
             />
           </div>
        </motion.div>

        {/* Status Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 text-white rounded-3xl md:rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <div className="w-48 h-48 bg-white rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Grant Genie AI</h3>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Consulting Active</div>
              </div>
            </div>
            <p className="text-slate-300 italic text-sm leading-relaxed mb-10 border-l-2 border-emerald-500/30 pl-6">
              "Based on your recent funding velocity, you should prioritize the 'Climate Resilience Fund' (Match: 94%). I am standing by to assist with the Genie draft narrative."
            </p>
            <div className="mt-auto space-y-3">
              <button 
                onClick={() => onStartDraft({ title: "Climate Resilience Fund", funder: "Gates Foundation", description: "Providing large-scale funding for non-profits implementing climate resilience." })}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-600/20"
              >
                Draft with Genie
              </button>
              <button 
                onClick={() => onNavigate('radar')}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 transition-all"
              >
                Review Deep Intel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string, value: string, color: 'emerald' | 'slate' }) {
  return (
    <div className={`px-4 py-2 rounded-xl border ${color === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
       <div className="text-[9px] font-black tracking-[0.2em] uppercase opacity-60 mb-0.5">{label}</div>
       <div className="text-xs font-bold">{value}</div>
    </div>
  );
}

function DashboardCardShort({ title, value, subValue, color, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white border border-slate-200 p-6 rounded-2xl flex-1 shadow-sm hover:shadow-md transition-all"
    >
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</div>
      <div className={`text-4xl font-bold tracking-tighter mb-1 ${color === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</div>
      <div className="text-[10px] text-slate-400 font-semibold">{subValue}</div>
    </motion.div>
  );
}

function IntelItem({ type, title, time, color, details }: any) {
  const dotColors: any = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-400'
  };
  return (
    <div className="px-8 py-6 flex gap-6 hover:bg-slate-50 transition-colors group">
      <div className="relative shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${dotColors[color]} mt-2 relative z-10`} />
        {/* line */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-px h-24 bg-slate-100 group-last:hidden" />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{type}</span>
          <span className="text-[10px] text-slate-300 font-mono tracking-widest">[{time.toUpperCase()}]</span>
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1 leading-tight">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{details}</p>
      </div>
    </div>
  );
}
