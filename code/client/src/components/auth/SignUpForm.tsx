// code/client/src/components/auth/SignUpForm.tsx
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { User, Mail, Lock, Shield, Trophy, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'

interface SignUpFormProps {
  onToggle: () => void
}

export function SignUpForm({ onToggle }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signUp, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await signUp(email, password, firstName, lastName, skillLevel)
      setSuccess('Account created! Please check your email for verification.')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    }
  }

  const skillLevelOptions = [
    { value: 'Beginner', icon: '🌱', description: 'New to pickleball' },
    { value: 'Intermediate', icon: '🎯', description: 'Some experience' },
    { value: 'Advanced', icon: '🏆', description: 'Experienced player' }
  ]

  return (
    <div className="relative">
      {/* Main Form Card */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 transform transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
            <User className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Join Next-Up
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Create your account and start your pickleball journey
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/50 text-red-700 dark:text-red-300 rounded-2xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/50 text-green-700 dark:text-green-300 rounded-2xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name Field */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-green-400 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                  placeholder="First name"
                />
              </div>
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-green-400 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-green-400 transition-colors duration-200" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-green-400 transition-colors duration-200" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                placeholder="Create a password"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-green-400 transition-colors duration-200" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Skill Level Field */}
          <div className="space-y-2">
            <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Skill Level
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Trophy className="h-5 w-5 text-gray-600 dark:text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-green-400 transition-colors duration-200" />
              </div>
              <select
                id="skillLevel"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-white transition-all duration-300 appearance-none cursor-pointer"
              >
                {skillLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.value} - {option.description}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2 group"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle to Sign In */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Already have an account?{' '}
            <button
              onClick={onToggle}
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors duration-200 hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}