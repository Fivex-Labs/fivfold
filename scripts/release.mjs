#!/usr/bin/env node
/**
 * FivFold Interactive Release Script
 *
 * Usage:  pnpm release   (or: node scripts/release.mjs)
 *
 * What it does:
 *   1. Shows current versions across workspace packages
 *   2. Prompts for the new version number
 *   3. Updates package.json (root, core, ui, api, site), CLI --version strings,
 *      and site marketing label (FIVFOLD_MARKETING_VERSION)
 *   4. Optionally commits and creates git tag vX.Y.Z
 *      (push the tag to trigger CI publish: git push && git push origin vX.Y.Z)
 *
 * Release notes: edit the GitHub Release after publish (CHANGELOG.md is not used).
 */

import { readFileSync, writeFileSync } from "fs";
import { createInterface } from "readline";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

const readJson = (rel) =>
  JSON.parse(readFileSync(resolve(ROOT, rel), "utf8"));

const writeJson = (rel, obj) =>
  writeFileSync(resolve(ROOT, rel), JSON.stringify(obj, null, 2) + "\n", "utf8");

const run = (cmd) =>
  execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim();

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

const PACKAGES = [
  { label: "fivfold (root)", path: "package.json" },
  { label: "@fivfold/core", path: "core/package.json" },
  { label: "@fivfold/ui", path: "ui/package.json" },
  { label: "@fivfold/api", path: "api/package.json" },
  { label: "fivfold-site", path: "site/package.json" },
];

const SEM_VER_RE = /^\d+\.\d+\.\d+(-[\w.]+)?$/;

function setCliVersion(rel, ver) {
  const p = resolve(ROOT, rel);
  let s = readFileSync(p, "utf8");
  const next = s.replace(/\.version\(\s*['"][^'"]+['"]\s*\)/, `.version('${ver}')`);
  if (next === s) {
    throw new Error(`Could not bump .version() in ${rel}`);
  }
  writeFileSync(p, next);
}

function setMarketingVersion(ver) {
  const p = resolve(ROOT, "site/app/lib/fivfold-version.ts");
  let s = readFileSync(p, "utf8");
  const next = s.replace(
    /export const FIVFOLD_MARKETING_VERSION = "[^"]+"/,
    `export const FIVFOLD_MARKETING_VERSION = "${ver}"`,
  );
  if (next === s) {
    throw new Error("Could not bump FIVFOLD_MARKETING_VERSION in site/app/lib/fivfold-version.ts");
  }
  writeFileSync(p, next);
}

console.log("\n" + bold("FivFold Release Script") + "\n");
console.log(bold("Current versions:"));

let currentVersion = null;
for (const pkg of PACKAGES) {
  const { version } = readJson(pkg.path);
  if (!currentVersion) currentVersion = version;
  console.log(`  ${cyan(pkg.label.padEnd(18))}  ${green(version)}`);
}

console.log();
const rawVersion = await ask(
  bold("New version") + dim(` (current: ${currentVersion}): `),
);
const newVersion = rawVersion.trim();

if (!SEM_VER_RE.test(newVersion)) {
  console.error(
    `\nInvalid version "${newVersion}". Must follow semver (e.g. 1.2.3 or 1.2.3-beta.1).`,
  );
  rl.close();
  process.exit(1);
}

if (newVersion === currentVersion) {
  console.error(
    `\nNew version is the same as the current version (${currentVersion}). Aborting.`,
  );
  rl.close();
  process.exit(1);
}

console.log();
for (const pkg of PACKAGES) {
  const json = readJson(pkg.path);
  json.version = newVersion;
  writeJson(pkg.path, json);
  console.log(`  ${green("✓")} ${pkg.label} → ${bold(newVersion)}`);
}

setCliVersion("ui/src/cli/index.ts", newVersion);
console.log(`  ${green("✓")} ui CLI .version → ${bold(newVersion)}`);
setCliVersion("api/src/cli/index.ts", newVersion);
console.log(`  ${green("✓")} api CLI .version → ${bold(newVersion)}`);
setMarketingVersion(newVersion);
console.log(`  ${green("✓")} site FIVFOLD_MARKETING_VERSION → ${bold(newVersion)}`);

const tagName = `v${newVersion}`;

const GIT_PATHS = [
  "package.json",
  "core/package.json",
  "ui/package.json",
  "api/package.json",
  "site/package.json",
  "ui/src/cli/index.ts",
  "api/src/cli/index.ts",
  "site/app/lib/fivfold-version.ts",
].join(" ");

console.log();
const doCommit = await ask(
  bold("Commit and tag?") +
    dim(` (git add ${GIT_PATHS.split(" ").length} files, commit, tag ${tagName}) [y/N]: `),
);

if (doCommit.trim().toLowerCase() === "y") {
  run(`git add ${GIT_PATHS}`);
  run(`git commit -m "chore: release ${tagName}"`);
  run(`git tag ${tagName}`);
  console.log(`\n  ${green("✓")} Committed and tagged ${bold(tagName)}`);
  console.log();
  console.log(dim("  Push the commit and tag to trigger CI:"));
  console.log(`  ${cyan(`git push && git push origin ${tagName}`)}`);
} else {
  console.log();
  console.log(dim("  Skipped. When ready, run:"));
  console.log(`  ${cyan(`git add ${GIT_PATHS}`)}`);
  console.log(`  ${cyan(`git commit -m "chore: release ${tagName}"`)}`);
  console.log(`  ${cyan(`git tag ${tagName}`)}`);
  console.log(`  ${cyan(`git push && git push origin ${tagName}`)}`);
}

console.log();
rl.close();
