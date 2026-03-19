import * as p from '@clack/prompts';
import type { ApiConfig } from '../../lib/schemas.js';
import { findProjectRoot, loadFivFoldConfig, saveApiConfig } from '../../lib/workspace.js';
import {
  detectStack,
  selectFramework,
  selectDatabaseCategory,
  selectOrm,
  selectDatabase,
  promptOutputDir,
  confirmOverwrite,
  parseGlobalFlags,
  getOrmOptionsForDatabase,
  type CliFlags,
} from '@fivfold/core';

export async function initApi(flags: CliFlags = {}): Promise<void> {
  const root = findProjectRoot();
  const existing = loadFivFoldConfig(root);
  const parsedFlags = parseGlobalFlags(process.argv.slice(2));

  p.intro('FivFold API -- Backend Scaffolding');

  const effectiveFlags = { ...flags, ...parsedFlags };
  if (existing?.api && !effectiveFlags.yes) {
    const overwrite = await confirmOverwrite(
      `API config found (${existing.api.framework} + ${existing.api.orm} + ${existing.api.database}). Overwrite?`,
      effectiveFlags
    );
    if (!overwrite) {
      p.cancel('Keeping existing config.');
      return;
    }
  }

  const detected = detectStack(root);

  const framework = (await selectFramework(detected, effectiveFlags)) as 'express' | 'nestjs';

  // Sequential DB selection: Category -> Database -> ORM (filtered by database)
  const dbCategory = await selectDatabaseCategory(detected, effectiveFlags);
  const database = await selectDatabase(detected, effectiveFlags, dbCategory);
  const ormOptions = getOrmOptionsForDatabase(database);

  // Auto-select ORM when only one option is available (e.g. Firebase, Cosmos, DynamoDB)
  let orm: string;
  if (ormOptions.length === 1) {
    orm = ormOptions[0];
    if (!effectiveFlags.yes) {
      p.note(`ORM auto-selected: ${orm} (only option for ${database})`, 'Auto');
    }
  } else {
    orm = await selectOrm(detected, effectiveFlags, database);
  }

  const outputDir = await promptOutputDir(effectiveFlags);

  const apiConfig: ApiConfig = {
    framework,
    orm,
    database,
    databaseCategory: dbCategory,
    outputDir,
  };

  if (parsedFlags.dryRun) {
    p.note(
      `Would write fivfold.json with:\n  Framework   : ${apiConfig.framework}\n  DB Category : ${apiConfig.databaseCategory}\n  Database    : ${apiConfig.database}\n  ORM         : ${apiConfig.orm}\n  Output      : ${apiConfig.outputDir}`,
      'Dry run'
    );
    return;
  }

  saveApiConfig(root, apiConfig);

  p.outro('API config saved to fivfold.json');
  console.log(`  Framework   : ${apiConfig.framework}`);
  console.log(`  DB Category : ${apiConfig.databaseCategory}`);
  console.log(`  Database    : ${apiConfig.database}`);
  console.log(`  ORM         : ${apiConfig.orm}`);
  console.log(`  Output      : ${apiConfig.outputDir}\n`);
  console.log('  Next steps:');
  console.log('    npx @fivfold/api add email    -- scaffold Email API module');
  console.log('    npx @fivfold/api add kanban   -- scaffold Kanban API module');
  console.log('    npx @fivfold/api add chat     -- scaffold Chat API module\n');
}
