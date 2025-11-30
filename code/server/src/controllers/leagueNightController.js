// League Night Controller
// Handles all league night instance operations - check-ins, partnerships, etc.

const { createClient } = require('@supabase/supabase-js');
const { tryAutoAssignMatches } = require('./matchController');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper function to create league night instance if it doesn't exist
const getOrCreateLeagueNightInstance = async (leagueId, nightId) => {
  try {
    // First try to get existing instance by ID
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
    
    // If today IS the target day, create instance for today
    // Otherwise, create for next occurrence
    if (daysUntilTarget < 0) {
      daysUntilTarget += 7;
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
    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

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
      courtLabels: instance.court_labels || [],
      autoAssignmentEnabled: instance.auto_assignment_enabled !== false,
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
          first_name,
          last_name,
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
      name: `${checkin.profiles.first_name} ${checkin.profiles.last_name}`,
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

    // Check if user is already checked in (active)
    const { data: activeCheckin, error: activeError } = await supabase
      .from('league_night_checkins')
      .select('*')
      .eq('league_night_instance_id', instance.id)
      .eq('user_id', user_id)
      .eq('is_active', true)
      .single();

    if (!activeError && activeCheckin) {
      return res.status(400).json({
        success: false,
        error: 'User is already checked in'
      });
    }

    // Check if user has an inactive checkin that we can reactivate
    const { data: inactiveCheckin, error: inactiveError } = await supabase
      .from('league_night_checkins')
      .select('*')
      .eq('league_night_instance_id', instance.id)
      .eq('user_id', user_id)
      .eq('is_active', false)
      .single();

    let checkin;
    if (!inactiveError && inactiveCheckin) {
      // Reactivate existing checkin
      const { data: reactivatedCheckin, error: reactivateError } = await supabase
        .from('league_night_checkins')
        .update({ 
          is_active: true,
          checked_in_at: new Date().toISOString()
        })
        .eq('id', inactiveCheckin.id)
        .select()
        .single();

      if (reactivateError) throw reactivateError;
      checkin = reactivatedCheckin;
    } else {
      // Create new check-in
      const { data: newCheckin, error: checkinError } = await supabase
        .from('league_night_checkins')
        .insert({
          league_night_instance_id: instance.id,
          user_id: user_id,
          is_active: true
        })
        .select()
        .single();

      if (checkinError) throw checkinError;
      checkin = newCheckin;
    }

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

// POST /api/leagues/:leagueId/nights/:nightId/partnership-request
const createPartnershipRequest = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { requester_id, requested_id } = req.body;

    if (!requester_id || !requested_id) {
      return res.status(400).json({
        success: false,
        error: 'Both requester and requested player IDs are required'
      });
    }

    if (requester_id === requested_id) {
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
      .in('user_id', [requester_id, requested_id])
      .eq('is_active', true);

    if (checkinsError) throw checkinsError;

    if (checkins.length !== 2) {
      return res.status(400).json({
        success: false,
        error: 'Both players must be checked in to form a partnership'
      });
    }

    // Check if either player already has a confirmed partnership
    const { data: existingPartnerships, error: existingError } = await supabase
      .from('confirmed_partnerships')
      .select('*')
      .eq('league_night_instance_id', instance.id)
      .or(`player1_id.eq.${requester_id},player2_id.eq.${requester_id},player1_id.eq.${requested_id},player2_id.eq.${requested_id}`)
      .eq('is_active', true);

    if (existingError) throw existingError;

    if (existingPartnerships.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'One or both players already have a confirmed partnership'
      });
    }

    // Clean up any existing requests between these players (regardless of status)
    // This prevents unique constraint violations from old requests
    const { error: cleanupError } = await supabase
      .from('partnership_requests')
      .delete()
      .eq('league_night_instance_id', instance.id)
      .or(`and(requester_id.eq.${requester_id},requested_id.eq.${requested_id}),and(requester_id.eq.${requested_id},requested_id.eq.${requester_id})`);

    if (cleanupError) throw cleanupError;

    // Create partnership request
    const { data: request, error: insertError } = await supabase
      .from('partnership_requests')
      .insert({
        league_night_instance_id: instance.id,
        requester_id: requester_id,
        requested_id: requested_id,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.json({
      success: true,
      data: {
        request,
        message: 'Partnership request sent successfully'
      }
    });

  } catch (error) {
    console.error('Error creating partnership request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create partnership request'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/partnership-accept
const acceptPartnershipRequest = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { request_id, user_id } = req.body;

    if (!request_id || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Request ID and user ID are required'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    // Get the partnership request
    const { data: request, error: requestError } = await supabase
      .from('partnership_requests')
      .select('*')
      .eq('id', request_id)
      .eq('league_night_instance_id', instance.id)
      .eq('requested_id', user_id)
      .eq('status', 'pending')
      .single();

    if (requestError || !request) {
      return res.status(404).json({
        success: false,
        error: 'Partnership request not found or not authorized'
      });
    }

    // Check if either player already has a confirmed partnership
    const { data: existingPartnerships, error: existingError } = await supabase
      .from('confirmed_partnerships')
      .select('*')
      .eq('league_night_instance_id', instance.id)
      .or(`player1_id.eq.${request.requester_id},player2_id.eq.${request.requester_id},player1_id.eq.${request.requested_id},player2_id.eq.${request.requested_id}`)
      .eq('is_active', true);

    if (existingError) throw existingError;

    if (existingPartnerships.length > 0) {
            // Update request status to declined since someone already has a partnership
      console.log('Declining request since one player already has a partnership');
      await supabase
        .from('partnership_requests')
        .update({ status: 'declined' })
        .eq('id', request.id);

      return res.status(400).json({
        success: false,
        error: 'One or both players already have a confirmed partnership'
      });
    }

    // Create confirmed partnership
    const { data: partnership, error: partnershipError } = await supabase
      .from('confirmed_partnerships')
      .insert({
        league_night_instance_id: instance.id,
        player1_id: request.requester_id,
        player2_id: request.requested_id,
        is_active: true
      })
      .select()
      .single();

    if (partnershipError) throw partnershipError;

    // Update request status to accepted
    await supabase
      .from('partnership_requests')
      .update({ status: 'accepted' })
      .eq('id', request_id);

    // Reject any other pending requests involving these players
    await supabase
      .from('partnership_requests')
      .update({ status: 'declined' })
      .eq('league_night_instance_id', instance.id)
      .or(`requester_id.eq.${request.requester_id},requested_id.eq.${request.requester_id},requester_id.eq.${request.requested_id},requested_id.eq.${request.requested_id}`)
      .eq('status', 'pending')
      .neq('id', request_id);

    // Try to auto-assign matches if league night is active and courts are available
    await tryAutoAssignMatches(instance.id);

    res.json({
      success: true,
      data: {
        partnership,
        message: 'Partnership request accepted successfully'
      }
    });

  } catch (error) {
    console.error('Error accepting partnership request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to accept partnership request'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/partnership-reject
const rejectPartnershipRequest = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { request_id, user_id } = req.body;

    if (!request_id || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Request ID and user ID are required'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    // Get the partnership request
    const { data: request, error: requestError } = await supabase
      .from('partnership_requests')
      .select('*')
      .eq('id', request_id)
      .eq('league_night_instance_id', instance.id)
      .eq('requested_id', user_id)
      .eq('status', 'pending')
      .single();

    if (requestError || !request) {
      return res.status(404).json({
        success: false,
        error: 'Partnership request not found or not authorized'
      });
    }

    // Update request status to declined
    const { error: updateError } = await supabase
      .from('partnership_requests')
      .update({ status: 'declined' })
      .eq('id', request_id);

    if (updateError) throw updateError;

    res.json({
      success: true,
      data: {
        message: 'Partnership request declined successfully'
      }
    });

  } catch (error) {
    console.error('Error rejecting partnership request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject partnership request'
    });
  }
};

// GET /api/leagues/:leagueId/nights/:nightId/partnership-requests
const getPartnershipRequests = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    // Get partnership requests for this user
    const { data: requests, error } = await supabase
      .from('partnership_requests')
      .select(`
        *,
        requester:profiles!partnership_requests_requester_id_fkey (
          id,
          first_name,
          last_name,
          skill_level
        ),
        requested:profiles!partnership_requests_requested_id_fkey (
          id,
          first_name,
          last_name,
          skill_level
        )
      `)
      .eq('league_night_instance_id', instance.id)
      .or(`requester_id.eq.${user_id},requested_id.eq.${user_id}`)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Also get confirmed partnerships for this user
    const { data: confirmedPartnership, error: partnershipError } = await supabase
      .from('confirmed_partnerships')
      .select(`
        *,
        player1:profiles!confirmed_partnerships_player1_id_fkey (
          id,
          first_name,
          last_name,
          skill_level
        ),
        player2:profiles!confirmed_partnerships_player2_id_fkey (
          id,
          first_name,
          last_name,
          skill_level
        )
      `)
      .eq('league_night_instance_id', instance.id)
      .or(`player1_id.eq.${user_id},player2_id.eq.${user_id}`)
      .eq('is_active', true)
      .single();

    if (partnershipError && partnershipError.code !== 'PGRST116') { // PGRST116 is "no rows found"
      throw partnershipError;
    }

    res.json({
      success: true,
      data: {
        requests: requests || [],
        confirmedPartnership: confirmedPartnership || null
      }
    });

  } catch (error) {
    console.error('Error fetching partnership requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch partnership requests'
    });
  }
};

// DELETE /api/leagues/:leagueId/nights/:nightId/checkin
const uncheckPlayer = async (req, res) => {
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

    // First, remove any confirmed partnerships involving this user
    const { error: partnershipError } = await supabase
      .from('confirmed_partnerships')
      .update({ is_active: false })
      .eq('league_night_instance_id', instance.id)
      .or(`player1_id.eq.${user_id},player2_id.eq.${user_id}`)
      .eq('is_active', true);

    if (partnershipError) throw partnershipError;

    // Delete any pending partnership requests involving this user
    const { error: requestError } = await supabase
      .from('partnership_requests')
      .delete()
      .eq('league_night_instance_id', instance.id)
      .or(`requester_id.eq.${user_id},requested_id.eq.${user_id}`)
      .eq('status', 'pending');

    if (requestError) throw requestError;

    // Remove the check-in
    const { error: checkinError } = await supabase
      .from('league_night_checkins')
      .update({ is_active: false })
      .eq('league_night_instance_id', instance.id)
      .eq('user_id', user_id)
      .eq('is_active', true);

    if (checkinError) throw checkinError;

    res.json({
      success: true,
      data: {
        message: 'Successfully unchecked player and removed partnerships'
      }
    });

  } catch (error) {
    console.error('Error unchecking player:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to uncheck player'
    });
  }
};

