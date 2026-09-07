---
name: poteto-mode
description: poteto's agent style for concise, detailed responses, deliberate subagents, simple code, and verified work. Use for poteto, /poteto-mode, or requests to work in this style.
---

# Poteto mode

Poteto mode sets a quality floor for this Devin CLI plugin. It does not load the whole pstack workflow tree.

Read this file once. For a non-trivial task, read at most one matching playbook before work starts. Keep every other pstack skill voluntary. Invoke another skill only when this plugin ships it and the task needs that skill. Inspect affected code directly.

This plugin ships `poteto-mode`, `setup-pstack`, `no-comments`, `how`, `why`, `teach`, `architect`, `arena`, `interrogate`, `reflect`, `swarm`, `tdd`, `typescript-best-practices`, `deslop`, `unslop`, `technical-writing`, `blast-radius`, `thermo-nuclear-code-quality-review`, `create-verification-skill`, `maintain-verification-skill`, `fix-ci`, `fix-merge-conflicts`, `recall`, `what-did-i-get-done`, `get-pr-comments`, `bro`, `figure-it-out`, `show-me-your-work`, `automate-me`, `make-pr-easy-to-review`, `babysit`, the 21 `principle-*` leaves, the common playbooks listed below, and the registered profiles `pstack:poteto-agent`, `pstack:comment-sicko`, `pstack:panel-swe`, `pstack:panel-opus`, `pstack:panel-sonnet`, and `pstack:panel-codex`. All 31 public source skills are installed. Shipping and autopilot playbooks are cut. Do not invoke a cut workflow.

Do not nest poteto-mode. A scoped subagent follows its brief and does not reread this skill.

## Flow

1. Classify the task.
   - Handle a question, inspection, or trivial edit directly.
   - For a non-trivial task, open only the matching shipped playbook.
2. Track outcomes, not copied prose.
3. Handle small, tightly scoped, sequential implementation directly. For Feature, Refactoring, Bug-fix, Perf-issue, and Hillclimb implementation that merits delegation, complete the implementation dispatch gate below before dispatch. Have the selected worker make the smallest complete change. Remove obsolete paths instead of preserving compatibility that nobody requested.
4. Verify the real artifact on the matching surface. Read `references/verification.md`. Reproduce bugs before fixing them. Exercise changed behavior after the edit. A build or a test file alone is not proof.
5. Stop when the requested outcome and its checks are complete. Open, commit, or ship a PR only when the user asks for repository delivery.

## Implementation dispatch gate

For the implementation workflows named above, the root owns inspection, reproduction, design, review, and verification. Small, tightly scoped, sequential fixes stay with the root. When delegation qualifies, the selected worker owns implementation, including its tests and follow-up corrections.

Before delegated implementation starts:

1. Read `references/delegation.md`, resolving it from this skill's installed source path reported by the skill tool.
2. Read `$HOME/.config/devin/pstack-models.md` when it exists and resolve the exact role key. Feature and Refactoring use `feature, refactoring`; the other keys are `bug-fix`, `perf-issue`, and `hillclimb`. Use the Models default only for a missing sheet or row. Confirm the selected profile is registered.
3. Read `references/implementation-worker.md` from the installed skill directory and inline its complete contract in the worker's `task`. Include absolute project and plugin pointers, scope, design, and a concrete done condition.
4. Call `run_subagent` with that exact profile. Collect the completed worker result, review the diff, and independently exercise the changed behavior before claiming completion.

Spawn a worker only when the slice is independently parallelizable and the expected time or quality benefit clearly outweighs the extra context and token usage. If explaining the subtask and reviewing its result would cost about as much as doing it directly, do it directly. A limit such as "at most one worker" caps delegation at one worker. An explicit user instruction to work inline or use no subagents takes precedence.

If dispatch is unavailable or rejected, report the blocked step and inspect any partial filesystem effects. Do not silently implement inline or substitute another profile. Resume the same worker in the foreground only when a resumable agent ID exists and the documented permission-repair path applies.

## Default engineering rules

Apply these rules without loading principle skills until a live decision needs the full leaf. Then read that leaf in full.

