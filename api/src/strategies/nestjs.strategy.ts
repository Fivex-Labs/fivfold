import { resolve } from 'path';
import { existsSync } from 'fs';
import type { IFrameworkStrategy } from '@fivfold/core';
import type { GeneratorContext } from '@fivfold/core';
import { resolveOutputPath, TsMorphEngine } from '@fivfold/core';

export class NestJsFrameworkStrategy implements IFrameworkStrategy {
  readonly name = 'nestjs';
  readonly frameworkName = 'nestjs';
  readonly layer = 'framework' as const;

  async generate(ctx: GeneratorContext): Promise<void> {
    const fwConfig = ctx.manifest.framework?.['nestjs'];
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

  async wireModule(ctx: GeneratorContext, moduleName: string): Promise<void> {
    const fwConfig = ctx.manifest.framework?.['nestjs'];
    const mutation = fwConfig?.astMutations?.find((m) => m.action === 'registerModule');
    if (!mutation?.module || !mutation?.importPath) return;

    const targetPath = this.resolveTarget(ctx, mutation.target);
    if (!targetPath || !existsSync(targetPath)) return;

    const engine = new TsMorphEngine(ctx.projectRoot);
    const result = engine.registerNestJsModule(
      targetPath,
      mutation.module,
      mutation.importPath
    );
    if (result.modified) {
      ctx.vfs.stageModify(targetPath, result.content);
    }
  }

  private async applyAstMutations(
    ctx: GeneratorContext,
    mutations: Array<{ target: string; action: string; module?: string; importPath?: string }>
  ): Promise<void> {
    const engine = new TsMorphEngine(ctx.projectRoot);

    for (const m of mutations) {
      const targetPath = this.resolveTarget(ctx, m.target);
      if (!targetPath || !existsSync(targetPath)) continue;

      if (m.action === 'registerModule' && m.module && m.importPath) {
        const result = engine.registerNestJsModule(targetPath, m.module, m.importPath);
        if (result.modified) {
          ctx.vfs.stageModify(targetPath, result.content);
        }
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
