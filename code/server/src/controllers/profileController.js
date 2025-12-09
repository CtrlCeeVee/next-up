// code/server/src/controllers/profileController.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET /api/profiles/:username - Get user profile by username
const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }

    // Query profiles table by username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, email, first_name, last_name, skill_level, bio, location, avatar_url, created_at')
      .eq('username', username)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        // No rows returned - profile not found
        return res.status(404).json({
          success: false,
          error: 'Profile not found'
        });
      }
      throw profileError;
    }

    // Format response with display name
    const response = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`,
      firstName: profile.first_name,
      lastName: profile.last_name,
      skillLevel: profile.skill_level || 'Intermediate',
      bio: profile.bio || null,
      location: profile.location || null,
      avatarUrl: profile.avatar_url || null,
      joinedDate: profile.created_at
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching profile by username:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

// GET /api/profiles/user/:userId - Get user profile by user ID
const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Query profiles table by user ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, email, first_name, last_name, skill_level, bio, location, avatar_url, created_at')
      .eq('id', userId)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Profile not found'
        });
      }
      throw profileError;
    }

    // Format response
    const response = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`,
      firstName: profile.first_name,
      lastName: profile.last_name,
      skillLevel: profile.skill_level || 'Intermediate',
      bio: profile.bio || null,
      location: profile.location || null,
      avatarUrl: profile.avatar_url || null,
      joinedDate: profile.created_at
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching profile by user ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

// PUT /api/profiles/:userId - Update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bio, location, skillLevel } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Build update object with only provided fields
    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (skillLevel !== undefined) updates.skill_level = skillLevel;

    // Check if there's anything to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('id, username, email, first_name, last_name, skill_level, bio, location, avatar_url, created_at')
      .single();

    if (updateError) {
      throw updateError;
    }

    // Format response
    const response = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`,
      firstName: profile.first_name,
      lastName: profile.last_name,
      skillLevel: profile.skill_level || 'Intermediate',
      bio: profile.bio || null,
      location: profile.location || null,
      avatarUrl: profile.avatar_url || null,
      joinedDate: profile.created_at
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};

// GET /api/profiles/:userId/streaks - Get user's win streaks and recent form
const getPlayerStreaks = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // First, get all partnerships where the user is involved
    const { data: userPartnerships, error: partnershipsError } = await supabase
      .from('confirmed_partnerships')
      .select('id')
      .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
      .eq('is_active', true);

    if (partnershipsError) {
      throw partnershipsError;
    }

    if (!userPartnerships || userPartnerships.length === 0) {
      return res.json({
        success: true,
        data: {
          currentStreak: 0,
          bestStreak: 0,
          recentForm: []
        }
      });
    }

    const partnershipIds = userPartnerships.map(p => p.id);

    // Get all completed matches for these partnerships, ordered by completion time (most recent first)
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select(`
        id,
        team1_score,
        team2_score,
        completed_at,
        partnership1_id,
        partnership2_id
      `)
      .eq('status', 'completed')
      .or(`partnership1_id.in.(${partnershipIds.join(',')}),partnership2_id.in.(${partnershipIds.join(',')})`)
      .order('completed_at', { ascending: false });

    if (matchesError) {
      throw matchesError;
    }

    if (!matches || matches.length === 0) {
      return res.json({
        success: true,
        data: {
          currentStreak: 0,
          bestStreak: 0,
          recentForm: []
        }
      });
    }

    // Calculate wins/losses for each match
    const matchResults = matches.map(match => {
      const inPartnership1 = partnershipIds.includes(match.partnership1_id);
      
      const userScore = inPartnership1 ? match.team1_score : match.team2_score;
      const opponentScore = inPartnership1 ? match.team2_score : match.team1_score;
      const isWin = userScore > opponentScore;

      return {
        matchId: match.id,
        completedAt: match.completed_at,
        isWin,
        userScore,
        opponentScore
      };
    });

    // Calculate current streak (from most recent match)
    let currentStreak = 0;
    if (matchResults.length > 0) {
      const mostRecentWin = matchResults[0].isWin;
      for (const result of matchResults) {
        if (result.isWin === mostRecentWin) {
          currentStreak++;
        } else {
          break;
        }
      }
      // Make streak negative if current streak is losses
      if (!mostRecentWin) {
        currentStreak = -currentStreak;
      }
    }

    // Calculate best win streak
    let bestStreak = 0;
    let tempStreak = 0;
    for (const result of matchResults) {
      if (result.isWin) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Get recent form (last 10 games)
    const recentForm = matchResults.slice(0, 10).reverse().map(result => ({
      result: result.isWin ? 'W' : 'L',
      completedAt: result.completedAt
    }));

    res.json({
      success: true,
      data: {
        currentStreak,
        bestStreak,
        recentForm
      }
    });

  } catch (error) {
    console.error('Error fetching player streaks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch player streaks'
    });
  }
};

module.exports = {
  getProfileByUsername,
  getProfileByUserId,
  updateProfile,
  getPlayerStreaks
};
