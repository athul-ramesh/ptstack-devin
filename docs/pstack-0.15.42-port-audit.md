# Port pstack 0.15.42 to Devin

Audited on 2026-11-15 on top of `main` at `6e060b5`. PRs #11 (`ab1f702`, 0.8.0) and #13 (`c742dd6`, 0.9.1) are merged. Plugin version is 0.10.0.

## Source and coverage

Upstream range: [`c742dd6...bf0c7cd`](https://github.com/cursor/plugins/compare/c742dd61706fbacc1b95f1a20b7b988cf096ce6c...bf0c7cd80abdbf7fe47b634978a7d1b4071f71a7) (`pstack/`, 0.15.36 to 0.15.42). The squash is [bf0c7cd](https://github.com/cursor/plugins/commit/bf0c7cd80abdbf7fe47b634978a7d1b4071f71a7) (PR #1236). `harness/pstack/claude-code` is the Claude Code mirror and was not ported.

| Upstream change | Devin disposition |
| --- | --- |
| Sharpen's last line asks the agent to prototype a choice an experiment can settle and recommend from what it observed. Product and preference choices stay with the user. | Already present in 0.9.2. README and the usage guide now describe that line. |
| Reflect synthesizer drift example is a function rename. | Adapted. The example is `readConfig` to `loadSettings` in `config.ts`. |
| Why is one short file. Investigators, synthesizer, model routing, output format, and `references/` are deleted. | Adapted. The body is one paragraph plus a Devin line to use `exec` for git and `gh`. It names no source catalog. The reference files are deleted. |
| Recall starts its own investigator per source. | Adapted. One `pstack:panel-opus` investigator each for git history and, when `gh` is authenticated, pull requests and issues. `subagent_explore` is not used, because that profile cannot run `gh`. `run_subagent` has no readonly flag, so the brief forbids writes. |
| Blast radius and teach stop pointing at removed why parts. | Adapted. Blast radius pulls the PR with git and `gh` and cites `file:line` itself. Teach still runs how and why, and no longer asks to narrow a sweep why no longer has. |
| How is one file that starts one read-only subagent. | Adapted. The profile is the documented built-in `subagent_explore`. Explorer, explainer, and critic prompts are deleted. |
| Poteto-mode no longer routes to how. Investigation, Feature, Bug fix, Hillclimb, Perf issue, Refactoring, architect, no-comments, and comment-sicko trace the code. | Adapted in those files. Comment-sicko traces with `read` and `grep` only. Its `allowed-tools` list has no `exec`, so it does not claim to have read the PR. |
| Teach and poteto-help keep how. | Kept. Help, prompting, and the usage guide describe the shorter skills. |
| Setup drops the two why roles and the two how roles. | Adapted. `how explorer`, `how explainer`, `why investigators`, and `why synthesizer` are dropped. `how critics` is dropped with them because the one-file how has no critic panel. |
| New default models, Fable as its own family and the same vendor as Claude, Grok 4.7 no longer a default, and a `# defaults: 2` marker that migrates old defaults. | Partial. See Models below. The marker is written. An unmarked sheet migrates `bug-fix` and `hillclimb` only when the row is still exactly `pstack:poteto-agent-sonnet` and `opus` is available. Other values stay. |
| Statechart SANY error text and parent-border Mermaid arrows. | Ported onto the checker this repo already ships. The drawing and the 40-line SANY section follow the upstream tests. |
| Benny automation tweaks. | Skipped. Benny is not part of this port. |

## Models

Checked [Devin CLI models](https://docs.devin.ai/cli/models), [Desktop models](https://docs.devin.ai/desktop/models) (pricing text dated 2026-11-09), and [Subagents](https://docs.devin.ai/cli/subagents) on 2026-11-15.

The CLI documents short aliases `opus`, `sonnet`, `swe`, `codex`, and `gemini`. A profile `model:` field takes an alias or an id the account allows. Desktop pricing names Claude Fable 5.2 with Low, Medium, High, XHigh, Max, and Fast Mode, and it names Gemini 4 Argon. It does not publish `claude-fable-5-2-max`, `claude-opus-5-5-xhigh`, `claude-opus-5-5-high-fast`, or `gemini-4-carbon-high`. The CLI page does not list `fable` as a short alias. Opus 5.5 is not named.

Shipped pins stay `gpt-6-1-sol-medium` (`opus` and `codex`), `glm-5-3-flash-high` (`sonnet`), and `swe`. No new profile was added.

Role routing that maps onto those pins:

- Feature, refactoring, bug-fix, perf-issue, and hillclimb use `pstack:poteto-agent-opus`. Bug-fix and hillclimb used to default to `sonnet`.
- Strongest judgment stays `pstack:panel-opus`. There is no documented Fable pin to put above it.
- Swarm workers and reflect tooling stay `pstack:panel-sonnet`. Upstream moved them to `claude-opus-5-5-high-fast`. This port has no second opus pin for that speed.
- Arena runners, architect runners, and interrogate reviewers stay `opus`, `swe`, and `sonnet`. The cross-judge pool stays `opus` and `swe`, compared by `model:` pin. Upstream's vendor rule (Fable and other Claude models are one vendor) is not applied, because no shipped pin is a documented Fable id or a Claude Opus 5.5 id.
- The setup budget ladder, `inherit-parent`, and `auto` stay out. `run_subagent` takes a profile, not an effort or a speed.

Grok 4.7 was never a default in this repo. The migration recognizes the old Devin profile rows, not a `grok-*` slug.

## Checks

- `node --test tests/*.test.mjs`: 56 passed.
- `git diff --check`: passes.
- `npm test --prefix skills/statechart/scripts` with TLC 1.7.4 on `TLA2TOOLS`: 373 passed, none skipped. That run includes the SANY line-and-column cases and the parent-border chart tests.

Native Devin activation of 0.10.0 is untested. `subagent_explore` as the how profile is taken from the subagents page and has not been run in this session.
