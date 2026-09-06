### Visual parity

**You own pixel-exact equivalence. The baseline is the spec. You do not touch it.** For "make X match Y exactly", styling-system migrations, porting a UI across frameworks. Equivalence is verified by image diff, not by eye.

1. Establish the baseline first, before any migration. A visual regression harness that screenshots the current component across its states, plus the target when matching two implementations. No baseline, no parity claim. A blocking prerequisite, not a follow-up.
2. Anti-shortcut clauses, stated and held. No harness modifications, no baseline tampering, no component restructuring to make a diff pass. If the baseline looks wrong, stop and ask. Do not edit it.
3. Migrate one component at a time. Each is an independent artifact, so parallelize across worktrees, one owner per component (`skills/principle-separate-before-serializing-shared-state/SKILL.md`). Shared primitives migrate first as a blocking phase.
4. Verify each component against its baseline via image diff on the matching surface. Drive CLIs and TUIs with `exec`. Drive a web UI only with the browser mechanism Devin actually exposes. A nonzero diff is a fail. Investigate the pixel delta. Do not wave it through. Repeat the component until the diff is zero. Bound the retries. Do not pretend the host will wake you later.
5. Stop at merge-ready per component or per safe batch. Do not open a PR unless the user asks.

**Reply:** components migrated, the diff result for each, the baseline harness location, what's left.
