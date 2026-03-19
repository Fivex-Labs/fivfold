# Contributing to @fivfold/api

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) in the repository root for general guidelines.

## API-Specific Notes

`@fivfold/api` scaffolds backend code for FivFold Kits. Output follows Hexagonal Architecture (ports & adapters).

### Adding a New Module

1. Create `api/manifests/<name>.kit.json` with domain, framework, orm layers
2. Create Handlebars templates in `api/templates/<name>/`
3. For NestJS: add `astMutations` to register module in `app.module.ts`
4. Run `npx @fivfold/api list` to verify

### Strategies

| Strategy | Layer | Purpose |
|----------|-------|---------|
| DomainStrategy | domain | Ports, DTOs |
| TypeOrmOrmStrategy | orm | TypeORM entities |
| PrismaOrmStrategy | orm | Prisma schema/models |
| NestJsFrameworkStrategy | framework | NestJS modules, controllers, services |
| ExpressFrameworkStrategy | framework | Express routes, services |

### Build

```bash
pnpm run build   # Output to dist/cli/
pnpm run dev     # Watch mode
```
