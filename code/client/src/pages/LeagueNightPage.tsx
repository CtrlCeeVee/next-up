import { useParams, useNavigate } from 'react-router-dom'
import { useLeague } from '../hooks/useLeagues'
import { useAuth } from '../hooks/useAuth'
import { useMembership } from '../hooks/useMembership'
import { useTheme } from '../contexts/ThemeContext'
import { leagueNightService, type CheckedInPlayer, type PartnershipRequest, type ConfirmedPartnership } from '../services/api/leagueNights'
import { useLeagueNightRealtime } from '../hooks/useLeagueNightRealtime'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  AlertCircle,
  Trophy,
  UserCheck,
  Settings,
  Info
} from 'lucide-react'

// Import tab components
import BottomNavBar from '../components/league-night-tabs/BottomNavBar';
import MyNightTab from '../components/league-night-tabs/MyNightTab';
import MatchesQueueTab from '../components/league-night-tabs/MatchesQueueTab';
import LeagueInfoTab from '../components/league-night-tabs/LeagueInfoTab';
import AdminTab from '../components/league-night-tabs/AdminTab';
import { API_BASE_URL } from '../services/api/base';

interface LeagueNight {
  id: number
  day: string
  time: string
  date: string
  nextDate: string  // For display compatibility
  status: 'scheduled' | 'active' | 'completed' | 'today' // Add 'today' for local status
  backendStatus?: 'scheduled' | 'active' | 'completed' // The actual backend status
  courtsAvailable: number
  courtLabels?: string[]
  autoAssignmentEnabled?: boolean
  checkedInCount: number
  partnershipsCount: number
  possibleGames: number
}

