### Perf issue

**You own the measurement story. Plan, review, verify the numbers.** Tie every fix to a measurement. Do not read source instead of measuring.

1. Capture a baseline on the matching surface. Drive CLIs and TUIs with `exec`. Drive a web UI only with the browser mechanism Devin actually exposes.
2. Ground hypotheses by reading the hot path. Do not claim a perf ceiling without running it first.
   Most fixes come from eight strategy families. Use them as hypothesis generators, not a checklist. A family earns an attempt only when the trace shows the signal it names, and a focused fix for the dominant cost beats applying all eight.
   - **Elimination.** The cheapest work is work that does not run. The trace shows what is slow, never that it is deletable, so this family needs a read of the subsystem, not only the profiler.
   - **Divide and conquer.** The dominant cost scales with input size. Split the work so each piece touches less, or so independent pieces run in parallel.
   - **Caching.** The same computation or fetch repeats on identical inputs. Store and reuse the result. Name what invalidates it before claiming the win.
   - **Indirection.** The hot path does expensive work a cheaper intermediate could absorb. Add the hop only when it removes more from the critical path than it adds.
   - **Batching.** Many small operations each pay a fixed overhead. Coalesce them to pay the overhead once per batch.
   - **Redundancy.** The wait hangs on one slow instance. Duplicate the work and take the fastest result only when the wait dominates and the system has headroom.
   - **Lazy evaluation.** Cost lands on results that are never used or not needed yet. Defer the work until first use.
   - **Scheduling.** The work must happen, but not during the interactive moment. Move it to where nobody is waiting.
3. Plan the fix from the trace. If it crosses a module boundary, sketch types first. Delegate implementation through [`../references/delegation.md`](../references/delegation.md) with the exact role key `perf-issue`. Review the diff. Capture a post-fix measurement.
   Apply `skills/principle-sequence-verifiable-units/SKILL.md`. Verify each attempt before trying the next.
4. Parse and compare the artifacts. "Inconclusive" or wrong-surface is not a pass. Flag it.
5. Cite the measurement in the reply.
6. Stop at merge-ready. Do not open a PR unless the user asks.

**Reply:** baseline number, post-fix number, delta, artifact path.
