# Poteto delegation evaluation

Evaluated 2026-09-07 against Devin CLI 3000.6.14 (18033302).

Verdict: basic root-to-worker delegation and the sampled role mappings pass. Full poteto workflow parity does not pass yet. No implementation or configuration was changed during this evaluation.

## Live evidence

The installed pstack 0.1.0 cache is a symlink to this repository. The session export confirms SessionStart injected PSTACK_ROUTE, the skill tool loaded poteto-mode, and the parent read the actual user model sheet before dispatch.

One SWE parent session, `brindle-porkpie`, made exactly three sequential foreground calls. All completed successfully with a distinct role marker and the requested arithmetic result. There were no retries, fallback profiles, worker tools, or nested calls.

| Role from the user sheet | Selected profile | Devin runtime model |
| --- | --- | --- |
| feature, refactoring | pstack:panel-sonnet | GLM-5.3 Flash High |
| bug-fix | pstack:panel-swe | SWE-1.7 Lightning Max |
| strongest judgment | pstack:panel-opus | GPT-5.6 Sol Medium Thinking |

Model identity was checked against Devin-generated system messages in the saved session message forest, not worker self-report. The profiles pin `glm-5-3-flash-high`, `swe`, and `gpt-5-6-sol-medium`, respectively. Profile suffixes are tier labels in this setup; they do not select the corresponding Claude model aliases. The user sheet explicitly acknowledges these pins.

The actual tool schema uses `profile`, `task`, `title`, `is_background`, and optional `resume`. The three calls used `is_background: false`. There is no per-call model argument. This agrees with the official Devin custom-profile contract.

Local evidence files:

- `/tmp/pstack-devin-eval/prompt.txt`: exact smoke-test prompt.
- `/tmp/pstack-devin-eval/session.json`: parent ATIF export.
- `/tmp/pstack-devin-eval/evidence.json`: extracted tool calls and session runtime model evidence.
- `/tmp/pstack-devin-eval/stdout.txt`: parent summary.

`node --test tests/pstack-models.test.mjs` passed all four tests. These cover sheet generation and repeated profile counts, not autonomous delegation behavior. The smoke test explicitly requested loading the skill and resolving three roles, so it proves that path can execute, not that an unprompted engineering task always chooses it. No credit savings or billing total is inferred from the short responses.

## Findings

1. **Mapped implementation workers lose the source poteto instructions.** The Claude source requires every playbook delegate to use poteto-agent with an explicit role model. Devin separates model selection through profiles, which is the right API adaptation, but `agents/panel-*/AGENT.md` only says to complete a pass and avoid poteto. The feature playbook selects those panel profiles. Devin workers do not inherit parent conversation history, so loading poteto in the parent does not load its quality rules in a mapped worker. The separate poteto-agent loads the rules but is fixed to Sol and is not the feature role's mapped profile. Use role-pinned implementation profiles with a shared worker contract, or explicitly include that contract and resolved file pointers in each implementation brief. Keep panel reviewer instructions distinct.

2. **Nested fan-out is incompatible with the shipped profiles.** `playbooks/feature.md` says the code owner fans out internally after the blocking phase. No shipped profile declares `max-nesting`; panel profiles additionally forbid spawning panel or poteto profiles. Devin disables subagent tools inside workers by default. Keep decomposition in the root, or introduce a deliberately bounded coordinator profile with compatible instructions. Do not enable nesting on every profile merely to satisfy this prose.

3. **Missing-sheet defaults are underspecified.** The Models section lists bare `opus` and `swe`, while the CLI requires registered profile identifiers. The existing user sheet avoids this problem, as the live test demonstrates. Express defaults as `pstack:panel-opus` and `pstack:panel-swe`, or document one explicit alias-to-profile conversion before dispatch. This fallback was not tested live.

4. **Worker paths assume the plugin is the current repository.** poteto-agent tells workers to read `skills/poteto-mode/SKILL.md`. That path works in this repo but is not generally valid in a consuming project. Resolve paths against the installed plugin source and pass absolute pointers in the brief. This matters because the requested in-repo test cannot detect an installation-relative path defect.

