# FivFold - Site

> **DISCLAIMER:** This is a pre-alpha release and currently under heavy testing and scrutiny. Until the first stable version (v1.0.0) is released, we advise not to use this in production.

Next.js docs site for FivFold. Showcases Kits, demos, and documentation.

## What is Site

The FivFold documentation and marketing site. Built with Next.js App Router, React 19, Tailwind v4, and shadcn/ui. Includes live demos of Kits, overall documentation and more.

## Tech Stack

- **Next.js** 16+
- **React** 19
- **Tailwind CSS** v4
- **shadcn** (Base UI, cmdk, etc.)
- **Framer Motion** for animations
- **react-syntax-highlighter** for code blocks

## Structure

```
site/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home
│   ├── docs/               # Docs routes
│   │   ├── layout.tsx      # Docs layout, sidebar
│   │   ├── page.tsx        # Docs index
│   │   ├── getting-started/
│   │   │   ├── introduction/
│   │   │   ├── background/
│   │   │   ├── installation/
│   │   │   ├── cli/
│   │   │   └── how-it-works/
│   │   ├── kits/
│   │   │   ├── overview/
│   │   │   ├── auth/
│   │   │   ├── email/
│   │   │   └── kanban/
│   │   └── api/
│   │       ├── setup/
│   │       ├── express/
│   │       └── nestjs/
│   └── components/         # Shared components
├── components/             # UI components (shadcn, kits, layout)
├── public/
└── package.json
```

## Key Paths

| Path | Contents |
|------|----------|
| `app/docs/getting-started/` | Introduction, Background, Installation, CLI, How it works |
| `app/docs/kits/` | Overview, Auth, Email, Kanban |
| `app/docs/api/` | Setup, Express, NestJS |
| `app/docs/components/` | DocPage, DocCard, CodeBlock, StackConfigurator, etc. |
| `components/ui/kits/` | Auth, Kanban, Email Kit components (from @fivfold/ui) |

## Components

- **DocPage:** Page layout for docs
- **DocCard, DocStep:** Content blocks
- **CodeBlock:** Syntax-highlighted code
- **StackConfigurator:** Framework/ORM selector for stack-specific code examples
- **CodeForStack:** Renders code based on selected stack
- **DevicePreview:** Mobile/desktop preview for demos

## Running

```bash
pnpm run dev     # Dev server (Next.js with webpack)
pnpm run build   # Production build
pnpm run start   # Start production server
pnpm run lint    # ESLint
```

## Local @fivfold/ui

The site uses `@fivfold/ui` as a devDependency (`file:../ui`) for:

- Kit components in demos (Auth, Kanban, Email)
- Ensuring docs demos match what users get when they add Kits

Ensure `ui` is built before running the site: `pnpm run build -w ui` (or from root: `pnpm run build:ui`).
