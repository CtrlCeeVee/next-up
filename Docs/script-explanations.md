# Script Explanations - Next-Up Pickleball App

## Created Files:

### 📁 Scripts & Setup
- **`scripts/setup.sh`** - Complete setup script with dependency installation, environment setup, and database initialization
- **`docker-compose.yml`** - PostgreSQL, Redis, pgAdmin, and MailHog for local development

### 📦 Package.json Files
- **`package.json`** (root) - Orchestration scripts for running both client and server
- **`client/package.json`** - React/Vite client with all necessary dependencies
- **`server/package.json`** - Express server with TypeScript and Prisma

### 🔧 Configuration Files
- **`.env.example`** - Comprehensive environment variables template
- **`client/vite.config.ts`** - Vite configuration with PWA support
- **`client/tsconfig.json`** - TypeScript config for React
- **`server/tsconfig.json`** - TypeScript config for Express
- **`client/tailwind.config.js`** - Tailwind CSS with custom theme

### 🚀 CI/CD & Deployment
- **`.github/workflows/ci.yml`** - CI pipeline for testing and linting
- **`.github/workflows/deploy.yml`** - Deployment pipeline for AWS
- **`server/Dockerfile`** - Production-ready Docker image for the server

### 📊 Database
- **`server/prisma/schema.prisma`** - Complete database schema
- **`server/prisma/seed.ts`** - Database seeding script with test data

## Quick Start Commands:

```bash
# Initial setup (one time)
npm run setup

# Start development servers
npm run dev

# Database commands
npm run db:migrate    # Run migrations
npm run db:seed       # Seed test data
npm run db:studio     # Open Prisma Studio

# Testing
npm run test          # Run all tests
npm run lint          # Lint code
npm run type-check    # Type checking

# Docker
npm run docker:up     # Start PostgreSQL & Redis
npm run docker:down   # Stop containers
```

## Detailed Script Breakdown

### Root Package.json Scripts

| Script | Description |
|--------|-------------|
| `dev` | Starts both client (port 5173) and server (port 5000) concurrently |
| `build` | Builds both client and server for production |
| `test` | Runs tests for both client and server |
| `lint` | Lints both client and server code |
| `type-check` | Type checks both TypeScript projects |
| `db:migrate` | Creates and runs Prisma migrations |
| `db:seed` | Seeds database with test data |
| `db:studio` | Opens Prisma Studio GUI for database management |
| `docker:up` | Starts PostgreSQL and Redis containers |
| `docker:down` | Stops all Docker containers |
| `setup` | Complete initial setup (deps, env, database) |

### Client-Specific Scripts

| Script | Description |
|--------|-------------|
| `dev` | Starts Vite dev server with HMR |
| `build` | Builds optimized production bundle |
| `preview` | Preview production build locally |
| `test` | Runs Vitest tests |
| `lint` | ESLint with React rules |
| `format` | Prettier formatting |
| `analyze` | Bundle size analyzer |

### Server-Specific Scripts

| Script | Description |
|--------|-------------|
| `dev` | Starts server with tsx watch mode |
| `build` | Compiles TypeScript to JavaScript |
| `start` | Runs production server |
| `test` | Runs server tests with Vitest |
| `db:generate` | Generates Prisma client |
| `db:reset` | Resets database completely |
| `docker:build` | Builds Docker image |
| `docker:run` | Runs server in Docker |

## Environment Variables

The `.env.example` file contains all necessary environment variables:

### Essential Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Authentication secret
- `VITE_API_URL` - API URL for client
- `PORT` - Server port (default: 5000)

### Optional Services
- `PUSHER_*` - Real-time updates
- `SENDGRID_API_KEY` - Email service
- `AWS_*` - AWS deployment credentials
- `REDIS_URL` - Caching and sessions

## Docker Services

The `docker-compose.yml` includes:

1. **PostgreSQL** (port 5432)
   - Main database
   - Persistent volume for data

2. **Redis** (port 6379)
   - Session storage
   - Caching layer

3. **pgAdmin** (port 5050) - *Optional*
   - Database GUI
   - Profile: `debug`

4. **MailHog** (ports 1025/8025) - *Optional*
   - Email testing
   - Profile: `debug`

## CI/CD Pipelines

### CI Pipeline (`ci.yml`)
- Runs on push/PR to main/develop
- Tests client and server separately
- Type checking and linting
- Security audits
- Parallel execution for speed

### Deploy Pipeline (`deploy.yml`)
- Deploys client to S3/CloudFront
- Deploys server to ECS/EC2
- Database migrations
- Environment-based deployments (staging/production)
- Slack notifications

## Development Workflow

1. **Initial Setup**
   ```bash
   git clone <repo>
   cd pickleball-app
   npm run setup
   ```

2. **Daily Development**
   ```bash
   npm run docker:up    # Start databases
   npm run dev          # Start dev servers
   ```

3. **Before Committing**
   ```bash
   npm run type-check   # Check types
   npm run lint         # Check code style
   npm run test         # Run tests
   ```

4. **Database Changes**
   ```bash
   # Edit schema.prisma
   npm run db:migrate   # Create migration
   npm run db:seed      # Re-seed if needed
   ```

5. **Production Build**
   ```bash
   npm run build        # Build both apps
   npm run preview      # Test locally
   ```

All scripts are ready to use - you can pick and choose what fits your workflow!