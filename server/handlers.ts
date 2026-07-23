/**
 * Server-side upstream calls (keys never leave the server).
 */
import { readSourceEnv } from './sourceKeys';

export type RawOpp = {
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
};

function formatMmDdYyyy(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function mapSamRows(rows: Array<Record<string, unknown>>): RawOpp[] {
  return rows.map((row) => {
    const noticeId = String(row.noticeId || row.solicitationNumber || crypto.randomUUID());
    const title = String(row.title || 'Untitled solicitation');
    const agency = String(
      (row.fullParentPathName as string) ||
        (row.department as string) ||
        (row.organizationName as string) ||
        'U.S. Government'
    );
    const posted = row.postedDate ? String(row.postedDate) : '';
    const responseDead = row.responseDeadLine ? String(row.responseDeadLine) : '';
    const solNum = row.solicitationNumber ? String(row.solicitationNumber) : '';
    const type = row.type ? String(row.type) : '';
    const naics = row.naicsCode ? String(row.naicsCode) : '';
    const uiLink = (row.uiLink as string) || `https://sam.gov/opp/${noticeId}/view`;

    return {
      id: `sam-${noticeId}`,
      sector: 'contract' as const,
      source: 'sam.gov',
      title,
      agency,
      deadline: responseDead || undefined,
      description: [
        solNum ? `Solicitation #${solNum}` : null,
        type ? `Type: ${type}` : null,
        posted ? `Posted: ${posted}` : null,
        responseDead ? `Response due: ${responseDead}` : null,
        naics ? `NAICS: ${naics}` : null,
        'Open federal contract opportunity from SAM.gov.',
      ]
        .filter(Boolean)
        .join(' · '),
      url: uiLink,
      isOpenOpportunity: true,
      opportunityNumber: solNum || noticeId,
      status: type || 'Open',
      tags: ['SAM.gov', 'Open solicitation', type, naics].filter(Boolean) as string[],
    };
  });
}

async function samFetch(
  SAM_API_KEY: string,
  extra: Record<string, string>,
  limit: number
): Promise<{ opportunities: RawOpp[]; hitCount: number; error?: string; status?: number }> {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 120);

  const params = new URLSearchParams({
    api_key: SAM_API_KEY,
    limit: String(Math.min(limit, 100)),
    offset: '0',
    postedFrom: formatMmDdYyyy(from),
    postedTo: formatMmDdYyyy(to),
    // o=solicitation, k=combined, p=presolicitation, r=sources sought
    ptype: 'o,k,p,r',
    ...extra,
  });

  // Official path (also works under /prod/)
  const url = `https://api.sam.gov/opportunities/v2/search?${params.toString()}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    const text = await res.text();
    if (!res.ok) {
      return {
        opportunities: [],
        hitCount: 0,
        status: res.status,
        error: `SAM.gov HTTP ${res.status}: ${text.slice(0, 180)}`,
      };
    }
    const data = JSON.parse(text) as {
      totalRecords?: number;
      opportunitiesData?: Array<Record<string, unknown>>;
    };
    const rows = data.opportunitiesData || [];
    return {
      opportunities: mapSamRows(rows),
      hitCount: data.totalRecords ?? rows.length,
      status: res.status,
    };
  } catch (e: unknown) {
    return {
      opportunities: [],
      hitCount: 0,
      error: e instanceof Error ? e.message : 'SAM.gov network error',
    };
  }
}

/** SAM.gov open contract opportunities (requires SAM_API_KEY). */
export async function searchSamOpportunities(
  query: string,
  limit = 25,
  env: Record<string, string | undefined> = process.env
): Promise<{ opportunities: RawOpp[]; error?: string; hitCount: number }> {
  const { SAM_API_KEY } = readSourceEnv(env);
  if (!SAM_API_KEY) {
    return {
      opportunities: [],
      hitCount: 0,
      error: 'SAM_API_KEY not set. Get a free key at sam.gov → Account Details.',
    };
  }

  const q = query.trim().slice(0, 100);

  // 1) Prefer title match when user typed a keyword
  if (q) {
    const titled = await samFetch(SAM_API_KEY, { title: q }, limit);
    if (titled.opportunities.length > 0) {
      return { opportunities: titled.opportunities, hitCount: titled.hitCount };
    }
    // If key/auth failed, stop — don't mask with broad search
    if (titled.status && titled.status >= 400) {
      return {
        opportunities: [],
        hitCount: 0,
        error: titled.error || `SAM.gov HTTP ${titled.status}`,
      };
    }
  }

  // 2) Broad open solicitations (still real open bids)
  const broad = await samFetch(SAM_API_KEY, {}, limit);
  if (broad.error && broad.opportunities.length === 0) {
    return { opportunities: [], hitCount: 0, error: broad.error };
  }
  return {
    opportunities: broad.opportunities,
    hitCount: broad.hitCount,
    error:
      q && broad.opportunities.length
        ? undefined
        : broad.error,
  };
}

/** Simpler.Grants.gov opportunity search (requires SIMPLER_GRANTS_API_KEY). */
export async function searchSimplerGrants(
  query: string,
  limit = 25,
  env: Record<string, string | undefined> = process.env
): Promise<{ opportunities: RawOpp[]; error?: string; hitCount: number }> {
  const { SIMPLER_GRANTS_API_KEY } = readSourceEnv(env);
  if (!SIMPLER_GRANTS_API_KEY) {
    return {
      opportunities: [],
      hitCount: 0,
      error:
        'SIMPLER_GRANTS_API_KEY not set. Free key: simpler.grants.gov → Developer → Manage API Keys.',
    };
  }

  const body = {
    query: query.trim().slice(0, 100) || 'grant',
    query_operator: 'OR',
    filters: {
      opportunity_status: { one_of: ['posted', 'forecasted'] },
    },
    pagination: {
      page_offset: 1,
      page_size: Math.min(Math.max(limit, 1), 100),
      sort_order: [{ order_by: 'post_date', sort_direction: 'descending' }],
    },
  };

  try {
    const res = await fetch('https://api.simpler.grants.gov/v1/opportunities/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-Key': SIMPLER_GRANTS_API_KEY,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return {
        opportunities: [],
        hitCount: 0,
        error: `Simpler.Grants HTTP ${res.status}${text ? `: ${text.slice(0, 160)}` : ''}`,
      };
    }
    const json = (await res.json()) as {
      data?: Array<Record<string, unknown>>;
      pagination_info?: { total_records?: number };
    };
    const rows = json.data || [];
    const opportunities: RawOpp[] = rows.map((row) => {
      const id = String(row.opportunity_id || row.opportunity_number || crypto.randomUUID());
      const number = row.opportunity_number ? String(row.opportunity_number) : '';
      const title = String(row.opportunity_title || 'Untitled opportunity');
      const agency = String(row.agency_name || row.agency_code || 'Federal agency');
      const close = row.close_date ? String(row.close_date) : '';
      const status = row.opportunity_status ? String(row.opportunity_status) : '';
      const floor = typeof row.award_floor === 'number' ? row.award_floor : undefined;
      const ceiling = typeof row.award_ceiling === 'number' ? row.award_ceiling : undefined;
      const summary = row.summary ? String(row.summary) : '';

      return {
        id: `simpler-${id}`,
        sector: 'grant',
        source: 'simpler.grants.gov',
        title,
        agency,
        amount: ceiling ?? floor,
        deadline: close || undefined,
        description: [
          number ? `Opportunity #${number}` : null,
          status ? `Status: ${status}` : null,
          floor != null ? `Floor: $${floor.toLocaleString()}` : null,
          ceiling != null ? `Ceiling: $${ceiling.toLocaleString()}` : null,
          summary.slice(0, 280) || null,
          'From Simpler.Grants.gov (modern Grants.gov data).',
        ]
          .filter(Boolean)
          .join(' · '),
        url: number
          ? `https://www.grants.gov/search-results-detail/${number}`
          : `https://simpler.grants.gov/opportunity/${id}`,
        isOpenOpportunity: status === 'posted' || status === 'forecasted' || !status,
        opportunityNumber: number || id,
        status,
        tags: ['Simpler.Grants.gov', status, 'Federal'].filter(Boolean) as string[],
      };
    });

    return {
      opportunities,
      hitCount: json.pagination_info?.total_records ?? opportunities.length,
    };
  } catch (e: unknown) {
    return {
      opportunities: [],
      hitCount: 0,
      error: e instanceof Error ? e.message : 'Simpler.Grants network error',
    };
  }
}

