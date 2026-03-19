"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "./auth-layout"
import { useAuth } from "./auth-provider"
import type { ForgotPasswordFormProps } from "./types"

export function ForgotPasswordForm({
  onSubmit,
  onBackToLogin,
  logoSrc,
  appName,
  termsHref,
  privacyHref,
  forceLayout,
  className,
}: ForgotPasswordFormProps) {
  const auth = useAuth()
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await (onSubmit ?? auth.forgotPassword)(email)
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout
        logoSrc={logoSrc}
        appName={appName}
        heading="Check your email"
        subheading={`We've sent a password reset link to ${email}.`}
        termsHref={termsHref}
        privacyHref={privacyHref}
        forceLayout={forceLayout}
        className={className}
      >
        <p className="text-sm text-muted-foreground">
          If you don&apos;t see the email, check your spam folder.
        </p>
        {onBackToLogin && (
          <Button variant="outline" className="w-full" onClick={onBackToLogin}>
            Back to sign in
          </Button>
        )}
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      logoSrc={logoSrc}
      appName={appName}
      heading="Forgot password"
      subheading="Enter your email and we'll send you a reset link."
      termsHref={termsHref}
      privacyHref={privacyHref}
      forceLayout={forceLayout}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
        {onBackToLogin && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onBackToLogin}
          >
            Back to sign in
          </Button>
        )}
      </form>
    </AuthLayout>
  )
}
