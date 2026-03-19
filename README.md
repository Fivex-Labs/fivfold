# FivFold

> **DISCLAIMER:** This is a pre-alpha release and currently under heavy testing and scrutiny. Until the first stable version (v1.0.0) is released, we advise not to use this in production.

**Full-Stack Scaffolding platform for various typescript eco-systems. Other systems coming soon.**

FivFold provides pre-built Kits (frontend components + optional backend scaffolding) that you add to your project. Kits are open-code, not black-box: you own the code. Think of it as shadcn/ui but not only for front-end, but the entire system. Built on [shadcn/ui](https://ui.shadcn.com) and [Tailwind CSS v4](https://tailwindcss.com).

## What is FivFold

**Kits** are pre-built features you add via CLI:

- **Frontend Kits**: React/Next.js/Vite components, Tailwind v4, shadcn/ui
- **Backend Kits**: Entities, DTOs, services, controllers for Express, NestJS, with TypeORM and Prisma for now. More coming soon.

You get source code in your project—no runtime dependencies, no lock-in. Customize everything.

## Monorepo Overview

This repository is a pnpm workspace with four packages:

```mermaid
flowchart TB
    subgraph packages [Packages]
        core[@fivfold/core]
        ui[@fivfold/ui]
        api[@fivfold/api]
        site[fivfold-site]
    end
    core --> ui
    core --> api
    ui -->|devDependency for demos| site
```

| Package | Description |
|---------|-------------|
| [**@fivfold/core**](./core/README.md) | Shared engine: VFS, StrategyPipeline, manifests, TemplateEngine, TsMorphEngine, detection, prompts |
| [**@fivfold/ui**](./ui/README.md) | Frontend Kits CLI: init, add, list, agents, setup |
| [**@fivfold/api**](./api/README.md) | Backend scaffolding CLI: init, add, list |
| [**fivfold-site**](./site/README.md) | Next.js docs site |

## Quick Start

**Prerequisites:** Node.js 20+, [pnpm](https://pnpm.io)

```bash
# Clone and install
pnpm install

# Build all packages
pnpm run build

# Run the docs site
pnpm run dev:site
```

## Commands Reference

**Monorepo (from root):**

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all workspace dependencies |
| `pnpm run build` | Build all packages |
| `pnpm run build:core` | Build core only |
| `pnpm run build:ui` | Build UI CLI only |
| `pnpm run build:api` | Build API CLI only |
| `pnpm run dev:site` | Run docs site in dev mode |
| `pnpm run build:site` | Build docs site |

**UI CLI** (in a React/Next.js project):

| Command | Description |
|---------|-------------|
| `npx @fivfold/ui init` | Initialize FivFold in project |
| `npx @fivfold/ui add <kit>` | Add a Kit |
| `npx @fivfold/ui list` | List available Kits |
| `npx @fivfold/ui agents` | Show agent instructions |
| `npx @fivfold/ui setup` | Setup (e.g., shadcn) |

**API CLI** (in a Node.js backend project):

| Command | Description |
|---------|-------------|
| `npx @fivfold/api init` | Initialize FivFold in project |
| `npx @fivfold/api add <kit>` | Add a backend Kit |
| `npx @fivfold/api list` | List available Kits |

## Project Structure

```
fivfold/
├── core/           # @fivfold/core — shared engine
│   └── src/        # vfs, strategy, manifest, template, ast, detection, prompt, workspace
├── ui/             # @fivfold/ui — frontend CLI
│   ├── src/        # CLI entry, commands
│   ├── manifests/  # *.kit.json
│   └── templates/  # Kit templates (auth, email, kanban, themes)
├── api/            # @fivfold/api — backend CLI
│   ├── src/        # CLI entry, commands, strategies
│   ├── manifests/  # *.kit.json
│   └── templates/  # Kit templates (kanban, email)
├── site/           # fivfold-site — docs site
│   └── app/        # Next.js App Router (docs, getting-started, kits, api)
├── AGENTS.md       # AI agent rules
├── OVERVIEW.md     # Quick reference
└── package.json
```

## Configuration

- **File:** `fivfold.json` at project root
- **Shared by:** ui and api CLIs
- **Purpose:** Stores project config (output paths, stack choices)

## For AI Agents

- **[AGENTS.md](./AGENTS.md)** — Architectural rules and constraints
- **[OVERVIEW.md](./OVERVIEW.md)** — Project structure and commands

## Development

1. **Build order:** `core` must be built before `ui` and `api` (they depend on it)
2. **Watch mode:** Run `pnpm run dev` in core/ui/api for live rebuilds
3. **Docs site:** Uses `@fivfold/ui` via `file:../ui` for demos; ensure ui is built

## License

MIT
