/**
 * Smoke-test free public APIs (no secrets).
 * Usage: node scripts/smoke-apis.mjs
 */

async function grantsGov() {
  const res = await fetch('https://api.grants.gov/v1/api/search2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      keyword: 'education',
      oppStatuses: 'posted|forecasted',
      rows: 2,
    }),
  });
  const json = await res.json();
  const hits = json?.data?.hitCount ?? 0;
  if (!res.ok || !hits) throw new Error(`status ${res.status} hits ${hits}`);
  return `OK hits=${hits} sample=${json?.data?.oppHits?.[0]?.title?.slice(0, 50) || 'n/a'}`;
}

async function usaSpending() {
  const res = await fetch('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      filters: {
        keywords: ['construction'],
        time_period: [{ start_date: '2023-01-01', end_date: '2025-12-31' }],
        award_type_codes: ['A', 'B', 'C', 'D'],
      },
      fields: ['Award ID', 'Recipient Name', 'Award Amount', 'Description', 'Awarding Agency'],
      page: 1,
      limit: 1,
      sort: 'Award Amount',
      order: 'desc',
    }),
  });
  const json = await res.json();
  const n = (json.results || []).length;
  if (!res.ok || !n) throw new Error(`status ${res.status} results ${n}`);
  return `OK recipient=${json.results[0]['Recipient Name']}`;
}

async function main() {
  const tests = [
    ['Grants.gov', grantsGov],
    ['USASpending', usaSpending],
  ];
  let failed = 0;
  for (const [name, fn] of tests) {
    try {
      const msg = await fn();
      console.log(`PASS  ${name}: ${msg}`);
    } catch (e) {
      failed++;
      console.log(`FAIL  ${name}: ${e.message}`);
    }
  }
  console.log(failed ? `\n${failed} failed` : '\nAll free public APIs OK');
  process.exit(failed ? 1 : 0);
}

main();
