import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'fs';
import { join } from 'path';

function copyDirRecursive(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const from = join(src, name);
    const to = join(dest, name);
    if (statSync(from).isDirectory()) {
      copyDirRecursive(from, to);
    } else {
      copyFileSync(from, to);
    }
  }
}

/**
 * shadcn CLI can mis-resolve `@/components` and create a literal `@{/components/...}` tree
 * at the project root. Merge those files into the real `src/components/ui` folder and remove `@`.
 */
export function repairMisplacedShadcnComponents(workspaceRoot: string): boolean {
  const misplacedRoot = join(workspaceRoot, '@', 'components', 'ui');
  if (!existsSync(misplacedRoot)) {
    return false;
  }

  const candidates = [
    join(workspaceRoot, 'src', 'components', 'ui'),
    join(workspaceRoot, 'components', 'ui'),
  ];
  const target = candidates.find((p) => existsSync(p)) ?? join(workspaceRoot, 'src', 'components', 'ui');
  mkdirSync(target, { recursive: true });
  copyDirRecursive(misplacedRoot, target);

  try {
    rmSync(join(workspaceRoot, '@'), { recursive: true, force: true });
  } catch {
    // ignore
  }

  console.log(
    `\n  Repaired shadcn output: moved misplaced @/components/ui into ${target.replace(workspaceRoot, '.')} and removed the stray @ folder.\n`
  );
  return true;
}
