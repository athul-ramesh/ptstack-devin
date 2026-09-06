# pstack for Devin CLI

Local Devin CLI plugin. It does not load in cloud Devin sessions.

Install from this directory, then start a new session.

```
devin plugins install --local -y .
```

Public skills are `/pstack:<name>`. Principle leaves are model-triggered only.

SessionStart injects a route to `/pstack:poteto-mode` on local Devin CLI.

`/pstack:setup-pstack` writes `$HOME/.config/devin/pstack-models.md` from `aliases:` lines in `devin models list`. Role rows map to `pstack:panel-<alias>` profiles.

Pinned panel profiles can fail with Permission denied on some accounts. Panel skills then run sequential default-profile passes.

`shipping`, `autopilot-full`, and `autopilot-stack` are cut. Devin cannot schedule a later turn. Merge stays with the operator.

Shipped behavior is in [`docs/release-notes.md`](docs/release-notes.md).

Verified against Devin CLI 3000.6.14.
