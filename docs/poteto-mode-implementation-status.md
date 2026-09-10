# Poteto-mode implementation status

Date: 2026-09-10
Session scope: Tasks 00-07 from [`poteto-mode-parity-findings-and-plan.md`](poteto-mode-parity-findings-and-plan.md). Tasks 08-09 are explicitly out of scope.
Environment: Devin CLI 3000.10.21 (611c1cba), local CLI on macOS (darwin), plugin `pstack` 0.1.0. `devin plugins list` reports no plugins installed, so native runtime validation is blocked; no runtime behavior is claimed.

## Completed tasks

| Task | Finding | Outcome |
| --- | --- | --- |
| 00 | F02, F03, F10 | Capability baseline recorded; `read_subagent` added to the tool allowlist; Devin `/loop` semantics documented; capability matrix published with documented / locally observed / unavailable / untested entries. |
| 01 | F01, F06 | Routing gates restored in poteto-mode; `how` / `architect` / `why` thresholds restored in the feature, bug-fix, refactoring, and investigation playbooks; critical routing moved into the always-on plugin `AGENTS.md` so a hook failure no longer erases it. |
| 02 | F07, F08 | Both missing principle leaves restored with valid Devin metadata; catalog now lists 23 leaves; principle accountability restored in the reply contract; Feature reply now reports the throughput checkpoint and chosen decomposition. |
| 03 | F02, F03 | Explicit delegation lifecycle added to Root-owned delegation and Panel run: resolve, provision workspace, dispatch with retained agent id, wait or notification, collect with `read_subagent` by agent id, inspect the artifact, then parent verdict. Independent, out-of-order, failed, incomplete, and cancelled outcomes are handled explicitly. Permission recovery prefers foreground or scoped preauthorization, resumes the same worker when a resumable id exists, and never substitutes a profile or model. The root records the configured profile/pin mapping separately from runtime model metadata. |
| 04 | F04 | Writer isolation specified. The root provisions and verifies a separate worktree or directory before dispatch, records absolute path, branch, base, and owner, passes the absolute path in the brief with `git -C` guidance, inspects the assigned workspace after return, and serializes when no safe workspace can be established. Worktrees and branches are preserved, never auto-removed. Writer-dispatching playbooks and the swarm/arena companions now require a root-provisioned, recorded workspace instead of a branch in the shared checkout. |
| 05 | F05 | Pause and resume no longer contradict the delivery-authorization rule. An ordinary pause does not commit dirty edits. With an existing delivery request, the established `wip:` checkpoint policy applies. The resume note records intent, outstanding work and checks, and each worker's identity, profile, workspace, and last known state, with unknown status recorded as unknown. Resume reads `ProgramState` and allowed session evidence, exposes unknown worker status, and does not redo completed work merely because a new turn began. |
| 06 | F09, F11 | Explicit `shipping`, `autopilot-full`, and `autopilot-stack` requests now hit an explicit capability verdict before any generic fallback. `delivery-capability.md` gains a routing section, states that `cut` is a port verdict rather than a platform verdict, and names the bounded in-session alternative. Verification now detects the actual UI or CLI control surface before promising evidence, records a missing tool as a precise limitation, and refuses to treat compile or exit-code success as proof of changed UI or CLI behavior. |
| 07 | all core | Six structural checks added: shipped Markdown link resolution, principle-catalog completeness, registered profile mapping with same-pin comparison, explicit cut-workflow routing, writer workspace provisioning, and documented `run_subagent` fields with a forbidden-field guard. Static checks pass 19 of 19 with a clean `git diff --check`. A dated evidence file records the static results and the blocked native-runtime scenarios. Core completion is documented as structurally verified but not natively validated, because the plugin is not installed and Task 00 withholds that configuration write. |

## Changed files

Prior session (Tasks 00-02):

