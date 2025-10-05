# 🏓 Next-Up

**The ultimate pickleball league management app for South African communities.**

Next-Up makes local pickleball leagues seamless, dynamic, and fun by providing smart player matching, real-time scoring, and automated league night management.

## 🚀 Quick Start

### For Developers

1. **Setup Frontend**
   ```bash
   cd code/client
   ./client_setup.sh
   npm run dev
   ```

2. **Setup Backend**
   ```bash
   cd code/server
   ./server_setup.sh
   npm run dev
   ```

### For Players
- Visit the app at your league's Next-Up URL
- Select your league
- Check in for tonight's games
- Play and track your progress!

## 📚 Documentation

- **[MVP Specifications](Docs/MVP.md)** - What we're building
- **[User Stories](Docs/User_stories.md)** - How people will use it
- **[Vision & Aims](Docs/Vision_and_aims.md)** - Why we're building it
- **[Technical Overview](Docs/Technical_Overview.md)** - How it's built

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel (Frontend) + Render (Backend)

## 🎯 Current Status

**✅ Core Features Implemented**
- **Authentication**: Email-based auth with Supabase Auth
- **League Management**: Browse, join, and manage leagues with membership system
- **League Nights**: Dynamic league night instances with proper date handling
- **Check-in System**: Robust player check-in/check-out with reactivation support
- **Partnership System**: Complete request/accept flow with partnership management
- **Match Assignment**: Smart court allocation with priority queue system
- **Score Submission**: Validated score entry with pickleball rules (first to 15, win by 2)
- **Player Statistics**: Automatic tracking of games, wins, losses, and points
- **Queue Management**: Smart feedback and court utilization display
- **Database**: Full schema with 10 tables, RLS policies, and constraint handling
- **API Infrastructure**: 18+ RESTful endpoints covering complete league night operations
- **Error Handling**: Comprehensive validation and duplicate prevention systems
- **Frontend Integration**: React UI fully connected to live database APIs

**🚧 Recently Completed (v1.2)**  
- **Real-time System**: Complete WebSocket-based real-time updates across all operations
  - Partnership requests auto-update instantly across browsers
  - Check-in/check-out status syncs in real-time
  - League night status changes propagate immediately
  - No manual refresh needed for any user interactions
- **Partnership Management**: Robust partnership lifecycle with historical data preservation
  - Create, accept, reject, and remove partnerships with full real-time sync
  - Database constraints allow historical data while preventing duplicate active partnerships
  - Clean partnership request cleanup and state management
- **Admin Controls**: League night management system for testing and operations
  - "Start League Night" button for admins to activate scheduled leagues
  - Auto-assignment system runs only when leagues are officially started
  - Proper pre-game vs active-game flow separation
- **Database Schema Improvements**: Enhanced constraint system for data integrity
  - Partial unique constraints on active partnerships only
  - Historical partnership data preserved for analytics
  - Comprehensive RLS policy fixes eliminating infinite recursion issues
- **Production Ready**: Clean codebase with all debug artifacts removed

**📋 Next Priority**
- **Email Integration**: EmailJS setup for functional contact forms  
- **Auto-Assignment**: Continuous match creation as courts become available during active games
- **Advanced Admin Controls**: Match override capabilities and league management tools
- **Tournament Mode**: Round-robin and bracket tournament formats
- **Leaderboard System**: Comprehensive ranking and competition features

**🏆 MVP Status**: 98% Complete - Production-ready pickleball league platform with real-time capabilities

## 🤝 Contributing

1. Read the documentation in `Docs/`
2. Run the setup scripts to get started
3. Follow the development guidelines in `Technical_Overview.md`
4. Submit pull requests with clear descriptions

## 📞 Support

For league organizers interested in using Next-Up:
- **Email**: luke.renton@next-up.co.za
- **Phone**: +27 60 728 9497
- **Location**: Johannesburg, South Africa

Visit our contact page in the app for support hours and additional information.

---

*Built with ❤️ for South African pickleball communities*