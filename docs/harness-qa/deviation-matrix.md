# Tier 0 static deviation matrix

**Compared:** Cursor upstream `../plugins/pstack` (pstack 0.15.43 lineage) vs Devin port `ptstack-devin` plugin **0.12.0**.  
**Method:** Directory inventory, `diff -rq` on `skills/`, spot-check on high-risk orchestration and harness files. No Devin sessions.  
**Prior evidence:** [pstack-0.15.43-port-audit.md](../pstack-0.15.43-port-audit.md), [devin-harness-qa-plan.md](../devin-harness-qa-plan.md).  
**Generated:** 2026-11-21 (Tier 0).

## Harness adaptations (Devin vs Cursor)

| Surface | Cursor upstream | Devin port |
| --- | --- | --- |
| Plugin manifest | `.cursor-plugin/plugin.json`, cloud/local | `.devin-plugin/plugin.json`, `platforms: ["local"]` only |
| Session routing | No `hooks.json` in pstack tree | `hooks.json` SessionStart → `hooks/session-start` injects `/pstack:poteto-mode` context |
| Default models sheet | `~/.cursor/rules/pstack-models.mdc` + `# budget` effort on slugs | `~/.config/devin/pstack-models.md`; no Cursor effort budgets |
| Subagent dispatch | `Task` tool + optional `model:` per call; Project workers | `run_subagent` with `profile` only; collect via `read_subagent` |
| Agent defs | 2 shipped agents (`agents/poteto-agent.md`, `comment-sicko.md`) with Cursor model slugs | 12 `agents/<name>/AGENT.md` profiles with pinned `model:` (`gpt-6-1-sol-medium`, `glm-5-3-flash-high`, `swe`, `gpt-6-1-terra-medium`) |
| Tool names in prose | Read, edit, Grep, Shell, Task, todolist, etc. | read, edit, grep, glob, exec, skill, run_subagent, read_subagent |
| worker.md kickoff | First line of Task/Project kickoff | First line of `run_subagent` `task`; **live PASS** on `panel-swe` (`WORKER_MD_OK`, Tier 2 follow-up) |
| Delivery | `shipping`, `autopilot-full`, `autopilot-stack` playbooks | Cut; routed via `references/delivery-capability.md` to Babysit / Opening a PR / figure-it-out |
| PR / CI helpers | Partially in playbooks + Cursor-only tools | Port-only skills: `deslop`, `fix-ci`, `fix-merge-conflicts`, `get-pr-comments`, `make-pr-easy-to-review` |
| Benny automations | `automations/benny/skills/*` | Not ported (local Devin plugin scope) |

**Spot-check highlights**

| File | Verdict |
| --- | --- |
| `poteto-mode/SKILL.md` | Orchestrate removed; checklist replaces todolist; `run_subagent`/`read_subagent`; delivery-capability gate; model matching via profile pins only (no per-call xhigh budgets). |
| `poteto-mode/worker.md` | Devin preamble marks **uncertain**; `run_subagent` wording; PR-only-when-user-asks. |
| `setup-pstack` | Writes `pstack-models.md` via `devin models list`; `# defaults: 3`; drops reflect/architect-runner roles. |
| `swarm` / `arena` / `interrogate` | Panel profiles from `panel-run.md`; sequential fallback when profiles &lt; N. Checklist wording + workspace isolation (not `/tmp`) applied 2026-11-21 after live QA. |
| `architect` | Short brief; large designs route to `/pstack:arena`; no parallel architect runners. |
| `opening-a-pr` playbook | User-requested only; `gh`; `/pstack:deslop`; never merge; no Origin CLI. |
| `babysit` playbook + skill | Session-only; no cross-session watcher authority; ships TypeScript `watch-pr` under `poteto-mode/scripts/` (bundled; live behavior **untested**). |
| `AGENTS.md` | Devin-only conventions (`platforms: local`, tool names, no Graphite/`/loop` agent timer). |
| `agents/*/AGENT.md` | All pins match `tests/port-contracts.test.mjs` matrix; `codex` maps to `gpt-6-1-sol-medium`. |

## Disposition summary

| Disposition | Skill | Playbook | Agent | Hook | **Total** |
| --- | ---: | ---: | ---: | ---: | ---: |
| `intentional_cut` | 5 | 3 | 0 | 0 | **8** |
| `port_only` | 13 | 0 | 0 | 0 | **13** |
| `adapted` | 54 | 19 | 12 | 1 | **86** |
| `suspected_drift` | 0 | 0 | 0 | 0 | **0** (swarm/arena/figure-it-out fixed post-QA) |
| `untested_claim` | 0 | 0 | 0 | 0 | **0** (was 2; both live-verified 2026-11-21) |
| **Subtotal (inventoried)** | **72** | **22** | **12** | **1** | **107** |

