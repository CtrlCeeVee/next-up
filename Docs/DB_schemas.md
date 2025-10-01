# 🗄️ Next-Up Database Schema

## Overview
Database schema for Next-Up pickleball league management system. Built with Supabase (PostgreSQL) with Row Level Security enabled.

## Schema Diagram
```
profiles (users)
    ↓ (owner_id)
leagues ← league_days
    ↓ (league_id)          ↓ (league_id)
league_memberships → league_night_instances
    ↓ (league_id, user_id)    ↓ (instance_id)
player_stats         league_night_checkins
                          ↓ (instance_id)
                     partnership_requests
                          ↓ (instance_id)
                     confirmed_partnerships
                          ↓ (partnership_id)
                         matches
```

## Core Tables

### **profiles**
Extends Supabase Auth with player information.
```sql
id UUID PRIMARY KEY → auth.users(id)
email TEXT UNIQUE NOT NULL
first_name TEXT NOT NULL
last_name TEXT NOT NULL
username TEXT UNIQUE NOT NULL -- internal slug (generated on signup)
phone TEXT
skill_level TEXT ('Beginner', 'Intermediate', 'Advanced')
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ
```

### **leagues**
League information and ownership.
```sql
id SERIAL PRIMARY KEY
name TEXT NOT NULL
description TEXT
location TEXT NOT NULL
address TEXT
is_active BOOLEAN DEFAULT true
owner_id UUID → profiles(id)
created_at, updated_at TIMESTAMPTZ
```

### **league_days**
League schedule with flexible court configurations.
```sql
id SERIAL PRIMARY KEY
league_id INTEGER → leagues(id)
day_of_week INTEGER (1=Monday, 7=Sunday)
start_time TIME NOT NULL
total_courts INTEGER DEFAULT 1
court_labels TEXT[] (e.g., ['Court 1', 'Court 2'])
created_at TIMESTAMPTZ
```

### **league_memberships**
Player participation and roles in leagues.
```sql
id SERIAL PRIMARY KEY
league_id INTEGER → leagues(id)
user_id UUID → profiles(id)
role TEXT ('player', 'admin') DEFAULT 'player'
joined_at TIMESTAMPTZ
is_active BOOLEAN DEFAULT true
UNIQUE(league_id, user_id)
```

### **player_stats**
Performance statistics per league.
```sql
id SERIAL PRIMARY KEY
user_id UUID → profiles(id)
league_id INTEGER → leagues(id)
games_played INTEGER DEFAULT 0
games_won INTEGER DEFAULT 0
games_lost INTEGER DEFAULT 0
total_points INTEGER DEFAULT 0
average_points DECIMAL(4,2) DEFAULT 0.0
created_at, updated_at TIMESTAMPTZ
UNIQUE(user_id, league_id)
```

## League Night Tables

### **league_night_instances**
Specific occurrences of league nights (e.g., "Monday, Sept 16, 2025").
```sql
id SERIAL PRIMARY KEY
league_id INTEGER → leagues(id)
day_of_week INTEGER (1=Monday, 7=Sunday)
date DATE NOT NULL -- The actual date of this league night
start_time TIME NOT NULL
status TEXT ('scheduled', 'active', 'completed') DEFAULT 'scheduled'
courts_available INTEGER DEFAULT 1
court_labels TEXT[]
auto_started_at TIMESTAMPTZ -- Auto-set when start_time is reached
created_at TIMESTAMPTZ
UNIQUE(league_id, date)
```

### **league_night_checkins**
Tracks who has checked in for specific league nights.
```sql
id SERIAL PRIMARY KEY
league_night_instance_id INTEGER → league_night_instances(id)
user_id UUID → profiles(id)
checked_in_at TIMESTAMPTZ DEFAULT NOW()
checked_out_at TIMESTAMPTZ
is_active BOOLEAN DEFAULT true
created_at TIMESTAMPTZ
UNIQUE(league_night_instance_id, user_id)
```

### **partnership_requests**
Handles the request/accept flow for partnerships.
```sql
id SERIAL PRIMARY KEY
league_night_instance_id INTEGER → league_night_instances(id)
requester_id UUID → profiles(id)
requested_id UUID → profiles(id)
status TEXT ('pending', 'accepted', 'declined', 'cancelled') DEFAULT 'pending'
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
UNIQUE(league_night_instance_id, requester_id)
CHECK(requester_id != requested_id)
```

