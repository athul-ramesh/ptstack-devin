# Panel run

Parent-owned record for every multi-perspective pass. Workers never own the verdict.

```
PanelRun
  role                 string
  orderedProfiles      pstack:panel-<alias>[] (configured perspective profiles)
  implementationProfiles pstack:poteto-agent-<alias>[] (resolved writers, including explicit rows)
  requiredPerspectives number
  executionMode        parallel | sequential
  workers              DispatchRecord[] (agentId, profile, modelPin, workspace, branch, state)
  artifacts            path[]
  parentVerdict        string
```

Each worker follows the root-owned lifecycle in [`delegation.md`](delegation.md).
Record a `PanelRun` before the first call and one `DispatchRecord` per worker after it.

Implementation routing is separate from panel perspective routing. When a perspective
writes code, resolve the configured `pstack:panel-<alias>` entry to the registered
`pstack:poteto-agent-<alias>` implementation counterpart. This is a deterministic,
same-pin mapping, not a failure fallback or a model substitution. Before accepting the
mapping, compare the `model:` frontmatter of both registered profiles and require an
exact match. If the pins differ, report a configuration error and do not dispatch. An explicit
`pstack:poteto-agent-<alias>` entry is already an implementation profile and is used
as configured. Investigation, critique, judging, and review perspectives keep their
configured `pstack:panel-*` profile. Preserve the panel's required perspective count.
Every implementation brief follows the single-source procedure in
[`delegation.md`](delegation.md) and includes the complete contract from the absolute
`skills/poteto-mode/references/implementation-worker.md` path resolved by the root.

## Resolve

1. Read `$HOME/.config/devin/pstack-models.md` when it exists. Use that role's complete profile list. A missing sheet or row uses the skill's registered-profile default. An unregistered present profile is a configuration error, not permission to substitute.
2. Keep list length. `requiredPerspectives` is that length.
3. Count distinct profiles. If the count is less than `requiredPerspectives`, `executionMode` is `sequential`. Otherwise independent read-only passes may use `parallel`; writers use the isolation rules below.
4. `run_subagent` takes a registered `profile`. Do not pass a free-form model string.
5. For code-writing perspectives, apply the implementation counterpart mapping above
   before dispatch. Confirm that the mapped profile is registered, compare both
   frontmatter pins for equality, and disclose the actual pin. If either profile is
   unavailable or pins differ, report the blocked configuration.

## Start and collect

### Foreground

- Set `is_background: false`. A call blocks until its result returns, so start one blocking call at a time.
- Prefer foreground for a single writer when its tool permissions are not already approved.
- The foreground call is blocking. Do not promise that the root can interrupt it or add
  unsupported timeout, cancellation, or model parameters. Let it finish, then inspect
  the result and artifact.
- Inspect the returned report and artifact before starting a dependent pass.

### Background

- Set `is_background: true` only for independent calls. Issue those calls without waiting between them and retain every returned agent ID.
- Background workers inherit only permissions already approved in the session. They cannot request new permission. Do not enable blanket dangerous mode to make a run pass.
- Collect each finished worker with `read_subagent` by its retained agent id. It is the supported collection tool and optionally accepts `block` and `timeout`; confirm the installed schema and do not invent fields. A completion notification signals which worker finished, not that its work is correct.
- Collect independent and out-of-order completions separately by id. Never merge two ids into one result. Use foreground dispatch when the session cannot deliver background results.
- Inspect every collected result and artifact before synthesis. A returned ID, notification, or single completion is not a full panel.

### Repeated profiles and failure

- Make one fresh `run_subagent` call per required perspective. Repeated profiles run sequentially as separate calls. Omit `resume` so each is an independent perspective.
- Resume is only for repairing the same failed worker, such as a background permission denial. Resumed workers always run in the foreground. Resuming on the same profile preserves the mapping; it does not create another perspective.
- Classify failures before acting. Scheduling failure may justify a foreground retry. An unavailable pinned model is not repaired by sequential scheduling. Changing to another or built-in profile changes the mapping and must be explicitly reported as degraded execution.
- Classify every non-clean outcome. `failed` has no usable result, so inspect partial filesystem effects. `incomplete` reports its completed and missing portions and is not synthesized over. `cancelled` records what ran and the state it left.
- Do not automatically retry or substitute models. If a required pass does not complete, report the panel as incomplete with its completed count, failure, and any deliberate degraded execution.
- Give each writer the root-provisioned, verified, recorded workspace that [`delegation.md`](delegation.md) requires, not merely another branch in the shared checkout. A separate branch is not isolation. Readers may share inputs. Serialize writers when no safe separate workspace can be established.
- The parent writes `parentVerdict`. Worker reports are evidence, not the answer.
- Ordinary implementation workers report an early checkpoint, progress after each
  independently verifiable unit, and a final check with decisive output. The brief
  supplies a time budget and no-progress rule. Unless the brief sets tighter bounds,
  use a five-minute early-checkpoint target, one fifteen-minute work quantum, and at most
  two failed diagnostic attempts. Record each checkpoint in the worker's owned
  worktree. These are coaching and recovery bounds, not unsupported tool parameters.
  A time budget bounds reporting and recovery decisions; it does not cancel a blocking
  command. On no progress, make bounded safe diagnostics, then retry or resume only
  under the brief's recovery limit. Return at the end of that single quantum, even
  when incomplete. Never claim success from a timeout or partial report.

## Roles this phase

| Role | Default profiles | Count |
|---|---|---|
| how explorer | `pstack:panel-opus` | 1 |
| how explainer | `pstack:panel-opus` | 1 |
| how critics | `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet` | 3 |
| why investigators | `pstack:panel-opus` | 1 |
| why synthesizer | `pstack:panel-opus` | 1 |
| architect runners | `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet` | 3 |
| arena runners | `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet` | 3 |
| arena cross-judge pool | `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet` | 3 |
| interrogate reviewers | `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet` | 3 |
| reflect tooling | `pstack:panel-opus` | 1 |
| reflect judgment, divergent, synthesizer | `pstack:panel-opus` | 1 |
| swarm workers | `pstack:panel-opus` | 1 |
