# 🏓 Next-Up

**Real-time pickleball league management for South African communities.**

Smart player matching, instant updates, automated match assignment - zero manual refreshes needed.

## 🚀 Quick Start

### Developers

```bash
# Frontend (http://localhost:5173)
cd code/client && npm install && npm run dev

# Backend (http://localhost:3001)  
cd code/server && npm install && npm run dev
```

See [DEVELOPMENT.md](DEVELOPMENT.md) for full setup & conventions.

### Players
Visit `next-up.co.za` → Select your league → Check in → Play!

## 📚 Documentation

- **[PRODUCT.md](PRODUCT.md)** - What we built, user flows, roadmap
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design, database, real-time patterns
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Setup, code conventions, deployment
- **[CHANGELOG.md](CHANGELOG.md)** - Version history

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS (Vite)
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL + Auth + Real-time)
- **Hosting**: Vercel (Frontend) + Render (Backend)

## 🎯 Current Status

**v1.2.1 - UX Polish** (Nov 21, 2025)

**✅ Production Ready**
- Tab-based navigation eliminates clutter when many players checked in
- Search/filter available partners
- Mobile-friendly bottom navigation
- Complete real-time system - zero manual refreshes
- Partnership & match management with auto-assignment
- Smart queue prioritization (fairness + avoid repeat pairings)
- Validated scoring (first to 15, win by 2)
- Profile & stats tracking
- Admin controls for league night management

**🎉 Live Demo Success** (Nov 19, 2025)
- Real-time updates worked flawlessly
- Partnership flow smooth across multiple browsers
- Auto-assignment created matches correctly
- Identified UX improvements implemented in v1.2.1

**📋 Next Priorities**
1. **Auto-assignment on new partnerships** (currently only on league start + score submission)
2. **Score confirmation flow** (opponent confirms submitted scores)
3. **"End League Night" button** with completion status
4. **Email integration** (contact form functionality)
5. **Advanced admin features** (match overrides, no-shows)

**MVP Status**: 98% complete - Ready for real league testing

## 🤝 Contributing

Read the docs in root directory, then start coding:
1. Pick ONE feature from [PRODUCT.md](PRODUCT.md) roadmap
2. Follow patterns in [ARCHITECTURE.md](ARCHITECTURE.md)
3. Check conventions in [DEVELOPMENT.md](DEVELOPMENT.md)
4. Test manually via UI
5. Update relevant docs when adding features

## 📞 Contact

**For league organizers**:
- **Email**: luke.renton@next-up.co.za
- **Phone**: +27 60 728 9497  
- **Location**: Johannesburg, South Africa

---

*Built for South African pickleball communities*