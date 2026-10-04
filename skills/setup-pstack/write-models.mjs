#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
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

const KNOWN_ROLES = new Set([...SINGLE_ROLES, ...PANEL_ROLES].map(([role]) => role));
const AGENTS_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../agents");

function profilePin(profile) {
  if (!/^pstack:(?:panel|poteto-agent)-(?:opus|swe|sonnet|codex)$/.test(profile)) {
    throw new Error(`unregistered profile ${profile}`);
  }
  const path = join(AGENTS_ROOT, profile.slice("pstack:".length), "AGENT.md");
  const pin = readFileSync(path, "utf8").match(/^model:\s*(\S+)/m)?.[1];
  if (!pin) throw new Error(`registered profile ${profile} has no model pin`);
  return pin;
}

function validateRow(role, profiles, available) {
  if (!KNOWN_ROLES.has(role)) throw new Error(`unknown role ${role}; correct the row explicitly`);
  if (!profiles.length) throw new Error(`role ${role} has no profiles`);
  for (const profile of profiles) {
    const pin = profilePin(profile);
    const alias = profile.match(/-(opus|swe|sonnet|codex)$/)[1];
    if (!available.has(alias)) throw new Error(`role ${role}: alias ${alias} is unavailable`);
    if (IMPLEMENTATION_ROLES.has(role) && profile.startsWith("pstack:panel-")) {
      const counterpart = implementationProfile(alias);
      if (profilePin(counterpart) !== pin) throw new Error(`role ${role}: counterpart model pins differ`);
    } else if (!IMPLEMENTATION_ROLES.has(role) && !profile.startsWith("pstack:panel-")) {
      throw new Error(`role ${role} requires review profiles`);
    }
  }
}

export function parseExistingSheet(content, available) {
  const rows = new Map();
  const lines = content.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^([^#`]+?):\s*(.*)$/);
    if (!match) continue;
    const role = match[1].trim();
    if (!KNOWN_ROLES.has(role) && !match[2].includes("pstack:")) continue;
    if (rows.has(role)) throw new Error(`line ${index + 1}: duplicate role ${role}`);
    const profiles = match[2].split(",").map((profile) => profile.trim());
    try { validateRow(role, profiles, available); }
    catch (error) { throw new Error(`line ${index + 1}: ${error.message}`); }
    rows.set(role, { role, profiles, requiredPerspectives: profiles.length, line: index });
  }
  return { rows, lines };
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
  const out = { home: process.env.HOME, out: undefined, roles: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--home" || arg === "--out") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) throw new Error(`${arg} requires a path`);
      out[arg.slice(2)] = argv[++i];
    }
    else if (arg === "--role") {
      if (!argv[i + 1]) throw new Error("--role requires role=profile[,profile...]");
      out.roles.push(argv[++i]);
    }
    else throw new Error(`unknown argument ${arg}`);
  }
  return out;
}

export function writeFromModelsList(text, options = {}) {
  const available = parseDevinModelsList(text);
  const defaults = buildRoleConfigs(available);
  const path = options.out ?? defaultOutPath(options.home);
  const existing = existsSync(path) ? readFileSync(path, "utf8") : undefined;
  const parsed = parseExistingSheet(existing ?? renderSheet(defaults), available);
  const overrides = new Map();
  for (const override of options.roles ?? []) {
    const equals = override.indexOf("=");
    if (equals < 1) throw new Error(`invalid role override ${override}`);
    const role = override.slice(0, equals).trim();
    const profiles = override.slice(equals + 1).split(",").map((profile) => profile.trim());
    if (overrides.has(role)) throw new Error(`duplicate override for role ${role}`);
    validateRow(role, profiles, available);
    overrides.set(role, { role, profiles, requiredPerspectives: profiles.length });
  }
  const roles = [];
  for (const [role, row] of parsed.rows) {
    const selected = overrides.get(role) ?? row;
    roles.push({ role, profiles: selected.profiles, requiredPerspectives: selected.profiles.length });
    if (overrides.has(role)) parsed.lines[row.line] = `${role}: ${selected.profiles.join(", ")}`;
  }
  const additions = [];
  for (const row of defaults) {
    if (parsed.rows.has(row.role)) continue;
    const selected = overrides.get(row.role) ?? row;
    roles.push(selected);
    additions.push(`${selected.role}: ${selected.profiles.join(", ")}`);
  }
  let content = parsed.lines.join("\n");
  if (additions.length) content = `${content}${content.endsWith("\n") ? "" : "\n"}${additions.join("\n")}\n`;
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
