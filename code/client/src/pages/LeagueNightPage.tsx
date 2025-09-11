import { useParams, useNavigate } from 'react-router-dom'
import { useLeague } from '../hooks/useLeagues'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../contexts/ThemeContext'
import { leagueNightService, type CheckedInPlayer } from '../services/api/leagueNights'
import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy,
  Target,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserPlus,
  Heart
} from 'lucide-react'

interface LeagueNight {
  id: number
  day: string
  time: string
  date: string
  nextDate: string  // For display compatibility
  status: 'scheduled' | 'active' | 'completed' | 'today' // Add 'today' for local status
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
  
  const [leagueNight, setLeagueNight] = useState<LeagueNight | null>(null);
  const [nightLoading, setNightLoading] = useState(true);
  
  // Check-in related state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedInPlayers, setCheckedInPlayers] = useState<CheckedInPlayer[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [selectingPartner, setSelectingPartner] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch league night data
  useEffect(() => {
    const fetchLeagueNight = async () => {
      if (!leagueId || !nightId) return;

      try {
        // Use testing method to force today's date for any league night
        const nightData = await leagueNightService.getLeagueNightForTesting(parseInt(leagueId), nightId);
        
        // Transform API response to match our interface
        const isToday = true; // Always treat as today when in test mode
        const transformedNight: LeagueNight = {
          id: nightData.id,
          day: nightData.day,
          time: nightData.time,
          date: nightData.date,
          nextDate: nightData.date, // Use the date for display
          status: isToday ? 'today' : nightData.status,
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

    fetchLeagueNight();
  }, [leagueId, nightId]);

  // Check-in functionality
  const handleCheckIn = async () => {
    if (!user || !leagueNight || checkingIn || !leagueId || !nightId) return;

    setCheckingIn(true);
    try {
      await leagueNightService.checkInPlayer(parseInt(leagueId), nightId, user.id);
      
      setIsCheckedIn(true);
      
      // Refresh checked-in players list
      const updatedPlayers = await leagueNightService.getCheckedInPlayers(parseInt(leagueId), nightId);
      setCheckedInPlayers(updatedPlayers);
      
    } catch (error) {
      console.error('Error checking in:', error);
      // You could add a toast notification here
    } finally {
      setCheckingIn(false);
    }
  };

  const handlePartnerSelect = async (partnerId: string) => {
    if (!user || selectingPartner || !leagueId || !nightId) return;

    setSelectingPartner(true);
    try {
      await leagueNightService.createPartnership(parseInt(leagueId), nightId, user.id, partnerId);
      
      setSelectedPartner(partnerId);
      
      // Refresh checked-in players to update partnership status
      const updatedPlayers = await leagueNightService.getCheckedInPlayers(parseInt(leagueId), nightId);
      setCheckedInPlayers(updatedPlayers);
      
    } catch (error) {
      console.error('Error selecting partner:', error);
      // You could add a toast notification here
    } finally {
      setSelectingPartner(false);
    }
  };

  // Fetch checked-in players and check user's status
  useEffect(() => {
    const fetchCheckedInPlayers = async () => {
      if (!leagueNight || !leagueId || !nightId) return;

      try {
        const players = await leagueNightService.getCheckedInPlayers(parseInt(leagueId), nightId);
        setCheckedInPlayers(players);
        
        // Check if current user is already checked in
        if (user) {
          const userCheckedIn = players.find(p => p.id === user.id);
          setIsCheckedIn(!!userCheckedIn);
          
          // Check if user has a partner
          if (userCheckedIn && userCheckedIn.hasPartner) {
            setSelectedPartner(userCheckedIn.partnerId || null);
          }
        }
        
      } catch (error) {
        console.error('Error fetching checked-in players:', error);
      }
    };

    fetchCheckedInPlayers();
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/league/${leagueId}`)}
              className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-lg"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {leagueNight.day} League Night
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {league.name} • {leagueNight.nextDate} at {leagueNight.time}
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-lg"
          >
            {theme === 'light' ? 
              <Moon className="h-5 w-5 text-gray-700" /> : 
              <Sun className="h-5 w-5 text-yellow-500" />
            }
          </button>
        </div>

        {/* League Night Status */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className={`p-4 rounded-2xl ${
                leagueNight.status === 'today' 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <Calendar className={`h-8 w-8 ${
                  leagueNight.status === 'today' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-blue-600 dark:text-blue-400'
                }`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {leagueNight.status === 'today' ? 'Tonight\'s Session' : 'Upcoming Session'}
                </h2>
                <div className="flex items-center space-x-4 mt-2 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{leagueNight.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{leagueNight.courtsAvailable} courts available</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`px-6 py-3 rounded-2xl font-semibold ${
              leagueNight.status === 'today' 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white'
            }`}>
              {leagueNight.status === 'today' ? 'LIVE TODAY' : 'UPCOMING'}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {leagueNight.status === 'today' ? 'Checked In' : 'Expected Players'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {leagueNight.checkedInCount}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {leagueNight.status === 'today' ? 'Possible Games' : 'Planned Games'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {leagueNight.possibleGames}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {leagueNight.status === 'today' ? 'Partnerships' : 'Last Winners'}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {leagueNight.status === 'today' 
                    ? `${leagueNight.partnershipsCount} pairs formed`
                    : 'Team Rodriguez/Chen'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Area */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          {leagueNight.status === 'today' ? (
            <div className="space-y-8">
              {/* Check-in Section */}
              <div className="text-center">
                <div className="mb-6">
                  {isCheckedIn ? (
                    <>
                      <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        You're Checked In!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Great! You're ready for tonight's session.
                      </p>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Ready to Play?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Check in when you arrive at the courts to get matched with other players.
                      </p>
                    </>
                  )}
                </div>
                
                {!isCheckedIn && (
                  <button 
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    className="w-full max-w-md bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    {checkingIn ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Checking In...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-5 w-5" />
                        <span>Check In - I'm Here!</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Partner Selection Section - Only show if checked in */}
              {isCheckedIn && (
                <div className="border-t border-gray-200/50 dark:border-slate-600/50 pt-8">
                  <div className="text-center mb-6">
                    <Heart className="h-12 w-12 text-pink-600 dark:text-pink-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedPartner ? 'Your Partner' : 'Select Your Partner'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedPartner 
                        ? 'You\'re paired up and ready for matches!'
                        : 'Choose someone from the checked-in players to be your doubles partner.'
                      }
                    </p>
                  </div>

                  {selectedPartner ? (
                    <div className="bg-pink-50/80 dark:bg-pink-900/20 border-2 border-pink-200 dark:border-pink-700 rounded-2xl p-4 max-w-md mx-auto">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-200 dark:bg-pink-800 rounded-full flex items-center justify-center">
                          <span className="text-pink-700 dark:text-pink-300 font-semibold">
                            {checkedInPlayers.find(p => p.id === selectedPartner)?.name.charAt(0) || 'P'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {checkedInPlayers.find(p => p.id === selectedPartner)?.name || 'Partner'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {checkedInPlayers.find(p => p.id === selectedPartner)?.skillLevel || 'Intermediate'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {checkedInPlayers
                        .filter(player => player.id !== user?.id && !player.hasPartner)
                        .map((player) => (
                          <button
                            key={player.id}
                            onClick={() => handlePartnerSelect(player.id)}
                            disabled={selectingPartner}
                            className="p-4 bg-white/80 dark:bg-slate-700/80 border-2 border-gray-200 dark:border-slate-600 hover:border-pink-300 dark:hover:border-pink-600 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                  {player.name.charAt(0)}
                                </span>
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-gray-900 dark:text-white">{player.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{player.skillLevel}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      
                      {checkedInPlayers.filter(p => p.id !== user?.id && !p.hasPartner).length === 0 && (
                        <div className="col-span-full text-center py-8">
                          <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">
                            No available partners yet. More players will appear here as they check in.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Checked-in Players List */}
              {checkedInPlayers.length > 0 && (
                <div className="border-t border-gray-200/50 dark:border-slate-600/50 pt-8">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                    Checked-in Players ({checkedInPlayers.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {checkedInPlayers.map((player) => (
                      <div
                        key={player.id}
                        className={`p-3 rounded-xl border text-center ${
                          player.hasPartner 
                            ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                            : 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                        }`}
                      >
                        <div className="w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {player.name.charAt(0)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {player.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {player.skillLevel}
                        </p>
                        {player.hasPartner && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Paired
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Coming Soon!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  This league night is scheduled for {leagueNight.nextDate}. Check back on the day to participate.
                </p>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default LeagueNightPage;