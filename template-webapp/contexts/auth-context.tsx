"use client"

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Safety timeout - ensure loading state doesn't hang forever
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 10000) // 10 second timeout

    // Get initial user
    const init = async () => {
      try {
        // Session is enough for initial render; avoid the extra user fetch round-trip.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          setUser(null)
          setIsLoading(false)
          clearTimeout(timeout)
          return
        }

        setUser(session?.user ?? null)

        setIsLoading(false)
        clearTimeout(timeout)
      } catch (error) {
        setUser(null)
        setIsLoading(false)
        clearTimeout(timeout)
      }
    }

    init()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
      clearTimeout(timeout)
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    setUser(null)
    try {
      const responsePromise = fetch("/api/auth/signout", {
        method: "POST",
      })

      const response = await responsePromise

      if (!response.ok) {
        throw new Error("Failed to sign out")
      }
    } catch (error) {
      await supabase.auth.signOut({ scope: "global" })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
