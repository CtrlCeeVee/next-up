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
```

## Core Tables

### **profiles**
Extends Supabase Auth with player information.
```sql
id UUID PRIMARY KEY → auth.users(id)
email TEXT UNIQUE NOT NULL
full_name TEXT
phone TEXT
skill_level TEXT ('Beginner', 'Intermediate', 'Advanced')
created_at, updated_at TIMESTAMPTZ
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

## Relationships

1. **League Ownership**: `leagues.owner_id → profiles.id`
2. **League Schedule**: `league_days.league_id → leagues.id` (one-to-many)
3. **Player Membership**: `league_memberships` links `profiles` and `leagues` (many-to-many)
4. **Performance Tracking**: `player_stats` tracks per-league performance (many-to-many)
5. **League Night Instances**: `league_night_instances.league_id → leagues.id` (one-to-many)
6. **Check-ins**: `league_night_checkins` links players to specific league nights
7. **Partnership Flow**: `partnership_requests → confirmed_partnerships` (request/accept flow)
8. **Match Pool**: Only players in `confirmed_partnerships` are eligible for matches

## League Night Flow

1. **Instance Creation**: League nights auto-created from `league_days` templates when accessed
2. **Player Check-in**: Players check into specific league night instances
3. **Partnership Formation**: 
   - Players can request partnerships with other checked-in players
   - Confirmed partnerships move to `confirmed_partnerships` table
   - Only partnered players enter the match pool
4. **Match Pool**: System uses confirmed partnerships for game assignments

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

## Current Production Data

**Northcliff Eagles** (ID: 1)
- 30 members with realistic stats
- Monday & Wednesday 6:30 PM
- 4 courts at Northcliff Country Club
- Owner: Luke Renton