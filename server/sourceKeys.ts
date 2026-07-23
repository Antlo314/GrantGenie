/**
 * Server-only env keys for third-party grant/contract APIs.
 * Never import this file from client React code.
 */

export type SourceKeyStatus = {
  id: string;
  label: string;
  sector: 'grants' | 'contracts' | 'both';
  free: boolean;
  configured: boolean;
  note: string;
  docsUrl: string;
};

/** Clean env values: trim, strip wrapping quotes, drop CR. */
function clean(v: string | undefined): string {
  return (v || '')
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^["']|["']$/g, '')
    .trim();
}

export function readSourceEnv(env: Record<string, string | undefined> = process.env) {
  return {
    SAM_API_KEY: clean(env.SAM_API_KEY || env.VITE_SAM_API_KEY),
    SIMPLER_GRANTS_API_KEY: clean(env.SIMPLER_GRANTS_API_KEY || env.VITE_SIMPLER_GRANTS_API_KEY),
    OPENGRANTS_API_KEY: clean(env.OPENGRANTS_API_KEY),
    TANGO_API_KEY: clean(env.TANGO_API_KEY || env.MAKEGOV_API_KEY),
    GRANTS_USA_RAPIDAPI_KEY: clean(env.GRANTS_USA_RAPIDAPI_KEY || env.RAPIDAPI_KEY),
  };
}

export function sourceStatusList(env: Record<string, string | undefined> = process.env): SourceKeyStatus[] {
  const k = readSourceEnv(env);
  return [
    {
      id: 'grants.gov',
      label: 'Grants.gov (search2)',
      sector: 'grants',
      free: true,
      configured: true,
      note: 'Main open federal grants. No key required.',
      docsUrl: 'https://www.grants.gov/api',
    },
    {
      id: 'simpler.grants.gov',
      label: 'Simpler.Grants.gov',
      sector: 'grants',
      free: true,
      configured: !!k.SIMPLER_GRANTS_API_KEY,
      note: k.SIMPLER_GRANTS_API_KEY
        ? 'API key present — modern Grants.gov search enabled.'
        : 'Free key from simpler.grants.gov → Developer → Manage API Keys.',
      docsUrl: 'https://wiki.simpler.grants.gov/product/api',
    },
    {
      id: 'usaspending',
      label: 'USASpending.gov',
      sector: 'both',
      free: true,
      configured: true,
      note: 'Past awards (grants + contracts). No key required.',
      docsUrl: 'https://api.usaspending.gov/',
    },
    {
      id: 'sam.gov',
      label: 'SAM.gov Opportunities',
      sector: 'contracts',
      free: true,
      configured: !!k.SAM_API_KEY,
      note: k.SAM_API_KEY
        ? 'API key present — open federal contract solicitations enabled.'
        : 'Free personal key: sam.gov → Account Details → API Key.',
      docsUrl: 'https://open.gsa.gov/api/get-opportunities-public-api/',
    },
    {
      id: 'sbir',
      label: 'SBIR.gov',
      sector: 'both',
      free: true,
      configured: true,
      note: 'Small business R&D solicitations when the public API is available.',
      docsUrl: 'https://www.sbir.gov/api',
    },
    {
      id: 'grants-usa',
      label: 'Grants-USA / RapidAPI',
      sector: 'grants',
      free: false,
      configured: !!k.GRANTS_USA_RAPIDAPI_KEY,
      note: k.GRANTS_USA_RAPIDAPI_KEY
        ? 'RapidAPI key present.'
        : 'Optional paid wrapper — set GRANTS_USA_RAPIDAPI_KEY.',
      docsUrl: 'https://www.grants-usa.com/',
    },
    {
      id: 'opengrants',
      label: 'OpenGrants',
      sector: 'grants',
      free: false,
      configured: !!k.OPENGRANTS_API_KEY,
      note: k.OPENGRANTS_API_KEY
        ? 'OpenGrants key present.'
        : 'Optional paid API — set OPENGRANTS_API_KEY.',
      docsUrl: 'https://app.opengrants.io/',
    },
    {
      id: 'tango',
      label: 'Tango / MakeGov',
      sector: 'both',
      free: false,
      configured: !!k.TANGO_API_KEY,
      note: k.TANGO_API_KEY
        ? 'Tango/MakeGov key present.'
        : 'Optional paid aggregator — set TANGO_API_KEY or MAKEGOV_API_KEY.',
      docsUrl: 'https://www.makegov.com/',
    },
  ];
}
