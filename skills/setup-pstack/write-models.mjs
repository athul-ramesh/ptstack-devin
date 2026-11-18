#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

export const CORE_ALIASES = Object.freeze(["opus", "swe", "sonnet", "codex"]);

export const SINGLE_ROLES = Object.freeze([
  ["feature, refactoring", "opus"],
  ["bug-fix", "opus"],
  ["perf-issue", "opus"],
  ["hillclimb", "opus"],
  ["judgment and prose", "opus"],
  ["strongest judgment", "opus"],
  ["swarm workers", "sonnet"],
]);

export const PANEL_ROLES = Object.freeze([
  ["arena runners", ["opus", "swe", "sonnet"]],
  ["arena cross-judge pool", ["opus", "swe"]],
  ["interrogate reviewers", ["opus", "swe", "sonnet"]],
]);

export const DEFAULTS_MARKER = "# defaults: 3";
export const PREVIOUS_MARKER = "# defaults: 2";

export const RETIRED_ROLES = Object.freeze([
  "how explorer",
  "how explainer",
  "how critics",
  "why investigators",
  "why synthesizer",
  "architect runners",
  "reflect tooling",
  "reflect judgment, divergent, synthesizer",
]);

const RETIRED = new Set(RETIRED_ROLES);

const PREVIOUS_DEFAULTS = new Map([
  ["bug-fix", ["pstack:poteto-agent-sonnet"]],
  ["hillclimb", ["pstack:poteto-agent-sonnet"]],
]);

const MIGRATION_ALIAS = new Map([
  ["bug-fix", "opus"],
  ["hillclimb", "opus"],
]);

const IMPLEMENTATION_ROLES = new Set([
  "feature, refactoring",
  "bug-fix",
  "perf-issue",
  "hillclimb",
]);

const MODEL_ID = /^[a-z][a-z0-9.-]*$/;

function addId(ids, value) {
  if (typeof value === "string" && MODEL_ID.test(value)) ids.add(value);
}

function familiesFromJson(value) {
  const families = Array.isArray(value) ? value : value?.families;
  if (!Array.isArray(families)) return undefined;
  if (!families.every((family) => family && typeof family === "object" && !Array.isArray(family))) return undefined;
  return families;
}

function idsFromFamilies(families) {
  const ids = new Set();
  for (const family of families) {
    addId(ids, family.slug);
    addId(ids, family.family_uid);
    if (Array.isArray(family.aliases)) {
      for (const alias of family.aliases) addId(ids, alias);
    }
    if (Array.isArray(family.variants)) {
      for (const variant of family.variants) {
        if (variant && typeof variant === "object") addId(ids, variant.model_uid);
      }
    }
  }
  return ids;
}

function parseTextModelsList(text) {
  const ids = new Set();
  for (const line of text.split(/\r?\n/)) {
    const aliases = line.match(/^\s*aliases:\s*(.+)$/);
    if (aliases) {
      for (const part of aliases[1].split(",")) addId(ids, part.trim());
    }
    const modelUid = line.match(/^\s*model_uid:\s*(\S+)\s*$/);
    if (modelUid) addId(ids, modelUid[1]);
    for (const match of line.matchAll(/\(([a-z][a-z0-9.-]*)\)/g)) addId(ids, match[1]);
  }
  return ids;
}

export function parseDevinModelsList(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const families = familiesFromJson(JSON.parse(trimmed));
      if (families !== undefined) return idsFromFamilies(families);
    } catch {
      return parseTextModelsList(text);
    }
  }
  return parseTextModelsList(text);
}

function catalogStdout(stdout) {
  if (typeof stdout !== "string") return false;
  const trimmed = stdout.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return false;
  try {
    return Boolean(familiesFromJson(JSON.parse(trimmed)));
  } catch {
    return false;
  }
}

export function chooseModelsListOutput(jsonResult, textResult) {
  if (jsonResult && jsonResult.status === 0 && catalogStdout(jsonResult.stdout)) return jsonResult.stdout;
  if (textResult && textResult.status === 0 && typeof textResult.stdout === "string") return textResult.stdout;
  const detail = [jsonResult?.stderr, textResult?.stderr].map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
  throw new Error(detail.join("\n") || "devin models list failed");
}

export function panelProfile(alias) {
  return `pstack:panel-${alias}`;
}

export function implementationProfile(alias) {
  return `pstack:poteto-agent-${alias}`;
}

function profileRecord(suffix, kind, registry) {
  if (!suffix) return undefined;
  const profile = kind === "implementation" ? implementationProfile(suffix) : panelProfile(suffix);
  return registry.get(profile);
}

