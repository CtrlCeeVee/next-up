# 🎯 Next-Up Technical Implementation Todo

## ✅ Tech Stack Decision

### Frontend (Mobile-First PWA)
- **Framework**: React 18+ with Vite
  - Lightning-fast HMR with Vite
  - Excellent build optimization
  - Full control over routing (React Router v6)
  - TypeScript for type safety
  - PWA support via vite-plugin-pwa
- **UI Library**: Tailwind CSS + shadcn/ui
  - Rapid development
  - Mobile-first responsive design
  - Consistent component library
- **State Management**: Zustand + React Query (TanStack Query)
  - Simple state management
  - Powerful server state caching
- **Routing**: React Router v6
  - Full control over routing
  - Protected routes for auth
- **Auth**: Custom JWT implementation with React Context
  - Full control over auth flow
  - Token refresh logic
  - Secure HTTP-only cookies

### Backend
- **Framework**: Express.js / Fastify with TypeScript
  - Fast and lightweight
  - Great ecosystem
  - Full control over API structure
- **API Layer**: tRPC or REST API
  - tRPC for type-safe calls (optional)
  - REST for simplicity and standard patterns
- **Real-time**: Pusher or AWS IoT Core
  - For live match updates
  - Court availability notifications
- **ORM**: Prisma
  - Type-safe database queries
  - Excellent migrations support
  - Works great with PostgreSQL

### Database & Infrastructure (AWS)
- **Database**: Amazon RDS (PostgreSQL)
  - Reliable, managed database
  - Auto-backups and scaling
  - Good for relational data (players, matches, leagues)
- **File Storage**: Amazon S3
  - Profile pictures/avatars
  - League logos
- **Hosting**: AWS Amplify or Vercel
  - Automatic deployments
  - Edge functions support
  - Built-in CI/CD
- **CDN**: CloudFront (if AWS) or Vercel Edge Network

## 📁 Repository Structure

```
pickleball-app/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI pipeline
│       └── deploy.yml              # CD pipeline
├── client/                        # React Frontend (Vite)
│   ├── src/
│   │   ├── api/                   # API client & services
│   │   │   ├── client.ts          # Axios/Fetch setup
│   │   │   └── services/          # API service modules
│   │   ├── components/
│   │   │   ├── ui/                # shadcn components
│   │   │   ├── leagues/           # League components
│   │   │   ├── matches/           # Match components
│   │   │   ├── admin/             # Admin components
│   │   │   └── shared/            # Shared components
│   │   ├── contexts/              # React contexts
│   │   │   ├── AuthContext.tsx    # Authentication
│   │   │   └── AppContext.tsx     # Global app state
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Page components
│   │   │   ├── auth/              # Login, Register
│   │   │   ├── dashboard/         # Player dashboard
│   │   │   ├── leagues/           # League pages
│   │   │   ├── admin/             # Admin pages
│   │   │   └── Home.tsx
│   │   ├── routes/                # Route configuration
│   │   │   ├── AppRoutes.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── store/                 # Zustand stores
│   │   ├── styles/                # Global styles
│   │   ├── utils/                 # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server/                        # Express/Fastify Backend
│   ├── src/
│   │   ├── controllers/           # Route controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── league.controller.ts
│   │   │   ├── match.controller.ts
│   │   │   └── player.controller.ts
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── routes/                # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── league.routes.ts
│   │   │   ├── match.routes.ts
│   │   │   └── index.ts
│   │   ├── services/              # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── match.service.ts
│   │   │   └── elo.service.ts
│   │   ├── utils/                 # Server utilities
│   │   │   ├── jwt.utils.ts
│   │   │   └── logger.ts
│   │   ├── websocket/             # Real-time features
│   │   │   └── match.socket.ts
│   │   ├── app.ts                 # Express app setup
│   │   └── server.ts              # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── tsconfig.json
├── mobile/                        # Future React Native app
├── packages/
│   ├── database/                  # Shared Prisma schema
│   ├── types/                     # Shared TypeScript types
│   └── utils/                     # Shared utilities
├── infrastructure/
│   ├── aws/
│   │   ├── cloudformation/        # IaC templates
│   │   └── terraform/             # Alternative IaC
│   └── docker/
│       └── docker-compose.yml     # Local dev environment
├── scripts/
│   ├── setup.sh                   # Initial setup script
│   └── seed.ts                    # Database seeding
├── .env.example
├── .gitignore
├── package.json                   # Root package.json for monorepo
├── pnpm-workspace.yaml           # PNPM workspace config
├── turbo.json                    # Turborepo config
└── README.md
```

## 🚀 Local Setup Instructions

### Prerequisites
```bash
# Required tools
node >= 18.x
pnpm >= 8.x
docker >= 24.x (for local PostgreSQL)
aws-cli >= 2.x (for deployment)
```

### Initial Setup Script
```bash
#!/bin/bash
# Save as scripts/setup.sh

# Install client dependencies
cd client && npm install
cd ..

# Install server dependencies
cd server && npm install
cd ..

# Copy environment variables
cp .env.example client/.env
cp .env.example server/.env

# Start local PostgreSQL
docker-compose up -d postgres

# Wait for DB to be ready
sleep 5

# Run database migrations
cd server && npx prisma migrate dev

# Seed database with test data
npm run seed
cd ..

# Start development servers
npm run dev
```

