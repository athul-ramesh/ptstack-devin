# Port pstack 0.15.36 to Devin

Audited on 2026-10-30 on top of `main` at `0689024` (PR #12 merged). Plugin version is 0.9.1.

## Source and coverage

Upstream range: [`ab1f702...c742dd6`](https://github.com/cursor/plugins/compare/ab1f702ce8e8b6557edb56b09f52cde8bfb83f17...c742dd61706fbacc1b95f1a20b7b988cf096ce6c) (`pstack/`, 0.15.35 to 0.15.36). One commit touches `pstack/` and it was read in full.

| Upstream change | Devin disposition |
| --- | --- |
| [#1043](https://github.com/cursor/plugins/commit/c742dd61706fbacc1b95f1a20b7b988cf096ce6c) Orchestrate rewritten as an agentic playbook: Topology (one owner per PR, fresh worker per independent task, verifier from another model family, start with one unit) and Supervision (kickoff names its evidence, read the diff not the summary, send back scope drift, check live PR state, retry by cause, ask the user only for real decisions) | Adapted. The playbook follows the new Topology, Supervision, and Reply shape. Devin specifics stay: `run_subagent` via `delegation.md`, same-pin `poteto-agent-*` writers, root-provisioned worktrees, the local `program-state.sh` store, a verifier on a profile with a different `model:` pin, and bounded waves plus `resume.md` because Devin has no scheduled wakeup. |
| #1043 Project tracker (`notes.md`) and Project store | Not applicable. Devin has no Project tracker; the existing local store under `$HOME/.config/devin/pstack/` keeps that role. |
| #1043 PR and CI event subscriptions "when your harness has them" | Not applicable. The Devin CLI documents no event subscription, so the playbook checks PRs with `gh pr view` and `gh pr checks` on demand. |
| #1043 Workers on cloud VMs (`environment: "cloud"`) | Skipped. `run_subagent` takes only `profile`, `task`, `title`, `is_background`, and `resume` ([Subagents](https://docs.devin.ai/cli/subagents)). Cloud handoff is not claimed. |
| #1043 Sub-coordinators to three levels | Skipped. Devin disables `run_subagent` inside subagents unless a custom profile sets `max-nesting` ([Subagents](https://docs.devin.ai/cli/subagents)); this port ships no nesting profile, so depth stays root → worker. |
| #1043 Fork a worker to reuse its built state | Adapted as "resume a worker only for a follow-up on the same work". Devin has no fork; resumes run in the foreground. |
| #1043 Delete `scripts/orch/*` and its test entry | Not applicable. The Bun orch scripts were never shipped here. |
| #1043 Overnight guide wording; version bump | Cursor guide pages are not shipped. Plugin bumped independently to 0.9.1. |

The old Steps list and brief template are removed, matching upstream. Their required content (goal, scope, evidence, timebox, forbidden actions, standing orders) now lives in the Supervision bullets.

## Checks

- `node --test tests/*.test.mjs`: all pass, including root-provisioned workspace and dispatch-field contracts for `orchestrate.md`.
- `git diff --check`: passes.
- Native Devin activation of 0.9.1 is untested.
