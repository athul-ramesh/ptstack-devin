# Poteto delegation refinement plan

Status: completed 2026-09-07 with bounded live-validation gaps recorded below. All implementation phases and handoff updates are complete.

## Outcome and recommended design

Make poteto implementation delegates receive its engineering quality contract while preserving the user's existing role-to-profile-to-model choices. Use Devin's native custom profiles and root-owned delegation. A consuming project must work without having the plugin's `skills/` directory in its checkout.

Keep the current six registered profiles and existing model sheet format. Add a shared implementation-worker contract and a precise parent dispatch procedure. The parent supplies the contract inline in each implementation brief, together with absolute paths for applicable supporting material. Existing panel profiles remain model-pinned execution profiles; the assigned brief determines whether a pass implements, investigates, or reviews. Review-only briefs must explicitly prohibit edits.

Keep the agent tree at root → worker. Do not add `max-nesting` in this refinement. Logical tracks can remain in program state, but the root dispatches their workers and owns reconciliation. This preserves native Devin defaults and avoids multiplying agent cost.

Why this design: introducing `poteto-sonnet`, `poteto-opus`, and other duplicate profiles would require either changing the user's sheet or silently translating a selected profile into another profile. Neither is necessary. Devin accepts instructions in `task`, and a pinned profile already selects the correct model. A shared brief contract restores the missing behavior with less configuration.

## Start here

1. Read repository `AGENTS.md` and [the evaluation](poteto-delegation-evaluation.md).
2. Inspect `git status --short` and preserve unrelated work. Do not edit `../portbackups/vendor/`; it is reference material only.
3. Read the files listed in the implementation phases below before changing them. Search for additional call sites; the lists are starting points, not permission to ignore contradictory instructions elsewhere.
4. Check `devin version`, `devin plugins info pstack`, and the installed source location. A local install was a symlink to this repo during the evaluation; do not assume future sessions have the same installation state.
5. Read the actual `$HOME/.config/devin/pstack-models.md` without rewriting it. Record a hash before implementation so validation can prove it was preserved.
6. Recheck the installed CLI's native documentation/tool schema if the version differs from 3000.6.14. Do not introduce Claude or Codex dispatch arguments into Devin prose.

Useful starting commands, from the repository root:

```sh
git status --short
devin version
devin plugins info pstack
rg -n 'run_subagent|poteto-agent|panel-|max-nesting|fans out|nested|default.*swe' skills agents
node --test tests/pstack-models.test.mjs
```

## Verified baseline and constraints

The evaluation used one parent session and three successful foreground workers. Runtime metadata confirmed these current choices:

| Role | Profile | Model pin / resolved model |
| --- | --- | --- |
| feature, refactoring | pstack:panel-sonnet | glm-5-3-flash-high |
| bug-fix | pstack:panel-swe | swe / SWE-1.7 Lightning Max |
| strongest judgment | pstack:panel-opus | gpt-5-6-sol-medium |

Do not repin these models or reinterpret profile suffixes as Claude aliases. Do not run setup-pstack to apply this refinement: its writer replaces the customized sheet. Do not change the 18 role keys or deduplicate repeated panel entries. Inline skills still run on the session model; the role sheet is not an automatic model switch for all skills.

