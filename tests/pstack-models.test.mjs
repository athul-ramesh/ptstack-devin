import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import {
  buildRoleConfigs,
  implementationProfile,
  parseDevinModelsList,
  writeFromModelsList,
} from "../skills/setup-pstack/write-models.mjs";

const LIST_FOUR = `
Claude Opus 5 (claude-opus-5)
  aliases: opus
SWE-1.7 Lightning (swe-1.7-lightning)
  aliases: swe
Claude Sonnet 5 (claude-sonnet-5)
  aliases: claude, sonnet
GPT-5.3-Codex (gpt-5.3-codex)
  aliases: codex
`;

const LIST_SWE = `
SWE-1.7 Lightning (swe-1.7-lightning)
  aliases: swe
`;

describe("pstack models sheet", () => {
  it("documents implementation and review profile families without rerunning configuration", () => {
    const root = join(dirname(fileURLToPath(import.meta.url)), "..");
    const skill = readFileSync(join(root, "skills", "setup-pstack", "SKILL.md"), "utf8");
    assert.match(skill, /poteto-agent-<alias>/);
    assert.match(skill, /panel-<alias>/);
    assert.match(skill, /frontmatter `model:` pin is authoritative/);
    assert.match(skill, /maps implementation roles to registered `poteto-agent` profiles/);
    assert.match(skill, /replaces the file atomically/);
  });

  it("parses only alias lines from devin models list", () => {
    const ids = parseDevinModelsList(LIST_FOUR);
    assert.deepEqual([...ids].sort(), ["claude", "codex", "opus", "sonnet", "swe"]);
  });

  it("maps panel roles to registered profiles and keeps list length", () => {
    const roles = buildRoleConfigs(parseDevinModelsList(LIST_FOUR));
    const critics = roles.find((row) => row.role === "how critics");
    assert.deepEqual(critics.profiles, [
      "pstack:panel-opus",
      "pstack:panel-swe",
      "pstack:panel-sonnet",
    ]);
    assert.equal(critics.requiredPerspectives, 3);
  });

  it("routes implementation roles to dedicated workers and keeps panels for review roles", () => {
    const roles = new Map(buildRoleConfigs(parseDevinModelsList(LIST_FOUR)).map((row) => [row.role, row]));
    assert.deepEqual(roles.get("feature, refactoring").profiles, [implementationProfile("opus")]);
    assert.deepEqual(roles.get("bug-fix").profiles, [implementationProfile("sonnet")]);
    assert.deepEqual(roles.get("perf-issue").profiles, [implementationProfile("opus")]);
    assert.deepEqual(roles.get("hillclimb").profiles, [implementationProfile("sonnet")]);
    assert.deepEqual(roles.get("judgment and prose").profiles, ["pstack:panel-opus"]);
    assert.deepEqual(roles.get("how critics").profiles, ["pstack:panel-opus", "pstack:panel-swe", "pstack:panel-sonnet"]);
  });

  it("repeats one profile for three critic perspectives when only swe exists", () => {
    const roles = buildRoleConfigs(parseDevinModelsList(LIST_SWE));
    const critics = roles.find((row) => row.role === "how critics");
    assert.deepEqual(critics.profiles, [
      "pstack:panel-swe",
      "pstack:panel-swe",
      "pstack:panel-swe",
    ]);
    const bugFix = roles.find((row) => row.role === "bug-fix");
    assert.deepEqual(bugFix.profiles, ["pstack:poteto-agent-swe"]);
  });

  it("writes an identical file on rerun and states the sequential fallback", () => {
    const dir = mkdtempSync(join(tmpdir(), "pstack-models-"));
    const out = join(dir, "pstack-models.md");
    const first = writeFromModelsList(LIST_SWE, { out });
    const second = writeFromModelsList(LIST_SWE, { out });
    assert.equal(first.content, second.content);
    assert.equal(readFileSync(out, "utf8"), first.content);
    assert.match(first.content, /sequential fresh-context/);
    assert.match(first.content, /Do not label one pass as a panel/);
    assert.match(first.content, /Implementation roles use `pstack:poteto-agent-<alias>`; review roles use `pstack:panel-<alias>`/);
    assert.match(first.content, /frontmatter `model:` pin is authoritative/);
    assert.doesNotMatch(first.content, /claude-/);
  });
});
