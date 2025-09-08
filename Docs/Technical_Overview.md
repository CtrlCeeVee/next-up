# 📖 Next-Up Technical Overview

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast development server and build tool)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Routing**: React Router DOM
- **State Management**: React Context API (for now)
- **Icons**: Lucide React
- **Hosting**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Environment**: dotenv for configuration
- **CORS**: Express CORS middleware
- **Development**: Nodemon for auto-restart
- **Hosting**: Render

### Database & Authentication
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for avatars, etc.)
- **Real-time**: Supabase Real-time (for live match updates)

### Domain & Deployment
- **Domain**: next-up.co.za (points to frontend)
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Database**: Hosted on Supabase

### Future Migration
- **Target**: AWS
  - Frontend: AWS Amplify
  - Backend: AWS ECS (Elastic Container Service)
  - Database: AWS RDS (PostgreSQL)
  - Authentication: AWS Cognito

---

## Project Structure

```
next-up/
├── Docs/                           # Project documentation
│   ├── MVP.md                     # MVP functional specifications
│   ├── User_stories.md            # User stories and requirements
│   ├── Vision_and_aims.md         # Project vision and goals
│   └── Technical_Overview.md      # This file - technical documentation
│
├── code/                          # Source code
│   ├── client/                    # Frontend React application
│   │   ├── public/               # Static assets
│   │   ├── src/                  # Source code
│   │   │   ├── components/       # Reusable React components
│   │   │   ├── pages/           # Page components
│   │   │   ├── contexts/        # React Context providers
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── types/           # TypeScript type definitions
│   │   │   ├── App.tsx          # Main App component
│   │   │   ├── main.tsx         # React entry point
│   │   │   └── index.css        # Global styles with Tailwind
│   │   ├── package.json         # Frontend dependencies
│   │   ├── vite.config.ts       # Vite configuration
│   │   ├── tailwind.config.js   # Tailwind CSS configuration
│   │   └── client_setup.sh      # Frontend setup script
│   │
│   └── server/                   # Backend Express application
│       ├── src/                 # Source code (future structure)
│       │   ├── routes/          # API route handlers
│       │   ├── middleware/      # Express middleware
│       │   ├── models/          # Data models
│       │   ├── controllers/     # Business logic
│       │   └── utils/           # Utility functions
│       ├── index.js             # Server entry point
│       ├── package.json         # Backend dependencies
│       ├── .env                 # Environment variables
│       └── server_setup.sh      # Backend setup script
│
└── next_up_notes.txt             # Development notes
```

---

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-up
   ```

2. **Setup Frontend**
   ```bash
   cd code/client
   ./client_setup.sh
   # OR manually:
   npm install
   npm install react-router-dom @supabase/supabase-js lucide-react
   ```

3. **Setup Backend**
   ```bash
   cd code/server
   ./server_setup.sh
   # OR manually:
   npm install
   npm install express cors dotenv
   npm install -D nodemon
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Frontend (runs on http://localhost:5173)
   cd code/client
   npm run dev
   
   # Terminal 2 - Backend (runs on http://localhost:3001)
   cd code/server
   npm run dev
   ```

### Environment Variables

#### Frontend (.env.local)
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# API Configuration
VITE_API_URL=http://localhost:3001

# App Configuration
VITE_APP_NAME=Next-Up
VITE_APP_VERSION=1.0.0
```

#### Backend (.env)
```bash
# Server Configuration
PORT=3001

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

---

## API Endpoints

### Current Endpoints
- `GET /` - Server information
- `GET /health` - Health check
- `GET /api/leagues` - Get all leagues (mock data)

### Planned Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/leagues/:id` - Get specific league
- `POST /api/leagues/:id/checkin` - Check into league
- `GET /api/leagues/:id/matches` - Get league matches
- `POST /api/matches/:id/score` - Submit match score
- `GET /api/users/:id/stats` - Get user statistics

---

## Development Guidelines

### Code Style
- **TypeScript**: Use TypeScript for type safety
- **ESLint**: Follow ESLint rules for consistent code style
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use camelCase for variables/functions, PascalCase for components

### Component Structure
```typescript
// React Component Template
import React from 'react';

interface ComponentProps {
  // Define props with TypeScript
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  return (
    <div className="tailwind-classes">
      {/* Component content */}
    </div>
  );
};

export default Component;
```

### Git Workflow
- **Branches**: Use feature branches for new features
- **Commits**: Write clear, descriptive commit messages
- **Pull Requests**: Review code before merging to main

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

### Database (Supabase)
1. Create Supabase project
2. Set up database schema
3. Configure Row Level Security (RLS)
4. Generate API keys for frontend and backend

---

## Monitoring & Logging

### Development
- **Frontend**: Browser DevTools, React DevTools
- **Backend**: Console logs, Nodemon restart logs
- **Database**: Supabase dashboard

### Production
- **Frontend**: Vercel Analytics and Logs
- **Backend**: Render Logs
- **Database**: Supabase Dashboard and Logs
- **Errors**: To be configured (Sentry recommended)

---

## Security Considerations

- **Environment Variables**: Never commit .env files
- **API Keys**: Use different keys for development and production
- **CORS**: Properly configure CORS for production domains
- **Authentication**: Implement proper JWT token validation
- **Database**: Use Row Level Security (RLS) in Supabase

---

## Performance Considerations

- **Frontend**: Code splitting with React.lazy(), Image optimization
- **Backend**: Database query optimization, Caching strategies
- **Database**: Proper indexing, Connection pooling

---

## Testing Strategy (Future)

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **E2E**: Cypress or Playwright
- **API**: Postman collections for manual testing