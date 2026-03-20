---
name: fivfold-api
description: FivFold API scaffolding conventions for Express/NestJS backends. Use when working with FivFold API modules (Email, Kanban, Push, Chat), Hexagonal architecture, ORM patterns (TypeORM, Prisma, Mongoose), or backend scaffolding.
license: MIT
metadata:
  author: Fivex Labs
  version: "1.0.0"
---

# FivFold API

Conventions for FivFold API modules and backend scaffolding.

## When to Apply

- Scaffolding or modifying FivFold API modules (Email, Kanban, Push, Chat)
- Implementing Hexagonal (Ports & Adapters) architecture
- Working with ORM patterns (TypeORM, Prisma, Mongoose, Cosmos SDK, DynamoDB SDK)

## Hexagonal Layout

Generated code follows this structure:

1. **Domain (Ports):** Framework-agnostic interfaces (e.g. `IEmailService`, `IChatService`)
2. **Infrastructure (Adapters):** Implementations using vendor SDKs (e.g. `TypeOrmEmailAdapter`, `MongooseChatAdapter`)
3. **Delivery:** HTTP transport (Express routes or NestJS controllers) isolated from core logic

## Key Rules

- **Never mix ORM-specific code in framework layer** — ORM deps belong in the `orm` manifest layer only
- **Auth provider is independent of database** — Firebase Auth can pair with PostgreSQL, MongoDB, etc.
- **Manifest-driven** — All module definitions come from manifests; no hardcoded stack permutations

## Adding API Modules

```bash
npx @fivfold/api init             # configure backend (framework, ORM, database)
npx @fivfold/api add email       # scaffold email API module
npx @fivfold/api add kanban      # scaffold kanban API module
npx @fivfold/api add push        # scaffold push notifications module
npx @fivfold/api add chat        # scaffold chat API module
```

Chat REST (generated) includes participant-scoped search, `PATCH …/conversations/:id/unread`, and `DELETE …/conversations/:id/messages` (soft-clear; group admins only). The Chat module is not scaffolded for Firestore/Realtime Database — use TypeORM, Prisma, Mongoose, Cosmos SDK, or DynamoDB SDK per your `api add chat` stack.

## Supported Stack

| Framework | ORMs | Databases |
|-----------|------|-----------|
| Express, NestJS | TypeORM, Prisma, Mongoose, Cosmos SDK, DynamoDB SDK | PostgreSQL, MySQL, MS-SQL, MariaDB, MongoDB, Azure Cosmos DB, AWS DynamoDB |
