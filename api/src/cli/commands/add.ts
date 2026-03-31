import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type {
  ApiRegistry,
  ApiConfig,
  ApiFramework,
  ApiOrm,
  ApiDatabase,
  ApiAuthProvider,
  ApiDatabaseCategory,
} from '../../lib/schemas.js';
import { buildStackKey } from '../../lib/schemas.js';
import { findProjectRoot, loadFivFoldConfig } from '../../lib/workspace.js';
import {
  VirtualFileSystem,
  TemplateEngine,
  StrategyPipeline,
  loadManifest,
  detectPackageManager,
  getInstallCommand,
  runInstall,
  parseGlobalFlags,
  selectKitServiceProvider,
  selectRealtimeProvider,
  selectKitFeatures,
  mergeFeatureDependencyBlocks,
  type CliFlags,
} from '@fivfold/core';
import {
  DomainStrategy,
  TypeOrmOrmStrategy,
  PrismaOrmStrategy,
  MongooseOrmStrategy,
  CosmosOrmStrategy,
  DynamoDbOrmStrategy,
  NestJsFrameworkStrategy,
  ExpressFrameworkStrategy,
  PushProviderStrategy,
  RealtimeProviderStrategy,
} from '../../strategies/index.js';

function buildOrmStrategy(orm: string) {
  switch (orm) {
    case 'prisma': return new PrismaOrmStrategy();
    case 'mongoose': return new MongooseOrmStrategy();
    case 'cosmos-sdk': return new CosmosOrmStrategy();
    case 'dynamodb-sdk': return new DynamoDbOrmStrategy();
    default: return new TypeOrmOrmStrategy();
  }
}

function getPackageRoot(): string {
  const __filename = fileURLToPath(import.meta.url);
  return resolve(dirname(__filename), '../..');
}

function getManifestsDir(): string {
  return join(getPackageRoot(), 'manifests');
}

function getRegistryPath(name: string): string {
  return join(getPackageRoot(), 'registry', `${name}.json`);
}

function getTemplateRoot(): string {
  return join(getPackageRoot(), 'templates');
}

function manifestExists(name: string): boolean {
  return existsSync(join(getManifestsDir(), `${name}.kit.json`));
}

function printChatApiPostAddNotes(framework: string): void {
  console.log('\n  Next steps for Chat API (not auto-wired):');
  if (framework === 'nestjs') {
    console.log('    • Register ChatDevUserMiddleware in main.ts so req.user.id exists for REST handlers, or replace with JWT/guards.');
  } else {
    console.log('    • Wire auth so chat handlers receive a stable user id (e.g. session / JWT) matching your UI.');
  }
  console.log('    • Pair with the UI: X-User-Id header (or token) should match the client currentUser.id in dev.');
  console.log('    • Docs: https://fold.fivexlabs.com/docs/kits/chat#fullstack-checklist\n');
}

function stageCopyDir(vfs: VirtualFileSystem, src: string, destRoot: string, destRel: string): void {
  if (!existsSync(src)) return;

  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destRelPath = join(destRel, entry.name);
    const destFullPath = join(destRoot, destRelPath);

    if (entry.isDirectory()) {
      stageCopyDir(vfs, srcPath, destRoot, destRelPath);
    } else {
      const content = readFileSync(srcPath, 'utf8');
      vfs.stageCreate(destFullPath, content);
    }
  }
}

