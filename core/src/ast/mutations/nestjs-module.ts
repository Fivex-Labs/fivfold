import { SourceFile, SyntaxKind } from 'ts-morph';

export function registerModuleInAppModule(
  sourceFile: SourceFile,
  moduleName: string,
  importPath: string
): boolean {
  const classDecl = sourceFile.getClasses()[0];
  if (!classDecl) return false;

  const moduleDecorator = classDecl.getDecorator('Module');
  if (!moduleDecorator) return false;

  const callExpr = moduleDecorator.getCallExpression();
  if (!callExpr) return false;

  const arg = callExpr.getArguments()[0];
  if (!arg) return false;

  const obj = arg.asKind(SyntaxKind.ObjectLiteralExpression);
  if (!obj) return false;

  const importsProp = obj.getProperty('imports');
  if (!importsProp) return false;

  const init = importsProp.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
  if (!init) return false;

  const existingImports = init.getElements();
  const alreadyHas = existingImports.some((el) => el.getText().includes(moduleName));
  if (alreadyHas) return false;

  init.addElement(moduleName);

  const moduleSpecifier = importPath.replace(/\.ts$/, '');
  const hasImport = sourceFile.getImportDeclarations().some(
    (imp) =>
      imp.getModuleSpecifierValue().includes(moduleSpecifier) &&
      imp.getNamedImports().some((n) => n.getName() === moduleName)
  );
  if (!hasImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier,
      namedImports: [moduleName],
    });
  }

  return true;
}
