import { existsSync, readFileSync } from 'fs';
import { join, dirname, relative } from 'path';
import type { WorkspaceInfo, FivFoldConfig } from './schemas.js';

export function detectWorkspace(cwd: string = process.cwd()): WorkspaceInfo {
  let currentDir = cwd;

  while (currentDir !== dirname(currentDir)) {
    const packageJsonPath = join(currentDir, 'package.json');
    const pnpmWorkspacePath = join(currentDir, 'pnpm-workspace.yaml');
    const yarnWorkspacePath = join(currentDir, 'yarn.lock');

    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as Record<string, unknown>;

      if (existsSync(pnpmWorkspacePath)) {
        const workspaces = parseWorkspaces(currentDir, 'pnpm');
        return {
          root: currentDir,
          type: 'pnpm',
          workspaces,
          currentWorkspace: findCurrentWorkspace(cwd, currentDir, workspaces) ?? undefined,
        };
      }

      if (packageJson['workspaces'] && existsSync(yarnWorkspacePath)) {
        const workspaces = parseWorkspaces(currentDir, 'yarn');
        return {
          root: currentDir,
          type: 'yarn',
          workspaces,
          currentWorkspace: findCurrentWorkspace(cwd, currentDir, workspaces) ?? undefined,
        };
      }

      if (packageJson['workspaces']) {
        const workspaces = parseWorkspaces(currentDir, 'npm');
        return {
          root: currentDir,
          type: 'npm',
          workspaces,
          currentWorkspace: findCurrentWorkspace(cwd, currentDir, workspaces) ?? undefined,
        };
      }
    }

    currentDir = dirname(currentDir);
  }

  return {
    root: cwd,
    type: 'single',
    workspaces: ['.'],
    currentWorkspace: '.',
  };
}

function parseWorkspaces(root: string, type: 'pnpm' | 'yarn' | 'npm'): string[] {
  const workspaces: string[] = [];

  if (type === 'pnpm') {
    const pnpmWorkspacePath = join(root, 'pnpm-workspace.yaml');
    if (existsSync(pnpmWorkspacePath)) {
      const content = readFileSync(pnpmWorkspacePath, 'utf8');
      const matches = content.match(/packages:\s*\n((?:\s*-\s*.+\n?)*)/);
      if (matches?.[1]) {
        for (const line of matches[1].split('\n')) {
          const match = line.match(/^\s*-\s*['"]?([^'"]+)['"]?/);
          if (match?.[1]) workspaces.push(match[1]);
        }
      }
    }
  } else {
    const packageJsonPath = join(root, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as Record<string, unknown>;
      const ws = packageJson['workspaces'];
      if (Array.isArray(ws)) {
        workspaces.push(...(ws as string[]));
      } else if (ws && typeof ws === 'object' && 'packages' in ws) {
        workspaces.push(...((ws as { packages: string[] }).packages));
      }
    }
  }

  return workspaces;
}

function findCurrentWorkspace(cwd: string, root: string, workspaces: string[]): string | null {
  const relativePath = relative(root, cwd);

  for (const workspace of workspaces) {
    if (workspace.includes('*')) {
      const pattern = workspace.replace('*', '');
      if (relativePath.startsWith(pattern)) return workspace;
    } else {
      if (relativePath.startsWith(workspace) || relativePath === workspace) return workspace;
    }
  }

  return null;
}

export function loadConfig(configPath: string): FivFoldConfig | null {
  try {
    if (!existsSync(configPath)) return null;
    return JSON.parse(readFileSync(configPath, 'utf8')) as FivFoldConfig;
  } catch {
    return null;
  }
}

export function findConfig(workspace: WorkspaceInfo): string | null {
  const searchPaths: string[] = [];

  if (workspace.currentWorkspace) {
    searchPaths.push(join(workspace.root, workspace.currentWorkspace, 'fivfold.json'));
  }
  searchPaths.push(join(workspace.root, 'fivfold.json'));

  for (const path of searchPaths) {
    if (existsSync(path)) return path;
  }

  return null;
}

export function resolveKitsPath(config: FivFoldConfig, workspace: WorkspaceInfo): string {
  const alias = config.aliases.kits;
  return resolveAlias(alias, workspace);
}

export function resolveAlias(alias: string, workspace: WorkspaceInfo): string {
  if (alias.startsWith('@workspace/')) {
    const workspacePath = alias.replace('@workspace/', '');
    return join(workspace.root, 'packages', workspacePath);
  }

  if (alias.startsWith('@/')) {
    const localPath = alias.replace('@/', '');
    const basePath = workspace.currentWorkspace
      ? join(workspace.root, workspace.currentWorkspace)
      : workspace.root;
    // Next.js app router uses app/, others use src/
    const appDir = join(basePath, 'app');
    const srcDir = join(basePath, 'src');
    if (existsSync(appDir)) return join(appDir, localPath);
    if (existsSync(srcDir)) return join(srcDir, localPath);
    return join(basePath, 'src', localPath);
  }

  return alias;
}

export function resolveCssPath(config: FivFoldConfig, workspace: WorkspaceInfo): string {
  const basePath = workspace.currentWorkspace
    ? join(workspace.root, workspace.currentWorkspace)
    : workspace.root;
  return join(basePath, config.theme.css);
}

export function detectPackageManager(workspace: WorkspaceInfo): 'npm' | 'pnpm' | 'yarn' {
  if (existsSync(join(workspace.root, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(workspace.root, 'yarn.lock'))) return 'yarn';
  return 'npm';
}
