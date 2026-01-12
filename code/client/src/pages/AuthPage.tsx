// code/client/src/pages/AuthPage.tsx
import { useState } from 'react'
import { SignInForm } from '../components/auth/SignInForm'
import { SignUpForm } from '../components/auth/SignUpForm'
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm'
import { Zap, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const navigate = useNavigate()

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setIsForgotPassword(false)
  }

  const showForgotPassword = () => {
    setIsForgotPassword(true)
    setIsSignUp(false)
  }

  const showSignIn = () => {
    setIsForgotPassword(false)
    setIsSignUp(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-teal-300/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg text-gray-700 dark:text-gray-300 px-4 py-2 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 dark:border-slate-700/50"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/logo.png"
                alt="Next-Up Logo"
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto"
              />
            </div>
            
            <div className="inline-flex items-center space-x-2 bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              <span>Welcome to South Africa's Premier Pickleball Platform</span>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {isForgotPassword 
                ? 'Reset your password' 
                : isSignUp 
                ? 'Create your account and join the community' 
                : 'Sign in to your Next-Up account'
              }
            </p>
          </div>
          
          {/* Form Container */}
          {isForgotPassword ? (
            <ForgotPasswordForm onBack={showSignIn} />
          ) : isSignUp ? (
            <SignUpForm onToggle={toggleMode} />
          ) : (
            <SignInForm onToggle={toggleMode} onForgotPassword={showForgotPassword} />
          )}
        </div>
      </div>
    </div>
  )
}