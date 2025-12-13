import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { leaguesAPI } from '../services/api';
import { membershipService } from '../services/api/membership';
import type { League } from '../hooks/useLeagues';
import { Zap, Trophy, Search, BarChart3, Home, Calendar, MapPin, Users, Bell, User, Plus, LogOut } from 'lucide-react';
import { NotificationPermissionBanner } from '../components/NotificationPermission';

interface LeagueWithNight extends League {
  activeNightId?: string;
  activeNightDate?: string;
  activeNightStatus?: 'scheduled' | 'active' | 'completed';
  checkedInCount?: number;
  nextNightDate?: string;
  nextNightDay?: string;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const [myLeagues, setMyLeagues] = useState<LeagueWithNight[]>([]);
  const [activeTonight, setActiveTonight] = useState<LeagueWithNight | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract first name from user metadata
  const firstName = user?.user_metadata?.first_name || 'there';

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch all leagues
        const allLeagues = await leaguesAPI.getAll();
        
        // Filter to user's leagues
        const userLeagues: LeagueWithNight[] = [];
        
        for (const league of allLeagues) {
          const { isMember } = await membershipService.checkMembership(league.id, user.id);
          
          if (isMember) {
            // Check if league has a night happening today
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            const hasNightToday = league.leagueDays.includes(today);
            
            userLeagues.push({
              ...league,
              // For now, we'll add more detailed night info in a future enhancement
            });
          }
        }
        
        setMyLeagues(userLeagues);
        
        // Find active league night for tonight (if any)
        // For now, we'll show the first league that has a night today
        const todayLeague = userLeagues.find(league => {
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          return league.leagueDays.includes(today);
        });
        
