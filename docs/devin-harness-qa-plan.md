# Devin harness QA and port hardening plan

**Goal.** Make the Devin port of pstack (`ptstack-devin` 0.12.0) match official Cursor pstack (`../plugins/pstack`) in workflow quality, while using the Devin harness correctly, without burning Pro usage on high-cost models during discovery.

**Smallest change that meets the goal.** Evidence-driven fixes only. Static deviation inventory first. Native Devin runs next, cost-tiered. Improvement PRs last, each sized to one verified failure class.

**Operator go required.** This file is the deliverable for the planning turn. No Devin sessions, remotes, or plugin edits until you approve the budget gates below.

## What changes (after go)

1. A live harness evidence pack under `docs/harness-qa/` (transcripts, capture logs, pass/fail matrix).
2. Targeted port fixes in skills, agents, hooks, and docs where Devin behavior diverges from intentional upstream semantics.
3. Optional profile pin updates only if setup or live dispatch proves current pins wrong or unsafe for Pro limits.

## Landing order and dependency graph

```
PR-A  static-deviation-matrix          (trunk)  ── independent
PR-B  harness-smoke-evidence           (trunk)  ── independent of A, but reads A if present
PR-C  setup-and-dispatch-fixes         waits on B findings
PR-D  orchestration-skill-fixes        waits on B+C (poteto-mode, swarm, arena, interrogate, architect)
PR-E  delivery-surface-fixes           waits on private remote + B (babysit, opening-a-pr, fix-ci, …)
PR-F  docs-and-cut-capabilities        waits on D+E (usage guide, cut-playbook verdicts)
```

Independent from trunk: **PR-A**, **PR-B**.  
Review-gated (interaction / product preference): **PR-C** if it changes default role pins or cost posture; **PR-D** if it changes fan-out defaults; **PR-E** if it changes merge/CI authority.

## Cost and model policy (hard gates)

Measured against `devin models list --format json` on 2026-11-21 for this Pro account.

| Tier | Examples | Use in QA |
| --- | --- | --- |
| Free | `swe-2-high`, `swe-2-medium`, `swe-2-flash-*` (non-lightning) | Default for every harness plumbing session and most skill smokes |
| Low | `glm-5-3-flash-high` (shipped “sonnet” panel pin) | Optional one-pass swarm / panel diversity |
| Med | `gpt-6-1-sol-medium` (shipped “opus” panel pin), `gpt-6-1-terra-medium` | At most one short “as-shipped routing” session per phase after Free path is green |
| High | `claude-opus-5*`, `claude-fable-5-2*`, Astra, lightning, priority | **Out of scope for QA unless you explicitly raise the budget** |

Shipped profile pins today:

- `pstack:*-opus` / `*-codex` → `gpt-6-1-sol-medium` (Med)
- `pstack:*-sonnet` → `glm-5-3-flash-high` (Low)
- `pstack:*-swe` → `swe` alias → Free SWE-2 family
- Session default in `~/.config/devin/config.json` → `swe-2-high` (Free)

**QA default.** Root Devin sessions stay on `--model swe-2-high`. For plumbing proofs, force workers onto `pstack:panel-swe` / `pstack:poteto-agent-swe`. Do not let poteto-mode’s default “opus” rows spawn Med/High workers during discovery.

**Budget ceiling (preference call).** Proposed soft stop: **≤ 6 Free sessions**, **≤ 2 Low sessions**, **≤ 1 Med session** per phase, then pause and report usage. No High unless you reply with an explicit allowance.

**Why this matters.** Arena / swarm / interrogate multiply workers. One “as designed” arena on true Opus or Fable can consume more Pro budget than the entire Free harness matrix.

Note: your Cursor `~/.cursor/rules/pstack-models.mdc` looks like an older setup (no `# defaults: 3` line). Unrelated to Devin QA, but rerun `/setup-pstack` in Cursor when you next care about Cursor pstack routing.

## Safety rails

- Worktree for edits and runs: `../dummyrepo` only. Do not write into personal projects or this plugin’s working tree from test agents unless the fix PR is open and scoped.
- Local Devin only. No `--cloud`, no `devin ssh`, no port forwards from cloud boxes.
- Permission mode: `accept-edits` or `smart`. Never `dangerous`.
- No force-push, no merge, no deleting remotes, no touching secrets, mail, billing, or OS auth.
- Private GitHub remote only (`gh repo create --private`) under the active `athul-ramesh` account when PR skills need a remote.
- Abort any prompt that asks for network actions outside git/gh on the dummy repo.
- Cap concurrent Rex Devin tabs at 2. Kill stuck panes with Rex rather than leaving runaway agents.
- Prefer transcript + `rex capture` evidence over re-running a green skill.

## Environment snapshot (studied)

