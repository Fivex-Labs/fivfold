import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import pc from 'picocolors';
import type { VfsOperation } from './types.js';

export class VirtualFileSystem {
  private operations: Map<string, VfsOperation> = new Map();
  private committedPaths: string[] = [];

  stageCreate(path: string, content: string): void {
    const normalized = this.normalizePath(path);
    this.operations.set(normalized, {
      type: 'create',
      path: normalized,
      content,
    });
  }

  stageModify(path: string, content: string): void {
    const normalized = this.normalizePath(path);
    let previousContent: string | undefined;
    if (existsSync(normalized)) {
      previousContent = readFileSync(normalized, 'utf8');
    }
    this.operations.set(normalized, {
      type: 'modify',
      path: normalized,
      content,
      previousContent,
    });
  }

  stageDelete(path: string): void {
    const normalized = this.normalizePath(path);
    let previousContent: string | undefined;
    if (existsSync(normalized)) {
      previousContent = readFileSync(normalized, 'utf8');
    }
    this.operations.set(normalized, {
      type: 'delete',
      path: normalized,
      previousContent,
    });
  }

  getStaged(): VfsOperation[] {
    return Array.from(this.operations.values());
  }

  read(path: string): string | undefined {
    const normalized = this.normalizePath(path);
    const op = this.operations.get(normalized);
    if (op?.content) return op.content;
    if (existsSync(normalized)) return readFileSync(normalized, 'utf8');
    return undefined;
  }

  preview(rootDir: string): string {
    const lines: string[] = [];
    const ops = this.getStaged();

    if (ops.length === 0) {
      return pc.dim('No changes staged.');
    }

    lines.push(pc.bold('  Dry run preview (--dry-run):\n'));

    for (const op of ops) {
      const relativePath = op.path.replace(rootDir, '.').replace(/\\/g, '/');
      switch (op.type) {
        case 'create':
          lines.push(pc.green(`  + ${relativePath}`));
          if (op.content) {
            lines.push(pc.dim(op.content.split('\n').slice(0, 5).map((l) => `    ${l}`).join('\n')));
            if (op.content.split('\n').length > 5) {
              lines.push(pc.dim(`    ... (${op.content.split('\n').length - 5} more lines)`));
            }
          }
          break;
        case 'modify':
          lines.push(pc.yellow(`  ~ ${relativePath}`));
          if (op.previousContent && op.content) {
            const prevLines = op.previousContent.split('\n').length;
            const newLines = op.content.split('\n').length;
            lines.push(pc.dim(`    ${prevLines} lines -> ${newLines} lines`));
          }
          break;
        case 'delete':
          lines.push(pc.red(`  - ${relativePath}`));
          break;
      }
    }

    lines.push('');
    return lines.join('\n');
  }

  commit(rootDir: string): void {
    const ops = this.getStaged();
    const committed: string[] = [];

    try {
      for (const op of ops) {
        const fullPath = op.path.startsWith(rootDir) ? op.path : join(rootDir, op.path);
        const normalized = fullPath.replace(/\\/g, '/');

        switch (op.type) {
          case 'create':
            mkdirSync(dirname(normalized), { recursive: true });
            writeFileSync(normalized, op.content ?? '', 'utf8');
            committed.push(normalized);
            break;
          case 'modify':
            mkdirSync(dirname(normalized), { recursive: true });
            writeFileSync(normalized, op.content ?? '', 'utf8');
            committed.push(normalized);
            break;
          case 'delete':
            if (existsSync(normalized)) {
              unlinkSync(normalized);
              committed.push(normalized);
            }
            break;
        }
      }
      this.committedPaths = committed;
      this.operations.clear();
    } catch (err) {
      this.rollback(rootDir);
      throw err;
    }
  }

  rollback(rootDir?: string): void {
    if (rootDir && this.committedPaths.length > 0) {
      for (const path of this.committedPaths.reverse()) {
        try {
          if (existsSync(path)) {
            unlinkSync(path);
          }
        } catch {
          // Best effort rollback
        }
      }
    }
    this.committedPaths = [];
    this.operations.clear();
  }

  clear(): void {
    this.operations.clear();
    this.committedPaths = [];
  }

  private normalizePath(path: string): string {
    return path.replace(/\\/g, '/');
  }
}