function suffixUsable(suffix, kind, available, registry) {
  const record = profileRecord(suffix, kind, registry);
  return Boolean(record?.pin && available.has(record.pin));
}

function firstAvailableSuffix(available, kind, registry) {
  for (const suffix of CORE_ALIASES) {
    if (suffixUsable(suffix, kind, available, registry)) return suffix;
  }
  return undefined;
}

export function firstAvailableAlias(available, kind = "review") {
  return firstAvailableSuffix(available, kind, loadRegistry());
}

export function resolveAlias(preferred, available, kind = "review") {
  const registry = loadRegistry();
  if (suffixUsable(preferred, kind, available, registry)) return preferred;
  return firstAvailableSuffix(available, kind, registry);
}

export function buildRoleConfigs(available, registry = loadRegistry()) {
  const implementationFallback = firstAvailableSuffix(available, "implementation", registry);
  const reviewFallback = firstAvailableSuffix(available, "review", registry);
  if (!implementationFallback || !reviewFallback) {
    throw new Error("no registered profile has a model pin in devin models list");
  }
  const roles = [];
  for (const [role, preferred] of SINGLE_ROLES) {
    const kind = IMPLEMENTATION_ROLES.has(role) ? "implementation" : "review";
    const fallback = kind === "implementation" ? implementationFallback : reviewFallback;
    const alias = suffixUsable(preferred, kind, available, registry) ? preferred : fallback;
    roles.push({
      role,
      profiles: [
        kind === "implementation" ? implementationProfile(alias) : panelProfile(alias),
      ],
      requiredPerspectives: 1,
    });
  }
  for (const [role, preferred] of PANEL_ROLES) {
    const profiles = preferred.map((alias) => panelProfile(
      suffixUsable(alias, "review", available, registry) ? alias : reviewFallback,
    ));
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
    "A profile's frontmatter `model:` pin is authoritative and must appear in `devin models list`. Its suffix is only a role label. Delete a line to fall back to the skill default.",
    "",
    "When a role needs more perspectives than distinct profiles, run that many sequential fresh-context",
    "`run_subagent` calls on the available profile. Do not label one pass as a panel.",
    "",
    DEFAULTS_MARKER,
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

function loadRegistry() {
  const registry = new Map();
  if (!existsSync(AGENTS_ROOT)) return registry;
  for (const entry of readdirSync(AGENTS_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const agentPath = join(AGENTS_ROOT, entry.name, "AGENT.md");
    if (!existsSync(agentPath)) continue;
    const pin = readFileSync(agentPath, "utf8").match(/^model:\s*(\S+)/m)?.[1];
    let kind = "other";
    let suffix;
    if (entry.name.startsWith("poteto-agent-")) {
      kind = "implementation";
      suffix = entry.name.slice("poteto-agent-".length);
    } else if (entry.name.startsWith("panel-")) {
      kind = "review";
      suffix = entry.name.slice("panel-".length);
    }
    registry.set(`pstack:${entry.name}`, { name: entry.name, kind, suffix, pin });
  }
  return registry;
}

function registeredSample(registry, prefix) {
  return [...registry.values()]
    .filter((record) => record.name.startsWith(prefix) && record.pin)
    .map((record) => `pstack:${record.name}`)
    .sort()
    .slice(0, 3)
    .join(", ");
}

function unregisteredProfileMessage(profile, registry) {
  const name = profile.startsWith("pstack:") ? profile.slice("pstack:".length) : profile;
  const prefix = name.startsWith("poteto-agent") ? "poteto-agent-" : "panel-";
  const sample = registeredSample(registry, prefix);
  const file = profile.startsWith("pstack:") ? `agents/${name}/AGENT.md` : "agents/<name>/AGENT.md";
  return `unregistered profile ${profile}; no ${file}. Add that file with a model: pin from devin models list, or use a registered profile such as ${sample}`;
}

function validateRow(role, profiles, available, registry = loadRegistry()) {
  if (!KNOWN_ROLES.has(role)) throw new Error(`unknown role ${role}; correct the row explicitly`);
  if (!profiles.length) throw new Error(`role ${role} has no profiles`);
  for (const profile of profiles) {
    const record = registry.get(profile);
    if (!record) throw new Error(`role ${role}: ${unregisteredProfileMessage(profile, registry)}`);
    if (!record.pin) {
      throw new Error(`role ${role}: registered profile ${profile} has no model pin in agents/${record.name}/AGENT.md. Set model: to a model_uid from devin models list`);
    }
    if (!available.has(record.pin)) {
      throw new Error(`role ${role}: model pin ${record.pin} for ${profile} is unavailable. Choose a profile whose model: pin appears in devin models list`);
    }
    if (IMPLEMENTATION_ROLES.has(role) && profile.startsWith("pstack:panel-")) {
      const counterpart = implementationProfile(record.suffix);
      const other = registry.get(counterpart);
      if (!other?.pin) {
        throw new Error(`role ${role}: no registered counterpart ${counterpart}. Add agents/poteto-agent-${record.suffix}/AGENT.md with model: ${record.pin}`);
      }
      if (other.pin !== record.pin) throw new Error(`role ${role}: counterpart model pins differ`);
    } else if (!IMPLEMENTATION_ROLES.has(role) && !profile.startsWith("pstack:panel-")) {
      const suggestion = record.suffix ? ` Use pstack:panel-${record.suffix}.` : "";
      throw new Error(`role ${role} requires review profiles.${suggestion}`);
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
    if (RETIRED.has(role)) continue;
    if (!KNOWN_ROLES.has(role) && !match[2].includes("pstack:")) continue;
    if (rows.has(role)) throw new Error(`line ${index + 1}: duplicate role ${role}`);
    const profiles = match[2].split(",").map((profile) => profile.trim());
    try { validateRow(role, profiles, available); }
    catch (error) { throw new Error(`line ${index + 1}: ${error.message}`); }
    rows.set(role, { role, profiles, requiredPerspectives: profiles.length, line: index });
  }
  const hasMarker = lines.some((line) => line.trim() === DEFAULTS_MARKER);
  const hasPreviousMarker = lines.some((line) => line.trim() === PREVIOUS_MARKER);
  return { rows, lines, hasMarker, hasPreviousMarker };
}

function sameProfiles(left, right) {
  return left.length === right.length && left.every((profile, index) => profile === right[index]);
}

function dropRetired(lines) {
  return lines.filter((line) => {
    const match = line.match(/^([^#`][^:]*):/);
    return !(match && RETIRED.has(match[1].trim()));
  });
}

function ensureMarker(lines) {
  const next = [];
  let wrote = false;
  for (const line of lines) {
    if (line.trim() === DEFAULTS_MARKER || line.trim() === PREVIOUS_MARKER) {
      if (!wrote) {
        next.push(DEFAULTS_MARKER);
        wrote = true;
      }
      continue;
    }
    next.push(line);
  }
  if (wrote) return next;
  const at = next.findIndex((line) => {
    const match = line.match(/^([^#`][^:]*):/);
    return Boolean(match && KNOWN_ROLES.has(match[1].trim()));
  });
  next.splice(at === -1 ? next.length : at, 0, DEFAULTS_MARKER);
  return next;
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
  const spawnOptions = { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 };
  const jsonResult = spawnSync("devin", ["models", "list", "--format", "json"], spawnOptions);
  const textResult = catalogStdout(jsonResult.stdout) && jsonResult.status === 0
    ? undefined
    : spawnSync("devin", ["models", "list"], spawnOptions);
  return chooseModelsListOutput(jsonResult, textResult);
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
  const migrations = [];
  const dropped = [];
  if (existing) {
    for (const line of existing.split("\n")) {
      const match = line.match(/^([^#`][^:]*):\s*/);
      if (match && RETIRED.has(match[1].trim())) dropped.push(match[1].trim());
    }
  }
  if (!parsed.hasMarker && !parsed.hasPreviousMarker) {
    for (const [role, previous] of PREVIOUS_DEFAULTS) {
      const row = parsed.rows.get(role);
      const alias = MIGRATION_ALIAS.get(role);
      if (!row || !alias || !suffixUsable(alias, "implementation", available, loadRegistry()) || !sameProfiles(row.profiles, previous)) continue;
      const next = defaults.find((item) => item.role === role);
      row.profiles = next.profiles.slice();
      row.requiredPerspectives = next.profiles.length;
      parsed.lines[row.line] = `${role}: ${next.profiles.join(", ")}`;
      migrations.push(`${role}: ${previous.join(", ")} -> ${next.profiles.join(", ")}`);
    }
  }
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
  content = `${ensureMarker(dropRetired(content.split("\n"))).join("\n")}`;
  if (!content.endsWith("\n")) content = `${content}\n`;
  for (const line of migrations) console.error(`migrated ${line}`);
  for (const role of dropped) console.error(`dropped ${role}`);
  writeAtomic(path, content);
  return { path, content, roles, available: [...available].sort(), migrations, dropped };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  const piped = process.stdin.isTTY ? "" : readStdin();
  const text = piped.trim() ? piped : detectModelsList();
  const result = writeFromModelsList(text, args);
  process.stdout.write(`${result.path}\n`);
}