- Plugin installed: `pstack` 0.12.0 from `/Users/athulramesh/projects/AISkills/ptstack-devin` (single copy; good).
- `~/.config/devin/pstack-models.md`: **absent** (ready for setup-pstack).
- Dummy repo: empty git repo on `main`, no remotes, no commits yet.
- Rex connected; session can host Devin tabs.
- Prior native smoke (0.2.0) proved foreground/background `run_subagent` + `read_subagent` on panel-opus, and duplicate-plugin collisions. Re-verify on 0.12.0 with Free pins.
- Known intentional cuts vs upstream: `shipping`, `autopilot-full`, `autopilot-stack` playbooks; `ketchup-video`, `make-bot-ui` skills. Port adds Devin-only surfaces (`control-ui`, `control-cli`, babysit skill packaging, several PR helpers).

## Test program (feeds PR-A through PR-E)

### Tier 0 — Static (no Devin tokens)

- Diff skill / playbook / reference inventory vs `../plugins/pstack`.
- Classify each delta: intentional cut, Devin adaptation, suspected drift, untested claim.
- Run `node --test tests/*.test.mjs` and `git diff --check`.
- Produce `docs/harness-qa/deviation-matrix.md`.

Pass predicate: every public skill and playbook has a row with disposition and evidence class.

### Tier 1 — Load and route (Free, batch)

Rex tab in `dummyrepo`:

```bash
devin --model swe-2-high --permission-mode accept-edits -c "$DUMMY"
```

Batched prompts (one or two sessions, not one skill per session):

1. Confirm SessionStart injects poteto-mode route.
2. `/pstack:poteto-help` then `/pstack:setup-pstack` (writes models sheet; verify file + pin validation against catalog).
3. Slash-load only (no heavy work): `how`, `why`, `ketchup`, `bro`, `sharpen`, `in-your-own-words`, `unslop`, `technical-writing`, `benchmark-checklist`, `correct` (fixture inspect), cut-capability queries for shipping/autopilot.
4. Principle trigger sample: one prompt that should load Laziness Protocol / Prove It Works via model triggers; confirm skill tool visibility.

Pass predicate: skill resolves from **this** plugin path; slash injects body; cut playbooks return explicit capability verdict (not silent figure-it-out).

### Tier 2 — Harness core (Free workers)

Same Free root. Force SWE profiles.

| Scenario | Pass predicate |
| --- | --- |
| Foreground `run_subagent` panel-swe | Returns id; `read_subagent` collects exact token |
| Fresh sequential pass (no resume) | New id; independent answer |
| Background worker + notification | Completes; collect by id |
| `worker.md` first-line instruction | Child reads worker.md (or documented failure) |
| Worktree separation for two writers | Distinct checkouts; no shared write collision |

Pass predicate: matches or supersedes `docs/native-smoke-report.md` on 0.12.0 with Free pins. Record gaps honestly.

### Tier 3 — Orchestration smokes (mostly Free; one Med optional)

Tiny tasks in `dummyrepo` (add a hello file / trivial refactor). One skill family per session max.

| Skill | Mode | Cost posture |
| --- | --- | --- |
| poteto-mode → feature playbook | Minimal feature | Free root + SWE workers; optional 1 Med “as-shipped opus pin” after green |
| poteto-mode → bug-fix | Planted typo | Free |
| swarm | N=2, SWE | Free |
| arena | N=2, SWE; skip judge High | Free |
| interrogate | 2 reviewers, SWE/GLM | Free / Low |
| architect | Brief only, route claim to arena | Free |
| figure-it-out | Plan-only on a fake multi-phase ask | Free |
| how / why / teach / recall | Read-only | Free |
| reflect | Transcript mine, stop for approval | Free |
| no-comments | comment-sicko on dummy file | Free |
| statechart | Only if TLC already present; else mark env-gap | Free / skip |
| control-cli / control-ui | Harness recipe dry-run, no external sites | Free |

Pass predicate: skill follows its shipped contract; subagent profile and workspace match docs; deviations logged with transcript paths.

### Tier 4 — Delivery surfaces (private remote)

1. Commit a trivial README in `dummyrepo`.
2. `gh repo create … --private --source=. --remote=origin` (no public).
3. Open a draft PR.
4. Exercise: opening-a-pr path, `get-pr-comments`, `make-pr-easy-to-review`, `babysit` watch (no merge), `fix-ci` only if a cheap failing check exists.

Pass predicate: gh actions succeed; babysit never merges; watcher dies with the session.

### Tier 5 — Full-flow transcript audit

For each Tier 2–4 failure or ambiguous pass, read the Devin session transcript (and Rex capture) end to end. Score against upstream Cursor skill intent and Devin-specific references (`delegation.md`, `delivery-capability.md`, `worker.md`).

