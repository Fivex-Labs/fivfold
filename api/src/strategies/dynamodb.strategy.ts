import { resolve } from 'path';
import type { IOrmStrategy, GeneratorContext } from '@fivfold/core';
import { resolveOutputPath } from '@fivfold/core';

export class DynamoDbOrmStrategy implements IOrmStrategy {
  readonly name = 'dynamodb-sdk';
  readonly ormName = 'dynamodb-sdk';
  readonly layer = 'orm' as const;

  async generate(ctx: GeneratorContext): Promise<void> {
    const ormConfig = ctx.manifest.orm?.['dynamodb-sdk'];
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
