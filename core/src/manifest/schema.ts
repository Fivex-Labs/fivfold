export interface ManifestFile {
  template: string;
  output: string;
  mode?: 'create' | 'append';
  /** If set, file is generated only when at least one listed feature is enabled (see `KitManifest.featurePrompt`). */
  features?: string[];
}

export interface AstMutation {
  target: string;
  action: 'registerModule' | 'registerMiddleware' | 'addImport' | 'enableNestRawBody';
  module?: string;
  importPath?: string;
  /** For registerMiddleware: route path (e.g. /api/kanban) */
  routePath?: string;
  /** For registerMiddleware: imported router variable name */
  importName?: string;
  /** For addImport: named import symbol */
  namedImport?: string;
  /** If set, mutation runs only when at least one listed feature is enabled */
  features?: string[];
}

/** Extra dependencies when any listed feature is enabled */
export interface FeatureDependencyBlock {
  features: string[];
  dependencies?: string[];
  devDependencies?: string[];
}

export interface FrameworkLayerConfig {
  files: ManifestFile[];
  dependencies: string[];
  devDependencies?: string[];
  astMutations?: AstMutation[];
  /** Merged into dependencies when `features` intersects enabled kit features */
  featureDependencies?: FeatureDependencyBlock[];
}

export interface OrmLayerConfig {
  files: ManifestFile[];
  dependencies: string[];
  devDependencies?: string[];
  postInstall?: string;
  featureDependencies?: FeatureDependencyBlock[];
}

export interface AuthProviderConfig {
  files: ManifestFile[];
  dependencies: string[];
  devDependencies?: string[];
  envVars?: string[];
}

export interface ServiceProviderConfig {
  files: ManifestFile[];
  dependencies: string[];
  devDependencies?: string[];
  envVars?: string[];
  featureDependencies?: FeatureDependencyBlock[];
}

export interface RealtimeProviderConfig {
  files: ManifestFile[];
  dependencies: string[];
  devDependencies?: string[];
  envVars?: string[];
}

/** Optional CLI prompt copy when `services` has multiple providers (e.g. push, media-uploader). */
export interface ServiceProviderPromptConfig {
  message: string;
  labels: Record<string, string>;
}

/** Multi-select feature picker for kits (e.g. Stripe payments vs Connect vs Billing). */
export interface KitFeatureOption {
  value: string;
  label: string;
}

export interface KitFeaturePromptConfig {
  message: string;
  /** Used with `--yes` / `--dry-run` and as multiselect initial selection */
  defaultFeatures: string[];
  options: KitFeatureOption[];
}

export interface KitManifest {
  name: string;
  version: string;
  description: string;
  domain: {
    files: ManifestFile[];
  };
  framework: Record<string, FrameworkLayerConfig>;
  orm: Record<string, OrmLayerConfig>;
  auth?: Record<string, AuthProviderConfig>;
  services?: Record<string, ServiceProviderConfig>;
  realtime?: Record<string, RealtimeProviderConfig>;
  /** When set with `services`, drives `selectKitServiceProvider` labels and message. */
  serviceProviderPrompt?: ServiceProviderPromptConfig;
  /** When set, `api add <kit>` prompts for enabled features (multiselect) unless `--features` or `--yes` */
  featurePrompt?: KitFeaturePromptConfig;
}

export interface UiKitManifest {
  name: string;
  version: string;
  description: string;
  dependencies: string[];
  shadcnDependencies: string[];
  files: ManifestFile[];
  authProviders?: string[];
}
