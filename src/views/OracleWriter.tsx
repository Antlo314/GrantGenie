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
  MessageSquareCode,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { getOracleAdvice, transformText } from '../services/geminiService';

import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function OracleWriter({ grant, onBack }: { grant?: any, onBack: () => void }) {
  const { organization } = useAuth();
  const [draft, setDraft] = useState('');
  const [guidelines, setGuidelines] = useState(grant?.description || "Must focus on measurable community impact and demonstrate sustainability of infrastructure projects.");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [transforming, setTransforming] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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

  const handleSave = async (stage: 'drafting' | 'review' = 'drafting') => {
    if (!grant?.pipelineId) {
      setSaveMessage("Error: Missing Pipeline ID. Please add to pipeline first.");
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    
    setSaving(true);
    try {
      const docRef = doc(db, 'pipeline_grants', grant.pipelineId);
      await updateDoc(docRef, {
        draft: draft,
        stage: stage,
        lastEditedAt: new Date().toISOString()
      });
      setSaveMessage(stage === 'review' ? "Finalized and sent to review!" : "Draft Saved");
    } catch (e) {
      console.error("Failed to save draft:", e);
      setSaveMessage("Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleTransform = async (action: 'simplify' | 'amplify' | 'tone_shift') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    if (start === end) return; // No text selected

    const selectedText = draft.substring(start, end);
    setTransforming(action);

    try {
      const transformed = await transformText(selectedText, action);
      const newDraft = draft.substring(0, start) + transformed + draft.substring(end);
      setDraft(newDraft);
      
      // Keep selection on the newly transformed text
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start, start + transformed.length);
        }
      }, 0);
    } catch (e) {
      console.error("Transform failed", e);
    } finally {
      setTransforming(null);
    }
  };

  // If there's an existing draft in the grant prop (like if we loaded it from pipeline), we should set it
  React.useEffect(() => {
    if (grant?.draft) {
      setDraft(grant.draft);
    }
  }, [grant?.draft]);

  return (
    <div className="h-full flex flex-col">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-slate-900 truncate">Genie Writer</h1>
              <p className="text-slate-400 text-[10px] md:text-sm font-medium truncate">Proposal: <span className="text-emerald-600">{grant?.title || 'New Grant Draft'}</span></p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full md:w-auto">
            {saveMessage && <span className="text-xs font-bold text-emerald-600 mr-2 w-full md:w-auto">{saveMessage}</span>}
            <button 
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-widest text-emerald-600"
            >
              <HelpCircle className="w-4 h-4" /> How to use
            </button>
            <button 
              onClick={() => handleSave('drafting')}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-widest text-slate-600 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Work'}
            </button>
            <button 
              onClick={() => handleSave('review')}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Finalize Submission
            </button>
          </div>
       </div>

       <div className="flex-1 flex flex-col xl:flex-row gap-4 md:gap-8 min-h-0 overflow-y-auto xl:overflow-hidden pb-8 xl:pb-0">
          {/* Main Editing Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-h-[400px] xl:min-h-0 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col relative overflow-hidden shadow-sm shrink-0"
          >
             <div className="h-16 border-b border-slate-100 flex items-center px-4 md:px-8 justify-between bg-slate-50/50 shrink-0">
                <div className="flex gap-4 md:gap-8 h-full overflow-x-auto custom-scrollbar no-scrollbar whitespace-nowrap">
                   <button className="text-[10px] font-black text-emerald-600 border-b-2 border-emerald-600 h-full uppercase tracking-widest">Mission & Need</button>
                   <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors h-full">Budget Narrative</button>
                   <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors h-full">Sustainability</button>
                </div>
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em] font-bold">Draft Saved 2m ago</div>
             </div>
             
             {/* Text Selection Tools Toolbar */}
             <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-3 flex items-center overflow-x-auto custom-scrollbar shadow-inner shrink-0 no-scrollbar">
                <div className="flex items-center gap-4 md:gap-6 w-max">
                  <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2 shrink-0">
                    <Zap className="w-3 h-3" /> AI Tools
                  </div>
                  <div className="w-px h-4 bg-slate-700" />
                  <button 
                    onClick={() => handleTransform('simplify')}
                    disabled={!!transforming}
                    className="text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest disabled:opacity-50 transition-colors"
                  >
                    {transforming === 'simplify' ? 'Simplifying...' : 'Simplify Strategy'}
                  </button>
                  <button 
                    onClick={() => handleTransform('amplify')}
                    disabled={!!transforming}
                    className="text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest disabled:opacity-50 transition-colors"
                  >
                    {transforming === 'amplify' ? 'Amplifying...' : 'Amplify Impact'}
                  </button>
                  <button 
                    onClick={() => handleTransform('tone_shift')}
                    disabled={!!transforming}
                    className="text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest disabled:opacity-50 transition-colors"
                  >
                    {transforming === 'tone_shift' ? 'Shifting Tone...' : 'Tone Shift: 2026 Tech'}
                  </button>
                </div>
             </div>

             <textarea 
               ref={textareaRef}
               value={draft}
               onChange={(e) => setDraft(e.target.value)}
               placeholder="Begin crafting your narrative here... Select text and use the AI tools above to refine your strategy."
               className="flex-1 bg-transparent p-6 md:p-12 text-base md:text-xl leading-relaxed focus:outline-none resize-none custom-scrollbar font-serif italic text-slate-800 selection:bg-emerald-100"
             />
          </motion.div>

          {/* Intelligence Sidebar */}
          <div className="w-full xl:w-[450px] flex flex-col gap-6 xl:overflow-y-auto pr-0 xl:pr-2 custom-scrollbar shrink-0">
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

       <AnimatePresence>
         {showHelp && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowHelp(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10"
             >
                <div className="px-10 py-12">
                   <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                           <HelpCircle className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter">Using the Oracle</h2>
                      </div>
                      <button 
                        onClick={() => setShowHelp(false)}
                        className="p-3 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <X className="w-6 h-6 text-slate-400" />
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600 shrink-0 border border-emerald-100">1</div>
                            <div>
                               <h4 className="font-bold text-slate-900 text-sm mb-1">Set the Mission</h4>
                               <p className="text-xs text-slate-500 leading-relaxed">The Oracle uses your organization profile from the Data Vault to ensure every word aligns with your core mission.</p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600 shrink-0 border border-emerald-100">2</div>
                            <div>
                               <h4 className="font-bold text-slate-900 text-sm mb-1">Funder Guidelines</h4>
                               <p className="text-xs text-slate-500 leading-relaxed">Paste the funder's rules in the sidebar. This helps the AI identify 'Strategic Signals' that reviewers look for.</p>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600 shrink-0 border border-emerald-100">3</div>
                            <div>
                               <h4 className="font-bold text-slate-900 text-sm mb-1">Draft & Analyze</h4>
                               <p className="text-xs text-slate-500 leading-relaxed">Start writing. When you hit "Summon Advice", the Oracle will critique your logic and suggest narrative shifts.</p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600 shrink-0 border border-emerald-100">4</div>
                            <div>
                               <h4 className="font-bold text-slate-900 text-sm mb-1">Text Selection</h4>
                               <p className="text-xs text-slate-500 leading-relaxed">Use the floating tools at the bottom to instantly simplify, amplify, or shift the tone of your selected text.</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="mt-12 pt-10 border-t border-slate-100 flex justify-center">
                      <button 
                        onClick={() => setShowHelp(false)}
                        className="bg-slate-900 text-white px-12 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
                      >
                         Got it, let's draft
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
         )}
       </AnimatePresence>
    </div>
  );
}
