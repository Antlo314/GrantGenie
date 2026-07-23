/**
 * Official state grant / procurement portals.
 * Most states do not offer one live national API — we link the real sites.
 */

export type StatePortal = {
  stateCode: string;
  stateName: string;
  grantsUrl?: string;
  contractsUrl?: string;
  notes?: string;
};

/** Curated starting set — expand over time. Prefer .gov only. */
export const STATE_PORTALS: StatePortal[] = [
  {
    stateCode: 'CA',
    stateName: 'California',
    grantsUrl: 'https://www.grants.ca.gov/',
    contractsUrl: 'https://caleprocure.ca.gov/',
    notes: 'California Grants Portal + Cal eProcure',
  },
  {
    stateCode: 'NY',
    stateName: 'New York',
    grantsUrl: 'https://grantsgateway.ny.gov/',
    contractsUrl: 'https://www.nyspro.ogs.ny.gov/',
  },
  {
    stateCode: 'TX',
    stateName: 'Texas',
    grantsUrl: 'https://comptroller.texas.gov/programs/',
    contractsUrl: 'https://www.txsmartbuy.com/',
  },
  {
    stateCode: 'FL',
    stateName: 'Florida',
    grantsUrl: 'https://www.myflorida.com/',
    contractsUrl: 'https://vendor.myfloridamarketplace.com/',
  },
  {
    stateCode: 'GA',
    stateName: 'Georgia',
    contractsUrl: 'https://ssl.doas.state.ga.us/gpr/',
  },
  {
    stateCode: 'IL',
    stateName: 'Illinois',
    grantsUrl: 'https://gata.illinois.gov/',
    contractsUrl: 'https://www2.illinois.gov/cms/business/sell2/Pages/default.aspx',
  },
  {
    stateCode: 'PA',
    stateName: 'Pennsylvania',
    grantsUrl: 'https://www.esa.dced.state.pa.us/',
    contractsUrl: 'https://www.dgs.pa.gov/Materials-Services/Procurement/Pages/default.aspx',
  },
  {
    stateCode: 'OH',
    stateName: 'Ohio',
    contractsUrl: 'https://ohiobuys.ohio.gov/',
  },
  {
    stateCode: 'NC',
    stateName: 'North Carolina',
    contractsUrl: 'https://www.ips.state.nc.us/',
  },
  {
    stateCode: 'MI',
    stateName: 'Michigan',
    contractsUrl: 'https://www.michigan.gov/dtmb/procurement',
  },
  {
    stateCode: 'WA',
    stateName: 'Washington',
    grantsUrl: 'https://www.commerce.wa.gov/',
    contractsUrl: 'https://pr-webs-vendor.des.wa.gov/',
  },
  {
    stateCode: 'MA',
    stateName: 'Massachusetts',
    contractsUrl: 'https://www.commbuys.com/',
  },
  {
    stateCode: 'CO',
    stateName: 'Colorado',
    grantsUrl: 'https://cdola.colorado.gov/funding-programs',
    contractsUrl: 'https://www.colorado.gov/pacific/osc/statewide-contracts',
  },
  {
    stateCode: 'AZ',
    stateName: 'Arizona',
    contractsUrl: 'https://spo.az.gov/',
  },
  {
    stateCode: 'VA',
    stateName: 'Virginia',
    contractsUrl: 'https://eva.virginia.gov/',
  },
];

export function getPortalForState(code?: string): StatePortal | undefined {
  if (!code) return undefined;
  return STATE_PORTALS.find((p) => p.stateCode.toUpperCase() === code.toUpperCase());
}

export const US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];
