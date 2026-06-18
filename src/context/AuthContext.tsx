import { createContext, useContext, type ReactNode } from 'react'

interface AuthContextValue {
  // TODO: set golferId when real auth maps user → golfer
  golferId: number | null
  displayName: string
}

const AuthContext = createContext<AuthContextValue>({
  golferId: null,
  displayName: 'Player',
})

// Stub: hardcoded single-user. Replace with real auth provider when ready.
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ golferId: null, displayName: 'Player' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
