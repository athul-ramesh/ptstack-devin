# Port pstack 0.15.25 to Devin

Audited on 2026-10-16 on top of the open 0.15.24 port branch (`port/pstack-v0.15.24`, PR #8). Plugin version is 0.6.1, with 37 public skills, 24 internal principle leaves, and 20 playbooks.

## Source and coverage

Upstream range: [`1e5c90a...99743e9`](https://github.com/cursor/plugins/compare/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8...99743e9c151c8537cbbf1f98bb38f34ef3368453) (`pstack/`, 0.15.24 to 0.15.25 and two follow-ups).

| Upstream change | Devin disposition |
| --- | --- |
| [#628](https://github.com/cursor/plugins/pull/628) ketchup explains changes with screenshots, videos, and diagrams | Adapted. Ketchup now helps the user understand each change, shows existing screenshots, videos, and diagrams first, sums up in one bullet per ask, lists action items as plain bullets, and puts a choice after the list. Rendered pictures no longer count toward the 150 words; text fallbacks still do. Every picture stays conditional on the Devin host rendering it, and the text fallback is kept, now linking existing captures. `/visualize` stays dropped because this port does not ship it. |
| [#633](https://github.com/cursor/plugins/pull/633) four principles restated as reasoning | Ported verbatim apart from `triggers: [model]` frontmatter: attack-the-premise (test the premise instead of an actor census), fix-root-causes (a guard is a fix only when the state is legitimate), make-operations-idempotent (derive each step from existing state), test-behavior-not-implementation (break-the-behavior and change-the-internals checks). The poteto-mode principle index and `/pstack:correct` step 3 follow. |
| [#634](https://github.com/cursor/plugins/pull/634) cut marginal sections from four skills | Ported. Lead judgment drops its preamble and verdict calibration. Migrate-callers drops its intro, rule bullets, and closing line, as upstream did. Type-system-discipline drops the illegal-states, constructions, cast, exhaustiveness, and partiality bullets, keeping `/pstack:typescript-best-practices`. Swarm drops its opening sentence and the N-is-total-workers step; Devin PanelRun, workspace, model, and evidence sections are untouched. |
| [#614](https://github.com/cursor/plugins/pull/614) version bump | Plugin bumped independently to 0.6.1. |

## Devin compatibility

| Capability | Evidence |
| --- | --- |
| Model-triggered principle leaves | Documented `triggers` field. [Creating skills](https://docs.devin.ai/cli/extensibility/skills/creating-skills). |
| Inline screenshots, video, Mermaid | Not documented for the Devin CLI terminal. The changelog documents image attachments as input and Markdown table rendering, not inline image or diagram output. Ketchup therefore keeps every picture conditional on the host and keeps the text fallback. [CLI changelog](https://docs.devin.ai/cli/changelog/stable). |

The principle and cut changes are prose-only and touch no Devin tool, profile, hook, or helper.

## Verification and limits

`node --test tests/*.test.mjs` passes, including a new contract test for the ketchup fallback and the rewritten principles. These are static checks. Native 0.6.1 skill registration and inline visual rendering in Devin are untested.
