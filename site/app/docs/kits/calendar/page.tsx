"use client"

import { DocPage } from "../../components/doc-page"
import { DocTabs } from "../../components/doc-tabs"
import { CodeBlock } from "../../components/code-block"
import { CalendarDemo } from "./_components/calendar-demo"
import { CalendarBackendContent } from "./_components/calendar-backend-content"
import { KitFeBeConnectionGuide } from "../../components/kit-fe-be-connection"
import { KitIntegrationDisclaimer } from "../../components/kit-integration-disclaimer"
import { KitUserModelIntegration } from "../../components/kit-user-model-integration"
import { KitDocStepHeading } from "../../components/kit-doc-step-heading"

const headings = [
  { id: "quick-reference", text: "Quick reference", level: 2 },
  { id: "overview", text: "Overview", level: 2 },
  { id: "demo", text: "Demo", level: 2 },
  { id: "guide", text: "Guide", level: 2 },
]

export default function CalendarKitPage() {
  return (
    <DocPage
      title="Calendar Kit"
      description="Full-featured calendar with month, week, day, and agenda views. Event creation, editing, attendees, color categories, and all-day support. Includes both UI and backend scaffolding."
      headings={headings}
      stackConfig={{ showDatabaseFields: true, showFrontendBundler: true }}
    >
      <h2 id="quick-reference" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Quick reference
      </h2>
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-12 mt-4 max-w-2xl">
        <h4 className="font-medium text-white mb-3">CLI commands</h4>
        <CodeBlock
          code={`# Add UI components (month/week/day/agenda views, event dialogs)
npx @fivfold/ui add calendar

# Add backend scaffolding (Express/NestJS + TypeORM)
npx @fivfold/api add calendar --framework=nestjs --orm=typeorm

# Use MongoDB + Mongoose
npx @fivfold/api add calendar --framework=nestjs --orm=mongoose --database=mongodb

# Use Express + Prisma
npx @fivfold/api add calendar --framework=express --orm=prisma

# Dry run to preview files
npx @fivfold/ui add calendar --dry-run
npx @fivfold/api add calendar --dry-run`}
          language="bash"
          className="text-xs"
        />
      </div>

      <h2 id="overview" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Overview
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-4">
        The Calendar Kit provides a complete calendar UI with four views — Month, Week, Day, and
        Agenda — plus event creation/editing dialogs with color categories, all-day toggles,
        attendee management, location, and recurrence fields. Built with shadcn/ui primitives and{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">date-fns</code>.
        Fully responsive: mobile defaults to Agenda view, tablet to Week, desktop to Month.
        Supported stack combinations:
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/10 mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 px-4 font-medium text-white/80">Layer</th>
              <th className="text-left py-2 px-4 font-medium text-white/80">Options</th>
            </tr>
          </thead>
          <tbody className="text-white/70">
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">Framework</td>
              <td className="py-2 px-4">NestJS, Express</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">SQL</td>
              <td className="py-2 px-4">TypeORM (PostgreSQL, MySQL, MariaDB, MSSQL), Prisma</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">NoSQL</td>
              <td className="py-2 px-4">Mongoose (MongoDB), Prisma (MongoDB connector)</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">Cloud NoSQL</td>
              <td className="py-2 px-4">Azure Cosmos DB SDK, AWS DynamoDB SDK</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="demo" className="scroll-mt-24 font-semibold text-2xl mt-4 pt-4">
        Demo
      </h2>
      <p className="text-white/60 text-sm mt-1 italic pb-8">
        This demo is presented with Mock Data
      </p>
      <CalendarDemo />

      <h2 id="guide" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-4">
        Guide
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-4 text-sm">
        Step-by-step guides for the frontend UI and backend API integration. Pick{" "}
        <strong className="text-white/90">Frontend</strong> first in the sidebar, then the rest of your stack, for aligned dev-server and API docs.
      </p>
      <DocTabs
        tabs={[
          {
            id: "ui",
            label: "UI",
            icon: "layout",
            content: (
              <div className="space-y-10">
                <p className="text-white/80 text-sm leading-relaxed">
                  The Calendar Kit is built exclusively with shadcn/ui primitives and{" "}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">date-fns</code>.
                  Follow the steps below to install, integrate, and customize the UI.
                </p>

                <div>
                  <KitDocStepHeading step={1}>Install the Calendar Kit</KitDocStepHeading>
                  <p className="text-white/80 text-sm mb-3">
                    Run the FivFold UI CLI to add the Calendar Kit to your project. Ensure you have run{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">
                      npx @fivfold/ui init
                    </code>{" "}
                    first.
                  </p>
                  <CodeBlock
                    code="npx @fivfold/ui add calendar"
                    language="bash"
                    showTerminalIcon
                    className="mb-4"
                  />
                  <p className="text-white/80 text-sm">
                    The Kit is copied to{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">
                      @/components/ui/kits/calendar/
                    </code>{" "}
                    (or your configured kits alias in <code>fivfold.json</code>). shadcn/ui primitives and{" "}
                    <code className="rounded bg-white/10 px-1">date-fns</code> are installed automatically.
                  </p>
                </div>

                <div>
                  <KitDocStepHeading step={2}>Generated file structure</KitDocStepHeading>
                  <p className="text-white/80 text-sm mb-3">
                    The command creates a self-contained folder with separate files for each view and dialog:
                  </p>
                  <CodeBlock
                    code={`kits/calendar/
  types.ts                  # Shared types (FivFoldCalendarEvent, CalendarKitProps, etc.)
  calendar-header.tsx       # Navigation arrows, Today button, view switcher
  month-view.tsx            # 7-column month grid with event pills and overflow count
  week-view.tsx             # 7-column × 24-row time grid with all-day row
  day-view.tsx              # Single-day hourly time slots with event blocks
  agenda-view.tsx           # Chronological scrollable event list grouped by date
  event-card.tsx            # Reusable event pill/card component with color theming
  event-detail-dialog.tsx   # Sheet (mobile) / Dialog (desktop) showing full event details
  create-event-dialog.tsx   # Create + Edit form with date pickers, color, location, recurrence
  index.tsx                 # Main CalendarKit component and re-exports`}
                    language="text"
                    label="File tree"
                    className="mb-4"
                  />
                </div>

                <div>
                  <KitDocStepHeading step={3}>Import and use in your app</KitDocStepHeading>
                  <p className="text-white/80 text-sm mb-3">
                    Import the main component and types from the kit folder:
                  </p>
                  <CodeBlock
                    code={`import { CalendarKit } from "@/components/ui/kits/calendar";
import type { FivFoldCalendarEvent } from "@/components/ui/kits/calendar";

const INITIAL_EVENTS: FivFoldCalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    startDate: "2025-04-16T09:30:00.000Z",
    endDate: "2025-04-16T10:00:00.000Z",
    isAllDay: false,
    color: "blue",
    location: "Zoom",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function CalendarPage() {
  const [events, setEvents] = React.useState(INITIAL_EVENTS);

  return (
    <div className="h-[700px]">
      <CalendarKit
        events={events}
        onEventsChange={setEvents}
        defaultView="month"
        showTodayButton
        showViewSwitcher
        showAttendees
        showLocation
      />
    </div>
  );
}`}
                    language="tsx"
                    filename="app/calendar/page.tsx"
                  />
                </div>

                <div>
                  <KitDocStepHeading step={4}>Props reference</KitDocStepHeading>
                  <p className="text-white/80 text-sm mb-4">
                    The Calendar Kit exposes a single <code>CalendarKit</code> component. All props are optional except events.
                  </p>

                  <div className="space-y-6">
                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Data & State</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">Core event data and change callbacks.</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">events</td><td className="py-2 px-4 font-mono text-white/50">FivFoldCalendarEvent[]</td><td className="py-2 px-4">List of events to display across all views.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onEventsChange</td><td className="py-2 px-4 font-mono text-white/50">(events) =&gt; void</td><td className="py-2 px-4">Fired when events are created, updated, or deleted internally.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">defaultView</td><td className="py-2 px-4 font-mono text-white/50">&quot;month&quot; | &quot;week&quot; | &quot;day&quot; | &quot;agenda&quot;</td><td className="py-2 px-4">Initial calendar view. Defaults to &quot;month&quot;.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">defaultDate</td><td className="py-2 px-4 font-mono text-white/50">string (ISO)</td><td className="py-2 px-4">Initial date to navigate to. Defaults to today.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">weekStartsOn</td><td className="py-2 px-4 font-mono text-white/50">0 | 1</td><td className="py-2 px-4">0 = Sunday (default), 1 = Monday. Affects month and week views.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Visibility & Layout</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showTodayButton</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show &quot;Today&quot; navigation button. Default true.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showViewSwitcher</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show Month/Week/Day/Agenda tabs. Default true.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showAttendees</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show attendee avatars and count in event detail. Default true.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showLocation</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show location in event cards and detail dialog. Default true.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">forceLayout</td><td className="py-2 px-4 font-mono text-white/50">&quot;mobile&quot; | &quot;tablet&quot; | &quot;desktop&quot;</td><td className="py-2 px-4">Override responsive breakpoints. Dialogs use Sheet on mobile, Dialog on desktop.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">attendeeSuggestions</td><td className="py-2 px-4 font-mono text-white/50">FivFoldCalendarAttendee[]</td><td className="py-2 px-4">List of users to show in the attendee autocomplete search when creating/editing events. Populate from your users database. Each entry requires id, name, email, initials (and optionally avatar, status).</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Callbacks</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onEventClick</td><td className="py-2 px-4 font-mono text-white/50">(event) =&gt; void</td><td className="py-2 px-4">Override default event detail dialog. Use for custom routing or panel.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onCreateEvent</td><td className="py-2 px-4 font-mono text-white/50">(partial) =&gt; void</td><td className="py-2 px-4">Override default create dialog. Receives partial event with date fields pre-filled.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onDeleteEvent</td><td className="py-2 px-4 font-mono text-white/50">(eventId) =&gt; void</td><td className="py-2 px-4">Override default delete. Use to call DELETE /api/calendar/events/:id.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-2">
                      <h4 className="font-medium text-white">Reminders (notification stubs)</h4>
                      <p className="text-white/70 text-sm">
                        The create-event dialog lets users add reminders (e.g. 15 minutes before, 1 hour before).
                        The UI stores reminders on the event object and sends them to the API. The backend includes
                        stub endpoints at <code className="rounded bg-white/10 px-1 py-0.5">POST /calendar/events/:id/reminders</code> and{" "}
                        <code className="rounded bg-white/10 px-1 py-0.5">DELETE /calendar/events/:id/reminders/:rid</code> that
                        you must wire up to your own notification service. Supported options include:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-white/70 space-y-1">
                        <li><strong className="text-white/90">Firebase Cloud Messaging (FCM)</strong> — push notifications for web/mobile</li>
                        <li><strong className="text-white/90">AWS SNS</strong> — SMS, email, or push</li>
                        <li><strong className="text-white/90">OneSignal</strong> — cross-platform push</li>
                        <li><strong className="text-white/90">Twilio</strong> — SMS delivery</li>
                        <li><strong className="text-white/90">Resend / Postmark</strong> — transactional email reminders</li>
                      </ul>
                      <p className="text-white/70 text-sm">
                        The stub methods <code className="rounded bg-white/10 px-1 py-0.5">addReminder</code> and{" "}
                        <code className="rounded bg-white/10 px-1 py-0.5">removeReminder</code> are also declared on the service
                        port interface (<code className="rounded bg-white/10 px-1 py-0.5">I{"{moduleName}"}Service</code>) for you to implement.
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-2">
                      <h4 className="font-medium text-white">Attendee suggestions</h4>
                      <p className="text-white/70 text-sm">
                        Pass your user list via <code className="rounded bg-white/10 px-1 py-0.5">attendeeSuggestions</code> to enable
                        the autocomplete search in the create/edit dialog. Users can also type a raw email address to add
                        an attendee not in the list. Fetch your users from your auth provider or database and map them to
                        <code className="rounded bg-white/10 px-1 py-0.5">FivFoldCalendarAttendee</code>:
                      </p>
                      <CodeBlock
                        language="tsx"
                        className="text-xs"
                        code={`import { CalendarKit } from "@/components/ui/kits/calendar"
import type { FivFoldCalendarAttendee } from "@/components/ui/kits/calendar/types"

// Map from your own User model
const suggestions: FivFoldCalendarAttendee[] = users.map((u) => ({
  id: u.id,
  name: u.displayName,
  email: u.email,
  initials: u.displayName.slice(0, 2).toUpperCase(),
  avatar: u.avatarUrl,
}))

<CalendarKit
  events={events}
  attendeeSuggestions={suggestions}
/>`}
                      />
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Event Color Categories</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Set <code>color</code> on each <code>FivFoldCalendarEvent</code> to theme its pill and dot:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Value</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Appearance</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            {["default", "red", "orange", "yellow", "green", "teal", "blue", "purple", "pink"].map((c) => (
                              <tr key={c} className="border-b border-white/5">
                                <td className="py-2 px-4 font-mono text-brand-secondary">{`"${c}"`}</td>
                                <td className="py-2 px-4 capitalize">{c === "default" ? "Primary color (follows your shadcn theme)" : `${c.charAt(0).toUpperCase() + c.slice(1)} tinted pill`}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <KitDocStepHeading step={5}>Integration with backend</KitDocStepHeading>
                  <KitIntegrationDisclaimer />
                  <KitFeBeConnectionGuide withDisclaimer={false} kitTitle="Calendar" apiControllerPath="calendar" />
                  <KitUserModelIntegration
                    kitTitle="Calendar (UI layer)"
                    summary="Event and attendee props are user-agnostic in the kit. Your data hooks must load events for the signed-in user and send the same user context to the API when creating or updating events."
                    bullets={[
                      "Include auth headers on every mutating call (create event, delete event) so the backend can enforce ownership.",
                      "Map attendee display names and avatars from your user directory if the API returns ids only.",
                      "Use onCreateEvent and onDeleteEvent callbacks to wire the kit to your API instead of its built-in local state.",
                    ]}
                  />
                </div>

                <div>
                  <KitDocStepHeading step={6}>shadcn/ui primitives</KitDocStepHeading>
                  <p className="text-white/80 text-sm mb-3">
                    Adding the Calendar Kit installs these shadcn/ui primitives if not already present:
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-4 font-medium text-white/80">Component</th>
                          <th className="text-left py-2 px-4 font-medium text-white/80">Used in</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">button</td><td className="py-2 px-4">Header navigation, create event, detail actions</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">dialog</td><td className="py-2 px-4">Event detail and create form on desktop</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">sheet</td><td className="py-2 px-4">Event detail and create form on mobile (bottom sheet)</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">tabs</td><td className="py-2 px-4">View switcher (Month / Week / Day / Agenda) on desktop</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">dropdown-menu</td><td className="py-2 px-4">View switcher on mobile</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">scroll-area</td><td className="py-2 px-4">Agenda view list, week/day time grid</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">badge</td><td className="py-2 px-4">All-day indicator, attendee status</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">avatar</td><td className="py-2 px-4">Attendee avatars in event detail</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">input</td><td className="py-2 px-4">Event title, location, date/time fields</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">label</td><td className="py-2 px-4">Form field labels in create dialog</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">textarea</td><td className="py-2 px-4">Event description field</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">select</td><td className="py-2 px-4">Color picker, recurrence selector</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">switch</td><td className="py-2 px-4">All-day toggle in create dialog</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">separator</td><td className="py-2 px-4">Visual dividers in dialogs and agenda view</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">tooltip</td><td className="py-2 px-4">Hover hints on header buttons</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <KitDocStepHeading step={7}>Additional dependencies</KitDocStepHeading>
                  <p className="text-white/80 text-sm mb-3">
                    The kit uses <code className="rounded bg-white/10 px-1">date-fns</code> for all date arithmetic and formatting, and <code className="rounded bg-white/10 px-1">lucide-react</code> for icons. Both are added automatically when you run{" "}
                    <code className="rounded bg-white/10 px-1">npx @fivfold/ui add calendar</code>.
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-4 font-medium text-white/80">Package</th>
                          <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">date-fns</td><td className="py-2 px-4">Date arithmetic, formatting, week/month calculations</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">lucide-react</td><td className="py-2 px-4">Icons (ChevronLeft, ChevronRight, MapPin, Users, etc.)</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "api",
            label: "API",
            icon: "server",
            content: (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Step-by-step: API integration</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  The Calendar API module provides entities, DTOs, services, and controllers for events
                  and attendees with full date-range querying and RSVP status management. Pick{" "}
                  <strong className="text-white/90">Frontend</strong> first in the sidebar for CORS
                  and dev-proxy alignment, then the rest of your stack.
                </p>
                <CalendarBackendContent />
              </div>
            ),
          },
        ]}
        defaultTab="ui"
      />
    </DocPage>
  )
}
