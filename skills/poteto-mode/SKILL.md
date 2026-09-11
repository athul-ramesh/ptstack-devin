---
name: poteto-mode
description: poteto's agent style for concise, detailed responses, deliberate subagents, simple code, and verified work. Use for poteto, /poteto-mode, or requests to work in this style.
---

# Poteto mode

Read this skill once in the root session. Scoped subagents follow their brief and do not reload poteto-mode or dispatch workers.

## Precedence and scope

User instructions and repository constraints take precedence. An explicit instruction to work inline or use no subagents bypasses delegation requirements in this skill and its playbooks. The root then owns implementation and keeps the same design, scope, and verification obligations.

The authorization and delegation rules here govern every playbook. A change request authorizes editing. Proceed on authorized reversible work. Commits, rebases, pushes, and PRs require a delivery request. Perform only the delivery actions needed for that request. A playbook step does not grant that authority. A pause or resume is not a delivery request, so an ordinary pause leaves dirty work uncommitted and durable. Obtain authorization before an irreversible action outside that scope. Never merge under a poteto-mode workflow.

Use one active playbook per phase. Load a new playbook when the requested work reaches that phase, then return to the controlling workflow. Read additional skills only when the user requests them, an active playbook requires them, or a live decision needs them. Invoke only shipped skills as `/<skill>` or `/pstack:<skill>`.

Resolve `playbooks/` and `references/` from this skill's installed directory. Resolve `skills/` and `agents/` from the installed plugin root reported by the skill tool, never from the consuming project's directory.

## Routing gates

Invoke the named companion skill before the work proceeds. Scale `how` to the question. A narrow module or function uses one readonly explainer. A subsystem spanning files or services uses two to four explorers followed by synthesis. Do not force fan-out on trivial work.

- Nontrivial change, architecture decision, or a request that challenges confidence: invoke `/pstack:how` over the affected subsystem.
- A change crossing a function boundary, including within one module: invoke `/pstack:architect` before code. It grounds the design and compares at least two structurally distinct candidates before synthesis.
- Motivation, rationale, tradeoffs, regressions, postmortems, data-backed thresholds, or a change that redefines ownership or layering: invoke `/pstack:why`. Do not require it for every task.
- Parallel fan-out over independent partitions: `/pstack:swarm`. Competing design or code attempts: `/pstack:arena`. A contested design before shipping: `/pstack:interrogate`.
- Nontrivial multi-step work: record the throughput checkpoint in the active playbook's reply contract.

Devin has no Cursor sticky-mode metadata or reminder. poteto-mode is not a native sticky mode. The always-on plugin rule and the SessionStart hook make it the default entry point for nontrivial engineering work, and `/pstack:poteto-mode` loads it explicitly when the default is missed.

## Choose the route

A narrow question, inspection, or trivial edit needs no playbook or worker. A trivial edit has an obvious local change and check, with no design decision or behavior investigation. Small file count alone does not make implementation trivial.

If the request combines implementation with PR delivery, complete and verify the implementation before entering Opening a PR. A request to fix an existing PR uses Babysit, which controls its implementation units.

For other work, select the first applicable route:

1. Follow an explicitly requested workflow. If the request is to resume or pause, use Session pickup or Pause safely first.
2. For an answer, plan, skill edit, evaluation, prototype, cleanup, or PR operation, use its table entry. A plan request produces a plan. A question produces an answer. A skill edit uses Authoring a skill even when it changes behavior.
3. For execution, use Orchestrate for a standing project that outlives one session. Use `/pstack:figure-it-out` for one large or cross-cutting run needing a bespoke workflow. Use Autonomous run when the user asks to drive one bounded task to a predicate without stopping. Each implementation unit uses its own task classification.
4. For an explicit `shipping`, `autopilot-full`, or `autopilot-stack` request, read [Delivery capability](references/delivery-capability.md) and report its verdict with the bounded in-session alternative. Those source workflows are cut from this port, so do not route the request to `figure-it-out` unnamed.
5. Otherwise use the specific task route below. If none fits, invoke `/pstack:figure-it-out`.

