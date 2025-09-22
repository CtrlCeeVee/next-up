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

**🚧 Recently Completed**  
- **Match Assignment System**: Complete court allocation with partnership priority queuing
- **Score Validation**: Proper pickleball scoring rules with real-time validation
- **Player Statistics**: Automatic win/loss tracking and points accumulation
- **Queue System**: Smart feedback when courts are full with detailed status
- **Code Modularization**: Separated controllers for better maintainability

**📋 Next Priority**
- **Auto-Assignment**: Automatic match creation when partnerships form or courts free up
- **Advanced Admin Controls**: League management and match override capabilities
- **Real-time Notifications**: Push updates for match assignments and score submissions
- **Tournament Mode**: Round-robin and bracket tournament formats

**🏆 MVP Status**: ~92% Complete - Full league night management system operational with statistics tracking

## 🤝 Contributing

1. Read the documentation in `Docs/`
2. Run the setup scripts to get started
3. Follow the development guidelines in `Technical_Overview.md`
4. Submit pull requests with clear descriptions

## 📞 Support

For league organizers interested in using Next-Up, contact us at [email].

---

*Built with ❤️ for South African pickleball communities*