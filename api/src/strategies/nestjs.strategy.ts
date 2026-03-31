import { resolve } from 'path';
import { existsSync } from 'fs';
import type { IFrameworkStrategy } from '@fivfold/core';
import type { GeneratorContext } from '@fivfold/core';
import {
  resolveOutputPath,
  TsMorphEngine,
  pascalCase,
  filterManifestFiles,
  filterAstMutations,
  type AstMutation,
} from '@fivfold/core';

export class NestJsFrameworkStrategy implements IFrameworkStrategy {
  readonly name = 'nestjs';
  readonly frameworkName = 'nestjs';
  readonly layer = 'framework' as const;

  async generate(ctx: GeneratorContext): Promise<void> {
    const fwConfig = ctx.manifest.framework?.['nestjs'];
    const files = filterManifestFiles(fwConfig?.files, ctx.kitFeatures);
    if (!files.length) return;

    const outputContext = {
      ...ctx,
      moduleName: pascalCase(ctx.kitName),
    };

    for (const file of files) {
      const content = ctx.templateEngine.renderTemplate(file.template, outputContext);
      const outputPath = resolveOutputPath(file.output, outputContext);
      const fullPath = resolve(ctx.projectRoot, outputPath);
      ctx.vfs.stageCreate(fullPath, content);
    }

    if (fwConfig?.astMutations?.length) {
      await this.applyAstMutations(ctx, fwConfig.astMutations);
    }
  }

  async wireModule(ctx: GeneratorContext, _moduleName: string): Promise<void> {
    const fwConfig = ctx.manifest.framework?.['nestjs'];
    const mutation = filterAstMutations(fwConfig?.astMutations, ctx.kitFeatures).find(
      (m) => m.action === 'registerModule'
    );
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

  private async applyAstMutations(ctx: GeneratorContext, mutations: AstMutation[]): Promise<void> {
    const engine = new TsMorphEngine(ctx.projectRoot);

    for (const m of filterAstMutations(mutations, ctx.kitFeatures)) {
      const targetPath = this.resolveTarget(ctx, m.target);
      if (!targetPath || !existsSync(targetPath)) continue;

      if (m.action === 'registerModule' && m.module && m.importPath) {
        const result = engine.registerNestJsModule(targetPath, m.module, m.importPath);
        if (result.modified) {
          ctx.vfs.stageModify(targetPath, result.content);
        }
      } else if (m.action === 'enableNestRawBody') {
        const result = engine.enableNestRawBody(targetPath);
        if (result.modified) {
          ctx.vfs.stageModify(targetPath, result.content);
        }
      } else if (m.action === 'addImport' && m.importPath && m.namedImport) {
        const result = engine.addImport(targetPath, m.importPath, m.namedImport, false);
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
