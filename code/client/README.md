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
│   ├── auth/         # Authentication forms
│   └── ...           # Other component categories
├── contexts/         # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API services and Supabase client
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## 🔧 Key Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript integration
- **Real-time Updates** - Live data with Supabase subscriptions
- **Modern React** - Hooks, Context API, and functional components
- **Fast Development** - Vite HMR for instant feedback
- **Production Ready** - Optimized builds with code splitting

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
