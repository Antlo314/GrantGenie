/**
 * Live federal grant search — free public sources (no API key).
 *
 * Primary: Grants.gov REST search2
 *   Docs: https://grants.gov/api/api-guide
 *   POST https://api.grants.gov/v1/api/search2
 *
 * Open-source related:
 *   - HHS/simpler-grants-gov (modernization of Grants.gov)
 *   - Official public search2 requires no auth
 *
 * Dev: Vite proxies /api/grants.gov → api.grants.gov (avoids browser CORS).
 * Prod: same proxy path if hosted with rewrite, else direct + optional CORS fallback.
 */

import type { Grant } from '../types';

export type GrantSearchResult = {
  grants: Grant[];
  hitCount: number;
  source: 'grants.gov';
  query: string;
  error?: string;
};

type OppHit = {
  id?: string;
  number?: string;
  title?: string;
  agency?: string;
  agencyCode?: string;
  openDate?: string;
  closeDate?: string;
  oppStatus?: string;
  cfdaList?: string[];
  alnList?: string[];
};

const SEARCH_PATH = '/api/grants.gov/v1/api/search2';
const SEARCH_DIRECT = 'https://api.grants.gov/v1/api/search2';

/** Parse Grants.gov MM/DD/YYYY (or empty) → ISO date string or far-future sentinel. */
function parseCloseDate(closeDate?: string): string {
  if (!closeDate || !String(closeDate).trim()) {
    // Rolling / open opportunities — keep far out so they sort last by deadline
    return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  }
  const raw = String(closeDate).trim();
  const parts = raw.split('/');
  if (parts.length === 3) {
    const [mm, dd, yyyy] = parts;
    const iso = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T23:59:59`;
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString();
  return new Date().toISOString();
}

function isStillOpen(closeDate?: string): boolean {
  if (!closeDate || !String(closeDate).trim()) return true;
  const iso = parseCloseDate(closeDate);
  return new Date(iso).getTime() >= Date.now() - 24 * 60 * 60 * 1000;
}

function mapHit(opp: OppHit): Grant {
  const id = String(opp.id || opp.number || crypto.randomUUID());
  const tags = [
    ...(opp.cfdaList || []),
    ...(opp.alnList || []),
    opp.oppStatus || '',
    'Federal',
    'Grants.gov',
  ].filter(Boolean) as string[];

  return {
    id: `gg-${id}`,
    title: opp.title || 'Untitled opportunity',
    funder: opp.agency || opp.agencyCode || 'U.S. Federal Agency',
    amount: 0,
    deadline: parseCloseDate(opp.closeDate),
    description: [
      opp.number ? `Opportunity #${opp.number}` : null,
      opp.oppStatus ? `Status: ${opp.oppStatus}` : null,
      opp.openDate ? `Posted: ${opp.openDate}` : null,
      opp.closeDate ? `Closes: ${opp.closeDate}` : 'Rolling / see full posting',
      'Source: Grants.gov (live federal opportunities).',
    ]
      .filter(Boolean)
      .join(' · '),
    matchScore: 0,
    matchExplanation: 'Run Match AI to score against your mission.',
    tags: [...new Set(tags)],
    sourceUrl: opp.id
      ? `https://www.grants.gov/search-results-detail/${opp.id}`
      : 'https://www.grants.gov/search-grants',
    active: true,
    opportunityNumber: opp.number,
    source: 'grants.gov',
    status: opp.oppStatus,
  };
}

async function postSearch(url: string, body: object): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Search live open federal opportunities on Grants.gov.
 * Free, no API key (public search2 endpoint).
 */
export async function searchLiveGrants(
  query: string,
  options?: { rows?: number; statuses?: string }
): Promise<GrantSearchResult> {
  const q = query.trim() || 'community';
  const rows = Math.min(Math.max(options?.rows ?? 25, 1), 100);
  const oppStatuses = options?.statuses ?? 'forecasted|posted';

  const payload = {
    keyword: q,
    oppStatuses,
    sortBy: 'openDate|desc',
    rows,
  };

  let lastError = '';

  // 1) Prefer same-origin Vite / host proxy (no CORS issues)
  try {
    let res = await postSearch(SEARCH_PATH, payload);
    if (!res.ok) {
      // 2) Direct official API (works server-side; browsers may CORS-block)
      res = await postSearch(SEARCH_DIRECT, payload);
    }
    if (!res.ok) {
      throw new Error(`Grants.gov HTTP ${res.status}`);
    }

    const json = await res.json();
    // Shape: { errorcode, msg, data: { hitCount, oppHits: [...] } }
    const data = json?.data ?? json;
    if (json?.errorcode && json.errorcode !== 0) {
      throw new Error(json.msg || 'Grants.gov returned an error');
    }

    const hits: OppHit[] = data?.oppHits || data?.oppHitsList || [];
    const hitCount = Number(data?.hitCount ?? hits.length) || hits.length;

    const open = hits.filter((h) => isStillOpen(h.closeDate));
    const grants = open.map(mapHit);

    return {
      grants,
      hitCount,
      source: 'grants.gov',
      query: q,
    };
  } catch (e: any) {
    lastError = e?.message || String(e);
    console.error('[grantSearch] live search failed:', lastError);
    return {
      grants: [],
      hitCount: 0,
      source: 'grants.gov',
      query: q,
      error: lastError,
    };
  }
}

/** Quick-start searches that usually return real open postings */
export const SUGGESTED_QUERIES = [
  'community development',
  'education',
  'health equity',
  'youth',
  'arts culture',
  'housing',
  'climate resilience',
  'workforce',
  'mental health',
  'STEM',
];
