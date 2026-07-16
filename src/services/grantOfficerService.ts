/**
 * Grant Genie — AI Grant Officer (3-module framework)
 *
 * MODULE 1: Discovery & Data Extraction (profile + live filter context)
 * MODULE 2: Match Analysis & Scoring (strict eligibility + dual scores)
 * MODULE 3: Proposal Engine (award-winning 5-section framework)
 */

import { GoogleGenAI } from '@google/genai';
import type { Grant, Organization } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const MODEL = 'gemini-2.5-flash';

// ─── Shared profile for Module 1 ───────────────────────────────────────────

export type OrgType = '501c3' | 'startup' | 'llc' | 'for_profit' | 'government' | 'individual' | 'other';

export interface ApplicantProfile {
  orgName: string;
  orgType: OrgType | string;
  industry: string;
  mission: string;
  projectScope: string;
  fundingNeeded?: number;
  geography: string;
  focusAreas: string[];
  ein?: string;
}

export function profileFromOrganization(
  org: Organization | null | undefined,
  extras?: Partial<ApplicantProfile>
): ApplicantProfile {
  return {
    orgName: org?.name || extras?.orgName || 'Organization',
    orgType: extras?.orgType || '501c3',
    industry: extras?.industry || org?.focusAreas?.[0] || 'community',
    mission: org?.mission || extras?.mission || '',
    projectScope: extras?.projectScope || org?.mission || '',
    fundingNeeded: extras?.fundingNeeded,
    geography: extras?.geography || 'United States',
    focusAreas: org?.focusAreas || extras?.focusAreas || [],
    ein: org?.ein || extras?.ein,
  };
}

