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
- **Authentication**: Email-based auth with Supabase
- **League Management**: Browse, join, and manage leagues  
- **League Nights**: Dedicated pages for each league session
- **Check-in System**: Players can mark attendance for league nights
- **Partnership Formation**: Doubles partner selection system
- **Database**: Complete schema with 9 tables including league nights
- **API Infrastructure**: 12+ RESTful endpoints for all operations

**🚧 In Progress**  
- **Frontend Integration**: Connecting UI to real database APIs
- **Real-time Updates**: Live check-in and partnership status

**📋 Next Priority**
- **Match Assignment**: Automatic game pairing based on partnerships
- **Score Submission**: Teams submit and confirm match results
- **Player Statistics**: Win/loss tracking and leaderboards
- **Admin Controls**: League management and override capabilities

**🏆 MVP Status**: ~70% Complete - Core league night functionality ready for testing

## 🤝 Contributing

1. Read the documentation in `Docs/`
2. Run the setup scripts to get started
3. Follow the development guidelines in `Technical_Overview.md`
4. Submit pull requests with clear descriptions

## 📞 Support

For league organizers interested in using Next-Up, contact us at [email].

---

*Built with ❤️ for South African pickleball communities*