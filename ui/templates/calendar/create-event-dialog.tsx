"use client"
import { FormEvent, useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "__KITS_ALIAS__/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "__KITS_ALIAS__/sheet"
import { Button } from "__KITS_ALIAS__/button"
import { Input } from "__KITS_ALIAS__/input"
import { Label } from "__KITS_ALIAS__/label"
import { Textarea } from "__KITS_ALIAS__/textarea"
import { Switch } from "__KITS_ALIAS__/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "__KITS_ALIAS__/select"
import { Separator } from "__KITS_ALIAS__/separator"
import { Badge } from "__KITS_ALIAS__/badge"
import { Avatar, AvatarFallback, AvatarImage } from "__KITS_ALIAS__/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "__KITS_ALIAS__/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "__KITS_ALIAS__/command"
import { DateTimePicker } from "./date-time-picker"
import {
  format,
  parseISO,
  addMinutes,
  differenceInMinutes,
  parse,
} from "date-fns"
import {
  FileText,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  Clock,
  Globe,
  Palette,
  MapPin,
  RefreshCw,
  Users,
  Bell,
  ChevronDown,
  X,
  Briefcase,
  Coffee,
  RefreshCcw,
  Cylinder,
  Check,
  UserPlus,
  Plus,
} from "lucide-react"
import type {
  FivFoldCalendarEvent,
  CalendarEventColor,
  FivFoldCalendarAttendee,
  FivFoldCalendarReminder,
} from "./types"

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_OPTIONS: { value: CalendarEventColor; label: string; dot: string }[] = [
  { value: "default", label: "Default",  dot: "bg-primary" },
  { value: "red",     label: "Red",      dot: "bg-red-400" },
  { value: "orange",  label: "Orange",   dot: "bg-orange-400" },
  { value: "yellow",  label: "Yellow",   dot: "bg-yellow-400" },
  { value: "green",   label: "Green",    dot: "bg-green-400" },
  { value: "teal",    label: "Teal",     dot: "bg-teal-400" },
  { value: "blue",    label: "Blue",     dot: "bg-blue-400" },
  { value: "purple",  label: "Purple",   dot: "bg-purple-400" },
  { value: "pink",    label: "Pink",     dot: "bg-pink-400" },
]

const RECURRENCE_LABELS: Record<string, string> = {
  "":          "Does not repeat",
  "daily":     "Daily",
  "weekly":    "Weekly",
  "monthly":   "Monthly",
  "yearly":    "Yearly",
  "weekdays":  "Every weekday (Mon–Fri)",
  "weekends":  "Weekends (Sat–Sun)",
  "biweekly":  "Every 2 weeks",
  "quarterly": "Every 3 months",
}

const RECURRENCE_GROUPS = [
  {
    label: "QUICK PATTERNS",
    options: [
      { value: "daily",   label: "Daily",   subtitle: "Every day",   Icon: CalendarDays },
      { value: "weekly",  label: "Weekly",  subtitle: "Every week",  Icon: CalendarDays },
      { value: "monthly", label: "Monthly", subtitle: "Every month", Icon: CalendarRange },
      { value: "yearly",  label: "Yearly",  subtitle: "Every year",  Icon: CalendarCheck },
    ],
  },
  {
    label: "WORK PATTERNS",
    options: [
      { value: "weekdays", label: "Weekdays", subtitle: "Mon – Fri", Icon: Briefcase },
      { value: "weekends", label: "Weekends", subtitle: "Sat – Sun", Icon: Coffee },
    ],
  },
  {
    label: "CUSTOM INTERVALS",
    options: [
      { value: "biweekly",  label: "Every 2 weeks",  subtitle: "Biweekly",  Icon: RefreshCcw },
      { value: "quarterly", label: "Every 3 months", subtitle: "Quarterly", Icon: Cylinder },
    ],
  },
]

// IANA timezone list — falls back to a curated list if Intl.supportedValuesOf is unavailable
const TIMEZONES: string[] = (() => {
  try {
    // @ts-expect-error — Intl.supportedValuesOf not yet in all TS lib versions
    return Intl.supportedValuesOf("timeZone") as string[]
  } catch {
    return [
      "UTC",
      "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
      "America/Anchorage", "Pacific/Honolulu", "America/Toronto", "America/Vancouver",
      "America/Sao_Paulo", "America/Argentina/Buenos_Aires",
      "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Rome", "Europe/Madrid",
      "Europe/Amsterdam", "Europe/Stockholm", "Europe/Zurich", "Europe/Moscow",
      "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos",
      "Asia/Dubai", "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok",
      "Asia/Singapore", "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul",
      "Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland",
    ]
  }
})()

const getBrowserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return "UTC"
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDatetimeLocal(iso: string): string {
  const d = parseISO(iso)
  return format(d, "yyyy-MM-dd'T'HH:mm")
}

function toDateOnly(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd")
}

function formatDuration(mins: number): string {
  const h = Math.floor(Math.abs(mins) / 60)
  const m = Math.abs(mins) % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h} hour${h !== 1 ? "s" : ""}`
  return `${m} min`
}

function formatReminderLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} before`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m before` : `${h} hour${h !== 1 ? "s" : ""} before`
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDate?: Date
  editEvent?: FivFoldCalendarEvent | null
  onSubmit: (partial: Partial<FivFoldCalendarEvent>) => void
  forceLayout?: "mobile" | "tablet" | "desktop"
  attendeeSuggestions?: FivFoldCalendarAttendee[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateEventDialog({
  open,
  onOpenChange,
  initialDate,
  editEvent,
  onSubmit,
  forceLayout,
  attendeeSuggestions = [],
}: CreateEventDialogProps) {
  const isEdit = !!editEvent

  const defaultStart = initialDate ?? new Date()
  const defaultEnd = addMinutes(defaultStart, 60)

  // ── Core fields ──
  const [title, setTitle] = useState(editEvent?.title ?? "")
  const [description, setDescription] = useState(editEvent?.description ?? "")
  const [isAllDay, setIsAllDay] = useState(editEvent?.isAllDay ?? false)

  // ── Date/time (timed events) — stored as "yyyy-MM-dd'T'HH:mm" ──
  const [startDate, setStartDate] = useState(
    editEvent ? toDatetimeLocal(editEvent.startDate) : format(defaultStart, "yyyy-MM-dd'T'HH:mm")
  )
  const [endDate, setEndDate] = useState(
    editEvent ? toDatetimeLocal(editEvent.endDate) : format(defaultEnd, "yyyy-MM-dd'T'HH:mm")
  )

  // ── Date only (all-day events) — stored as "yyyy-MM-dd" ──
  const [startDateOnly, setStartDateOnly] = useState(
    editEvent ? toDateOnly(editEvent.startDate) : format(defaultStart, "yyyy-MM-dd")
  )
  const [endDateOnly, setEndDateOnly] = useState(
    editEvent ? toDateOnly(editEvent.endDate) : format(defaultStart, "yyyy-MM-dd")
  )

  // ── Other event fields ──
  const [color, setColor] = useState<CalendarEventColor>(editEvent?.color ?? "default")
  const [location, setLocation] = useState(editEvent?.location ?? "")
  const [recurrenceRule, setRecurrenceRule] = useState(editEvent?.recurrenceRule ?? "")
  const [timezone, setTimezone] = useState(editEvent?.timezone ?? getBrowserTimezone())

  // ── Attendees ──
  const [attendees, setAttendees] = useState<FivFoldCalendarAttendee[]>(
    editEvent?.attendees ?? []
  )
  const [attendeeSearch, setAttendeeSearch] = useState("")
  const [attendeePickerOpen, setAttendeePickerOpen] = useState(false)

  // ── Reminders ──
  const [reminders, setReminders] = useState<FivFoldCalendarReminder[]>(
    editEvent?.reminders ?? []
  )
  const [remindersOpen, setRemindersOpen] = useState(false)
  const [customReminderInput, setCustomReminderInput] = useState("")
  const [showCustomReminder, setShowCustomReminder] = useState(false)

  // ── UI section toggles ──
  const [recurrenceOpen, setRecurrenceOpen] = useState(false)
  const [timezoneOpen, setTimezoneOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // ── Responsive layout ──
  useEffect(() => {
    if (forceLayout) {
      setIsMobile(forceLayout === "mobile")
      return
    }
    const mq = window.matchMedia("(max-width: 640px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [forceLayout])

  // ── Reset on open/edit change ──
  useEffect(() => {
    if (open) {
      setTitle(editEvent?.title ?? "")
      setDescription(editEvent?.description ?? "")
      setIsAllDay(editEvent?.isAllDay ?? false)
      setStartDate(editEvent ? toDatetimeLocal(editEvent.startDate) : format(defaultStart, "yyyy-MM-dd'T'HH:mm"))
      setEndDate(editEvent ? toDatetimeLocal(editEvent.endDate) : format(defaultEnd, "yyyy-MM-dd'T'HH:mm"))
      setStartDateOnly(editEvent ? toDateOnly(editEvent.startDate) : format(defaultStart, "yyyy-MM-dd"))
      setEndDateOnly(editEvent ? toDateOnly(editEvent.endDate) : format(defaultStart, "yyyy-MM-dd"))
      setColor(editEvent?.color ?? "default")
      setLocation(editEvent?.location ?? "")
      setRecurrenceRule(editEvent?.recurrenceRule ?? "")
      setTimezone(editEvent?.timezone ?? getBrowserTimezone())
      setAttendees(editEvent?.attendees ?? [])
      setReminders(editEvent?.reminders ?? [])
      setAttendeeSearch("")
      setCustomReminderInput("")
      setShowCustomReminder(false)
      setRecurrenceOpen(false)
      setTimezoneOpen(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editEvent?.id])

  // ── Duration computation ──
  const durationMins = useMemo(() => {
    if (isAllDay) return null
    const start = parse(startDate, "yyyy-MM-dd'T'HH:mm", new Date())
    const end = parse(endDate, "yyyy-MM-dd'T'HH:mm", new Date())
    return differenceInMinutes(end, start)
  }, [startDate, endDate, isAllDay])

  const isValidDuration = durationMins !== null && durationMins > 0

  // ── Quick extend ──
  const handleExtend = (minutes: number) => {
    const end = parse(endDate, "yyyy-MM-dd'T'HH:mm", new Date())
    setEndDate(format(addMinutes(end, minutes), "yyyy-MM-dd'T'HH:mm"))
  }

  // ── Attendees ──
  const filteredSuggestions = attendeeSuggestions.filter(
    (s) =>
      !attendees.some((a) => a.id === s.id) &&
      (s.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(attendeeSearch.toLowerCase()))
  )

  const addAttendeeSuggestion = (s: FivFoldCalendarAttendee) => {
    setAttendees((prev) => [...prev, { ...s, status: "pending" }])
    setAttendeeSearch("")
    setAttendeePickerOpen(false)
  }

  const addEmailAttendee = (email: string) => {
    setAttendees((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: email,
        email,
        initials: email[0].toUpperCase(),
        status: "pending",
      },
    ])
    setAttendeeSearch("")
    setAttendeePickerOpen(false)
  }

  const removeAttendee = (id: string) => {
    setAttendees((prev) => prev.filter((a) => a.id !== id))
  }

  // ── Reminders ──
  const addReminder = (minutes: number) => {
    if (reminders.some((r) => r.minutes === minutes)) return
    setReminders((prev) => [
      ...prev,
      { id: `rem-${Date.now()}`, minutes },
    ])
  }

  const removeReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  const addCustomReminder = () => {
    const mins = parseInt(customReminderInput, 10)
    if (!isNaN(mins) && mins > 0) {
      addReminder(mins)
      setCustomReminderInput("")
      setShowCustomReminder(false)
    }
  }

  // ── Submit ──
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const partial: Partial<FivFoldCalendarEvent> = {
      title: title.trim(),
      description: description.trim() || undefined,
      isAllDay,
      startDate: isAllDay
        ? `${startDateOnly}T00:00:00.000Z`
        : new Date(startDate).toISOString(),
      endDate: isAllDay
        ? `${endDateOnly}T23:59:59.000Z`
        : new Date(endDate).toISOString(),
      color,
      location: location.trim() || undefined,
      recurrenceRule: recurrenceRule || undefined,
      timezone: isAllDay ? undefined : timezone,
      reminders: reminders.length > 0 ? reminders : undefined,
      attendees: attendees.length > 0 ? attendees : undefined,
    }

    onSubmit(partial)
    onOpenChange(false)
  }

  // ── Derived display values ──
  const selectedColorOpt = COLOR_OPTIONS.find((c) => c.value === color) ?? COLOR_OPTIONS[0]

  // ─── Form body ────────────────────────────────────────────────────────────

  const formBody = (
    <form
      id="create-event-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 py-2"
    >
      {/* ── Title ── */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event-title" className="flex items-center gap-1.5">
          <FileText className="size-3.5 text-muted-foreground" />
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="event-title"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </div>

      {/* ── All-day toggle ── */}
      <div className="flex items-center gap-3">
        <Switch id="all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
        <Label htmlFor="all-day" className="flex cursor-pointer items-center gap-1.5">
          <CalendarDays className="size-3.5 text-muted-foreground" />
          All day
        </Label>
      </div>

      {/* ── Date / Time ── */}
      {isAllDay ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Start date</Label>
            <DateTimePicker
              value={startDateOnly}
              onChange={setStartDateOnly}
              showTime={false}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">End date</Label>
            <DateTimePicker
              value={endDateOnly}
              onChange={setEndDateOnly}
              showTime={false}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Start</Label>
              <DateTimePicker value={startDate} onChange={setStartDate} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">End</Label>
              <DateTimePicker value={endDate} onChange={setEndDate} />
            </div>
          </div>

          {/* Duration indicator */}
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {durationMins !== null && durationMins !== 0
                ? `Duration: ${formatDuration(durationMins)}`
                : "Duration: —"}
            </span>
            {isValidDuration ? (
              <Badge variant="outline" className="gap-1 text-xs text-green-600 border-green-600/30 bg-green-500/10">
                <Check className="size-3" />
                Valid
              </Badge>
            ) : durationMins !== null ? (
              <Badge variant="destructive" className="text-xs">
                End before start
              </Badge>
            ) : null}
          </div>

          {/* Quick extend */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">Quick extend:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => handleExtend(30)}
            >
              +30m
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => handleExtend(60)}
            >
              +1h
            </Button>
          </div>
        </div>
      )}

      {/* ── Timezone (hidden for all-day) ── */}
      {!isAllDay && (
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1.5">
            <Globe className="size-3.5 text-muted-foreground" />
            Timezone
          </Label>
          <Popover open={timezoneOpen} onOpenChange={setTimezoneOpen}>
            <PopoverTrigger
              className={cn(
                "flex h-9 w-full items-center justify-start gap-2 rounded-lg border border-input bg-transparent px-3 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <Globe className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-left">{timezone}</span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
              <Command>
                <CommandInput placeholder="Search timezone..." />
                <CommandList className="max-h-48">
                  <CommandEmpty>No timezone found.</CommandEmpty>
                  <CommandGroup>
                    {TIMEZONES.map((tz) => (
                      <CommandItem
                        key={tz}
                        value={tz}
                        onSelect={() => {
                          setTimezone(tz)
                          setTimezoneOpen(false)
                        }}
                        data-checked={tz === timezone}
                      >
                        <span className="flex-1 truncate">{tz}</span>
                        {tz === timezone && <Check className="size-4 text-primary" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Separator />

      {/* ── Color ── */}
      <div className="flex flex-col gap-1.5">
        <Label className="flex items-center gap-1.5">
          <Palette className="size-3.5 text-muted-foreground" />
          Color
        </Label>
        <Select
          value={color}
          onValueChange={(v: string | null) =>
            setColor((v ?? "default") as CalendarEventColor)
          }
        >
          <SelectTrigger className="w-full">
            <div className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "size-3 shrink-0 rounded-full",
                  selectedColorOpt.dot
                )}
              />
              <span>{selectedColorOpt.label}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {COLOR_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div className="flex items-center gap-2">
                  <span className={cn("size-3 rounded-full", opt.dot)} />
                  {opt.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Location ── */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event-location" className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-muted-foreground" />
          Location
        </Label>
        <Input
          id="event-location"
          placeholder="Add location or meeting link"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* ── Repeat (expandable) ── */}
      <div className="flex flex-col gap-0 overflow-hidden rounded-lg border border-border">
        <button
          type="button"
          className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
          onClick={() => setRecurrenceOpen((v) => !v)}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted">
              <RefreshCw className="size-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Repeat</div>
              <div className="text-xs text-muted-foreground">
                {RECURRENCE_LABELS[recurrenceRule] ?? "Set recurring schedule"}
              </div>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              recurrenceOpen && "rotate-180"
            )}
          />
        </button>

        {recurrenceOpen && (
          <div className="border-t border-border p-3">
            {/* "Does not repeat" option */}
            <button
              type="button"
              onClick={() => { setRecurrenceRule(""); setRecurrenceOpen(false) }}
              className={cn(
                "mb-3 w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                recurrenceRule === ""
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:bg-accent"
              )}
            >
              Does not repeat
            </button>

            {RECURRENCE_GROUPS.map((group) => (
              <div key={group.label} className="mb-3">
                <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {group.options.map(({ value, label, subtitle, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => { setRecurrenceRule(value); setRecurrenceOpen(false) }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        recurrenceRule === value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-accent"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-xs">{label}</div>
                        <div className="truncate text-[10px] text-muted-foreground">{subtitle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Attendees ── */}
      <div className="flex flex-col gap-2">
        <Label className="flex items-center gap-1.5">
          <Users className="size-3.5 text-muted-foreground" />
          Attendees
        </Label>

        {/* Selected attendee badges */}
        {attendees.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {attendees.map((a) => (
              <Badge
                key={a.id}
                variant="secondary"
                className="flex items-center gap-1.5 pr-1 pl-1"
              >
                <Avatar className="size-4">
                  {a.avatar && <AvatarImage src={a.avatar} alt={a.name} />}
                  <AvatarFallback className="text-[8px]">{a.initials}</AvatarFallback>
                </Avatar>
                <span className="max-w-[120px] truncate text-xs">{a.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttendee(a.id)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Attendee search popover */}
        <Popover open={attendeePickerOpen} onOpenChange={setAttendeePickerOpen}>
          <PopoverTrigger
            className={cn(
              "flex h-9 w-full items-center justify-start gap-2 rounded-lg border border-input bg-transparent px-3 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground"
            )}
          >
            <UserPlus className="size-4 shrink-0" />
            <span>Add attendees...</span>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search by name or email..."
                value={attendeeSearch}
                onValueChange={setAttendeeSearch}
              />
              <CommandList>
                <CommandEmpty>
                  {isValidEmail(attendeeSearch) ? (
                    <button
                      type="button"
                      onClick={() => addEmailAttendee(attendeeSearch)}
                      className="w-full px-4 py-2 text-sm hover:bg-accent text-left flex items-center gap-2"
                    >
                      <Plus className="size-4" />
                      Add &quot;{attendeeSearch}&quot;
                    </button>
                  ) : (
                    <span className="text-muted-foreground">
                      {attendeeSearch ? "No results. Enter a valid email to add directly." : "Type to search attendees."}
                    </span>
                  )}
                </CommandEmpty>
                {filteredSuggestions.length > 0 && (
                  <CommandGroup heading="Suggestions">
                    {filteredSuggestions.map((s) => (
                      <CommandItem
                        key={s.id}
                        value={`${s.name} ${s.email}`}
                        onSelect={() => addAttendeeSuggestion(s)}
                      >
                        <Avatar className="size-6 shrink-0">
                          {s.avatar && <AvatarImage src={s.avatar} alt={s.name} />}
                          <AvatarFallback className="text-[10px]">
                            {s.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm">{s.name}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {s.email}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* ── Notifications / Reminders ── */}
      <div className="flex flex-col gap-0 overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between p-3">
          <button
            type="button"
            className="flex flex-1 items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={() => setRemindersOpen((v) => !v)}
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-muted">
              <Bell className="size-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Notifications</div>
              <div className="text-xs text-muted-foreground">Set event reminders</div>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setRemindersOpen(true); setShowCustomReminder(true) }}
              className="text-xs text-primary hover:underline font-medium"
            >
              + Add
            </button>
            <button
              type="button"
              onClick={() => setRemindersOpen((v) => !v)}
              className="p-1"
            >
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform duration-200",
                  remindersOpen && "rotate-180"
                )}
              />
            </button>
          </div>
        </div>

        {remindersOpen && (
          <div className="flex flex-col gap-3 border-t border-border p-3">
            {/* Reminder list */}
            {reminders.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/40 px-4 py-5 text-center">
                <Bell className="size-6 text-muted-foreground/60" />
                <div className="text-sm font-medium">No reminders set</div>
                <div className="text-xs text-muted-foreground">
                  Get notified before your event starts
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {reminders
                  .slice()
                  .sort((a, b) => a.minutes - b.minutes)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-muted-foreground" />
                        <span className="text-sm">{formatReminderLabel(r.minutes)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeReminder(r.id)}
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Quick add */}
            <div>
              <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground">
                QUICK ADD
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => addReminder(15)}
                  disabled={reminders.some((r) => r.minutes === 15)}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Clock className="size-4 text-blue-500" />
                  15 minutes
                </button>
                <button
                  type="button"
                  onClick={() => addReminder(60)}
                  disabled={reminders.some((r) => r.minutes === 60)}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Clock className="size-4 text-green-500" />
                  1 hour
                </button>
              </div>
            </div>

            {/* Custom reminder input */}
            {showCustomReminder ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  placeholder="Minutes before"
                  value={customReminderInput}
                  onChange={(e) => setCustomReminderInput(e.target.value)}
                  className="h-8 flex-1"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomReminder() } }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="h-8"
                  onClick={addCustomReminder}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => { setShowCustomReminder(false); setCustomReminderInput("") }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomReminder(true)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="size-3.5" />
                Custom reminder
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Description ── */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event-description" className="flex items-center gap-1.5">
          <FileText className="size-3.5 text-muted-foreground" />
          Description
        </Label>
        <Textarea
          id="event-description"
          placeholder="Add description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>
    </form>
  )

  // ─── Footer ───────────────────────────────────────────────────────────────

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button type="submit" form="create-event-form" disabled={!title.trim() || (!isAllDay && !isValidDuration)}>
        {isEdit ? "Save changes" : "Create event"}
      </Button>
    </div>
  )

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[92vh] overflow-auto rounded-t-xl">
          <SheetHeader>
            <SheetTitle>{isEdit ? "Edit event" : "New event"}</SheetTitle>
          </SheetHeader>
          <div className="overflow-auto py-2 px-1">{formBody}</div>
          <SheetFooter>{footer}</SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit event" : "New event"}</DialogTitle>
        </DialogHeader>
        {formBody}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
