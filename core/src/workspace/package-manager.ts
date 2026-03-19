import { existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export function detectPackageManager(root: string): PackageManager {
  if (existsSync(join(root, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(root, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

export function getInstallCommand(pm: PackageManager, deps: string[], isDev = false): string {
  const depList = deps.join(' ');
  switch (pm) {
    case 'pnpm':
      return isDev ? `pnpm add -D ${depList}` : `pnpm add ${depList}`;
    case 'yarn':
      return isDev ? `yarn add --dev ${depList}` : `yarn add ${depList}`;
    default:
      return isDev ? `npm install --save-dev ${depList}` : `npm install ${depList}`;
  }
}

export function runInstall(root: string, pm: PackageManager, deps: string[], isDev = false): void {
  const cmd = getInstallCommand(pm, deps, isDev);
  execSync(cmd, { stdio: 'inherit', cwd: root });
}
