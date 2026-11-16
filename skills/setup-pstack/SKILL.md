---
name: setup-pstack
description: Configure which models pstack uses per role. Reads `devin models list` and writes `~/.config/devin/pstack-models.md`. Use for /setup-pstack, "configure pstack models", or changing pstack's model choices.
---

# Setup pstack

Write `$HOME/.config/devin/pstack-models.md`. Skills read that sheet for per-role registered `pstack:poteto-agent-<alias>` implementation profiles and `pstack:panel-<alias>` investigation/review profiles. Defaults live in each skill's Models section. This file overrides them. A profile's frontmatter `model:` pin is authoritative; its suffix is only a role and alias label.

Do not write `~/.claude/` or any host path this plugin does not own.

## Default routing policy

`opus` is the strongest configured pin. Feature, refactoring, bug-fix, perf-issue, and hillclimb all use it. Judgment, prose, and strongest judgment use the `opus` review profile. `sonnet` stays the faster pin for swarm workers. `swe` supplies an alternate perspective. These labels do not select a Cursor slug or a reasoning level.

Devin documents the family aliases `opus`, `sonnet`, `swe`, `codex`, and `gemini` ([Models](https://docs.devin.ai/cli/models)). A custom profile's `model:` field takes an alias or a model id the account allows ([Subagents](https://docs.devin.ai/cli/subagents)). Desktop pricing names Claude Fable 5.2, with Low through Max and Fast Mode, and Gemini 4 Argon. It does not publish `claude-fable-5-2-high`, `claude-opus-5-5-xhigh-fast`, or `gemini-4-carbon-high`, and the CLI page does not list `fable` as a short alias. This setup does not write those slugs. Shipped pins stay `gpt-6-1-sol-medium`, `glm-5-3-flash-high`, and `swe`. Upstream's three budgets (`large`, `medium`, `small`) only change an effort token on those slugs. This port does not write a budget line, because a Devin alias has no effort token and `run_subagent` takes a profile.

Panels keep three profiles. The arena cross-judge pool stays `opus` and `swe`. Arena runs one judge and tries only pool entries whose pin differs from the parent's model, in list order, so order the pool by preference. Fable and other Claude models are one vendor in upstream arena. No shipped pin is a documented Fable id or a Claude Opus 5.5 id, so this port still compares pins. Outside a panel, upstream runs Fable 5.2 only when the user names it or after two Opus 5.5 xhigh runs fail. There is no Fable profile to apply that exception to.

Keep paired `panel-*` and `poteto-agent-*` model pins equal. Setup writes role routing only. It does not change those pins, the main session model, or a reasoning budget.

The writer drops retired roles (`how explorer`, `how explainer`, `how critics`, `why investigators`, `why synthesizer`, `architect runners`, `reflect tooling`, `reflect judgment, divergent, synthesizer`). A sheet with neither `# defaults: 3` nor `# defaults: 2` is from an older setup. Where `bug-fix` or `hillclimb` is still exactly `pstack:poteto-agent-sonnet` and `opus` is in `devin models list`, that row becomes `pstack:poteto-agent-opus`. A sheet that already has `# defaults: 2` keeps every other choice, including a `sonnet` row, and the writer replaces that marker with `# defaults: 3`. Every other value stays. The script prints each replacement and each dropped role on stderr. A sheet that already has `# defaults: 3` is left alone aside from explicit overrides. Tell the user which rows moved.

## Steps

1. Run `devin models list` with `exec`. Keep every alias from lines that start with `aliases:`. Never write a family slug or an identifier that command did not print.
2. Resolve PluginRoot from the Source line of `devin plugins info pstack`.
3. Pipe that models list into `node "$PluginRoot/skills/setup-pstack/write-models.mjs" --home "$HOME"`. Do not export a different `HOME` for that command. Auth stays in the process environment. `--home` is only the output root. The script maps implementation roles to registered `poteto-agent` profiles and review roles to registered panel profiles, reads an existing sheet first, preserves valid role lists and their order plus operator notes, fills missing roles from current defaults, keeps panel list length, writes `# defaults: 3`, applies the migration in Default routing policy, and replaces the file atomically. Default rows use the first available core alias when their preferred alias is absent. A configured row changes only under that migration, or under an explicit `--role` override.
4. Apply only explicitly requested changes with repeatable `--role "<role>=<profile>[,<profile>...]"` arguments, for example `--role "arena runners=pstack:panel-codex,pstack:panel-codex"`. Validate requested aliases against step 1. The script validates known roles, registered profiles, review/implementation compatibility, and same-pin implementation counterparts for legacy panel entries in implementation roles. Duplicate or invalid role rows and unknown profile-shaped role rows are errors: leave the sheet unchanged and report the exact correction needed. Preserve unknown prose and notes. Drop only the retired roles named above. Use Markdown headings or ordinary prose for notes, outside role configuration rows.
5. Read the written file. Confirm every profile suffix is an alias from step 1 and every configured choice and note survived. Repeated profiles remain separate fresh-context perspectives, in their configured order. Confirm the single-model fallback paragraph is present.
6. Tell the user the path and to start a new session so profile registration and the sheet both load. Re-running this skill must produce an identical file when inputs and explicit overrides have not changed. Keep the existing registered profile pins; do not add `auto`, `inherit-parent`, reasoning-budget rewriting, or automatic model substitution.
