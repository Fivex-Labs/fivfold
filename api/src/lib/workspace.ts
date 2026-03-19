import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import type { FivFoldConfig, ApiConfig } from './schemas.js';

export function findProjectRoot(cwd: string = process.cwd()): string {
  let current = cwd;
  while (current !== dirname(current)) {
    if (existsSync(join(current, 'package.json'))) return current;
    current = dirname(current);
  }
  return cwd;
}

export function loadFivFoldConfig(root: string): FivFoldConfig | null {
  const path = join(root, 'fivfold.json');
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as FivFoldConfig;
  } catch {
    return null;
  }
}

export function saveApiConfig(root: string, apiConfig: ApiConfig): void {
  const path = join(root, 'fivfold.json');
  let config: FivFoldConfig = {};
  if (existsSync(path)) {
    try {
      config = JSON.parse(readFileSync(path, 'utf8')) as FivFoldConfig;
    } catch { /* use empty */ }
  }
  config.api = apiConfig;
  writeFileSync(path, JSON.stringify(config, null, 2), 'utf8');
}

export function detectPackageManager(root: string): 'npm' | 'pnpm' | 'yarn' {
  if (existsSync(join(root, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(root, 'yarn.lock'))) return 'yarn';
  return 'npm';
}