| File | Change |
| --- | --- |
| `AGENTS.md` | Added always-on "Default routing" and "Plugin conventions"; added `read_subagent`; documented `run_subagent` schema; clarified Devin `/loop`. |
| `README.md` | Updated verified version to 3000.10.21; corrected the cut-workflow and scheduling claim; added a capability-baseline matrix. |
| `docs/release-notes.md` | Updated version; principle-leaf count 21 to 23; clarified `read_subagent` is documented but untested; linked the matrix. |
| `docs/poteto-delegation-evaluation.md` | Appended a dated 2026-09-10 capability baseline. Historical 2026-09-07 results left unchanged. |
| `hooks/session-start-context.md` | Noted the hook repeats the always-on rule, so routing survives a hook failure. |
| `skills/poteto-mode/SKILL.md` | Added "Routing gates"; restored principle accountability in "Write the reply". |
| `skills/poteto-mode/playbooks/feature.md` | Step 1 now requires `how` with proportional scaling; step 2 requires `architect` across function boundaries; reply now reports the decomposition. |
| `skills/poteto-mode/playbooks/bug-fix.md` | Step 2 seeds hypotheses with `how` and `why`; step 3 requires `architect` across function boundaries. |
| `skills/poteto-mode/playbooks/refactoring.md` | Step 1 requires `how`; step 3 requires `architect` across function boundaries. |
| `skills/poteto-mode/playbooks/investigation.md` | `why` trigger widened to rationale, regressions, postmortems, and data-backed thresholds. |
| `skills/poteto-mode/references/principles.md` | Added Attack the Premise and Test Behavior, Not Implementation. |
| `skills/principle-attack-the-premise/SKILL.md` | New leaf, adapted to `triggers: [model]`. |
| `skills/principle-test-behavior-not-implementation/SKILL.md` | New leaf, adapted to `triggers: [model]`. |

This session (Tasks 03-04):

| File | Change |
| --- | --- |
| `skills/poteto-mode/references/delegation.md` | Added `Lifecycle`, `DispatchRecord`, `Collection and verdict`, `Permission recovery`, `Root verification`, and `Writer isolation` sections. The implementation example now names an assigned worktree, branch, and base. |
| `skills/poteto-mode/references/panel-run.md` | `PanelRun` gains a `workers` record. Background collection names `read_subagent` by retained agent id. Added explicit out-of-order, failed, incomplete, and cancelled handling. Writer isolation now requires the root-provisioned recorded workspace. |
| `skills/poteto-mode/SKILL.md` | Implementation gate now records each worker's identity, configured profile and pin, workspace, and state, collects the result with `read_subagent`, and inspects the artifact before the parent verdict. |
| `skills/poteto-mode/playbooks/feature.md` | Concurrent writers require a root-provisioned, verified, recorded worktree or directory. |
| `skills/poteto-mode/playbooks/hillclimb.md` | Concurrent hypotheses get a root-provisioned recorded workspace per writer. |
| `skills/poteto-mode/playbooks/visual-parity.md` | Each component owner's worktree is provisioned and recorded before dispatch. |
| `skills/poteto-mode/playbooks/prototype.md` | Nontrivial code prototypes get a provisioned, recorded scratch workspace. |
| `skills/poteto-mode/playbooks/orchestrate.md` | Worker isolation is a root-provisioned, verified, recorded worktree or directory. |
| `skills/figure-it-out/SKILL.md` | Fan-out writers get a root-provisioned, recorded worktree or directory. |
| `skills/swarm/SKILL.md` | A branch in the shared checkout is not isolation; the root provisions and records each workspace. |
| `skills/arena/SKILL.md` | Candidate output paths are root-provisioned and recorded; a branch is not isolation. |
| `README.md` | Added the lifecycle and workspace-provisioning statement; updated the collection and writer-isolation capability rows. |
| `docs/release-notes.md` | Documented the lifecycle record, id-based collection, and worktree provisioning. |

This session (Tasks 05-06):

