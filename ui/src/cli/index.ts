#!/usr/bin/env node
import { Command } from 'commander';
import { initProject } from './commands/init.js';
import { addKit } from './commands/add.js';
import { listKits } from './commands/list.js';
import { generateAgentsMd } from './commands/agents.js';
import { showSetup } from './commands/setup.js';
import { installSkills } from './commands/skills.js';
import type { BaseColor } from '../lib/schemas.js';

const program = new Command();

program
  .name('fivfold')
  .description('FivFold -- Full-stack Kits built on shadcn/ui')
  .version('0.14.3');

program
  .command('init')
  .description('Initialize FivFold in your project')
  .option('--yes, -y', 'Skip prompts, use smart defaults')
  .option('--dry-run', 'Preview changes without writing')
  .action(async (options: { yes?: boolean; dryRun?: boolean }) => {
    await initProject({ yes: options.yes, dryRun: options.dryRun });
  });

program
  .command('add')
  .description('Add one or more Kits to your project')
  .argument('<kits...>', 'Kit names (e.g. email kanban)')
  .option('--theme <color>', 'Override base color theme (neutral, slate, gray, zinc, stone)')
  .option('--yes, -y', 'Skip prompts')
  .option('--dry-run', 'Preview changes without writing')
  .action((kits: string[], options: { theme?: string; yes?: boolean; dryRun?: boolean }) => {
    const validColors = ['neutral', 'slate', 'gray', 'zinc', 'stone'];
    const themeOverride = options.theme && validColors.includes(options.theme)
      ? (options.theme as BaseColor)
      : undefined;

    if (options.theme && !themeOverride) {
      console.log(`\n  Invalid theme "${options.theme}". Use: neutral, slate, gray, zinc, stone\n`);
      return;
    }

    console.log(`\n  Adding ${kits.length} Kit${kits.length > 1 ? 's' : ''}: ${kits.join(', ')}\n`);
    addKit(kits, themeOverride, { yes: options.yes, dryRun: options.dryRun });
  });

program
  .command('list')
  .description('List all available Kits')
  .action(() => {
    listKits();
  });

program
  .command('agents')
  .description('Generate AGENTS.md for AI assistant compatibility')
  .option('--force', 'Overwrite existing AGENTS.md')
  .action((options: { force?: boolean }) => {
    generateAgentsMd(options.force ?? false);
  });

program
  .command('setup')
  .description('Show setup instructions and check requirements')
  .action(() => {
    showSetup();
  });

program
  .command('skills')
  .description('Install FivFold skills for your IDE (Cursor, VSCode, Cline, etc.)')
  .option('--yes, -y', 'Skip prompts, use defaults (Cursor, all skills)')
  .option('--dry-run', 'Preview changes without writing')
  .option('--ide <name>', 'IDE to install for (cursor, vscode, cline, windsurf, copilot, claude-code, other)')
  .option('--skill <name>', 'Skill to install (fivfold-kits, fivfold-api, or all)')
  .action(async (options: { yes?: boolean; dryRun?: boolean; ide?: string; skill?: string }) => {
    await installSkills({
      yes: options.yes,
      dryRun: options.dryRun,
      ide: options.ide,
      skill: options.skill,
    });
  });

program.parse();
