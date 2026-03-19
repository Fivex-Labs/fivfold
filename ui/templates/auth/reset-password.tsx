"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "./auth-layout"
import { useAuth } from "./auth-provider"
import type { ResetPasswordFormProps } from "./types"

export function ResetPasswordForm({
  token,
  onSubmit,
  onBackToLogin,
  logoSrc,
  appName,
  termsHref,
  privacyHref,
  forceLayout,
  className,
}: ResetPasswordFormProps) {
  const auth = useAuth()
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    try {
      await (onSubmit ?? auth.resetPassword)(token, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      logoSrc={logoSrc}
      appName={appName}
      heading="Reset password"
      subheading="Enter your new password below."
      termsHref={termsHref}
      privacyHref={privacyHref}
      forceLayout={forceLayout}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <div>
          <Label htmlFor="reset-password">New password</Label>
          <Input
            id="reset-password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
            required
            minLength={8}
          />
        </div>
        <div>
          <Label htmlFor="reset-confirm">Confirm password</Label>
          <Input
            id="reset-confirm"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2"
            required
            minLength={8}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
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
