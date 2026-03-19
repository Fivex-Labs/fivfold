import type { DetectedStack, DatabaseCategory } from '../detection/detector.js';

export interface SmartDefaults {
  framework: string;
  dbCategory: DatabaseCategory;
  orm: string;
  database: string;
  outputDir: string;
}

export function getSmartDefaults(detected: DetectedStack): SmartDefaults {
  const dbCategory = detected.databaseCategory ?? 'rds';

  let orm: string;
  let database: string;

  if (detected.orm) {
    orm = detected.orm;
    database = detected.database ?? defaultDatabaseForOrm(detected.orm);
  } else {
    switch (dbCategory) {
      case 'nosql':
        orm = 'mongoose';
        database = detected.database ?? 'mongodb';
        break;
      default:
        orm = 'typeorm';
        database = detected.database ?? 'postgres';
    }
  }

  return {
    framework: detected.framework ?? 'express',
    dbCategory,
    orm,
    database,
    outputDir: 'src/modules',
  };
}

function defaultDatabaseForOrm(orm: string): string {
  switch (orm) {
    case 'mongoose': return 'mongodb';
    case 'cosmos-sdk': return 'cosmosdb';
    case 'dynamodb-sdk': return 'dynamodb';
    case 'typeorm':
    case 'prisma':
    default:
      return 'postgres';
  }
}

/** Returns the ORM options available for a given database. */
export function getOrmOptionsForDatabase(database: string): string[] {
  switch (database) {
    case 'postgres':
    case 'mysql':
    case 'mssql':
    case 'mariadb':
    case 'sqlite':
      return ['typeorm', 'prisma'];
    case 'mongodb':
      return ['mongoose', 'prisma'];
    case 'cosmosdb':
      return ['cosmos-sdk'];
    case 'dynamodb':
      return ['dynamodb-sdk'];
    default:
      return ['typeorm', 'prisma'];
  }
}

/** Returns the database options for a given category. */
export function getDatabaseOptionsForCategory(category: DatabaseCategory): string[] {
  switch (category) {
    case 'nosql':
      return ['mongodb', 'cosmosdb', 'dynamodb'];
    default:
      return ['postgres', 'mysql', 'mssql', 'mariadb'];
  }
}
