"use client"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { CalendarHeader } from "./calendar-header"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { DayView } from "./day-view"
import { AgendaView } from "./agenda-view"
import { EventDetailDialog } from "./event-detail-dialog"
import { CreateEventDialog } from "./create-event-dialog"
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  parseISO,
} from "date-fns"
import type { FivFoldCalendarEvent, CalendarKitProps, CalendarView } from "./types"

export type {
  CalendarView,
  CalendarEventColor,
  FivFoldCalendarAttendee,
  FivFoldCalendarEvent,
  CalendarKitProps,
} from "./types"

export function CalendarKit({
  className,
  events: initialEvents = [],
  onEventsChange,
  onEventClick,
  onCreateEvent,
  onDeleteEvent,
  forceLayout,
  defaultView = "month",
  defaultDate,
  showTodayButton = true,
  showViewSwitcher = true,
  showAttendees = true,
  showLocation = true,
  weekStartsOn = 0,
  attendeeSuggestions = [],
}: CalendarKitProps) {
  const [events, setEvents] = useState<FivFoldCalendarEvent[]>(initialEvents)
  const [view, setView] = useState<CalendarView>(defaultView)
  const [currentDate, setCurrentDate] = useState<Date>(
    defaultDate ? parseISO(defaultDate) : new Date()
  )

  // Detail dialog state
  const [detailEvent, setDetailEvent] = useState<FivFoldCalendarEvent | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Create/edit dialog state
  const [createOpen, setCreateOpen] = useState(false)
  const [createInitialDate, setCreateInitialDate] = useState<Date | undefined>(undefined)
  const [editEvent, setEditEvent] = useState<FivFoldCalendarEvent | null>(null)

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])

  // ---------- Navigation ----------
  const handlePrev = () => {
    setCurrentDate((d) => {
      if (view === "month") return subMonths(d, 1)
      if (view === "week") return subWeeks(d, 1)
      if (view === "day") return subDays(d, 1)
      return subMonths(d, 1) // agenda
    })
  }

  const handleNext = () => {
    setCurrentDate((d) => {
      if (view === "month") return addMonths(d, 1)
      if (view === "week") return addWeeks(d, 1)
      if (view === "day") return addDays(d, 1)
      return addMonths(d, 1) // agenda
    })
  }

  const handleToday = () => setCurrentDate(new Date())

  // ---------- Event interactions ----------
  const handleEventClick = (event: FivFoldCalendarEvent) => {
    if (onEventClick) {
      onEventClick(event)
      return
    }
    setDetailEvent(event)
    setDetailOpen(true)
  }

  const handleOpenCreate = (partial?: { date?: Date; hour?: number }) => {
    const date = partial?.date ? new Date(partial.date) : new Date()
    if (partial?.hour !== undefined) date.setHours(partial.hour, 0, 0, 0)
    setCreateInitialDate(date)
    setEditEvent(null)
    setCreateOpen(true)
  }

  const handleEditEvent = (event: FivFoldCalendarEvent) => {
    setEditEvent(event)
    setCreateOpen(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (onDeleteEvent) {
      onDeleteEvent(eventId)
      return
    }
    const updated = events.filter((e) => e.id !== eventId)
    setEvents(updated)
    onEventsChange?.(updated)
  }

  const handleCreateSubmit = (partial: Partial<FivFoldCalendarEvent>) => {
    if (onCreateEvent) {
      onCreateEvent(partial)
      return
    }

    if (editEvent) {
      const updated = events.map((e) =>
        e.id === editEvent.id
          ? { ...e, ...partial, updatedAt: new Date().toISOString() }
          : e
      )
      setEvents(updated)
      onEventsChange?.(updated)
    } else {
      const newEvent: FivFoldCalendarEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: partial.title ?? "Untitled",
        description: partial.description,
        startDate: partial.startDate ?? new Date().toISOString(),
        endDate: partial.endDate ?? new Date().toISOString(),
        isAllDay: partial.isAllDay ?? false,
        color: partial.color ?? "default",
        location: partial.location,
        recurrenceRule: partial.recurrenceRule,
        attendees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const updated = [...events, newEvent]
      setEvents(updated)
      onEventsChange?.(updated)
    }
  }

  // ---------- Day / slot click ----------
  const handleDayClick = (date: Date) => {
    setCurrentDate(date)
    setView("day")
  }

  const handleSlotClick = (date: Date, hour: number) => {
    handleOpenCreate({ date, hour })
  }

  return (
    <div className={cn("flex flex-col h-full min-h-[500px] gap-3", className)}>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onCreateEvent={() => handleOpenCreate()}
        showTodayButton={showTodayButton}
        showViewSwitcher={showViewSwitcher}
      />

      <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-border bg-card">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onDayClick={handleDayClick}
            weekStartsOn={weekStartsOn}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
            weekStartsOn={weekStartsOn}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
          />
        )}
        {view === "agenda" && (
          <AgendaView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      <EventDetailDialog
        event={detailEvent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        showAttendees={showAttendees}
        showLocation={showLocation}
        forceLayout={forceLayout}
      />

      <CreateEventDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initialDate={createInitialDate}
        editEvent={editEvent}
        onSubmit={handleCreateSubmit}
        forceLayout={forceLayout}
        attendeeSuggestions={attendeeSuggestions}
      />
    </div>
  )
}
