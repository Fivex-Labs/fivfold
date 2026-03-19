export { VirtualFileSystem } from './vfs/virtual-file-system.js';
export type { VfsOperation, VfsOperationType } from './vfs/types.js';

export type {
  IGeneratorStrategy,
  IFrameworkStrategy,
  IOrmStrategy,
  IAuthProviderStrategy,
  IServiceProviderStrategy,
  IRealtimeStrategy,
  GeneratorContext,
  StrategyLayer,
} from './strategy/interfaces.js';
export { StrategyPipeline } from './strategy/pipeline.js';
export { registerStrategy, getStrategy, getStrategiesByLayer, clearStrategies } from './strategy/registry.js';

export type {
  KitManifest,
  UiKitManifest,
  ManifestFile,
  AstMutation,
  FrameworkLayerConfig,
  OrmLayerConfig,
  AuthProviderConfig,
  ServiceProviderConfig,
  RealtimeProviderConfig,
} from './manifest/schema.js';
export { loadManifest, loadUiManifest, resolveManifestPath, resolveOutputPath } from './manifest/resolver.js';

export { TemplateEngine, registerTemplateHelpers } from './template/engine.js';
export { camelCase, pascalCase, kebabCase, snakeCase } from './template/helpers.js';

export { TsMorphEngine } from './ast/ts-morph-engine.js';
export type { AstMutationResult } from './ast/ts-morph-engine.js';
export { registerModuleInAppModule } from './ast/mutations/nestjs-module.js';
export { registerMiddlewareInExpressApp } from './ast/mutations/express-middleware.js';
export { addImportIfNotPresent } from './ast/mutations/import-injection.js';

export { detectStack, detectPackageManager } from './detection/detector.js';
export type { DetectedStack, DatabaseCategory } from './detection/detector.js';
export { parsePackageJson, hasDependency } from './detection/parsers.js';
export type { PackageJson } from './detection/parsers.js';

export { parseGlobalFlags } from './prompt/flags.js';
export type { CliFlags } from './prompt/flags.js';
export { getSmartDefaults, getOrmOptionsForDatabase, getDatabaseOptionsForCategory } from './prompt/smart-defaults.js';
export type { SmartDefaults } from './prompt/smart-defaults.js';
export {
  selectFramework,
  selectDatabaseCategory,
  selectOrm,
  selectDatabase,
  promptOutputDir,
  selectAuthProvider,
  selectPushProvider,
  selectRealtimeProvider,
  confirmOverwrite,
} from './prompt/interactive.js';

export { findProjectRoot } from './workspace/workspace.js';
export type { WorkspaceInfo } from './workspace/workspace.js';
export { getInstallCommand, runInstall } from './workspace/package-manager.js';
export type { PackageManager } from './workspace/package-manager.js';
