# Poteto-mode: Cursor-to-Devin parity findings and implementation handoff

Date: 2026-09-10
Status: Findings and proposed implementation only. No plugin implementation was changed for this report.

## 1. Purpose and scope

Make the Devin poteto-mode workflow preserve the original's research, design, delegation, verification, and recovery quality. First stabilize local Devin CLI/Desktop. Cloud orchestration and advanced autonomous delivery are separate, later workstreams.

Original source: `../../plugins/pstack/` relative to this document's directory. Target: `../` (the `ptstack-devin` repository). All target paths below are relative to the target repository unless otherwise stated. Line references describe the audited snapshot and may move; locate the named rule before editing.

Repository exploration was delegated to two Luna agents; official capability research and initial consolidation were delegated to Sol. This document records their findings and the parent agent's implementation decisions. It is not permission to merge, publish, install plugins, change global configuration, or run autonomous shipping. The implementer must operate within the authorization of its own task.

Read `AGENTS.md` before implementation. This document proposes changes to some current rules; it does not silently override them. Reconcile older work in `docs/poteto-delegation-refinement-plan.md` and preserve the historical observations in `docs/poteto-delegation-evaluation.md`.

## 2. Assessment

The port preserves much of the playbook structure but not all workflow guarantees. The largest gaps are weakened design gates, unproven worker completion and collection, unspecified writer isolation, contradictory pause authorization, and incomplete delivery routing. These are predominantly fixable using supported Devin behavior.

Do not equate a missing Cursor API with an impossible workflow. Distinguish: (a) missing port implementation, (b) documented runtime restriction, (c) behavior requiring a live test. Do not describe all Devin plugins as local-only: custom plugin subagents are the relevant documented local restriction.

### Original workflow and runtime dependencies

The original `plugins/pstack/skills/poteto-mode/SKILL.md` selects a playbook, copies its steps into a todo list, applies research/design gates, delegates execution, independently verifies real behavior, applies writing/principle requirements, and routes delivery or recovery work.

| Dependency | Purpose | Porting approach |
| --- | --- | --- |
| Cursor explicit sticky mode metadata and reminder | Retain mode obligations across turns | Devin always-on instructions plus supported skill activation/context; test persistence |
| Skill and todo tools | Route and track required steps | Use actual Devin tools; preserve playbook obligations |
| Task model routing, background agents, result handling | Delegate while parent retains judgment | Registered Devin profiles, supported subagent calls, explicit collection |
| Isolated worktrees/cloud owners | Protect concurrent writers and PR ownership | Root-provisioned local worktrees first; cloud redesign separately |
| Nested orchestration | Coordinate larger programs | Root-to-worker baseline; experimental nesting only after validation |
| Cursor `/loop` and `/goal` | Autonomous continuation | Durable local state; evaluate Devin-specific continuation separately |
| Transcripts and cloud status | Resume and recover | Available Devin session history plus durable state; no invented private paths |
| UI/CLI control, screenshots/video | Verify the actual changed surface | Detect active-surface tools; disclose unavailable verification |
| Git, `gh`, Bun scripts and PR watchers | Deliver and supervise changes | Retain portable operations, audit runtime prerequisites |

Original evidence: `plugins/pstack/skills/poteto-mode/SKILL.md:1,13,17,89,115`; companion `how`, `why`, `architect`, `arena`, `swarm`; poteto playbooks `orchestrate`, `autonomous-run`, `multi-phase-plan`, `babysit`, `shipping`, `autopilot-full`, `autopilot-stack`, and `session-pickup`.

The source itself has an inconsistency: Orchestrate depends on Graphite `gt` for frontier/stack safety, while other PR playbooks say not to require Graphite. Do not copy that inconsistency or introduce Graphite as a new dependency.

## 3. Findings: behavior Devin supports improving

