import { existsSync } from 'fs';
import { join } from 'path';
import { parsePackageJson, hasDependency } from './parsers.js';

export type DatabaseCategory = 'rds' | 'nosql';

export interface DetectedStack {
  runtime?: 'node' | 'dotnet';
  framework?: 'express' | 'nestjs';
  orm?: 'typeorm' | 'prisma' | 'mongoose' | 'cosmos-sdk' | 'dynamodb-sdk';
  database?: 'postgres' | 'mysql' | 'mssql' | 'mariadb' | 'sqlite'
           | 'mongodb' | 'cosmosdb' | 'dynamodb';
  databaseCategory?: DatabaseCategory;
}

export function detectStack(projectRoot: string): DetectedStack {
  const pkg = parsePackageJson(projectRoot);
  const result: DetectedStack = { runtime: 'node' };

  // Framework detection
  if (hasDependency(pkg, '@nestjs/core')) {
    result.framework = 'nestjs';
  } else if (hasDependency(pkg, 'express')) {
    result.framework = 'express';
  }

  // ORM / data access detection (order matters: more specific first)
  if (hasDependency(pkg, '@azure/cosmos')) {
    result.orm = 'cosmos-sdk';
    result.database = 'cosmosdb';
    result.databaseCategory = 'nosql';
  } else if (hasDependency(pkg, '@aws-sdk/client-dynamodb')) {
    result.orm = 'dynamodb-sdk';
    result.database = 'dynamodb';
    result.databaseCategory = 'nosql';
  } else if (hasDependency(pkg, 'mongoose')) {
    result.orm = 'mongoose';
    result.database = 'mongodb';
    result.databaseCategory = 'nosql';
  } else if (hasDependency(pkg, 'typeorm')) {
    result.orm = 'typeorm';
    result.databaseCategory = 'rds';
  } else if (hasDependency(pkg, 'prisma') || hasDependency(pkg, '@prisma/client')) {
    result.orm = 'prisma';
    // Category determined by database below
  }

  // Database / driver detection
  if (!result.database) {
    if (hasDependency(pkg, 'pg')) {
      result.database = 'postgres';
      result.databaseCategory = 'rds';
    } else if (hasDependency(pkg, 'mysql2') || hasDependency(pkg, 'mysql')) {
      result.database = 'mysql';
      result.databaseCategory = 'rds';
    } else if (hasDependency(pkg, 'mssql')) {
      result.database = 'mssql';
      result.databaseCategory = 'rds';
    } else if (hasDependency(pkg, 'mariadb')) {
      result.database = 'mariadb';
      result.databaseCategory = 'rds';
    } else if (hasDependency(pkg, 'better-sqlite3') || hasDependency(pkg, 'sqlite3')) {
      result.database = 'sqlite' as DetectedStack['database'];
      result.databaseCategory = 'rds';
    } else if (hasDependency(pkg, 'mongodb')) {
      result.database = 'mongodb';
      result.databaseCategory = 'nosql';
      if (!result.orm) result.orm = 'mongoose';
    }
  }

  // Ensure databaseCategory is set for prisma based on detected DB
  if (result.orm === 'prisma' && !result.databaseCategory) {
    if (result.database === 'mongodb') {
      result.databaseCategory = 'nosql';
    } else {
      result.databaseCategory = 'rds';
    }
  }

  return result;
}

export function detectPackageManager(root: string): 'npm' | 'pnpm' | 'yarn' {
  if (existsSync(join(root, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(root, 'yarn.lock'))) return 'yarn';
  return 'npm';
}