### **confirmed_partnerships**
Only confirmed duos eligible for match pool.
```sql
id SERIAL PRIMARY KEY
league_night_instance_id INTEGER → league_night_instances(id)
player1_id UUID → profiles(id)
player2_id UUID → profiles(id)
confirmed_at TIMESTAMPTZ DEFAULT NOW()
is_active BOOLEAN DEFAULT true
created_at TIMESTAMPTZ
UNIQUE(league_night_instance_id, player1_id)
UNIQUE(league_night_instance_id, player2_id)
CHECK(player1_id != player2_id)
```

### **matches**
Individual games between two partnerships during league nights.
```sql
id SERIAL PRIMARY KEY
league_night_instance_id INTEGER → league_night_instances(id)
partnership1_id INTEGER → confirmed_partnerships(id)
partnership2_id INTEGER → confirmed_partnerships(id)
court_number INTEGER NOT NULL
status TEXT ('active', 'completed', 'cancelled') DEFAULT 'active'
team1_score INTEGER
team2_score INTEGER
created_at TIMESTAMPTZ DEFAULT NOW()
completed_at TIMESTAMPTZ
CHECK(partnership1_id != partnership2_id)
CHECK(team1_score >= 0)
CHECK(team2_score >= 0)
```

## Relationships

1. **League Ownership**: `leagues.owner_id → profiles.id`
2. **League Schedule**: `league_days.league_id → leagues.id` (one-to-many)
3. **Player Membership**: `league_memberships` links `profiles` and `leagues` (many-to-many)
4. **Performance Tracking**: `player_stats` tracks per-league performance (many-to-many)
5. **League Night Instances**: `league_night_instances.league_id → leagues.id` (one-to-many)
6. **Check-ins**: `league_night_checkins` links players to specific league nights
7. **Partnership Flow**: `partnership_requests → confirmed_partnerships` (request/accept flow)
8. **Match Creation**: `matches` links two partnerships for actual games
9. **Match Pool**: Only players in `confirmed_partnerships` are eligible for matches

## League Night Flow

1. **Instance Creation**: League nights auto-created from `league_days` templates when accessed
2. **Player Check-in**: Players check into specific league night instances
3. **Partnership Formation**: 
   - Players can request partnerships with other checked-in players
   - Confirmed partnerships move to `confirmed_partnerships` table
   - Only partnered players enter the match pool
4. **Match Assignment**: System automatically creates matches between partnerships
   - Prioritizes partnerships with fewer games played tonight
   - Assigns available courts based on league night configuration
   - Creates priority queue when more partnerships than courts
5. **Game Play & Scoring**: Teams play matches and submit scores
   - Updates player statistics in `player_stats` table
   - Frees up courts for next round of matches
   - Partnerships re-enter queue for continuous play

## Key Design Decisions

- **Stats Isolation**: Player stats are per-league, not global
- **Flexible Courts**: Court configurations can vary per league day
- **Role System**: Simple player/admin roles with league owner having full control
- **Mixed Skill**: Leagues don't have skill levels (removed), only players do

## Row Level Security

All tables have RLS policies ensuring:
- Users manage their own profiles
- Public viewing of active leagues
- League owners/admins control their league data
- Members can view stats within their leagues

## Profile creation (canonical)

Profiles are created and owned by the application (canonical approach documented here):

- When a user signs up via Supabase Auth the backend/application is responsible for creating the matching `profiles` record (preferred).
- This approach avoids fragile DB trigger/search_path/SECURITY DEFINER pitfalls and makes username collision handling and custom metadata simpler to manage.
- The repo contains optional trigger SQL (see Migration files below) for teams who prefer automatic DB-side profile creation; the trigger SQL is kept as a reference but is not the canonical flow.

If you prefer to enable DB-triggered profile creation, see the `fixed_trigger.sql` / `fresh_setup.sql` files — they contain a `handle_new_user()` function and trigger on `auth.users` with explicit schema qualification and collision handling.

## Username generation & collision handling

