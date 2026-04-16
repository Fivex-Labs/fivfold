export type CalendarView = "month" | "week" | "day" | "agenda"

export type CalendarEventColor =
  | "default"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "purple"
  | "pink"

export interface FivFoldCalendarAttendee {
  id: string
  name: string
  email: string
  avatar?: string
  initials: string
  status?: "pending" | "accepted" | "declined"
}

export interface FivFoldCalendarReminder {
  id: string
  /** Minutes before the event to send the reminder (e.g. 15, 60). */
  minutes: number
  /** Delivery method — implementation is a stub; wire up your own notification service. */
  method?: "notification" | "email" | "sms"
}

export interface FivFoldCalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string // ISO 8601
  endDate: string   // ISO 8601
  isAllDay?: boolean
  color?: CalendarEventColor
  location?: string
  attendees?: FivFoldCalendarAttendee[]
  recurrenceRule?: string
  /** IANA timezone identifier (e.g. "America/New_York"). Defaults to browser timezone. */
  timezone?: string
  /** List of reminders for this event. Delivery requires a custom notification service. */
  reminders?: FivFoldCalendarReminder[]
  createdAt: string
  updatedAt: string
}

export interface CalendarKitProps {
  className?: string
  /** Initial list of events. Controlled via onEventsChange. */
  events?: FivFoldCalendarEvent[]
  /** Called when events are created, updated, or deleted internally. */
  onEventsChange?: (events: FivFoldCalendarEvent[]) => void
  /** Override to handle event click yourself (e.g. route to detail page). */
  onEventClick?: (event: FivFoldCalendarEvent) => void
  /** Override to handle the create-event action (e.g. open your own form). */
  onCreateEvent?: (partial: Partial<FivFoldCalendarEvent>) => void
  /** Override to handle event deletion. */
  onDeleteEvent?: (eventId: string) => void
  /** Lock the view to a specific layout. Auto-responsive when omitted. */
  forceLayout?: "mobile" | "tablet" | "desktop"
  /** Initial view. Defaults to "month". */
  defaultView?: CalendarView
  /** Initial date to display. Defaults to today. */
  defaultDate?: string
  /** Show a "Today" button in the header. Default true. */
  showTodayButton?: boolean
  /** Show the view switcher (Month/Week/Day/Agenda). Default true. */
  showViewSwitcher?: boolean
  /** Show event attendee avatars. Default true. */
  showAttendees?: boolean
  /** Show event location. Default true. */
  showLocation?: boolean
  /** Locale string passed to date-fns format helpers. */
  locale?: string
  /** First day of week: 0=Sunday, 1=Monday. Default 0. */
  weekStartsOn?: 0 | 1
  /**
   * List of attendee suggestions for the create/edit event form autocomplete.
   * Populate this with your users from your database.
   * Each attendee requires: id, name, email, initials (and optionally avatar, status).
   */
  attendeeSuggestions?: FivFoldCalendarAttendee[]
}
