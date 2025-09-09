import { useLeagues } from '../hooks/useLeagues'
import { useNavigate } from 'react-router-dom'

function LeagueList() {
  const { leagues, loading, error } = useLeagues();
  const navigate = useNavigate();

  const handleViewLeague = (leagueId: number) => {
    navigate(`/league/${leagueId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leagues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">Failed to connect to the server</p>
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-green-600">Next-Up</h1>
              <span className="text-lg">🏓</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hello, Player</span>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Leagues
          </h2>
          <p className="text-gray-600">
            Discover pickleball leagues in your area and find the perfect fit for your skill level
          </p>
        </div>

        {/* League Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {leagues.map((league, index) => (
            <div 
              key={league.id}
              className={`group relative rounded-2xl p-6 transition-all duration-500 ${
                league.isActive 
                  ? 'bg-white border border-green-200 hover:border-green-300 hover:shadow-lg animate-pulse-glow' 
                  : 'bg-white/80 border border-slate-200 opacity-75 hover:opacity-90'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Active indicator */}
              {league.isActive && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              )}
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {league.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    league.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {league.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {league.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-4 text-gray-400">📍</span>
                    <span className="ml-2">{league.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 text-gray-400">📅</span>
                    <span className="ml-2">{league.leagueDays.join(', ')} at {league.startTime}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 text-gray-400">👥</span>
                    <span className="ml-2">{league.totalPlayers} members</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleViewLeague(league.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    league.isActive
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!league.isActive}
                >
                  {league.isActive ? 'View League' : 'Currently Inactive'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-medium text-gray-900">View Stats</div>
                <div className="text-sm text-gray-500">See your performance</div>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-2xl">👤</span>
              <div>
                <div className="font-medium text-gray-900">Edit Profile</div>
                <div className="text-sm text-gray-500">Update your info</div>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="font-medium text-gray-900">Leaderboard</div>
                <div className="text-sm text-gray-500">See top players</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LeagueList