*72 skill rows = 69 unique `skills/*` directories (union of both trees) + 3 Benny-only upstream skills. `port_only` includes 11 Devin-only skills plus `AGENTS.md` and `plugin.json`. Live overlay: `poteto-mode/worker` and SessionStart hook moved off `untested_claim` (see below).*

Shared skills: **0** byte-identical `SKILL.md` files between trees (`diff -q` on all 56 shared directories).

---

## Skills

| name | kind | disposition | summary | evidence |
| --- | --- | --- | --- | --- |
| architect | skill | adapted | Short design brief; routes contested/large design to arena; no runner fan-out. | diff `skills/architect/SKILL.md`; prior audit |
| arena | skill | adapted | Panel profiles + workspace dirs under `.pstack/arena-…`; checklist (no todolist); `/tmp` forbidden. | post-QA fix; Tier 3 |
| automate-me | skill | adapted | Harness/tool wording for Devin. | diff -rq |
| babysit | skill | port_only | Standalone slash skill; session-only PR watch; complements playbook. | Devin-only dir; `skills/babysit/SKILL.md` |
| benchmark-checklist | skill | adapted | Contract preserved; paths/tools for Devin. | `tests/port-contracts.test.mjs` |
| blast-radius | skill | adapted | Port wording. | diff -rq |
| bro | skill | adapted | Port wording. | diff -rq |
| control-cli | skill | port_only | Devin harness recipe skill; user trigger. | Devin-only; port-contracts test |
| control-ui | skill | port_only | Devin harness UI control skill. | Devin-only; port-contracts test |
| correct | skill | adapted | Evidence contract retained. | port-contracts test |
| create-formal-verification-skill | skill | adapted | Destination paths for Devin skills dir. | diff -rq |
| create-verification-skill | skill | adapted | Same. | diff -rq |
| deslop | skill | port_only | PR hygiene; referenced from opening-a-pr. | Devin-only |
| figure-it-out | skill | adapted | Program-state + checklist phases (todolist wording removed). | post-QA fix |
| fix-ci | skill | port_only | gh/CI helper for delivery tier. | Devin-only |
| fix-merge-conflicts | skill | port_only | Merge helper. | Devin-only |
| get-pr-comments | skill | port_only | PR comment triage. | Devin-only |
| how | skill | adapted | `run_subagent` on sheet/`panel-swe` default; no `subagent_explore`. | post-QA fix; Tier 3 |
| in-your-own-words | skill | adapted | User-trigger preserved. | port-contracts |
| interrogate | skill | adapted | Reviewer profiles; Devin `run_subagent`. | diff `skills/interrogate/SKILL.md` |
| ketchup-video | skill | intentional_cut | Video capture workflow; not in Devin port. | upstream-only; `tests/port-contracts.test.mjs` |
| ketchup | skill | adapted | Text ketchup retained; video sibling cut. | diff |
| maintain-formal-verification-skill | skill | adapted | Devin paths. | diff |
| maintain-verification-skill | skill | adapted | Devin paths. | diff |
| make-bot-ui | skill | intentional_cut | Cursor UI bot builder; out of scope. | upstream-only |
| make-pr-easy-to-review | skill | port_only | PR presentation helper. | Devin-only |
| no-comments | skill | adapted | Uses `comment-sicko` profile. | diff |
| poteto-help | skill | adapted | Recipes reference Devin capabilities/cuts. | diff recipes |
| poteto-mode | skill | adapted | Routing doc; delegation refs; cut delivery gate; no Orchestrate playbook. Worker kickoff **untested** on live Devin. | diff SKILL.md; prior audit §Poteto-mode |
| poteto-mode/worker | skill | adapted | Rules binding; first-line `run_subagent` read path **live PASS** (`WORKER_MD_OK`, agent `8e71b7f6`). | Tier 2 follow-up; `tier2-results.md` |
| principle-attack-the-premise | skill | adapted | Body shortened 0.15.43; triggers unchanged. | prior audit |
| principle-boundary-discipline | skill | adapted | Shortened body. | prior audit |
| principle-build-the-lever | skill | adapted | Shortened body. | prior audit |
| principle-encode-lessons-in-structure | skill | adapted | Shortened body. | prior audit |
| principle-exhaust-the-design-space | skill | adapted | Shortened body. | prior audit |
| principle-experience-first | skill | adapted | Shortened body. | prior audit |
| principle-explain-the-number | skill | adapted | Shortened body; model trigger. | prior audit; port-contracts |
| principle-fix-root-causes | skill | adapted | Shortened body. | prior audit |
| principle-foundational-thinking | skill | adapted | Shortened body. | prior audit |
| principle-guard-the-context-window | skill | adapted | Shortened body. | prior audit |
| principle-laziness-protocol | skill | adapted | Shortened body. | prior audit |
| principle-make-operations-idempotent | skill | adapted | Shortened body. | prior audit |
| principle-migrate-callers-then-delete-legacy-apis | skill | adapted | Shortened body. | prior audit |
| principle-minimize-reader-load | skill | adapted | Shortened body. | prior audit |
| principle-model-the-domain | skill | adapted | Shortened body. | prior audit |
| principle-never-block-on-the-human | skill | adapted | Shortened body. | prior audit |
| principle-outcome-oriented-execution | skill | adapted | Shortened body. | prior audit |
| principle-prove-it-works | skill | adapted | Shortened body. | prior audit |
| principle-redesign-from-first-principles | skill | adapted | Shortened body. | prior audit |
| principle-separate-before-serializing-shared-state | skill | adapted | Shortened body. | prior audit |
| principle-sequence-verifiable-units | skill | adapted | Shortened body. | prior audit |
| principle-subtract-before-you-add | skill | adapted | Shortened body. | prior audit |
| principle-test-behavior-not-implementation | skill | adapted | Shortened body. | prior audit |
| principle-type-system-discipline | skill | adapted | Shortened body; `/pstack:typescript-best-practices`. | prior audit |
| recall | skill | adapted | Devin paths and triggers. | diff |
| reflect | skill | adapted | Single-file; no reflect subagent roles; Devin skill destinations. | prior audit §Reflect |
| setup-pstack | skill | adapted | `pstack-models.md` writer; profile registration; migration `# defaults: 3`. | diff vs upstream; QA plan §PR-C |
| sharpen | skill | adapted | User trigger. | port-contracts |
| show-me-your-work | skill | adapted | Interleaved run logging; Devin `exec`. | port-contracts |
| statechart | skill | adapted | User trigger; TLC env may gap. | port-contracts |
| swarm | skill | adapted | Checklist + workspace `.pstack/swarm-…` isolation; `/tmp` forbidden. | post-QA fix; Tier 3 |
| tdd | skill | adapted | Tool names. | diff |
| teach | skill | adapted | Shortened / paths. | diff |
| technical-writing | skill | adapted | Invokes `/pstack:unslop`; shortened. | prior audit |
| thermo-nuclear-code-quality-review | skill | port_only | Legacy review skill packaged for Devin. | Devin-only |
| typescript-best-practices | skill | adapted | Principle cross-link. | diff |
| understand-bug | skill | port_only | Diagnosis route before bug-fix. | Devin-only; poteto-mode routing |
| unslop | skill | adapted | Shortened; local rules called out in audit. | prior audit |
| what-did-i-get-done | skill | port_only | Status/recap helper. | Devin-only |
| why | skill | adapted | Panel roles via profiles not Task models. | diff |
| setup-benny | skill | intentional_cut | Benny automation; not in Devin plugin. | `automations/benny/` upstream only |
| triage-issue-reports | skill | intentional_cut | Benny automation. | upstream only |
| reproduce-and-fix-issues | skill | intentional_cut | Benny automation. | upstream only |
| AGENTS.md | skill | port_only | Devin plugin conventions and default poteto route. | `AGENTS.md` |
| plugin.json | skill | port_only | `pstack` 0.12.0 local platform manifest. | `.devin-plugin/plugin.json` |

