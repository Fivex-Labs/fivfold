import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { KitManifest, UiKitManifest } from './schema.js';

export function resolveManifestPath(manifestsDir: string, kitName: string): string {
  return join(manifestsDir, `${kitName}.kit.json`);
}

export function loadManifest(manifestsDir: string, kitName: string): KitManifest {
  const path = resolveManifestPath(manifestsDir, kitName);
  if (!existsSync(path)) {
    throw new Error(`Manifest not found: ${path}`);
  }
  const content = readFileSync(path, 'utf8');
  return JSON.parse(content) as KitManifest;
}

export function loadUiManifest(manifestsDir: string, kitName: string): UiKitManifest {
  const path = resolveManifestPath(manifestsDir, kitName);
  if (!existsSync(path)) {
    throw new Error(`Manifest not found: ${path}`);
  }
  const content = readFileSync(path, 'utf8');
  return JSON.parse(content) as UiKitManifest;
}

export function resolveOutputPath(
  outputTemplate: string,
  context: { outputDir: string; kitName: string; [key: string]: unknown }
): string {
  let result = outputTemplate;
  for (const [key, value] of Object.entries(context)) {
    if (typeof value === 'string') {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
  }
  return result;
}
