# Changelog

All notable changes to FivFold are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [Semantic Versioning](https://semver.org/).

> Run `pnpm release` from the monorepo root to bump versions and generate a new entry automatically.

## [Unreleased]

## [0.13.4] - 2026-03-20

### Fixed
- `@fivfold/ui`: Chat kit templates — remove unused imports/locals so strict TypeScript (`noUnusedLocals` / `noUnusedParameters`) passes on `npm run build`.

### Added
- `fivfold-site`: Chat full-stack **checklist** (`#fullstack-checklist`) and **Installation → Connecting UI and API** section with link to Chat docs; `KitFeBeConnectionGuide` cross-links Chat checklist for non-Chat kits.
- `fivfold-site`: Header badge + homepage use `FIVFOLD_MARKETING_VERSION` (`app/lib/fivfold-version.ts`) for the current release label.
- `@fivfold/ui` / `@fivfold/api`: Post-add **CLI reminders** for Chat (dev middleware / identity, Vite Socket.IO proxy or API origin, integration host, doc link).

### Changed
- `@fivfold/ui` / `@fivfold/api`: CLI `--version` strings set to `0.13.4`.
- Workspace `package.json` versions set to `0.13.4` for root, `core`, `ui`, `api`, and `fivfold-site`.

## [0.13.3] - 2026-03-20

### Added
- `AGENTS.md`: **Kit documentation page structure (mandatory)** — fixed section order for **UI** and **API** kit tabs (installation → file structure → import/wire → props or API reference → integration with FE/BE → third-party → shadcn on UI only → additional).
- `fivfold-site`: `KitDocStepHeading` component for numbered kit doc section titles.

### Changed
- `fivfold-site` **Chat** kit UI tab: sections reordered to match the standard (install, file tree, usage, props, backend integration + `ChatFullstackUiGuide`, third-party Tenor/storage/location, shadcn primitives via `ChatKitShadcnPrimitivesSection`, additional npm deps).
- `fivfold-site` **Auth** kit UI tab: single `AuthUIContent` flow with the same 1–8 sequence (props, integration, third-party links, shadcn vs additional deps split).
- `fivfold-site` **Chat** kit API tab (`chat-backend-content`): disclaimer/playbook moved after API reference; **§1–6** use `KitDocStepHeading` (install, file tree, wire, API entities/endpoints/rich messages, frontend integration + env, third-party Socket.IO note).
- `fivfold-site` **Auth** kit API tab (`auth-backend-content`): **§1–8** aligned to API standard — scaffold and file tree first, wire (architecture + DB + mount), API reference, integration (disclaimer, playbook, user model, env, UI connection), third-party provider notes, additional security + HTTP errors.
- `fivfold-site` **Email** & **Kanban** API tabs: `KitDocStepHeading` for install, combined file structure & wiring, API reference, integration, third-party stub, additional notes; removed conflicting inner step badges on stack-specific substeps.
- `fivfold-site` **Push** guide (`push-backend-content`): same API-doc order (scaffold → file & wire → endpoints + examples → integration with env & client steps → third-party SDKs → additional hardening).
- `@fivfold/ui` / `@fivfold/api`: CLI `--version` strings set to `0.13.3`.
- Workspace `package.json` versions set to `0.13.3` for root, `core`, `ui`, `api`, and `fivfold-site`.

## [0.13.2] - 2026-03-20

### Fixed
- `@fivfold/ui`: Chat kit manifest template paths use `templates/chat/...` so `npx @fivfold/ui add chat` finds all `.hbs` templates (paths previously omitted the `templates/` prefix).

### Added
- `@fivfold/ui`: `src/lib/init-requirements.ts` — Tailwind CSS v4 and shadcn/ui (`components.json`) checks, `components.json` theme path/baseColor helpers, optional globals CSS warning for `@import "tailwindcss"`.
- `fivfold-site`: Chat kit backend docs — “Connect chat to your existing users” (User id alignment, 1:1 and groups, chat search vs user directory, auth wiring) scoped to the **stack configurator** ORM + framework selection.

### Changed
- `@fivfold/ui`: `init` gates on Tailwind v4 + shadcn before prompts; removes FivFold theme wizard; uses existing shadcn theme (`theme.source: shadcn`, metadata from `components.json`); drops auto `shadcn init`; `--yes` / `--dry-run` use the same prerequisites.
- `@fivfold/ui`: `setup` and `ui/README.md` document prerequisites (Tailwind v4 + shadcn before `init`).
- `@fivfold/ui`: `agents.ts` — remove unused import (TypeScript clean build).

## [0.13.0] - 2026-03-19

### Added
- Site header: "About Us" link pointing to fivexlabs.com (opens in new tab)
- Site header: GitHub icon button linking to the FivFold repository
- Site footer: "Built with love by Fivex Labs" attribution with Fivex Labs logomark
- `scripts/release.mjs`: interactive release script — shows current versions, prompts for new version, updates all `package.json` files, writes CHANGELOG entry, and optionally commits + tags
- `pnpm release` root script alias for the above

### Changed
- Site canonical URL updated to `https://fold.fivexlabs.com` across all SEO metadata (OpenGraph, Twitter card, JSON-LD, `metadataBase`)
- GitHub Actions: `deploy-site.yml` now triggers only on `site/**` path changes, not every push to `main`
- GitHub Actions: `publish-packages.yml` now triggers on version tags (`v*.*.*`) instead of push to `main`
- GitHub Actions: `publish-packages.yml` uses npm Trusted Publishing (OIDC) — no `NPM_TOKEN` secret required
- GitHub Actions: `publish-packages.yml` adds a `create-release` job that reads the matching CHANGELOG.md entry and creates a GitHub Release automatically after packages are published
- `permissions: contents: write` added to `publish-packages.yml` to allow release creation

## [0.12.0] - 2026-03-12

### Added
- `@fivfold/core`: `VirtualFileSystem` with `stageCreate`, `stageModify`, `stageDelete`, `preview`, and atomic `commit`
- `@fivfold/core`: `StrategyPipeline`, `IGeneratorStrategy`, `IRealtimeStrategy` interfaces and registry
- `@fivfold/core`: `detectStack`, `parseGlobalFlags`, `getSmartDefaults` utilities
- `@fivfold/core`: Interactive prompts — `selectFramework`, `selectDatabaseCategory`, `selectDatabase`, `selectOrm`, `selectRealtimeProvider`
- `@fivfold/core`: `TemplateEngine` (Handlebars), `TsMorphEngine` for AST mutations
- `@fivfold/api`: `DomainStrategy`, `NestJsFrameworkStrategy`, `ExpressFrameworkStrategy`
- `@fivfold/api`: ORM strategies — `TypeOrmOrmStrategy`, `PrismaOrmStrategy`, `MongooseOrmStrategy`, `CosmosOrmStrategy`, `DynamoDbOrmStrategy`
- `@fivfold/api`: Push and realtime provider strategies — `PushProviderStrategy`, `RealtimeProviderStrategy`
- `@fivfold/api`: Kits — Email, Kanban, Push, Chat with Hexagonal Architecture output (ports → adapters → delivery)
- `@fivfold/ui`: Kits — Auth, Email, Kanban, Chat for React/Next.js with shadcn/ui and Tailwind CSS v4
- `fivfold-site`: Next.js 16 docs site at `fold.fivexlabs.com`
- GitHub Actions: `deploy-site.yml` (Vercel) and `publish-packages.yml` (npm) workflows