| File | Change |
| --- | --- |
| `skills/poteto-mode/SKILL.md` | Stated that a pause or resume is not a delivery request and an ordinary pause leaves dirty work uncommitted. Added an explicit cut-workflow routing step before the generic fallback. Verification step now detects the control surface before promising evidence, rejects compile/exit-code success as UI or CLI proof, and reports a missing surface as a limitation. |
| `skills/poteto-mode/playbooks/pause-safely.md` | Step 3 commits only under an existing delivery request; otherwise it leaves edits in place and records them. New step 4 records each worker's identity, profile, workspace, and last known state, with unknown status recorded as unknown. The resume note now carries outstanding work, checks, and worker records. |
| `skills/poteto-mode/playbooks/session-pickup.md` | Reconstructs prior worker identity, profile, workspace, and state; surfaces unknown worker status as an open question; does not redo completed work merely because a new turn began. |
| `skills/poteto-mode/references/evidence-source.md` | Added `durable-state` kind and a Durable state section. A `ProgramState` store is a first-class resume source; a status recorded as unknown stays unknown until a fresh live check resolves it. |
| `skills/poteto-mode/references/delivery-capability.md` | Added Routing section. `verdict` is now explicitly a port verdict, not a platform verdict. `wake` framed as this plugin's lack of an agent-callable scheduled wakeup, not a Devin limit. `cut` rows name the bounded in-session alternative. |
| `skills/poteto-mode/references/verification.md` | Added Detect the surface section. Name the exposed tool before promising evidence; absent tool is `unsupported`; compile/type/unit success is not user-surface proof. |
| `skills/poteto-mode/playbooks/feature.md` | Step 5 detects the control tool; missing tool is a precise limitation, not a pass. |
| `skills/poteto-mode/playbooks/bug-fix.md` | Step 4 detects the control tool; missing tool is a precise limitation, not a pass. |
| `skills/poteto-mode/references/program-state.md` | Reworded the wake claim to this plugin's lack of an agent-callable scheduled wakeup. |
| `skills/poteto-mode/playbooks/autonomous-run.md` | Same wake reword. |
| `skills/poteto-mode/playbooks/babysit.md` | Same wake reword for the session-bound claim. |
| `skills/poteto-mode/playbooks/orchestrate.md` | Same wake reword for the wave-bound claim. |
| `skills/poteto-mode/playbooks/hillclimb.md` | Same wake reword for the attempt-bound claim. |
| `skills/figure-it-out/SKILL.md` | Same wake reword for the unit-bound claim. |
| `skills/babysit/SKILL.md` | Same wake reword for the standalone session-bound claim. |
| `README.md` | Documented pause/resume commit behavior and durable-state resume; documented that explicit cut-workflow requests reach a capability verdict, not a silent fallback; clarified this plugin's lack of a scheduled wakeup. |
| `docs/release-notes.md` | Recorded the pause/resume and cut-routing behavior and the verification surface-detection rule. |

This session (Task 07):

| File | Change |
| --- | --- |
| `tests/poteto-delegation.test.mjs` | Added a `poteto core completion contract` suite with six checks: relative Markdown link resolution across the shipped skill tree, one-to-one principle catalog completeness with valid Devin metadata, every referenced `pstack` profile registered with matching panel pins, explicit cut-workflow routing before the generic fallback, root-provisioned workspace language in each concurrent-writer path, and documented-only `run_subagent` fields with a forbidden-field guard. Added `walkMarkdown` and `relativeLinks` helpers. |
| `docs/evidence/poteto-delegation-2026-09-10.json` | New dated evidence file recording the static check results and the blocked native-runtime scenarios. |
| `docs/poteto-delegation-evaluation.md` | Appended a 2026-09-10 core completion validation section separating static checks from the blocked native run, and linked the evidence file. |
| `docs/poteto-delegation-refinement-plan.md` | Appended the Task 07 core completion validation record. |
| `README.md` | Added a `Checks` section with the structural test command and the static-versus-native distinction. |
| `docs/poteto-mode-implementation-status.md` | This Task 07 record. |

`docs/poteto-mode-parity-findings-and-plan.md` is a pre-existing untracked input file and was not modified.

## Checks and results

Static (Tasks 00-04 session):

- `node --test tests/pstack-models.test.mjs tests/poteto-delegation.test.mjs` passed 13 of 13.
- `git diff --check` reported no whitespace errors.
- Relative Markdown link resolver over all 11 edited instruction files: every local `.md` link resolves.
- The JSON dispatch example in `delegation.md` parses and its `profile` is `pstack:poteto-agent-sonnet`.
- Model pins are unchanged for all `panel-*` and `poteto-agent-*` profiles (`swe`, `glm-5-3-flash-high`, `gpt-5-6-sol-medium`).
- Grep confirmed no reintroduced Cursor/Claude dispatch fields (`subagent_type`, `run_in_background`, per-call `model`) in the edited prose.
- Grep confirmed the stale "Task 04 is not implemented" claim is removed.

