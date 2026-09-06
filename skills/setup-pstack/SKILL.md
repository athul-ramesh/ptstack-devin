---
name: setup-pstack
description: Configure which models pstack uses per role. Reads `devin models list` and writes `~/.config/devin/pstack-models.md`. Use for /setup-pstack, "configure pstack models", or changing pstack's model choices.
---

# Setup pstack

Write `$HOME/.config/devin/pstack-models.md`. Skills read that sheet for per-role `pstack:panel-<alias>` profiles. Defaults live in each skill's Models section. This file overrides them.

Do not write `~/.claude/` or any host path this plugin does not own.

## Steps

1. Run `devin models list` with `exec`. Keep every alias from lines that start with `aliases:`. Never write a family slug or an identifier that command did not print.
2. Resolve PluginRoot from the Source line of `devin plugins info pstack`.
3. Pipe that models list into `node "$PluginRoot/skills/setup-pstack/write-models.mjs" --home "$HOME"`. Do not export a different `HOME` for that command. Auth stays in the process environment. `--home` is only the output root. The script maps roles to registered panel profiles, fills missing aliases with the first available core alias, keeps panel list length, and replaces the file atomically.
4. If the user named specific aliases in this turn, rerun only after intersecting those names with the detected set. Stop if a named alias is missing.
5. Read the written file. Confirm every profile suffix is an alias from step 1. Confirm the single-model fallback paragraph is present.
6. Tell the user the path and to start a new session so profile registration and the sheet both load. Re-running this skill must produce an identical file when the detected aliases have not changed.
