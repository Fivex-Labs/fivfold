import { resolve } from 'path';
import type { IOrmStrategy, GeneratorContext } from '@fivfold/core';
import { resolveOutputPath, pascalCase, filterManifestFiles } from '@fivfold/core';

export class MongooseOrmStrategy implements IOrmStrategy {
  readonly name = 'mongoose';
  readonly ormName = 'mongoose';
  readonly layer = 'orm' as const;

  async generate(ctx: GeneratorContext): Promise<void> {
    const ormConfig = ctx.manifest.orm?.['mongoose'];
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
