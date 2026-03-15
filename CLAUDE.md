# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Real-time pickleball league management platform (Next-Up) for South African communities. Three independent apps in one repo — no npm workspaces.

**Stack**: React 19 + TypeScript + Tailwind CSS (Vite) | Express.js | Supabase (PostgreSQL + Auth + Real-time) | React Native (Expo)

## Development Commands

```bash
# Web frontend (http://localhost:5173)
cd code/client && npm install && npm run dev

# Backend API (http://localhost:3001)
cd code/server && npm install && npm run dev

# Native app
cd native-app && npm install && npm start

# Lint frontend
cd code/client && npm run lint

# Build frontend
cd code/client && npm run build
```

No automated tests exist — all testing is manual via UI. Don't create tests unless explicitly asked.

## Environment Variables

**Frontend** (`code/client/.env.local`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`
**Backend** (`code/server/.env`): `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`
**Native** (`native-app/.env`): `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_API_BASE_URL`

## Architecture

```
Clients (React/RN) ──► Express Backend ──► Supabase PostgreSQL
       │                                          │
       └──────── WebSocket Real-time ─────────────┘
```

- Frontend talks to backend via REST (`fetch` with Bearer token auth)
- Backend uses Supabase service key for admin DB operations
- Frontend connects directly to Supabase for real-time WebSocket subscriptions
- API responses always follow: `{ success: boolean, data?: any, error?: string, message?: string }`
- Deployment: Vercel (frontend) + Render (backend) + Supabase Cloud

### Key Data Flow

**League Night lifecycle**: `scheduled` → `active` → `completed`

**Player flow**: Check in → Form partnership → Auto-assigned to match → Submit score → Court freed → Next match auto-assigned

**Auto-assignment algorithm** (in `matchController.js`): Sorts partnerships by `games_played_tonight ASC` for fairness, avoids repeat pairings, new partnerships inherit minimum games count.

### Real-time System

Single-channel pattern per league night — one WebSocket channel with multiple table subscriptions (prevents connection churn). Core hook: `useLeagueNightRealtime.ts`.

**Critical**: Stabilize callbacks with `useRef` to prevent infinite re-renders:
```typescript
const stableCallbacks = useRef(callbacks);
useEffect(() => { stableCallbacks.current = callbacks; });
```

Real-time tables: `league_night_checkins`, `partnership_requests`, `confirmed_partnerships`, `matches`, `league_night_instances`

## Code Conventions

### Mandatory Rules
- **Incremental development only** — one feature/component at a time
- **No emojis** in console logs; only log errors (not general statements)
- **Never assume** database column names, table names, or RPC functions exist — search existing code first
- **Pre-flight checklist** for all database operations: search similar code → read reference implementation → copy exact patterns → never invent schema

### Database Patterns
- Use Supabase RPC functions, not direct SQL (e.g., `supabase.rpc('get_partnerships_with_game_counts', { instance_id })`)
- Always cast `COUNT()` to `INTEGER` to prevent bigint mismatch
- Qualify columns with table aliases in complex JOINs
- Profile fields: always `first_name`/`last_name`, never `full_name`
- Partnership uniqueness: `LEAST/GREATEST` pattern for bidirectional constraints
- RLS policies: keep simple, avoid self-referential JOINs

### Frontend / UI
- **Design system**: Glass morphism (`bg-white/80 backdrop-blur-lg`), emerald/green color palette, `rounded-3xl` cards
- **Icons**: Lucide React only
- **Mobile-first**: minimum 320px (iPhone 4), use `min-[375px]:` breakpoint for responsive layouts
- **Component pattern**: `React.FC<Props>` with typed interface, Tailwind utility classes
- **Scoring validation**: First to 15, win by 2, no ties

### Gotchas
- Court numbers are 1-based indices into `court_labels` array
- Auto-assignment only runs when league status is `active`, not `scheduled`
- HMR can break WebSocket connections — restart dev server if real-time stops working
- Component props must match exactly (e.g., MatchQueue needs `leagueId`/`nightId`, not `leagueNightInstanceId`)

## Documentation

- `Docs/ARCHITECTURE.md` — system design and database schema
- `Docs/DEVELOPMENT.md` — setup guide and code conventions
- `Docs/PRODUCT.md` — product overview and user flows
- `CHANGELOG.md` — update with version entries for significant changes
- `Docs/TODO.txt`, `Docs/known_mini_bugs.txt` — active tracking
- `.github/copilot-instructions.md` — detailed AI coding guidelines (authoritative reference)
