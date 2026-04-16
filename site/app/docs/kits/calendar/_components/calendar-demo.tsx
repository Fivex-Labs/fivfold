"use client"

import { useState } from "react"
import { Sun, Moon, Maximize2, ChevronDown } from "lucide-react"
import { CalendarKit } from "@/components/ui/kits/calendar/index"
import type { FivFoldCalendarAttendee, FivFoldCalendarEvent } from "@/components/ui/kits/calendar/types"
import {
  mergeThemeVars,
  BASE_COLOR_OPTIONS,
  COLOR_THEME_OPTIONS,
} from "../_data/shadcn-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DevicePreview } from "./device-preview"

const SHADCN_FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const today = new Date()
const iso = (d: Date) => d.toISOString()

function setTime(d: Date, h: number, m = 0) {
  const r = new Date(d)
  r.setHours(h, m, 0, 0)
  return r
}

function addDaysTo(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

const MOCK_ATTENDEE_SUGGESTIONS: FivFoldCalendarAttendee[] = [
  { id: "u1", name: "Alice Chen",    email: "alice@example.com",  initials: "AC", avatar: "https://i.pravatar.cc/40?img=1",  status: "accepted" },
  { id: "u2", name: "Bob Ray",       email: "bob@example.com",    initials: "BR", avatar: "https://i.pravatar.cc/40?img=2",  status: "pending" },
  { id: "u3", name: "Carol Wu",      email: "carol@example.com",  initials: "CW", avatar: "https://i.pravatar.cc/40?img=3",  status: "pending" },
  { id: "u4", name: "David Kim",     email: "david@example.com",  initials: "DK", avatar: "https://i.pravatar.cc/40?img=4",  status: "pending" },
  { id: "u5", name: "Eva Martinez",  email: "eva@example.com",    initials: "EM", avatar: "https://i.pravatar.cc/40?img=5",  status: "pending" },
  { id: "u6", name: "Frank Osei",    email: "frank@example.com",  initials: "FO", avatar: "https://i.pravatar.cc/40?img=6",  status: "pending" },
  { id: "u7", name: "Grace Tanaka",  email: "grace@example.com",  initials: "GT", avatar: "https://i.pravatar.cc/40?img=7",  status: "pending" },
  { id: "u8", name: "Hana Patel",    email: "hana@example.com",   initials: "HP", avatar: "https://i.pravatar.cc/40?img=8",  status: "pending" },
]

const MOCK_EVENTS: FivFoldCalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    description: "Daily sync with the engineering team.",
    startDate: iso(setTime(today, 9, 30)),
    endDate: iso(setTime(today, 10, 0)),
    isAllDay: false,
    color: "blue",
    location: "Zoom",
    attendees: [
      { id: "a1", name: "Alice Chen", email: "alice@example.com", initials: "AC", status: "accepted" },
      { id: "a2", name: "Bob Ray", email: "bob@example.com", initials: "BR", status: "accepted" },
    ],
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "2",
    title: "Design Review",
    startDate: iso(setTime(today, 14, 0)),
    endDate: iso(setTime(today, 15, 0)),
    isAllDay: false,
    color: "purple",
    location: "Conference Room A",
    attendees: [
      { id: "a1", name: "Alice Chen", email: "alice@example.com", initials: "AC", status: "accepted" },
      { id: "a3", name: "Carol Wu", email: "carol@example.com", initials: "CW", status: "pending" },
    ],
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "3",
    title: "Q2 Planning",
    startDate: iso(setTime(addDaysTo(today, 1), 10, 0)),
    endDate: iso(setTime(addDaysTo(today, 1), 12, 0)),
    isAllDay: false,
    color: "green",
    description: "Quarterly planning session with leadership.",
    location: "Board Room",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "4",
    title: "Sprint Launch",
    startDate: iso(setTime(addDaysTo(today, 2), 0, 0)),
    endDate: iso(setTime(addDaysTo(today, 2), 23, 59)),
    isAllDay: true,
    color: "orange",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "5",
    title: "1:1 with Manager",
    startDate: iso(setTime(addDaysTo(today, 3), 11, 0)),
    endDate: iso(setTime(addDaysTo(today, 3), 11, 30)),
    isAllDay: false,
    color: "teal",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "6",
    title: "Product Demo",
    startDate: iso(setTime(addDaysTo(today, 4), 15, 0)),
    endDate: iso(setTime(addDaysTo(today, 4), 16, 0)),
    isAllDay: false,
    color: "pink",
    description: "Live product demo for stakeholders.",
    attendees: [
      { id: "a4", name: "David Kim", email: "david@example.com", initials: "DK", status: "accepted" },
    ],
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "7",
    title: "Company All-Hands",
    startDate: iso(setTime(addDaysTo(today, 5), 0, 0)),
    endDate: iso(setTime(addDaysTo(today, 5), 23, 59)),
    isAllDay: true,
    color: "red",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "8",
    title: "Code Review",
    startDate: iso(setTime(addDaysTo(today, -1), 13, 0)),
    endDate: iso(setTime(addDaysTo(today, -1), 14, 0)),
    isAllDay: false,
    color: "yellow",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
]

export function CalendarDemo() {
  const [mode, setMode] = useState<"light" | "dark">("dark")
  const [baseColor, setBaseColor] = useState("neutral")
  const [colorTheme, setColorTheme] = useState("default")
  const [previewOpen, setPreviewOpen] = useState(false)

  const themeVars = mergeThemeVars(baseColor, colorTheme, mode)
  const styleObj = {
    ...themeVars,
    fontFamily: SHADCN_FONT,
  } as React.CSSProperties

  const calendarKitProps = {
    events: MOCK_EVENTS,
    attendeeSuggestions: MOCK_ATTENDEE_SUGGESTIONS,
    defaultView: "month" as const,
    showTodayButton: true,
    showViewSwitcher: true,
    showAttendees: true,
    showLocation: true,
  }

  return (
    <div className="space-y-4">
      {/* Theme controls */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          {mode === "light" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                Base: {BASE_COLOR_OPTIONS.find((o) => o.id === baseColor)?.label ?? baseColor}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            {BASE_COLOR_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => setBaseColor(opt.id)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                Color: {COLOR_THEME_OPTIONS.find((o) => o.id === colorTheme)?.label ?? colorTheme}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            {COLOR_THEME_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => setColorTheme(opt.id)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPreviewOpen(true)}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Maximize2 className="h-4 w-4" />
          <span className="ml-2">Open Device Simulation</span>
        </Button>
      </div>

      {/* Demo container */}
      <div
        className={mode === "dark" ? "dark" : ""}
        style={styleObj}
      >
        <div
          className="h-[640px] overflow-hidden rounded-2xl border"
          style={{
            color: "var(--foreground)",
            backgroundColor: "var(--background)",
          }}
        >
          <CalendarKit {...calendarKitProps} />
        </div>
      </div>

      <DevicePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        mode={mode}
        baseColor={baseColor}
        colorTheme={colorTheme}
        onModeChange={setMode}
        onBaseColorChange={setBaseColor}
        onColorThemeChange={setColorTheme}
        themeVars={themeVars}
        fontFamily={SHADCN_FONT}
        calendarKitProps={calendarKitProps}
      />
    </div>
  )
}
