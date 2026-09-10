# pstack for Devin CLI

Local Devin CLI plugin. It does not load in cloud Devin sessions.

Install from this directory, then start a new session.

```
devin plugins install --local -y .
```

Public skills are `/pstack:<name>`. Principle leaves are model-triggered only.

SessionStart injects a route to `/pstack:poteto-mode` on local Devin CLI.

`/pstack:setup-pstack` writes `$HOME/.config/devin/pstack-models.md` and `$HOME/.config/devin/pstack-root` from `devin models list` and the installed plugin source. `pstack-models.md` maps roles to registered `pstack:poteto-agent-<alias>` and `pstack:panel-<alias>` profiles. `pstack-root` is the absolute installed pstack path; every skill and playbook uses it to resolve `skills/`, `agents/`, and `playbooks/` references. Poteto keeps dispatch at root, resolves code-writing passes through the deterministic same-pin counterpart `pstack:panel-<alias>` → `pstack:poteto-agent-<alias>`, and inlines a scoped implementation contract with absolute installed-plugin pointers. Explicit `poteto-agent-*` rows are supported. Panel profiles remain the route for investigation and review, and retain their existing role rows and panel counts.

Shipped agent `model:` frontmatter pins use the standard Devin short names that match their profile suffix: `panel-swe` and `poteto-agent-swe` pin `swe`, `panel-sonnet` and `poteto-agent-sonnet` pin `sonnet`, `panel-opus` and `poteto-agent-opus` pin `opus`, and `panel-codex` and `poteto-agent-codex` pin `codex`. The legacy `pstack:poteto-agent` profile also pins `opus`. Run `/pstack:setup-pstack` to map roles to the aliases reported by your `devin models list`; only profiles that are both shipped and detected are emitted.

Dispatch or model failure is reported without automatic profile substitution. Background workers require already-approved permissions and return results through completion notifications; a denied pass can resume only on the same profile in the foreground. Workers report checkpoints, bounded progress, and concrete checks, while a time budget remains a reporting and recovery bound rather than an unsupported cancellation promise.

`shipping`, `autopilot-full`, and `autopilot-stack` are cut. Devin cannot schedule a later turn. Merge stays with the operator.

Shipped behavior is in [`docs/release-notes.md`](docs/release-notes.md).
