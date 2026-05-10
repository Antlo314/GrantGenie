import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Clock, 
  ChevronRight, 
  Map, 
  Layers,
  TrendingUp,
  Inbox,
  FileEdit,
  Send,
  Flag
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function PipelineCommander() {
  const { organization } = useAuth();
  const [pipeline, setPipeline] = useState<any[]>([]);

  useEffect(() => {
    if (!organization) return;
    const fetchPipeline = async () => {
      try {
        const q = query(collection(db, 'pipeline_grants'), where('orgId', '==', organization.id));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPipeline(data);
      } catch (e) {
        console.error("Error fetching pipeline:", e);
      }
    };
    fetchPipeline();
  }, [organization]);

  const stages = [
    { id: 'discovery', label: 'Discovery', color: 'emerald', count: pipeline.filter(p => p.stage === 'discovery').length || 0 },
    { id: 'drafting', label: 'Drafting', color: 'slate', count: pipeline.filter(p => p.stage === 'drafting').length || 0 },
    { id: 'review', label: 'In Review', color: 'amber', count: pipeline.filter(p => p.stage === 'review').length || 0 },
    { id: 'submitted', label: 'Submitted', color: 'emerald', count: pipeline.filter(p => p.stage === 'submitted').length || 0 }
  ];

  return (
    <div className="space-y-8 h-full flex flex-col pb-12">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Portfolio Lifecycle</h2>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Pipeline Commander</h1>
        </motion.div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-widest text-slate-600">
             <Layers className="w-4 h-4" /> View Kanban
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
             <Map className="w-4 h-4" /> Funding Roadmap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stages.map((stage, idx) => (
          <motion.div 
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-slate-200 p-8 rounded-3xl relative overflow-hidden group hover:shadow-md transition-all"
          >
             <div className="flex justify-between items-center mb-6">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${stage.color === 'emerald' ? 'text-emerald-600' : stage.color === 'amber' ? 'text-amber-500' : 'text-slate-500'}`}>
                   {stage.label}
                </span>
                <span className="text-3xl font-bold text-slate-900 tracking-tighter">{stage.count}</span>
             </div>
             <div className="h-1.5 rounded-full bg-slate-50 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stage.count / 10) * 100}%` }}
                  className={`h-full ${stage.color === 'emerald' ? 'bg-emerald-500' : stage.color === 'amber' ? 'bg-amber-500' : 'bg-slate-400'}`} 
                />
             </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm"
      >
         <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-full border border-slate-200 shadow-sm w-64 group focus-within:border-emerald-500 transition-colors">
                  <Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
                  <input type="text" placeholder="Search pipeline..." className="bg-transparent border-none text-xs focus:outline-none w-full text-slate-800 placeholder:text-slate-400" />
               </div>
               <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 px-4 py-2 border border-slate-200 rounded-full bg-white transition-all uppercase tracking-widest shadow-sm">
                  <Filter className="w-3 h-3" /> Filter Parameters
               </button>
            </div>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black font-mono uppercase tracking-[0.2em]">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Velocity: 1.2 Apps / Week
               </div>
               <div className="w-px h-4 bg-slate-200" />
               <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-black font-mono uppercase tracking-[0.2em]">
                  <Flag className="w-4 h-4" /> Next Milestone: Dec 15
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grant / Funder</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alignment</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {pipeline.length > 0 ? (
                    pipeline.map(grant => (
                      <PipelineRow 
                        key={grant.id}
                        grant={grant.title} 
                        funder={grant.funder} 
                        stage={grant.stage} 
                        match={`${grant.matchScore}%`} 
                        value={`$${grant.amount.toLocaleString()}`} 
                        icon={
                          grant.stage === 'drafting' ? <FileEdit className="w-4 h-4 text-slate-900" /> :
                          grant.stage === 'review' ? <Clock className="w-4 h-4 text-amber-500" /> :
                          grant.stage === 'submitted' ? <Send className="w-4 h-4 text-emerald-600" /> :
                          <Inbox className="w-4 h-4 text-emerald-600" />
                        }
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium text-sm">
                        No active grants in your pipeline. Head to the Discovery Radar to find opportunities.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </motion.div>
    </div>
  );
}

function PipelineRow({ grant, funder, stage, match, value, icon }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
       <td className="px-8 py-6">
          <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{grant}</div>
          <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{funder}</div>
       </td>
       <td className="px-8 py-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                {icon}
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-slate-600">{stage}</span>
          </div>
       </td>
       <td className="px-8 py-6">
          <div className="flex items-center gap-3">
             <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[80px] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: match }} className="h-full bg-emerald-500" />
             </div>
             <span className="text-xs font-black text-emerald-600 tracking-tighter">{match}</span>
          </div>
       </td>
       <td className="px-8 py-6">
          <div className="text-sm font-bold tracking-tight text-slate-900">{value}</div>
       </td>
       <td className="px-8 py-6 text-right">
          <button className="p-3 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all shadow-sm hover:shadow-lg border border-slate-100 group-hover:border-transparent">
             <ChevronRight className="w-5 h-5 flex-shrink-0" />
          </button>
       </td>
    </tr>
  );
}
