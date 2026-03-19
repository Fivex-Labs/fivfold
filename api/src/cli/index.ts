#!/usr/bin/env node
import { Command } from 'commander';
import { initApi } from './commands/init.js';
import { addApiModule } from './commands/add.js';
import { listApiModules } from './commands/list.js';

const program = new Command();

program
  .name('fivfold-api')
  .description('FivFold API -- backend scaffolding for FivFold Kits')
  .version('0.13.4');

program
  .command('init')
  .description('Configure FivFold API (framework, ORM, database)')
  .option('--yes, -y', 'Skip prompts, use smart defaults and auto-detection')
  .option('--dry-run', 'Preview changes without writing')
  .option('--framework <name>', 'Framework (express|nestjs)')
  .option('--orm <name>', 'ORM (typeorm|prisma)')
  .option('--database <name>', 'Database (postgres)')
  .option('--output <path>', 'Output directory for modules')
  .action(async (opts) => {
    await initApi({
      yes: opts.yes,
      dryRun: opts.dryRun,
      framework: opts.framework,
      orm: opts.orm,
      database: opts.database,
      output: opts.output,
    });
  });

program
  .command('add')
  .description('Scaffold one or more API modules')
  .argument('<modules...>', 'Module names (e.g. email kanban push)')
  .option('--yes, -y', 'Skip prompts')
  .option('--dry-run', 'Preview changes without writing')
  .option('--framework <name>', 'Framework (express|nestjs)')
  .option('--orm <name>', 'ORM (typeorm|prisma|mongoose|cosmos-sdk|dynamodb-sdk)')
  .option('--database <name>', 'Database (postgres|mongodb|cosmosdb|dynamodb)')
  .option('--provider <name>', 'Push/auth provider (fcm|onesignal|sns|pushy|pusher-beams)')
  .action(async (modules: string[], opts) => {
    console.log(`\n  Scaffolding ${modules.length} module${modules.length > 1 ? 's' : ''}: ${modules.join(', ')}\n`);
    await addApiModule(modules, {
      yes: opts.yes,
      dryRun: opts.dryRun,
      framework: opts.framework,
      orm: opts.orm,
      database: opts.database,
      provider: opts.provider,
    });
  });

program
  .command('list')
  .description('List all available API modules')
  .action(() => {
    listApiModules();
  });

program.parse();
