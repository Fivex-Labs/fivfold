import type { AstMutation, FeatureDependencyBlock, ManifestFile } from './schema.js';

/** Include manifest entry when `features` is absent/empty, or any token matches enabled kit features. */
export function shouldIncludeForKitFeatures(
  entry: { features?: string[] },
  kitFeatures: string[] | undefined
): boolean {
  const required = entry.features;
  if (!required?.length) return true;
  const enabled = kitFeatures ?? [];
  return required.some((f) => enabled.includes(f));
}

export function filterManifestFiles(
  files: ManifestFile[] | undefined,
  kitFeatures: string[] | undefined
): ManifestFile[] {
  if (!files?.length) return [];
  return files.filter((f) => shouldIncludeForKitFeatures(f, kitFeatures));
}

export function filterAstMutations(
  mutations: AstMutation[] | undefined,
  kitFeatures: string[] | undefined
): AstMutation[] {
  if (!mutations?.length) return [];
  return mutations.filter((m) => shouldIncludeForKitFeatures(m, kitFeatures));
}

export function mergeFeatureDependencyBlocks(
  baseDeps: string[],
  baseDevDeps: string[] | undefined,
  blocks: FeatureDependencyBlock[] | undefined,
  kitFeatures: string[] | undefined
): { dependencies: string[]; devDependencies: string[] } {
  const deps = [...baseDeps];
  const devDeps = [...(baseDevDeps ?? [])];
  const enabled = kitFeatures ?? [];
  if (blocks?.length && enabled.length) {
    for (const block of blocks) {
      if (block.features.some((f) => enabled.includes(f))) {
        if (block.dependencies?.length) deps.push(...block.dependencies);
        if (block.devDependencies?.length) devDeps.push(...block.devDependencies);
      }
    }
  }
  return {
    dependencies: [...new Set(deps)],
    devDependencies: [...new Set(devDeps)],
  };
}
