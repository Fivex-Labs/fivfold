import type { VirtualFileSystem } from '../vfs/virtual-file-system.js';
import type { TemplateEngine } from '../template/engine.js';
import type { KitManifest } from '../manifest/schema.js';

export type StrategyLayer = 'domain' | 'framework' | 'orm' | 'realtime' | 'auth' | 'delivery' | 'provider';

export interface GeneratorContext {
  kitName: string;
  projectRoot: string;
  outputDir: string;
  framework: string;
  orm: string;
  database: string;
  databaseCategory?: string;
  authProvider?: string;
  provider?: string;
  realtimeProvider?: string;
  /** PascalCase version of provider name, e.g. "SocketIo", "FirebaseFirestore" */
  providerNamePascal?: string;
  /** Enabled kit feature tokens when manifest defines `featurePrompt` (e.g. Stripe). */
  kitFeatures?: string[];
  vfs: VirtualFileSystem;
  templateEngine: TemplateEngine;
  manifest: KitManifest;
}

export interface IGeneratorStrategy {
  readonly name: string;
  readonly layer: StrategyLayer;
  generate(ctx: GeneratorContext): Promise<void>;
}

export interface IFrameworkStrategy extends IGeneratorStrategy {
  readonly frameworkName: string;
  wireModule(ctx: GeneratorContext, moduleName: string): Promise<void>;
}

export interface IOrmStrategy extends IGeneratorStrategy {
  readonly ormName: string;
}

export interface IAuthProviderStrategy extends IGeneratorStrategy {
  readonly providerName: string;
  generateAdapter(ctx: GeneratorContext): Promise<void>;
  generateEnvTemplate(ctx: GeneratorContext): Promise<void>;
}

export interface IServiceProviderStrategy extends IGeneratorStrategy {
  readonly providerName: string;
  generateAdapter(ctx: GeneratorContext): Promise<void>;
}

export interface IRealtimeStrategy extends IGeneratorStrategy {
  readonly realtimeName: string;
  generateGateway(ctx: GeneratorContext): Promise<void>;
}
