// code/client/src/services/auth.ts
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  // We can extend this later if needed
}

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced'
}

export interface SignInData {
  email: string
  password: string
}

class AuthService {
  // Generate username from first and last name
  private generateUsername(firstName: string, lastName: string): string {
    // Sanitize and combine names
    const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '')
    const sanitizedFirst = sanitize(firstName)
    const sanitizedLast = sanitize(lastName)
    return `${sanitizedFirst}_${sanitizedLast}`
  }

  // Sign up new user
  async signUp({ email, password, firstName, lastName, skillLevel }: SignUpData) {
    // Generate username (we'll handle collisions in the database trigger)
    const username = this.generateUsername(firstName, lastName)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username: username,
          skill_level: skillLevel,
        }
      }
    })

    if (error) throw error
    return data
  }

  // Sign in existing user
  async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Get current session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()