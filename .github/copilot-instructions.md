# Next-Up AI Coding Instructions

## Project Overview
Real-time pickleball league management platform built with React/TypeScript frontend (Vite), Express.js backend, and Supabase (PostgreSQL + Auth + Real-time). Zero manual refreshes through WebSocket-based real-time updates.

**Stack**: React 19 + TypeScript + Tailwind CSS (Vite) | Node.js + Express | Supabase (PostgreSQL, Auth, Real-time) | Vercel (frontend) + Render (backend)

## Critical Architecture Patterns

### 1. Profile Management
- **Application-managed profiles**: Backend creates `profiles` records after Supabase Auth signup
- **Username generation**: Sanitized `firstName + lastName` with numeric suffix on collision (`jane-doe`, `jane-doe-1`)
- **Display names**: Concatenate `first_name || ' ' || last_name` - NOT stored separately
- **Migration complete**: `full_name` removed, use `first_name`/`last_name` in all queries

### 2. Real-time System
**Single-channel pattern** (prevents subscription churn):
```typescript
// ✅ Correct: One channel per league night with multiple subscriptions
const channel = supabase.channel(`league-night-${instanceId}`);
channel.on('postgres_changes', { table: 'league_night_checkins' }, callback);
channel.on('postgres_changes', { table: 'partnership_requests' }, callback);

// ❌ Wrong: Separate channels cause connection overhead
```

**Stable callback references** (prevent infinite re-renders):
```typescript
const stableCallbacks = useRef(callbacks);
useEffect(() => { stableCallbacks.current = callbacks; });
// Use stableCallbacks.current.onUpdate?.() in subscriptions
```

**Real-time tables**: `league_night_checkins`, `partnership_requests`, `confirmed_partnerships`, `matches`, `league_night_instances`

### 3. League Night Flow
**State machine**: `scheduled` → `active` (auto-starts at start_time) → `completed`

**Auto-assignment triggers**:
1. Admin clicks "Start League Night" → creates initial matches
2. Match score submitted → frees court → `tryAutoAssignMatches()` creates new matches

**Partnership priority queue**: Sort by `games_played_tonight ASC`, avoid repeat pairings, new partnerships inherit minimum games count for fairness

### 4. Database Patterns

**CRITICAL: Always check existing code before writing database operations** (see Pre-Flight Checklist above)

**Use RPC functions, not direct SQL**:
```javascript
// ✅ Correct - but verify RPC exists first by checking existing code
const { data } = await supabase.rpc('get_partnerships_with_game_counts', { instance_id });

// ❌ Wrong: Direct SQL with outdated field names
// ❌ Wrong: Calling non-existent RPC without checking existing code
```

**Column names - NEVER ASSUME**:
```javascript
// ❌ WRONG: Assuming schema
.update({ winner: 'team1', full_name: 'John Doe' })

// ✅ CORRECT: Check existing code first, use actual columns
.update({ team1_score: 15, first_name: 'John', last_name: 'Doe' })
```

**Type casting**: Always cast `COUNT()` to `INTEGER` to prevent bigint/integer mismatch

**Column qualification**: Use table aliases in complex queries (`lni.court_labels`, `cp.id`)

**Partial unique constraints**: 
```sql
-- Allows historical data while preventing duplicate active partnerships
UNIQUE (league_night_instance_id, LEAST(player1_id, player2_id), GREATEST(player1_id, player2_id)) 
WHERE is_active = true
```

**RLS Policies**: Non-recursive policies only - avoid complex JOINs that reference the same table

## Development Workflow

### Setup
```bash
# Frontend (http://localhost:5173)
cd code/client && npm install && npm run dev

# Backend (http://localhost:3001)
cd code/server && npm install && npm run dev
```

