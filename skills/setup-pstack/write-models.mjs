#!/usr/bin/env node

import {
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

export const CORE_ALIASES = Object.freeze(["opus", "swe", "sonnet", "codex"]);

export const SINGLE_ROLES = Object.freeze([
  ["feature, refactoring", "opus"],
  ["bug-fix", "swe"],
  ["perf-issue", "swe"],
  ["hillclimb", "swe"],
  ["judgment and prose", "opus"],
  ["strongest judgment", "swe"],
  ["how explorer", "opus"],
  ["how explainer", "opus"],
  ["why investigators", "opus"],
  ["why synthesizer", "opus"],
  ["reflect tooling", "opus"],
  ["reflect judgment, divergent, synthesizer", "opus"],
  ["swarm workers", "opus"],
]);

export const PANEL_ROLES = Object.freeze([
  ["how critics", ["opus", "swe", "sonnet"]],
  ["arena runners", ["opus", "swe", "sonnet"]],
  ["arena cross-judge pool", ["opus", "swe", "sonnet"]],
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

export function discoverShippedAliases(pluginRoot) {
  const root = resolve(pluginRoot);
  const panel = new Set();
  const implementation = new Set();
  for (const entry of readdirSync(join(root, "agents"), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("panel-")) {
      panel.add(entry.name.slice("panel-".length));
    } else if (entry.name.startsWith("poteto-agent-")) {
      implementation.add(entry.name.slice("poteto-agent-".length));
    }
  }
  // A usable alias has both a panel profile and a dedicated implementation profile.
  const usable = new Set();
  for (const alias of panel) {
    if (implementation.has(alias)) usable.add(alias);
  }
  return usable;
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
  const sorted = [...available].sort();
  return sorted[0];
}

export function resolveAlias(preferred, available) {
  if (available.has(preferred)) return preferred;
  return firstAvailableAlias(available);
}

export function buildRoleConfigs(available) {
  const fallback = firstAvailableAlias(available);
  if (!fallback) {
    throw new Error("No shipped pstack profiles are available in the detected Devin model aliases");
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
    "Resolve the installed pstack root from `$HOME/.config/devin/pstack-root` and use absolute paths for all `skills/`, `agents/`, and `playbooks/` references.",
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

export function defaultRootPath(home = process.env.HOME) {
  if (!home) throw new Error("HOME is not set");
  return join(home, ".config", "devin", "pstack-root");
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
  const out = { home: process.env.HOME, out: undefined, pluginRoot: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--home") out.home = argv[++i];
    else if (arg === "--out") out.out = argv[++i];
    else if (arg === "--plugin-root") out.pluginRoot = argv[++i];
    else throw new Error(`unknown argument ${arg}`);
  }
  return out;
}

export function writeFromModelsList(text, options = {}) {
  const devinAliases = parseDevinModelsList(text);
  let available = devinAliases;
  let shipped;
  let pluginRoot;
  if (options.pluginRoot) {
    pluginRoot = resolve(options.pluginRoot);
    shipped = discoverShippedAliases(pluginRoot);
    available = new Set([...shipped].filter((a) => devinAliases.has(a)));
  }
  if (available.size === 0) {
    const reported = [...devinAliases].sort().join(", ") || "(none)";
    const shippedList = shipped ? [...shipped].sort().join(", ") : "(unknown)";
    throw new Error(
      `No shipped pstack profiles are available. Shipped: ${shippedList}. Devin aliases: ${reported}.`
    );
  }
  const roles = buildRoleConfigs(available);
  const content = renderSheet(roles);
  const path = options.out ?? defaultOutPath(options.home);
  writeAtomic(path, content);

  let rootPath;
  if (options.pluginRoot) {
    rootPath = options.rootOut ?? defaultRootPath(options.home);
    writeAtomic(rootPath, pluginRoot);
  }

  return {
    path,
    content,
    roles,
    available: [...available].sort(),
    ...(rootPath ? { rootPath, pluginRoot } : {}),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  const piped = process.stdin.isTTY ? "" : readStdin();
  const text = piped.trim() ? piped : detectModelsList();
  const result = writeFromModelsList(text, {
    home: args.home,
    out: args.out,
    pluginRoot: args.pluginRoot,
  });
  process.stdout.write(`${result.path}\n`);
  if (result.rootPath) {
    process.stdout.write(`${result.rootPath}\n`);
  }
}
