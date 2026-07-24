import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Building,
  DollarSign,
  AlignLeft,
  X,
  FileDown,
  Printer,
  Check,
  Minus,
} from 'lucide-react';
import { Organization } from '../types';

interface PreFlightAuditorProps {
  isOpen: boolean;
  onClose: () => void;
  grant?: any;
  draft: string;
  guidelines?: string;
  organization?: Organization | null;
  profile?: any;
  onExportWord: () => void;
  onExportPDF: () => void;
}

/**
 * Final check — a quick keyword-based review of the draft before export.
 * Honest framing: it's a helper checklist, not an official verdict.
 */
export default function PreFlightAuditor({
  isOpen,
  onClose,
  grant,
  draft,
  guidelines: _guidelines,
  organization,
  profile,
  onExportWord,
  onExportPDF,
}: PreFlightAuditorProps) {
  if (!isOpen) return null;

  const words = draft ? draft.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // 1. Do the main sections exist?
  const lowerDraft = (draft || '').toLowerCase();
  const hasIntro = lowerDraft.includes('intro') || lowerDraft.includes('executive summary') || lowerDraft.includes('hook');
  const hasNeed = lowerDraft.includes('need') || lowerDraft.includes('problem') || lowerDraft.includes('challenge');
  const hasPlan = lowerDraft.includes('plan') || lowerDraft.includes('strategy') || lowerDraft.includes('methodology') || lowerDraft.includes('approach');
  const hasBudget = lowerDraft.includes('budget') || lowerDraft.includes('cost') || lowerDraft.includes('financial');
  const hasResults = lowerDraft.includes('result') || lowerDraft.includes('evaluat') || lowerDraft.includes('impact') || lowerDraft.includes('outcome');

  const sectionsCount = [hasIntro, hasNeed, hasPlan, hasBudget, hasResults].filter(Boolean).length;
  const sectionPass = sectionsCount >= 4;

  // 2. Is your profile info in place?
  const hasOrgName = Boolean(organization?.name || profile?.name);
  const hasOrgMission = Boolean(organization?.mission || profile?.description);
  const hasState = Boolean(profile?.state || organization?.focusAreas?.[0]);
  const identityScore = [hasOrgName, hasOrgMission, hasState].filter(Boolean).length;

  // 3. Real dollar amounts?
  const hasDollarSymbols = /\$[\d,]+/.test(draft);

  // 4. Long enough?
  const volumePass = wordCount >= 300;

  let score = 0;
  score += (sectionsCount / 5) * 40;
  score += (identityScore / 3) * 25;
  score += hasDollarSymbols ? 15 : 5;
  score += wordCount >= 500 ? 20 : wordCount >= 200 ? 10 : 0;
  const finalScore = Math.min(100, Math.round(score));

  const isReady = finalScore >= 75;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="glass-panel noise-overlay rounded-[2rem] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top bar */}
          <div className="glass-panel-dark p-6 md:p-7 flex items-center justify-between shrink-0 rounded-none">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Final check</h2>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  A quick automatic look at your draft — helpful, but not official approval.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close final check"
              className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Score header */}
          <div className="bg-white/50 border-b border-slate-200/60 px-6 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border ${
                  isReady
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <span className="font-mono font-bold text-xl">{finalScore}%</span>
                <span className="text-[11px] uppercase tracking-wider font-bold">score</span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                    isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isReady ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {isReady ? 'Looks ready to export' : 'A few things to improve first'}
                </span>
                <p className="text-xs text-slate-500 font-medium mt-1.5">
                  Checking: <strong className="text-slate-800">{grant?.title || 'your current draft'}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={onExportWord} className="btn btn-primary btn-sm">
                <FileDown className="w-4 h-4" /> Export Word
              </button>
              <button type="button" onClick={onExportPDF} className="btn btn-dark btn-sm">
                <Printer className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>

          {/* Checks */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-4">
            <CheckRow
              icon={<FileText className="w-5 h-5" />}
              title="Does it have the main sections?"
              pass={sectionPass}
              status={`${sectionsCount} of 5 sections found`}
              body="Strong proposals usually cover: an introduction, the need or problem, your plan, a budget, and expected results."
              extra={
                <div className="flex flex-wrap gap-1.5">
                  <Tag label="Intro" pass={hasIntro} />
                  <Tag label="Need" pass={hasNeed} />
                  <Tag label="Plan" pass={hasPlan} />
                  <Tag label="Budget" pass={hasBudget} />
                  <Tag label="Results" pass={hasResults} />
                </div>
              }
            />
            <CheckRow
              icon={<Building className="w-5 h-5" />}
              title="Is your profile info in place?"
              pass={identityScore === 3}
              status={`${identityScore} of 3 details filled in`}
              body={
                organization?.name || profile?.name
                  ? `Writing as: ${organization?.name || profile?.name}. Funders want to know who you are — name, mission, and location.`
                  : 'Your name or organization is missing. Add it in Settings so funders know who is applying.'
              }
            />
            <CheckRow
              icon={<DollarSign className="w-5 h-5" />}
              title="Does it mention real dollar amounts?"
              pass={hasDollarSymbols}
              status={hasDollarSymbols ? 'Dollar amounts found' : 'No dollar amounts yet'}
              body={
                hasDollarSymbols
                  ? 'Good — specific numbers make a budget believable.'
                  : 'Add specific numbers (like $50,000 for staff) — reviewers trust drafts that show real math.'
              }
            />
            <CheckRow
              icon={<AlignLeft className="w-5 h-5" />}
              title="Is it long enough?"
              pass={volumePass}
              status={`${wordCount.toLocaleString()} words`}
              body={
                wordCount >= 500
                  ? 'Good length for most grant applications.'
                  : 'Under 500 words is usually too short. Say more about how you’ll do the work and how you’ll measure results.'
              }
            />

            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              This check looks for keywords — it can’t judge quality, and it doesn’t replace reading
              the funder’s rules. Always follow the official instructions on the .gov page.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200/60 px-6 md:px-8 py-4 bg-white/40 flex items-center justify-between gap-4 shrink-0">
            <span className="text-xs text-slate-500 font-medium">
              Export your draft as a Word or PDF file anytime.
            </span>
            <button onClick={onClose} className="btn btn-dark btn-sm">
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function CheckRow({
  icon,
  title,
  pass,
  status,
  body,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  pass: boolean;
  status: string;
  body: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-2xl bento-tile flex items-start gap-4">
      <div className="p-2.5 rounded-xl bg-slate-100/80 text-slate-600 shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          <span
            className={`text-xs font-bold flex items-center gap-1 ${
              pass ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {pass ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {status}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-2">{body}</p>
        {extra}
      </div>
    </div>
  );
}

function Tag({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-bold border inline-flex items-center gap-1 ${
        pass
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-slate-50 text-slate-400 border-slate-200'
      }`}
    >
      {pass ? <Check className="w-3 h-3" /> : <Minus className="w-3 h-3" />} {label}
    </span>
  );
}
