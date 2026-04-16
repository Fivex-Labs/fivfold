"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "__KITS_ALIAS__/button"
import { Tabs, TabsList, TabsTrigger } from "__KITS_ALIAS__/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "__KITS_ALIAS__/dropdown-menu"
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { CalendarView } from "./types"

interface CalendarHeaderProps {
  currentDate: Date
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onCreateEvent: () => void
  showTodayButton: boolean
  showViewSwitcher: boolean
  className?: string
}

function getHeaderTitle(date: Date, view: CalendarView): string {
  if (view === "month") return format(date, "MMMM yyyy")
  if (view === "week") {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay())
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`
    }
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`
  }
  if (view === "day") return format(date, "EEEE, MMMM d, yyyy")
  return format(date, "MMMM yyyy")
}

const VIEW_LABELS: Record<CalendarView, string> = {
  month: "Month",
  week: "Week",
  day: "Day",
  agenda: "Agenda",
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onCreateEvent,
  showTodayButton,
  showViewSwitcher,
  className,
}: CalendarHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {/* Navigation */}
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={onPrev} className="size-8">
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous</span>
        </Button>
        {showTodayButton && (
          <Button variant="outline" size="sm" onClick={onToday} className="h-8 px-3 text-xs">
            Today
          </Button>
        )}
        <Button variant="outline" size="icon" onClick={onNext} className="size-8">
          <ChevronRight className="size-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      {/* Title */}
      <h2 className="flex-1 min-w-0 truncate font-semibold text-base sm:text-lg">
        {getHeaderTitle(currentDate, view)}
      </h2>

      {/* View switcher — tabs on md+, dropdown on mobile */}
      {showViewSwitcher && (
        <>
          <Tabs
            value={view}
            onValueChange={(v) => onViewChange(v as CalendarView)}
            className="hidden md:block"
          >
            <TabsList className="h-8">
              {(["month", "week", "day", "agenda"] as CalendarView[]).map((v) => (
                <TabsTrigger key={v} value={v} className="text-xs px-3 h-6">
                  {VIEW_LABELS[v]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden h-8 gap-1 px-3 text-xs">
                {VIEW_LABELS[view]}
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(["month", "week", "day", "agenda"] as CalendarView[]).map((v) => (
                <DropdownMenuItem key={v} onClick={() => onViewChange(v)}>
                  {VIEW_LABELS[v]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      {/* Create event */}
      <Button size="sm" onClick={onCreateEvent} className="h-8 gap-1 px-3">
        <Plus className="size-4" />
        <span className="hidden sm:inline">New event</span>
      </Button>
    </div>
  )
}
