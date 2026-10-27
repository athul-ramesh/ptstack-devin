# Port pstack 0.15.33 to 0.15.35 to Devin

Audited on 2026-10-28 on top of `main` at `75589cf` (PR #10 merged). Plugin version is 0.8.0.

## Source and coverage

Upstream range: [`e73df47...ab1f702`](https://github.com/cursor/plugins/compare/e73df471cd4bd918367e99f3dd9c51bd53ddf5f0...ab1f702ce8e8b6557edb56b09f52cde8bfb83f17) (`pstack/`, 0.15.32 to 0.15.35). All six commits that touch `pstack/` were read.

| Upstream change | Devin disposition |
| --- | --- |
| [#986](https://github.com/cursor/plugins/commit/ab1f702) interrogate adversaries prove findings with a run | Adapted. Adversaries run on the configured `pstack:panel-*` profiles, each in its own root-provisioned worktree via arena Phase A, and may write repro scripts and tests only there. The root reruns each command and keeps a finding only when the output breaks the intent. The four reference files are removed. `delegation.md` names this as the one exception to read-only review briefs. Adversaries need `exec`, so they run in the foreground unless command approval is already granted. |
| #986 arena judge never from the parent's family | Adapted. Devin profiles pin a model rather than a Cursor slug family, so the judge must have a `model:` pin different from the parent session's model. With none, the judge is skipped and Phase D and Outputs say so. Devin does not label the parent's model to the agent, so an unconfirmed parent model is reported as a skipped check. |
| #986 arena drops or replaces a rejected runner seat | Skipped. This port's panel-run forbids automatic model or profile substitution and reports an incomplete panel instead. Changing that is a policy call for the operator. |
| #986 poteto-mode restates the user's goal | Ported as a short section in poteto-mode, plus `## Why` in Opening a PR. |
| #986 background steers and resumes; chained slug fallbacks when the Task tool rejects a slug | Not applicable. Devin resumes subagents only in the foreground ([Subagents](https://docs.devin.ai/cli/subagents)), and `run_subagent` takes a registered profile, not a slug. |
| #986 Explain the Number applies before you measure | Ported in the principle leaf and the principle index. |
| #986 Autopilot playbooks block only on a shown problem; wording-only changes get no verifier; rebase on a concurrent change to the same files | Autopilot stays cut. The blocking rule, the wording-only exemption, and the extra rebase trigger are ported into the Multi-phase plan verdict checklist, which this port already carried. |
| #986 Opening a PR subagent no longer runs interrogate | Ported. |
| #986 autonomous run owns only discoveries that support the goal | Ported. |
| #986 setup-pstack cross-judge pool ordering | Ported in the routing-policy note. |
| #986 ketchup-video subtitles; orchestrate copies store files once; `orch/store.ts` typing | Not applicable. Ketchup-video and the Bun orch scripts are not shipped, and this port's store is a plain local directory. |
| #986 README and guide wording | Help, recipes, README, and release notes follow. Cursor guide pages are not shipped. |
| [#977](https://github.com/cursor/plugins/commit/34b1b7c), [#982](https://github.com/cursor/plugins/commit/740d2c0), [#981](https://github.com/cursor/plugins/commit/519d36a) statechart compiler, trace fix, and test | Skipped. Statechart is still not shipped (see the 0.15.32 audit). The TypeScript compiler now needs Node 22.18+, Bun, or Deno plus TLC, and still renders charts the Devin CLI does not document showing inline. |
| [#978](https://github.com/cursor/plugins/commit/7c7bde7), [#983](https://github.com/cursor/plugins/commit/164ced1) version bumps | Plugin bumped independently to 0.8.0. |

`/pstack:how` used interrogate's four buckets by reference. It now defines them inline, so its critique mode is unchanged.

## Devin compatibility

| Capability | Evidence |
| --- | --- |
| Subagents run commands; background gets only pre-approved tools; resumes run in the foreground | [Subagents](https://docs.devin.ai/cli/subagents). |
| A custom profile's model comes from its `model:` pin; the CLI does not label which model runs | [Subagents](https://docs.devin.ai/cli/subagents). |

## Verification and limits

`node --test tests/*.test.mjs` passes. These are static checks. A native Devin run of the new interrogate flow, including foreground command approval for adversaries, is untested.
