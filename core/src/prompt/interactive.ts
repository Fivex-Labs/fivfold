import * as p from '@clack/prompts';
import type { CliFlags } from './flags.js';
import type { DetectedStack, DatabaseCategory } from '../detection/detector.js';
import { getSmartDefaults, getOrmOptionsForDatabase, getDatabaseOptionsForCategory } from './smart-defaults.js';

export async function selectFramework(detected: DetectedStack, flags: CliFlags): Promise<string> {
  if (flags.yes || flags.dryRun) return getSmartDefaults(detected).framework;
  if (flags.framework) return flags.framework;

  const result = await p.select({
    message: 'Which Node.js framework are you using?',
    options: [
      { value: 'express', label: 'Express' },
      { value: 'nestjs', label: 'NestJS' },
    ],
    initialValue: detected.framework ?? 'express',
  });
  if (p.isCancel(result)) process.exit(0);
  return result as string;
}

export async function selectDatabaseCategory(detected: DetectedStack, flags: CliFlags): Promise<DatabaseCategory> {
  if (flags.yes || flags.dryRun) return getSmartDefaults(detected).dbCategory;
  if (flags.dbCategory) return flags.dbCategory as DatabaseCategory;

  const result = await p.select({
    message: 'Which database category are you using?',
    options: [
      { value: 'rds', label: 'RDS (SQL) — PostgreSQL, MySQL, MS-SQL, MariaDB' },
      { value: 'nosql', label: 'NoSQL — MongoDB, Azure Cosmos DB, AWS DynamoDB' },
    ],
    initialValue: detected.databaseCategory ?? 'rds',
  });
  if (p.isCancel(result)) process.exit(0);
  return result as DatabaseCategory;
}

export async function selectDatabase(detected: DetectedStack, flags: CliFlags, category?: DatabaseCategory): Promise<string> {
  const defaults = getSmartDefaults(detected);
  if (flags.yes || flags.dryRun) return defaults.database;
  if (flags.database) return flags.database;

  const effectiveCategory = category ?? defaults.dbCategory;
  const dbOptions = getDatabaseOptionsForCategory(effectiveCategory);

  const ALL_DB_LABELS: Record<string, string> = {
    postgres: 'PostgreSQL',
    mysql: 'MySQL',
    mssql: 'Microsoft SQL Server',
    mariadb: 'MariaDB',
    sqlite: 'SQLite',
    mongodb: 'MongoDB',
    cosmosdb: 'Azure Cosmos DB',
    dynamodb: 'AWS DynamoDB',
  };

  const options = dbOptions.map((db) => ({ value: db, label: ALL_DB_LABELS[db] ?? db }));
  const initialValue = detected.database && dbOptions.includes(detected.database)
    ? detected.database
    : dbOptions[0];

  const result = await p.select({
    message: 'Which database are you using?',
    options,
    initialValue,
  });
  if (p.isCancel(result)) process.exit(0);
  return result as string;
}

export async function selectOrm(detected: DetectedStack, flags: CliFlags, database?: string): Promise<string> {
  const defaults = getSmartDefaults(detected);
  if (flags.yes || flags.dryRun) return defaults.orm;
  if (flags.orm) return flags.orm;

  const effectiveDatabase = database ?? defaults.database;
  const ormOptions = getOrmOptionsForDatabase(effectiveDatabase);

  // Auto-select when only one option available
  if (ormOptions.length === 1) {
    return ormOptions[0];
  }

  const ORM_LABELS: Record<string, string> = {
    typeorm: 'TypeORM',
    prisma: 'Prisma',
    mongoose: 'Mongoose',
    'cosmos-sdk': 'Azure Cosmos SDK',
    'dynamodb-sdk': 'AWS DynamoDB SDK',
  };

  const options = ormOptions.map((orm) => ({ value: orm, label: ORM_LABELS[orm] ?? orm }));
  const initialValue = detected.orm && ormOptions.includes(detected.orm)
    ? detected.orm
    : ormOptions[0];

  const result = await p.select({
    message: 'Which ORM / data access layer are you using?',
    options,
    initialValue,
  });
  if (p.isCancel(result)) process.exit(0);
  return result as string;
}

