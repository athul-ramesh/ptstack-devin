# Root-owned delegation

The root session owns decomposition, dispatch, dependency gates, reconciliation, and verification. Workers never dispatch workers.

## Lifecycle

Every dispatch moves through the same ordered stages. No stage is skipped.

1. Resolve the worker profile and the role mapping.
2. Provision and verify the writer's workspace before dispatch.
3. Dispatch with `run_subagent`, retain the returned agent id, and record the brief and the assigned workspace.
4. Wait for a foreground return or a background completion notification. Neither proves the work is correct.
5. Collect the supported result for that agent id with `read_subagent`.
6. Inspect the artifact and the diff in the assigned workspace, then re-run the decisive check.
7. Write the parent verdict. Worker output is evidence, not the answer.

Record one `DispatchRecord` per worker. The root owns it.

```
DispatchRecord
  agentId        returned by run_subagent
  role
  profile        registered pstack profile
  modelPin       configured frontmatter pin, never a claimed runtime model
  workspace      absolute path assigned to this writer
  branch
  base           branch or SHA the workspace started from
  inputBaseline  pre-dispatch snapshot of required inputs, including uncommitted changes
  state          dispatched | running | returned | collected | failed | incomplete | cancelled
  artifacts      absolute paths
  parentVerdict
```

## Resolve and dispatch

1. Classify the pass as implementation, investigation, or review. Select the exact role key named by the active workflow.
2. Read that row from `$HOME/.config/devin/pstack-models.md`. A missing sheet or missing row uses the exact registered-profile default in poteto-mode. An invalid present row does not.
3. Confirm that the selected profile is registered. For an implementation pass, map a legacy `pstack:panel-<alias>` row to `pstack:poteto-agent-<alias>` and require equal `model:` frontmatter pins. Explicit `pstack:poteto-agent-*` rows are used directly and do not require a second source-profile comparison. This is deterministic same-pin routing, not failure fallback. Report an unregistered profile or pin mismatch as a configuration error; do not substitute or claim its intended model ran.
4. Take the installed plugin root from the source path reported when the skill tool loaded poteto-mode. Derive every plugin reference from that root. Do not use the consuming project's current directory, a hard-coded home path, or an unexpanded Markdown environment variable. For an implementation pass, read the resolved absolute `skills/poteto-mode/references/implementation-worker.md` and inline the complete contract in `task`. Investigation and review passes use instructions appropriate to those read-only jobs. Review briefs explicitly prohibit edits.
5. Make the task self-contained. Include absolute project paths, the assigned workspace path, and absolute resolved plugin reference paths, scope and exclusions, the settled design and invariants, baseline and check commands, the actual resolved `model:` pin, and the concrete done condition. Every implementation brief must name a unique absolute checkpoint path within the worker's allowed scope, a five-minute checkpoint target, one bounded fifteen-minute work quantum with return even when incomplete, a cap of two no-progress diagnostics, and a root recovery cap of two attempts. If a required resource cannot be resolved, name that exact resource and stop the affected dispatch. Never fall back to a same-named file in the project.
6. Choose foreground or background from dependency and permission needs. Provision the workspace per Writer isolation before dispatch. Dispatch the call, retain the returned agent id, collect its evidence, and inspect the artifact before accepting the work.

Use [`panel-run.md`](panel-run.md) for supported foreground/background mechanics and
completion collection rules.

Do not retry, resume, or dispatch a replacement writer while the prior writer may still
be running or may still own the target worktree. First establish that it has returned
or stopped through supported execution controls. Permission repair resumes the same
worker in the foreground only when a resumable agent ID exists.

Foreground monitoring is unavailable while the blocking call runs. If it hangs, the
operator may use the Devin UI's manual cancellation control, then the root records the
interruption and applies the bounded recovery cap. Background calls use only preapproved
permissions and return results through completion notifications. If notifications are
unavailable, choose foreground before dispatch. Do not invent cancellation fields.

A `pstack:panel-*` profile is a model-pinned investigation or review profile. For implementation, map it deterministically to the registered `pstack:poteto-agent-*` counterpart with the same `model:` frontmatter pin. This is an implementation routing rule, never a failure fallback. Explicit `pstack:poteto-agent-*` rows are used directly. A dispatch rejection does not authorize a different profile. If no agent ID exists to resume, report the blocked configured pass and inspect any partial filesystem effects; do not issue a substitute call.

## Collection and verdict

- `read_subagent` is the documented collection tool. Pass the retained `agent_id`; it optionally accepts `block` and `timeout`. Confirm the installed CLI schema before relying on a field. Do not invent arguments and do not busy-poll.
- A completion notification names which worker finished. It is a signal to collect, not proof. Collect every dispatched id, including workers that finish out of order.
- A collected report can still be wrong or partial. Inspect the artifact at the recorded workspace path, read the diff, and re-run the decisive check on the real surface. Set the record to `collected` only after inspection.
- Classify every non-clean outcome before acting. `failed` has no usable result, so inspect any partial filesystem effects in the assigned workspace. `incomplete` reports its completed and missing portions and is not synthesized over. `cancelled` records what ran and the state it left.
- Independent and out-of-order completions keep their own ids and records. Never merge two workers into one result.
- Resume is only for repairing the same failed or cancelled worker through the retained `resume` field. It is not a new perspective and not a substitute.

## Permission recovery