5. **Parallel mode needs clearer Devin mechanics.** The panel reference says to issue calls before waiting, but should explicitly name `is_background: true`, completion collection, and the requirement that background workers already have needed tool permissions. The foreground smoke test did not exercise parallel execution or editing permissions.

The setup writer also replaces the custom user sheet with generated defaults when rerun. This is already disclosed in the user sheet. Do not rerun setup to repair worker behavior or model pins.

## Recommendation

Accept the current three sampled role-to-profile-to-model mappings. Do not yet claim full source-equivalent poteto execution. Repair the worker-contract and nesting mismatches, then run one small organic feature task with a mapped implementation worker and inspect its artifact and actual reads. A full panel sweep is unnecessary. Any nested coordinator path should receive its own bounded check only if it remains part of the design.

## Follow-up on 2026-09-07

The refinement plan was implemented without changing registered profile pins or the user's 18-row model sheet. Static contract correctness now passes:

- Root-owned delegation selects the exact role row, rejects invalid configured profiles, and does not pass a model argument.
- Implementation tasks inline the shared worker contract and absolute project and installed-plugin pointers.
- Feature, refactoring, bug-fix, perf-issue, hillclimb, and Orchestrate no longer require worker-owned nesting. Actual depth is root → worker.
- Missing rows use explicit registered defaults. `pstack:poteto-agent` is an explicitly selected scoped worker, not another coordinator.
- Foreground, background, result collection, permission repair, repeated perspectives, incomplete panels, and degraded mapping are specified from the Devin 3000.6.14 tool schema.

Local checks passed. `node --test tests/pstack-models.test.mjs` passed 4/4. `node --test tests/poteto-delegation.test.mjs` passed 3/3. The real sheet's 18 rows resolved to registered profiles. All five model-pinned profile frontmatter values were unchanged. `git diff --check` passed. The sheet SHA-256 before and after was `115af4cee1f7bdc289191791862dd88b8335e0a4a158538cb9ee30fd249b8c05`.

### Consuming-project behavior

One organic feature case ran in a disposable `task-summary-cli` repository with no `skills/` directory. SessionStart loaded poteto-mode without prompt leakage. The root loaded the Feature playbook, user sheet, delegation contract, implementation contract, verification reference, and Model the Domain leaf from the installed plugin's absolute path. It selected `pstack:panel-sonnet`, constructed a foreground task with the complete inline contract and absolute project/plugin paths, and attempted the configured dispatch.

The configured dispatch returned `Subagent error: Tool was rejected` under non-interactive `accept-edits`. The parent then incorrectly attempted `pstack:poteto-agent`; that call was also rejected. This consumed the bounded run's remaining worker-call allowance. The dispatch procedure was tightened from this evidence: one `panel-*` implementation pass is not a panel, rejection does not authorize profile substitution, and the root must inspect partial filesystem effects when no resumable agent ID exists.

Partial scoped edits appeared in the disposable repository despite the rejected result. Independent post-session checks passed `npm test`, parsed the three-object JSON array with exactly `id`, `title`, and `done`, reproduced unchanged text output, and checked help output. These checks prove the observed fixture state, not compliant live delegation: no worker result was available, the parent did not review or verify it, and no worker runtime metadata was returned.

### Remaining limits

- **Runtime model confirmation:** unavailable for the organic worker because neither dispatch returned a completed result. The earlier three-profile baseline remains the only runtime mapping evidence.
- **Background behavior:** not exercised. The unexpected second dispatch attempt reached the three-worker-call ceiling, leaving no budget for the meaningful two-worker collection case.
- **Live implementation verdict:** inconclusive. Routing, profile resolution, reference reads, and brief construction passed. Permission handling, result collection, parent-owned verification, and exact worker runtime identity remain blocked.

Compact sanitized evidence is in [`evidence/poteto-delegation-2026-09-07.json`](evidence/poteto-delegation-2026-09-07.json). The full session export is not retained in the repository.

## Capability baseline on 2026-09-10

Recorded against Devin CLI 3000.10.21 (611c1cba), local Devin CLI on macOS, plugin `pstack` 0.1.0. No plugin runtime behavior was exercised for this entry. It separates documented claims from the 2026-09-07 live observations and from what remains untested.

