const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

// Mock leagues endpoint (temporary - will connect to Supabase later)
app.get('/api/leagues', (req, res) => {
  const mockLeagues = [
    {
      id: 1,
      name: "Northcliff Eagles",
      location: "Northcliff Sports Club",
      nextGame: "Today, 6:00 PM",
      playersTonight: 12,
      isActive: true
    },
    {
      id: 2,
      name: "Sandton Smashers", 
      location: "Sandton Recreation Center",
      nextGame: "Tomorrow, 7:00 PM",
      playersTonight: 8,
      isActive: true
    },
    {
      id: 3,
      name: "Rosebank Rackets",
      location: "Rosebank Club",
      nextGame: "Wednesday, 6:30 PM", 
      playersTonight: 0,
      isActive: false
    }
  ];
  
  res.json(mockLeagues);
});

// Start server
app.listen(PORT, () => {
  console.log(`🏓 Next-Up API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🏆 Leagues API: http://localhost:${PORT}/api/leagues`);
});