| ID | Priority | Finding and evidence | Required outcome |
| --- | --- | --- | --- |
| F01 | P0 | Original `poteto-mode/SKILL.md:19-23` requires `how` for nontrivial changes and `architect` across function boundaries. Target `skills/poteto-mode/playbooks/feature.md:5-6`, `bug-fix.md:7-9`, and `refactoring.md:7-12` weaken those gates. | Restore original thresholds and conditional rationale research. |
| F02 | P0 | `skills/poteto-mode/references/panel-run.md:51-65` relies on notifications without an explicit supported collection procedure. `AGENTS.md` omits `read_subagent` from its tool list. | Version-validated collection by returned agent identity, followed by parent verification. |
| F03 | P0 | `docs/poteto-delegation-evaluation.md:64-74` does not prove completed workers, background collection, parent verification, or actual runtime model identity. | Successful foreground/background execution evidence, separate from structural checks. |
| F04 | P0 | `references/delegation.md:11-12` and `references/panel-run.md:64` require isolation but do not provision it. Paths are under `skills/poteto-mode/`. | Create, validate, assign, and record each writer's workspace before dispatch. |
| F05 | P0 | `skills/poteto-mode/SKILL.md:12-14` requires delivery authorization for commits; `playbooks/pause-safely.md:5-8` requires a WIP commit. | Pause without committing unless commit authority already exists. |
| F06 | P1 | `hooks/session-start-context.md:1-8` supplies routing context; hooks are documented best-effort. | Critical routing obligations remain available if the hook fails. Preserve the port's deliberate activation default. |
| F07 | P1 | Target has 21 of the original 23 principle leaves; `principle-attack-the-premise` and `principle-test-behavior-not-implementation` are absent. Principle-to-decision reply accountability was removed. | Restore leaves, catalog, and truthful accountability for principles actually read/applied. |
| F08 | P1 | Feature retains throughput work at `playbooks/feature.md:7-11` but omits it from its reply contract. | Report the chosen decomposition and its reason. |
| F09 | P1 | `references/delivery-capability.md:15-29` cuts Shipping and Autopilots; `SKILL.md:30-31` sends unmatched requests to `figure-it-out`. | Explicit requests reach an explicit capability verdict, not a generic fallback. |
| F10 | P1 | README/release assumptions were validated against an older CLI and make broad scheduling/cloud claims. | Publish a surface/version-specific capability matrix with tested versus untested behavior. |
| F11 | P1 | Real-surface verification depends on available host tools; prose cannot guarantee browser/desktop access. | Detect availability and record actual verification or a precise unresolved gap. |
| F12 | Later | Shipping and autonomous workflows were cut more broadly than current capabilities require. | Restore supported current-session delivery first; evaluate cloud continuation separately. |

## 4. Findings: runtime restrictions and boundaries

### Documented restrictions the plugin cannot remove

1. Background subagents cannot request new permissions. Use already authorized capabilities or foreground execution. Never change profiles or tools to bypass a rejection.
2. Custom plugin subagents are documented for CLI/Desktop, not cloud. Cloud parallelism requires a different orchestration implementation; existing local profiles do not transfer unchanged.
3. Custom-agent nesting is experimental and bounded; skill-subagent execution has separate nesting restrictions. Root-to-worker remains the required baseline. Organization policy can further restrict availability.

### Boundaries requiring substitutes or proof, not unsupported claims

- Devin does not document Cursor's identical `mode`, `reminder`, and `disable-model-invocation` semantics. Always-on instructions can approximate workflow behavior; test it rather than promising native mode parity.
- A documented Devin `/loop` command does not prove scheduled local wakeups. Cloud scheduling exists. This audit did not establish an ordinary local skill-callable future wakeup mechanism.
- Browser/computer control depends on surface and configuration. An absent CLI tool is not a universal Devin platform limitation.
- Requested model/profile mapping and observed runtime identity are different claims. Do not infer actual serving model from frontmatter alone.
- Official docs disagree about cloud plugin hooks. Treat cloud hook execution as unresolved until tested on the selected surface.

## 5. Implementation sequence

Implement in small reviewable changes. Core completion is Tasks 00-07 plus their applicable live checks. Tasks 08-09 are later capability work and must not delay or silently expand core delivery.

### Task 00 — Establish a reproducible capability baseline

Dependencies: none. Findings: F02, F03, F10.

Files: `AGENTS.md`, `README.md`, `docs/release-notes.md`, `docs/poteto-delegation-evaluation.md`; inspect existing profile/model tests and `.devin-plugin/plugin.json` before selecting additional changes.

Actions:

- Record CLI version, execution surface, plugin version/revision, available subagent tools, permission mode, and profile registration. Never record secrets or unnecessary private configuration.
- Confirm current schemas for dispatch, collection, resume, and cancellation using current official docs and actual tools. Do not invent arguments or copy Cursor Task fields.
- Amend the repository tool allowlist only after confirming the supported collection tool. Explain any Devin-specific `/loop` reference so it cannot be mistaken for Cursor semantics.
- Preserve historical evaluation results; append or create a dated new evaluation rather than rewriting past failures as successes.

Acceptance: capability entries distinguish documented, locally observed, unavailable, and untested. A sandbox logging failure is recorded as an environment block, not a plugin defect. No global installation/configuration changes without task authorization.

