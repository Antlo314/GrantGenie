/** Shared types — plain-English product, two sectors. */

export type EntityType = 'individual' | 'company' | 'nonprofit' | 'other';
export type Sector = 'grants' | 'contracts' | 'both';
export type OpportunitySector = 'grant' | 'contract';
export type OpportunitySource =
  | 'grants.gov'
  | 'simpler.grants.gov'
  | 'usaspending'
  | 'sbir'
  | 'sam.gov'
  | 'sam'
  | 'grants-usa'
  | 'opengrants'
  | 'tango'
  | 'state'
  | 'firestore'
  | 'mock'
  | 'ai';

export type WinProbability = 'Low' | 'Medium' | 'High';

export type SizeBand = 'solo' | 'small' | 'medium' | 'large' | 'unknown';
export type FundingNeedBand =
  | 'under_25k'
  | '25k_100k'
  | '100k_500k'
  | '500k_plus'
  | 'unknown';

export interface ProfileFlags {
  smallBiz?: boolean;
  minority?: boolean;
  veteran?: boolean;
  woman?: boolean;
  rural?: boolean;
  student?: boolean;
  is501c3?: boolean;
}

/** Saved on users/{uid} after Get started quiz. */
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  profileComplete: boolean;
  sector: Sector;
  entityType: EntityType;
  /** Org / personal display name */
  name?: string;
  state?: string;
  city?: string;
  zip?: string;
  description?: string;
  keywords?: string[];
  sizeBand?: SizeBand;
  fundingNeedBand?: FundingNeedBand;
  flags?: ProfileFlags;
  ein?: string;
  orgId?: string;
  tier?: 'Free' | 'Pro' | 'Enterprise';
  createdAt?: string;
  updatedAt?: string;
}

/** @deprecated Prefer UserProfile — kept for older org-centric views */
export interface Organization {
  id: string;
  name: string;
  ein: string;
  mission: string;
  vision?: string;
  focusAreas: string[];
  ownerId: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
}

/** Normalized opportunity from any free data source. */
export interface Opportunity {
  id: string;
  sector: OpportunitySector;
  source: OpportunitySource;
  title: string;
  agency: string;
  amount?: number;
  deadline?: string;
  description: string;
  url: string;
  locationHints?: string[];
  naics?: string[];
  /** false = past award (who already got paid); true = you can still apply/bid */
  isOpenOpportunity: boolean;
  opportunityNumber?: string;
  status?: string;
  tags?: string[];
  /** AI scoring (optional) */
  matchScore?: number;
  matchExplanation?: string;
  strategicAlignmentScore?: number;
  feasibilityScore?: number;
  winProbability?: WinProbability;
  eligible?: boolean;
  eligibilityFailures?: string[];
  eligibilityPasses?: string[];
  recommendedNextStep?: string;
}

/**
 * Legacy grant shape used by existing views.
 * New code should use Opportunity; adapters map both ways.
 */
export interface Grant {
  id: string;
  title: string;
  funder: string;
  amount: number;
  deadline: string;
  description: string;
  matchScore: number;
  matchExplanation: string;
  tags: string[];
  sourceUrl: string;
  active: boolean;
  source?: OpportunitySource;
  opportunityNumber?: string;
  status?: string;
  strategicAlignmentScore?: number;
  feasibilityScore?: number;
  winProbability?: WinProbability;
  eligible?: boolean;
  eligibilityFailures?: string[];
  eligibilityPasses?: string[];
  recommendedNextStep?: string;
  /** Extra fields for dual-sector UI */
  sector?: OpportunitySector;
  isOpenOpportunity?: boolean;
}

export interface Application {
  id: string;
  grantId: string;
  orgId: string;
  status: 'Discovery' | 'Drafting' | 'Review' | 'Submitted' | 'Accepted' | 'Declined';
  draftContent: string;
  updatedAt: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  orgId?: string;
}

export function opportunityToGrant(o: Opportunity): Grant {
  return {
    id: o.id,
    title: o.title,
    funder: o.agency,
    amount: o.amount ?? 0,
    deadline: o.deadline || new Date(Date.now() + 365 * 864e5).toISOString(),
    description: o.description,
    matchScore: o.matchScore ?? 0,
    matchExplanation: o.matchExplanation || 'Run “Score my fit” to compare this to your profile.',
    tags: o.tags || [],
    sourceUrl: o.url,
    active: true,
    source: o.source,
    opportunityNumber: o.opportunityNumber,
    status: o.status,
    sector: o.sector,
    isOpenOpportunity: o.isOpenOpportunity,
    strategicAlignmentScore: o.strategicAlignmentScore,
    feasibilityScore: o.feasibilityScore,
    winProbability: o.winProbability,
    eligible: o.eligible,
    eligibilityFailures: o.eligibilityFailures,
    eligibilityPasses: o.eligibilityPasses,
    recommendedNextStep: o.recommendedNextStep,
  };
}

export function profileToOrganization(p: UserProfile): Organization {
  return {
    id: p.orgId || p.uid,
    name: p.name || p.displayName || 'My profile',
    ein: p.ein || '',
    mission: p.description || '',
    focusAreas: p.keywords || [],
    ownerId: p.uid,
    tier: p.tier || 'Free',
  };
}
