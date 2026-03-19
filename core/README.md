# @fivfold/core

> **DISCLAIMER:** This is a pre-alpha release and currently under heavy testing and scrutiny. Until the first stable version (v1.0.0) is released, we advise not to use this in production.

Shared engine for the FivFold CLI. Provides VFS, AST manipulation, manifests, strategies, templates, detection, and prompts. Framework-agnostic; used by both `@fivfold/ui` and `@fivfold/api`.

## What is @fivfold/core

`@fivfold/core` is the shared engine that powers all FivFold CLIs. It provides:

- **Virtual File System (VFS):** Stage changes in memory, preview, commit atomically
- **Strategy Pipeline:** Pluggable generators (domain, ORM, framework)
- **Manifests:** Load and resolve Kit manifests (`*.kit.json`)
- **Template Engine:** Handlebars-based templating with helpers
- **AST Engine:** ts-morph-based mutations for existing files
- **Detection:** Parse `package.json`, detect stack (NestJS, Express, TypeORM, etc.)
- **Prompts:** Parse CLI flags, smart defaults, interactive prompts
- **Workspace:** Find project root, run package manager commands

## Exports

All public API is exported from `@fivfold/core`:

### VFS

| Export | Description |
|--------|-------------|
| `VirtualFileSystem` | Stage create/modify/delete, preview, commit |
| `VfsOperation`, `VfsOperationType` | Types for staged operations |

### Strategy

| Export | Description |
|--------|-------------|
| `StrategyPipeline` | Orchestrates strategies in layers |
| `IGeneratorStrategy`, `IFrameworkStrategy`, `IOrmStrategy`, `IAuthProviderStrategy` | Strategy interfaces |
| `GeneratorContext`, `StrategyLayer` | Context and layer types |
| `registerStrategy`, `getStrategy`, `getStrategiesByLayer`, `clearStrategies` | Registry |

### Manifest

| Export | Description |
|--------|-------------|
| `loadManifest`, `loadUiManifest`, `resolveManifestPath`, `resolveOutputPath` | Load and resolve manifests |
| `KitManifest`, `UiKitManifest`, `ManifestFile`, `AstMutation`, `FrameworkLayerConfig`, `OrmLayerConfig`, `AuthProviderConfig` | Schema types |

### Template

| Export | Description |
|--------|-------------|
| `TemplateEngine`, `registerTemplateHelpers` | Handlebars engine and helpers |
| `camelCase`, `pascalCase`, `kebabCase`, `snakeCase` | Case conversion helpers |

### AST

| Export | Description |
|--------|-------------|
| `TsMorphEngine` | ts-morph wrapper for AST mutations |
| `AstMutationResult` | Result type |
| `registerModuleInAppModule` | NestJS: add module to `AppModule` |
| `registerMiddlewareInExpressApp` | Express: add middleware |
| `addImportIfNotPresent` | Add import statement |

### Detection

| Export | Description |
|--------|-------------|
| `detectStack`, `detectPackageManager` | Detect framework, ORM, package manager |
| `DetectedStack` | Detected stack type |
| `parsePackageJson`, `hasDependency` | Parse and query package.json |
| `PackageJson` | Package.json type |

### Prompt

| Export | Description |
|--------|-------------|
| `parseGlobalFlags` | Parse --yes, --dry-run, etc. |
| `CliFlags` | Parsed flags type |
| `getSmartDefaults` | Defaults based on detected stack |
| `SmartDefaults` | Smart defaults type |
| `selectFramework`, `selectOrm`, `selectDatabase`, `promptOutputDir`, `selectAuthProvider`, `confirmOverwrite` | Interactive prompts |

### Workspace

| Export | Description |
|--------|-------------|
| `findProjectRoot` | Find project root from cwd |
| `WorkspaceInfo` | Workspace info type |
| `getInstallCommand`, `runInstall` | Package manager install |
| `PackageManager` | Package manager type |

## Key Modules

| Path | Contents |
|------|----------|
| `src/vfs/` | VirtualFileSystem, stageCreate/Modify/Delete, preview, commit |
| `src/strategy/` | StrategyPipeline, IGeneratorStrategy, registry |
| `src/manifest/` | loadManifest, loadUiManifest, schema types |
| `src/template/` | TemplateEngine (Handlebars), helpers |
| `src/ast/` | TsMorphEngine, mutations (registerModuleInAppModule, etc.) |
| `src/detection/` | detectStack, parsePackageJson |
| `src/prompt/` | parseGlobalFlags, getSmartDefaults, interactive prompts |
| `src/workspace/` | findProjectRoot, getInstallCommand, runInstall |

## Usage

`@fivfold/ui` and `@fivfold/api` depend on `@fivfold/core` via `workspace:*`:

```json
{
  "dependencies": {
    "@fivfold/core": "workspace:*"
  }
}
```

## Build

```bash
pnpm run build   # Build to dist/
pnpm run dev     # Watch mode
```

## Adding New Capabilities

- **New AST mutations:** Add to `src/ast/mutations/`, export from `index.ts`
- **New strategies:** Implement `IGeneratorStrategy` (or framework/ORM interfaces) in the api package; core provides the pipeline
- **New template helpers:** Use `registerTemplateHelpers` in the api package
