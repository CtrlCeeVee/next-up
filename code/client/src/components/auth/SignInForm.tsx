// code/client/src/components/auth/SignInForm.tsx
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react'

interface SignInFormProps {
  onToggle: () => void
}

export function SignInForm({ onToggle }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await signIn(email, password)
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    }
  }

  return (
    <div className="relative">
      {/* Main Form Card */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 transform transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
            <LogIn className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Sign in to continue your pickleball journey
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
              />
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
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle to Sign Up */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onToggle}
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors duration-200 hover:underline"
            >
              Create one here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}