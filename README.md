# pstack for Devin CLI

Local Devin CLI plugin. It does not load in cloud Devin sessions.

Install from this directory, then start a new session.

```
devin plugins install --local -y .
```

Public skills are `/pstack:<name>`. Principle leaves are model-triggered only.

SessionStart injects a route to `/pstack:poteto-mode` on local Devin CLI.

`/pstack:setup-pstack` writes `$HOME/.config/devin/pstack-models.md` from `aliases:` lines in `devin models list`. Role rows map to registered profiles. Poteto keeps dispatch at root, resolves code-writing passes through the deterministic same-pin counterpart `pstack:panel-<alias>` → `pstack:poteto-agent-<alias>`, and inlines a scoped implementation contract with absolute installed-plugin pointers. Explicit `poteto-agent-*` rows are supported. Panel profiles remain the route for investigation and review, and retain their existing role rows and panel counts.

The shipped implementation pins remain `swe`, `glm-5-3-flash-high`, and `gpt-5-6-sol-medium`, matching their panel counterparts. Dispatch or model failure is reported without automatic profile substitution. Background workers require already-approved permissions and are collected with `read_subagent`; a denied pass can resume only on the same profile in the foreground. Workers report checkpoints, bounded progress, and concrete checks, while a time budget remains a reporting and recovery bound rather than an unsupported cancellation promise.

`shipping`, `autopilot-full`, and `autopilot-stack` are cut. Devin cannot schedule a later turn. Merge stays with the operator.

Shipped behavior is in [`docs/release-notes.md`](docs/release-notes.md).

Verified against Devin CLI 3000.6.14.

The bounded consuming-project check proved automatic routing and complete brief construction, but non-interactive permission rejection prevented worker-result collection, parent verification, and worker runtime-model confirmation. See [`docs/poteto-delegation-evaluation.md`](docs/poteto-delegation-evaluation.md).
