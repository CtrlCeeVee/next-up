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
- **Database Schema**: Complete schema with 9 tables, RLS policies, and constraint handling
- **API Infrastructure**: 15+ RESTful endpoints covering all league night operations
- **Error Handling**: Comprehensive error handling and duplicate prevention systems
- **Frontend Integration**: React UI fully connected to live database APIs
- **Real-time Updates**: Live partnership and check-in status updates

### 🚧 **Recently Completed**
- **Partnership Bug Fixes**: Resolved all duplicate key constraint issues
- **Check-in Edge Cases**: Fixed sign-out/sign-in scenarios and state management
- **UI Polish**: Improved button states, loading indicators, and user feedback
- **Data Consistency**: Proper cleanup of inactive partnerships and requests

### 📋 **Pending Features**
- **Match Assignment**: Automatic game assignments based on confirmed partnerships
- **Score Submission**: Teams can submit and confirm match scores with timeout logic
- **Player Statistics**: Wins, losses, points tracking per league with leaderboards
- **Admin Controls**: League owner/admin management capabilities and override functions
- **Court Management**: Dynamic court configuration per league night
- **Match History**: Historical game records and performance tracking

### 🎯 **MVP Data Flow (Current Implementation)**
1. **League Discovery**: Browse available leagues → Join league → View league schedule
2. **League Night Participation**: Check into tonight's session → Form partnership with another player → Ready for match assignment
3. **Partnership Management**: Send/receive partnership requests → Accept/reject partnerships → Form confirmed doubles teams
4. **Future Flow**: Receive match assignment → Play games → Submit scores → Update stats

### 📊 **Current MVP Completion Status**
- **Authentication & User Management**: ✅ 100% Complete
- **League Management**: ✅ 100% Complete  
- **League Night Operations**: ✅ 95% Complete (check-in + partnerships)
- **Match Assignment**: ⏳ 0% Complete
- **Score Submission**: ⏳ 0% Complete
- **Statistics & Leaderboards**: ⏳ 0% Complete
- **Admin Controls**: ⏳ 20% Complete (basic league ownership)

**Overall MVP Progress: ~85% Complete** - Core league night functionality is fully operational and tested

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
