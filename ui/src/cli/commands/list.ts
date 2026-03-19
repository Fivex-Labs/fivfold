import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { UiKitManifest } from '@fivfold/core';

export function listKits(): void {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const packageRoot = resolve(__dirname, '../..');
  const manifestsDir = join(packageRoot, 'manifests');

  if (!existsSync(manifestsDir)) {
    console.log('\n  No Kits available.\n');
    return;
  }

  const files = readdirSync(manifestsDir).filter((f) => f.endsWith('.kit.json'));

  if (files.length === 0) {
    console.log('\n  No Kits available.\n');
    return;
  }

  console.log('\n  Available FivFold Kits\n');
  console.log('  ─────────────────────────────────────────────────────\n');

  for (const file of files) {
    try {
      const manifest = JSON.parse(
        readFileSync(join(manifestsDir, file), 'utf8')
      ) as UiKitManifest;

      console.log(`  ${manifest.name.padEnd(12)} ${manifest.description}`);
      console.log(
        `               shadcn/ui: ${manifest.shadcnDependencies.join(', ')}`
      );
      if (manifest.dependencies.length > 0) {
        console.log(`               npm deps : ${manifest.dependencies.join(', ')}`);
      }
      console.log('');
    } catch {
      // skip malformed manifest files
    }
  }

  console.log('  Usage:');
  console.log('    npx @fivfold/ui add email');
  console.log('    npx @fivfold/ui add kanban');
  console.log('    npx @fivfold/ui add email --theme zinc\n');
}