const LeagueNightPage = () => {
  const { leagueId, nightId } = useParams<{ leagueId: string; nightId: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const { league, loading, error } = useLeague(parseInt(leagueId || '0'));
  const { user, loading: authLoading } = useAuth();
  const { isMember, membership } = useMembership(parseInt(leagueId || '0'), user?.id || null);
  
  const [leagueNight, setLeagueNight] = useState<LeagueNight | null>(null);
  const [nightLoading, setNightLoading] = useState(true);
  
  // Check-in related state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [unchecking, setUnchecking] = useState(false);
  const [checkedInPlayers, setCheckedInPlayers] = useState<CheckedInPlayer[]>([]);
  
  // Partnership related state
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  
  // Real-time refresh triggers
  const [matchesRefreshTrigger, setMatchesRefreshTrigger] = useState(0);
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>([]);
  const [confirmedPartnership, setConfirmedPartnership] = useState<ConfirmedPartnership | null>(null);
  const [currentMatch, setCurrentMatch] = useState<any | null>(null);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const [acceptingRequest, setAcceptingRequest] = useState<number | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<number | null>(null);
  const [removingPartnership, setRemovingPartnership] = useState(false);
  const [startingLeague, setStartingLeague] = useState(false);
  const [endingLeague, setEndingLeague] = useState(false);
  const [restartingLeague, setRestartingLeague] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('my-night');

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch league night data function
  const fetchLeagueNight = async () => {
    if (!leagueId || !nightId) return;

    try {
      // Get the natural league night instance for this date
      const nightData = await leagueNightService.getLeagueNight(parseInt(leagueId), nightId);
      
      // Transform API response to match our interface
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      const isToday = nightData.date === today;
      const transformedNight: LeagueNight = {
        id: nightData.id,
        day: nightData.day,
        time: nightData.time,
        date: nightData.date,
        nextDate: nightData.date,
        status: isToday ? 'today' : nightData.status,
        backendStatus: nightData.status,
        courtsAvailable: nightData.courtsAvailable,
        courtLabels: nightData.courtLabels || [],
        autoAssignmentEnabled: nightData.autoAssignmentEnabled,
        checkedInCount: nightData.checkedInCount,
        partnershipsCount: nightData.partnershipsCount,
        possibleGames: nightData.possibleGames
      };
      
      setLeagueNight(transformedNight);
    } catch (err) {
      console.error('Error fetching league night:', err);
    } finally {
      setNightLoading(false);
    }
  };

  // Fetch league night data on component mount
  useEffect(() => {
    fetchLeagueNight();
  }, [leagueId, nightId]);

  // Check-in functionality
  const handleCheckIn = async () => {
    if (!user || !leagueNight || checkingIn || !leagueId || !nightId) return;

    setCheckingIn(true);
    try {
      await leagueNightService.checkInPlayer(parseInt(leagueId), nightId, user.id);
      
      setIsCheckedIn(true);
      
      // Refresh all data
      await Promise.all([
        refreshCheckedInPlayers(),
        refreshPartnershipRequests()
      ]);
      
    } catch (error) {
      console.error('Error checking in:', error);
    } finally {
      setCheckingIn(false);
    }
  };

  // Uncheck functionality
  const handleUncheck = async () => {
    if (!user || !leagueNight || unchecking || !leagueId || !nightId) return;

    setUnchecking(true);
    try {
      await leagueNightService.uncheckPlayer(parseInt(leagueId), nightId, user.id);
      
      setIsCheckedIn(false);
      setSelectedPartner(null);
      
      // Refresh all data
      await Promise.all([
        refreshCheckedInPlayers(),
        refreshPartnershipRequests()
      ]);
      
    } catch (error) {
      console.error('Error unchecking:', error);
    } finally {
      setUnchecking(false);
    }
  };

  // Send partnership request
  const handleSendPartnershipRequest = async (requestedId: string) => {
    if (!user || !leagueId || !nightId || sendingRequest) return;

    setSendingRequest(requestedId);
    try {
      await leagueNightService.sendPartnershipRequest(parseInt(leagueId), nightId, user.id, requestedId);
      
      // Refresh partnership requests
      await refreshPartnershipRequests();
      
    } catch (error) {
      console.error('Error sending partnership request:', error);
    } finally {
      setSendingRequest(null);
    }
  };

  // Accept partnership request
  const handleAcceptPartnershipRequest = async (requestId: number) => {
    if (!user || !leagueId || !nightId || acceptingRequest) return;

    setAcceptingRequest(requestId);
    try {
      await leagueNightService.acceptPartnershipRequest(parseInt(leagueId), nightId, requestId, user.id);
      
      // Refresh all data
      await Promise.all([
        refreshCheckedInPlayers(),
        refreshPartnershipRequests()
      ]);
      
    } catch (error) {
      console.error('Error accepting partnership request:', error);
    } finally {
      setAcceptingRequest(null);
    }
  };

  // Reject partnership request
  const handleRejectPartnershipRequest = async (requestId: number) => {
    if (!user || !leagueId || !nightId || rejectingRequest) return;

    setRejectingRequest(requestId);
    try {
      await leagueNightService.rejectPartnershipRequest(parseInt(leagueId), nightId, requestId, user.id);
      
      // Refresh partnership requests
      await refreshPartnershipRequests();
      
    } catch (error) {
      console.error('Error rejecting partnership request:', error);
    } finally {
      setRejectingRequest(null);
    }
  };

  // Remove partnership
  const handleRemovePartnership = async () => {
    if (!user || !leagueId || !nightId || removingPartnership) return;

    setRemovingPartnership(true);
    try {
      await leagueNightService.removePartnership(parseInt(leagueId), nightId, user.id);
      
      // Refresh all data
      await Promise.all([
        refreshCheckedInPlayers(),
        refreshPartnershipRequests()
      ]);
      
    } catch (error) {
      console.error('Error removing partnership:', error);
    } finally {
      setRemovingPartnership(false);
    }
  };

  // Handle match creation callback
  const handleMatchesCreated = async () => {
    // Refresh league night data when matches are created
    await fetchLeagueNight();
    await refreshPartnershipRequests();
  };

  // Handle starting league night (admin only)
  const handleStartLeague = async () => {
    if (!user || !leagueId || !nightId || startingLeague) return;

    setStartingLeague(true);
    try {
      await leagueNightService.startLeague(parseInt(leagueId), nightId, user.id);
      
      // Refresh league night data to show new status
      await fetchLeagueNight();
      
    } catch (error) {
      console.error('Error starting league:', error);
    } finally {
      setStartingLeague(false);
    }
  };

  // Handle ending league night (admin only)
  const handleEndLeague = async () => {
    if (!user || !leagueId || !nightId || endingLeague) return;

    setEndingLeague(true);
    try {
      await leagueNightService.endLeague(parseInt(leagueId), nightId, user.id);
      
      // Refresh league night data to show new status
      await fetchLeagueNight();
      
    } catch (error) {
      console.error('Error ending league:', error);
    } finally {
      setEndingLeague(false);
    }
  };

  // Handle restarting league night (admin only)
  const handleRestartLeague = async () => {
    if (!user || !leagueId || !nightId || restartingLeague) return;

    setRestartingLeague(true);
    try {
      await leagueNightService.restartLeague(parseInt(leagueId), nightId, user.id);
      
      // Refresh league night data to show new status
      await fetchLeagueNight();
      
    } catch (error) {
      console.error('Error restarting league:', error);
    } finally {
      setRestartingLeague(false);
    }
  };

  // Helper functions for refreshing data
  const refreshCheckedInPlayers = useCallback(async () => {
    if (!leagueId || !nightId) return;
    
    try {
      const players = await leagueNightService.getCheckedInPlayers(parseInt(leagueId), nightId);
      setCheckedInPlayers(players);
      
      // Check if current user is checked in and has partner
      if (user) {
        const userCheckedIn = players.find(p => p.id === user.id);
        setIsCheckedIn(!!userCheckedIn);
        
        if (userCheckedIn && userCheckedIn.hasPartner) {
          setSelectedPartner(userCheckedIn.partnerId || null);
        } else {
          setSelectedPartner(null);
        }
      }
    } catch (error) {
      console.error('Error refreshing checked-in players:', error);
    }
  }, [leagueId, nightId, user?.id]);

  const refreshPartnershipRequests = useCallback(async () => {
    if (!user || !leagueId || !nightId) return;
    
    try {
      const data = await leagueNightService.getPartnershipRequests(parseInt(leagueId), nightId, user.id);
      setPartnershipRequests(data.requests);
      setConfirmedPartnership(data.confirmedPartnership);
    } catch (error) {
      console.error('Error refreshing partnership requests:', error);
    }
  }, [user, leagueId, nightId]);

  // Fetch current active match for the user
  const refreshCurrentMatch = useCallback(async () => {
    if (!leagueId || !nightId || !user || !confirmedPartnership) {
      setCurrentMatch(null);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/matches`,
        { credentials: 'include' }
      );
      const data = await response.json();
      
      if (data.success && data.data) {
        // Find the active match where user's partnership is playing
        const userMatch = data.data.find((match: any) => 
          match.status === 'active' && (
            match.partnership1_id === confirmedPartnership.id ||
            match.partnership2_id === confirmedPartnership.id
          )
        );
        setCurrentMatch(userMatch || null);
      }
    } catch (error) {
      console.error('Error fetching current match:', error);
    }
  }, [leagueId, nightId, user, confirmedPartnership]);

  // Compute current partner info from confirmed partnership
  const currentPartner = useMemo(() => {
    if (!confirmedPartnership || !user?.id) return null;
    
    const partnerId = confirmedPartnership.player1_id === user.id 
      ? confirmedPartnership.player2_id 
      : confirmedPartnership.player1_id;
    
    const partnerProfile = confirmedPartnership.player1_id === user.id
      ? confirmedPartnership.player2
      : confirmedPartnership.player1;
      
    return {
      id: partnerId,
      name: `${partnerProfile.first_name} ${partnerProfile.last_name}`.trim(),
      skillLevel: partnerProfile.skill_level
    };
  }, [confirmedPartnership, user?.id]);

  // Check if user has pending partnership requests (for badge)
  const hasPartnershipNotification = useMemo(() => {
    return partnershipRequests.some(req => 
      req.status === 'pending' && req.requested_id === user?.id
    );
  }, [partnershipRequests, user?.id]);

  // Real-time update callbacks
  const handleCheckinsUpdate = useCallback(() => {
    refreshCheckedInPlayers();
  }, []);

  const handlePartnershipRequestsUpdate = useCallback(() => {
    refreshPartnershipRequests();
  }, []);

  const handleConfirmedPartnershipsUpdate = useCallback(() => {
    refreshPartnershipRequests();
    refreshCurrentMatch();
    refreshCheckedInPlayers();
  }, []);

  const handleLeagueNightStatusUpdate = useCallback(() => {
    fetchLeagueNight();
  }, []);

  // Set up real-time subscriptions
  const realtimeStatus = useLeagueNightRealtime(leagueNight?.id || 0, user?.id || '', {
    onCheckinsUpdate: handleCheckinsUpdate,
    onPartnershipRequestsUpdate: handlePartnershipRequestsUpdate,
    onConfirmedPartnershipsUpdate: handleConfirmedPartnershipsUpdate,
    onLeagueNightStatusUpdate: handleLeagueNightStatusUpdate,
    onMatchesUpdate: () => {
      setMatchesRefreshTrigger(prev => prev + 1);
      refreshCurrentMatch();
    }
  });

  // Fetch checked-in players and partnership requests
  useEffect(() => {
    if (!leagueNight || !user) return;
    
    Promise.all([
      refreshCheckedInPlayers(),
      refreshPartnershipRequests()
    ]).then(() => {
      refreshCurrentMatch();
    });
  }, [leagueNight?.id, user?.id]); // Only depend on IDs, not the functions

  // Refresh current match when partnership changes
  useEffect(() => {
    refreshCurrentMatch();
  }, [confirmedPartnership?.id]); // Only depend on partnership ID

  if (loading || authLoading || nightLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading league night...</p>
        </div>
      </div>
    );
  }

  if (error || !league || !leagueNight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">League Night Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || 'The league night you\'re looking for doesn\'t exist.'}
          </p>
          <button
            onClick={() => navigate(`/league/${leagueId}`)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to League
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">

      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-6xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/league/${leagueId}`)}
              className="p-1.5 sm:p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-lg"
            >
              <ArrowLeft className="h-4 sm:h-5 w-4 sm:w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex-1 sm:flex-initial">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {leagueNight.day} League Night
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                {league.name} • {leagueNight.nextDate} at {leagueNight.time}
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 sm:p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-lg self-end sm:self-auto"
          >
            {theme === 'light' ?
              <Moon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-700" /> :
              <Sun className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500" />
            }
          </button>
        </div>

        {/* Tab-Specific Banner */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 shadow-2xl mb-6 sm:mb-8">
          {activeTab === 'my-night' && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <UserCheck className="h-5 sm:h-6 w-5 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  My Night
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {isCheckedIn 
                    ? confirmedPartnership 
                      ? 'Ready to play • Waiting for match assignment'
                      : 'Checked in • Find a partner to get started'
                    : 'Check in and find a partner to play tonight'
                  }
                </p>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Trophy className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Matches & Queue
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {leagueNight.backendStatus === 'completed'
                    ? 'League night ended • View final results'
                    : leagueNight.backendStatus === 'active'
                    ? 'Live matches and upcoming queue'
                    : 'Matches start when league night begins'
                  }
                </p>
              </div>
            </div>
          )}

          {activeTab === 'league-info' && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Info className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  League Info
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {leagueNight.checkedInCount} player{leagueNight.checkedInCount !== 1 ? 's' : ''} checked in • {leagueNight.partnershipsCount} partnership{leagueNight.partnershipsCount !== 1 ? 's' : ''} formed
                </p>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                <Settings className="h-5 sm:h-6 w-5 sm:w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Admin Controls
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {leagueNight.backendStatus === 'completed'
                    ? 'League night ended • View session summary'
                    : leagueNight.backendStatus === 'active'
                    ? 'League active • Manage courts and matches'
                    : 'Start league night when ready'
                  }
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Tab Content */}
        {activeTab === 'my-night' && (
          <MyNightTab
            user={user}
            leagueId={leagueId || ''}
            nightId={nightId || ''}
            isCheckedIn={isCheckedIn}
            checkedInPlayers={checkedInPlayers}
            partnershipRequests={partnershipRequests}
            confirmedPartnership={confirmedPartnership}
            currentPartner={currentPartner}
            currentMatch={currentMatch}
            checkingIn={checkingIn}
            unchecking={unchecking}
            sendingRequest={sendingRequest}
            acceptingRequest={acceptingRequest}
            rejectingRequest={rejectingRequest}
            removingPartnership={removingPartnership}
            onCheckIn={handleCheckIn}
            onUncheck={handleUncheck}
            onSendPartnershipRequest={handleSendPartnershipRequest}
            onAcceptPartnershipRequest={handleAcceptPartnershipRequest}
            onRejectPartnershipRequest={handleRejectPartnershipRequest}
            onRemovePartnership={handleRemovePartnership}
            onScoreSubmitted={() => {
              setMatchesRefreshTrigger(prev => prev + 1);
              refreshCurrentMatch();
            }}
          />
        )}

        {activeTab === 'matches' && leagueId && nightId && (
          <MatchesQueueTab
            leagueId={leagueId}
            nightId={nightId}
            leagueNightInstanceId={leagueNight.id}
            leagueNightStatus={leagueNight.backendStatus || 'scheduled'}
            userId={user?.id}
            matchesRefreshTrigger={matchesRefreshTrigger}
            onMatchesCreated={handleMatchesCreated}
          />
        )}

        {activeTab === 'league-info' && (
          <LeagueInfoTab
            checkedInPlayers={checkedInPlayers}
            leagueNight={leagueNight}
          />
        )}

        {activeTab === 'admin' && isMember && membership?.role === 'admin' && leagueId && (
          <AdminTab
            leagueNight={leagueNight}
            leagueId={parseInt(leagueId)}
            nightId={nightId || ''}
            userId={user?.id}
            startingLeague={startingLeague}
            endingLeague={endingLeague}
            restartingLeague={restartingLeague}
            onStartLeague={handleStartLeague}
            onEndLeague={handleEndLeague}
            onRestartLeague={handleRestartLeague}
            onRefresh={() => {
              refreshCheckedInPlayers();
              refreshPartnershipRequests();
              fetchLeagueNight();
            }}
          />
        )}

        {/* Bottom Navigation */}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasNotification={hasPartnershipNotification}
          isAdmin={isMember && membership?.role === 'admin'}
        />

      </div>
    </div>
  );
}

export default LeagueNightPage;
