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
  updateCourts,
  toggleAutoAssignment
} = require('../controllers/leagueNightController');const {
  getMatches,
  createMatches,
  submitMatchScore,
  confirmMatchScore,
  disputeMatchScore,
  cancelMatchScore,
  getQueue,
  getMyNightStats,
  overrideMatchScore,
  cancelActiveMatch,
  manualCourtAssignment
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

// GET /api/leagues/:leagueId/nights/:nightId/my-stats - Get user's stats for tonight
router.get('/:leagueId/nights/:nightId/my-stats', getMyNightStats);

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

// POST /api/leagues/:leagueId/nights/:nightId/confirm-score - Confirm opponent's submitted score
router.post('/:leagueId/nights/:nightId/confirm-score', confirmMatchScore);

// POST /api/leagues/:leagueId/nights/:nightId/dispute-score - Dispute opponent's submitted score
router.post('/:leagueId/nights/:nightId/dispute-score', disputeMatchScore);

// POST /api/leagues/:leagueId/nights/:nightId/cancel-score - Cancel your own score submission
router.post('/:leagueId/nights/:nightId/cancel-score', cancelMatchScore);

// POST /api/leagues/:leagueId/nights/:nightId/start-league - Manually start league (admin only)
router.post('/:leagueId/nights/:nightId/start-league', startLeague);

// POST /api/leagues/:leagueId/nights/:nightId/end-league - End league night (admin only)
router.post('/:leagueId/nights/:nightId/end-league', endLeague);

// POST /api/leagues/:leagueId/nights/:nightId/update-courts - Update court configuration (admin only)
router.post('/:leagueId/nights/:nightId/update-courts', updateCourts);

// POST /api/leagues/:leagueId/nights/:nightId/toggle-auto-assignment - Toggle auto-assignment (admin only)
router.post('/:leagueId/nights/:nightId/toggle-auto-assignment', toggleAutoAssignment);

// POST /api/leagues/:leagueId/nights/:nightId/matches/:matchId/override-score - Admin override match score
router.post('/:leagueId/nights/:nightId/matches/:matchId/override-score', overrideMatchScore);

// POST /api/leagues/:leagueId/nights/:nightId/matches/:matchId/cancel - Admin cancel active match
router.post('/:leagueId/nights/:nightId/matches/:matchId/cancel', cancelActiveMatch);

// POST /api/leagues/:leagueId/nights/:nightId/matches/assign - Admin manual court assignment
router.post('/:leagueId/nights/:nightId/matches/assign', manualCourtAssignment);

// DELETE /api/leagues/:leagueId/nights/:nightId/checkin - Uncheck player
router.delete('/:leagueId/nights/:nightId/checkin', uncheckPlayer);

// DELETE /api/leagues/:leagueId/nights/:nightId/partnership - Remove partnership
router.delete('/:leagueId/nights/:nightId/partnership', removePartnership);

module.exports = router;