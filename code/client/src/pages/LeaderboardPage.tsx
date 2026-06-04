import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useLeaderboard, type LeaderboardCategory, type LeaderboardPlayer } from '../hooks/useLeaderboard';
import { leaguesAPI } from '../services/api/leagues';
import { membershipService } from '../services/api/membership';
import { ArrowLeft, Moon, Sun, Trophy, Activity, TrendingUp, Flame, Calendar, Lock, Search } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface UserLeague {
  id: number;
  name: string;
}

const CATEGORIES: { key: LeaderboardCategory; label: string; icon: typeof Trophy; desc: string }[] = [
  { key: 'overall', label: 'Overall', icon: Trophy, desc: 'Balanced ranking based on wins, scoring, and games played' },
  { key: 'games', label: 'Games', icon: Activity, desc: 'Most games played, rewarding dedication and consistency' },
  { key: 'avg_score', label: 'Avg Score', icon: TrendingUp, desc: 'Highest average score per game (min 5 games)' },
  { key: 'win_streak', label: 'Streak', icon: Flame, desc: 'Longest consecutive wins. Who went on the best run?' },
  { key: 'attendance', label: 'Attendance', icon: Calendar, desc: 'Most consecutive weeks attended. The regulars' },
];

function getCategoryUnit(category: LeaderboardCategory): string {
  switch (category) {
    case 'overall': return 'pts';
    case 'games': return 'games';
    case 'avg_score': return 'avg';
    case 'win_streak': return 'wins';
    case 'attendance': return '';
    default: return '';
  }
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [userLeagues, setUserLeagues] = useState<UserLeague[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LeaderboardCategory>(
    (searchParams.get('category') as LeaderboardCategory) || 'overall'
  );
  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { leaderboard, loading, error } = useLeaderboard(selectedLeagueId, selectedCategory, user?.id);

  // Load leagues and set initial from query param
  useEffect(() => {
    async function loadLeagues() {
      try {
        setLeaguesLoading(true);
        const allLeagues = await leaguesAPI.getAll();
        const leagueParam = searchParams.get('league');

        if (user) {
          const leagues: UserLeague[] = [];
          for (const league of allLeagues) {
            const { isMember } = await membershipService.checkMembership(league.id, user.id);
            if (isMember) {
              leagues.push({ id: league.id, name: league.name });
            }
          }
          setUserLeagues(leagues);
          if (leagues.length > 0 && !selectedLeagueId) {
            const paramId = leagueParam ? parseInt(leagueParam) : null;
            setSelectedLeagueId(paramId && leagues.find(l => l.id === paramId) ? paramId : leagues[0].id);
          }
        } else {
          const mapped = allLeagues.map((l: any) => ({ id: l.id, name: l.name }));
          setUserLeagues(mapped);
          if (mapped.length > 0 && !selectedLeagueId) {
            const paramId = leagueParam ? parseInt(leagueParam) : null;
            setSelectedLeagueId(paramId && mapped.find((l: UserLeague) => l.id === paramId) ? paramId : mapped[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading leagues:', err);
      } finally {
        setLeaguesLoading(false);
      }
    }
    loadLeagues();
  }, [user]);

  const currentUser = leaderboard?.currentUser;
  const players = leaderboard?.players || [];
  const filteredPlayers = searchQuery
    ? players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : players;
  const activeCategory = CATEGORIES.find(c => c.key === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Full Leaderboard
              </h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-slate-600" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-2xl mx-auto px-4 pt-4 pb-24 z-10">
        {/* League Selector */}
        {userLeagues.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {userLeagues.map(league => (
              <button
                key={league.id}
                onClick={() => setSelectedLeagueId(league.id)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  selectedLeagueId === league.id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => { setSelectedCategory(cat.key); setSearchQuery(''); }}
                className={`flex items-center gap-1.5 px-3 min-[375px]:px-4 py-2 rounded-2xl text-xs min-[375px]:text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Category description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 px-1">
          {activeCategory?.desc}
        </p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600"
          />
        </div>

        {/* Unlock message */}
        {currentUser && currentUser.gamesNeeded > 0 && (
          <div className="mb-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Play {currentUser.gamesNeeded} more game{currentUser.gamesNeeded !== 1 ? 's' : ''} to unlock your ranking
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser.gamesPlayed} of {leaderboard?.minGames} games played
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {(loading || leaguesLoading) && (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                  </div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-lg rounded-2xl border border-red-200/50 dark:border-red-700/50 p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !leaguesLoading && !error && filteredPlayers.length === 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-8 text-center">
            <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {searchQuery ? 'No players match your search' : 'No players qualify yet'}
            </p>
          </div>
        )}

        {/* Full Leaderboard List */}
        {!loading && !leaguesLoading && !error && filteredPlayers.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            {filteredPlayers.map((player, i) => {
              const isCurrentUser = player.userId === user?.id;
              const isTop3 = player.rank <= 3;
              const unit = getCategoryUnit(selectedCategory);
              const rankColors = player.rank === 1
                ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700'
                : player.rank === 2
                  ? 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                  : player.rank === 3
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700'
                    : 'text-slate-500 dark:text-slate-400';

              return (
                <div
                  key={player.userId}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isCurrentUser
                      ? 'bg-emerald-50/50 dark:bg-emerald-900/20'
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-700/30'
                  } ${i < filteredPlayers.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isTop3 ? `border ${rankColors}` : rankColors}`}>
                    {player.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                      {player.name}
                      {isCurrentUser && <span className="text-xs font-normal ml-1.5 text-emerald-500">(You)</span>}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {player.gamesPlayed} games &middot; {player.winRate}% wins
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-bold ${isTop3 ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' : 'text-slate-700 dark:text-slate-300'}`}>
                      {player.displayValue}
                    </span>
                    {unit && <span className="text-xs text-slate-400 ml-1">{unit}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
