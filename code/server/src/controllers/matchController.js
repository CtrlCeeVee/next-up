// Match Controller
// Handles all match assignment and scoring operations

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Auto-assignment function - centralized logic for creating matches automatically
const tryAutoAssignMatches = async (instanceId) => {
  try {
    console.log(`Attempting auto-assignment for instance ${instanceId}`);
    
    // Get partnerships with game counts
    const { data: partnerships, error: partnershipsError } = await supabase
      .rpc('get_partnerships_with_game_counts', { instance_id: instanceId });

    if (partnershipsError) {
      console.error('Error fetching partnerships for auto-assignment:', partnershipsError);
      return { success: false, error: partnershipsError.message };
    }

    if (!partnerships || partnerships.length < 2) {
      console.log(`Not enough partnerships for auto-assignment: ${partnerships?.length || 0}`);
      return { success: true, message: 'Not enough partnerships', matches: [] };
    }

    // Get available courts
    const { data: availableCourts, error: courtsError } = await supabase
      .rpc('get_available_courts', { instance_id: instanceId });

    if (courtsError) {
      console.error('Error fetching courts for auto-assignment:', courtsError);
      return { success: false, error: courtsError.message };
    }

    if (!availableCourts || availableCourts.length === 0) {
      console.log('No available courts for auto-assignment');
      return { success: true, message: 'No courts available', matches: [] };
    }

    // Fair queue system: Assign new partnerships the current minimum games played
    // This prevents late joiners from getting unfair priority
    const minGamesPlayed = Math.min(...partnerships.map(p => p.games_played_tonight));
    
    const adjustedPartnerships = partnerships.map(partnership => ({
      ...partnership,
      // If a partnership has 0 games (new), set it to current minimum to ensure fairness
      effective_games: partnership.games_played_tonight === 0 ? minGamesPlayed : partnership.games_played_tonight
    }));

    // Sort by effective games played (ascending) then by skill level for variety
    const sortedPartnerships = adjustedPartnerships.sort((a, b) => {
      if (a.effective_games !== b.effective_games) {
        return a.effective_games - b.effective_games;
      }
      // If same effective games, mix skill levels for variety
      return Math.random() - 0.5;
    });

    // Calculate how many matches we can create
    const maxPossibleMatches = Math.floor(sortedPartnerships.length / 2);
    const maxCourtMatches = availableCourts.length;
    const matchesToCreateCount = Math.min(maxPossibleMatches, maxCourtMatches);

    if (matchesToCreateCount === 0) {
      return { success: true, message: 'Unable to create matches', matches: [] };
    }

    // Create matches for available courts
    const matchesToCreate = [];
    const courtsToUse = availableCourts.slice(0, matchesToCreateCount);

    for (let i = 0; i < courtsToUse.length && (i * 2 + 1) < sortedPartnerships.length; i++) {
      const partnership1 = sortedPartnerships[i * 2];
      const partnership2 = sortedPartnerships[i * 2 + 1];
      const court = courtsToUse[i];

      matchesToCreate.push({
        league_night_instance_id: instanceId,
        partnership1_id: partnership1.partnership_id,
        partnership2_id: partnership2.partnership_id,
        court_number: court.court_number,
        status: 'active'
      });
    }

    if (matchesToCreate.length === 0) {
      return { success: true, message: 'No matches to create', matches: [] };
    }

    // Insert matches into database
    const { data: createdMatches, error: insertError } = await supabase
      .from('matches')
      .insert(matchesToCreate)
      .select(`
        *,
        partnership1:confirmed_partnerships!partnership1_id (
          player1:profiles!player1_id (first_name, last_name),
          player2:profiles!player2_id (first_name, last_name)
        ),
        partnership2:confirmed_partnerships!partnership2_id (
          player1:profiles!player1_id (first_name, last_name),
          player2:profiles!player2_id (first_name, last_name)
        )
      `);

    if (insertError) {
      console.error('Error creating matches in auto-assignment:', insertError);
      return { success: false, error: insertError.message };
    }

    console.log(`Auto-assignment successful: Created ${createdMatches.length} matches`);
    return {
      success: true,
      matches: createdMatches,
      message: `Auto-assigned ${createdMatches.length} match(es)`
    };

  } catch (error) {
    console.error('Unexpected error in auto-assignment:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to get league night instance with auto-start functionality
const getOrCreateLeagueNightInstance = async (leagueId, nightId, forceToday = false) => {
  try {
    // First, try to get existing instance by ID
    if (nightId && !nightId.startsWith('night-')) {
      const { data: instance, error } = await supabase
        .from('league_night_instances')
        .select('*')
        .eq('id', nightId)
        .single();
      
      if (!error && instance) {
        // Check if league night should auto-start
        const updatedInstance = await checkAndAutoStartLeagueNight(instance);
        return updatedInstance;
      }
    }

    // If nightId is in format 'night-0', 'night-1', derive from league_days
    const nightIndex = parseInt(nightId.replace('night-', ''));
    
    // Get the league day template
    const { data: leagueDays, error: leagueDaysError } = await supabase
      .from('league_days')
      .select('*')
      .eq('league_id', leagueId)
      .order('day_of_week');

    if (leagueDaysError || !leagueDays || leagueDays.length <= nightIndex) {
      throw new Error('League day not found');
    }

    const leagueDay = leagueDays[nightIndex];
    
    // Calculate the date for this league night
    const today = new Date();
    const targetDay = leagueDay.day_of_week;
    const todayDay = today.getDay() || 7; // Convert Sunday(0) to 7
    
    let daysUntilTarget = targetDay - todayDay;
    
    // For testing purposes, if forceToday is true, create instance for today regardless of day
    if (forceToday) {
      daysUntilTarget = 0;
    } else {
      // If today IS the target day, create instance for today
      // Otherwise, create for next occurrence
      if (daysUntilTarget < 0) {
        daysUntilTarget += 7;
      }
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    const dateStr = targetDate.toISOString().split('T')[0];

    // Check if instance already exists for this date
    const { data: existingInstance, error: existingError } = await supabase
      .from('league_night_instances')
      .select('*')
      .eq('league_id', leagueId)
      .eq('date', dateStr)
      .single();

    if (!existingError && existingInstance) {
      // Check if league night should auto-start
      const updatedInstance = await checkAndAutoStartLeagueNight(existingInstance);
      return updatedInstance;
    }

    // Create new instance
    const { data: newInstance, error: createError } = await supabase
      .from('league_night_instances')
      .insert({
        league_id: leagueId,
        day_of_week: leagueDay.day_of_week,
        date: dateStr,
        start_time: leagueDay.start_time,
        courts_available: leagueDay.total_courts,
        court_labels: leagueDay.court_labels,
        status: 'scheduled'
      })
      .select()
      .single();

    if (createError) throw createError;
    
    // Check if this new instance should auto-start
    const updatedInstance = await checkAndAutoStartLeagueNight(newInstance);
    return updatedInstance;

  } catch (error) {
    console.error('Error getting/creating league night instance:', error);
    throw error;
  }
};

// Auto-start league night when current time >= start time on the correct day
const checkAndAutoStartLeagueNight = async (instance) => {
  try {
    // Only check if status is still 'scheduled'
    if (instance.status !== 'scheduled') {
      return instance;
    }

    const now = new Date();
    const instanceDate = new Date(instance.date);
    const [startHour, startMinute] = instance.start_time.split(':').map(Number);
    
    // Create start time for the instance date
    const startTime = new Date(instanceDate);
    startTime.setHours(startHour, startMinute, 0, 0);
    
    // Check if current time is past start time and it's the correct date
    const todayStr = now.toISOString().split('T')[0];
    const instanceDateStr = instanceDate.toISOString().split('T')[0];
    
    if (todayStr === instanceDateStr && now >= startTime) {
      console.log(`Auto-starting league night ${instance.id} - time: ${now.toISOString()}, start: ${startTime.toISOString()}`);
      
      // Update instance status to 'active'
      const { data: updatedInstance, error: updateError } = await supabase
        .from('league_night_instances')
        .update({ 
          status: 'active',
          auto_started_at: now.toISOString()
        })
        .eq('id', instance.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error auto-starting league night:', updateError);
        return instance;
      }

      // Try to create initial matches if partnerships exist
      console.log(`League night ${instance.id} auto-started, checking for partnerships...`);
      const autoAssignResult = await tryAutoAssignMatches(instance.id);
      console.log('Initial auto-assignment result:', autoAssignResult);
      
      return updatedInstance;
    }
    
    return instance;
  } catch (error) {
    console.error('Error in checkAndAutoStartLeagueNight:', error);
    return instance;
  }
};

// GET /api/leagues/:leagueId/nights/:nightId/matches
const getMatches = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    // Get all matches for this league night with partnership details
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        *,
        partnership1:confirmed_partnerships!partnership1_id (
          id,
          player1:profiles!player1_id (id, first_name, last_name, skill_level),
          player2:profiles!player2_id (id, first_name, last_name, skill_level)
        ),
        partnership2:confirmed_partnerships!partnership2_id (
          id,
          player1:profiles!player1_id (id, first_name, last_name, skill_level),
          player2:profiles!player2_id (id, first_name, last_name, skill_level)
        )
      `)
      .eq('league_night_instance_id', instance.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: matches || []
    });

  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch matches'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/create-matches
const createMatches = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    console.log('Creating matches for league:', leagueId, 'night:', nightId);

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);
    console.log('League night instance:', instance.id);

    // Get partnerships with game counts (using our helper function)
    const { data: partnerships, error: partnershipsError } = await supabase
      .rpc('get_partnerships_with_game_counts', { instance_id: instance.id });

    console.log('Partnerships result:', { partnerships, partnershipsError });

    if (partnershipsError) {
      console.error('Partnerships error:', partnershipsError);
      throw partnershipsError;
    }

    if (!partnerships || partnerships.length < 2) {
      console.log('Not enough partnerships:', partnerships?.length || 0);
      return res.status(400).json({
        success: false,
        error: 'Need at least 2 partnerships to create matches'
      });
    }

    // Get available courts
    const { data: availableCourts, error: courtsError } = await supabase
      .rpc('get_available_courts', { instance_id: instance.id });

    console.log('Courts result:', { availableCourts, courtsError });

    if (courtsError) {
      console.error('Courts error:', courtsError);
      throw courtsError;
    }

    // Get total courts and current usage
    const { data: leagueNightData, error: leagueNightError } = await supabase
      .from('league_night_instances')
      .select('courts_available')
      .eq('id', instance.id)
      .single();

    if (leagueNightError) throw leagueNightError;

    const totalCourts = leagueNightData.courts_available;
    const courtsInUse = totalCourts - (availableCourts?.length || 0);

    if (!availableCourts || availableCourts.length === 0) {
      // Enhanced response when no courts available
      return res.status(200).json({
        success: true,
        data: {
          matches: [],
          message: 'All courts are currently occupied',
          partnershipsWaiting: partnerships.length,
          queueInfo: {
            totalPartnerships: partnerships.length,
            availableCourts: 0,
            courtsInUse: courtsInUse,
            totalCourts: totalCourts,
            nextAvailable: 'When any match finishes'
          }
        }
      });
    }

    // Sort partnerships by games played (ascending) then by skill level for variety
    const sortedPartnerships = [...partnerships].sort((a, b) => {
      if (a.games_played_tonight !== b.games_played_tonight) {
        return a.games_played_tonight - b.games_played_tonight;
      }
      // If same games played, mix skill levels for variety
      return Math.random() - 0.5;
    });

    // Calculate how many matches we can create
    const maxPossibleMatches = Math.floor(sortedPartnerships.length / 2);
    const maxCourtMatches = availableCourts.length;
    const matchesToCreateCount = Math.min(maxPossibleMatches, maxCourtMatches);

    if (matchesToCreateCount === 0) {
      return res.status(200).json({
        success: true,
        data: {
          matches: [],
          message: 'Need at least 2 partnerships to create matches',
          partnershipsWaiting: partnerships.length,
          queueInfo: {
            totalPartnerships: partnerships.length,
            availableCourts: availableCourts.length,
            courtsInUse: courtsInUse,
            totalCourts: totalCourts,
            reason: 'Insufficient partnerships'
          }
        }
      });
    }

    // Create matches for available courts
    const matchesToCreate = [];
    const courtsToUse = availableCourts.slice(0, matchesToCreateCount);

    for (let i = 0; i < courtsToUse.length && (i * 2 + 1) < sortedPartnerships.length; i++) {
      const partnership1 = sortedPartnerships[i * 2];
      const partnership2 = sortedPartnerships[i * 2 + 1];
      const court = courtsToUse[i];

      matchesToCreate.push({
        league_night_instance_id: instance.id,
        partnership1_id: partnership1.partnership_id,
        partnership2_id: partnership2.partnership_id,
        court_number: court.court_number,
        status: 'active'
      });
    }

    if (matchesToCreate.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Unable to create any matches with current partnerships'
      });
    }

    // Insert matches into database
    const { data: createdMatches, error: insertError } = await supabase
      .from('matches')
      .insert(matchesToCreate)
      .select(`
        *,
        partnership1:confirmed_partnerships!partnership1_id (
          player1:profiles!player1_id (first_name, last_name),
          player2:profiles!player2_id (first_name, last_name)
        ),
        partnership2:confirmed_partnerships!partnership2_id (
          player1:profiles!player1_id (first_name, last_name),
          player2:profiles!player2_id (first_name, last_name)
        )
      `);

    if (insertError) throw insertError;

    // Calculate queue information
    const partnershipsUsed = createdMatches.length * 2;
    const partnershipsWaiting = Math.max(0, sortedPartnerships.length - partnershipsUsed);
    const courtsStillAvailable = availableCourts.length - createdMatches.length;
    const totalCourtsInUse = courtsInUse + createdMatches.length;

    res.json({
      success: true,
      data: {
        matches: createdMatches,
        message: `Created ${createdMatches.length} match${createdMatches.length === 1 ? '' : 'es'}`,
        partnershipsWaiting,
        queueInfo: {
          totalPartnerships: partnerships.length,
          partnershipsInMatches: partnershipsUsed,
          partnershipsWaiting,
          courtsAvailable: courtsStillAvailable,
          courtsInUse: totalCourtsInUse,
          totalCourts: totalCourts,
          nextMatchPossible: partnershipsWaiting >= 2 && courtsStillAvailable > 0
        }
      }
    });

  } catch (error) {
    console.error('Error creating matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create matches'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/submit-score
const submitMatchScore = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { match_id, team1_score, team2_score, user_id } = req.body;

    if (!match_id || team1_score === undefined || team2_score === undefined || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Match ID, both scores, and user ID are required'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    // Get the match and verify user is part of it
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        partnership1:confirmed_partnerships!partnership1_id (player1_id, player2_id),
        partnership2:confirmed_partnerships!partnership2_id (player1_id, player2_id)
      `)
      .eq('id', match_id)
      .eq('league_night_instance_id', instance.id)
      .eq('status', 'active')
      .single();

    if (matchError || !match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found or not active'
      });
    }

    // Verify user is part of this match
    const isPlayerInMatch = 
      match.partnership1.player1_id === user_id ||
      match.partnership1.player2_id === user_id ||
      match.partnership2.player1_id === user_id ||
      match.partnership2.player2_id === user_id;

    if (!isPlayerInMatch) {
      return res.status(403).json({
        success: false,
        error: 'User is not part of this match'
      });
    }

    // Validate score format
    const score1 = parseInt(team1_score);
    const score2 = parseInt(team2_score);

    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
      return res.status(400).json({
        success: false,
        error: 'Scores must be valid positive numbers'
      });
    }

    // Validate pickleball scoring rules: First to 15, win by 2
    const isValidScore = validatePickleballScore(score1, score2);
    if (!isValidScore.valid) {
      return res.status(400).json({
        success: false,
        error: isValidScore.message
      });
    }

    // Determine winning team
    const team1Won = score1 > score2;
    const team2Won = score2 > score1;

    // Update match with scores and mark as completed
    const { data: updatedMatch, error: updateError } = await supabase
      .from('matches')
      .update({
        team1_score: score1,
        team2_score: score2,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', match_id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update player statistics
    await updatePlayerStats(instance.league_id, match, score1, score2, team1Won);

    res.json({
      success: true,
      data: {
        match: updatedMatch,
        message: 'Match score submitted successfully'
      }
    });

  } catch (error) {
    console.error('Error submitting match score:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit match score'
    });
  }
};

