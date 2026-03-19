# Contributing to @fivfold/ui

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) in the repository root for general guidelines.

## UI-Specific Notes

`@fivfold/ui` is the frontend Kits CLI. It adds pre-built UI components (Auth, Email, Kanban, etc.) to React and Next.js projects.

### Adding a New Kit

1. Create `ui/manifests/<name>.kit.json` with `name`, `description`, `files`, `dependencies`, `shadcnDependencies`
2. Create `ui/templates/<name>/` with template files
3. Use `__KITS_ALIAS__` in imports that reference the kits alias
4. Use `{{outputDir}}` and `{{kitName}}` in manifest `output` paths
5. Run `npx @fivfold/ui list` to verify the Kit appears

### Templates

Templates are copied as-is with two substitutions:
- **`__KITS_ALIAS__`** → replaced with `config.aliases.kits`
- **`"use client"`** → removed if `config.rsc === false`

### Build

```bash
pnpm run build   # Output to dist/cli/
pnpm run dev     # Watch mode
```
