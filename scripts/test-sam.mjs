import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, ''),
      ];
    })
);

const key = env.SAM_API_KEY;
console.log('key length', key?.length, 'starts SAM-', key?.startsWith('SAM-'));

function fmt(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}/${day}/${d.getFullYear()}`;
}
const to = new Date();
const from = new Date();
from.setDate(from.getDate() - 90);

const attempts = [
  {
    name: 'v2 title+ptype',
    url:
      'https://api.sam.gov/opportunities/v2/search?' +
      new URLSearchParams({
        api_key: key,
        limit: '5',
        offset: '0',
        postedFrom: fmt(from),
        postedTo: fmt(to),
        ptype: 'o,k,p,r',
        title: 'construction',
      }),
  },
  {
    name: 'v2 no title',
    url:
      'https://api.sam.gov/opportunities/v2/search?' +
      new URLSearchParams({
        api_key: key,
        limit: '5',
        offset: '0',
        postedFrom: fmt(from),
        postedTo: fmt(to),
        ptype: 'o',
      }),
  },
  {
    name: 'prod/v2 path',
    url:
      'https://api.sam.gov/prod/opportunities/v2/search?' +
      new URLSearchParams({
        api_key: key,
        limit: '5',
        offset: '0',
        postedFrom: fmt(from),
        postedTo: fmt(to),
        ptype: 'o',
      }),
  },
  {
    name: 'v2 keyword solnum empty + department',
    url:
      'https://api.sam.gov/opportunities/v2/search?' +
      new URLSearchParams({
        api_key: key,
        limit: '5',
        offset: '0',
        postedFrom: fmt(from),
        postedTo: fmt(to),
      }),
  },
];

for (const a of attempts) {
  try {
    const res = await fetch(a.url, { headers: { Accept: 'application/json' } });
    const text = await res.text();
    console.log('---', a.name, 'HTTP', res.status, 'len', text.length);
    console.log(text.slice(0, 350).replace(/\s+/g, ' '));
  } catch (e) {
    console.log('---', a.name, 'ERR', e.message);
  }
}
