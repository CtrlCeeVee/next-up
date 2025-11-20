# 🔄 Real-time Updates Setup Guide

## Overview
This implementation adds real-time updates to the Next-Up app, eliminating the need for manual page refreshes. Users will automatically see updates when:

- Players check in/out
- Partnership requests are sent/accepted
- New matches are created
- Match scores are submitted
- League night status changes

## Architecture

### Real-time Hooks
- `useRealtime()` - Core connection management
- `useLeagueNightCheckins()` - Check-in updates
- `usePartnershipRequests()` - Partnership request updates
- `useConfirmedPartnerships()` - Confirmed partnership updates
- `useMatches()` - Match updates
- `useLeagueNightStatus()` - League night status updates

### Components Added
1. **RealtimeStatusIndicator** - Shows connection status in top-right corner
2. **ToastProvider** - Provides notification system for updates
3. **Updated LeagueNightPage** - Uses all real-time hooks
4. **Updated MatchesDisplay** - Real-time match updates

## Supabase Configuration Required

### 1. Enable Real-time in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Scroll to **Real-time** section
4. Enable real-time for these tables:
   - `league_night_checkins`
   - `partnership_requests` 
   - `confirmed_partnerships`
   - `matches`
   - `league_night_instances`

### 2. Database RLS (Row Level Security)

**IMPORTANT:** First, drop any existing conflicting policies to prevent infinite recursion:

```sql
-- Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can subscribe to league night checkins" ON league_night_checkins;
DROP POLICY IF EXISTS "Users can subscribe to partnership requests" ON partnership_requests;
DROP POLICY IF EXISTS "Users can subscribe to confirmed partnerships" ON confirmed_partnerships;
DROP POLICY IF EXISTS "Users can subscribe to matches" ON matches;
DROP POLICY IF EXISTS "Users can subscribe to league night instances" ON league_night_instances;
```

Then run these **simplified, non-recursive** policies:

```sql
-- 1. LEAGUE_NIGHT_CHECKINS - Simple policy without complex JOINs
CREATE POLICY "realtime_league_night_checkins" ON league_night_checkins
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    league_night_instance_id IN (
      SELECT id FROM league_night_instances WHERE league_id IN (
        SELECT league_id FROM league_memberships WHERE user_id = auth.uid() AND is_active = true
      )
    )
  )
);

-- 2. PARTNERSHIP_REQUESTS - Allow users to see requests involving them or in their leagues
CREATE POLICY "Users can subscribe to partnership requests" ON partnership_requests
FOR SELECT USING (
  -- User is either the requester, requested, or a member of the league
  requester_id = auth.uid() 
  OR requested_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM league_night_instances lni
    JOIN leagues l ON l.id = lni.league_id
    JOIN league_memberships lm ON lm.league_id = l.id
    WHERE lni.id = partnership_requests.league_night_instance_id
    AND lm.user_id = auth.uid()
    AND lm.is_active = true
  )
);

-- 3. CONFIRMED_PARTNERSHIPS - Allow users to see partnerships in leagues they're members of
CREATE POLICY "Users can subscribe to confirmed partnerships" ON confirmed_partnerships
FOR SELECT USING (
  -- User is one of the partners or a member of the league
  player1_id = auth.uid() 
  OR player2_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM league_night_instances lni
    JOIN leagues l ON l.id = lni.league_id
    JOIN league_memberships lm ON lm.league_id = l.id
    WHERE lni.id = confirmed_partnerships.league_night_instance_id
    AND lm.user_id = auth.uid()
    AND lm.is_active = true
  )
);

-- 4. MATCHES - Allow users to see matches in leagues they're members of
CREATE POLICY "Users can subscribe to matches" ON matches
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM league_night_instances lni
    JOIN leagues l ON l.id = lni.league_id
    JOIN league_memberships lm ON lm.league_id = l.id
    WHERE lni.id = matches.league_night_instance_id
    AND lm.user_id = auth.uid()
    AND lm.is_active = true
  )
  OR EXISTS (
    -- Also allow if user is in one of the partnerships playing
    SELECT 1 FROM confirmed_partnerships cp
    WHERE (cp.id = matches.partnership1_id OR cp.id = matches.partnership2_id)
    AND (cp.player1_id = auth.uid() OR cp.player2_id = auth.uid())
  )
);

-- 5. LEAGUE_NIGHT_INSTANCES - Allow users to see league night status for their leagues
CREATE POLICY "Users can subscribe to league night instances" ON league_night_instances
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM leagues l
    JOIN league_memberships lm ON lm.league_id = l.id
    WHERE l.id = league_night_instances.league_id
    AND lm.user_id = auth.uid()
    AND lm.is_active = true
  )
);
```