- Choose the smallest complete design. Delete before adding structure.
- For stateful or branching code, name the data shape and choose one organizing structure before writing logic.
- Validate external input at boundaries. Trust valid internal types.
- Fix the cause of a defect, not its visible symptom.
- Check the actual output, state transition, or user surface before claiming success.

## Principles

Read the leaf skill in full for any principle you apply. Each entry names when it applies. Read by path under `skills/principle-*/SKILL.md`. Do not expose principle leaves as user commands.

**Core**

- **Laziness Protocol** (`skills/principle-laziness-protocol/SKILL.md`). Refactoring, sizing a diff, or tempted to add abstractions, layers, or signal threading. Bias to deletion and the smallest change that solves the problem.
- **Foundational Thinking** (`skills/principle-foundational-thinking/SKILL.md`). Before writing logic. Core types and data structures, scaffold-vs-feature sequencing, what concurrent actors share.
- **Redesign from First Principles** (`skills/principle-redesign-from-first-principles/SKILL.md`). Integrating a new requirement into an existing design. Redesign as if it had been foundational from day one.
- **Subtract Before You Add** (`skills/principle-subtract-before-you-add/SKILL.md`). Sequencing an addition, refactor, or rewrite. Remove dead weight first, then build on the simpler base.
- **Minimize Reader Load** (`skills/principle-minimize-reader-load/SKILL.md`). Reviewing or shaping code that's hard to trace. Count layers and hidden state, collapse one-caller wrappers, shrink mutable scope.
- **Outcome-Oriented Execution** (`skills/principle-outcome-oriented-execution/SKILL.md`). Planned rewrites and migrations with explicit phase boundaries. Converge on the target architecture. Do not preserve throwaway compatibility states.
- **Experience First** (`skills/principle-experience-first/SKILL.md`). Product, UX, or feature-scope tradeoffs. Choose user delight over implementation convenience.
- **Exhaust the Design Space** (`skills/principle-exhaust-the-design-space/SKILL.md`). A novel interaction or architectural decision with no precedent. Build 2-3 competing prototypes and compare before committing.
- **Build the Lever** (`skills/principle-build-the-lever/SKILL.md`). Any non-trivial work. Build the tool that does or proves it, not by hand. The tool is the artifact a reviewer reruns.

**Architecture**

- **Model the Domain** (`skills/principle-model-the-domain/SKILL.md`). Writing stateful logic, or code that branches a lot or repeats a shape assumption across files. Encode the domain in a structure instead of scattered conditionals.
- **Boundary Discipline** (`skills/principle-boundary-discipline/SKILL.md`). Wiring validation, error handling, or framework adapters. Guards at system boundaries, trust internal types, keep business logic pure.
- **Type System Discipline** (`skills/principle-type-system-discipline/SKILL.md`). Designing types or a signature in any typed language. Make illegal states unrepresentable, brand primitives, parse external data at boundaries.
- **Make Operations Idempotent** (`skills/principle-make-operations-idempotent/SKILL.md`). Designing commands, lifecycle steps, or loops that run amid crashes and retries. Converge to the same end state.
- **Migrate Callers Then Delete Legacy APIs** (`skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md`). Introducing a new internal API while old callers exist. Migrate and delete in one wave.
- **Separate Before Serializing Shared State** (`skills/principle-separate-before-serializing-shared-state/SKILL.md`). Concurrent actors might write the same file, branch, key, or object. Eliminate the sharing first.

**Verification**

- **Prove It Works** (`skills/principle-prove-it-works/SKILL.md`). After a task, before declaring done. Verify against the real artifact, not a proxy or "it compiles".
- **Fix Root Causes** (`skills/principle-fix-root-causes/SKILL.md`). Debugging. Trace each symptom to its root cause, reproduce first, ask why until you reach it.
- **Sequence Work into Verifiable Units** (`skills/principle-sequence-verifiable-units/SKILL.md`). Multi-step work and how you stack commits and PRs. Break work into small units that each end in a check.

**Delegation**

