# Port pstack 0.15.23 to Devin

Audited on 2026-10-13 against Devin baseline `191a0fb45797a5177f10390e4b1008b945a74fa9`. Plugin version is 0.5.0, with 36 public skills, 24 internal principle leaves, and 20 playbooks.

## Source and coverage

The pinned [upstream commit](https://github.com/cursor/plugins/commit/dbf49813a39c1a5389c5e28cb8e4c1c2379e2454) is `dbf49813a39c1a5389c5e28cb8e4c1c2379e2454`. Both upstream manifests report 0.15.23. Compare against `978ca6e9c0e012047cd5058b8e829240336e704e`, the source of the previous ketchup port. This is a selective update from the existing 0.4.0 Devin release, not byte-for-byte upstream parity. The earlier #509 setup nudge and #511 Cursor model defaults remain outside this update.

| Upstream change | Devin disposition |
| --- | --- |
| [#570](https://github.com/cursor/plugins/pull/570), [#595](https://github.com/cursor/plugins/pull/595) | Port short ketchup replies, grounded status and decision visuals, numeric checks, and no duplicate facts. Narrow visuals to available host capabilities. Retain explicit disclosure of unavailable status checks. |
| [#571](https://github.com/cursor/plugins/pull/571) | Preserve independently loaded Devin principle leaves and source-research guidance. Removing them would lose guidance that upstream keeps in its inline principle index. Retain cleanup safety and the Babysit reply contract. Sentry and Slack sources are absent from this port. |
| [#486](https://github.com/cursor/plugins/pull/486) | Already satisfied. The registered profile and references use `comment-sicko`. No rename is needed. |
| [#536](https://github.com/cursor/plugins/pull/536) | Port delimiter-aware Markdown fence scanning into the existing exported `validatePlan` API. Preserve the Devin plan skeleton, receipt checks, and placeholder policy. |
| [#484](https://github.com/cursor/plugins/pull/484) | Exclude the watch-pr pagination patch. This port has no watch-pr helper. Its bounded Babysit uses `gh`; importing the watcher would introduce a separate workflow. |
| [#572](https://github.com/cursor/plugins/pull/572) | Remove the always-apply wording from the unslop description. Preserve ordinary Devin activation. |
| [#574](https://github.com/cursor/plugins/pull/574) | Port remote-default and explicit-base worktree audits, help, validation, and explicit remote fetches. Exclude Cursor transcript scanning. Also prevent closed-unmerged or other-base PRs from supplying merge evidence. |
| [#575](https://github.com/cursor/plugins/pull/575) | Already satisfied by root-owned dispatch and scoped implementation profiles. Do not make delegates reload poteto-mode or spawn workers. |
| [#576](https://github.com/cursor/plugins/pull/576) | Omit the redundant Agent Plugins root manifest. Devin supports this format, but this port already uses the higher-precedence native manifest. This is a packaging choice, not an unsupported capability. |
| [#573](https://github.com/cursor/plugins/pull/573) | Port usable-state readiness, seed-precondition failures, and explicit gaps when proof uses a stand-in. Retain `.devin/skills` output and `VerificationReceipt`. |
| [#577](https://github.com/cursor/plugins/pull/577) | Already satisfied by installed-root resolution and absolute worker references. Correct the verification skill's reference to a relative Markdown link. |
| [#597](https://github.com/cursor/plugins/pull/597) | Preserve Devin root ownership and explicit `/pstack:poteto-mode` activation. Skip Cursor menu advice, private plugin-cache scanning, and Cursor metadata. Devin uses documented triggers and loaded-source identity. |
| [#602](https://github.com/cursor/plugins/pull/602), [#606](https://github.com/cursor/plugins/pull/606) | Add user-only `/pstack:in-your-own-words`, the help entry, and a recipe. Use the final goals-and-problem wording. Do not carry the superseded confirmation gate. |
| [#604](https://github.com/cursor/plugins/pull/604) | Add the proposal for a cheap continuous signal after deep debugging. It is a proposal, not permission to install monitoring or change infrastructure. |
| [#581](https://github.com/cursor/plugins/pull/581), [#584](https://github.com/cursor/plugins/pull/584), [#605](https://github.com/cursor/plugins/pull/605) | Track upstream version history in this audit. Increment the independently versioned Devin plugin to 0.5.0. |

Reproduce the inventory from a cursor/plugins checkout:

```sh
git log --oneline 978ca6e..dbf4981 -- pstack
git diff --name-status 978ca6e dbf4981 -- pstack
git show dbf4981:pstack/.cursor-plugin/plugin.json
git show dbf4981:pstack/plugin.json
```

## Devin compatibility

| Capability | Evidence status and port decision |
| --- | --- |
| Skill namespace and native manifest | Documented. Keep `.devin-plugin/plugin.json` and `/pstack:<skill>`. [Official plugin reference](https://docs.devin.ai/cli/extensibility/plugins/overview). |
| User-only invocation | Documented. Use `triggers: [user]` for goal playback and ketchup. Do not import Cursor activation fields. [Official skill format](https://docs.devin.ai/cli/extensibility/skills/creating-skills). |
| Local custom workers | Documented and historically observed in 0.2.0. Preserve registered profiles and their model pins. Dispatch accepts profiles rather than a model parameter. Current-release dispatch is untested. [Official subagent reference](https://docs.devin.ai/cli/subagents). |
| Plugin agents in cloud | Unavailable according to the documented surface limitation. Keep this a local CLI/Desktop workflow. Plugin hooks are best effort and fail open. [Official plugin reference](https://docs.devin.ai/cli/extensibility/plugins/overview). |
| Visual rendering | Untested for this release and not guaranteed by the cited CLI references. This plugin supplies no renderer. Use existing captures or available host tools; fall back to compact text, counting diagram source and Markdown tables toward the limit. |
| Scheduled wakeup | Unavailable in this port. The documented interactive `/loop` reviews a prompt's diff; it supplies no timer contract for this plugin. Shipping and autopilot remain cut. [Official command reference](https://docs.devin.ai/cli/reference/commands). |
| Root Agent Plugins manifest | Documented as compatible. Omitted because the native manifest takes precedence and already describes this plugin. [Official plugin reference](https://docs.devin.ai/cli/extensibility/plugins/overview). |

Ketchup remains observational. Its only additional write allowance is a local reply visual derived from facts already available. It does not launch an app, create a job, install tools, or post externally to make one. The fallback retains user decisions, costs, recommendations, and unknowns within 250 words. Missing UI captures remain disclosed.

## Design and execution

Retain the local helpers and port their behavior at the existing boundaries. Importing upstream helpers wholesale would replace the Devin plan contract and introduce Cursor session-storage assumptions. Keep independently activated leaves complete. These decisions apply Sequence Verifiable Units and Prove It Works through small behavioral changes and direct helper execution.

The root performed prose edits. Native implementation dispatch was attempted through local Devin CLI 3000.11.3, using the configured bug-fix profile `pstack:poteto-agent-sonnet` with pin `glm-5-3-flash-high`. The coordinator encountered a non-interactive permission rejection before returning any worker identity. The first launch also showed that documented smart mode is unavailable in this installed build. No worker or runtime model identity is claimed. The isolated writer worktree remained untouched.

The user explicitly authorized inline fixes and asked to skip further Devin CLI testing after failure. Scripts and tests were therefore completed inline. Native exploration, design panels, comment review, and independent configured-profile audits were skipped because that dispatch path was unavailable. Root review is not represented as a panel result. Two designs were considered by the root, retaining the helpers or replacing them with upstream versions. The existing-boundary design was selected for the compatibility reasons above.

Throughput checkpoint. One executable helper at a time, then its focused tests. No watcher, renderer, new dependency, model remapping, or permission bypass was added. The native dispatch attempt returned before inline edits began.

## Verification and limits

The baseline passed 42 tests. The final port passed all 50 tests. Bash and Node syntax checks passed. `git diff --check` passed. The tests exercise real helper subprocesses and disposable Git repositories; PR lookup uses an explicit fixture in those repositories. They do not prove agent compliance with prose or real GitHub lookup. The 17 focused helper checks passed against this port; eight failed against the original revision. Test fixtures include default `develop`, missing `origin/HEAD`, alternate bases in a single-branch clone, paths with spaces, invalid arguments, open PRs on any base, closed-unmerged PRs, and unavailable PR lookup.

Scenario review covers explicit-user goal playback without a confirmation gate, ketchup with unavailable rendering and unknown costs, missing screenshots, older unresolved decisions, readiness during database initialization, absent seed preconditions, stand-in setup gaps, and a debug finding that merits a monitoring proposal without an unsolicited infrastructure change.

Native 0.5.0 skill registration, slash activation, model behavior, and visual rendering remain untested. The installed native plugin is a separate 0.2.0 copy, so its inventory does not verify this working tree. Historical [port verification](port-verification.md) remains evidence for that older release only. No new native installation was performed.