### Additional Policies (if needed)

If you encounter permission issues, you may also need these policies for real-time to work properly:

```sql
-- Allow real-time to read profiles for user info in joins
CREATE POLICY "Users can view member profiles" ON profiles
FOR SELECT USING (
  -- Users can see profiles of people in their leagues
  EXISTS (
    SELECT 1 FROM league_memberships lm1
    JOIN league_memberships lm2 ON lm1.league_id = lm2.league_id
    WHERE lm1.user_id = auth.uid() 
    AND lm2.user_id = profiles.id
    AND lm1.is_active = true 
    AND lm2.is_active = true
  )
  OR id = auth.uid() -- Users can always see their own profile
);
```

### 3. Verification

Test that the policies work by running these queries in Supabase SQL Editor (they should return data):

```sql
-- Test as authenticated user (replace with your user ID)
SET request.jwt.claims = '{"sub": "c2168748-fe74-4207-ab7f-c691fd0ba837"}';

-- These should return data for leagues you're a member of:
SELECT * FROM league_night_checkins LIMIT 5;
SELECT * FROM partnership_requests LIMIT 5;
SELECT * FROM confirmed_partnerships LIMIT 5;
SELECT * FROM matches LIMIT 5;
SELECT * FROM league_night_instances LIMIT 5;
```

### 4. Environment Variables

Make sure these are set in your `.env.local`:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

### In Components

```typescript
import { useLeagueNightCheckins } from '../hooks/useRealtime';

const MyComponent = () => {
  const handleUpdate = useCallback(() => {
    // Refresh your data
    refetchData();
  }, []);

  // This will automatically trigger handleUpdate when check-ins change
  useLeagueNightCheckins(leagueNightInstanceId, handleUpdate);
};
```

### Connection Status

The `RealtimeStatusIndicator` shows:
- 🟢 **Connected** - Real-time updates working (hidden when connected)
- 🟡 **Connecting** - Establishing connection
- 🔴 **Disconnected** - No real-time updates (shows refresh reminder)
- ⚠️ **Error** - Connection failed (shows refresh reminder)

## Performance Considerations

### Optimization Features
1. **Filtered Subscriptions** - Only listen to relevant data changes
2. **User-specific Filters** - Partnership requests only trigger for involved users
3. **Debounced Updates** - Prevents excessive re-renders
4. **Connection Pooling** - Single channel per page
5. **Auto-cleanup** - Subscriptions cleaned up on component unmount

### Network Usage
- Real-time uses WebSocket connection (low overhead)
- Only sends small JSON payloads with change notifications
- Much more efficient than polling
- Graceful fallback to manual refresh when disconnected

## Troubleshooting

### Real-time Not Working
1. Check Supabase dashboard - is real-time enabled for the tables?
2. Check browser console for connection errors
3. Verify RLS policies allow real-time subscriptions
4. Check network - some corporate firewalls block WebSockets

### High Latency
1. Supabase real-time typically has <100ms latency
2. Check your internet connection
3. Geographic distance from Supabase servers affects latency

### Connection Issues
- The app gracefully handles disconnections
- Shows status indicator when problems occur
- Users can still refresh manually as fallback
- Automatic reconnection attempts

## Development Tips

### Testing Real-time
1. Open two browser windows side by side
2. Perform actions in one window (check in, send partnership request)
3. Watch the other window update automatically
4. Monitor browser console for real-time logs

### Debugging
Real-time events are logged to console:
```
Real-time connection established: {...}
Real-time: Check-ins updated, refreshing...
Real-time: Partnership requests updated, refreshing...
```

## Future Enhancements

### Potential Additions
1. **Push Notifications** - Browser notifications for important updates
2. **Optimistic Updates** - Show changes immediately before server confirmation
3. **Conflict Resolution** - Handle simultaneous updates gracefully
4. **Real-time Chat** - Add messaging between players
5. **Live Scoring** - Real-time score updates during matches

### Performance Monitoring
- Track connection success rates
- Monitor update latency
- User feedback on real-time experience
- Analytics on refresh vs real-time usage