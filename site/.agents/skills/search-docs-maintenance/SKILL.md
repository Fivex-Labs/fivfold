---
name: search-docs-maintenance
description: Update the docs search index when adding or modifying documentation pages. Use when adding a new docs page, creating new documentation, or when asked to "update search" or "add to search".
metadata:
  author: fivfold
  version: "1.0.0"
  argument-hint: <page-path-or-context>
---

# Search Docs Maintenance

When adding or modifying documentation pages under `site/app/docs/`, you MUST update the search index so the new content appears in the global Search Docs command palette (⌘K).

## Rule

**Every new docs page must have a corresponding entry in the search index.**

## Search Index Location

`site/app/lib/search-docs.config.ts`

## Required Fields

Each entry in `searchDocsEntries` must include:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (matches DocPage title) |
| `href` | string | Full path, e.g. `/docs/kits/calendar` |
| `description` | string | Short summary (optional but recommended) |
| `keywords` | string[] | 5–10 relevant search terms users might type |
| `section` | "Getting Started" \| "Kits" \| "API" | Section for grouping |
| `icon` | string | Lucide icon name: BookOpen, Download, Terminal, Layers, Mail, LayoutGrid, TimerReset, Shield, Cog |

## Example

Adding a new Calendar Kit page at `/docs/kits/calendar`:

```ts
{
  title: "Calendar Kit",
  href: "/docs/kits/calendar",
  description: "Date picker and calendar views for scheduling and events.",
  keywords: ["calendar", "date", "scheduling", "events", "picker", "agenda"],
  section: "Kits",
  icon: "Calendar",
}
```

If using a new icon, add it to the `iconMap` in:
- `site/app/components/search-docs-command.tsx`
- `site/app/docs/components/docs-sidebar.tsx`

## Sections

- **Getting Started**: Introduction, setup, CLI, how it works
- **Kits**: Overview, Auth, Email, Kanban, and any new Kits
- **API**: Backend setup, Express, NestJS, and framework-specific docs

## Checklist

When adding a new docs page:

1. Create the page under `site/app/docs/`
2. Add an entry to `searchDocsEntries` in `site/lib/search-docs.config.ts`
3. If the page should appear in the sidebar, ensure `getDocsNavItems()` will include it (it derives from `searchDocsEntries` by section)
4. Add the icon to `iconMap` in both `search-docs-command.tsx` and `docs-sidebar.tsx` if it's a new icon
