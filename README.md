# pstack for Devin CLI

Local Devin CLI plugin. It does not load in cloud Devin sessions.

Install from this directory, then start a new session.

```
devin plugins install --local -y .
```

Public skills are `/pstack:<name>`. Principle leaves are model-triggered only.

SessionStart injects a route to `/pstack:poteto-mode` on local Devin CLI.

`/pstack:setup-pstack` writes `$HOME/.config/devin/pstack-models.md` from `aliases:` lines in `devin models list`. Role rows map to registered profiles. Poteto keeps dispatch at root, resolves code-writing passes through the deterministic same-pin counterpart `pstack:panel-<alias>` → `pstack:poteto-agent-<alias>`, and inlines a scoped implementation contract with absolute installed-plugin pointers. Explicit `poteto-agent-*` rows are supported. Panel profiles remain the route for investigation and review, and retain their existing role rows and panel counts.

The shipped implementation pins remain `swe`, `glm-5-3-flash-high`, and `gpt-5-6-sol-medium`, matching their panel counterparts. Dispatch or model failure is reported without automatic profile substitution. Background workers require already-approved permissions and return results through completion notifications; a denied pass can resume only on the same profile in the foreground. Every dispatch records the returned identity, configured profile pin, and assigned workspace, is collected with `read_subagent` by agent id, and is inspected by the root before the parent verdict. Concurrent writers get a root-provisioned, verified worktree or directory, never two writers in one checkout. Workers report checkpoints, bounded progress, and concrete checks, while a time budget remains a reporting and recovery bound rather than an unsupported cancellation promise.

`shipping`, `autopilot-full`, and `autopilot-stack` are cut from this port. An explicit request for one gets that capability verdict and the bounded in-session alternative, not a silent fallback to figure-it-out. Merge stays with the operator. This plugin has no agent-callable scheduled wakeup. Cloud Devin scheduling exists but is a separate, unverified workstream. `/loop <prompt>` is an interactive command that runs a prompt then auto-reviews the diff in a loop, not a time-based scheduler.

Pause and resume do not create delivery authority. An ordinary pause leaves dirty work uncommitted, records each worker's identity, profile, workspace, and state, and writes a `resume.md` a cold-start session can read back. Resume reads that durable state and does not redo completed work merely because a new turn began.

Shipped behavior is in [`docs/release-notes.md`](docs/release-notes.md).

Verified against Devin CLI 3000.10.21 (611c1cba), local CLI on macOS.

## Capability baseline

Recorded 2026-09-10 against Devin CLI 3000.10.21, local Devin CLI on macOS, plugin `pstack` 0.1.0. Each row is one of documented (official Devin docs), locally observed (seen in a real session, with its date), unavailable (documented restriction), or untested (not exercised here). None of this is native runtime proof of the full poteto workflow.

| Ability | Status | Evidence or limit |
| --- | --- | --- |
| Plugin skills as `/pstack:<name>` | Documented, locally observed 2026-09-07 | SessionStart injected `PSTACK_ROUTE`; skill tool loaded poteto-mode. Cloud sessions exclude plugin SessionStart and plugin agents. |
| Always-on plugin rule from root `AGENTS.md` | Documented, untested | Devin plugin docs: a root `AGENTS.md` is injected as an always-on rule. Not yet exercised in a fresh consuming session. |
| SessionStart routing hook | Documented, locally observed 2026-09-07 | Hooks are best effort and fail open; routing now also lives in `AGENTS.md`. |
| Custom subagent profiles `pstack:<name>` | Documented, locally observed 2026-09-07 | Local CLI and Desktop only, not cloud. `devin doctor` reports no custom profiles configured until the plugin is installed. |
| `run_subagent` dispatch | Documented, locally observed 2026-09-07 | Args `profile`, `task`, `title`, `is_background`, optional `resume`; no model argument. |
| `read_subagent` collection | Documented, untested | The supported result-collection tool, called by retained agent id with optional `block` and `timeout`. Background results were never collected in a live run. |
| Background worker completion | Documented, untested | Background workers inherit only pre-approved permissions and cannot prompt. |
| Same-worker permission resume | Documented, untested | Resumed subagents always run in the foreground. |
| Writer worktree isolation | Documented mechanism, untested | The plugin specifies root-provisioned, verified, recorded worktrees or directories; `run_subagent` still does not create one. No live two-writer check has run. |
| `/loop <prompt>` autonomous continuation | Unavailable as a scheduler | Interactive run-then-review loop; not agent-callable and not a durable wakeup. |
| UI or browser verification | Surface-dependent, untested | Depends on tools present on the host; report an unavailable surface rather than a success claim. |

The bounded consuming-project check proved automatic routing and complete brief construction, but non-interactive permission rejection prevented worker-result collection, parent verification, and worker runtime-model confirmation. See [`docs/poteto-delegation-evaluation.md`](docs/poteto-delegation-evaluation.md).

## Checks

Structural contract checks:

```
node --test tests/pstack-models.test.mjs tests/poteto-delegation.test.mjs
```

They cover relative reference resolution, the principle catalog, registered profile mapping and same-pin comparison, explicit cut-workflow routing, writer workspace provisioning, and the documented `run_subagent` fields. They are static checks, not native Devin execution. Worker completion, background collection, same-worker permission resume, worktree isolation, and runtime model identity remain unproven until a plugin install is authorized and the V06-V14 scenarios run in a consuming repository.
