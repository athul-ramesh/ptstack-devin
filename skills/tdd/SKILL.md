---
name: tdd
description: "Use only when the user explicitly asks for TDD, a failing test, or a regression test, OR when the bug has an obvious cheap local test target. Skip when the test path is unclear, expensive, integration-heavy, or not requested."
---

# TDD bug fix

When fixing a bug with a clear, cheap test path, make the broken behavior executable before changing production code. The goal is a focused regression test that fails before the fix and passes after it.

Do not force a test when it would be impractical. If the available test would need broad harness setup, brittle mocks, slow end-to-end infrastructure, production-only state, vague reproduction steps, or large unrelated fixture churn, skip adding a new test. Use the closest useful verification instead.

There is no Devin `run` or `verify` skill. Drive tests and scripts with `exec`. Drive a CLI or TUI the same way. Drive a web UI only with the browser mechanism Devin actually exposes.

## Workflow

1. **Understand the bug.** Identify the intended behavior, current behavior, affected path, and smallest observable reproduction.
2. **Choose the narrowest executable check.** Prefer the closest unit, component, integration, or regression test already used for that codepath. If no practical test path is obvious, do not create one from scratch just to satisfy the workflow.
3. **Write the failing test first.** Add the smallest focused test that would have caught the bug. The test should encode intended behavior, not mirror the current implementation.
4. **Run the new test before fixing.** `exec` the project's real test command. Confirm it fails for the intended reason. If it passes or fails for an unrelated reason, correct the test or reproduction before editing the implementation.
5. **Fix the bug.** Make the smallest production change that satisfies the intended behavior while preserving nearby contracts.
6. **Rerun the regression test.** `exec` the same command. Confirm the test now passes.
7. **Run nearby validation.** `exec` relevant adjacent tests, type checks, lint, or scenario checks when the change has broader risk.

## If a failing test is impractical

Do not silently skip the regression step. Before fixing, say why a failing test is impossible or not worth the cost, then choose the closest executable check. Examples include a targeted script via `exec`, a manual reproduction command, browser automation when Devin exposes a browser, a snapshot comparison, a log assertion, or a focused integration check.

Prefer no new test over a bad test. A bad test mostly tests mocks, encodes current implementation details, depends on timing or unrelated global state, needs expensive infrastructure for a small fix, or would be deleted immediately after proving the fix.

## Guardrails

- Do not change tests merely to match a wrong implementation.
- Do not weaken existing assertions unless the expected behavior has genuinely changed and the reason is clear.
- Keep the regression test focused on the bug. Avoid broad fixture churn or unrelated coverage expansion.
- Do not add tests when the practical signal is weak. Use manual or scripted verification and say why.
- If the bug is flaky, make the test deterministic where possible and document the signal being locked down.
- If the bug exposes a broader class of failures, first land the focused regression path, then consider additional sibling coverage.

## Final response

Report the evidence, not just the outcome.

- Name the failing-before test or executable check and the failure it produced.
- Name the passing-after `exec` run and any nearby validation performed.
- If failing-before evidence could not be demonstrated, state why and describe the closest regression check used instead.
