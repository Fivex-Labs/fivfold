#!/usr/bin/env node
/**
 * FivFold Interactive Release Script
 *
 * Usage:  pnpm release   (or: node scripts/release.mjs)
 *
 * What it does:
 *   1. Shows current versions of @fivfold/core, @fivfold/ui, @fivfold/api
 *   2. Prompts for the new version number
 *   3. Updates all three package.json files
 *   4. Optionally commits the changes and creates a git tag
 *      (push the tag separately to trigger CI publish: git push origin vX.Y.Z)
 */

import { readFileSync, writeFileSync } from "fs";
import { createInterface } from "readline";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── helpers ──────────────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

const readJson = (rel) =>
  JSON.parse(readFileSync(resolve(ROOT, rel), "utf8"));

const writeJson = (rel, obj) =>
  writeFileSync(resolve(ROOT, rel), JSON.stringify(obj, null, 2) + "\n", "utf8");

const run = (cmd) =>
  execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim();

const bold  = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const cyan  = (s) => `\x1b[36m${s}\x1b[0m`;
const dim   = (s) => `\x1b[2m${s}\x1b[0m`;

const PACKAGES = [
  { label: "@fivfold/core", path: "core/package.json" },
  { label: "@fivfold/ui",   path: "ui/package.json"   },
  { label: "@fivfold/api",  path: "api/package.json"  },
];

const SEM_VER_RE = /^\d+\.\d+\.\d+(-[\w.]+)?$/;

// ── step 1: show current versions ────────────────────────────────────────────

console.log("\n" + bold("FivFold Release Script") + "\n");
console.log(bold("Current versions:"));

let currentVersion = null;
for (const pkg of PACKAGES) {
  const { version } = readJson(pkg.path);
  if (!currentVersion) currentVersion = version;
  console.log(`  ${cyan(pkg.label.padEnd(16))}  ${green(version)}`);
}

// ── step 2: prompt for new version ───────────────────────────────────────────

console.log();
const rawVersion = await ask(
  bold("New version") + dim(` (current: ${currentVersion}): `)
);
const newVersion = rawVersion.trim();

if (!SEM_VER_RE.test(newVersion)) {
  console.error(`\nInvalid version "${newVersion}". Must follow semver (e.g. 1.2.3 or 1.2.3-beta.1).`);
  rl.close();
  process.exit(1);
}

if (newVersion === currentVersion) {
  console.error(`\nNew version is the same as the current version (${currentVersion}). Aborting.`);
  rl.close();
  process.exit(1);
}

// ── step 3: update package.json files ────────────────────────────────────────

console.log();
for (const pkg of PACKAGES) {
  const json = readJson(pkg.path);
  json.version = newVersion;
  writeJson(pkg.path, json);
  console.log(`  ${green("✓")} ${pkg.label} → ${bold(newVersion)}`);
}

// ── step 4: optional git commit + tag ────────────────────────────────────────

const tagName = `v${newVersion}`;

console.log();
const doCommit = await ask(
  bold("Commit and tag?") +
  dim(` (will run: git add -A && git commit && git tag ${tagName}) [y/N]: `)
);

if (doCommit.trim().toLowerCase() === "y") {
  run(`git add core/package.json ui/package.json api/package.json`);
  run(`git commit -m "chore: release ${tagName}"`);
  run(`git tag ${tagName}`);
  console.log(`\n  ${green("✓")} Committed and tagged ${bold(tagName)}`);
  console.log();
  console.log(dim("  Push the commit and tag to trigger CI:"));
  console.log(`  ${cyan(`git push && git push origin ${tagName}`)}`);
} else {
  console.log();
  console.log(dim("  Skipped. When ready, run:"));
  console.log(`  ${cyan(`git add core/package.json ui/package.json api/package.json`)}`);
  console.log(`  ${cyan(`git commit -m "chore: release ${tagName}"`)}`);
  console.log(`  ${cyan(`git tag ${tagName}`)}`);
  console.log(`  ${cyan(`git push && git push origin ${tagName}`)}`);
}

console.log();
rl.close();
