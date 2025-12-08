# 📝 Next-Up Changelog

## Version 1.2.2 - Players Without Phones Support (December 2025)

### Admin Features

**Temporary Account Creation**
- Admins can create accounts for players without phones from Admin tab
- Auto-generates unique email (`temp-{timestamp}-{random}@next-up.local`)
- Auto-generates secure 12-character random password
- Automatically adds user to league membership with initial stats
- Password displayed once with copy button and warning to write down
- Admin can immediately check in and partner temp account users

**Implementation Details**
- New endpoint: `POST /api/leagues/:leagueId/nights/:nightId/admin/create-temp-account`
- Requires: first name, last name, skill level
- Creates full user account via Supabase Auth Admin API
- Profile auto-created by database trigger
- League membership and player stats initialized
- Username collision handling (appends `-1`, `-2`, etc.)

### Bug Fixes
- **Override match score error**: Fixed missing `league_id` in match query - added `league_night_instance` join
- **Temp account creation**: Handle database trigger auto-creating profiles to prevent duplicate key errors

---

## Version 1.2.1 - UX Polish (November 2025)

### UI/UX Improvements

**Tab-based Navigation**
- Implemented bottom navigation with 4 tabs: My Night, Matches, League Info, Admin
- Reduced LeagueNightPage from 944 to 614 lines (35% code reduction)
- Mobile-friendly tab system eliminates clutter when many players checked in
- Badge notification on "My Night" tab for incoming partnership requests

**My Night Tab Enhancements**
- Search bar for filtering available partners by name or skill level
- Redesigned accept/decline buttons - compact single-line layout
- Contextual help text: "You're checked in! Find a partner to get started!"
- Removed redundant quick stats cards (Expected/Planned/Winners)
- **Current match display with live score submission** - see your active match and submit scores directly from My Night tab
- Real-time match updates when assigned to court

**Component Organization**
- Created 5 focused tab components replacing monolithic page structure
- Preserved all real-time functionality and existing handlers
- Improved maintainability with clear separation of concerns

### Bug Fixes
- Fixed MatchQueue component receiving incorrect props (leagueNightInstanceId instead of leagueId/nightId)
- Resolved "Failed to fetch queue information" errors on Matches tab
- **Auto-assignment now triggers when partnerships are confirmed** - courts fill immediately when partnerships form (not just on league start or score submission)
- **Auto-assignment triggers from admin "Start League Night" button** - fixed duplicate require causing silent failure
- **Auto-assignment triggers from testing panel "Auto-Pair All Players"** - dev tool now creates matches immediately
- Fixed UI showing "League Night Not Started" when league is active but no matches assigned yet - now shows "Waiting for Partnerships"
- **League night status properly syncs to UI** - real-time updates reflect when admin starts the league
- **Fixed infinite request loop** - eliminated useEffect dependency chains causing 1000+ API requests per minute; now only fetches on genuine data changes

---

## Version 1.2.0 - Real-time Revolution (October 2025)

### 🚀 Major Features

#### **Complete Real-time System Implementation**
- **WebSocket Architecture**: Implemented comprehensive Supabase real-time subscriptions
- **Zero Refresh Needed**: All user interactions now update instantly across browsers
- **Single Channel Strategy**: Optimized connection management prevents subscription churn
- **Stable Callback System**: Prevents infinite re-renders with proper useCallback dependencies

#### **Enhanced Partnership Management** 
- **Full Lifecycle Support**: Create, accept, reject, remove partnerships with real-time sync
- **Historical Data Preservation**: Database constraints allow multiple partnerships per player while maintaining data integrity
- **Constraint Improvements**: Partial unique indexes on active partnerships only
- **Clean State Management**: Proper cleanup of stale requests and partnerships

#### **Admin Controls & Game Flow**
- **League Night Management**: "Start League Night" admin button for controlled game activation  
- **Proper Game Phases**: Clear separation between check-in period and active gameplay
- **Auto-assignment Timing**: Match creation only occurs when league is officially started
- **Production Ready**: All debug artifacts removed, clean logging

### 🔧 Technical Improvements

#### **Database Schema Enhancements**
```sql
-- New partial unique constraint allows historical data
CREATE UNIQUE INDEX confirmed_partnerships_active_unique 
ON confirmed_partnerships (league_night_instance_id, LEAST(player1_id, player2_id), GREATEST(player1_id, player2_id)) 
WHERE is_active = true;
```

#### **Real-time Hook Architecture**
```typescript
// Single comprehensive hook replaces multiple individual subscriptions
const useLeagueNightRealtime = (instanceId, userId, callbacks) => {
  // Manages 5 table subscriptions on single WebSocket channel
  // Prevents subscription churn with stable callback references
  // Includes connection status tracking and cleanup
}
```

#### **API Improvements**
- **Enhanced Endpoints**: `getPartnershipRequests` now returns both requests and confirmed partnerships
- **Unified Responses**: Single API call provides complete partnership state
- **Error Handling**: Removed undefined variable references, proper error propagation
- **Constraint Handling**: Automatic cleanup of conflicting records

### 🐛 Bug Fixes

#### **Partnership Issues Resolved**
- **Unique Constraint Violations**: Fixed duplicate key errors when recreating partnerships  
- **Incomplete UI Updates**: Partnership removals now update both cards and "Paired" status
- **Auto-assignment Timing**: Removed premature match creation during check-in phase
- **State Synchronization**: Real-time updates now refresh all dependent UI components

