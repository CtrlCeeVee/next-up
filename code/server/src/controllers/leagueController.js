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

module.exports = {
  getAllLeagues,
  getLeagueById,
  getLeagueTopPlayers
};