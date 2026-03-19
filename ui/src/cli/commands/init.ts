import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';
import * as p from '@clack/prompts';
import type { FivFoldConfig, StylePreset, BaseColor, IconLibrary, ThemeSource } from '../../lib/schemas.js';
import { DEFAULT_CONFIG, STYLE_RADIUS } from '../../lib/schemas.js';
import { detectWorkspace, resolveCssPath } from '../../lib/workspace.js';
import { detectShadcnUi, applyFivFoldTheme, patchExistingCss } from '../../lib/theme.js';
import { parseGlobalFlags, detectPackageManager, type CliFlags } from '@fivfold/core';

export async function initProject(flags: CliFlags = {}): Promise<void> {
  const workspace = detectWorkspace();
  const hasShadcn = detectShadcnUi(workspace.root);
  const hasExistingConfig = existsSync(join(workspace.root, 'fivfold.json'));
  const parsedFlags = parseGlobalFlags(process.argv.slice(2));
  const effectiveFlags = { ...flags, ...parsedFlags };

  p.intro('FivFold -- Full-Stack Kits');

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
    config = { ...DEFAULT_CONFIG };
  } else {
    if (hasShadcn) {
      p.log.message('shadcn/ui detected (components.json found).');
    } else {
      p.log.message('shadcn/ui not detected. FivFold kits require shadcn/ui components.');
      p.log.message('We will set up shadcn/ui for you after configuration.');
    }

    const baseColor = await p.select({
      message: 'Choose a shadcn/ui base color:',
      options: [
        { value: 'neutral', label: 'Neutral (recommended)' },
        { value: 'slate', label: 'Slate' },
        { value: 'gray', label: 'Gray' },
        { value: 'zinc', label: 'Zinc' },
        { value: 'stone', label: 'Stone' },
      ],
      initialValue: 'neutral',
    });
    if (p.isCancel(baseColor)) {
      p.cancel('Setup cancelled.');
      return;
    }

    const style = await p.select({
      message: 'Choose a style preset:',
      options: [
        { value: 'mesa', label: 'Mesa  -- classic, balanced' },
        { value: 'ridge', label: 'Ridge -- compact' },
        { value: 'dune', label: 'Dune  -- soft, rounded' },
        { value: 'slate', label: 'Slate -- sharp, boxy' },
        { value: 'forge', label: 'Forge -- dense' },
      ],
      initialValue: 'mesa',
    });
    if (p.isCancel(style)) {
      p.cancel('Setup cancelled.');
      return;
    }

    let themeSource: ThemeSource = 'fivfold';
    if (hasShadcn) {
      const ts = await p.select({
        message: 'shadcn/ui theme detected. How would you like to handle theming?',
        options: [
          { value: 'shadcn', label: 'Keep my existing shadcn/ui theme' },
          { value: 'fivfold', label: 'Apply shadcn/ui theme (base color + style)' },
        ],
        initialValue: 'fivfold',
      });
      if (p.isCancel(ts)) {
        p.cancel('Setup cancelled.');
        return;
      }
      themeSource = ts as ThemeSource;
    }

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
      initialValue: 'src/styles/globals.css',
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
      style: style as StylePreset,
      font: font as string,
      iconLibrary: iconLibrary as IconLibrary,
      rsc: rsc as boolean,
      theme: {
        css: globalCss as string,
        baseColor: baseColor as BaseColor,
        source: themeSource,
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
      `Would write fivfold.json with:\n  Base color: ${config.theme.baseColor}\n  Style: ${config.style}\n  Theme: ${config.theme.source}\n  Font: ${config.font}\n  Global CSS: ${config.theme.css}\n  Kits alias: ${config.aliases.kits}`,
      'Dry run'
    );
    return;
  }

  p.log.message('Configuration summary:');
  console.log(`  Base color  : ${config.theme.baseColor}`);
  console.log(`  Style       : ${config.style}  (--radius: ${STYLE_RADIUS[config.style]})`);
  console.log(`  Theme source: ${config.theme.source}`);
  console.log(`  Font        : ${config.font}`);
  console.log(`  Icon library: ${config.iconLibrary}`);
  console.log(`  Global CSS  : ${config.theme.css}`);

  if (!effectiveFlags.yes) {
    const proceed = await p.confirm({
      message: 'Write fivfold.json and set up CSS?',
      initialValue: true,
    });
    if (p.isCancel(proceed) || !proceed) {
      p.cancel('Setup cancelled.');
      return;
    }
  }

  const configPath = join(workspace.root, 'fivfold.json');
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  p.log.success('Created fivfold.json');

  const cssPath = resolveCssPath(config, workspace);
  const cssDir = dirname(cssPath);
  if (!existsSync(cssDir)) mkdirSync(cssDir, { recursive: true });

  if (config.theme.source === 'fivfold') {
    applyFivFoldTheme(cssPath, config);
    p.log.success(`Updated ${config.theme.css} with FivFold theme`);
  } else {
    patchExistingCss(cssPath, config);
    p.log.success(`Added FivFold Kit variables to ${config.theme.css}`);
  }

  if (!hasShadcn) {
    p.log.message('Setting up shadcn/ui...');
    try {
      const pm = detectPackageManager(workspace.root);
      const npxCmd = pm === 'pnpm' ? 'pnpm dlx' : pm === 'yarn' ? 'yarn dlx' : 'npx';
      execSync(`${npxCmd} shadcn@latest init --yes`, { stdio: 'inherit', cwd: workspace.root });
      p.log.success('shadcn/ui initialized.');
    } catch {
      p.log.message('Could not auto-initialize shadcn/ui. Run: npx shadcn@latest init');
    }
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
