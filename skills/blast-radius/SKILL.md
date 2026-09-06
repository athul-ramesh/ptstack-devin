---
name: blast-radius
description: "Find what a change could break somewhere else before it ships, beyond the diff, and prove the one fact it's safe because of by running real code instead of writing it up. Use for 'blast radius of X', 'what could this break', or reviewing a small diff you don't trust."
---

# Blast radius

Find what a change breaks somewhere else, before it ships. Use for "blast radius of X", "what could this break", or reviewing a small diff you don't trust yet.

Companion to `/pstack:how` and `/pstack:why`. How tells you what the code does. Why tells you why it's shaped that way. Blast radius tells you what it breaks somewhere else.

Listing the callers is not the job. `grep` finds those in a second. The job is the breakage grep will not show you.

There is no Devin `run` or `verify` skill. Prove facts with `exec` on a script or test that calls the real code.

## Don't trust your own writeup

A blast-radius writeup that sounds right is worthless. It reads as convincing whether or not it's true. Do not hand back the writeup as the product. Find the one or two facts the whole thing depends on and prove them by running code. Words are where you start, not what you ship.

### How sure are you

For each fact the change's safety depends on, get it as far down this list as is cheap, and say where it stopped.

1. You said so. Worthless on its own.
2. You pointed at the line. A real `file:line`, or the library's own source.
3. You showed the bad case can't happen. You walked the failure step by step and it doesn't reach.
4. You ran it. A script or test via `exec` that calls the real code and fails loud if you're wrong.
5. You reproduced it in the running app.

Any safety fact you can't get to step 4, say so out loud. Don't write it up as settled. Step 4 is usually one small script that imports the same library the app ships and calls the exact function you're worried about.

## Steps

1. Read the change. The diff, the symbols it adds, changes, and deletes, and what it now does differently, including the part the diff doesn't spell out. Invoke `/pstack:why` when you need PR and commit evidence.
2. Find the one fact it's safe because of. Most changes that look scary are safe because of a single fact, like "this call only drops already-dead cache entries and does nothing else". Find that fact. If it holds, most of the scary cases die at once. Spend your time here, not on a long list of maybes.
3. Look where grep stops. Read the source of the library you call, and check its pinned version and any local patch. Work out when things run: microtasks, unmount and teardown, Solid versus React. Follow what a symbol search misses: the JSON an API returns, a DB column, a wire format, another language reading the same bytes, a feature flag, code three hops downstream.
4. Be honest about each risk. Give it a real chance of happening and a real cost if it does. Keep the risks you confirmed. List the ones you checked and cleared separately. Same citation rules as `/pstack:why`. Cite a real `file:line`. A search that finds nothing is still an answer. Never make up a caller or an API.
5. Prove the one fact. Write a script or test that runs the real code. `exec` it. Paste what happened. If you can't prove it cheaply, mark it unproven. Don't round up.
6. For a big or wide change, invoke `/pstack:arena`. Ask several profiles the same question and merge the answers. Sequential when distinct profiles are fewer than needed. Say so.

## What to hand back

- **What it does.** What changed, including the part that isn't obvious.
- **The one fact it's safe because of.** State it, say which step you got it to, and show the proof. If you couldn't prove it, write unproven.
- **Risks.** Only the real ones. Each names how it breaks, the `file:line`, how likely and how bad, and how to check. Paste the proof for the ones that matter.
- **Cleared.** What you checked and why it's fine.
- **Before you merge.** The cheapest test or repro that catches the real bug, including the script you wrote.

Invoke `/pstack:unslop` on the writeup. Cite real code. Strip anything private before it goes anywhere public.

**Reply:** the writeup above, with the one safety fact either proven or marked unproven.
