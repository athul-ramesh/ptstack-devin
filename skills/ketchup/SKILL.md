---
name: ketchup
description: "Catch the user up on what changed in this chat since their last message, in a short reply with available visuals. Give each action item just enough context to make the call. Use for /pstack:ketchup."
triggers:
  - user
---

# Ketchup

Catch the user up on what changed in this chat since the last message they wrote before `/pstack:ketchup`. Notifications and subagent results are not their messages. Write in the plain voice of [`/pstack:bro`](../bro/SKILL.md), and skip its restating step. Assume the user remembers their last message and nothing after it. Call each PR, branch, or agent by a name they would know.

## Gather what changed

Keep this turn read-only, except for local reply visuals made from facts and artifacts you already have. Do not change repository code or data, start an app or a job, or post anything to make them. Collect your own work since that message, subagent reports, and other messages in this chat. Check the current state of each PR, CI run, or agent this chat touched. Say which are still running and which you could not check. Check each number against its source and disclose corrections.

An action item is a decision or step only the user can take. Include any still waiting on the user, even one raised before their last message. Work you can do yourself is not an action item.

## Write the reply

Keep the text under 250 words. Markdown tables, diagram source, and text fallbacks count as text. Rendered pictures do not. A visual replaces the facts it shows. Do not repeat them in text. Leave out work that changed nothing for the user.

Open with the number of action items, or say there are none. If nothing changed and nothing waits on the user, say so and stop.

Show each PR, run, or agent this chat touched with its state. Use done, running, failed, or not checked. Use one visual when rendering is available. Then give at most three one-line results that change what the user knows or must do. Keep a result's key number in its line unless the visual shows it. Name remaining agent work in one line.

Give each action item three lines. State the decision, your recommendation and why, and what happens without an answer. Write "unknown" for a part you do not know. Link to existing detail. Show the current state beside each option with its cost in a visual when possible. Skip that visual for access requests.

## Visuals

Use existing screenshots or video for visible changes. Mark a visible change with no capture "No screenshot yet." Never draw or generate a screen you did not capture, invent numbers, or link an artifact that does not exist.

For other changes, use a diagram or chart only when the current Devin host exposes a rendering tool or adapter. Mermaid is suitable for states and flows when the host renders it. This plugin provides no chart or image tool and no visual rendering guarantee in the CLI. A Markdown table is text, not a picture.

When rendering is unavailable, say so briefly and give the same states, options, costs, and unknowns in compact text within the word limit. Do not invoke an unshipped skill, install a tool, or start a service to satisfy the visual preference.