function profileBlock(p: ApplicantProfile): string {
  return [
    `Organization: ${p.orgName}`,
    `Type: ${p.orgType}`,
    `Industry / sector: ${p.industry}`,
    `Mission: ${p.mission}`,
    `Project scope: ${p.projectScope}`,
    p.fundingNeeded != null ? `Funding needed: $${p.fundingNeeded.toLocaleString()}` : null,
    `Geography: ${p.geography}`,
    p.focusAreas?.length ? `Focus areas: ${p.focusAreas.join(', ')}` : null,
    p.ein ? `EIN: ${p.ein}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

function grantBlock(g: Grant): string {
  return [
    `Grant: ${g.title}`,
    `Funder: ${g.funder}`,
    g.opportunityNumber ? `Opportunity #: ${g.opportunityNumber}` : null,
    `Deadline: ${g.deadline}`,
    g.amount ? `Amount (if known): $${g.amount}` : null,
    `Status: ${g.status || 'posted'}`,
    `Source: ${g.sourceUrl || 'Grants.gov'}`,
    `Description / synopsis: ${g.description}`,
    g.tags?.length ? `Tags: ${g.tags.join(', ')}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

async function jsonModel<T>(prompt: string): Promise<T> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });
  const text = response.text || '{}';
  return JSON.parse(text) as T;
}

// ─── MODULE 2: Match Analysis & Scoring ────────────────────────────────────

export type WinProbability = 'Low' | 'Medium' | 'High';

export interface MatchAnalysis {
  grantName: string;
  funder: string;
  /** Mission / historical giving alignment */
  strategicAlignmentScore: number;
  /** Deadline, complexity, reporting burden */
  feasibilityScore: number;
  /** Combined 0–100 used in UI as matchScore */
  compositeScore: number;
  winProbability: WinProbability;
  /** Fail hard if any criterion is unmet */
  eligible: boolean;
  eligibilityFailures: string[];
  eligibilityPasses: string[];
  strategicIntelligence: string;
  alignmentSummary: string;
  tags: string[];
  recommendedNextStep: string;
}

export async function analyzeGrantMatch(
  profile: ApplicantProfile,
  grant: Grant
): Promise<MatchAnalysis> {
  const prompt = `You are an expert AI Grant Officer and Data Scientist. Operate MODULE 2: MATCH ANALYSIS & SCORING with absolute rigor.

APPLICANT PROFILE (Module 1 extraction):
${profileBlock(profile)}

GRANT OPPORTUNITY:
${grantBlock(grant)}

RULES:
1. Evaluate eligibility STRICTLY. If the applicant fails even ONE clear eligibility criterion (org type, geography, eligible applicants, activity type), set eligible=false and list failures.
2. If information is missing on the grant side, state assumptions explicitly; do not invent hard disqualifiers without evidence.
3. strategicAlignmentScore (1-100): mission fit vs funder's stated focus / historical federal program intent.
4. feasibilityScore (1-100): deadline proximity, complexity of federal application, reporting burden, capacity signal.
5. compositeScore: weighted blend ~60% alignment + 40% feasibility, integer 0-100. If not eligible, compositeScore must be <= 35.
6. winProbability: Low / Medium / High — never High if eligible=false or composite < 55.
7. Tone: authoritative, specific, no generic AI filler. Use funder/program vocabulary when present.
8. tags: 3-8 concrete focus tags.

Return ONLY JSON:
{
  "grantName": string,
  "funder": string,
  "strategicAlignmentScore": number,
  "feasibilityScore": number,
  "compositeScore": number,
  "winProbability": "Low" | "Medium" | "High",
  "eligible": boolean,
  "eligibilityFailures": string[],
  "eligibilityPasses": string[],
  "strategicIntelligence": string,
  "alignmentSummary": string,
  "tags": string[],
  "recommendedNextStep": string
}`;

  const raw = await jsonModel<Partial<MatchAnalysis>>(prompt);

  const alignment = clamp(Number(raw.strategicAlignmentScore) || 0, 0, 100);
  const feasibility = clamp(Number(raw.feasibilityScore) || 0, 0, 100);
  let composite = clamp(
    Number(raw.compositeScore) || Math.round(alignment * 0.6 + feasibility * 0.4),
    0,
    100
  );
  const eligible = raw.eligible !== false;
  if (!eligible) composite = Math.min(composite, 35);

  let win = (raw.winProbability || 'Low') as WinProbability;
  if (!['Low', 'Medium', 'High'].includes(win)) win = 'Low';
  if (!eligible || composite < 55) win = win === 'High' ? 'Medium' : win;
  if (composite < 40) win = 'Low';

  return {
    grantName: raw.grantName || grant.title,
    funder: raw.funder || grant.funder,
    strategicAlignmentScore: alignment,
    feasibilityScore: feasibility,
    compositeScore: composite,
    winProbability: win,
    eligible,
    eligibilityFailures: raw.eligibilityFailures || [],
    eligibilityPasses: raw.eligibilityPasses || [],
    strategicIntelligence: raw.strategicIntelligence || '',
    alignmentSummary: raw.alignmentSummary || '',
    tags: Array.isArray(raw.tags) ? raw.tags : grant.tags || [],
    recommendedNextStep: raw.recommendedNextStep || 'Review official NOFO on Grants.gov before applying.',
  };
}

/** Back-compat wrapper used by existing UI */
export async function generateGrantIntel(mission: string, grantDescription: string, grant?: Grant) {
  const profile = profileFromOrganization(null, { mission, projectScope: mission });
  const g: Grant =
    grant ||
    ({
      id: 'temp',
      title: 'Opportunity',
      funder: 'Funder',
      amount: 0,
      deadline: new Date().toISOString(),
      description: grantDescription,
      matchScore: 0,
      matchExplanation: '',
      tags: [],
      sourceUrl: '',
      active: true,
    } as Grant);

  const analysis = await analyzeGrantMatch(profile, {
    ...g,
    description: grantDescription || g.description,
  });

  return {
    matchScore: analysis.compositeScore,
    strategicIntelligence: analysis.strategicIntelligence,
    tags: analysis.tags,
    alignmentSummary: analysis.alignmentSummary,
    // Extended fields for new UI
    ...analysis,
  };
}

// ─── MODULE 3: Proposal Engine ─────────────────────────────────────────────

export interface AwardWinningProposal {
  executiveSummary: string;
  statementOfNeed: string;
  projectDescription: string;
  budgetNarrative: string;
  evaluationPlan: string;
  fullMarkdown: string;
  funderKeywordsUsed: string[];
}

export async function generateAwardWinningProposal(
  profile: ApplicantProfile,
  grant: Grant,
  options?: {
    fundingRequest?: number;
    targetPopulation?: string;
    guidelines?: string;
    analysis?: MatchAnalysis | null;
  }
): Promise<AwardWinningProposal> {
  const request =
    options?.fundingRequest ??
    profile.fundingNeeded ??
    (grant.amount > 0 ? grant.amount : undefined);

  const prompt = `You are a Master Grant Writer and expert AI Grant Officer. Execute MODULE 3: THE PROPOSAL ENGINE using professional, high-impact methodologies.

Write an award-winning draft tailored to THIS funder. Never use generic boilerplate or AI filler. Mirror the funder's vocabulary and stated priorities. Be authoritative, persuasive, emotionally compelling, and evidence-backed.

APPLICANT:
${profileBlock(profile)}

GRANT / FUNDER:
${grantBlock(grant)}

${options?.guidelines ? `ADDITIONAL GUIDELINES / NOFO NOTES:\n${options.guidelines}\n` : ''}
${options?.analysis ? `PRIOR MATCH ANALYSIS:\nAlignment ${options.analysis.strategicAlignmentScore}%, Feasibility ${options.analysis.feasibilityScore}%, Win: ${options.analysis.winProbability}\n${options.analysis.strategicIntelligence}\n` : ''}
Funding request: ${request != null ? `$${request.toLocaleString()}` : 'state a justified amount in range for this program type'}
Target population: ${options?.targetPopulation || 'communities served by the applicant mission'}

REQUIRED SECTIONS (return each as a complete prose block, then also fullMarkdown assembling them):

1. EXECUTIVE SUMMARY (The Hook)
   - Hook the reviewer in the first two sentences.
   - State exact funding request, target population, and expected ROI / outcomes.

2. STATEMENT OF NEED (The Urgency)
   - Localized data, statistics (use plausible public-domain style stats with clear framing; do not fabricate precise fake citations — prefer "community-level indicators suggest" when data is unavailable).
   - Human-centric narrative + why THIS funder's intervention fits.

3. PROJECT DESCRIPTION & METHODOLOGY (The Strategy)
   - Precise implementation plan with phases/timeline.
   - Include SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound).

4. BUDGET NARRATIVE & JUSTIFICATION (The Stewardship)
   - Map dollars to activities (personnel, program, evaluation, admin if allowed).
   - Fiscal responsibility + sustainability after the grant period.

5. EVALUATION PLAN (The Accountability)
   - Qualitative + quantitative metrics.
   - Data collection tools and reporting schedule aligned to federal/funder norms.

Also list funderKeywordsUsed: keywords/phrases from the opportunity you deliberately echoed.

Return ONLY JSON:
{
  "executiveSummary": string,
  "statementOfNeed": string,
  "projectDescription": string,
  "budgetNarrative": string,
  "evaluationPlan": string,
  "fullMarkdown": string,
  "funderKeywordsUsed": string[]
}`;

  const raw = await jsonModel<Partial<AwardWinningProposal>>(prompt);

  const sections = {
    executiveSummary: raw.executiveSummary || '',
    statementOfNeed: raw.statementOfNeed || '',
    projectDescription: raw.projectDescription || '',
    budgetNarrative: raw.budgetNarrative || '',
    evaluationPlan: raw.evaluationPlan || '',
  };

  const fullMarkdown =
    raw.fullMarkdown ||
    [
      `# ${grant.title}`,
      `## Executive Summary\n\n${sections.executiveSummary}`,
      `## Statement of Need\n\n${sections.statementOfNeed}`,
      `## Project Description & Methodology\n\n${sections.projectDescription}`,
      `## Budget Narrative & Justification\n\n${sections.budgetNarrative}`,
      `## Evaluation Plan\n\n${sections.evaluationPlan}`,
    ].join('\n\n');

  return {
    ...sections,
    fullMarkdown,
    funderKeywordsUsed: raw.funderKeywordsUsed || [],
  };
}

