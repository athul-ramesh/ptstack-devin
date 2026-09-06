# Release notes

Plugin `pstack` 0.1.0 for local Devin CLI 3000.6.14.

## Shipped

31 public skills under `/pstack:<name>`. 21 `principle-*` leaves, model-triggered. 20 poteto-mode playbooks. Profiles `pstack:poteto-agent`, `pstack:comment-sicko`, and `pstack:panel-{swe,opus,sonnet,codex}`.

SessionStart injects `PSTACK_ROUTE=/pstack:poteto-mode`.

`/pstack:setup-pstack` writes `$HOME/.config/devin/pstack-models.md` twice with the same bytes when the model list is unchanged.

## Narrowed

`babysit` and `opening-a-pr` run in this session only. No scheduled recheck.

## Cut

`shipping`, `autopilot-full`, `autopilot-stack`, and Claude Codex compatibility notes. Cursor-only make-bot-ui, Benny, and packaging assets.

## Known limits

Bare skill names resolve `~/.agents/skills`, not this plugin. Use `pstack:<name>`.

`devin -p` refuses an untrusted `/tmp` cwd.

Pinned `swe` / `opus` / `sonnet` / `codex` subagent profiles can return Permission denied. Sequential default-profile passes are the live panel path on those accounts.

Cloud Devin sessions exclude plugin SessionStart and plugin agents.
