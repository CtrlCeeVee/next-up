import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Moon, Sun, FileText, Shield, AlertTriangle, Users, Gavel, CheckCircle } from 'lucide-react';

const TermsPage = () => {
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
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
            <FileText className="h-4 w-4" />
            <span>Legal Agreement</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Last updated: October 1, 2025<br />
            Effective from your first use of Next-Up
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mr-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Next-Up</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            These Terms of Service ("Terms") govern your use of the Next-Up pickleball league management platform. 
            By creating an account or using our services, you agree to be bound by these Terms.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We've written these terms to be as clear and fair as possible. If you have questions, 
            please contact us before using the platform.
          </p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Fair Play</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Respectful behavior and honest scoring required
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Your Data</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              We protect your information and never sell it
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl text-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit mx-auto mb-4">
              <Gavel className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">South African Law</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Governed by South African legal framework
            </p>
          </div>
        </div>

        {/* Detailed Terms */}
        <div className="space-y-8">
          {/* Account Responsibilities */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Account & Responsibilities</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Account Creation</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  You must provide accurate information and keep your account details up to date. 
                  One account per person, and you're responsible for keeping your login secure.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Fair Play</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Submit honest match scores, treat other players with respect, and follow league rules. 
                  No cheating, harassment, or disruptive behavior.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">League Participation</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Check in only when you're actually present, communicate clearly with partners, 
                  and respect other players' time commitments.
                </p>
              </div>
            </div>
          </section>

          {/* Platform Use */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Platform Use Guidelines</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">✓ Allowed Uses</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• Managing your league participation</li>
                  <li>• Tracking your match statistics</li>
                  <li>• Communicating with league members</li>
                  <li>• Accessing league leaderboards</li>
                  <li>• Providing feedback to improve the platform</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">✗ Prohibited Uses</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• Sharing another person's account</li>
                  <li>• Submitting false scores or information</li>
                  <li>• Harassing or bullying other users</li>
                  <li>• Attempting to hack or disrupt the service</li>
                  <li>• Using the platform for commercial purposes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Service Availability */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mr-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Service Availability & Limitations</h3>
            </div>
            
            <div className="bg-yellow-50/50 dark:bg-yellow-900/20 rounded-xl p-4 mb-4">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">
                ⚠️ Next-Up is provided "as is" and we strive for 99% uptime, but cannot guarantee uninterrupted service.
              </p>
            </div>
            
            <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
              <p>• We may update, modify, or discontinue features with reasonable notice</p>
              <p>• Scheduled maintenance will be announced in advance when possible</p>
              <p>• We're not liable for losses due to service interruptions</p>
              <p>• League organizers remain responsible for their league management decisions</p>
              <p>• Match disputes should be resolved between players first, then escalated if needed</p>
            </div>
          </section>

          {/* Data & Privacy */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Data, Privacy & Termination</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Data Rights</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• Access and download your match history</li>
                  <li>• Update your profile information anytime</li>
                  <li>• Delete your account (some stats may be preserved for league integrity)</li>
                  <li>• Control notification preferences</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Account Termination</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• You can delete your account anytime</li>
                  <li>• We may suspend accounts for Terms violations</li>
                  <li>• Match history may be preserved for league records</li>
                  <li>• 30-day notice for service discontinuation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Legal */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
                <Gavel className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Legal Framework</h3>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
              <p>
                <strong>Governing Law:</strong> These Terms are governed by South African law. 
                Any disputes will be resolved in South African courts.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> Next-Up's liability is limited to the amount 
                you've paid for our services (currently free). We're not responsible for indirect damages.
              </p>
              <p>
                <strong>Changes to Terms:</strong> We may update these Terms with 30 days notice. 
                Continued use means you accept the new Terms.
              </p>
              <p>
                <strong>Contact for Legal Matters:</strong> For legal questions, contact us at legal@next-up.co.za
              </p>
            </div>
          </section>
        </div>

        {/* Contact */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
          <p className="text-green-100 mb-6">
            We're here to clarify anything that's not clear or answer your legal questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => navigate('/privacy')}
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;