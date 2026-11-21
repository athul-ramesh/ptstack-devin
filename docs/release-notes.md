# Release notes

## 0.12.0

- Add `/pstack:control-ui` and `/pstack:control-cli` as first-class plugin skills. Verification recipes, poteto-mode, poteto-help, and create-verification-skill route to them when no project verify skill exists.
- Bundle upstream `watch-pr` under `skills/poteto-mode/scripts/` with Bun tests. Babysit prefers `--status-only` in check mode and bounded poll in drive mode, with `gh pr checks --watch` as fallback. No Origin CLI. No scheduled wake.
- Delivery capability babysit rows name the watcher. Autopilot cut rows point at `/pstack:figure-it-out` instead of Orchestrate.

## 0.11.1

- `/pstack:setup-pstack` reads `devin models list --format json` and accepts a profile when `agents/<name>/AGENT.md` exists and its `model:` pin is an alias, slug, family uid, or variant `model_uid`. A profile suffix is only a role label. Text output is the fallback when JSON is missing or not a catalog. An unregistered profile names the missing `AGENT.md`. An unavailable pin names that pin. Profile pins are unchanged.

## 0.11.0

- Port upstream 0.15.43 (`e559e62`). Principle leaves, unslop, and technical-writing are shorter. Opening a PR, Babysit, and the multi-phase plan are shorter, and `check-plan.mjs` is gone. Reflect is one file with no reviewers. Architect is a short brief plus `/pstack:arena` for a large or contested design. The Orchestrate playbook is deleted. A standing program routes to `/pstack:figure-it-out` and keeps one owner per PR, a verifier on a different model pin, and a first unit before fan-out.
- `skills/poteto-mode/worker.md` holds the rules for a started agent. The first line of a `run_subagent` task points at it. Devin documents subagents and withholds `ask_user_question` from them. It does not document Project workers or a kickoff file. Following that pointer is untested.
- Setup writes `# defaults: 3` and drops `architect runners`, `reflect tooling`, and `reflect judgment, divergent, synthesizer`. A `# defaults: 2` sheet keeps its other choices. Profile pins are unchanged. Cursor slugs for Opus 5.5, Fable 5.2, and Gemini 4 Carbon, and the three effort budgets, are not written. Native activation remains untested. See the [port audit](pstack-0.15.43-port-audit.md).

## 0.10.0

- Port upstream 0.15.37 through 0.15.42 (`bf0c7cd`). `/pstack:why` is one short file. `/pstack:how` is one read-only `subagent_explore` pass. Poteto-mode, the code playbooks, architect, no-comments, and comment-sicko trace the code. Teach and poteto-help still offer how. Recall starts its own investigator per git or `gh` source. Reflect's drift example is a function rename. Sharpen's prototype line was already on main in 0.9.2. The docs now say so.
- Setup writes `# defaults: 2`. An older sheet drops the retired how and why roles. Old default `bug-fix` and `hillclimb` rows move from `pstack:poteto-agent-sonnet` to `pstack:poteto-agent-opus` when `opus` is available. Other choices stay. Profile pins stay `gpt-6-1-sol-medium`, `glm-5-3-flash-high`, and `swe`. Cursor slugs for Fable 5.2, Opus 5.5, and Gemini 4 Carbon are not written. Swarm workers and reflect tooling stay on `sonnet`.
- Statechart reports SANY's own error section, capped at 40 lines, and draws an outside arrow to a parent state's border. Benny is not shipped. Native activation remains untested. See the [port audit](pstack-0.15.42-port-audit.md).

## 0.9.2

- Local drift fixes: declare `platforms: ["local"]` in `.devin-plugin/plugin.json` so the plugin loads only in Devin CLI and Devin Desktop. README and AGENTS.md say so explicitly. Restore sharpen prototype wording, obligatory `/pstack:unslop` and `/pstack:technical-writing` routing in poteto-mode, and ketchup `permissions.deny: [edit]`. Native activation remains untested.

## 0.9.1

- Port upstream 0.15.36 (`c742dd6`): the Orchestrate playbook is rewritten around one owner per PR, an independent verifier, starting with one unit, reading diffs instead of summaries, and checking live PR state with `gh`. Devin keeps the local store, root-only dispatch, and bounded waves. Cloud workers, sub-coordinators, forks, and event subscriptions are not shipped. Native activation remains untested. See the [port audit](pstack-0.15.36-port-audit.md).

## 0.9.0

- Add `/pstack:statechart` with the upstream TLA+ checker, regression corpus, and Pele SVG instructions.
- Return complete Mermaid text for Obsidian and SVG file paths when the CLI cannot show charts inline.
- Document existing-toolchain overrides and installation authorization. Native Devin activation remains untested.


Plugin `pstack` 0.8.0 selectively ports upstream 0.15.33 through 0.15.35 to `ab1f702`. `/pstack:interrogate` now has adversaries try to break the change with real runs in their own worktrees, and keeps only findings the root reproduces by rerunning the command; the reviewer prompt, rubric, lead-judgment, and code-quality references are removed. Arena never picks a cross-judge whose model pin matches the parent session, and skips the judge when none qualifies. Poteto-mode restates the user's goal in its first message, briefs, PR `## Why`, and final reports. Explain the Number starts before the run. Plan verdicts block only on a shown problem, and a wording-only change gets no verifier. Statechart, ketchup-video, Autopilot, and Cursor model-slug fallbacks are not shipped. Native activation of 0.8.0 remains untested. See the [port audit](pstack-0.15.35-port-audit.md).