## Hooks

| name | kind | disposition | summary | evidence |
| --- | --- | --- | --- | --- |
| session-start | hook | adapted | SessionStart injects `PSTACK_ROUTE=/pstack:poteto-mode`; **live PASS** Tier 1. | `tier1-results.md`; `hooks/session-start*` |

**Devin-only poteto-mode references** (summarized under `poteto-mode`, not separate rows): `delegation.md`, `delivery-capability.md`, `evidence-source.md`, `implementation-worker.md`, `panel-run.md`, `principles.md`, `program-state.md`, `verification.md`. Upstream-only reference: `bugbot-triage.md` (replaced by babysit/skeptical triage prose).

---

## Playbooks (`skills/poteto-mode/playbooks/`)

| name | kind | disposition | summary | evidence |
| --- | --- | --- | --- | --- |
| authoring-a-skill | playbook | adapted | Devin skill destinations and tool names. | diff -rq |
| autonomous-run | playbook | adapted | Bounded autonomy without Cursor Project workers. | diff |
| babysit | playbook | adapted | Six-rule cut; session-only; delivery-capability. | prior audit §Babysit; diff |
| bug-fix | playbook | adapted | Profile dispatch; worker contract refs. | diff |
| eval | playbook | adapted | Devin verification wording. | diff |
| feature | playbook | adapted | Interrogate before ship; no architect runners. | diff |
| hillclimb | playbook | adapted | Profile pins from sheet. | diff |
| investigation | playbook | adapted | Devin tools. | diff |
| multi-phase-plan | playbook | adapted | No `check-plan.mjs`; plan under `docs/` or `~/.config/devin/pstack/`; no shipping/autopilot. | prior audit |
| opening-a-pr | playbook | adapted | Three-paragraph cut; `gh` only; deslop/unslop; never merge. | diff; spot-check |
| pause-safely | playbook | adapted | Devin session semantics. | diff |
| perf-issue | playbook | adapted | Devin tools. | diff |
| prototype | playbook | adapted | Worker probes. | diff |
| refactoring | playbook | adapted | Devin dispatch. | diff |
| runtime-forensics | playbook | adapted | Devin `exec`. | diff |
| session-pickup | playbook | adapted | Program state / pickup. | diff |
| trace-forensics | playbook | adapted | Devin paths. | diff |
| visual-parity | playbook | adapted | Devin paths. | diff |
| worktree-cleanup | playbook | adapted | `worktree-audit.sh` differs. | diff scripts |
| shipping | playbook | intentional_cut | Cross-session watch + merge authority; verdict in delivery-capability. | upstream-only; `poteto-delegation.test.mjs` |
| autopilot-full | playbook | intentional_cut | Scheduled ticks; route to figure-it-out + babysit alternative. | upstream-only |
| autopilot-stack | playbook | intentional_cut | Stack autopilot; route to figure-it-out + opening-a-pr. | upstream-only |