### Package.json Scripts (Root)
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build",
    "start": "cd server && npm start",
    "lint": "npm run lint:client && npm run lint:server",
    "lint:client": "cd client && npm run lint",
    "lint:server": "cd server && npm run lint",
    "type-check": "npm run type-check:client && npm run type-check:server",
    "type-check:client": "cd client && npm run type-check",
    "type-check:server": "cd server && npm run type-check",
    "test": "npm run test:client && npm run test:server",
    "db:migrate": "cd server && npx prisma migrate dev",
    "db:push": "cd server && npx prisma db push",
    "db:seed": "cd server && npm run seed",
    "db:studio": "cd server && npx prisma studio",
    "setup": "bash scripts/setup.sh"
  }
}
```

## 🔄 CI/CD Pipeline (GitHub Actions + AWS)

### Option 1: AWS S3 + CloudFront for React, EC2/ECS for Backend
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy-client:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Build React App
        run: |
          cd client
          npm ci
          npm run build
      - name: Deploy to S3
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: |
          aws s3 sync client/dist s3://${{ secrets.S3_BUCKET_NAME }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
  
  deploy-server:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to EC2/ECS
        # Deploy backend to EC2 or ECS
        run: |
          # Build Docker image
          # Push to ECR
          # Update ECS service or EC2 instance
```

### Option 2: Vercel (Alternative)
```yaml
# Automatic deployment on push to main
# Configure in Vercel dashboard
```

### Option 3: Traditional AWS (EC2/ECS)
```yaml
# More complex setup with:
# - Docker build
# - ECR push
# - ECS service update
# - RDS migrations
```

## 📋 Implementation Order

### Phase 1: Foundation (Week 1)
- [ ] Initialize separate client/server repositories
- [ ] Set up React with Vite and TypeScript
- [ ] Set up Express/Fastify backend with TypeScript
- [ ] Configure Prisma with PostgreSQL
- [ ] Implement JWT authentication system
- [ ] Create base UI components with shadcn

### Phase 2: Core Features (Week 2-3)
- [ ] Player registration/login
- [ ] League creation and management
- [ ] Player check-in system
- [ ] Basic match assignment algorithm
- [ ] Score submission and confirmation

### Phase 3: Admin Features (Week 4)
- [ ] Admin dashboard
- [ ] Match override capabilities
- [ ] Court configuration
- [ ] Player management

### Phase 4: Polish & Deploy (Week 5)
- [ ] PWA configuration
- [ ] Performance optimization
- [ ] AWS deployment setup
- [ ] Testing and bug fixes

## 🔧 Development Commands

```bash
# Start development (both client and server)
npm run dev

# Start only client
npm run dev:client

# Start only server
npm run dev:server

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm test

# Build for production
npm run build

# Database commands
npm run db:migrate     # Create migration
npm run db:push       # Push schema changes
npm run db:seed       # Seed test data
npm run db:studio     # Open Prisma Studio

# Deploy
npm run deploy:staging
npm run deploy:production
```

## 🌐 Environment Variables

```env
# .env.example
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextup"

# Server
PORT=5000
NODE_ENV="development"

# Auth
JWT_SECRET="generate-with-openssl"
JWT_REFRESH_SECRET="generate-with-openssl"
JWT_EXPIRE="15m"
JWT_REFRESH_EXPIRE="7d"

# Client
VITE_API_URL="http://localhost:5000/api"

# AWS (Production)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
S3_BUCKET_NAME="nextup-assets"

# Pusher (Real-time)
PUSHER_APP_ID=""
PUSHER_KEY=""
PUSHER_SECRET=""
PUSHER_CLUSTER=""

# Email (SendGrid/SES)
EMAIL_FROM="noreply@nextup.app"
SENDGRID_API_KEY=""
```

## 💰 AWS Cost Estimates (Monthly)

### MVP Stage (~$50-100/month)
- RDS PostgreSQL (db.t3.micro): $15-25
- EC2 t3.micro (backend): $10-15
- S3 Storage (React app + assets): $5
- CloudFront CDN: $10
- Route 53: $1
- Application Load Balancer: $20

### Growth Stage (~$200-500/month)
- RDS PostgreSQL (db.t3.small): $50-100
- EC2/ECS instances: $100-200
- S3 + CloudFront: $50
- ElastiCache (Redis): $50
- CloudWatch monitoring: $20

## 🎯 Next Steps

1. **Immediate Actions**:
   - Initialize Git repository
   - Set up monorepo structure
   - Install core dependencies
   - Create AWS account and configure IAM

2. **First Sprint Goals**:
   - Working authentication
   - Basic CRUD for leagues/players
   - Simple match assignment
   - Deploy to staging environment

3. **Success Metrics**:
   - Page load time < 2s
   - API response time < 200ms
   - 99.9% uptime
   - Mobile Lighthouse score > 90

## 📚 Key Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Express.js Guide](https://expressjs.com/)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/getting-started)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [AWS S3 + CloudFront for SPAs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query (React Query)](https://tanstack.com/query/latest)

---

*Last Updated: [Current Date]*
*Status: Ready for Implementation*