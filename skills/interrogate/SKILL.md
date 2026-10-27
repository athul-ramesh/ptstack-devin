---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Adversaries try to break a change or design, and only findings proven by a run survive."
---

# Interrogate

Adversaries try to break a change or a design. A finding survives only when a run proves it. Report the findings. Do not apply fixes.

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md). Record a `PanelRun` before the first `run_subagent` call. Sequential when distinct profiles are fewer than the required count. Say so.

## Frame

The scope is what the user names. Otherwise it is the branch diff from its merge base with the base branch, through the working tree, read with `git` via `exec`. State the intent with `/pstack:in-your-own-words`, from the user's message, the commits, and the PR description. Ask the user when the intent is unclear.

## Fan out

Run Phase A steps 3 and 4 and Phase B of `/pstack:arena`, with these changes:

- Read the `interrogate reviewers` row in place of `arena runners`.
- Copy the scope's uncommitted changes into each adversary's worktree, so each runs against the code under review.
- Dispatch each adversary on its configured `pstack:panel-*` profile. Its brief allows writes only inside its own assigned worktree, for repro scripts and tests. It never edits the user's checkout.
- In place of the arena task and rationale, give each adversary the scope, the intent, its worktree path, and this brief:

> Break this change. Prove each finding with a run against the real code, such as a failing test, a repro script, or command output that shows the wrong behavior. For a design or plan, run a prototype or probe the current tree. Keep repros in your own worktree. Report each finding with a title, the exact command, the output it printed, and the output the intent requires. Leave out anything you did not run. That covers style, naming, structure, and risks that need a future change to matter. No findings is a valid result.

Adversaries need `exec`. A background worker gets only tools already approved in this session, so dispatch in the foreground when command approval is not already granted, per panel-run.

## Verify

Verify each finding per arena Phase F by rerunning its command yourself. Keep a finding when the output shows the failure and the failure breaks the intent. Drop the rest. Merge findings that share a root cause.

Skip arena Phases C, D, and E. Adversaries find different failures, so the verdict keeps every verified finding, not one adversary's list. The parent writes the verdict. Worker reports are evidence.

## Output

- **Intent**: the restatement.
- **Findings**: for each verified finding, the command, its output, how it breaks the intent, and the adversary profiles that found it. Say "no verified findings" when none survive.
- **Dropped**: for each adversary, the count of dropped findings and why.

## Models

`$HOME/.config/devin/pstack-models.md` overrides these defaults.

- interrogate reviewers: `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet`
