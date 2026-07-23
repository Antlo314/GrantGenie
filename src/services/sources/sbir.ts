/**
 * SBIR.gov public solicitations — free when the API is up.
 * Docs: https://www.sbir.gov/api
 */

import type { Opportunity } from '../../types';

export type SbirResult = {
  opportunities: Opportunity[];
  hitCount: number;
  error?: string;
};

export async function searchSbir(query: string, limit = 15): Promise<SbirResult> {
  const q = query.trim() || 'research';
  // Public endpoints have moved over time; try known hosts
  const urls = [
    `https://api.www.sbir.gov/public/api/solicitations?keyword=${encodeURIComponent(q)}&rows=${limit}`,
    `https://www.sbir.gov/api/solicitations.json?keyword=${encodeURIComponent(q)}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;
      const json = await res.json();
      if (json?.Code === 'TooManyRequestsError' || json?.Message) {
        return {
          opportunities: [],
          hitCount: 0,
          error: String(json.Message || 'SBIR API temporarily unavailable'),
        };
      }
      const rows = Array.isArray(json) ? json : json?.solicitations || json?.data || [];
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const opportunities: Opportunity[] = rows.slice(0, limit).map((row: Record<string, unknown>, i: number) => {
        const id = String(row.solicitation_number || row.id || i);
        const title = String(row.solicitation_title || row.title || 'SBIR solicitation');
        const agency = String(row.agency || row.agency_name || 'SBIR agency');
        const open = row.open_date ? String(row.open_date) : '';
        const close = row.close_date ? String(row.close_date) : '';
        return {
          id: `sbir-${id}`,
          sector: 'grant',
          source: 'sbir',
          title,
          agency,
          deadline: close || undefined,
          description: [
            open ? `Opens: ${open}` : null,
            close ? `Closes: ${close}` : null,
            row.phase ? `Phase: ${row.phase}` : null,
            'SBIR/STTR small business research opportunity.',
          ]
            .filter(Boolean)
            .join(' · '),
          url: String(row.solicitation_agency_url || row.url || `https://www.sbir.gov/solicitations`),
          isOpenOpportunity: true,
          opportunityNumber: id,
          tags: ['SBIR', 'STTR', 'Small business'],
          status: 'Open',
        };
      });
      return { opportunities, hitCount: opportunities.length };
    } catch {
      /* try next */
    }
  }

  return {
    opportunities: [],
    hitCount: 0,
    error: 'SBIR public API unavailable right now (rate limit or downtime).',
  };
}
