import { useParams, useNavigate } from 'react-router-dom'
import { useLeague, useTopPlayers, useLeagueStats, type LeagueStats } from '../hooks/useLeagues'
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
  Clock, 
  Star,
  Medal,
  BarChart3,
  Crown,
  ArrowRight,
  Play,
  UserCheck,
  ChevronRight,
  Sparkles,
  ChevronLeft
} from 'lucide-react'

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

interface Member {
  id: string
  name: string
  email: string
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced'
  role: 'player' | 'admin'
  joinedAt: string
  gamesPlayed: number
  avgScore: number
  winRate: number
  isActive: boolean
  lastSeen?: string
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
  const { members, loading: membersLoading } = useLeagueMembers(parseInt(leagueId || '0'));
  const { topPlayers, loading: topPlayersLoading, error: topPlayersError } = useTopPlayers(leagueId, user?.email || '');

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
          status: index === 0 ? 'today' : (day === getTodayDay() ? 'today' : 'upcoming') as any,
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Back to Leagues</span>
              </button>
              
              <div className="border-l border-gray-300 dark:border-gray-600 pl-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {league.name}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{league.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">{league.leagueDays.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-500 group-hover:rotate-12 transition-transform duration-300" />
                )}
              </button>

              {user && (
                <>
                  <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-full backdrop-blur-sm">
                    <span className="text-green-600 dark:text-green-400 font-medium">Hello,</span> {user?.user_metadata?.full_name || user?.email || 'Player'}
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
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
      <main className="relative max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* League Overview Hero Section */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8">
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
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <span className="text-3xl">🥎</span>
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
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
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

        {/* Top Players Leaderboard */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 rounded-2xl">
                <Crown className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Top Players</h3>
                <p className="text-gray-600 dark:text-gray-300">League champions leading the pack</p>
              </div>
            </div>
            <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {topPlayersLoading ? (
            <div className="text-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 dark:border-green-700 mx-auto mb-4"></div>
                <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-green-600 dark:border-t-green-400 mx-auto"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Loading top players...</p>
            </div>
          ) : topPlayersError ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-red-300 dark:text-red-600 mx-auto mb-4" />
              <p className="text-red-500 dark:text-red-400 text-lg">Failed to load top players</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">{topPlayersError}</p>
            </div>
          ) : topPlayers.length > 0 ? (
            <div className="space-y-4">
              {/* Top 3 Podium */}
              <div className="flex justify-center items-end mb-8">
                <div className="flex items-end space-x-6">
                {/* 2nd Place */}
                {topPlayers[1] && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Medal className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-4 py-6 rounded-2xl min-h-[120px] flex flex-col justify-center shadow-lg border w-36 text-center">
                      <div className="font-bold text-gray-900 dark:text-white text-sm">{topPlayers[1].name}</div>
                      <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{topPlayers[1].avgScore}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{topPlayers[1].gamesPlayed} games</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{topPlayers[1].winRate}% win rate</div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topPlayers[0] && (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center mb-3 shadow-xl">
                      <Crown className="h-10 w-10 text-yellow-700" />
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-300 dark:border-yellow-600 px-6 py-8 rounded-2xl min-h-[140px] flex flex-col justify-center shadow-xl w-36 text-center">
                      <div className="font-bold text-gray-900 dark:text-white">{topPlayers[0].name}</div>
                      {topPlayers[0].isCurrentUser && (
                        <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full mb-1">You!</div>
                      )}
                      <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{topPlayers[0].avgScore}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{topPlayers[0].gamesPlayed} games</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{topPlayers[0].winRate}% win rate</div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topPlayers[2] && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-red-300 dark:from-orange-800 dark:to-red-700 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Medal className="h-8 w-8 text-orange-700 dark:text-orange-300" />
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 px-4 py-6 rounded-2xl min-h-[120px] flex flex-col justify-center shadow-lg border border-orange-200 dark:border-orange-700 w-36 text-center">
                      <div className="font-bold text-gray-900 dark:text-white text-sm">{topPlayers[2].name}</div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{topPlayers[2].avgScore}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{topPlayers[2].gamesPlayed} games</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{topPlayers[2].winRate}% win rate</div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No player statistics available yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Start playing games to see the leaderboard!</p>
            </div>
          )}
        </section>

        {/* League Nights Schedule - Full Width */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors ${
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
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{night.avgAttendance}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Avg Players</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{night.upcomingGames}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Games</div>
                      </div>
                      <ArrowRight className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:translate-x-2 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </section>

        {/* League Members */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
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
    </div>
  )
}

export default LeaguePage