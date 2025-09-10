// code/client/src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { authService } from '../services/auth'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    // Get initial session
    authService.getSession().then((session) => {
      setState({
        user: session?.user ?? null,
        session: session,
        loading: false,
      })
    })

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      (_event, session) => {
        setState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const data = await authService.signIn({ email, password })
      return data
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName: string, skillLevel: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const data = await authService.signUp({ email, password, fullName, skillLevel })
      return data
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      await authService.signOut()
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!state.user,
  }
}