const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const leagueRoutes = require('./src/routes/leagues');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
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

// Start server
app.listen(PORT, () => {
  console.log(`🏓 Next-Up API Server running on port ${PORT}`);
});