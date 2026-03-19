# @fivfold/api

> **DISCLAIMER:** This is a pre-alpha release and currently under heavy testing and scrutiny. Until the first stable version (v1.0.0) is released, we advise not to use this in production.

CLI for scaffolding backend modules (entities, DTOs, services, controllers) for Express and NestJS with TypeORM or Prisma for now, more coming soon.

## What is @fivfold/api

`@fivfold/api` scaffolds backend code for FivFold Kits. It generates domain ports, ORM entities, framework-specific services/controllers, and applies AST mutations (e.g., registering NestJS modules). Output follows Hexagonal Architecture (ports & adapters).

## Commands

| Command | Description | Options |
|---------|-------------|---------|
| `init` | Configure FivFold API (framework, ORM, database) | `--yes`, `--dry-run`, `--framework`, `--orm`, `--database`, `--output` |
| `add <module> [module...]` | Scaffold one or more API modules | `--yes`, `--dry-run`, `--framework`, `--orm` |
| `list` | List all available API modules | |

**Examples:**

```bash
npx @fivfold/api init --yes
npx @fivfold/api add kanban --framework=nestjs --orm=typeorm
npx @fivfold/api add email kanban --dry-run
```

## Manifests

**Location:** `api/manifests/`

**Structure:** Each module has a `*.kit.json` manifest (e.g., `kanban.kit.json`, `email.kit.json`).

Manifests define layers:

- **domain:** Ports, DTOs (framework-agnostic)
- **framework:** Express routes/services or NestJS modules/controllers/services
- **orm:** TypeORM/Prisma entities

Example structure:

```json
{
  "name": "kanban",
  "domain": {
    "files": [
      { "template": "kanban/domain/kanban.port.ts.hbs", "output": "{{outputDir}}/{{kitName}}/domain/kanban.port.ts" }
    ]
  },
  "framework": {
    "nestjs": {
      "files": [...],
      "dependencies": [...],
      "astMutations": [
        { "target": "src/app.module.ts", "action": "registerModule", "module": "KanbanModule", "importPath": "./modules/kanban/kanban.module" }
      ]
    },
    "express": { "files": [...], "dependencies": [...] }
  },
  "orm": {
    "typeorm": { "files": [...], "dependencies": [...] }
  }
}
```

## Strategies

Strategies implement `IGeneratorStrategy` (or `IFrameworkStrategy`, `IOrmStrategy`) and generate files for their layer.

| Strategy | Layer | Purpose |
|----------|-------|---------|
| `DomainStrategy` | domain | Ports, DTOs |
| `TypeOrmOrmStrategy` | orm | TypeORM entities |
| `PrismaOrmStrategy` | orm | Prisma schema/models |
| `NestJsFrameworkStrategy` | framework | NestJS modules, controllers, services |
| `ExpressFrameworkStrategy` | framework | Express routes, services |

**Location:** `api/src/strategies/`

## Templates

**Location:** `api/templates/`

**Format:** Handlebars (`.hbs`). Use `{{kitName}}`, `{{outputDir}}`, `{{framework}}`, `{{orm}}`, etc.

**Structure:** Layer-based:

```
templates/
├── kanban/
│   ├── domain/           # Ports, DTOs
│   ├── framework/
│   │   ├── express/      # Routes, services
│   │   └── nestjs/      # Module, controller, service
│   └── orm/
│       └── typeorm/     # Entities
└── email/
    └── ...
```

## Flow

**Manifest-based** (when `api/manifests/<name>.kit.json` exists):

1. Load manifest via `loadManifest`
2. Build `StrategyPipeline` with DomainStrategy, TypeOrmOrmStrategy, and framework strategy (NestJS or Express)
3. Execute pipeline: each strategy generates files from manifest + TemplateEngine, stages in VFS
4. AST mutations (e.g., `registerModuleInAppModule`) applied for NestJS
5. Commit VFS, install dependencies

**Legacy** (when manifest does not exist, `api/registry/<name>.json` exists):

1. Load registry JSON
2. Copy pre-built templates from `api/templates/<name>/<stackKey>/` (e.g., `kanban/nestjs-typeorm-postgres/`)
3. Stage in VFS, commit

## Dependencies

- `@fivfold/core` (workspace:*)
- `commander`

## Build

```bash
pnpm run build   # Output to dist/
pnpm run dev     # Watch mode
```

## Adding a New Kit

1. Create `api/manifests/<name>.kit.json` with domain, framework, orm layers
2. Create Handlebars templates in `api/templates/<name>/`
3. For NestJS: add `astMutations` to register module in `app.module.ts`
4. Run `npx @fivfold/api list` to verify
