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
import { buildRoleConfigs } from "../skills/setup-pstack/write-models.mjs";

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
      [...skill.matchAll(/^- (.+): `(pstack:(?:panel|poteto-agent)-(?:opus|swe))`$/gm)].map(
        ([, role, profile]) => [role, profile],
      ),
    );
    const expected = new Map([
      ["feature, refactoring", "pstack:poteto-agent-opus"],
      ["bug-fix", "pstack:poteto-agent-swe"],
      ["perf-issue", "pstack:poteto-agent-swe"],
      ["hillclimb", "pstack:poteto-agent-swe"],
      ["judgment and prose", "pstack:panel-opus"],
      ["strongest judgment", "pstack:panel-swe"],
    ]);

    assert.deepEqual(defaults, expected);
    for (const profile of new Set(defaults.values())) {
      const name = profile.replace("pstack:", "");
      assert.equal(existsSync(join(repoRoot, "agents", name, "AGENT.md")), true);
    }
  });

  it("requires delegated implementation for every nontrivial implementation workflow", () => {
    const skill = readFileSync(skillSource, "utf8");
    assert.match(skill, /Every nontrivial implementation uses its dedicated implementation profile/);
    assert.match(skill, /including one sequential worker/);
    assert.match(skill, /Include an early checkpoint path, work budget, no-progress threshold, and bounded recovery count/);
    assert.doesNotMatch(skill, /Handle small, tightly scoped, sequential implementation directly/);
    assert.doesNotMatch(skill, /Spawn a worker only when the slice is independently parallelizable/);
  });

  it("documents deterministic same-pin routing and a concrete checkpoint budget", () => {
    const delegation = readFileSync(
      join(repoRoot, "skills", "poteto-mode", "references", "delegation.md"),
      "utf8",
    );
    assert.match(delegation, /panel-<alias>.*poteto-agent-<alias>/s);
    assert.match(delegation, /require equal `model:` frontmatter pins/);
    assert.match(delegation, /checkpoint\.md/);
    assert.match(delegation, /15-minute work quantum/);
    assert.match(delegation, /no-progress diagnostics/);
    assert.match(delegation, /"profile": "pstack:poteto-agent-sonnet"/);
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

  it("embeds the shared implementation contract in every implementation profile", () => {
    const shared = readFileSync(
      join(repoRoot, "skills", "poteto-mode", "references", "implementation-worker.md"),
      "utf8",
    );
    const profiles = {
      "poteto-agent": "gpt-5-6-sol-medium",
      "poteto-agent-opus": "gpt-5-6-sol-medium",
      "poteto-agent-sonnet": "glm-5-3-flash-high",
      "poteto-agent-swe": "swe",
      "poteto-agent-codex": "gpt-5-6-sol-medium",
    };
    for (const [profile, pin] of Object.entries(profiles)) {
      const path = join(repoRoot, "agents", profile, "AGENT.md");
      const content = readFileSync(path, "utf8");
      assert.equal(frontmatterModel(path), pin);
      assert.ok(content.includes(shared), `${profile} must embed the shared contract verbatim`);
    }
  });

  it("keeps implementation defaults on legacy-equivalent model pins", () => {
    const roles = new Map(buildRoleConfigs(new Set(["opus", "swe"])).map((row) => [row.role, row]));
    for (const [role, alias] of [["feature, refactoring", "opus"], ["bug-fix", "swe"], ["perf-issue", "swe"], ["hillclimb", "swe"]]) {
      const implementationPath = join(repoRoot, "agents", `poteto-agent-${alias}`, "AGENT.md");
      const panelPath = join(repoRoot, "agents", `panel-${alias}`, "AGENT.md");
      assert.deepEqual(roles.get(role).profiles, [`pstack:poteto-agent-${alias}`]);
      assert.equal(frontmatterModel(implementationPath), frontmatterModel(panelPath));
    }
  });
});
