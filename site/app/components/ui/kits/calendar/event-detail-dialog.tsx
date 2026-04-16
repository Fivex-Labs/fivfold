"use client"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  CalendarDays,
  MapPin,
  Users,
  Repeat,
  Pencil,
  Trash2,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { EVENT_DOT_CLASSES } from "./event-card"
import type { FivFoldCalendarEvent } from "./types"

const ATTENDEE_STATUS_BADGE: Record<string, string> = {
  accepted: "bg-green-500/20 text-green-400 border-green-500/30",
  declined: "bg-red-500/20 text-red-400 border-red-500/30",
  pending:  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
}

function formatEventDate(event: FivFoldCalendarEvent): string {
  const start = parseISO(event.startDate)
  const end = parseISO(event.endDate)
  if (event.isAllDay) {
    const startStr = format(start, "EEEE, MMMM d, yyyy")
    const endStr = format(end, "EEEE, MMMM d, yyyy")
    return startStr === endStr ? startStr : `${startStr} – ${endStr}`
  }
  const datePart = format(start, "EEEE, MMMM d, yyyy")
  const startTime = format(start, "h:mm a")
  const endTime = format(end, "h:mm a")
  return `${datePart} · ${startTime} – ${endTime}`
}

interface EventDetailDialogProps {
  event: FivFoldCalendarEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (event: FivFoldCalendarEvent) => void
  onDelete?: (eventId: string) => void
  showAttendees?: boolean
  showLocation?: boolean
  forceLayout?: "mobile" | "tablet" | "desktop"
}

export function EventDetailDialog({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  showAttendees = true,
  showLocation = true,
  forceLayout,
}: EventDetailDialogProps) {
  const [isMobile, setIsMobile] = useState(false)

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

  if (!event) return null

  const dotCls = EVENT_DOT_CLASSES[event.color ?? "default"]

  const body = (
    <div className="flex flex-col gap-4 py-2">
      {/* Color + title */}
      <div className="flex items-start gap-3">
        <span className={cn("mt-1 size-3 shrink-0 rounded-full", dotCls)} />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-base font-semibold leading-tight">{event.title}</span>
          {event.isAllDay && (
            <Badge variant="outline" className="w-fit text-xs">All day</Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Date/time */}
      <div className="flex items-start gap-3 text-sm">
        <CalendarDays className="size-4 shrink-0 mt-0.5 text-muted-foreground" />
        <span>{formatEventDate(event)}</span>
      </div>

      {/* Location */}
      {showLocation && event.location && (
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="size-4 shrink-0 mt-0.5 text-muted-foreground" />
          <span>{event.location}</span>
        </div>
      )}

      {/* Recurrence */}
      {event.recurrenceRule && (
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Repeat className="size-4 shrink-0 mt-0.5" />
          <span className="capitalize">{event.recurrenceRule}</span>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <>
          <Separator />
          <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
        </>
      )}

      {/* Attendees */}
      {showAttendees && event.attendees && event.attendees.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="size-4 text-muted-foreground" />
              <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {event.attendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarImage src={attendee.avatar} alt={attendee.name} />
                    <AvatarFallback className="text-[10px]">{attendee.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{attendee.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{attendee.email}</span>
                  </div>
                  {attendee.status && (
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] shrink-0", ATTENDEE_STATUS_BADGE[attendee.status])}
                    >
                      {attendee.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )

  const footer = (
    <div className="flex gap-2 justify-end">
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive gap-1.5"
          onClick={() => {
            onDelete(event.id)
            onOpenChange(false)
          }}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      )}
      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            onEdit(event)
            onOpenChange(false)
          }}
        >
          <Pencil className="size-4" />
          Edit
        </Button>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-auto rounded-t-xl">
          <SheetHeader>
            <SheetTitle className="sr-only">Event detail</SheetTitle>
          </SheetHeader>
          {body}
          <SheetFooter className="pt-2">{footer}</SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Event detail</DialogTitle>
        </DialogHeader>
        {body}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
