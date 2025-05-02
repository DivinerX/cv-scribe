"use client"

import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type UserContextType = {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const logout = async () => {
    await supabase.auth.signOut()
  }
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsAdmin(user?.email === "sittnerkalid@gmail.com")
      setIsLoading(false)
    }
    
    getUser()
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setIsAdmin(session?.user?.email === "sittnerkalid@gmail.com")
        setIsLoading(false)
      }
    )
    
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <UserContext.Provider value={{ user, isAdmin, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
