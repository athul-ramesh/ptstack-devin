---
name: arena
description: "Spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it. Use for /arena, 'arena this', 'throw it in the arena', or when one attempt at a non-trivial artifact would lock in the wrong shape."
---

# Arena

Fan out N independent attempts at the same task. Read every candidate end to end. Pick the strongest as the base. Graft the best ideas from the others into it. Verify the result.

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md). Record a `PanelRun` before the first `run_subagent` call. Sequential when distinct profiles are fewer than N. Say so. Do not claim parallel execution in that mode.

## Start

Open a todolist with one entry per phase.

1. Frame
2. Fan out
3. Cross-judge
4. Pick
5. Graft
6. Verify

## Phase A: Frame

The prompt is the contract.

1. State the artifact.
2. Derive the rubric. 3-6 concrete, gradeable criteria. Candidates do not see the rubric.
3. Pick runners from `arena runners` in `$HOME/.config/devin/pstack-models.md`, else the Models defaults. Same profile N times when the work is generation-bound.
4. Assign output paths. Each candidate writes to its own location. A git worktree when possible, otherwise `/tmp/arena-<slug>/candidate-<n>/`. Shared write paths fail `skills/principle-separate-before-serializing-shared-state/SKILL.md`.

## Phase B: Fan out

One `run_subagent` per runner. Same task, shared grounding path, own output path. Produce the artifact and a short rationale. The rationale names alternatives considered and rejected.

If a candidate produces nothing, continue with N-1 and note the dropout.

## Phase C: Cross-judge

After every candidate finishes, pick one profile from `arena cross-judge pool`. Prefer a distinct profile from the parent. One `run_subagent`. It is read-only. It sees the rubric and candidates by path label, scores each criterion, and recommends a base.

Do not start the judge while candidates are still writing.

## Phase D: Pick a base

Read every candidate end to end. Score criterion by criterion. Compare with the cross-judge. Agreement confirms. Disagreement means bias or a fuzzy rubric. Read both rationales before deciding.

Pick the base a future maintainer can extend without breaking invariants. Prefer the cleaner boundary when tied.

Record the pick, the reason, and the cross-judge verdict beside the base artifact.

## Phase E: Graft

Walk each loser once. Usually one or two grafts, not most of it. Fold by hand so one mental model remains. Read `skills/principle-redesign-from-first-principles/SKILL.md`.

Record grafts, sources, and rejections. Rejections are the high-signal part.

When N candidates converge, note that and ship the consensus. No graft. When they wildly diverge, Phase A was under-specified. Reframe and re-run.

## Phase F: Verify

The synthesized artifact gets the same scrutiny as any other output. Read `skills/principle-prove-it-works/SKILL.md`.

A verification miss means re-frame or return to graft. Do not paper over.

## Outputs

One synthesized artifact. One short synthesis note naming the base, grafts, rejections, dropouts, and verification result.

## Models

`$HOME/.config/devin/pstack-models.md` overrides these defaults.

- arena runners: `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet`
- arena cross-judge pool: `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet`
