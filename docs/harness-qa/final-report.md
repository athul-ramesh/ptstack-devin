# Devin pstack harness QA — final report

**Goal.** Verify the Devin port (0.12.0) against official Cursor pstack and the live Devin harness, under the agreed budget (Free-first; High off).

**When.** 2026-11-21. Devin CLI `3000.14.30821`. Pro remained **100%** through all Free/smart sessions.

**Fixture.** Private `https://github.com/athul-ramesh/dummyrepo` (draft PR #1 left OPEN).

## Coverage

| Tier | What ran | Verdict |
| --- | --- | --- |
| 0 Static | Inventory + `node --test` 54/54 | Done → `deviation-matrix.md` |
| 1 Load/setup | SessionStart, plugin id, setup-pstack, cuts | PASS (with user-vs-model trigger clarification) |
| 1b User slash | `/pstack:ketchup` | PASS |
| 2 Harness | FG/BG/`read_subagent`/`worker.md` on `panel-swe` | PASS |
| 3 Orch | swarm, arena, architect, how (N≤2, Free) | PASS + harness caveats |
| 4 Delivery | get-pr-comments, make-pr-easy-to-review, babysit watch-pr, shipping cut | PASS; PR still draft |

**Not fully exercised live:** interrogate, figure-it-out end-to-end program, reflect, statechart/TLC, control-ui/cli, formal-verification skills, dual-writer worktrees, Med “as-shipped opus pin” bakeoff, High Opus/Fable parity. Static dispositions for those are in `deviation-matrix.md`.

## What works well on Devin

1. **SessionStart → poteto-mode** injection (`PSTACK_ROUTE=/pstack:poteto-mode`).
2. **Single plugin copy** 0.12.0 from `ptstack-devin` (no collision this run).
3. **`/pstack:setup-pstack`** from absent sheet → `# defaults: 3`, pins valid against catalog.
4. **`run_subagent` / `read_subagent`** foreground, fresh sequential, and background on `pstack:panel-swe`.
5. **`worker.md` first-line pointer** obeyed when the child must prove the read (`WORKER_MD_OK`).
6. **User-only skills** load via user slash (`/pstack:ketchup`); model `skill` tool correctly cannot load `triggers: [user]` skills (not an install bug).
7. **Cut capabilities** for shipping / autopilot are explicit (`delivery-capability.md`), not silent figure-it-out.
8. **Babysit** used bundled Bun `watch-pr` (not gh fallback); no merge authority claimed; watcher killable in-session.
9. **PR helpers** operated safely on the private draft PR.

## Deviations / quality gaps (priority order)

### P1 — Background sandbox vs `/tmp` isolation (live)

Arena (and likely similar patterns) told workers to write under `/tmp/…`. Devin **blocked writes outside the workspace**. Workers fell back to in-repo paths or inline content. Upstream Cursor patterns that assume `/tmp` break on Devin unless the root provisions dirs **inside** the project/worktree.

**Fix direction:** Update arena/swarm/playbook isolation language and any scripts to use root-provisioned workspace dirs; document the sandbox rule.

### P1 — `/pstack:how` still nominates `subagent_explore` (live)

Skill prefers a built-in explore profile that is not the Free SWE pin. QA overrode to `panel-swe`. Port should name Devin `pstack:panel-*` (or sheet roles) instead of Cursor-shaped `subagent_explore`.

### P2 — “todolist” leftovers (static)

`swarm`, `arena`, `figure-it-out` still say “Open a todolist” while poteto-mode on Devin uses a checklist (no Cursor todolist tool). Suspected drift vs harness.

### P2 — Docs/QA false alarm on user skills

Agents that try `skill` on user-only skills report “not found” and call it a registry gap. Docs / poteto-help should state: **user slash for `triggers: [user]`; model skill tool for model/both.**

### P3 — Arena cross-judge on Free/same pin

With parent + runners on `swe`, the cross-judge pool’s `swe` entry shares the parent model; opus was refused for cost. Parent judgment worked. Sheet default still routes arena runners to `panel-opus` (Med Sol pin) — fine for real use, expensive for smoke. Optional: document Free QA override.

### P3 — Intentional cuts (not bugs)

`shipping`, `autopilot-full`, `autopilot-stack`, `ketchup-video`, `make-bot-ui`, Benny automations. Correctly cut or absent.

### Untested claims remaining

Dual-writer worktree provisioning; narrowly approved (non-bypass/smart) background permissions; statechart inline render; Med Sol quality vs Free SWE for feature/bug-fix playbooks.

## Budget actuals

| Tier | Sessions | Cost tier |
| --- | ---: | --- |
| 1+1b | 1 | Free |
| 2 | 1 | Free |
| 3 | 1 | Free |
| 4 | 1 | Free |
| Med / Low / High | 0 | — |

Soft ceiling not exceeded. Pro meter stayed at 100%.

## Recommended improvement wave

1. ~~Arena/swarm isolation → workspace dirs (P1).~~ **Done** in `skills/arena`, `skills/swarm`.
2. ~~`how` → Devin panel profiles (P1).~~ **Done** (`panel-swe` / sheet `how:`).
3. ~~Replace todolist with checklist (P2).~~ **Done** in swarm/arena/figure-it-out.
4. ~~Document user-trigger load path (P2).~~ **Done** in `poteto-help`.
5. Optional later: Med pin bakeoff; interrogate N=2 Free; dual-writer worktree smoke; re-smoke arena under `.pstack/` paths.

## Evidence index

- `docs/harness-qa/deviation-matrix.md`
- `docs/harness-qa/tier1-results.md` … `tier3-results.md`
- `docs/harness-qa/captures/tier*-capture*.txt`
- Private PR: https://github.com/athul-ramesh/dummyrepo/pull/1
