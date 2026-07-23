/**
 * USASpending.gov — free public API, no key.
 * Docs: https://api.usaspending.gov/
 *
 * Returns PAST awards (who got paid). Not open solicitations.
 * Label clearly in the UI as "Past awards".
 */

import type { Opportunity } from '../../types';

export type UsaSpendingResult = {
  opportunities: Opportunity[];
  hitCount: number;
  source: 'usaspending';
  query: string;
  error?: string;
};

const PATH = '/api/usaspending/api/v2/search/spending_by_award/';
const DIRECT = 'https://api.usaspending.gov/api/v2/search/spending_by_award/';

type AwardRow = {
  'Award ID'?: string;
  'Recipient Name'?: string;
  'Award Amount'?: number;
  Description?: string;
  'Start Date'?: string;
  'End Date'?: string;
  'Awarding Agency'?: string;
  'Award Type'?: string;
  'Place of Performance State Code'?: string;
  generated_internal_id?: string;
};

function mapRow(row: AwardRow, sector: 'grant' | 'contract'): Opportunity {
  const awardId = String(row['Award ID'] || row.generated_internal_id || crypto.randomUUID());
  const amount = typeof row['Award Amount'] === 'number' ? row['Award Amount'] : 0;
  const agency = row['Awarding Agency'] || 'U.S. government';
  const title =
    row.Description?.slice(0, 120) ||
    `${sector === 'contract' ? 'Contract' : 'Grant'} award to ${row['Recipient Name'] || 'recipient'}`;

  return {
    id: `usa-${sector}-${awardId}`,
    sector,
    source: 'usaspending',
    title,
    agency,
    amount,
    deadline: row['End Date'] || undefined,
    description: [
      row['Recipient Name'] ? `Winner: ${row['Recipient Name']}` : null,
      row['Award Type'] ? `Type: ${row['Award Type']}` : null,
      amount ? `Amount: $${amount.toLocaleString('en-US')}` : null,
      row['Start Date'] ? `Start: ${row['Start Date']}` : null,
      row['End Date'] ? `End: ${row['End Date']}` : null,
      row['Place of Performance State Code']
        ? `State: ${row['Place of Performance State Code']}`
        : null,
      'This is a PAST award (already given). Use it to learn who wins — not an open application.',
    ]
      .filter(Boolean)
      .join(' · '),
    url: `https://www.usaspending.gov/award/${encodeURIComponent(awardId)}`,
    locationHints: row['Place of Performance State Code']
      ? [row['Place of Performance State Code']]
      : [],
    isOpenOpportunity: false,
    opportunityNumber: awardId,
    tags: ['USASpending', 'Past award', sector === 'contract' ? 'Contract' : 'Grant'],
    status: 'Awarded',
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
 * Search past federal awards (contracts or grants/assistance).
 */
export async function searchUsaSpendingAwards(
  query: string,
  options?: { sector?: 'grant' | 'contract'; limit?: number }
): Promise<UsaSpendingResult> {
  const q = query.trim() || 'services';
  const sector = options?.sector || 'contract';
  const limit = options?.limit ?? 25;

  // award_type_codes: contracts A,B,C,D ; grants 02,03,04,05 etc.
  const awardTypeCodes =
    sector === 'contract'
      ? ['A', 'B', 'C', 'D']
      : ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];

  const body = {
    filters: {
      keywords: [q],
      time_period: [
        {
          start_date: '2020-01-01',
          end_date: new Date().toISOString().slice(0, 10),
        },
      ],
      award_type_codes: awardTypeCodes,
    },
    fields: [
      'Award ID',
      'Recipient Name',
      'Award Amount',
      'Description',
      'Start Date',
      'End Date',
      'Awarding Agency',
      'Award Type',
      'Place of Performance State Code',
      'generated_internal_id',
    ],
    page: 1,
    limit,
    sort: 'Award Amount',
    order: 'desc',
  };

  try {
    let res = await postSearch(PATH, body);
    if (!res.ok) {
      res = await postSearch(DIRECT, body);
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return {
        opportunities: [],
        hitCount: 0,
        source: 'usaspending',
        query: q,
        error: `USASpending HTTP ${res.status}${text ? `: ${text.slice(0, 120)}` : ''}`,
      };
    }
    const data = await res.json();
    const rows: AwardRow[] = data?.results || data?.filtered_results || [];
    const opportunities = rows.map((r) => mapRow(r, sector));
    return {
      opportunities,
      hitCount: data?.page_metadata?.total || opportunities.length,
      source: 'usaspending',
      query: q,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {
      opportunities: [],
      hitCount: 0,
      source: 'usaspending',
      query: q,
      error: msg,
    };
  }
}
