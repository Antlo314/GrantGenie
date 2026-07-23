/**
 * Multi-source search hub — fans out to every connected database.
 * AI is never used here.
 *
 * Always on (no key):
 *   Grants.gov search2, USASpending, SBIR (when up)
 *
 * Keyed (server proxy):
 *   Simpler.Grants.gov, SAM.gov, Grants-USA (optional paid)
 */

import { searchLiveGrants } from './grantSearch';
import { searchUsaSpendingAwards } from './sources/usaSpending';
import {
  searchGrantsUsaViaProxy,
  searchSamViaProxy,
  searchSimplerViaProxy,
} from './sources/proxyClient';
import { searchSbir } from './sources/sbir';
import type { Grant, Opportunity, Sector } from '../types';
import { opportunityToGrant } from '../types';

export type SourceRun = {
  id: string;
  ok: boolean;
  count: number;
  error?: string;
  note?: string;
};

export type SearchHubResult = {
  grants: Grant[];
  opportunities: Opportunity[];
  hitCount: number;
  query: string;
  sources: string[];
  sourceRuns: SourceRun[];
  error?: string;
  note?: string;
};

function dedupe(opps: Opportunity[]): Opportunity[] {
  const seen = new Set<string>();
  const out: Opportunity[] = [];
  for (const o of opps) {
    const key = [
      (o.opportunityNumber || '').toLowerCase(),
      o.title.toLowerCase().slice(0, 80),
      o.agency.toLowerCase().slice(0, 40),
    ].join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(o);
  }
  return out;
}

function grantsGovToOpps(
  grants: Grant[]
): Opportunity[] {
  return grants.map((g) => ({
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
}

/**
 * Search all relevant sources for the active sector in parallel.
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
      sourceRuns: [],
      error: 'Enter a search word (for example: health, construction, education).',
    };
  }

  const rows = options?.rows ?? 25;
  const active = sector === 'both' ? 'grants' : sector;
  const sourceRuns: SourceRun[] = [];
  const buckets: Opportunity[] = [];

  if (active === 'grants') {
    const tasks: Promise<void>[] = [];

    // 1) Grants.gov — always
    tasks.push(
      (async () => {
        const live = await searchLiveGrants(q, { rows });
        const opps = grantsGovToOpps(live.grants);
        buckets.push(...opps);
        sourceRuns.push({
          id: 'grants.gov',
          ok: !live.error || opps.length > 0,
          count: opps.length,
          error: live.error,
          note: 'Main open federal grants (no key)',
        });
      })()
    );

    // 2) Simpler.Grants.gov — if key via proxy
    tasks.push(
      (async () => {
        const r = await searchSimplerViaProxy(q, rows);
        // Treat "not set" as skipped, not fatal
        const skipped = r.error?.includes('not set');
        if (!skipped) buckets.push(...r.opportunities);
        sourceRuns.push({
          id: 'simpler.grants.gov',
          ok: !r.error || r.opportunities.length > 0,
          count: r.opportunities.length,
          error: r.error,
          note: skipped
            ? 'Add SIMPLER_GRANTS_API_KEY for modern Grants.gov search'
            : 'Modern Grants.gov gateway',
        });
      })()
    );

    // 3) USASpending past grant awards
    tasks.push(
      (async () => {
        const past = await searchUsaSpendingAwards(q, { sector: 'grant', limit: 12 });
        buckets.push(...past.opportunities);
        sourceRuns.push({
          id: 'usaspending-grants',
          ok: !past.error || past.opportunities.length > 0,
          count: past.opportunities.length,
          error: past.error,
          note: 'Past federal grant awards (who already got paid)',
        });
      })()
    );

    // 4) SBIR
    tasks.push(
      (async () => {
        const r = await searchSbir(q, 10);
        buckets.push(...r.opportunities);
        sourceRuns.push({
          id: 'sbir',
          ok: !r.error || r.opportunities.length > 0,
          count: r.opportunities.length,
          error: r.error,
          note: 'Small business R&D (when API is up)',
        });
      })()
    );

    // 5) Optional Grants-USA
    tasks.push(
      (async () => {
        const r = await searchGrantsUsaViaProxy(q, 15);
        const skipped = r.error?.includes('not set');
        if (!skipped) buckets.push(...r.opportunities);
        sourceRuns.push({
          id: 'grants-usa',
          ok: skipped ? true : !r.error || r.opportunities.length > 0,
          count: r.opportunities.length,
          error: skipped ? undefined : r.error,
          note: skipped ? 'Optional paid RapidAPI wrapper (not configured)' : 'Grants-USA wrapper',
        });
      })()
    );

    await Promise.all(tasks);
  } else {
    // Contracts sector
    const tasks: Promise<void>[] = [];

    // 1) SAM.gov open solicitations
    tasks.push(
      (async () => {
        const r = await searchSamViaProxy(q, rows);
        const skipped = r.error?.includes('not set');
        if (!skipped) buckets.push(...r.opportunities);
        sourceRuns.push({
          id: 'sam.gov',
          ok: !r.error || r.opportunities.length > 0,
          count: r.opportunities.length,
          error: r.error,
          note: skipped
            ? 'Add SAM_API_KEY for open federal contract solicitations'
            : 'Open federal contract opportunities',
        });
      })()
    );

    // 2) USASpending past contracts
    tasks.push(
      (async () => {
        const awards = await searchUsaSpendingAwards(q, { sector: 'contract', limit: rows });
        buckets.push(...awards.opportunities);
        sourceRuns.push({
          id: 'usaspending-contracts',
          ok: !awards.error || awards.opportunities.length > 0,
          count: awards.opportunities.length,
          error: awards.error,
          note: 'Past federal contract awards',
        });
      })()
    );

    // 3) SBIR (often R&D contracts/grants for small biz)
    tasks.push(
      (async () => {
        const r = await searchSbir(q, 10);
        buckets.push(...r.opportunities);
        sourceRuns.push({
          id: 'sbir',
          ok: !r.error || r.opportunities.length > 0,
          count: r.opportunities.length,
          error: r.error,
          note: 'SBIR/STTR topics',
        });
      })()
    );

    await Promise.all(tasks);
  }

  const opportunities = dedupe(buckets);
  // Prefer open opportunities first
  opportunities.sort((a, b) => {
    if (a.isOpenOpportunity !== b.isOpenOpportunity) {
      return a.isOpenOpportunity ? -1 : 1;
    }
    return 0;
  });

  const grants = opportunities.map(opportunityToGrant);
  const activeSources = sourceRuns.filter((s) => s.count > 0).map((s) => s.id);
  const hardFails = sourceRuns.filter((s) => !s.ok && s.count === 0 && s.error && !s.error.includes('not set'));

  const noteParts = [
    active === 'grants'
      ? 'Searched Grants.gov + connected grant databases.'
      : 'Searched SAM.gov (if keyed) + USASpending past awards + SBIR.',
    `Showing ${grants.length} unique result(s) from ${activeSources.length || 0} source(s).`,
  ];

  return {
    grants,
    opportunities,
    hitCount: grants.length,
    query: q,
    sources: activeSources,
    sourceRuns,
    error:
      grants.length === 0 && hardFails.length
        ? hardFails.map((f) => `${f.id}: ${f.error}`).join(' · ')
        : grants.length === 0
          ? 'No results from connected sources. Try a broader keyword, or add API keys (SAM / Simpler.Grants) in .env.local.'
          : undefined,
    note: noteParts.join(' '),
  };
}
