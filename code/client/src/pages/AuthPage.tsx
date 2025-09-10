// code/client/src/pages/AuthPage.tsx
import { useState } from 'react'
import { SignInForm } from '../components/auth/SignInForm'
import { SignUpForm } from '../components/auth/SignUpForm'

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Next-Up Pickleball
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join the Northcliff Eagles League
          </p>
        </div>
        
        {isSignUp ? (
          <SignUpForm onToggle={toggleMode} />
        ) : (
          <SignInForm onToggle={toggleMode} />
        )}
      </div>
    </div>
  )
}