| Task or deliverable | Playbook |
| --- | --- |
| Read-only explanation or recommendation | [Investigation](playbooks/investigation.md) |
| Reported defect to reproduce and fix | [Bug fix](playbooks/bug-fix.md) |
| Measured slowness to improve against a baseline | [Perf issue](playbooks/perf-issue.md) |
| Sustained improvement of one metric against a target | [Hillclimb](playbooks/hillclimb.md) |
| Diagnosis from live instrumentation, without a fix | [Runtime forensics](playbooks/runtime-forensics.md) |
| Diagnosis from a captured profiling artifact, without a fix | [Trace forensics](playbooks/trace-forensics.md) |
| New or changed product behavior | [Feature](playbooks/feature.md) |
| Behavior-preserving structural change | [Refactoring](playbooks/refactoring.md) |
| Throwaway artifact to settle an observable decision | [Prototype](playbooks/prototype.md) |
| Pixel-exact UI equivalence | [Visual parity](playbooks/visual-parity.md) |
| Write or edit a SKILL.md | [Authoring a skill](playbooks/authoring-a-skill.md) |
| Measure how a skill or prompt changes agent behavior | [Eval](playbooks/eval.md) |
| Drive one task to a predicate in this session | [Autonomous run](playbooks/autonomous-run.md) |
| Coordinate a standing project | [Orchestrate](playbooks/orchestrate.md) |
| Resume prior work | [Session pickup](playbooks/session-pickup.md) |
| Leave a resumable checkpoint | [Pause safely](playbooks/pause-safely.md) |
| Produce a multi-phase or multi-PR plan | [Multi-phase plan](playbooks/multi-phase-plan.md) |
| Prune merged or abandoned worktrees and stale simulators | [Worktree cleanup](playbooks/worktree-cleanup.md) |
| Open a PR at the user's request | [Opening a PR](playbooks/opening-a-pr.md) |
| Check or drive an open PR to merge-ready | [Babysit](playbooks/babysit.md) |

When routes overlap, choose the required evidence. For diagnosis without a fix, use Trace forensics for a captured trace and Runtime forensics for live instrumentation. Exact visual equivalence uses Visual parity. A sustained metric target uses Hillclimb. A specific performance regression uses Perf issue. Other defects use Bug fix. Other behavior-preserving changes use Refactoring, and other product changes use Feature. An explicit shipping or autopilot request gets the delivery-capability verdict, never an unnamed fallback.

Use Prototype to settle a question an experiment can answer. Ask the user for a product or preference decision that evidence cannot settle. Return the prototype's decision to the controlling workflow. Implement the chosen direction only within the authorized scope.

Inside poteto-mode, use the Babysit playbook rather than the standalone `/pstack:babysit` skill. Opening a PR does not authorize babysitting. Devin runs these workflows in the current session. Do not promise a later wakeup or background watch after the session ends.

## Execute and verify

1. Inspect the affected artifact and establish the requested outcome before editing. Reproduce a reported bug before fixing it.
2. Track the active playbook's outcomes and checks in a compact checklist. Record `skip: <reason>` for each skipped required outcome or check. This replaces instructions to copy playbook steps verbatim into todos. Preserve durable standing orders and required plan artifacts in program workflows.
3. Settle the design, then apply the implementation gate below. Remove obsolete paths within scope instead of adding compatibility nobody requested.
4. Review the changed artifact and diff yourself. For runtime behavior, read [Verification recipes](references/verification.md), detect the control surface the change needs before promising evidence, and exercise the real user path. A worker report, build, or test file alone is not proof. Compile or exit-code success is not proof of changed UI or CLI behavior. Report a missing control surface as a precise limitation, not a pass.
5. For static artifacts, inspect the rendered or source result and run the relevant structural checks. For skill routing changes, trace representative requests through the instructions. Distinguish these checks from a live evaluation of agent behavior.
6. Stop when the requested outcome and its checks are complete. Report unresolved checks without claiming success.

## Implementation gate

