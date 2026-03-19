import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import type { FivFoldConfig, StylePreset, BaseColor } from './schemas.js';
import { STYLE_RADIUS } from './schemas.js';

export function getThemeTemplatePath(baseColor: BaseColor): string {
  const packageRoot = resolve(dirname(new URL(import.meta.url).pathname), '../..');
  return join(packageRoot, 'templates', 'themes', `${baseColor}.css`);
}

export function getGlobalsTemplatePath(): string {
  const packageRoot = resolve(dirname(new URL(import.meta.url).pathname), '../..');
  return join(packageRoot, 'templates', 'globals.css');
}

export function generateThemeCss(baseColor: BaseColor, style: StylePreset): string {
  const themePath = getThemeTemplatePath(baseColor);
  let content = existsSync(themePath)
    ? readFileSync(themePath, 'utf8')
    : readFileSync(getGlobalsTemplatePath(), 'utf8');

  const radius = STYLE_RADIUS[style];
  content = content.replace(/--radius:\s*[^;]+;/, `--radius: ${radius};`);

  return content;
}

const FONT_IMPORTS: Record<string, string> = {
  inter: '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");',
  geist: '@import url("https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap");',
  'plus-jakarta-sans': '@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");',
  'dm-sans': '@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap");',
};

export function applyFivFoldTheme(cssPath: string, config: FivFoldConfig): void {
  let themeCss = generateThemeCss(config.theme.baseColor, config.style);

  if (config.font && config.font !== 'none' && FONT_IMPORTS[config.font]) {
    themeCss = FONT_IMPORTS[config.font] + '\n' + themeCss;
  }

  writeFileSync(cssPath, themeCss, 'utf8');
}

export function patchExistingCss(_cssPath: string, _config: FivFoldConfig): void {
  // No FivFold-specific variables. Kits use standard shadcn/ui CSS variables only.
}

export function detectShadcnUi(workspaceRoot: string): boolean {
  return existsSync(join(workspaceRoot, 'components.json'));
}
