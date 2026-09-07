# pstack for Devin CLI

Local Devin CLI plugin. It does not load in cloud Devin sessions.

Install from this directory, then start a new session.

```
devin plugins install --local -y .
```

Public skills are `/pstack:<name>`. Principle leaves are model-triggered only.

SessionStart injects a route to `/pstack:poteto-mode` on local Devin CLI.

`/pstack:setup-pstack` writes `$HOME/.config/devin/pstack-models.md` from `aliases:` lines in `devin models list`. Role rows map to registered `pstack:panel-<alias>` profiles. Poteto keeps dispatch at root, preserves the exact configured profile, and inlines a scoped implementation contract with absolute installed-plugin pointers. A `panel-*` profile can run one implementation pass; the profile name does not make that call a panel.

The shipped pins remain `swe`, `glm-5-3-flash-high`, and `gpt-5-6-sol-medium`. Dispatch or model failure is reported without automatic profile substitution. Background workers require already-approved permissions.

`shipping`, `autopilot-full`, and `autopilot-stack` are cut. Devin cannot schedule a later turn. Merge stays with the operator.

Shipped behavior is in [`docs/release-notes.md`](docs/release-notes.md).

Verified against Devin CLI 3000.6.14.

The bounded consuming-project check proved automatic routing and complete brief construction, but non-interactive permission rejection prevented worker-result collection, parent verification, and worker runtime-model confirmation. See [`docs/poteto-delegation-evaluation.md`](docs/poteto-delegation-evaluation.md).
