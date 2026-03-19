"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { OAuthButtons, type OAuthProvider } from "./oauth-buttons"
import { AuthLayout } from "./auth-layout"
import { useAuth } from "./auth-provider"
import { cn } from "@/lib/utils"
import type { LoginFormProps } from "./types"

export function LoginForm({
  onSubmit,
  onForgotPassword,
  oauthProviders = ["google", "github"],
  logoSrc,
  appName,
  termsHref,
  privacyHref,
  footerContent,
  forceLayout,
  className,
}: LoginFormProps) {
  const auth = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      await (onSubmit ?? auth.login)(email, password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      logoSrc={logoSrc}
      appName={appName}
      heading="Welcome back"
      subheading={appName ? `Login to your ${appName} account` : undefined}
      termsHref={termsHref}
      privacyHref={privacyHref}
      footer={footerContent}
      forceLayout={forceLayout}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            {onForgotPassword && (
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={onForgotPassword}
              >
                Forgot password?
              </button>
            )}
          </div>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or sign in with
          </span>
        </div>
      </div>
      <OAuthButtons
        providers={oauthProviders as OAuthProvider[]}
        onSignIn={(p) => auth.signInWithOAuth(p)}
        disabled={loading}
      />
    </AuthLayout>
  )
}
