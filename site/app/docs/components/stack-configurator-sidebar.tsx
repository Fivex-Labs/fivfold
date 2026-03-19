"use client"

import * as React from "react"
import { useStack } from "./stack-context"
import type { Runtime, Framework, AuthProvider, PushProvider, FrontendBundler } from "./stack-context"
import {
  DATABASE_OPTIONS,
  ORM_OPTIONS_BY_DATABASE,
  FRONTEND_BUNDLER_OPTIONS,
} from "./stack-context"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { PlatformIcon } from "./platform-icons"

const RUNTIME_OPTIONS: { value: Runtime; label: string }[] = [
  { value: "node", label: "Node.js" },
]

const FRAMEWORK_OPTIONS: { value: Framework; label: string }[] = [
  { value: "express", label: "Express" },
  { value: "nestjs", label: "NestJS" },
]

const AUTH_OPTIONS: { value: AuthProvider; label: string }[] = [
  { value: "firebase", label: "Firebase" },
  { value: "cognito", label: "Cognito" },
  { value: "auth0", label: "Auth0" },
  { value: "jwt", label: "JWT" },
]

const PUSH_OPTIONS: { value: PushProvider; label: string }[] = [
  { value: "fcm", label: "Firebase Cloud Messaging" },
  { value: "onesignal", label: "OneSignal" },
  { value: "sns", label: "AWS SNS" },
  { value: "pushy", label: "Pushy" },
  { value: "pusher-beams", label: "Pusher Beams" },
]

export interface StackConfiguratorSidebarProps {
  showAuthProvider?: boolean
  authOnly?: boolean
  showPushProvider?: boolean
  showDatabaseFields?: boolean
  /** Show Frontend (Vite / Next.js) — drives kit docs for dev routing and CORS hints. */
  showFrontendBundler?: boolean
}

function OptionCard<T extends string>({
  value,
  label,
  platformKey,
  selected,
  onClick,
}: {
  value: T
  label: string
  platformKey?: string
  selected?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-center transition-colors",
        "hover:bg-white/5 hover:border-white/20",
        selected
          ? "border-brand-primary/50 bg-brand-primary/10"
          : "border-white/10 bg-white/5"
      )}
    >
      <PlatformIcon platform={platformKey ?? value} size={24} />
      <span className="text-xs font-medium text-white/90 line-clamp-1">{label}</span>
    </button>
  )
}

function StackCard({
  label,
  value,
  platformKey,
  onClick,
}: {
  label: string
  value: string
  platformKey?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-2",
        "hover:bg-white/10 hover:border-white/20 transition-colors text-left w-full"
      )}
    >
      <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider w-full">
        {label}
      </span>
      <div className="flex items-center gap-1.5 mt-1 w-full justify-start">
        <PlatformIcon platform={platformKey ?? value} size={16} />
        <span className="text-xs font-medium text-white/90 truncate">{value}</span>
      </div>
    </button>
  )
}