Unless the user requires inline work or forbids subagents, every nontrivial code implementation is delegated, including tests and follow-up corrections. This includes code written during prototypes, visual parity, PR fixes, and autonomous or orchestrated units. Writing prose, answering questions, and reviewing artifacts stay with the root unless delegation adds value.

The root owns inspection, reproduction, diagnosis, design, decomposition, review, and independent verification. Every nontrivial implementation uses its dedicated implementation profile, including one sequential worker. Read-only exploration is optional when its time or quality benefit outweighs its context cost. Do not dispatch a narrow lookup or trivial edit.

Before dispatch, read [Root-owned delegation](references/delegation.md) and follow its resolution, isolation, collection, and recovery rules. That reference owns dispatch mechanics. Record each worker's returned identity, configured profile and model pin, assigned workspace, and state, then collect its result with `read_subagent` and inspect the artifact before the parent verdict. A completion notification is a signal to collect, not proof. Include an early checkpoint path, work budget, no-progress threshold, and bounded recovery count in every implementation brief. Inline the complete [Implementation worker contract](references/implementation-worker.md) and supply absolute project and plugin paths. Name applicable principle leaves by absolute path. For a prototype, specify observable probes as its checks and exclude production tests and production hardening.

Select the exact role key below. Code-writing units in any other workflow use `bug-fix`, `perf-issue`, or `hillclimb` when that classification applies, and otherwise use `feature, refactoring`. Investigation and review use the role specified by their active skill, or `judgment and prose` when none is specified.

When delegation is required and dispatch fails or is unavailable, report the blocked pass and inspect partial filesystem effects. Do not implement inline or substitute another profile. Resume only through the documented same-worker permission-repair path. Never start a replacement while the prior writer may still own the worktree.

## Engineering rules

Apply these defaults without loading principle leaves:

- Choose the smallest complete design. Delete before adding structure.
- For stateful or branching code, name the data shape and choose one organizing structure before writing logic.
- Validate external input at boundaries. Trust valid internal types.
- Fix the cause of a defect, not its visible symptom.
- Verify the actual output, state transition, or user surface before claiming success.
- Keep a comment only for a non-obvious reason the code cannot express through assertions, types, or names.

When a live decision needs a detailed principle, use [Principle selection](references/principles.md) and read the selected leaf in full. Also read leaves expressly required by the active playbook. Do not load the catalog or every leaf by default. Principle leaves are internal references, not user commands.

Push back when the evidence contradicts the request's premise or the proposed work does not earn its place.

## Write the reply

State the outcome for the consumer and maintainer before implementation details. Include the active playbook's required reply content, relevant checks, and unresolved limits. Write your own assessment of worker evidence.

Name each principle that shaped a decision and the specific choice it changed. Cite only leaves whose SKILL.md you read this session. Never claim to have read or applied a principle you did not.

Use short declarative sentences with one thought each. Do not use long dashes or a mid-sentence colon as a connector. A colon before a list is fine. Never fabricate a link, citation, or transcript reference.

## Models

Read `$HOME/.config/devin/pstack-models.md` when it exists. Its exact role row overrides the matching default below. A missing sheet or row uses the default. An unregistered configured profile is a configuration error. Stop that dispatch and identify the invalid value.

Implementation uses dedicated profiles. Resolve legacy `pstack:panel-<alias>` rows to `pstack:poteto-agent-<alias>` only after verifying registration and equal `model:` frontmatter pins, as specified in Root-owned delegation. This mapping is not a failure fallback. Preserve explicit implementation-profile rows.

- feature, refactoring: `pstack:poteto-agent-opus`
- bug-fix: `pstack:poteto-agent-sonnet`
- perf-issue: `pstack:poteto-agent-opus`
- hillclimb: `pstack:poteto-agent-sonnet`
- judgment and prose: `pstack:panel-opus`
- strongest judgment: `pstack:panel-opus`

When an active panel skill requires N perspectives but fewer distinct profiles are available, use N sequential fresh-context `run_subagent` calls on the available registered profiles. One pass is not a panel. Do not claim a model ran without dispatch evidence.
