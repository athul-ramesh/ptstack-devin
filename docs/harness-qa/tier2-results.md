# Tier 2 results (2026-11-21)

**Session:** Rex `tier2-harness`, Devin `swe-2-high` + **smart**, after models sheet load.  
**Capture:** `docs/harness-qa/captures/tier2-capture-1.txt`  
**Pro remaining:** 100%

| Check | Result | Agent ids | Notes |
| --- | --- | --- | --- |
| Config sheet visible | PASS | — | `feature`/`bug-fix` → `pstack:poteto-agent-opus` |
| A Foreground | PASS | `3f2e5ed0` | `SMOKE_FOREGROUND_OK` + greet signature |
| B Sequential fresh | PASS | `9ac92f69`, `f4835da2` | Distinct ids; PASS_1/PASS_2 |
| C Background | PASS | `183557b7` | Completed + `read_subagent` |
| D worker.md | PASS (follow-up) | `8e71b7f6` | `WORKER_MD_OK` + correctly reported no H1 in worker.md |
| E Dual-writer | SKIP | — | Budget |

All dispatches used `pstack:panel-swe` (`model: swe`).

**Budget:** Free sessions used ≈2 (Tier1, Tier2). Remaining soft ceiling this phase: ≤4 Free, 2 Low, 1 Med.
