---
name: teach
description: "Explain a body of work plainly so a person actually understands it. Runs the how and why skills and weaves what they find into one clear explanation. Use for 'teach me this', 'help me really understand X', 'explain this change or subsystem to me'."
---

# Teach

Explain what a thing is, how it works, and why it is built that way, at the person's pace. They should understand it. Do not change the code.

Teach sits on `/pstack:how` and `/pstack:why`. Orient yourself with `read`, then invoke those skills. Do not redo their investigation by hand. Blend the results into one plain account. Keep why's hedges. Those hedges are findings.

1. Decide the few things they should walk away knowing. Read that from why they asked and what they already know in this conversation. Do not quiz them. Skip what they already know.

2. Invoke `/pstack:how` for mechanics and `/pstack:why` for motivation. Issue both before waiting when the host runs them together. Sequential is fine. Say so. Match size to the question. Both for a subsystem. One may be enough for a small change. Keep why narrow by default. Put the narrowing in the ask so why records skipped categories. Widen only when the reasons are the point.

3. Start with a plain definition. Name the thing. Say what it is. Then tie it to this repo. Then how it works, then why, then edges. Explain the mechanism. Do not list functions like a changelog. Do not print framing labels such as "the key insight", "at its core", or "TL;DR".

4. Conversation, not lecture. Offer to go deeper or move on. No quizzes. No "Pause". No "say it back". When you would pause, stop. In one-shot, deliver cleanly and offer a deeper pass at the end.

5. Show, don't only tell. Open the diff or the code when that lands faster. Draw when a picture beats words. For three or more moving parts, draw a short series. Each diagram redraws the last and adds one part. A single all-at-once diagram is reference, not teaching.

Write in plain spoken English. Tight, not terse. One idea per sentence. No long dash. Prefer periods. Cut filler. This density is the bar: "Virtualization runs in two parts, one for rendering and one for loading from disk. When an item scrolls out past the buffer, both its DOM node and its in-memory data are evicted."

**Reply:** the explanation itself. Never a report about the work. Lead with the main point, then what it is, how it works, and why. Name threads worth chasing with `/pstack:how` or `/pstack:why`.
