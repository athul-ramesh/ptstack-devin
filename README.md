# pstack for Devin CLI

Local Devin CLI plugin. It does not load in cloud Devin sessions.

Install from this directory, then start a new session:

```
devin plugins install --local -y .
```

Public skills are `/pstack:<name>`. Principle leaves are model-triggered only. SessionStart injects a route to `/pstack:poteto-mode` on local Devin CLI.

`/pstack:setup-pstack` writes `$HOME/.config/devin/pstack-models.md` from `aliases:` lines in `devin models list`. Poteto keeps dispatch at root and resolves code-writing passes through the deterministic same-pin counterpart `pstack:panel-<alias>` → `pstack:poteto-agent-<alias>`. Background workers require already-approved permissions and return results through completion notifications; every dispatch records the returned identity, configured profile pin, and assigned workspace, is collected with `read_subagent` by agent id, and is inspected by the root before the parent verdict. Concurrent writers get a root-provisioned, verified worktree or directory, never two writers in one checkout.

`shipping`, `autopilot-full`, and `autopilot-stack` are cut from this port. An explicit request for one gets that capability verdict and the bounded in-session alternative, not a silent fallback to figure-it-out. Merge stays with the operator. This plugin has no agent-callable scheduled wakeup. `/loop <prompt>` is an interactive command that runs a prompt then auto-reviews the diff in a loop, not a time-based scheduler.

Pause and resume do not create delivery authority. An ordinary pause records each worker's identity, profile, workspace, and state in a `resume.md` a cold-start session can read back.

Shipped behavior is in [`docs/release-notes.md`](docs/release-notes.md).

Verified against Devin CLI 3000.10.21 (611c1cba), local CLI on macOS.

## Checks

Structural contract checks:

```
node --test tests/pstack-models.test.mjs tests/poteto-delegation.test.mjs
```

They cover relative reference resolution, the principle catalog, registered profile mapping and same-pin comparison, explicit cut-workflow routing, writer workspace provisioning, and the documented `run_subagent` fields. They are static checks, not native Devin execution.
