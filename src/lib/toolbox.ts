/**
 * The Free Toolbox — real, free tools for finding and winning
 * grants and contracts. Every entry costs $0 (or has a true free tier,
 * marked "Free tier"). No affiliate links, no ads — just help.
 */

export type ToolTag = 'find' | 'contracts' | 'funders' | 'writing' | 'people';

export type Tool = {
  name: string;
  what: string;          // plain-English: what it is
  why: string;           // plain-English: why you'd use it
  url: string;
  tag: ToolTag;
  badge: 'Official .gov' | 'Free forever' | 'Free tier' | 'Open source';
  builtIn?: boolean;     // Grant Genie already searches this for you
};

export const TOOL_TAGS: Record<ToolTag, { label: string; blurb: string }> = {
  find: {
    label: 'Find grant money',
    blurb: 'Places that list real grants you can apply for.',
  },
  contracts: {
    label: 'Win contracts',
    blurb: 'Paid work for the government — where to register and bid.',
  },
  funders: {
    label: 'Research funders',
    blurb: 'See who gives money, and who wins it, before you apply.',
  },
  writing: {
    label: 'Write better',
    blurb: 'Free helpers for clearer, stronger applications.',
  },
  people: {
    label: 'Free human help',
    blurb: 'Real people who help you for free. Yes, really.',
  },
};

