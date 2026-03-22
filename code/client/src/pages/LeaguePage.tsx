import { useParams, useNavigate } from 'react-router-dom'
import { useLeague, useTopPlayers, useLeagueStats } from '../hooks/useLeagues'
import { useLeaderboard, type LeaderboardCategory } from '../hooks/useLeaderboard'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../contexts/ThemeContext'
import { useMembership, useLeagueMembers } from '../hooks/useMembership'
import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Users, 
  Calendar, 
  MapPin, 
  Trophy, 
  TrendingUp, 
  Medal,
  BarChart3,
  Crown,
  ArrowRight,
  Play,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Activity,
  Flame,
  Lock
} from 'lucide-react'
import BottomNav from '../components/BottomNav'

// ===================================
// TYPE DEFINITIONS 
// TODO: Move these to a shared types file when implementing real API
// ===================================

// LeagueStats interface is now imported from useLeagues hook

// TopPlayer interface is now imported from useLeagues hook

// RecentGame interface removed - not needed for league overview

interface LeagueNight {
  id: string
  day: string
  time: string
  nextDate: string
  lastAttendance: number
  avgAttendance: number
  upcomingGames: number
  status: 'upcoming' | 'today' | 'cancelled'
  lastWinners: string[]
  courtsAvailable: number
}

