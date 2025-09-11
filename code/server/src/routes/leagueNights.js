// League Night Routes
// Defines all league night-related API endpoints

const express = require('express');
const router = express.Router();
const { 
  getLeagueNight,
  getCheckedInPlayers,
  checkInPlayer,
  createPartnershipRequest,
  acceptPartnershipRequest,
  rejectPartnershipRequest,
  getPartnershipRequests,
  uncheckPlayer,
  removePartnership
} = require('../controllers/leagueNightController');

// GET /api/leagues/:leagueId/nights/:nightId - Get league night details
router.get('/:leagueId/nights/:nightId', getLeagueNight);

// GET /api/leagues/:leagueId/nights/:nightId/checkins - Get checked-in players
router.get('/:leagueId/nights/:nightId/checkins', getCheckedInPlayers);

// GET /api/leagues/:leagueId/nights/:nightId/partnership-requests - Get partnership requests
router.get('/:leagueId/nights/:nightId/partnership-requests', getPartnershipRequests);

// POST /api/leagues/:leagueId/nights/:nightId/checkin - Check in player
router.post('/:leagueId/nights/:nightId/checkin', checkInPlayer);

// POST /api/leagues/:leagueId/nights/:nightId/partnership-request - Send partnership request
router.post('/:leagueId/nights/:nightId/partnership-request', createPartnershipRequest);

// POST /api/leagues/:leagueId/nights/:nightId/partnership-accept - Accept partnership request
router.post('/:leagueId/nights/:nightId/partnership-accept', acceptPartnershipRequest);

// POST /api/leagues/:leagueId/nights/:nightId/partnership-reject - Reject partnership request
router.post('/:leagueId/nights/:nightId/partnership-reject', rejectPartnershipRequest);

// DELETE /api/leagues/:leagueId/nights/:nightId/checkin - Uncheck player
router.delete('/:leagueId/nights/:nightId/checkin', uncheckPlayer);

// DELETE /api/leagues/:leagueId/nights/:nightId/partnership - Remove partnership
router.delete('/:leagueId/nights/:nightId/partnership', removePartnership);

module.exports = router;