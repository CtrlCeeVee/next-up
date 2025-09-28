// League Routes
// Defines all league-related API endpoints

const express = require('express');
const router = express.Router();
const { 
  getAllLeagues, 
  getLeagueById, 
  getLeagueTopPlayers,
  checkMembership,
  joinLeague,
  getLeagueMembers,
  getLeagueStats
} = require('../controllers/leagueController');

// GET /api/leagues - Get all leagues
router.get('/', getAllLeagues);

// GET /api/leagues/:id - Get specific league
router.get('/:id', getLeagueById);

// GET /api/leagues/:id/top-players - Get top players for a league
router.get('/:id/top-players', getLeagueTopPlayers);

// GET /api/leagues/:id/membership - Check if user is a member
router.get('/:id/membership', checkMembership);

// POST /api/leagues/:id/join - Join a league
router.post('/:id/join', joinLeague);

// GET /api/leagues/:id/members - Get league members
router.get('/:id/members', getLeagueMembers);

// GET /api/leagues/:id/stats - Get league statistics
router.get('/:id/stats', getLeagueStats);

module.exports = router;