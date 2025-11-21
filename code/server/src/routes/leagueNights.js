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
  removePartnership,
  startLeague,
  endLeague,
  updateCourts
} = require('../controllers/leagueNightController');const {
  getMatches,
  createMatches,
  submitMatchScore,
  getQueue
} = require('../controllers/matchController');

// GET /api/leagues/:leagueId/nights/:nightId - Get league night details
router.get('/:leagueId/nights/:nightId', getLeagueNight);

// GET /api/leagues/:leagueId/nights/:nightId/checkins - Get checked-in players
router.get('/:leagueId/nights/:nightId/checkins', getCheckedInPlayers);

// GET /api/leagues/:leagueId/nights/:nightId/partnership-requests - Get partnership requests
router.get('/:leagueId/nights/:nightId/partnership-requests', getPartnershipRequests);

// GET /api/leagues/:leagueId/nights/:nightId/matches - Get all matches for league night
router.get('/:leagueId/nights/:nightId/matches', getMatches);

// GET /api/leagues/:leagueId/nights/:nightId/queue - Get queue information
router.get('/:leagueId/nights/:nightId/queue', getQueue);

// POST /api/leagues/:leagueId/nights/:nightId/checkin - Check in player
router.post('/:leagueId/nights/:nightId/checkin', checkInPlayer);

// POST /api/leagues/:leagueId/nights/:nightId/partnership-request - Send partnership request
router.post('/:leagueId/nights/:nightId/partnership-request', createPartnershipRequest);

// POST /api/leagues/:leagueId/nights/:nightId/partnership-accept - Accept partnership request
router.post('/:leagueId/nights/:nightId/partnership-accept', acceptPartnershipRequest);

// POST /api/leagues/:leagueId/nights/:nightId/partnership-reject - Reject partnership request
router.post('/:leagueId/nights/:nightId/partnership-reject', rejectPartnershipRequest);

// POST /api/leagues/:leagueId/nights/:nightId/create-matches - Create matches from available partnerships
router.post('/:leagueId/nights/:nightId/create-matches', createMatches);

// POST /api/leagues/:leagueId/nights/:nightId/submit-score - Submit match score
router.post('/:leagueId/nights/:nightId/submit-score', submitMatchScore);

// POST /api/leagues/:leagueId/nights/:nightId/start-league - Manually start league (admin only)
router.post('/:leagueId/nights/:nightId/start-league', startLeague);

// POST /api/leagues/:leagueId/nights/:nightId/end-league - End league night (admin only)
router.post('/:leagueId/nights/:nightId/end-league', endLeague);

// POST /api/leagues/:leagueId/nights/:nightId/update-courts - Update court configuration (admin only)
router.post('/:leagueId/nights/:nightId/update-courts', updateCourts);

// DELETE /api/leagues/:leagueId/nights/:nightId/checkin - Uncheck player
router.delete('/:leagueId/nights/:nightId/checkin', uncheckPlayer);

// DELETE /api/leagues/:leagueId/nights/:nightId/partnership - Remove partnership
router.delete('/:leagueId/nights/:nightId/partnership', removePartnership);

module.exports = router;