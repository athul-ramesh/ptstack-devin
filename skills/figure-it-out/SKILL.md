---
name: figure-it-out
description: "Design an auditable playbook when no narrower one fits: a large migration, an ambitious multi-part change, or work a human reviews after stepping away. Scales rigor to the task, runs a hypothesis loop, and logs decisions via show-me-your-work. Use for /figure-it-out, 'figure it out', a large migration, or when no narrower playbook applies."
---

# Figure it out

When the task matches no playbook, design one. The deliverable before any code is the workflow itself. A sequence of phases that scales rigor to the task, runs the scientific method, and leaves a decision trail a human can audit after stepping away. Bias toward more rigor. The cost of building the wrong thing dwarfs the cost of being careful.

Don't reinvent a playbook you already have. A focused single-unit task that matches Bug fix, Perf, Feature, Visual parity, Eval, or Multi-phase plan routes there. A large or cross-cutting version of one, or work the user reviews after stepping away, belongs here even when a single-unit version would be a Feature. The rigor and the audit trail are the point.

Read [`../poteto-mode/references/program-state.md`](../poteto-mode/references/program-state.md). Persist `ProgramState` before the first unit. Resume from that store. Do not keep the plan only in the todolist.

## Start

Open a todolist whose first item is to read the Principles section of `skills/poteto-mode/SKILL.md`. Then add the phases below as todos.

## Phase A: Frame

Ground first, then commit. Don't start the run until you can state:

- The definition of done as a falsifiable predicate (`skills/principle-prove-it-works/SKILL.md`). "Done well" has to be checkable.
- Scope, quantified. Rough units and effort, plus the blockers grounding surfaced. Raise them before spending hours, not after fifty doomed commits.
- The rigor level, biased high. One-way doors and high blast radius get more. Reversible low-stakes steps get less. Rigor is gates and artifacts, not "try harder".

Present the framing and tradeoffs before committing to a long run. Reversible work proceeds (`skills/principle-never-block-on-the-human/SKILL.md`), but a multi-hour run earns one checkpoint.

Pick a `slug`. Default store is `<cwd>/.pstack/<slug>/`.

```
exec skills/poteto-mode/scripts/program-state.sh init <storePath> <objective>
```

## Phase B: Design the workflow

Decompose into atomic, independently-landable units. Sequence riskiest-unknown-first so option value stays high. Scaffold and verification come before features (`skills/principle-foundational-thinking/SKILL.md`).

- Build the verification harness before the work, with the baseline captured from the pre-change state, so the check reads as old value vs new value.
- For one-way-door design decisions, run `/pstack:architect`. Skip it for mechanical work whose shape is already concrete. A second arena over a settled design is over-engineering (`skills/principle-laziness-protocol/SKILL.md`).
- Decide what fans out. Parallelize only across genuine seams, and give each writer its own root-provisioned, recorded worktree or directory per [`../poteto-mode/references/delegation.md`](../poteto-mode/references/delegation.md) (`skills/principle-separate-before-serializing-shared-state/SKILL.md`). Don't over-fan. Use `run_subagent` with a registered profile. Sequential scheduling does not repair an unavailable model pin; report the blocked mapping instead of silently substituting.
- Every nontrivial code-writing unit follows the root-owned procedure in `../poteto-mode/references/delegation.md`, including dedicated same-pin implementation routing, the complete worker contract, bounded checkpoint and recovery fields, and isolated writer scope. Read-only exploration keeps its configured panel profile.
- Write the designed phase list down. That list is what the human reviews.

Register each unit before running it.

```
exec skills/poteto-mode/scripts/program-state.sh set <storePath> <id> <owner> pending <deps> <evidence> <head>
```

Then put the design into motion. Add its steps to the todolist as concrete items, after the Phase C entry and before Phase D. Run each under the Phase C loop discipline, and weave the Phase D log through them, a row as each step lands, rather than saving the whole trail for the end.

## Phase C: Run the loop

Each unit is an experiment. State the hypothesis, make the smallest change, measure against the predicate on the real artifact, keep it if it advanced, revert it if it didn't.
Apply `skills/principle-sequence-verifiable-units/SKILL.md`. Verify each unit before starting the next instead of batching checks at the end.

- Verify by inspecting the artifact, never a self-report. When something passes too easily, suspect the observation method before the system. A blank screenshot passes a lazy gate.
- Pair delegated work with a judge and audit the delegates' artifacts yourself before trusting them. If a worker games the gate, reset and harden the contract. If the gate itself is wrong, fix the gate in its own change rather than routing around it.
- A verdict is VERIFIED, NOT VERIFIED, or INCONCLUSIVE. Inconclusive is not a pass. Don't hide a negative.
- After the verdict, `set` the unit to `verified`, `not-verified`, or `inconclusive`. Then log the row.

On resume, run `status`, skip `verified` and `abandoned`, and continue the first `in-progress` or `pending` unit. Do not redo a verified unit.

This plugin has no agent-callable scheduled wakeup. Bound the unit count in this session. If units remain, write `resume.md` and stop.

## Phase D: Keep the audit trail

Log the run via `/pstack:show-me-your-work`, one canonical TSV with a row per decision and per unit, evidence as links. figure-it-out's work is usually ambitious enough to commit the trail so the reviewer can read it in the PR. Commit it when confidence has to be shown. Prefer evidence produced by committed scripts so a reviewer can re-run it. The trail plus the diff is what lets the human come back and trust the work.

## Phase E: Verify and hand back

Check the whole against the Phase A predicate on the real product, not just the harness. Encode any recurring correction as a gate, a lint rule, a check, or a script, so the win can't silently regress (`skills/principle-encode-lessons-in-structure/SKILL.md`).

**Reply:** the playbook you designed, the rigor level and why, the `storePath`, the decision-trail path, what's verified against the predicate, and what's still open.
