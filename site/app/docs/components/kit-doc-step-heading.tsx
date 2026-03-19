"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** Numbered H3 for kit UI/API docs — matches AGENTS.md “Kit documentation page structure”. */
export function KitDocStepHeading({
  step,
  children,
  className,
}: {
  step: number
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-white mb-3 flex items-center gap-2",
        className
      )}
    >
      <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold shrink-0">
        {step}
      </span>
      {children}
    </h3>
  )
}
