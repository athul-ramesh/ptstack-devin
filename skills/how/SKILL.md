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

If the scope is ambiguous, state your interpretation and explore. When in doubt, lean simple.

- **Simple.** One module, utility, or narrow question. One read-only `run_subagent` on the how-explainer profile explores and explains with [`references/explainer-prompt.md`](references/explainer-prompt.md) and no explorer findings. Then Step 4.
- **Complex.** Multiple files or services, a cross-cutting feature, or a full overview. Continue with Step 2.

### Step 2. Explore (complex only)

Split the question into 2-4 disjoint angles. Spawn one read-only explorer per angle on the how-explorer profile, using [`references/explorer-prompt.md`](references/explorer-prompt.md). Each returns components, flow, files read, boundaries, non-obvious facts, and open questions.

### Step 3. Synthesize (complex only)

After every explorer returns, give one read-only how-explainer all reports and [`references/explainer-prompt.md`](references/explainer-prompt.md). It reconciles overlap and contradictions by reading the code.

### Step 4. Present

Show the explainer output. Light edits for conversation context are fine. Do not rewrite it.

### Output format

Use the sections in [`references/explainer-prompt.md`](references/explainer-prompt.md): Overview, Key Concepts, How It Works, Where Things Live, Gotchas. Drop empty sections.

## Critique mode

User asked for architectural issues, problems, or improvements.

1. Run Explain first.
2. Spawn one critic per how-critics profile. Same filled [`references/critic-prompt.md`](references/critic-prompt.md) plus [`references/critique-rubric.md`](references/critique-rubric.md), the explanation, and file paths. Sequential when `executionMode` is sequential. Say so.
3. Lead judgment. Put each finding in one bucket with its critic profile and a one-line rationale: Act on (would block a real change), Consider (real, cost unclear), Noted (valid, not actionable now), Dismissed (wrong, a nit, or missing context, with the reason). Parent owns the verdict.

Present the explanation, then the critique. The explanation stands alone.

## Models

`$HOME/.config/devin/pstack-models.md` overrides these defaults. Values are profiles.

- how explorer: `pstack:panel-sonnet`
- how explainer: `pstack:panel-opus`
- how critics: `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet`
