// League Routes
// Defines all league-related API endpoints

const express = require('express');
const router = express.Router();
const { getAllLeagues, getLeagueById } = require('../controllers/leagueController');

// GET /api/leagues - Get all leagues
router.get('/', getAllLeagues);

// GET /api/leagues/:id - Get specific league
router.get('/:id', getLeagueById);

module.exports = router;