### Environment Variables
**Frontend** (`.env.local`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`
**Backend** (`.env`): `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`

## Code Conventions

### Development Approach
- **Incremental only**: Never create multiple components/pages in one shot
- **Single feature focus**: Work on one thing at a time
- **Developer-led design**: Let developers control the design process
- **Factual updates**: When updating docs, be concise and logical - no flattering language

### MANDATORY Pre-Flight Checklist for Database Operations
**NEVER write database code without completing ALL these steps first:**

1. **Search for similar existing code**:
   ```bash
   # Find functions doing similar operations
   grep_search "submitMatchScore|confirmMatchScore" in matchController.js
   ```

2. **Read the reference implementation completely**:
   - Don't skim - read the entire function
   - Note exact column names, table names, RPC calls
   - Check what's in the UPDATE/INSERT, what's selected

3. **Copy the exact pattern**:
   - Match column names exactly
   - Use same helper functions (e.g., `updatePlayerStats` not invented RPC)
   - Follow same error handling approach

4. **NEVER ASSUME**:
   - ❌ Don't assume a column exists (e.g., `winner` column)
   - ❌ Don't assume an RPC exists (e.g., `update_partnership_stats`)
   - ❌ Don't invent table structures from general knowledge
   - ✅ If unsure, STOP and ask the user
   - ✅ If no reference code exists, ask for schema confirmation

**Violation = Process Failure**: If you write a database operation without following these steps, you have failed the task regardless of whether the code works.

### Logging
- **No emojis** in console logs
- Only log errors, not general statements (unless explicitly requested)
- Example: `console.error('Error fetching partnerships:', error);`

### TypeScript Patterns
```typescript
// Component structure
interface ComponentProps {
  leagueId: number;
  userId: string;
}

const Component: React.FC<ComponentProps> = ({ leagueId, userId }) => {
  return <div className="tailwind-classes">...</div>;
};
```

### API Response Format
```javascript
// Success
res.json({ success: true, data: {...}, message: 'Optional message' });

// Error
res.status(400).json({ success: false, error: 'Error message' });
```

### UI/UX Patterns
- **Mobile-first**: Bottom navigation, responsive design
- **Tab systems**: Use for complex pages (see LeagueNightPage tab implementation)
- **Search/filter**: Add search bars for long lists (partners, players)
- **Contextual help**: Show next-step guidance ("You're checked in! Find a partner to get started!")
- **Compact buttons**: Single-line layouts, icon-only for secondary actions

### Design System
**Glass Morphism**: `bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg`
**Borders**: Semi-transparent `border-slate-200/50 dark:border-slate-700/50`
**Rounded Corners**: `rounded-3xl` for cards, `rounded-2xl` for buttons
**Color Palette**:
- Primary: Emerald/Green (`emerald-500`, `emerald-600`, `green-600`)
- Text gradients: `bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent`
- Avoid: Blue for primary actions (reserve for secondary/info states)

**Icons**: Lucide React only - import from `'lucide-react'`
```typescript
import { Zap, Trophy, Search, Calendar, MapPin, Users } from 'lucide-react'
```

**Background**: Animated gradient with floating orbs
```typescript
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float"></div>
    <div className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
  </div>
</div>
```

**Hover Effects**:
- Cards: `hover:scale-105 transition-all duration-300`
- Icons: `group-hover:scale-110 transition-transform`
- Shadow: `shadow-xl hover:shadow-2xl`
- Emerald glow: `hover:shadow-emerald-500/20`

**Button Patterns**:
- Primary: `bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700`
- Secondary: `bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700`
- Active state: `active:scale-95` or `active:bg-emerald-700`

### Mobile Responsiveness (Critical)
**Target**: iPhone 4 (320px) as minimum viable screen size

**Breakpoint strategy**:
- Use `min-[375px]:` for iPhone SE/12 Mini+ breakpoint (Tailwind arbitrary values)
- Below 375px: Vertical stacking, compact sizing, truncation
- At 375px+: Horizontal layouts, normal sizing, text wrapping
- Dynamic flex with `min-w-0` and `flex-shrink-0` for always-horizontal inputs + buttons

**Component patterns**:
```typescript
// Status badges: wrap and stack on small screens
<div className="flex flex-col min-[375px]:flex-row flex-wrap gap-2">
  <div className="text-xs min-[375px]:text-sm whitespace-nowrap">Badge</div>
</div>

// Text content: truncate small, wrap normal
<p className="truncate min-[375px]:whitespace-normal">Player Names</p>

// Input + button combos: keep horizontal, allow shrinking
<div className="flex gap-2">
  <input className="flex-1 min-w-0 px-3 text-sm" />
  <button className="flex-shrink-0 px-3 whitespace-nowrap">Add</button>
</div>

// Form sections: stack on tiny screens
<div className="flex flex-col min-[375px]:flex-row gap-2">
  <div className="flex-1">Content</div>
  <button className="whitespace-nowrap">Action</button>
</div>
```

**Key principles**:
- Add `flex-shrink-0` to icons, buttons that must maintain size
- Add `min-w-0` to text containers that should compress
- Use `truncate` with `min-[375px]:whitespace-normal` for conditional text overflow
- Use `gap-2` instead of `space-x-*` for multi-directional flex layouts
- Responsive sizing: `text-xs min-[375px]:text-sm sm:text-base`
- Responsive padding: `px-2 min-[375px]:px-3 sm:px-4`
- Always test at 320px width (iPhone 4) before considering mobile-ready

### Pickleball Scoring Rules
Validate in `validatePickleballScore()`:
- First to 15 points, win by 2 minimum
- No ties allowed
- If opponent has 13+ points, must win by exactly 2

## Component Structure

**Pages**: `code/client/src/pages/` - Full-page components with routing
**Components**: `code/client/src/components/` - Reusable UI elements
**Tab Components**: `code/client/src/components/league-night-tabs/` - Tab-based navigation components
**Hooks**: `code/client/src/hooks/` - Custom React hooks (auth, real-time, API)
**Services**: `code/client/src/services/` - API clients and Supabase config
**Controllers**: `code/server/src/controllers/` - Business logic handlers
**Routes**: `code/server/src/routes/` - Express route definitions

## Integration Points

### Frontend → Backend
```typescript
// API client pattern (services/api/)
const response = await fetch(`${API_URL}/api/leagues/${id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Backend → Supabase
```javascript
// Use service key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
```

### Real-time subscriptions
```typescript
// Use anon key for client-side
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const channel = supabase.channel('channel-name');
channel.subscribe((status) => { /* handle */ });
```

## Common Gotchas

1. **Profile fields**: Always use `first_name`/`last_name`, never `full_name`
2. **Real-time infinite loops**: Stabilize callbacks with `useRef`, avoid re-subscribing on every render
3. **Court indices**: Court numbers are 1-based indices into `court_labels` array
4. **Auto-assignment**: Only runs when league status is `active`, not `scheduled`
5. **Partnership uniqueness**: Use `LEAST/GREATEST` pattern for bidirectional uniqueness
6. **RLS recursion**: Keep policies simple, avoid self-referential JOINs
7. **Component props**: Verify props match when reusing components (e.g., MatchQueue needs leagueId/nightId, not leagueNightInstanceId)

## Testing & Documentation

**Testing**: Manual testing via UI only - no automated tests unless explicitly requested

**Documentation**:
- **Root docs**: `README.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md`, `CHANGELOG.md`
- **Update CHANGELOG.md**: Add new version entries for significant features/fixes
- **Keep concise**: Factual, logical, efficient - no over-flattering language
- **Active tracking**: `Docs/todo.txt`, `Docs/known_mini_bugs.txt`, `Docs/Design_things_todo.md`
- **Archived**: `Docs/archive/` (historical reference only)

## Current Priorities (Nov 2025)

1. ✅ Real-time system complete
2. ✅ Tab-based navigation for League Night page
3. ✅ Partner search and UX improvements
4. ✅ Auto-assignment on new partnerships (currently only on league start + score submission)
5. ✅ Score confirmation flow (opponent confirms submitted scores)
6. 📋 Email integration (contact form functionality)
7. ✅ Advanced admin controls (End League Night ✅, match overrides, no-shows)

---

**When in doubt**: Work incrementally, no emojis in logs, preserve real-time patterns, qualify database columns, verify component props, update docs concisely.