// DELETE /api/leagues/:leagueId/nights/:nightId/partnership
const removePartnership = async (req, res) => {
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

    // Deactivate confirmed partnership involving this user (preserves historical data)
    const { error: partnershipError } = await supabase
      .from('confirmed_partnerships')
      .update({ is_active: false })
      .eq('league_night_instance_id', instance.id)
      .or(`player1_id.eq.${user_id},player2_id.eq.${user_id}`)
      .eq('is_active', true);

    if (partnershipError) throw partnershipError;

    // Clean up any partnership requests involving this user for this league night
    // This allows them to create new requests after removing a partnership
    const { error: requestCleanupError } = await supabase
      .from('partnership_requests')
      .delete()
      .eq('league_night_instance_id', instance.id)
      .or(`requester_id.eq.${user_id},requested_id.eq.${user_id}`);

    if (requestCleanupError) throw requestCleanupError;

    res.json({
      success: true,
      data: {
        message: 'Partnership removed successfully'
      }
    });

  } catch (error) {
    console.error('Error removing partnership:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove partnership'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/start-league - Manually start league (admin only)
const startLeague = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Check if user is admin of this league
    const { data: membership, error: membershipError } = await supabase
      .from('league_memberships')
      .select('role')
      .eq('league_id', leagueId)
      .eq('user_id', user_id)
      .eq('is_active', true)
      .single();

    if (membershipError || !membership || membership.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only league admins can manually start the league'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    if (instance.status === 'active') {
      return res.status(400).json({
        success: false,
        error: 'League night is already active'
      });
    }

    // Manually start the league night
    const { data: updatedInstance, error: updateError } = await supabase
      .from('league_night_instances')
      .update({ 
        status: 'active',
        auto_started_at: new Date().toISOString()
      })
      .eq('id', instance.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Try to create initial matches if partnerships exist
    console.log(`League night ${instance.id} manually started by admin ${user_id}`);
    const autoAssignResult = await tryAutoAssignMatches(instance.id);
    console.log('Auto-assignment after manual start:', autoAssignResult);

    res.json({
      success: true,
      data: {
        instance: updatedInstance,
        message: 'League night started successfully',
        autoAssignment: autoAssignResult
      }
    });

  } catch (error) {
    console.error('Error starting league:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start league'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/end-league - End league night (admin only)
const endLeague = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Check if user is admin of this league
    const { data: membership, error: membershipError } = await supabase
      .from('league_memberships')
      .select('role')
      .eq('league_id', leagueId)
      .eq('user_id', user_id)
      .eq('is_active', true)
      .single();

    if (membershipError || !membership || membership.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only league admins can end the league night'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    if (instance.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'League night is already ended'
      });
    }

    // Get count of active matches
    const { data: activeMatches, error: matchesError } = await supabase
      .from('matches')
      .select('id')
      .eq('league_night_instance_id', instance.id)
      .eq('status', 'active');

    if (matchesError) throw matchesError;

    // End the league night - this will prevent new auto-assignments
    const { data: updatedInstance, error: updateError } = await supabase
      .from('league_night_instances')
      .update({ 
        status: 'completed',
        ended_at: new Date().toISOString()
      })
      .eq('id', instance.id)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log(`League night ${instance.id} ended by admin ${user_id}`);

    res.json({
      success: true,
      data: {
        instance: updatedInstance,
        activeMatchesRemaining: activeMatches?.length || 0,
        message: activeMatches?.length > 0 
          ? `League night ended. ${activeMatches.length} active match(es) can still finish.`
          : 'League night ended successfully'
      }
    });

  } catch (error) {
    console.error('Error ending league:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end league night'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/update-courts
const updateCourts = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { user_id, court_labels } = req.body;

    if (!user_id || !court_labels || !Array.isArray(court_labels)) {
      return res.status(400).json({
        success: false,
        error: 'user_id and court_labels array are required'
      });
    }

    // Verify user is admin
    const { data: membership, error: membershipError } = await supabase
      .from('league_memberships')
      .select('role')
      .eq('league_id', leagueId)
      .eq('user_id', user_id)
      .single();

    if (membershipError || !membership || membership.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only league admins can update courts'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    const previousCourtCount = instance.courts_available;

    // Update court configuration
    const { data: updatedInstance, error: updateError } = await supabase
      .from('league_night_instances')
      .update({ 
        court_labels: court_labels,
        courts_available: court_labels.length
      })
      .eq('id', instance.id)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log(`Courts updated for league night ${instance.id} by admin ${user_id}:`, court_labels);

    // If courts were added and league is active, try auto-assignment
    let autoAssignResult = null;
    if (court_labels.length > previousCourtCount && instance.status === 'active') {
      console.log(`Courts increased from ${previousCourtCount} to ${court_labels.length}, triggering auto-assignment`);
      autoAssignResult = await tryAutoAssignMatches(instance.id);
    }

    res.json({
      success: true,
      data: updatedInstance,
      autoAssignment: autoAssignResult
    });

  } catch (error) {
    console.error('Error updating courts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update courts'
    });
  }
};

// POST /api/leagues/:leagueId/nights/:nightId/toggle-auto-assignment
const toggleAutoAssignment = async (req, res) => {
  try {
    const { leagueId, nightId } = req.params;
    const { user_id, enabled } = req.body;

    if (!user_id || typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'User ID and enabled status are required'
      });
    }

    // Check if user is admin/organizer
    const { data: membership, error: membershipError } = await supabase
      .from('league_memberships')
      .select('role')
      .eq('league_id', leagueId)
      .eq('user_id', user_id)
      .single();

    if (membershipError || !membership || !['admin', 'organizer'].includes(membership.role)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized - admin/organizer access required'
      });
    }

    const instance = await getOrCreateLeagueNightInstance(leagueId, nightId);

    // Update auto_assignment_enabled
    const { data: updatedInstance, error: updateError } = await supabase
      .from('league_night_instances')
      .update({ auto_assignment_enabled: enabled })
      .eq('id', instance.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error toggling auto-assignment:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Failed to update auto-assignment setting'
      });
    }

    // If turning auto-assignment ON, trigger it immediately
    if (enabled && instance.status === 'active') {
      const { tryAutoAssignMatches } = require('./matchController');
      const autoAssignResult = await tryAutoAssignMatches(instance.id);
      console.log('Auto-assignment triggered after enabling:', autoAssignResult);
    }

    res.json({
      success: true,
      message: `Auto-assignment ${enabled ? 'enabled' : 'disabled'}`,
      instance: updatedInstance
    });

  } catch (error) {
    console.error('Error toggling auto-assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle auto-assignment'
    });
  }
};

module.exports = {
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
};