export function StackConfiguratorSidebar({
  showAuthProvider = false,
  authOnly = false,
  showPushProvider = false,
  showDatabaseFields = false,
  showFrontendBundler = false,
}: StackConfiguratorSidebarProps) {
  const { stack, setStack } = useStack()
  const [openCategory, setOpenCategory] = React.useState<string | null>(null)

  const ormOptions = ORM_OPTIONS_BY_DATABASE[stack.database]

  const runtimeLabel = RUNTIME_OPTIONS.find((o) => o.value === stack.runtime)?.label ?? stack.runtime
  const frameworkLabel = FRAMEWORK_OPTIONS.find((o) => o.value === stack.framework)?.label ?? stack.framework
  const databaseLabel = DATABASE_OPTIONS.find((o) => o.value === stack.database)?.label ?? stack.database
  const ormLabel = ormOptions.find((o) => o.value === stack.orm)?.label ?? stack.orm
  const authLabel = AUTH_OPTIONS.find((o) => o.value === (stack.authProvider ?? "firebase"))?.label ?? (stack.authProvider ?? "firebase")
  const pushLabel = PUSH_OPTIONS.find((o) => o.value === (stack.pushProvider ?? "fcm"))?.label ?? (stack.pushProvider ?? "fcm")
  const frontendLabel =
    FRONTEND_BUNDLER_OPTIONS.find((o) => o.value === stack.frontend)?.label ?? stack.frontend

  return (
    <>
      <div className="mt-6 pt-6 border-t border-white/10">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
          Stack
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {!authOnly && (
            <>
              {showFrontendBundler && (
                <StackCard
                  label="Frontend"
                  value={frontendLabel}
                  platformKey={stack.frontend}
                  onClick={() => setOpenCategory("frontend")}
                />
              )}
              <StackCard
                label="Runtime"
                value={runtimeLabel}
                platformKey={stack.runtime}
                onClick={() => setOpenCategory("runtime")}
              />
              <StackCard
                label="Framework"
                value={frameworkLabel}
                platformKey={stack.framework}
                onClick={() => setOpenCategory("framework")}
              />
              {showDatabaseFields && (
                <StackCard
                  label="Database"
                  value={databaseLabel}
                  platformKey={stack.database}
                  onClick={() => setOpenCategory("database")}
                />
              )}
              <StackCard
                label="ORM / DAL"
                value={ormLabel}
                platformKey={stack.orm}
                onClick={() => setOpenCategory("orm")}
              />
            </>
          )}
          {authOnly && showFrontendBundler && (
            <StackCard
              label="Frontend"
              value={frontendLabel}
              platformKey={stack.frontend}
              onClick={() => setOpenCategory("frontend")}
            />
          )}
          {(showAuthProvider || authOnly) && (
            <StackCard
              label="Auth"
              value={authLabel}
              platformKey={stack.authProvider ?? "firebase"}
              onClick={() => setOpenCategory("auth")}
            />
          )}
          {showPushProvider && (
            <StackCard
              label="Push"
              value={pushLabel}
              platformKey={stack.pushProvider ?? "fcm"}
              onClick={() => setOpenCategory("push")}
            />
          )}
        </div>
      </div>

      {/* Frontend bundler Sheet — first in sidebar order when enabled */}
      <Sheet open={openCategory === "frontend"} onOpenChange={(o) => !o && setOpenCategory(null)}>
        <SheetContent side="right" className="overflow-y-auto rounded-t-xl border-white/10 bg-[#0a0a0a]">
          <SheetHeader>
            <SheetTitle className="text-white">Choose frontend</SheetTitle>
          </SheetHeader>
          <p className="px-4 text-xs text-white/50">
            Used for kit documentation: how your UI dev server reaches the API (rewrites, env vars). Not a FivFold CLI flag.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {FRONTEND_BUNDLER_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                platformKey={opt.value}
                selected={stack.frontend === opt.value}
                onClick={() => {
                  setStack({ frontend: opt.value as FrontendBundler })
                  setOpenCategory(null)
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Runtime Sheet */}
      <Sheet open={openCategory === "runtime"} onOpenChange={(o) => !o && setOpenCategory(null)}>
        <SheetContent side="right" className="overflow-y-auto rounded-t-xl border-white/10 bg-[#0a0a0a]">
          <SheetHeader>
            <SheetTitle className="text-white">Choose Runtime</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {RUNTIME_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                platformKey={opt.value}
                selected={stack.runtime === opt.value}
                onClick={() => {
                  setStack({ runtime: opt.value })
                  setOpenCategory(null)
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Framework Sheet */}
      <Sheet open={openCategory === "framework"} onOpenChange={(o) => !o && setOpenCategory(null)}>
        <SheetContent side="right" className="overflow-y-auto rounded-t-xl border-white/10 bg-[#0a0a0a]">
          <SheetHeader>
            <SheetTitle className="text-white">Choose Framework</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {FRAMEWORK_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                platformKey={opt.value}
                selected={stack.framework === opt.value}
                onClick={() => {
                  setStack({ framework: opt.value })
                  setOpenCategory(null)
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Database Sheet */}
      <Sheet open={openCategory === "database"} onOpenChange={(o) => !o && setOpenCategory(null)}>
        <SheetContent side="right" className="overflow-y-auto rounded-t-xl border-white/10 bg-[#0a0a0a]">
          <SheetHeader>
            <SheetTitle className="text-white">Choose Database</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 p-4">
            {DATABASE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                platformKey={opt.value}
                selected={stack.database === opt.value}
                onClick={() => {
                  setStack({ database: opt.value })
                  setOpenCategory(null)
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* ORM Sheet */}
      <Sheet open={openCategory === "orm"} onOpenChange={(o) => !o && setOpenCategory(null)}>
        <SheetContent side="right" className="overflow-y-auto rounded-t-xl border-white/10 bg-[#0a0a0a]">
          <SheetHeader>
            <SheetTitle className="text-white">Choose ORM / DAL</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 p-4">
            {ormOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                platformKey={opt.value}
                selected={stack.orm === opt.value}
                onClick={() => {
                  setStack({ orm: opt.value })
                  setOpenCategory(null)
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Auth Sheet */}
      <Sheet open={openCategory === "auth"} onOpenChange={(o) => !o && setOpenCategory(null)}>
        <SheetContent side="right" className="overflow-y-auto rounded-t-xl border-white/10 bg-[#0a0a0a]">
          <SheetHeader>
            <SheetTitle className="text-white">Choose Auth Provider</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {AUTH_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                platformKey={opt.value}
                selected={(stack.authProvider ?? "firebase") === opt.value}
                onClick={() => {
                  setStack({ authProvider: opt.value as AuthProvider })
                  setOpenCategory(null)
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Push Sheet */}
      <Sheet open={openCategory === "push"} onOpenChange={(o) => !o && setOpenCategory(null)}>
        <SheetContent side="right" className="overflow-y-auto rounded-t-xl border-white/10 bg-[#0a0a0a]">
          <SheetHeader>
            <SheetTitle className="text-white">Choose Push Service</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {PUSH_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                platformKey={opt.value}
                selected={(stack.pushProvider ?? "fcm") === opt.value}
                onClick={() => {
                  setStack({ pushProvider: opt.value as PushProvider })
                  setOpenCategory(null)
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
