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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(34, 197, 94, 0.1) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, rgba(59, 130, 246, 0.1) 2px, transparent 0)`,
          backgroundSize: '100px 100px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative glass border-b border-white/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-blue-600/5 to-primary-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <h1 className="text-4xl font-bold text-shimmer">Next-Up</h1>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">P</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-700">Hello, Player</p>
                  <p className="text-xs text-slate-500">Ready to play?</p>
                </div>
              </div>
              <button className="glass px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-white/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="mb-16 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-primary-600 to-slate-900 bg-clip-text text-transparent mb-6 leading-normal px-4 py-2">
            Select Your League
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto px-4 mb-6">
            Choose which league you want to join tonight and connect with fellow players
          </p>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
          </div>
        </div>

        {/* League Cards */}
        <div className="grid gap-8 md:gap-6">
          {leagues.map((league, index) => (
            <div 
              key={league.id}
              className={`group relative card-hover rounded-2xl p-8 transition-all duration-500 ${
                league.isActive 
                  ? 'glass border border-primary-200/50 hover:border-primary-300/70 animate-pulse-glow' 
                  : 'bg-white/80 border border-slate-200 opacity-75 hover:opacity-90'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                league.isActive 
                  ? 'bg-gradient-to-br from-primary-50/50 to-blue-50/50'
                  : 'bg-gradient-to-br from-slate-50/50 to-gray-50/50'
              }`}></div>
              
              {/* Active indicator */}
              {league.isActive && (
                <div className="absolute top-4 right-4 w-4 h-4 bg-primary-500 rounded-full animate-pulse shadow-lg shadow-primary-500/50"></div>
              )}
              
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors duration-300">
                      {league.name}
                    </h3>
                    {league.isActive && (
                      <span className="status-active inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-100 to-green-100 text-primary-800 shadow-sm">
                        🔥 Active Tonight
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-slate-600 text-lg">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {league.location}
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-slate-500">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{league.nextGame}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      <span className="font-medium">
                        {league.playersTonight} players checked in
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:ml-8">
                  {league.isActive ? (
                    <button className="btn-primary w-full lg:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-200">
                      Join League
                      <svg className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ) : (
                    <button className="w-full lg:w-auto bg-gradient-to-r from-slate-200 to-slate-300 text-slate-500 px-8 py-4 rounded-xl font-semibold text-lg cursor-not-allowed opacity-75">
                      No Games Tonight
                      <svg className="inline-block w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-16 relative">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">
              Quick Actions
            </h3>
            <p className="text-slate-600">Everything you need at your fingertips</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group relative glass rounded-2xl p-8 text-left hover:bg-white/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-200">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="font-bold text-xl text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">View Stats</div>
                <div className="text-slate-600">Track your performance, wins, and improvement over time</div>
                <div className="flex items-center mt-4 text-blue-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
                  <span>Explore</span>
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </button>
            
            <button className="group relative glass rounded-2xl p-8 text-left hover:bg-white/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-200">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="font-bold text-xl text-slate-900 mb-2 group-hover:text-primary-700 transition-colors duration-300">Edit Profile</div>
                <div className="text-slate-600">Update your information, preferences, and playing style</div>
                <div className="flex items-center mt-4 text-primary-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
                  <span>Customize</span>
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </button>
            
            <button className="group relative glass rounded-2xl p-8 text-left hover:bg-white/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-200">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="font-bold text-xl text-slate-900 mb-2 group-hover:text-accent-700 transition-colors duration-300">Leaderboard</div>
                <div className="text-slate-600">See top players, rankings, and competitive standings</div>
                <div className="flex items-center mt-4 text-accent-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
                  <span>View Rankings</span>
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 glass rounded-2xl px-8 py-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">24</div>
              <div className="text-sm text-slate-600">Active Leagues</div>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-slate-600">Players Online</div>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">89</div>
              <div className="text-sm text-slate-600">Games Today</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

