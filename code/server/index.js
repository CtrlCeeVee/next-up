const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const leagueRoutes = require('./src/routes/leagues');
const leagueNightRoutes = require('./src/routes/leagueNights');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS configuration for credentials
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite dev server and potential React dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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