// Helper function to validate pickleball scoring rules
const validatePickleballScore = (score1, score2) => {
  // Basic rules: First to 15, win by 2, minimum score difference for winner
  const maxScore = Math.max(score1, score2);
  const minScore = Math.min(score1, score2);
  const scoreDiff = maxScore - minScore;

  // Game must have a winner (scores can't be tied)
  if (score1 === score2) {
    return {
      valid: false,
      message: 'Game cannot end in a tie'
    };
  }

  // Winner must reach at least 15 points
  if (maxScore < 15) {
    return {
      valid: false,
      message: 'Winning score must be at least 15 points'
    };
  }

  // Must win by at least 2 points
  if (scoreDiff < 2) {
    return {
      valid: false,
      message: 'Must win by at least 2 points'
    };
  }

  // If losing team has 13+ points, winner needs exactly 2 point lead
  if (minScore >= 13 && scoreDiff !== 2) {
    return {
      valid: false,
      message: 'When opponent has 13+ points, must win by exactly 2'
    };
  }

  return { valid: true };
};

// Helper function to update player statistics
const updatePlayerStats = async (leagueId, match, team1Score, team2Score, team1Won) => {
  try {
    const team1Players = [match.partnership1.player1_id, match.partnership1.player2_id];
    const team2Players = [match.partnership2.player1_id, match.partnership2.player2_id];

    // Update stats for all 4 players
    const playersToUpdate = [
      // Team 1 players
      ...team1Players.map(playerId => ({
        user_id: playerId,
        league_id: leagueId,
        points_scored: team1Score,
        won: team1Won
      })),
      // Team 2 players
      ...team2Players.map(playerId => ({
        user_id: playerId,
        league_id: leagueId,
        points_scored: team2Score,
        won: !team1Won
      }))
    ];

    // Update each player's stats
    for (const player of playersToUpdate) {
      await updateSinglePlayerStats(player);
    }

  } catch (error) {
    console.error('Error updating player stats:', error);
    // Don't throw error here - we don't want to fail score submission if stats update fails
  }
};

