"use client"

import * as React from "react"

export type Runtime = "node"
export type Framework = "express" | "nestjs"
export type DatabaseCategory = "rds" | "nosql"
export type Database =
  | "postgres" | "mysql" | "mssql" | "mariadb"
  | "mongodb" | "cosmosdb" | "dynamodb"
export type Orm =
  | "typeorm" | "prisma"
  | "mongoose"
  | "cosmos-sdk"
  | "dynamodb-sdk"
export type AuthProvider = "firebase" | "cognito" | "auth0" | "jwt"
export type PushProvider = "fcm" | "onesignal" | "sns" | "pushy" | "pusher-beams"
/** Frontend bundler / framework for docs (how the UI app reaches the API in dev). */
export type FrontendBundler = "vite" | "nextjs"

export interface StackSelection {
  runtime: Runtime
  framework: Framework
  dbCategory: DatabaseCategory
  database: Database
  orm: Orm
  /** UI app tooling — drives proxy/rewrite examples in kit docs. */
  frontend: FrontendBundler
  authProvider?: AuthProvider
  pushProvider?: PushProvider
}

export const FRONTEND_BUNDLER_OPTIONS: { value: FrontendBundler; label: string }[] = [
  { value: "nextjs", label: "Next.js" },
  { value: "vite", label: "Vite" },
]

export const DATABASE_OPTIONS: { value: Database; label: string }[] = [
  { value: "postgres", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mssql", label: "MS SQL Server" },
  { value: "mariadb", label: "MariaDB" },
  { value: "mongodb", label: "MongoDB" },
  { value: "cosmosdb", label: "Azure Cosmos DB" },
  { value: "dynamodb", label: "AWS DynamoDB" },
]

/** Internal mapping used to cascade ORM options when database changes. */
export const DATABASE_OPTIONS_BY_CATEGORY: Record<DatabaseCategory, { value: Database; label: string }[]> = {
  rds: [
    { value: "postgres", label: "PostgreSQL" },
    { value: "mysql", label: "MySQL" },
    { value: "mssql", label: "MS SQL Server" },
    { value: "mariadb", label: "MariaDB" },
  ],
  nosql: [
    { value: "mongodb", label: "MongoDB" },
    { value: "cosmosdb", label: "Azure Cosmos DB" },
    { value: "dynamodb", label: "AWS DynamoDB" },
  ],
}

export const ORM_OPTIONS_BY_DATABASE: Record<Database, { value: Orm; label: string }[]> = {
  postgres: [{ value: "typeorm", label: "TypeORM" }, { value: "prisma", label: "Prisma" }],
  mysql: [{ value: "typeorm", label: "TypeORM" }, { value: "prisma", label: "Prisma" }],
  mssql: [{ value: "typeorm", label: "TypeORM" }, { value: "prisma", label: "Prisma" }],
  mariadb: [{ value: "typeorm", label: "TypeORM" }, { value: "prisma", label: "Prisma" }],
  mongodb: [{ value: "mongoose", label: "Mongoose" }, { value: "prisma", label: "Prisma (MongoDB)" }],
  cosmosdb: [{ value: "cosmos-sdk", label: "Cosmos SDK" }],
  dynamodb: [{ value: "dynamodb-sdk", label: "DynamoDB SDK" }],
}

function deriveCategoryFromDatabase(db: Database): DatabaseCategory {
  if (db === "mongodb" || db === "cosmosdb" || db === "dynamodb") return "nosql"
  return "rds"
}

const STORAGE_KEY = "fivfold-stack"

const defaultStack: StackSelection = {
  runtime: "node",
  framework: "nestjs",
  dbCategory: "rds",
  database: "postgres",
  orm: "typeorm",
  frontend: "nextjs",
  authProvider: "firebase",
  pushProvider: "fcm",
}

function loadFromStorage(): StackSelection {
  if (typeof window === "undefined") return defaultStack
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStack
    const parsed = JSON.parse(raw) as Partial<StackSelection>
    const database = (parsed.database ?? defaultStack.database) as Database
    const dbCategory = deriveCategoryFromDatabase(database)
    return {
      runtime: parsed.runtime ?? defaultStack.runtime,
      framework: parsed.framework ?? defaultStack.framework,
      dbCategory,
      database,
      orm: parsed.orm ?? defaultStack.orm,
      frontend: (parsed.frontend === "vite" || parsed.frontend === "nextjs"
        ? parsed.frontend
        : defaultStack.frontend),
      authProvider: parsed.authProvider ?? defaultStack.authProvider,
      pushProvider: parsed.pushProvider ?? defaultStack.pushProvider,
    }
  } catch {
    return defaultStack
  }
}

function saveToStorage(stack: StackSelection) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stack))
  } catch {
    // ignore
  }
}

interface StackContextValue {
  stack: StackSelection
  setStack: (updates: Partial<StackSelection>) => void
}

const StackContext = React.createContext<StackContextValue | null>(null)

export function StackProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStackState] = React.useState<StackSelection>(defaultStack)

  React.useEffect(() => {
    setStackState(loadFromStorage())
  }, [])

  const setStack = React.useCallback((updates: Partial<StackSelection>) => {
    setStackState((prev) => {
      let next = { ...prev, ...updates }

      // When database changes, derive dbCategory and reset ORM to first valid option
      if (updates.database && updates.database !== prev.database) {
        next.dbCategory = deriveCategoryFromDatabase(updates.database)
        next.orm = ORM_OPTIONS_BY_DATABASE[updates.database][0].value
      }

      saveToStorage(next)
      return next
    })
  }, [])

  const value = React.useMemo(
    () => ({ stack, setStack }),
    [stack, setStack]
  )

  return (
    <StackContext.Provider value={value}>
      {children}
    </StackContext.Provider>
  )
}

export function useStack(): StackContextValue {
  const ctx = React.useContext(StackContext)
  if (!ctx) {
    throw new Error("useStack must be used within StackProvider")
  }
  return ctx
}