Devin requirements, checked against [official subagent documentation](https://docs.devin.ai/cli/subagents):

- `run_subagent` selects a registered `profile`; model pins belong in profile frontmatter.
- Workers have separate conversation chains. Parent history is not their brief.
- Foreground workers block. Background workers only have already-approved permissions.
- Workers cannot dispatch children by default. Nested dispatch requires an explicit profile allowance.
- A resumed worker retains context; it is not a new independent perspective.

The observed tool fields were `profile`, `task`, `title`, `is_background`, and optional `resume`. Confirm the current `read_subagent` schema before documenting its arguments; do not invent them. Plugin layout and profile namespacing follow [the plugin documentation](https://docs.devin.ai/cli/extensibility/plugins/overview).

## Phase 1 — Define one dispatch and worker contract

Primary files:

- Add `skills/poteto-mode/references/delegation.md`.
- Add `skills/poteto-mode/references/implementation-worker.md`.
- Update `skills/poteto-mode/SKILL.md`, especially Subagents and Models.
- Update `agents/panel-{swe,sonnet,opus,codex}/AGENT.md` only where wording must accommodate implementation briefs.

The worker contract must be short and usable without loading the root workflow tree. Include:

1. Work only within the assigned scope. Inspect relevant code before editing.
2. Follow the named data shape, invariants, and design supplied by the parent. Identify contradictions with evidence instead of silently changing the design.
3. Make the smallest complete change; preserve required behavior, remove obsolete paths when that is part of the task, and avoid speculative fixes.
4. Read explicitly applicable principle leaves from the absolute pointers supplied in the brief. Do not load all leaves or all playbooks.
5. Exercise the concrete done condition. Return the changed paths, checks and decisive output, remaining uncertainty, and any design issue requiring parent judgment.
6. Do not invoke poteto-mode, launch sibling workflows, spawn agents, or independently commit/publish. A worker can return proposed independent follow-up slices to the root.

The parent dispatch procedure must specify this order:

1. Classify the pass as implementation, investigation, or review and select the exact role key.
2. Read the corresponding user-sheet row, or use the explicit registered-profile default if the row/sheet is missing.
3. Confirm the chosen profile is registered. Preserve the profile exactly; do not convert it to another profile or pass a model field.
4. Read the shared contract for implementation passes and inline its text in `task`. This is intentional bounded duplication at dispatch time so a worker cannot lose the contract because of relative paths or absent parent history.
5. Supply absolute project paths and plugin reference paths, scope, exclusions, design/invariants, done condition, and output requirements.
6. Choose foreground/background based on dependency and permission needs. Dispatch and collect evidence; the parent reviews the artifact before accepting completion.

Include a concrete JSON-shaped tool example with `profile: "pstack:panel-sonnet"`, `is_background: false`, and a self-contained implementation task. Clearly mark it as an example after role resolution, not a hard-coded feature choice. Do not include a per-call `model`, `subagent_type`, or `run_in_background` field.

Panel profiles must continue to accept implementation tasks because existing role rows point to them. Keep their no-nesting/no-poteto rules. Clarify descriptions to avoid suggesting they only review or literally run on the suffix's named model family. Do not add a read-only tool restriction to profiles used for implementation. The worker contract must not be forced onto review passes that have their own appropriate instructions.

Acceptance: following the documented procedure yields a complete worker brief and the exact configured profile without relying on parent context or adding new profile families.

### Phase 1 implementation record

Completed 2026-09-07.

- Changes: added the root dispatch procedure and compact implementation-worker contract; wired poteto-mode to both references; broadened all four panel profile descriptions and bodies to accept brief-selected implementation, investigation, or review passes without changing their model pins.
- Checks: inspected the dispatch reference for the native `profile`, `task`, `title`, and `is_background` shape and explicit rejection of `model`, `subagent_type`, and `run_in_background`; inspected all panel frontmatter pins as `swe`, `glm-5-3-flash-high`, and `gpt-5-6-sol-medium`.
- Remaining: route supported playbooks through the root procedure, remove nested dispatch obligations, make defaults and installed-source path resolution explicit, refine execution-mode failure handling, then run the bounded validation.

## Phase 2 — Remove unsupported nesting from workflows

Primary files:

- `skills/poteto-mode/playbooks/feature.md`
- `skills/poteto-mode/playbooks/refactoring.md`
- `skills/poteto-mode/playbooks/bug-fix.md`
- `skills/poteto-mode/playbooks/perf-issue.md`
- `skills/poteto-mode/playbooks/hillclimb.md`
- `skills/poteto-mode/playbooks/orchestrate.md`
- Other shipped references found by searching for worker fan-out and nested ownership.

Route implementation steps through the shared dispatch procedure and exact role keys. Feature and refactoring share the key `feature, refactoring`; do not invent separate `feature` and `refactoring` rows.

Replace the feature requirement that an owner fans out internally. One coupled change stays with one worker; the root dispatches additional independent slices after receiving evidence that prerequisites are complete. Never have two workers write the same shared checkout concurrently merely because they have different branches. Use separate worktrees/directories for concurrent writers or serialize them.

In Orchestrate, distinguish logical coordinator/track/work-unit records from actual agent depth. A track record is not a nested agent. The root owns dispatch, dependency gates, retry decisions, and verification. Workers report unresolved work back to the root. Remove language that implies a track agent can spawn workers with the current profiles.

Keep unrelated workflows intact. Audit routed skills for contradictions introduced by this change, but do not redesign all skills or run all of them. If nested coordinators become a future requirement, document them as a separate future feature needing a bounded profile, cost policy, and dedicated runtime test.

Acceptance: no supported path instructs a worker to perform dispatch that its profile cannot do. Root-owned decomposition remains operational for features and program tracks.

### Phase 2 implementation record

Completed 2026-09-07.

- Changes: routed feature, refactoring, bug-fix, perf-issue, and hillclimb implementation through the shared root procedure with exact role keys; removed feature-owner fan-out; made concurrent writer isolation require separate worktrees or directories; recast Orchestrate tracks as logical records and fixed actual depth at root → worker.
- Checks: searched poteto-mode and agent profiles for internal fan-out, sub-coordinator, nested-dispatch, and `max-nesting` obligations; the only matching worker dispatch text now states that the root performs it. Audited each routed playbook for an exact role key, including the shared `feature, refactoring` key.
- Remaining: make installed-source pointer resolution, the special scoped worker, and registered defaults explicit; then refine execution-mode failures and run bounded validation.

## Phase 3 — Make paths and defaults explicit

Primary files:

- `skills/poteto-mode/SKILL.md`
- `skills/poteto-mode/references/delegation.md`
- `agents/poteto-agent/AGENT.md`
- `skills/poteto-mode/playbooks/hillclimb.md`
- Other touched delegation instructions with bare role-model defaults.

Use the source path reported by the skill tool to resolve the installed plugin root. Derive reference paths from that source, not from the consuming project's current directory. Do not hard-code this machine's home path or assume hook environment variables expand in arbitrary Markdown. Supply absolute resolved paths in worker briefs. If a required resource cannot be resolved, report that exact missing resource rather than silently reading a same-named project file.

The special `pstack:poteto-agent` is an explicitly requested scoped worker, not an alternate root coordinator. Make its description and body consistent with that purpose. Have its parent supply the shared contract and applicable absolute pointers. Remove unconditional CWD-relative loading of the full root skill, which could reintroduce playbooks and delegation obligations. Keep its current model pin and document that selecting it explicitly does not consult the role sheet automatically.

Spell the six poteto default rows with registered profile values: feature/refactoring and judgment/prose use `pstack:panel-opus`; bug-fix, perf-issue, hillclimb, and strongest judgment use `pstack:panel-swe`. These preserve current shipped defaults; the user's overrides still take precedence.

Distinguish a missing row from an invalid row. A missing row uses the documented default. An unregistered configured profile is a configuration error: identify it and do not claim its intended model ran. Do not silently substitute a built-in profile. Avoid adding a runtime parser or profile generator solely to support Markdown; add code only if the implementation establishes a concrete need.

Acceptance: a consuming repo with no plugin files can resolve every required pointer; deleting a fixture role row yields an unambiguous registered default without modifying the real user sheet.

### Phase 3 implementation record

Completed 2026-09-07.

- Changes: replaced all six bare defaults with registered `pstack:panel-opus` or `pstack:panel-swe` profiles; distinguished missing role rows from invalid configured rows; required plugin pointers to derive from the skill tool's installed source; converted `pstack:poteto-agent` into an explicitly selected scoped worker while preserving its model pin.
- Checks: found all six exact registered defaults in poteto-mode; confirmed `pstack:poteto-agent` still pins `gpt-5-6-sol-medium`; audited agent and poteto delegation text for unconditional CWD-relative root-skill loading. The remaining current-directory mentions are explicit prohibitions.
- Remaining: specify foreground/background collection and failure semantics, then validate default resolution and consuming-directory reference resolution without changing the real user sheet.

## Phase 4 — Specify execution mode and failure handling

Primary file: `skills/poteto-mode/references/panel-run.md`. Apply matching corrections to direct panel call sites if they contradict this reference.

- Foreground: `is_background: false`; one blocking call at a time. Prefer it for a single writer when permissions are not already established.
- Background: `is_background: true`; dispatch independent calls, retain returned IDs, collect completions with native notifications/tools, and inspect every result before synthesis. Record the current supported result-reading arguments from the actual CLI schema.
- Never assume background workers can request permission. For denied operations, report the denial and use the documented foreground resume path when appropriate. Do not enable blanket dangerous mode to make a test pass.
- Keep repeated profiles as separate fresh calls, sequentially. Omit `resume` for each new perspective. Required perspective count is preserved even when model diversity is lower.
- Separate scheduling failure from model availability. Running sequentially does not repair an unavailable model pin. Permission repair on the same profile may preserve mapping; changing to a default profile changes mapping and must be explicitly reported as degraded execution.
- Do not add automatic retries or substitute models in the validation harness. Production instructions must report an incomplete panel if required passes cannot complete.

Acceptance: the instructions explain how to start, collect, and assess both modes and never call one completed pass a full panel.

### Phase 4 implementation record

Completed 2026-09-07.

- Changes: specified blocking foreground calls and ID-based background collection; documented background permission limits and foreground resume repair; preserved repeated-profile perspective counts; separated scheduling failures from unavailable pins; required incomplete-panel and degraded-mapping reports instead of automatic substitution.
- Checks: read the installed Devin 3000.6.14 subagent documentation and captured session tool schema. `run_subagent` supports `profile`, `task`, `title`, `is_background`, and optional `resume`; `read_subagent` requires `agent_id` and optionally accepts `block` and `timeout`. Audited shipped text and removed the remaining “sequential when pins fail” conflation.
- Remaining: run local regression checks and one organic implementation case. Background behavior changed only as documentation of existing mechanics, so the optional paid background case is not required unless local or organic evidence reveals a contradiction.

## Phase 5 — Validation with a small credit budget

Run free/local checks first. Preserve the customized user sheet and model pins throughout. Do not repeat the original three-model smoke test unless a pin or dispatch mechanism changes.

### Local checks

1. Run existing `node --test tests/pstack-models.test.mjs`.
2. Check all role defaults and sample user-sheet targets resolve to registered profiles. Check pins are unchanged and profile frontmatter remains valid.
3. Add focused regression coverage for actual failure modes where machine-checkable: reference resolution from a consuming directory, registered defaults, and preservation of duplicate role entries. Avoid tests that only assert an exact prose sentence exists. Do not build a Markdown interpreter merely for tests.
4. Review the shipped tree for incompatible tool argument names, CWD-dependent worker paths, and nested dispatch obligations. Manually review semantics; a clean grep is not sufficient proof.
5. Run `git diff --check` and verify the real model-sheet hash is unchanged. Document which files changed and why.

### One organic implementation case

Create a disposable consuming repository outside the plugin checkout, with no `skills/` directory. Use a project-shaped name such as `task-summary-cli`. Supply a small existing CLI with two or three TODO-like records and an executable baseline check. Ask for a modest single-module feature, such as adding `--json` output with documented fields while retaining text output. Scope the user request to one implementation worker, no commits, no panels, and no unrelated changes. Do not mention evaluation, role mapping, or desired skill reads in the candidate prompt.

Use the installed plugin through ordinary SessionStart routing. Let the parent choose the feature role from the existing user sheet. Export the session. The observer must check:

- The root loaded poteto-mode and the correct playbook without being explicitly told to load them.
- The root read the sheet and dispatched the configured feature profile.
- The worker received the contract inline and correct absolute plugin/project pointers.
- Required supporting leaf reads actually occurred when applicable; citations alone do not count.
- The worker edited only the intended project scope, made no nested calls, and ran the concrete check.
- The parent independently exercised both JSON and existing text behavior and reviewed the diff.
- Runtime model metadata matches the chosen profile. If metadata is unavailable, report configuration verification separately from runtime confirmation.

Budget: one parent session and at most one implementation worker for this case. Stop and inspect evidence on failure rather than repeatedly prompting it to follow the desired chain. If the small task does not trigger the intended workflow, record inconclusive coverage and adjust the fixture before requesting another paid run.

### One bounded background case, only if needed

If Phase 4 changes actual background dispatch instructions, use one small parent session with at most two read-only workers and distinct output markers. Verify `is_background: true`, returned IDs, all completion results, and parent synthesis. No model-diversity sweep, implementation, nested calls, or judge agents. A repeated-profile sequential case can be checked separately without paid inference if only the unchanged list-count policy is at issue.

Maximum planned new work is two parent sessions and three worker calls total. This is a call-count ceiling, not a dollar or credit guarantee. Do not add retries after reaching it. A failed run is useful evidence; identify the blocker and leave a precise next step.

### Phase 5 implementation record

Completed 2026-09-07.

- Local checks: `node --test tests/pstack-models.test.mjs` passed 4/4. New `node --test tests/poteto-delegation.test.mjs` passed 3/3 for consuming-directory reference resolution, all six registered defaults, and all five preserved model pins. The real 18-row sheet resolved only to registered profiles. `git diff --check` passed. The sheet hash remained `115af4cee1f7bdc289191791862dd88b8335e0a4a158538cb9ee30fd249b8c05`.
- Static review: manually reviewed the routed playbooks, root dispatch procedure, scoped profile, panel execution procedure, and agent profiles. Unsupported tool fields, CWD-relative worker loads, worker-owned nesting, shared-checkout parallel writers, and schedule-as-model-fallback semantics were removed.
- Organic case: session `branch-aluminum` in a disposable `task-summary-cli` repo loaded poteto-mode, the Feature playbook, the real sheet, delegation and worker references, verification, and the applicable Model the Domain leaf from absolute installed paths. It selected `pstack:panel-sonnet`, inlined the contract, supplied absolute roots, and set `is_background: false`.
- Organic blocker and deviation: the configured foreground call returned `Subagent error: Tool was rejected` under non-interactive `accept-edits`. The parent then made one prohibited substitute attempt on `pstack:poteto-agent`, which was also rejected. No worker result or runtime model metadata was returned, and the parent did not review or verify. Partial scoped edits nevertheless appeared in the fixture; independent post-session checks passed `npm test`, valid JSON output, unchanged text output, and help output. The dispatch procedure now explicitly says a single `panel-*` implementation pass is not a panel, forbids substitution after rejection, and requires inspection of partial filesystem effects.
- Budget: one parent session, two rejected `run_subagent` attempts, and zero completed workers. No retry session or background case was run. The unexpected substitute attempt consumed the remaining three-call ceiling needed for a meaningful two-worker background case.
- Evidence: compact sanitized facts are retained in `docs/evidence/poteto-delegation-2026-09-07.json`; the full export remains disposable and is not committed.
- Remaining: live worker completion, worker runtime-model confirmation, parent-owned diff review and verification, and background collection remain unproven. The next authorized check should pre-approve `run_subagent` without blanket dangerous mode, use only the configured `pstack:panel-sonnet` pass, and stop after any rejection.

## Completion and handoff

Update the evaluation with a dated follow-up rather than overwriting its original baseline. Store compact, sanitized evidence under `docs/evidence/` if repository retention is appropriate. Do not commit full exports containing unrelated home rules or sensitive session context. Temporary evidence paths from the original evaluation may no longer exist; the recorded findings remain the baseline.

The completion report must distinguish:

- Static contract correctness.
- Live implementation behavior in a consuming project.
- Runtime model confirmation.
- Background behavior, if exercised.
- Untested or blocked cases.

Mark each phase complete here, list verification commands/results, and record any deviation with its reason. Update README/release notes to describe root-owned delegation, preserved profile pins, and any remaining limits. Do not claim full Claude runtime parity: the supported target is equivalent engineering outcomes within Devin's native execution model.

Do not commit, publish, change user configuration, or install a different plugin source solely because this plan exists. A future implementation session should follow its user's delivery authorization. Stop when the scoped changes and checks are complete; leave additional workflow redesigns for a separate task.

### Handoff implementation record

Completed 2026-09-07.

- Updated `docs/poteto-delegation-evaluation.md` with a dated follow-up that separates static correctness, consuming-project behavior, runtime model confirmation, background coverage, and blockers.
- Added compact sanitized evidence under `docs/evidence/`; full session exports remain outside the repository.
- Updated README and release notes with root-owned delegation, unchanged profile pins, no automatic fallback, permission requirements, and the remaining live-validation limits.
- No commit, publish, setup rewrite, plugin-source change, or user-configuration write was performed.

### Core completion validation record (2026-09-10)

Task 07 of [`poteto-mode-parity-findings-and-plan.md`](poteto-mode-parity-findings-and-plan.md) extended the structural checks and recorded a dated baseline.

- Added six structural checks to `tests/poteto-delegation.test.mjs`: shipped link resolution, principle-catalog completeness, registered profile mapping and same-pin comparison, explicit cut-workflow routing, writer workspace provisioning, and documented `run_subagent` fields with a forbidden-field guard.
- `node --test tests/pstack-models.test.mjs tests/poteto-delegation.test.mjs` passed 19 of 19. `git diff --check` is clean. 111 relative links resolved with 0 broken.
- Native runtime validation remains blocked: the plugin is not installed, and installing it writes global user configuration that Task 00 withholds. Worker completion, background collection, same-worker permission resume, worktree isolation, and runtime model identity stay unproven.
- Compact evidence: [`evidence/poteto-delegation-2026-09-10.json`](evidence/poteto-delegation-2026-09-10.json).
