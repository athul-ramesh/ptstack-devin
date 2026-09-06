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

1. Read `$HOME/.config/devin/pstack-models.md` when it exists. Use that role's profile list. Missing sheet uses the skill Models defaults.
2. Keep list length. `requiredPerspectives` is that length.
3. Count distinct profiles. If the count is less than `requiredPerspectives`, `executionMode` is `sequential`. Otherwise `executionMode` is `parallel`.
4. `run_subagent` takes a registered profile. Do not pass a free-form model string.

## Spawn

- One `run_subagent` call per perspective. Fresh context each time.
- Parallel means issue every call before waiting. Sequential means finish pass N before starting pass N+1 on the same profile.
- Do not label one pass as a panel.
- Say sequential in the transcript when that is the mode.
- Give each writer its own artifact path. Readers may share inputs.
- The parent writes `parentVerdict`. A worker report is evidence, not the answer.

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
