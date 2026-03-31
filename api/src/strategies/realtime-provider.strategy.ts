import { resolve } from 'path';
import type { IRealtimeStrategy, GeneratorContext } from '@fivfold/core';
import { resolveOutputPath, pascalCase, filterManifestFiles } from '@fivfold/core';

export class RealtimeProviderStrategy implements IRealtimeStrategy {
  readonly layer = 'realtime' as const;

  constructor(private readonly provider: string) {}

  get name(): string {
    return `realtime:${this.provider}`;
  }

  get realtimeName(): string {
    return this.provider;
  }

  async generate(ctx: GeneratorContext): Promise<void> {
    await this.generateGateway(ctx);
  }

  async generateGateway(ctx: GeneratorContext): Promise<void> {
    const realtimeConfig = ctx.manifest.realtime?.[this.provider];
    if (!realtimeConfig?.files?.length) return;

    const realtimeNamePascal = this.provider
      .split(/[-_]/)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');

    const outputContext = {
      ...ctx,
      moduleName: pascalCase(ctx.kitName),
      realtimeProvider: this.provider,
      realtimeNamePascal,
    };

    for (const file of filterManifestFiles(realtimeConfig.files, ctx.kitFeatures)) {
      const content = ctx.templateEngine.renderTemplate(file.template, outputContext);
      const outputPath = resolveOutputPath(file.output, outputContext);
      const fullPath = resolve(ctx.projectRoot, outputPath);
      ctx.vfs.stageCreate(fullPath, content);
    }
  }
}
