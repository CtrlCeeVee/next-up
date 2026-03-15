# Database Architecture — Next-Up

Full audit of the Supabase PostgreSQL database as of 2026-03-15.

---

## Entity Relationship Diagram

```
┌──────────────────────┐
│       profiles       │ ◄── auth.users (via handle_new_user trigger)
│──────────────────────│
│ PK  id (uuid)        │
│     email (unique)   │
│     first_name       │
│     last_name        │
│     username         │
│     phone            │
│     skill_level      │  CHECK: Beginner | Intermediate | Advanced
│     bio              │
│     location         │
│     avatar_url       │
│     created_at       │
│     updated_at       │
│ RLS: ENABLED         │
│ Rows: 260            │
└──────────┬───────────┘
           │
           │ id ──────────────────────────────────────┐
           │                                          │
     ┌─────┴──────┐    ┌─────────────┐    ┌──────────┴──────────┐
     │             │    │             │    │                     │
     ▼             ▼    ▼             │    ▼                     │
┌─────────────┐ ┌──────────────┐ ┌───┴────────────────┐ ┌───────┴──────────┐
│   leagues   │ │push_subscrip.│ │ league_memberships │ │   player_stats   │
│─────────────│ │──────────────│ │────────────────────│ │──────────────────│
│PK id (int)  │ │PK id (int)   │ │PK id (int)         │ │PK id (int)       │
│  name       │ │FK user_id    │ │FK league_id        │ │FK user_id        │
│  description│ │  endpoint    │ │FK user_id          │ │FK league_id      │
│  location   │ │  (unique)    │ │  role              │ │  games_played    │
│  address    │ │  p256dh_key  │ │  CHECK: player |   │ │  games_won       │
│  is_active  │ │  auth_key    │ │         admin      │ │  games_lost      │
│FK owner_id  │ │  device_info │ │  joined_at         │ │  total_points    │
│  created_at │ │  user_agent  │ │  is_active         │ │  average_points  │
│  updated_at │ │  is_active   │ │                    │ │  created_at      │
│RLS: ENABLED │ │  created_at  │ │ UNIQUE(league,user)│ │  updated_at      │
│Rows: 2      │ │  last_used_at│ │ RLS: ENABLED       │ │                  │
└──────┬──────┘ │RLS: ENABLED  │ │ Rows: 245          │ │ UNIQUE(user,     │
       │        │Rows: 39      │ └────────────────────┘ │        league)   │
       │        └──────────────┘                        │ RLS: ENABLED     │
       │                                                │ Rows: 250        │
       │                                                └──────────────────┘
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌──────────────┐      ┌──────────────────────────┐
│ league_days  │      │ league_night_instances    │
│──────────────│      │──────────────────────────│
│PK id (int)   │      │PK id (int)               │
│FK league_id  │      │FK league_id              │
│  day_of_week │      │  day_of_week             │
│  CHECK: 1-7  │      │  CHECK: 1-7              │
│  start_time  │      │  date (date)             │
│  total_courts│      │  start_time              │
│  court_labels│      │  status                  │
│  (text[])    │      │  CHECK: scheduled |      │
│  created_at  │      │    active | completed    │
│RLS: ENABLED  │      │  courts_available        │
│Rows: 2       │      │  court_labels (text[])   │
└──────────────┘      │  auto_started_at         │
                      │  auto_assignment_enabled │
                      │  ended_at                │
                      │  created_at              │
                      │ UNIQUE(league_id, date)  │
                      │ RLS: DISABLED            │
                      │ Rows: 45                 │
                      └────────────┬─────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
              ▼                    ▼                     ▼
┌─────────────────────┐ ┌──────────────────┐ ┌──────────────────────────┐
│league_night_checkins│ │partnership_reqs  │ │ confirmed_partnerships   │
│─────────────────────│ │──────────────────│ │──────────────────────────│
│PK id (int)          │ │PK id (int)       │ │PK id (int)               │
│FK league_night_     │ │FK league_night_  │ │FK league_night_          │
│   instance_id       │ │   instance_id    │ │   instance_id            │
│FK user_id           │ │FK requester_id   │ │FK player1_id             │
│  checked_in_at      │ │FK requested_id   │ │FK player2_id             │
│  checked_out_at     │ │  status          │ │  confirmed_at            │
│  is_active          │ │  CHECK: pending |│ │  is_active               │
│  created_at         │ │  accepted |      │ │  created_at              │
│                     │ │  declined |      │ │                          │
│ UNIQUE(instance,    │ │  cancelled       │ │ UNIQUE(instance,p1,p2)   │
│        user)        │ │  created_at      │ │   WHERE is_active=true   │
│ RLS: DISABLED       │ │  updated_at      │ │ RLS: DISABLED            │
│ Rows: 910           │ │                  │ │ Rows: 449                │
└─────────────────────┘ │ UNIQUE(instance, │ └────────────┬─────────────┘
                        │   requester)     │              │
                        │ RLS: DISABLED    │              │
                        │ Rows: 378        │              │
                        └──────────────────┘              │
                                                          │
                                                          ▼
                                              ┌───────────────────────┐
                                              │       matches         │
                                              │───────────────────────│
                                              │PK id (int)            │
                                              │FK league_night_       │
                                              │   instance_id         │
                                              │FK partnership1_id     │
                                              │FK partnership2_id     │
                                              │  court_number (int)   │
                                              │  status               │
                                              │  CHECK: active |      │
                                              │  completed | cancelled│
                                              │  team1_score (>=0)    │
                                              │  team2_score (>=0)    │
                                              │  pending_team1_score  │
                                              │  pending_team2_score  │
                                              │FK pending_submitted_  │
                                              │   by_partnership_id   │
                                              │  pending_submitted_at │
                                              │  score_status         │
                                              │  CHECK: none |        │
                                              │  pending | confirmed |│
                                              │  disputed             │
                                              │  created_at           │
                                              │  completed_at         │
                                              │ RLS: DISABLED         │
                                              │ Rows: 730             │
                                              └───────────────────────┘
```

