# Contributing to FivFold

Thank you for your interest in contributing to FivFold! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming environment for everyone.

## Getting Started

### Prerequisites

- **Node.js** 20 or later
- **pnpm** (package manager)

```bash
npm install -g pnpm
```

### Setup

```bash
git clone https://github.com/Fivex-Labs/fivfold.git
cd fivfold
pnpm install
pnpm run build
```

### Project structure

- **core/** — Shared engine (VFS, AST, manifests, strategies). Build first.
- **ui/** — Frontend Kits CLI. Depends on core.
- **api/** — Backend scaffolding CLI. Depends on core.
- **site/** — Next.js docs site. Uses `ui` for demos.

Manifest-driven Kits live under `ui/manifests/`, `api/manifests/` and matching `templates/`. See the root [README.md](./README.md) for commands and layout.

## Development workflow

1. **Create a branch** from `main` for your changes
2. **Follow** the rules in [AGENTS.md](./AGENTS.md)
3. **Build and test** — `pnpm run build` from root
4. **Open a pull request** with a clear description

## Key guidelines

- **VFS:** All generation-time file operations go through the Virtual File System. No `fs.writeFileSync` in the middle of a generator run.
- **AST:** Use ts-morph for editing existing source. No regex / string `.replace()` on source files.
- **Strategies:** Add generators as strategies, not giant `if/else` trees.
- **Manifests:** Define Kits in JSON manifests, not one-off hardcoded paths per stack.

## Package-specific notes

- **[core/CONTRIBUTING.md](./core/CONTRIBUTING.md)** — Core engine
- **[ui/CONTRIBUTING.md](./ui/CONTRIBUTING.md)** — UI CLI
- **[api/CONTRIBUTING.md](./api/CONTRIBUTING.md)** — API CLI
- **[site/CONTRIBUTING.md](./site/CONTRIBUTING.md)** — Docs site

## Questions?

Open an issue on GitHub or reach out to the maintainers.
