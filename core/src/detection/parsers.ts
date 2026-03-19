import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export function parsePackageJson(root: string): PackageJson | null {
  const path = join(root, 'package.json');
  if (!existsSync(path)) return null;
  try {
    const content = readFileSync(path, 'utf8');
    return JSON.parse(content) as PackageJson;
  } catch {
    return null;
  }
}

export function hasDependency(pkg: PackageJson | null, name: string): boolean {
  if (!pkg) return false;
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  return Object.keys(deps).some((d) => d === name || d.startsWith(`${name}/`));
}
