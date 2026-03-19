import type { SourceFile } from 'ts-morph';

export function addImportIfNotPresent(
  sourceFile: SourceFile,
  moduleSpecifier: string,
  namedImport: string,
  isDefault = false
): boolean {
  const existing = sourceFile.getImportDeclaration(moduleSpecifier);
  if (existing) {
    if (isDefault) {
      if (existing.getDefaultImport()) return false;
      existing.setDefaultImport(namedImport);
      return true;
    }
    const named = existing.getNamedImports().find((n) => n.getName() === namedImport);
    if (named) return false;
    existing.addNamedImport(namedImport);
    return true;
  }

  if (isDefault) {
    sourceFile.addImportDeclaration({
      moduleSpecifier,
      defaultImport: namedImport,
    });
  } else {
    sourceFile.addImportDeclaration({
      moduleSpecifier,
      namedImports: [namedImport],
    });
  }
  return true;
}
