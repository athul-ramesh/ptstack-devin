# pstack-devin

Local Devin CLI plugin. Not a generic skill pack.

- Skill format: Devin SKILL.md under skills/<name>/SKILL.md.
- Plugin manifest: .devin-plugin/plugin.json.
- Subagents: agents/<name>/AGENT.md.
- Hooks: hooks.json (Devin SessionStart).
- Model ids: swe, opus, sonnet, codex (and whatever `devin` reports). Never leave claude-* or Cursor slugs in shipped files.
- Tool names in shipped prose: read, edit, grep, glob, exec, skill, run_subagent.
- Invoke sibling skills as /<skill> or the plugin form /pstack:<skill>.
- Resolve every `skills/`, `agents/`, `playbooks/`, and `references/` path in a pstack skill against the installed plugin root. Read `$HOME/.config/devin/pstack-root` (run `/pstack:setup-pstack` to create it) and use that absolute path as the prefix. Never resolve pstack paths from the consuming project directory.
- Drop Cursor /loop, Graphite, cloud VM swarms, AskUserQuestion unless rewritten to Devin.
