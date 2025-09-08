import './App.css'

function App() {
  // Mock data - this would come from your backend/Supabase
  const leagues = [
    {
      id: 1,
      name: "Northcliff Eagles",
      location: "Northcliff Sports Club",
      nextGame: "Today, 6:00 PM",
      playersTonight: 12,
      isActive: true
    },
    {
      id: 2,
      name: "Sandton Smashers", 
      location: "Sandton Recreation Center",
      nextGame: "Tomorrow, 7:00 PM",
      playersTonight: 8,
      isActive: true
    },
    {
      id: 3,
      name: "Rosebank Rackets",
      location: "Rosebank Club",
      nextGame: "Wednesday, 6:30 PM", 
      playersTonight: 0,
      isActive: false
    }
  ];

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
            Select Your League
          </h2>
          <p className="text-gray-600">
            Choose which league you want to join tonight
          </p>
        </div>

        {/* League Cards */}
        <div className="space-y-4">
          {leagues.map((league) => (
            <div 
              key={league.id}
              className={`bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                league.isActive 
                  ? 'border-green-200 hover:border-green-300' 
                  : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {league.name}
                    </h3>
                    {league.isActive && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active Tonight
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    📍 {league.location}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>
                      🕐 {league.nextGame}
                    </span>
                    <span>
                      👥 {league.playersTonight} players checked in
                    </span>
                  </div>
                </div>
                
                <div className="ml-6">
                  {league.isActive ? (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                      Join League
                    </button>
                  ) : (
                    <button className="bg-gray-200 text-gray-500 px-6 py-3 rounded-lg font-medium cursor-not-allowed">
                      No Games Tonight
                    </button>
                  )}
                </div>
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

export default App

