#!/bin/bash

# Next-Up Pickleball App - Setup Script
# This script sets up the development environment for both client and server

set -e

echo "🎾 Next-Up Pickleball App Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${YELLOW}Docker is not installed. Database will need to be set up manually.${NC}"
fi

echo -e "${GREEN}Prerequisites check passed!${NC}"

# Create directory structure if it doesn't exist
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p client/src/{api,components,contexts,hooks,pages,routes,store,styles,utils}
mkdir -p client/src/components/{ui,leagues,matches,admin,shared}
mkdir -p client/src/pages/{auth,dashboard,leagues,admin}
mkdir -p client/public

mkdir -p server/src/{controllers,middleware,routes,services,utils,websocket}
mkdir -p server/prisma/migrations
mkdir -p server/uploads

mkdir -p infrastructure/{aws,docker}
mkdir -p .github/workflows

echo -e "${GREEN}Directory structure created!${NC}"

# Install client dependencies
echo -e "${YELLOW}Installing client dependencies...${NC}"
if [ -f "client/package.json" ]; then
    cd client
    npm install
    cd ..
else
    echo -e "${YELLOW}client/package.json not found. Skipping client installation.${NC}"
fi

# Install server dependencies
echo -e "${YELLOW}Installing server dependencies...${NC}"
if [ -f "server/package.json" ]; then
    cd server
    npm install
    cd ..
else
    echo -e "${YELLOW}server/package.json not found. Skipping server installation.${NC}"
fi

# Install root dependencies
echo -e "${YELLOW}Installing root dependencies...${NC}"
if [ -f "package.json" ]; then
    npm install
else
    echo -e "${YELLOW}Root package.json not found. Skipping root installation.${NC}"
fi

# Copy environment files
echo -e "${YELLOW}Setting up environment files...${NC}"
if [ -f ".env.example" ]; then
    if [ ! -f "client/.env" ]; then
        cp .env.example client/.env
        echo -e "${GREEN}Created client/.env${NC}"
    fi
    if [ ! -f "server/.env" ]; then
        cp .env.example server/.env
        echo -e "${GREEN}Created server/.env${NC}"
    fi
else
    echo -e "${YELLOW}.env.example not found. Please create environment files manually.${NC}"
fi

# Start PostgreSQL with Docker if available
if command_exists docker; then
    echo -e "${YELLOW}Starting PostgreSQL with Docker...${NC}"
    if [ -f "docker-compose.yml" ]; then
        docker-compose up -d postgres
        echo -e "${GREEN}PostgreSQL started!${NC}"
        
        # Wait for PostgreSQL to be ready
        echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
        sleep 5
        
        # Run database migrations
        if [ -f "server/package.json" ]; then
            echo -e "${YELLOW}Running database migrations...${NC}"
            cd server
            npx prisma migrate dev --name init
            echo -e "${GREEN}Migrations completed!${NC}"
            
            # Seed database
            if [ -f "src/scripts/seed.ts" ] || [ -f "prisma/seed.ts" ]; then
                echo -e "${YELLOW}Seeding database...${NC}"
                npm run seed
                echo -e "${GREEN}Database seeded!${NC}"
            fi
            cd ..
        fi
    else
        echo -e "${YELLOW}docker-compose.yml not found. Please set up PostgreSQL manually.${NC}"
    fi
else
    echo -e "${YELLOW}Docker not available. Please set up PostgreSQL manually.${NC}"
    echo -e "${YELLOW}Connection string: postgresql://user:password@localhost:5432/nextup${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Update the .env files in client/ and server/ with your configuration"
echo "2. Ensure PostgreSQL is running"
echo "3. Run 'npm run dev' to start both client and server"
echo ""
echo "Available commands:"
echo "  npm run dev          - Start both client and server"
echo "  npm run dev:client   - Start only the client"
echo "  npm run dev:server   - Start only the server"
echo "  npm run build        - Build for production"
echo "  npm run test         - Run tests"
echo "  npm run lint         - Run linting"
echo ""
echo "Happy coding! 🎾"