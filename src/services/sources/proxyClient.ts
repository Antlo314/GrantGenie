/**
 * Client calls same-origin API routes (Vite middleware or Vercel functions).
 * Keys never ship to the browser.
 */

import type { Opportunity, OpportunitySource } from '../../types';

export type ProxyOppResult = {
  opportunities: Opportunity[];
  hitCount: number;
  error?: string;
};

type Raw = {
  opportunities?: Array<{
    id: string;
    sector: 'grant' | 'contract';
    source: string;
    title: string;
    agency: string;
    amount?: number;
    deadline?: string;
    description: string;
    url: string;
    isOpenOpportunity: boolean;
    opportunityNumber?: string;
    status?: string;
    tags?: string[];
  }>;
  hitCount?: number;
  error?: string;
};

function normalize(raw: Raw, fallbackSource: OpportunitySource): ProxyOppResult {
  const opportunities: Opportunity[] = (raw.opportunities || []).map((o) => ({
    id: o.id,
    sector: o.sector,
    source: (o.source as OpportunitySource) || fallbackSource,
    title: o.title,
    agency: o.agency,
    amount: o.amount,
    deadline: o.deadline,
    description: o.description,
    url: o.url,
    isOpenOpportunity: o.isOpenOpportunity,
    opportunityNumber: o.opportunityNumber,
    status: o.status,
    tags: o.tags,
  }));
  return {
    opportunities,
    hitCount: raw.hitCount ?? opportunities.length,
    error: raw.error,
  };
}

/** Try primary path, then fallback path (covers local proxy + Vercel routes). */
async function postJson(
  paths: string[],
  body: object,
  fallbackSource: OpportunitySource
): Promise<ProxyOppResult> {
  let lastErr = 'No response';
  for (const path of paths) {
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let json: Raw = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        lastErr = `${path} HTTP ${res.status}: non-JSON response`;
        continue;
      }
      if (!res.ok) {
        lastErr = `${path} HTTP ${res.status}: ${json.error || text.slice(0, 120)}`;
        continue;
      }
      return normalize(json, fallbackSource);
    } catch (e: unknown) {
      lastErr = e instanceof Error ? e.message : 'network error';
    }
  }
  return { opportunities: [], hitCount: 0, error: lastErr };
}

export function searchSimplerViaProxy(query: string, limit = 25) {
  return postJson(
    ['/api/simpler-search', '/api/proxy/simpler/search'],
    { query, limit },
    'simpler.grants.gov'
  );
}

export function searchSamViaProxy(query: string, limit = 25) {
  return postJson(
    ['/api/sam-search', '/api/proxy/sam/search'],
    { query, limit },
    'sam.gov'
  );
}

export function searchGrantsUsaViaProxy(query: string, limit = 20) {
  return postJson(
    ['/api/proxy/grants-usa/search'],
    { query, limit },
    'grants-usa'
  );
}

export type ClientSourceStatus = {
  id: string;
  label: string;
  sector: 'grants' | 'contracts' | 'both';
  free: boolean;
  configured: boolean;
  note: string;
  docsUrl: string;
};

export async function fetchSourceStatus(): Promise<ClientSourceStatus[]> {
  for (const path of ['/api/sources-status', '/api/proxy/status']) {
    try {
      const res = await fetch(path);
      if (!res.ok) continue;
      const json = await res.json();
      return json.sources || [];
    } catch {
      /* try next */
    }
  }
  return [];
}
