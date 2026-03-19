import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ApiRegistry } from '../../lib/schemas.js';
import type { KitManifest } from '@fivfold/core';

export function listApiModules(): void {
  const __filename = fileURLToPath(import.meta.url);
  const packageRoot = resolve(dirname(__filename), '../..');
  const manifestsDir = join(packageRoot, 'manifests');
  const registryDir = join(packageRoot, 'registry');

  const manifestFiles = existsSync(manifestsDir)
    ? readdirSync(manifestsDir).filter((f) => f.endsWith('.kit.json'))
    : [];
  const registryFiles = existsSync(registryDir)
    ? readdirSync(registryDir).filter((f) => f.endsWith('.json'))
    : [];

  if (manifestFiles.length === 0 && registryFiles.length === 0) {
    console.log('\n  No API modules available.\n');
    return;
  }

  console.log('\n  Available FivFold API Modules\n');
  console.log('  ─────────────────────────────────────────────────────\n');

  for (const file of manifestFiles) {
    try {
      const manifest = JSON.parse(readFileSync(join(manifestsDir, file), 'utf8')) as KitManifest;
      const stacks = Object.keys(manifest.framework ?? {});
      console.log(`  ${manifest.name.padEnd(12)} ${manifest.description}`);
      console.log(`  Frameworks: ${stacks.join(', ')}`);
      console.log('');
    } catch {
      // skip malformed
    }
  }

  for (const file of registryFiles) {
    if (manifestFiles.some((m) => m.replace('.kit.json', '') === file.replace('.json', ''))) continue;
    try {
      const registry = JSON.parse(readFileSync(join(registryDir, file), 'utf8')) as ApiRegistry;
      console.log(`  ${registry.name.padEnd(12)} ${registry.description}`);
      console.log('  Available stacks:');
      for (const [stack, cfg] of Object.entries(registry.stacks)) {
        console.log(`    ${stack.padEnd(32)} deps: ${cfg.dependencies.slice(0, 3).join(', ')}${cfg.dependencies.length > 3 ? '...' : ''}`);
      }
      console.log('');
    } catch {
      // skip malformed
    }
  }

  console.log('  Usage:');
  console.log('    npx @fivfold/api init          # configure framework/ORM/database');
  console.log('    npx @fivfold/api add email     # scaffold Email API module');
  console.log('    npx @fivfold/api add kanban    # scaffold Kanban API module\n');
}
