### Orchestrate

**You own the program, never the code. Author briefs, drain the queue, keep the frontier green, decide.** For a whole project handed to one standing coordinator chat. Multi-day, many stacked PRs, a fleet of subagents, the human checking in twice a day instead of every five minutes. One task driven to a predicate is Autonomous run. One ambitious run needing a bespoke workflow is figure-it-out. Route here when the work outlives any single agent. Work one agent could finish inside the session's budget is not a program.

Three rules carry the rest.

- Completions are queue events, not interrupts.
- Every spawn and every resume carries the standing orders verbatim.
- The brief is the product. A vague brief fails quietly, because a worker cannot ask you a question.

Open a todolist with the steps below copied in verbatim. A step you skip stays listed with `skip: <reason>`.

#### Roles and placement

- **Coordinator (this chat).** Frames, authors briefs, drains the inbox, owns the human report, makes judgment calls. It never authors or edits code. Conflicted merges, restacks, and code changes are always tasks. Mechanically landing a verified unit (fast-forward or clean cherry-pick of a worker's commit, then push) is bookkeeping the coordinator may do itself on repos where local git is cheap.
- **Sub-coordinator.** Durable, one per track, and only when the program exceeds what one coordinator's drains can manage. Owns its track's units and boards, authors its workers' briefs, spawns its own workers where the runtime lets a subagent spawn one. Where it does not, it owns its track's units directly with the same review separation. Cap in-flight children at what one drain can process, roughly ten.
- **Worker / verifier.** `run_subagent` with a registered profile. Isolation is a worktree or branch per writer, not a separate machine. Proof uses `exec` on the real CLI or TUI, and the browser only when this session has one. Read `references/verification.md`. A subagent never sees this chat, so its brief inlines what it needs or points at repo and store paths. Prefer fewer, broader workers. One writer per worktree or branch (`skills/principle-separate-before-serializing-shared-state/SKILL.md`). Run a unit's verifier on a different panel profile from its worker. Sequential when pins fail.

Depth stays at coordinator, track, worker. Do not nest past the profile `max-nesting`.

#### Store layout

Create `$HOME/.config/devin/pstack/<project-slug>/`, outside the repo and outside the session. The store has to outlive this chat. Read `references/program-state.md`. Every file has exactly one writer.

- `objective.txt` and `units.tsv` via `scripts/program-state.sh`.
- `preferences.md` is the standing-orders register. Numbered lines, one constraint each. Paste it verbatim into every spawn and every resume.
- `decisions.tsv` via `/pstack:show-me-your-work`.
- `resume.md` via pause-safely.
- `status.md` derived by `program-state.sh status`. Never hand-edit.

Do not use a bun orch CLI. The TSV and text files are the interface. `exec` the helper. Read the files.

#### The brief

```
GOAL         one sentence, the outcome, executable by a stranger with no chat access
SCOPE        paths this unit may write; paths it may not; its exclusive worktree or branch
CONTEXT      pointers to files and PRs; upstream reports pasted in full when this unit
             depends on them, because workers cannot see siblings
ACCEPTANCE   checkable criteria, one per line
VERIFY       exact commands via exec, plus known gotchas
TIMEBOX      rough cap on runtime; on expiry, return partial findings and stop rather than run on
FORBIDDEN    no rebase, no force-push, no fixes outside scope, plus unit-specific bans
REPORT       status, branch, head SHA, PRs, verdict, what you actually ran, deviations,
             suggested follow-ups
STANDING     <preferences.md pasted verbatim>
```

Size the brief to the unit. Missing fields are a refuse-to-spawn condition. Never resume-chain a brief. Respawn fresh with consolidated scope.

#### Steps

1. **Frame.** State the done predicate as something countable. Quantify scope. If one agent could finish inside that budget, stop here and run Autonomous run instead.
2. **Install the runtime.** `exec` `program-state.sh init`. Open the trail via `/pstack:show-me-your-work`. Write standing orders before any spawn.
3. **Pilot.** Push one unit through the whole path. Brief, worker, verification, unit row, log row. Fix the contract from pilot evidence before any fan-out.
4. **Scale.** Spawn a rolling window of workers up to the in-flight cap, refilling as children finish. Sequential when pins fail. Recompute ready work after each drain. Relay upstream reports into downstream briefs.
5. **Drain.** Classify every finished child (landed, needs-verify, failed, noise). `set` the unit row. Run `status`. Spawn the next wave.
6. **Land.** Landing is continuous. One writer per branch. Advance `lastVerifiedHead` only on merge or a reported new head SHA.
7. **Close.** Reconcile every spawned child to a terminal row. Confirm the predicate on the real artifact. Audit the trail per show-me-your-work. Leave the store intact.

#### Liveness and failure

Devin cannot schedule a later turn. There is no heartbeat watcher. Bound the wave count in this session. Then write `resume.md` and stop. The operator starts a new session. In-flight subagents from the dead session are gone. Pushed branches, open PRs, and the store are not. Re-read standing orders and `units.tsv`, reattach in-flight work by PR and branch rather than agent id, drain, resume.

Never resume an agent to check on it. Probe read-only. The store, `gh`, and pushed branches.

Retry by mode. Cap-hit, respawn with smaller scope. Network-drop, retry as-is. Tool-error, retry on a different panel profile. Unknown, retry once. Two retries, then abandon the unit and replan around it.

Do not claim cloud agents or nested dispatch beyond `max-nesting`.

#### Escalation

Reaches the human, batched. Irreversible actions, genuine product or preference calls no experiment settles, a standing order that contradicts observed reality, a program-level dead end that survived a replan.

Never reaches the human. Retries, flake triage, format fixes, scope the brief already forbids, and "should I keep going". When in doubt, act and log.

**Reply:** at checkpoints and close. The predicate and the count against it from `units.tsv`, tracks and what each landed, verdicts summary, what was abandoned and why, gates awaiting the human, the store path, and the trail path. Numbers from the tables, not narrative.
