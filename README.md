# Grant Genie

Find **real** U.S. government **grants** and **contracts** in plain English. Multi-source search fans out to free federal APIs (and optional keyed/paid ones). Gemini only explains fits and helps write drafts — it never invents listings.

## Connected data sources

| Source | Sector | Free? | Key? | Status in app |
|--------|--------|-------|------|----------------|
| **[Grants.gov](https://www.grants.gov/api)** `search2` | Grants (open) | Yes | **No** | Always on |
| **[Simpler.Grants.gov](https://wiki.simpler.grants.gov/product/api)** | Grants (open) | Yes | Free key | On when `SIMPLER_GRANTS_API_KEY` set |
| **[USASpending.gov](https://api.usaspending.gov/)** | Grants + contracts (past awards) | Yes | **No** | Always on |
| **[SAM.gov Opportunities](https://open.gsa.gov/api/get-opportunities-public-api/)** | Contracts (open solicitations) | Yes | Free key | On when `SAM_API_KEY` set |
| **[SBIR.gov](https://www.sbir.gov/api)** | R&D / small biz | Yes | No | Tried always (API sometimes rate-limited) |
| **[Grants-USA / RapidAPI](https://www.grants-usa.com/)** | Grants wrapper | Paid | RapidAPI key | Optional |
| **[OpenGrants](https://app.opengrants.io/)** | Grants aggregator | Paid | API key | Scaffold / optional |
| **[Tango / MakeGov](https://www.makegov.com/)** | All-in-one | Paid | API key | Scaffold / optional |

### Get free keys (recommended)

1. **SAM.gov** (open contracts): [sam.gov](https://sam.gov) → profile → Account Details → API Key  
   Docs: https://open.gsa.gov/api/get-opportunities-public-api/
2. **Simpler.Grants.gov**: [simpler.grants.gov](https://simpler.grants.gov) → Developer → Manage API Keys  
   Docs: https://wiki.simpler.grants.gov/product/api

Put them in `.env.local` (see `.env.example`). Keys stay on the **server** (`/api/proxy/*`) — never in the browser.

### What “open” vs “past award” means

- **Open** = you can still apply or bid (Grants.gov, Simpler, SAM solicitations).  
- **Past award** = already given to someone (USASpending) — useful intel, not an open application.

## Two sectors

| Sector | Primary sources |
|--------|-----------------|
| **Grants** | Grants.gov + Simpler.Grants (if keyed) + USASpending grant awards + SBIR |
| **Contracts** | SAM.gov open bids (if keyed) + USASpending contract awards + SBIR |

State portals: curated official .gov links for the user’s state (no single national free state API).

## Product flow

1. Sign in (Firebase `grant-genie-f3618`)  
2. Get started quiz — 6 short labeled steps (who you are · grants/contracts · location · what you do · size · optional extras). ~2 minutes; final step shows a summary of your answers.  
3. First-run beginner tour + **Getting started checklist** on Home (search → save → draft), tracked from real activity  
4. Sector switcher → multi-source search (chips show which APIs returned data)  
5. Score fit + draft helper (Gemini); the Genie widget is a full chat with follow-up memory

**Dev shortcut:** open the app with `?dev=1` to pre-fill a test profile and jump to the last quiz step. Without the flag, users always start at step 1 with blank answers.

## Run locally

```bash
npm install
cp .env.example .env.local
# Fill GEMINI_API_KEY, and ideally SAM_API_KEY + SIMPLER_GRANTS_API_KEY
npm run dev
```

Open http://localhost:3000

### Proxies

| Path | Target |
|------|--------|
| `/api/grants.gov/*` | `https://api.grants.gov/*` |
| `/api/usaspending/*` | `https://api.usaspending.gov/*` |
| `/api/proxy/simpler/search` | Simpler.Grants (server key) |
| `/api/proxy/sam/search` | SAM.gov (server key) |
| `/api/proxy/grants-usa/search` | RapidAPI (optional) |
| `/api/proxy/status` | Which sources are configured |

## Deploy (Vercel)

1. Set env vars: `GEMINI_API_KEY`, `SAM_API_KEY`, `SIMPLER_GRANTS_API_KEY`, …  
2. `vercel.json` rewrites Grants.gov + USASpending  
3. Serverless functions under `api/proxy/` handle keyed sources  

## Firebase + step 6 permissions

Project: **grant-genie-f3618** (`firebase-applet-config.json`).

If Get started **step 6** shows **Missing or insufficient permissions**, Firestore rules are not published yet.

1. [Firebase Console](https://console.firebase.google.com) → **grant-genie-f3618**  
2. **Firestore Database** → **Rules**  
3. Paste contents of repo file `firestore.rules`  
4. **Publish**

Until then, the app keeps your Get started answers **on this device** and lets you continue into search.

Enable **Email/Password** and **Google** under Authentication → Sign-in method.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | Typecheck |
| `node scripts/smoke-apis.mjs` | Smoke-test Grants.gov + USASpending (no keys) |

## Stack

Vite · React · TypeScript · Tailwind · Firebase · Gemini · multi-source federal APIs
