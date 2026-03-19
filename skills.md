# FivFold Skills Registry

> **Agents:** Update this file when adding Kits, changing major component paths, or introducing new installable skills.

## FivFold project skills (for developing FivFold itself)

| Skill | Path | When to use |
|-------|------|-------------|
| FivFold Architecture | [AGENTS.md](AGENTS.md) | Refactoring CLI, scaffolding, manifests |
| FivFold Docs Conventions | [.cursor/rules/fivfold-docs.mdc](.cursor/rules/fivfold-docs.mdc) | Editing `site/app/docs` |
| FivFold Skills Maintenance | [.cursor/rules/fivfold-skills-maintenance.mdc](.cursor/rules/fivfold-skills-maintenance.mdc) | Kits, manifests, skills, templates |

## Developer project skills (installed via `npx @fivfold/ui skills`)

| Skill | IDEs | Description |
|-------|------|-------------|
| FivFold Kits | Cursor, VSCode, Cline, Windsurf, GitHub Copilot, Claude Code | Import paths, theming, Kit usage, component conventions |
| FivFold API | Cursor, VSCode, Cline, Windsurf, GitHub Copilot, Claude Code | Module structure, Hexagonal layout, ORM patterns |

## Kits

Shipped Kits change over time. Use `npx @fivfold/ui list` / `npx @fivfold/api list` in a project, or inspect `ui/manifests/` and `api/manifests/` in this repo—do not maintain a duplicate inventory table here.
