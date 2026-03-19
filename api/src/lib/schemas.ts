export type ApiFramework = 'express' | 'nestjs';
export type ApiOrm =
  | 'typeorm'
  | 'prisma'
  | 'mongoose'
  | 'cosmos-sdk'
  | 'dynamodb-sdk';
export type ApiDatabase =
  | 'postgres'
  | 'mysql'
  | 'mssql'
  | 'mariadb'
  | 'sqlite'
  | 'mongodb'
  | 'cosmosdb'
  | 'dynamodb';
export type ApiDatabaseCategory = 'rds' | 'nosql';
export type ApiAuthProvider = 'firebase' | 'cognito' | 'auth0' | 'jwt';
export type ApiRealtimeProvider = 'socketio';

export interface ApiConfig {
  framework: ApiFramework;
  orm: ApiOrm;
  database: ApiDatabase;
  databaseCategory?: ApiDatabaseCategory;
  outputDir: string;
  provider?: string;
  /** Auth provider is orthogonal to database/ORM — selecting Firebase Auth does NOT force Firebase as DB */
  authProvider?: ApiAuthProvider;
  realtimeProvider?: ApiRealtimeProvider;
}

export interface FivFoldConfig {
  $schema?: string;
  style?: string;
  api?: ApiConfig;
  [key: string]: unknown;
}

export interface ApiRegistryStackConfig {
  dependencies: string[];
  devDependencies?: string[];
  templateDir: string;
}

export interface ApiRegistry {
  name: string;
  type: 'api-module';
  description: string;
  stacks: Record<string, ApiRegistryStackConfig>;
}

export function buildStackKey(config: ApiConfig): string {
  return `${config.framework}-${config.orm}-${config.database}`;
}

export const SUPPORTED_STACKS = [
  'express-typeorm-postgres',
  'nestjs-typeorm-postgres',
  'express-prisma-postgres',
  'nestjs-prisma-postgres',
] as const;