export async function promptOutputDir(flags: CliFlags): Promise<string> {
  if (flags.yes || flags.dryRun) return 'src/modules';
  if (flags.output) return flags.output;

  const result = await p.text({
    message: 'Where should API modules be generated?',
    initialValue: 'src/modules',
    validate: (v) => ((v ?? '').trim() ? undefined : 'Please enter a valid path'),
  });
  if (p.isCancel(result)) process.exit(0);
  return result as string;
}

export async function selectAuthProvider(flags: CliFlags): Promise<string> {
  if (flags.yes || flags.dryRun) return 'firebase';
  if (flags.authProvider) return flags.authProvider;
  if (flags.provider) return flags.provider;

  const result = await p.select({
    message: 'Which auth provider do you want to use?',
    options: [
      { value: 'firebase', label: 'Firebase Auth' },
      { value: 'cognito', label: 'AWS Cognito' },
      { value: 'auth0', label: 'Auth0' },
      { value: 'jwt', label: 'Custom JWT' },
    ],
    initialValue: 'firebase',
  });
  if (p.isCancel(result)) process.exit(0);
  return result as string;
}

/** Generic kit `services` provider picker; uses manifest `serviceProviderPrompt` when provided. */
export async function selectKitServiceProvider(
  availableProviders: string[],
  flags: CliFlags,
  prompt?: { message: string; labels: Record<string, string> }
): Promise<string> {
  if (flags.yes || flags.dryRun) return availableProviders[0] ?? '';
  if (flags.provider && availableProviders.includes(flags.provider)) return flags.provider;

  const message = prompt?.message ?? 'Which service provider do you want to use?';
  const options = availableProviders.map((value) => ({
    value,
    label: prompt?.labels[value] ?? value.replace(/-/g, ' '),
  }));

  const result = await p.select({
    message,
    options,
    initialValue: availableProviders[0],
  });
  if (p.isCancel(result)) process.exit(0);
  return result as string;
}

export async function selectPushProvider(
  availableProviders: string[],
  flags: CliFlags
): Promise<string> {
  return selectKitServiceProvider(availableProviders, flags, {
    message: 'Which push notification service do you want to use?',
    labels: {
      fcm: 'Firebase Cloud Messaging (FCM)',
      onesignal: 'OneSignal',
      sns: 'AWS SNS',
      pushy: 'Pushy',
      'pusher-beams': 'Pusher Beams',
    },
  });
}

export async function selectRealtimeProvider(
  availableProviders: string[],
  flags: CliFlags
): Promise<string> {
  if (flags.yes || flags.dryRun) return availableProviders[0] ?? 'socketio';
  if (flags.realtime && availableProviders.includes(flags.realtime)) return flags.realtime;
  if (flags.realtime) return availableProviders[0] ?? 'socketio';

  if (availableProviders.length === 1) return availableProviders[0];

  const REALTIME_LABELS: Record<string, string> = {
    'socketio': 'Socket.IO (WebSocket)',
  };

  const options = availableProviders.map((p) => ({
    value: p,
    label: REALTIME_LABELS[p] ?? p,
  }));

  const result = await p.select({
    message: 'Which real-time provider do you want to use?',
    options,
    initialValue: availableProviders[0],
  });
  if (p.isCancel(result)) process.exit(0);
  return result as string;
}

export async function confirmOverwrite(message: string, flags?: CliFlags): Promise<boolean> {
  if (flags?.yes || flags?.dryRun) return true;
  const result = await p.confirm({
    message,
    initialValue: false,
  });
  if (p.isCancel(result)) process.exit(0);
  return result as boolean;
}
