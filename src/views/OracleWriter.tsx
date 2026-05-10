import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Save, 
  ChevronLeft, 
  Info,
  DollarSign,
  Calendar,
  Zap,
  BrainCircuit,
  MessageSquareCode
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { getOracleAdvice } from '../services/geminiService';

export default function OracleWriter() {
  const { organization } = useAuth();
  const [draft, setDraft] = useState('');
  const [guidelines, setGuidelines] = useState("Must focus on measurable community impact and demonstrate sustainability of infrastructure projects.");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [advice, setAdvice] = useState<any>(null);

  const fetchOracleAdvice = async () => {
    if (!organization) return;
    setLoadingAdvice(true);
    try {
      const result = await getOracleAdvice(organization.mission, draft, guidelines);
      setAdvice(result);
    } catch (err) {
      console.error("Oracle advice failed:", err);
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Oracle Writer</h1>
              <p className="text-slate-400 text-sm font-medium">Proposal: <span className="text-emerald-600">Clean Water Initiative - Gates Foundation</span></p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-widest text-slate-600">
              <Save className="w-4 h-4" /> Save Work
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
              <Send className="w-4 h-4" /> Finalize Submission
            </button>
          </div>
       </div>

       <div className="flex-1 flex gap-8 min-h-0">
          {/* Main Editing Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col relative overflow-hidden shadow-sm"
          >
             <div className="h-16 border-b border-slate-100 flex items-center px-8 justify-between bg-slate-50/50">
                <div className="flex gap-8 h-full">
                   <button className="text-[10px] font-black text-emerald-600 border-b-2 border-emerald-600 h-full uppercase tracking-widest">Mission & Need</button>
                   <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors h-full">Budget Narrative</button>
                   <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors h-full">Sustainability</button>
                </div>
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em] font-bold">Draft Saved 2m ago</div>
             </div>
             <textarea 
               value={draft}
               onChange={(e) => setDraft(e.target.value)}
               placeholder="Begin crafting your narrative here... Let the Oracle guide your strategic signals."
               className="flex-1 bg-transparent p-12 text-xl leading-relaxed focus:outline-none resize-none custom-scrollbar font-serif italic text-slate-800 selection:bg-emerald-100"
             />
             
             {/* Text Selection Tools (Mocked) */}
             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 rounded-2xl px-8 py-4 flex gap-8 shadow-2xl backdrop-blur-xl">
                <button className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest">Simplify Strategy</button>
                <div className="w-px h-4 bg-slate-800 self-center" />
                <button className="text-[10px] font-black text-white hover:text-emerald-300 uppercase tracking-widest">Amplify Impact</button>
                <div className="w-px h-4 bg-slate-800 self-center" />
                <button className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest">Tone Shift: 2026 Tech</button>
             </div>
          </motion.div>

          {/* Intelligence Sidebar */}
          <div className="w-[450px] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
             {/* Grant Specs */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
             >
                  <div className="flex items-center gap-3 mb-6">
                    <Info className="w-4 h-4 text-slate-400" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Funder Guidelines</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Max Award</p>
                          <p className="font-bold text-slate-900 text-lg">$1,500,000</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-amber-600" />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Submission Date</p>
                          <p className="font-bold text-slate-900 text-lg">Dec 15, 2026</p>
                       </div>
                    </div>
                    <textarea
                      value={guidelines}
                      onChange={(e) => setGuidelines(e.target.value)}
                      className="w-full h-32 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-500 leading-relaxed italic focus:outline-none focus:ring-1 focus:ring-emerald-500/20 resize-none"
                      placeholder="Paste the funder's specific guidelines or requirements here..."
                    />
                  </div>
             </motion.div>

             {/* Oracle Advice */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex-1 bg-slate-900 text-white rounded-3xl p-10 relative overflow-hidden shadow-2xl min-h-[500px]"
             >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                   <BrainCircuit className="w-48 h-48" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                   <div className="flex items-center gap-4 mb-10">
                     <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                        <Sparkles className="w-6 h-6 text-white" />
                     </div>
                     <h3 className="text-xl font-bold tracking-tight">The Oracle Advice</h3>
                   </div>

                   {!advice && !loadingAdvice && (
                      <div className="text-center py-12 my-auto">
                         <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <MessageSquareCode className="w-10 h-10 text-emerald-400" />
                         </div>
                         <p className="text-slate-300 mb-8 font-medium italic">"Ready to analyze your narrative against funder expectations?"</p>
                         <button 
                           onClick={fetchOracleAdvice}
                           className="w-full bg-emerald-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40"
                         >
                            Summon Oracle Advice
                         </button>
                      </div>
                   )}

                   {loadingAdvice && (
                     <div className="flex flex-col items-center justify-center py-20 gap-6 my-auto">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                           <Sparkles className="w-16 h-16 text-emerald-400" />
                        </motion.div>
                        <p className="text-[10px] font-black text-emerald-400 animate-pulse tracking-[0.3em] uppercase">Decrypting Funder Intent...</p>
                     </div>
                   )}

                   {advice && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                      >
                         <div className="bg-emerald-500/10 border border-emerald-400/20 p-6 rounded-2xl">
                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">Strategic Signal</div>
                            <div className="space-y-4">
                               <p className="text-sm font-bold text-white italic leading-relaxed">"{advice.strategicSignal}"</p>
                               <div className="flex gap-2">
                                  <span className="px-2 py-1 bg-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">SIGNAL: HIGH</span>
                                  <span className="px-2 py-1 bg-blue-500/20 rounded text-[9px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest">TONE: STRATEGIC</span>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Narrative Shifts (3)</div>
                            {advice.narrativeShifts.map((shift: string, idx: number) => (
                              <div key={idx} className="flex gap-4 group">
                                <div className="text-emerald-400 font-mono text-xs font-bold mt-0.5">0{idx + 1}</div>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium group-hover:text-white transition-colors">{shift}</p>
                              </div>
                            ))}
                         </div>

                         <div className="pt-10 border-t border-slate-800">
                            <button 
                              onClick={() => { setAdvice(null); setDraft(''); }}
                              className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
                            >
                               Recalibrate Narrative <Zap className="w-3 h-3" />
                            </button>
                         </div>
                      </motion.div>
                   )}
                </div>
             </motion.div>
          </div>
       </div>
    </div>
  );
}
