# @fivfold/ui

> **DISCLAIMER:** This is a pre-alpha release and currently under heavy testing and scrutiny. Until the first stable version (v1.0.0) is released, we advise not to use this in production.

CLI for adding frontend Kits to React, Next.js, Vite projects for now, more coming soon. Kits are pre-built components built on shadcn/ui and Tailwind v4.

## What is @fivfold/ui

`@fivfold/ui` is the frontend Kits CLI. It adds pre-built UI Kits to your project by copying templates and applying simple substitutions. You own the code—no runtime lock-in.

## Commands

| Command | Description | Options / Examples |
|---------|-------------|--------------------|
| `init` | Initialize FivFold in your project | Requires **Tailwind v4** + **shadcn/ui** first; creates `fivfold.json`, uses your existing theme |
| `add <kit> [kit...]` | Add one or more Kits | `npx @fivfold/ui add auth`, `add auth kanban` |
| `list` | List all available Kits | Shows name, description |
| `agents` | Generate AGENTS.md for AI assistant compatibility | Outputs agent instructions |
| `setup` | Show setup instructions and check requirements | Verifies Tailwind, shadcn, etc. |

**Global flags:** `--dry-run` (preview without writing), `--yes` / `-y` (skip prompts)

## Manifests

**Location:** `ui/manifests/`

**Structure:** Each Kit has a `*.kit.json` manifest (e.g., `auth.kit.json`, `kanban.kit.json`, `email.kit.json`).

Example manifest structure:

```json
{
  "name": "auth",
  "version": "1.0.0",
  "description": "...",
  "authProviders": ["firebase", "cognito", "auth0", "jwt"],
  "dependencies": ["@icons-pack/react-simple-icons"],
  "shadcnDependencies": ["button", "input", "label", "card", "dialog", "separator"],
  "files": [
    {
      "template": "templates/auth/index.tsx",
      "output": "{{outputDir}}/{{kitName}}/index.tsx"
    }
  ]
}
```

- `output` uses `{{outputDir}}` and `{{kitName}}` placeholders (resolved by `resolveOutputPath` from core)
- `dependencies`: npm packages to install
- `shadcnDependencies`: shadcn/ui components to add

## Templates

**Location:** `ui/templates/`

**Structure:** Directories per Kit (`auth/`, `kanban/`, `email/`) plus `themes/` for CSS.

Most templates are plain files copied as-is; some kits use a `.hbs` extension with the same substitutions. All templates get:

1. **`__KITS_ALIAS__`** → replaced with `config.aliases.kits` (e.g., `@/components/kits`)
2. **`"use client"`** → removed if `config.rsc === false`

## Prerequisites

1. **Tailwind CSS v4** — e.g. `tailwindcss@^4` or `@tailwindcss/postcss` / `@tailwindcss/vite` in `package.json`, and `@import "tailwindcss";` in your global CSS.
2. **shadcn/ui** — `components.json` at the project root (`npx shadcn@latest init`).

Then run `npx @fivfold/ui init`. Init does not install Tailwind or shadcn for you.

## Flow

1. **Load config:** `fivfold.json` (from `init`)
2. **Load manifest:** `loadUiManifest(manifestsDir, name)` from `@fivfold/core`
3. **Stage files:** For each `manifest.files`, read template, apply substitutions, `vfs.stageCreate()`
4. **Commit:** `vfs.commit()` (or `vfs.preview()` if `--dry-run`)
5. **Post-commit:** Install npm deps, shadcn deps, apply/patch theme CSS

**No StrategyPipeline:** UI uses VFS + loadUiManifest + direct copy. API uses StrategyPipeline for backend scaffolding.

## Dependencies

- `@fivfold/core` (workspace:*)
- `commander`

## Build

```bash
pnpm run build   # Output to dist/
pnpm run dev     # Watch mode
```

## Adding a New Kit

1. Create `ui/manifests/<name>.kit.json` with `name`, `description`, `files`, `dependencies`, `shadcnDependencies`
2. Create `ui/templates/<name>/` with template files
3. Use `__KITS_ALIAS__` in imports that reference the kits alias
4. Use `{{outputDir}}` and `{{kitName}}` in manifest `output` paths
5. Run `npx @fivfold/ui list` to verify the Kit appears
