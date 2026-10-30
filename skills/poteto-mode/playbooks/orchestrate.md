### Orchestrate

**You run the program, never the code. Decide which agent does each piece of work, then check what each one produces.** For a standing project handed to one coordinator chat: multi-day, many stacked PRs, a fleet of subagents, few human turns. One task driven to a predicate is Autonomous run. One ambitious run that needs a bespoke workflow is figure-it-out. Work that one agent could finish inside the session's budget is not a program.

Run it with your own tools. Dispatch workers with `run_subagent` through [`../references/delegation.md`](../references/delegation.md). Keep the program's state in the store below, written with `scripts/program-state.sh` and read as plain files. Check PRs with `gh` when you need their state; Devin has no PR or CI event subscription and no scheduled wakeup. Run no polling loops and never relay messages or status between agents.

#### Topology

- **One owner per PR.** The owner is the only writer of its branch and carries the PR from build to merge. Only the owner pushes, rebases, or retargets it. Closing or retargeting a base PR orphans every PR above it, so the owner does that only on your call. You never author or edit code. Conflicted merges, chain rebases, and fixes go to owners. Mechanically landing a verified unit is bookkeeping you may do yourself when authorized.
- **A fresh worker for each independent task.** Its brief carries everything it needs, including each upstream report it depends on, pasted in full. Workers can't see their siblings. Code-writing workers use the deterministic same-pin `pstack:poteto-agent-<alias>` counterpart of the configured `pstack:panel-<alias>` profile, or an explicitly configured `pstack:poteto-agent-*` row. Panel profiles remain for investigation and review. Isolation is a root-provisioned, verified, recorded worktree or directory per writer, not a branch in one shared checkout. Devin dispatch has no per-call effort or speed knob; pick the profile for the job.
- **No sub-coordinators.** Actual agent depth is root → worker. Devin disables `run_subagent` inside subagents unless a custom profile opts into `max-nesting`, and this port ships no such profile. Tracks are logical records the root owns, not agents. Keep about ten workers in flight, and start the next one as each finishes instead of waiting on a whole batch.
- **Resume a worker only for a follow-up on the same work,** such as one that needs its worktree or its findings. Never resume one to check on it. Devin resumes run in the foreground and restart an idle agent.
- **Each PR gets a verifier that isn't its author,** on a profile whose `model:` pin differs from the owner's. Run it as a separate review pass with edits prohibited. The owner merges only on that verifier's pass at the current head. The root resolves `references/verification.md` from the installed poteto-mode source and supplies its absolute path.
- **Start with one unit.** Take it through brief, owner, verifier, and merge before you fan out, so a flaw in the brief costs one agent instead of fifty. On near-identical cheap units, the first unit is that test.

#### Store

Create `$HOME/.config/devin/pstack/<project-slug>/`, outside the repo and outside the session, and read `references/program-state.md`. Every file has exactly one writer. `objective.txt` and `units.tsv` go through `program-state.sh`; `status.md` is derived by `program-state.sh status` and never hand-edited. `preferences.md` holds the standing orders, numbered one constraint per line, pasted verbatim into every brief and every resume. `decisions.tsv` goes through `/pstack:show-me-your-work`, and `resume.md` through pause-safely.

#### Supervision

- **Each brief names the evidence that proves the work is done,** such as a command and its expected output via `exec`, a real CLI or TUI check, or an artifact. It also names the goal, the paths the worker may and may not write, its worktree, a timebox, and the actions it must not take (no force-push, no fixes outside scope). If you can't name the evidence, the unit isn't scoped yet. Never resume-chain a brief; respawn fresh with consolidated scope.
- **Read the diff or the artifact, not only the worker's summary.** Green CI is an input to a verdict, not a verdict. Behavioral work needs more than a type check. A verdict covers one head SHA, so a new push needs a new verdict. Advance `lastVerifiedHead` only on merge or a reported new head SHA.
- **Send back work that drifts from scope or grows past what was asked.** Keep only the fixes that block the program, and park the rest as follow-ups.
- **Check a PR's live state before you report on it,** with `gh pr view` and `gh pr checks`, not the worker's last report. Account for every worker you dispatched as done, replaced, or absorbed into another worker's scope, as a terminal row in `units.tsv`.
- **Stop or replace a worker that stalls or loops.** Judge it by its pushes and PR activity, not its status text. Retry by cause: a smaller scope after a context limit, the same brief after a dropped connection, and a foreground resume on the same profile after a background permission denial. An unavailable model pin stays unavailable; substituting a profile is degraded execution and must be reported. After two retries, drop the unit and replan around it. When a stopped worker returns late, check its result against the PR's current state, and hand any unique findings to a fresh worker.
- **Bound the session.** Run a bounded number of waves, then write `resume.md` and stop. The operator starts a new session. Its subagents from the old session are gone; pushed branches, open PRs, and the store are not. Re-read the standing orders and `units.tsv`, reattach work by PR and branch rather than agent id, and continue.
- **Ask the user only for a real decision or a blocker,** such as an irreversible action, a product or preference call that no experiment settles, or a dead end that survived a replan. Rebase mechanics, retries, CI flakes, review triage, and "should I keep going" never reach the user.

Do not claim cloud agents or nested dispatch.

**Reply:** what landed against the goal with the count from `units.tsv`, each PR's live state and verdict with its link, what was dropped and why, the decisions waiting on the user, and the store and trail paths.