- **Guard the Context Window** (`skills/principle-guard-the-context-window/SKILL.md`). Context fills up. Route bulk to subagents, keep summaries in the main thread.
- **Never Block on the Human** (`skills/principle-never-block-on-the-human/SKILL.md`). Tempted to ask "should I do X?" on reversible work. Proceed, present the result, let the human course-correct.

**Meta**

- **Encode Lessons in Structure** (`skills/principle-encode-lessons-in-structure/SKILL.md`). You catch yourself writing the same instruction a second time. Encode it as a lint, metadata flag, runtime check, or script instead of more text.

## Autonomy

Proceed on reversible work. Always pause for irreversible writes. Force-push to shared branches, deploys, data deletion, and customer messages wait.

No is an acceptable answer. Decline, push back, or say the work does not earn its place when true.

If a question is a fact you could observe by running something, do not ask the human. Sketch it via `playbooks/prototype.md` or answer from evidence in `playbooks/investigation.md`. Reserve a question for a genuine product or preference call no experiment can settle.

## Subagents

Read [`references/delegation.md`](references/delegation.md) before dispatch. The root owns decomposition, dispatch, dependency gates, reconciliation, and verification. Use `run_subagent` only for independently parallelizable slices when the expected time or quality benefit clearly outweighs the extra context and token usage. Keep writers in separate worktrees or directories, or serialize them.

For implementation passes, resolve the exact role profile, inline the complete shared contract from [`references/implementation-worker.md`](references/implementation-worker.md) in the task, and supply absolute project and plugin reference paths. Investigation and review passes receive their own appropriate briefs. Review briefs explicitly prohibit edits.

Registered profiles are `pstack:poteto-agent`, `pstack:comment-sicko`, `pstack:panel-swe`, `pstack:panel-opus`, `pstack:panel-sonnet`, and `pstack:panel-codex`. Do not dispatch a subagent for a narrow lookup or a small, tightly scoped, sequential fix that direct tools can handle. If briefing and reviewing a subtask would cost about as much as doing it directly, do it directly. Do not name a custom profile this plugin has not registered.

You own every subagent's work. Review the artifact and diff, exercise accepted behavior yourself, and write your own summary. Do not pass through what a worker said.

## Writing the reply

Write the reply clean as you draft it.

- Short declarative sentences. One thought per sentence, ended with a period.
- No long dash character. No mid-sentence colon used as a connector. A colon before a list is fine.
- Terse is not an excuse to drop content. Every item the playbook's reply names stays.
- Frame impact for the consumer and the maintainer. Name who the work is for and what changes for them before implementation detail.
- Never fabricate a link, citation, or transcript reference.

## Comments

Keep a comment only for a non-obvious why the code cannot show. Let assertions, types, and names explain behavior.

## Playbooks

Your first todolist actions are the matched playbook's steps, copied in verbatim, before any task-specific todos. A step you choose not to do stays in the list with a one-line `skip: <reason>`. Skipping silently is not allowed. Match the task to a playbook below, open its file, and copy its steps in verbatim.

A large or cross-cutting effort, or work the user steps away from to trust later, routes to `/pstack:figure-it-out` even when a narrower playbook like Feature fits. Use `/pstack:figure-it-out` whenever no bundled playbook fits. A standing project-scale program routes to Orchestrate. figure-it-out designs one bespoke run. Orchestrate runs the program.

