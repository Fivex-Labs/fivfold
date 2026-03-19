import { Project } from 'ts-morph';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { registerModuleInAppModule } from './mutations/nestjs-module.js';
import { registerMiddlewareInExpressApp } from './mutations/express-middleware.js';
import { addImportIfNotPresent } from './mutations/import-injection.js';

export interface AstMutationResult {
  success: boolean;
  modified: boolean;
  content: string;
}

export class TsMorphEngine {
  private project: Project;
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.project = new Project({ useInMemoryFileSystem: false });
  }

  private resolvePath(filePath: string): string {
    return filePath.startsWith(this.projectRoot) ? filePath : join(this.projectRoot, filePath);
  }

  loadFile(filePath: string, content?: string): void {
    const fullPath = this.resolvePath(filePath);
    const fileContent = content ?? (existsSync(fullPath) ? readFileSync(fullPath, 'utf8') : null);
    if (!fileContent) throw new Error(`File not found: ${filePath}`);
    this.project.addSourceFileAtPath(fullPath);
  }

  registerNestJsModule(filePath: string, moduleName: string, importPath: string): AstMutationResult {
    const fullPath = this.resolvePath(filePath);
    let sourceFile = this.project.getSourceFile(fullPath);
    if (!sourceFile) {
      const content = readFileSync(fullPath, 'utf8');
      sourceFile = this.project.createSourceFile(fullPath, content, { overwrite: true });
    }
    const modified = registerModuleInAppModule(sourceFile, moduleName, importPath);
    return {
      success: true,
      modified,
      content: sourceFile.getFullText(),
    };
  }

  registerExpressMiddleware(
    filePath: string,
    routePath: string,
    importPath: string,
    importName: string
  ): AstMutationResult {
    const fullPath = this.resolvePath(filePath);
    let sourceFile = this.project.getSourceFile(fullPath);
    if (!sourceFile) {
      const content = readFileSync(fullPath, 'utf8');
      sourceFile = this.project.createSourceFile(fullPath, content, { overwrite: true });
    }
    const modified = registerMiddlewareInExpressApp(sourceFile, routePath, importPath, importName);
    return {
      success: true,
      modified,
      content: sourceFile.getFullText(),
    };
  }

  addImport(filePath: string, moduleSpecifier: string, namedImport: string, isDefault = false): AstMutationResult {
    const fullPath = this.resolvePath(filePath);
    let sourceFile = this.project.getSourceFile(fullPath);
    if (!sourceFile) {
      const content = readFileSync(fullPath, 'utf8');
      sourceFile = this.project.createSourceFile(fullPath, content, { overwrite: true });
    }
    const modified = addImportIfNotPresent(sourceFile, moduleSpecifier, namedImport, isDefault);
    return {
      success: true,
      modified,
      content: sourceFile.getFullText(),
    };
  }
}
