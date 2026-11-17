# Port pstack 0.15.43 to Devin

Audited on 2026-11-16 on top of `port/pstack-bf0c7cd` (`da5a6fa`, plugin 0.10.0). That branch is open as PR #15 and is not merged. Plugin version is 0.11.0.

## Source and coverage

Upstream commit [`e559e62`](https://github.com/cursor/plugins/commit/e559e62b729e040186bc9d573e71255e5a96f50d) (PR [#1249](https://github.com/cursor/plugins/pull/1249), pstack 0.15.43). The `pstack/` tree at its parent matches [`bf0c7cd`](https://github.com/cursor/plugins/commit/bf0c7cd80abdbf7fe47b634978a7d1b4071f71a7). `harness/pstack/claude-code` is the generated Claude Code copy and was not ported.

Checked [Devin CLI models](https://docs.devin.ai/cli/models), [Desktop models](https://docs.devin.ai/desktop/models), [Subagents](https://docs.devin.ai/cli/subagents), [Creating skills](https://docs.devin.ai/cli/extensibility/skills/creating-skills), and [Devin Cloud](https://docs.devin.ai/cli/cloud) on 2026-11-16.

| Upstream change | Devin disposition |
| --- | --- |
| Fourteen principle bodies shortened. Frontmatter unchanged. | Adapted. Bodies match the short text. Frontmatter stays `triggers: model`. Type System Discipline names `/pstack:typescript-best-practices`. |
| Unslop and technical-writing shortened. Rule 14 stays "no mid-sentence colon". | Adapted. Local-only unslop rules 1, 2, 4, 6, and 21 and the soul section were not in upstream 0.15.42 and go with the shorter catalog. Technical writing invokes `/pstack:unslop`. |
| Opening a PR cut to three paragraphs. | Adapted. Still user-requested only, `gh` only, `/pstack:deslop`, and never merge. Origin CLI is not in the Devin docs, so it stays out. |
| Babysit cut to six rules. | Adapted. Same three modes, conflict-thread-CI order, no rebase, skeptical Bugbot triage, no merge. Status is `gh pr view` and `gh pr checks`. No bundled watcher and no Origin CLI. This session only. |
| Multi-phase plan cut to five steps. `check-plan.mjs` and its test deleted. | Adapted. The plan file path stays under `docs/` or `~/.config/devin/pstack/`. Live checks use `exec` or name a missing adapter. `tests/plan-validator.test.mjs` is deleted with the script. |
| Reflect is one short file. It reads the transcript, waits for approval, and spawns no subagents. Reviewer files deleted. | Adapted. The destination rule stays `.devin/skills/` and `~/.config/devin/skills/`. It does not mention `plugins/cache/`. |
| Setup drops reflect roles. | Adapted. `reflect tooling` and `reflect judgment, divergent, synthesizer` are retired. |
| Architect is a short brief and routes a large or contested design to arena. Runner references and the architect runners role are deleted. | Adapted. The brief calls `/pstack:arena`. Feature, Refactoring, Bug fix, poteto-help, and the usage guide stop describing parallel design exploration and the checkpoint option. |
| Arena runner and cross-judge fallback chains trimmed. | Partial. This port never had the slug fallback chains. Phase A now drops an unregistered profile and keeps at least two runners. The judge still compares `model:` pins. |
| Poteto-mode shortened. Orchestrate deleted. Program-scale work routes to figure-it-out. Twenty-two playbooks. | Adapted. The Devin skill stays the routing document. Orchestrate is deleted. Figure-it-out keeps one owner per PR, a verifier on a different pin, and a first unit before fan-out. Playbook count here is 19. Shipping, autopilot-full, and autopilot-stack stay cut, which is why this is not 22. `skip:` is gone. Cursor's todolist tool is not in Devin's documented tools, so the checklist remains. |
| New `worker.md`. The first line of every kickoff points at it. | Adapted and uncertain. The pointer is the first line of a `run_subagent` `task`. See Worker below. |
| Opus 5.5 xhigh-fast default, Fable 5.2 exception-only, cap at xhigh, `# defaults: 3`, three budgets. | Partial. See Models below. The marker is `# defaults: 3`. Pins and budgets are unchanged. |

## Models

The CLI still documents short aliases `opus`, `sonnet`, `swe`, `codex`, and `gemini`. Desktop pricing names Claude Fable 5.2 with Low, Medium, High, XHigh, Max, and Fast Mode. It does not publish `claude-opus-5-5-xhigh-fast`, `claude-fable-5-2-high`, or `gemini-4-carbon-high`. The CLI page does not list `fable`. Opus 5.5 is not named. `run_subagent` takes a profile, not a model or an effort.

Shipped pins stay `gpt-6-1-sol-medium`, `glm-5-3-flash-high`, and `swe`. No new profile was added.

- Code, prose, and judgment stay on the existing `opus` profiles. There is no second pin for xhigh-fast versus high-fast.
- Swarm workers stay `pstack:panel-sonnet`.
- The arena cross-judge pool stays `opus` and `swe`, compared by `model:` pin. Upstream dropped Fable from a three-seat pool this port never shipped.
- A sheet with neither `# defaults: 3` nor `# defaults: 2` still migrates an exact old `bug-fix` or `hillclimb` row from `pstack:poteto-agent-sonnet` to `pstack:poteto-agent-opus` when `opus` is available. A sheet that already has `# defaults: 2` keeps that choice and only loses the newly retired roles. The writer then stores `# defaults: 3`.
- The three budgets are not written. They change an effort token on a Cursor slug. A Devin alias has no such token.

## Worker

`skills/poteto-mode/worker.md` is ported and marked uncertain in the file. Devin documents subagents as separate conversations with a read tool, and it withholds `ask_user_question` from them. Cloud sessions are separate VMs started with `devin --cloud`, not Cursor Project workers. Nothing in the docs says a child loads a file named in the first line of its task. The instruction is shipped. Following it is untested.

## Checks

- `node --test tests/*.test.mjs` on 2026-11-16: 47 tests passed, 0 failed. That command is the repo's structural check. It is not a native Devin run.
- `git diff --check` passes.

Native Devin activation of 0.11.0 is untested. The worker.md pointer is untested.