Static (Tasks 05-06 session, run in this repository):

- `node --test tests/pstack-models.test.mjs tests/poteto-delegation.test.mjs` passed 13 of 13. No test was added; Task 07 owns extending the checks.
- `git diff --check` reported no whitespace errors.
- Relative Markdown link resolver over the whole repository: 115 local links checked, 0 broken.
- Grep confirmed the pause playbook no longer requires an unconditional `wip:` commit and that both `SKILL.md` and `pause-safely.md` state a pause is not a delivery request.
- Grep confirmed `SKILL.md`, `delivery-capability.md`, and `README.md` route explicit shipping/autopilot requests to a capability verdict instead of an unnamed `figure-it-out` fallback.
- Grep confirmed `verification.md`, `feature.md`, `bug-fix.md`, and `SKILL.md` require surface detection before claiming UI or CLI evidence.
- Grep confirmed no `subagent_type`, `run_in_background`, `disable-model-invocation`, `claude-`, or `cursor` strings in the poteto-mode delivery surface.
- `devin --version` reports 3000.10.21 (611c1cba); `devin plugins list` reports no plugins installed.

Static (Task 07 session, run in this repository):

- `node --test tests/pstack-models.test.mjs tests/poteto-delegation.test.mjs` passed 19 of 19. Six checks are new and cover reference resolution, the principle catalog, profile mapping, delivery routing, writer isolation, and documented dispatch fields.
- `git diff --check` reported no whitespace errors.
- The link-resolution check inspected 111 relative links across the shipped skill tree plus `AGENTS.md` and `README.md`: 0 broken.
- The principle-catalog check confirmed 23 shipped leaves match the catalog one-to-one, each with `name:` equal to its directory and a `model` trigger.
- The profile check confirmed every referenced `pstack:panel-*` and `pstack:poteto-agent-*` resolves to a registered agent, with matching panel pins.
- The dispatch-field check confirmed the documented JSON example parses and uses only `profile`, `task`, `title`, `is_background`, and `resume`, and that no `subagent_type`, `run_in_background`, or `disable-model-invocation` string remains in the skill tree.

Native Devin runtime validation was not performed. No claim here is a runtime proof.

- The plugin is not installed in this environment (`devin plugins list` reports none; `devin doctor` reports no custom subagent profiles configured). Installing it writes global user configuration, which Task 00 forbids without task authorization.
- Therefore the Task 03 acceptance runs are not exercised: one foreground worker completing, two background workers collected independently, and permission-denied recovery. Evidence for those remains blocked.
- The Task 04 acceptance run (two writers on the same relative filename producing independently reviewable diffs in separate physical worktrees) is not exercised.
- The Task 05 acceptance runs are not exercised: V10 (pause with dirty files and no delivery request commits nothing, then resume restores progress without duplication) and the worker-identity replay. The wording change is statically verified only.
- The Task 06 acceptance runs are not exercised: V11 (an explicit shipping/autopilot request gets a capability verdict) and V12 (UI tools absent or present produces an honest unsupported result or real surface evidence). These require a live consuming session.
- The Task 07 acceptance runs are not exercised: V01-V14, including the essential foreground and background worker collection, writer isolation, and permission-recovery scenarios. Core completion is structurally verified but not natively validated.
- The `read_subagent` argument shape (`agent_id`, optional `block` and `timeout`) remains locally observed on Devin 3000.6.14 and documented in prose. It was not re-confirmed at runtime against 3000.10.21; treat the field names as an assumption to verify on first live collection.

Documented capability facts gathered from official docs:

