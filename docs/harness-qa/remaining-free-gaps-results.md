# Remaining Free gaps (2026-11-21, resume)

**Goal.** Close Free-tier items left open after `resmoke-and-gaps-results.md`.  
**Commit under test:** `2993633` (plugin source `devin plugins info pstack` → this checkout).  
**Session:** Rex `resmoke-isolation` (reuse), Devin `swe-2-high` + smart.  
**Captures:** `captures/fio-*.txt`, `captures/env-gap-probes.txt`.

## Results

| Probe | Result | Evidence |
| --- | --- | --- |
| figure-it-out plan-only | **PASS** | Skill loaded. ProgramState at `.pstack/fio-plan-only/` with 3 pending units (`panel-swe` / `poteto-agent-swe`). `plan.md` written. `git diff` empty for `hello.js` / `hello.test.js`. Zero `run_subagent`. See `captures/fio-capture-1.txt`, `fio-units.tsv`. |
| control-cli dry-run | **SKIP** (env-gap) | Fixture has no interactive CLI/TUI. Rex is present (`command -v rex`). Skill needs a product under test. Probe file: `captures/env-gap-probes.txt`. |
| control-ui | **SKIP** (env-gap) | Fixture has no web/Electron app (`package.json` absent). |
| statechart / TLC | **SKIP** (env-gap) | `tlc` and `tla2tools` missing. Java present at `/usr/bin/java`. Skill would ask before mise install. Network install not authorized. |

## Med bakeoff

**SKIP.** Soft ceiling already at ≤6 Free for this phase after prior tiers + re-smoke + this Free session. No Med `poteto-agent-opus` run.

## Budget

One Free session reused on the existing resmoke pane. Low 0, Med 0, High 0.
