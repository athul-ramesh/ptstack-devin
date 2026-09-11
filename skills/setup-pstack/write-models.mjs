#!/usr/bin/env node

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

export const CORE_ALIASES = Object.freeze(["opus", "swe", "sonnet", "codex"]);

export const SINGLE_ROLES = Object.freeze([
  ["feature, refactoring", "opus"],
  ["bug-fix", "sonnet"],
  ["perf-issue", "opus"],
  ["hillclimb", "sonnet"],
  ["judgment and prose", "opus"],
  ["strongest judgment", "opus"],
  ["how explorer", "sonnet"],
  ["how explainer", "opus"],
  ["why investigators", "sonnet"],
  ["why synthesizer", "opus"],
  ["reflect tooling", "sonnet"],
  ["reflect judgment, divergent, synthesizer", "opus"],
  ["swarm workers", "sonnet"],
]);

export const PANEL_ROLES = Object.freeze([
  ["how critics", ["opus", "swe", "sonnet"]],
  ["arena runners", ["opus", "swe", "sonnet"]],
  ["arena cross-judge pool", ["opus", "swe"]],
  ["architect runners", ["opus", "swe", "sonnet"]],
  ["interrogate reviewers", ["opus", "swe", "sonnet"]],
]);

const IMPLEMENTATION_ROLES = new Set([
  "feature, refactoring",
  "bug-fix",
  "perf-issue",
  "hillclimb",
]);

export function parseDevinModelsList(text) {
  const ids = new Set();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*aliases:\s*(.+)$/);
    if (!match) continue;
    for (const part of match[1].split(",")) {
      const id = part.trim();
      if (/^[a-z][a-z0-9.-]*$/.test(id)) ids.add(id);
    }
  }
  return ids;
}

export function panelProfile(alias) {
  return `pstack:panel-${alias}`;
}

export function implementationProfile(alias) {
  return `pstack:poteto-agent-${alias}`;
}

export function firstAvailableAlias(available) {
  for (const alias of CORE_ALIASES) {
    if (available.has(alias)) return alias;
  }
  return undefined;
}

export function resolveAlias(preferred, available) {
  if (available.has(preferred)) return preferred;
  return firstAvailableAlias(available);
}

export function buildRoleConfigs(available) {
  const fallback = firstAvailableAlias(available);
  if (!fallback) {
    throw new Error("devin models list reported no usable aliases");
  }
  const roles = [];
  for (const [role, preferred] of SINGLE_ROLES) {
    const alias = resolveAlias(preferred, available);
    roles.push({
      role,
      profiles: [
        IMPLEMENTATION_ROLES.has(role)
          ? implementationProfile(alias)
          : panelProfile(alias),
      ],
      requiredPerspectives: 1,
    });
  }
  for (const [role, preferred] of PANEL_ROLES) {
    const profiles = preferred.map((alias) => panelProfile(resolveAlias(alias, available)));
    roles.push({
      role,
      profiles,
      requiredPerspectives: preferred.length,
    });
  }
  return roles;
}

export function renderSheet(roles) {
  const lines = [
    "# pstack model configuration",
    "",
    "Per-role overrides for this Devin plugin. Implementation roles use `pstack:poteto-agent-<alias>`; review roles use `pstack:panel-<alias>`.",
    "The alias must appear in `devin models list`; a profile's frontmatter `model:` pin is authoritative and its suffix is only a role label. Delete a line to fall back to the skill default.",
    "",
    "When a role needs more perspectives than distinct profiles, run that many sequential fresh-context",
    "`run_subagent` calls on the available profile. Do not label one pass as a panel.",
    "",
  ];
  for (const row of roles) {
    lines.push(`${row.role}: ${row.profiles.join(", ")}`);
  }
  lines.push("");
  return lines.join("\n");
}

export function defaultOutPath(home = process.env.HOME) {
  if (!home) throw new Error("HOME is not set");
  return join(home, ".config", "devin", "pstack-models.md");
}

export function writeAtomic(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, content);
  renameSync(tmp, path);
  return path;
}

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function detectModelsList() {
  const result = spawnSync("devin", ["models", "list"], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || "devin models list failed");
  }
  return result.stdout;
}

function parseArgs(argv) {
  const out = { home: process.env.HOME, out: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--home") out.home = argv[++i];
    else if (arg === "--out") out.out = argv[++i];
    else throw new Error(`unknown argument ${arg}`);
  }
  return out;
}

export function writeFromModelsList(text, options = {}) {
  const available = parseDevinModelsList(text);
  const roles = buildRoleConfigs(available);
  const content = renderSheet(roles);
  const path = options.out ?? defaultOutPath(options.home);
  writeAtomic(path, content);
  return { path, content, roles, available: [...available].sort() };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  const piped = process.stdin.isTTY ? "" : readStdin();
  const text = piped.trim() ? piped : detectModelsList();
  const result = writeFromModelsList(text, args);
  process.stdout.write(`${result.path}\n`);
}