Pass predicate: final report lists deviations as **harness bug**, **port drift**, **intentional cut**, or **untested**.

## Improvement PRs (filled from evidence)

### PR-A — Static deviation matrix

- Depends on: nothing
- Files: `docs/harness-qa/deviation-matrix.md` (and this plan’s checklist updates)
- One change: inventory and classify deltas vs `../plugins/pstack`
- Result: prioritized fix list before burning Devin tokens
- Verification:
  - [ ] Unit: inventory script or checked list covers every skill + playbook
  - [ ] Live: n/a (docs)
  - [ ] Perf: n/a

### PR-B — Harness smoke evidence pack

- Depends on: operator go + budget gates
- Files: `docs/harness-qa/*`, possibly `docs/native-smoke-report.md` update
- One change: record Tier 1–2 live results on 0.12.0
- Result: known harness baseline
- Verification:
  - [ ] Unit: structural tests still green
  - [ ] Live: Free foreground/background/worker.md scenarios with transcript paths
  - [ ] Perf: session count and model tier log; stop if ceiling hit

### PR-C — Setup and dispatch fixes

- Depends on: PR-B findings for setup-pstack / profile validation / pin availability (`codex` alias currently absent from catalog)
- Files: likely `skills/setup-pstack/**`, `agents/**`, tests
- One change: make setup and profile pins match live catalog and Pro-safe defaults
- Result: `/pstack:setup-pstack` writes a valid sheet; workers dispatch on available pins
- Verification:
  - [ ] Unit: write-models tests
  - [ ] Live: setup from empty sheet; new session loads roles
  - [ ] Perf: n/a
- Review-gated if default cost posture changes

### PR-D — Orchestration skill fixes

- Depends on: PR-B + PR-C
- Files: `skills/poteto-mode/**`, `skills/swarm`, `arena`, `interrogate`, `architect`, related refs
- One change: close proven Devin-harness gaps (tool names, worker.md, fan-out, cut-capability routing)
- Result: core workflows behave as documented on Free/Med pins
- Verification:
  - [ ] Unit: contract tests
  - [ ] Live: Tier 3 scenarios re-run on Free
  - [ ] Perf: worker count capped; no High models unless allowed

### PR-E — Delivery surface fixes

- Depends on: private dummy remote + PR-B
- Files: babysit, opening-a-pr, fix-ci, PR helpers, watch-pr script
- One change: fix only failures proven on the private dummy PR
- Result: PR assist skills are safe and session-bounded
- Verification:
  - [ ] Unit: script tests if touched
  - [ ] Live: draft PR watch without merge
  - [ ] Perf: watcher exits with session

### PR-F — Docs and capability verdicts

- Depends on: PR-D + PR-E
- Files: `README.md`, `docs/usage-guide.md`, release notes
- One change: document measured behavior, cuts, and Pro-safe model guidance
- Result: users know what is verified vs untested
- Verification:
  - [ ] Unit: links resolve
  - [ ] Live: poteto-help answers match docs
  - [ ] Perf: n/a

## Rex operating procedure (after go)

1. Rename / use session `devin-pstack-qa`.
2. `rex window new -s … dummy-devin -c <dummyrepo> --json -- devin --model swe-2-high --permission-mode accept-edits`
3. `rex send` prompts; `rex capture --trim` for evidence; archive under `docs/harness-qa/captures/`.
4. Optional second tab for static work in `ptstack-devin` (this Cursor session), never mixed write scopes with the test agent.
5. Pause at each tier ceiling and paste the usage summary before continuing.

## Preference calls (only these block)

1. **Budget.** Accept the soft ceiling (6 Free / 2 Low / 1 Med per phase, High off), or name different numbers.
2. **Pin ambition.** Keep shipped Sol/GLM/SWE pins for QA, or authorize a separate High-cost “true Opus/Fable parity” bakeoff later.
3. **Remote owner.** Create private `dummyrepo` under `athul-ramesh` when Tier 4 starts (yes/no).

## What stays unproven until live runs

- Whether children obey the `worker.md` first-line pointer (prior audit: untested).
- Background workers under narrowly approved permissions (prior smoke used bypass).
- Real arena/swarm quality vs Cursor when Med/High pins are used.
- Statechart rendering inside Devin CLI.
- Any skill marked intentional cut (`shipping`, autopilots, `ketchup-video`, `make-bot-ui`).

## Principles that shaped this plan

- **Sequence verifiable units.** Tiers and PRs each end in a check before the next spend.
- **Laziness Protocol.** Cheapest decisive evidence first; no full skill zoo on High models.
- **Prove It Works.** Native Devin + transcript beats static diff alone for harness claims.
- **Never Block on the Human.** Only budget, pin ambition, and remote ownership wait on you; execution details proceed after go.
