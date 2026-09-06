### Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.** For "going to bed", "run until done", or "keep going until X".

Devin cannot schedule a later turn. There is no wake watcher. Bound the iteration count in this session. Then write `resume.md` and stop. The operator starts a new session to continue.

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero). A vague goal stalls. A predicate lets you stop.
2. Persist `ProgramState` at `<cwd>/.pstack/<slug>/` per `references/program-state.md`. Init the store. Each iteration is a unit. Do not invent a timer or a sleep loop.
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if it advanced, discards changes that didn't help. Belt-and-suspenders that "might help" gets reverted, not left to ride.
   Sequence the work via `skills/principle-sequence-verifiable-units/SKILL.md`, verifying each unit before the next instead of batching checks at the end.
4. Mid-run discoveries are yours. Address broken skills, related bugs, flaky verifiers, review noise, tooling failures, orphaned follow-ups, and fixable drift yourself via poteto-mode. Put out-of-band fixes in their own PR. Do not park reversible work for the human. Surface only irreversible actions, genuine product or preference calls no experiment can settle, or a real dead end. Keep the predicate as the main drive, and return to it after each side fix.
5. Checkpoint every iteration via `/pstack:show-me-your-work`, a row for what changed and whether the predicate moved. A run with no trail can't be audited or resumed.
6. Stop when the predicate is met, or when the bound is hit with units still pending. A plateau is not a stop, so keep going and pivot your approach to push past it until the bound. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state, `storePath`.
