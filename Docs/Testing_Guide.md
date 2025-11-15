# 🧪 Testing Guide for Next-Up

## Problem Solved
Testing multiplayer features (partnerships, matches, real-time updates) no longer requires managing 10+ different browser accounts.

## Solution: Admin Testing Panel

A **development-only** floating panel that simulates bot players and league night scenarios from your single admin account.

---

## 🎮 How to Use

### 1. Start Development Servers
```bash
# Terminal 1 - Backend
cd code/server
npm run dev

# Terminal 2 - Frontend
cd code/client  
npm run dev
```

### 2. Navigate to a League Night
- Go to any league
- Click on a league night (Monday, Wednesday, etc.)
- **Testing Panel appears in bottom-right corner** (orange box labeled "🧪 Testing Panel")

### 3. Testing Panel Controls

#### **Check In Bot Players**
- Enter number of players (1-20)
- Click "Add"
- **Result**: Actual league members are checked in automatically

#### **Auto-Pair All Players**
- Click "Auto-Pair All Players"
- **Result**: Checked-in players are paired into partnerships (2 at a time)

#### **Complete Random Match**
- Click "Complete Random Match"
- **Result**: First active match is completed with realistic pickleball score (15-11 to 15-13)

#### **Reset League Night**
- Click "Reset League Night"
- Confirms before deleting
- **Result**: All check-ins, partnerships, and matches deleted for clean slate

---

## 📋 Example Test Scenario

### Test Full League Night Flow

1. **Reset** - Start fresh
2. **Check In 8 Bot Players** - Simulates full night attendance
3. **Auto-Pair All Players** - Creates 4 partnerships
4. **Admin: Start League Night** - Activates league
5. **System Auto-Creates Matches** - Based on partnerships and courts
6. **Complete Random Match** - Frees up a court
7. **Observe Real-time Updates** - Verify new match auto-assigned

### Test Real-time Partnership Flow

1. **Reset** - Clean slate
2. **Check In 4 Bot Players** - Minimal test scenario
3. **Manual Partnership Request** - Send request to bot player
4. **Auto-Pair** - Accept the request via bot
5. **Verify Real-time Update** - Partnership appears immediately

---

## 🔒 Security Features

- **Development Only**: Panel only shows when `NODE_ENV=development`
- **Backend Protection**: All `/api/dev/*` endpoints return 403 in production
- **Visual Indicator**: Orange warning border makes it obvious it's for testing

---

## 🛠️ Technical Details

### Frontend Components
- `TestingPanel.tsx` - React component (floating panel)
- `devService.ts` - API calls to dev endpoints

### Backend Endpoints
- `POST /api/dev/simulate-checkins` - Check in league members
- `POST /api/dev/simulate-partnerships` - Auto-pair players
- `POST /api/dev/complete-random-match` - Finish a match with score
- `DELETE /api/dev/reset-league-night/:id` - Clean up test data

### How It Works
Bot players are **real league members** from your database. The panel just automates the actions they would normally do manually (check-in, partner up, play matches).

---

## 🎯 Benefits

**Before**: 
- Need 10 different accounts
- Switch browsers/incognito windows
- Manual sign-in for each
- Tedious partnership requests
- Hard to test real-time features

**After**:
- Single admin account
- Click buttons to simulate players
- Test full scenarios in seconds
- Verify real-time updates instantly
- Reset and repeat easily

---

## 🚀 Future Enhancements

Potential additions:
- [ ] Simulate specific player skill levels
- [ ] Create tournament brackets
- [ ] Generate match history for analytics testing
- [ ] Export/import test scenarios
- [ ] Performance testing with 100+ bot players

---

## ⚠️ Important Notes

1. **Uses Real League Members**: Bot players are actual users from `league_memberships`
2. **Database Changes**: Actions modify real database (that's why reset exists)
3. **Not for Production**: Panel and endpoints completely disabled in production
4. **Testing Only**: This is for development/testing, not a feature for end-users

---

For questions or issues, see [Technical Overview](Technical_Overview.md) or contact the development team.
