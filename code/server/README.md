# 🚀 Next-Up Backend

**Express.js API server for the Next-Up pickleball league management system.**

Provides RESTful APIs for league management, player check-ins, partnerships, and future match assignment features.

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Start development server with auto-restart
npm run dev

# Start production server
npm start
```

## 🛠 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Supabase** - PostgreSQL database with Row Level Security
- **CORS** - Cross-origin resource sharing middleware
- **dotenv** - Environment variable management

## 📡 API Endpoints

### League Management
- `GET /api/leagues` - Get all active leagues with member counts
- `GET /api/leagues/:id` - Get specific league details
- `GET /api/leagues/:id/members` - Get league members
- `GET /api/leagues/:id/top-players` - Get top players for league
- `GET /api/leagues/:id/membership` - Check user membership status
- `POST /api/leagues/:id/join` - Join a league

### League Night Operations
- `GET /api/leagues/:leagueId/nights/:nightId` - Get league night details
- `GET /api/leagues/:leagueId/nights/:nightId/checkins` - Get checked-in players
- `POST /api/leagues/:leagueId/nights/:nightId/checkin` - Check in player
- `DELETE /api/leagues/:leagueId/nights/:nightId/checkin` - Check out player

### Partnership System
- `POST /api/leagues/:leagueId/nights/:nightId/partnership-request` - Send partnership request
- `POST /api/leagues/:leagueId/nights/:nightId/partnership-accept` - Accept partnership request
- `POST /api/leagues/:leagueId/nights/:nightId/partnership-reject` - Reject partnership request
- `GET /api/leagues/:leagueId/nights/:nightId/partnership-requests` - Get partnership requests
- `DELETE /api/leagues/:leagueId/nights/:nightId/partnership` - Remove partnership

### Match Assignment System
- `GET /api/leagues/:leagueId/nights/:nightId/matches` - Get all matches for league night
- `POST /api/leagues/:leagueId/nights/:nightId/create-matches` - Create matches from available partnerships
- `POST /api/leagues/:leagueId/nights/:nightId/submit-score` - Submit match score

### System
- `GET /` - Server information
- `GET /health` - Health check endpoint

## 🗄 Database Schema

The backend connects to a Supabase PostgreSQL database with 10 core tables:

- **profiles** - User information extending Supabase Auth
- **leagues** - League information and ownership
- **league_days** - League schedule templates
- **league_memberships** - Player participation in leagues
- **league_night_instances** - Specific league night occurrences
- **league_night_checkins** - Player attendance tracking
- **partnership_requests** - Partnership request/accept flow
- **confirmed_partnerships** - Active doubles partnerships
- **matches** - Individual games between partnerships with scoring
- **player_stats** - Performance statistics per league

## 🔧 Environment Variables

Create `.env` file with:

```env
# Server Configuration
PORT=3001

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

## 📁 Project Structure

```
src/
├── controllers/         # Business logic and request handlers
│   └── leagueNightController.js  # League night operations
├── routes/             # API route definitions
│   ├── leagues.js      # League management routes
│   └── leagueNights.js # League night routes
└── middleware/         # Express middleware (future)
```

## 🔍 Key Features

- **Automatic League Night Creation** - Creates league night instances from templates
- **Robust Partnership System** - Complete request/accept flow with conflict resolution
- **Error Handling** - Comprehensive error handling and data validation
- **Database Constraints** - Proper handling of unique constraints and data integrity
- **Real-time Ready** - Structured for future real-time features

## 🚧 Development Notes

- All database operations use Supabase client with service key
- Row Level Security (RLS) policies handle user authorization
- League nights are created dynamically based on league schedule templates
- Partnership system prevents duplicate partnerships and handles edge cases
- Check-in system supports reactivation of previous check-ins

## 🔗 Related

- **Frontend**: `../client/` - React TypeScript frontend
- **Database**: Supabase PostgreSQL with Row Level Security
- **Documentation**: `../../Docs/` - Project specifications and schemas

---

*Built with ❤️ for South African pickleball communities*