---

## Agents (`agents/*/AGENT.md`)

| name | kind | disposition | summary | evidence |
| --- | --- | --- | --- | --- |
| panel-opus | agent | adapted | `model: gpt-6-1-sol-medium` (Med tier). | frontmatter; port-contracts test |
| panel-codex | agent | adapted | Same sol pin as opus. | port-contracts |
| panel-swe | agent | adapted | `model: swe` (Free SWE-2 family). | QA plan default workers |
| panel-sonnet | agent | adapted | `model: glm-5-3-flash-high` (Low). | port-contracts |
| panel-terra | agent | adapted | `model: gpt-6-1-terra-medium`. | port-contracts |
| poteto-agent | agent | adapted | Default implementation profile → sol. | vs upstream `claude-opus-5-5-xhigh-fast` |
| poteto-agent-opus | agent | adapted | sol pin. | port-contracts |
| poteto-agent-codex | agent | adapted | sol pin. | port-contracts |
| poteto-agent-swe | agent | adapted | swe pin for Free QA. | QA plan |
| poteto-agent-sonnet | agent | adapted | glm pin. | port-contracts |
| poteto-agent-terra | agent | adapted | terra pin. | port-contracts |
| comment-sicko | agent | adapted | no-comments delegate; no `model:` pin in grep set (comment-sicko). | `agents/comment-sicko/AGENT.md` |

Upstream shipped two Cursor Task agent stubs with live model slugs; Devin expands to registered profiles for `run_subagent`.

---

## Prioritized live-test list (Free tier, top 15)

Order follows [devin-harness-qa-plan.md](../devin-harness-qa-plan.md). Overlay after 2026-11-21 Free/smart runs ([final-report.md](final-report.md)).

| # | Priority | Live status |
| --- | --- | --- |
| 1 | SessionStart hook | **PASS** (Tier 1) |
| 2 | `/pstack:poteto-help` | **PASS via user slash path**; model `skill` tool correctly rejects `triggers: [user]` (Tier 1 / 1b) |
| 3 | `/pstack:setup-pstack` | **PASS** (Tier 1) |
| 4 | Explicit cut routing | **PASS** (Tier 1 + 4) |
| 5 | Foreground `run_subagent` `panel-swe` | **PASS** (Tier 2) |
| 6 | Background worker + collection | **PASS** (Tier 2) |
| 7 | `worker.md` first-line | **PASS** (Tier 2 follow-up) |
| 8 | Worktree dual-writer isolation | **SKIP** (budget) |
| 9 | poteto-mode → feature playbook | **SKIP** (orchestrations covered via swarm/arena instead) |
| 10 | swarm N=2 | **PASS**; note `/tmp` sandbox block (Tier 3) |
| 11 | arena N=2 | **PASS**; `/tmp` sandbox + parent judge (Tier 3) |
| 12 | interrogate 2 reviewers | **SKIP** (not run) |
| 13 | architect brief | **PASS** (Tier 3) |
| 14 | figure-it-out plan-only | **SKIP** (not run) |
| 15 | Opening a PR / babysit | **PASS** private draft PR + Bun `watch-pr` (Tier 4); no merge |

**Extra live findings not in original top 15:** `/pstack:how` still nominates `subagent_explore` (overridden to `panel-swe`); background writes outside workspace denied.

---

## Structural checks (no Devin)

- `node --test tests/*.test.mjs` — **54/54 pass** on 2026-11-21 before Tier 1.
- `git diff --check` — not re-run after doc-only overlay.