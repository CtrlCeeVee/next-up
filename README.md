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
- **Database**: Full schema with 9 tables, RLS policies, and unique constraints
- **API Infrastructure**: 15+ RESTful endpoints covering all league night operations
- **Error Handling**: Comprehensive error handling and duplicate prevention
- **Frontend Integration**: React UI fully connected to live database APIs

**🚧 Recently Completed**  
- **Partnership Bug Fixes**: Resolved duplicate key constraint issues
- **Check-in Flow**: Fixed sign-out/sign-in edge cases
- **Real-time Updates**: Live partnership and check-in status updates
- **UI Polish**: Improved button states and user feedback

**📋 Next Priority**
- **Match Assignment**: Automatic game pairing based on confirmed partnerships
- **Score Submission**: Teams submit and confirm match results
- **Player Statistics**: Win/loss tracking and leaderboards
- **Admin Controls**: League management and override capabilities

**🏆 MVP Status**: ~85% Complete - Core league night functionality fully operational and tested

## 🤝 Contributing

1. Read the documentation in `Docs/`
2. Run the setup scripts to get started
3. Follow the development guidelines in `Technical_Overview.md`
4. Submit pull requests with clear descriptions

## 📞 Support

For league organizers interested in using Next-Up, contact us at [email].

---

*Built with ❤️ for South African pickleball communities*