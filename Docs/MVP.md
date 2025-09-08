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

* Data flow:

  1. Player marks attendance → system evaluates available matches & courts → assigns match → players complete match → upload scores → update stats → get new match → repeat till league night finished → end + get summary.
  2. Admin overrides intervene in real time as needed.

---

## Technical Implementation

For technical details, development setup, and architecture information, see:
- **[Technical Overview](Technical_Overview.md)** - Complete technical documentation
- **[Project README](../README.md)** - Quick start guide
