# Contributing to FivFold

Thank you for your interest in contributing to FivFold! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming environment for everyone.

## Getting Started

### Prerequisites

- **Node.js** 20 or later
- **pnpm** (package manager)

```bash
# Install pnpm if needed
npm install -g pnpm
```

### Setup

```bash
# Clone the repository
git clone https://github.com/Fivex-Labs/fivfold.git
cd fivfold

# Install dependencies
pnpm install

# Build all packages (core must be built before ui and api)
pnpm run build
```

### Project Structure

- **core/** — Shared engine (VFS, AST, manifests, strategies). Build first.
- **ui/** — Frontend Kits CLI. Depends on core.
- **api/** — Backend scaffolding CLI. Depends on core.
- **site/** — Next.js docs site. Uses ui for demos.

## Development Workflow

1. **Create a branch** from `main` for your changes
2. **Make changes** following the architectural rules in [AGENTS.md](./AGENTS.md)
3. **Build and test** — run `pnpm run build` from root
4. **Submit a pull request** with a clear description of your changes

## Key Guidelines

- **VFS:** All file operations must go through the Virtual File System. No direct `fs.writeFileSync` during generation.
- **AST:** Use ts-morph for modifying existing source files. No regex or string `.replace()` on source code.
- **Strategy pattern:** Add new generators as strategies, not hardcoded if/else branches.
- **Manifests:** Define Kits in JSON manifests, not in code.

See [AGENTS.md](./AGENTS.md) and [OVERVIEW.md](./OVERVIEW.md) for full architectural rules.

## Package-Specific Notes

- **[core/CONTRIBUTING.md](./core/CONTRIBUTING.md)** — Core engine contributions
- **[ui/CONTRIBUTING.md](./ui/CONTRIBUTING.md)** — UI CLI and Kits
- **[api/CONTRIBUTING.md](./api/CONTRIBUTING.md)** — API scaffolding
- **[site/CONTRIBUTING.md](./site/CONTRIBUTING.md)** — Docs site

## Questions?

Open an issue on GitHub or reach out to the maintainers.
