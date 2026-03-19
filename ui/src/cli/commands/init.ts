import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import * as p from '@clack/prompts';
import type { FivFoldConfig, IconLibrary } from '../../lib/schemas.js';
import { DEFAULT_CONFIG } from '../../lib/schemas.js';
import { detectWorkspace, resolveCssPath } from '../../lib/workspace.js';
import { applyFivFoldTheme, patchExistingCss } from '../../lib/theme.js';
import { parseGlobalFlags, type CliFlags } from '@fivfold/core';
import {
  checkUiInitPrerequisites,
  readShadcnComponentsJson,
  inferBaseColorFromShadcn,
  defaultGlobalCssFromShadcn,
  warnIfGlobalsMissingTailwindImport,
  shadcnThemeStatusMessage,
} from '../../lib/init-requirements.js';

export async function initProject(flags: CliFlags = {}): Promise<void> {
  const workspace = detectWorkspace();
  const hasExistingConfig = existsSync(join(workspace.root, 'fivfold.json'));
  const parsedFlags = parseGlobalFlags(process.argv.slice(2));
  const effectiveFlags = { ...flags, ...parsedFlags };

  p.intro('FivFold -- Full-Stack Kits');

  const prereq = checkUiInitPrerequisites(workspace.root);
  if (!prereq.ok) {
    for (const line of prereq.lines) {
      console.log(line);
    }
    p.cancel('Prerequisites not met.');
    return;
  }

  const components = readShadcnComponentsJson(workspace.root);
  const inferredBase = inferBaseColorFromShadcn(components);
  p.log.message(shadcnThemeStatusMessage(components));

  if (hasExistingConfig && !effectiveFlags.yes) {
    const overwrite = await p.confirm({
      message: 'fivfold.json already exists. Overwrite?',
      initialValue: false,
    });
    if (p.isCancel(overwrite)) {
      p.cancel('Setup cancelled.');
      return;
    }
    if (!overwrite) {
      p.cancel('Setup cancelled.');
      return;
    }
  }

  let config: FivFoldConfig;

  if (effectiveFlags.yes || effectiveFlags.dryRun) {
    config = {
      ...DEFAULT_CONFIG,
      theme: {
        ...DEFAULT_CONFIG.theme,
        css: defaultGlobalCssFromShadcn(components),
        baseColor: inferredBase,
        source: 'shadcn',
      },
    };
  } else {
    const font = await p.select({
      message: 'Choose a font:',
      options: [
        { value: 'inter', label: 'Inter (recommended)' },
        { value: 'geist', label: 'Geist' },
        { value: 'plus-jakarta-sans', label: 'Plus Jakarta Sans' },
        { value: 'dm-sans', label: 'DM Sans' },
        { value: 'none', label: 'None (use system/existing font)' },
      ],
      initialValue: 'inter',
    });
    if (p.isCancel(font)) {
      p.cancel('Setup cancelled.');
      return;
    }

    const iconLibrary = await p.select({
      message: 'Choose an icon library:',
      options: [
        { value: 'lucide', label: 'Lucide (recommended)' },
        { value: 'tabler', label: 'Tabler Icons' },
        { value: 'phosphor', label: 'Phosphor Icons' },
        { value: 'remix', label: 'Remix Icons' },
        { value: 'hugeicons', label: 'HugeIcons' },
        { value: 'radix-icons', label: 'Radix Icons' },
      ],
      initialValue: 'lucide',
    });
    if (p.isCancel(iconLibrary)) {
      p.cancel('Setup cancelled.');
      return;
    }

    const globalCss = await p.text({
      message: 'Where is your global CSS file?',
      initialValue: defaultGlobalCssFromShadcn(components),
      validate: (v) => ((v ?? '').trim() ? undefined : 'Please enter a valid path'),
    });
    if (p.isCancel(globalCss)) {
      p.cancel('Setup cancelled.');
      return;
    }

    const kitsAlias = await p.text({
      message: 'Import alias for Kits:',
      initialValue: '@/components/ui/kits',
    });
    if (p.isCancel(kitsAlias)) {
      p.cancel('Setup cancelled.');
      return;
    }

    const rsc = await p.confirm({
      message: 'Are you using React Server Components?',
      initialValue: true,
    });
    if (p.isCancel(rsc)) {
      p.cancel('Setup cancelled.');
      return;
    }

    config = {
      ...DEFAULT_CONFIG,
      font: font as string,
      iconLibrary: iconLibrary as IconLibrary,
      rsc: rsc as boolean,
      theme: {
        css: globalCss as string,
        baseColor: inferredBase,
        source: 'shadcn',
        cssVariables: true,
      },
      aliases: {
        ...DEFAULT_CONFIG.aliases,
        kits: kitsAlias as string,
      },
    };
  }

  if (effectiveFlags.dryRun) {
    p.note(
      `Would write fivfold.json with:\n  Theme source: shadcn (existing theme)\n  Base color (metadata): ${config.theme.baseColor}\n  Style (default): ${config.style}\n  Font: ${config.font}\n  Global CSS: ${config.theme.css}\n  Kits alias: ${config.aliases.kits}`,
      'Dry run'
    );
    return;
  }

  p.log.message('Configuration summary:');
  console.log(`  Theme source: shadcn (your existing shadcn/ui CSS variables)`);
  console.log(`  Base color   : ${config.theme.baseColor} (for FivFold metadata)`);
  console.log(`  Style        : ${config.style}  (--radius when using FivFold theme generation)`);
  console.log(`  Font         : ${config.font}`);
  console.log(`  Icon library : ${config.iconLibrary}`);
  console.log(`  Global CSS   : ${config.theme.css}`);

  if (!effectiveFlags.yes) {
    const proceed = await p.confirm({
      message: 'Write fivfold.json and patch global CSS?',
      initialValue: true,
    });
    if (p.isCancel(proceed) || !proceed) {
      p.cancel('Setup cancelled.');
      return;
    }
  }

  const cssPath = resolveCssPath(config, workspace);
  warnIfGlobalsMissingTailwindImport(cssPath);

  const configPath = join(workspace.root, 'fivfold.json');
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  p.log.success('Created fivfold.json');

  const cssDir = dirname(cssPath);
  if (!existsSync(cssDir)) mkdirSync(cssDir, { recursive: true });

  if (config.theme.source === 'fivfold') {
    applyFivFoldTheme(cssPath, config);
    p.log.success(`Updated ${config.theme.css} with FivFold theme`);
  } else {
    patchExistingCss(cssPath, config);
    p.log.success(`Left ${config.theme.css} unchanged — kits use your existing shadcn/ui CSS variables.`);
  }

  p.outro('FivFold is ready!');
  console.log('  Next steps:');
  console.log('    npx @fivfold/ui add email    -- add the Email Kit');
  console.log('    npx @fivfold/ui add kanban   -- add the Kanban Kit');
  console.log('    npx @fivfold/ui list         -- see all available Kits\n');
}

export function loadOrCreateApiConfig(
  workspaceRoot: string,
  apiConfig: FivFoldConfig['api']
): void {
  const configPath = join(workspaceRoot, 'fivfold.json');
  let config: FivFoldConfig;

  if (existsSync(configPath)) {
    config = JSON.parse(readFileSync(configPath, 'utf8')) as FivFoldConfig;
  } else {
    config = { ...DEFAULT_CONFIG };
  }

  config.api = apiConfig;
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
}
