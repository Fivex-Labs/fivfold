# Contributing to fivfold-site

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) in the repository root for general guidelines.

## Site-Specific Notes

`fivfold-site` is the Next.js documentation and marketing site. It showcases Kits, demos, and documentation.

### Tech Stack

- Next.js 16+, React 19, Tailwind CSS v4, shadcn
- Uses `@fivfold/ui` (workspace) for Kit demos

### Key Paths

- `app/docs/getting-started/` — Introduction, Installation, CLI
- `app/docs/kits/` — Auth, Email, Kanban docs
- `app/docs/api/` — Setup, Express, NestJS
- `components/ui/kits/` — Kit components (from @fivfold/ui)

### Running

```bash
pnpm run dev     # Dev server
pnpm run build   # Production build
pnpm run lint    # ESLint
```

Ensure `ui` is built before running the site: `pnpm run build -w ui` from root.
