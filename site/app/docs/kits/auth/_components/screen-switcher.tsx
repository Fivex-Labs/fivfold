"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AuthScreen =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | "email-verification"

const SCREENS: { id: AuthScreen; label: string }[] = [
  { id: "login", label: "Login" },
  { id: "register", label: "Register" },
  { id: "forgot-password", label: "Forgot Password" },
  { id: "reset-password", label: "Reset Password" },
  { id: "email-verification", label: "Email Verification" },
]

export interface ScreenSwitcherProps {
  active: AuthScreen
  onSwitch: (screen: AuthScreen) => void
  className?: string
}

export function ScreenSwitcher({
  active,
  onSwitch,
  className,
}: ScreenSwitcherProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-1 rounded-lg border border-white/10 bg-black/20 p-1",
        className
      )}
    >
      {SCREENS.map((screen) => (
        <Button
          key={screen.id}
          variant="ghost"
          size="sm"
          className={cn(
            "text-white/70 hover:bg-white/10 hover:text-white",
            active === screen.id && "bg-white/10 text-white"
          )}
          onClick={() => onSwitch(screen.id)}
        >
          {screen.label}
        </Button>
      ))}
    </div>
  )
}