---

## Table Summary

| Table | Rows | RLS | Purpose |
|---|---|---|---|
| `profiles` | 260 | ON | User accounts, synced from `auth.users` via trigger |
| `leagues` | 2 | ON | League definitions (Northcliff Eagles, GPC Pickleball) |
| `league_days` | 2 | ON | Recurring schedule (day + time + courts) |
| `league_memberships` | 245 | ON | Player/admin membership per league |
| `player_stats` | 250 | ON | Aggregated win/loss/points per player per league |
| `league_night_instances` | 45 | OFF | Individual league night events (state machine) |
| `league_night_checkins` | 910 | OFF | Player attendance tracking per night |
| `partnership_requests` | 378 | OFF | Partnership invite workflow |
| `confirmed_partnerships` | 449 | OFF | Active player pairs for a night |
| `matches` | 730 | OFF | Games between partnerships with score confirmation |
| `push_subscriptions` | 39 | ON | Web push notification endpoints |

---

## Relationships (Foreign Keys)

### Core hierarchy
```
profiles ──< league_memberships >── leagues
profiles ──< player_stats >── leagues
leagues ──< league_days
leagues ──< league_night_instances
```

### League night event graph
```
league_night_instances ──< league_night_checkins >── profiles
league_night_instances ──< partnership_requests  >── profiles (requester + requested)
league_night_instances ──< confirmed_partnerships >── profiles (player1 + player2)
league_night_instances ──< matches
confirmed_partnerships ──< matches (partnership1, partnership2, pending_submitted_by)
```

### Standalone
```
profiles ──< push_subscriptions
```

---

## Database Functions (RPCs)

### 1. `handle_new_user()` — Trigger
- **Fires on:** `INSERT` into `auth.users`
- **Action:** Auto-creates a `profiles` row with `first_name`, `last_name`, auto-generated unique `username`, `email`, and default `skill_level`
- **Security:** `SECURITY DEFINER`, `search_path = 'public'`
- **Error handling:** Catches all exceptions and logs, so auth signup never breaks

### 2. `update_updated_at_column()` — Trigger
- **Purpose:** Auto-sets `updated_at = NOW()` on row update
- **Used by:** Tables with `updated_at` columns

### 3. `generate_unique_username(base_username text)` → `text`
- **Purpose:** Appends incrementing suffix until username is unique
- **Used by:** `handle_new_user()`

### 4. `get_available_courts(instance_id int)` → `TABLE(court_number int)`
- **Security:** `SECURITY DEFINER`
- **Logic:** Returns court numbers not currently occupied by an `active` match. Uses `court_labels` array indices if available, falls back to `1..courts_available`

### 5. `get_partnerships_with_game_counts(instance_id int)` → `TABLE(...)`
- **Security:** `SECURITY DEFINER`
- **Returns:** Partnership details with player names, skill levels, games played tonight, and calculated average skill level
- **Sorting:** Fewest games first, then lowest skill — drives fair auto-assignment
- **Note:** References `p1.full_name` / `p2.full_name` which don't exist as columns (uses `first_name`/`last_name` at app layer — this RPC may rely on a computed column or alias)

---

## Indexes

### Primary keys (all tables)
Every table has a `btree` PK index on `id`.

### Unique constraints
| Table | Columns | Condition |
|---|---|---|
| `profiles` | `email` | — |
| `league_memberships` | `(league_id, user_id)` | — |
| `league_night_instances` | `(league_id, date)` | — |
| `league_night_checkins` | `(league_night_instance_id, user_id)` | — |
| `partnership_requests` | `(league_night_instance_id, requester_id)` | — |
| `confirmed_partnerships` | `(league_night_instance_id, player1_id, player2_id)` | `WHERE is_active = true` |
| `push_subscriptions` | `endpoint` | — |
| `push_subscriptions` | `(user_id, endpoint)` | — |

