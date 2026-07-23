import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  FileText,
  Building,
  DollarSign,
  AlignLeft,
  BookOpen,
  X,
  FileDown,
  Printer,
  Sparkles
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

export default function PreFlightAuditor({
  isOpen,
  onClose,
  grant,
  draft,
  guidelines,
  organization,
  profile,
  onExportWord,
  onExportPDF,
}: PreFlightAuditorProps) {
  if (!isOpen) return null;

  const words = draft ? draft.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // 1. Narrative Structure Check
  const lowerDraft = (draft || '').toLowerCase();
  const hasIntro = lowerDraft.includes('intro') || lowerDraft.includes('executive summary') || lowerDraft.includes('hook');
  const hasNeed = lowerDraft.includes('need') || lowerDraft.includes('problem') || lowerDraft.includes('challenge');
  const hasPlan = lowerDraft.includes('plan') || lowerDraft.includes('strategy') || lowerDraft.includes('methodology') || lowerDraft.includes('approach');
  const hasBudget = lowerDraft.includes('budget') || lowerDraft.includes('cost') || lowerDraft.includes('financial');
  const hasResults = lowerDraft.includes('result') || lowerDraft.includes('evaluat') || lowerDraft.includes('impact') || lowerDraft.includes('outcome');

  const sectionsCount = [hasIntro, hasNeed, hasPlan, hasBudget, hasResults].filter(Boolean).length;
  const sectionPass = sectionsCount >= 4;

  // 2. Organization Identity Check
  const hasOrgName = Boolean(organization?.name || profile?.name);
  const hasOrgMission = Boolean(organization?.mission || profile?.description);
  const hasState = Boolean(profile?.state || organization?.focusAreas?.[0]);
  const identityScore = [hasOrgName, hasOrgMission, hasState].filter(Boolean).length;

  // 3. Financial Integrity Check
  const hasDollarSymbols = /\$[\d,]+/.test(draft);
  const hasGrantAmount = grant?.amount > 0 || hasDollarSymbols;

  // 4. Volume / Length Check
  const volumePass = wordCount >= 300;

  // Calculate composite readiness score (0 to 100%)
  let score = 0;
  score += (sectionsCount / 5) * 40; // 40 points max
  score += (identityScore / 3) * 25; // 25 points max
  score += (hasDollarSymbols ? 15 : 5); // 15 points max
  score += (wordCount >= 500 ? 20 : wordCount >= 200 ? 10 : 0); // 20 points max
  const finalScore = Math.min(100, Math.round(score));

  const isReady = finalScore >= 75;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="bg-slate-900 text-white p-6 md:p-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Pre-Flight Compliance Auditor</h2>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Automated Federal & Foundation Readiness Verification
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Score Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-xl border ${
                  isReady
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <span>{finalScore}%</span>
                <span className="text-[9px] uppercase tracking-widest font-bold font-mono">Score</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isReady
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isReady ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {isReady ? 'Ready for Export & Submission' : 'Minor Revisions Suggested'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Target Opportunity: <strong className="text-slate-800">{grant?.title || 'Active Proposal Draft'}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onExportWord}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <FileDown className="w-4 h-4" /> Export Word
              </button>
              <button
                type="button"
                onClick={onExportPDF}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
              >
                <Printer className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>

          {/* Audit Checks List */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-4">
            {/* Check 1: Narrative Sections */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">Proposal Narrative Structure</h4>
                  <span className={`text-xs font-bold flex items-center gap-1 ${sectionPass ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {sectionPass ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {sectionsCount}/5 Core Sections Identified
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  Scans for standard sections: Executive Intro, Need / Problem, Plan / Strategy, Budget Narrative, and Results / Evaluation.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Tag label="Intro" pass={hasIntro} />
                  <Tag label="Need" pass={hasNeed} />
                  <Tag label="Plan" pass={hasPlan} />
                  <Tag label="Budget" pass={hasBudget} />
                  <Tag label="Results" pass={hasResults} />
                </div>
              </div>
            </div>

            {/* Check 2: Institutional Metadata */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 shrink-0 mt-0.5">
                <Building className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">Institutional Identity & Profile</h4>
                  <span className={`text-xs font-bold flex items-center gap-1 ${identityScore === 3 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {identityScore === 3 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {identityScore}/3 Profile Elements
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {organization?.name ? `Organization verified: ${organization.name}` : 'Organization name missing in settings.'}
                </p>
              </div>
            </div>

            {/* Check 3: Financial Figures */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 shrink-0 mt-0.5">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">Budget Narrative & Financial Figures</h4>
                  <span className={`text-xs font-bold flex items-center gap-1 ${hasDollarSymbols ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {hasDollarSymbols ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {hasDollarSymbols ? 'Financial Figures Found' : 'No $ Figures Detected'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {hasDollarSymbols
                    ? 'Specific dollar amounts and financial details are present in the proposal.'
                    : 'Consider adding specific budget figures (e.g. $50,000) for personnel and supplies.'}
                </p>
              </div>
            </div>

            {/* Check 4: Volume & Length */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 shrink-0 mt-0.5">
                <AlignLeft className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">Narrative Length & Volume</h4>
                  <span className={`text-xs font-bold flex items-center gap-1 ${volumePass ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {volumePass ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {wordCount.toLocaleString()} Words Total
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {wordCount >= 500
                    ? 'Optimal narrative depth for federal and foundation grant applications.'
                    : 'Draft is under 500 words. Consider elaborating on methodology and measurable outcomes.'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 px-6 md:px-8 py-4 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
            <span className="text-xs text-slate-500 font-medium">
              Ready to export as Word or PDF document.
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Tag({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${
        pass
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-slate-50 text-slate-400 border-slate-200'
      }`}
    >
      {pass ? '✓' : '•'} {label}
    </span>
  );
}
