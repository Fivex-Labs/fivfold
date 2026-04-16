---
name: fivfold-kits
description: FivFold UI Kits conventions for React/Next.js projects. Use when working with FivFold Kits (Email, Kanban, Chat, Auth), import paths, theming, Tailwind CSS v4, shadcn/ui components, or kit customization.
license: MIT
metadata:
  author: Fivex Labs
  version: "1.0.0"
---

# FivFold Kits

Conventions for using FivFold UI Kits in React and Next.js projects.

## When to Apply

- Importing or customizing FivFold Kits (Email, Kanban, Chat, Auth, Calendar)
- Setting up theming, Tailwind CSS v4, or shadcn/ui
- Working with kit component exports and props

## Key Conventions

### Import Paths

| Purpose | Import Path |
|---------|-------------|
| shadcn/ui components | `@/components/ui/<component>` (or config `aliases.ui`) |
| FivFold Kits | `@/components/ui/kits/<name>` (or config `aliases.kits`) |
| Utilities (cn) | `@/lib/utils` (or config `aliases.utils`) |

### Component Rules

- shadcn/ui components: **do not modify** directly
- Kits: **can be customized** to fit your needs
- Client components: must have `"use client"` at the top
- Use `cn()` for conditional class merging

### Styling

- **Tailwind CSS v4** exclusively: `@import "tailwindcss"` in CSS; no `tailwind.config.js`
- Use semantic classes: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`
- Avoid hardcoded colors inside Kits; use CSS variable-based classes

### Adding Kits

```bash
npx @fivfold/ui list              # see all available Kits
npx @fivfold/ui add <name>       # add a Kit
npx @fivfold/ui add <name> --theme zinc  # add with specific theme
```

## Available Kits

| Kit | Description |
|-----|-------------|
| Auth | Login, Register, ForgotPassword (Firebase, Cognito, Auth0, JWT) |
| Calendar | Month/week/day/agenda views, event creation, attendees, color categories |
| Chat | Real-time chat with threads and messages |
| Email | Full-featured email client with folders, threads, compose |
| Kanban | Drag-and-drop board with columns, tasks, priorities |
| Media Uploader | Direct-to-cloud uploads (S3, Azure Blob, GCS, Cloudinary, Dropbox) |
