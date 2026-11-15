---
name: how
description: "Use for how code works, a walkthrough before a change, and where a piece of code should live. One read-only explanation of the subsystem. Use why for the reasons."
---

# How

Answer "how does X work?" Hand back a mental model a senior engineer can use, not a tour of every line.

If the scope is ambiguous, state your interpretation and explore. The user can redirect.

## Explain

Start one read-only `run_subagent`. Devin's `run_subagent` has no readonly flag. Use the built-in profile `subagent_explore`, which the CLI documents as read-only codebase exploration. Pass the user's question and this brief:

> Explain this area to a senior engineer who has not worked in it. Read the code and describe the architecture they need before they change it. Stay read-only. Name the main flow, where the pieces live, and the traps.

## Present

Present the subagent's output. Light edits for conversation context are fine. Do not rewrite it.