// Helper function to update individual player stats
const updateSinglePlayerStats = async ({ user_id, league_id, points_scored, won }) => {
  try {
    // Get existing stats or create new record
    let { data: existingStats, error: fetchError } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', user_id)
      .eq('league_id', league_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw fetchError;
    }

    if (!existingStats) {
      // Create new stats record
      const { error: insertError } = await supabase
        .from('player_stats')
        .insert({
          user_id,
          league_id,
          games_played: 1,
          games_won: won ? 1 : 0,
          games_lost: won ? 0 : 1,
          total_points: points_scored,
          average_points: points_scored
        });

      if (insertError) throw insertError;
    } else {
      // Update existing stats
      const newGamesPlayed = existingStats.games_played + 1;
      const newGamesWon = existingStats.games_won + (won ? 1 : 0);
      const newGamesLost = existingStats.games_lost + (won ? 0 : 1);
      const newTotalPoints = existingStats.total_points + points_scored;
      const newAveragePoints = newTotalPoints / newGamesPlayed;

      const { error: updateError } = await supabase
        .from('player_stats')
        .update({
          games_played: newGamesPlayed,
          games_won: newGamesWon,
          games_lost: newGamesLost,
          total_points: newTotalPoints,
          average_points: Math.round(newAveragePoints * 100) / 100 // Round to 2 decimal places
        })
        .eq('user_id', user_id)
        .eq('league_id', league_id);

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error(`Error updating stats for user ${user_id}:`, error);
    throw error;
  }
};

module.exports = {
  getMatches,
  createMatches,
  submitMatchScore,
  tryAutoAssignMatches
};