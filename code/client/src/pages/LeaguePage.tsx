import { useParams, useNavigate } from 'react-router-dom'
import { useLeague } from '../hooks/useLeagues'
import { useAuth } from '../hooks/useAuth'
import { useMembership, useLeagueMembers } from '../hooks/useMembership'
import { useState, useEffect } from 'react'

interface TopPlayer {
  id: string
  name: string
  avgScore: number
  gamesPlayed: number
  position: number
}

function LeaguePage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  const { league, loading, error } = useLeague(parseInt(leagueId || '0'));
  const { user, loading: authLoading, signOut } = useAuth();
  const { isMember, loading: membershipLoading, joining, joinLeague } = useMembership(
    parseInt(leagueId || '0'), 
    user?.id || null
  );
  const { members, loading: membersLoading } = useLeagueMembers(parseInt(leagueId || '0'));
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Redirect to auth if user is not authenticated (only after auth loading is complete)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Fetch top players when league loads
  useEffect(() => {
    const fetchTopPlayers = async () => {
      if (leagueId) {
        try {
          const response = await fetch(`http://localhost:3001/api/leagues/${leagueId}/top-players`);
          const data = await response.json();
          if (data.success) {
            setTopPlayers(data.data);
          }
        } catch (err) {
          console.error('Failed to fetch top players:', err);
        }
        setStatsLoading(false);
      }
    };

    fetchTopPlayers();
  }, [leagueId]);

  // League stats derived from real data
  const leagueStats = {
    totalMembers: members.length, // Use real membership count
    gamesThisMonth: 24, // This would come from a games table later
    averageAttendance: Math.round(members.length * 0.7), // Estimate 70% attendance
    totalGamesPlayed: 156, // This would come from a games table later
    topScorers: topPlayers.slice(0, 3) // Use real top players data
  };

  // Generate league night cards based on league days
  const getLeagueNights = () => {
    if (!league) return [];
    
    return league.leagueDays.map((day, index) => {
      // Mock data for each league night
      const mockData = {
        Monday: { 
          nextDate: 'Sept 11, 2025', 
          lastAttendance: 28, 
          avgAttendance: 26,
          status: 'upcoming',
          lastWinner: 'Team Rodriguez/Chen'
        },
        Tuesday: { 
          nextDate: 'Sept 12, 2025', 
          lastAttendance: 24, 
          avgAttendance: 25,
          status: 'upcoming',
          lastWinner: 'Team Wilson/Davis'
        },
        Wednesday: { 
          nextDate: 'Sept 13, 2025', 
          lastAttendance: 32, 
          avgAttendance: 29,
          status: 'upcoming',
          lastWinner: 'Team Mitchell/Lee'
        },
        Thursday: { 
          nextDate: 'Sept 14, 2025', 
          lastAttendance: 22, 
          avgAttendance: 24,
          status: 'upcoming',
          lastWinner: 'Team Garcia/Smith'
        },
        Friday: { 
          nextDate: 'Sept 15, 2025', 
          lastAttendance: 18, 
          avgAttendance: 20,
          status: 'upcoming',
          lastWinner: 'Team Brown/Taylor'
        },
        Saturday: { 
          nextDate: 'Sept 16, 2025', 
          lastAttendance: 35, 
          avgAttendance: 33,
          status: 'upcoming',
          lastWinner: 'Team Adams/White'
        },
        Sunday: { 
          nextDate: 'Sept 17, 2025', 
          lastAttendance: 20, 
          avgAttendance: 22,
          status: 'upcoming',
          lastWinner: 'Team Johnson/Miller'
        }
      };

      return {
        id: index + 1,
        day: day,
        time: league.startTime,
        ...mockData[day as keyof typeof mockData]
      };
    });
  };

  const leagueNights = getLeagueNights();

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading league details...</p>
        </div>
      </div>
    );
  }

  if (error || !league) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">League Not Found</h2>
          <p className="text-gray-600 mb-4">The league you're looking for doesn't exist</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Leagues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{league.name}</h1>
                <p className="text-gray-600">{league.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hello, {user?.user_metadata?.full_name || user?.email || 'Player'}
              </span>
              <button 
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* League Info Banner */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About This League</h2>
              <p className="text-gray-600 mb-4">{league.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Schedule:</span>
                  <span className="ml-2 text-gray-600">
                    {league.leagueDays.join(', ')} at {league.startTime}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Location:</span>
                  <span className="ml-2 text-gray-600">{league.address}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Total Members:</span>
                  <span className="ml-2 text-gray-600">{members.length} players</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">🏓</span>
                </div>
                <div className="text-sm font-medium text-gray-900">League Status</div>
                <div className="text-green-600 font-semibold">Active</div>
              </div>
              
              {/* Join League Button */}
              {!membershipLoading && (
                <div className="w-full">
                  {isMember ? (
                    <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-green-600 font-medium">✓ You're a member!</div>
                      <div className="text-xs text-green-500 mt-1">Ready to play</div>
                    </div>
                  ) : (
                    <button
                      onClick={joinLeague}
                      disabled={joining}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      {joining ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Joining...
                        </span>
                      ) : (
                        'Join League'
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Members */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{leagueStats.totalMembers}</div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
            </div>
          </div>

          {/* Games This Month */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">🎾</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{leagueStats.gamesThisMonth}</div>
                <div className="text-sm text-gray-600">Games This Month</div>
              </div>
            </div>
          </div>

          {/* Average Attendance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{leagueStats.averageAttendance}</div>
                <div className="text-sm text-gray-600">Avg Attendance</div>
              </div>
            </div>
          </div>

          {/* Total Games */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-xl">🏆</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{leagueStats.totalGamesPlayed}</div>
                <div className="text-sm text-gray-600">Total Games</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Scorers Podium */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">🏆 Top Average Scorers</h3>
          {leagueStats.topScorers.length > 0 ? (
            <div className="flex justify-center items-end space-x-4">
              {/* 2nd Place */}
              {leagueStats.topScorers[1] && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🥈</span>
                  </div>
                  <div className="bg-gray-100 px-4 py-6 rounded-lg min-h-[100px] flex flex-col justify-end">
                    <div className="font-semibold text-gray-900">{leagueStats.topScorers[1].name}</div>
                    <div className="text-lg font-bold text-gray-700">{leagueStats.topScorers[1].avgScore}</div>
                    <div className="text-xs text-gray-500">{leagueStats.topScorers[1].gamesPlayed} games</div>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {leagueStats.topScorers[0] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mb-2">
                    <span className="text-3xl">🥇</span>
                  </div>
                  <div className="bg-yellow-50 border-2 border-yellow-200 px-4 py-8 rounded-lg min-h-[120px] flex flex-col justify-end">
                    <div className="font-bold text-gray-900">{leagueStats.topScorers[0].name}</div>
                    <div className="text-xl font-bold text-yellow-600">{leagueStats.topScorers[0].avgScore}</div>
                    <div className="text-xs text-gray-500">{leagueStats.topScorers[0].gamesPlayed} games</div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {leagueStats.topScorers[2] && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🥉</span>
                  </div>
                  <div className="bg-orange-50 px-4 py-6 rounded-lg min-h-[100px] flex flex-col justify-end">
                    <div className="font-semibold text-gray-900">{leagueStats.topScorers[2].name}</div>
                    <div className="text-lg font-bold text-orange-600">{leagueStats.topScorers[2].avgScore}</div>
                    <div className="text-xs text-gray-500">{leagueStats.topScorers[2].gamesPlayed} games</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🏆</div>
              <p>No player statistics available yet</p>
              <p className="text-sm">Start playing games to see the leaderboard!</p>
            </div>
          )}
        </div>

        {/* League Nights */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">League Nights</h3>
          <div className="space-y-4">
            {leagueNights.map((night) => (
              <div 
                key={night.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <span className="text-green-600 font-semibold">{night.day.slice(0, 3)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{night.day} Night League</h4>
                      <p className="text-sm text-gray-600">Next: {night.nextDate} at {night.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{night.lastAttendance}</div>
                      <div className="text-gray-500">Last Session</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{night.avgAttendance}</div>
                      <div className="text-gray-500">Avg Players</div>
                    </div>
                    <div className="text-center min-w-[120px]">
                      <div className="font-medium text-gray-900">Last Winners:</div>
                      <div className="text-green-600 text-xs">{night.lastWinner}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${
                        night.status === 'upcoming' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      <span className="text-green-600 group-hover:text-green-700 font-medium">
                        View Night →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* League Members */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">League Members ({members.length})</h3>
          {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500 flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.skillLevel === 'Beginner' ? 'bg-blue-100 text-blue-600' :
                          member.skillLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {member.skillLevel}
                        </span>
                        {member.role === 'admin' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">👥</div>
              <p>No members yet</p>
              <p className="text-sm">Be the first to join this league!</p>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}

export default LeaguePage