# Root-owned delegation

The root session owns decomposition, dispatch, dependency gates, reconciliation, and verification. Workers never dispatch workers.

## Resolve and dispatch

1. Classify the pass as implementation, investigation, or review. Select the exact role key named by the active workflow.
2. Read that row from `$HOME/.config/devin/pstack-models.md`. A missing sheet or missing row uses the exact registered-profile default in poteto-mode. An invalid present row does not.
3. Confirm that the selected profile is registered. Preserve the configured profile exactly. Do not translate it to another profile or pass a model field. Report an unregistered configured value as a configuration error; do not substitute or claim its intended model ran.
4. Take the installed plugin root from the source path reported when the skill tool loaded poteto-mode. Derive every plugin reference from that root. Do not use the consuming project's current directory, a hard-coded home path, or an unexpanded Markdown environment variable. For an implementation pass, read the resolved absolute `skills/poteto-mode/references/implementation-worker.md` and inline the complete contract in `task`. Investigation and review passes use instructions appropriate to those read-only jobs. Review briefs explicitly prohibit edits.
5. Make the task self-contained. Include absolute project paths and absolute resolved plugin reference paths, scope and exclusions, the settled design and invariants, the concrete done condition, and required output. If a required resource cannot be resolved, name that exact resource and stop the affected dispatch. Never fall back to a same-named file in the project.
6. Choose foreground or background from dependency and permission needs. Dispatch the call, collect its evidence, and inspect the artifact before accepting the work. Keep concurrent writers in separate worktrees or directories. Otherwise serialize them.

A `pstack:panel-*` profile is a model-pinned execution profile. One implementation call on that profile is one worker pass, not a multi-perspective panel. A dispatch rejection does not authorize a different profile. If no agent ID exists to resume, report the blocked configured pass and inspect any partial filesystem effects; do not issue a substitute call.

## Implementation example

This example is used only after resolving `feature, refactoring` to `pstack:panel-sonnet`. It is not a hard-coded feature profile choice.

```json
{
  "profile": "pstack:panel-sonnet",
  "title": "Implement JSON task output",
  "is_background": false,
  "task": "Project root: /absolute/path/task-summary-cli. Plugin root: /absolute/path/pstack-devin. Scope: edit src/output.js and its existing checks only. Exclude commits, publishing, and unrelated cleanup. Design: --json emits an array of objects with id, title, and done; text output remains unchanged. Applicable principle: read /absolute/path/pstack-devin/skills/principle-boundary-discipline/SKILL.md. Done: run the CLI once with --json and once without it, and report decisive output.\n\nImplementation worker contract:\n[inline the complete contents of /absolute/path/pstack-devin/skills/poteto-mode/references/implementation-worker.md here]"
}
```

Do not add `model`, `subagent_type`, or `run_in_background`. New independent perspectives omit `resume`.
