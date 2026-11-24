# Port pstack 0.15.47 and 0.15.48 `/reframe` to Devin

Audited on 2026-11-24 on branch `port/pstack-9e278fe` (base `9726ada`, plugin 0.13.0). Selective port of upstream `/reframe` only.

## Source commits

| Commit | PR | Topic |
| --- | --- | --- |
| [`2dd5c0c`](https://github.com/cursor/plugins/commit/2dd5c0ccc5b207dc23a69759871a35954082cbf7) | [#1324](https://github.com/cursor/plugins/pull/1324) | Add `/reframe` (pstack 0.15.47) |
| [`9e278fe`](https://github.com/cursor/plugins/commit/9e278fe4d4ecd8bfe98b1b79bf4be662efb338cc) | [#1326](https://github.com/cursor/plugins/pull/1326) | List the problems a vague description could be (pstack 0.15.48) |

## Disposition

| Upstream change | Devin disposition |
| --- | --- |
| `skills/reframe/SKILL.md` | **Adapted.** `/pstack:reframe` with `triggers: [user]` and `permissions.deny: [edit]`. The body keeps the final 0.15.48 steps, including the two-or-three problem list. One Devin line says to hand back the terms and the rewrite and not start the task, because the always-on rule otherwise routes nontrivial work to poteto-mode. Link checks name `webfetch`. |
| README skills-table row | **Adapted.** This README has no skills table. `## Using 0.13.0` states the same steps, including the vague-description list from #1326. |
| `docs/guide/02-poteto-mode.md` | **Adapted** into [`docs/usage-guide.md`](usage-guide.md). Upstream left that chapter unchanged in #1326. This guide includes the vague-description step so it matches the shipped skill. |
| `skills/poteto-help/SKILL.md` row | **Adapted** to `/pstack:reframe`. #1326 did not change the help row. A close-call line separates it from `/pstack:sharpen`. |
| Recipes | **Added.** Upstream has no recipes file. This port's [`skills/poteto-help/references/recipes.md`](../skills/poteto-help/references/recipes.md) gets a copyable prompt, matching sharpen. |
| Version 0.15.47 then 0.15.48 | **Skipped as a number.** This plugin versions on its own. 0.12.0 and 0.12.1 are already shipped, so a new skill is 0.13.0. |
| Harness tree (`harness/pstack/claude-code/` and the duplicate `pstack/` `plugin.json` copies) | **Skipped.** This repo is the Devin plugin root. It has no generated harness tree to regenerate. |

## Devin compatibility

| Capability | Evidence |
| --- | --- |
| User-only skills | Documented `triggers` field, default `[user, model]`. Set `triggers: [user]` so the model does not invoke the skill. [Creating skills](https://docs.devin.ai/cli/extensibility/skills/creating-skills), [Skills overview](https://docs.devin.ai/cli/extensibility/skills/overview). |
| `disable-model-invocation` | The product skills page names it as an alias of `triggers: ["user"]`. The CLI creating-skills table does not list that key. This port uses `triggers` only, matching `/pstack:sharpen`. [Devin skills](https://docs.devin.ai/product-guides/skills). |
| `permissions.deny: [edit]` | Documented. `deny` blocks a tool for an inline skill. Tool name `edit` is in the allowed-tools list. [Creating skills](https://docs.devin.ai/cli/extensibility/skills/creating-skills). Ketchup already uses this block. |
| Plugin slash form | Installing a plugin makes its skills available as `/<plugin>:<skill>`. Plugin name is `pstack`. [Plugins](https://docs.devin.ai/cli/extensibility/plugins/overview). |
| `webfetch` | The CLI changelog names `webfetch` as the read-only URL tool and as a `disabled_tools` entry, separate from `web_search`. Fetch prompts in Normal mode. [Changelog](https://docs.devin.ai/cli/changelog/stable), [Permissions](https://docs.devin.ai/cli/reference/permissions). |
| `platforms: ["local"]` | Unchanged. The plugin still loads only in Devin CLI and Devin Desktop. |

## Uncertain

Native registration and `/pstack:reframe` activation on Devin CLI and Desktop were not run. These checks are static.

`webfetch` is the documented tool name. This session did not call it. If fetch is disabled or the user denies the prompt, the skill already says to cut the citation. Whether a skill body is enough for the agent to select that tool is untested.

## Checks

Measured on 2026-11-24 in this worktree:

- `node --test tests/*.test.mjs`: 59 passed, 0 failed. `tests/port-contracts.test.mjs` expects plugin version `0.13.0` and user-only `/pstack:reframe`.
- `git diff --check` passes.
- Public skill count is 44. Principle leaves stay 24. Playbooks stay 19.

Native activation of 0.13.0 remains untested.
