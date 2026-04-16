"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: String(i),
  label:
    i === 0 ? "12 AM"
    : i < 12 ? `${i} AM`
    : i === 12 ? "12 PM"
    : `${i - 12} PM`,
}))

const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map(
  (m) => ({ value: m, label: m })
)

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

interface DateTimePickerProps {
  /** "yyyy-MM-dd'T'HH:mm" when showTime=true, "yyyy-MM-dd" when showTime=false */
  value: string
  onChange: (v: string) => void
  /** Show the time row (hours + minutes). Default true. */
  showTime?: boolean
  disabled?: boolean
  placeholder?: string
}

export function DateTimePicker({
  value,
  onChange,
  showTime = true,
  disabled = false,
  placeholder,
}: DateTimePickerProps) {
  const fmt = showTime ? "yyyy-MM-dd'T'HH:mm" : "yyyy-MM-dd"
  const displayFmt = showTime ? "EEE, MMM d · hh:mm a" : "EEE, MMM d, yyyy"
  const fallback = placeholder ?? (showTime ? "Pick date & time" : "Pick date")

  const parsed = value
    ? parse(value, fmt, new Date())
    : new Date()

  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(value ? parse(value, fmt, new Date()) : new Date())
  )

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 }),
  })

  const currentHour = String(getHours(parsed))
  const rawMinute = getMinutes(parsed)
  const roundedMinute = String(Math.min(55, Math.round(rawMinute / 5) * 5)).padStart(2, "0")

  const handleDayClick = (day: Date) => {
    if (showTime) {
      const updated = setMinutes(setHours(day, getHours(parsed)), rawMinute)
      onChange(format(updated, fmt))
    } else {
      onChange(format(day, fmt))
    }
  }

  const handleHourChange = (h: string | null) => {
    const updated = setHours(parsed, parseInt(h ?? "0", 10))
    onChange(format(updated, fmt))
  }

  const handleMinuteChange = (m: string | null) => {
    const updated = setMinutes(parsed, parseInt(m ?? "0", 10))
    onChange(format(updated, fmt))
  }

  const displayLabel = value ? format(parsed, displayFmt) : fallback

  return (
    <Popover>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-start gap-2 rounded-lg border border-input bg-transparent px-3 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          !value && "text-muted-foreground",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className={cn(!value && "text-muted-foreground")}>{displayLabel}</span>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3" align="start">
        {/* Month navigation */}
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMonth((m) => subMonths(m, 1))}
            className="flex size-7 items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm font-medium">{format(viewMonth, "MMMM yyyy")}</span>
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            className="flex size-7 items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-1 grid grid-cols-7">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="py-1 text-center text-xs text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, idx) => {
            const isSelected = value ? isSameDay(day, parsed) : false
            const isCurrentMonth = isSameMonth(day, viewMonth)
            const isTodayDate = isToday(day)
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDayClick(day)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs transition-colors",
                  !isCurrentMonth && "opacity-30",
                  isSelected && "bg-primary text-primary-foreground font-medium",
                  !isSelected && isTodayDate && "border border-primary text-primary",
                  !isSelected && "hover:bg-accent",
                )}
              >
                {format(day, "d")}
              </button>
            )
          })}
        </div>

        {/* Time row */}
        {showTime && (
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <Select
              value={currentHour}
              onValueChange={(v: string | null) => handleHourChange(v)}
            >
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-52">
                {HOURS.map((h) => (
                  <SelectItem key={h.value} value={h.value}>
                    {h.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="font-medium text-muted-foreground">:</span>
            <Select
              value={roundedMinute}
              onValueChange={(v: string | null) => handleMinuteChange(v)}
            >
              <SelectTrigger className="h-8 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MINUTES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
