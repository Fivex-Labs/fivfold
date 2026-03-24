import { resolve } from 'path';
import type { IGeneratorStrategy } from '@fivfold/core';
import type { GeneratorContext } from '@fivfold/core';
import { resolveOutputPath, pascalCase } from '@fivfold/core';

export class DomainStrategy implements IGeneratorStrategy {
  readonly name = 'domain';
  readonly layer = 'domain' as const;

  async generate(ctx: GeneratorContext): Promise<void> {
    const { domain } = ctx.manifest;
    if (!domain?.files?.length) return;

    const outputContext = {
      ...ctx,
      moduleName: pascalCase(ctx.kitName),
    };

    for (const file of domain.files) {
      const content = ctx.templateEngine.renderTemplate(file.template, outputContext);
      const outputPath = resolveOutputPath(file.output, outputContext);
      const fullPath = resolve(ctx.projectRoot, outputPath);
      ctx.vfs.stageCreate(fullPath, content);
    }
  }
}
