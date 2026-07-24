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
  eligibility: {
    title: 'What does "eligible" mean?',
    body: 'Every grant has rules about who can apply — like "nonprofits only" or "small businesses in Texas." If you don’t match the rules, don’t spend time applying. The official page always lists them.',
  },
  deadline: {
    title: 'Deadlines are strict',
    body: 'Government deadlines are real deadlines. One minute late usually means your application is not read at all. Aim to finish a few days early.',
  },
  freeHelp: {
    title: 'You never have to pay to apply',
    body: 'Applying for government grants and contracts is always free. Anyone charging you just to apply or register on SAM.gov is a scam. Free official help exists — see the Free Toolbox.',
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
  toolbox: {
    title: 'Free toolbox',
    subtitle: 'Real free tools and free human help.',
    hint: 'Everything here costs $0. Applying to government programs is always free — never pay to apply.',
    nudge: 'Browse free tools by goal: find money, win contracts, research funders, write better, get human help.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Your profile, account, and the tour.',
    hint: 'A clear description of your work improves search and drafts. Replay the beginner tour anytime.',
    nudge: 'Update your profile when your work changes. Replay the tour if you need a refresher.',
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
    body: 'I’ll help you find real government funding and paid work. No experience needed. Follow the green highlight (or “Look here” on phones).',
    target: null,
  },
  {
    id: 'sector',
    title: 'Pick Grants or Contracts',
    body: 'Grants = free money for a project. Contracts = paid work. Switch anytime in the left menu (desktop) or the top pills (mobile).',
    // Prefer desktop sidebar; mobile header pills also tagged sector-mobile
    target: '[data-tour="sector"], [data-tour="sector-mobile"]',
    placement: 'right',
  },
  {
    id: 'specs',
    title: 'Choose your industry',
    body: 'Tap chips for the work you do (health, construction, IT…). Change them anytime — search updates for you.',
    target: '[data-tour="specs"]',
    placement: 'bottom',
  },
  {
    id: 'search',
    title: 'Search real listings',
    body: 'We search free official U.S. data. Type a word or use your industry chips. We never invent grants.',
    target: '[data-tour="search"]',
    placement: 'bottom',
  },
  {
    id: 'results',
    title: 'Open the official page',
    body: 'Browse results here. Always open the .gov link before you apply. Save ones you like for later.',
    target: '[data-tour="results"]',
    placement: 'left',
  },
  {
    id: 'pipeline',
    title: 'My applications',
    body: 'Saved listings live under My applications so you don’t lose them. (Desktop: left menu. Mobile: menu button.)',
    target: '[data-tour="pipeline-nav"]',
    placement: 'right',
  },
  {
    id: 'toolbox',
    title: 'Free tools & free help',
    body: 'The Free Toolbox lists real free tools — and real people who help for free. Remember: applying to government programs never costs money.',
    target: '[data-tour="toolbox-nav"]',
    placement: 'right',
  },
  {
    id: 'genie',
    title: 'I’m here if you need me',
    body: 'I float in the bottom-right. Ask me anything in plain English — I remember the conversation, so follow-up questions work too.',
    target: '[data-tour="genie"]',
    placement: 'left',
  },
  {
    id: 'checklist',
    title: 'You’re ready!',
    body: 'Your Home screen has a short Getting started checklist — finish those steps (search, save, draft) and you’ll know the whole app. You can replay this tour anytime from Settings or the Genie.',
    target: null,
  },
];

export const TOUR_STORAGE_KEY = 'grantgenie_tour_v1';
