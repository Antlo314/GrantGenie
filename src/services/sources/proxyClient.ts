/**
 * Client calls same-origin /api/proxy/* (Vite middleware or Vercel function).
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

async function postProxy(path: string, body: object, fallbackSource: OpportunitySource): Promise<ProxyOppResult> {
  try {
    const res = await fetch(`/api/proxy/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return {
        opportunities: [],
        hitCount: 0,
        error: `Proxy ${path} HTTP ${res.status}${text ? `: ${text.slice(0, 120)}` : ''}`,
      };
    }
    const json = (await res.json()) as Raw;
    return normalize(json, fallbackSource);
  } catch (e: unknown) {
    return {
      opportunities: [],
      hitCount: 0,
      error: e instanceof Error ? e.message : 'Proxy network error',
    };
  }
}

export function searchSimplerViaProxy(query: string, limit = 25) {
  return postProxy('simpler/search', { query, limit }, 'simpler.grants.gov');
}

export function searchSamViaProxy(query: string, limit = 25) {
  return postProxy('sam/search', { query, limit }, 'sam.gov');
}

export function searchGrantsUsaViaProxy(query: string, limit = 20) {
  return postProxy('grants-usa/search', { query, limit }, 'grants-usa');
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
  try {
    const res = await fetch('/api/proxy/status');
    if (!res.ok) return [];
    const json = await res.json();
    return json.sources || [];
  } catch {
    return [];
  }
}