export async function getOracleAdvice(mission: string, draft: string, guidelines: string) {
  const prompt = `You are the Grant Genie Oracle — Master Grant Writer reviewing a draft under MODULE 3 standards.

Mission: ${mission}
Funder guidelines / synopsis: ${guidelines}
Current draft:
"""
${draft || '(empty draft)'}
"""

Score readiness 0-10 against award-winning structure: hook/exec summary, need, methodology+SMART, budget stewardship, evaluation accountability. Be specific and tactical — no filler.

Return JSON:
{
  "narrativeShifts": string[3],
  "strategicSignal": string,
  "score": number,
  "sectionGaps": string[]
}`;

  return jsonModel<{
    narrativeShifts: string[];
    strategicSignal: string;
    score: number;
    sectionGaps?: string[];
  }>(prompt);
}

export async function transformText(
  text: string,
  action: 'simplify' | 'amplify' | 'tone_shift'
): Promise<string> {
  let instruction = '';
  if (action === 'simplify') {
    instruction =
      'Rewrite clearer and more concise for a busy federal reviewer. Keep evidence and specificity. No fluff.';
  } else if (action === 'amplify') {
    instruction =
      'Rewrite more persuasive and high-impact for a competitive grant proposal. Keep claims evidence-ready. No hype without substance.';
  } else {
    instruction =
      'Rewrite with a professional, contemporary funder-aligned tone (confident, outcomes-focused). Avoid slang and AI clichés.';
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `${instruction}\n\nText:\n"${text}"`,
  });
  return response.text?.trim() || text;
}

export async function getGlobalAdvice(mission: string, activeView: string): Promise<string> {
  const viewHint: Record<string, string> = {
    mission: 'home / mission control',
    radar: 'live grant discovery',
    writer: 'proposal writing engine',
    pipeline: 'application pipeline',
    vault: 'document vault',
  };
  const prompt = `You are an expert AI Grant Officer. Mission: "${mission}". User is on: ${viewHint[activeView] || activeView}.
Give 2-3 sentences of specific, actionable strategic advice. Authoritative, not hype. No filler.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    return response.text?.trim() || 'Review open opportunities that match your mission, then score eligibility before drafting.';
  } catch {
    return 'Search live federal opportunities, eliminate ineligible fits, then draft only high-alignment grants.';
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
