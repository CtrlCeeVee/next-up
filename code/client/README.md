# 🏓 Next-Up Frontend

**React + TypeScript frontend for the Next-Up pickleball league management system.**

Built with Vite for lightning-fast development and optimized production builds.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠 Tech Stack

- **React 18** - Latest React with concurrent features
- **TypeScript** - Full type safety and IntelliSense
- **Vite** - Fast build tool with HMR
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Supabase** - Authentication and database client
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── auth/         # Authentication forms (SignInForm, SignUpForm)
│   └── ...           # Other component categories
├── contexts/         # React Context providers
│   └── ThemeContext.tsx  # Dark/light mode management
├── hooks/           # Custom React hooks
│   ├── useAuth.ts   # Authentication state management
│   ├── useLeagues.ts # League data and operations
│   ├── useMembership.ts # League membership management
│   └── usePlayerStats.ts # Player statistics and analytics
├── pages/           # Page components
│   ├── AuthPage.tsx      # Login/registration
│   ├── LeagueList.tsx    # Main league discovery page
│   ├── LeaguePage.tsx    # Individual league details
│   ├── LeagueNightPage.tsx # League night management
│   ├── ProfilePage.tsx   # Player profiles with stats
│   ├── AboutPage.tsx     # Company information
│   ├── ContactPage.tsx   # Contact form and information
│   ├── PrivacyPage.tsx   # Privacy policy
│   ├── TermsPage.tsx     # Terms of service
│   └── LeaderboardPage.tsx # Coming soon page
├── services/        # API services and Supabase client
│   ├── api/         # API endpoint modules
│   ├── auth.ts      # Authentication services
│   └── supabase.ts  # Supabase client configuration
├── utils/           # Utility functions
│   └── profileUtils.ts # Username-based routing utilities
├── App.tsx          # Main application component with routing
└── main.tsx         # Application entry point
```

## 🔧 Key Features

**🎨 User Experience**
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - System-wide theme support with smooth transitions
- **Glass-morphism UI** - Modern design with backdrop-blur effects
- **Enhanced Loading** - Skeleton loading states for improved perceived performance
- **Intuitive Navigation** - Tab-based routing and breadcrumb navigation

**⚙️ Technical Features**
- **Type Safety** - Full TypeScript integration with strict typing
- **Real-time Updates** - Live data with Supabase subscriptions
- **Modern React** - Hooks, Context API, and functional components
- **Fast Development** - Vite HMR for instant feedback
- **Production Ready** - Optimized builds with code splitting
- **URL-based State** - Clean URLs with search params for deep linking

**📊 Player Features**
- **Comprehensive Profiles** - Multi-tab player profiles with statistics
- **Performance Analytics** - Detailed stats tracking and trend analysis
- **Partnership Management** - Social features and partnership history
- **League Integration** - Seamless league membership and participation

**🏢 Content Management**
- **Professional Pages** - Complete About, Contact, Privacy, and Terms pages
- **Contact Integration** - Ready for EmailJS integration with proper form handling
- **SEO Ready** - Proper meta tags and semantic HTML structure

## 🌐 Environment Setup

 Create `.env.local` with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
```

## 📝 Development Guidelines

- Use TypeScript interfaces for all props and data structures
- Follow React best practices with hooks and functional components
- Use Tailwind CSS for styling with consistent design patterns
- Implement proper error boundaries and loading states
- Write descriptive commit messages and component documentation

## 🔗 Related

- **Backend**: `../server/` - Express.js API server
- **Database**: Supabase PostgreSQL with Row Level Security
- **Documentation**: `../../Docs/` - Project specifications and guides

---

*Built with ❤️ for South African pickleball communities*
