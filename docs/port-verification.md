# pstack 0.2.0 port verification

Verified on 2026-10-04 against source pstack 0.15.9 `e43c7ee26e0038c6c1fa8380dd34ce86ff94cb2a`. Installed Devin CLI is `3000.11.3 (9c803229faa4)`; `3000.10.21 (611c1cba)` remains the prior audit baseline.

## Executed checks

- `node --test tests/*.test.mjs`: 41/41 passed. Includes relative references, all 24 catalogued principle leaves, unchanged pins and same-pin routing, delivery exclusions, script subprocesses, configuration preservation, and validator positive/negative cases.
- `git diff --check`: passed.
- Inventory: 33 public skills, 24 principle leaves, 20 playbooks.
- Log subprocesses cover missing and empty files, exact preservation of prior bytes (including headerless history), newline/tab sanitation, and formula prefixes.
- Model CLI subprocesses cover repeatable role overrides, unchanged reruns, preserved notes/order/repeated profiles, and no writes on invalid rows.
- Disposable Git fixture contains two historical bad imports. The enforcement command rejects both historical forms and accepts the public import. This tests an illustrative fixture, not a live agent's ability to mine consuming-repository review history.
- Schema blocks extracted from the shipped TypeScript patterns compile with TypeScript 7.0.2 and Zod 4.6.5. Deleting required Account.role causes TS2322, explicitly reporting the missing required property. Dependencies were installed only in a temporary directory. Compiler command: `tsc --strict --noEmit --esModuleInterop --skipLibCheck --target es2022 --module nodenext --moduleResolution nodenext good.ts` (and the expected-failure `bad.ts`).

## Native CLI observations

Local installation of 0.2.0 completed successfully. CLI inventory sees the new skill files and user-only triggers. The older 0.1.0 copy at `~/src/ptstack-devin` initially collided with the new copy, and a live poteto-mode call loaded the old source. With the operator's approval, the old installation was temporarily removed and Devin restarted. The restarted session loaded poteto-mode from the 0.2.0 cache, and both `/pstack:correct` and `/pstack:benchmark-checklist` slash commands successfully injected the new skills. Explain the Number was present in the model-callable list. User-only skills intentionally cannot be invoked by the model skill tool; earlier “not found” calls were not evidence of failed registration. The older installation was restored afterward as agreed, so future sessions can encounter the collision again.

Herdr opened an adjacent interactive Devin pane. The operator approved repository trust. Native read-only workers on `AISkills/ptstack-devin:panel-opus` completed and results were inspected against the fixture:

| Check | Returned id | Observed result |
| --- | --- | --- |
| Foreground | caea952f | SMOKE_FOREGROUND_OK, collected by id |
| Fresh sequential perspective 1 | 8b0a5471 | SMOKE_PASS_1 |
| Fresh sequential perspective 2 | fdae5283 | SMOKE_PASS_2 |
| Background | 2e7e055e | SMOKE_BACKGROUND_OK, completion notification and collection by id |

Configured pin is `gpt-5-6-sol-medium`; no per-worker runtime model identity was exposed. The pane displayed bypass-permissions mode during these passes. Thus this run demonstrates background execution and collection, but does not prove its behavior under narrowly preapproved permissions. Detailed observed report: [native smoke report](native-smoke-report.md). Transient session artifacts are under `/private/tmp/pstack-port-smoke`; they are evidence from this run, not a promised portable path.

## Evidence gaps

A non-interactive accept-edits run encountered a permission-denied root tool before dispatch and returned no worker identity. Same-worker foreground permission repair could not be exercised there. Approved-permission background behavior, writer completion, and foreground recovery remain untested. New runtime routing and user slash activation were confirmed after temporary collision removal. Duplicate installations can still affect future routing. Benchmark/fresh-worker/swarm and interleaved-run tests check instruction contracts, not native agent compliance; no benchmark behavioral eval or live review-history mining is claimed. No CI run or UI adapter was needed for these source/script changes.

## Final PR review

Independent read-only review found two plan-validator defects: an empty control declaration passed, and valid TypeScript generics/autolinks were treated as placeholders. Both were corrected, with focused regression cases. Template placeholder names derive from the shipped planning skeleton. Comment review removed four unnecessary lines; release notes now name the verified CLI version. Final syntax checks and `git diff --check` pass. No dedicated lint or project typecheck configuration is present; Node syntax checks and the standalone schema compilation are the applicable checks.
