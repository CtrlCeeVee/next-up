// Profile Routes
// Defines all profile-related API endpoints

const express = require('express');
const router = express.Router();
const { 
  getProfileByUsername,
  getProfileByUserId,
  updateProfile,
  getPlayerStreaks
} = require('../controllers/profileController');

// GET /api/profiles/user/:userId - Get user profile by user ID (must be before /:username route)
router.get('/user/:userId', getProfileByUserId);

// GET /api/profiles/:userId/streaks - Get user's win streaks and recent form
router.get('/:userId/streaks', getPlayerStreaks);

// PUT /api/profiles/:userId - Update user profile
router.put('/:userId', updateProfile);

// GET /api/profiles/:username - Get user profile by username (must be last to avoid catching other routes)
router.get('/:username', getProfileByUsername);

module.exports = router;
