"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AuthLayoutProps {
  /** Logo image src (e.g. /logos/logomark_dark_transparent.png) */
  logoSrc?: string
  /** App name for subtext (e.g. "Acme Inc") */
  appName?: string
  /** Heading text (e.g. "Welcome back", "Create an account") */
  heading: string
  /** Subheading text (e.g. "Login to your Acme Inc account") */
  subheading?: string
  /** Terms of Service URL for footer */
  termsHref?: string
  /** Privacy Policy URL for footer */
  privacyHref?: string
  /** Form content (inputs, buttons) */
  children: React.ReactNode
  /** Optional footer content (e.g. "Don't have an account? Sign up") */
  footer?: React.ReactNode
  /** Force layout for device preview: "mobile" hides branding pane */
  forceLayout?: "mobile" | "desktop"
  className?: string
}

export function AuthLayout({
  logoSrc,
  appName,
  heading,
  subheading,
  termsHref,
  privacyHref,
  children,
  footer,
  forceLayout,
  className,
}: AuthLayoutProps) {
  const isMobile = forceLayout === "mobile"
  return (
    <div
      className={cn(
        "flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl",
        !isMobile && "md:grid md:grid-cols-2",
        className
      )}
    >
      {/* Form pane (left on desktop, top on mobile) */}
      <div
        className={cn(
          "flex flex-1 flex-col justify-center p-6 sm:p-8",
          !isMobile && "md:min-h-[480px]"
        )}
      >
        {logoSrc && (
          <div className={cn("mb-6 flex justify-center", !isMobile && "md:hidden")}>
            <img
              src={logoSrc}
              alt="Logo"
              className="h-12 w-auto object-contain object-center"
            />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h1>
          {subheading && (
            <p className="text-sm text-muted-foreground">{subheading}</p>
          )}
        </div>
        <div className="mt-6 space-y-4">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>

      {/* Branding pane (right on desktop, hidden on mobile) */}
      {!isMobile && (
      <div
        className={cn(
          "hidden md:flex",
          "min-h-[320px] flex-1 flex-col items-center justify-center",
          "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
          "relative overflow-hidden"
        )}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {logoSrc && (
          <div className="relative z-10 flex h-24 w-48 items-center justify-center">
            <img
              src={logoSrc}
              alt={appName ?? "Logo"}
              className="h-full w-full object-contain object-center opacity-90"
            />
          </div>
        )}
      </div>
      )}

      {(termsHref || privacyHref) && (
        <div className="col-span-full border-t border-border px-6 py-4">
          <p className="text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{" "}
            {termsHref ? (
              <a
                href={termsHref}
                className="underline underline-offset-2 hover:text-foreground"
              >
                Terms of Service
              </a>
            ) : (
              "Terms of Service"
            )}{" "}
            and{" "}
            {privacyHref ? (
              <a
                href={privacyHref}
                className="underline underline-offset-2 hover:text-foreground"
              >
                Privacy Policy
              </a>
            ) : (
              "Privacy Policy"
            )}
            .
          </p>
        </div>
      )}
    </div>
  )
}
