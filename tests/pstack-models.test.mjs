import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import {
  buildRoleConfigs,
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

  it("repeats one profile for three critic perspectives when only swe exists", () => {
    const roles = buildRoleConfigs(parseDevinModelsList(LIST_SWE));
    const critics = roles.find((row) => row.role === "how critics");
    assert.deepEqual(critics.profiles, [
      "pstack:panel-swe",
      "pstack:panel-swe",
      "pstack:panel-swe",
    ]);
    const bugFix = roles.find((row) => row.role === "bug-fix");
    assert.deepEqual(bugFix.profiles, ["pstack:panel-swe"]);
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
    assert.doesNotMatch(first.content, /claude-/);
  });
});
