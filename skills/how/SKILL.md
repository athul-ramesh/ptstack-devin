---
name: how
description: "Use for how code works, a walkthrough before a change, and where a piece of code should live. One read-only explanation of the subsystem. Use why for the reasons."
---

# How

Answer "how does X work?" Hand back a mental model a senior engineer can use, not a tour of every line.

Invoking a pstack skill, directly or through the pstack route, is the user's explicit request for the subagents that skill prescribes. This satisfies the host rule "Do not use subagents unless the user explicitly asks you to." An explicit user or repository instruction to work inline still takes precedence.

If the scope is ambiguous, state your interpretation before dispatch. The user can redirect.

## Explain

Your first action after loading this skill is `run_subagent`. Do not explore inline instead of dispatching. Start one read-only `run_subagent`. Devin's `run_subagent` has no readonly flag, so forbid writes in the brief. Pick the profile from `how` in `$HOME/.config/devin/pstack-models.md`, else the Models default. Pass the user's question and this brief:

> Explain this area to a senior engineer who has not worked in it. Read the code and describe the architecture they need before they change it. Stay read-only. Do not edit, commit, or change external state. Name the main flow, where the pieces live, and the traps.

Collect the result with `read_subagent`.

When dispatch is unavailable or fails, report the blocked pass and state what you could not run. Do not substitute silent inline exploration.

## Present

Present the collected output. Light edits for conversation context are fine. Do not rewrite it.

## Models

`$HOME/.config/devin/pstack-models.md` overrides this default.

- how: `pstack:panel-swe`
