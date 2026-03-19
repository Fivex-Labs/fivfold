import { SourceFile } from 'ts-morph';

export function registerMiddlewareInExpressApp(
  sourceFile: SourceFile,
  routePath: string,
  importPath: string,
  importName: string
): boolean {
  const hasImport = sourceFile.getImportDeclarations().some(
    (imp) =>
      imp.getModuleSpecifierValue().includes(importPath.replace(/\.ts$/, '')) &&
      (imp.getDefaultImport()?.getText() === importName || imp.getNamedImports().some((n) => n.getName() === importName))
  );
  if (!hasImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: importPath.replace(/\.ts$/, ''),
      defaultImport: importName,
    });
  }

  const statements = sourceFile.getStatements();
  for (const stmt of statements) {
    const text = stmt.getText();
    if (text.includes('app.use') && text.includes(routePath)) return false;
  }

  sourceFile.addStatements(`app.use('${routePath}', ${importName});`);
  return true;
}