### Task 01 — Restore activation and exact routing contracts

Dependencies: 00. Findings: F01, F06.

Files: `AGENTS.md`, `hooks/session-start-context.md`, `skills/poteto-mode/SKILL.md`, and playbooks `feature.md`, `bug-fix.md`, `refactoring.md`, `investigation.md`. Inspect companion `skills/how/SKILL.md`, `skills/why/SKILL.md`, `skills/architect/SKILL.md`, and `skills/arena/SKILL.md`; change only integration gaps needed by poteto.

Actions:

- Place critical default routing obligations in supported always-on plugin instructions. Retain the SessionStart hook as assistance, not the only carrier. Preserve the port's existing default activation policy; document its difference from Cursor's explicit sticky mode.
- Require `how` for nontrivial changes, architecture decisions, and requests challenging confidence.
- Preserve `how` proportionality: narrow module/function questions use one readonly explainer; subsystem questions spanning files/services use 2-4 explorers followed by synthesis. Do not force fan-out on trivial work.
- Trigger `architect` for changes crossing function boundaries, including within one module. Its workflow must retain grounding and at least two structurally distinct candidates before synthesis where required by the source contract.
- Use `why` for motivation, rationale, tradeoffs, regressions, postmortems, data-backed thresholds, or redefining existing ownership/layering decisions. Do not add a blanket `why` requirement to every task.
- Retain playbook todo obligations and routing to swarm/arena/interrogate as applicable. Map tools to actual Devin capabilities.
- Preserve plan-only boundaries. Do not add blanket human checkpoints; honor explicit checkpoint requests.

Acceptance: narrow investigation, cross-file investigation, same-module cross-function change, rationale question, continued task, casual follow-up, and plan-only request take the intended paths. Hook failure does not erase core obligations.

### Task 02 — Restore principles and throughput evidence

Dependencies: 01. Findings: F07, F08.

Files: `skills/poteto-mode/SKILL.md`, `skills/poteto-mode/references/principles.md`, `skills/poteto-mode/playbooks/feature.md`; add `skills/principle-attack-the-premise/SKILL.md` and `skills/principle-test-behavior-not-implementation/SKILL.md` adapted from the original.

Actions: restore both leaves using valid Devin metadata and sibling invocation syntax. Require final evidence to name principles actually read/applied and the decisions they affected. Restore all four throughput dimensions: blocking predecessors, independent streams, shared mutable state separation, and smallest safe decomposition including why one worker may be best. Preserve applicable unslop/technical-writing gates without widening unrelated skills.

Acceptance: all 23 audited source principle names resolve in the target catalog; no fabricated principle-read claims; a nontrivial feature reply explains decomposition rather than merely claiming parallelism.

### Task 03 — Implement explicit delegation lifecycle and permission recovery

Dependencies: 00, 01. Findings: F02, F03.

Files: `skills/poteto-mode/references/delegation.md`, `skills/poteto-mode/references/panel-run.md`, `skills/poteto-mode/SKILL.md`, relevant invoking playbooks, and existing `agents/` profiles only if schema/profile validation identifies a necessary change.

Actions:

- Define dispatch -> record identity/profile/workspace -> wait or notification -> collect supported result -> inspect artifact -> parent verdict.
- Treat completion notification as a signal to inspect results, not proof of correctness. Handle independent and out-of-order completions, failure, incomplete results, and cancellation explicitly.
- Preserve role-to-profile/model mapping and the worker's inline contract plus absolute plugin/project references. Do not change model pins to make a failed test pass.
- For work that may need approval, use foreground execution or correctly scoped preauthorization. Following rejection, use documented same-worker resumption if supported; otherwise report the blocker. Do not launch a substitute to evade permissions.
- Require root verification of diff, scope, and real behavior. Record configured model mapping separately from runtime model metadata, if metadata exists.

Acceptance: one foreground worker completes; two background workers complete independently and both are collected; permission-denied execution has an honest recovery; partial failures remain visible; parent inspection is evidenced. No claim of runtime model identity without metadata.

### Task 04 — Provision writer isolation

Dependencies: 03. Finding: F04.

Files: `skills/poteto-mode/references/delegation.md`, `skills/poteto-mode/references/panel-run.md`, and poteto playbooks that dispatch writers; inspect swarm/arena integration where used.

Actions: before dispatch, root creates or selects a safe separate worktree, records absolute path/branch/base/owner, verifies writer location, and passes it in the brief using supported mechanisms. Do not assume `run_subagent` provisions a worktree or enforces a CWD. Record artifact paths and collect diffs from the assigned workspace. Serialize if isolation cannot be established. Preserve user changes; do not automatically remove worktrees or branches.

