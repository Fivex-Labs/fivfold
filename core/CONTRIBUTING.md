# Contributing to @fivfold/core

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) in the repository root for general guidelines.

## Core-Specific Notes

`@fivfold/core` is the shared engine used by both `@fivfold/ui` and `@fivfold/api`. Changes here affect both CLIs.

### Key Modules

- **vfs/** — Virtual File System (stage, preview, commit)
- **strategy/** — StrategyPipeline, interfaces, registry
- **manifest/** — Manifest loading and resolution
- **template/** — Handlebars engine and helpers
- **ast/** — TsMorphEngine and AST mutations
- **detection/** — Stack detection from package.json
- **prompt/** — CLI flags, smart defaults, interactive prompts
- **workspace/** — Project root, package manager commands

### Adding New Capabilities

- **New AST mutations:** Add to `src/ast/mutations/`, export from `index.ts`
- **New template helpers:** Use `registerTemplateHelpers` in the api package
- **New strategy interfaces:** Extend `IGeneratorStrategy` or layer-specific interfaces

### Build

```bash
pnpm run build   # Build to dist/
pnpm run dev     # Watch mode
```