### Performance indexes on `matches`
| Index | Column(s) | Condition |
|---|---|---|
| `idx_matches_league_night_instance` | `league_night_instance_id` | — |
| `idx_matches_partnership1` | `partnership1_id` | — |
| `idx_matches_partnership2` | `partnership2_id` | — |
| `idx_matches_court_number` | `court_number` | — |
| `idx_matches_status` | `status` | — |
| `idx_matches_score_status` | `score_status` | `WHERE score_status <> 'none'` |
| `idx_matches_pending_submitted_by` | `pending_submitted_by_partnership_id` | `WHERE IS NOT NULL` |

### Performance indexes on `push_subscriptions`
| Index | Column(s) | Condition |
|---|---|---|
| `idx_push_subscriptions_user_id` | `user_id` | `WHERE is_active = true` |
| `idx_push_subscriptions_last_used` | `last_used_at` | `WHERE is_active = true` |

---

## Row-Level Security (RLS) Policies

### `profiles` (RLS ON)
| Policy | Operation | Rule |
|---|---|---|
| Users can view all profiles | SELECT | `true` (public read) |
| Users can view own profile | SELECT | `auth.uid() = id` |
| Users can view member profiles | SELECT | Same league membership or self |
| Users can insert their own profile | INSERT | `auth.uid() = id` |
| Users can update own profile | UPDATE | `auth.uid() = id` |
| Users can update their own profile | UPDATE | `auth.uid() = id` (duplicate) |

### `leagues` (RLS ON)
| Policy | Operation | Rule |
|---|---|---|
| Anyone can view active leagues | SELECT | `is_active = true` |
| Owners can manage their leagues | ALL | `auth.uid() = owner_id` |

### `league_days` (RLS ON)
| Policy | Operation | Rule |
|---|---|---|
| Anyone can view league days | SELECT | League is active |
| League owners can manage | ALL | `auth.uid() = leagues.owner_id` |

### `league_memberships` (RLS ON)
| Policy | Operation | Rule |
|---|---|---|
| Users can view | SELECT | Own membership or same league member |
| Users can manage | ALL | Own, league owner, or league admin |

### `player_stats` (RLS ON)
| Policy | Operation | Rule |
|---|---|---|
| Users can view | SELECT | Own or same league member |
| Users can manage | ALL | Own, league owner, or league admin |

### `matches` (RLS OFF — policies exist but RLS disabled)
| Policy | Operation | Rule |
|---|---|---|
| Public can view active league matches | SELECT | League is active |
| Players can view matches in their leagues | SELECT | League member |
| Players can update their match scores | UPDATE | Player in partnership1 or partnership2 |
| League owners can manage | ALL | League owner |
| League admins can manage | ALL | Admin role in league |

### `league_night_checkins` (RLS OFF — policies exist)
| Policy | Operation | Rule |
|---|---|---|
| safe_checkins_view | SELECT | Own or league member |
| Users can manage | ALL | Own, league owner, or league admin |

### `partnership_requests` (RLS OFF — policies exist)
| Policy | Operation | Rule |
|---|---|---|
| safe_requests_view | SELECT | Requester, requested, or league member |
| Users can manage | ALL | Requester, requested, or league owner |

### `confirmed_partnerships` (RLS OFF — policies exist)
| Policy | Operation | Rule |
|---|---|---|
| safe_partnerships_view | SELECT | Player in partnership or league member |
| Users can manage | ALL | Player, league owner, or league admin |

### `push_subscriptions` (RLS ON)
| Policy | Operation | Rule |
|---|---|---|
| push_subscriptions_user_policy | ALL | `auth.uid() = user_id` |

---

## Views & Triggers

- **Views:** None
- **Triggers in `public` schema:** None (triggers are on `auth.users` in the `auth` schema via `handle_new_user`)

---

## Observations & Potential Issues

### 1. RLS disabled on 5 tables with existing policies
`league_night_instances`, `league_night_checkins`, `partnership_requests`, `confirmed_partnerships`, and `matches` all have RLS **disabled** but have policies defined. This means the policies are not enforced — all access goes through the backend service key, which bypasses RLS anyway. This is fine if all writes go through the Express backend, but direct Supabase client calls from the frontend would have unrestricted access to these tables.

### 2. Duplicate UPDATE policies on `profiles`
Two identical UPDATE policies exist: "Users can update own profile" and "Users can update their own profile". One can be removed.

### 3. Redundant SELECT policies on `profiles`
Three SELECT policies overlap: "Users can view all profiles" (`true`), "Users can view own profile", and "Users can view member profiles". The `true` policy makes the other two redundant.

### 4. `get_partnerships_with_game_counts` references `full_name`
The RPC joins to `profiles` and selects `p1.full_name` / `p2.full_name`, but the `profiles` table has `first_name` and `last_name` as separate columns with no `full_name` column. This may cause runtime errors unless there's a generated column or the app concatenates at the application layer.

### 5. No `auth` schema triggers visible
The `handle_new_user` trigger fires on `auth.users` but lives in the `auth` schema, so it doesn't appear in the `public` triggers query. It is confirmed to exist via the function definition.

### 6. Two active leagues
Two leagues exist: **Northcliff Eagles** (Northcliff Country Club, since Sep 2025) and **GPC Pickleball** (German Country Club, since Jan 2026), with 245 total memberships across both.