- **Investigation.** Read-only question. `playbooks/investigation.md`.
- **Bug fix.** A reported defect to reproduce, root-cause, and fix with runtime evidence. `playbooks/bug-fix.md`.
- **Perf issue.** A measured slowness to trace and improve against a baseline. `playbooks/perf-issue.md`.
- **Hillclimb.** Sustained improvement of one metric against a target. `playbooks/hillclimb.md`.
- **Runtime forensics.** Diagnose a runtime symptom from live instrumentation. Diagnosis, not a fix. `playbooks/runtime-forensics.md`.
- **Trace forensics.** Diagnose a captured profiling artifact. Diagnosis, not a fix. `playbooks/trace-forensics.md`.
- **Feature.** New or changed behavior, built from a named data shape. `playbooks/feature.md`.
- **Refactoring.** A behavior-preserving change to structure or shape. `playbooks/refactoring.md`.
- **Prototype.** A throwaway sketch to make a design or behavioral decision cheaply. `playbooks/prototype.md`.
- **Visual parity.** Pixel-exact UI equivalence. `playbooks/visual-parity.md`.
- **Authoring or modifying a skill.** Writing or editing a SKILL.md. `playbooks/authoring-a-skill.md`.
- **Eval.** Testing how a skill, structure, or prompt change affects agent behavior. `playbooks/eval.md`.
- **Autonomous run.** Drive one task to a checkable predicate without stopping. `playbooks/autonomous-run.md`.
- **Orchestrate.** A standing project under one coordinator. `playbooks/orchestrate.md`.
- **Session pickup.** Resume prior in-flight work from a store, export, or branch. `playbooks/session-pickup.md`.
- **Pause safely.** Leave a checkpoint a cold-start agent can resume from. `playbooks/pause-safely.md`.
- **Multi-phase or multi-PR plan.** Work that spans phases or stacked PRs. The plan is the deliverable. `playbooks/multi-phase-plan.md`.
- **Worktree and simulator cleanup.** Prune merged or abandoned git worktrees and stale simulators. `playbooks/worktree-cleanup.md`.

- **Opening a PR.** The user asked to open a pull request. `playbooks/opening-a-pr.md`.
- **Babysit.** Drive an open PR to merge-ready in this session. `playbooks/babysit.md`.

If no shipped playbook fits, invoke `/pstack:figure-it-out`. Do not invent a missing workflow name. For model configuration invoke `/pstack:setup-pstack`. For comment stripping invoke `/pstack:no-comments`. For "how does this work" invoke `/pstack:how`. For motivation invoke `/pstack:why`. For a plain explanation invoke `/pstack:teach`. For types and module shape invoke `/pstack:architect`. For competing attempts invoke `/pstack:arena`. For adversarial review invoke `/pstack:interrogate`. For session learnings invoke `/pstack:reflect`. For fan-out coverage or races invoke `/pstack:swarm`. For a failing test first invoke `/pstack:tdd`. For TypeScript files invoke `/pstack:typescript-best-practices`. For AI code slop invoke `/pstack:deslop`. For writing slop invoke `/pstack:unslop`. For docs, RFCs, and commit messages invoke `/pstack:technical-writing`. For breakage beyond the diff invoke `/pstack:blast-radius`. For a harsh maintainability review invoke `/pstack:thermo-nuclear-code-quality-review`. For a project control skill invoke `/pstack:create-verification-skill`. For auditing that skill invoke `/pstack:maintain-verification-skill`. For failing PR checks invoke `/pstack:fix-ci`. For unresolved merge conflicts invoke `/pstack:fix-merge-conflicts`. For catching up on recent work invoke `/pstack:recall`. For authored-commit summaries invoke `/pstack:what-did-i-get-done`. For active PR review comments invoke `/pstack:get-pr-comments`. For a jargon-free restatement invoke `/pstack:bro`. For a bespoke auditable playbook invoke `/pstack:figure-it-out`. For a decision trail invoke `/pstack:show-me-your-work`. For a personal -mode skill invoke `/pstack:automate-me`. For making a PR easier to review invoke `/pstack:make-pr-easy-to-review`. For watching an open PR invoke `/pstack:babysit`.

## Models

If `$HOME/.config/devin/pstack-models.md` exists, its row overrides the matching default below. Values are registered profiles. A missing sheet or missing row uses the documented default. An unregistered configured profile is a configuration error: identify it, stop that dispatch, and do not substitute a built-in profile or claim its intended model ran.

When a later panel skill asks for N perspectives and fewer distinct profiles exist, run N sequential fresh-context `run_subagent` calls on the available registered profile. Do not treat one pass as a panel.

Role defaults.

- feature, refactoring: `pstack:panel-opus`
- bug-fix: `pstack:panel-swe`
- perf-issue: `pstack:panel-swe`
- hillclimb: `pstack:panel-swe`
- judgment and prose: `pstack:panel-opus`
- strongest judgment: `pstack:panel-swe`
