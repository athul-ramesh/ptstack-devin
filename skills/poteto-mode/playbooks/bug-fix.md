### Bug fix

**You own reproduction and diagnosis. Plan, review, verify.** Delegate implementation. Use read-only investigation passes when they help resolve a bounded question.

Be scientific. Every shipped line traces to runtime evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix. It does not ship. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships, nothing more.

1. Reproduce it yourself on the matching surface. Drive CLIs and TUIs with `exec`. Drive a web UI only with the browser mechanism Devin actually exposes. Do not hand the repro to the user. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. A bug you cannot reproduce, you cannot prove fixed.
2. Binary-search the cause. Form candidate hypotheses, then rule them out until one survives. Seed them by reading the affected subsystem and its git history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Confirm the surviving mechanism with runtime evidence before planning the fix.
3. Plan the fix. If it crosses a module boundary, sketch types and signatures first and record `architect skipped: <reason>` when the change is local. Delegate implementation through [`../references/delegation.md`](../references/delegation.md) with the exact role key `bug-fix`. Review the diff.
4. Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing repro lands before the fix in git history. The diff tells the story. Write a failing local test first when the bug has a cheap local test path. Skip that cadence when the test would be expensive, integration-heavy, or unclear.
6. Stop at merge-ready. Do not open a PR unless the user asks.

**Reply:** what was broken, root cause, fix, how you verified. Quote the decisive failing and passing output, trimmed to the assertion and the counts.
