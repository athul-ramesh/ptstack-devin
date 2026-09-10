---
name: swarm
description: "Fan out N parallel workers, drain them, and return one report. Use for /swarm, 'swarm this', or parallel coverage, races, gauntlets, and exploration."
---

# Swarm

Fan out N workers. They may cover separate slices, race the same brief, or mix both. The parent waits, aggregates, and returns one report.

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md). Record a `PanelRun` before the first `run_subagent` call. Sequential when the host will not run them together or when distinct profiles are fewer than needed. Say so. Do not claim parallel execution in that mode.

## Start

Open a todolist with one entry per phase.

1. Frame
2. Fan out
3. Aggregate
4. Report

## Phase A: Frame

1. State the done predicate and the artifact or report.
2. Choose the shape. Partition, race, or mix. For a race or mix, declare `first pass`, `rank all`, or `best-of` before spawning.
3. Set N from the user or the shape. N is total workers, not concurrency.
4. Pick the worker profile from `swarm workers` in `$HOME/.config/devin/pstack-models.md`, else the Models default. For a model race, name each arm's profile up front.
5. Give each writer its own root-provisioned output. A verified git worktree, or a separate directory such as `/tmp/swarm-<slug>/worker-<n>/`. A branch in the shared checkout is not isolation.

## Phase B: Fan out

One `run_subagent` per worker on the swarm-workers profile. The root creates and records each workspace per [`../poteto-mode/references/delegation.md`](../poteto-mode/references/delegation.md) before dispatch. Isolation comes from the verified worktree or separate directory, not from a branch in the shared checkout and not from a remote box.

When a worker must start from a non-default branch, check that branch out in that worker's worktree and name the path in its brief.

Every brief stands alone. Goal, scope, slice or race arm, how to verify, what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence.

Any nontrivial code-writing pass follows [`../poteto-mode/references/delegation.md`](../poteto-mode/references/delegation.md), including its dedicated same-pin implementation profile, worker contract, checkpoint budget, and isolated writer scope. Read-only workers retain the configured panel profile and perspective count.

If a worker drops out, continue with N-1 and note it.

## Phase C: Aggregate

Read terminal results. Coverage needs every required slice. A race uses the rule declared up front. Do not paste raw dumps.

Keep a compact result table, one-line evidenced issues, and explicit gaps or dropouts.

## Phase D: Report

One in-chat report. Table, issue one-liners, gaps, and the race rule when used.

## Models

`$HOME/.config/devin/pstack-models.md` overrides this default.

- swarm workers: `pstack:panel-opus`
