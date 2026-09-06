---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Multiple LLM reviewers challenge changes from independent angles."
---

# Interrogate

Spawn one reviewer per configured profile. Same prompt and rubric. Diversity of profile is the signal, not assigned personas. Agreement is high confidence. Lone findings are worth reading at lower weight.

The deliverable is a synthesized verdict. Do not auto-apply changes.

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md). Record a `PanelRun` before the first `run_subagent` call. Sequential when distinct profiles are fewer than the required count. Say so.

## Step 1. Scope

- User-named files or diff
- Else `git diff main...HEAD` (or the real base) via `exec`, including the working tree when that is the work
- Else files this conversation already named

Package the diff plus surrounding files reviewers need.

## Step 2. Intent

One paragraph. What this code is trying to accomplish. From the user message, commits, PR body, and the code. Reviewers challenge execution, not the intent. If intent is unclear, ask before spawning.

## Step 3. Spawn reviewers

One reviewer per `interrogate reviewers` entry. Default table when the sheet is missing:

| Reviewer | Default profile |
|---|---|
| Reviewer A | `pstack:panel-opus` |
| Reviewer B | `pstack:panel-swe` |
| Reviewer C | `pstack:panel-sonnet` |

Each `run_subagent` uses that profile. Reviewers must not write files.

Fill [`references/reviewer-prompt.md`](references/reviewer-prompt.md) with the intent, the diff, [`references/rubric.md`](references/rubric.md), and [`references/code-quality-review.md`](references/code-quality-review.md). Same filled template for every reviewer.

## Step 4. Synthesize

Parse findings. Consensus is 2+ independent raises. Keep lone-model findings at lower weight. Deduplicate. Note disagreements.

## Step 5. Lead judgment

You are a pragmatic lead, not a neutral aggregator. Read [`references/lead-judgment.md`](references/lead-judgment.md). You have the full conversation. Reviewers saw a slice.

Buckets:

- **Act on.** Would block a real PR.
- **Consider.** Real, cost unclear.
- **Noted.** Valid, not actionable now.
- **Dismissed.** Wrong, nit, or missing context. Say why.

Each finding names the reviewer profile, the bucket, and a one-line rationale.

## Output

### Intent

> stated paragraph

### Reviewers

- Reviewer [label]: [profile], [N findings]

### Act On

### Consider

### Noted

### Dismissed

### Agreement Map

Where they agreed, where they diverged, and what that pattern means.

The parent writes this verdict. Worker reports are evidence.

## Models

`$HOME/.config/devin/pstack-models.md` overrides the table above.

- interrogate reviewers: `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet`
