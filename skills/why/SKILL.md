---
name: why
description: "Use for 'why does X work this way', 'why we picked Y', design rationale, regressions, postmortems, or data-backed thresholds. Discovers available MCP servers and queries each evidence category (source control, issue tracker, long-form docs, real-time chat, infrastructure observability, error tracking, product analytics warehouse) in parallel, then returns a cited read on decisions and tradeoffs. Use how for runtime behavior."
---

# Why

Investigate motivation. Why this shape? Which constraints? Which alternatives died?

Companion to `/pstack:how`. How is mechanics. Why is force.

Historical context lives in seven categories. You cannot tell from the question which one holds the answer. Enumerate what this session can search, query every available category, then synthesize with explicit confidence. Null results are evidence. Coverage is the default.

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md). Record a `PanelRun` before the first `run_subagent` call.

## Posture

Evidence before narrative. Quote and cite. Name gaps. Hedge on purpose. Do not infer intent from code shape.

Read [`references/epistemics.md`](references/epistemics.md). The synthesizer must follow it.

## Step 1. Target and question

Name the code, pattern, feature, or decision. Restate the question. If the target is vague, guess from this conversation, state it, continue.

## Step 2. Code anchor

Inline, cheap:

- File paths and line ranges
- Key symbols
- Recent commits on the target (`exec` git blame, git log --follow, git log --oneline)
- PR numbers from merge subjects, then `gh pr view` when `gh` works

Pass this seed to every investigator.

## Step 3. Investigators

Default is the full sweep.

### Discovery

Run `devin mcp list` with `exec`. Also use MCP tools already present in this session. Map each server to one category:

1. Source control history
2. Issue / ticket tracker
3. Long-form documents
4. Real-time team chat
5. Infrastructure observability
6. Error / exception tracking
7. Product analytics warehouse

Source control is always available through git and `gh` via `exec`. Always spawn that investigator.

One investigator per available category. Do not collapse categories into one worker.

Each `run_subagent` uses the why-investigators profile. Workers must not write files, commit, or change external state. Keep MCP tools available so they can search. Do not strip tools to fake a sandbox.

Each investigator gets [`references/investigator-prompt.md`](references/investigator-prompt.md), the matching playbook from [`references/source-playbook.md`](references/source-playbook.md), the code anchor, and the question. Append [`references/sources/incident-postmortem.md`](references/sources/incident-postmortem.md) when the target looks defensive.

Skip only with a written reason in Sources Consulted:

- No MCP for that category. Gap, not a choice.
- Provably irrelevant. High bar. A build-time script with no runtime path can skip error tracking. "Probably not" cannot.

Sequential when `executionMode` is sequential. Say so.

## Step 4. Synthesize

One `run_subagent` on the why-synthesizer profile. Same no-write rule. It needs MCP tools to spot-check citations.

Give it investigator findings including nulls and skips, the code anchor, the question, [`references/epistemics.md`](references/epistemics.md), and [`references/synthesizer-prompt.md`](references/synthesizer-prompt.md).

## Step 5. Present

Light edits only. Do not rewrite confidence language.

## Output format

Keep the confidence split.

**The Question.** Restate.

**The Code in Question.** Paths, ranges, symbols.

**What We Found (direct evidence).** Cited claims.

**What We Can Reasonably Infer.** Hedged. Show the chain.

**Competing Hypotheses.** Skip when the record is clear.

**What We Don't Know.** Specific searches that returned nothing.

**Sources Consulted.** One line per category, including empty and skipped.

If this `why` precedes a change, add Preserve / Change / Avoid / Risk from the lineage.

## Models

`$HOME/.config/devin/pstack-models.md` overrides these defaults.

- why investigators: `pstack:panel-opus`
- why synthesizer: `pstack:panel-opus`
