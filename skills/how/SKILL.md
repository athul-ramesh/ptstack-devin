---
name: how
description: "Use for how code works, a walkthrough before a change, and where a piece of code should live. One read-only explanation of the subsystem. Use why for the reasons."
---

# How

Answer "how does X work?" Hand back a mental model a senior engineer can use, not a tour of every line.

If the scope is ambiguous, state your interpretation and explore. The user can redirect.

## Explain

Start one read-only `run_subagent`. Devin's `run_subagent` has no readonly flag, so forbid writes in the brief. Pick the profile from `how` in `$HOME/.config/devin/pstack-models.md`, else the Models default. Pass the user's question and this brief:

> Explain this area to a senior engineer who has not worked in it. Read the code and describe the architecture they need before they change it. Stay read-only. Do not edit, commit, or change external state. Name the main flow, where the pieces live, and the traps.

Collect the result with `read_subagent`.

## Present

Present the collected output. Light edits for conversation context are fine. Do not rewrite it.

## Models

`$HOME/.config/devin/pstack-models.md` overrides this default.

- how: `pstack:panel-swe`
