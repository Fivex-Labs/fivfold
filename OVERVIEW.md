# FivFold Monorepo Overview

## What is FivFold

FivFold is a full-stack Kit platform. **Kits** are pre-built features (frontend components + optional backend scaffolding) that you add to your project. They are copy-paste, not black-box: you own the code. Built on shadcn/ui and Tailwind v4.

## Monorepo Layout

```
fivfold/
├── core/       # @fivfold/core — shared engine
├── ui/         # @fivfold/ui — frontend Kits CLI
├── api/        # @fivfold/api — backend scaffolding CLI
├── site/       # fivfold-site — Next.js docs site
└── package.json
```

**Package diagram:**

```
@fivfold/core ──┬──► @fivfold/ui ──► fivfold-site (devDependency for demos)
                └──► @fivfold/api
```

## Key Paths

| Path | Contents |
|------|----------|
| `core/src/` | VFS, strategy, manifest, template, AST, detection, prompt, workspace |
| `ui/src/` | CLI entry, commands; `ui/manifests/`, `ui/templates/` |
| `api/src/` | CLI entry, commands, strategies; `api/manifests/`, `api/templates/` |
| `site/` | Next.js docs site (`app/`, `app/docs/`) |

## Commands

**Monorepo (from root):**

```bash
pnpm install          # Install all workspaces
pnpm run build        # Build all workspaces
pnpm run dev:site     # Run docs site
pnpm run build:site   # Build docs site
```

**UI CLI:**

```bash
npx @fivfold/ui init      # Initialize FivFold in project
npx @fivfold/ui add       # Add a Kit
npx @fivfold/ui list       # List available Kits
npx @fivfold/ui agents     # Show agent instructions
npx @fivfold/ui setup      # Setup (e.g., shadcn)
```

**API CLI:**

```bash
npx @fivfold/api init      # Initialize FivFold in project
npx @fivfold/api add       # Add a backend Kit
npx @fivfold/api list      # List available Kits
```

## Configuration

- **File:** `fivfold.json` at project root
- **Shared by:** ui and api CLIs
- **Purpose:** Stores project config (e.g., output paths, stack choices)

## Manifest Flow

- **UI Kits:** `*.kit.json` in `ui/manifests/`; loaded via `loadUiManifest`
- **API Kits:** `*.kit.json` in `api/manifests/`; loaded via `loadManifest`
- Manifests define templates, dependencies, and AST mutation targets

## Dependencies

- `ui` and `api` depend on `@fivfold/core` via `workspace:*`
- `site` depends on `@fivfold/ui` via `file:../ui` (devDependency) for docs demos
