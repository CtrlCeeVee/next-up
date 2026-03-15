# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next-Up: real-time pickleball league management platform for South African communities. Two independent apps in one repo (no npm workspaces).

**Stack**: React 19 + TypeScript + Tailwind CSS (Vite) | Express.js 5 | Supabase (PostgreSQL + Auth + Real-time)
**Deployment**: Vercel (frontend at next-up.co.za) + Render (backend) + Supabase Cloud

## Development Commands

```bash
# Install everything (root + client + server)
npm install && npm run install:all

# Start both client and server concurrently
npm run dev

# Or start individually
npm run dev:client    # http://localhost:5173
npm run dev:server    # http://localhost:3001

# Lint & build
npm run lint
npm run build
```

No automated tests — all testing is manual via UI. Don't create tests unless explicitly asked.

## Environment Variables

- **Frontend** (`code/client/.env.local`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`
- **Backend** (`code/server/.env`): `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `VAPID_SUBJECT`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`

## Architecture

See `Docs/ARCHITECTURE.md` for full system design, database schema, and integration patterns.
See `Docs/DEVELOPMENT.md` for setup, debugging, deployment, and common tasks.

**Key patterns to understand before making changes:**
- Frontend → Backend via REST (`fetch` with Bearer token auth). Response format: `{ success, data?, error?, message? }`
- Backend → Supabase via service key for admin DB operations
- Frontend → Supabase directly for real-time WebSocket subscriptions (anon key)
- League Night state machine: `scheduled` → `active` → `completed`
- Player flow: Check in → Form partnership → Auto-assigned to match → Submit score → Court freed → Next match auto-assigned
- Real-time uses single-channel pattern per league night with stable `useRef` callbacks (see `useLeagueNightRealtime.ts`)

## Behavioral Rules

### Development Approach
- **Incremental only** — one feature/component at a time, never batch-create
- **Developer-led design** — let the developer control design decisions
- **Factual documentation** — concise and logical, no flattering language
- **No emojis** in console logs; only log errors unless explicitly requested
  ```javascript
  console.error('Error fetching partnerships:', error);
  ```

### MANDATORY Pre-Flight Checklist for Database Operations

**Never write database code without completing ALL steps:**

1. **Search for similar existing code** — find functions doing similar operations
2. **Read the reference implementation completely** — note exact column names, table names, RPC calls, what's in the UPDATE/INSERT
3. **Copy the exact pattern** — match column names, use same helper functions, follow same error handling
4. **NEVER ASSUME:**
   - Don't assume a column exists (e.g., there is no `winner` column)
   - Don't assume an RPC exists — verify in existing code
   - Don't invent table structures from general knowledge
   - If unsure, STOP and ask the user
   - If no reference code exists, ask for schema confirmation

**Violation = process failure** regardless of whether the code works.

### Key Database Rules
- Use Supabase RPC functions, not direct SQL (e.g., `supabase.rpc('get_partnerships_with_game_counts', { instance_id })`)
- Cast `COUNT()` to `INTEGER` to prevent bigint mismatch
- Qualify columns with table aliases in complex JOINs (`lni.court_labels`, `cp.id`)
- Profile fields: always `first_name`/`last_name`, never `full_name`
- Partnership uniqueness: `LEAST/GREATEST` pattern for bidirectional constraints
- RLS policies: keep simple, avoid self-referential JOINs

## Design System

### Core Visual Language
- **Glass morphism**: `bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg`
- **Borders**: `border-slate-200/50 dark:border-slate-700/50`
- **Rounded corners**: `rounded-3xl` for cards, `rounded-2xl` for buttons
- **Icons**: Lucide React only — `import { Zap, Trophy } from 'lucide-react'`

### Color Palette
- **Primary**: Emerald/Green (`emerald-500`, `emerald-600`, `green-600`)
- **Text gradients**: `bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent`
- **Avoid blue** for primary actions — reserve for secondary/info states

### Buttons
- Primary: `bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700`
- Secondary: `bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700`
- Active state: `active:scale-95`

### Hover & Animation
- Cards: `hover:scale-105 transition-all duration-300`
- Icons: `group-hover:scale-110 transition-transform`
- Shadow: `shadow-xl hover:shadow-2xl`
- Emerald glow: `hover:shadow-emerald-500/20`

### Background Pattern
```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float" />
    <div className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
  </div>
</div>
```

## Mobile Responsiveness

**Minimum**: 320px (iPhone 4). Use `min-[375px]:` as the iPhone SE/12 Mini+ breakpoint.

**Breakpoint strategy**:
- Below 375px: vertical stacking, compact sizing, truncation
- 375px+: horizontal layouts, normal sizing, text wrapping
- Use `gap-2` instead of `space-x-*` for multi-directional flex

**Patterns**:
```tsx
// Stack on tiny screens, row on normal
<div className="flex flex-col min-[375px]:flex-row gap-2">

// Truncate on small, wrap on normal
<p className="truncate min-[375px]:whitespace-normal">Player Names</p>

// Input + button: keep horizontal, allow shrinking
<div className="flex gap-2">
  <input className="flex-1 min-w-0 px-3 text-sm" />
  <button className="flex-shrink-0 px-3 whitespace-nowrap">Add</button>
</div>
```

**Key principles**: `flex-shrink-0` on icons/buttons, `min-w-0` on text containers, responsive sizing `text-xs min-[375px]:text-sm sm:text-base`, responsive padding `px-2 min-[375px]:px-3 sm:px-4`.

## UI/UX Patterns

- **Mobile-first**: bottom navigation, responsive design
- **Tab systems**: use for complex pages (see LeagueNightPage)
- **Search/filter**: add search bars for long lists (partners, players)
- **Contextual help**: show next-step guidance ("You're checked in! Find a partner to get started!")
- **Compact buttons**: single-line layouts, icon-only for secondary actions

### Pickleball Scoring
Validate in `validatePickleballScore()`: first to 15, win by 2 minimum, no ties. If opponent has 13+, must win by exactly 2.

## Gotchas

- Court numbers are 1-based indices into `court_labels` array
- Auto-assignment only runs when league status is `active`, not `scheduled`
- HMR can break WebSocket connections — restart dev server if real-time stops working
- Component props must match exactly (e.g., MatchQueue needs `leagueId`/`nightId`, not `leagueNightInstanceId`)
- Real-time callbacks must be stabilized with `useRef` or you'll get infinite re-renders

## Documentation

- `Docs/ARCHITECTURE.md` — system design, database schema, real-time architecture, auto-assignment algorithm
- `Docs/DEVELOPMENT.md` — full setup guide, code conventions, debugging, deployment, common tasks
- `Docs/PRODUCT.md` — product overview and user flows
- `CHANGELOG.md` — version history (update for significant changes)
- `Docs/TODO.txt`, `Docs/known_mini_bugs.txt` — active tracking
