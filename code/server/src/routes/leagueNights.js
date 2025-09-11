// League Night Routes
// Defines all league night-related API endpoints

const express = require('express');
const router = express.Router();
const { 
  getLeagueNight,
  getCheckedInPlayers,
  checkInPlayer,
  createPartnership
} = require('../controllers/leagueNightController');

// GET /api/leagues/:leagueId/nights/:nightId - Get league night details
router.get('/:leagueId/nights/:nightId', getLeagueNight);

// GET /api/leagues/:leagueId/nights/:nightId/checkins - Get checked-in players
router.get('/:leagueId/nights/:nightId/checkins', getCheckedInPlayers);

// POST /api/leagues/:leagueId/nights/:nightId/checkin - Check in player
router.post('/:leagueId/nights/:nightId/checkin', checkInPlayer);

// POST /api/leagues/:leagueId/nights/:nightId/partnership - Create partnership
router.post('/:leagueId/nights/:nightId/partnership', createPartnership);

module.exports = router;