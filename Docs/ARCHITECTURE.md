# Architecture

**Stack**: React 19 + TypeScript + Tailwind (Vite) | Node.js + Express | Supabase (PostgreSQL + Auth + Real-time)

**Deployment**: Vercel (frontend) | Render (backend) | Supabase (database)

## System Overview

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Clients   │─────▶│   Express   │─────▶│   Supabase   │
│  (React)    │◀─────│   Backend   │◀─────│  PostgreSQL  │
└─────────────┘      └─────────────┘      └──────────────┘
       │                                           │
       └───────────────────────────────────────────┘
              WebSocket Real-time (Supabase)
```

## Real-time Architecture

**Single-channel pattern** - One WebSocket channel per league night prevents connection churn:

```typescript
// code/client/src/hooks/useLeagueNightRealtime.ts
const channel = supabase.channel(`league-night-${instanceId}`);
channel.on('postgres_changes', { table: 'league_night_checkins' }, callback);
channel.on('postgres_changes', { table: 'partnership_requests' }, callback);
// ... 5 subscriptions on single channel
```

**Stable callbacks** - Prevent infinite re-renders:

```typescript
const stableCallbacks = useRef(callbacks);
useEffect(() => { stableCallbacks.current = callbacks; });
// Use stableCallbacks.current.onUpdate?.() in subscriptions
```

**Real-time tables**: `league_night_checkins`, `partnership_requests`, `confirmed_partnerships`, `matches`, `league_night_instances`

## Database Schema

### Core Tables

**profiles** - User profiles (application-managed, NOT DB-triggered)
- Fields: `id`, `email`, `first_name`, `last_name`, `username`, `skill_level`, `bio`, `location`, `avatar_url`
- Display name: Concatenate `first_name || ' ' || last_name` (NOT stored)
- Username: Sanitized `firstName-lastName` with numeric suffix on collision


**leagues** → **league_days** → **league_night_instances**
- Instances auto-created on first access for each scheduled date
- Status flow: `scheduled` → `active` → `completed`

**league_night_checkins** → **partnership_requests** → **confirmed_partnerships** → **matches**
- Players check in, form partnerships, get assigned to matches
- Partnerships have partial unique constraint on active records only

**push_subscriptions** - Web Push API subscriptions for notifications (PWA)
- Fields: `id`, `user_id`, `endpoint`, `p256dh_key`, `auth_key`, `device_info`, `user_agent`, `is_active`, `created_at`, `last_used_at`
- Stores browser push subscription endpoints for each user/device
- One user can have multiple subscriptions (phone + desktop + tablet)
- Used by backend to send push notifications via web-push library
- Endpoints expire after ~90 days; `last_used_at` tracks active subscriptions

### Key Database Patterns

**RPC Functions** (use these, not direct SQL):
```javascript
supabase.rpc('get_partnerships_with_game_counts', { instance_id })
supabase.rpc('get_available_courts', { instance_id })
```

**Type casting**: Always cast `COUNT()` to `INTEGER` in SQL functions

**Column qualification**: Use table aliases (`lni.court_labels`, `cp.id`) in complex queries

**Partial unique constraints**:
```sql
UNIQUE (league_night_instance_id, LEAST(player1_id, player2_id), GREATEST(player1_id, player2_id)) 
WHERE is_active = true
```

**RLS policies**: Keep simple, avoid self-referential JOINs to prevent recursion

## Auto-Assignment System

**Trigger points**:
1. Admin clicks "Start League Night" → `tryAutoAssignMatches()`
2. Match score submitted → Court freed → `tryAutoAssignMatches()`

**Algorithm** (`code/server/src/controllers/matchController.js`):
1. Get available partnerships (not currently playing)
2. Count games played tonight per partnership
3. Sort by games played ASC (fairness queue)
4. New partnerships inherit current minimum games count
5. Avoid repeat pairings when possible
6. Create matches for available courts

**Court assignment**: Court numbers are 1-based indices into `court_labels` array

## API Structure

**Backend** (`code/server/src/`):
- `controllers/` - Business logic (leagueController, leagueNightController, matchController)
- `routes/` - Express routes (leagues, leagueNights)

**Frontend** (`code/client/src/`):
- `services/api/` - API clients with typed responses
- `hooks/` - Custom hooks (useAuth, useLeagueNightRealtime)
- `pages/` - Full page components
- `components/` - Reusable UI components

**Response format**:
```javascript
// Success
res.json({ success: true, data: {...}, message: 'Optional' });

// Error  
res.status(400).json({ success: false, error: 'Error message' });
```

## Integration Patterns

**Frontend → Backend**:
```typescript
const response = await fetch(`${API_URL}/api/leagues/${id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Backend → Supabase**:
```javascript
// Use SERVICE_KEY for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
```

**Frontend → Supabase Real-time**:
```typescript
// Use ANON_KEY for client subscriptions
const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Critical Gotchas

1. **Profile fields**: Use `first_name`/`last_name`, never `full_name` (migration complete)
2. **Real-time loops**: Stabilize callbacks with `useRef`, don't re-subscribe on every render
3. **Court indices**: 1-based, map to `court_labels[courtNumber - 1]`
4. **Auto-assignment**: Only runs when league `status = 'active'`, not `scheduled`
5. **Partnership uniqueness**: Use `LEAST/GREATEST` for bidirectional constraint
6. **RLS recursion**: Avoid complex JOINs in policies

## Environment Variables

**Frontend** (`.env.local`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL`

**Backend** (`.env`):
- `PORT`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
