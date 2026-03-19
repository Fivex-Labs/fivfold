export interface ManifestFile {
  template: string;
  output: string;
  mode?: 'create' | 'append';
}

export interface AstMutation {
  target: string;
  action: 'registerModule' | 'registerMiddleware' | 'addImport';
  module?: string;
  importPath?: string;
  /** For registerMiddleware: route path (e.g. /api/kanban) */
  routePath?: string;
  /** For registerMiddleware: imported router variable name */
  importName?: string;
}

export interface FrameworkLayerConfig {
  files: ManifestFile[];
  dependencies: string[];
  devDependencies?: string[];
  astMutations?: AstMutation[];
}

export interface OrmLayerConfig {
  files: ManifestFile[];
  dependencies: string[];
  devDependencies?: string[];
  postInstall?: string;
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
}

export interface RealtimeProviderConfig {
  files: ManifestFile[];
  dependencies: string[];
  devDependencies?: string[];
  envVars?: string[];
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
