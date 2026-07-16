/**
 * Compatibility layer — all AI Grant Officer logic lives in grantOfficerService.ts
 * (Modules 1–3: Discovery context, Match Scoring, Proposal Engine).
 */

export {
  generateGrantIntel,
  analyzeGrantMatch,
  generateAwardWinningProposal,
  getOracleAdvice,
  transformText,
  getGlobalAdvice,
  profileFromOrganization,
  type ApplicantProfile,
  type MatchAnalysis,
  type AwardWinningProposal,
  type WinProbability,
} from './grantOfficerService';

/** @deprecated Use searchLiveGrants from grantSearch.ts */
export { searchLiveGrants as searchGlobalGrants } from './grantSearch';