- Foreground workers prompt for approval like the root. Background workers inherit only pre-approved permissions and cannot prompt. For work that may need approval, prefer foreground or obtain a correctly scoped preauthorization before dispatch. Do not enable blanket dangerous mode.
- A rejection is the answer. Do not launch a substitute worker or a different profile to evade it.
- When the same worker has a returned id, resume that worker in the foreground to approve the pending call. Resumed subagents always run in the foreground.
- When no resumable id exists, report the blocked configured pass and inspect any partial filesystem effects. Do not claim the intended model ran.

## Root verification

- The root reviews the diff, the scope, and the real behavior before accepting a worker's pass. Re-running the brief's command is not the same as verifying the user-facing outcome.
- Record the configured profile mapping, the `profile` plus its frontmatter `model:` pin, separately from runtime model metadata. The CLI does not label a running subagent's model in the subagent panel. Without runtime metadata, do not claim which model served the worker. The mapping is a configuration fact, not an observed runtime identity.

## Writer isolation

`run_subagent` does not create a worktree and takes no working-directory argument. The root provisions and verifies the workspace before dispatch. Never let two writers edit one checkout concurrently.

1. Establish the task's input baseline before provisioning. Inspect staged, unstaged, and untracked changes in the source checkout, including uncommitted prerequisites from earlier workers. Identify the inputs the task requires and capture a stable snapshot of their current contents, deletions, and file modes. Do not commit, stash, reset, or otherwise alter user changes merely to provision a worker.
2. Create or select a separate workspace outside the project checkout. For a git project use a worktree, `git -C <project> worktree add <absolute-worktree-path> -b <branch> <base>`. A branch or SHA supplies only committed files: transfer the required uncommitted inputs into the worktree, including staged and unstaged changes and required untracked files. Preserve their effective working contents; do not apply overlapping staged and unstaged changes twice. For non-git work copy the required inputs into a separate directory. Do not create the workspace inside the user's dirty checkout. If the required inputs cannot be identified or transferred safely, use the serial fallback in step 7.
3. Verify the workspace. `git -C <absolute-worktree-path> rev-parse --show-toplevel` must equal the worktree path. Record `git -C <absolute-worktree-path> rev-parse HEAD` as the base SHA, then verify that the required input contents, deletions, and file modes match the captured snapshot. A matching HEAD alone is not sufficient. Record `workspace`, `branch`, `base`, `inputBaseline`, and `owner` in the `DispatchRecord` and pass the absolute path and baseline in the brief. Keep the pre-dispatch snapshot so subsequent review distinguishes inherited changes from the worker's edits.
4. Instruct the worker that every read, edit, and `exec` command targets the assigned path, using `git -C <absolute-worktree-path> ...` and absolute file paths. Do not assume the worker's current directory.
5. Inspect the assigned workspace after return. The diff must originate there. If a worker wrote into the shared checkout or another writer's workspace, fail preflight, discard the stray edits, and serialize.
6. Compare the returned workspace against `inputBaseline` when attributing worker edits; the diff against HEAD also includes inherited uncommitted inputs.
7. When a safe separate workspace cannot be established, serialize writers in the checkout containing the required inputs instead of running concurrently. Establish that no prior writer is still running there, record its pre-dispatch input baseline, and assign that checkout's absolute path explicitly. Readers may share inputs.
8. Preserve user changes. Leave worktrees and branches in place. Removing them is the explicit Worktree cleanup playbook, not part of delegation.

## Implementation example

This example is used only after resolving `feature, refactoring` to the legacy `pstack:panel-sonnet` row and then applying the deterministic implementation mapping to `pstack:poteto-agent-sonnet`. It is not a hard-coded feature profile choice.

```json
{
  "profile": "pstack:poteto-agent-sonnet",
  "title": "Implement JSON task output",
  "is_background": false,
  "task": "Project root: /absolute/path/task-summary-cli. Assigned worktree: /absolute/path/task-summary-cli-worktrees/feature-json, branch poteto/feature-json, base main at <sha>. Work only there with git -C /absolute/path/task-summary-cli-worktrees/feature-json and absolute paths under it. Plugin root: /absolute/path/pstack-devin. Scope: edit src/output.js and its existing checks only; checkpoint evidence may be written to the worker-owned /absolute/path/task-summary-cli-worktrees/feature-json/checkpoint.md. Exclude commits, publishing, and unrelated changes. Resolved implementation profile: pstack:poteto-agent-sonnet; actual model pin: glm-5-3-flash-high, verified equal to legacy pstack:panel-sonnet. Baseline: node src/output.js and node src/output.js --help. Checks: node src/output.js --json and node src/output.js. Design: --json emits an array of objects with id, title, and done; text output remains unchanged. Applicable principle: read /absolute/path/pstack-devin/skills/principle-boundary-discipline/SKILL.md. Done: record an early checkpoint at the assigned worktree's checkpoint.md naming inspected files, design, and first check; use one 15-minute work quantum with a 5-minute checkpoint target; after two no-progress diagnostics, stop and report; root recovery is capped at two attempts. Run the CLI once with --json and once without it, and report decisive output, then return at the end of the quantum.\n\nImplementation worker contract:\n[inline the complete contents of /absolute/path/pstack-devin/skills/poteto-mode/references/implementation-worker.md here]"
}
```

Use only documented `run_subagent` fields. Select the model through the registered profile, not an extra argument. New independent perspectives omit `resume`.