Plugin `pstack` 0.7.0 selectively ports upstream 0.15.26 through 0.15.32 and follow-ups to `e73df47`. It adds explicit-user `/pstack:create-formal-verification-skill` and `/pstack:maintain-formal-verification-skill`, which write project skills under `.devin/skills/`, bundle no verifier, and ask before installing one. `/pstack:sharpen` now hands back a rewritten prompt and does not do the task. Ketchup lists every waiting item with its link, evidence, risk, and pick, and never cuts items to meet a word count. Reflect never edits a skill inside an installed plugin. The TypeScript brand example uses a type guard. Statechart and ketchup-video are not shipped. Native activation of 0.7.0 remains untested. See the [port audit](pstack-0.15.32-port-audit.md).

Plugin `pstack` 0.6.1 selectively ports upstream 0.15.25. Four principles (attack-the-premise, fix-root-causes, make-operations-idempotent, test-behavior-not-implementation) are restated as reasoning instead of rules, and `/pstack:correct` follows the new test rule. Marginal sections are cut from interrogate's lead judgment, migrate-callers, type-system-discipline, and swarm. Ketchup now explains each change, leads with existing screenshots, videos, and diagrams when the host renders them, sums up in bullets, and lists action items as plain bullets. The Devin text fallback is kept. Native activation of 0.6.1 and inline image rendering remain untested. See the [port audit](pstack-0.15.25-port-audit.md).

Plugin `pstack` 0.6.0 selectively ports upstream 0.15.24. It adds explicit-user `/pstack:sharpen`, rewrites ketchup to a reply well under 150 words with small plain-language visuals, states that Devin dispatch has no per-call effort or speed knob, and runs the full plan audit set once at the code-ready SHA with a single fresh-context verifier for rebases and minor fixes. Native activation of 0.6.0 remains untested. See the [port audit](pstack-0.15.24-port-audit.md).

Plugin `pstack` 0.5.0 selectively ports upstream 0.15.23. It adds explicit-user `/pstack:in-your-own-words`, short ketchup replies with available visuals and a text fallback, usable-state verification, and an observability proposal after deep debugging. Plan validation tracks Markdown fence delimiters. Worktree audits use the remote default or an explicit base and accept merged-PR evidence only for that base. Native activation of 0.5.0 remains untested. See the [port audit](pstack-0.15.23-port-audit.md).

Plugin `pstack` 0.4.0 adds explicit-user, read-only `/pstack:ketchup` and ports the prompt reductions from upstream pstack #538 and #539 at 0.15.17. Existing Devin profile pins, dispatch contracts, helpers, hooks, and delivery authority remain intact. Native activation of this release is untested. See the [port audit](pstack-0.15.17-port-audit.md).

Plugin 0.3.0 added poteto-help, prompting references, recipes, and the Devin usage guide from upstream 0.15.13. See its [audit](pstack-0.15.13-port-audit.md).

Plugin 0.2.0 was verified on local Devin CLI 3000.11.3 (9c803229faa4). Earlier 3000.10.21 and 3000.6.14 observations are historical baselines.

## Shipped

39 public skills under `/pstack:<name>`. 24 `principle-*` leaves, model-triggered. 19 poteto-mode playbooks. Profiles `pstack:poteto-agent`, `pstack:poteto-agent-{swe,opus,sonnet,codex,terra}`, `pstack:comment-sicko`, and `pstack:panel-{swe,opus,sonnet,codex,terra}`.

SessionStart injects `PSTACK_ROUTE=/pstack:poteto-mode`.

`/pstack:setup-pstack` preserves configured roles and notes in `$HOME/.config/devin/pstack-models.md`. Unchanged inputs and overrides produce byte-identical reruns.

Poteto implementation delegation is root-owned. Code-writing passes use the explicit same-pin counterpart mapping `pstack:panel-<alias>` → `pstack:poteto-agent-<alias>`, while explicit `pstack:poteto-agent-*` rows are honored as configured. This mapping is deterministic and is not failure fallback. Investigation and review retain their configured `panel-*` profiles and panel perspective counts. The root derives absolute references from the installed skill source and inlines a shared worker contract. Logical program tracks do not add agent depth. Concurrent writers use separate worktrees or directories.

Panel profiles remain model-pinned for investigation and review briefs. Their pins are unchanged: `panel-swe` uses `swe`, `panel-sonnet` uses `glm-5-3-flash-high`, and `panel-opus` and `panel-codex` use `gpt-6-1-sol-medium`. The dedicated implementation profiles preserve those actual pins: `poteto-agent-swe`, `poteto-agent-sonnet`, `poteto-agent-opus`, and `poteto-agent-codex` use the corresponding pins. The scoped `poteto-agent` pin also remains `gpt-6-1-sol-medium`. `panel-terra` and `poteto-agent-terra` share the pin `gpt-6-1-terra-medium`.

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
