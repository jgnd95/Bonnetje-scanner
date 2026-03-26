'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAnonymous: boolean
  upgradeAccount: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          if (isMounted) setUser(session.user)
        } else {
          const { data, error } = await supabase.auth.signInAnonymously()
          if (error) throw error
          if (isMounted) setUser(data.user)
        }
      } catch (error) {
        console.error('Auth init error:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) setUser(session?.user ?? null)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const upgradeAccount = async (email: string, password: string) => {
    const { error } = await supabase.auth.updateUser({ email, password })
    if (error) throw error
  }

  const isAnonymous = user?.is_anonymous ?? true

  return (
    <AuthContext.Provider value={{ user, loading, isAnonymous, upgradeAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
