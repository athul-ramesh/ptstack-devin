### Runtime forensics

**You own the diagnosis. Instrument the live process. Do not theorize from source.** For "why is X leaking / spinning / slow at runtime", heap snapshots, idle-but-busy processes, intermittent glitches. The deliverable is a cited diagnosis, not a fix.

1. Capture the live signal on the matching surface. A CPU profile for a spinning process, a heap snapshot for a leak, a trace for a visual glitch. A real artifact, not a guess.
2. Reduce the artifact to the smoking gun. The function on the hot path, the retainer chain from the leaked object to a GC root, the loop firing without input. Parse large artifacts with `run_subagent` (`skills/principle-guard-the-context-window/SKILL.md`). Keep the reduced finding in the main thread.
3. Prove the mechanism before believing it. Inject instrumentation on the running process, or hotfix the live code without reloading, to confirm the hypothesis cheaply.
4. Map the finding back to source. File, symbol, the line that allocates or schedules.
5. Throughput checkpoint stays one line. `throughput checkpoint: n/a, read-only forensics`.

**Reply:** the signal captured, the reduced finding, how you proved the mechanism, the source location, artifact paths. No fix unless asked. Hand back to Bug fix or Perf once the cause is known.
