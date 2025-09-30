import { useLeagues } from '../hooks/useLeagues'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun, Zap, Trophy, Users, MapPin, Calendar, Star, ArrowRight, Play, User } from 'lucide-react'

function LeagueList() {
  const { leagues, loading, error } = useLeagues();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleViewLeague = (leagueId: number) => {
    // Check if user is authenticated before allowing league access
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/league/${leagueId}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 dark:border-green-700 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-green-600 dark:border-t-green-400 mx-auto"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading leagues...</p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 dark:from-slate-900 dark:via-red-900 dark:to-rose-900 flex items-center justify-center">
        <div className="text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="text-red-500 dark:text-red-400 text-6xl mb-4 animate-bounce">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Failed to connect to the server</p>
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-2">
              <span>Retry</span>
              <ArrowRight className="h-4 w-4" />
            </div>
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

      {/* Header */}
      <header className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Next-Up Logo"
                className="h-12 sm:h-16 md:h-20 lg:h-22 w-auto"
              />
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
              
              {user ? (
                <>
                  {/* Desktop Profile Button */}
                  <button
                    onClick={() => navigate('/profile')}
                    className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-full backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    <span className="text-green-600 dark:text-green-400 font-medium">Hello,</span> {user?.user_metadata?.full_name || user?.email || 'Player'}
                  </button>

                  {/* Mobile Profile Button */}
                  <button
                    onClick={() => navigate('/profile')}
                    className="sm:hidden bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-all duration-200 flex items-center justify-center"
                    title="My Profile"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  <button 
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              <span>South Africa's Premier Pickleball Platform</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-green-600 to-emerald-600 dark:from-white dark:via-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Discover Amazing
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Pickleball Leagues
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
              Join dynamic leagues, track your progress, and become part of South Africa's fastest-growing pickleball community. 
              <span className="font-semibold text-green-600 dark:text-green-400">
                {!user && 'Sign in to unlock your potential!'}
              </span>
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {!user && (
                <button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
                >
                  <Play className="h-5 w-5" />
                  <span>Get Started Now</span>
                </button>
              )}
              <button className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3">
                <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>View Leaderboards</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-300">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">25+</div>
                <div className="text-gray-600 dark:text-gray-300">Leagues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">10K+</div>
                <div className="text-gray-600 dark:text-gray-300">Matches Played</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Leagues Section */}
      <section className="relative max-w-7xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Active <span className="text-green-600 dark:text-green-400">Leagues</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse leagues in your area and find the perfect fit for your skill level
          </p>
        </div>

        {/* League Cards */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {leagues.map((league, index) => (
            <div 
              key={league.id}
              className={`group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-105 ${
                league.isActive 
                  ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-green-200/50 dark:border-green-700/50 hover:border-green-300 dark:hover:border-green-600 shadow-xl hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10' 
                  : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 opacity-75 hover:opacity-90'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 opacity-5 ${
                league.isActive 
                  ? 'bg-gradient-to-br from-green-400 to-emerald-600' 
                  : 'bg-gradient-to-br from-gray-400 to-slate-600'
              }`}></div>
              
              {/* Active indicator */}
              {league.isActive && (
                <div className="absolute top-6 right-6 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100/80 dark:bg-green-900/30 px-2 py-1 rounded-full backdrop-blur-sm">
                    LIVE
                  </span>
                </div>
              )}
              
              <div className="relative p-4 sm:p-6 md:p-8">
                <div className="mb-4 sm:mb-6">
                  <div className="mb-2 sm:mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {league.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                    {league.description}
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 text-green-500 dark:text-green-400 mr-3" />
                      <span>{league.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 text-green-500 dark:text-green-400 mr-3" />
                      <span>{league.leagueDays.join(', ')} at {league.startTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4 text-green-500 dark:text-green-400 mr-3" />
                      <span>{league.totalPlayers} active members</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200/50 dark:border-slate-600/50">
                  <button 
                    onClick={() => handleViewLeague(league.id)}
                    className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      league.isActive
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!league.isActive}
                  >
                    <span>{league.isActive ? (user ? 'View League' : 'Join League') : 'Currently Inactive'}</span>
                    {league.isActive && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Quick Actions */}
      <section className="relative max-w-7xl mx-auto px-4 pb-8 sm:pb-16">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quick Actions
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Everything you need to manage your pickleball journey</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <button className="group flex flex-col items-center space-y-3 sm:space-y-4 p-4 sm:p-6 text-center hover:bg-green-50/50 dark:hover:bg-green-900/20 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-green-200 dark:hover:border-green-700/50">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">View Stats</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Track your performance and progress</div>
              </div>
            </button>
            
            <button className="group flex flex-col items-center space-y-3 sm:space-y-4 p-4 sm:p-6 text-center hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-blue-200 dark:hover:border-blue-700/50">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">Edit Profile</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Update your information and preferences</div>
              </div>
            </button>
            
            <button className="group flex flex-col items-center space-y-3 sm:space-y-4 p-4 sm:p-6 text-center hover:bg-purple-50/50 dark:hover:bg-purple-900/20 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-purple-200 dark:hover:border-purple-700/50">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">Leaderboard</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">See top players and rankings</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/20 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/logo.png"
                alt="Next-Up Logo"
                className="h-20 sm:h-24 md:h-28 w-auto"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Revolutionizing pickleball leagues across South Africa
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">About</a>
              <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">Contact</a>
              <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LeagueList