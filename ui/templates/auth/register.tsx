"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { OAuthButtons, type OAuthProvider } from "./oauth-buttons"
import { AuthLayout } from "./auth-layout"
import { useAuth } from "./auth-provider"
import type { RegisterFormProps } from "./types"

export function RegisterForm({
  onSubmit,
  oauthProviders = ["google", "github"],
  logoSrc,
  appName,
  termsHref,
  privacyHref,
  footerContent,
  forceLayout,
  className,
}: RegisterFormProps) {
  const auth = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      await (onSubmit ?? ((e, p, d) => auth.register(e, p, d)))(email, password, displayName || undefined)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      logoSrc={logoSrc}
      appName={appName}
      heading="Create an account"
      subheading={appName ? `Sign up for your ${appName} account` : undefined}
      termsHref={termsHref}
      privacyHref={privacyHref}
      footer={footerContent}
      forceLayout={forceLayout}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="register-displayName">Display name (optional)</Label>
          <Input
            id="register-displayName"
            type="text"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
            required
            minLength={8}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or sign up with
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