Environment:

- CLI version and build: `devin 3000.10.21 (611c1cba)` from `devin --version`.
- Surface: local Devin CLI on darwin. Devin Desktop shares the local plugin surface; cloud sessions do not.
- Plugin version and revision: `pstack` 0.1.0, manifest `.devin-plugin/plugin.json`. Not installed in this environment. `devin plugins list` reported none and `devin doctor` reported no custom subagent profiles configured.
- Default permission mode: `normal` (alias `auto`), per the `devin --permission-mode` help text. Background subagents inherit only pre-approved permissions and cannot prompt for new ones.
- Subagent tools: `run_subagent` and `read_subagent`, documented as removed when `subagents_enabled` is false.
- Profile registration: unverified locally because the plugin is not installed. The pinned model slugs `swe`, `glm-5-3-flash-high`, and `gpt-5-6-sol-medium` exist in `devin models list` (46 families).

Confirmed schemas (official docs, Devin CLI 3000.10.21):

- Dispatch: `run_subagent` takes `profile`, `task`, `title`, `is_background`, and optional `resume`. There is no per-call model argument; the profile `model:` pin or the default subagent model decides.
- Collection: `read_subagent`. A completion notification is a signal to inspect, not proof of correctness.
- Resume: resumed subagents always run in the foreground, so a background worker denied a tool can be resumed to approve it.
- Cancellation: from the subagent panel, or Ctrl+C or Esc for a foreground subagent. No tool argument cancels a run.

Capability classification:

- Documented and locally observed on 2026-09-07: SessionStart injected `PSTACK_ROUTE`; the skill tool loaded poteto-mode; three foreground `run_subagent` calls returned role markers; `node --test tests/pstack-models.test.mjs` passed 4 of 4.
- Documented, not observed: always-on plugin `AGENTS.md` rules; `read_subagent` collection; background worker completion; same-worker permission resume.
- Unavailable: `/loop <prompt>` is an interactive run-then-review command, not an agent-callable scheduler or a durable wakeup. Cloud sessions exclude plugin SessionStart and plugin agents.
- Untested: writer worktree isolation enforcement, background result collection, parent verification of a worker diff, and runtime worker model identity.

Official references:

- https://docs.devin.ai/cli/subagents
- https://docs.devin.ai/cli/extensibility/plugins/overview
- https://docs.devin.ai/cli/extensibility/rules
- https://docs.devin.ai/cli/reference/commands

## Core completion validation on 2026-09-10

Task 07 extended the structural checks and re-ran them. These are static contract checks, not native Devin execution.

Static:

- `node --test tests/pstack-models.test.mjs tests/poteto-delegation.test.mjs` passed 19 of 19, including six new checks for link resolution, the principle catalog, profile registration and same-pin mapping, explicit delivery routing, writer isolation, and documented dispatch fields.
- `git diff --check` reported no whitespace errors.
- Every relative Markdown link in the shipped skill tree plus `AGENTS.md` and `README.md` resolved: 111 checked, 0 broken.
- The principle catalog lists 23 leaves and matches the 23 shipped `skills/principle-*/SKILL.md` directories one-to-one.
- Every `pstack:panel-*` and `pstack:poteto-agent-*` profile named in poteto-mode resolves to a registered `agents/<name>/AGENT.md`, and each `poteto-agent-*` shares its panel counterpart's `model:` pin.
- `shipping`, `autopilot-full`, and `autopilot-stack` each have a `cut` row and reach that verdict before the generic fallback.
- Each concurrent-writer dispatch path requires a root-provisioned workspace, and the delegation reference documents worktree creation and verification.
- No `subagent_type`, `run_in_background`, or `disable-model-invocation` field appears in the shipped skill tree.

Native runtime: blocked. `devin plugins list` reports no plugins installed, and installing one writes global user configuration, which Task 00 forbids without task authorization. No V06-V14 scenario was exercised, so worker completion, background collection, same-worker permission resume, worktree isolation, and runtime model identity remain unproven. Compact facts are in [`evidence/poteto-delegation-2026-09-10.json`](evidence/poteto-delegation-2026-09-10.json).
