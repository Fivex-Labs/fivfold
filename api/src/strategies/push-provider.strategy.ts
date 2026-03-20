import { resolve } from 'path';
import type { IServiceProviderStrategy } from '@fivfold/core';
import type { GeneratorContext } from '@fivfold/core';
import { resolveOutputPath } from '@fivfold/core';

export class PushProviderStrategy implements IServiceProviderStrategy {
  readonly name: string;
  readonly providerName: string;
  readonly layer = 'provider' as const;

  constructor(providerName: string) {
    this.providerName = providerName;
    this.name = `push-provider-${providerName}`;
  }

  async generate(ctx: GeneratorContext): Promise<void> {
    const serviceConfig = ctx.manifest.services?.[this.providerName];
    if (!serviceConfig?.files?.length) return;

    const outputContext = {
      ...ctx,
      moduleName: ctx.kitName.charAt(0).toUpperCase() + ctx.kitName.slice(1),
      providerName: this.providerName,
      providerNamePascal: this.providerName
        .split(/[-_]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(''),
    };

    for (const file of serviceConfig.files) {
      const content = ctx.templateEngine.renderTemplate(file.template, outputContext);
      const outputPath = resolveOutputPath(file.output, outputContext);
      const fullPath = resolve(ctx.projectRoot, outputPath);
      ctx.vfs.stageCreate(fullPath, content);
    }
  }

  async generateAdapter(ctx: GeneratorContext): Promise<void> {
    await this.generate(ctx);
  }
}
