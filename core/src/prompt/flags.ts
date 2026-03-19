export interface CliFlags {
  yes?: boolean;
  dryRun?: boolean;
  framework?: string;
  dbCategory?: string;
  orm?: string;
  database?: string;
  provider?: string;
  authProvider?: string;
  realtime?: string;
  output?: string;
}

export function parseGlobalFlags(args: string[]): CliFlags {
  const flags: CliFlags = {};
  for (const arg of args) {
    if (arg === '--yes' || arg === '-y') flags.yes = true;
    else if (arg === '--dry-run') flags.dryRun = true;
    else if (arg.startsWith('--framework=')) flags.framework = arg.split('=')[1];
    else if (arg.startsWith('--db-category=')) flags.dbCategory = arg.split('=')[1];
    else if (arg.startsWith('--orm=')) flags.orm = arg.split('=')[1];
    else if (arg.startsWith('--database=')) flags.database = arg.split('=')[1];
    else if (arg.startsWith('--provider=')) flags.provider = arg.split('=')[1];
    else if (arg.startsWith('--auth-provider=')) flags.authProvider = arg.split('=')[1];
    else if (arg.startsWith('--realtime=')) flags.realtime = arg.split('=')[1];
    else if (arg.startsWith('--output=')) flags.output = arg.split('=')[1];
  }
  return flags;
}
