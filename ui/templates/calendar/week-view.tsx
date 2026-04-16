"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  startOfWeek,
  addDays,
  format,
  parseISO,
  isToday,
  isSameDay,
  differenceInMinutes,
  startOfDay,
  getHours,
  getMinutes,
} from "date-fns"
import { EVENT_COLOR_CLASSES, EVENT_DOT_CLASSES } from "./event-card"
import type { FivFoldCalendarEvent } from "./types"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT_PX = 60

function getEventStyle(event: FivFoldCalendarEvent) {
  const start = parseISO(event.startDate)
  const end = parseISO(event.endDate)
  const dayStart = startOfDay(start)
  const topMinutes = differenceInMinutes(start, dayStart)
  const durationMinutes = Math.max(differenceInMinutes(end, start), 30)
  const top = (topMinutes / 60) * HOUR_HEIGHT_PX
  const height = (durationMinutes / 60) * HOUR_HEIGHT_PX
  return { top, height }
}

function getEventsForDay(events: FivFoldCalendarEvent[], day: Date) {
  return events.filter((e) => isSameDay(parseISO(e.startDate), day))
}

function getAllDayEventsForDay(events: FivFoldCalendarEvent[], day: Date) {
  return events.filter((e) => e.isAllDay && isSameDay(parseISO(e.startDate), day))
}

interface WeekViewProps {
  currentDate: Date
  events: FivFoldCalendarEvent[]
  onEventClick: (event: FivFoldCalendarEvent) => void
  onSlotClick: (date: Date, hour: number) => void
  weekStartsOn?: 0 | 1
}

export function WeekView({
  currentDate,
  events,
  onEventClick,
  onSlotClick,
  weekStartsOn = 0,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Scroll to 7am on mount
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 7 * HOUR_HEIGHT_PX
    }
  }, [])

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Day headers */}
      <div className="grid border-b border-border" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
        <div className="border-r border-border" />
        {days.map((day, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center py-2 border-r border-border last:border-r-0"
          >
            <span className="text-xs text-muted-foreground uppercase">
              {format(day, "EEE")}
            </span>
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-sm font-medium mt-0.5",
                isToday(day) && "bg-primary text-primary-foreground"
              )}
            >
              {format(day, "d")}
            </span>
          </div>
        ))}
      </div>

      {/* All-day row */}
      {days.some((d) => getAllDayEventsForDay(events, d).length > 0) && (
        <div className="grid border-b border-border" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
          <div className="flex items-center justify-end pr-2 py-1 border-r border-border">
            <span className="text-[10px] text-muted-foreground">All day</span>
          </div>
          {days.map((day, idx) => {
            const allDay = getAllDayEventsForDay(events, day)
            return (
              <div key={idx} className="flex flex-col gap-0.5 p-0.5 border-r border-border last:border-r-0 min-h-[28px]">
                {allDay.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => onEventClick(e)}
                    className={cn(
                      "w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium border",
                      EVENT_COLOR_CLASSES[e.color ?? "default"]
                    )}
                  >
                    {e.title}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* Scrollable time grid */}
      <div className="flex-1 min-h-0 overflow-auto" ref={scrollRef}>
        <div className="grid relative" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
          {/* Hour labels */}
          <div className="flex flex-col">
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

          {/* Day columns */}
          {days.map((day, dayIdx) => {
            const dayEvents = getEventsForDay(events, day).filter((e) => !e.isAllDay)
            return (
              <div
                key={dayIdx}
                className="relative border-r border-border last:border-r-0"
                style={{ height: HOURS.length * HOUR_HEIGHT_PX }}
              >
                {/* Hour slot lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full border-b border-border/50 cursor-pointer hover:bg-accent/20"
                    style={{ top: hour * HOUR_HEIGHT_PX, height: HOUR_HEIGHT_PX }}
                    onClick={() => onSlotClick(day, hour)}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const { top, height } = getEventStyle(event)
                  const colorCls = EVENT_COLOR_CLASSES[event.color ?? "default"]
                  const dotCls = EVENT_DOT_CLASSES[event.color ?? "default"]
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={cn(
                        "absolute left-0.5 right-0.5 overflow-hidden rounded border px-1.5 py-0.5 text-left text-xs font-medium hover:opacity-80 transition-opacity",
                        colorCls
                      )}
                      style={{ top, height: Math.max(height, 22), zIndex: 1 }}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span className={cn("size-1.5 shrink-0 rounded-full", dotCls)} />
                        <span className="truncate">{event.title}</span>
                      </div>
                      {height > 40 && (
                        <div className="text-[10px] opacity-70 truncate pl-3">
                          {format(parseISO(event.startDate), "h:mm a")}
                        </div>
                      )}
                    </button>
                  )
                })}

                {/* Current time indicator */}
                {isToday(day) && (() => {
                  const now = new Date()
                  const top = (getHours(now) * 60 + getMinutes(now)) / 60 * HOUR_HEIGHT_PX
                  return (
                    <div
                      className="absolute left-0 right-0 z-10 flex items-center"
                      style={{ top }}
                    >
                      <span className="size-2 shrink-0 rounded-full bg-primary" />
                      <span className="flex-1 h-px bg-primary" />
                    </div>
                  )
                })()}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
