# Panel run

Parent-owned record for every multi-perspective pass. Workers never own the verdict.

```
PanelRun
  role                 string
  orderedProfiles      pstack:panel-<alias>[]
  requiredPerspectives number
  executionMode        parallel | sequential
  artifacts            path[]
  parentVerdict        string
```

## Resolve

1. Read `$HOME/.config/devin/pstack-models.md` when it exists. Use that role's complete profile list. A missing sheet or row uses the skill's registered-profile default. An unregistered present profile is a configuration error, not permission to substitute.
2. Keep list length. `requiredPerspectives` is that length.
3. Count distinct profiles. If the count is less than `requiredPerspectives`, `executionMode` is `sequential`. Otherwise independent read-only passes may use `parallel`; writers use the isolation rules below.
4. `run_subagent` takes a registered `profile`. Do not pass a free-form model string.

## Start and collect

### Foreground

- Set `is_background: false`. A call blocks until its result returns, so start one blocking call at a time.
- Prefer foreground for a single writer when its tool permissions are not already approved.
- Inspect the returned report and artifact before starting a dependent pass.

### Background

- Set `is_background: true` only for independent calls. Issue those calls without waiting between them and retain every returned agent ID.
- Background workers inherit only permissions already approved in the session. They cannot request new permission. Do not enable blanket dangerous mode to make a run pass.
- Completion notifications provide finished results. To collect explicitly, call `read_subagent` with `agent_id`; its only optional arguments in Devin CLI 3000.6.14 are `block` and `timeout`. Use `block: true` only when no independent parent work remains. Do not poll.
- Inspect every completion and artifact before synthesis. A returned ID, notification, or single completion is not a full panel.

### Repeated profiles and failure

- Make one fresh `run_subagent` call per required perspective. Repeated profiles run sequentially as separate calls. Omit `resume` so each is an independent perspective.
- Resume is only for repairing the same failed worker, such as a background permission denial. Resumed workers always run in the foreground. Resuming on the same profile preserves the mapping; it does not create another perspective.
- Classify failures before acting. Scheduling failure may justify a foreground retry. An unavailable pinned model is not repaired by sequential scheduling. Changing to another or built-in profile changes the mapping and must be explicitly reported as degraded execution.
- Do not automatically retry or substitute models. If a required pass does not complete, report the panel as incomplete with its completed count, failure, and any deliberate degraded execution.
- Give each writer a separate worktree or directory, not merely another branch in the shared checkout. Readers may share inputs.
- The parent writes `parentVerdict`. Worker reports are evidence, not the answer.

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
