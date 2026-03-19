"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "./auth-layout"
import { useAuth } from "./auth-provider"
import type { EmailVerificationProps } from "./types"

export function EmailVerification({
  onResend,
  onBackToLogin,
  logoSrc,
  appName,
  termsHref,
  privacyHref,
  forceLayout,
  className,
}: EmailVerificationProps) {
  const auth = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  const handleResend = async () => {
    setLoading(true)
    try {
      await (onResend ?? auth.resendVerificationEmail)()
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      logoSrc={logoSrc}
      appName={appName}
      heading="Verify your email"
      subheading="We've sent a verification link to your email. Please check your inbox and click the link to verify your account."
      termsHref={termsHref}
      privacyHref={privacyHref}
      forceLayout={forceLayout}
      className={className}
    >
      <Button
        variant="outline"
        className="w-full"
        disabled={loading || sent}
        onClick={handleResend}
      >
        {loading ? "Sending..." : sent ? "Link sent" : "Resend verification email"}
      </Button>
      {onBackToLogin && (
        <Button variant="ghost" className="w-full" onClick={onBackToLogin}>
          Back to sign in
        </Button>
      )}
    </AuthLayout>
  )
}
