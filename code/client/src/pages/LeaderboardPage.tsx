import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Moon, Sun, Trophy, Users, TrendingUp, Medal, Star, Calendar } from 'lucide-react';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-orange-900">
      {/* Header */}
      <header className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Trophy className="h-4 w-4" />
            <span>Coming Soon</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Competitive Leaderboards
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your progress, compete with friends, and climb the rankings in your local pickleball community.
          </p>
        </div>

        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl w-fit mb-4">
              <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">League Rankings</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              See where you stand in your league with real-time rankings based on match results and performance.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Performance Metrics</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Track your improvement over time with detailed statistics and performance analytics.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mb-4">
              <Medal className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Achievements</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Unlock badges and achievements as you reach milestones and accomplish new goals.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit mb-4">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Player Comparisons</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Compare your stats with friends and other players to see areas for improvement.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl w-fit mb-4">
              <Star className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Skill Ratings</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Dynamic skill ratings that adapt based on your performance and match outcomes.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl w-fit mb-4">
              <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Seasonal Competitions</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Participate in seasonal tournaments and special events with exclusive rewards.
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl mr-4">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">What's Coming</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Global & Local Rankings</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  See how you stack up not just in your league, but against players across South Africa and globally.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Advanced Analytics</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Deep insights into your playing patterns, strengths, and areas for improvement with detailed match analysis.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Social Features</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Follow friends, celebrate achievements together, and create friendly rivalries within your community.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Tournament Integration</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Seamless integration with tournament results and professional pickleball rating systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Note */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl p-8 text-white text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4" />
            <span>In Development</span>
          </div>
          <h3 className="text-2xl font-bold mb-4">Building Something Special</h3>
          <p className="text-blue-100 mb-6">
            Our development team is working hard to create the most comprehensive and engaging 
            leaderboard system for pickleball players. We're incorporating feedback from players 
            across South Africa to ensure we build exactly what you need.
          </p>
          <p className="text-blue-100 text-sm">
            Expected launch: Q1 2026 • Follow our progress and get early access notifications
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Want Early Access?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Be among the first to experience our revolutionary leaderboard system. 
            Join our beta program and help shape the future of pickleball competition tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
            >
              Join Beta Program
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              Back to Leagues
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;