Acceptance: two writers modifying the same relative filename operate on separate physical worktrees and produce independently reviewable diffs. Misconfigured/shared paths fail preflight or serialize. No overlap with the user's dirty checkout.

### Task 05 — Make pause and resume consistent

Dependencies: 01; incorporate 03 lifecycle records. Finding: F05.

Files: `skills/poteto-mode/SKILL.md`, `skills/poteto-mode/playbooks/pause-safely.md`, `skills/poteto-mode/playbooks/session-pickup.md`, `skills/poteto-mode/references/evidence-source.md`; inspect existing durable-state conventions before adding a new format.

Decision: an ordinary pause does not override the existing delivery/commit authorization rule.

Actions: preserve durable progress, outstanding work, checks, worker identities, workspace ownership, and next action without a commit when unauthorized. If commit authority exists, use the established safe checkpoint policy. Resume from allowed session evidence and durable state; do not invent transcript paths or repeat completed work merely because a new turn began.

Acceptance: pause with dirty files and no delivery request creates no commit; authorized checkpoint behavior is consistent; resume accurately reconstructs completed/pending work and exposes any unknown worker status.

### Task 06 — Repair delivery routing and verification disclosure

Dependencies: 01, 03. Findings: F09, F11.

Files: `skills/poteto-mode/SKILL.md`, `skills/poteto-mode/references/delivery-capability.md`, verification-bearing playbooks, `README.md`.

Actions: intercept explicit Shipping/Autopilot requests before the generic fallback. Initially report that the workflow is unavailable in the current port, with the supported bounded alternative; do not claim Devin universally lacks the capability. Detect actual UI/CLI verification tools before promising evidence. Preserve unresolved verification gaps in the final verdict; never substitute compile success for proof of the changed UI or CLI behavior.

Acceptance: explicit cut-workflow requests never silently enter figure-it-out; available CLI/UI surfaces are exercised; missing surface capability produces a precise limitation, not a success claim.

### Task 07 — Validate and document core completion

Dependencies: 01-06. Findings: all core findings.

Files: `tests/poteto-delegation.test.mjs`, `tests/pstack-models.test.mjs`, `docs/poteto-delegation-evaluation.md`, `docs/poteto-delegation-refinement-plan.md`, `README.md`, and a dated evidence file if consistent with repository convention.

Actions: extend existing structural checks for contract consistency, valid references, profile mapping, missing principles, explicit delivery routing, and isolation requirements. Avoid brittle tests that only mirror paragraphs. Run the live scenarios below in a disposable consuming repository; distinguish simulation and static checks from native Devin execution. Document any blocked checks and do not declare core complete while essential worker collection remains unproven.

### Task 08 — Restore supported current-session delivery (later)

Dependencies: core acceptance passed; explicit implementation scope for delivery. Finding: F12.

Files: `skills/poteto-mode/references/delivery-capability.md`, existing `playbooks/opening-a-pr.md` and `playbooks/babysit.md`; add a Devin-specific `playbooks/shipping.md` only when implementing that route.

Actions: adapt independent verifier verdicts, current head/base and patch checks, invalidation after revision changes, and sequential authorized landing. Audit Git/forge/runtime dependencies. Do not introduce Graphite or implicit merge authority. Validate first against fixtures or a disposable PR; actual external merges require authorization.

Acceptance: stale verdicts cannot authorize landing; failed/pending checks block advancement; explicit requests reach the implemented route; permission boundaries remain intact.

### Task 09 — Evaluate autonomous continuation (separate capability project)

Dependencies: 00 and stable core. Finding: F12 and platform boundaries.

Files: `skills/poteto-mode/playbooks/autonomous-run.md`, `skills/poteto-mode/playbooks/orchestrate.md`, capability documentation; new adapters only after an evidence-backed design.

Actions: separately evaluate Devin CLI iteration, handoff, cloud automations, and Dynamic Workflows. Verify whether invocation is user-only or agent-callable; distinguish bounded iteration from a time-based wakeup. Preserve exit predicates, checkpoints, cancellation, ownership, and recovery. Keep local custom profiles separate from cloud orchestration. Do not advertise an autonomous route before its chosen mechanism is proven.

Acceptance: document a tested capability-specific route or retain a clearly bounded current-session implementation with resume instructions. Never claim durable state alone wakes an agent. Advanced autonomy is not required to mark the core repair complete.