- Username: generated using sanitized first + last name (client attempts generation before signup). The application must ensure uniqueness before inserting into `profiles`.
- Collision handling strategy (documented implementation): the app checks for existing usernames and, on collision, appends a numeric suffix (e.g. `jane-doe`, `jane-doe-1`, `jane-doe-2`) until a free name is found.
- A `fix_username_bug.sql` file exists in the repo fixing a previously-too-aggressive regex used in earlier trigger variants; that fix is included in the canonical migration notes.

Note: `display_name` is derived, not stored: concatenate `first_name || ' ' || last_name` when returning profile names to clients, or expose a read-only `display_name` view if preferred

## Migration History

## Current Production Data

**Northcliff Eagles** (ID: 1)
- 30 members with realistic stats
- Monday & Wednesday 6:30 PM
- 4 courts at Northcliff Country Club
- Owner: Luke Renton

## Database Functions

### **get_partnerships_with_game_counts(instance_id INTEGER)**
Returns partnerships sorted by games played tonight for match assignment priority.
```sql
-- Returns: partnership_id, player names, skill levels, games_played_tonight, avg_skill_level
-- Used by: Match assignment algorithm
-- Fixed: Column reference ambiguity and bigint/integer type mismatch
```

### **get_available_courts(instance_id INTEGER)**
Returns available court numbers based on league configuration and active matches.
```sql
-- Returns: court_number (integer indices)
-- Considers: court_labels array from league_night_instances
-- Logic: Returns indices 1..N corresponding to court_labels array positions
-- Used by: Match assignment for court allocation
-- Fixed: Ambiguous column reference for court_labels
```

## Migration History

1. **001_add_matches_table.sql** - Initial matches table and functions
2. **002_fix_partnerships_function.sql** - Fixed column ambiguity and type mismatches
3. **003_fix_courts_function.sql** - Fixed court_labels column ambiguity, preserved court naming
4. **004_split_fullname_add_username.sql** - Split `full_name` into `first_name`/`last_name` and added `username` (NOT NULL, UNIQUE); documented application-managed profile creation and added migration scripts for both app-managed and optional DB-triggered creation.

## Known Database Considerations

- **Type Consistency**: Use `::INTEGER` casts for COUNT() results in functions
- **Column Qualification**: Always qualify columns in complex queries (e.g., `lni.court_labels`)
- **Court Indexing**: Court numbers are 1-based indices into the court_labels array
- **Function Permissions**: Grant EXECUTE to `anon, authenticated` for API access

## Notes, TODOs and pending work

- The `full_name` column was removed and replaced by `first_name` and `last_name`. Several server and client code paths were updated accordingly, but some places still reference `full_name` and must be refactored to avoid runtime SQL errors. Known remaining locations:
    - `server/src/controllers/matchController.js` — multiple `.select()` calls that still reference `full_name` (needs updates to select `first_name`/`last_name` or to return a derived `display_name`).
    - Client components such as `MatchesDisplay.tsx` and any UI expecting `full_name` must be updated to use `first_name`/`last_name` or `display_name`.

- When writing new queries, prefer qualifying columns (e.g., `profiles.first_name`) in complex joins and use `first_name || ' ' || last_name AS display_name` when a single string is required by the API.

- If you later decide to adopt DB-triggered profile creation as canonical, move the `handle_new_user()` SQL into your main migrations and ensure the function is created in `public` schema with `SECURITY DEFINER` and an explicit `search_path` to avoid permission/search_path issues.

## Where to look in the repo

- Server-side signup/profile logic: `server/src/controllers/*` and `server/src/routes/*` (look for `joinLeague`, `handle sign-up`, and profile creation logic).
- Client signup code: `client/src/components/auth/SignUpForm.tsx`, `client/src/services/auth.ts`, `client/src/hooks/useAuth.ts` (username generation and metadata passed to Supabase).
- SQL / migration files: `code/` and top-level SQL files mentioned above (search for `create_profiles_table.sql`, `fix_username_bug.sql`, `fresh_setup.sql`).

---

If you'd like, next I can:

1. Create a new, minimal migration SQL `004_split_fullname_add_username.sql` that represents the canonical application-managed change (adds columns and backfills data if needed). OR
2. Update remaining `full_name` usages across the codebase (I can prepare an exact list of edits or apply them if you want me to make code changes).

Tell me which of those (1 or 2) you want next and I'll proceed.