# Development Guide

## Quick Start

### Prerequisites
- Node.js v18+
- npm
- Git

### Setup & Run

```bash
# Frontend (http://localhost:5173)
cd code/client
npm install
npm run dev

# Backend (http://localhost:3001)
cd code/server
npm install
npm run dev
```

### Environment Setup

**Frontend** (`code/client/.env.local`):
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3001
```

**Backend** (`code/server/.env`):
```bash
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
```

## Code Conventions

### Incremental Development
- Work on ONE feature/component at a time
- Never create multiple pages/components in one go
- Let developers control the design process
- Report changes, let developers test

### Logging
- **No emojis** in console logs
- Only log errors unless explicitly requested
- Example: `console.error('Error fetching partnerships:', error);`

### TypeScript Patterns

**Component structure**:
```typescript
interface ComponentProps {
  leagueId: number;
  userId: string;
}

const Component: React.FC<ComponentProps> = ({ leagueId, userId }) => {
  return <div className="tailwind-classes">...</div>;
};
```

**API responses**:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### API Endpoint Patterns

**Backend controllers**:
```javascript
// Success
res.json({ success: true, data: {...}, message: 'Optional' });

// Error
res.status(400).json({ success: false, error: 'Error message' });
```

**Route organization** (`code/server/src/routes/`):
- `leagues.js` - League CRUD, membership, stats
- `leagueNights.js` - Check-ins, partnerships, matches, scores

## Project Structure

```
code/
├── client/
│   └── src/
│       ├── pages/          # Full-page components
│       ├── components/     # Reusable UI components
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API clients, Supabase config
│       └── contexts/       # React Context providers
│
└── server/
    └── src/
        ├── controllers/    # Business logic
        └── routes/         # Express routes
```

## Testing

**Current approach**: Manual testing via UI
- No automated tests exist yet
- Don't create/run tests unless explicitly asked
- Test changes through browser after implementation
- Verify real-time updates across multiple browser windows

## Database Development

### Running Migrations

Execute SQL files in Supabase SQL Editor:
1. Navigate to Supabase Dashboard → SQL Editor
2. Paste migration SQL
3. Run and verify

**Existing migrations** (already applied):
- `001_add_matches_table.sql`
- `002_fix_partnerships_function.sql`
- `003_fix_courts_function.sql`
- `004_split_fullname_add_username.sql`

### Testing Database Functions

```sql
-- Test partnerships function
SELECT * FROM get_partnerships_with_game_counts(6);

-- Test courts function
SELECT * FROM get_available_courts(6);
```

### Common Database Patterns

**Always qualify columns**:
```sql
-- Good
SELECT lni.court_labels, cp.player1_id 
FROM confirmed_partnerships cp
JOIN league_night_instances lni ON lni.id = cp.league_night_instance_id

-- Bad
SELECT court_labels, player1_id  -- Ambiguous if multiple tables have same column
```

**Cast aggregate functions**:
```sql
-- Good
COUNT(*)::INTEGER as games_count

-- Bad
COUNT(*) as games_count  -- Returns bigint, causes type mismatch
```

## Deployment

### Frontend (Vercel)
- Connected to GitHub `master` branch
- Auto-deploys on push
- Environment variables set in Vercel dashboard
- Domain: `next-up.co.za`

### Backend (Render)
- Connected to GitHub `master` branch
- Auto-deploys on push
- Environment variables set in Render dashboard
- Service type: Web Service

### Database (Supabase)
- Hosted on Supabase cloud
- Manual migrations via SQL Editor
- RLS policies enabled on all tables

## Common Tasks

### Adding a New API Endpoint

1. **Create controller function** (`code/server/src/controllers/`):
```javascript
const newEndpoint = async (req, res) => {
  try {
    const { data, error } = await supabase.from('table').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

2. **Add route** (`code/server/src/routes/`):
```javascript
router.get('/endpoint', newEndpoint);
```

3. **Create API client** (`code/client/src/services/api/`):
```typescript
export const fetchData = async (): Promise<ApiResponse<DataType>> => {
  return apiClient.get('/endpoint');
};
```

### Adding Real-time Subscriptions

**Already implemented** in `useLeagueNightRealtime` hook - add new table subscriptions to existing channel:

```typescript
channel.on('postgres_changes', {
  event: '*',
  schema: 'public',
  table: 'new_table',
  filter: `league_night_instance_id=eq.${instanceId}`
}, (payload) => {
  stableCallbacks.current.onNewTableUpdate?.();
});
```

## Debugging

### Backend
- Check Render logs for server errors
- Use `console.error()` for error logging
- Verify Supabase service key permissions

### Frontend
- Browser DevTools Console for errors
- React DevTools for component state
- Network tab for API call inspection

### Real-time
- Connection status: `RealtimeStatusIndicator` component shows WebSocket state
- Verify Supabase real-time is enabled for tables in Supabase Dashboard
- Check browser console for subscription errors

## Known Limitations

1. **Mock data remaining**:
   - `LeaguePage.tsx` - League nights (line 119)
   - `ProfilePage.tsx` - Non-current user profiles (line 107)

2. **No automated tests** - All testing is manual via UI

3. **No email integration yet** - Contact form not functional
