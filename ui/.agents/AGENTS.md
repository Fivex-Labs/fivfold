# FivFold CLI Refactoring & Architectural Rule Set (AGENTS.md)

> See root [AGENTS.md](../../AGENTS.md) for full rules.

**CRITICAL SYSTEM DIRECTIVE FOR AI AGENTS**: 
You are tasked with refactoring the FivFold CLI. Currently, FivFold exists as two simple CLIs (`@fivfold/ui` and `@fivfold/api`) that primarily copy pre-existing files and use basic templates. Your objective is to transform this into a highly advanced, extensible, multi-stack scaffolding engine as defined below. 

You must strictly adhere to these rules. Any code generated that violates these constraints is considered a failure.

## 0. Strict Tech Stack Constraints
Do not use legacy versions of these tools. The project requires:
*   **Node.js:** v20 or later.
*   **Frontend:** React 18+ or Next.js 14+ (App Router).
*   **Styling:** Tailwind CSS **v4 exclusively** (using `@import "tailwindcss"`; NO `tailwind.config.js` is permitted).
*   **UI Foundation:** shadcn/ui.

## 1. File Modification Rules (The "Hybrid" Strategy)
**NEVER** use Regular Expressions or string `.replace()` functions to mutate existing source code files (like `app.module.ts` or `server.ts`). This is strictly forbidden due to fragility.
*   **For EXISTING files:** You MUST use Abstract Syntax Tree (AST) manipulation via `ts-morph`. You must parse the AST, safely inject the node, and serialize it back to ensure surgical precision and avoid destroying user modifications.
*   **For NEW, standalone files:** You may use string-based templating (e.g., Handlebars).

## 2. State & Transaction Rules (Virtual File System)
**NEVER** write directly to the physical disk (using `fs.writeFileSync`) in the middle of a generation process. 
*   **VFS Mandate:** You must implement a Virtual File System (VFS). All file creations, AST modifications, and deletions must be staged in memory first.
*   **Atomic Commits:** Only after all generators and AST mutations complete successfully should the VFS flush changes to the disk in a single, atomic transaction.
*   **Side Effects:** Actions like `npm install` or running formatting tools must only occur *after* the VFS successfully commits to the disk.
*   **Dry Run:** The system must support a `--dry-run` flag to output intended changes without executing them.

## 3. Anti-Combinatorial Explosion Rules
**NEVER** create hardcoded directories for every permutation of a stack (e.g., no `express-typeorm-firebase` folders).
*   **Strategy Pattern:** Implement interchangeable classes for code generation (e.g., `NestJsGeneratorStrategy`, `FirebaseGeneratorStrategy`) instead of massive `if/else` statements.
*   **Manifests over Hardcoding:** Kits must be defined by declarative JSON/YAML schemas (Manifests) specifying dependencies, remote template URLs, and AST mutation targets. The CLI must act as an agnostic orchestrator that reads these manifests.

## 4. Output Architecture Rules (Hexagonal/Ports & Adapters)
When scaffolding backend code (like an Auth Kit), the outputted code **MUST** adhere to Hexagonal Architecture to prevent vendor lock-in.
*   **Domain (Core):** Must generate framework-agnostic Interfaces (Ports) (e.g., `IAuthService`).
*   **Infrastructure (Adapters):** Must generate separate files implementing the Interfaces using vendor SDKs (e.g., `FirebaseAuthAdapter`).
*   **Delivery:** HTTP transport (Express Routes or NestJS Controllers) must be isolated from the core logic.

## 5. Plugin Architecture Rules
Currently, FivFold uses two separate packages (`@fivfold/ui` and `@fivfold/api`). You must prepare the architecture for a unified, language-agnostic future (supporting .NET Core).
*   **Orchestrator:** The core CLI must handle terminal input, VFS, and manifest resolution.
*   **Plugins:** All language-specific logic (like `ts-morph` AST parsing) must be encapsulated in isolated plugins (e.g., `@fivfold/plugin-node`).

## 6. Developer Experience & Automation Rules
*   **No "Node.js" Monolith:** When prompting the user, do not offer "Node.js" as a framework. You must sequentially deduce Runtime (Node) -> Framework (Express or NestJS) -> ORM -> Auth.
*   **Auto-Detection:** The CLI must attempt to parse `package.json` to detect existing frameworks (e.g., `@nestjs/core`) and silently skip relevant prompts.
*   **CI/CD Ready:** The CLI **MUST NOT** force interactive prompts. Every prompt must map to a CLI flag, and a `--yes` or `-y` flag must instantly bypass all questions, utilizing smart defaults (e.g., defaulting to Tailwind/shadcn for UI, TypeScript for NestJS).
