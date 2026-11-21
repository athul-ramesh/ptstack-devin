# Tier 3 results (2026-11-21)

**Session:** Rex `tier3-orch`, `swe-2-high` + smart.  
**Capture:** `docs/harness-qa/captures/tier3-capture-2.txt`  
**All workers:** `pstack:panel-swe` only. Zero FAIL-COST.

| # | Route | Result | Notes |
| --- | --- | --- | --- |
| 1 | swarm N=2 | PASS | Verbatim first lines matched ground truth |
| 2 | arena N=2 | PASS | Converged comment; parent judge (cross-judge skipped: opus refused, swe=parent) |
| 3 | architect | PASS | Two shapes, picked flat helper; arena not triggered |
| 4 | cut | SKIP | Tier 1 |
| 5 | how | PASS | Overrode skill’s `subagent_explore` to `panel-swe` per cost rule |

**Harness deviations logged by the run**

1. Background workers **cannot write under `/tmp` outside dummyrepo** (sandbox). Arena candidates fell back to workspace paths or inline content. Port docs/skills that assume `/tmp` isolation need workspace-provisioned dirs.
2. `/pstack:how` still nominates built-in `subagent_explore` (not a Free SWE profile). Live override worked; skill text may need a Devin profile path.
3. Arena left probe files (`.wtest`, `.arena-write-test`); root cleaned them.

**Budget:** Free sessions used ≈3. Remaining soft ceiling: ≤3 Free, 2 Low, 1 Med.
