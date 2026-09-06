### Authoring or modifying a skill

**You own the skill's voice.** Agent-facing prose has a higher bar than human prose. Unhelpful sentences become instructions.

1. Write Devin `SKILL.md` under `skills/<name>/SKILL.md`. Frontmatter uses documented Devin fields only. Tool names are `read`, `edit`, `grep`, `glob`, `exec`, `skill`, and `run_subagent`. Model ids are `swe`, `opus`, `sonnet`, and `codex` unless `devin models list` proved another alias.
2. Validate the skill. Frontmatter has `name` and `description`. Referenced files exist. Cross-skill links resolve. Sibling skills this plugin has not shipped are not named as invocable routes.
3. Test cases if structural. Skip if subjective.
4. Stop at merge-ready. Do not open a PR unless the user asks. When they ask, `playbooks/opening-a-pr.md`.

When in doubt, delete. Prose earns its keep by changing a decision. Tell it to do the thing and skip the reason. Explain only when the rule is confusing without one. Match tone to scope. Point at structural sources. Hardcoded details go stale (`skills/principle-encode-lessons-in-structure/SKILL.md`). Delegate to other skills by path. Do not restate.

**Reply:** summary of the skill, key design decisions, validation notes.
