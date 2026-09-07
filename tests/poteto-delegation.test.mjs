import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillSource = join(repoRoot, "skills", "poteto-mode", "SKILL.md");

function frontmatterModel(path) {
  return readFileSync(path, "utf8").match(/^model: (.+)$/m)?.[1];
}

describe("poteto delegation contract", () => {
  it("resolves worker references from the loaded skill outside the plugin checkout", () => {
    const consumer = mkdtempSync(join(tmpdir(), "task-summary-cli-"));
    const previousCwd = process.cwd();

    try {
      process.chdir(consumer);
      assert.equal(existsSync(join(consumer, "skills")), false);

      const installedRoot = resolve(dirname(skillSource), "../..");
      assert.equal(installedRoot, repoRoot);
      assert.equal(
        existsSync(
          join(
            installedRoot,
            "skills",
            "poteto-mode",
            "references",
            "implementation-worker.md",
          ),
        ),
        true,
      );
    } finally {
      process.chdir(previousCwd);
      rmSync(consumer, { recursive: true, force: true });
    }
  });

  it("uses registered profiles for every poteto default", () => {
    const skill = readFileSync(skillSource, "utf8");
    const defaults = new Map(
      [...skill.matchAll(/^- (.+): `(pstack:panel-(?:opus|swe))`$/gm)].map(
        ([, role, profile]) => [role, profile],
      ),
    );
    const expected = new Map([
      ["feature, refactoring", "pstack:panel-opus"],
      ["bug-fix", "pstack:panel-swe"],
      ["perf-issue", "pstack:panel-swe"],
      ["hillclimb", "pstack:panel-swe"],
      ["judgment and prose", "pstack:panel-opus"],
      ["strongest judgment", "pstack:panel-swe"],
    ]);

    assert.deepEqual(defaults, expected);
    for (const profile of new Set(defaults.values())) {
      const name = profile.replace("pstack:", "");
      assert.equal(existsSync(join(repoRoot, "agents", name, "AGENT.md")), true);
    }
  });

  it("preserves every model-pinned profile frontmatter value", () => {
    const pins = {
      "panel-codex": "gpt-5-6-sol-medium",
      "panel-opus": "gpt-5-6-sol-medium",
      "panel-sonnet": "glm-5-3-flash-high",
      "panel-swe": "swe",
      "poteto-agent": "gpt-5-6-sol-medium",
    };

    for (const [profile, pin] of Object.entries(pins)) {
      assert.equal(
        frontmatterModel(join(repoRoot, "agents", profile, "AGENT.md")),
        pin,
      );
    }
  });
});
