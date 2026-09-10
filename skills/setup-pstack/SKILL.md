---
name: setup-pstack
description: Configure pstack. Reads `devin models list` and writes `~/.config/devin/pstack-models.md` and `~/.config/devin/pstack-root`. Use for /setup-pstack, "configure pstack models", or changing pstack's model choices.
---

# Setup pstack

Write `$HOME/.config/devin/pstack-models.md` and `$HOME/.config/devin/pstack-root`. Skills read the sheet for per-role registered `pstack:poteto-agent-<alias>` implementation profiles and `pstack:panel-<alias>` investigation/review profiles. They read `pstack-root` as the absolute installed pstack path for every `skills/`, `agents/`, and `playbooks/` reference. Defaults live in each skill's Models section. The sheet overrides them. A profile's frontmatter `model:` pin is authoritative; its suffix is only a role and alias label.

Do not write `~/.claude/` or any host path this plugin does not own.

## Steps

1. Run `devin models list` with `exec`. Keep every alias from lines that start with `aliases:`. Never write a family slug or an identifier that command did not print.
2. Resolve PluginRoot from the Source line of `devin plugins info pstack`.
3. Pipe that models list into `node "$PluginRoot/skills/setup-pstack/write-models.mjs" --home "$HOME" --plugin-root "$PluginRoot"`. Do not export a different `HOME` for that command. Auth stays in the process environment. `--home` is only the output root. The script maps implementation roles to registered `poteto-agent` profiles and review roles to registered panel profiles, verifies each generated `pstack:panel-<alias>` and `pstack:poteto-agent-<alias>` profile is shipped, fills missing aliases with the first available core alias, keeps panel list length, replaces the file atomically, and writes the `pstack-root` cache with the same absolute path.
4. If the user named specific aliases in this turn, rerun only after intersecting those names with the detected set. Stop if a named alias is missing or if no shipped profile exists for it.
5. Read the written `pstack-models.md`. Confirm every profile suffix is an alias from step 1, every profile directory exists under `<PluginRoot>/agents/`, and the `pstack-root` paragraph is present. Read the written `pstack-root` file and confirm it equals the resolved PluginRoot.
6. Tell the user both paths and to start a new session so profile registration, the sheet, and the root cache all load. Re-running this skill must produce identical files when the detected aliases and plugin root have not changed.
