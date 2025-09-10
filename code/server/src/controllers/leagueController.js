// code/server/src/controllers/leagueController.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Get all leagues with their league days and member counts
const getAllLeagues = async (req, res) => {
  try {
    // Get leagues with league days and member counts in single query
    const { data: leagues, error: leaguesError } = await supabase
      .from('leagues')
      .select(`
        *,
        league_days (
          day_of_week,
          start_time
        ),
        league_memberships!inner (
          user_id
        )
      `)
      .eq('is_active', true)
      .eq('league_memberships.is_active', true);

    if (leaguesError) {
      throw leaguesError;
    }

    // Transform data to match frontend format
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const formattedLeagues = leagues.map(league => ({
      id: league.id,
      name: league.name,
      description: league.description,
      location: league.location,
      address: league.address,
      skillLevel: 'Mixed', // Can be removed from frontend interface later
      leagueDays: league.league_days.map(day => dayNames[day.day_of_week]),
      startTime: league.league_days[0]?.start_time || '18:30:00',
      totalPlayers: league.league_memberships?.length || 0,
      isActive: league.is_active
    }));

    res.json({
      success: true,
      data: formattedLeagues
    });

  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leagues'
    });
  }
};

// Get a specific league by ID
const getLeagueById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: league, error } = await supabase
      .from('leagues')
      .select(`
        *,
        league_days (
          day_of_week,
          start_time
        ),
        league_memberships!inner (
          user_id
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .eq('league_memberships.is_active', true)
      .single();

    if (error || !league) {
      return res.status(404).json({
        success: false,
        error: 'League not found'
      });
    }

    // Transform data to match frontend format
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const formattedLeague = {
      id: league.id,
      name: league.name,
      description: league.description,
      location: league.location,
      address: league.address,
      skillLevel: 'Mixed',
      leagueDays: league.league_days.map(day => dayNames[day.day_of_week]),
      startTime: league.league_days[0]?.start_time || '18:30:00',
      totalPlayers: league.league_memberships?.length || 0,
      isActive: league.is_active
    };

    res.json({
      success: true,
      data: formattedLeague
    });

  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch league'
    });
  }
};

// Get top players for a league
const getLeagueTopPlayers = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: topPlayers, error } = await supabase
      .from('player_stats')
      .select(`
        *,
        profiles (
          full_name
        )
      `)
      .eq('league_id', id)
      .order('average_points', { ascending: false })
      .limit(3);

    if (error) {
      throw error;
    }

    const formattedPlayers = topPlayers.map((player, index) => ({
      id: player.user_id,
      name: player.profiles.full_name,
      avgScore: player.average_points,
      gamesPlayed: player.games_played,
      position: index + 1
    }));

    res.json({
      success: true,
      data: formattedPlayers
    });

  } catch (error) {
    console.error('Error fetching top players:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top players'
    });
  }
};

// Check if user is a member of a league
const checkMembership = async (req, res) => {
  try {
    const { id } = req.params; // league id
    const { user_id } = req.query; // user id from query params

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const { data: membership, error } = await supabase
      .from('league_memberships')
      .select('*')
      .eq('league_id', id)
      .eq('user_id', user_id)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error;
    }

    res.json({
      success: true,
      data: {
        isMember: !!membership,
        membership: membership || null
      }
    });

  } catch (error) {
    console.error('Error checking membership:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check membership'
    });
  }
};

// Join a league
const joinLeague = async (req, res) => {
  try {
    const { id } = req.params; // league id
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Check if user is already a member
    const { data: existingMembership } = await supabase
      .from('league_memberships')
      .select('*')
      .eq('league_id', id)
      .eq('user_id', user_id)
      .eq('is_active', true)
      .single();

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        error: 'User is already a member of this league'
      });
    }

    // Create membership
    const { data: membership, error: membershipError } = await supabase
      .from('league_memberships')
      .insert({
        league_id: id,
        user_id: user_id,
        role: 'player',
        is_active: true
      })
      .select()
      .single();

    if (membershipError) {
      throw membershipError;
    }

    // Create initial player stats
    const { data: playerStats, error: statsError } = await supabase
      .from('player_stats')
      .insert({
        user_id: user_id,
        league_id: id,
        games_played: 0,
        games_won: 0,
        games_lost: 0,
        total_points: 0,
        average_points: 0.0
      })
      .select()
      .single();

    if (statsError) {
      throw statsError;
    }

    res.json({
      success: true,
      data: {
        membership,
        playerStats
      }
    });

  } catch (error) {
    console.error('Error joining league:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join league'
    });
  }
};

// Get league members
const getLeagueMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: members, error } = await supabase
      .from('league_memberships')
      .select(`
        *,
        profiles (
          full_name,
          email,
          skill_level
        )
      `)
      .eq('league_id', id)
      .eq('is_active', true)
      .order('joined_at', { ascending: false });

    if (error) {
      throw error;
    }

    const formattedMembers = members.map(member => ({
      id: member.user_id,
      name: member.profiles.full_name,
      email: member.profiles.email,
      skillLevel: member.profiles.skill_level,
      role: member.role,
      joinedAt: member.joined_at
    }));

    res.json({
      success: true,
      data: formattedMembers
    });

  } catch (error) {
    console.error('Error fetching league members:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch league members'
    });
  }
};

module.exports = {
  getAllLeagues,
  getLeagueById,
  getLeagueTopPlayers,
  checkMembership,
  joinLeague,
  getLeagueMembers
};