"use client"

import { cn } from "@/lib/utils"
import { MapPin, Users } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { FivFoldCalendarEvent, CalendarEventColor } from "./types"

export const EVENT_COLOR_CLASSES: Record<CalendarEventColor, string> = {
  default: "bg-primary/20 border-primary/40 text-primary",
  red:     "bg-red-500/20 border-red-500/40 text-red-400",
  orange:  "bg-orange-500/20 border-orange-500/40 text-orange-400",
  yellow:  "bg-yellow-500/20 border-yellow-500/40 text-yellow-400",
  green:   "bg-green-500/20 border-green-500/40 text-green-400",
  teal:    "bg-teal-500/20 border-teal-500/40 text-teal-400",
  blue:    "bg-blue-500/20 border-blue-500/40 text-blue-400",
  purple:  "bg-purple-500/20 border-purple-500/40 text-purple-400",
  pink:    "bg-pink-500/20 border-pink-500/40 text-pink-400",
}

export const EVENT_DOT_CLASSES: Record<CalendarEventColor, string> = {
  default: "bg-primary",
  red:     "bg-red-400",
  orange:  "bg-orange-400",
  yellow:  "bg-yellow-400",
  green:   "bg-green-400",
  teal:    "bg-teal-400",
  blue:    "bg-blue-400",
  purple:  "bg-purple-400",
  pink:    "bg-pink-400",
}

interface EventCardProps {
  event: FivFoldCalendarEvent
  onClick?: (event: FivFoldCalendarEvent) => void
  /** Compact pill style for month-view cells */
  compact?: boolean
  className?: string
}

export function EventCard({ event, onClick, compact = false, className }: EventCardProps) {
  const colorClass = EVENT_COLOR_CLASSES[event.color ?? "default"]
  const dotClass = EVENT_DOT_CLASSES[event.color ?? "default"]

  const startTime = event.isAllDay
    ? null
    : format(parseISO(event.startDate), "h:mm a")

  if (compact) {
    return (
      <button
        onClick={() => onClick?.(event)}
        className={cn(
          "flex w-full items-center gap-1 rounded px-1.5 py-0.5 text-left text-xs font-medium border truncate transition-opacity hover:opacity-80",
          colorClass,
          className
        )}
      >
        <span className={cn("size-1.5 shrink-0 rounded-full", dotClass)} />
        <span className="truncate">{event.title}</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick?.(event)}
      className={cn(
        "flex w-full flex-col gap-0.5 rounded-lg border px-3 py-2 text-left text-sm transition-opacity hover:opacity-80",
        colorClass,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn("size-2 shrink-0 rounded-full", dotClass)} />
        <span className="font-medium truncate">{event.title}</span>
        {startTime && (
          <span className="ml-auto shrink-0 text-xs opacity-70">{startTime}</span>
        )}
        {event.isAllDay && (
          <span className="ml-auto shrink-0 text-xs opacity-70">All day</span>
        )}
      </div>
      {event.location && (
        <div className="flex items-center gap-1 pl-4 text-xs opacity-70">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      )}
      {event.attendees && event.attendees.length > 0 && (
        <div className="flex items-center gap-1 pl-4 text-xs opacity-70">
          <Users className="size-3 shrink-0" />
          <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? "s" : ""}</span>
        </div>
      )}
    </button>
  )
}
