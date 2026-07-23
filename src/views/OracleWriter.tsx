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
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import {
  getOracleAdvice,
  transformText,
  generateAwardWinningProposal,
  profileFromOrganization,
} from '../services/geminiService';

import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function OracleWriter({ grant, onBack }: { grant?: any, onBack: () => void }) {
  const { organization } = useAuth();
  const [draft, setDraft] = useState('');
  const [guidelines, setGuidelines] = useState(grant?.description || "Must focus on measurable community impact and demonstrate sustainability of infrastructure projects.");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [transforming, setTransforming] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isExpandedEditor, setIsExpandedEditor] = useState(false);
  const [isExpandedGuidelines, setIsExpandedGuidelines] = useState(false);
  const [isExpandedAdvice, setIsExpandedAdvice] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const expandedTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  const fetchOracleAdvice = async () => {
    if (!organization) return;
    setLoadingAdvice(true);
    try {
      const result = await getOracleAdvice(organization.mission, draft, guidelines);
      setAdvice(result);
    } catch (err) {
      console.error("Oracle advice failed:", err);
      alert('Oracle review failed. Check GEMINI_API_KEY.');
    } finally {
      setLoadingAdvice(false);
    }
  };

  /** Module 3 — full award-winning proposal */
  const generateFullProposal = async () => {
    if (!organization || !grant) {
      alert('Select a grant from Find grants first, then open Writer.');
      return;
    }
    setGenerating(true);
    try {
      const profile = profileFromOrganization(organization, {
        projectScope: organization.mission,
        industry: organization.focusAreas?.[0] || 'nonprofit',
      });
      const proposal = await generateAwardWinningProposal(profile, grant, {
        guidelines,
        fundingRequest: grant.amount > 0 ? grant.amount : undefined,
      });
      setDraft(proposal.fullMarkdown);
      setSaveMessage(
        proposal.funderKeywordsUsed?.length
          ? `Proposal ready · keywords: ${proposal.funderKeywordsUsed.slice(0, 4).join(', ')}`
          : 'Award-winning draft generated'
      );
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (err) {
      console.error('Proposal engine failed:', err);
      alert('Proposal generation failed. Check GEMINI_API_KEY in .env.local');
    } finally {
      setGenerating(false);
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
              <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-slate-900 truncate">Write your proposal</h1>
              <p className="text-slate-400 text-[10px] md:text-sm font-medium truncate">
                <span className="text-emerald-600">{grant?.title || 'Select a grant first'}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full md:w-auto">
            {saveMessage && <span className="text-xs font-bold text-emerald-600 mr-2 w-full md:w-auto">{saveMessage}</span>}
            <button 
              onClick={generateFullProposal}
              disabled={generating || !grant}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-slate-800 disabled:opacity-50 shadow-lg"
            >
              <Sparkles className="w-4 h-4" /> {generating ? 'Writing…' : '✨ Write it for me'}
            </button>
            <button 
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-widest text-emerald-600"
            >
              <HelpCircle className="w-4 h-4" /> How proposals work
            </button>
            <button 
              onClick={() => handleSave('drafting')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-widest text-slate-600 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={() => handleSave('review')}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Mark as ready
            </button>
          </div>
       </div>
       <div className="flex-1 flex flex-col xl:flex-row gap-4 md:gap-8 min-h-[600px] pb-8 xl:pb-0">
          {/* Main Editing Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-h-[450px] md:min-h-[550px] bg-white border border-slate-200 rounded-[2.5rem] flex flex-col relative overflow-hidden shadow-sm shrink-0"
          >
             {/* 3-Step Onboarding Banner when empty */}
             {!draft && (
               <div className="bg-emerald-50/90 border-b border-emerald-100 p-3.5 px-6 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2 shrink-0">
                 <div className="flex items-center gap-2 font-bold text-emerald-800">
                   <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                   <span>How to create your proposal:</span>
                 </div>
                 <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-emerald-800">
                   <span><strong>Step 1:</strong> Click "✨ Write it for me" to create a full draft</span>
                   <span className="text-emerald-300">•</span>
                   <span><strong>Step 2:</strong> Edit anything you want to change</span>
                   <span className="text-emerald-300">•</span>
                   <span><strong>Step 3:</strong> Click "Mark as ready" when done, then apply on official site</span>
                 </div>
               </div>
             )}

             <div className="h-16 border-b border-slate-100 flex items-center px-4 md:px-8 justify-between bg-slate-50/50 shrink-0">
                <div className="flex gap-2 md:gap-4 h-full overflow-x-auto custom-scrollbar no-scrollbar whitespace-nowrap items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span className="text-emerald-600">Intro</span>
                   <span>· Problem</span>
                   <span>· Plan</span>
                   <span>· Budget</span>
                   <span>· Results</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.15em] font-bold hidden sm:block">
                    {grant?.funder || 'Funder'}
                  </div>
                  <button 
                    onClick={() => setIsExpandedEditor(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
                    title="Expand Full Screen Editor"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Expand Editor</span>
                  </button>
                </div>
             </div>
             
             {/* Text Selection Tools Toolbar */}
             <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-3 flex items-center overflow-x-auto custom-scrollbar shadow-inner shrink-0 no-scrollbar justify-between">
                <div className="flex items-center gap-4 md:gap-6 w-max">
                  <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2 shrink-0">
                    <Zap className="w-3 h-3" /> AI Tools
                  </div>
                  <div className="w-px h-4 bg-slate-700" />
                  <button 
                    onClick={() => handleTransform('simplify')}
                    disabled={!!transforming}
                    className="text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest disabled:opacity-50 transition-colors relative group"
                  >
                    {transforming === 'simplify' ? 'Simplifying...' : 'Simplify this'}
                    {organization?.tier === 'Free' && (
                      <div className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[7px] px-1.5 py-0.5 rounded-full border border-slate-900 shadow-lg">PRO</div>
                    )}
                  </button>
                  <button 
                    onClick={() => handleTransform('amplify')}
                    disabled={!!transforming}
                    className="text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest disabled:opacity-50 transition-colors relative group"
                  >
                    {transforming === 'amplify' ? 'Amplifying...' : 'Strengthen this'}
                    {organization?.tier === 'Free' && (
                      <div className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[7px] px-1.5 py-0.5 rounded-full border border-slate-900 shadow-lg">PRO</div>
                    )}
                  </button>
                  <button 
                    onClick={() => handleTransform('tone_shift')}
                    disabled={!!transforming}
                    className="text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest disabled:opacity-50 transition-colors relative group"
                  >
                    {transforming === 'tone_shift' ? 'Shifting Tone...' : 'Make it sound professional'}
                    {organization?.tier === 'Free' && (
                      <div className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[7px] px-1.5 py-0.5 rounded-full border border-slate-900 shadow-lg">PRO</div>
                    )}
                  </button>
                </div>
             </div>

             <textarea 
               ref={textareaRef}
               value={draft}
               onChange={(e) => setDraft(e.target.value)}
               placeholder="Click “✨ Write it for me” for a 5-section draft (Intro, Problem, Plan, Budget, Results)—or write here. Select text to simplify, strengthen, or make it sound professional."
               className="flex-1 bg-transparent p-6 md:p-10 text-sm md:text-base leading-relaxed focus:outline-none resize-none custom-scrollbar font-sans text-slate-800 selection:bg-emerald-100 min-h-[350px]"
             />
          </motion.div>

          {/* Intelligence Sidebar */}
          <div className="w-full xl:w-[450px] flex flex-col gap-6 pr-0 custom-scrollbar shrink-0">
             {/* Grant Specs */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm"
             >
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Info className="w-4 h-4 text-slate-400" />
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Funder Guidelines</h3>
                    </div>
                    <button 
                      onClick={() => setIsExpandedGuidelines(true)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                      title="Expand Guidelines"
                    >
                      <Maximize2 className="w-4 h-4 text-emerald-600" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Award (if listed)</p>
                          <p className="font-bold text-slate-900 text-lg">
                            {grant?.amount > 0
                              ? `$${Number(grant.amount).toLocaleString()}`
                              : 'See NOFO'}
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-amber-600" />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Deadline</p>
                          <p className="font-bold text-slate-900 text-lg">
                            {grant?.deadline
                              ? new Date(grant.deadline).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : '—'}
                          </p>
                       </div>
                    </div>
                    <textarea
                      value={guidelines}
                      onChange={(e) => setGuidelines(e.target.value)}
                      className="w-full h-40 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-600 leading-relaxed italic focus:outline-none focus:ring-1 focus:ring-emerald-500/20 resize-none custom-scrollbar"
                      placeholder="Paste the funder's specific guidelines or requirements here..."
                    />
                  </div>
             </motion.div>

             {/* Oracle Advice */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex-1 bg-slate-900 text-white rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-2xl min-h-[450px]"
             >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                   <BrainCircuit className="w-48 h-48" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                   <div className="flex items-center justify-between gap-4 mb-8">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                          <Sparkles className="w-5 h-5 text-white" />
                       </div>
                       <h3 className="text-lg md:text-xl font-bold tracking-tight">Expert Feedback</h3>
                     </div>
                     {advice && (
                       <button 
                         onClick={() => setIsExpandedAdvice(true)}
                         className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 transition-colors"
                         title="Expand Advice"
                       >
                         <Maximize2 className="w-4 h-4 text-emerald-400" />
                       </button>
                     )}
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
                            Get feedback
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
                        className="space-y-8"
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
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Narrative Shifts ({advice.narrativeShifts?.length || 0})</div>
                            {advice.narrativeShifts?.map((shift: string, idx: number) => (
                              <div key={idx} className="flex gap-4 group">
                                <div className="text-emerald-400 font-mono text-xs font-bold mt-0.5">0{idx + 1}</div>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium group-hover:text-white transition-colors">{shift}</p>
                              </div>
                            ))}
                         </div>

                         <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                            <button 
                              onClick={() => { setAdvice(null); setDraft(''); }}
                              className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
                            >
                               Recalibrate Narrative <Zap className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => setIsExpandedAdvice(true)}
                              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              Expand View <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      </motion.div>
                   )}
                </div>
             </motion.div>
          </div>
       </div>

       {/* Full Screen Editor Modal */}
       <AnimatePresence>
         {isExpandedEditor && (
           <div className="fixed inset-0 z-[120] flex flex-col bg-white p-4 sm:p-8">
             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
               <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                   <Sparkles className="w-5 h-5" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-slate-900">Proposal Engine · Immersive Editor</h2>
                   <p className="text-xs text-slate-500 font-medium">{grant?.title || 'Drafting Mode'}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <button 
                   onClick={() => handleSave('drafting')}
                   disabled={saving}
                   className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 shadow-md"
                 >
                   {saving ? 'Saving...' : 'Save Draft'}
                 </button>
                 <button 
                   onClick={() => setIsExpandedEditor(false)}
                   className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                   title="Exit Full Screen"
                 >
                   <Minimize2 className="w-6 h-6 text-slate-700" />
                 </button>
               </div>
             </div>
             <textarea 
               ref={expandedTextareaRef}
               value={draft}
               onChange={(e) => setDraft(e.target.value)}
               placeholder="Write your grant proposal here..."
               className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-10 text-base md:text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none custom-scrollbar font-sans text-slate-900"
             />
           </div>
         )}
       </AnimatePresence>

       {/* Full Screen Funder Guidelines Modal */}
       <AnimatePresence>
         {isExpandedGuidelines && (
           <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-3xl w-full max-w-3xl p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh]"
             >
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                 <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   <Info className="w-5 h-5 text-emerald-600" /> Funder Guidelines & Requirements
                 </h3>
                 <button onClick={() => setIsExpandedGuidelines(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                   <X className="w-5 h-5 text-slate-500" />
                 </button>
               </div>
               <textarea
                 value={guidelines}
                 onChange={(e) => setGuidelines(e.target.value)}
                 className="flex-1 w-full min-h-[400px] bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none custom-scrollbar"
               />
               <div className="mt-6 flex justify-end">
                 <button onClick={() => setIsExpandedGuidelines(false)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest">
                   Done
                 </button>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>

       {/* Full Screen Oracle Advice Modal */}
       <AnimatePresence>
         {isExpandedAdvice && advice && (
           <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-4xl p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
             >
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                     <Sparkles className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-2xl font-bold text-white">Detailed Expert Critique</h3>
                 </div>
                 <button onClick={() => setIsExpandedAdvice(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400">
                   <X className="w-6 h-6" />
                 </button>
               </div>
               
               <div className="space-y-8">
                 <div className="bg-emerald-500/10 border border-emerald-400/20 p-8 rounded-3xl">
                   <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">Strategic Signal & Alignment</div>
                   <p className="text-lg font-bold text-white italic leading-relaxed">"{advice.strategicSignal}"</p>
                 </div>

                 <div className="space-y-6">
                   <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Recommended Narrative Shifts</h4>
                   {advice.narrativeShifts?.map((shift: string, idx: number) => (
                     <div key={idx} className="bg-slate-800/60 border border-slate-700/50 p-6 rounded-2xl flex gap-4 items-start">
                       <span className="text-emerald-400 font-mono font-bold text-lg">0{idx + 1}</span>
                       <p className="text-sm text-slate-200 leading-relaxed font-medium">{shift}</p>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                 <button onClick={() => setIsExpandedAdvice(false)} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">
                   Close Detailed View
                 </button>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>

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
                        <h2 className="text-3xl font-bold tracking-tighter">How proposals work</h2>
                      </div>
                      <button 
                        onClick={() => setShowHelp(false)}
                        className="p-3 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <X className="w-6 h-6 text-slate-400" />
                      </button>
                   </div>

                   <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">1. Discovery</h4>
                        <p className="text-xs text-slate-500">Live search + your org profile (type, mission, geography, focus).</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">2. Match analysis</h4>
                        <p className="text-xs text-slate-500">Strict eligibility, Strategic Alignment %, Feasibility %, Win probability (Low/Med/High).</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">3. Proposal writer</h4>
                        <p className="text-xs text-slate-500">
                          Generate full proposal: Intro · Problem · Plan · Budget · Results.
                          Paste NOFO notes in the sidebar. Select text to simplify, strengthen, or make it sound professional. Get expert feedback anytime.
                        </p>
                      </div>
                   </div>
                   
                   <div className="mt-12 pt-10 border-t border-slate-100 flex justify-center">
                      <button 
                        onClick={() => setShowHelp(false)}
                        className="bg-slate-900 text-white px-12 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
                      >
                         Got it — write winning proposals
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
