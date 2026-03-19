import { existsSync, readdirSync, copyFileSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as p from '@clack/prompts';
import { detectWorkspace } from '../../lib/workspace.js';

const IDE_OPTIONS = [
  { value: 'cursor', label: 'Cursor' },
  { value: 'vscode', label: 'VSCode (with Copilot / Continue / etc.)' },
  { value: 'cline', label: 'Cline' },
  { value: 'windsurf', label: 'Windsurf' },
  { value: 'copilot', label: 'GitHub Copilot' },
  { value: 'claude-code', label: 'Claude Code' },
  { value: 'other', label: 'Other / Skip' },
] as const;

const SKILL_LABELS: Record<string, string> = {
  'fivfold-kits': 'FivFold Kits (import paths, theming, component conventions)',
  'fivfold-api': 'FivFold API (Hexagonal layout, ORM patterns)',
};

const IDE_PATHS: Record<string, string> = {
  cursor: '.cursor/skills',
  vscode: '.cursor/skills',
  cline: '.cline/skills',
  windsurf: '.cursor/skills',
  copilot: '.cursor/skills',
  'claude-code': '.cursor/skills',
  other: '.cursor/skills',
};

function getPackageRoot(): string {
  const __filename = fileURLToPath(import.meta.url);
  return resolve(dirname(__filename), '../..');
}

function getSkillsDir(): string {
  return join(getPackageRoot(), 'skills');
}

function getAvailableSkills(): string[] {
  const skillsDir = getSkillsDir();
  if (!existsSync(skillsDir)) return [];
  const entries = readdirSync(skillsDir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && existsSync(join(skillsDir, e.name, 'SKILL.md'))).map((e) => e.name);
}

export type SkillsOptions = {
  yes?: boolean;
  dryRun?: boolean;
  ide?: string;
  skill?: string;
};

export async function installSkills(options: SkillsOptions = {}): Promise<void> {
  const workspace = detectWorkspace();
  const projectRoot = workspace.root;
  const availableSkills = getAvailableSkills();

  if (availableSkills.length === 0) {
    console.log('\n  No FivFold skills available to install.\n');
    return;
  }

  const parsedIde = options.ide?.toLowerCase();
  const parsedSkill = options.skill?.toLowerCase();

  if (!options.yes && !options.dryRun) {
    p.intro('FivFold Skills');

    const ide =
      parsedIde && IDE_OPTIONS.some((o) => o.value === parsedIde)
        ? parsedIde
        : ((await p.select({
            message: 'Which IDE or AI coding agent are you using?',
            options: IDE_OPTIONS as unknown as { value: string; label: string }[],
            initialValue: 'cursor',
          })) as string);

    if (p.isCancel(ide)) {
      p.cancel('Setup cancelled.');
      return;
    }

    const skillOptions = [
      ...availableSkills.map((s) => ({
        value: s,
        label: SKILL_LABELS[s] ?? s,
      })),
      { value: 'all', label: 'All FivFold skills' },
    ];

    const skillValue =
      parsedSkill && (parsedSkill === 'all' || availableSkills.includes(parsedSkill))
        ? parsedSkill
        : ((await p.select({
            message: 'Which skill(s) do you want to install?',
            options: skillOptions,
            initialValue: availableSkills[0] ?? 'all',
          })) as string);

    if (p.isCancel(skillValue)) {
      p.cancel('Setup cancelled.');
      return;
    }

    await doInstall(projectRoot, ide, skillValue, availableSkills, options.dryRun ?? false);
  } else {
    const ide = parsedIde ?? 'cursor';
    const skillValue = parsedSkill ?? 'all';
    await doInstall(projectRoot, ide, skillValue, availableSkills, options.dryRun ?? false);
  }
}

async function doInstall(
  projectRoot: string,
  ide: string,
  skillValue: string,
  availableSkills: string[],
  dryRun: boolean
): Promise<void> {
  const targetDir = IDE_PATHS[ide] ?? '.cursor/skills';
  const installPath = join(projectRoot, targetDir);
  const skillsDir = getSkillsDir();

  const toInstall =
    skillValue === 'all' ? availableSkills : availableSkills.includes(skillValue) ? [skillValue] : [];

  if (toInstall.length === 0) {
    console.log(`\n  Unknown skill "${skillValue}". Available: ${getAvailableSkills().join(', ')}\n`);
    return;
  }

  if (dryRun) {
    console.log('\n  [dry-run] Would install:');
    for (const name of toInstall) {
      console.log(`    - ${name} -> ${join(installPath, name)}/`);
    }
    console.log('');
    return;
  }

  if (!existsSync(installPath)) {
    mkdirSync(installPath, { recursive: true });
  }

  for (const name of toInstall) {
    const srcSkillDir = join(skillsDir, name);
    const destSkillDir = join(installPath, name);
    if (!existsSync(destSkillDir)) {
      mkdirSync(destSkillDir, { recursive: true });
    }
    const srcFile = join(srcSkillDir, 'SKILL.md');
    const destFile = join(destSkillDir, 'SKILL.md');
    if (existsSync(srcFile)) {
      copyFileSync(srcFile, destFile);
      console.log(`\n  Installed ${name} to ${join(targetDir, name)}/`);
    }
  }

  console.log('\n  Done. Your AI assistant will use these skills when working in this project.\n');
}
