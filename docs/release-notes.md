# Release notes

Plugin `pstack` 0.1.0 for local Devin CLI 3000.6.14.

## Shipped

31 public skills under `/pstack:<name>`. 21 `principle-*` leaves, model-triggered. 20 poteto-mode playbooks. Profiles `pstack:poteto-agent`, `pstack:poteto-agent-{swe,opus,sonnet,codex}`, `pstack:comment-sicko`, and `pstack:panel-{swe,opus,sonnet,codex}`.

SessionStart injects `PSTACK_ROUTE=/pstack:poteto-mode`.

`/pstack:setup-pstack` writes `$HOME/.config/devin/pstack-models.md` twice with the same bytes when the model list is unchanged.

Poteto implementation delegation is root-owned. Code-writing passes use the explicit same-pin counterpart mapping `pstack:panel-<alias>` → `pstack:poteto-agent-<alias>`, while explicit `pstack:poteto-agent-*` rows are honored as configured. This mapping is deterministic and is not failure fallback. Investigation and review retain their configured `panel-*` profiles and panel perspective counts. The root derives absolute references from the installed skill source and inlines a shared worker contract. Logical program tracks do not add agent depth. Concurrent writers use separate worktrees or directories.

Panel profiles remain model-pinned for investigation and review briefs. Their pins are unchanged: `panel-swe` uses `swe`, `panel-sonnet` uses `glm-5-3-flash-high`, and `panel-opus` and `panel-codex` use `gpt-5-6-sol-medium`. The dedicated implementation profiles preserve those actual pins: `poteto-agent-swe`, `poteto-agent-sonnet`, `poteto-agent-opus`, and `poteto-agent-codex` use the corresponding pins. The scoped `poteto-agent` pin also remains `gpt-5-6-sol-medium`.

Implementation briefs must specify an early checkpoint artifact, time budget, work quantum, no-progress threshold, and bounded recovery attempts. Workers report progress for independently verifiable units and return after the stated quantum with the concrete done check. These fields guide reporting and recovery; they do not claim that a blocking foreground call can be cancelled. Background work uses only preapproved permissions and is collected with `read_subagent`. Permission repair resumes the same worker in the foreground when a resumable ID exists. No model or profile substitution is automatic.

## Narrowed

`babysit` and `opening-a-pr` run in this session only. No scheduled recheck.

## Cut

`shipping`, `autopilot-full`, `autopilot-stack`, and Claude Codex compatibility notes. Cursor-only make-bot-ui, Benny, and packaging assets.

## Known limits

Bare skill names resolve `~/.agents/skills`, not this plugin. Use `pstack:<name>`.

`devin -p` refuses an untrusted `/tmp` cwd.

Pinned-profile dispatch can be denied by non-interactive permissions. The workflow reports failure without automatic model or profile substitution. A bounded consuming-project run proved automatic routing and complete brief construction, but not worker completion, parent verification, worker runtime identity, or background result collection.

Cloud Devin sessions exclude plugin SessionStart and plugin agents.