- `run_subagent` takes `profile`, `task`, `title`, `is_background`, and optional `resume`; it has no working-directory or model argument.
- Foreground subagents prompt for tool approval like the root. Background workers inherit only pre-approved permissions and cannot prompt.
- A completion notification is a signal; the parent reads the result and summarizes. Collection is `read_subagent` by agent id.
- Resumed subagents always run in the foreground.
- Cancellation is the subagent panel, or Ctrl+C or Esc for a foreground subagent. There is no cancellation tool argument.
- Custom subagent nesting is disabled by default; only the root dispatches.

## Deviations and rationale

- The procedure keeps both "fifteen-minute work quantum" (procedure) and "15-minute work quantum" (example). The existing structural regex matches the example form, so no test needed editing, and Task 07 left it unchanged.
- No writer-provisioner script was added. Task 04's file list did not include one, and the documented `git worktree add` plus `git rev-parse` verification is sufficient. Adding a lever script is a candidate for a later task.
- `implementation-worker.md` and the agent profiles were not edited. No schema or profile change was required, and the shared contract is embedded verbatim in five profiles with an equality test. Workspace-location instructions belong in the parent brief, per `delegation.md`.
- README and release notes were updated beyond the status document so no stale "Task 04 is not implemented" claim survives. This is documentation of the implemented contract, not a runtime claim.
- Task 05 keeps the safe checkpoint policy and gates it on an existing delivery request instead of removing it. An unauthorized pause leaves edits in place; an authorized pause still lands the single `wip:` commit. This preserves the source behavior under authority and resolves the F05 contradiction.
- Task 05 reuses the existing `ProgramState` and `resume.md` conventions and adds a `durable-state` EvidenceSource kind. It does not introduce a new store format.
- The scheduling-wake reword was extended to every plugin file that made the over-broad "Devin cannot schedule a later turn" claim, not only the files Task 06 names, so the routing text does not contradict other skills. The change is to the claim's scope only; no workflow changed.
- Task 07 added structural checks rather than prose snapshots. Each check derives its data from the filesystem or a machine-readable table, so it fails on a real structural break (a broken link, an uncatalogued leaf, an unregistered profile, a missing isolation clause, an unsupported dispatch field) and not merely on reworded prose.
- The dispatch-field check scans the whole skill tree but expects at least one documented example, so it guards against silently deleting the only dispatch example as well as against reintroducing Cursor or Claude fields.
- Native validation for Task 07 was deliberately not attempted. Installing the plugin writes global user configuration, which Task 00 forbids without task authorization, so the run is recorded as blocked rather than as a pass. This matches the user requirement to distinguish static validation from native Devin runtime validation.
- Model routing, profile pins, authorization boundaries, and delivery rules were left unchanged.
- The prior session's deviations remain in effect.

## Blockers and next-session instructions

Blockers:

- Native runtime validation is blocked by the absence of an authorized plugin install. Worker completion, `read_subagent` collection, same-worker permission resume, out-of-order background collection, writer worktree isolation, and runtime model identity all remain unproven in the current revision.
- The Task 05, Task 06, and Task 07 acceptance runs (V10, V11, V12, and V01-V14 respectively) are unexercised. The pause, routing, verification, and structural-contract changes are statically verified only.
- Core completion cannot be declared natively complete while essential worker collection remains unproven. The static contract is complete; the runtime verdict is blocked.
- The `read_subagent` field names are not re-confirmed against the installed 3000.10.21 CLI.

Next session:

1. Task 07 is implemented. Do not implement Task 08 or 09 in this session; they remain later capability work.
2. If authorized, validate natively in a disposable consuming repository: `devin plugins install --local -y <this repo>`, then exercise V01-V14, prioritizing V06 (foreground worker), V07 (two background workers collected out of order), V08 (permission-denied recovery), V09 (writer isolation), V10 (pause/resume), and V14 (profile mapping versus runtime identity). Record CLI/plugin revision, surface, permission mode, requested profile, returned identity, workspace, collection method, checks, artifacts, and parent verdict. Redact secrets.
3. Confirm the live `read_subagent` schema before relying on `block` or `timeout`, and correct the prose if it differs.
4. Record the native results in a new dated evidence file rather than editing the 2026-09-10 static baseline.
5. Keep the 23 principle leaves, the role-to-profile mapping, and the model pins unchanged. Extend the structural checks only if a native run exposes a structural defect the current checks miss.
