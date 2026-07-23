# Grant Genie

Find **real** U.S. government **grants** and **contracts** in plain English. Sign in, answer a short setup quiz, search free public databases, track progress, and use Gemini only to explain fits and help write drafts — never to invent listings.

## Two sectors (different purposes)

| Sector | What it means | Main free sources (Phase 1) |
|--------|----------------|-----------------------------|
| **Grants** | Free funding for a project or mission | [Grants.gov](https://grants.gov) open opportunities (live) |
| **Contracts** | Paid work — government buys goods/services | [USASpending.gov](https://www.usaspending.gov) **past awards** (who got paid) |

**Important:** Past awards are **not** open bids. Open federal contract solicitations need a free [SAM.gov API key](https://open.gsa.gov/api/get-opportunities-public-api/) (Phase 2).

State coverage: curated links to official state grant/procurement portals (no single free national state API).

## Real free data sources

| Source | Use | Cost | Key? |
|--------|-----|------|------|
| Grants.gov `search2` | Open federal grants | Free | No |
| USASpending API | Past grants & contract awards | Free | No |
| SAM.gov Opportunities | Open contract solicitations | Free | Yes (later) |
| SBIR.gov API | Small business R&D topics | Free | No (planned) |
| State .gov portals | State grants / procurement | Free | Link-out |
| Data.gov / open.gsa.gov | Catalogs & more APIs | Free | Often free key |

### Open source references

- [makegov/awesome-procurement-data](https://github.com/makegov/awesome-procurement-data)
- [fedspendingtransparency/usaspending-api](https://github.com/fedspendingtransparency/usaspending-api)
- [HHS/simpler-grants-gov](https://github.com/HHS/simpler-grants-gov)
- [alicelabs-llc/samgov-sdk](https://github.com/alicelabs-llc/samgov-sdk) (when SAM key exists)

## Product flow

1. **Sign in** (email or Google) — Firebase project `grant-genie-f3618`
2. **Get started** quiz — individual/company/nonprofit · grant/contract · location · what you do · size · optional flags
3. **Home** + sector switcher **Grants | Contracts**
4. **Search** real databases → open official page → **Score my fit** (Gemini) → **Draft helper**
5. **My applications** tracks progress

Optional: **Try a demo** (no account) from the login screen.

## Run locally

```bash
npm install
# Optional — AI match / writer:
# copy .env.example to .env.local and set GEMINI_API_KEY=...
npm run dev
```

Open http://localhost:3000

Proxies (dev + Vercel):

- `/api/grants.gov/*` → `https://api.grants.gov/*`
- `/api/usaspending/*` → `https://api.usaspending.gov/*`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | Typecheck |

## Firebase

- Auth + Firestore for user profiles and progress
- Config: `firebase-applet-config.json` (project **grant-genie-f3618**)
- Enable **Email/Password** and **Google** in Firebase Console → Authentication if not already on
- Deploy rules: `firestore.rules` (user can only access `users/{theirUid}/**`)

## AI rules

- Gemini **never** invents grant/contract titles, amounts, or deadlines
- Listings only come from search adapters
- UI always points to the official government page

## Stack

Vite · React · TypeScript · Tailwind · Firebase · Gemini · Grants.gov · USASpending