export async function addApiModule(names: string[], flags: CliFlags = {}): Promise<void> {
  const root = findProjectRoot();
  const config = loadFivFoldConfig(root);
  const parsedFlags = parseGlobalFlags(process.argv.slice(2));
  const effectiveFlags = { ...flags, ...parsedFlags };

  const framework = effectiveFlags.framework ?? config?.api?.framework ?? 'nestjs';
  const orm = effectiveFlags.orm ?? config?.api?.orm ?? 'typeorm';
  const database = effectiveFlags.database ?? config?.api?.database ?? 'postgres';
  const databaseCategory = effectiveFlags.dbCategory ?? config?.api?.databaseCategory;
  const authProvider = effectiveFlags.authProvider ?? config?.api?.authProvider;
  const outputDir = config?.api?.outputDir ?? 'src/modules';

  if (!config?.api && !effectiveFlags.framework && !effectiveFlags.orm) {
    console.log('\n  No API config found. Run: npx @fivfold/api init\n');
    console.log('  Or pass stack flags: npx @fivfold/api add email --framework=nestjs --orm=typeorm\n');
    return;
  }

  const api: ApiConfig = {
    framework: framework as ApiFramework,
    orm: orm as ApiOrm,
    database: database as ApiDatabase,
    databaseCategory: databaseCategory as ApiDatabaseCategory | undefined,
    authProvider: authProvider as ApiAuthProvider | undefined,
    outputDir,
  };
  const pm = detectPackageManager(root) as 'npm' | 'pnpm' | 'yarn';
  const vfs = new VirtualFileSystem();
  const resolvedProviders = new Map<string, string>();
  const resolvedRealtimeProviders = new Map<string, string>();
  const resolvedKitFeatures = new Map<string, string[]>();

  for (const name of names) {
    if (manifestExists(name)) {
      const { provider, realtimeProvider, kitFeatures } = await scaffoldWithManifest(
        name,
        api,
        root,
        vfs,
        effectiveFlags,
        config
      );
      if (provider) resolvedProviders.set(name, provider);
      if (realtimeProvider) resolvedRealtimeProviders.set(name, realtimeProvider);
      if (kitFeatures?.length) resolvedKitFeatures.set(name, kitFeatures);
    } else {
      const stackKey = buildStackKey(api);
      scaffoldLegacy(name, stackKey, api.outputDir, root, vfs);
    }
  }

  const staged = vfs.getStaged();
  if (staged.length === 0) {
    console.log('\n  No files to scaffold.\n');
    return;
  }

  if (effectiveFlags.dryRun) {
    console.log(vfs.preview(root));
    return;
  }

  try {
    vfs.commit(root);
  } catch (err) {
    console.error('  Scaffolding failed:', err);
    return;
  }

  const createdPaths = staged.map((op) => op.path.replace(root, '.').replace(/\\/g, '/'));

  for (const name of names) {
    if (manifestExists(name)) {
      const manifest = loadManifest(getManifestsDir(), name);
      const fwConfig = manifest.framework?.[api.framework];
      const ormConfig = manifest.orm?.[api.orm];
      const provider =
        resolvedProviders.get(name) ??
        effectiveFlags.provider ??
        config?.api?.provider;
      const realtimeProvider = resolvedRealtimeProviders.get(name) ?? effectiveFlags.realtime;
      const serviceConfig = provider ? manifest.services?.[provider] : undefined;
      const realtimeConfig = realtimeProvider ? manifest.realtime?.[realtimeProvider] : undefined;
      const kitFeats = resolvedKitFeatures.get(name);
      const fwMerged = mergeFeatureDependencyBlocks(
        fwConfig?.dependencies ?? [],
        fwConfig?.devDependencies,
        fwConfig?.featureDependencies,
        kitFeats
      );
      const ormMerged = mergeFeatureDependencyBlocks(
        ormConfig?.dependencies ?? [],
        ormConfig?.devDependencies,
        ormConfig?.featureDependencies,
        kitFeats
      );
      const svcMerged = serviceConfig
        ? mergeFeatureDependencyBlocks(
            serviceConfig.dependencies ?? [],
            serviceConfig.devDependencies,
            serviceConfig.featureDependencies,
            kitFeats
          )
        : { dependencies: [] as string[], devDependencies: [] as string[] };
      const rtMerged = realtimeConfig
        ? mergeFeatureDependencyBlocks(
            realtimeConfig.dependencies ?? [],
            realtimeConfig.devDependencies,
            undefined,
            kitFeats
          )
        : { dependencies: [] as string[], devDependencies: [] as string[] };
      const deps = [
        ...fwMerged.dependencies,
        ...ormMerged.dependencies,
        ...svcMerged.dependencies,
        ...rtMerged.dependencies,
      ];
      const devDeps = [
        ...fwMerged.devDependencies,
        ...ormMerged.devDependencies,
        ...svcMerged.devDependencies,
        ...rtMerged.devDependencies,
      ];
      const allDeps = [...new Set(deps)];
      const allDevDeps = [...new Set(devDeps)];

      if (allDeps.length > 0) {
        console.log('\n  Installing dependencies...');
        try {
          runInstall(root, pm, allDeps, false);
        } catch {
          console.log(`  Could not install automatically. Run:\n    ${getInstallCommand(pm, allDeps)}`);
        }
      }
      if (allDevDeps.length > 0) {
        try {
          runInstall(root, pm, allDevDeps, true);
        } catch {
          console.log(`  Could not install dev deps. Run:\n    ${getInstallCommand(pm, allDevDeps, true)}`);
        }
      }
    } else {
      const registryPath = getRegistryPath(name);
      if (!existsSync(registryPath)) continue;
      const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as ApiRegistry;
      const stackConfig = registry.stacks[buildStackKey(api)];
      if (!stackConfig) continue;

      if (stackConfig.dependencies?.length) {
        console.log('\n  Installing dependencies...');
        try {
          runInstall(root, pm, stackConfig.dependencies, false);
        } catch {
          console.log(`  Could not install automatically. Run:\n    ${getInstallCommand(pm, stackConfig.dependencies)}`);
        }
      }
      if (stackConfig.devDependencies?.length) {
        try {
          runInstall(root, pm, stackConfig.devDependencies, true);
        } catch {
          console.log(`  Could not install dev deps. Run:\n    ${getInstallCommand(pm, stackConfig.devDependencies, true)}`);
        }
      }
    }
  }

  for (const displayPath of createdPaths) {
    console.log(`  Created ${displayPath}`);
  }
  console.log(`\n  API module(s) scaffolded successfully!\n`);
  if (names.includes('chat')) {
    printChatApiPostAddNotes(framework);
  }
}

