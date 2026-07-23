/**
 * Beginner-friendly copy — assume the user knows nothing about grants.
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
  { title: string; subtitle: string; hint: string }
> = {
  mission: {
    title: 'Home',
    subtitle: 'Your starting point — see what to do next.',
    hint: 'New here? Use Find to search real listings, then save the ones that fit. The Genie (bottom right) can explain anything.',
  },
  radar: {
    title: 'Find opportunities',
    subtitle: 'Search free U.S. government databases for grants or contracts.',
    hint: 'Green chips mean that data source returned results. Always open the official page before you apply.',
  },
  pipeline: {
    title: 'My applications',
    subtitle: 'Listings you saved and drafts you are working on.',
    hint: 'We help you prepare. You still submit on the government’s own website when you are ready.',
  },
  writer: {
    title: 'Draft helper',
    subtitle: 'Get help writing from your profile and a listing you picked.',
    hint: 'AI drafts are a starting point only. Edit carefully and never invent facts. You submit on the official site.',
  },
  vault: {
    title: 'My files',
    subtitle: 'Notes and documents you keep for applications.',
    hint: 'Store things like your mission statement or past budgets so you can reuse them later.',
  },
  profile: {
    title: 'Profile',
    subtitle: 'Who you are and what you do — used to match listings and fill drafts.',
    hint: 'A clear description of your work helps Find and the Genie give better suggestions.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Account details and app preferences.',
    hint: 'You can replay the beginner tour from here anytime.',
  },
};

export const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Hi — I’m the Genie',
    body: 'I’ll help you find real government funding and paid work. You don’t need to be an expert. We’ll go one step at a time.',
  },
  {
    id: 'grant-vs-contract',
    title: 'Two different paths',
    body: 'A grant is free money for a project. A contract is paid work the government hires you to do. Pick the path that fits you — you can switch anytime.',
  },
  {
    id: 'home',
    title: 'Home is your base',
    body: 'Come back here to see your progress and what to do next. Think of it as your dashboard.',
  },
  {
    id: 'find',
    title: 'Find real listings',
    body: 'Search free official sources like Grants.gov and USASpending. For open contract bids we use SAM.gov when your key is set. We never invent fake listings.',
  },
  {
    id: 'score',
    title: 'Check if it fits you',
    body: 'On a listing, you can ask how well it matches your profile. Always double-check the official rules — the final call is yours.',
  },
  {
    id: 'pipeline',
    title: 'Track what you care about',
    body: 'Save listings into My applications so you don’t lose them. Move them from Saved → Writing → Submitted as you go.',
  },
  {
    id: 'draft',
    title: 'Writing help',
    body: 'Draft helper can suggest text using your profile. You edit it, then submit on the government’s website — not inside this app.',
  },
  {
    id: 'genie',
    title: 'Tap me anytime',
    body: 'I’m the floating genie at the bottom right. Ask for the next step, a plain-English explanation, or the tour again.',
  },
] as const;

export const TOUR_STORAGE_KEY = 'grantgenie_tour_v1';
