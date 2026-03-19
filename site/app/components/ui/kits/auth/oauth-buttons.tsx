"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { SiGoogle, SiApple, SiGithub } from "@icons-pack/react-simple-icons"
import { cn } from "@/lib/utils"

export type OAuthProvider = "google" | "github" | "apple"

export interface OAuthButtonsProps {
  providers?: OAuthProvider[]
  onSignIn?: (provider: OAuthProvider) => void
  disabled?: boolean
  className?: string
}

const PROVIDER_CONFIG: Record<
  OAuthProvider,
  { label: string; Icon: React.ComponentType<{ size?: number; color?: string; className?: string }> }
> = {
  google: {
    label: "Sign in with Google",
    Icon: SiGoogle,
  },
  github: {
    label: "Sign in with GitHub",
    Icon: SiGithub,
  },
  apple: {
    label: "Sign in with Apple",
    Icon: SiApple,
  },
}

export function OAuthButtons({
  providers = ["google", "github"],
  onSignIn,
  disabled = false,
  className,
}: OAuthButtonsProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {providers.map((provider) => {
        const config = PROVIDER_CONFIG[provider]
        const Icon = config.Icon
        return (
          <Button
            key={provider}
            type="button"
            variant="outline"
            size="icon"
            aria-label={config.label}
            className="h-10 w-10 shrink-0 rounded-full bg-muted/50 hover:bg-muted"
            disabled={disabled}
            onClick={() => onSignIn?.(provider)}
          >
            <Icon size={20} color="currentColor" />
          </Button>
        )
      })}
    </div>
  )
}