## 6. Validation matrix

Run in a disposable consuming repository with the intended plugin/profile installation. Record CLI/plugin revision, surface, permission mode, requested profile, returned identity, workspace, collection method, checks, artifacts, and parent verdict. Redact secrets.

| Case | Scenario | Pass criterion |
| --- | --- | --- |
| V01 | Hook fails; organic coding request; later follow-up | Core poteto obligations remain available; casual replies do not incur unnecessary rigor |
| V02 | Narrow function question | Proportional how path and investigation tracking; no unnecessary fan-out |
| V03 | Cross-file subsystem investigation | Independent exploration followed by synthesis and source evidence |
| V04 | Same-module function-boundary feature | how, architect/design comparison, throughput, delegated execution, real verification |
| V05 | Rationale/regression question | Conditional why path with unavailable evidence explicitly stated |
| V06 | Foreground implementation worker | Completed result, scoped diff, independent parent check |
| V07 | Two background workers completing out of order | Both IDs retained, both results collected, both reflected in synthesis |
| V08 | Worker needs unapproved permission | No background approval assumption or bypass; supported recovery or explicit blocker |
| V09 | Concurrent writers touch same relative path | Separate worktrees and independently attributable diffs |
| V10 | Pause without commit authority, then resume | No commit; durable state restores progress without duplication |
| V11 | Shipping/Autopilot request before implementation | Explicit current-port capability response; no generic fallback |
| V12 | UI tools absent/present | Honest unavailable result or real surface evidence, respectively |
| V13 | Plan-only request | Produces plan and stops before implementation |
| V14 | Profile/model test | Registered requested mapping verified; runtime identity reported only if observable |

Existing structural command (run from the target repository):

```sh
node --test tests/pstack-models.test.mjs tests/poteto-delegation.test.mjs
```

The audit subagent reported 13/13 structural tests passing. That does not prove runtime behavior. The prior recorded organic evaluation left worker completion, collection, parent verification, and model identity unproven. A later CLI attempt in the audit environment encountered a logging permission failure; this is not evidence of a plugin defect. Rerun native checks in an authorized functioning Devin environment.

## 7. Uncertainty register and official references

Recheck these references against the implementation version; platform behavior can change.

| Topic | Official source | What remains to verify |
| --- | --- | --- |
| Plugin instructions and surface support | https://docs.devin.ai/cli/extensibility/plugins/overview | Always-on routing in a consuming repository; local versus cloud distinction |
| Skills and permissions | https://docs.devin.ai/cli/extensibility/skills/creating-skills | Actual supported metadata and scoped permissions |
| Hooks | https://docs.devin.ai/cli/extensibility/hooks/overview | Fail-open behavior and routing fallback |
| Subagent lifecycle/nesting | https://docs.devin.ai/cli/subagents | Exact dispatch/collection/resume fields, background behavior, bounded nesting |
| CLI permissions | https://docs.devin.ai/cli/reference/permissions | Foreground permission recovery on supported version |
| CLI loop | https://docs.devin.ai/cli/reference/commands | Iteration semantics and agent-callability; not presumed timer parity |
| Handoff | https://docs.devin.ai/cli/handoff | State transfer and supported invocation surface |
| Automations | https://docs.devin.ai/product-guides/automations | Organization availability and controlled session continuation |
| Dynamic Workflows | https://docs.devin.ai/work-with-devin/dynamic-workflows | Availability, bounded lifetime, separate cloud topology |
| UI tools | https://docs.devin.ai/work-with-devin/devin-session-tools | Tool availability on actual host/surface |
| Computer use | https://docs.devin.ai/work-with-devin/computer-use | Actual verification capabilities and artifacts |
| Cloud plugin guide | https://docs.devin.ai/product-guides/plugins | Resolve cloud-hook discrepancy with CLI plugin reference by live testing |

## 8. Handoff and definition of done

Implementers must read the current files, not treat snapshot line numbers as immutable. Keep changes limited to poteto and required companions. Do not replace existing model routing, permission policy, or delivery authorization simply to obtain passing results.

For each task, report: changed files; requirement addressed; checks run; concrete evidence; unresolved limitations. Core work is complete only when Tasks 00-07 are implemented, structural checks pass, essential native worker/isolation/recovery checks pass, and remaining surface restrictions are documented accurately. If live checks are blocked, report implementation complete but runtime validation blocked; do not claim full parity.

Tasks 08-09 are explicitly later work. The immediate objective is reliable everyday poteto behavior, not an unverified recreation of Cursor's entire cloud/autonomous runtime.
