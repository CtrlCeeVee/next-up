#!/bin/bash

# Exit on errors
set -e

echo "🔧 Setting up Next Up frontend..."

# Move into client directory
cd client

# Install dependencies
echo "📦 Installing client npm packages..."
npm install

echo "✅ Client setup complete!"
cd ..
echo "🔧 Setting up Next Up server..."

# Move into server directory
cd server

# Install dependencies
echo "📦 Installing server npm packages..."
npm install

echo "✅ Server setup complete!"
echo "🚀 Setup complete! You can now run the client and server."
