# Release notes

Plugin `pstack` 0.5.0 selectively ports upstream 0.15.23. It adds explicit-user `/pstack:in-your-own-words`, short ketchup replies with available visuals and a text fallback, usable-state verification, and an observability proposal after deep debugging. Plan validation tracks Markdown fence delimiters. Worktree audits use the remote default or an explicit base and accept merged-PR evidence only for that base. Native activation of 0.5.0 remains untested. See the [port audit](pstack-0.15.23-port-audit.md).

Plugin `pstack` 0.4.0 adds explicit-user, read-only `/pstack:ketchup` and ports the prompt reductions from upstream pstack #538 and #539 at 0.15.17. Existing Devin profile pins, dispatch contracts, helpers, hooks, and delivery authority remain intact. Native activation of this release is untested. See the [port audit](pstack-0.15.17-port-audit.md).

Plugin 0.3.0 added poteto-help, prompting references, recipes, and the Devin usage guide from upstream 0.15.13. See its [audit](pstack-0.15.13-port-audit.md).

Plugin 0.2.0 was verified on local Devin CLI 3000.11.3 (9c803229faa4). Earlier 3000.10.21 and 3000.6.14 observations are historical baselines.

## Shipped

36 public skills under `/pstack:<name>`. 24 `principle-*` leaves, model-triggered. 20 poteto-mode playbooks. Profiles `pstack:poteto-agent`, `pstack:poteto-agent-{swe,opus,sonnet,codex}`, `pstack:comment-sicko`, and `pstack:panel-{swe,opus,sonnet,codex}`.

SessionStart injects `PSTACK_ROUTE=/pstack:poteto-mode`.

`/pstack:setup-pstack` preserves configured roles and notes in `$HOME/.config/devin/pstack-models.md`. Unchanged inputs and overrides produce byte-identical reruns.

Poteto implementation delegation is root-owned. Code-writing passes use the explicit same-pin counterpart mapping `pstack:panel-<alias>` → `pstack:poteto-agent-<alias>`, while explicit `pstack:poteto-agent-*` rows are honored as configured. This mapping is deterministic and is not failure fallback. Investigation and review retain their configured `panel-*` profiles and panel perspective counts. The root derives absolute references from the installed skill source and inlines a shared worker contract. Logical program tracks do not add agent depth. Concurrent writers use separate worktrees or directories.

Panel profiles remain model-pinned for investigation and review briefs. Their pins are unchanged: `panel-swe` uses `swe`, `panel-sonnet` uses `glm-5-3-flash-high`, and `panel-opus` and `panel-codex` use `gpt-6-1-sol-medium`. The dedicated implementation profiles preserve those actual pins: `poteto-agent-swe`, `poteto-agent-sonnet`, `poteto-agent-opus`, and `poteto-agent-codex` use the corresponding pins. The scoped `poteto-agent` pin also remains `gpt-6-1-sol-medium`.

Implementation briefs must specify an early checkpoint artifact, time budget, work quantum, no-progress threshold, and bounded recovery attempts. Workers report progress for independently verifiable units and return after the stated quantum with the concrete done check. These fields guide reporting and recovery; they do not claim that a blocking foreground call can be cancelled. Every dispatch records the returned identity, configured profile pin, and assigned workspace; background completions are collected with `read_subagent` by agent id and inspected before the parent verdict. Concurrent writers use root-provisioned, verified worktrees or directories, never two writers in one checkout. Permission repair resumes the same worker in the foreground when a resumable ID exists. No model or profile substitution is automatic.

## Narrowed

`babysit` and `opening-a-pr` run in this session only. No scheduled recheck.

Pause and resume do not create delivery authority. An ordinary pause leaves dirty work uncommitted, records each worker's identity, profile, workspace, and state, and writes a `resume.md` for a cold-start session. Resume reads that durable state and does not redo completed work merely because a new turn began.

## Cut

`shipping`, `autopilot-full`, `autopilot-stack`, and Claude Codex compatibility notes. Cursor-only make-bot-ui, Benny, and packaging assets. An explicit request for a cut workflow reports the capability verdict and the bounded in-session alternative rather than falling through to `figure-it-out`. A `cut` verdict describes this port, not a universal Devin limitation.

Verification names the control surface the change needs before promising evidence. A missing UI or CLI control tool is a precise limitation, not a pass, and compile success is not proof of the changed user surface.

## Known limits

Bare skill names resolve `~/.agents/skills`, not this plugin. Use `pstack:<name>`.

`devin -p` refuses an untrusted `/tmp` cwd.

Pinned-profile dispatch can be denied by non-interactive permissions. The workflow reports failure without automatic model or profile substitution. The earlier 0.1.0 consuming-project run proved routing and brief construction. The 0.2.0 native checks below extend that evidence.

`read_subagent` is the documented collection tool. The 0.2.0 smoke run observed foreground completion, two fresh sequential repeated-profile passes, and background completion/collection. Narrowly approved-permission behavior and foreground permission repair remain untested; see [port verification](port-verification.md).

Cloud Devin sessions exclude plugin SessionStart and plugin agents. The root `AGENTS.md` is always-on in local CLI and Desktop sessions.

Installation guidance is in [README](../README.md). Observed behavior and untested checks are in [port verification](port-verification.md).

## 0.2.0 upstream port

Source pstack 0.15.9 at `e43c7ee26e0038c6c1fa8380dd34ce86ff94cb2a`. Adds explicit-user correct and benchmark-checklist skills and model-triggered Explain the Number. Restores agent-resistant design checks, schema-owned parsing, uncapped supported reflection learnings, fresh-worker policy, SHA/method evidence, ordered performance strategies, append-only interleaved-run logging, PR sections, and a Node-only plan validator. Preserves profile pins, local packaging, ProgramState/worktree helpers, authorization, and operator-controlled delivery.

Benny's two-stage Slack triage/reproduce setup and existing-fix checks were inspected in the source audit. Unattended triggers and Cursor setup are excluded, including manual Benny replacements. Bot UI routine creation, secret cards, panels, webhook authentication, and wake payloads have no documented local equivalent; building a replacement service is outside scope. Cloud automations remain outside this local port. UI evidence requires an available adapter. Cursor reasoning-budget normalization and Bun orchestration/watch bootstrap are not imported.

Structural checks validate instructions and scripts; they do not establish native worker execution. Runtime identity must be recorded separately from configured pins and reported only if exposed. Native smoke results for this release are recorded in [port verification](port-verification.md).
