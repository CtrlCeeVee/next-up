// League Night Controller
// Handles all league night instance operations - check-ins, partnerships, etc.

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper function to create league night instance if it doesn't exist
const getOrCreateLeagueNightInstance = async (leagueId, nightId, forceToday = false) => {
  try {
    // First, try to get existing instance by ID
    if (nightId && !nightId.startsWith('night-')) {
      const { data: instance, error } = await supabase
        .from('league_night_instances')
        .select('*')
        .eq('id', nightId)
        .single();
      
      if (!error && instance) return instance;
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
      return existingInstance;
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
    return newInstance;

  } catch (error) {
    console.error('Error getting/creating league night instance:', error);
    throw error;
  }
};

// GET /api/leagues/:leagueId/nights/:nightId
const getLeagueNight = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { forceToday } = req.query; // Check for testing parameter

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId, forceToday === 'true');

    // Get check-in count for this night
    const { data: checkins, error: checkinsError } = await supabase
      .from('league_night_checkins')
      .select('id')
      .eq('league_night_instance_id', instance.id)
      .eq('is_active', true);

    if (checkinsError) throw checkinsError;

    // Get partnership count
    const { data: partnerships, error: partnershipsError } = await supabase
      .from('confirmed_partnerships')
      .select('id')
      .eq('league_night_instance_id', instance.id)
      .eq('is_active', true);

    if (partnershipsError) throw partnershipsError;

    // Format response
    const response = {
      id: instance.id,
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][instance.day_of_week],
      time: instance.start_time,
      date: instance.date,
      status: instance.status,
      courtsAvailable: instance.courts_available,
      checkedInCount: checkins.length,
      partnershipsCount: partnerships.length,
      possibleGames: Math.floor(partnerships.length / 2) * 2 // Each partnership can play against another
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching league night:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch league night'
    });
  }
};

// GET /api/leagues/:leagueId/nights/:nightId/checkins
const getCheckedInPlayers = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    const { data: checkins, error } = await supabase
      .from('league_night_checkins')
      .select(`
        *,
        profiles (
          id,
          full_name,
          email,
          skill_level
        )
      `)
      .eq('league_night_instance_id', instance.id)
      .eq('is_active', true)
      .order('checked_in_at');

    if (error) throw error;

    // Get partnerships to determine who has partners
    const { data: partnerships, error: partnershipsError } = await supabase
      .from('confirmed_partnerships')
      .select('player1_id, player2_id')
      .eq('league_night_instance_id', instance.id)
      .eq('is_active', true);

    if (partnershipsError) throw partnershipsError;

    // Create partnership lookup
    const partnershipMap = new Map();
    partnerships.forEach(p => {
      partnershipMap.set(p.player1_id, p.player2_id);
      partnershipMap.set(p.player2_id, p.player1_id);
    });

    const formattedPlayers = checkins.map(checkin => ({
      id: checkin.profiles.id,
      name: checkin.profiles.full_name,
      email: checkin.profiles.email,
      skillLevel: checkin.profiles.skill_level || 'Intermediate',
      checkedInAt: checkin.checked_in_at,
      hasPartner: partnershipMap.has(checkin.profiles.id),
      partnerId: partnershipMap.get(checkin.profiles.id) || null
    }));

    res.json({
      success: true,
      data: formattedPlayers
    });

  } catch (error) {
    console.error('Error fetching checked-in players:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch checked-in players'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/checkin
const checkInPlayer = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    // Check if user is already checked in
    const { data: existingCheckin, error: existingError } = await supabase
      .from('league_night_checkins')
      .select('*')
      .eq('league_night_instance_id', instance.id)
      .eq('user_id', user_id)
      .eq('is_active', true)
      .single();

    if (!existingError && existingCheckin) {
      return res.status(400).json({
        success: false,
        error: 'User is already checked in'
      });
    }

    // Create check-in
    const { data: checkin, error: checkinError } = await supabase
      .from('league_night_checkins')
      .insert({
        league_night_instance_id: instance.id,
        user_id: user_id,
        is_active: true
      })
      .select()
      .single();

    if (checkinError) throw checkinError;

    res.json({
      success: true,
      data: {
        checkin,
        message: 'Successfully checked in to league night'
      }
    });

  } catch (error) {
    console.error('Error checking in player:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check in player'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/partnership
const createPartnership = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { player1_id, player2_id } = req.body;

    if (!player1_id || !player2_id) {
      return res.status(400).json({
        success: false,
        error: 'Both player IDs are required'
      });
    }

    if (player1_id === player2_id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot partner with yourself'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    // Check if both players are checked in
    const { data: checkins, error: checkinsError } = await supabase
      .from('league_night_checkins')
      .select('user_id')
      .eq('league_night_instance_id', instance.id)
      .in('user_id', [player1_id, player2_id])
      .eq('is_active', true);

    if (checkinsError) throw checkinsError;

    if (checkins.length !== 2) {
      return res.status(400).json({
        success: false,
        error: 'Both players must be checked in to form a partnership'
      });
    }

    // Check if either player already has a partnership
    const { data: existingPartnerships, error: existingError } = await supabase
      .from('confirmed_partnerships')
      .select('*')
      .eq('league_night_instance_id', instance.id)
      .or(`player1_id.eq.${player1_id},player2_id.eq.${player1_id},player1_id.eq.${player2_id},player2_id.eq.${player2_id}`)
      .eq('is_active', true);

    if (existingError) throw existingError;

    if (existingPartnerships.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'One or both players already have a partnership'
      });
    }

    // Create partnership
    const { data: partnership, error: partnershipError } = await supabase
      .from('confirmed_partnerships')
      .insert({
        league_night_instance_id: instance.id,
        player1_id: player1_id,
        player2_id: player2_id,
        is_active: true
      })
      .select()
      .single();

    if (partnershipError) throw partnershipError;

    res.json({
      success: true,
      data: {
        partnership,
        message: 'Partnership created successfully'
      }
    });

  } catch (error) {
    console.error('Error creating partnership:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create partnership'
    });
  }
};

module.exports = {
  getLeagueNight,
  getCheckedInPlayers,
  checkInPlayer,
  createPartnership
};