/** Optional RapidAPI Grants-USA wrapper. */
export async function searchGrantsUsa(
  query: string,
  limit = 20,
  env: Record<string, string | undefined> = process.env
): Promise<{ opportunities: RawOpp[]; error?: string; hitCount: number }> {
  const { GRANTS_USA_RAPIDAPI_KEY } = readSourceEnv(env);
  if (!GRANTS_USA_RAPIDAPI_KEY) {
    return { opportunities: [], hitCount: 0, error: 'GRANTS_USA_RAPIDAPI_KEY not set (optional paid).' };
  }
  // Host path varies by RapidAPI listing — keep flexible env override
  const host = env.GRANTS_USA_RAPIDAPI_HOST || 'grants-usa.p.rapidapi.com';
  const path = env.GRANTS_USA_PATH || `/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  try {
    const res = await fetch(`https://${host}${path}`, {
      headers: {
        'X-RapidAPI-Key': GRANTS_USA_RAPIDAPI_KEY,
        'X-RapidAPI-Host': host,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      return {
        opportunities: [],
        hitCount: 0,
        error: `Grants-USA HTTP ${res.status}`,
      };
    }
    const json = await res.json();
    const rows = Array.isArray(json) ? json : json?.results || json?.data || [];
    const opportunities: RawOpp[] = (rows as Record<string, unknown>[]).slice(0, limit).map((row, i) => ({
      id: `gusa-${row.id || row.opportunityNumber || i}`,
      sector: 'grant',
      source: 'grants-usa',
      title: String(row.title || row.opportunityTitle || 'Grant'),
      agency: String(row.agency || row.agencyName || 'Federal'),
      amount: typeof row.amount === 'number' ? row.amount : undefined,
      deadline: row.deadline || row.closeDate ? String(row.deadline || row.closeDate) : undefined,
      description: String(row.description || row.summary || 'From Grants-USA / RapidAPI wrapper.'),
      url: String(row.url || row.link || 'https://www.grants.gov'),
      isOpenOpportunity: true,
      opportunityNumber: row.opportunityNumber ? String(row.opportunityNumber) : undefined,
      tags: ['Grants-USA', 'RapidAPI'],
    }));
    return { opportunities, hitCount: opportunities.length };
  } catch (e: unknown) {
    return {
      opportunities: [],
      hitCount: 0,
      error: e instanceof Error ? e.message : 'Grants-USA error',
    };
  }
}
