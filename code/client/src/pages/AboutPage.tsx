import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Moon, Sun, Trophy, Users, Target, Heart, Zap } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Next-Up</h1>
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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>Revolutionizing Pickleball in South Africa</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Making Pickleball
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {" "}Seamless & Fun
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Next-Up exists to transform how pickleball leagues operate across South Africa, 
            making every game night smoother, more competitive, and more enjoyable for everyone involved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            A product by Nextup Sport (PTY) LTD
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mr-4">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To eliminate the chaos of paper-based league management and create a seamless digital experience 
              that keeps players engaged, matches flowing, and communities thriving.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4">
                <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Every pickleball league in South Africa running like clockwork, with players focused on 
              the game they love rather than logistics and coordination challenges.
            </p>
          </div>
        </div>

        {/* What We Solve */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What We Solve</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Traditional league management creates friction. We eliminate it.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Paper Chaos</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                No more lost signup sheets, unclear match schedules, or confusing score tracking.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Wasted Time</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Automatic match assignments and real-time updates keep games flowing smoothly.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤔</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confusion</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Clear communication about matches, partners, and league standings for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How We Help</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Smart Check-ins</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Players check in digitally, showing who's ready to play in real-time.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Auto-Matching</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Intelligent partner pairing and match assignments based on skill levels.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Live Scoring</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Digital score submission with instant league standings updates.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Real-time Updates</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Everyone stays informed about match assignments and league progress.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="text-orange-600 dark:text-orange-400 text-lg">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Player Analytics</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Track personal progress, win rates, and improvement over time.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <span className="text-pink-600 dark:text-pink-400 text-lg">🏆</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">League Management</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Complete tools for league organizers to manage seasons and tournaments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* South African Focus */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Built for South African Pickleball</h3>
            <p className="text-green-100 max-w-2xl mx-auto leading-relaxed">
              Designed specifically for the unique needs of South African pickleball communities - 
              from Johannesburg to Cape Town, we understand the local league culture and what makes the game special here.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Join a League Today
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;