---
name: how
description: "Use for \"how does X work\", code walkthroughs before changing something, and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, onboarding mental models. Can critique architecture. Use why for motivation."
---

# How

Answer "how does X work?" Produce a senior onboarding explanation. A working mental model, not annotated source.

Two modes:

1. **Explain** (default). Explore and explain.
2. **Critique.** Explain first, then independent architectural critics.

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md). Record a `PanelRun` before the first `run_subagent` call.

## Explain mode

### Step 1. Question and complexity

Parse the ask. State your interpretation if the scope is ambiguous. Do not quiz the user.

- **Simple.** One module, a small utility, "how does function X work". Skip explorers. Go to Step 2b.
- **Complex.** Multiple files or services, a cross-cutting feature, a full overview. Explorers first. Go to Step 2a.

When in doubt, lean simple.

### Step 2a. Explore (complex only)

Split the question into 2-4 disjoint angles. Spawn one explorer per angle with `run_subagent` and the how-explorer profile.

Each explorer gets [`references/explorer-prompt.md`](references/explorer-prompt.md) plus its angle. It uses `glob`, `grep`, and `read`. It returns components, flow, files read, boundaries, non-obvious facts, and open questions.

Then Step 3.

### Step 2b. Direct explain (simple)

One `run_subagent` on the how-explainer profile. It explores and writes the explanation. Use [`references/explainer-prompt.md`](references/explainer-prompt.md) with empty explorer findings.

Then Step 4.

### Step 3. Synthesize (complex only)

One `run_subagent` on the how-explainer profile. Hand it every explorer report and [`references/explainer-prompt.md`](references/explainer-prompt.md). It reconciles overlap and contradictions by reading the code.

### Step 4. Present

Show the explainer output. Light edits for conversation context are fine. Do not rewrite it.

### Output format

Adapt. Drop empty sections.

**Overview.** 1-2 paragraphs. What it is, what it does, why it exists.

**Key Concepts.** Types, services, or abstractions needed for the rest.

**How It Works.** Trigger, steps, data, decision points. Prose. Cite files and functions. No dump unless a snippet is required.

**Where Things Live.** Files a newcomer opens first.

**Gotchas.** Surprises, history, sharp edges.

## Critique mode

User asked for architectural issues, problems, or improvements.

1. Run Explain first.
2. Spawn one critic per how-critics profile. Same filled [`references/critic-prompt.md`](references/critic-prompt.md) plus [`references/critique-rubric.md`](references/critique-rubric.md), the explanation, and file paths. Sequential when `executionMode` is sequential. Say so.
3. Lead judgment. Same buckets as `/pstack:interrogate`: Act on, Consider, Noted, Dismissed. Parent owns the verdict.

Present the explanation, then the critique. The explanation stands alone.

## Models

`$HOME/.config/devin/pstack-models.md` overrides these defaults. Values are profiles.

- how explorer: `pstack:panel-opus`
- how explainer: `pstack:panel-opus`
- how critics: `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet`
