# Next-Up Roadmap

Audit completed 2026-03-15. Core league night flow is solid. Priorities identified and confirmed.

**Approach:** One focused deliverable at a time. Deliver, test to completion, mark done, move on.

---

## Deliverable 1: Weighted Matchmaking Algorithm

**Status:** Not started

### Problem
[matchController.js:195-201](code/server/src/controllers/matchController.js#L195-L201) — Partnerships sorted by games played, then randomly shuffled. The `avg_skill_level` (Beginner/Intermediate/Advanced) is computed but never used in pairing. Result: consistently unfair matches with large skill gaps. This is the #1 user complaint.

### Rating Metric: Average Points Per Game

**Why `average_points` from `player_stats` is the right metric:**
- Performance-based and self-correcting — not a static self-reported label
- Captures skill nuance: losing 13-15 shows you're competitive; losing 3-15 shows a clear gap
- Already tracked and updated on every score confirmation
- No new data structures needed

**Self-reported skill_level (Beginner/Intermediate/Advanced) is NOT used in calculations.** Keep it in UI for user profile display only.

### Algorithm

**Step 1 — Compute partnership rating:**
```
For each player in the partnership:
  if player has >= 5 games in player_stats:
    player_rating = player_stats.average_points   (typically 4-14 range)
  else:
    player_rating = 8.0   (neutral default — mid-range placement until enough data)

partnership_rating = (player1_rating + player2_rating) / 2
```

**Step 2 — Pair by proximity (replacing random shuffle):**
```
1. KEEP: sort by effective_games ASC (games-played fairness preserved)
2. CHANGE: within same game-count tier, sort by partnership_rating
3. CHANGE: pair ADJACENT partnerships in the sorted list (closest ratings play each other)
4. ADD: tiered variance for controlled unpredictability
   - 80% — pair adjacent (closest skill, competitive match)
   - 15% — skip 1 position (moderate stretch, growth opportunity)
   -  5% — skip 2 positions (big stretch / "upset" match, rare but exciting)
5. KEEP: avoid repeat opponents; allow repeats only when everyone has played everyone
```

**Step 3 — Existing logic preserved as-is:**
- Games-played fairness (fewest games = highest priority to play next)
- Late joiner adjustment (new partnerships get minimum games count)
- Repeat opponent avoidance
- Court assignment via `get_available_courts` RPC
- Push notification triggers after match creation

### Example
Given 6 partnerships waiting (all with same games played tonight):
```
Partnership A: avg_points 12.5 + 11.0 → rating 11.75
Partnership B: avg_points 13.0 + 12.0 → rating 12.50
Partnership C: avg_points  7.0 +  6.5 → rating  6.75
Partnership D: avg_points  8.0 +  9.0 → rating  8.50
Partnership E: avg_points  5.0 +  4.5 → rating  4.75
Partnership F: avg_points 10.0 + 11.0 → rating 10.50

Sorted: E(4.75), C(6.75), D(8.50), F(10.50), A(11.75), B(12.50)

Pairings (adjacent): E vs C, D vs F, A vs B
Rating gaps: 2.0, 2.0, 0.75 — all competitive matches
```

Old algorithm would have randomly paired these, risking E(4.75) vs B(12.50) — a 7.75 gap blowout.

### Files to Modify
- `code/server/src/controllers/matchController.js` — `tryAutoAssignMatches()` (lines 14-352):
  - After fetching partnerships, query `player_stats` for all player IDs in the available partnerships
  - Compute `player_rating` per player (avg_points if >= 5 games, else 8.0)
  - Compute `partnership_rating` = average of both player ratings
  - Replace `Math.random() - 0.5` sort (line 200) with `partnership_rating` sort
  - Modify pairing loop (lines 221-258): pair adjacent instead of first-available, add 20% skip variance

### Verification
- Query `player_stats` via Supabase MCP for actual avg_points distribution
- Dry-run algorithm mentally with real data to confirm pairings are reasonable
- Verify games-played fairness still works (fewest games = plays next)
- Manual test on next league night — observe whether blowouts are reduced

---

## Deliverable 2: Leaderboard System

**Status:** Not started

### Problem
- `code/client/src/pages/LeaderboardPage.tsx` — shows "Coming Soon", completely stubbed
- `code/server/src/controllers/leagueController.js:136` — `getLeagueTopPlayers` ranks by `average_points` with no minimum games filter. A player with 1 game and 15 avg points outranks a player with 30 games and 12 avg points.

### Solution: Multi-Category Leaderboards

**Categories:**
1. **Overall Ranking** — Composite: 50% win rate + 30% avg points + 20% games played (normalized). Min 5 games.
2. **Most Games Played** — Pure dedication. No minimum.
3. **Highest Win Rate** — Min 5 games to qualify.
4. **Highest Avg Score** — Min 5 games to qualify.
5. **Longest Win Streak** — Requires computing from match history.

**Per-league scope** with league selector for multi-league players.

### Backend Changes
- Fix `getLeagueTopPlayers`: add `games_played >= 5` filter, use composite ranking
- New endpoint: `GET /api/leagues/:id/leaderboard?category=overall|games|winrate|points|streak`
- Streak computation: query matches by player, walk completed matches chronologically

### Frontend Changes
- Replace "Coming Soon" in LeaderboardPage with full implementation
- Tab/chip selector for categories
- Ranking table: Position, Name, Key Stat, Games Played
- Top 3 highlight cards
- League selector dropdown
- "Play X more games to qualify" for players under threshold

### Files to Modify
- `code/server/src/controllers/leagueController.js` — fix `getLeagueTopPlayers`, add leaderboard endpoint
- `code/client/src/pages/LeaderboardPage.tsx` — full rebuild
- `code/client/src/hooks/usePlayerStats.ts` — fix streak TODO (line 99)
- Potentially new `code/client/src/hooks/useLeaderboard.ts` hook

### Verification
- Confirm 1-game players don't appear on min-5 leaderboards
- Verify each category sorts correctly
- Check leaderboard reflects latest league night results

---

## Deliverable 3: Queue Visibility

**Status:** Not started

### Problem
Players can't see queue position. "Are we next?" is the most common question at league nights. The system is fair (everyone plays same number of games) but players can't see this.

### Solution
In MyNightTab, when player has partnership but no active match, show:
- **Queue position:** "You are #X in queue"
- **Games context:** "You've played X games tonight"
- **Court status:** "X courts active, Y partnerships waiting"

### Files to Modify
- `code/client/src/components/league-night-tabs/MyNightTab.tsx` — add queue position card when waiting
- `code/server/src/controllers/matchController.js` — enhance `getQueue` endpoint with position data

---

## Future: A/B League Tiers

Natural extension after matchmaking rating is proven stable:
- Split players into tiers based on `average_points` on check-in
- Auto-assign only within same tier
- Promotion: top performers from B move to A next week
- Demotion: bottom performers from A move to B next week
- Separate planning needed — depends on avg_points-based matchmaking being tested and confirmed

---

## Known Technical Debt (Low Priority)

| Item | Severity | File |
|------|----------|------|
| `get_partnerships_with_game_counts` RPC broken (`full_name` doesn't exist) | Low (unused) | Supabase SQL |
| Duplicate UPDATE policy on `profiles` | Cosmetic | Supabase dashboard |
| Redundant SELECT policies on `profiles` (`true` makes others pointless) | Cosmetic | Supabase dashboard |
| Unused `@clerk` dependency | Cosmetic | `code/client/package.json` |
| Deprecated `useRealtime.ts` (superseded by `useLeagueNightRealtime`) | Low | `code/client/src/hooks/useRealtime.ts` |
| Streak calculation hardcoded to 0 | Medium | `code/client/src/hooks/usePlayerStats.ts:99` |
