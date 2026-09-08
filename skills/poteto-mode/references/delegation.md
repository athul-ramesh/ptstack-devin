# Root-owned delegation

The root session owns decomposition, dispatch, dependency gates, reconciliation, and verification. Workers never dispatch workers.

## Resolve and dispatch

1. Classify the pass as implementation, investigation, or review. Select the exact role key named by the active workflow.
2. Read that row from `$HOME/.config/devin/pstack-models.md`. A missing sheet or missing row uses the exact registered-profile default in poteto-mode. An invalid present row does not.
3. Confirm that the selected profile is registered. For an implementation pass, map a legacy `pstack:panel-<alias>` row to `pstack:poteto-agent-<alias>` and require equal `model:` frontmatter pins. Explicit `pstack:poteto-agent-*` rows are used directly and do not require a second source-profile comparison. This is deterministic same-pin routing, not failure fallback. Report an unregistered profile or pin mismatch as a configuration error; do not substitute or claim its intended model ran.
4. Take the installed plugin root from the source path reported when the skill tool loaded poteto-mode. Derive every plugin reference from that root. Do not use the consuming project's current directory, a hard-coded home path, or an unexpanded Markdown environment variable. For an implementation pass, read the resolved absolute `skills/poteto-mode/references/implementation-worker.md` and inline the complete contract in `task`. Investigation and review passes use instructions appropriate to those read-only jobs. Review briefs explicitly prohibit edits.
5. Make the task self-contained. Include absolute project paths and absolute resolved plugin reference paths, scope and exclusions, the settled design and invariants, baseline and check commands, the actual resolved `model:` pin, and the concrete done condition. Every implementation brief must name a unique absolute checkpoint path within the worker's allowed scope, a five-minute checkpoint target, one bounded fifteen-minute work quantum with return even when incomplete, a cap of two no-progress diagnostics, and a root recovery cap of two attempts. If a required resource cannot be resolved, name that exact resource and stop the affected dispatch. Never fall back to a same-named file in the project.
6. Choose foreground or background from dependency and permission needs. Dispatch the call, collect its evidence, and inspect the artifact before accepting the work. Keep concurrent writers in separate worktrees or directories. Otherwise serialize them.

Use [`panel-run.md`](panel-run.md) for supported foreground/background mechanics and
`read_subagent` collection rules.

Do not retry, resume, or dispatch a replacement writer while the prior writer may still
be running or may still own the target worktree. First establish that it has returned
or stopped through supported execution controls. Permission repair resumes the same
worker in the foreground only when a resumable agent ID exists.

Foreground monitoring is unavailable while the blocking call runs. If it hangs, the
operator may use the Devin UI's manual cancellation control, then the root records the
interruption and applies the bounded recovery cap. Background calls use only preapproved
permissions and are collected with `read_subagent`; do not invent cancellation fields.

A `pstack:panel-*` profile is a model-pinned investigation or review profile. For implementation, map it deterministically to the registered `pstack:poteto-agent-*` counterpart with the same `model:` frontmatter pin. This is an implementation routing rule, never a failure fallback. Explicit `pstack:poteto-agent-*` rows are used directly. A dispatch rejection does not authorize a different profile. If no agent ID exists to resume, report the blocked configured pass and inspect any partial filesystem effects; do not issue a substitute call.

## Implementation example

This example is used only after resolving `feature, refactoring` to the legacy `pstack:panel-sonnet` row and then applying the deterministic implementation mapping to `pstack:poteto-agent-sonnet`. It is not a hard-coded feature profile choice.

```json
{
  "profile": "pstack:poteto-agent-sonnet",
  "title": "Implement JSON task output",
  "is_background": false,
  "task": "Project root: /absolute/path/task-summary-cli. Plugin root: /absolute/path/pstack-devin. Scope: edit src/output.js and its existing checks only; checkpoint evidence may be written to the worker-owned /absolute/path/task-summary-cli-worker/checkpoint.md. Exclude commits, publishing, and unrelated changes. Resolved implementation profile: pstack:poteto-agent-sonnet; actual model pin: glm-5-3-flash-high, verified equal to legacy pstack:panel-sonnet. Baseline: node src/output.js and node src/output.js --help. Checks: node src/output.js --json and node src/output.js. Design: --json emits an array of objects with id, title, and done; text output remains unchanged. Applicable principle: read /absolute/path/pstack-devin/skills/principle-boundary-discipline/SKILL.md. Done: record an early checkpoint at /absolute/path/task-summary-cli-worker/checkpoint.md naming inspected files, design, and first check; use one 15-minute work quantum with a 5-minute checkpoint target; after two no-progress diagnostics, stop and report; root recovery is capped at two attempts. Run the CLI once with --json and once without it, and report decisive output, then return at the end of the quantum.\n\nImplementation worker contract:\n[inline the complete contents of /absolute/path/pstack-devin/skills/poteto-mode/references/implementation-worker.md here]"
}
```

Do not add `model`, `subagent_type`, or `run_in_background`. New independent perspectives omit `resume`.
