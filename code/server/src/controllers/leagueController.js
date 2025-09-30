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
          first_name,
          last_name,
          email
        )
      `)
      .eq('league_id', id)
      .order('average_points', { ascending: false })
      .limit(10); // Get top 10 instead of just 3

    if (error) {
      throw error;
    }

    const formattedPlayers = topPlayers.map((player, index) => ({
      id: player.user_id,
      name: `${player.profiles.first_name} ${player.profiles.last_name}`,
      email: player.profiles.email,
      avgScore: player.average_points,
      gamesPlayed: player.games_played,
      winRate: player.games_played > 0 ? Math.round((player.games_won / player.games_played) * 100 * 10) / 10 : 0, // Round to 1 decimal place
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
          first_name,
          last_name,
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
      name: `${member.profiles.first_name} ${member.profiles.last_name}`,
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

// Get league statistics
const getLeagueStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Get total members count
    const { data: membersData, error: membersError } = await supabase
      .from('league_memberships')
      .select('id')
      .eq('league_id', id)
      .eq('is_active', true);

    if (membersError) throw membersError;

    // Get total games played
    const { data: gamesData, error: gamesError } = await supabase
      .from('matches')
      .select(`
        id,
        league_night_instances!inner (
          league_id
        )
      `)
      .eq('league_night_instances.league_id', id)
      .eq('status', 'completed');

    if (gamesError) throw gamesError;

    // Get league night instances to calculate average attendance
    // First, let's check both completed and active instances for better data
    const { data: instancesData, error: instancesError } = await supabase
      .from('league_night_instances')
      .select(`
        id,
        date,
        status,
        league_night_checkins (
          id
        )
      `)
      .eq('league_id', id)
      .in('status', ['completed', 'active']); // Include both completed and active sessions

    if (instancesError) throw instancesError;

    // Calculate average attendance
    let totalAttendance = 0;
    let totalSessions = 0;

    // Only count sessions that have at least one check-in
    if (instancesData && instancesData.length > 0) {
      const sessionsWithAttendance = instancesData.filter(instance => 
        instance.league_night_checkins && instance.league_night_checkins.length > 0
      );
      
      totalSessions = sessionsWithAttendance.length;
      totalAttendance = sessionsWithAttendance.reduce((sum, instance) => {
        return sum + (instance.league_night_checkins?.length || 0);
      }, 0);
    }

    // If no sessions with attendance data, use member count as a reasonable estimate
    const avgAttendance = totalSessions > 0 
      ? Math.round(totalAttendance / totalSessions) 
      : Math.round((membersData?.length || 0) * 0.7); // Assume 70% attendance rate as default

    const stats = {
      totalMembers: membersData?.length || 0,
      totalGamesPlayed: gamesData?.length || 0,
      averageAttendance: avgAttendance
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching league statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch league statistics'
    });
  }
};

// Get player statistics across all their leagues
const getPlayerStats = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get player stats for all leagues they're a member of
    const { data: playerStats, error: statsError } = await supabase
      .from('player_stats')
      .select(`
        *,
        leagues (
          id,
          name,
          location
        )
      `)
      .eq('user_id', user_id);

    if (statsError) throw statsError;

    // Get overall totals across all leagues
    let totalGamesPlayed = 0;
    let totalGamesWon = 0;
    let totalPoints = 0;
    let totalLeagues = playerStats.length;

    const leagueStats = playerStats.map(stat => {
      totalGamesPlayed += stat.games_played;
      totalGamesWon += stat.games_won;
      totalPoints += stat.total_points;

      return {
        leagueId: stat.league_id,
        leagueName: stat.leagues.name,
        leagueLocation: stat.leagues.location,
        gamesPlayed: stat.games_played,
        gamesWon: stat.games_won,
        gamesLost: stat.games_lost,
        winRate: stat.games_played > 0 ? Math.round((stat.games_won / stat.games_played) * 100 * 10) / 10 : 0,
        averagePoints: stat.average_points,
        totalPoints: stat.total_points
      };
    });

    // Calculate overall statistics
    const overallWinRate = totalGamesPlayed > 0 ? Math.round((totalGamesWon / totalGamesPlayed) * 100 * 10) / 10 : 0;
    const overallAvgPoints = totalGamesPlayed > 0 ? Math.round((totalPoints / totalGamesPlayed) * 10) / 10 : 0;

    const response = {
      overall: {
        totalLeagues: totalLeagues,
        totalGamesPlayed: totalGamesPlayed,
        totalGamesWon: totalGamesWon,
        totalGamesLost: totalGamesPlayed - totalGamesWon,
        overallWinRate: overallWinRate,
        overallAvgPoints: overallAvgPoints,
        totalPoints: totalPoints
      },
      leagueStats: leagueStats
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching player statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch player statistics'
    });
  }
};

module.exports = {
  getAllLeagues,
  getLeagueById,
  getLeagueTopPlayers,
  checkMembership,
  joinLeague,
  getLeagueMembers,
  getLeagueStats,
  getPlayerStats
};