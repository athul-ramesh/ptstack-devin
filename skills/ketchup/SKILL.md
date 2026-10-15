---
name: ketchup
description: "Catch the user up on what changed in this chat since their last message, in a few plain sentences and small available visuals. Give each action item just enough context to make the call. Use for /pstack:ketchup."
triggers:
  - user
---

# Ketchup

Catch the user up on what changed in this chat since the last message they wrote before `/pstack:ketchup`. Notifications and subagent results are not their messages. Assume the user remembers their last message and nothing after it.

Use [`/pstack:bro`](../bro/SKILL.md)'s voice, not its task: plain words, short sentences, no jargon, like one person catching up another. Say what changed for the user, not how you did it. Say "the tests pass", not "CI is green". Leave out hashes, file paths, commands, build numbers, and test counts unless the user needs one to act. Call each PR, branch, or agent by a name the user would know, not by a label you invented. If a fact needs context to make sense, give the context or leave the fact out.

## Gather what changed

Keep this turn read-only. Make visuals only from facts and artifacts you already have. Do not change repository code or data, start an app or a job, or post anything to make them. Collect your own work since that message, subagent reports, and other messages in this chat. Check the current state of each PR, CI run, or agent this chat touched. Say which you could not check. Check each number against its source and say so when you correct one.

An action item is a decision or step only the user can take, such as a product choice, an approval, an irreversible action, or access you lack. Include any still waiting on the user, even one raised before their last message. Work you can still do yourself is not an action item. Never make up a call to fill the reply. A step the user did not ask for and the work does not need is not an action item, unless it is irreversible and waiting on the user. Give it one action line, no visual, and skip what happens without an answer.

## Write the reply

Keep the whole reply well under 150 words, counting words inside visuals, diagram source, tables, and text fallbacks. Never give a fact in both the text and a visual. Leave out work that changed nothing for the user. When words run short, cut from what happened before you cut from the action items.

Open with one sentence that says how many things need the user, or that nothing does. If nothing happened and nothing waits on the user, say so and stop.

Then show what happened in one visual of at most four boxes. Give each thing the user asked for a box that says what came of it and whether it is done, still running, failed, or not checked. Write each box the way you would say it out loud: "Search was slow from a missing index", not "Search review: done". Name any bug found and fixed on the way. Each box must stay true when read alone. Never mark something done that still waits on the user. Under the visual, give at most three short lines that change what the user knows or must do. Then name in one line any work left that you can do yourself.

Then give each action item two lines, or one for an unasked irreversible step: the decision with your recommendation and why, then what happens if the user does not answer. Ask the call the user owns, such as merge, approve, or pick. A step you would take first goes in your recommendation. So does anything that must happen first, and anything that cannot be undone. Write "unknown" for a part you do not know. Link to existing detail.

Show each action item as a before and after, side by side, in a visual when rendering is available. For a choice, put the current state beside each option, or the options alone when there is no current state. Put every option the work weighed in the visual, each with what it gets the user and what it costs. Skip the visual for access requests and unasked irreversible steps.

## Visuals

Keep each visual readable at a glance: at most six boxes, with at most eight words in each, not counting "No screenshot yet." Write labels as plain words a person would say, not tags like "Tests: pass". Group small items into one box. A fact that needs a sentence belongs in the text, or nowhere. A Markdown table is text, not a picture.

Use existing screenshots or video for visible changes. If a visible change has no capture, mark its box "No screenshot yet," and say in a line under the visual what changed on screen. Never draw or generate a screen you did not capture, invent numbers, or link an artifact that does not exist.

For other changes, use a diagram only when the current Devin host renders one. Mermaid suits states and flows when the host renders it. This plugin provides no chart or image tool and no visual rendering guarantee in the CLI.

When rendering is unavailable, say so in a few words and give the same states, options, costs, and unknowns as compact plain lines within the word limit, keeping the same box limits. Do not invoke an unshipped skill, install a tool, or start a service to satisfy the visual preference.
