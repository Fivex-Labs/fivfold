"use client"

import * as React from "react"
import type { FivFoldUser, AuthContextValue, AuthState, AuthKitProps } from "./types"

const defaultContextValue: AuthContextValue = {
  user: null,
  state: "unauthenticated",
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  verifyEmail: async () => {},
  resendVerificationEmail: async () => {},
  signInWithOAuth: async () => {},
}

const AuthContext = React.createContext<AuthContextValue>(defaultContextValue)

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

export function AuthProvider({ children, onAuthStateChange }: AuthKitProps) {
  const [user, setUser] = React.useState<FivFoldUser | null>(null)
  const [state, setState] = React.useState<AuthState>("unauthenticated")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    onAuthStateChange?.(user)
  }, [user, onAuthStateChange])

  const value: AuthContextValue = React.useMemo(
    () => ({
      user,
      state,
      error,
      login: async (email: string, password: string) => {
        setState("loading")
        setError(null)
        try {
          // Stub: replace with actual provider implementation
          setUser({
            id: "demo-user",
            email,
            displayName: email.split("@")[0],
            emailVerified: false,
          })
          setState("authenticated")
        } catch (err) {
          setError(err instanceof Error ? err.message : "Login failed")
          setState("error")
        }
      },
      register: async (email: string, password: string, displayName?: string) => {
        setState("loading")
        setError(null)
        try {
          // Stub: replace with actual provider implementation
          setUser({
            id: "demo-user",
            email,
            displayName: displayName ?? email.split("@")[0],
            emailVerified: false,
          })
          setState("authenticated")
        } catch (err) {
          setError(err instanceof Error ? err.message : "Registration failed")
          setState("error")
        }
      },
      logout: async () => {
        setState("loading")
        setUser(null)
        setError(null)
        setState("unauthenticated")
      },
      forgotPassword: async () => {
        setState("loading")
        setError(null)
        setState("unauthenticated")
      },
      resetPassword: async () => {
        setState("loading")
        setError(null)
        setState("unauthenticated")
      },
      verifyEmail: async () => {
        setState("loading")
        setError(null)
        if (user) setUser({ ...user, emailVerified: true })
        setState("authenticated")
      },
      resendVerificationEmail: async () => {},
      signInWithOAuth: async () => {
        setState("loading")
        setError(null)
        try {
          setUser({
            id: "oauth-user",
            email: "oauth@example.com",
            displayName: "OAuth User",
            emailVerified: true,
          })
          setState("authenticated")
        } catch (err) {
          setError(err instanceof Error ? err.message : "OAuth sign-in failed")
          setState("error")
        }
      },
    }),
    [user, state, error]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
