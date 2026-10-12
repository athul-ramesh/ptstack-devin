---
name: why
description: "Use for 'why does X work this way', 'why we picked Y', design rationale, regressions, or postmortems. Searches source control history (git log and blame, PRs and linked issues via `gh`, code comments, in-repo docs) and returns a cited, confidence-weighted read on decisions and tradeoffs. Use how for runtime behavior."
---

# Why

Investigate motivation, constraints, and rejected alternatives. Use `/pstack:how` for mechanics.

The source registry currently covers source control: commits, PRs, linked issues, review threads, code comments, and in-repo docs. Name gaps in coverage when they matter. Query thoroughly, then synthesize with explicit confidence. Null results are evidence. Coverage is the default.

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md). Record a `PanelRun` before the first `run_subagent` call.

Read [`references/epistemics.md`](references/epistemics.md). Investigators gather evidence; the synthesizer follows its confidence tiers.

## Step 1. Target and question

Name the code, pattern, feature, or decision. Restate the question. If the target is vague, guess from this conversation, state it, continue.

## Step 2. Code anchor

Inline, cheap:

- File paths and line ranges
- Key symbols
- Recent commits on the target (`exec` git blame, git log --follow, git log --oneline)
- PR numbers from merge subjects, then `gh pr view` when `gh` works

Pass this seed to each investigator.

## Step 3. Investigators

Default is the full sweep of source control history.

Read the registry in [`references/source-playbook.md`](references/source-playbook.md). Search each registered category whose tools are available. Source control is the sole registered category today. Check git access and `gh` availability/authentication separately; search local history even if PR access fails and record the partial coverage and reason.

For each available category, resolve the exact `why investigators` role through the panel contract and dispatch its configured perspectives. With the default profile list and registry, this is one worker. Follow `executionMode` for independent workers. Workers must not write files, commit, or change external state.

Each investigator gets [`references/investigator-prompt.md`](references/investigator-prompt.md) with its source name and registered playbook filled in, the code anchor, and the question. Append [`references/sources/incident-postmortem.md`](references/sources/incident-postmortem.md) for defensive code investigated through source control.

Collect findings, empty searches, availability failures, and additional leads. Route a cross-source lead to the worker for its registered, available category; record unchased leads with the reason (unregistered, unavailable, or outside the requested scope).

## Step 4. Synthesize

Resolve the `why synthesizer` role through the panel contract. Same no-write rule. Give it the available read tools for the registered sources to spot-check citations.

Give it all investigator findings, source availability and reasons, and unchased leads, the code anchor, the question, [`references/epistemics.md`](references/epistemics.md), and [`references/synthesizer-prompt.md`](references/synthesizer-prompt.md).

## Step 5. Present

Light edits only. Do not rewrite confidence language.

## Output format

Use [`references/synthesizer-prompt.md`](references/synthesizer-prompt.md): The Question, The Code in Question, What We Found, What We Can Reasonably Infer, Competing Hypotheses, What We Don't Know, Sources Consulted, Confidence Summary. Keep the confidence split. Sources Consulted names each registered category, searches, unavailable portions and reasons, and unchased leads.

If this `why` precedes a change, add Preserve / Change / Avoid / Risk from the lineage.

## Models

`$HOME/.config/devin/pstack-models.md` overrides these defaults.

- why investigators: `pstack:panel-sonnet`
- why synthesizer: `pstack:panel-opus`
