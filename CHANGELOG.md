# Changelog

All notable changes to FivFold are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [Semantic Versioning](https://semver.org/).

> Run `pnpm release` from the monorepo root to bump versions and generate a new entry automatically.

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
