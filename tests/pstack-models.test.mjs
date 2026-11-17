import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
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
    const runners = roles.find((row) => row.role === "arena runners");
    assert.deepEqual(runners.profiles, [
      "pstack:panel-opus",
      "pstack:panel-swe",
      "pstack:panel-sonnet",
    ]);
    assert.equal(runners.requiredPerspectives, 3);
  });

  it("routes implementation roles to dedicated workers and keeps panels for review roles", () => {
    const roles = new Map(buildRoleConfigs(parseDevinModelsList(LIST_FOUR)).map((row) => [row.role, row]));
    assert.deepEqual(roles.get("feature, refactoring").profiles, [implementationProfile("opus")]);
    assert.deepEqual(roles.get("bug-fix").profiles, [implementationProfile("opus")]);
    assert.deepEqual(roles.get("perf-issue").profiles, [implementationProfile("opus")]);
    assert.deepEqual(roles.get("hillclimb").profiles, [implementationProfile("opus")]);
    assert.deepEqual(roles.get("judgment and prose").profiles, ["pstack:panel-opus"]);
    assert.deepEqual(roles.get("arena runners").profiles, ["pstack:panel-opus", "pstack:panel-swe", "pstack:panel-sonnet"]);
    assert.equal(roles.has("how explorer"), false);
    assert.equal(roles.has("why investigators"), false);
  });

  it("repeats one profile for three critic perspectives when only swe exists", () => {
    const roles = buildRoleConfigs(parseDevinModelsList(LIST_SWE));
    const runners = roles.find((row) => row.role === "arena runners");
    assert.deepEqual(runners.profiles, [
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
    assert.match(first.content, /^# defaults: 2$/m);
    assert.doesNotMatch(first.content, /claude-|grok-|gemini-4-carbon|claude-fable/);
  });
  it("preserves role order, notes, repeated perspectives and explicit overrides on rerun", () => {
    const out = join(mkdtempSync(join(tmpdir(), "pstack-models-")), "sheet.md");
    writeFileSync(out, "# My models\n\nNotes: Keep my preferred review order.\narena runners: pstack:panel-codex, pstack:panel-codex\nbug-fix: pstack:panel-opus\n");
    const first = writeFromModelsList(LIST_FOUR, { out, roles: ["swarm workers=pstack:panel-sonnet", "feature, refactoring=pstack:poteto-agent-codex"] });
    assert.match(first.content, /Notes: Keep my preferred review order/);
    assert.match(first.content, /^# defaults: 2$/m);
    assert.equal(first.roles[0].role, "arena runners");
    assert.equal(first.roles[0].requiredPerspectives, 2);
    assert.deepEqual(first.roles[1].profiles, ["pstack:panel-opus"]);
    assert.match(first.content, /swarm workers: pstack:panel-sonnet/);
    assert.equal(writeFromModelsList(LIST_FOUR, { out }).content, first.content);
  });

  it("rejects invalid existing rows without changing any bytes", () => {
    const out = join(mkdtempSync(join(tmpdir(), "pstack-models-")), "sheet.md");
    for (const content of [
      "bug-fix: pstack:poteto-agent-swe\nbug-fix: pstack:poteto-agent-opus\n",
      "unknown role: pstack:panel-opus\n",
      "bug-fix: pstack:panel-missing\n",
      "arena runners: pstack:poteto-agent-opus\n",
      "bug-fix: \n",
    ]) {
      writeFileSync(out, content);
      assert.throws(() => writeFromModelsList(LIST_FOUR, { out }), /line \d+:/);
      assert.equal(readFileSync(out, "utf8"), content);
    }
  });

  it("rejects invalid overrides and unavailable existing choices without writes", () => {
    const out = join(mkdtempSync(join(tmpdir(), "pstack-models-")), "sheet.md");
    const content = writeFromModelsList(LIST_FOUR, { out }).content;
    for (const roles of [
      ["no such role=pstack:panel-opus"],
      ["arena runners=pstack:poteto-agent-opus"],
      ["bug-fix=pstack:poteto-agent-claude"],
      ["bug-fix=pstack:poteto-agent-opus", "bug-fix=pstack:poteto-agent-swe"],
    ]) {
      assert.throws(() => writeFromModelsList(LIST_FOUR, { out, roles }));
      assert.equal(readFileSync(out, "utf8"), content);
    }
    assert.throws(() => writeFromModelsList(LIST_SWE, { out }), /unavailable/);
    assert.equal(readFileSync(out, "utf8"), content);
  });

  it("accepts repeatable CLI role overrides", () => {
    const out = join(mkdtempSync(join(tmpdir(), "pstack-models-")), "sheet.md");
    const script = join(dirname(fileURLToPath(import.meta.url)), "../skills/setup-pstack/write-models.mjs");
    const result = spawnSync(process.execPath, [script, "--out", out,
      "--role", "bug-fix=pstack:poteto-agent-codex",
      "--role", "arena runners=pstack:panel-swe,pstack:panel-swe"], { input: LIST_FOUR, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const sheet = readFileSync(out, "utf8");
    assert.match(sheet, /bug-fix: pstack:poteto-agent-codex/);
    assert.match(sheet, /arena runners: pstack:panel-swe, pstack:panel-swe/);
  });

  it("migrates old bug-fix and hillclimb defaults once, and drops retired roles", () => {
    const out = join(mkdtempSync(join(tmpdir(), "pstack-models-")), "sheet.md");
    writeFileSync(out, [
      "# old",
      "bug-fix: pstack:poteto-agent-sonnet",
      "hillclimb: pstack:poteto-agent-sonnet",
      "swarm workers: pstack:panel-codex",
      "how explorer: pstack:panel-sonnet",
      "why investigators: pstack:panel-opus",
      "",
    ].join("\n"));
    const first = writeFromModelsList(LIST_FOUR, { out });
    assert.match(first.content, /^# defaults: 2$/m);
    assert.match(first.content, /bug-fix: pstack:poteto-agent-opus/);
    assert.match(first.content, /hillclimb: pstack:poteto-agent-opus/);
    assert.match(first.content, /swarm workers: pstack:panel-codex/);
    assert.doesNotMatch(first.content, /how explorer|why investigators|how critics/);
    assert.deepEqual(first.migrations, [
      "bug-fix: pstack:poteto-agent-sonnet -> pstack:poteto-agent-opus",
      "hillclimb: pstack:poteto-agent-sonnet -> pstack:poteto-agent-opus",
    ]);
    assert.deepEqual(first.dropped, ["how explorer", "why investigators"]);
    writeFileSync(out, first.content.replace("bug-fix: pstack:poteto-agent-opus", "bug-fix: pstack:poteto-agent-codex"));
    const kept = writeFromModelsList(LIST_FOUR, { out });
    assert.match(kept.content, /bug-fix: pstack:poteto-agent-codex/);
    assert.deepEqual(kept.migrations, []);
    assert.equal(writeFromModelsList(LIST_FOUR, { out }).content, kept.content);
  });

});
