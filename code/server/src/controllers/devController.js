// Development/Testing Controller
// ONLY AVAILABLE IN DEVELOPMENT MODE
// Provides simulation and cleanup endpoints for testing

const { createClient } = require('@supabase/supabase-js');
const { tryAutoAssignMatches } = require('./matchController');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Simulate bot players checking in
const simulateCheckIns = async (req, res) => {
  try {
    const { leagueNightId, count } = req.body;
    
    // Get the league night to find league_id
    const { data: leagueNight } = await supabase
      .from('league_night_instances')
      .select('league_id')
      .eq('id', leagueNightId)
      .single();

    if (!leagueNight) {
      return res.status(404).json({ error: 'League night not found' });
    }

    // Get league members
    const { data: members } = await supabase
      .from('league_memberships')
      .select('user_id, profiles(first_name, last_name)')
      .eq('league_id', leagueNight.league_id)
      .eq('is_active', true)
      .limit(count);

    if (!members || members.length === 0) {
      return res.status(400).json({ error: 'No league members available to check in' });
    }

    // Check in these users (if not already checked in)
    const checkIns = [];
    for (const member of members) {
      // Check if already checked in
      const { data: existing } = await supabase
        .from('league_night_checkins')
        .select('id')
        .eq('league_night_instance_id', leagueNightId)
        .eq('user_id', member.user_id)
        .eq('is_active', true)
        .maybeSingle();

      if (!existing) {
        const { data: checkin } = await supabase
          .from('league_night_checkins')
          .insert({
            league_night_instance_id: leagueNightId,
            user_id: member.user_id,
            checked_in_at: new Date().toISOString(),
            is_active: true
          })
          .select()
          .single();
        
        checkIns.push(checkin);
      }
    }

    res.json({ 
      success: true, 
      checkedIn: checkIns.length,
      message: `Checked in ${checkIns.length} bot players` 
    });
  } catch (error) {
    console.error('Error simulating check-ins:', error);
    res.status(500).json({ error: error.message });
  }
};

// Auto-create partnerships from checked-in players
const simulatePartnerships = async (req, res) => {
  try {
    const { leagueNightId } = req.body;

    // Get all checked-in players who aren't already in a partnership
    const { data: checkedIn } = await supabase
      .from('league_night_checkins')
      .select('user_id')
      .eq('league_night_instance_id', leagueNightId)
      .eq('is_active', true);

    if (!checkedIn || checkedIn.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 checked-in players' });
    }

    // Get players who aren't in a partnership
    const { data: existingPartnerships } = await supabase
      .from('confirmed_partnerships')
      .select('player1_id, player2_id')
      .eq('league_night_instance_id', leagueNightId)
      .eq('is_active', true);

    const partneredPlayers = new Set();
    existingPartnerships?.forEach(p => {
      partneredPlayers.add(p.player1_id);
      partneredPlayers.add(p.player2_id);
    });

    const availablePlayers = checkedIn
      .filter(c => !partneredPlayers.has(c.user_id))
      .map(c => c.user_id);

    if (availablePlayers.length < 2) {
      return res.status(400).json({ error: 'Not enough unpaired players' });
    }

    // Create partnerships (pair them up)
    const partnerships = [];
    for (let i = 0; i < availablePlayers.length - 1; i += 2) {
      const { data: partnership } = await supabase
        .from('confirmed_partnerships')
        .insert({
          league_night_instance_id: leagueNightId,
          player1_id: availablePlayers[i],
          player2_id: availablePlayers[i + 1],
          is_active: true,
          confirmed_at: new Date().toISOString()
        })
        .select()
        .single();

      partnerships.push(partnership);
    }

    // Try to auto-assign matches now that partnerships are created
    const autoAssignResult = await tryAutoAssignMatches(leagueNightId);
    console.log('Auto-assignment after simulating partnerships:', autoAssignResult);

    res.json({ 
      success: true, 
      partnerships: partnerships.length,
      message: `Created ${partnerships.length} partnerships`,
      autoAssignment: autoAssignResult
    });
  } catch (error) {
    console.error('Error simulating partnerships:', error);
    res.status(500).json({ error: error.message });
  }
};

// Complete a random active match with random score
const completeRandomMatch = async (req, res) => {
  try {
    const { leagueNightId } = req.body;

    // Get an active match
    const { data: match } = await supabase
      .from('matches')
      .select('*')
      .eq('league_night_instance_id', leagueNightId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (!match) {
      return res.status(400).json({ error: 'No active matches to complete' });
    }

    // Generate random score (15-11 to 15-13 for realistic pickleball)
    const winnerScore = 15;
    const loserScore = 11 + Math.floor(Math.random() * 3); // 11, 12, or 13
    const team1Wins = Math.random() > 0.5;

    const team1Score = team1Wins ? winnerScore : loserScore;
    const team2Score = team1Wins ? loserScore : winnerScore;

    // Update match
    const { data: completed } = await supabase
      .from('matches')
      .update({
        team1_score: team1Score,
        team2_score: team2Score,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', match.id)
      .select()
      .single();

    // Import and call auto-assignment (same as manual score submission)
    const { tryAutoAssignMatches } = require('./matchController');
    console.log(`Dev: Match ${match.id} completed, checking for new matches...`);
    const autoAssignResult = await tryAutoAssignMatches(match.league_night_instance_id);
    console.log('Dev: Auto-assignment after match completion:', autoAssignResult);

    res.json({ 
      success: true, 
      match: completed,
      autoAssignment: autoAssignResult,
      message: `Match completed: ${team1Score}-${team2Score}` 
    });
  } catch (error) {
    console.error('Error completing match:', error);
    res.status(500).json({ error: error.message });
  }
};

// Reset entire league night (delete all data)
const resetLeagueNight = async (req, res) => {
  try {
    const { leagueNightId } = req.params;

    // Delete in reverse dependency order
    await supabase
      .from('matches')
      .delete()
      .eq('league_night_instance_id', leagueNightId);

    await supabase
      .from('confirmed_partnerships')
      .delete()
      .eq('league_night_instance_id', leagueNightId);

    await supabase
      .from('partnership_requests')
      .delete()
      .eq('league_night_instance_id', leagueNightId);

    await supabase
      .from('league_night_checkins')
      .delete()
      .eq('league_night_instance_id', leagueNightId);

    // Reset league night status and auto-assignment
    await supabase
      .from('league_night_instances')
      .update({ 
        status: 'scheduled',
        auto_assignment_enabled: true 
      })
      .eq('id', leagueNightId);

    res.json({ 
      success: true, 
      message: 'League night reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting league night:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  simulateCheckIns,
  simulatePartnerships,
  completeRandomMatch,
  resetLeagueNight
};