        setActiveTonight(todayLeague || null);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-teal-300/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Top Bar */}
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-lg">
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
          Next-Up
        </h1>
        <div className="flex items-center gap-2 min-[375px]:gap-3">
          <button 
            onClick={() => {/* TODO: Notifications */}}
            className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 group relative"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform" />
            {/* <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 group"
          >
            <User className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={handleSignOut}
            className="p-2 rounded-full bg-red-100/80 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300 group"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Notification Permission Banner */}
      <NotificationPermissionBanner />

      {/* Main Content */}
      <div className="relative px-4 py-6 max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="mb-6 min-[375px]:mb-8">
          <h2 className="text-xl min-[375px]:text-2xl font-bold text-slate-900 dark:text-white mb-1 min-[375px]:mb-2">
            Hey <span className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">{firstName}</span>, ready to play?
          </h2>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-3 min-[375px]:gap-4">
            {/* Tonight */}
            <button
              onClick={() => navigate('/leagues?filter=tonight')}
              className="flex flex-col items-center gap-1.5 min-[375px]:gap-2 group"
            >
              <div className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                <Zap className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 text-white" />
              </div>
              <span className="text-xs min-[375px]:text-sm text-slate-700 dark:text-slate-300 font-medium">Tonight</span>
            </button>

            {/* My Leagues */}
            <button
              onClick={() => navigate('/leagues?filter=mine')}
              className="flex flex-col items-center gap-1.5 min-[375px]:gap-2 group"
            >
              <div className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                <Trophy className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 text-white" />
              </div>
              <span className="text-xs min-[375px]:text-sm text-slate-700 dark:text-slate-300 font-medium">My Leagues</span>
            </button>

            {/* Browse */}
            <button
              onClick={() => navigate('/leagues')}
              className="flex flex-col items-center gap-1.5 min-[375px]:gap-2 group"
            >
              <div className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                <Search className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 text-white" />
              </div>
              <span className="text-xs min-[375px]:text-sm text-slate-700 dark:text-slate-300 font-medium">Browse</span>
            </button>

            {/* Stats */}
            <button
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center gap-1.5 min-[375px]:gap-2 group"
            >
              <div className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                <BarChart3 className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 text-white" />
              </div>
              <span className="text-xs min-[375px]:text-sm text-slate-700 dark:text-slate-300 font-medium">Stats</span>
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 pb-24">
          {/* Happening Now Section */}
          {loading ? (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 animate-pulse shadow-xl">
              <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded"></div>
            </div>
          ) : activeTonight ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base min-[375px]:text-lg font-bold text-slate-900 dark:text-white">Happening Today</h3>
              </div>
              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 rounded-3xl p-4 min-[375px]:p-6 border border-emerald-400/50 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <h4 className="text-xl min-[375px]:text-2xl font-bold text-white mb-2">{activeTonight.name}</h4>
                  <div className="flex flex-wrap gap-2 mb-3 min-[375px]:mb-4">
                    <span className="px-2 min-[375px]:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Today
                    </span>
                    <span className="px-2 min-[375px]:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {activeTonight.startTime}
                    </span>
                    <span className="px-2 min-[375px]:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Users className="w-3 h-3" /> {activeTonight.totalPlayers}
                    </span>
                  </div>
                  <p className="text-emerald-50 text-xs min-[375px]:text-sm mb-3 min-[375px]:mb-4 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {activeTonight.location}
                  </p>
                  <button
                    onClick={() => navigate(`/league/${activeTonight.id}`)}
                    className="w-full bg-white text-emerald-600 font-semibold py-2.5 min-[375px]:py-3 px-3 min-[375px]:px-4 rounded-2xl hover:bg-emerald-50 active:bg-emerald-100 transition-all duration-200 hover:scale-105 text-sm min-[375px]:text-base shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-base min-[375px]:text-lg font-bold text-slate-900 dark:text-white">Next Up</h3>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-5 min-[375px]:p-6 border border-slate-200/50 dark:border-slate-700/50 text-center shadow-xl">
                <p className="text-sm min-[375px]:text-base text-slate-600 dark:text-slate-400">No games scheduled for today</p>
                <p className="text-xs min-[375px]:text-sm text-slate-500 dark:text-slate-500 mt-2">Check your leagues below for upcoming games</p>
              </div>
            </div>
          )}

          {/* Your Leagues Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base min-[375px]:text-lg font-bold text-slate-900 dark:text-white">Your Leagues</h3>
              </div>
              {myLeagues.length > 0 && (
                <button
                  onClick={() => navigate('/leagues?filter=mine')}
                  className="text-xs min-[375px]:text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 active:text-emerald-800 dark:active:text-emerald-500 transition-colors font-medium"
                >
                  See all →
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 animate-pulse shadow-xl">
                    <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : myLeagues.length > 0 ? (
              <div className="space-y-3">
                {myLeagues.map(league => (
                  <button
                    key={league.id}
                    onClick={() => navigate(`/league/${league.id}`)}
                    className="group w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-4 min-[375px]:p-5 border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 active:border-emerald-400 dark:active:border-emerald-500 transition-all duration-300 text-left shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base min-[375px]:text-lg font-semibold text-slate-900 dark:text-white mb-1 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{league.name}</h4>
                        <p className="text-xs min-[375px]:text-sm text-slate-600 dark:text-slate-400 mb-2 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" /> {league.location}
                        </p>
                        <div className="flex flex-wrap gap-1.5 min-[375px]:gap-2">
                          {league.leagueDays.map(day => (
                            <span key={day} className="px-2 py-0.5 min-[375px]:py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full whitespace-nowrap flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {day}s {league.startTime}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xl min-[375px]:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Trophy className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Join More Leagues Card */}
                <button
                  onClick={() => navigate('/leagues')}
                  className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-4 min-[375px]:p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 active:border-emerald-500 dark:active:border-emerald-500 transition-all duration-300 text-center shadow-xl hover:shadow-2xl hover:scale-105 group"
                >
                  <Plus className="w-6 h-6 min-[375px]:w-8 min-[375px]:h-8 mx-auto mb-1 min-[375px]:mb-2 text-slate-400 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  <p className="text-xs min-[375px]:text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Browse More Leagues</p>
                </button>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-6 min-[375px]:p-8 border border-slate-200/50 dark:border-slate-700/50 text-center shadow-xl">
                <Zap className="w-10 h-10 min-[375px]:w-12 min-[375px]:h-12 mx-auto mb-2 min-[375px]:mb-3 text-slate-400 dark:text-slate-600" />
                <p className="text-sm min-[375px]:text-base text-slate-600 dark:text-slate-400 mb-3 min-[375px]:mb-4">You haven't joined any leagues yet</p>
                <button
                  onClick={() => navigate('/leagues')}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-2 px-5 min-[375px]:px-6 rounded-2xl hover:from-emerald-600 hover:to-green-700 active:from-emerald-700 active:to-green-800 transition-all duration-200 hover:scale-105 text-sm min-[375px]:text-base shadow-xl"
                >
                  Browse Leagues
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 px-4 py-3 safe-area-bottom shadow-lg z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400 group"
          >
            <Home className="w-6 h-6 stroke-[2.5] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Home</span>
          </button>
          <button 
            onClick={() => navigate('/leagues?filter=tonight')}
            className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 group"
          >
            <Zap className="w-6 h-6 stroke-[2] group-hover:scale-110 transition-transform" />
            <span className="text-xs">Tonight</span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 group"
          >
            <BarChart3 className="w-6 h-6 stroke-[2] group-hover:scale-110 transition-transform" />
            <span className="text-xs">Stats</span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 group"
          >
            <User className="w-6 h-6 stroke-[2] group-hover:scale-110 transition-transform" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
