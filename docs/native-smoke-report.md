# pstack-devin smoke report

Bounded native smoke test of the local plugin. No plugin, project, or config files were modified. Artifacts written only under `/private/tmp/pstack-port-smoke/` (`fixture.txt`, this report). No commits, pushes, or merges.

## Environment

- Date: 2026-10-04, macOS (Darwin 27.0.0), cwd `/Users/athulramesh/projects/AISkills`.
- Two registrations of plugin `pstack` are installed simultaneously:
  - `src/ptstack-devin` — version 0.1.0 (old copy), cache `.../plugins/cache/Users_athulramesh_src_ptstack-devin-ec3aeeee/0.1.0`
  - `AISkills/ptstack-devin` — version 0.2.0 (new copy), source `/Users/athulramesh/projects/AISkills/ptstack-devin`, cache `.../plugins/cache/Users_athulramesh_projects_AISkills_ptstack-devin-0ecfbb42/0.2.0`
- `~/.config/devin/pstack-models.md`: absent. Defaults from poteto-mode applied.

## Skill activation

| Skill | Result |
|---|---|
| `poteto-mode` | Loaded, but resolved to the **old 0.1.0 copy** (`src/ptstack-devin` cache). New 0.2.0 routing is **not confirmed** through the skill tool. |
| `correct` | **Not registered.** Invocation returned "Skill not found". File exists at `projects/AISkills/ptstack-devin/skills/correct/SKILL.md` (verified directly; frontmatter `name: correct`, trigger `user`). The 0.1.0 copy has no such skill. |
| `benchmark-checklist` | **Not registered.** Same outcome. File exists at `projects/AISkills/ptstack-devin/skills/benchmark-checklist/SKILL.md` (verified directly; frontmatter `name: benchmark-checklist`, trigger `user`). Absent from the 0.1.0 copy. |

New-skill activation could not be exercised through the runtime: the skills exist on disk in the new plugin but are absent from the session's registered-skill list.

## Worker dispatch

All workers dispatched on the explicitly requested registered profile `AISkills/ptstack-devin:panel-opus`. Configured pin from `agents/panel-opus/AGENT.md` frontmatter (verified in both the source repo and the 0.2.0 cache): **`model: gpt-5-6-sol-medium`**.

| Pass | Mode | agent_id | Profile (returned) | Configured pin | Result |
|---|---|---|---|---|---|
| Foreground | `is_background: false` | `caea952f` | `AISkills/ptstack-devin:panel-opus` | `gpt-5-6-sol-medium` | Completed; returned `SMOKE_FOREGROUND_OK`; quoted fixture line 1 correctly. Collected by id via `read_subagent`. |
| Sequential 1 | `is_background: false`, fresh call, no `resume` | `8b0a5471` | `AISkills/ptstack-devin:panel-opus` | `gpt-5-6-sol-medium` | Completed; returned `SMOKE_PASS_1`; quoted fixture line 2 correctly. |
| Sequential 2 | `is_background: false`, fresh call, no `resume` | `fdae5283` | `AISkills/ptstack-devin:panel-opus` | `gpt-5-6-sol-medium` | Completed; returned `SMOKE_PASS_2`; reported correct line count (2). |
| Background | `is_background: true`, read-only tools | `2e7e055e` | `AISkills/ptstack-devin:panel-opus` | `gpt-5-6-sol-medium` | Completed; returned `SMOKE_BACKGROUND_OK`; collected by id via `read_subagent` after completion notification. |

All four passes returned their required tokens with correct read evidence. Runtime model identity is **not exposed** by the CLI (`run_subagent`/`read_subagent` surface no per-worker model label); `gpt-5-6-sol-medium` is a configuration fact from frontmatter, not an observed runtime identity.

## Limitations

1. **Namespace collision (confirmed).** Two installed copies share plugin name `pstack`. The skill tool resolved `poteto-mode` to the 0.1.0 `src/ptstack-devin` copy. New-version skill routing cannot be claimed confirmed from this run.
2. `correct` and `benchmark-checklist` exist in the 0.2.0 source tree but are unregistered at runtime; invocation fails with "not found". Whether this is caused by the collision or a registration gap is undetermined from this smoke test.
3. Skills appear twice in the session skill list (0.1.0 and 0.2.0 copies); which copy serves any given invocation is not selectable by the caller for `skill`, unlike subagent profiles which are source-namespaced (`AISkills/ptstack-devin:panel-opus` vs `src/ptstack-devin:panel-opus` — both registered, dispatch honors the requested namespace).
4. No runtime model metadata is exposed per worker; pins are configuration facts only.
5. Read-only scope: workers were instructed read-only and verified by artifact inspection; no write-surface behavior was exercised.
6. Foreground dispatch is blocking; no interruption path was tested.

## Follow-up after removing the old installation

The operator authorized temporary removal of `src/ptstack-devin` and restarted Devin in the same Herdr pane (new session `modest-lodge`). The skill tool loaded poteto-mode from the 0.2.0 cache. Both `/pstack:correct` and `/pstack:benchmark-checklist` user slash commands successfully injected the new skills for inspection only. Explain the Number appeared in the model-callable list. Earlier “unregistered” reports above came from model-tool calls to user-only skills and must not be treated as registration failures. The collision did affect poteto-mode source selection before removal. No correction or benchmark workflows were executed.

The older installation was restored after verification, as agreed. Future sessions may again encounter duplicate-name routing; this run proves the new version works when selected without that collision.
