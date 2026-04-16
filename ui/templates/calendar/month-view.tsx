"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
  parseISO,
  isSameDay,
} from "date-fns"
import { EventCard } from "./event-card"
import type { FivFoldCalendarEvent } from "./types"

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getEventsForDay(events: FivFoldCalendarEvent[], day: Date): FivFoldCalendarEvent[] {
  return events
    .filter((e) => {
      const start = parseISO(e.startDate)
      const end = parseISO(e.endDate)
      return isSameDay(day, start) || isSameDay(day, end) || (day > start && day < end)
    })
    .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime())
}

interface MonthViewProps {
  currentDate: Date
  events: FivFoldCalendarEvent[]
  onEventClick: (event: FivFoldCalendarEvent) => void
  onDayClick: (date: Date) => void
  weekStartsOn?: 0 | 1
}

export function MonthView({
  currentDate,
  events,
  onEventClick,
  onDayClick,
  weekStartsOn = 0,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const dayLabels =
    weekStartsOn === 1
      ? [...DAY_LABELS.slice(1), DAY_LABELS[0]]
      : DAY_LABELS

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header row */}
      <div className="grid grid-cols-7 border-b border-border">
        {dayLabels.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 flex-1 min-h-0 divide-x divide-border">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(events, day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isTodayDate = isToday(day)
          const visibleEvents = dayEvents.slice(0, 3)
          const overflowCount = dayEvents.length - visibleEvents.length

          return (
            <div
              key={idx}
              className={cn(
                "flex flex-col gap-0.5 p-1 border-b border-border min-h-[80px] sm:min-h-[100px] cursor-pointer hover:bg-accent/30 transition-colors",
                !isCurrentMonth && "opacity-40"
              )}
              onClick={() => onDayClick(day)}
            >
              <span
                className={cn(
                  "self-start flex size-6 items-center justify-center rounded-full text-xs font-medium",
                  isTodayDate &&
                    "bg-primary text-primary-foreground font-bold"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {visibleEvents.map((event) => (
                  <div key={event.id} onClick={(e) => e.stopPropagation()}>
                    <EventCard
                      event={event}
                      onClick={() => onEventClick(event)}
                      compact
                    />
                  </div>
                ))}
                {overflowCount > 0 && (
                  <span className="text-xs text-muted-foreground px-1">
                    +{overflowCount} more
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
