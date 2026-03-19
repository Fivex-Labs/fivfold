# FivFold - Site

> **DISCLAIMER:** This is a pre-alpha release and currently under heavy testing and scrutiny. Until the first stable version (v1.0.0) is released, we advise not to use this in production.

Next.js docs and marketing site for FivFold.

## What is Site

Documentation and landing experience. Built with Next.js App Router, React 19, Tailwind v4, and shadcn/ui. Includes Kit demos wired to `@fivfold/ui` where applicable.

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
│   │   ├── kits/           # Per-Kit doc routes (+ overview index)
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
| `app/docs/kits/` | Kit-specific documentation routes |
| `app/docs/api/` | Backend / API-related docs |
| `app/docs/components/` | DocPage, DocCard, CodeBlock, StackConfigurator, etc. |
| `components/ui/kits/` | Demo Kit components (from `@fivfold/ui`) |

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

The site uses `@fivfold/ui` as a devDependency (`file:../ui`) for Kit demos and to keep examples aligned with the published UI package.

Ensure `ui` is built before running the site: `pnpm run build -w ui` (or from root: `pnpm run build:ui`).
