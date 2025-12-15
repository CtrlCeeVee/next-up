import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayerStats, type PlayerStats, type LeagueStats } from '../hooks/usePlayerStats';
import { usePlayerStreaks } from '../hooks/usePlayerStreaks';
import { profilesAPI, type ProfileData } from '../services/api/profiles';
import { NotificationSettingsCard } from '../components/NotificationPermission';
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
import BottomNav from '../components/BottomNav';

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
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit form state
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSkillLevel, setEditSkillLevel] = useState('');
  
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
  
  // Use the player streaks hook for real streak data
  const { streaks, loading: streaksLoading, error: streaksError } = usePlayerStreaks(targetUserId || null);

  // Overall loading state combines profile and stats loading
  const loading = profileLoading || statsLoading || streaksLoading;

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
      const profileData = await profilesAPI.getProfileByUsername(username);
      
      const fetchedProfile: PlayerProfile = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        skillLevel: profileData.skillLevel,
        bio: profileData.bio || undefined,
        location: profileData.location || undefined,
        joinedDate: profileData.joinedDate,
        avatar: profileData.avatarUrl || undefined,
        isCurrentUser: false
      };

      setProfile(fetchedProfile);
      setTargetUserId(profileData.id);
    } catch (error: any) {
      console.error('Error fetching profile data by username:', error);
      // If profile not found, set profile to null to show 404
      if (error.message === 'Profile not found') {
        setProfile(null);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchProfileData = async (userId: string) => {
    setProfileLoading(true);
    try {
      const profileData = await profilesAPI.getProfileByUserId(userId);
      
      const fetchedProfile: PlayerProfile = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        skillLevel: profileData.skillLevel,
        bio: profileData.bio || undefined,
        location: profileData.location || undefined,
        joinedDate: profileData.joinedDate,
        avatar: profileData.avatarUrl || undefined,
        isCurrentUser: isOwnProfile
      };

      setProfile(fetchedProfile);
      
      // Initialize edit form with current values
      setEditBio(profileData.bio || '');
      setEditLocation(profileData.location || '');
      setEditSkillLevel(profileData.skillLevel);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile || !targetUserId) return;

    setIsSaving(true);
    try {
      const updatedProfile = await profilesAPI.updateProfile(targetUserId, {
        bio: editBio,
        location: editLocation,
        skillLevel: editSkillLevel
      });

      // Update local profile state
      setProfile({
        ...profile,
        bio: updatedProfile.bio || undefined,
        location: updatedProfile.location || undefined,
        skillLevel: updatedProfile.skillLevel
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset edit fields to current profile values
    if (profile) {
      setEditBio(profile.bio || '');
      setEditLocation(profile.location || '');
      setEditSkillLevel(profile.skillLevel);
    }
    setIsEditing(false);
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
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:opacity-50"
                      >
                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </>
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
              {isEditing && profile.isCurrentUser ? (
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Target className="w-4 h-4 mr-1 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <select
                    value={editSkillLevel}
                    onChange={(e) => setEditSkillLevel(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 font-medium"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              ) : (
                <p className="text-green-600 dark:text-green-400 mt-1 font-medium">{profile.skillLevel}</p>
              )}
              {isEditing && profile.isCurrentUser ? (
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  <MapPin className="w-4 h-4 mr-1 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="City, Country"
                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm"
                    maxLength={255}
                  />
                </div>
              ) : profile.location ? (
                <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-1 text-green-500 dark:text-green-400" />
                  <span>{profile.location}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-1 text-green-500 dark:text-green-400" />
                <span>
                  Joined {
                    profile.joinedDate 
                      ? new Date(profile.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' })
                      : 'Recently'
                  }
                </span>
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
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    maxLength={500}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    {profile.bio || 'No bio available yet.'}
                  </p>
                )}
              </div>

              {/* Notification Settings - Only for current user */}
              {profile.isCurrentUser && (
                <div className="mt-6">
                  <NotificationSettingsCard />
                </div>
              )}

              {/* Recent Achievement */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Coming Soon</p>
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
                    <span className={`font-semibold ${streaks?.currentStreak && streaks.currentStreak > 0 ? 'text-green-600' : streaks?.currentStreak && streaks.currentStreak < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {streaks?.currentStreak ? Math.abs(streaks.currentStreak) : 0} {streaks?.currentStreak && streaks.currentStreak > 0 ? 'wins' : streaks?.currentStreak && streaks.currentStreak < 0 ? 'losses' : 'games'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Best Streak</span>
                    <span className="font-semibold text-purple-600">{streaks?.bestStreak || 0} wins</span>
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
              {/* Overall Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Win/Loss Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Record</h3>
                  <div className="flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" />
                        <circle
                          cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="20"
                          strokeDasharray={`${(stats?.winRate || 0) * 2.51} 251`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.winRate?.toFixed(0)}%</div>
                          <div className="text-xs text-gray-500">Win Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{stats?.totalGames}</div>
                      <div className="text-xs text-gray-500">Games</div>
                    </div>
                    <div>
                      <div className="font-bold text-green-600">{stats?.wins}</div>
                      <div className="text-xs text-gray-500">Wins</div>
                    </div>
                    <div>
                      <div className="font-bold text-red-600">{stats?.losses}</div>
                      <div className="text-xs text-gray-500">Losses</div>
                    </div>
                  </div>
                </div>

                {/* Recent Form & Streaks */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Form</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {streaks?.recentForm && streaks.recentForm.length > 0 
                          ? `Last ${streaks.recentForm.length} matches` 
                          : 'No match history'}
                      </p>
                    </div>
                    {streaks?.recentForm && streaks.recentForm.length > 0 && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-gray-600 dark:text-gray-300">
                            {streaks.recentForm.filter(g => g.result === 'W').length} Wins
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-gray-600 dark:text-gray-300">
                            {streaks.recentForm.filter(g => g.result === 'L').length} Losses
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* W/L Tiles */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {streaks?.recentForm && streaks.recentForm.length > 0 ? (
                      streaks.recentForm.map((game, index) => (
                        <div
                          key={index}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white transition-all cursor-default ${
                            game.result === 'W' 
                              ? 'bg-green-500 hover:bg-green-600 hover:scale-110' 
                              : 'bg-red-500 hover:bg-red-600 hover:scale-110'
                          }`}
                          title={`${game.result === 'W' ? 'Win' : 'Loss'} - ${new Date(game.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        >
                          {game.result}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center w-full py-8">
                        <span className="text-sm text-gray-500">No recent matches</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <div className={`w-2 h-2 rounded-full mr-1.5 ${
                          streaks?.currentStreak && streaks.currentStreak > 0 ? 'bg-green-500' : 
                          streaks?.currentStreak && streaks.currentStreak < 0 ? 'bg-red-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Current Streak</span>
                      </div>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {streaks?.currentStreak ? Math.abs(streaks.currentStreak) : 0}{' '}
                        {streaks?.currentStreak && streaks.currentStreak > 0 ? 'W' : 
                         streaks?.currentStreak && streaks.currentStreak < 0 ? 'L' : '-'}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Best Streak</span>
                      </div>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">{streaks?.bestStreak || 0} W</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-3 h-3 text-purple-500 mr-1.5" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Avg Points</span>
                      </div>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">{stats?.averagePoints?.toFixed(1)}</span>
                    </div>
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
                      {league.totalPlayers > 0 && (
                        <span className="text-sm text-gray-500">Rank #{league.ranking} of {league.totalPlayers}</span>
                      )}
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
                    <p className="text-3xl font-bold">
                      {leagueStats.length > 0 && leagueStats.some(l => l.totalPlayers > 0)
                        ? `#${Math.min(...leagueStats.filter(l => l.totalPlayers > 0).map(l => l.ranking))}`
                        : '-'}
                    </p>
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

                  <button 
                    onClick={() => navigate(`/league/${league.leagueId}`)}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    View League Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-8">
            {/* Coming Soon Message */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Social Features Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We're working on bringing you partnership stats, activity feeds, and head-to-head records.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-pink-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Top Partnerships</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">See who you play best with</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Favorite Partners</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track your most frequent teammates</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-5 h-5 text-indigo-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Head-to-Head</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compare records with opponents</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-5 h-5 text-teal-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Activity Feed</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stay updated on recent matches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ProfilePage;