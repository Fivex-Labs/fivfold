import { resolve } from 'path';
import { existsSync } from 'fs';
import type { IFrameworkStrategy } from '@fivfold/core';
import type { GeneratorContext } from '@fivfold/core';
import { resolveOutputPath, TsMorphEngine } from '@fivfold/core';
import type { AstMutation } from '@fivfold/core';

export class ExpressFrameworkStrategy implements IFrameworkStrategy {
  readonly name = 'express';
  readonly frameworkName = 'express';
  readonly layer = 'framework' as const;

  async generate(ctx: GeneratorContext): Promise<void> {
    const fwConfig = ctx.manifest.framework?.['express'];
    if (!fwConfig?.files?.length) return;

    const outputContext = {
      outputDir: ctx.outputDir,
      kitName: ctx.kitName,
      moduleName: ctx.kitName.charAt(0).toUpperCase() + ctx.kitName.slice(1),
      ...ctx,
    };

    for (const file of fwConfig.files) {
      const content = ctx.templateEngine.renderTemplate(file.template, outputContext);
      const outputPath = resolveOutputPath(file.output, outputContext);
      const fullPath = resolve(ctx.projectRoot, outputPath);
      ctx.vfs.stageCreate(fullPath, content);
    }

    if (fwConfig.astMutations?.length) {
      await this.applyAstMutations(ctx, fwConfig.astMutations);
    }
  }

  async wireModule(ctx: GeneratorContext, _moduleName: string): Promise<void> {
    const fwConfig = ctx.manifest.framework?.['express'];
    const mutation = fwConfig?.astMutations?.find((m) => m.action === 'registerMiddleware');
    if (!mutation) return;

    await this.applyAstMutations(ctx, [mutation]);
  }

  private async applyAstMutations(ctx: GeneratorContext, mutations: AstMutation[]): Promise<void> {
    const engine = new TsMorphEngine(ctx.projectRoot);

    for (const m of mutations) {
      if (m.action !== 'registerMiddleware') continue;
      const { routePath, importPath, importName } = m;
      if (!routePath || !importPath || !importName) continue;

      const targetPath = this.resolveTarget(ctx, m.target);
      if (!targetPath || !existsSync(targetPath)) continue;

      const result = engine.registerExpressMiddleware(
        targetPath,
        routePath,
        importPath,
        importName
      );
      if (result.modified) {
        ctx.vfs.stageModify(targetPath, result.content);
      }
    }
  }

  private resolveTarget(ctx: GeneratorContext, target: string): string | null {
    const candidates = [
      resolve(ctx.projectRoot, target),
      resolve(ctx.projectRoot, 'src', target),
      resolve(ctx.projectRoot, 'src', 'app', target),
    ];
    return candidates.find((p) => existsSync(p)) ?? null;
  }
}
