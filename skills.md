# FivFold Skills Registry

> **Agents:** Update this file when adding Kits, changing major component paths, or introducing new installable skills.

## FivFold project skills (for developing FivFold itself)

| Skill | Path | When to use |
|-------|------|-------------|
| FivFold Architecture | [AGENTS.md](AGENTS.md) | Refactoring CLI, scaffolding, manifests |
| FivFold Docs Conventions | [.cursor/rules/fivfold-docs.mdc](.cursor/rules/fivfold-docs.mdc) | Editing `site/app/docs` |
| FivFold Skills Maintenance | [.cursor/rules/fivfold-skills-maintenance.mdc](.cursor/rules/fivfold-skills-maintenance.mdc) | Kits, manifests, skills, templates |

## Developer project skills (installed via `npx @fivfold/ui skills`)

| Skill | IDEs | Description |
|-------|------|-------------|
| FivFold Kits | Cursor, VSCode, Cline, Windsurf, GitHub Copilot, Claude Code | Import paths, theming, Kit usage, component conventions |
| FivFold API | Cursor, VSCode, Cline, Windsurf, GitHub Copilot, Claude Code | Module structure, Hexagonal layout, ORM patterns |

## Kits

Shipped Kits change over time. Use `npx @fivfold/ui list` / `npx @fivfold/api list` in a project, or inspect `ui/manifests/` and `api/manifests/` in this repo—do not maintain a duplicate inventory table here.

**Calendar kit:** UI `CalendarKit` has four views: `month`, `week`, `day`, `agenda` — switched via `defaultView` prop or the header tab bar (tabs on desktop, dropdown on mobile). Responsive: dialogs use `Sheet` (bottom sheet) on mobile and `Dialog` on desktop, controlled by `forceLayout` prop or auto-detected via `matchMedia`. Event color theming via `CalendarEventColor` union type (`default | red | orange | yellow | green | teal | blue | purple | pink`) — maps to Tailwind tinted classes in `EVENT_COLOR_CLASSES` inside `event-card.tsx`. All-day events shown in a dedicated row in week view and as separate section in day view. Clicking a time slot or day cell pre-fills the create dialog. `onCreateEvent`, `onDeleteEvent`, `onEventClick` props override internal state when provided. API templates expose: `GET /calendar/events?startDate=&endDate=` (date-range), `POST /calendar/events` (with `attendeeEmails[]`), `PATCH /calendar/events/:id`, `DELETE /calendar/events/:id`, `POST/DELETE /calendar/events/:id/attendees`, `PATCH /calendar/events/:id/attendees/:aid/status`. TypeORM: `CalendarEvent` + `CalendarAttendee` entities; Prisma: appended models; Mongoose: separate schemas; Cosmos: `getCalendarContainers()` factory; DynamoDB: GSI on `GSI1PK/GSI1SK` for date-range queries.

**Chat kit (recent surface area):** UI templates use `dropdown-menu` for thread and header actions, demo-style sidebar search toggle, inline poll/emoji/GIF composer panels, hover quick-reactions on desktop, and OSM embeds for locations (optional `mapImageUrl` still supported). `ChatKit` accepts optional handlers: `onDeleteConversation`, `onMarkConversationRead`, `onMarkConversationUnread`, `onClearConversationMessages`, `onBlockUser`. API templates expose `PATCH /chat/conversations/:id/unread`, `DELETE /chat/conversations/:id/messages`, and participant-scoped `GET /chat/search` with optional `conversationId` query param (Nest: `SearchChatDto`; Express: `q`, `conversationId`, etc.).

**Media Uploader kit:** UI `MediaUploaderKit` uses `presign` + `finalizeUpload` + optional `simulateTransport` (docs demo only). API: `POST /media-uploader/presign` (pending audit) and `POST /media-uploader/finalize` (completed/failed + `accessUrl` on success). Storage adapters: `s3`, `azure-blob`, `gcs`, `cloudinary` (image/video MIME only), `dropbox`. ORM artifacts are **audit-only** (`media_uploader_upload_audits`); no file blobs in DB.

**Stripe kit (API):** Backend-only. `npx @fivfold/api add stripe` with interactive multiselect or `--features=payments,webhooks,connect,checkout,billing` (defaults with `--yes`: `payments,webhooks`). Hexagonal port + `StripeNodeAdapter`, Express or NestJS delivery, ORM-specific entities/schemas/containers/tables. Nest enables `rawBody` for webhooks via AST when the `webhooks` feature is on; Express uses `express.raw` on the webhook route. Docs: `site/app/docs/kits/stripe/`, manifest `api/manifests/stripe.kit.json`.
