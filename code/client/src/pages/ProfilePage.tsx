import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayerStats, type PlayerStats, type LeagueStats } from '../hooks/usePlayerStats';
import {
  ArrowLeft,
  Moon,
  Sun,
  User,
  Trophy,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Award,
  Edit3,
  Mail,
  MapPin,
  Star,
  BarChart3,
  Activity,
  Heart
} from 'lucide-react';

interface PlayerProfile {
  id: string;
  name: string;
  email: string;
  skillLevel: string;
  bio?: string;
  location?: string;
  joinedDate: string;
  avatar?: string;
  isCurrentUser: boolean;
}



const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Get tab from URL search params using proper React Router hook
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'leagues' | 'social'>(
    (searchParams.get('tab') as any) || 'overview'
  );
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  // Determine if this is the current user's profile
  const currentUserUsername = user?.user_metadata?.username;
  const isOwnProfile = !username || username === currentUserUsername;

  // Use the player stats hook for real data
  const { stats, leagueStats, loading: statsLoading, error: statsError, refetch } = usePlayerStats(targetUserId || null);

  // Overall loading state combines profile and stats loading
  const loading = profileLoading || statsLoading;

  // Sync activeTab with URL search params
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as 'overview' | 'stats' | 'leagues' | 'social';
    if (tabFromUrl && ['overview', 'stats', 'leagues', 'social'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab('overview');
    }
  }, [searchParams]);

  useEffect(() => {
    // Wait for auth to load before making decisions
    if (!user) {
      return;
    }

    // If no username provided, show current user's profile
    if (!username) {
      setTargetUserId(user.id);
      fetchProfileData(user.id);
      return;
    }

    // If viewing own profile by username
    if (username === currentUserUsername) {
      setTargetUserId(user.id);
      fetchProfileData(user.id);
      return;
    }

    // TODO: Implement username-to-userId resolution API call
    // For now, we'll handle it in fetchProfileData
    fetchProfileDataByUsername(username);
  }, [username, user, currentUserUsername]);

  const fetchProfileDataByUsername = async (username: string) => {
    setProfileLoading(true);
    try {
      // TODO: Replace with actual API call to get user by username
      // For now, mock the response for non-current users
      const mockProfile: PlayerProfile = {
        id: 'mock-user-id',
        name: username.charAt(0).toUpperCase() + username.slice(1).replace(/-/g, ' '),
        email: `${username}@example.com`,
        skillLevel: 'Intermediate',
        bio: 'Passionate pickleball player who loves the competitive spirit and community.',
        location: 'Johannesburg, SA',
        joinedDate: '2024-01-15',
        isCurrentUser: false
      };

      setProfile(mockProfile);
      setTargetUserId('mock-user-id');
    } catch (error) {
      console.error('Error fetching profile data by username:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchProfileData = async (userId: string) => {
    setProfileLoading(true);
    try {
      // TODO: Replace with actual profile API call when available
      // For now, create profile from auth data
      const mockProfile: PlayerProfile = {
        id: userId,
        name: isOwnProfile ? 
          `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || 'Your Name' 
          : 'Player Name',
        email: isOwnProfile ? user?.email || '' : 'player@email.com',
        skillLevel: 'Intermediate',
        bio: 'Passionate pickleball player who loves the competitive spirit and community.',
        location: 'Johannesburg, SA',
        joinedDate: '2024-01-15',
        isCurrentUser: isOwnProfile
      };

      setProfile(mockProfile);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {profile.isCurrentUser ? 'My Profile' : `${profile.name}'s Profile`}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {profile.isCurrentUser && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>{isEditing ? 'Done' : 'Edit'}</span>
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Hero Section */}
      <div className="bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 px-4 py-8 border-b border-green-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white to-gray-50 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center shadow-xl border-4 border-green-200/50 dark:border-green-700/50">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 dark:text-gray-300" />
                )}
              </div>
              {profile.isCurrentUser && isEditing && (
                <button className="absolute -bottom-2 -right-2 bg-green-500 dark:bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-600 dark:hover:bg-green-500">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
              <p className="text-green-600 dark:text-green-400 mt-1 font-medium">{profile.skillLevel} Player</p>
              {profile.location && (
                <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-1 text-green-500 dark:text-green-400" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-1 text-green-500 dark:text-green-400" />
                <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 sm:text-right">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-slate-700/50">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalGames || 0}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Games</div>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-slate-700/50">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.winRate?.toFixed(1) || 0}%</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Win Rate</div>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-slate-700/50">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeLeagues || 0}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Active Leagues</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'stats', label: 'Statistics', icon: BarChart3 },
              { id: 'leagues', label: 'Leagues', icon: Trophy },
              { id: 'social', label: 'Social', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  // Update URL which will trigger the useEffect to update activeTab
                  setSearchParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    if (tab.id === 'overview') {
                      // Remove tab parameter for overview (default)
                      newParams.delete('tab');
                    } else {
                      newParams.set('tab', tab.id);
                    }
                    return newParams;
                  });
                }}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bio Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
                {isEditing && profile.isCurrentUser ? (
                  <textarea
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder="Tell everyone about yourself..."
                    defaultValue={profile.bio}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    {profile.bio || 'No bio available yet.'}
                  </p>
                )}
              </div>

              {/* Recent Achievement */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Award className="w-8 h-8 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">3-Game Win Streak</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Achieved today</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Star className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Rising Star</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Improved win rate by 15%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="space-y-6">
              {/* Performance Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Win Rate</span>
                    <span className="font-semibold text-green-600">{stats?.winRate?.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Avg Points</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats?.averagePoints?.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Current Streak</span>
                    <span className="font-semibold text-blue-600">{stats?.currentStreak} wins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Best Streak</span>
                    <span className="font-semibold text-purple-600">{stats?.bestStreak} wins</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{profile.email}</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Error state for stats */}
            {statsError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading statistics</h3>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-300">{statsError}</p>
                    <button
                      onClick={() => refetch()}
                      className="mt-2 text-sm font-medium text-red-800 dark:text-red-200 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading state for stats */}
            {statsLoading && !statsError && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading statistics...</span>
              </div>
            )}

            {/* Performance Overview Cards */}
            {!statsLoading && !statsError && (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Games</p>
                    <p className="text-3xl font-bold">{stats?.totalGames}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Win Rate</p>
                    <p className="text-3xl font-bold">{stats?.winRate?.toFixed(1)}%</p>
                  </div>
                  <Trophy className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Avg Points</p>
                    <p className="text-3xl font-bold">{stats?.averagePoints?.toFixed(1)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Current Streak</p>
                    <p className="text-3xl font-bold">{stats?.currentStreak}</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Win/Loss Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Win/Loss Distribution</h3>
                <div className="flex items-center justify-center h-48">
                  {/* TODO: Add actual chart component here */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-green-500 border-t-red-500 animate-spin-slow"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.winRate?.toFixed(0)}%</div>
                        <div className="text-sm text-gray-500">Win Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Wins ({stats?.wins})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Losses ({stats?.losses})</span>
                  </div>
                </div>
              </div>

              {/* Performance Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trend</h3>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {/* TODO: Replace with actual chart library */}
                  {[12, 15, 11, 18, 14, 16, 13, 17, 15, 19].map((height, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm flex-1"
                      style={{ height: `${height * 2.5}px` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>10 games ago</span>
                  <span>Recent</span>
                </div>
              </div>
            </div>

            {/* League Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">League Performance</h3>
              <div className="space-y-4">
                {leagueStats.map((league, index) => (
                  <div key={league.leagueId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">{league.leagueName}</h4>
                      <span className="text-sm text-gray-500">Rank #{league.ranking} of {league.totalPlayers}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{league.games}</div>
                        <div className="text-xs text-gray-500">Games</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{league.wins}</div>
                        <div className="text-xs text-gray-500">Wins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">{league.losses}</div>
                        <div className="text-xs text-gray-500">Losses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{league.points}</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                    </div>

                    {/* Win Rate Bar */}
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                        style={{ width: `${league.winRate}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-500 mt-1">{league.winRate}% win rate</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Streak Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Current Streak</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-gray-900 dark:text-white">{stats?.currentStreak} wins</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Best Streak</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-gray-900 dark:text-white">{stats?.bestStreak} wins</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recent Form</h4>
                    <div className="flex space-x-1">
                      {/* TODO: Replace with actual recent match results */}
                      {['W', 'W', 'L', 'W', 'W', 'W', 'L', 'W', 'W', 'W'].map((result, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                            result === 'W' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Last 10 games</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Points per Game</span>
                      <span className="font-medium">{stats?.averagePoints?.toFixed(1)}</span>
                    </div>
                    <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                        style={{ width: `${(stats?.averagePoints || 0) * 5}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Consistency Rating</span>
                      <span className="font-medium">8.4/10</span>
                    </div>
                    <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Improvement Rate</span>
                      <span className="font-medium text-green-600">+15%</span>
                    </div>
                    <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {activeTab === 'leagues' && (
          <div className="space-y-8">
            {/* League Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Leagues</p>
                    <p className="text-3xl font-bold">{stats?.activeLeagues}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Leagues Joined</p>
                    <p className="text-3xl font-bold">{stats?.leaguesJoined}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Best Ranking</p>
                    <p className="text-3xl font-bold">#3</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>

            {/* League Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {leagueStats.map((league) => (
                <div key={league.leagueId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{league.leagueName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                        Rank #{league.ranking}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{league.games}</div>
                      <div className="text-sm text-gray-500">Games Played</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{league.winRate}%</div>
                      <div className="text-sm text-gray-500">Win Rate</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Wins</span>
                      <span className="font-semibold text-green-600">{league.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Losses</span>
                      <span className="font-semibold text-red-600">{league.losses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Points</span>
                      <span className="font-semibold text-blue-600">{league.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Avg Points/Game</span>
                      <span className="font-semibold text-purple-600">{(league.points / league.games).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>League Position</span>
                      <span>{league.ranking} of {league.totalPlayers} players</span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${((league.totalPlayers - league.ranking + 1) / league.totalPlayers) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* TODO: Add button to view league details */}
                  <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                    View League Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-8">
            {/* Social Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm">Partnerships</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <Users className="w-8 h-8 text-pink-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Favorite Partner</p>
                    <p className="text-lg font-bold">Luke</p>
                  </div>
                  <Heart className="w-8 h-8 text-yellow-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm">Best Win Rate</p>
                    <p className="text-3xl font-bold">85%</p>
                  </div>
                  <Trophy className="w-8 h-8 text-indigo-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-100 text-sm">Social Score</p>
                    <p className="text-3xl font-bold">9.2</p>
                  </div>
                  <Star className="w-8 h-8 text-teal-200" />
                </div>
              </div>
            </div>

            {/* Partnership Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Partnerships</h3>
                <div className="space-y-4">
                  {/* TODO: Replace with actual partnership data */}
                  {[
                    { name: 'Luke Johnson', games: 18, wins: 15, winRate: 83.3, avatar: '👨‍💼' },
                    { name: 'Sarah Wilson', games: 12, wins: 9, winRate: 75.0, avatar: '👩‍💼' },
                    { name: 'Mike Chen', games: 8, wins: 6, winRate: 75.0, avatar: '👨‍💻' },
                    { name: 'Emma Davis', games: 6, wins: 4, winRate: 66.7, avatar: '👩‍🎓' }
                  ].map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                          {partner.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{partner.name}</div>
                          <div className="text-sm text-gray-500">{partner.games} games together</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{partner.winRate.toFixed(1)}%</div>
                        <div className="text-sm text-gray-500">{partner.wins}/{partner.games} wins</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TODO: Add button to view all partnerships */}
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 py-2 text-sm font-medium">
                  View All Partnerships →
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {/* TODO: Replace with actual activity data */}
                  {[
                    { type: 'partnership', message: 'Played with Luke Johnson', time: '2 hours ago', result: 'won' },
                    { type: 'achievement', message: 'Achieved 3-game win streak', time: '1 day ago', result: 'achievement' },
                    { type: 'partnership', message: 'Played with Sarah Wilson', time: '2 days ago', result: 'lost' },
                    { type: 'join', message: 'Joined Sandton Smashers league', time: '3 days ago', result: 'neutral' },
                    { type: 'partnership', message: 'Played with Mike Chen', time: '4 days ago', result: 'won' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.result === 'won' ? 'bg-green-500' :
                        activity.result === 'lost' ? 'bg-red-500' :
                        activity.result === 'achievement' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 py-2 text-sm font-medium">
                  View All Activity →
                </button>
              </div>
            </div>

            {/* Head-to-Head Records */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Head-to-Head Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* TODO: Replace with actual head-to-head data */}
                {[
                  { opponent: 'Matt Thompson', wins: 3, losses: 1, lastPlayed: '1 week ago' },
                  { opponent: 'Alex Rodriguez', wins: 2, losses: 2, lastPlayed: '2 weeks ago' },
                  { opponent: 'Chris Taylor', wins: 1, losses: 3, lastPlayed: '1 month ago' },
                  { opponent: 'Jordan Smith', wins: 4, losses: 0, lastPlayed: '3 days ago' },
                  { opponent: 'Morgan Lee', wins: 2, losses: 1, lastPlayed: '1 week ago' },
                  { opponent: 'Casey Johnson', wins: 1, losses: 2, lastPlayed: '2 weeks ago' }
                ].map((record, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{record.opponent}</h4>
                      <span className="text-xs text-gray-500">{record.lastPlayed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-green-600 font-medium">{record.wins}W</span>
                        <span className="text-gray-400 mx-1">-</span>
                        <span className="text-red-600 font-medium">{record.losses}L</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {((record.wins / (record.wins + record.losses)) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Find Partners */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Looking for a Partner?</h3>
                  <p className="text-blue-100">Find players with similar skill levels in your leagues</p>
                </div>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Find Partners
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;