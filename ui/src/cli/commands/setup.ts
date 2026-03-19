import { existsSync } from 'fs';
import { join } from 'path';
import { detectWorkspace, findConfig } from '../../lib/workspace.js';
import { detectTailwindV4 } from '../../lib/init-requirements.js';

export function showSetup(): void {
  const workspace = detectWorkspace();
  const configPath = findConfig(workspace);
  const hasShadcn = existsSync(join(workspace.root, 'components.json'));
  const hasTailwindV4 = detectTailwindV4(workspace.root);

  console.log('\n  FivFold Setup Guide\n');
  console.log('  Requirements (before `npx @fivfold/ui init`):');
  console.log('  ─────────────────────────────────────────────────');

  if (hasTailwindV4) {
    console.log('  Tailwind CSS v4 ..... detected in package.json');
  } else {
    console.log('  Tailwind CSS v4 ..... NOT FOUND');
    console.log('    Add tailwindcss@^4 or @tailwindcss/postcss / @tailwindcss/vite, then configure per Tailwind v4 docs.');
  }

  if (hasShadcn) {
    console.log('  shadcn/ui ............ detected (components.json)');
  } else {
    console.log('  shadcn/ui ............ NOT FOUND');
    console.log('    Run: npx shadcn@latest init');
  }

  if (configPath) {
    console.log('  fivfold.json ......... found');
  } else {
    console.log('  fivfold.json ......... NOT FOUND');
    console.log('    Run: npx @fivfold/ui init  (after the two items above)');
  }

  console.log('\n  Global CSS (Tailwind v4 + shadcn):');
  console.log('    Use @import "tailwindcss"; in your globals file (no tailwind.config.js).');

  console.log('\n  Quick start:');
  console.log('    1. Tailwind v4 + shadcn/ui in the project');
  console.log('    2. npx @fivfold/ui init');
  console.log('    3. npx @fivfold/ui add email    # or kanban, chat, …');
  console.log('    npx @fivfold/ui list             # see all Kits');
  console.log('    npx @fivfold/ui agents            # add AGENTS.md\n');
}
