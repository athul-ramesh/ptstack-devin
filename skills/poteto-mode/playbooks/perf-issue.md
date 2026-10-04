### Perf issue

**You own the measurement story. Plan, review, verify the numbers.** Tie every fix to a measurement. Do not read source instead of measuring.

1. Capture a baseline on the matching surface. Drive CLIs and TUIs with `exec`. Drive a web UI only with the browser mechanism Devin actually exposes.
2. Ground hypotheses by reading the hot path. Do not claim a perf ceiling without running it first.
   Read `skills/benchmark-checklist/SKILL.md` from the installed plugin root and apply it to the baseline and every subsequent performance claim. Its user-only trigger means the model skill tool cannot invoke it; workflow-directed reading supplies the procedure. Consider strategies in this order, grounded in the measured limiter. Stop when an earlier strategy meets the target.
   1. Avoid work. Delete unnecessary computation.
   2. Avoid repeating it. Reuse results with explicit invalidation.
   3. Do less. Reduce inputs, batch overhead, or narrow the operation.
   4. Defer it. Compute only when needed.
   5. Move it off the interactive path. Schedule work where nobody waits.
   6. Run concurrently. Parallelize independent work within resource limits.
   7. Make it cheaper. Optimize the remaining operation.

3. Plan the fix from the trace. If it crosses a module boundary, sketch types first. Delegate implementation through [`../references/delegation.md`](../references/delegation.md) with the exact role key `perf-issue`. Review the diff. Capture a post-fix measurement.
   Apply `skills/principle-sequence-verifiable-units/SKILL.md`. Verify each attempt before trying the next.
4. Parse and compare the artifacts. "Inconclusive" or wrong-surface is not a pass. Flag it.
5. Cite the measurement in the reply.
6. Stop at merge-ready. Do not open a PR unless the user asks.

**Reply:** baseline number, post-fix number, delta, artifact path.
