/**
 * Beginner-friendly copy — short nudges; detail only when asked.
 */

export const GLOSSARY = {
  grant: {
    title: 'What is a grant?',
    body: 'A grant is free money for a project or mission. You usually do not sell a product to the government. You apply, and if you win, you follow their rules for how you spend it.',
  },
  contract: {
    title: 'What is a contract?',
    body: 'A contract is paid work. The government needs a job done (build something, clean a building, provide IT). If you win, they pay you for the work.',
  },
  openVsPast: {
    title: 'Open listing vs past award',
    body: 'Open means you can still apply or bid. Past award means the money already went to someone else — useful to learn who wins, but you cannot apply to that exact award.',
  },
  officialPage: {
    title: 'Always open the official page',
    body: 'Grant Genie shows real data from U.S. government sites. Before you apply or bid, open the official .gov page and read the rules yourself.',
  },
} as const;

export const PAGE_HINTS: Record<
  string,
  { title: string; subtitle: string; hint: string; nudge: string }
> = {
  mission: {
    title: 'Home',
    subtitle: 'Set your industry, then search.',
    hint: 'Pick what you do below. Then hit Find — we’ll search real government listings for you.',
    nudge: 'Set your industry chips, then search. Ask me only if you’re stuck.',
  },
  radar: {
    title: 'Find opportunities',
    subtitle: 'Real free U.S. data. Change industries anytime.',
    hint: 'Green chips = that source returned results. Open the official page before you apply.',
    nudge: 'Change industry chips to search different fields. I’m here if you have a question.',
  },
  pipeline: {
    title: 'My applications',
    subtitle: 'Saved listings and drafts.',
    hint: 'We help you prepare. You submit on the government’s website.',
    nudge: 'Open a saved listing or start a draft when you’re ready.',
  },
  writer: {
    title: 'Draft helper',
    subtitle: 'Writing help from your profile.',
    hint: 'AI is a starting point only. You edit and submit on the official site.',
    nudge: 'Ask me to help write — or paste what you’re stuck on.',
  },
  vault: {
    title: 'My files',
    subtitle: 'Notes and documents for applications.',
    hint: 'Keep mission text and docs here to reuse later.',
    nudge: 'Store notes here so drafts are faster next time.',
  },
  profile: {
    title: 'Profile',
    subtitle: 'Who you are — used for matching.',
    hint: 'A clear description of your work improves search and drafts.',
    nudge: 'Update your profile when your work changes.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Account and tour.',
    hint: 'Replay the beginner tour anytime.',
    nudge: 'Need a refresher? Replay the tour from here.',
  },
};

export type TourStepDef = {
  id: string;
  title: string;
  body: string;
  /** CSS selector for spotlight; null = centered card */
  target: string | null;
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

export const TOUR_STEPS: TourStepDef[] = [
  {
    id: 'welcome',
    title: 'Hi — I’m the Genie',
    body: 'I’ll help you find real government funding and paid work. No experience needed. This short tour points at the real buttons.',
    target: null,
  },
  {
    id: 'sector',
    title: 'Pick Grants or Contracts',
    body: 'Grants = free money for a project. Contracts = paid work. Tap either side anytime.',
    target: '[data-tour="sector"]',
    placement: 'right',
  },
  {
    id: 'specs',
    title: 'Choose your industry',
    body: 'Tap chips for the work you do (health, construction, IT…). Change them anytime — search follows.',
    target: '[data-tour="specs"]',
    placement: 'bottom',
  },
  {
    id: 'find',
    title: 'Search real listings',
    body: 'Find pulls free official data (Grants.gov, USASpending, SAM when keyed). We never invent grants.',
    target: '[data-tour="find-nav"]',
    placement: 'right',
  },
  {
    id: 'search',
    title: 'Type or use your chips',
    body: 'Search runs from your industry chips. Open any result’s official .gov page before you apply.',
    target: '[data-tour="search"]',
    placement: 'bottom',
  },
  {
    id: 'results',
    title: 'Results & next steps',
    body: 'Save what fits, score fit, or ask for draft help. You always submit on the government site.',
    target: '[data-tour="results"]',
    placement: 'left',
  },
  {
    id: 'pipeline',
    title: 'My applications',
    body: 'Saved listings live here so you don’t lose them.',
    target: '[data-tour="pipeline-nav"]',
    placement: 'right',
  },
  {
    id: 'genie',
    title: 'I’m here if you need me',
    body: 'I float down here. I only give short tips unless you ask a question.',
    target: '[data-tour="genie"]',
    placement: 'left',
  },
];

export const TOUR_STORAGE_KEY = 'grantgenie_tour_v1';
