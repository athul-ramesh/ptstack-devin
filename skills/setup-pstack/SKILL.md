---
name: setup-pstack
description: Configure which models pstack uses per role. Reads `devin models list` and writes `~/.config/devin/pstack-models.md`. Use for /setup-pstack, "configure pstack models", or changing pstack's model choices.
---

# Setup pstack

Write `$HOME/.config/devin/pstack-models.md`. Skills read that sheet for per-role registered `pstack:poteto-agent-<alias>` implementation profiles and `pstack:panel-<alias>` investigation/review profiles. Defaults live in each skill's Models section. This file overrides them. A profile's frontmatter `model:` pin is authoritative; its suffix is only a role and alias label.

Do not write `~/.claude/` or any host path this plugin does not own.

## Default routing policy

`opus` is the strongest configured model, `sonnet` is the medium-capability model for bounded work, and `swe` supplies an alternate model perspective. These labels do not select model families or reasoning levels; configure profile pins separately.

Keep broad features/refactoring, performance diagnosis, synthesis, prose, and final judgment on `opus`. Use `sonnet` for scoped bug fixes, measurable hillclimbing, exploration, evidence gathering, tooling review, and swarm slices. Scope those briefs tightly; select `opus` explicitly when the work requires broad design or difficult diagnosis. Panels retain all three perspectives; the arena cross-judge pool uses `opus` and `swe`. Arena runs one judge and tries only pool entries whose pin differs from the parent's model, in list order, so order the pool by preference.

Keep paired `panel-*` and `poteto-agent-*` model pins equal. Setup writes role routing only; it does not change those pins or the main session model.

## Steps

1. Run `devin models list` with `exec`. Keep every alias from lines that start with `aliases:`. Never write a family slug or an identifier that command did not print.
2. Resolve PluginRoot from the Source line of `devin plugins info pstack`.
3. Pipe that models list into `node "$PluginRoot/skills/setup-pstack/write-models.mjs" --home "$HOME"`. Do not export a different `HOME` for that command. Auth stays in the process environment. `--home` is only the output root. The script maps implementation roles to registered `poteto-agent` profiles and review roles to registered panel profiles, reads an existing sheet first, preserves valid role lists and their order plus operator notes, fills missing roles from current defaults, keeps panel list length, and replaces the file atomically. Default rows use the first available core alias when their preferred alias is absent; existing configured rows are never silently substituted.
4. Apply only explicitly requested changes with repeatable `--role "<role>=<profile>[,<profile>...]"` arguments, for example `--role "how critics=pstack:panel-codex,pstack:panel-codex"`. Validate requested aliases against step 1. The script validates known roles, registered profiles, review/implementation compatibility, and same-pin implementation counterparts for legacy panel entries in implementation roles. Duplicate or invalid role rows and unknown profile-shaped role rows are errors: leave the sheet unchanged and report the exact correction needed. Preserve unknown prose and notes; never discard an unknown role row automatically. Use Markdown headings or ordinary prose for notes, outside role configuration rows.
5. Read the written file. Confirm every profile suffix is an alias from step 1 and every configured choice and note survived. Repeated profiles remain separate fresh-context perspectives, in their configured order. Confirm the single-model fallback paragraph is present.
6. Tell the user the path and to start a new session so profile registration and the sheet both load. Re-running this skill must produce an identical file when inputs and explicit overrides have not changed. Keep the existing registered profile pins; do not add `auto`, `inherit-parent`, reasoning-budget rewriting, or automatic model substitution.
