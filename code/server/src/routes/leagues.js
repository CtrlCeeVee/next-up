// League Routes
// Defines all league-related API endpoints

const express = require('express');
const router = express.Router();
const { getAllLeagues, getLeagueById, getLeagueTopPlayers } = require('../controllers/leagueController');

// GET /api/leagues - Get all leagues
router.get('/', getAllLeagues);

// GET /api/leagues/:id - Get specific league
router.get('/:id', getLeagueById);

// GET /api/leagues/:id/top-players - Get top players for a league
router.get('/:id/top-players', getLeagueTopPlayers);

module.exports = router;