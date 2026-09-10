import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
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
const skillsRoot = join(repoRoot, "skills");
const potetoRoot = join(skillsRoot, "poteto-mode");

function frontmatterModel(path) {
  return readFileSync(path, "utf8").match(/^model: (.+)$/m)?.[1];
}

function walkMarkdown(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMarkdown(path));
    else if (entry.name.endsWith(".md")) out.push(path);
  }
  return out;
}

function relativeLinks(text) {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)].map(([, target]) => target);
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

describe("poteto core completion contract", () => {
  it("resolves every relative Markdown link in the shipped skill tree", () => {
    const files = [
      ...walkMarkdown(skillsRoot),
      join(repoRoot, "AGENTS.md"),
      join(repoRoot, "README.md"),
    ];
    let checked = 0;
    for (const file of files) {
      for (const raw of relativeLinks(readFileSync(file, "utf8"))) {
        if (/^(?:https?:|mailto:|#)/.test(raw) || raw.includes("$")) continue;
        const target = raw.split("#")[0].split("?")[0];
        if (!target) continue;
        checked += 1;
        assert.equal(
          existsSync(resolve(dirname(file), target)),
          true,
          `${file} links to missing ${raw}`,
        );
      }
    }
    assert.ok(checked > 100, `expected the shipped tree to expose links, saw ${checked}`);
  });

  it("lists every shipped principle leaf in the catalog", () => {
    const catalog = readFileSync(
      join(potetoRoot, "references", "principles.md"),
      "utf8",
    );
    const catalogued = new Set(
      [...catalog.matchAll(/`skills\/(principle-[a-z0-9-]+)\/SKILL\.md`/g)].map(
        ([, name]) => name,
      ),
    );
    const shipped = readdirSync(skillsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("principle-"))
      .map((entry) => entry.name)
      .sort();

    assert.equal(shipped.length, 23);
    assert.deepEqual([...catalogued].sort(), shipped);
    for (const name of shipped) {
      const leaf = join(skillsRoot, name, "SKILL.md");
      assert.equal(existsSync(leaf), true, `${name} has no SKILL.md`);
      const text = readFileSync(leaf, "utf8");
      assert.match(text, new RegExp(`^name: ${name}$`, "m"));
      assert.match(text, /triggers:\n\s*-\s*model/);
    }
  });

  it("maps every referenced pstack profile to a registered agent", () => {
    const profiles = new Set();
    for (const file of [join(potetoRoot, "SKILL.md"), ...walkMarkdown(potetoRoot)]) {
      const text = readFileSync(file, "utf8");
      for (const [profile] of text.matchAll(/pstack:(?:panel|poteto-agent)-[a-z0-9-]+/g)) {
        profiles.add(profile);
      }
    }

    assert.ok(profiles.size > 0);
    for (const profile of profiles) {
      const name = profile.replace("pstack:", "");
      const path = join(repoRoot, "agents", name, "AGENT.md");
      assert.equal(existsSync(path), true, `${profile} is not registered`);
      assert.match(readFileSync(path, "utf8"), /^model: .+$/m);

      if (!profile.startsWith("pstack:poteto-agent-")) continue;
      const alias = profile.replace("pstack:poteto-agent-", "");
      const panel = join(repoRoot, "agents", `panel-${alias}`, "AGENT.md");
      if (!existsSync(panel)) continue;
      assert.equal(
        frontmatterModel(path),
        frontmatterModel(panel),
        `${profile} must share its panel pin`,
      );
    }
  });

  it("routes explicit shipping and autopilot requests to a cut verdict first", () => {
    const skill = readFileSync(join(potetoRoot, "SKILL.md"), "utf8");
    const delivery = readFileSync(
      join(potetoRoot, "references", "delivery-capability.md"),
      "utf8",
    );
    for (const name of ["shipping", "autopilot-full", "autopilot-stack"]) {
      assert.match(
        delivery,
        new RegExp(`^\\| ${name} \\|[^\\n]*\\| cut \\|`, "m"),
        `${name} must have a cut verdict row`,
      );
      assert.ok(skill.includes(name), `SKILL.md must name the cut workflow ${name}`);
    }
    assert.ok(
      skill.indexOf("references/delivery-capability.md") <
        skill.indexOf("Otherwise use the specific task route below"),
      "the explicit delivery route must precede the generic fallback",
    );
  });

  it("requires a root-provisioned workspace wherever writers dispatch", () => {
    const writerFiles = [
      join(potetoRoot, "playbooks", "feature.md"),
      join(potetoRoot, "playbooks", "hillclimb.md"),
      join(potetoRoot, "playbooks", "prototype.md"),
      join(potetoRoot, "playbooks", "visual-parity.md"),
      join(potetoRoot, "playbooks", "orchestrate.md"),
      join(skillsRoot, "figure-it-out", "SKILL.md"),
      join(skillsRoot, "swarm", "SKILL.md"),
      join(skillsRoot, "arena", "SKILL.md"),
    ];
    for (const file of writerFiles) {
      const text = readFileSync(file, "utf8");
      assert.match(text, /(?:root-)?provision(?:ed)?/i, `${file} must provision the workspace`);
      assert.match(text, /worktree|directory|workspace/i, `${file} must name a separate workspace`);
    }

    const delegation = readFileSync(
      join(potetoRoot, "references", "delegation.md"),
      "utf8",
    );
    assert.match(delegation, /worktree add/);
    assert.match(delegation, /rev-parse --show-toplevel/);
    assert.match(delegation, /git -C/);
    assert.match(
      readFileSync(join(potetoRoot, "references", "panel-run.md"), "utf8"),
      /separate branch is not isolation/i,
    );
  });

  it("keeps the dispatch contract on documented run_subagent fields", () => {
    const allowed = new Set(["profile", "task", "title", "is_background", "resume"]);
    let blocks = 0;
    for (const file of walkMarkdown(skillsRoot)) {
      const text = readFileSync(file, "utf8");
      for (const [, body] of text.matchAll(/```json\n([\s\S]*?)```/g)) {
        if (!body.includes('"profile"')) continue;
        blocks += 1;
        for (const key of Object.keys(JSON.parse(body))) {
          assert.ok(allowed.has(key), `${file} uses unsupported dispatch field ${key}`);
        }
      }
      assert.doesNotMatch(
        text,
        /subagent_type|run_in_background|disable-model-invocation/,
        `${file} reintroduces a Cursor or Claude dispatch field`,
      );
    }
    assert.ok(blocks > 0, "expected at least one documented dispatch example");

    for (const reference of ["delegation.md", "panel-run.md"]) {
      const text = readFileSync(join(potetoRoot, "references", reference), "utf8");
      assert.match(text, /read_subagent/, `${reference} must document collection`);
    }
    assert.match(
      readFileSync(join(potetoRoot, "references", "delegation.md"), "utf8"),
      /agentId[\s\S]*parentVerdict/,
    );
  });
});
