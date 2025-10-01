import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Moon, Sun, Shield, Eye, Lock, Users, Database, Bell } from 'lucide-react';

const PrivacyPage = () => {
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
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
          <div className="inline-flex items-center space-x-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Your Privacy Matters</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Last updated: October 1, 2025
          </p>
        </div>

        {/* Privacy Commitment */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mr-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Commitment to You</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            At Next-Up, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            protect, and share information about you when you use our pickleball league management platform.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We believe in transparency and want you to understand exactly how your information is handled 
            when you're part of the Next-Up community.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mx-auto mb-4">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">What We Collect</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Only information necessary to provide league management services
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-4">
              <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">How We Protect</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Industry-standard encryption and security measures
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl text-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Your Control</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              You can access, update, or delete your data at any time
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Information We Collect</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Account Information</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Name, email address, phone number, and skill level to create and manage your account.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">League Activity</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Match scores, partnership preferences, check-in times, and league participation data.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Information</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  How you interact with our platform, including pages visited and features used (anonymized).
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h3>
            </div>
            
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span className="text-sm">Provide league management and match coordination services</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span className="text-sm">Generate player statistics and league leaderboards</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span className="text-sm">Send important league notifications and updates</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span className="text-sm">Improve our platform based on user feedback and usage patterns</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span className="text-sm">Ensure fair play and maintain league integrity</span>
              </li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Information Sharing</h3>
            </div>
            
            <div className="bg-green-50/50 dark:bg-green-900/20 rounded-xl p-4 mb-4">
              <p className="text-green-800 dark:text-green-300 text-sm font-medium">
                🔒 We never sell your personal information to third parties.
              </p>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              We only share information in these limited circumstances:
            </p>
            
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span className="text-sm">With other league members (name, skill level, match statistics only)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span className="text-sm">With league organizers for management purposes</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span className="text-sm">When required by law or to protect our users' safety</span>
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
                <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Rights & Choices</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Access & Update</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  View and modify your profile information at any time through your account settings.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Delete Account</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Request complete deletion of your account and associated data.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Data Export</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Download a copy of your league statistics and match history.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Communication</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Control what notifications and emails you receive from us.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About Privacy?</h3>
          <p className="text-green-100 mb-6">
            We're here to help you understand how your information is protected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              View Terms
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;