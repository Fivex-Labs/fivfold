import { readFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import type { FivFoldConfig, BaseColor } from '../../lib/schemas.js';
import {
  detectWorkspace,
  findConfig,
  loadConfig,
  resolveKitsPath,
  resolveCssPath,
} from '../../lib/workspace.js';
import { applyFivFoldTheme, patchExistingCss } from '../../lib/theme.js';
import {
  VirtualFileSystem,
  detectPackageManager,
  runInstall,
  getInstallCommand,
  parseGlobalFlags,
  loadUiManifest,
  resolveOutputPath,
  type CliFlags,
} from '@fivfold/core';

function getPackageRoot(): string {
  const __filename = fileURLToPath(import.meta.url);
  return resolve(dirname(__filename), '../..');
}

function getManifestsDir(): string {
  return join(getPackageRoot(), 'manifests');
}

function getTemplatePath(templatePath: string): string {
  return join(getPackageRoot(), templatePath);
}

function installNpmDeps(deps: string[], pm: 'npm' | 'pnpm' | 'yarn', cwd: string): void {
  if (deps.length === 0) return;
  console.log(`\n  Installing npm dependencies...`);
  try {
    runInstall(cwd, pm, deps, false);
  } catch {
    console.log(`  Could not install automatically. Run:\n    ${getInstallCommand(pm, deps)}`);
  }
}

function installShadcnDeps(deps: string[], pm: 'npm' | 'pnpm' | 'yarn', cwd: string): void {
  if (deps.length === 0) return;
  const npxCmd = pm === 'pnpm' ? 'pnpm dlx' : pm === 'yarn' ? 'yarn dlx' : 'npx';
  console.log(`\n  Installing shadcn/ui dependencies...`);
  try {
    execSync(`${npxCmd} shadcn@latest add ${deps.join(' ')} --overwrite`, {
      stdio: 'inherit',
      cwd,
    });
  } catch {
    console.log(`  shadcn/ui install failed. Run manually:\n    ${npxCmd} shadcn@latest add ${deps.join(' ')}`);
  }
}

export function addKit(names: string[], themeOverride?: BaseColor, flags: CliFlags = {}): void {
  const workspace = detectWorkspace();
  const configPath = findConfig(workspace);
  const parsedFlags = parseGlobalFlags(process.argv.slice(2));
  const effectiveFlags = { ...flags, ...parsedFlags };

  if (!configPath) {
    console.log('\n  No fivfold.json found. Run: npx @fivfold/ui init\n');
    return;
  }

  const config = loadConfig(configPath);
  if (!config) {
    console.log('\n  Failed to load fivfold.json.\n');
    return;
  }

  const effectiveConfig: FivFoldConfig = themeOverride
    ? { ...config, theme: { ...config.theme, baseColor: themeOverride } }
    : config;

  const pm = detectPackageManager(workspace.root) as 'npm' | 'pnpm' | 'yarn';
  const vfs = new VirtualFileSystem();

  for (const name of names) {
    installKitToVfs(name, effectiveConfig, workspace, vfs);
  }

  const staged = vfs.getStaged();
  if (staged.length === 0) {
    console.log('\n  No files to add.\n');
    return;
  }

  if (effectiveFlags.dryRun) {
    console.log(vfs.preview(workspace.root));
    return;
  }

  try {
    vfs.commit(workspace.root);
  } catch (err) {
    console.error('  Add failed:', err);
    return;
  }

  for (const name of names) {
    try {
      const manifest = loadUiManifest(getManifestsDir(), name);
      installNpmDeps(manifest.dependencies, pm, workspace.root);
      installShadcnDeps(manifest.shadcnDependencies, pm, workspace.root);
    } catch {
      // Manifest not found - kit may have been added from old registry, skip deps
    }
  }

  const cssPath = resolveCssPath(effectiveConfig, workspace);
  if (effectiveConfig.theme.source === 'fivfold') {
    if (!existsSync(cssPath)) {
      applyFivFoldTheme(cssPath, effectiveConfig);
      console.log(`  Created ${effectiveConfig.theme.css}`);
    }
  } else {
    patchExistingCss(cssPath, effectiveConfig);
  }

  for (const op of staged) {
    const displayPath = op.path.replace(workspace.root, '.').replace(/\\/g, '/');
    console.log(`  Created ${displayPath}`);
  }

  const kitAlias = `${effectiveConfig.aliases.kits}/${names[0]}`;
  const exportName = names[0].charAt(0).toUpperCase() + names[0].slice(1) + 'Kit';
  console.log(`\n  ${names.join(', ')} Kit(s) added successfully!`);
  console.log(`\n  Usage:`);
  console.log(`    import { ${exportName} } from "${kitAlias}"`);
  console.log('');
}

function installKitToVfs(
  name: string,
  config: FivFoldConfig,
  workspace: ReturnType<typeof detectWorkspace>,
  vfs: VirtualFileSystem
): void {
  const manifestsDir = getManifestsDir();
  let manifest;
  try {
    manifest = loadUiManifest(manifestsDir, name);
  } catch {
    console.log(`  Unknown Kit "${name}". Run: npx @fivfold/ui list`);
    return;
  }

  const kitsDir = resolveKitsPath(config, workspace);
  const outputContext = { outputDir: kitsDir, kitName: name };

  for (const file of manifest.files) {
    const targetPath = resolveOutputPath(file.output, outputContext);
    const targetPathNorm = targetPath.replace(/\\/g, '/');

    const templatePath = getTemplatePath(file.template);
    if (!existsSync(templatePath)) {
      console.log(`  Template not found: ${file.template}`);
      continue;
    }

    let content = readFileSync(templatePath, 'utf8');

    if (config.rsc === false) {
      content = content.replace(/^"use client"\s*\n/m, '');
    }

    content = content.replace(/__KITS_ALIAS__/g, config.aliases.kits);

    vfs.stageCreate(targetPathNorm, content);
  }
}
