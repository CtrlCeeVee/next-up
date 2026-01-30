import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMemo, useState, useEffect } from 'react';
import { leaguesAPI } from '../services/api';
import { membershipService } from '../services/api/membership';
import type { League } from '../hooks/useLeagues';
import { Zap, Trophy, Search, MapPin, Calendar, Users, ArrowLeft, Clock, Flame } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface LeagueWithMembership extends League {
  isMember?: boolean;
}

// Hardcoded leagues for now
const LEAGUES = [
  {
    id: 2,
    name: "Northcliff Eagles",
    description: "Premier pickleball league at Northcliff Country Club featuring competitive play for passionate players of all skill levels",
    location: "Northcliff Country Club",
    address: "271 Pendoring Rd, Northcliff, Randburg, 2115",
    leagueDays: ["Monday", "Wednesday"],
    startTime: "18:30",
    totalPlayers: 42,
    isActive: true
  },
  {
    id: 3,
    name: "GPC Pickleball",
    description: "GPC Pickleball is a premier pickleball complex in South Africa. Featuring brand new courts. GPC Pickleball offers an unparalleled playing experience.",
    location: "German Country Club",
    address: "131 Holkam Rd, Paulshof, Sandton, 2056",
    leagueDays: ["Saturday"],
    startTime: "15:00",
    totalPlayers: 0,
    isActive: true
  },
];

export default function BrowseLeaguesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [leaguesWithMembership, setLeaguesWithMembership] = useState<LeagueWithMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filter = searchParams.get('filter') || 'all'; // 'all', 'tonight', 'mine'

  // Update filter and URL
  const setFilter = (newFilter: string) => {
    if (newFilter === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ filter: newFilter });
    }
  };

  // Fetch membership data
  useEffect(() => {
    async function fetchMembershipData() {
      if (!user) return;
      
      try {
        setLoading(true);
        const leaguesWithData = await Promise.all(
          LEAGUES.map(async (league) => {
            const { isMember } = await membershipService.checkMembership(league.id, user.id);
            return { ...league, isMember };
          })
        );
        setLeaguesWithMembership(leaguesWithData);
      } catch (error) {
        console.error('Error fetching membership data:', error);
        setLeaguesWithMembership(LEAGUES);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMembershipData();
  }, [user]);

  // Filter leagues based on filter and search
  const filteredLeagues = useMemo(() => {
    let result = leaguesWithMembership;

    // Apply filter
    if (filter === 'tonight') {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      result = result.filter(league => league.leagueDays.includes(today));
    } else if (filter === 'mine') {
      result = result.filter(league => league.isMember);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(league => 
        league.name.toLowerCase().includes(query) ||
        league.location.toLowerCase().includes(query) ||
        league.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [filter, leaguesWithMembership, searchQuery]);

  // Check if league is happening today
  const isTonight = (league: League) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return league.leagueDays.includes(today);
  };

  const handleViewLeague = (leagueId: number) => {
    navigate(`/league/${leagueId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header with Back Button */}
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
            Next-Up
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-4 pb-24">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search leagues, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Filter Pills - Wrappable */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('tonight')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === 'tonight'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
            }`}
          >
            Tonight
          </button>
          <button
            onClick={() => setFilter('mine')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === 'mine'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
            }`}
          >
            Mine
          </button>
        </div>

        {/* Results Count - Only show if not loading and has results */}
        {!loading && filteredLeagues.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {filteredLeagues.length} league{filteredLeagues.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* League Cards */}
        {loading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 animate-pulse shadow-lg">
                <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : filteredLeagues.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLeagues.map((league) => (
              <button
                key={league.id}
                onClick={() => handleViewLeague(league.id)}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 text-left shadow-lg hover:shadow-xl hover:scale-105"
              >
                {/* Gradient Header */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Status Badges */}
                <div className="relative flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {isTonight(league) && (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Tonight
                      </span>
                    )}
                    {league.isMember && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                        Member
                      </span>
                    )}
                  </div>
                </div>

                {/* League Info */}
                <div className="relative">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {league.name}
                  </h3>

                  {/* Compact One-Line Info */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{league.leagueDays.join(', ')} • {league.startTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{league.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span>{league.totalPlayers} members</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="max-w-md mx-auto text-center bg-gradient-to-br from-white/60 to-emerald-50/40 dark:from-slate-800/60 dark:to-emerald-900/20 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 shadow-lg">
              <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No leagues found
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {searchQuery ? (
                  <>Try adjusting your search or <button onClick={() => setSearchQuery('')} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">clear search</button></>
                ) : filter === 'mine' ? (
                  "You haven't joined any leagues yet"
                ) : filter === 'tonight' ? (
                  "No leagues scheduled for today"
                ) : (
                  "No leagues available"
                )}
              </p>
              {(filter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  View All Leagues
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