function LeaguePage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // ===================================
  // HOOKS - These will fetch real data via API
  // ===================================
  const { league, loading, error } = useLeague(parseInt(leagueId || '0'));
  const { user, loading: authLoading, signOut } = useAuth();
  const { isMember, loading: membershipLoading, joining, joinLeague } = useMembership(
    parseInt(leagueId || '0'), 
    user?.id || null
  );
  const { members } = useLeagueMembers(parseInt(leagueId || '0'));
  const { topPlayers, loading: topPlayersLoading, error: topPlayersError } = useTopPlayers(leagueId, user?.email || '');

  // Leaderboard state
  const [leaderboardCategory, setLeaderboardCategory] = useState<LeaderboardCategory>('overall');
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard(
    leagueId ? parseInt(leagueId) : null,
    leaderboardCategory,
    user?.id
  );

  // ===================================
  // STATE - Will be populated from API calls
  // TODO: Replace remaining mock data with real API data fetching
  // ===================================
  // Recent games state removed - focusing on league nights only
  const [leagueNights, setLeagueNights] = useState<LeagueNight[]>([]);
  // Use real league statistics hook
  const { stats: leagueStats, loading: statsLoading } = useLeagueStats(leagueId);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Handle league night navigation
  const handleLeagueNightClick = (nightId: string) => {
    navigate(`/league/${leagueId}/night/${nightId}`);
  };

  // ===================================
  // AUTHENTICATION REDIRECT
  // TODO: This logic will remain the same
  // ===================================
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // ===================================
  // API DATA FETCHING
  // TODO: Replace remaining mock data with real API endpoints
  // ===================================
  
  useEffect(() => {
    const fetchLeagueData = async () => {
      if (!leagueId || !league) return;

      try {
        // TODO: Replace with real API calls for remaining data:
        // - GET /api/leagues/{id}/stats
        // - GET /api/leagues/{id}/recent-games
        // - GET /api/leagues/{id}/schedule
        // - GET /api/leagues/{id}/analytics

        // Recent games mock data removed - focusing on league statistics and schedule

        const mockLeagueNights: LeagueNight[] = league.leagueDays.map((day, index) => ({
          id: `night-${index}`,
          day,
          time: league.startTime,
          nextDate: getNextDateForDay(day),
          lastAttendance: Math.floor(Math.random() * 15) + 20,
          avgAttendance: Math.floor(Math.random() * 10) + 25,
          upcomingGames: Math.floor(Math.random() * 8) + 4,
          // For testing purposes, make the first league night "today" so we can test check-in
          status: day === getTodayDay() ? 'today' : 'upcoming' as any,
          lastWinners: ['Team Rodriguez/Chen', 'Team Mitchell/Wilson'],
          courtsAvailable: 4
        }));

        // Simulate API delay for remaining mock data
        await new Promise(resolve => setTimeout(resolve, 300));

        setLeagueNights(mockLeagueNights);

      } catch (error) {
        console.error('Failed to fetch league data:', error);
        // TODO: Implement proper error handling with user feedback
      }
    };

    fetchLeagueData();
  }, [leagueId, league, members.length]);

  // ===================================
  // STATS CAROUSEL AUTO-CYCLING
  // TODO: This will work with real API data
  // ===================================
  
  // Create stats array with just the 3 key metrics
  const statsArray = leagueStats ? [
    {
      icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      bgGradient: "from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50",
      value: leagueStats.totalMembers,
      label: "Total Members",
      trend: <TrendingUp className="h-4 w-4 text-green-500" />
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      bgGradient: "from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50",
      value: leagueStats.averageAttendance,
      label: "Avg League Attendance",
      trend: <TrendingUp className="h-4 w-4 text-green-500" />
    },
    {
      icon: <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
      bgGradient: "from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50",
      value: leagueStats.totalGamesPlayed,
      label: "Total Games Played",
      trend: <TrendingUp className="h-4 w-4 text-green-500" />
    }
  ] : [];

  // Auto-cycle through stats
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % statsArray.length);
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, statsArray.length]);

  const handlePrevStat = () => {
    setIsAutoPlaying(false);
    setCurrentStatIndex((prev) => (prev - 1 + statsArray.length) % statsArray.length);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNextStat = () => {
    setIsAutoPlaying(false);
    setCurrentStatIndex((prev) => (prev + 1) % statsArray.length);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      handleNextStat();
    } else {
      handlePrevStat();
    }
  };

  // ===================================
  // UTILITY FUNCTIONS
  // TODO: Move to utils file
  // ===================================
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getNextDateForDay = (dayName: string): string => {
    const today = new Date();
    // Convert to SAST (UTC+2)
    const sastOffset = 2 * 60; // SAST is UTC+2
    const utc = today.getTime() + (today.getTimezoneOffset() * 60000);
    const sastTime = new Date(utc + (sastOffset * 60000));
    
    const targetDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName);
    const todayDay = sastTime.getDay();
    let daysUntilTarget = targetDay - todayDay;
    
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7;
    }
    
    const targetDate = new Date(sastTime);
    targetDate.setDate(sastTime.getDate() + daysUntilTarget);
    
    return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTodayDay = (): string => {
    const today = new Date();
    // Convert to SAST (UTC+2)
    const sastOffset = 2 * 60; // SAST is UTC+2
    const utc = today.getTime() + (today.getTimezoneOffset() * 60000);
    const sastTime = new Date(utc + (sastOffset * 60000));
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[sastTime.getDay()];
  };

  // ===================================
  // LOADING STATES
  // ===================================

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 dark:border-green-700 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-green-600 dark:border-t-green-400 mx-auto"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 dark:border-green-700 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-green-600 dark:border-t-green-400 mx-auto"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading league details...</p>
        </div>
      </div>
    );
  }

  if (error || !league) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 dark:from-slate-900 dark:via-red-900 dark:to-rose-900 flex items-center justify-center">
        <div className="text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="text-red-500 dark:text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">League Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The league you're looking for doesn't exist or you don't have access to it</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Leagues</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-teal-300/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-2 sm:p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group"
              >
                <ArrowLeft className="h-4 sm:h-5 w-4 sm:w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-sm sm:text-base font-medium">Back</span>
              </button>

              <div className="sm:border-l border-gray-300 dark:border-gray-600 sm:pl-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {league.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm">{league.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm">{league.leagueDays.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600 dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" />
                ) : (
                  <Sun className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500 group-hover:rotate-12 transition-transform duration-300" />
                )}
              </button>

              {user && (
                <>
                  <div className="hidden lg:block text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-full backdrop-blur-sm">
                    <span className="text-green-600 dark:text-green-400 font-medium">Hello,</span> {user?.user_metadata?.first_name || user?.email || 'Player'}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 pb-24">
        
        {/* League Overview Hero Section */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl">
                  <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About This League</h2>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {league.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50/50 dark:bg-slate-700/50 rounded-xl">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Schedule</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {league.leagueDays.join(', ')} at {league.startTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50/50 dark:bg-slate-700/50 rounded-xl">
                  <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Venue</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{league.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Membership Status & Action */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg p-4">
                  <img
                    src="/logo.png"
                    alt="Next-Up Logo"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">League Status</div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-400 font-semibold">Active & Thriving</span>
                  </div>
                </div>
              </div>
              
              {/* Join League Action */}
              {!membershipLoading && (
                <div className="w-full max-w-xs">
                  {isMember ? (
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 rounded-2xl">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400 font-bold">You're a Member!</span>
                      </div>
                      <div className="text-xs text-green-500 dark:text-green-400">Ready to dominate the courts</div>
                    </div>
                  ) : (
                    <button
                      onClick={joinLeague}
                      disabled={joining}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      {joining ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" />
                          <span>Join League</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* League Statistics - Responsive Design */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl">
                <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">League Statistics</h3>
                <p className="text-gray-600 dark:text-gray-300">Key performance metrics</p>
              </div>
            </div>
            
            {/* Navigation Controls - Only visible on mobile */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={handlePrevStat}
                className="p-2 rounded-full bg-gray-100/80 dark:bg-slate-700/80 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 group"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:-translate-x-0.5 transition-transform duration-300" />
              </button>
              <button
                onClick={handleNextStat}
                className="p-2 rounded-full bg-gray-100/80 dark:bg-slate-700/80 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 group"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Desktop Grid Layout - Hidden on mobile */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {statsLoading ? (
              // Loading skeleton for desktop
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gray-50/50 dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-600/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-200 dark:bg-slate-600 rounded-xl animate-pulse w-14 h-14"></div>
                    <div className="w-6 h-6 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded animate-pulse w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))
            ) : (
              statsArray.map((stat, index) => (
                <div key={index} className="bg-gray-50/50 dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-600/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} rounded-xl`}>
                      {stat.icon}
                    </div>
                    {stat.trend}
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile Carousel Layout - Hidden on desktop */}
          <div className="lg:hidden">
            <div className="relative overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentStatIndex * 100}%)` }}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  const startX = touch.clientX;
                  
                  const handleTouchEnd = (endEvent: TouchEvent) => {
                    const endX = endEvent.changedTouches[0].clientX;
                    const diff = startX - endX;
                    
                    if (Math.abs(diff) > 50) { // Minimum swipe distance
                      handleSwipe(diff > 0 ? 'left' : 'right');
                    }
                    
                    document.removeEventListener('touchend', handleTouchEnd);
                  };
                  
                  document.addEventListener('touchend', handleTouchEnd);
                }}
              >
                {statsLoading ? (
                  // Loading skeleton for mobile
                  <div className="w-full flex-shrink-0 p-2">
                    <div className="bg-gray-50/50 dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-600/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gray-200 dark:bg-slate-600 rounded-xl animate-pulse w-14 h-14"></div>
                        <div className="w-6 h-6 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                      </div>
                      <div className="text-center">
                        <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded animate-pulse w-3/4 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  statsArray.map((stat, index) => (
                    <div 
                      key={index}
                      className="w-full flex-shrink-0 p-2"
                    >
                      <div className="bg-gray-50/50 dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-600/50">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} rounded-xl`}>
                            {stat.icon}
                          </div>
                          {stat.trend}
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Indicators - Only on mobile */}
            <div className="flex justify-center space-x-2 mt-4">
              {statsArray.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentStatIndex(index);
                    setTimeout(() => setIsAutoPlaying(true), 10000);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStatIndex 
                      ? 'bg-green-600 dark:bg-green-400 w-6' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            {/* Auto-play indicator - Only on mobile */}
            <div className="flex items-center justify-center mt-3">
              <div className={`flex items-center space-x-2 text-xs ${
                isAutoPlaying ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span>{isAutoPlaying ? 'Auto-cycling' : 'Manual'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboards */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 rounded-2xl">
                <Trophy className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Leaderboards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">See where you rank</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/leaderboard?league=${leagueId}&category=${leaderboardCategory}`)}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View Full</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide pb-1">
            {([
              { key: 'overall' as LeaderboardCategory, label: 'Overall', icon: Trophy, desc: 'Balanced ranking based on wins, scoring, and games played' },
              { key: 'games' as LeaderboardCategory, label: 'Games', icon: Activity, desc: 'Most games played.rewarding dedication and consistency' },
              { key: 'avg_score' as LeaderboardCategory, label: 'Avg Score', icon: TrendingUp, desc: 'Highest average score per game (min 5 games)' },
              { key: 'win_streak' as LeaderboardCategory, label: 'Streak', icon: Flame, desc: 'Longest consecutive wins.who went on the best run?' },
              { key: 'attendance' as LeaderboardCategory, label: 'Attendance', icon: Calendar, desc: 'Most consecutive weeks attended.the regulars' },
            ]).map(cat => {
              const Icon = cat.icon;
              const isActive = leaderboardCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setLeaderboardCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Category description */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 px-1">
            {([
              { key: 'overall', desc: 'Balanced ranking based on wins, scoring, and games played' },
              { key: 'games', desc: 'Most games played.rewarding dedication and consistency' },
              { key: 'avg_score', desc: 'Highest average score per game (min 5 games)' },
              { key: 'win_streak', desc: 'Longest consecutive wins.who went on the best run?' },
              { key: 'attendance', desc: 'Most consecutive weeks attended.the regulars' },
            ]).find(c => c.key === leaderboardCategory)?.desc}
          </p>

          {/* Unlock message */}
          {leaderboard?.currentUser && leaderboard.currentUser.gamesNeeded > 0 && (
            <div className="mb-4 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 p-3 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Play <span className="font-bold">{leaderboard.currentUser.gamesNeeded} more game{leaderboard.currentUser.gamesNeeded !== 1 ? 's' : ''}</span> to unlock your ranking
              </p>
            </div>
          )}

          {/* Loading */}
          {leaderboardLoading && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-28 mb-1.5" />
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!leaderboardLoading && (!leaderboard?.players || leaderboard.players.length === 0) && (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No players qualify yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {leaderboard?.minGames ? `Min ${leaderboard.minGames} games required` : 'Play some games to populate this leaderboard'}
              </p>
            </div>
          )}

          {/* Leaderboard List */}
          {!leaderboardLoading && leaderboard?.players && leaderboard.players.length > 0 && (
            <div>
              {/* Show top 5 */}
              {leaderboard.players.slice(0, 5).map((player, i) => {
                const isCurrentUser = player.userId === user?.id;
                const isTop3 = player.rank <= 3;
                const rankColors = player.rank === 1
                  ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700'
                  : player.rank === 2
                    ? 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                    : player.rank === 3
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700'
                      : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent';

                return (
                  <div
                    key={player.userId}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors ${
                      isCurrentUser
                        ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/50'
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-700/30'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isTop3 ? `border ${rankColors}` : rankColors}`}>
                      {player.rank}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>
                        {player.name}
                        {isCurrentUser && <span className="text-[10px] font-normal ml-1 text-emerald-500">(You)</span>}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        {player.gamesPlayed} games &middot; {player.winRate}% wins
                      </p>
                    </div>

                    {/* Value */}
                    <div className="text-right flex-shrink-0">
                      <span className={`text-sm font-bold ${isTop3 ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' : 'text-gray-700 dark:text-gray-300'}`}>
                        {player.displayValue}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Current user card */}
              {leaderboard.currentUser?.rank && (
                <div className="mt-2 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 p-3">
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mb-1.5 uppercase tracking-wide">Your Ranking</p>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                      {leaderboard.currentUser.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 truncate">{leaderboard.currentUser.name}</p>
                      <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">{leaderboard.currentUser.gamesPlayed} games &middot; {leaderboard.currentUser.winRate}% wins</p>
                    </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{leaderboard.currentUser.displayValue}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* League Nights Schedule - Full Width */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">League Nights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Upcoming sessions</p>
            </div>
          </div>

            <div className="space-y-4">
              {leagueNights.map((night) => (
                <div 
                  key={night.id}
                  onClick={() => handleLeagueNightClick(night.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer group hover:scale-[1.02] hover:shadow-xl ${
                    night.status === 'today' 
                      ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-700 shadow-green-100 dark:shadow-green-900/20' 
                      : 'bg-gray-50/50 dark:bg-slate-700/50 border-gray-200/50 dark:border-slate-600/50 hover:border-green-300 dark:hover:border-green-600'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-6">
                      <div className={`w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base md:text-lg transition-colors ${
                        night.status === 'today' 
                          ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300' 
                          : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 group-hover:bg-green-200 dark:group-hover:bg-green-800'
                      }`}>
                        {night.day.slice(0, 3)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{night.day} League</h4>
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          {night.status === 'today' ? 'Today' : night.nextDate} at {night.time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 sm:space-x-6">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{night.avgAttendance}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Avg Players</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{night.upcomingGames}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Games</div>
                      </div>
                      <ArrowRight className="h-5 sm:h-6 w-5 sm:w-6 text-green-600 dark:text-green-400 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </section>

        {/* League Members */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">League Members</h3>
                <p className="text-gray-600 dark:text-gray-300">{members.length} active players in this league</p>
              </div>
            </div>
            <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center space-x-1">
              <span>Manage Members</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div key={member.id} className="p-4 bg-gray-50/50 dark:bg-slate-700/50 rounded-xl border border-gray-200/50 dark:border-slate-600/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {member.name}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.skillLevel === 'Beginner' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                          member.skillLevel === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                          'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {member.skillLevel}
                        </span>
                        {member.role === 'admin' && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Member since {new Date(member.joinedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No members yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to join this amazing league!</p>
            </div>
          )}
        </section>

      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

export default LeaguePage