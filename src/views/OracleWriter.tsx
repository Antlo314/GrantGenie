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
  Minimize2,
  ShieldCheck,
  FileDown,
  Printer,
  ChevronDown,
  History,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import {
  getOracleAdvice,
  transformText,
  generateAwardWinningProposal,
  profileFromOrganization,
} from '../services/geminiService';
import PreFlightAuditor from '../components/PreFlightAuditor';
import VersionHistory from '../components/VersionHistory';
import InfoTip from '../components/InfoTip';
import { Modal } from '../components/ui';
import { exportToWord, exportToPDF } from '../lib/exportUtils';
import { saveVersion, logAudit } from '../lib/versionStore';

import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function OracleWriter({ grant, onBack }: { grant?: any, onBack: () => void }) {
  const { organization, user } = useAuth();
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
  const [showAuditor, setShowAuditor] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const expandedTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleExportWord = () => {
    exportToWord({
      title: grant?.title || 'Grant Proposal',
      funder: grant?.funder || 'Funding Agency',
      draft,
      organization,
      amount: grant?.amount,
      deadline: grant?.deadline,
    });
    setShowExportMenu(false);
    if (grant?.pipelineId) {
      logAudit(grant.pipelineId, {
        action: 'exported_word',
        actor: user?.uid || 'unknown',
        actorName: user?.displayName || 'Unknown',
        timestamp: new Date().toISOString(),
        details: `Exported "${grant?.title || 'Untitled'}" to Word`,
      });
    }
  };

  const handleExportPDF = () => {
    exportToPDF({
      title: grant?.title || 'Grant Proposal',
      funder: grant?.funder || 'Funding Agency',
      draft,
      organization,
      amount: grant?.amount,
      deadline: grant?.deadline,
    });
    setShowExportMenu(false);
    if (grant?.pipelineId) {
      logAudit(grant.pipelineId, {
        action: 'exported_pdf',
        actor: user?.uid || 'unknown',
        actorName: user?.displayName || 'Unknown',
        timestamp: new Date().toISOString(),
        details: `Exported "${grant?.title || 'Untitled'}" to PDF`,
      });
    }
  };

  const fetchOracleAdvice = async () => {
    if (!organization) return;
    setLoadingAdvice(true);
    try {
      const result = await getOracleAdvice(organization.mission, draft, guidelines);
      setAdvice(result);
    } catch (err) {
      console.error("Oracle advice failed:", err);
      alert('Could not get feedback. Check GEMINI_API_KEY.');
    } finally {
      setLoadingAdvice(false);
    }
  };

  /** Module 3 — full award-winning proposal */
  const generateFullProposal = async () => {
    if (!organization || !grant) {
      alert('Pick a grant in Find opportunities first, then open the writer.');
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
          ? `Draft ready · uses the funder's words: ${proposal.funderKeywordsUsed.slice(0, 4).join(', ')}`
          : 'Your first draft is ready'
      );
      setTimeout(() => setSaveMessage(null), 5000);
      if (grant?.pipelineId) {
        logAudit(grant.pipelineId, {
          action: 'ai_generated',
          actor: user?.uid || 'unknown',
          actorName: user?.displayName || 'Unknown',
          timestamp: new Date().toISOString(),
          details: `AI generated full proposal (${proposal.fullMarkdown.trim().split(/\s+/).length} words)`,
        });
      }
    } catch (err) {
      console.error('Proposal engine failed:', err);
      alert('Could not write the draft. Check GEMINI_API_KEY in .env.local');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (stage: 'drafting' | 'review' = 'drafting') => {
    if (!grant?.pipelineId) {
      setSaveMessage("Can't save yet — add this grant to My applications first.");
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    try {
      const docRef = doc(db, 'pipeline_grants', grant.pipelineId);
      await updateDoc(docRef, {
        draft: draft,
        stage: stage,
        lastEditedAt: now
      });
      // Save version snapshot
      await saveVersion(grant.pipelineId, {
        draft,
        stage,
        savedBy: user?.uid || 'unknown',
        savedByName: user?.displayName || 'Unknown',
        savedAt: now,
        wordCount: draft.trim().split(/\s+/).filter(Boolean).length,
      });
      // Log audit entry
      await logAudit(grant.pipelineId, {
        action: stage === 'review' ? 'stage_changed' : 'draft_saved',
        actor: user?.uid || 'unknown',
        actorName: user?.displayName || 'Unknown',
        timestamp: now,
        details: stage === 'review'
          ? 'Marked proposal as ready for review'
          : `Saved draft (${draft.trim().split(/\s+/).filter(Boolean).length} words)`,
      });
      setSaveMessage(stage === 'review' ? "Marked as ready ✓" : "Saved ✓ A copy went to History");
    } catch (e) {
      console.error("Failed to save draft:", e);
      setSaveMessage("Couldn't save. Try again.");
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
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="p-3 glass-panel rounded-2xl text-slate-500 hover:text-emerald-700 transition-colors shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 truncate">Write your proposal</h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium truncate">
                <span className="text-emerald-700 font-semibold">{grant?.title || 'Pick a grant in Find opportunities first'}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full md:w-auto">
            {saveMessage && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="text-xs font-bold text-emerald-700 mr-2 w-full md:w-auto"
              >
                {saveMessage}
              </motion.span>
            )}
            <button
              type="button"
              onClick={generateFullProposal}
              disabled={generating || !grant}
              className="btn btn-dark"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" /> {generating ? 'Writing…' : 'Write a first draft for me'}
            </button>
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="btn btn-ghost"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" /> How this works
            </button>
            <button
              type="button"
              onClick={() => setShowAuditor(true)}
              className="btn btn-secondary"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Final check
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(v => !v)}
                aria-haspopup="menu"
                aria-expanded={showExportMenu}
                className="btn btn-secondary"
              >
                <FileDown className="w-4 h-4" /> Export <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl z-[100] py-2 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={handleExportWord}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 flex items-center gap-2 transition-colors"
                  >
                    <FileDown className="w-4 h-4 text-emerald-600" /> Download as Word (.doc)
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 flex items-center gap-2 transition-colors"
                  >
                    <Printer className="w-4 h-4 text-slate-500" /> Save as PDF
                  </button>
                </motion.div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowVersionHistory(true)}
              className="btn btn-ghost"
              title="Past versions and activity"
            >
              <History className="w-4 h-4" /> History
            </button>
            <button
              type="button"
              onClick={() => handleSave('drafting')}
              disabled={saving}
              className="btn btn-secondary"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => handleSave('review')}
              disabled={saving}
              className="btn btn-primary"
            >
              <Send className="w-4 h-4" /> Mark as ready
            </button>
          </div>
       </div>
       <div className="flex-1 flex flex-col xl:flex-row gap-4 md:gap-8 min-h-[600px] pb-8 xl:pb-0">
          {/* Main editing area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 110, damping: 20 }}
            className="flex-1 min-h-[450px] md:min-h-[550px] glass-panel rounded-[2rem] flex flex-col relative overflow-hidden shrink-0"
          >
             {/* 3-step banner when the draft is empty */}
             {!draft && (
               <div className="bg-emerald-50/80 border-b border-emerald-100 px-4 md:px-6 py-3 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2 shrink-0">
                 <div className="flex items-center gap-2 font-bold text-emerald-800">
                   <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                   <span>Three steps to a finished proposal:</span>
                 </div>
                 <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-emerald-800">
                   <span><strong>1.</strong> Click “Write a first draft for me”</span>
                   <span className="text-emerald-300">•</span>
                   <span><strong>2.</strong> Edit anything you want to change</span>
                   <span className="text-emerald-300">•</span>
                   <span><strong>3.</strong> Click “Mark as ready”, then apply on the official site</span>
                 </div>
               </div>
             )}

             <div className="h-14 border-b border-slate-200/60 flex items-center px-4 md:px-8 justify-between bg-white/40 shrink-0">
                <div className="flex gap-2 md:gap-4 h-full overflow-x-auto no-scrollbar whitespace-nowrap items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                   <span className="text-emerald-600">Intro</span>
                   <span>· Problem</span>
                   <span>· Plan</span>
                   <span>· Budget</span>
                   <span>· Results</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-xs text-slate-400 font-semibold hidden sm:block truncate max-w-[160px]">
                    {grant?.funder || 'Funder'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExpandedEditor(true)}
                    aria-label="Open focus mode"
                    className="btn btn-secondary btn-sm"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Focus mode</span>
                  </button>
                </div>
             </div>

             {/* Select-text rewrite toolbar */}
             <div className="border-b border-slate-200/60 bg-white/30 px-4 md:px-8 py-2.5 flex items-center gap-3 md:gap-4 overflow-x-auto no-scrollbar shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider shrink-0">
                  <Zap className="w-3.5 h-3.5" /> Select text, then
                </div>
                <div className="w-px h-4 bg-slate-200 shrink-0" />
                <button
                  type="button"
                  onClick={() => handleTransform('simplify')}
                  disabled={!!transforming}
                  className="btn btn-ghost btn-sm shrink-0"
                >
                  {transforming === 'simplify' ? 'Simplifying…' : 'Simplify this'}
                </button>
                <button
                  type="button"
                  onClick={() => handleTransform('amplify')}
                  disabled={!!transforming}
                  className="btn btn-ghost btn-sm shrink-0"
                >
                  {transforming === 'amplify' ? 'Strengthening…' : 'Strengthen this'}
                </button>
                <button
                  type="button"
                  onClick={() => handleTransform('tone_shift')}
                  disabled={!!transforming}
                  className="btn btn-ghost btn-sm shrink-0"
                >
                  {transforming === 'tone_shift' ? 'Polishing…' : 'Make it sound professional'}
                </button>
             </div>

             <textarea
               ref={textareaRef}
               value={draft}
               onChange={(e) => setDraft(e.target.value)}
               placeholder="Click “Write a first draft for me” to get a full 5-part draft (Intro, Problem, Plan, Budget, Results) — or start typing here. Select any text to simplify it, strengthen it, or make it sound professional."
               className="flex-1 m-3 md:m-5 bg-white/90 border border-slate-200/70 rounded-2xl p-5 md:p-8 text-sm md:text-base leading-relaxed focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/15 resize-none custom-scrollbar font-sans text-slate-800 selection:bg-emerald-100 min-h-[350px] transition-shadow"
             />
          </motion.div>

          {/* Sidebar */}
          <div className="w-full xl:w-[450px] flex flex-col gap-6 pr-0 shrink-0">
             {/* Funder guidelines */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ type: 'spring', stiffness: 120, damping: 18 }}
               className="bento-tile p-6 md:p-8"
             >
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-[0.16em]">Funder guidelines</h3>
                      <InfoTip title="What are funder guidelines?" label="What are funder guidelines?">
                        The funder’s own rules for what your proposal must cover. You’ll find them on
                        the official grant page (often in a document called a NOFO — Notice of Funding
                        Opportunity). Paste them here so your draft and feedback follow them.
                      </InfoTip>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsExpandedGuidelines(true)}
                      aria-label="Expand guidelines"
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs text-slate-500 font-semibold">Award amount</p>
                          <p className="font-mono font-bold text-slate-900 text-lg truncate">
                            {grant?.amount > 0
                              ? `$${Number(grant.amount).toLocaleString()}`
                              : 'Not listed'}
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-amber-600" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs text-slate-500 font-semibold">Deadline</p>
                          <p className="font-mono font-bold text-slate-900 text-lg truncate">
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
                    <div>
                      <p className="text-xs text-slate-500 mb-2 leading-snug">
                        {grant?.description
                          ? 'From the listing — edit it or add more detail anytime.'
                          : 'Sample guidelines — paste the funder’s real instructions here.'}
                      </p>
                      <textarea
                        value={guidelines}
                        onChange={(e) => setGuidelines(e.target.value)}
                        className="field h-40 resize-none custom-scrollbar leading-relaxed"
                        placeholder="Paste the funder's instructions here…"
                      />
                    </div>
                  </div>
             </motion.div>

             {/* Feedback panel */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.05 }}
               className="flex-1 glass-panel-dark text-white rounded-[2rem] p-6 md:p-8 relative overflow-hidden min-h-[450px]"
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
                       <h3 className="text-lg md:text-xl font-bold tracking-tight">Feedback on your draft</h3>
                     </div>
                     {advice && (
                       <button
                         type="button"
                         onClick={() => setIsExpandedAdvice(true)}
                         aria-label="Expand feedback"
                         className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                       >
                         <Maximize2 className="w-4 h-4 text-emerald-300" />
                       </button>
                     )}
                   </div>

                   {!advice && !loadingAdvice && (
                      <div className="text-center py-12 my-auto">
                         <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <MessageSquareCode className="w-10 h-10 text-emerald-300" />
                         </div>
                         <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                           We’ll compare your draft to the funder’s guidelines and suggest changes.
                         </p>
                         <button
                           type="button"
                           onClick={fetchOracleAdvice}
                           className="btn btn-primary w-full"
                         >
                            Get feedback
                         </button>
                      </div>
                   )}

                   {loadingAdvice && (
                     <div className="flex flex-col items-center justify-center py-20 gap-6 my-auto">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                           <Sparkles className="w-16 h-16 text-emerald-300" />
                        </motion.div>
                        <p className="text-xs font-bold text-emerald-300 animate-pulse uppercase tracking-widest">Reading the funder's priorities…</p>
                     </div>
                   )}

                   {advice && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                        className="space-y-7"
                      >
                         <div className="glass-emerald p-5 rounded-2xl">
                            <p className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider mb-2.5">Main takeaway</p>
                            <p className="text-sm font-semibold text-white leading-relaxed">“{advice.strategicSignal}”</p>
                         </div>

                         <div className="space-y-5">
                            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                              Suggested changes (<span className="font-mono">{advice.narrativeShifts?.length || 0}</span>)
                            </p>
                            {advice.narrativeShifts?.map((shift: string, idx: number) => (
                              <div key={idx} className="flex gap-4 group">
                                <div className="text-emerald-300 font-mono text-xs font-bold mt-0.5">0{idx + 1}</div>
                                <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">{shift}</p>
                              </div>
                            ))}
                         </div>

                         <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                if (draft.trim() && !window.confirm('Clear your draft and start over? This erases the text in the editor.')) return;
                                setAdvice(null);
                                setDraft('');
                              }}
                              className="btn btn-secondary btn-sm"
                            >
                               Start over <Zap className="w-3 h-3 text-emerald-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsExpandedAdvice(true)}
                              className="text-xs font-bold text-emerald-300 hover:text-emerald-200 hover:underline flex items-center gap-1 transition-colors"
                            >
                              Open full view <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      </motion.div>
                   )}
                </div>
             </motion.div>
          </div>
       </div>

       {/* Focus mode — full screen editor */}
       <AnimatePresence>
         {isExpandedEditor && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[120] flex flex-col gg-app-bg p-4 sm:p-6"
           >
             <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/70 shrink-0">
               <div className="flex items-center gap-3 min-w-0">
                 <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                   <Sparkles className="w-5 h-5" />
                 </div>
                 <div className="min-w-0">
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight">Focus mode</h2>
                   <p className="text-xs text-slate-500 font-medium truncate">{grant?.title || 'Your draft, without distractions'}</p>
                 </div>
               </div>
               <div className="flex items-center gap-2 shrink-0">
                 <button
                   type="button"
                   onClick={() => handleSave('drafting')}
                   disabled={saving}
                   className="btn btn-primary btn-sm"
                 >
                   <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
                 </button>
                 <button
                   type="button"
                   onClick={() => setIsExpandedEditor(false)}
                   aria-label="Exit focus mode"
                   className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
                 >
                   <Minimize2 className="w-5 h-5" />
                 </button>
               </div>
             </div>
             <textarea
               ref={expandedTextareaRef}
               value={draft}
               onChange={(e) => setDraft(e.target.value)}
               placeholder="Write your proposal here…"
               className="flex-1 w-full bg-white/90 border border-slate-200/70 rounded-2xl p-6 md:p-10 text-base md:text-lg leading-relaxed focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/15 resize-none custom-scrollbar font-sans text-slate-900"
             />
           </motion.div>
         )}
       </AnimatePresence>

       {/* Funder guidelines — expanded */}
       <Modal
         open={isExpandedGuidelines}
         onClose={() => setIsExpandedGuidelines(false)}
         title="Funder guidelines"
         wide
         footer={
           <div className="flex justify-end">
             <button
               type="button"
               onClick={() => setIsExpandedGuidelines(false)}
               className="btn btn-primary"
             >
               Done
             </button>
           </div>
         }
       >
         <p className="text-xs text-slate-500 mb-3 leading-relaxed">
           {grant?.description
             ? 'These came from the listing — edit them or add more detail anytime.'
             : 'Sample guidelines — paste the funder’s real instructions here.'}
         </p>
         <textarea
           value={guidelines}
           onChange={(e) => setGuidelines(e.target.value)}
           className="field min-h-[380px] resize-none custom-scrollbar leading-relaxed"
           aria-label="Funder guidelines"
         />
       </Modal>

       {/* Full feedback — expanded */}
       <AnimatePresence>
         {isExpandedAdvice && advice && (
           <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
             <motion.div
               role="dialog"
               aria-modal="true"
               initial={{ opacity: 0, scale: 0.96, y: 16 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.97, y: 10 }}
               transition={{ type: 'spring', stiffness: 260, damping: 26 }}
               className="glass-panel-dark text-white rounded-[2rem] w-full max-w-4xl p-6 sm:p-10 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
             >
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                     <Sparkles className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-2xl font-bold text-white tracking-tight">Full feedback</h3>
                 </div>
                 <button
                   type="button"
                   onClick={() => setIsExpandedAdvice(false)}
                   aria-label="Close feedback"
                   className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>

               <div className="space-y-8">
                 <div className="glass-emerald p-6 sm:p-8 rounded-2xl">
                   <p className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider mb-3">Main takeaway</p>
                   <p className="text-lg font-semibold text-white leading-relaxed">“{advice.strategicSignal}”</p>
                 </div>

                 <div className="space-y-4">
                   <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Suggested changes</h4>
                   {advice.narrativeShifts?.map((shift: string, idx: number) => (
                     <div key={idx} className="bg-white/5 border border-white/10 p-5 sm:p-6 rounded-2xl flex gap-4 items-start">
                       <span className="text-emerald-300 font-mono font-bold text-lg">0{idx + 1}</span>
                       <p className="text-sm text-slate-200 leading-relaxed">{shift}</p>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                 <button
                   type="button"
                   onClick={() => setIsExpandedAdvice(false)}
                   className="btn btn-primary"
                 >
                   Done
                 </button>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>

       {/* How this works */}
       <Modal
         open={showHelp}
         onClose={() => setShowHelp(false)}
         title="How proposals work"
         footer={
           <div className="flex justify-end">
             <button
               type="button"
               onClick={() => setShowHelp(false)}
               className="btn btn-primary"
             >
               Got it
             </button>
           </div>
         }
       >
         <div className="space-y-5">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">1. Find</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We search real government listings and match them to your profile — your mission,
                location, and focus areas.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">2. Match</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We check who is allowed to apply, then score how well each grant fits your work and
                your odds of winning (low, medium, or high).
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">3. Write</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click “Write a first draft for me” to get a full draft: Intro, Problem, Plan, Budget,
                and Results. Paste the funder’s instructions in the sidebar, select any text to
                rewrite it, and ask for feedback anytime. You always submit on the official
                government site.
              </p>
            </div>
         </div>
       </Modal>

       <PreFlightAuditor
         isOpen={showAuditor}
         onClose={() => setShowAuditor(false)}
         grant={grant}
         draft={draft}
         guidelines={guidelines}
         organization={organization}
         onExportWord={handleExportWord}
         onExportPDF={handleExportPDF}
       />

       <VersionHistory
         isOpen={showVersionHistory}
         onClose={() => setShowVersionHistory(false)}
         pipelineId={grant?.pipelineId || ''}
         currentDraft={draft}
         onRestore={(restoredDraft, versionId) => {
           setDraft(restoredDraft);
           setShowVersionHistory(false);
           setSaveMessage('Older version restored — remember to Save to keep it.');
           setTimeout(() => setSaveMessage(null), 4000);
           if (grant?.pipelineId) {
             logAudit(grant.pipelineId, {
               action: 'draft_restored',
               actor: user?.uid || 'unknown',
               actorName: user?.displayName || 'Unknown',
               timestamp: new Date().toISOString(),
               details: `Restored version ${versionId}`,
             });
           }
         }}
       />
    </div>
  );
}
