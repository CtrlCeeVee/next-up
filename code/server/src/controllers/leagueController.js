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
        league_memberships (
          user_id
        )
      `)
      .eq('is_active', true)
      .order('day_of_week', { referencedTable: 'league_days' });

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
        league_memberships (
          user_id
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .order('day_of_week', { referencedTable: 'league_days' })
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

    // Calculate average attendance
    // If no sessions with attendance data, return 0 (no history yet)
    const avgAttendance = totalSessions > 0 
      ? Math.round(totalAttendance / totalSessions) 
      : 0;

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

    const leagueStats = await Promise.all(playerStats.map(async (stat) => {
      totalGamesPlayed += stat.games_played;
      totalGamesWon += stat.games_won;
      totalPoints += stat.total_points;

      // Get total players in this league
      const { count: totalPlayers, error: countError } = await supabase
        .from('player_stats')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', stat.league_id);

      if (countError) {
        console.error('Error counting league players:', countError);
      }

      // Get player's ranking in this league (based on total_points)
      const { count: betterPlayers, error: rankError } = await supabase
        .from('player_stats')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', stat.league_id)
        .gt('total_points', stat.total_points);

      if (rankError) {
        console.error('Error calculating ranking:', rankError);
      }

      const ranking = (betterPlayers || 0) + 1;

      return {
        leagueId: stat.league_id,
        leagueName: stat.leagues.name,
        leagueLocation: stat.leagues.location,
        gamesPlayed: stat.games_played,
        gamesWon: stat.games_won,
        gamesLost: stat.games_lost,
        winRate: stat.games_played > 0 ? Math.round((stat.games_won / stat.games_played) * 100 * 10) / 10 : 0,
        averagePoints: stat.average_points,
        totalPoints: stat.total_points,
        totalPlayers: totalPlayers || 0,
        ranking: ranking
      };
    }));

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

// Get leaderboard for a league by category
const getLeagueLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    const { category = 'overall', user_id } = req.query;

    // Get league name
    const { data: league, error: leagueError } = await supabase
      .from('leagues')
      .select('name')
      .eq('id', id)
      .single();

    if (leagueError) throw leagueError;

    let players = [];
    let minGames = 0;

    if (category === 'games') {
      players = await computeGamesBoardLeaderboard(id);
    } else if (category === 'avg_score') {
      minGames = 5;
      players = await computeAvgScoreLeaderboard(id);
    } else if (category === 'win_streak') {
      players = await computeWinStreakLeaderboard(id);
    } else if (category === 'attendance') {
      players = await computeAttendanceLeaderboard(id);
    } else {
      // overall (default)
      minGames = 5;
      players = await computeOverallLeaderboard(id);
    }

    // Find current user's position and full data
    let currentUser = null;
    if (user_id) {
      const userIndex = players.findIndex(p => p.userId === user_id);
      if (userIndex !== -1) {
        currentUser = {
          ...players[userIndex],
          rank: userIndex + 1,
          gamesNeeded: 0
        };
      } else {
        // User not on board — check if they need more games
        const { data: userStats } = await supabase
          .from('player_stats')
          .select('*, profiles (first_name, last_name)')
          .eq('user_id', user_id)
          .eq('league_id', id)
          .single();

        const gamesPlayed = userStats?.games_played || 0;
        currentUser = {
          rank: null,
          userId: user_id,
          name: userStats?.profiles ? `${userStats.profiles.first_name} ${userStats.profiles.last_name}` : 'Unknown',
          value: 0,
          displayValue: '0',
          gamesPlayed: gamesPlayed,
          winRate: gamesPlayed > 0 ? Math.round((userStats.games_won / gamesPlayed) * 1000) / 10 : 0,
          avgPoints: parseFloat(userStats?.average_points) || 0,
          gamesNeeded: minGames > 0 ? Math.max(0, minGames - gamesPlayed) : 0
        };
      }
    }

    res.json({
      success: true,
      data: {
        category,
        leagueId: parseInt(id),
        leagueName: league.name,
        minGames,
        totalQualified: players.length,
        players: players.slice(0, 50),
        currentUser
      }
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
};

// --- Leaderboard computation helpers ---

async function computeGamesBoardLeaderboard(leagueId) {
  const { data: stats, error } = await supabase
    .from('player_stats')
    .select('*, profiles (first_name, last_name)')
    .eq('league_id', leagueId)
    .gt('games_played', 0)
    .order('games_played', { ascending: false });

  if (error) throw error;

  return stats.map((s, i) => ({
    rank: i + 1,
    userId: s.user_id,
    name: `${s.profiles.first_name} ${s.profiles.last_name}`,
    value: s.games_played,
    displayValue: `${s.games_played}`,
    gamesPlayed: s.games_played,
    winRate: s.games_played > 0 ? Math.round((s.games_won / s.games_played) * 1000) / 10 : 0,
    avgPoints: parseFloat(s.average_points) || 0
  }));
}

async function computeAvgScoreLeaderboard(leagueId) {
  const { data: stats, error } = await supabase
    .from('player_stats')
    .select('*, profiles (first_name, last_name)')
    .eq('league_id', leagueId)
    .gte('games_played', 5)
    .order('average_points', { ascending: false });

  if (error) throw error;

  return stats.map((s, i) => ({
    rank: i + 1,
    userId: s.user_id,
    name: `${s.profiles.first_name} ${s.profiles.last_name}`,
    value: parseFloat(s.average_points) || 0,
    displayValue: `${parseFloat(s.average_points).toFixed(1)}`,
    gamesPlayed: s.games_played,
    winRate: s.games_played > 0 ? Math.round((s.games_won / s.games_played) * 1000) / 10 : 0,
    avgPoints: parseFloat(s.average_points) || 0
  }));
}

async function computeOverallLeaderboard(leagueId) {
  const { data: stats, error } = await supabase
    .from('player_stats')
    .select('*, profiles (first_name, last_name)')
    .eq('league_id', leagueId)
    .gte('games_played', 5);

  if (error) throw error;
  if (!stats.length) return [];

  // Compute win rates and find max values for normalization
  const enriched = stats.map(s => ({
    ...s,
    winRate: s.games_played > 0 ? (s.games_won / s.games_played) * 100 : 0,
    avgPts: parseFloat(s.average_points) || 0
  }));

  const maxGames = Math.max(...enriched.map(s => s.games_played));
  const maxWinRate = Math.max(...enriched.map(s => s.winRate));
  const maxAvgPts = Math.max(...enriched.map(s => s.avgPts));

  // Composite score: 40% win rate + 30% avg points + 30% games played
  const scored = enriched.map(s => ({
    ...s,
    composite: (
      0.4 * (maxWinRate > 0 ? s.winRate / maxWinRate : 0) +
      0.3 * (maxAvgPts > 0 ? s.avgPts / maxAvgPts : 0) +
      0.3 * (maxGames > 0 ? s.games_played / maxGames : 0)
    ) * 100
  }));

  scored.sort((a, b) => b.composite - a.composite);

  return scored.map((s, i) => ({
    rank: i + 1,
    userId: s.user_id,
    name: `${s.profiles.first_name} ${s.profiles.last_name}`,
    value: Math.round(s.composite * 10) / 10,
    displayValue: `${(Math.round(s.composite * 10) / 10).toFixed(1)}`,
    gamesPlayed: s.games_played,
    winRate: Math.round(s.winRate * 10) / 10,
    avgPoints: s.avgPts
  }));
}

async function computeWinStreakLeaderboard(leagueId) {
  // Fetch all completed matches for this league
  const { data: matches, error: matchError } = await supabase
    .from('matches')
    .select(`
      id, team1_score, team2_score, completed_at,
      partnership1:confirmed_partnerships!matches_partnership1_id_fkey (player1_id, player2_id),
      partnership2:confirmed_partnerships!matches_partnership2_id_fkey (player1_id, player2_id),
      league_night_instances!inner (league_id)
    `)
    .eq('status', 'completed')
    .eq('league_night_instances.league_id', leagueId)
    .order('completed_at', { ascending: true });

  if (matchError) throw matchError;

  // Build per-user chronological results
  const userResults = {};

  for (const match of matches) {
    if (!match.partnership1 || !match.partnership2) continue;
    const team1Won = match.team1_score > match.team2_score;
    const team1Players = [match.partnership1.player1_id, match.partnership1.player2_id];
    const team2Players = [match.partnership2.player1_id, match.partnership2.player2_id];

    for (const uid of team1Players) {
      if (!uid) continue;
      if (!userResults[uid]) userResults[uid] = [];
      userResults[uid].push(team1Won ? 'W' : 'L');
    }
    for (const uid of team2Players) {
      if (!uid) continue;
      if (!userResults[uid]) userResults[uid] = [];
      userResults[uid].push(team1Won ? 'L' : 'W');
    }
  }

  // Compute best streak per user
  const streaks = [];
  for (const [userId, results] of Object.entries(userResults)) {
    let bestStreak = 0;
    let current = 0;
    for (const r of results) {
      if (r === 'W') {
        current++;
        if (current > bestStreak) bestStreak = current;
      } else {
        current = 0;
      }
    }
    if (bestStreak > 0) {
      streaks.push({ userId, bestStreak, gamesPlayed: results.length });
    }
  }

  streaks.sort((a, b) => b.bestStreak - a.bestStreak || b.gamesPlayed - a.gamesPlayed);

  // Fetch profile names for top results
  const topUserIds = streaks.slice(0, 50).map(s => s.userId);
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', topUserIds);

  const profileMap = {};
  for (const p of (profiles || [])) {
    profileMap[p.id] = `${p.first_name} ${p.last_name}`;
  }

  // Get player_stats for win rate / avg points context
  const { data: allStats } = await supabase
    .from('player_stats')
    .select('user_id, games_played, games_won, average_points')
    .eq('league_id', leagueId)
    .in('user_id', topUserIds);

  const statsMap = {};
  for (const s of (allStats || [])) {
    statsMap[s.user_id] = s;
  }

  return streaks.slice(0, 50).map((s, i) => {
    const stat = statsMap[s.userId] || {};
    return {
      rank: i + 1,
      userId: s.userId,
      name: profileMap[s.userId] || 'Unknown',
      value: s.bestStreak,
      displayValue: `${s.bestStreak}`,
      gamesPlayed: stat.games_played || s.gamesPlayed,
      winRate: stat.games_played > 0 ? Math.round((stat.games_won / stat.games_played) * 1000) / 10 : 0,
      avgPoints: parseFloat(stat.average_points) || 0
    };
  });
}

async function computeAttendanceLeaderboard(leagueId) {
  // Fetch all checkins for this league with night dates
  const { data: checkins, error } = await supabase
    .from('league_night_checkins')
    .select(`
      user_id,
      league_night_instances!inner (league_id, date)
    `)
    .eq('league_night_instances.league_id', leagueId);

  if (error) throw error;

  // Group by user → set of ISO week strings
  const userWeeks = {};
  for (const c of checkins) {
    const uid = c.user_id;
    const date = new Date(c.league_night_instances.date);
    // Get ISO week: year-week format
    const jan1 = new Date(date.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((date - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    const weekKey = `${date.getFullYear()}-W${weekNum}`;

    if (!userWeeks[uid]) userWeeks[uid] = new Set();
    userWeeks[uid].add(weekKey);
  }

  // Compute longest consecutive week streak per user
  const streaks = [];
  for (const [userId, weekSet] of Object.entries(userWeeks)) {
    const weeks = Array.from(weekSet).sort();
    let bestStreak = 1;
    let current = 1;

    for (let i = 1; i < weeks.length; i++) {
      const [prevYear, prevW] = weeks[i - 1].split('-W').map(Number);
      const [curYear, curW] = weeks[i].split('-W').map(Number);

      // Check if consecutive week (handle year boundary)
      const isConsecutive =
        (curYear === prevYear && curW === prevW + 1) ||
        (curYear === prevYear + 1 && prevW >= 52 && curW === 1);

      if (isConsecutive) {
        current++;
        if (current > bestStreak) bestStreak = current;
      } else {
        current = 1;
      }
    }

    streaks.push({ userId, bestStreak, totalWeeks: weeks.length });
  }

  streaks.sort((a, b) => b.bestStreak - a.bestStreak || b.totalWeeks - a.totalWeeks);

  // Fetch profile names
  const topUserIds = streaks.slice(0, 50).map(s => s.userId);
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', topUserIds);

  const profileMap = {};
  for (const p of (profiles || [])) {
    profileMap[p.id] = `${p.first_name} ${p.last_name}`;
  }

  // Get player_stats for context
  const { data: allStats } = await supabase
    .from('player_stats')
    .select('user_id, games_played, games_won, average_points')
    .eq('league_id', leagueId)
    .in('user_id', topUserIds);

  const statsMap = {};
  for (const s of (allStats || [])) {
    statsMap[s.user_id] = s;
  }

  return streaks.slice(0, 50).map((s, i) => {
    const stat = statsMap[s.userId] || {};
    return {
      rank: i + 1,
      userId: s.userId,
      name: profileMap[s.userId] || 'Unknown',
      value: s.bestStreak,
      displayValue: `${s.bestStreak} wk${s.bestStreak !== 1 ? 's' : ''}`,
      gamesPlayed: stat.games_played || 0,
      winRate: stat.games_played > 0 ? Math.round((stat.games_won / stat.games_played) * 1000) / 10 : 0,
      avgPoints: parseFloat(stat.average_points) || 0
    };
  });
}

module.exports = {
  getAllLeagues,
  getLeagueById,
  getLeagueTopPlayers,
  getLeagueLeaderboard,
  checkMembership,
  joinLeague,
  getLeagueMembers,
  getLeagueStats,
  getPlayerStats
};