// Development/Testing Routes
// ONLY AVAILABLE IN DEVELOPMENT MODE

const express = require('express');
const router = express.Router();
const devController = require('../controllers/devController');

// Middleware to only allow in development
const devOnly = (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Development endpoints only available in development mode' });
  }
  next();
};

// Apply dev-only middleware to all routes
router.use(devOnly);

// Simulation endpoints
router.post('/simulate-checkins', devController.simulateCheckIns);
router.post('/simulate-partnerships', devController.simulatePartnerships);
router.post('/complete-random-match', devController.completeRandomMatch);

// Cleanup endpoint
router.delete('/reset-league-night/:leagueNightId', devController.resetLeagueNight);

module.exports = router;
