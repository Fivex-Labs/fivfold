"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Star, StarOff } from "lucide-react"
import type { FivFoldEmailLabel, FivFoldEmailThread } from "./types"

export interface ThreadItemProps {
  thread: FivFoldEmailThread
  selected: boolean
  onClick: () => void
  onStar?: (starred: boolean) => void
  availableLabels?: FivFoldEmailLabel[]
}

export function ThreadItem({ thread, selected, onClick, onStar, availableLabels = [] }: ThreadItemProps) {
  const labelMap = React.useMemo(
    () => Object.fromEntries(availableLabels.map((l) => [l.id, l])),
    [availableLabels]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full min-w-0 cursor-pointer overflow-hidden border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/50",
        selected && "bg-accent",
        thread.unread && "bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("truncate text-sm", thread.unread ? "font-semibold" : "font-medium")}>
              {thread.from}
            </span>
            {thread.conversationCount && thread.conversationCount > 1 && (
              <span className="shrink-0 rounded bg-muted px-1 text-xs text-muted-foreground">
                {thread.conversationCount}
              </span>
            )}
          </div>
          <p className={cn("truncate text-xs", thread.unread ? "font-medium text-foreground" : "text-muted-foreground")}>
            {thread.subject}
          </p>
          <p className="truncate text-xs text-muted-foreground">{thread.snippet}</p>
          {thread.labels && thread.labels.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {thread.labels.map((lid) => {
                const lbl = labelMap[lid]
                return (
                  <Badge
                    key={lid}
                    variant="outline"
                    className="h-4 px-1 text-[10px]"
                    style={lbl?.color ? { borderColor: lbl.color, color: lbl.color } : undefined}
                  >
                    {lbl?.name ?? lid}
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[10px] text-muted-foreground">{thread.datetime}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onStar?.(!thread.starred)
            }}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {thread.starred ? (
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            ) : (
              <StarOff className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
