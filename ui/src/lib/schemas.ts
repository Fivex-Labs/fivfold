export type StylePreset = 'mesa' | 'ridge' | 'dune' | 'slate' | 'forge';
export type BaseColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone';
export type IconLibrary = 'lucide' | 'tabler' | 'remix' | 'phosphor' | 'hugeicons' | 'radix-icons';
export type ThemeSource = 'fivfold' | 'shadcn';

export interface FivFoldConfig {
  $schema?: string;
  style: StylePreset;
  iconLibrary?: IconLibrary;
  font?: string;
  tsx: boolean;
  rsc?: boolean;
  theme: {
    css: string;
    baseColor: BaseColor;
    source: ThemeSource;
    cssVariables: boolean;
  };
  aliases: {
    components: string;
    utils: string;
    ui?: string;
    kits: string;
    hooks?: string;
    lib?: string;
  };
  api?: {
    framework: 'express' | 'nestjs';
    orm: 'typeorm';
    database: 'postgres';
    outputDir: string;
  };
}

export interface WorkspaceInfo {
  root: string;
  type: 'npm' | 'pnpm' | 'yarn' | 'single';
  workspaces: string[];
  currentWorkspace?: string | undefined;
}

export const STYLE_RADIUS: Record<StylePreset, string> = {
  mesa: '0.625rem',
  ridge: '0.5rem',
  dune: '0.75rem',
  slate: '0',
  forge: '0.375rem',
};

export const DEFAULT_CONFIG: FivFoldConfig = {
  $schema: 'https://fivfold.fivexlabs.com/schema.json',
  style: 'mesa',
  iconLibrary: 'lucide',
  font: 'inter',
  tsx: true,
  rsc: true,
  theme: {
    css: 'src/styles/globals.css',
    baseColor: 'neutral',
    source: 'fivfold',
    cssVariables: true,
  },
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
    ui: '@/components/ui',
    kits: '@/components/ui/kits',
    hooks: '@/hooks',
    lib: '@/lib',
  },
};
