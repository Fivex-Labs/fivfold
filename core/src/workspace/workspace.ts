import { existsSync } from 'fs';
import { join, dirname } from 'path';

export interface WorkspaceInfo {
  root: string;
  type: 'npm' | 'pnpm' | 'yarn' | 'single';
  workspaces: string[];
  currentWorkspace?: string;
}

export function findProjectRoot(cwd: string = process.cwd()): string {
  let current = cwd;
  while (current !== dirname(current)) {
    if (existsSync(join(current, 'package.json'))) return current;
    current = dirname(current);
  }
  return cwd;
}
