# Grant Genie

Find **live U.S. federal grants**, score them against your mission, and draft applications with AI.

## What’s new

- **Real live search** via the free public [Grants.gov](https://grants.gov/api/api-guide) API  
  `POST https://api.grants.gov/v1/api/search2` — **no API key**
- Vite / Vercel **proxy** so the browser can call Grants.gov without CORS pain
- Discovery UI simplified: keyword search, suggested topics, live badge, open official posting
- AI is used for **match scoring & writing**, not for inventing fake grant listings

## Free / open sources used

| Source | Use | Cost |
|--------|-----|------|
| [Grants.gov search2](https://grants.gov/api/api-guide) | Live open opportunities | Free, public |
| [HHS/simpler-grants-gov](https://github.com/HHS/simpler-grants-gov) | Open-source Grants.gov modernization (reference) | Free |
| [ogrants](https://github.com/weecology/ogrants) | Open grant examples (learning) | Free |
| Google Gemini (optional) | Mission match + draft help | Needs `GEMINI_API_KEY` |

## Run locally

```bash
npm install
# Optional — for AI match / writer features:
# copy .env.example to .env.local and set GEMINI_API_KEY=...
npm run dev
```

Open http://localhost:3000 → sign in → **Find grants**.

Live search hits `/api/grants.gov/...` which Vite proxies to `https://api.grants.gov`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | Typecheck |

## Deploy (Vercel)

`vercel.json` rewrites `/api/grants.gov/*` → `https://api.grants.gov/*` so production search stays live.

## AI Grant Officer (3 modules)

1. **Discovery & extraction** — Live Grants.gov search + org profile (type, industry, scope, geography, funding need)
2. **Match analysis & scoring** — Strict eligibility; Strategic Alignment %; Feasibility %; Win Low/Med/High
3. **Proposal engine** — Award-winning draft:
   - Executive summary (hook, ask, ROI)
   - Statement of need
   - Project description + SMART objectives
   - Budget narrative & stewardship
   - Evaluation plan

Core product flow: **Find grants → Run match analysis → Generate full proposal → Oracle critique → Finalize**

## Stack

React 19 · Vite 6 · Tailwind 4 · Firebase Auth · Motion · Gemini
