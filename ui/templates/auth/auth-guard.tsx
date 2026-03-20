"use client"

import { useAuth } from "./auth-provider"
import type { AuthGuardProps } from "./types"

export function AuthGuard({
  children,
  fallback = null,
  redirectTo,
}: AuthGuardProps) {
  const { user, state } = useAuth()

  if (state === "loading") {
    return fallback ?? <div className="p-4 text-center text-muted-foreground">Loading...</div>
  }

  if (state === "unauthenticated" || !user) {
    if (redirectTo && typeof window !== "undefined") {
      window.location.href = redirectTo
      return fallback ?? null
    }
    return fallback ?? (
      <div className="p-4 text-center text-muted-foreground">
        Please sign in to continue.
      </div>
    )
  }

  return <>{children}</>
}