export const TOOLS: Tool[] = [
  /* ── Find grant money ── */
  {
    name: 'Grants.gov',
    what: 'The official list of every U.S. federal grant.',
    why: 'This is the source of truth. Grant Genie already searches it for you on the Find page.',
    url: 'https://grants.gov',
    tag: 'find',
    badge: 'Official .gov',
    builtIn: true,
  },
  {
    name: 'Simpler.Grants.gov',
    what: 'The government’s new, easier version of Grants.gov.',
    why: 'Cleaner search and plain-language pages. It’s open source on GitHub (HHS/simpler-grants-gov).',
    url: 'https://simpler.grants.gov',
    tag: 'find',
    badge: 'Official .gov',
    builtIn: true,
  },
  {
    name: 'Grants.gov Learning Center',
    what: 'Free official guides that explain how federal grants work.',
    why: 'Start here if words like "eligibility" or "NOFO" confuse you. Short, official, free.',
    url: 'https://grants.gov/learn-grants',
    tag: 'find',
    badge: 'Official .gov',
  },
  {
    name: 'SBIR / STTR (America’s Seed Fund)',
    what: 'Federal money for small businesses building new technology.',
    why: 'If you’re a small tech company, this is non-dilutive funding — you keep your whole company.',
    url: 'https://www.sbir.gov',
    tag: 'find',
    badge: 'Official .gov',
    builtIn: true,
  },
  {
    name: 'Your state’s grant portal',
    what: 'Every state runs its own official grant site.',
    why: 'State grants often have less competition than federal ones. Grant Genie links yours on the Find page.',
    url: 'https://www.usa.gov/state-benefits',
    tag: 'find',
    badge: 'Official .gov',
    builtIn: true,
  },

  /* ── Win contracts ── */
  {
    name: 'SAM.gov',
    what: 'Where the U.S. government posts work it will pay companies to do.',
    why: 'Registering is free and required before you can bid. Watch out for scam sites that charge — the real one never does.',
    url: 'https://sam.gov',
    tag: 'contracts',
    badge: 'Official .gov',
    builtIn: true,
  },
  {
    name: 'APEX Accelerators',
    what: 'Free one-on-one advisors for government contracting (formerly PTAC).',
    why: 'A real person walks you through registration, certifications, and your first bid — at no cost.',
    url: 'https://www.apexaccelerators.us',
    tag: 'contracts',
    badge: 'Free forever',
  },
  {
    name: 'SBA certifications',
    what: 'Free small-business certifications (8(a), WOSB, HUBZone, veteran-owned).',
    why: 'Some government contracts are reserved for certified businesses — less competition for you.',
    url: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs',
    tag: 'contracts',
    badge: 'Official .gov',
  },
  {
    name: 'SBA SubNet',
    what: 'Big contractors post smaller jobs they need help with.',
    why: 'Subcontracting is the easiest way to get your first government work — no big bid required.',
    url: 'https://subnet.sba.gov',
    tag: 'contracts',
    badge: 'Official .gov',
  },

  /* ── Research funders ── */
  {
    name: 'USAspending.gov',
    what: 'Every dollar the federal government spends, searchable.',
    why: 'See who actually wins awards in your field — and how much. Grant Genie shows past awards from here.',
    url: 'https://www.usaspending.gov',
    tag: 'funders',
    badge: 'Official .gov',
    builtIn: true,
  },
  {
    name: 'ProPublica Nonprofit Explorer',
    what: 'Free tax filings (Form 990) for 1.8 million nonprofits and foundations.',
    why: 'Look up any foundation before applying: what they fund, how much they give, who they gave it to.',
    url: 'https://projects.propublica.org/nonprofits/',
    tag: 'funders',
    badge: 'Free forever',
  },
  {
    name: 'IRS Tax Exempt Organization Search',
    what: 'The official check that a nonprofit or funder is legitimate.',
    why: 'Verify your own status (funders will check you), or verify a foundation before trusting it.',
    url: 'https://apps.irs.gov/app/eos/',
    tag: 'funders',
    badge: 'Official .gov',
  },
  {
    name: 'Candid at your library',
    what: 'The big paid foundation directory — free at 400+ public libraries.',
    why: 'Ask your local library for "Candid Foundation Directory access." Same tool fundraisers pay thousands for.',
    url: 'https://candid.org/find-us',
    tag: 'funders',
    badge: 'Free forever',
  },

  /* ── Write better ── */
  {
    name: 'AI for Grant Writing (GitHub)',
    what: 'A free, community-built library of AI prompts for grant writing.',
    why: 'Copy-paste prompts that make any AI chatbot better at reviewing and improving your draft. 4,000+ stars.',
    url: 'https://github.com/eseckel/ai-for-grant-writing',
    tag: 'writing',
    badge: 'Open source',
  },
  {
    name: 'Hemingway Editor',
    what: 'Paste your draft; it highlights sentences that are hard to read.',
    why: 'Reviewers skim. Shorter sentences win. The web version is free.',
    url: 'https://hemingwayapp.com',
    tag: 'writing',
    badge: 'Free tier',
  },
  {
    name: 'LanguageTool',
    what: 'Open-source grammar and spelling checker.',
    why: 'Catches mistakes before a reviewer does. Works in your browser for free.',
    url: 'https://languagetool.org',
    tag: 'writing',
    badge: 'Open source',
  },
  {
    name: 'NonprofitReady',
    what: 'Free online courses, including full grant-writing classes.',
    why: 'A real curriculum with certificates — completely free, made for nonprofits.',
    url: 'https://www.nonprofitready.org',
    tag: 'writing',
    badge: 'Free forever',
  },

  /* ── Free human help ── */
  {
    name: 'SCORE mentors',
    what: 'Free business mentors, many with grant and contracting experience.',
    why: 'Talk to someone who has done this before. Video calls or in person, no charge, no catch.',
    url: 'https://www.score.org',
    tag: 'people',
    badge: 'Free forever',
  },
  {
    name: 'Small Business Development Centers',
    what: 'Free local consultants funded by the SBA.',
    why: 'Help with business plans, budgets, and grant paperwork — the boring parts that sink applications.',
    url: 'https://www.sba.gov/local-assistance',
    tag: 'people',
    badge: 'Free forever',
  },
  {
    name: 'Your public library',
    what: 'Librarians + free access to paid research databases.',
    why: 'Many libraries offer free Candid access and even grant-research help. Just ask.',
    url: 'https://www.usa.gov/libraries-and-archives',
    tag: 'people',
    badge: 'Free forever',
  },
];
