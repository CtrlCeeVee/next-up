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
  AlertCircle
} from 'lucide-react'

// Import tab components
import BottomNavBar from '../components/league-night-tabs/BottomNavBar'
import MyNightTab from '../components/league-night-tabs/MyNightTab'
import MatchesQueueTab from '../components/league-night-tabs/MatchesQueueTab'
import LeagueInfoTab from '../components/league-night-tabs/LeagueInfoTab'
import AdminTab from '../components/league-night-tabs/AdminTab'

interface LeagueNight {
  id: number
  day: string
  time: string
  date: string
  nextDate: string  // For display compatibility
  status: 'scheduled' | 'active' | 'completed' | 'today' // Add 'today' for local status
  backendStatus?: 'scheduled' | 'active' | 'completed' // The actual backend status
  courtsAvailable: number
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
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const [acceptingRequest, setAcceptingRequest] = useState<number | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<number | null>(null);
  const [removingPartnership, setRemovingPartnership] = useState(false);
  const [startingLeague, setStartingLeague] = useState(false);

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

  // Helper functions for refreshing data
  const refreshCheckedInPlayers = async () => {
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
  };

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
  }, [refreshPartnershipRequests]);

  const handleConfirmedPartnershipsUpdate = useCallback(() => {
    refreshPartnershipRequests();
    // Also refresh checked-in players to update "Paired" status  
    if (leagueId && nightId) {
      leagueNightService.getCheckedInPlayers(parseInt(leagueId), nightId)
        .then(players => {
          setCheckedInPlayers(players);
          if (user) {
            const userCheckedIn = players.find(p => p.id === user.id);
            setIsCheckedIn(!!userCheckedIn);
          }
        })
        .catch(error => console.error('Error refreshing checked-in players:', error));
    }
  }, [refreshPartnershipRequests, leagueId, nightId, user]);

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
    }
  });

  // Fetch checked-in players and partnership requests
  useEffect(() => {
    if (!leagueNight || !user) return;
    
    Promise.all([
      refreshCheckedInPlayers(),
      refreshPartnershipRequests()
    ]);
  }, [leagueNight, leagueId, nightId, user]);

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

        {/* League Night Status */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 dark:border-slate-700/50 shadow-2xl mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-4 sm:space-x-6">
              <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                leagueNight.status === 'today'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <Calendar className={`h-6 sm:h-7 md:h-8 w-6 sm:w-7 md:w-8 ${
                  leagueNight.status === 'today'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {leagueNight.status === 'today' ? 'Tonight\'s Session' : 'Upcoming Session'}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{leagueNight.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{leagueNight.courtsAvailable} courts</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold whitespace-nowrap ${
              leagueNight.status === 'today'
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white'
            }`}>
              {leagueNight.status === 'today' ? 'LIVE' : 'UPCOMING'}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        {activeTab === 'my-night' && (
          <MyNightTab
            user={user}
            isCheckedIn={isCheckedIn}
            checkedInPlayers={checkedInPlayers}
            partnershipRequests={partnershipRequests}
            confirmedPartnership={confirmedPartnership}
            currentPartner={currentPartner}
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
          />
        )}

        {activeTab === 'matches' && leagueId && nightId && (
          <MatchesQueueTab
            leagueId={leagueId}
            nightId={nightId}
            leagueNightInstanceId={leagueNight.id}
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
            startingLeague={startingLeague}
            onStartLeague={handleStartLeague}
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
