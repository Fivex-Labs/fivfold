import { existsSync } from 'fs';
import { join } from 'path';
import { detectWorkspace, findConfig } from '../../lib/workspace.js';

export function showSetup(): void {
  const workspace = detectWorkspace();
  const configPath = findConfig(workspace);
  const hasShadcn = existsSync(join(workspace.root, 'components.json'));

  console.log('\n  FivFold Setup Guide\n');
  console.log('  Requirements:');
  console.log('  ─────────────────────────────────────────────────');

  if (hasShadcn) {
    console.log('  shadcn/ui ............ detected');
  } else {
    console.log('  shadcn/ui ............ NOT FOUND');
    console.log('    Run: npx shadcn@latest init');
  }

  if (configPath) {
    console.log('  fivfold.json ......... found');
  } else {
    console.log('  fivfold.json ......... NOT FOUND');
    console.log('    Run: npx @fivfold/ui init');
  }

  console.log('\n  Tailwind CSS v4:');
  console.log('    In your CSS file, add: @import "tailwindcss";');
  console.log('    No tailwind.config.js needed.\n');

  console.log('  Quick start:');
  console.log('    npx @fivfold/ui init         # configure FivFold');
  console.log('    npx @fivfold/ui add email    # add Email Kit');
  console.log('    npx @fivfold/ui add kanban   # add Kanban Kit');
  console.log('    npx @fivfold/ui list         # see all Kits');
  console.log('    npx @fivfold/ui agents       # add AGENTS.md\n');
}