#### **Database Policy Fixes**
- **RLS Infinite Recursion**: Eliminated infinite loops in Row Level Security policies
- **Constraint Conflicts**: Resolved multiple unique constraint issues on partnership tables
- **Data Integrity**: Proper cleanup prevents orphaned records and constraint violations

### 🎯 User Experience Improvements

#### **Seamless Interactions**
- **Partnership Flow**: Send request → Accept → Both players see partnership instantly
- **Check-in Status**: Check-in/out updates immediately across all browsers
- **League Status**: Admin actions propagate instantly to all participants  
- **Error Reduction**: Users no longer encounter constraint errors when managing partnerships

#### **Admin Experience**
- **Controlled Activation**: Admins can start leagues on-demand for testing and official games
- **Clear Game States**: Visual distinction between scheduled and active league nights
- **Live Monitoring**: Real-time visibility into all player interactions

### 🔒 Security & Performance

#### **Row Level Security**
- **Policy Optimization**: Simplified policies eliminate infinite recursion while maintaining security
- **Real-time Integration**: RLS works seamlessly with WebSocket subscriptions
- **User Context**: Proper auth.uid() usage ensures users only see authorized data

#### **Performance Optimizations**  
- **Single Channel Strategy**: Reduced WebSocket connections per user
- **Selective Updates**: Only refresh components that actually changed
- **Efficient Queries**: Database queries optimized for real-time subscription filters
- **Memory Management**: Proper cleanup prevents memory leaks in long-running sessions

### 📊 Development Improvements

#### **Code Quality**
- **Production Ready**: All debugging code removed, clean console logs
- **Type Safety**: Enhanced TypeScript interfaces for new partnership data structures
- **Error Boundaries**: Comprehensive error handling throughout the real-time system
- **Documentation**: Complete technical documentation of real-time architecture

#### **Testing & Reliability**
- **Multi-browser Testing**: Verified real-time updates work across different browsers/devices
- **Constraint Testing**: Validated database constraints handle all edge cases
- **Admin Flow Testing**: Confirmed admin controls work correctly for league management
- **Performance Testing**: Verified system handles multiple concurrent users

### 🎉 Impact

**Before v1.2:**
- Manual refresh required for all interactions
- Partnership conflicts and constraint errors  
- Premature auto-assignment during check-in
- Incomplete UI updates across browsers

**After v1.2:**
- ✅ Zero manual refreshes needed
- ✅ Seamless partnership management with historical data
- ✅ Proper game flow with admin controls
- ✅ Instant synchronization across all devices
- ✅ Production-ready stability

### 🔄 Migration Notes

**Database Changes Required:**
```sql
-- Remove old constraints and add new partial unique index
ALTER TABLE confirmed_partnerships 
DROP CONSTRAINT IF EXISTS confirmed_partnerships_league_night_instance_id_player1_id_key;
ALTER TABLE confirmed_partnerships 
DROP CONSTRAINT IF EXISTS confirmed_partnerships_league_night_instance_id_player2_id_key;

CREATE UNIQUE INDEX confirmed_partnerships_active_unique 
ON confirmed_partnerships (league_night_instance_id, LEAST(player1_id, player2_id), GREATEST(player1_id, player2_id)) 
WHERE is_active = true;
```

**Frontend Changes:**
- New TypeScript interfaces for partnership data structures
- Updated API calls to handle new response formats  
- Enhanced real-time hook replaces individual subscription hooks

---

## Version 1.1.0 - Enhanced User Experience (September 2025)

### 🎨 User Interface Improvements
- **Profile System**: Complete player profiles with username-based routing
- **Statistics Dashboard**: Comprehensive stats tracking and league analytics  
- **Design Enhancements**: Glass-morphism effects and improved visual consistency
- **Theme System**: Dark/light mode support across all pages
- **Navigation**: Functional Quick Actions with seamless page linking

### 📄 Content & Pages
- **Professional Pages**: About, Contact, Privacy, Terms pages
- **Contact Integration**: Real contact information with form infrastructure
- **Content Strategy**: Professional presentation for league organizers

### ⚡ Performance
- **Skeleton Loading**: Improved perceived performance with loading states
- **Code Organization**: Better component structure and reusability

---

## Version 1.0.0 - MVP Foundation (August 2025)

### 🏗️ Core Infrastructure
- **Authentication System**: Supabase Auth with email-based authentication
- **Database Schema**: Complete 10-table schema with RLS policies
- **API Infrastructure**: 18+ RESTful endpoints for league operations
- **Frontend Framework**: React + TypeScript + Tailwind CSS

### 🏓 League Management  
- **League System**: Browse, join, and manage leagues with membership roles
- **League Nights**: Dynamic league night instances with proper date handling
- **Player Management**: Check-in/check-out system with reactivation support

### 🤝 Partnership & Match System
- **Partnership Management**: Request/accept flow for doubles partnerships
- **Match Assignment**: Smart court allocation with priority queue system
- **Score Submission**: Validated scoring with pickleball rules (first to 15, win by 2)
- **Statistics Tracking**: Automatic games, wins, losses, and points tracking

### 🎯 Game Features
- **Queue Management**: Smart feedback and court utilization display
- **Error Handling**: Comprehensive validation and duplicate prevention
- **Database Integration**: Full frontend-to-database connectivity

---

*View the complete project status and roadmap in [README.md](../README.md)*