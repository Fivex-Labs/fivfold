"use client"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import {
  format,
  parseISO,
  isSameDay,
  startOfDay,
  differenceInMinutes,
  getHours,
  getMinutes,
} from "date-fns"
import { EVENT_COLOR_CLASSES, EVENT_DOT_CLASSES } from "./event-card"
import type { FivFoldCalendarEvent } from "./types"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT_PX = 64

function getEventStyle(event: FivFoldCalendarEvent) {
  const start = parseISO(event.startDate)
  const end = parseISO(event.endDate)
  const dayStart = startOfDay(start)
  const topMinutes = differenceInMinutes(start, dayStart)
  const durationMinutes = Math.max(differenceInMinutes(end, start), 30)
  return {
    top: (topMinutes / 60) * HOUR_HEIGHT_PX,
    height: (durationMinutes / 60) * HOUR_HEIGHT_PX,
  }
}

interface DayViewProps {
  currentDate: Date
  events: FivFoldCalendarEvent[]
  onEventClick: (event: FivFoldCalendarEvent) => void
  onSlotClick: (date: Date, hour: number) => void
}

export function DayView({ currentDate, events, onEventClick, onSlotClick }: DayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 7 * HOUR_HEIGHT_PX
    }
  }, [])

  const allDayEvents = events.filter(
    (e) => e.isAllDay && isSameDay(parseISO(e.startDate), currentDate)
  )
  const timedEvents = events.filter(
    (e) => !e.isAllDay && isSameDay(parseISO(e.startDate), currentDate)
  )

  const now = new Date()
  const isCurrentDay = isSameDay(currentDate, now)
  const nowTop = isCurrentDay
    ? (getHours(now) * 60 + getMinutes(now)) / 60 * HOUR_HEIGHT_PX
    : null

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase">
            {format(currentDate, "EEEE")}
          </span>
          <span className="text-2xl font-bold">{format(currentDate, "d")}</span>
        </div>
        <span className="text-sm text-muted-foreground">{format(currentDate, "MMMM yyyy")}</span>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="flex flex-col gap-1 border-b border-border px-4 py-2">
          <span className="text-[10px] text-muted-foreground mb-1">All day</span>
          {allDayEvents.map((e) => (
            <button
              key={e.id}
              onClick={() => onEventClick(e)}
              className={cn(
                "w-full truncate rounded border px-2 py-1 text-left text-xs font-medium hover:opacity-80",
                EVENT_COLOR_CLASSES[e.color ?? "default"]
              )}
            >
              {e.title}
            </button>
          ))}
        </div>
      )}

      {/* Scrollable time grid */}
      <div className="flex-1 min-h-0 overflow-auto" ref={scrollRef}>
        <div className="flex relative" style={{ minHeight: HOURS.length * HOUR_HEIGHT_PX }}>
          {/* Hour labels */}
          <div className="flex flex-col w-14 shrink-0">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex items-start justify-end pr-2 text-[10px] text-muted-foreground border-r border-border"
                style={{ height: HOUR_HEIGHT_PX }}
              >
                <span className="-mt-2">
                  {hour === 0 ? "" : format(new Date().setHours(hour, 0, 0, 0), "h a")}
                </span>
              </div>
            ))}
          </div>

          {/* Events column */}
          <div className="relative flex-1" style={{ height: HOURS.length * HOUR_HEIGHT_PX }}>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute w-full border-b border-border/50 cursor-pointer hover:bg-accent/20"
                style={{ top: hour * HOUR_HEIGHT_PX, height: HOUR_HEIGHT_PX }}
                onClick={() => onSlotClick(currentDate, hour)}
              />
            ))}

            {timedEvents.map((event) => {
              const { top, height } = getEventStyle(event)
              const colorCls = EVENT_COLOR_CLASSES[event.color ?? "default"]
              const dotCls = EVENT_DOT_CLASSES[event.color ?? "default"]
              return (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    "absolute left-1 right-4 rounded border px-2 py-1 text-left hover:opacity-80 transition-opacity overflow-hidden",
                    colorCls
                  )}
                  style={{ top, height: Math.max(height, 28), zIndex: 1 }}
                >
                  <div className="flex items-center gap-1.5 text-sm font-medium truncate">
                    <span className={cn("size-2 shrink-0 rounded-full", dotCls)} />
                    <span className="truncate">{event.title}</span>
                  </div>
                  <div className="text-xs opacity-70 pl-3.5">
                    {format(parseISO(event.startDate), "h:mm a")} –{" "}
                    {format(parseISO(event.endDate), "h:mm a")}
                  </div>
                </button>
              )
            })}

            {/* Current time indicator */}
            {nowTop !== null && (
              <div
                className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                style={{ top: nowTop }}
              >
                <span className="size-2.5 shrink-0 rounded-full bg-primary" />
                <span className="flex-1 h-px bg-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
