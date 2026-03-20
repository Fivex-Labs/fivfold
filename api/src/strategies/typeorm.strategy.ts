import { resolve } from 'path';
import type { IOrmStrategy } from '@fivfold/core';
import type { GeneratorContext } from '@fivfold/core';
import { resolveOutputPath } from '@fivfold/core';

export class TypeOrmOrmStrategy implements IOrmStrategy {
  readonly name = 'typeorm';
  readonly ormName = 'typeorm';
  readonly layer = 'orm' as const;

  async generate(ctx: GeneratorContext): Promise<void> {
    const ormConfig = ctx.manifest.orm?.['typeorm'];
    if (!ormConfig?.files?.length) return;

    const outputContext = {
      ...ctx,
      moduleName: ctx.kitName.charAt(0).toUpperCase() + ctx.kitName.slice(1),
    };

    for (const file of ormConfig.files) {
      const content = ctx.templateEngine.renderTemplate(file.template, outputContext);
      const outputPath = resolveOutputPath(file.output, outputContext);
      const fullPath = resolve(ctx.projectRoot, outputPath);
      ctx.vfs.stageCreate(fullPath, content);
    }
  }
}
