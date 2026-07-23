/**
 * One place to search free real databases by sector.
 * AI is never used here — only live/open sources.
 */

import { searchLiveGrants } from './grantSearch';
import { searchUsaSpendingAwards } from './sources/usaSpending';
import type { Grant, Opportunity, Sector } from '../types';
import { opportunityToGrant } from '../types';

export type SearchHubResult = {
  grants: Grant[];
  opportunities: Opportunity[];
  hitCount: number;
  query: string;
  sources: string[];
  error?: string;
  /** Human-readable note for the UI */
  note?: string;
};

/**
 * Search by active sector.
 * - grants: open federal grants (Grants.gov) + optional past grant awards
 * - contracts: past contract awards (USASpending); SAM open bids need API key later
 */
export async function searchOpportunities(
  query: string,
  sector: Sector | 'grants' | 'contracts',
  options?: { includePastAwards?: boolean; rows?: number }
): Promise<SearchHubResult> {
  const q = query.trim();
  if (!q) {
    return {
      grants: [],
      opportunities: [],
      hitCount: 0,
      query: '',
      sources: [],
      error: 'Enter a search word (for example: health, construction, education).',
    };
  }

  const rows = options?.rows ?? 30;
  const active = sector === 'both' ? 'grants' : sector;

  if (active === 'grants') {
    const live = await searchLiveGrants(q, { rows });
    const opportunities: Opportunity[] = live.grants.map((g) => ({
      id: g.id,
      sector: 'grant' as const,
      source: (g.source || 'grants.gov') as Opportunity['source'],
      title: g.title,
      agency: g.funder,
      amount: g.amount,
      deadline: g.deadline,
      description: g.description,
      url: g.sourceUrl,
      isOpenOpportunity: true,
      opportunityNumber: g.opportunityNumber,
      status: g.status,
      tags: g.tags,
      matchScore: g.matchScore,
      matchExplanation: g.matchExplanation,
    }));

    let pastNote = '';
    if (options?.includePastAwards) {
      const past = await searchUsaSpendingAwards(q, { sector: 'grant', limit: 10 });
      opportunities.push(...past.opportunities);
      if (past.error) pastNote = ` Past awards note: ${past.error}`;
    }

    const grants = opportunities.map(opportunityToGrant);
    return {
      grants,
      opportunities,
      hitCount: live.hitCount || grants.length,
      query: q,
      sources: ['grants.gov', ...(options?.includePastAwards ? ['usaspending'] : [])],
      error: live.error && grants.length === 0 ? live.error : undefined,
      note:
        'Open listings come from Grants.gov (free). You can still apply when the status is open.' +
        pastNote,
    };
  }

  // Contracts — Phase 1: past awards only (no SAM key yet)
  const awards = await searchUsaSpendingAwards(q, { sector: 'contract', limit: rows });
  const grants = awards.opportunities.map(opportunityToGrant);
  return {
    grants,
    opportunities: awards.opportunities,
    hitCount: awards.hitCount,
    query: q,
    sources: ['usaspending'],
    error: awards.error && grants.length === 0 ? awards.error : undefined,
    note:
      'These are PAST federal contracts (who already got paid) from USASpending.gov — free, no key. Open bids from SAM.gov will appear here after a free SAM API key is added.',
  };
}
