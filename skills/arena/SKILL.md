---
name: arena
description: "Spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it. Use for /arena, 'arena this', 'throw it in the arena', or when one attempt at a non-trivial artifact would lock in the wrong shape."
---

# Arena

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md). Record a `PanelRun` before the first `run_subagent` call. Sequential when distinct profiles are fewer than N. Say so. Do not claim parallel execution in that mode.

Open a todolist with one entry per phase: Frame, Fan out, Cross-judge, Pick, Graft, Verify.

## Phase A: Frame

The prompt is the contract.

1. State the artifact.
2. Derive the rubric. 3-6 concrete, gradeable criteria. Candidates do not see the rubric.
3. Pick runners from `arena runners` in `$HOME/.config/devin/pstack-models.md`, else the Models defaults. Same profile N times when the work is generation-bound.
4. Assign output paths. Each candidate writes to its own root-provisioned location. A verified git worktree when possible, otherwise a separate `/tmp/arena-<slug>/candidate-<n>/` directory. A branch in the shared checkout is not isolation. Shared write paths fail `skills/principle-separate-before-serializing-shared-state/SKILL.md`. Record each workspace per [`../poteto-mode/references/delegation.md`](../poteto-mode/references/delegation.md) before dispatch.

## Phase B: Fan out

One `run_subagent` per runner. Same task, shared grounding path, own output path. Produce the artifact and a short rationale. The rationale names alternatives considered and rejected.

If a candidate produces nothing, continue with N-1 and note the dropout.

## Phase C: Cross-judge

After every candidate finishes, pick one profile from `arena cross-judge pool`. The judge never shares the parent's model. A profile's model is its `model:` pin, so compare each pool entry's pin with the parent session's model and try only entries whose pin differs, in pool order. Two profiles with the same pin are the same model, such as `panel-opus` and `panel-codex` at their shipped pins. If no entry with a different pin is registered and runs, skip the judge, pick the base alone in Phase D, and say so. Devin does not label the parent's model to the agent. When you cannot confirm it, use the first pool entry and say that the model check did not run. One `run_subagent`. It is read-only. It sees the rubric and candidates by path label, scores each criterion, and recommends a base.

Do not start the judge while candidates are still writing.

## Phase D: Pick a base

Read every candidate end to end. Score criterion by criterion. Compare with the cross-judge when Phase C ran one. Agreement confirms. Disagreement means bias or a fuzzy rubric. Read both rationales before deciding.

Pick the base a future maintainer can extend without breaking invariants. Prefer the cleaner boundary when tied.

## Phase E: Graft

Walk each loser once. Usually one or two grafts, not most of it. For a nontrivial code graft, dispatch the graft through [`../poteto-mode/references/delegation.md`](../poteto-mode/references/delegation.md) to a dedicated implementation worker with an isolated worktree, then have the root select and verify the result. Keep trivial prose or metadata grafts in the root. Read `skills/principle-redesign-from-first-principles/SKILL.md`.

When N candidates converge, note that and ship the consensus. No graft. When they wildly diverge, Phase A was under-specified. Reframe and re-run.

## Phase F: Verify

The synthesized artifact gets the same scrutiny as any other output. Read `skills/principle-prove-it-works/SKILL.md`.

A verification miss means re-frame or return to graft. Do not paper over.

## Outputs

One synthesized artifact, with a short synthesis note naming the base and why, the cross-judge verdict or that Phase C skipped the judge, each graft and its source, rejections and why, convergence or dropouts, and the verification result.

## Models

`$HOME/.config/devin/pstack-models.md` overrides these defaults.

- arena runners: `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet`
- arena cross-judge pool: `pstack:panel-opus`, `pstack:panel-swe`
