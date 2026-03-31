import { resolve } from 'path';
import type { IOrmStrategy } from '@fivfold/core';
import type { GeneratorContext } from '@fivfold/core';
import { resolveOutputPath, pascalCase, filterManifestFiles } from '@fivfold/core';

export class TypeOrmOrmStrategy implements IOrmStrategy {
  readonly name = 'typeorm';
  readonly ormName = 'typeorm';
  readonly layer = 'orm' as const;

  async generate(ctx: GeneratorContext): Promise<void> {
    const ormConfig = ctx.manifest.orm?.['typeorm'];
    if (!ormConfig?.files?.length) return;

    const outputContext = {
      ...ctx,
      moduleName: pascalCase(ctx.kitName),
    };

    for (const file of filterManifestFiles(ormConfig.files, ctx.kitFeatures)) {
      const content = ctx.templateEngine.renderTemplate(file.template, outputContext);
      const outputPath = resolveOutputPath(file.output, outputContext);
      const fullPath = resolve(ctx.projectRoot, outputPath);
      ctx.vfs.stageCreate(fullPath, content);
    }
  }
}
