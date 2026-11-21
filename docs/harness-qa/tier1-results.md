# Tier 1 results (2026-11-21)

**Session:** Rex `dummy-devin`, Devin CLI `3000.14.30821`, model `swe-2-high`, ended in **bypass** permission mode.  
**Workspace:** `../dummyrepo`  
**Pro remaining after run:** 100%  
**Capture:** `docs/harness-qa/captures/tier1-capture-5.txt`

| # | Step | Verdict | Notes |
| --- | --- | --- | --- |
| 1 | SessionStart → poteto-mode | PASS | Injected `PSTACK_ROUTE=/pstack:poteto-mode` |
| 2 | Plugin identity | PASS | 0.12.0 from `…/ptstack-devin` |
| 3 | poteto-help via skill tool | FAIL | `Skill pstack:poteto-help not found` despite plugin inventory listing it |
| 4 | setup-pstack | PASS | Wrote `~/.config/devin/pstack-models.md` with `# defaults: 3`; pins verified |
| 5 | Slash-loads via skill tool | FAIL/partial | `how`, `why`, `bro` OK; `ketchup`, `sharpen`, `in-your-own-words`, `benchmark-checklist`, `correct` not found via skill tool |
| 6 | Cut shipping/autopilot | PASS | Explicit cut text in `delivery-capability.md` |
| 7 | Stop | PASS | No workers/PRs |

**Hypothesis to verify in Tier 1b:** failed names are user-only triggers; model `skill` tool cannot load them (matches 0.2.0 smoke notes). User-typed `/pstack:<name>` may still work.

### Tier 1b — user slash vs skill tool

User-typed `/pstack:ketchup` **did inject and run** (catch-up reply produced). The Tier 1 “registry gap” for `ketchup` / `poteto-help` / etc. is **not** a missing install. Those skills use `triggers: [user]`, so the model `skill` tool correctly returns not found; user slash is the load path. Same pattern as the 0.2.0 smoke note.

**Budget used:** 1 Free session (Tier 1 + 1b). Soft ceiling remaining this phase: 5 Free, 2 Low, 1 Med.
