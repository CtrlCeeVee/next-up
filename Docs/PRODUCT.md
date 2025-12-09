# Product Overview

**Next-Up**: Real-time pickleball league management platform for South African communities.

## What We Built (MVP Complete - 98%)

### Core Features ✅

**Authentication & Profiles**
- Email/password signup via Supabase Auth
- Profile management (name, skill level, avatar)
- Username-based routing

**League Management**
- Browse and join leagues
- Membership system with player/admin roles
- League schedules (Monday & Wednesday recurring)
- Statistics tracking per league

**League Night Flow**
1. Players check in for tonight's games
2. Send partnership requests to other players
3. Accept/reject requests to form doubles teams
4. Admin starts league night (changes status from `scheduled` to `active`)
5. System auto-assigns matches to available courts
6. Players submit scores (validated: first to 15, win by 2)
7. When match finishes, system auto-creates new matches from queue
8. Repeat until league night ends

**Real-time Updates** (Zero Manual Refresh)
- Check-in/check-out status syncs instantly
- Partnership requests appear immediately
- Match assignments update across all browsers
- Score submissions trigger immediate queue updates

**Smart Match Assignment**
- Priority queue: partnerships with fewer games tonight go first
- Avoid repeat pairings when possible
- New partnerships inherit current minimum games count (fairness)
- Court utilization: creates matches only for available courts

**Statistics Tracking**
- Games played, won, lost
- Total points and average per game
- Persistent across all league nights
- Per-league tracking

### Current Pages

**Public**:
- Landing page
- About, Contact, Privacy, Terms
- League list & league details
- Leaderboard (top players per league)

**Authenticated**:
- League night page (main gameplay interface)
- Profile page (stats, history)
- League membership & stats

## User Flows

### Player Experience

1. **Sign up & join league**
   - Create account with email/password
   - Browse leagues → Join Northcliff Eagles
   - View league schedule and stats

2. **Play league night**
   - Navigate to league → Click tonight's league night
   - Check in (status updates in real-time for everyone)
   - Send partnership request to another player
   - Partner accepts → Both marked as "Paired"
   - Admin starts league → System creates initial matches
   - Assigned to Court 3 vs another partnership
   - Play game, enter score (15-13)
   - Submit score → Stats update, court freed
   - System auto-assigns next match from queue
   - Repeat until league ends

3. **Track performance**
   - View stats on profile page
   - See leaderboard ranking
   - Review game history

### Admin Experience

1. **Manage league night**
   - See all checked-in players in real-time
   - Monitor partnership formation
   - Click "Start League Night" when ready
   - System creates initial matches automatically
   - Watch queue and court utilization
   - Override scores if needed
   - Create temporary accounts for players without phones
   - Check in/out players and manage partnerships directly

2. **League administration**
   - Manage league members
   - View league-wide statistics
   - Configure court availability

## Validation Rules

### Pickleball Scoring
- First to 15 points wins
- Must win by at least 2 points
- If opponent has 13+ points, must win by exactly 2
- No ties allowed

### Partnership Rules
- Cannot partner with yourself
- One active partnership per player per league night
- Can change partners between games (remove & recreate)
- Historical partnerships preserved for analytics

### Match Assignment Rules
- Need minimum 2 partnerships (4 players)
- Court availability limits simultaneous matches
- Partnerships currently playing excluded from queue
- Queue sorted by games played tonight (fairness)

## Known Gaps & Next Priorities

### Remaining MVP Work

1. **Email integration**:
   - Contact form exists but not functional
   - Need EmailJS or similar service

2. **Time-gated score confirmation**:
   - Scores auto-confirm after timeout to prevent stuck courts

### UX Improvements Needed (Post-Demo Feedback)

1. **Navigation flow**: Too many clicks to reach league night check-in
   - Current: Home → League list → League page → Scroll → League night
   - Desired: Faster path to primary use case

2. **Design polish**:
   - Logo needs improvement
   - Leaderboard emoji/medal display

### Future Features (Post-MVP)

**Admin Features**:
- Auto-assign solo players to teams
- Queue position notifications
- Opponent selection by mutual agreement
- Advanced stats dashboards with analytics
- Dependent accounts (parents checking in kids)

**League Features**:
- Skill-based balancing (ELO system)
- Real-time queue numbering
- Tournament seeding from historical stats

## Target Users

**Primary**: Pickleball league organizers in South Africa
- Manage weekly league nights
- 20-50 players per league
- 2-8 courts available per night
- Need real-time coordination during games

**Secondary**: League players
- Show up, check in, play
- Want fair match assignments
- Track performance over time
- Minimal friction during gameplay

## Success Metrics

**Live Demo Results** (Nov 19, 2025):
- ✅ Real-time updates worked flawlessly
- ✅ Partnership flow smooth and intuitive
- ✅ Auto-assignment created matches correctly
- ✅ Zero manual refreshes needed
- ⚠️ Navigation flow needs simplification

**Current Status**: Production-ready for beta testing with real leagues
