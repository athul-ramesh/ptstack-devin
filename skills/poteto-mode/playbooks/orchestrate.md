### Orchestrate

**You own the program, never the code. Author briefs, drain the queue, keep the frontier green, decide.** For a whole project handed to one standing coordinator chat. Multi-day, many stacked PRs, a fleet of subagents, the human checking in twice a day instead of every five minutes. One task driven to a predicate is Autonomous run. One ambitious run needing a bespoke workflow is figure-it-out. Route here when the work outlives any single agent. Work one agent could finish inside the session's budget is not a program.

Three rules carry the rest.

- Completions are queue events, not interrupts.
- Every spawn and every resume carries the standing orders verbatim.
- The brief is the product. A vague brief fails quietly, because a worker cannot ask you a question.

Open a todolist with the steps below copied in verbatim. A step you skip stays listed with `skip: <reason>`.

#### Roles and placement

- **Coordinator (this root chat).** Frames tracks and units, authors briefs, dispatches every worker, drains results, owns dependency gates and the human report, and makes retry and judgment decisions. It never authors or edits code. Conflicted merges, restacks, and code changes are tasks. Mechanically landing a verified unit is bookkeeping the coordinator may do itself when authorized.
- **Track.** A logical record grouping dependent units, status, and evidence. It is not an agent and does not dispatch. The root owns every track's queue and reconciliation.
- **Worker / verifier.** `run_subagent` with a registered profile, dispatched by the root through [`../references/delegation.md`](../references/delegation.md). Isolation is a worktree or directory per writer, not a branch in one shared checkout. The root resolves `references/verification.md` from the installed poteto-mode source and supplies its absolute path. Proof uses `exec` on the real CLI or TUI, and the browser only when this session has one. Prefer fewer, broader workers. Run a unit's verifier as a separate review pass with edits prohibited.

Actual agent depth is root → worker. Workers report unresolved work to the root. Nested coordinators are a future feature requiring a bounded nesting profile, an explicit cost policy, and a dedicated runtime test.

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
3. **Pilot.** Push one unit through the whole path. Brief, root dispatch, verification, unit row, log row. Fix the contract from pilot evidence before any fan-out.
4. **Scale.** The root dispatches a rolling window of ready units up to the in-flight cap, refilling as results arrive. Use separate worktrees or directories for concurrent writers; otherwise serialize them. Recompute ready work after each drain. Relay upstream reports into downstream briefs.
5. **Drain.** The root classifies every finished worker (landed, needs-verify, failed, noise), updates the unit row, runs `status`, decides retries, and dispatches the next ready wave.
6. **Land.** Landing is continuous. One writer per worktree or directory. Advance `lastVerifiedHead` only on merge or a reported new head SHA.
7. **Close.** Reconcile every spawned child to a terminal row. Confirm the predicate on the real artifact. Audit the trail per show-me-your-work. Leave the store intact.

#### Liveness and failure

Devin cannot schedule a later turn. There is no heartbeat watcher. Bound the wave count in this session. Then write `resume.md` and stop. The operator starts a new session. In-flight subagents from the dead session are gone. Pushed branches, open PRs, and the store are not. Re-read standing orders and `units.tsv`, reattach in-flight work by PR and branch rather than agent id, drain, resume.

Never resume an agent to check on it. Probe read-only. The store, `gh`, and pushed branches.

Retry only after classifying the failure. Cap-hit may justify a fresh smaller scope. A background permission denial may use foreground resume on the same profile. Network drop may justify one same-profile retry. An unavailable model pin remains unavailable; substituting a profile is degraded execution and must be reported. After two deliberate attempts, abandon the unit and replan around it.

Do not claim cloud agents or nested dispatch. Track and unit records do not add agent depth.

#### Escalation

Reaches the human, batched. Irreversible actions, genuine product or preference calls no experiment settles, a standing order that contradicts observed reality, a program-level dead end that survived a replan.

Never reaches the human. Retries, flake triage, format fixes, scope the brief already forbids, and "should I keep going". When in doubt, act and log.

**Reply:** at checkpoints and close. The predicate and the count against it from `units.tsv`, tracks and what each landed, verdicts summary, what was abandoned and why, gates awaiting the human, the store path, and the trail path. Numbers from the tables, not narrative.
