# Port pstack 0.15.9 updates to Devin CLI

Implementation specification supplied by the operator on 2026-10-04. Source pstack 0.15.9 commit `e43c7ee26e0038c6c1fa8380dd34ce86ff94cb2a`; target baseline 0.1.0 commit `4d3e37811ab024af37d1859b364a667a8139b5d6`. Audit baseline CLI `3000.10.21 (611c1cba)`, 19 structural checks, 50 source skills and 54 target skills. This document records the accepted scope and batches; observed verification is recorded separately in [port verification](port-verification.md).

## Preserved contracts

Local Devin CLI packaging, namespaced skills, configured profile pins, root-owned dispatch and workspaces, bounded recovery, explicit permissions, artifact inspection, and operator-controlled merge remain authoritative. Retain ProgramState and worktree helpers and all eight Devin-only skills. Do not add cloud services, unattended schedulers, model substitutions, merge authority, Cursor packaging, or Bun orchestration/watch runtime.

Benny, including manual replacements, and make-bot-ui remain excluded. The inspected Benny pack includes Slack triage/reproduction, setup, templates, config, routing, adapters, and existing-fix verification. Bot routines, secret cards, panels, webhook authentication, and wake payloads have no established local equivalent. Shipping and both autopilot workflows report explicit “cut from this port” verdicts and bounded alternatives. This is a scope choice, not a universal Devin limitation.

## Batch 1. Portable skills, design, and logging

- Add user-triggered correct and benchmark-checklist and model-triggered Explain the Number. Link and catalog the measurement principle, including numeric eval claims.
- Correct requires two occurrences, architecture before types before lint/CI before behavioral tests before documentation, historical rejection proof, a rule/enforcement table, human-approved exceptions, and explicit evidence gaps. Invocation grants no merge or deployment authority.
- Benchmark checks limiter, production tuning, physical limits, errors/output correctness, repeatability, end-to-end relevance, and actual timed work. Comparisons require five interleaved runs per side with median/range. Insufficient evidence is inconclusive. Requested ballparks permit one labeled run while retaining errors and work checks. Detect OS and tool availability.
- Architect designs for partial-context agents and checks single state ownership, one supported task path with migrated callers, inaccessible internals, and authoritative derived lists or enforced consistency. Apply checks to candidates and synthesis.
- TypeScript uses schema-owned parsing and inferred types; a declared-type-first annotated schema must reject an omitted required field. Reuse existing schema libraries. Reflect requests every supported durable learning while retaining filtering and approval.
- Logs append headers for missing/empty files, sanitize cells and formulas, never change historical rows, identify interleaved runs with start boundaries, and audit only supported stretches. One conversation spans turns and compaction; pickups/replacements/new chats start new runs. Keep bounded summaries and resume notes.

## Batch 2. Workers, measurement, and verification

- Queue units, substantive follow-ups, and retries after completion use fresh workers with consolidated briefs. Same-worker foreground resume is limited to permission repair or justified costly-state recovery. Never replace an in-flight writer.
- Swarm commit verification names exact SHAs; measurements name sample count, sample definition, and execution order. Results repeat these. Proven defects produce ISSUES listing all demonstrated issues. Missing evidence allows one bounded fresh retry; another miss stays a gap.
- Performance strategies run in order: avoid work, avoid repeating it, do less, defer it, move it off the interactive path, run concurrently, make it cheaper. Perf issue stops once target is met; hillclimb retains its target/floor/regression/session bounds. Vet baselines and frozen harnesses; missing error/completed-work counts prevent a win.
- Multi-phase verification records code-ready SHA, exact-revision gates/live/performance checks, two distinct independent audit focuses on fresh configured profiles, disclosed sequential repeats, and reverification after patch-changing pushes. Preserve merge base through fixes, rebasing only for merge preparation, demonstrated conflicts, or trunk-caused CI failure. Use actual surface artifacts; absent-trunk features use absolute budgets.
- Add Node-only check-plan.mjs with line diagnostics and exit status; validate ordered completed skeleton, program checklist, per-PR blocks/dependencies, evidence checkboxes, appendices, control path, operator authority, and resolved placeholders. Require no Cursor models/cloud lanes/screenshots/goal/loop/hardcoded trunk.

## Batch 3. Configuration and documentation

- Read existing model sheet first; preserve valid configured lists/order and notes, fill missing defaults, accept repeatable role overrides, validate known roles/registration/compatibility, and fail duplicate or invalid rows without writes. Do not discard unknown role rows. Preserve helper APIs, atomic writes, repeated perspectives, idempotence, how critics, and pins.
- PR headings are Why, What changed, Scope, optional Tradeoffs, Blast Radius, Verification. Scope includes coverage and exclusions. Use concise outcomes and one primary perf number with linked detail.
- Remove only duplicate outcome verification, repeated sequence pattern bullets, dated fetched-source lines, and technical-writing checklist. Retain explicit artifact checks, risk-gated TDD, substituted regression explanations, context relevance, supervision, figure-it-out lifecycle, critique, and unslop additions.
- Release 0.2.0 ships 33 public skills, 24 principle leaves, 20 playbooks. Record source revision, actual verified CLI version, adaptations/exclusions, and observed versus untested behavior.

## Acceptance and evidence

Run existing structural checks after affected batches. Add coverage for discovery/triggers/relative links/catalog, historical enforcement rejection in a disposable repository, all benchmark evidence contracts, schema positive and missing-field compilation, logging preservation/sanitation/interleaving, fresh-worker ownership/recovery, swarm evidence retry bounds, validator positive/negative cases, model preservation/overrides/no-write errors, same-pin/repeated perspectives, and explicit delivery exclusions.

Native checks use a disposable consuming repository: installation/routing/discovery, foreground artifact and collection, approved background completion/collection by id, permission-denied same-worker recovery, and separate sequential repeated-profile passes. Configured pins are distinct from runtime identity. Structural checks never establish native execution. Report unavailable adapters, permissions, history, CI, or runtime identity as gaps.
