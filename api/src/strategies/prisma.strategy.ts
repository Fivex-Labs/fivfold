import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import type { IOrmStrategy } from '@fivfold/core';
import type { GeneratorContext } from '@fivfold/core';
import { resolveOutputPath, pascalCase, filterManifestFiles } from '@fivfold/core';

export class PrismaOrmStrategy implements IOrmStrategy {
  readonly name = 'prisma';
  readonly ormName = 'prisma';
  readonly layer = 'orm' as const;

  async generate(ctx: GeneratorContext): Promise<void> {
    const ormConfig = ctx.manifest.orm?.['prisma'];
    if (!ormConfig?.files?.length) return;

    const outputContext = {
      ...ctx,
      moduleName: pascalCase(ctx.kitName),
    };

    for (const file of filterManifestFiles(ormConfig.files, ctx.kitFeatures)) {
      const content = ctx.templateEngine.renderTemplate(file.template, outputContext);
      const outputPath = resolveOutputPath(file.output, outputContext);
      const fullPath = resolve(ctx.projectRoot, outputPath);

      if (file.mode === 'append') {
        const existing = existsSync(fullPath) ? readFileSync(fullPath, 'utf8') : '';
        const separator = existing.trim().endsWith('}') ? '\n\n' : '\n';
        ctx.vfs.stageModify(fullPath, existing + separator + content);
      } else {
        ctx.vfs.stageCreate(fullPath, content);
      }
    }
  }
}
