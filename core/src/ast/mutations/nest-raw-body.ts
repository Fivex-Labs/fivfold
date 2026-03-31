import { SourceFile, SyntaxKind } from 'ts-morph';

/**
 * Ensures `NestFactory.create(AppModule, { rawBody: true })` (or merges rawBody into existing options).
 * Safe to call multiple times.
 */
export function enableNestRawBodyInMain(sourceFile: SourceFile): boolean {
  let modified = false;

  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  for (const call of calls) {
    const expr = call.getExpression();
    const text = expr.getText();
    if (!text.includes('NestFactory.create')) continue;

    const args = call.getArguments();
    if (args.length === 0) continue;

    if (args.length === 1) {
      call.addArgument(`{ rawBody: true }`);
      modified = true;
      break;
    }

    const second = args[1];
    if (second.getKind() === SyntaxKind.ObjectLiteralExpression) {
      const obj = second.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
      const hasRaw = obj.getProperties().some((prop) => {
        const pa = prop.asKind(SyntaxKind.PropertyAssignment);
        return pa?.getName() === 'rawBody';
      });
      if (hasRaw) break;
      obj.addPropertyAssignment({ name: 'rawBody', initializer: 'true' });
      modified = true;
      break;
    }

    // Second arg exists but is not an object literal — skip to avoid corrupting code
    break;
  }

  return modified;
}
