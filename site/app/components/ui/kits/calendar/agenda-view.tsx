"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isThisWeek,
  startOfDay,
  addDays,
  eachDayOfInterval,
} from "date-fns"
import { CalendarDays } from "lucide-react"
import { EventCard } from "./event-card"
import type { FivFoldCalendarEvent } from "./types"

function getDayLabel(date: Date): string {
  if (isToday(date)) return "Today"
  if (isTomorrow(date)) return "Tomorrow"
  if (isThisWeek(date)) return format(date, "EEEE")
  return format(date, "EEEE, MMMM d")
}

function getEventsForDay(events: FivFoldCalendarEvent[], day: Date): FivFoldCalendarEvent[] {
  const dayStart = startOfDay(day)
  const dayEnd = addDays(dayStart, 1)
  return events
    .filter((e) => {
      const start = parseISO(e.startDate)
      const end = parseISO(e.endDate)
      return start < dayEnd && end > dayStart
    })
    .sort((a, b) => {
      if (a.isAllDay && !b.isAllDay) return -1
      if (!a.isAllDay && b.isAllDay) return 1
      return parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
    })
}

interface AgendaViewProps {
  currentDate: Date
  events: FivFoldCalendarEvent[]
  onEventClick: (event: FivFoldCalendarEvent) => void
  /** How many days ahead to show. Default 30. */
  daysAhead?: number
}

export function AgendaView({
  currentDate,
  events,
  onEventClick,
  daysAhead = 30,
}: AgendaViewProps) {
  const days = eachDayOfInterval({
    start: startOfDay(currentDate),
    end: addDays(startOfDay(currentDate), daysAhead),
  })

  const daysWithEvents = days.filter((d) => getEventsForDay(events, d).length > 0)

  if (daysWithEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <CalendarDays className="size-10 opacity-40" />
        <p className="text-sm">No upcoming events in the next {daysAhead} days</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-0 py-2">
        {daysWithEvents.map((day, idx) => {
          const dayEvents = getEventsForDay(events, day)
          return (
            <div key={idx}>
              <div className="flex items-baseline gap-3 px-4 py-3 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isToday(day) ? "text-primary" : "text-foreground"
                  )}
                >
                  {getDayLabel(day)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(day, isToday(day) ? "MMMM d" : "yyyy")}
                </span>
              </div>
              <div className="flex flex-col gap-2 px-4 pb-4">
                {dayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                    compact={false}
                  />
                ))}
              </div>
              {idx < daysWithEvents.length - 1 && (
                <Separator className="mx-4 my-0" />
              )}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