async function scaffoldWithManifest(
  name: string,
  api: ApiConfig,
  root: string,
  vfs: VirtualFileSystem,
  flags: CliFlags,
  config: { api?: { provider?: string; authProvider?: string } } | null
): Promise<{ provider?: string; realtimeProvider?: string; kitFeatures?: string[] }> {
  console.log(`\n  Scaffolding API module: ${name} (manifest)`);

  const manifestsDir = getManifestsDir();
  const templateRoot = getTemplateRoot();
  const manifest = loadManifest(manifestsDir, name);

  let kitFeatures: string[] | undefined;
  if (manifest.featurePrompt) {
    kitFeatures = await selectKitFeatures(manifest.featurePrompt, flags);
    console.log(`  Enabled kit features: ${kitFeatures.join(', ')}`);
  }

  // Resolve service provider (push/email etc.) — orthogonal to auth provider
  let provider: string | undefined;
  if (manifest.services && Object.keys(manifest.services).length > 0) {
    provider = flags.provider ?? config?.api?.provider;
    if (!provider) {
      provider = await selectKitServiceProvider(
        Object.keys(manifest.services),
        flags,
        manifest.serviceProviderPrompt
      );
    } else if (!manifest.services[provider]) {
      provider = Object.keys(manifest.services)[0];
    }
  }

  // Resolve realtime provider — auto-select if only one option; prompt only when multiple exist
  let realtimeProvider: string | undefined;
  if (manifest.realtime && Object.keys(manifest.realtime).length > 0) {
    const availableRealtimeProviders = Object.keys(manifest.realtime);
    if (availableRealtimeProviders.length === 1) {
      realtimeProvider = availableRealtimeProviders[0];
    } else {
      realtimeProvider = flags.realtime;
      if (!realtimeProvider || !availableRealtimeProviders.includes(realtimeProvider)) {
        realtimeProvider = await selectRealtimeProvider(availableRealtimeProviders, flags);
      }
    }
  }

  const templateEngine = new TemplateEngine(templateRoot);
  const pipeline = new StrategyPipeline();

  pipeline.register(new DomainStrategy());
  pipeline.register(buildOrmStrategy(api.orm));

  if (api.framework === 'nestjs') {
    pipeline.register(new NestJsFrameworkStrategy());
  } else if (api.framework === 'express') {
    pipeline.register(new ExpressFrameworkStrategy());
  }

  if (provider && manifest.services?.[provider]) {
    pipeline.register(new PushProviderStrategy(provider));
  }

  if (realtimeProvider && manifest.realtime?.[realtimeProvider]) {
    pipeline.register(new RealtimeProviderStrategy(realtimeProvider));
  }

  const providerNamePascal = provider
    ? provider.split(/[-_]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
    : undefined;

  const ctx = {
    kitName: name,
    projectRoot: root,
    outputDir: api.outputDir,
    framework: api.framework,
    orm: api.orm,
    database: api.database,
    databaseCategory: api.databaseCategory,
    // authProvider is read from config and passed through context but NEVER
    // constrains database/ORM selection — each concern is orthogonal
    authProvider: api.authProvider ?? config?.api?.authProvider,
    provider,
    providerNamePascal,
    realtimeProvider,
    kitFeatures,
    vfs,
    templateEngine,
    manifest,
  };

  await pipeline.execute(ctx);
  return { provider, realtimeProvider, kitFeatures };
}

function scaffoldLegacy(
  name: string,
  stackKey: string,
  outputDir: string,
  root: string,
  vfs: VirtualFileSystem
): void {
  console.log(`\n  Scaffolding API module: ${name}`);

  const registryPath = getRegistryPath(name);
  if (!existsSync(registryPath)) {
    console.log(`  Unknown module "${name}". Run: npx @fivfold/api list`);
    return;
  }

  const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as ApiRegistry;
  const stackConfig = registry.stacks[stackKey];

  if (!stackConfig) {
    console.log(`  Stack "${stackKey}" is not available for "${name}" yet.`);
    console.log('  Available stacks: ' + Object.keys(registry.stacks).join(', '));
    return;
  }

  const templateDir = join(getTemplateRoot(), name, stackKey);

  if (!existsSync(templateDir)) {
    console.log(`  Template not found: ${templateDir}`);
    return;
  }

  stageCopyDir(vfs, templateDir, root, join(outputDir, name));
}
