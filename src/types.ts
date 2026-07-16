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
  /** Live source marker when loaded from Grants.gov etc. */
  source?: 'grants.gov' | 'firestore' | 'mock' | 'ai';
  opportunityNumber?: string;
  status?: string;
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
