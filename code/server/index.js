const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const leagueRoutes = require('./src/routes/leagues');
const leagueNightRoutes = require('./src/routes/leagueNights');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS configuration for production and development
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // React dev server
    'https://next-up-blond.vercel.app', // Production Vercel domain
    'https://next-up.co.za' // Custom domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Next-Up API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/leagues', leagueRoutes);
app.use('/api/leagues', leagueNightRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🏓 Next-Up API Server running on port ${PORT}`);
});