import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { BaseColor } from './schemas.js';

const BASE_COLORS: readonly BaseColor[] = ['slate', 'gray', 'zinc', 'neutral', 'stone'];

const TAILWIND_V4_PACKAGES = [
  'tailwindcss',
  '@tailwindcss/postcss',
  '@tailwindcss/vite',
  '@tailwindcss/cli',
] as const;

function isWorkspaceOrLocalVersion(spec: string): boolean {
  return /^(workspace:|file:|link:|catalog:)/.test(spec.trim());
}

/** True if the dependency range clearly targets Tailwind CSS v4+. */
export function isTailwindV4Range(versionSpec: string): boolean {
  const s = versionSpec.trim();
  if (!s || s === '*') return false;
  if (isWorkspaceOrLocalVersion(s)) return true;
  if (/>=\s*4(?:\.|\s|,|$)/.test(s)) return true;
  if (/^[\^~]?4\.\d+/.test(s)) return true;
  const m = s.match(/^[\^~>=<]*\s*(\d+)\./);
  if (m) return parseInt(m[1], 10) >= 4;
  return false;
}

function readPackageJsonDeps(root: string): Record<string, string> {
  const path = join(root, 'package.json');
  if (!existsSync(path)) return {};
  try {
    const pkg = JSON.parse(readFileSync(path, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return { ...pkg.dependencies, ...pkg.devDependencies };
  } catch {
    return {};
  }
}

export function detectTailwindV4(root: string): boolean {
  const deps = readPackageJsonDeps(root);
  for (const name of TAILWIND_V4_PACKAGES) {
    const spec = deps[name];
    if (spec && isTailwindV4Range(spec)) return true;
  }
  return false;
}

export interface ShadcnComponentsJson {
  tailwind?: {
    css?: string;
    baseColor?: string;
  };
}

export function readShadcnComponentsJson(root: string): ShadcnComponentsJson | null {
  const path = join(root, 'components.json');
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as ShadcnComponentsJson;
  } catch {
    return null;
  }
}

export function inferBaseColorFromShadcn(components: ShadcnComponentsJson | null): BaseColor {
  const raw = components?.tailwind?.baseColor?.toLowerCase().trim();
  if (raw && (BASE_COLORS as readonly string[]).includes(raw)) {
    return raw as BaseColor;
  }
  return 'neutral';
}

/** User-facing line for init (detected shadcn theme metadata). */
export function shadcnThemeStatusMessage(components: ShadcnComponentsJson | null): string {
  const raw = components?.tailwind?.baseColor?.trim();
  if (!raw) {
    return 'No tailwind.baseColor in components.json; using neutral for FivFold metadata (your CSS theme is unchanged).';
  }
  const lower = raw.toLowerCase();
  if ((BASE_COLORS as readonly string[]).includes(lower)) {
    return `Using your existing shadcn/ui theme (base color: ${lower} from components.json).`;
  }
  return `tailwind.baseColor "${raw}" is not in the FivFold palette; using neutral for metadata (your CSS theme is unchanged).`;
}

export function defaultGlobalCssFromShadcn(components: ShadcnComponentsJson | null): string {
  const css = components?.tailwind?.css?.trim();
  if (css) return css;
  return 'src/styles/globals.css';
}

export interface UiInitPrerequisiteResult {
  ok: boolean;
  lines: string[];
}

export function checkUiInitPrerequisites(root: string): UiInitPrerequisiteResult {
  const lines: string[] = [];
  const hasShadcn = existsSync(join(root, 'components.json'));
  const hasTailwindV4 = detectTailwindV4(root);

  if (!hasShadcn) {
    lines.push('  shadcn/ui is required: no components.json found at the project root.');
    lines.push('    Add Tailwind CSS v4 and run: npx shadcn@latest init');
  }
  if (!hasTailwindV4) {
    lines.push('  Tailwind CSS v4 is required: add tailwindcss@^4 (or @tailwindcss/postcss / @tailwindcss/vite) to package.json.');
    lines.push('    See: https://tailwindcss.com/docs/installation');
  }

  if (lines.length > 0) {
    lines.unshift(
      '',
      '  FivFold UI cannot run init until prerequisites are installed:',
      ''
    );
    lines.push(
      '',
      '  After setup, run: npx @fivfold/ui init',
      ''
    );
  }

  return { ok: hasShadcn && hasTailwindV4, lines };
}

export function warnIfGlobalsMissingTailwindImport(cssPath: string): void {
  if (!existsSync(cssPath)) return;
  try {
    const content = readFileSync(cssPath, 'utf8');
    if (!/@import\s+["']tailwindcss["']/.test(content)) {
      console.log(
        `\n  Note: ${cssPath} does not contain @import "tailwindcss"; — Tailwind v4 projects usually need that line.\n`
      );
    }
  } catch {
    // ignore
  }
}
