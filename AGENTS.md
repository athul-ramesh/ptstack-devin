# pstack-devin

Local Devin CLI plugin. Not a generic skill pack.

## Default routing

For any non-trivial engineering task (a feature, bug fix, refactor, debugging, performance work, or any multi-step code change), load the poteto-mode skill with the skill tool and follow it. It is the default entry point. Pure questions and trivial one-line edits do not need it. If you were dispatched as a subagent to execute a specific task, ignore this block; poteto-mode governs the orchestrating session and already shaped your dispatch.

User and repository instructions take precedence over this default.

## Plugin conventions

- Skill format: Devin SKILL.md under skills/<name>/SKILL.md.
- Plugin manifest: .devin-plugin/plugin.json.
- Subagents: agents/<name>/AGENT.md. Custom plugin subagents load in local Devin CLI and Devin Desktop, not cloud Devin sessions.
- Hooks: hooks.json (Devin SessionStart). Plugin hooks are best effort and fail open, so they assist routing rather than carry critical obligations alone.
- Model ids: swe, opus, sonnet, codex (and whatever `devin` reports). Never leave claude-* or Cursor slugs in shipped files.
- Tool names in shipped prose: read, edit, grep, glob, exec, skill, run_subagent, read_subagent.
- `run_subagent` takes `profile`, `task`, `title`, `is_background`, and optional `resume`, never a model argument. Collect a worker result with `read_subagent`.
- Invoke sibling skills as /<skill> or the plugin form /pstack:<skill>.
- Drop Cursor `/loop`, Graphite, cloud VM swarms, and AskUserQuestion unless rewritten to Devin. Devin `/loop <prompt>` is an interactive CLI command that runs a prompt then auto-reviews the diff in a loop. It is not Cursor's autonomous "run until X" and is not an agent-callable timer.
- State each capability as documented, locally observed, unavailable, or untested. Do not infer runtime behavior from structure.
