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
**Use RPC functions, not direct SQL**:
```javascript
// ✅ Correct
const { data } = await supabase.rpc('get_partnerships_with_game_counts', { instance_id });

// ❌ Wrong: Direct SQL with outdated field names
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
4. 📋 Auto-assignment on new partnerships (currently only on league start + score submission)
5. 📋 Score confirmation flow (opponent confirms submitted scores)
6. 📋 Email integration (contact form functionality)
7. 📋 Advanced admin controls (End League Night, match overrides, no-shows)

---

**When in doubt**: Work incrementally, no emojis in logs, preserve real-time patterns, qualify database columns, verify component props, update docs concisely.
