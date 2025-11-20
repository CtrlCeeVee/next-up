# 📖 Next-Up Functional Specs (MVP)

## 1. Player Flows

### 1.1 General Flow

1. **App Login / Registration**

   * Players sign up with email/password.
   * Can manage profile (name, avatar, preferred partner, stats visibility).

2. **League Selection**

   * Players choose which league they want to participate in (e.g., Northcliff Eagles).
   * Each league has:

     * Current leaderboard
     * Upcoming league nights
     * Player’s personal stats

3. **League Night Page**

   * Mark attendance (“I’m here”).
   * Select partner (can change per game).
   * Admins configure **number of courts** and their numbers for the night (e.g. we have 2 courts, courts 4 and 7, available for the league on this particular night).
   * System assigns match based on attendance, player skill rating (ELO-inspired), and available courts.

     * Example: `Luke & Matt vs Morgan & Kyla on Court 3`
   * Upload match scores (numeric).
   * Both teams confirm scores; after timeout, system auto-confirms.

4. **Dashboard / Summary Pages**

   * League summary at the end of the day.
   * Player dashboard showing upcoming matches, stats, and historical performance.

---

## 2. Admin/Organizer Flows

### 2.1 Within League Night

* Admins have **extra controls** embedded in the same player interface:

  * Edit match scores.
  * Move players between matches/courts.
  * Mark no-shows or late arrivals.
  * Override automatic match assignments.
  * Configure number of courts and those court numbers.

### 2.2 Admin Dashboard

* Separate view for managing the league overall:

  * Update league dates.
  * Pick type of league day (Point-Based or Tournament, later).
  * View league-wide stats and reports.

---

## 3. Match & Player Logic

### 3.1 Player Matching

* Matches are assigned dynamically based on:

  * Who is present.
  * Player skill rating (ELO-inspired).
  * Partner selection (if applicable).
  * Court availability configured by admins.
* **MVP requirement:** Random assignment is NOT allowed; basic skill-based matching is required.
* Default match format: 2v2.

### 3.2 Score Handling

* Scores entered by teams must be numeric.
* Both teams confirm scores.
* If one team fails to confirm within a timeout (configurable), score is auto-accepted.
* Stats update immediately after score confirmation.

---

## 4. League Data

* Leagues have **persistent player stats**: wins, losses, points, games played.
* League nights have a fixed schedule (e.g., Monday & Wednesday).
* Players can join at any time.
* Stats persist indefinitely for historical tracking and future matchmaking/tournaments.
* Admins can configure the number of courts available per night, which directly affects match assignments.

---

## 5. MVP vs Future Features

| Feature           | MVP                                              | Future                                     |
| ----------------- | ------------------------------------------------ | ------------------------------------------ |
| Partner selection | Manual                                           | Auto-assign for solo players               |
| Match assignment  | Skill-based random, considers court availability | Advanced ELO balancing, tournament seeding |
| Court assignment  | Admin-configured                                 | Automatic optimization for fairness & flow |
| Notifications     | None                                             | Queue notifications, push updates          |
| Tournament Mode   | No                                               | Round robin, knockout formats              |
| Admin Controls    | Edit scores, override matches, configure courts  | Advanced analytics dashboards              |
| Stats             | Wins, losses, points, games played               | Heatmaps, trends, cross-league stats       |

---

## 6. Current Implementation Status

### ✅ **Completed Features**
- **User Authentication**: Email-based authentication with Supabase Auth
- **League Management**: Create, view, and join leagues with full membership system
- **League Membership**: Join/leave functionality with role management and member viewing
- **Browse-First UX**: Users can view leagues before authenticating
- **League Night Instances**: Dynamic creation of league nights from templates
- **League Night Check-in**: Robust player check-in/check-out with reactivation support
- **Partnership System**: Complete request/accept/reject flow with partnership management
- **Match Assignment**: Smart court allocation with priority queue for partnerships
- **Score Submission**: Validated score entry with proper pickleball rules (first to 15, win by 2)
- **Player Statistics**: Automatic tracking of games played, wins, losses, and points scored
- **Queue Management**: Smart feedback when courts are full with detailed status display
- **Database Schema**: Complete schema with 10 tables, RLS policies, and constraint handling
- **API Infrastructure**: 18+ RESTful endpoints covering complete league night operations
- **Error Handling**: Comprehensive error handling and duplicate prevention systems
- **Frontend Integration**: React UI fully connected to live database APIs
- **Real-time Updates**: Live partnership, match, and score status updates

### 🚧 **Recently Completed (September 19, 2025)**
- **Match Assignment Algorithm**: Priority-based partnership matching with court allocation
- **Score Validation System**: Client and server-side validation of pickleball scoring rules
- **Player Statistics Engine**: Automatic calculation of wins, losses, games played, and average points
- **Queue System Implementation**: Smart court management with wait status and availability feedback
- **Code Architecture**: Modular controller design for better maintainability
- **Database Functions**: Optimized partnership and court availability functions

### 📋 **Next Development Phase**
- **Auto-Assignment**: Automatic match creation when partnerships form or courts become available
- **Real-time Notifications**: Push updates for match assignments and game completions
- **Advanced Admin Controls**: League owner/admin management capabilities and match overrides
- **Tournament Mode**: Round-robin and bracket tournament formats
- **Advanced Statistics**: Historical performance tracking and leaderboards
- **Mobile Optimization**: PWA features and mobile-specific UI improvements

### 🎯 **MVP Data Flow (Current Implementation)**
1. **League Discovery**: Browse available leagues → Join league → View league schedule
2. **League Night Participation**: Check into tonight's session → Form partnership with another player
3. **Match Assignment**: System creates matches based on partnerships and court availability → Displays queue status when courts full
4. **Game Play**: Players receive match assignment → Play game → Submit validated scores
5. **Statistics Update**: System automatically updates player statistics → Court becomes available for next match
6. **Continuous Cycle**: New partnerships can immediately get matches or join queue

### 📊 **Current MVP Completion Status**
- **Authentication & User Management**: ✅ 100% Complete
- **League Management**: ✅ 100% Complete  
- **League Night Operations**: ✅ 100% Complete (check-in + partnerships + matches)
- **Match Assignment**: ✅ 95% Complete (manual trigger, queue system operational)
- **Score Submission**: ✅ 100% Complete (validation + statistics)
- **Statistics & Tracking**: ✅ 100% Complete (player stats + game history)
- **Admin Controls**: ⏳ 30% Complete (basic league ownership + match creation)

**Overall MVP Progress: ~92% Complete** - Full league night management system with statistics tracking operational and tested

---

## 7. Technical Foundation

- **Database**: 9 tables including league nights, check-ins, partnerships
- **Backend**: Express.js with 12+ API endpoints
- **Frontend**: React with TypeScript, real-time league night interface
- **Authentication**: Supabase Auth with row-level security
- **Infrastructure**: Ready for production deployment

---

* Data flow:

  1. Player marks attendance → system evaluates available matches & courts → assigns match → players complete match → upload scores → update stats → get new match → repeat till league night finished → end + get summary.
  2. Admin overrides intervene in real time as needed.

---

## Technical Implementation

For technical details, development setup, and architecture information, see:
- **[Technical Overview](Technical_Overview.md)** - Complete technical documentation
- **[Project README](../README.md)** - Quick start guide
